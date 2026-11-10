import { test, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { libraryItem, openGallery } from "./helpers";

/**
 * Takes the pictures of the README's section on the basic editor, plain pictures of the
 * panel as it is. It writes into `docs/images` and only runs when asked:
 * `CAPTURE_DOCS=1 WIDGET_PICTURES=<file> npx playwright test e2e/documentation-basic.spec.ts`
 * where the file holds the widgets as the real renderer draws them (widget id → data URL).
 */
test.skip(!process.env.CAPTURE_DOCS, "writes the pictures of the README");

const IMAGES = path.join(import.meta.dirname, "..", "..", "docs", "images");

const widgetPictures = (): Record<string, string> => {
  const file = process.env.WIDGET_PICTURES;
  if (!file) return {};
  return JSON.parse(readFileSync(file, "utf8")).pictures;
};

const picture = async (page: Page, name: string, area?: Locator) => {
  const target = path.join(IMAGES, `${name}.png`);
  if (!area) {
    await page.screenshot({ path: target });
    return;
  }
  const box = await area.boundingBox();
  if (!box) throw new Error(`${name}: nothing to take a picture of`);
  const margin = 12;
  await page.screenshot({
    path: target,
    clip: {
      x: Math.max(0, box.x - margin),
      y: Math.max(0, box.y - margin),
      width: box.width + 2 * margin,
      height: box.height + 2 * margin,
    },
  });
};

const cell = (page: Page, row: number, column: number) =>
  page.getByRole("button", {
    name: `Cell in row ${row} and column ${column}`,
  });

const setNumber = async (page: Page, label: string, value: string) => {
  const field = page
    .locator("ods-layout-panel")
    .getByRole("spinbutton", { name: label });
  await field.fill(value);
  await field.press("Enter");
};

const putWidgetInRegion = async (
  page: Page,
  region: number,
  widget: string
) => {
  await page.locator("ods-region-layer .slot").nth(region).click();
  await libraryItem(page, widget).click();
};

interface SampleDashboard {
  name: string;
  mode: "basic" | "advanced";
  status: "draft" | "ready";
  palette: string;
  background: string;
  size: [number, number];
  rotation?: number;
}

/** Every kind of color scheme there is, so the list shows each way a card can look. */
const SAMPLES: SampleDashboard[] = [
  {
    name: "Kitchen display",
    mode: "advanced",
    status: "ready",
    palette: "bwr",
    background: "white",
    size: [800, 480],
  },
  {
    name: "Living room",
    mode: "basic",
    status: "draft",
    palette: "spectra6",
    background: "white",
    size: [800, 480],
  },
  {
    name: "Night clock",
    mode: "advanced",
    status: "ready",
    palette: "bwr",
    background: "black",
    size: [800, 480],
  },
  {
    name: "Photo frame",
    mode: "basic",
    status: "draft",
    palette: "grayscale16",
    background: "white",
    size: [800, 480],
  },
  {
    name: "Door sign",
    mode: "advanced",
    status: "ready",
    palette: "bw",
    background: "white",
    size: [296, 128],
  },
  {
    name: "Hallway panel",
    mode: "advanced",
    status: "ready",
    palette: "bwr",
    background: "white",
    size: [480, 800],
    rotation: 90,
  },
  {
    name: "Desk plate",
    mode: "basic",
    status: "draft",
    palette: "bw",
    background: "white",
    size: [800, 480],
    rotation: 180,
  },
];

test.beforeEach(async ({ page }) => {
  const pictures = widgetPictures();
  await page.addInitScript((value) => {
    window.__ODS_PROMO__ = { widgetPictures: value };
  }, pictures);
  await page.setViewportSize({ width: 1440, height: 900 });
  await openGallery(page);
});

test("the list of dashboards", async ({ page }) => {
  await page.addInitScript((samples) => {
    const dashboards = samples.map((sample, index) => ({
      id: `sample-${index}`,
      schemaVersion: 1,
      name: sample.name,
      mode: sample.mode,
      status: sample.status,
      language: "en",
      display: {
        profileId: "custom",
        width: sample.size[0],
        height: sample.size[1],
        palette: sample.palette,
        background: sample.background,
        padding: 0,
        snapSize: 5,
        rotation: sample.rotation ?? 0,
        deviceId: null,
      },
      items: [],
      createdAt: "2026-09-20T10:00:00+00:00",
      updatedAt: `2026-09-${24 - index}T10:00:00+00:00`,
    }));
    window.__ODS_PROMO__ = { dashboards: dashboards as never };
  }, SAMPLES);
  await page.reload();
  await page.getByText("Night clock").waitFor();

  await picture(page, "basic-gallery");
});

test("the basic editor, step by step", async ({ page }) => {
  await page
    .getByRole("button", { name: "New dashboard", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "New dashboard" });
  await dialog.getByRole("radio", { name: /Basic/ }).click();
  await dialog.getByRole("radio", { name: /Custom size/ }).click();
  await dialog
    .getByRole("textbox", { name: "Dashboard name" })
    .fill("Living room");
  await picture(page, "basic-new-dashboard", dialog);
  await dialog.getByRole("button", { name: "Create dashboard" }).click();
  await page.locator("ods-region-layer").waitFor();

  await setNumber(page, "Columns", "3");
  await setNumber(page, "Rows", "2");
  await picture(page, "basic-grid");

  await cell(page, 1, 1).click();
  await cell(page, 1, 2).hover();
  await picture(page, "basic-join");
  await cell(page, 1, 2).click();
  await cell(page, 2, 2).click();
  await cell(page, 2, 3).click();
  await cell(page, 1, 1).click();
  await page.keyboard.press("Escape");
  // Leave the keyboard focus ring and the pointer out of the picture.
  await page.locator(".canvas-stage").click({ position: { x: 20, y: 20 } });
  await page.mouse.move(5, 5);
  await picture(page, "basic-regions");

  await page.getByRole("button", { name: "Widgets", exact: true }).click();
  await picture(page, "basic-widgets-empty");
  await putWidgetInRegion(page, 0, "Weather");
  await putWidgetInRegion(page, 1, "Calendar");
  await putWidgetInRegion(page, 2, "Thermometer");
  await putWidgetInRegion(page, 3, "Gauge");
  await page.locator("ods-region-layer .slot").nth(0).click();
  await picture(page, "basic-widgets");
  // A click beside the regions lets go of the selection: what is left is the picture itself.
  await page.locator(".canvas-stage").click({ position: { x: 20, y: 20 } });
  await page.mouse.move(5, 5);
  await picture(page, "basic-result");
});

/** The regions of a fine grid, as pairs of corner cells (row, column) joined in this order. */
const MANY_REGIONS: Array<[[number, number], [number, number]]> = [
  [
    [1, 1],
    [2, 2],
  ],
  [
    [1, 3],
    [1, 6],
  ],
  [
    [2, 3],
    [2, 4],
  ],
  [
    [2, 5],
    [4, 5],
  ],
  [
    [2, 6],
    [3, 6],
  ],
  [
    [3, 1],
    [3, 4],
  ],
  [
    [4, 1],
    [4, 2],
  ],
];

test("a grid with as many regions as you like", async ({ page }) => {
  await page
    .getByRole("button", { name: "New dashboard", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "New dashboard" });
  await dialog.getByRole("radio", { name: /Basic/ }).click();
  await dialog.getByRole("radio", { name: /Custom size/ }).click();
  await dialog
    .getByRole("textbox", { name: "Dashboard name" })
    .fill("Control room");
  await dialog.getByRole("button", { name: "Create dashboard" }).click();
  await page.locator("ods-region-layer").waitFor();

  await setNumber(page, "Columns", "6");
  await setNumber(page, "Rows", "4");
  for (const [from, to] of MANY_REGIONS) {
    await cell(page, ...from).click();
    await cell(page, ...to).click();
  }
  await page.getByRole("button", { name: "Widgets", exact: true }).click();
  await page.locator(".canvas-stage").click({ position: { x: 20, y: 20 } });
  await page.mouse.move(5, 5);
  await picture(page, "basic-many-regions");
});

test("the new dashboard dialog, with the display turned", async ({ page }) => {
  await page
    .getByRole("button", { name: "New dashboard", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "New dashboard" });
  await dialog
    .getByRole("textbox", { name: "Dashboard name" })
    .fill("Hallway panel");
  await dialog.getByRole("button", { name: "Turn 90° to the right" }).click();
  // Wait for the turn to settle: it leans back, swings round and comes to rest.
  await page.waitForTimeout(1200);
  await picture(page, "new-dashboard", dialog);
});
