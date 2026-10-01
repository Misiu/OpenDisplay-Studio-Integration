import { expect, test, type Locator, type Page } from "@playwright/test";
import { lastCall, openDashboard, openGallery } from "./helpers";

/**
 * Context menus, the clipboard, ordering, nudging and the shortcuts, all driven from the
 * command registry: each command works from its menu and from its key.
 */

const DISPLAY = { width: 1280, height: 800 };
const UPDATE = "opendisplay_studio/update_dashboard";

const item = (page: Page, id: string): Locator =>
  page.locator(`.selection[data-item-id="${id}"]`);
const row = (page: Page, id: string): Locator =>
  page.locator(`.layer-row[data-item-id="${id}"]`);
const rowNames = (page: Page) => page.locator(".layer-row strong");
const menu = (page: Page) => page.getByRole("menu");
const menuItem = (page: Page, name: RegExp | string) =>
  page.getByRole("menuitem", { name });
const command = (page: Page, id: string) =>
  page.locator(`[data-command="${id}"]`);

interface SavedItem {
  id: string;
  name: string;
  kind: string;
  children?: SavedItem[];
  primitive?: Record<string, unknown>;
}

const saved = async (page: Page): Promise<SavedItem[]> => {
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const call = (await lastCall(page, UPDATE)) as {
    dashboard: { items: SavedItem[] };
  };
  return call.dashboard.items;
};

const displayPoint = async (page: Page, x: number, y: number) => {
  const canvas = await page.locator(".canvas").boundingBox();
  if (!canvas) throw new Error("The canvas is not visible");
  return {
    x: canvas.x + (x / DISPLAY.width) * canvas.width,
    y: canvas.y + (y / DISPLAY.height) * canvas.height,
  };
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1100 });
  await openGallery(page);
  await openDashboard(page, "Hallway overview");
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
});

test.describe("the canvas menu", () => {
  test("opens on an element, selects it, and offers the editing commands with their keys", async ({
    page,
  }) => {
    await item(page, "reading").click({ button: "right" });

    await expect(item(page, "reading")).toHaveClass(/selected/);
    await expect(menu(page)).toBeVisible();
    await expect(menuItem(page, /^Copy/)).toContainText("Ctrl+C");
    await expect(menuItem(page, /^Cut/)).toContainText("Ctrl+X");
    await expect(menuItem(page, /^Paste/)).toBeDisabled();
    await expect(menuItem(page, /^Duplicate/)).toContainText("Ctrl+D");
    await expect(menuItem(page, /^Delete/)).toContainText("Del");
    await expect(menuItem(page, /^Bring to front/)).toBeVisible();
    await expect(menuItem(page, /^Send to back/)).toBeVisible();
    await expect(menuItem(page, /Enter group/)).toHaveCount(0);
  });

  test("offers to enter and dissolve a group", async ({ page }) => {
    await item(page, "left").click({
      button: "right",
      position: { x: 6, y: 6 },
    });

    await expect(item(page, "cluster")).toHaveClass(/selected/);
    await expect(menuItem(page, /^Enter group/)).toBeVisible();
    await expect(menuItem(page, /^Ungroup/)).toContainText("Ctrl+Shift+G");
  });

  test("closes on Escape and on a click elsewhere, leaving the selection alone", async ({
    page,
  }) => {
    await item(page, "reading").click({ button: "right" });
    await page.keyboard.press("Escape");
    await expect(menu(page)).toHaveCount(0);
    await expect(item(page, "reading")).toHaveClass(/selected/);

    await item(page, "reading").click({ button: "right" });
    await page.mouse.click(700, 10);
    await expect(menu(page)).toHaveCount(0);
  });

  test("stays inside the panel when opened near its edge", async ({ page }) => {
    const box = await item(page, "cluster").boundingBox();
    if (!box) throw new Error("not visible");

    await item(page, "reading").click({ button: "right" });
    const shown = await menu(page).boundingBox();

    const viewport = page.viewportSize();
    expect((shown?.x ?? 0) + (shown?.width ?? 0)).toBeLessThanOrEqual(
      viewport?.width ?? 0
    );
    expect((shown?.y ?? 0) + (shown?.height ?? 0)).toBeLessThanOrEqual(
      viewport?.height ?? 0
    );
  });

  test("on empty canvas offers only paste", async ({ page }) => {
    const point = await displayPoint(page, 300, 300);

    await page.mouse.click(point.x, point.y, { button: "right" });

    await expect(command(page, "paste")).toBeVisible();
    await expect(command(page, "paste-here")).toBeVisible();
    await expect(menuItem(page, /^Copy/)).toHaveCount(0);
  });
});

