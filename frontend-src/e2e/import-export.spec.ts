import { expect, test, type Page } from "@playwright/test";
import {
  lastCall,
  libraryItem,
  openKitchen,
  withoutRandomUuid,
} from "./helpers";

/** Exporting a dashboard to a JSON file and importing a file into the open dashboard. */

interface DashboardFile {
  format: string;
  version: number;
  dashboard: {
    name: string;
    display: Record<string, unknown>;
    items: Array<{ primitive?: Record<string, unknown> }>;
  };
}

test.beforeEach(async ({ page }) => {
  await withoutRandomUuid(page);
  await openKitchen(page);
});

const exportFile = async (page: Page): Promise<DashboardFile> => {
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export", exact: true }).click();
  const saved = await download;
  expect(saved.suggestedFilename()).toBe("kitchen-display.json");
  const stream = await saved.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf-8"));
};

const importFile = async (page: Page, content: string) => {
  const chooser = page.waitForEvent("filechooser");
  await page.getByRole("button", { name: "Import", exact: true }).click();
  await (
    await chooser
  ).setFiles({
    name: "dashboard.json",
    mimeType: "application/json",
    buffer: Buffer.from(content),
  });
};

const dialog = (page: Page) => page.locator("ods-import-dialog");

const sentItems = async (page: Page) => {
  const call = await lastCall(page, "opendisplay_studio/compose_preview");
  return (
    call as { dashboard: { items: Array<{ primitive?: { fill?: string } }> } }
  ).dashboard.items;
};

test("export downloads the design as a JSON file without what belongs to the device", async ({
  page,
}) => {
  const file = await exportFile(page);

  expect(file.format).toBe("opendisplay-studio-dashboard");
  expect(file.version).toBe(1);
  expect(file.dashboard.name).toBe("Kitchen display");
  expect(file.dashboard.display).not.toHaveProperty("deviceId");
  expect(file.dashboard.items.length).toBeGreaterThan(0);
});

test("importing a file asks first, then replaces the elements in one undo step", async ({
  page,
}) => {
  await libraryItem(page, "Circle").click();
  const exported = await exportFile(page);
  await page.getByRole("button", { name: "Undo" }).click();
  const layers = page.locator(".layer-row");
  const before = await layers.count();

  await importFile(page, JSON.stringify(exported));

  await expect(dialog(page)).toContainText("replaces the elements");
  await expect(dialog(page).locator("[data-source-color]")).toHaveCount(0);
  await dialog(page).getByRole("button", { name: "Import" }).click();
  await expect(dialog(page)).toHaveCount(0);
  await expect(layers).toHaveCount(before + 1);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect(layers).toHaveCount(before);
});

test("cancelling the import changes nothing", async ({ page }) => {
  const exported = await exportFile(page);
  const before = await page.locator(".layer-row").count();

  await importFile(page, JSON.stringify(exported));
  await dialog(page).getByRole("button", { name: "Cancel" }).click();

  await expect(dialog(page)).toHaveCount(0);
  await expect(page.locator(".layer-row")).toHaveCount(before);
});

test("a file that is not JSON, or not a dashboard, is refused with a message", async ({
  page,
}) => {
  await importFile(page, "this is not json");
  await expect(page.getByText("The file is not a JSON file")).toBeVisible();

  await importFile(page, JSON.stringify({ hello: "world" }));
  await expect(page.getByText("This is not a dashboard file")).toBeVisible();
  await expect(dialog(page)).toHaveCount(0);
});

test("colors the dashboard's palette lacks are mapped, and the rest are kept", async ({
  page,
}) => {
  await libraryItem(page, "Rectangle").click();
  const exported = await exportFile(page);
  const rectangle = exported.dashboard.items.at(-1)?.primitive;
  if (!rectangle) throw new Error("The exported rectangle is missing");
  // Kitchen display is made for black, white and red; green is not one of them.
  rectangle.fill = "green";
  rectangle.outline = "black";

  await importFile(page, JSON.stringify(exported));

  const rows = dialog(page).locator("[data-source-color]");
  await expect(dialog(page)).toContainText("another set of colors");
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toHaveAttribute("data-source-color", "green");

  await dialog(page).getByRole("button", { name: "Import" }).click();
  await expect(dialog(page)).toHaveCount(0);

  // The preview is composed again a moment after the change.
  await expect
    .poll(async () => (await sentItems(page)).at(-1)?.primitive?.fill)
    .toBe("black");
});
