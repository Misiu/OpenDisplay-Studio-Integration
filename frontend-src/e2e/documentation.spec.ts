import { test, type Locator, type Page } from "@playwright/test";
import path from "node:path";
import { openDashboard } from "./helpers";

/**
 * Takes the pictures of the README's section on commands. It writes into `docs/images`
 * and only runs when asked: `CAPTURE_DOCS=1 npx playwright test e2e/documentation.spec.ts`.
 */
test.skip(!process.env.CAPTURE_DOCS, "writes the pictures of the README");

const IMAGES = path.join(import.meta.dirname, "..", "..", "docs", "images");

const row = (page: Page, id: string): Locator =>
  page.locator(`.layer-row[data-item-id="${id}"]`);

const picture = async (
  page: Page,
  name: string,
  area: Locator,
  margin = 12
) => {
  const box = await area.boundingBox();
  if (!box) throw new Error(`${name}: nothing to take a picture of`);
  await page.screenshot({
    path: path.join(IMAGES, `${name}.png`),
    clip: {
      x: Math.max(0, box.x - margin),
      y: Math.max(0, box.y - margin),
      width: box.width + 2 * margin,
      height: box.height + 2 * margin,
    },
  });
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto("/?icons");
  await openDashboard(page, "Hallway overview");
  await page.getByAltText("Authoritative rendered display preview").waitFor();
});

test("the context menu of a layer in the tree", async ({ page }) => {
  await row(page, "panel").click({ button: "right" });

  await picture(page, "context-menu-tree", page.locator("ods-context-menu"));
});

test("the context menu of an element on the canvas", async ({ page }) => {
  await row(page, "reading").click();
  await page
    .locator('.selection[data-item-id="reading"]')
    .click({ button: "right", position: { x: 6, y: 6 } });

  await picture(page, "context-menu-canvas", page.locator("ods-context-menu"));
});

test("the arrange bar with three elements selected", async ({ page }) => {
  await row(page, "reading").click();
  await row(page, "panel").click({ modifiers: ["Control"] });
  await row(page, "cluster").click({ modifiers: ["Control"] });

  await picture(page, "arrange-bar", page.locator(".arrange-bar"), 4);
});
