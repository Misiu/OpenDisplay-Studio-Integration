import { expect, test, type Locator, type Page } from "@playwright/test";
import { libraryItem, openDashboard, openGallery } from "./helpers";

/**
 * The arrange bar under the canvas toolbar: align, space out evenly and stack the
 * selection. The Hallway dashboard is a 1280 × 800 display; the rectangles of these tests
 * are added from the library and placed with the fields of the inspector.
 */

const bar = (page: Page) =>
  page.getByRole("toolbar", { name: "Arrange the selection" });
const button = (page: Page, name: string): Locator =>
  bar(page).getByRole("button", { name, exact: true });

const row = (page: Page, name: string): Locator =>
  page.locator(".layer-row").filter({
    has: page.locator("strong", { hasText: new RegExp(`^${name}$`) }),
  });

const field = (page: Page, label: string): Locator =>
  page.getByRole("spinbutton", { name: label, exact: true });

/** Puts the selected rectangle at a place with a size, as a person would type it. */
const place = async (
  page: Page,
  box: { x: number; y: number; width: number; height: number }
) => {
  for (const [label, value] of [
    ["Width", box.width],
    ["Height", box.height],
    ["X", box.x],
    ["Y", box.y],
  ] as const) {
    await field(page, label).fill(String(value));
    await field(page, label).press("Tab");
  }
};

/** The position and size of the rectangle with that layer name, as the fields show it. */
const geometryOf = async (page: Page, name: string) => {
  await row(page, name).click();
  const read = async (label: string) =>
    Number(await field(page, label).inputValue());
  return {
    x: await read("X"),
    y: await read("Y"),
    width: await read("Width"),
    height: await read("Height"),
  };
};

const FIRST_NEW_RECTANGLE = 4;

/** Adds three rectangles of different sizes and leaves nothing selected. */
const addRectangles = async (page: Page): Promise<string[]> => {
  const boxes = [
    { x: 100, y: 100, width: 100, height: 60 },
    { x: 300, y: 260, width: 200, height: 100 },
    { x: 900, y: 150, width: 150, height: 40 },
  ];
  const names: string[] = [];
  for (const [index, box] of boxes.entries()) {
    await libraryItem(page, "Rectangle").click();
    // The Hallway dashboard already holds rectangle_1 to rectangle_3.
    names.push(`rectangle_${index + FIRST_NEW_RECTANGLE}`);
    await place(page, box);
  }
  await page.locator(".root-row").click();
  return names;
};

/** The box of an element on the canvas, found through the id its layer row carries. */
const canvasBox = async (page: Page, name: string): Promise<Locator> => {
  const id = await row(page, name).getAttribute("data-item-id");
  return page.locator(`.selection[data-item-id="${id}"]`);
};

const selectWithCtrl = async (page: Page, names: string[]) => {
  await row(page, names[0]).click();
  for (const name of names.slice(1)) {
    await row(page, name).click({ modifiers: ["Control"] });
  }
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1100 });
  await openGallery(page);
  await openDashboard(page, "Hallway overview");
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
});

test.describe("the arrange bar", () => {
  test("is always there, and nothing on it works while nothing is selected", async ({
    page,
  }) => {
    await expect(bar(page)).toBeVisible();

    for (const name of [
      "Align left edges",
      "Align centers vertically",
      "Space out evenly, left to right",
      "Bring to front",
      "Send to back",
    ]) {
      await expect(button(page, name)).toBeDisabled();
    }
  });

  test("sits below the undo, pan, grid and snap controls", async ({ page }) => {
    const history = await page
      .getByRole("button", { name: /^Undo/ })
      .boundingBox();
    const arrange = await bar(page).boundingBox();
    if (!history || !arrange) throw new Error("A toolbar is not visible");

    expect(arrange.y).toBeGreaterThan(history.y + history.height - 1);
  });

  test("enables the stacking buttons for one item, and aligning only to the parent", async ({
    page,
  }) => {
    const names = await addRectangles(page);
    await row(page, names[0]).click();

    await expect(button(page, "Bring to front")).toBeEnabled();
    await expect(button(page, "Move down")).toBeEnabled();
    await expect(button(page, "Align left edges")).toBeDisabled();
    await expect(
      button(page, "Space out evenly, left to right")
    ).toBeDisabled();

    await bar(page)
      .getByRole("button", {
        name: "Align to the container or the working area",
      })
      .click();

    await expect(button(page, "Align left edges")).toBeEnabled();
    await expect(
      button(page, "Space out evenly, left to right")
    ).toBeDisabled();
  });

  test("enables aligning for two items and spacing out for three", async ({
    page,
  }) => {
    const names = await addRectangles(page);

    await selectWithCtrl(page, names.slice(0, 2));
    await expect(button(page, "Align left edges")).toBeEnabled();
    await expect(
      button(page, "Space out evenly, left to right")
    ).toBeDisabled();

    await row(page, names[2]).click({ modifiers: ["Control"] });
    await expect(button(page, "Space out evenly, left to right")).toBeEnabled();
    await expect(button(page, "Space out evenly, top to bottom")).toBeEnabled();
  });
});

