import { expect, test, type Locator, type Page } from "@playwright/test";
import type { Dashboard } from "../src/types";

const editorPosition = async (page: Page) => {
  const canvas = await page.locator(".canvas").boundingBox();
  if (!canvas) throw new Error("Canvas is not visible");
  return {
    canvas,
    transform: await page.locator(".canvas-viewport").getAttribute("style"),
    windowScrollY: await page.evaluate(() => window.scrollY),
  };
};

const expectStableCanvas = (
  before: Awaited<ReturnType<typeof editorPosition>>,
  after: Awaited<ReturnType<typeof editorPosition>>
) => {
  expect(after.transform).toBe(before.transform);
  expect(after.canvas.x).toBeCloseTo(before.canvas.x, 1);
  expect(after.canvas.y).toBeCloseTo(before.canvas.y, 1);
  expect(after.canvas.width).toBeCloseTo(before.canvas.width, 1);
  expect(after.canvas.height).toBeCloseTo(before.canvas.height, 1);
  expect(after.windowScrollY).toBe(before.windowScrollY);
};

const moveCatalogPointerToCanvas = async (
  page: Page,
  name: RegExp,
  position = { x: 0.68, y: 0.62 }
) => {
  const source = page.getByRole("button", { name });
  const sourceBox = await source.boundingBox();
  const canvasBox = await page.locator(".canvas").boundingBox();
  if (!sourceBox || !canvasBox) {
    throw new Error("Catalog item or canvas is not visible");
  }
  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;
  const targetX = canvasBox.x + canvasBox.width * position.x;
  const targetY = canvasBox.y + canvasBox.height * position.y;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 8, startY + 8, { steps: 2 });
  await expect(page.locator(".catalog-drag-ghost")).toBeVisible();
  await page.mouse.move(targetX, targetY, { steps: 8 });
  await expect(page.locator(".canvas-stage")).toHaveClass(/accepting-drop/);
  return {
    targetX,
    targetY,
    grabOffsetX: startX - sourceBox.x,
    grabOffsetY: startY - sourceBox.y,
    sourceWidth: sourceBox.width,
    sourceHeight: sourceBox.height,
  };
};

const dragCatalogItemToCanvas = async (
  page: Page,
  name: RegExp,
  position = { x: 0.68, y: 0.62 }
) => {
  const pointer = await moveCatalogPointerToCanvas(page, name, position);
  await page.mouse.up();
  await expect(page.locator(".catalog-drag-ghost")).toHaveCount(0);
  return pointer;
};

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const selectedLayout = async (page: Page) => {
  const value = async (field: "x" | "y" | "width" | "height") =>
    Number(
      await page
        .locator(`.properties input[data-field="${field}"]`)
        .inputValue()
    );
  const x = await value("x");
  const y = await value("y");
  const width = await value("width");
  const height = await value("height");
  return { x, y, width, height, right: x + width, bottom: y + height };
};

const dragResizeHandle = async (
  page: Page,
  selection: Locator,
  handle: ResizeHandle,
  nativeDelta: { x: number; y: number },
  shiftKey = false
) => {
  const canvas = page.locator(".canvas");
  const canvasBox = await canvas.boundingBox();
  const handleBox = await selection
    .locator(`[data-resize-handle="${handle}"]`)
    .boundingBox();
  if (!canvasBox || !handleBox) {
    throw new Error(`Resize handle ${handle} is not visible`);
  }
  const nativeSize = await canvas.evaluate((element) => ({
    width: element.clientWidth,
    height: element.clientHeight,
  }));
  const startX = handleBox.x + handleBox.width / 2;
  const startY = handleBox.y + handleBox.height / 2;
  if (shiftKey) await page.keyboard.down("Shift");
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(
    startX + (nativeDelta.x * canvasBox.width) / nativeSize.width,
    startY + (nativeDelta.y * canvasBox.height) / nativeSize.height,
    { steps: 8 }
  );
  await page.mouse.up();
  if (shiftKey) await page.keyboard.up("Shift");
};

const startLayerReorder = async (
  page: Page,
  source: Locator,
  target: Locator,
  edge: "before" | "after"
) => {
  const handle = source.getByRole("button", { name: /Reorder/ });
  const handleBox = await handle.boundingBox();
  const targetBox = await target.boundingBox();
  if (!handleBox || !targetBox) {
    throw new Error("Layer reorder controls are not visible");
  }
  await page.mouse.move(
    handleBox.x + handleBox.width / 2,
    handleBox.y + handleBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    edge === "before" ? targetBox.y + 2 : targetBox.y + targetBox.height - 2,
    { steps: 8 }
  );
  await expect(target).toHaveClass(new RegExp(`drop-${edge}`));
};

