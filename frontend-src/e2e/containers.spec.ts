import { expect, test, type Locator, type Page } from "@playwright/test";
import { lastCall, libraryItem, openDashboard, openGallery } from "./helpers";

/**
 * The layer tree, containers and groups. The Hallway dashboard holds a text, a plain
 * container "Panel" with a rectangle and a circle in it, and a group "Cluster" of two
 * rectangles, all at known places on a 1280 × 800 display.
 */

const DISPLAY = { width: 1280, height: 800 };
const UPDATE = "opendisplay_studio/update_dashboard";

const item = (page: Page, id: string): Locator =>
  page.locator(`.selection[data-item-id="${id}"]`);
const row = (page: Page, id: string): Locator =>
  page.locator(`.layer-row[data-item-id="${id}"]`);
const rowNames = (page: Page) => page.locator(".layer-row strong");

const centerOf = async (locator: Locator) => {
  const box = await locator.boundingBox();
  if (!box) throw new Error("The element is not visible");
  return { x: box.x + box.width / 2, y: box.y + box.height / 2, box };
};

/** A point on the display, in page coordinates. */
const displayPoint = async (page: Page, x: number, y: number) => {
  const canvas = await page.locator(".canvas").boundingBox();
  if (!canvas) throw new Error("The canvas is not visible");
  return {
    x: canvas.x + (x / DISPLAY.width) * canvas.width,
    y: canvas.y + (y / DISPLAY.height) * canvas.height,
  };
};

const dragBetween = async (
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number }
) => {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await page.mouse.up();
};

interface SavedItem {
  id: string;
  name: string;
  kind: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  grouped?: boolean;
  background?: Record<string, unknown> | null;
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

const find = (items: SavedItem[], id: string): SavedItem | undefined => {
  for (const candidate of items) {
    if (candidate.id === id) return candidate;
    const inside = find(candidate.children ?? [], id);
    if (inside) return inside;
  }
  return undefined;
};

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1100 });
  await openGallery(page);
  await openDashboard(page, "Hallway overview");
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
});

