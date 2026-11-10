import { expect, test, type Locator, type Page } from "@playwright/test";
import { lastCall, openGallery } from "./helpers";

/** The basic editor: choose it when a dashboard is created, cut the screen, fill the regions. */

const createBasicDashboard = async (page: Page, name: string) => {
  await page
    .getByRole("button", { name: "New dashboard", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "New dashboard" });
  await dialog.getByRole("radio", { name: /Basic/ }).click();
  await dialog.getByRole("radio", { name: /Custom size/ }).click();
  await dialog.getByRole("textbox", { name: "Dashboard name" }).fill(name);
  await dialog.getByRole("button", { name: "Create dashboard" }).click();
  await expect(page.locator("ods-region-layer")).toBeVisible();
};

const setNumber = async (page: Page, label: string, value: string) => {
  const field = page
    .locator("ods-layout-panel")
    .getByRole("spinbutton", { name: label });
  await field.fill(value);
  await field.press("Enter");
};

const cell = (page: Page, row: number, column: number) =>
  page.getByRole("button", {
    name: `Cell in row ${row} and column ${column}`,
  });

test.beforeEach(async ({ page }) => {
  await openGallery(page);
});

test("a new dashboard is advanced unless the basic editor is chosen", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "New dashboard", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "New dashboard" });

  await expect(dialog.getByRole("radio", { name: /Advanced/ })).toBeChecked();
  await expect(dialog.getByRole("radio", { name: /Basic/ })).not.toBeChecked();
});

test("the basic editor starts with a grid of four cells and no structure tree", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");

  await expect(page.locator("ods-region-layer .cell")).toHaveCount(4);
  await expect(page.locator("ods-structure")).toHaveCount(0);
  await expect(page.locator(".arrange-bar")).toHaveCount(0);
  await expect(page.locator("ods-zoom-bar").getByText("Fit")).toBeVisible();
});

test("changing the columns and rows redraws the grid", async ({ page }) => {
  await createBasicDashboard(page, "Basic board");

  await setNumber(page, "Columns", "3");
  await setNumber(page, "Rows", "2");

  await expect(page.locator("ods-region-layer .cell")).toHaveCount(6);
});

test("two clicks join the cells between them into one region, and a double click removes it", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");

  await cell(page, 1, 1).click();
  await cell(page, 1, 2).click();

  await expect(page.locator("ods-region-layer .outline")).toHaveCount(3);

  await cell(page, 1, 1).dblclick();

  await expect(page.locator("ods-region-layer .outline")).toHaveCount(4);
});

test("a joined region cannot be cut by another one", async ({ page }) => {
  await createBasicDashboard(page, "Basic board");
  await setNumber(page, "Columns", "3");
  await cell(page, 1, 1).click();
  await cell(page, 1, 2).click();
  const regions = page.locator("ods-region-layer .outline");
  const before = await regions.count();

  await cell(page, 1, 2).click();
  await cell(page, 1, 3).hover();
  await expect(page.getByRole("status")).toContainText("cut a region in two");
  await cell(page, 1, 3).click();

  await expect(regions).toHaveCount(before);
});

test("a widget is put into a region and its properties show on the right", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await page.getByRole("button", { name: "Widgets", exact: true }).click();

  await expect(page.locator("ods-library .catalog-item").first()).toBeVisible();
  await expect(page.locator("ods-library")).not.toContainText("Rectangle");
  await page.locator("ods-region-layer .slot").nth(1).click();
  await page
    .locator("ods-library .catalog-item")
    .filter({ hasText: "Sensor card" })
    .click();

  await expect(page.locator("ods-region-layer .slot-label")).toHaveCount(1);
  await expect(page.locator("ods-inspector")).toContainText("sensor-card_1");
  await expect(page.locator("ods-inspector")).not.toContainText("Layout");
});