const openKitchenDashboard = async (page: Page) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Dashboards", exact: true })
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Open dashboard Kitchen display" })
    .click();
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, "randomUUID", {
      configurable: true,
      value: undefined,
    });
  });
  await openKitchenDashboard(page);
});

test("loads a persisted dashboard after HA assigns hass and ignores later hass object replacements", async ({
  page,
}) => {
  await expect(
    page.getByRole("button", { name: "Dashboards", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Dashboard name" })
  ).toHaveValue("Kitchen display");
  await expect(
    page.locator('.selection[data-item-id="temperature"]')
  ).toBeVisible();
  expect(await page.evaluate(() => window.__ODS_E2E__.hassRevision())).toBe(2);
  expect(
    await page.evaluate(
      () =>
        window.__ODS_E2E__
          .calls()
          .filter((call) => call.type === "opendisplay_studio/bootstrap").length
    )
  ).toBe(1);

  await page.locator('.selection[data-item-id="temperature"]').click();
  const before = await editorPosition(page);
  await page.evaluate(() => window.__ODS_E2E__.replaceHass());
  await page.waitForTimeout(100);

  await expect(
    page.locator('.selection[data-item-id="temperature"].selected')
  ).toHaveCount(1);
  expectStableCanvas(before, await editorPosition(page));
  expect(
    await page.evaluate(
      () =>
        window.__ODS_E2E__
          .calls()
          .filter((call) => call.type === "opendisplay_studio/bootstrap").length
    )
  ).toBe(1);
});

test("shows dashboard navigation, a searchable catalog and pixel-based canvas settings", async ({
  page,
}) => {
  await expect(
    page.getByText("OpenDisplay Studio", { exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Dashboards", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Dashboard name" })
  ).toHaveValue("Kitchen display");
  await expect(page.getByRole("button", { name: /Sensor card/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Rectangle/ })).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Progress bar/ })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("spinbutton", { name: "Width" })).toHaveValue(
    "800"
  );
  await expect(
    page.getByRole("spinbutton", { name: "Outer padding" })
  ).toHaveValue("20");
  await expect(page.getByRole("spinbutton", { name: "Snap size" })).toHaveValue(
    "5"
  );
  await expect(page.getByRole("combobox", { name: "Background" })).toHaveValue(
    "white"
  );
  await expect(page.getByRole("button", { name: /grid/i })).toHaveCount(0);

  const toolboxBox = await page.locator(".toolbox").boundingBox();
  const searchBox = await page.locator(".search").boundingBox();
  const textBox = await page
    .getByRole("button", { name: /Text/ })
    .boundingBox();
  const rectangleBox = await page
    .getByRole("button", { name: /Rectangle/ })
    .boundingBox();
  if (!toolboxBox || !searchBox || !textBox || !rectangleBox) {
    throw new Error("Catalog layout is not visible");
  }
  expect(toolboxBox.width).toBeCloseTo(255, 0);
  expect(searchBox.width).toBeCloseTo(235, 0);
  expect(searchBox.height).toBeCloseTo(30, 0);
  expect(textBox.width).toBeCloseTo(115, 0);
  expect(textBox.height).toBeCloseTo(34, 0);
  expect(rectangleBox.x - (textBox.x + textBox.width)).toBeCloseTo(6, 0);

  const search = page.getByRole("searchbox", {
    name: "Search widgets and primitives",
  });
  await search.fill("rect");
  await expect(page.getByText("No matching widgets")).toBeVisible();
  await expect(page.getByRole("button", { name: /Rectangle/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Text/ })).toBeHidden();
});

test("moves and resizes an absolute widget with pixel snapping", async ({
  page,
}) => {
  const widget = page.locator('.selection[data-item-id="temperature"]');
  await widget.click();
  const x = page.locator('.properties input[data-field="x"]');
  const width = page.locator('.properties input[data-field="width"]');
  expect(Number(await x.inputValue()) % 5).toBe(0);

  const box = await widget.boundingBox();
  if (!box) throw new Error("Widget is not visible");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 37,
    box.y + box.height / 2 + 23
  );
  await page.mouse.up();
  await expect
    .poll(async () => Number(await x.inputValue()))
    .toBeGreaterThan(40);
  expect(Number(await x.inputValue()) % 5).toBe(0);

  const beforeWidth = Number(await width.inputValue());
  const handle = widget.locator('[data-resize-handle="se"]');
  const handleBox = await handle.boundingBox();
  if (!handleBox) throw new Error("Resize handle is not visible");
  await page.mouse.move(handleBox.x + 4, handleBox.y + 4);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + 54, handleBox.y + 34);
  await page.mouse.up();
  await expect
    .poll(async () => Number(await width.inputValue()))
    .toBeGreaterThan(beforeWidth);
  expect(Number(await width.inputValue()) % 5).toBe(0);
});