test.describe("the layer tree", () => {
  test("starts with the root, and shows containers with their child count and groups with a badge", async ({
    page,
  }) => {
    await expect(page.locator(".root-row")).toContainText("Root (3 widgets)");
    await expect(row(page, "panel")).toContainText("(2)");
    await expect(row(page, "panel")).not.toContainText("Group");
    await expect(row(page, "cluster")).toContainText("(2)");
    await expect(row(page, "cluster").locator(".badge")).toHaveText("Group");
  });

  test("counts every element in the header, nested ones included", async ({
    page,
  }) => {
    await expect(page.locator("ods-structure .count")).toHaveText("7");
  });

  test("lists the top item first, and the children of a container right below it", async ({
    page,
  }) => {
    await expect(rowNames(page)).toHaveText([
      "Cluster",
      "Right",
      "Left",
      "Panel",
      "Dot",
      "Chip",
      "Reading",
    ]);
    await expect(row(page, "panel")).toHaveAttribute("data-depth", "0");
    await expect(row(page, "chip")).toHaveAttribute("data-depth", "1");
  });

  test("closes and opens a container with its chevron", async ({ page }) => {
    await page.getByRole("button", { name: "Collapse Panel" }).click();

    await expect(row(page, "chip")).toHaveCount(0);
    await expect(row(page, "dot")).toHaveCount(0);
    await expect(page.locator("ods-structure .count")).toHaveText("7");

    await page.getByRole("button", { name: "Expand Panel" }).click();
    await expect(row(page, "chip")).toBeVisible();
  });

  test("filters by name or type, keeping the containers above a match", async ({
    page,
  }) => {
    await page.getByRole("searchbox", { name: "Search layers" }).fill("chip");

    await expect(rowNames(page)).toHaveText(["Panel", "Chip"]);

    await page.getByRole("searchbox", { name: "Search layers" }).fill("zzz");
    await expect(rowNames(page)).toHaveCount(0);
  });

  test("opens the containers above an element that is selected on the canvas", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Collapse Panel" }).click();
    await expect(row(page, "chip")).toHaveCount(0);

    await item(page, "chip").click({ position: { x: 4, y: 4 } });

    await expect(row(page, "chip")).toBeVisible();
    await expect(row(page, "chip")).toHaveClass(/active/);
  });

  test("scrolls to the row of an element selected on the canvas", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1500, height: 720 });
    await item(page, "reading").click();
    for (let copy = 0; copy < 8; copy += 1) {
      await page.keyboard.press("Control+d");
    }
    await expect(row(page, "reading")).not.toBeInViewport();

    await item(page, "reading").click({ position: { x: 2, y: 2 } });

    await expect(row(page, "reading")).toBeInViewport();
  });

  test("walks with the arrow keys, folding and unfolding with left and right", async ({
    page,
  }) => {
    await row(page, "reading").click();

    await page.keyboard.press("ArrowUp");
    await expect(row(page, "chip")).toHaveClass(/active/);

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowUp");
    await expect(row(page, "panel")).toHaveClass(/active/);

    await page.keyboard.press("ArrowLeft");
    await expect(row(page, "chip")).toHaveCount(0);
    await page.keyboard.press("ArrowRight");
    await expect(row(page, "chip")).toBeVisible();
  });

  test("renames an element with F2", async ({ page }) => {
    await row(page, "reading").click();
    await row(page, "reading").focus();

    await page.keyboard.press("F2");
    await page
      .getByRole("textbox", { name: "Element name" })
      .fill("Thermometer");
    await page.keyboard.press("Enter");

    await expect(row(page, "reading").locator("strong")).toHaveText(
      "Thermometer"
    );
    expect(find(await saved(page), "reading")?.name).toBe("Thermometer");
  });

  test("offers grouping on containers and groups from the row", async ({
    page,
  }) => {
    await row(page, "panel").hover();
    await expect(
      page.getByRole("button", { name: "Make group Panel" })
    ).toBeVisible();

    await row(page, "cluster").hover();
    await expect(
      page.getByRole("button", { name: "Ungroup Cluster" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Enter group Cluster" })
    ).toBeVisible();
  });

  test("hides and deletes a container with everything in it", async ({
    page,
  }) => {
    await row(page, "panel").hover();
    await page.getByRole("button", { name: "Hide Panel" }).click();
    await expect(row(page, "panel")).toHaveClass(/is-hidden/);

    await page.getByRole("button", { name: "Delete Panel" }).click();
    await expect(page.getByRole("dialog")).toContainText("everything in it");
    await page.getByRole("button", { name: "Delete element" }).click();

    await expect(row(page, "chip")).toHaveCount(0);
    await expect(page.locator("ods-structure .count")).toHaveText("4");
    await page.keyboard.press("Control+z");
    await expect(row(page, "chip")).toBeVisible();
  });
});