test("the dashboard is saved as basic, with its layout and the region of each widget", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await page.getByRole("button", { name: "Widgets", exact: true }).click();
  await page
    .locator("ods-library .catalog-item")
    .filter({ hasText: "Sensor card" })
    .click();
  await page.getByRole("button", { name: "Save", exact: true }).click();

  const saved = await page.evaluate(() => window.__ODS_E2E__.dashboards());
  const dashboard = saved.find((item) => item.name === "Basic board");

  expect(dashboard?.mode).toBe("basic");
  expect(dashboard?.layout?.regions).toHaveLength(4);
  expect(dashboard?.items).toHaveLength(1);
  expect(lastCall(page, "opendisplay_studio/update_dashboard")).toBeTruthy();
});

test("the gallery marks each dashboard as basic or advanced", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();

  const card = (name: string) =>
    page.locator("ods-dashboard-card").filter({ hasText: name });
  await expect(card("Basic board")).toContainText("Basic");
  await expect(card("Kitchen display")).toContainText("Advanced");
});

test("a basic dashboard reopens in the basic editor", async ({ page }) => {
  await createBasicDashboard(page, "Basic board");
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();

  await page
    .getByRole("button", { name: "Open dashboard Basic board" })
    .click();

  await expect(page.locator("ods-region-layer")).toBeVisible();
  await expect(page.locator("ods-structure")).toHaveCount(0);
});

/** The letter on each region, with where the region lies, left to right then top to bottom. */
const lettersOnRegions = (page: Page) =>
  page.locator("ods-region-layer .outline").evaluateAll((outlines) =>
    outlines
      .map((outline) => ({
        letter: outline.querySelector(".letter")?.textContent ?? "",
        left: Math.round(outline.getBoundingClientRect().left),
        top: Math.round(outline.getBoundingClientRect().top),
      }))
      .sort((a, b) => a.left - b.left || a.top - b.top)
      .map((region) => region.letter)
  );

const join = async (
  page: Page,
  from: [number, number],
  to: [number, number]
) => {
  await cell(page, ...from).click();
  await cell(page, ...to).click();
};

test("regions are lettered in the order they were made", async ({ page }) => {
  await createBasicDashboard(page, "Basic board");
  await setNumber(page, "Columns", "4");

  await join(page, [1, 1], [1, 2]);
  await join(page, [2, 1], [2, 2]);
  await join(page, [1, 3], [2, 3]);
  await join(page, [1, 4], [2, 4]);

  // Read from the left: the two wide regions, then the two tall ones.
  expect(await lettersOnRegions(page)).toEqual(["A", "B", "C", "D"]);
});

test("a region made later does not take the letter of an earlier one", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await setNumber(page, "Columns", "4");

  await join(page, [1, 3], [2, 3]);
  await join(page, [1, 1], [1, 2]);

  // The tall region was made first, so it is A even though it lies to the right.
  const letters = await page
    .locator("ods-region-layer .outline")
    .evaluateAll((outlines) =>
      outlines.map((outline) => ({
        letter: outline.querySelector(".letter")?.textContent,
        size: outline.querySelector(".size")?.textContent?.trim(),
      }))
    );
  expect(letters.slice(0, 2)).toEqual([
    { letter: "A", size: "1×2 region" },
    { letter: "B", size: "2×1 region" },
  ]);
});

test("a double click removes a region and frees its cells", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await join(page, [1, 1], [1, 2]);
  await expect(page.locator("ods-region-layer .outline")).toHaveCount(3);

  await cell(page, 1, 1).dblclick();

  await expect(page.locator("ods-region-layer .outline")).toHaveCount(4);
});

test("a region as wide as the grid is removed by a double click too", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await setNumber(page, "Columns", "4");
  await setNumber(page, "Rows", "1");
  await join(page, [1, 1], [1, 4]);
  await expect(page.locator("ods-region-layer .outline")).toHaveCount(1);
  await expect(page.locator("ods-region-layer .size")).toHaveText("4×1 region");

  await cell(page, 1, 3).dblclick();

  await expect(page.locator("ods-region-layer .outline")).toHaveCount(4);
});

