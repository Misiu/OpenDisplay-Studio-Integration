import { expect, test, type Page } from "@playwright/test";
import { libraryItem, openKitchen } from "./helpers";

/**
 * Elements can be moved off the canvas, so they can be resized past its edge too, as far as
 * an element may reach beyond the display and no farther.
 */

const displaySize = async (page: Page) => {
  const text = await page.locator(".workspace-meta span").first().innerText();
  const [width, height] = text.match(/\d+/g)?.map(Number) ?? [];
  return { width, height };
};

const numberField = (page: Page, label: string) =>
  page.getByRole("spinbutton", { name: label, exact: true });

const dragHandleTo = async (
  page: Page,
  handle: string,
  x: number,
  y: number
) => {
  const box = await page
    .locator(`.selection.selected [data-resize-handle="${handle}"]`)
    .boundingBox();
  if (!box) throw new Error(`The ${handle} handle is not visible`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(x, y, { steps: 12 });
  await page.mouse.up();
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await openKitchen(page);
  await libraryItem(page, "Rectangle").click();
});

test("a rectangle can be dragged larger than the canvas", async ({ page }) => {
  const display = await displaySize(page);
  const canvas = await page.locator(".canvas").boundingBox();
  if (!canvas) throw new Error("The canvas is not visible");

  await dragHandleTo(
    page,
    "se",
    canvas.x + canvas.width + 120,
    canvas.y + canvas.height + 80
  );

  const right =
    Number(await numberField(page, "X").inputValue()) +
    Number(await numberField(page, "Width").inputValue());
  const bottom =
    Number(await numberField(page, "Y").inputValue()) +
    Number(await numberField(page, "Height").inputValue());
  expect(right).toBeGreaterThan(display.width);
  expect(bottom).toBeGreaterThan(display.height);
});

test("a rectangle is larger than the canvas only up to twice the display", async ({
  page,
}) => {
  const display = await displaySize(page);
  const canvas = await page.locator(".canvas").boundingBox();
  if (!canvas) throw new Error("The canvas is not visible");

  await dragHandleTo(
    page,
    "se",
    canvas.x + canvas.width * 4,
    canvas.y + canvas.height * 4
  );

  expect(
    Number(await numberField(page, "Width").inputValue())
  ).toBeLessThanOrEqual(2 * display.width);
  expect(
    Number(await numberField(page, "Height").inputValue())
  ).toBeLessThanOrEqual(2 * display.height);
});

test("a typed width is not held to the canvas either", async ({ page }) => {
  const display = await displaySize(page);

  await numberField(page, "Width").fill(String(display.width + 100));
  await numberField(page, "Width").press("Tab");

  expect(Number(await numberField(page, "Width").inputValue())).toBe(
    display.width + 100
  );
});

test("an image can be resized larger than the canvas", async ({ page }) => {
  const display = await displaySize(page);
  const canvas = await page.locator(".canvas").boundingBox();
  if (!canvas) throw new Error("The canvas is not visible");
  await libraryItem(page, "Image").click();

  await dragHandleTo(
    page,
    "se",
    canvas.x + canvas.width + 150,
    canvas.y + canvas.height + 100
  );

  expect(Number(await numberField(page, "Width").inputValue())).toBeGreaterThan(
    display.width
  );
});