test.describe("containers", () => {
  test("come from the library at 100 × 100 with a white fill and a black outline", async ({
    page,
  }) => {
    await libraryItem(page, "Container").click();

    await expect(
      page.getByRole("heading", { name: "container_3", exact: true })
    ).toBeVisible();
    await expect(
      page.locator(".selection.selected .selection-size")
    ).toHaveText("100 × 100");
    const items = await saved(page);
    expect(items.find((entry) => entry.name === "container_3")).toMatchObject({
      kind: "container",
      grouped: false,
      background: { fill: "white", outline: "black", width: 1, radius: 0 },
    });
  });

  test("let their children be selected directly, and outline the container while one is", async ({
    page,
  }) => {
    await item(page, "chip").click({ position: { x: 4, y: 4 } });

    await expect(item(page, "chip")).toHaveClass(/selected/);
    await expect(item(page, "panel")).toHaveClass(/holds-selection/);
    await expect(
      page.getByRole("heading", { name: "Chip", exact: true })
    ).toBeVisible();
  });

  test("take an element dropped from the library, at the place it was dropped", async ({
    page,
  }) => {
    const source = await centerOf(libraryItem(page, "Circle"));
    const target = await displayPoint(page, 1000, 300);

    await dragBetween(page, source, target);

    const panel = find(await saved(page), "panel");
    expect(panel?.children).toHaveLength(3);
    const dropped = panel?.children?.at(-1);
    expect(dropped?.primitive?.type).toBe("circle");
    // 1000 on the display is 300 into a panel that starts at 700.
    expect(Math.abs(Number(dropped?.primitive?.x) - 300)).toBeLessThan(40);
  });

  test("highlight as the drop target while an element is dragged over them", async ({
    page,
  }) => {
    const reading = await centerOf(item(page, "reading"));
    const over = await displayPoint(page, 1000, 350);
    await page.mouse.move(reading.x, reading.y);
    await page.mouse.down();
    await page.mouse.move(over.x, over.y, { steps: 10 });

    await expect(item(page, "panel")).toHaveClass(/drop-target/);

    await page.mouse.up();
  });

  test("take an element dragged onto them, which keeps its place on the screen", async ({
    page,
  }) => {
    const before = await item(page, "reading").boundingBox();
    const start = await centerOf(item(page, "reading"));
    const inside = await displayPoint(page, 900, 350);

    await dragBetween(page, start, inside);

    await expect(row(page, "reading")).toHaveAttribute("data-depth", "1");
    const after = await item(page, "reading").boundingBox();
    expect(after?.x).toBeGreaterThan((before?.x ?? 0) + 100);
    const panel = find(await saved(page), "panel");
    expect(panel?.children?.map((child) => child.id)).toContain("reading");
  });

  test("release an element dragged out of them, directly above them in the list", async ({
    page,
  }) => {
    const chip = await centerOf(item(page, "chip"));
    const outside = await displayPoint(page, 400, 200);

    await dragBetween(page, chip, outside);

    await expect(row(page, "chip")).toHaveAttribute("data-depth", "0");
    await expect(rowNames(page)).toHaveText([
      "Cluster",
      "Right",
      "Left",
      "Chip",
      "Panel",
      "Dot",
      "Reading",
    ]);
    const items = await saved(page);
    expect(items.map((entry) => entry.id)).toEqual([
      "reading",
      "panel",
      "chip",
      "cluster",
    ]);
  });

  test("move with everything in them when they are dragged", async ({
    page,
  }) => {
    const chipBefore = await item(page, "chip").boundingBox();
    const panel = await centerOf(item(page, "panel"));
    // Grab the panel by an empty spot, away from its children.
    const grab = { x: panel.box.x + panel.box.width - 8, y: panel.box.y + 8 };

    await dragBetween(page, grab, { x: grab.x - 120, y: grab.y + 60 });

    const chipAfter = await item(page, "chip").boundingBox();
    expect((chipAfter?.x ?? 0) - (chipBefore?.x ?? 0)).toBeLessThan(-80);
    expect((chipAfter?.y ?? 0) - (chipBefore?.y ?? 0)).toBeGreaterThan(30);
    const items = await saved(page);
    expect(find(items, "chip")?.primitive?.x_start).toBe(40);
  });

  test("take an element dropped on their row in the tree", async ({ page }) => {
    const handle = row(page, "reading").locator("strong");
    const source = await centerOf(handle);
    const target = await centerOf(row(page, "panel"));

    await page.mouse.move(source.x, source.y);
    await page.mouse.down();
    await page.mouse.move(target.x, target.y, { steps: 8 });
    await expect(row(page, "panel")).toHaveClass(/drop-inside/);
    await page.mouse.up();

    await expect(row(page, "reading")).toHaveAttribute("data-depth", "1");
  });

  test("keep an element dropped above or below one of their rows inside them", async ({
    page,
  }) => {
    const handle = row(page, "reading").locator("strong");
    const source = await centerOf(handle);
    const chip = await centerOf(row(page, "chip"));
    const box = chip.box;

    await page.mouse.move(source.x, source.y);
    await page.mouse.down();
    await page.mouse.move(chip.x, box.y + 2, { steps: 8 });
    await expect(row(page, "chip")).toHaveClass(/drop-before/);
    await page.mouse.up();

    await expect(row(page, "reading")).toHaveAttribute("data-depth", "1");
    await expect(rowNames(page)).toHaveText([
      "Cluster",
      "Right",
      "Left",
      "Panel",
      "Dot",
      "Reading",
      "Chip",
    ]);
  });

  test("cannot be dropped into themselves in the tree", async ({ page }) => {
    const handle = row(page, "panel").locator("strong");
    const source = await centerOf(handle);
    const child = await centerOf(row(page, "chip"));

    await page.mouse.move(source.x, source.y);
    await page.mouse.down();
    await page.mouse.move(child.x, child.y, { steps: 8 });

    await expect(row(page, "chip")).not.toHaveClass(/drop-/);
    await page.mouse.up();
    await expect(row(page, "panel")).toHaveAttribute("data-depth", "0");
  });
});