test("a region can be of any size, a tall one beside a square one and single cells", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await setNumber(page, "Columns", "4");
  await setNumber(page, "Rows", "4");

  await join(page, [1, 1], [4, 1]);
  await join(page, [1, 2], [2, 3]);

  const sizes = await page.locator("ods-region-layer .size").allTextContents();
  const joined = sizes.map((size) => size.trim());
  expect(joined.slice(0, 2)).toEqual(["1×4 region", "2×2 region"]);
  expect(joined.slice(2).every((size) => size === "1×1 region")).toBe(true);
  expect(joined).toHaveLength(2 + 4 + 4);
});

test("the layout panel has the grid and the padding, and the snap size is gone", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  const panel = page.locator("ods-layout-panel");

  for (const label of ["Columns", "Rows", "Gap", "Outer padding"]) {
    await expect(panel.getByRole("spinbutton", { name: label })).toBeVisible();
  }
  await expect(page.locator("ods-inspector")).not.toContainText("Snap size");
  await expect(page.locator("ods-inspector")).not.toContainText(
    "Outer padding"
  );

  const padding = panel.getByRole("spinbutton", { name: "Outer padding" });
  await padding.fill("20");
  await padding.press("Enter");

  await expect(page.locator(".workspace-meta")).toContainText("Padding 20px");
});

const addWidgetToFirstRegion = async (page: Page) => {
  await page.getByRole("button", { name: "Widgets", exact: true }).click();
  await page
    .locator("ods-library .catalog-item")
    .filter({ hasText: "Sensor card" })
    .click();
  await expect(page.locator("ods-region-layer .slot.selected")).toHaveCount(1);
};

const borderStyleOf = (locator: Locator) =>
  locator.evaluate((element) => getComputedStyle(element).borderTopStyle);

test("a click beside the regions lets go of the selected one", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await addWidgetToFirstRegion(page);
  await expect(page.locator("ods-inspector")).toContainText("sensor-card_1");

  await page.locator(".canvas-stage").click({ position: { x: 20, y: 20 } });

  await expect(page.locator("ods-region-layer .slot.selected")).toHaveCount(0);
  await expect(page.locator("ods-inspector")).not.toContainText(
    "sensor-card_1"
  );
  await expect(page.locator("ods-inspector")).toContainText("Dashboard");
});

test("an empty region selected is let go of the same way", async ({ page }) => {
  await createBasicDashboard(page, "Basic board");
  await page.getByRole("button", { name: "Widgets", exact: true }).click();
  await page.locator("ods-region-layer .slot").nth(2).click();
  await expect(page.locator("ods-region-layer .slot.selected")).toHaveCount(1);

  await page.locator(".canvas-stage").click({ position: { x: 20, y: 20 } });

  await expect(page.locator("ods-region-layer .slot.selected")).toHaveCount(0);
});

test("only empty regions are drawn with a dashed border", async ({ page }) => {
  await createBasicDashboard(page, "Basic board");
  await addWidgetToFirstRegion(page);
  await page.locator(".canvas-stage").click({ position: { x: 20, y: 20 } });
  await page.mouse.move(5, 5);

  const slots = page.locator("ods-region-layer .slot");
  await expect(slots.nth(0)).toHaveClass(/slot(?!.*empty)/);
  expect(await borderStyleOf(slots.nth(0))).toBe("none");
  expect(await borderStyleOf(slots.nth(1))).toBe("dashed");
});

test("a selected region with a widget is outlined, so its picture stays in view", async ({
  page,
}) => {
  await createBasicDashboard(page, "Basic board");
  await addWidgetToFirstRegion(page);

  const selected = page.locator("ods-region-layer .slot.selected");
  expect(await borderStyleOf(selected)).toBe("solid");
  const tint = await selected.evaluate(
    (element) => getComputedStyle(element).backgroundColor
  );
  expect(tint).toBe("rgba(0, 0, 0, 0)");
});