test("matches the Home Assistant header height and exposes eight resize handles with a live size badge", async ({
  page,
}) => {
  const panel = page.locator("ods-app");
  await panel.evaluate((element) => {
    element.style.setProperty("--header-height", "61px");
    element.style.setProperty("--safe-area-inset-top", "7px");
  });
  await expect
    .poll(
      async () => (await page.locator(".topbar").boundingBox())?.height ?? 0
    )
    .toBeCloseTo(68, 0);

  const widget = page.locator('.selection[data-item-id="temperature"]');
  await widget.click();
  const handles = widget.locator("[data-resize-handle]");
  await expect(handles).toHaveCount(8);
  expect(
    await handles.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("data-resize-handle"))
    )
  ).toEqual(["nw", "n", "ne", "e", "se", "s", "sw", "w"]);
  await expect(widget.locator(".selection-size")).toHaveText("320 × 180");
});

test("resizes from every edge and corner while keeping the opposite edges fixed", async ({
  page,
}) => {
  const widget = page.locator('.selection[data-item-id="temperature"]');
  await widget.click();
  const baseline = await selectedLayout(page);
  const cases: Array<{
    handle: ResizeHandle;
    delta: { x: number; y: number };
  }> = [
    { handle: "nw", delta: { x: -20, y: -20 } },
    { handle: "n", delta: { x: 0, y: -20 } },
    { handle: "ne", delta: { x: 20, y: -20 } },
    { handle: "e", delta: { x: 20, y: 0 } },
    { handle: "se", delta: { x: 20, y: 20 } },
    { handle: "s", delta: { x: 0, y: 20 } },
    { handle: "sw", delta: { x: -20, y: 20 } },
    { handle: "w", delta: { x: -20, y: 0 } },
  ];

  for (const { handle, delta } of cases) {
    const beforeCanvas = await editorPosition(page);
    await dragResizeHandle(page, widget, handle, delta);
    const resized = await selectedLayout(page);
    if (handle.includes("w")) expect(resized.right).toBe(baseline.right);
    else expect(resized.x).toBe(baseline.x);
    if (handle.includes("e")) expect(resized.x).toBe(baseline.x);
    else expect(resized.right).toBe(baseline.right);
    if (handle.includes("n")) expect(resized.bottom).toBe(baseline.bottom);
    else expect(resized.y).toBe(baseline.y);
    if (handle.includes("s")) expect(resized.y).toBe(baseline.y);
    else expect(resized.bottom).toBe(baseline.bottom);
    if (handle.includes("w")) expect(resized.x).toBeLessThan(baseline.x);
    if (handle.includes("e")) {
      expect(resized.right).toBeGreaterThan(baseline.right);
    }
    if (handle.includes("n")) expect(resized.y).toBeLessThan(baseline.y);
    if (handle.includes("s")) {
      expect(resized.bottom).toBeGreaterThan(baseline.bottom);
    }
    await expect(widget.locator(".selection-size")).toHaveText(
      `${resized.width} × ${resized.height}`
    );
    expectStableCanvas(beforeCanvas, await editorPosition(page));

    await page.getByRole("button", { name: "Undo" }).click();
    await expect.poll(() => selectedLayout(page)).toEqual(baseline);
  }
});

test("preserves the selected item aspect ratio only while Shift is held", async ({
  page,
}) => {
  const widget = page.locator('.selection[data-item-id="temperature"]');
  await widget.click();
  const baseline = await selectedLayout(page);
  const initialRatio = baseline.width / baseline.height;

  await dragResizeHandle(page, widget, "se", { x: 80, y: 20 });
  const freeResize = await selectedLayout(page);
  expect(freeResize.x).toBe(baseline.x);
  expect(freeResize.y).toBe(baseline.y);
  expect(
    Math.abs(freeResize.width / freeResize.height - initialRatio)
  ).toBeGreaterThan(0.1);

  await page.getByRole("button", { name: "Undo" }).click();
  await expect.poll(() => selectedLayout(page)).toEqual(baseline);
  await dragResizeHandle(page, widget, "se", { x: 80, y: 20 }, true);
  const proportionalResize = await selectedLayout(page);
  expect(proportionalResize.x).toBe(baseline.x);
  expect(proportionalResize.y).toBe(baseline.y);
  expect(proportionalResize.width / proportionalResize.height).toBeCloseTo(
    initialRatio,
    2
  );
  await expect(widget.locator(".selection-size")).toHaveText(
    `${proportionalResize.width} × ${proportionalResize.height}`
  );
});