test.describe("the properties of a container", () => {
  test("offer its box relative to its parent, and a background to edit", async ({
    page,
  }) => {
    await row(page, "panel").click();

    await expect(page.getByLabel("X", { exact: true })).toHaveValue("700");
    await expect(page.getByLabel("Width", { exact: true })).toHaveValue("400");
    await expect(page.getByLabel("Outline width")).toHaveValue("2");
    await expect(page.getByLabel("Background", { exact: true })).toBeChecked();
  });

  test("show a child's position inside its container, and move it from there", async ({
    page,
  }) => {
    await row(page, "chip").click();

    await expect(page.getByLabel("X", { exact: true })).toHaveValue("40");

    await page.getByLabel("X", { exact: true }).fill("60");
    await page.getByLabel("X", { exact: true }).press("Tab");

    const chip = find(await saved(page), "chip");
    expect(chip?.primitive?.x_start).toBe(60);
  });

  test("change the background of a plain container, or remove it", async ({
    page,
  }) => {
    await row(page, "panel").click();

    await page.getByLabel("Outline width").fill("5");
    await page.getByLabel("Outline width").press("Tab");
    await page.getByLabel("Background", { exact: true }).uncheck();

    const panel = find(await saved(page), "panel");
    expect(panel?.background).toBeNull();
  });

  test("have no background to edit once they are groups", async ({ page }) => {
    await row(page, "cluster").click();

    await expect(page.getByLabel("Outline width")).toHaveCount(0);
    await expect(page.getByText("Grouped")).toBeVisible();
  });
});

