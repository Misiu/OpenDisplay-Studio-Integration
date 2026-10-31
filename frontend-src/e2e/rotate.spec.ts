import { expect, test, type Page } from "@playwright/test";
import { libraryItem, openKitchen } from "./helpers";

/**
 * A primitive is turned by dragging the round handle above its frame, or by typing the
 * angle. The frame turns with it; the handles that resize an upright box are gone.
 */

const rotationField = (page: Page) =>
  page.getByRole("spinbutton", { name: "Rotation", exact: true });

const selection = (page: Page) => page.locator(".selection.selected");

const rotateHandle = (page: Page) =>
  selection(page).locator("[data-rotate-handle]");

/** The middle of the selected item's frame on screen, which is where it turns about. */
const frameCenter = async (page: Page) => {
  const box = await selection(page).boundingBox();
  if (!box) throw new Error("Nothing is selected");
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

interface Turn {
  /** Degrees clockwise from straight up, where the pointer ends. */
  degrees: number;
  shift?: boolean;
}

/** Take the rotate handle and carry the pointer round to the given angle. */
const dragRotateHandle = async (page: Page, { degrees, shift }: Turn) => {
  const center = await frameCenter(page);
  const handle = await rotateHandle(page).boundingBox();
  if (!handle) throw new Error("The rotate handle is not visible");
  const radius = 120;
  const radians = (degrees * Math.PI) / 180;
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2
  );
  await page.mouse.down();
  if (shift) await page.keyboard.down("Shift");
  await page.mouse.move(
    center.x + radius * Math.sin(radians),
    center.y - radius * Math.cos(radians),
    { steps: 12 }
  );
  if (shift) await page.keyboard.up("Shift");
  await page.mouse.up();
};

const turnOf = async (page: Page) =>
  Number((await rotationField(page).inputValue()) || 0);

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await openKitchen(page);
  await libraryItem(page, "Rectangle").click();
});

test("an upright primitive has a rotate handle and the eight resize handles", async ({
  page,
}) => {
  await expect(rotateHandle(page)).toBeVisible();
  await expect(selection(page).locator("[data-resize-handle]")).toHaveCount(8);
  expect(await rotationField(page).inputValue()).toBe("");
});

test("dragging the rotate handle round to the right turns it a quarter", async ({
  page,
}) => {
  await dragRotateHandle(page, { degrees: 90 });

  expect(await turnOf(page)).toBeGreaterThan(86);
  expect(await turnOf(page)).toBeLessThan(94);
});

test("dragging it round to the left turns it the other way", async ({
  page,
}) => {
  await dragRotateHandle(page, { degrees: -90 });

  expect(await turnOf(page)).toBeLessThan(-86);
  expect(await turnOf(page)).toBeGreaterThan(-94);
});

test("the frame turns with the item", async ({ page }) => {
  await dragRotateHandle(page, { degrees: 90 });

  await expect(selection(page)).toHaveClass(/turned/);
  await expect(selection(page)).toHaveAttribute(
    "style",
    /transform: rotate\(\d+deg\)/
  );
});

test("Shift snaps the turn to steps of 15 degrees", async ({ page }) => {
  await dragRotateHandle(page, { degrees: 52, shift: true });

  expect(await turnOf(page)).toBe(45);
});

test("a turned primitive loses the resize handles but keeps the rotate handle", async ({
  page,
}) => {
  await dragRotateHandle(page, { degrees: 30 });

  await expect(selection(page).locator("[data-resize-handle]")).toHaveCount(0);
  await expect(rotateHandle(page)).toBeVisible();
});

test("turning it back to upright brings the resize handles back", async ({
  page,
}) => {
  await rotationField(page).fill("40");
  await rotationField(page).press("Enter");
  await expect(selection(page).locator("[data-resize-handle]")).toHaveCount(0);

  await rotationField(page).fill("");
  await rotationField(page).press("Enter");

  await expect(selection(page).locator("[data-resize-handle]")).toHaveCount(8);
});

test("the whole turn is one step of the history", async ({ page }) => {
  await dragRotateHandle(page, { degrees: 90 });
  expect(await turnOf(page)).not.toBe(0);

  await page.getByRole("button", { name: "Undo" }).click();

  expect(await rotationField(page).inputValue()).toBe("");
  await expect(selection(page)).not.toHaveClass(/turned/);
});

test("Escape puts the item back as it was", async ({ page }) => {
  const center = await frameCenter(page);
  const handle = await rotateHandle(page).boundingBox();
  if (!handle) throw new Error("The rotate handle is not visible");
  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(center.x + 120, center.y, { steps: 8 });
  expect(await turnOf(page)).not.toBe(0);

  await page.keyboard.press("Escape");
  await page.mouse.up();

  expect(await rotationField(page).inputValue()).toBe("");
});

test("typing an angle turns the frame about its middle", async ({ page }) => {
  const before = await frameCenter(page);

  await rotationField(page).fill("45");
  await rotationField(page).press("Enter");

  await expect(selection(page)).toHaveClass(/turned/);
  const after = await frameCenter(page);
  expect(after.x).toBeCloseTo(before.x, 0);
  expect(after.y).toBeCloseTo(before.y, 0);
});

test("a container has no rotate handle", async ({ page }) => {
  await libraryItem(page, "Container").click();

  await expect(selection(page)).toBeVisible();
  await expect(rotateHandle(page)).toHaveCount(0);
});