test("anchors a circle at the opposite edge instead of expanding around its center", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Circle/ }).click();
  const circle = page.locator(".selection.selected");
  const before = await circle.boundingBox();
  if (!before) throw new Error("Circle is not visible");

  await dragResizeHandle(page, circle, "e", { x: 40, y: 0 });
  const after = await circle.boundingBox();
  if (!after) throw new Error("Resized circle is not visible");
  expect(after.x).toBeCloseTo(before.x, 1);
  expect(after.y).toBeCloseTo(before.y, 1);
  expect(after.x + after.width).toBeGreaterThan(before.x + before.width);
  expect(after.y + after.height).toBeGreaterThan(before.y + before.height);
  await expect(circle.locator("[data-resize-handle]")).toHaveCount(8);
});

test("resizes box and quantized intrinsic ODL primitives through directional handles", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Rectangle/ }).click();
  const rectangle = page.locator(".selection.selected");
  const rectangleBaseline = await selectedLayout(page);
  await dragResizeHandle(page, rectangle, "se", { x: 20, y: 15 });
  const resizedRectangle = await selectedLayout(page);
  expect(resizedRectangle.x).toBe(rectangleBaseline.x);
  expect(resizedRectangle.y).toBe(rectangleBaseline.y);
  expect(resizedRectangle.right).toBeGreaterThan(rectangleBaseline.right);
  expect(resizedRectangle.bottom).toBeGreaterThan(rectangleBaseline.bottom);

  await page.getByRole("button", { name: /QR code/ }).click();
  const qrCode = page.locator(".selection.selected");
  const qrBefore = await qrCode.boundingBox();
  if (!qrBefore) throw new Error("QR code is not visible");
  await dragResizeHandle(page, qrCode, "se", { x: 46, y: 46 });
  const qrAfter = await qrCode.boundingBox();
  if (!qrAfter) throw new Error("Resized QR code is not visible");
  expect(qrAfter.x).toBeCloseTo(qrBefore.x, 1);
  expect(qrAfter.y).toBeCloseTo(qrBefore.y, 1);
  expect(qrAfter.width).toBeGreaterThan(qrBefore.width);
  expect(qrAfter.height).toBeCloseTo(qrAfter.width, 1);
});

test("keeps the canvas fixed while selecting, moving upward and editing properties", async ({
  page,
}) => {
  const widget = page.locator('.selection[data-item-id="temperature"]');
  const properties = page.locator(".properties");
  await properties.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const beforeSelection = await editorPosition(page);
  const composeCallsBefore = await page.evaluate(
    () =>
      window.__ODS_E2E__
        .calls()
        .filter((call) => call.type === "opendisplay_studio/compose_preview")
        .length
  );

  await widget.click();
  await expect(page.getByRole("heading", { name: "Kitchen" })).toBeVisible();
  await expect
    .poll(() => properties.evaluate((element) => element.scrollTop))
    .toBe(0);
  await page.waitForTimeout(300);
  expectStableCanvas(beforeSelection, await editorPosition(page));
  const composeCallsAfterSelection = await page.evaluate(
    () =>
      window.__ODS_E2E__
        .calls()
        .filter((call) => call.type === "opendisplay_studio/compose_preview")
        .length
  );
  expect(composeCallsAfterSelection).toBe(composeCallsBefore);

  const yField = page.locator('.properties input[data-field="y"]');
  const yBefore = Number(await yField.inputValue());
  const box = await widget.boundingBox();
  if (!box) throw new Error("Widget is not visible");
  const beforeMove = await editorPosition(page);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 20);
  await page.mouse.up();
  await expect
    .poll(async () => Number(await yField.inputValue()))
    .toBeLessThan(yBefore);
  await page.waitForTimeout(300);
  expectStableCanvas(beforeMove, await editorPosition(page));

  const xField = page.locator('.properties input[data-field="x"]');
  const beforePropertyEdit = await editorPosition(page);
  await xField.fill("100");
  await xField.press("Tab");
  await expect(xField).toHaveValue("100");
  await page.waitForTimeout(300);
  expectStableCanvas(beforePropertyEdit, await editorPosition(page));
  await expect(
    page.locator('.selection[data-item-id="temperature"].selected')
  ).toHaveCount(1);

  const beforeDeselect = await editorPosition(page);
  const canvas = page.locator(".canvas");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) throw new Error("Canvas is not visible");
  await canvas.click({
    position: { x: canvasBox.width - 20, y: canvasBox.height - 20 },
  });
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.waitForTimeout(100);
  expectStableCanvas(beforeDeselect, await editorPosition(page));
});