test.describe("selecting several elements", () => {
  test("adds and removes elements with Shift and shows one box around them", async ({
    page,
  }) => {
    await item(page, "reading").click();
    await item(page, "chip").click({
      modifiers: ["Shift"],
      position: { x: 4, y: 4 },
    });

    await expect(page.locator(".selection.selected")).toHaveCount(2);
    await expect(page.locator(".multi-selection")).toBeVisible();
    await expect(page.locator("[data-resize-handle]")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "2 elements" })
    ).toBeVisible();

    await item(page, "chip").click({
      modifiers: ["Shift"],
      position: { x: 4, y: 4 },
    });
    await expect(page.locator(".selection.selected")).toHaveCount(1);
    await expect(page.locator(".multi-selection")).toHaveCount(0);
  });

  test("selects what a marquee touches on empty canvas", async ({ page }) => {
    const from = await displayPoint(page, 20, 20);
    const to = await displayPoint(page, 620, 120);

    await dragBetween(page, from, to);

    await expect(page.locator(".selection.selected")).toHaveCount(1);
    await expect(item(page, "reading")).toHaveClass(/selected/);
  });

  test("selects a container and a group as one element with a marquee", async ({
    page,
  }) => {
    const from = await displayPoint(page, 60, 460);
    const to = await displayPoint(page, 760, 700);

    await dragBetween(page, from, to);

    await expect(item(page, "cluster")).toHaveClass(/selected/);
    await expect(item(page, "left")).not.toHaveClass(/selected/);
  });

  test("moves together, and is one undo step", async ({ page }) => {
    await item(page, "reading").click();
    await item(page, "left").click({
      modifiers: ["Shift"],
      position: { x: 6, y: 6 },
    });
    const readingBefore = await item(page, "reading").boundingBox();
    const clusterBefore = await item(page, "cluster").boundingBox();
    const start = await centerOf(item(page, "reading"));

    await dragBetween(page, start, { x: start.x + 60, y: start.y + 30 });

    const readingAfter = await item(page, "reading").boundingBox();
    const clusterAfter = await item(page, "cluster").boundingBox();
    const dxReading = (readingAfter?.x ?? 0) - (readingBefore?.x ?? 0);
    const dxCluster = (clusterAfter?.x ?? 0) - (clusterBefore?.x ?? 0);
    expect(dxReading).toBeGreaterThan(40);
    expect(Math.abs(dxReading - dxCluster)).toBeLessThan(2);

    await page.keyboard.press("Control+z");
    const restored = await item(page, "cluster").boundingBox();
    expect(restored?.x).toBeCloseTo(clusterBefore?.x ?? 0, 0);
  });

  test("hides and locks all of them at once, and deletes them after confirmation", async ({
    page,
  }) => {
    await item(page, "reading").click();
    await item(page, "left").click({
      modifiers: ["Shift"],
      position: { x: 6, y: 6 },
    });

    await page.getByRole("button", { name: "Remove elements" }).click();

    await expect(page.getByRole("dialog")).toContainText("Delete 2 elements?");
    await page.getByRole("button", { name: "Delete element" }).click();
    await expect(row(page, "reading")).toHaveCount(0);
    await expect(row(page, "cluster")).toHaveCount(0);
  });

  test("leaves the selection when the root row is clicked", async ({
    page,
  }) => {
    await item(page, "reading").click();

    await page.locator(".root-row").click();

    await expect(page.locator(".selection.selected")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "Dashboard", exact: true })
    ).toBeVisible();
  });
});