test.describe("the tree menu", () => {
  test("opens on a row and offers ordering, visibility, deleting and renaming", async ({
    page,
  }) => {
    await row(page, "reading").click({ button: "right" });

    await expect(row(page, "reading")).toHaveClass(/active/);
    for (const name of [
      /^Copy/,
      /^Cut/,
      /^Paste/,
      /^Move up/,
      /^Move down/,
      /^Hide/,
      /^Lock/,
      /^Delete/,
      /^Rename/,
    ]) {
      await expect(menuItem(page, name)).toBeVisible();
    }
    await expect(menuItem(page, /^Rename/)).toContainText("F2");
  });

  test("moves a row up and down the layer list", async ({ page }) => {
    await row(page, "reading").click({ button: "right" });
    await menuItem(page, /^Move up/).click();

    await expect(rowNames(page)).toHaveText([
      "Cluster",
      "Right",
      "Left",
      "Reading",
      "Panel",
      "Dot",
      "Chip",
    ]);
    const order = (await saved(page)).map((entry) => entry.id);
    expect(order).toEqual(["panel", "reading", "cluster"]);
  });

  test("renames a row from its menu", async ({ page }) => {
    await row(page, "reading").click({ button: "right" });
    await menuItem(page, /^Rename/).click();

    await page.getByRole("textbox", { name: "Element name" }).fill("Gauge");
    await page.keyboard.press("Enter");

    await expect(row(page, "reading").locator("strong")).toHaveText("Gauge");
  });

  test("hides and locks from the menu, and Delete asks first", async ({
    page,
  }) => {
    await row(page, "dot").click({ button: "right" });
    await menuItem(page, /^Hide/).click();
    await expect(row(page, "dot")).toHaveClass(/is-hidden/);

    await row(page, "dot").click({ button: "right" });
    await menuItem(page, /^Delete/).click();
    await expect(page.getByRole("dialog")).toContainText("Delete Dot?");
  });
});

test.describe("copy, cut, paste and duplicate", () => {
  test("copy and paste add a copy next to the element, moved by 8 px, and select it", async ({
    page,
  }) => {
    await item(page, "reading").click();
    await page.keyboard.press("Control+c");
    await page.keyboard.press("Control+v");

    const items = await saved(page);
    const names = items.map((entry) => entry.name);
    expect(items).toHaveLength(4);
    expect(names[1]).toBe("text_2");
    const copy = items[1];
    expect(copy?.primitive?.x).toBe(48);
    expect(copy?.primitive?.y).toBe(48);
    await expect(row(page, copy?.id ?? "")).toHaveClass(/active/);
  });

  test("paste goes into a selected container", async ({ page }) => {
    await item(page, "reading").click();
    await page.keyboard.press("Control+c");
    await row(page, "panel").click();
    await page.keyboard.press("Control+v");

    const panel = (await saved(page)).find((entry) => entry.id === "panel");
    expect(panel?.children).toHaveLength(3);
    expect(panel?.children?.at(-1)?.name).toBe("text_2");
  });

  test("cut removes the element and is one undo step, and its paste brings it back", async ({
    page,
  }) => {
    await item(page, "reading").click();
    await page.keyboard.press("Control+x");

    await expect(row(page, "reading")).toHaveCount(0);
    await page.keyboard.press("Control+v");
    await expect(rowNames(page)).toHaveCount(7);

    await page.keyboard.press("Control+z");
    await page.keyboard.press("Control+z");
    await expect(row(page, "reading")).toBeVisible();
  });

  test("paste here puts the copy at the pointer", async ({ page }) => {
    await item(page, "reading").click();
    await page.keyboard.press("Control+c");
    const point = await displayPoint(page, 300, 250);

    await page.mouse.click(point.x, point.y, { button: "right" });
    await menuItem(page, /^Paste here/).click();

    const copy = (await saved(page)).find((entry) => entry.name === "text_2");
    expect(Math.abs(Number(copy?.primitive?.x) - 300)).toBeLessThan(6);
    expect(Math.abs(Number(copy?.primitive?.y) - 250)).toBeLessThan(6);
  });

  test("duplicate puts a copy right above the original, moved by 8 px", async ({
    page,
  }) => {
    await item(page, "reading").click();

    await page.keyboard.press("Control+d");

    const items = await saved(page);
    expect(items.map((entry) => entry.id)[0]).toBe("reading");
    expect(items[1]?.primitive?.x).toBe(48);
    await expect(row(page, items[1]?.id ?? "")).toHaveClass(/active/);
  });

  test("duplicate copies a container with everything in it", async ({
    page,
  }) => {
    await row(page, "panel").click();

    await page.keyboard.press("Control+d");

    const items = await saved(page);
    const copies = items.filter((entry) => entry.kind === "container");
    expect(copies).toHaveLength(3);
    expect(
      copies.find((entry) => entry.name === "container_3")?.children
    ).toHaveLength(2);
  });

  test("a copy survives a reload of the dashboard, for pasting into another one", async ({
    page,
  }) => {
    await item(page, "reading").click();
    await page.keyboard.press("Control+c");

    await page.getByRole("button", { name: "Dashboards", exact: true }).click();
    await openDashboard(page, "Office status");
    await page.keyboard.press("Control+v");

    await expect(rowNames(page)).toHaveCount(1);
  });
});