test("adds new elements by click and drag without moving or reloading the editor", async ({
  page,
}) => {
  const before = await editorPosition(page);
  const bootstrapCalls = await page.evaluate(
    () =>
      window.__ODS_E2E__
        .calls()
        .filter((call) => call.type === "opendisplay_studio/bootstrap").length
  );

  await page.getByRole("button", { name: /Rectangle/ }).click();
  await expect(
    page.getByRole("heading", { name: "rectangle_1", exact: true })
  ).toBeVisible();
  await expect(page.locator(".layer-row")).toHaveCount(2);
  await expect(page.locator("[data-item-id].selected")).toHaveCount(1);
  expectStableCanvas(before, await editorPosition(page));

  await dragCatalogItemToCanvas(page, /Circle/);
  await expect(
    page.getByRole("heading", { name: "circle_1", exact: true })
  ).toBeVisible();
  await expect(page.locator(".layer-row")).toHaveCount(3);
  await expect(page.locator("[data-item-id].selected")).toHaveCount(1);
  await page.waitForTimeout(300);
  expectStableCanvas(before, await editorPosition(page));
  expect(
    await page.evaluate(
      () =>
        window.__ODS_E2E__
          .calls()
          .filter((call) => call.type === "opendisplay_studio/bootstrap").length
    )
  ).toBe(bootstrapCalls);
});

test("keeps catalog dragging relative to the canvas across different HA sidebar widths", async ({
  page,
}) => {
  const panel = page.locator("ods-app");
  const scenarios = [
    { sidebarWidth: 176, name: /Ellipse/, value: "primitive:ellipse" },
    { sidebarWidth: 324, name: /Line/, value: "primitive:line" },
  ];

  for (const scenario of scenarios) {
    await panel.evaluate((element, sidebarWidth) => {
      element.style.marginLeft = `${sidebarWidth}px`;
      element.style.width = `calc(100vw - ${sidebarWidth}px)`;
    }, scenario.sidebarWidth);
    await expect
      .poll(async () => (await panel.boundingBox())?.x ?? 0)
      .toBeCloseTo(scenario.sidebarWidth, 0);
    const before = await page.locator(".layer-row").count();

    const pointer = await moveCatalogPointerToCanvas(page, scenario.name, {
      x: 0.54,
      y: 0.62,
    });
    await expect(page.locator(".catalog-drag-ghost")).toHaveAttribute(
      "data-catalog-value",
      scenario.value
    );
    const ghost = await page.locator(".catalog-drag-ghost").boundingBox();
    if (!ghost) throw new Error("Catalog drag indicator is not visible");
    expect(
      Math.abs(ghost.x - (pointer.targetX - pointer.grabOffsetX))
    ).toBeLessThan(2);
    expect(
      Math.abs(ghost.y - (pointer.targetY - pointer.grabOffsetY))
    ).toBeLessThan(2);
    expect(Math.abs(ghost.width - pointer.sourceWidth)).toBeLessThan(2);
    expect(Math.abs(ghost.height - pointer.sourceHeight)).toBeLessThan(2);
    expect(pointer.targetX).toBeGreaterThan(ghost.x);
    expect(pointer.targetX).toBeLessThan(ghost.x + ghost.width);
    expect(pointer.targetY).toBeGreaterThan(ghost.y);
    expect(pointer.targetY).toBeLessThan(ghost.y + ghost.height);

    await page.mouse.up();
    await expect(page.locator(".catalog-drag-ghost")).toHaveCount(0);
    await expect(page.locator(".layer-row")).toHaveCount(before + 1);
    const added = await page.locator(".selection.selected").boundingBox();
    if (!added) {
      throw new Error("Dropped element is not selected on the canvas");
    }
    expect(Math.abs(added.x + added.width / 2 - pointer.targetX)).toBeLessThan(
      3
    );
    expect(Math.abs(added.y + added.height / 2 - pointer.targetY)).toBeLessThan(
      3
    );
  }
});