test.describe("groups", () => {
  test("are made from a selection with Ctrl+G, around the box of its members", async ({
    page,
  }) => {
    await item(page, "reading").click();
    await item(page, "panel").click({
      modifiers: ["Shift"],
      position: { x: 5, y: 5 },
    });

    await page.keyboard.press("Control+g");

    const items = await saved(page);
    const group = items.find(
      (entry) => entry.grouped && entry.id !== "cluster"
    );
    expect(group?.children?.map((child) => child.id)).toEqual([
      "reading",
      "panel",
    ]);
    expect(group?.background).toBeNull();
    await expect(page.locator(".selection.selected.group")).toHaveCount(1);
  });

  test("turn a plain container into a group, without its background", async ({
    page,
  }) => {
    await row(page, "panel").click();

    await page.keyboard.press("Control+g");

    const panel = find(await saved(page), "panel");
    expect(panel).toMatchObject({ grouped: true, background: null });
    await expect(row(page, "panel").locator(".badge")).toHaveText("Group");
  });

  test("give a container back, with its background, when it was one before it became a group", async ({
    page,
  }) => {
    await row(page, "panel").click();
    await page.keyboard.press("Control+g");
    await expect(row(page, "panel").locator(".badge")).toHaveText("Group");

    await page.keyboard.press("Control+Shift+g");

    await expect(row(page, "panel")).toHaveCount(1);
    await expect(row(page, "panel").locator(".badge")).toHaveCount(0);
    await expect(row(page, "chip")).toHaveAttribute("data-depth", "1");
    const panel = find(await saved(page), "panel");
    expect(panel).toMatchObject({
      grouped: false,
      background: { fill: "white", outline: "black", width: 2 },
    });
  });

  test("are dissolved with Ctrl+Shift+G, leaving the members where they were", async ({
    page,
  }) => {
    const before = await item(page, "left").boundingBox();
    await row(page, "cluster").click();

    await page.keyboard.press("Control+Shift+g");

    await expect(row(page, "cluster")).toHaveCount(0);
    await expect(row(page, "left")).toHaveAttribute("data-depth", "0");
    const after = await item(page, "left").boundingBox();
    expect(after).toEqual(before);
    await expect(page.locator(".selection.selected")).toHaveCount(2);
  });

  test("are selected as a whole when one of their children is clicked", async ({
    page,
  }) => {
    await item(page, "left").click({ position: { x: 6, y: 6 } });

    await expect(item(page, "cluster")).toHaveClass(/selected/);
    await expect(item(page, "left")).not.toHaveClass(/selected/);
    await expect(page.getByText("Enter / double-click to edit")).toBeVisible();
    await expect(
      item(page, "cluster").locator("[data-resize-handle]")
    ).toHaveCount(8);
  });

  test("move as a whole when a child is dragged", async ({ page }) => {
    const before = await item(page, "right").boundingBox();
    const start = await centerOf(item(page, "left"));

    await dragBetween(page, start, { x: start.x + 50, y: start.y + 20 });

    const after = await item(page, "right").boundingBox();
    expect((after?.x ?? 0) - (before?.x ?? 0)).toBeGreaterThan(30);
    const group = find(await saved(page), "cluster");
    expect(group?.children?.map((child) => child.primitive?.x_start)).toEqual([
      0, 200,
    ]);
  });

  test("scale everything in them when they are resized", async ({ page }) => {
    await item(page, "left").click({ position: { x: 6, y: 6 } });
    const handle = item(page, "cluster").locator('[data-resize-handle="se"]');
    const start = await centerOf(handle);

    await dragBetween(page, start, { x: start.x + 60, y: start.y + 30 });

    const items = await saved(page);
    const group = find(items, "cluster");
    const right = find(items, "right");
    const factor = (group?.width ?? 400) / 400;
    expect(factor).toBeGreaterThan(1.1);
    expect(
      Math.abs(Number(right?.primitive?.x_start) - 200 * factor)
    ).toBeLessThanOrEqual(1);
    expect(Number(right?.primitive?.x_end)).toBeGreaterThan(359);
  });

  test("are entered with Enter, edited child by child, and left with Escape", async ({
    page,
  }) => {
    await item(page, "left").click({ position: { x: 6, y: 6 } });

    await page.keyboard.press("Enter");

    await expect(page.locator(".breadcrumb")).toContainText("Root");
    await expect(page.locator(".breadcrumb")).toContainText("Cluster");
    await expect(item(page, "cluster")).toHaveClass(/entered/);

    await item(page, "left").click({ position: { x: 6, y: 6 } });
    await expect(item(page, "left")).toHaveClass(/selected/);

    await page.keyboard.press("Escape");
    await expect(page.locator(".breadcrumb")).toHaveCount(0);
    await expect(item(page, "cluster")).toHaveClass(/selected/);
  });

  test("are entered by a double click, and left with the Exit button", async ({
    page,
  }) => {
    await item(page, "left").dblclick({ position: { x: 6, y: 6 } });

    await expect(page.locator(".breadcrumb")).toBeVisible();

    await page.getByRole("button", { name: "Exit", exact: true }).click();
    await expect(page.locator(".breadcrumb")).toHaveCount(0);
  });

  test("are left when something outside them is selected", async ({ page }) => {
    await item(page, "left").dblclick({ position: { x: 6, y: 6 } });

    await item(page, "reading").click();

    await expect(page.locator(".breadcrumb")).toHaveCount(0);
  });
});
