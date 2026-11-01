import { expect, test, type Page } from "@playwright/test";
import { lastCall, libraryItem, openKitchen } from "./helpers";

/**
 * A gauge or a thermometer is colored in as many ranges as the user adds: each has a start
 * and a color, and the first needs no start.
 */

const ranges = (page: Page) => page.locator("ods-ranges-field .range");

const addRange = (page: Page) =>
  page.getByRole("button", { name: "Add range" });

const startOf = (page: Page, index: number) =>
  ranges(page).nth(index).getByRole("spinbutton", { name: "From" });

/** The section of the inspector that holds the ranges, opened and scrolled to. */
const openRanges = async (page: Page) => {
  const section = page.locator("details.inspector-section", {
    has: page.locator("summary", { hasText: /Ranges/ }),
  });
  await section.scrollIntoViewIfNeeded();
  if ((await section.getAttribute("open")) === null) {
    await section.locator("summary").click();
  }
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await openKitchen(page);
  await libraryItem(page, "Gauge").click();
  await openRanges(page);
});

test("a new gauge has no ranges and offers to add one", async ({ page }) => {
  await expect(ranges(page)).toHaveCount(0);
  await expect(addRange(page)).toBeVisible();
});

test("the user adds as many ranges as wanted", async ({ page }) => {
  await addRange(page).click();
  await addRange(page).click();
  await addRange(page).click();

  await expect(ranges(page)).toHaveCount(3);
});

test("only the first range may have no start; the others wait for one", async ({
  page,
}) => {
  await addRange(page).click();
  await addRange(page).click();

  await expect(ranges(page).nth(0)).not.toHaveClass(/idle/);
  await expect(ranges(page).nth(1)).toHaveClass(/idle/);

  await startOf(page, 1).fill("40");
  await startOf(page, 1).press("Enter");

  await expect(ranges(page).nth(1)).not.toHaveClass(/idle/);
});

test("a start that was typed is kept", async ({ page }) => {
  await addRange(page).click();
  await addRange(page).click();
  await startOf(page, 1).fill("0.4");
  await startOf(page, 1).press("Enter");

  await expect(startOf(page, 1)).toHaveValue("0.4");
});

test("a range can be removed", async ({ page }) => {
  await addRange(page).click();
  await addRange(page).click();

  await page.getByRole("button", { name: "Remove range 1" }).click();

  await expect(ranges(page)).toHaveCount(1);
});

test("there is a limit to the ranges, and then adding is turned off", async ({
  page,
}) => {
  for (let count = 0; count < 8; count += 1) await addRange(page).click();

  await expect(ranges(page)).toHaveCount(8);
  await expect(addRange(page)).toBeDisabled();
});

test("a thermometer has ranges too", async ({ page }) => {
  await libraryItem(page, "Thermometer").click();
  await openRanges(page);

  await addRange(page).click();

  await expect(ranges(page)).toHaveCount(1);
});

test("the start, the color and the remove button of a range are level", async ({
  page,
}) => {
  await addRange(page).click();
  const row = ranges(page).nth(0);

  const start = await row.locator("ods-property-field").boundingBox();
  const color = await row.locator("[data-value-field='color']").boundingBox();
  const remove = await row
    .getByRole("button", { name: "Remove range 1" })
    .boundingBox();
  if (!start || !color || !remove) throw new Error("A control is missing");

  const middle = (box: { y: number; height: number }) => box.y + box.height / 2;
  expect(Math.abs(middle(start) - middle(color))).toBeLessThan(1);
  expect(Math.abs(middle(color) - middle(remove))).toBeLessThan(1);
  expect(Math.abs(start.height - color.height)).toBeLessThan(1);
});

test("a color has no label of its own above it, only the one for assistive technology", async ({
  page,
}) => {
  await addRange(page).click();

  await expect(ranges(page).nth(0).locator(".field-label")).toHaveCount(0);
  await expect(
    ranges(page).nth(0).getByRole("button", { name: "Color" })
  ).toBeVisible();
});

test("the ranges do not make the panel scroll sideways", async ({ page }) => {
  await addRange(page).click();
  await addRange(page).click();

  const overflow = await page
    .locator("ods-inspector")
    .evaluate((element) => element.scrollWidth - element.clientWidth);

  expect(overflow).toBeLessThanOrEqual(0);
});

interface SavedWidget {
  kind: string;
  name: string;
  widget?: {
    options: { ranges?: Array<{ from: number | null; color: string }> };
  };
}

/** The ranges of the widget called `gauge_1`, as they are written when the dashboard is saved. */
const savedRanges = async (page: Page) => {
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const call = (await lastCall(
    page,
    "opendisplay_studio/update_dashboard"
  )) as {
    dashboard: { items: SavedWidget[] };
  };
  const gauge = call.dashboard.items.find((item) => item.name === "gauge_1");
  return gauge?.widget?.options.ranges;
};

test("the ranges are saved with the dashboard, in the colors of the display", async ({
  page,
}) => {
  await addRange(page).click();
  await addRange(page).click();
  await startOf(page, 1).fill("40");
  await startOf(page, 1).press("Enter");

  const saved = await savedRanges(page);

  expect(saved).toHaveLength(2);
  expect(saved?.[0].from).toBeNull();
  expect(saved?.[1].from).toBe(40);
  expect(new Set(saved?.map((range) => range.color)).size).toBe(2);
});

test("removing a range removes it from what is saved", async ({ page }) => {
  await addRange(page).click();
  await addRange(page).click();
  await page.getByRole("button", { name: "Remove range 2" }).click();

  expect(await savedRanges(page)).toHaveLength(1);
});