test("adds and moves an unlocked Sensor card widget without Crypto.randomUUID", async ({
  page,
}) => {
  expect(await page.evaluate(() => typeof globalThis.crypto.randomUUID)).toBe(
    "undefined"
  );
  const initialCount = await page.locator(".layer-row").count();

  const pointer = await moveCatalogPointerToCanvas(page, /Sensor card/, {
    x: 0.7,
    y: 0.66,
  });
  await expect(page.locator(".catalog-drag-ghost")).toContainText(
    "Sensor card"
  );
  await page.mouse.up();

  await expect(page.locator(".layer-row")).toHaveCount(initialCount + 1);
  await expect(
    page.getByRole("heading", { name: "sensor-card_2", exact: true })
  ).toBeVisible();
  const selected = page.locator(".selection.selected");
  await expect(selected).not.toHaveClass(/locked/);
  expect(
    await selected.evaluate(
      (element) => getComputedStyle(element).borderTopStyle
    )
  ).toBe("solid");
  const selectedId = await selected.getAttribute("data-item-id");
  expect(selectedId).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
  );
  const droppedBox = await selected.boundingBox();
  if (!droppedBox) throw new Error("Dropped Sensor card widget is not visible");
  expect(
    Math.abs(droppedBox.x + droppedBox.width / 2 - pointer.targetX)
  ).toBeLessThan(3);
  expect(
    Math.abs(droppedBox.y + droppedBox.height / 2 - pointer.targetY)
  ).toBeLessThan(3);

  const layer = page
    .locator(".layer-row")
    .filter({ hasText: "sensor-card_2" })
    .first();
  await layer.getByRole("button", { name: "Lock sensor-card_2" }).click();
  await expect(selected).toHaveClass(/locked/);
  await page.getByRole("button", { name: "Unlock element position" }).click();
  await expect(selected).not.toHaveClass(/locked/);

  const xField = page.locator('.properties input[data-field="x"]');
  const xBefore = Number(await xField.inputValue());
  const movableBox = await selected.boundingBox();
  if (!movableBox) {
    throw new Error("Unlocked Sensor card widget is not visible");
  }
  await page.mouse.move(
    movableBox.x + movableBox.width / 2,
    movableBox.y + movableBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    movableBox.x + movableBox.width / 2 + 45,
    movableBox.y + movableBox.height / 2,
    { steps: 8 }
  );
  await page.mouse.up();
  await expect
    .poll(async () => Number(await xField.inputValue()))
    .toBeGreaterThan(xBefore);
});

test("supports consecutive catalog drops, immediate movement and cancellation outside the canvas", async ({
  page,
}) => {
  const initialCount = await page.locator(".layer-row").count();

  await dragCatalogItemToCanvas(page, /Line/, { x: 0.38, y: 0.38 });
  await expect(page.locator(".layer-row")).toHaveCount(initialCount + 1);
  await expect(
    page.getByRole("heading", { name: "line_1", exact: true })
  ).toBeVisible();
  await expect(page.locator(".selection.selected")).toHaveAttribute(
    "data-item-id",
    /.+/
  );

  await dragCatalogItemToCanvas(page, /QR code/, { x: 0.7, y: 0.64 });
  await expect(page.locator(".layer-row")).toHaveCount(initialCount + 2);
  await expect(
    page.getByRole("heading", { name: "qrcode_1", exact: true })
  ).toBeVisible();
  const selected = page.locator(".selection.selected");
  const selectedId = await selected.getAttribute("data-item-id");
  expect(selectedId).toBeTruthy();

  const xField = page.locator('.properties input[data-field="x"]');
  const xBefore = Number(await xField.inputValue());
  const selectedBox = await selected.boundingBox();
  if (!selectedBox) throw new Error("Newly dropped QR code is not visible");
  await page.mouse.move(
    selectedBox.x + selectedBox.width / 2,
    selectedBox.y + selectedBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    selectedBox.x + selectedBox.width / 2 + 45,
    selectedBox.y + selectedBox.height / 2,
    { steps: 8 }
  );
  await page.mouse.up();
  await expect
    .poll(async () => Number(await xField.inputValue()))
    .toBeGreaterThan(xBefore);
  await expect(page.locator(".selection.selected")).toHaveAttribute(
    "data-item-id",
    selectedId!
  );

  const source = page.getByRole("button", { name: /Progress bar/ });
  const sourceBox = await source.boundingBox();
  if (!sourceBox) throw new Error("Progress bar catalog item is not visible");
  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2 + 8,
    sourceBox.y + sourceBox.height / 2 + 8,
    { steps: 2 }
  );
  await expect(page.locator(".catalog-drag-ghost")).toContainText(
    "Progress bar"
  );
  await page.mouse.move(10, 10, { steps: 8 });
  await page.mouse.up();
  await expect(page.locator(".catalog-drag-ghost")).toHaveCount(0);
  await expect(page.locator(".canvas-stage")).not.toHaveClass(/accepting-drop/);
  await expect(page.locator(".layer-row")).toHaveCount(initialCount + 2);
});

test("selecting a layer keeps the workspace stationary and opens properties at the top", async ({
  page,
}) => {
  const properties = page.locator(".properties");
  await properties.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  const before = await editorPosition(page);

  await page.locator(".layer-row").filter({ hasText: "Kitchen" }).click();

  await expect(
    page.locator('.selection[data-item-id="temperature"].selected')
  ).toHaveCount(1);
  await expect
    .poll(() => properties.evaluate((element) => element.scrollTop))
    .toBe(0);
  expectStableCanvas(before, await editorPosition(page));
});