test.describe("selecting with Ctrl", () => {
  test("the first click selects, the second deselects", async ({ page }) => {
    const names = await addRectangles(page);
    await row(page, names[0]).click();

    await row(page, names[1]).click({ modifiers: ["Control"] });
    await expect(page.locator(".selection.selected")).toHaveCount(2);

    await row(page, names[1]).click({ modifiers: ["Control"] });
    await expect(page.locator(".selection.selected")).toHaveCount(1);
  });

  test("works on the canvas as well", async ({ page }) => {
    const names = await addRectangles(page);
    await row(page, names[0]).click();

    const second = await canvasBox(page, names[1]);
    await second.click({ modifiers: ["Control"], position: { x: 6, y: 6 } });
    await expect(page.locator(".selection.selected")).toHaveCount(2);

    await second.click({ modifiers: ["Control"], position: { x: 6, y: 6 } });
    await expect(page.locator(".selection.selected")).toHaveCount(1);
  });
});

test.describe("aligning", () => {
  test("puts the left edges of the selection on one line, in one undo step", async ({
    page,
  }) => {
    const names = await addRectangles(page);
    await selectWithCtrl(page, names);

    await button(page, "Align left edges").click();

    for (const name of names) {
      expect((await geometryOf(page, name)).x).toBe(100);
    }
    await selectWithCtrl(page, names);
    await page.getByRole("button", { name: /^Undo/ }).click();
    expect((await geometryOf(page, names[1])).x).toBe(300);
    expect((await geometryOf(page, names[2])).x).toBe(900);
  });

  test("centres the items on a horizontal line", async ({ page }) => {
    const names = await addRectangles(page);
    await selectWithCtrl(page, names);

    await button(page, "Align centers vertically").click();

    // The selection spans y 100..360, so its middle is 230.
    const middles = [];
    for (const name of names) {
      const geometry = await geometryOf(page, name);
      middles.push(geometry.y + geometry.height / 2);
    }
    expect(middles).toEqual([230, 230, 230]);
  });

  test("puts one item in the middle of the working area", async ({ page }) => {
    const names = await addRectangles(page);
    await row(page, names[0]).click();
    await bar(page)
      .getByRole("button", {
        name: "Align to the container or the working area",
      })
      .click();

    await button(page, "Align centers horizontally").click();

    expect((await geometryOf(page, names[0])).x).toBe(590);
  });
});

test.describe("spacing out", () => {
  test("makes the gaps between three items equal and keeps the outer ones", async ({
    page,
  }) => {
    const names = await addRectangles(page);
    await selectWithCtrl(page, names);

    await button(page, "Space out evenly, left to right").click();

    const [first, middle, last] = [
      await geometryOf(page, names[0]),
      await geometryOf(page, names[1]),
      await geometryOf(page, names[2]),
    ];
    expect(first.x).toBe(100);
    expect(last.x + last.width).toBe(1050);
    // 950 wide, 450 taken by the items: two gaps of 250.
    expect(middle.x - (first.x + first.width)).toBe(250);
    expect(last.x - (middle.x + middle.width)).toBe(250);
  });

  test("does nothing, and records nothing, when the gaps are already equal", async ({
    page,
  }) => {
    const names = await addRectangles(page);
    await selectWithCtrl(page, names);
    await button(page, "Space out evenly, left to right").click();
    await selectWithCtrl(page, names);

    await button(page, "Space out evenly, left to right").click();
    await page.getByRole("button", { name: /^Undo/ }).click();

    // The second press changed nothing, so one undo undoes the first.
    expect((await geometryOf(page, names[1])).x).toBe(300);
  });

  test("makes a column from three items with the vertical button", async ({
    page,
  }) => {
    const names = await addRectangles(page);
    await selectWithCtrl(page, names);

    await button(page, "Space out evenly, top to bottom").click();

    // Ordered by their place from the top, whatever order they were created in.
    const column = [
      await geometryOf(page, names[0]),
      await geometryOf(page, names[1]),
      await geometryOf(page, names[2]),
    ].sort((first, second) => first.y - second.y);
    expect(column[0].y).toBe(100);
    // 260 high, 200 taken by the items: two gaps of 30.
    expect(column[1].y - (column[0].y + column[0].height)).toBe(30);
    expect(column[2].y - (column[1].y + column[1].height)).toBe(30);
    expect(column[2].y + column[2].height).toBe(360);
  });
});

test.describe("stacking", () => {
  test("brings the selection to the front from the bar", async ({ page }) => {
    const names = await addRectangles(page);
    await row(page, names[0]).click();

    await button(page, "Bring to front").click();

    await expect(page.locator(".layer-row strong").first()).toHaveText(
      names[0]
    );
  });
});