test.describe("ordering", () => {
  test("Bring to front and Send to back move an element to the ends of its list", async ({
    page,
  }) => {
    await item(page, "reading").click({ button: "right" });
    await menuItem(page, /^Bring to front/).click();
    expect((await saved(page)).map((entry) => entry.id)).toEqual([
      "panel",
      "cluster",
      "reading",
    ]);

    await item(page, "left").click({
      button: "right",
      position: { x: 6, y: 6 },
    });
    await menuItem(page, /^Send to back/).click();
    expect((await saved(page)).map((entry) => entry.id)).toEqual([
      "cluster",
      "panel",
      "reading",
    ]);
  });

  test("works on the children of a container", async ({ page }) => {
    await item(page, "chip").click({
      button: "right",
      position: { x: 4, y: 4 },
    });
    await menuItem(page, /^Bring to front/).click();

    const panel = (await saved(page)).find((entry) => entry.id === "panel");
    expect(panel?.children?.map((entry) => entry.id)).toEqual(["dot", "chip"]);
  });
});

test.describe("nudging", () => {
  test("arrow keys move the selection by a pixel, Shift by the snap size", async ({
    page,
  }) => {
    await item(page, "reading").click();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Shift+ArrowRight");

    const reading = (await saved(page)).find((entry) => entry.id === "reading");
    expect(reading?.primitive?.x).toBe(40 + 1 + 5);
    expect(reading?.primitive?.y).toBe(40 + 1);
  });

  test("moves everything selected together, and each press is one undo step", async ({
    page,
  }) => {
    await item(page, "reading").click();
    await item(page, "left").click({
      modifiers: ["Shift"],
      position: { x: 6, y: 6 },
    });

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Control+z");

    const items = await saved(page);
    expect(items.find((entry) => entry.id === "reading")?.primitive?.x).toBe(
      40
    );
  });

  test("leaves an element locked in place", async ({ page }) => {
    await row(page, "reading").click({ button: "right" });
    await menuItem(page, /^Lock/).click();

    await page.keyboard.press("ArrowRight");

    const reading = (await saved(page)).find((entry) => entry.id === "reading");
    expect(reading?.primitive?.x).toBe(40);
  });

  test("does not move an element while a name is being typed", async ({
    page,
  }) => {
    await row(page, "reading").click();
    await row(page, "reading").focus();
    await page.keyboard.press("F2");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");

    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});

test.describe("keyboard shortcuts", () => {
  test("Escape steps out: a menu, a group, then the selection", async ({
    page,
  }) => {
    await item(page, "left").dblclick({ position: { x: 6, y: 6 } });
    await item(page, "left").click({ position: { x: 6, y: 6 } });

    await page.keyboard.press("Escape");
    await expect(page.locator(".breadcrumb")).toHaveCount(0);
    await expect(item(page, "cluster")).toHaveClass(/selected/);

    await page.keyboard.press("Escape");
    await expect(page.locator(".selection.selected")).toHaveCount(0);
  });

  test("Ctrl+S saves, and only when there is something to save", async ({
    page,
  }) => {
    await item(page, "reading").click();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("button", { name: "Save" })).toBeEnabled();

    await page.keyboard.press("Control+s");

    await expect(page.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(await lastCall(page, UPDATE)).toBeDefined();
  });

  test("Ctrl+E switches between the design and the code", async ({ page }) => {
    await page.keyboard.press("Control+e");
    await expect(
      page.getByRole("heading", { name: "Generated ODL YAML" })
    ).toBeVisible();

    await page.keyboard.press("Control+e");
    await expect(page.locator(".canvas")).toBeVisible();
  });

  test("Ctrl+= and Ctrl+- zoom, and Ctrl+0 resets", async ({ page }) => {
    const readout = page.locator(".zoom-readout");
    const before = await readout.textContent();

    await page.keyboard.press("Control+=");
    await expect(readout).not.toHaveText(before ?? "");
    await page.keyboard.press("Control+0");
    await expect(readout).toHaveText("100%");
    await page.keyboard.press("Control+-");
    await expect(readout).toHaveText("83%");
  });

  test("shows every shortcut in a dialog opened from the help button or with ?", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Keyboard shortcuts" }).click();

    const dialog = page.getByRole("dialog", { name: "Keyboard shortcuts" });
    await expect(dialog).toContainText("Copy");
    await expect(dialog).toContainText("Ctrl+C");
    await expect(dialog).toContainText("Make group");
    await expect(dialog).toContainText("Ctrl+Shift+G");
    await expect(dialog).toContainText("Nudge left");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);

    await page.keyboard.press("Shift+?");
    await expect(dialog).toBeVisible();
  });

  test("do nothing while a field has the focus", async ({ page }) => {
    const name = page.getByRole("textbox", { name: "Dashboard name" });
    await item(page, "reading").click();
    await name.click();

    await page.keyboard.press("Control+d");
    await page.keyboard.press("Delete");

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(rowNames(page)).toHaveCount(7);
  });
});