test("adds overlapping primitives and preserves each exact ODL type", async ({
  page,
}) => {
  const types = [
    ["Line", "line"],
    ["Circle", "circle"],
    ["Ellipse", "ellipse"],
    ["Icon", "icon"],
    ["QR code", "qrcode"],
    ["Progress bar", "progress_bar"],
  ] as const;
  for (const [name, type] of types) {
    await dragCatalogItemToCanvas(page, new RegExp(name));
    await expect(
      page.getByRole("heading", { name: `${type}_1`, exact: true })
    ).toBeVisible();
  }
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const savedTypes = await page.evaluate(() => {
    const calls = window.__ODS_E2E__.calls();
    const update = calls.findLast(
      (call) => call.type === "opendisplay_studio/update_dashboard"
    );
    const dashboard = update?.dashboard as {
      items: Array<{ kind: string; primitive?: { type: string } }>;
    };
    return dashboard.items
      .filter((item) => item.kind === "primitive")
      .map((item) => item.primitive?.type);
  });
  expect(savedTypes).toEqual(types.map(([, type]) => type));
});

test("selects, hides, locks and reorders compact layers with an insertion marker", async ({
  page,
}) => {
  await dragCatalogItemToCanvas(page, /Rectangle/, { x: 0.62, y: 0.56 });
  await dragCatalogItemToCanvas(page, /Text/, { x: 0.72, y: 0.66 });

  const rectangleRow = page
    .locator(".layer-row")
    .filter({ hasText: "rectangle_1" });
  const textRow = page.locator(".layer-row").filter({ hasText: "Text" });
  await rectangleRow.click();
  await expect(page.locator("[data-item-id].selected")).toHaveCount(1);
  await rectangleRow.getByRole("button", { name: "Hide Rectangle" }).click();
  await expect(page.locator("[data-item-id].hidden")).toHaveCount(1);
  await rectangleRow.getByRole("button", { name: "Lock Rectangle" }).click();
  await expect(
    page.locator('.properties input[data-field="x"]')
  ).toBeDisabled();

  await startLayerReorder(page, textRow, rectangleRow, "after");
  await page.mouse.up();
  await expect(rectangleRow).not.toHaveClass(/drop-after/);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const order = await page.evaluate(() => {
    const calls = window.__ODS_E2E__.calls();
    const update = calls.findLast(
      (call) => call.type === "opendisplay_studio/update_dashboard"
    );
    return (
      update?.dashboard as {
        items: Array<{
          kind: string;
          primitive?: { type: string };
          hidden: boolean;
          locked: boolean;
        }>;
      }
    ).items;
  });
  const rectangle = order.find((item) => item.primitive?.type === "rectangle");
  expect(rectangle).toEqual(
    expect.objectContaining({ hidden: true, locked: true })
  );
  const textIndex = order.findIndex((item) => item.primitive?.type === "text");
  const rectangleIndex = order.findIndex(
    (item) => item.primitive?.type === "rectangle"
  );
  expect(rectangleIndex).toBeGreaterThan(textIndex);
});

test("supports undo and redo for movement, visibility and layer order", async ({
  page,
}) => {
  await dragCatalogItemToCanvas(page, /Rectangle/, { x: 0.34, y: 0.34 });
  await dragCatalogItemToCanvas(page, /Text/, { x: 0.78, y: 0.72 });
  const rectangleRow = page
    .locator(".layer-row")
    .filter({ hasText: "rectangle_1" });
  const textRow = page.locator(".layer-row").filter({ hasText: "Text" });

  await rectangleRow.click();
  await expect(
    page.getByRole("heading", { name: "rectangle_1", exact: true })
  ).toBeVisible();
  const xField = page.locator('.properties input[data-field="x"]');
  const xBefore = Number(await xField.inputValue());
  const rectangle = page.locator(".selection.selected");
  const box = await rectangle.boundingBox();
  if (!box) throw new Error("Selected rectangle is not visible");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2, {
    steps: 5,
  });
  await page.mouse.up();
  const xAfter = Number(await xField.inputValue());
  expect(xAfter).toBeGreaterThan(xBefore);
  const undo = page.getByRole("button", { name: "Undo" });
  await expect(undo).toBeEnabled();
  await undo.click();
  await expect(xField).toHaveValue(String(xBefore));
  await page.getByRole("button", { name: "Redo" }).click();
  await expect(xField).toHaveValue(String(xAfter));

  await rectangleRow.getByRole("button", { name: "Hide Rectangle" }).click();
  await expect(rectangleRow).toHaveClass(/is-hidden/);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(rectangleRow).not.toHaveClass(/is-hidden/);
  await page.getByRole("button", { name: "Redo" }).click();
  await expect(rectangleRow).toHaveClass(/is-hidden/);

  const rowsBefore = await page.locator(".layer-row strong").allTextContents();
  await startLayerReorder(page, textRow, rectangleRow, "after");
  await page.mouse.up();
  const rowsAfter = await page.locator(".layer-row strong").allTextContents();
  expect(rowsAfter).not.toEqual(rowsBefore);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect
    .poll(() => page.locator(".layer-row strong").allTextContents())
    .toEqual(rowsBefore);
  await page.getByRole("button", { name: "Redo" }).click();
  await expect
    .poll(() => page.locator(".layer-row strong").allTextContents())
    .toEqual(rowsAfter);
});

