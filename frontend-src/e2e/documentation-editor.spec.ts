import { test, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { openDashboard } from "./helpers";

/**
 * Takes the plain pictures of the editor in the README: the panel as it is, at one size, with
 * what the real renderer drew on the canvas. It writes into `docs/images` and only runs when
 * asked:
 * `CAPTURE_DOCS=1 SCENES=<file> npx playwright test e2e/documentation-editor.spec.ts`
 * where the file holds the scenes: each a dashboard, its picture with the margin the editor
 * shows, its ODL and the measured bounds of its elements.
 */
test.skip(!process.env.CAPTURE_DOCS, "writes the pictures of the README");

const IMAGES = path.join(import.meta.dirname, "..", "..", "docs", "images");

interface Scene {
  dashboard: { id: string; name: string };
  image: string;
  margin: number;
  yaml: string;
  bounds: Record<string, unknown>;
}

const scenes = (): Record<string, Scene> => {
  const file = process.env.SCENES;
  if (!file) throw new Error("SCENES names the file the scenes are in");
  return JSON.parse(readFileSync(file, "utf8"));
};

const row = (page: Page, id: string): Locator =>
  page.locator(`.layer-row[data-item-id="${id}"]`);

const openScene = async (page: Page, sceneId: string) => {
  const scene = scenes()[sceneId];
  await page.addInitScript((value) => {
    window.__ODS_PROMO__ = {
      dashboards: [value.dashboard as never],
      images: { [value.dashboard.id]: value.image },
      yamls: { [value.dashboard.id]: value.yaml },
      margin: value.margin,
      bounds: value.bounds as never,
    };
  }, scene);
  await page.setViewportSize({ width: 1500, height: 960 });
  await page.goto("/?icons");
  await openDashboard(page, scene.dashboard.name);
  await page.getByAltText("Authoritative rendered display preview").waitFor();
  // The view fits the display a moment after the picture is there.
  await page.waitForTimeout(400);
};

const picture = async (page: Page, name: string) => {
  // Keep the pointer, and so any hover, out of the picture.
  await page.mouse.move(5, 5);
  await page.screenshot({ path: path.join(IMAGES, `${name}.png`) });
};

const select = async (page: Page, id: string) => {
  await row(page, id).click();
  await page.locator(`.selection[data-item-id="${id}"]`).waitFor();
};

test("the editor with a widget selected", async ({ page }) => {
  await openScene(page, "home");
  await select(page, "forecast");

  await picture(page, "editor-widgets");
});

test("the properties of a widget", async ({ page }) => {
  await openScene(page, "home");
  await select(page, "lounge");

  await picture(page, "widget-properties");
});

test("a QR code among other elements", async ({ page }) => {
  await openScene(page, "data");
  await select(page, "qr-code");

  await picture(page, "primitives");
});

test("the settings of a history plot", async ({ page }) => {
  await openScene(page, "data");
  await select(page, "temperatures");

  await picture(page, "plot-editor");
});

test("the points of a polygon", async ({ page }) => {
  await openScene(page, "shapes");
  await select(page, "zone");

  await picture(page, "polygon-editor");
});

test("the properties of a rounded rectangle", async ({ page }) => {
  await openScene(page, "shapes");
  await select(page, "card");

  await picture(page, "properties");
});

test("the toolbar after an element is moved", async ({ page }) => {
  await openScene(page, "shapes");
  await select(page, "card");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Control+z");
  await page.mouse.move(5, 5);

  const toolbar = page.locator(".workspace-meta");
  const box = await toolbar.boundingBox();
  if (!box) throw new Error("undo-redo: no toolbar");
  await page.screenshot({
    path: path.join(IMAGES, "undo-redo.png"),
    clip: { x: box.x, y: box.y, width: box.width, height: box.height },
  });
});

test("the generated ODL", async ({ page }) => {
  await openScene(page, "shapes");
  await page.getByRole("button", { name: "Code", exact: true }).click();
  await page.locator("ods-code-view").waitFor({ state: "attached" });
  await page.waitForTimeout(400);

  await picture(page, "code-view");
});