test("requires confirmation before deleting a layer and supports undo", async ({
  page,
}) => {
  await dragCatalogItemToCanvas(page, /Text/, { x: 0.72, y: 0.66 });
  const textRow = page.locator(".layer-row").filter({ hasText: "text_1" });
  await textRow.getByRole("button", { name: "Delete text_1" }).click();
  const dialog = page.getByRole("dialog", { name: "Delete text_1?" });
  await expect(dialog).toBeVisible();
  await dialog.getByText("Cancel", { exact: true }).click();
  await expect(textRow).toHaveCount(1);

  await textRow.getByRole("button", { name: "Delete text_1" }).click();
  await dialog.getByText("Delete element", { exact: true }).click();
  await expect(textRow).toHaveCount(0);
  await page.getByRole("button", { name: "Undo" }).click();
  await expect(
    page.locator(".layer-row").filter({ hasText: "Text" })
  ).toHaveCount(1);
});

test("copies generated ODL YAML to the clipboard", async ({ page }) => {
  await page
    .getByRole("navigation", { name: "Dashboard view" })
    .getByRole("button", { name: "Code" })
    .click();
  const code = page.getByRole("textbox", { name: "Generated ODL YAML" });
  await expect(code).toHaveJSProperty("readOnly", true);
  const expected = await code.inputValue();
  await page.getByRole("button", { name: "Copy generated ODL YAML" }).click();
  await expect(page.getByText("YAML copied to clipboard")).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard.replaceAll("\r\n", "\n")).toBe(
    expected.replaceAll("\r\n", "\n")
  );
});

test("supports zoom, wheel panning, reset, fit and resizable collapsible panels", async ({
  page,
}) => {
  const stage = page.locator(".canvas-stage");
  const viewport = page.locator(".canvas-viewport");
  const initialTransform = await viewport.getAttribute("style");
  await stage.dispatchEvent("wheel", { deltaY: -120, shiftKey: true });
  await expect(page.locator(".zoom-readout")).not.toHaveText("100%");
  await stage.dispatchEvent("wheel", { deltaY: 70 });
  expect(await viewport.getAttribute("style")).not.toBe(initialTransform);
  await stage.dispatchEvent("wheel", { deltaY: 80, altKey: true });
  await page.getByRole("button", { name: "2×" }).click();
  await expect(page.locator(".zoom-readout")).toHaveText("200%");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.locator(".zoom-readout")).toHaveText("100%");
  await page.getByRole("button", { name: "Fit" }).click();

  const inspector = page.locator(".inspector");
  const initialWidth = (await inspector.boundingBox())?.width ?? 0;
  const resizer = page.getByRole("separator", { name: "Resize inspector" });
  const box = await resizer.boundingBox();
  if (!box) throw new Error("Inspector resize handle is not visible");
  await resizer.dispatchEvent("pointerdown", {
    clientX: box.x + 4,
    clientY: box.y + 100,
    pointerId: 1,
  });
  await page.locator("body").dispatchEvent("pointermove", {
    clientX: box.x - 70,
    clientY: box.y + 100,
    pointerId: 1,
  });
  await page.locator("body").dispatchEvent("pointerup", {
    clientX: box.x - 70,
    clientY: box.y + 100,
    pointerId: 1,
  });
  await expect
    .poll(async () => (await inspector.boundingBox())?.width ?? 0)
    .toBeGreaterThan(initialWidth + 50);
  await page.getByRole("button", { name: "Collapse element catalog" }).click();
  await expect(
    page.getByRole("button", { name: "Expand element catalog" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Collapse inspector" }).click();
  await expect(
    page.getByRole("button", { name: "Expand inspector" })
  ).toBeVisible();
});

test("keeps the authoritative canvas usable on a narrow HA panel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 812 });
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Dashboards", exact: true })
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Open dashboard Kitchen display" })
    .click();
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
  const canvas = await page.locator(".canvas").boundingBox();
  expect(canvas?.width ?? 0).toBeGreaterThan(200);
  await expect(
    page.getByRole("button", { name: "Dashboards", exact: true })
  ).toBeVisible();
});

declare global {
  interface Window {
    __ODS_E2E__: {
      calls: () => Array<Record<string, unknown>>;
      dashboards: () => Dashboard[];
      replaceHass: () => void;
      hassRevision: () => number;
    };
  }
}
