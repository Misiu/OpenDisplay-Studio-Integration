import { expect, test, type Page } from "@playwright/test";
import {
  chooseAnchor,
  libraryItem,
  openKitchen,
  withoutRandomUuid,
} from "./helpers";

/**
 * Every ODL primitive the backend defines is offered in the panel, is editable through
 * the fields its definition declares, and is outlined at the size the backend measured.
 */

interface PrimitiveExpectation {
  type: string;
  /** The library entry, as the definition names it. */
  name: string;
  /** Labels that must be editable once the primitive is selected. */
  fields: string[];
  /** Resize handles on the selection; a debug grid covers the display and has none. */
  handles?: number;
}

const SHAPE_FIELDS = ["Fill", "Outline", "Outline width"];

const PRIMITIVES: PrimitiveExpectation[] = [
  {
    type: "text",
    name: "Text",
    fields: ["X", "Y", "Size", "Text", "Color"],
  },
  {
    type: "rectangle",
    name: "Rectangle",
    fields: ["X", "Y", "Width", "Height", "Fill", "Outline", "Outline width"],
  },
  {
    type: "line",
    name: "Line",
    fields: ["X", "Y", "Width", "Height", "Color", "Line width", "Dashed"],
    // The two ends have handles of their own instead.
    handles: 0,
  },
  {
    type: "circle",
    name: "Circle",
    fields: [
      "Center X",
      "Center Y",
      "Radius",
      "Fill",
      "Outline",
      "Outline width",
    ],
  },
  {
    type: "ellipse",
    name: "Ellipse",
    fields: ["X", "Y", "Width", "Height", "Fill", "Outline", "Outline width"],
  },
  {
    type: "icon",
    name: "Icon",
    fields: ["X", "Y", "Size", "MDI icon name", "Color"],
  },
  {
    type: "qrcode",
    name: "QR code",
    fields: [
      "X",
      "Y",
      "Module size",
      "Content",
      "Quiet zone",
      "Foreground",
      "Background",
    ],
  },
  {
    type: "progress_bar",
    name: "Progress bar",
    fields: [
      "X",
      "Y",
      "Width",
      "Height",
      "Progress",
      "Direction",
      "Background",
      "Fill",
      "Outline",
      "Outline width",
      "Show percentage",
    ],
  },
  {
    type: "multiline",
    name: "Multiline text",
    fields: [
      "X",
      "Y",
      "Size",
      "Line height",
      "Text",
      "Delimiter",
      "Color",
      "Anchor",
      "Font",
      "Alignment",
    ],
  },
  {
    type: "rectangle_pattern",
    name: "Rectangle pattern",
    fields: [
      "Left",
      "Top",
      "Cell width",
      "Cell height",
      "Horizontal gap",
      "Vertical gap",
      "Columns",
      "Rows",
      ...SHAPE_FIELDS,
      "Corner radius",
      "Rounded corners",
    ],
  },
  {
    type: "polygon",
    name: "Polygon",
    fields: ["Points", "Fill", "Outline"],
  },
  {
    type: "arc",
    name: "Arc",
    fields: [
      "Center X",
      "Center Y",
      "Radius",
      "Start angle",
      "End angle",
      ...SHAPE_FIELDS,
    ],
  },
  {
    type: "icon_sequence",
    name: "Icon sequence",
    fields: [
      "X",
      "Y",
      "Size",
      "Icons",
      "Direction",
      "Spacing",
      "Color",
      "Anchor",
    ],
  },
  {
    type: "dlimg",
    name: "Image",
    fields: ["X", "Y", "Width", "Height", "Image", "Resize", "Rotate"],
  },
  {
    type: "plot",
    name: "History plot",
    fields: [
      "X",
      "Y",
      "Width",
      "Height",
      "Series",
      "Time span",
      "Lowest value",
      "Highest value",
      "Font",
      "Value labels",
      "Value axis",
      "Time labels",
      "Time axis",
    ],
  },
  {
    type: "debug_grid",
    name: "Debug grid",
    fields: ["Spacing", "Line color", "Dashed", "Show labels", "Label size"],
    handles: 0,
  },
];

const selectedChip = (page: Page) => page.locator(".selection-size");

/** The rarely needed fields are closed until asked for. */
const openAdvanced = async (page: Page) => {
  const advanced = page.locator(".properties .disclosure", {
    hasText: "Advanced",
  });
  if ((await advanced.count()) > 0) {
    await advanced.evaluate((element: HTMLDetailsElement) => {
      element.open = true;
    });
  }
};

const fieldNamed = (page: Page, label: string) =>
  page
    .locator(".properties")
    .getByLabel(label, { exact: true })
    .or(page.locator(".properties").getByText(label, { exact: true }))
    .first();

test.beforeEach(async ({ page }) => {
  await withoutRandomUuid(page);
  await openKitchen(page);
});

test("offers every primitive in the library, in the backend's order", async ({
  page,
}) => {
  const primitives = page.locator(
    "ods-library .catalog-section:not([data-section='widgets']):not([data-section='containers']) .catalog-item strong"
  );

  await expect(primitives).toHaveText([
    "Text",
    "Multiline text",
    "Line",
    "Rectangle",
    "Rectangle pattern",
    "Polygon",
    "Circle",
    "Ellipse",
    "Arc",
    "Icon",
    "Icon sequence",
    "Image",
    "QR code",
    "Progress bar",
    "History plot",
    "Debug grid",
  ]);
  await expect(
    page.locator("ods-library .catalog-section .catalog-item")
  ).toHaveCount(16 + 1 + 3);
});

for (const primitive of PRIMITIVES) {
  test(`adds a ${primitive.type} and edits it through its own fields`, async ({
    page,
  }) => {
    await libraryItem(page, primitive.name).click();

    await expect(page.locator(".layer-row.active")).toHaveCount(1);
    await expect(page.locator(".selection.selected")).toHaveCount(1);
    await expect(
      page.locator(".selection.selected [data-resize-handle]")
    ).toHaveCount(primitive.handles ?? 8);
    await openAdvanced(page);
    for (const label of primitive.fields) {
      await expect(
        fieldNamed(page, label),
        `${primitive.type}: ${label}`
      ).toBeVisible();
    }
  });
}

test.describe("QR code", () => {
  const addQrCode = async (page: Page) => {
    await libraryItem(page, "QR code").click();
    await expect(selectedChip(page)).toBeVisible();
  };

  const setContent = async (page: Page, text: string) => {
    const content = page.getByRole("textbox", { name: "Content" });
    await content.fill(text);
    await content.press("Tab");
  };

  test("starts at the size of the smallest code", async ({ page }) => {
    await addQrCode(page);

    // 21 modules and a quiet zone of one on each side, at 3 px per module.
    await expect(selectedChip(page)).toHaveText("69 × 69");
  });

  test("grows with its content, at the size the backend measured", async ({
    page,
  }) => {
    await addQrCode(page);

    await setContent(page, "https://example.org/a/longer/address");

    // 36 bytes need version 5: 37 modules plus the quiet zone, at 3 px each.
    await expect(selectedChip(page)).toHaveText("117 × 117");
    const canvas = await page.locator(".canvas").boundingBox();
    const outline = await page.locator(".selection.selected").boundingBox();
    if (!canvas || !outline) {
      throw new Error("The QR outline is not visible");
    }
    // The outline is drawn at the same scale as the canvas: 117 of its pixels.
    const scale = canvas.width / 800;
    expect(outline.width / scale).toBeCloseTo(117, 0);
    expect(outline.height / scale).toBeCloseTo(117, 0);
  });

  test("follows the module size and the quiet zone", async ({ page }) => {
    await addQrCode(page);

    await page.getByLabel("Module size", { exact: true }).fill("5");
    await page.getByLabel("Module size", { exact: true }).press("Tab");
    await expect(selectedChip(page)).toHaveText("115 × 115");

    await page.getByRole("spinbutton", { name: "Quiet zone" }).fill("4");
    await page.getByRole("spinbutton", { name: "Quiet zone" }).press("Tab");
    await expect(selectedChip(page)).toHaveText("145 × 145");
  });

  test("keeps its measured size while it is dragged", async ({ page }) => {
    await addQrCode(page);
    await setContent(page, "https://example.org/a/longer/address");
    await expect(selectedChip(page)).toHaveText("117 × 117");
    await page.getByRole("button", { name: "Reset", exact: true }).click();

    const box = await page.locator(".selection.selected").boundingBox();
    if (!box) {
      throw new Error("The QR outline is not visible");
    }
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 60, startY + 30, { steps: 6 });
    await expect(selectedChip(page)).toHaveText("117 × 117");
    await page.mouse.up();
    await expect(selectedChip(page)).toHaveText("117 × 117");
  });

  test("resizes by whole modules of the real code, not of the smallest one", async ({
    page,
  }) => {
    await addQrCode(page);
    await setContent(page, "https://example.org/a/longer/address");
    await expect(selectedChip(page)).toHaveText("117 × 117");
    await page.getByRole("button", { name: "Reset", exact: true }).click();

    const handle = page.locator(
      '.selection.selected [data-resize-handle="se"]'
    );
    const box = await handle.boundingBox();
    if (!box) {
      throw new Error("The resize handle is not visible");
    }
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 80, startY + 80, { steps: 8 });
    await page.mouse.up();

    // 39 modules including the quiet zone: any resized side is a multiple of 39.
    await expect(page.getByLabel("Module size", { exact: true })).toHaveValue(
      "5"
    );
    await expect(selectedChip(page)).toHaveText("195 × 195");
  });

  test("uses a longer code's real size when it keeps the code inside the display", async ({
    page,
  }) => {
    await addQrCode(page);
    await setContent(page, "x".repeat(110));

    // 110 bytes need version 10: 57 modules plus the quiet zone, at 3 px each.
    await expect(selectedChip(page)).toHaveText("177 × 177");
  });
});

test.describe("Text", () => {
  test("is outlined at the width the backend measured, not the panel's estimate", async ({
    page,
  }) => {
    await libraryItem(page, "Text").click();

    await expect(selectedChip(page)).toHaveText("70 × 45");
    const text = page.getByRole("textbox", { name: "Text", exact: true });
    await text.fill("Living room");
    await text.press("Tab");
    await expect(selectedChip(page)).toHaveText("194 × 45");
  });

  test("grows taller and wider with its size", async ({ page }) => {
    await libraryItem(page, "Text").click();

    await page.getByLabel("Size", { exact: true }).fill("64");
    await page.getByLabel("Size", { exact: true }).press("Tab");

    await expect(selectedChip(page)).toHaveText("141 × 90");
  });
});

test.describe("the shapes with their own geometry", () => {
  const pointInput = (page: Page, point: number, axis: "X" | "Y") =>
    page.locator(`[data-point="${point}"]`).getByLabel(axis, { exact: true });

  test("a polygon is outlined by its points, and follows edits of them", async ({
    page,
  }) => {
    await libraryItem(page, "Polygon").click();
    // The starting triangle is 81 wide and 71 tall, inclusive.
    await expect(selectedChip(page)).toHaveText("81 × 71");

    await pointInput(page, 0, "X").fill("10");
    await pointInput(page, 0, "X").press("Tab");
    await pointInput(page, 0, "Y").fill("10");
    await pointInput(page, 0, "Y").press("Tab");
    await pointInput(page, 1, "X").fill("110");
    await pointInput(page, 1, "X").press("Tab");
    await pointInput(page, 1, "Y").fill("10");
    await pointInput(page, 1, "Y").press("Tab");
    await pointInput(page, 2, "X").fill("10");
    await pointInput(page, 2, "X").press("Tab");
    await pointInput(page, 2, "Y").fill("60");
    await pointInput(page, 2, "Y").press("Tab");

    await expect(selectedChip(page)).toHaveText("101 × 51");
  });

  test("points are added and removed, and a polygon keeps three", async ({
    page,
  }) => {
    await libraryItem(page, "Polygon").click();
    const rows = page.locator("[data-point]");
    await expect(rows).toHaveCount(3);
    await expect(
      page.getByRole("button", { name: "Remove point 1" })
    ).toBeDisabled();

    await page.getByRole("button", { name: "Add point" }).click();
    await expect(rows).toHaveCount(4);
    await expect(
      page.getByRole("button", { name: "Remove point 4" })
    ).toBeEnabled();

    await page.getByRole("button", { name: "Remove point 4" }).click();
    await expect(rows).toHaveCount(3);
  });

  test("keeps the point it has while what is typed is not a number", async ({
    page,
  }) => {
    await libraryItem(page, "Polygon").click();

    await pointInput(page, 0, "X").fill("");
    await pointInput(page, 0, "X").press("Tab");

    await expect(selectedChip(page)).toHaveText("81 × 71");
  });

  test("a handle on a point moves that point alone, as one undo step", async ({
    page,
  }) => {
    await libraryItem(page, "Polygon").click();
    const first = pointInput(page, 0, "X");
    const second = pointInput(page, 1, "X");
    const firstBefore = await first.inputValue();
    const secondBefore = await second.inputValue();

    const handle = page.locator('[data-point-handle="1"]');
    const box = await handle.boundingBox();
    if (!box) throw new Error("The point handle is not visible");
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 40, y, { steps: 6 });
    await page.mouse.up();

    await expect(second).not.toHaveValue(secondBefore);
    await expect(first).toHaveValue(firstBefore);

    await page.getByRole("button", { name: "Undo" }).click();
    await expect(second).toHaveValue(secondBefore);
  });

  test("a plus in the middle of an edge adds a point, a double click on a point removes it", async ({
    page,
  }) => {
    await libraryItem(page, "Polygon").click();
    const rows = page.locator("[data-point]");
    await expect(rows).toHaveCount(3);

    await page.locator("[data-edge-add='0']").click();
    await expect(rows).toHaveCount(4);
    await expect(page.locator("[data-point-handle]")).toHaveCount(4);

    await page.locator("[data-point-handle='1']").dblclick();
    await expect(rows).toHaveCount(3);
    // A polygon keeps three points.
    await page.locator("[data-point-handle='0']").dblclick();
    await expect(rows).toHaveCount(3);
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(rows).toHaveCount(4);
  });

  test("a line is shaped by handles on its two ends", async ({ page }) => {
    await libraryItem(page, "Line").click();
    await expect(page.locator("[data-point-handle]")).toHaveCount(2);
    await expect(
      page.locator(".selection.selected [data-resize-handle]")
    ).toHaveCount(0);
    const end = page.locator("[data-point-handle='1']");
    const box = await end.boundingBox();
    const before = await page.locator(".selection.selected").boundingBox();
    if (!box || !before) throw new Error("The line is not visible");
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 40, y + 40, { steps: 6 });
    await page.mouse.up();

    const after = await page.locator(".selection.selected").boundingBox();
    expect((after?.width ?? 0) > before.width).toBe(true);
    expect(after?.x).toBeCloseTo(before.x, 0);
  });

  test("an arc is outlined as the circle it is cut from", async ({ page }) => {
    await libraryItem(page, "Arc").click();

    await expect(selectedChip(page)).toHaveText("121 × 121");
    await page.getByLabel("Radius", { exact: true }).fill("30");
    await page.getByLabel("Radius", { exact: true }).press("Tab");
    await expect(selectedChip(page)).toHaveText("61 × 61");
  });

  test("a pattern is outlined round all of its cells", async ({ page }) => {
    await libraryItem(page, "Rectangle pattern").click();

    // Three columns and two rows of 40 × 30 cells, 8 px apart, each drawn a pixel larger.
    await expect(selectedChip(page)).toHaveText("137 × 69");
    await page.getByLabel("Columns", { exact: true }).fill("4");
    await page.getByLabel("Columns", { exact: true }).press("Tab");
    await expect(selectedChip(page)).toHaveText("185 × 69");
  });

  test("a row of icons is outlined by its icons, and shrinks when one is removed", async ({
    page,
  }) => {
    await libraryItem(page, "Icon sequence").click();

    // Three icons of 32 px, a quarter of that apart.
    await expect(selectedChip(page)).toHaveText("112 × 32");
    await page
      .locator("ods-icon-field .chip")
      .first()
      .getByRole("button", { name: /^Remove icon/ })
      .click();

    await expect(selectedChip(page)).toHaveText("72 × 32");
  });

  test("an image is outlined at the size it is drawn", async ({ page }) => {
    await libraryItem(page, "Image").click();

    await expect(selectedChip(page)).toHaveText("160 × 120");
  });

  test("a debug grid can be selected but not resized", async ({ page }) => {
    await libraryItem(page, "Debug grid").click();

    await expect(page.locator(".selection.selected")).toHaveCount(1);
    await expect(
      page.locator(".selection.selected [data-resize-handle]")
    ).toHaveCount(0);
  });

  test("a second debug grid is not added: the first one is selected", async ({
    page,
  }) => {
    await libraryItem(page, "Debug grid").click();
    await libraryItem(page, "QR code").click();
    await libraryItem(page, "Debug grid").click();

    await expect(
      page.locator(".layer-row", { hasText: "debug_grid" })
    ).toHaveCount(1);
  });

  test("a polygon is moved with all of its points by dragging it", async ({
    page,
  }) => {
    await libraryItem(page, "Polygon").click();
    const before = await page.locator(".selection.selected").boundingBox();
    if (!before) throw new Error("The polygon outline is not visible");

    await page.mouse.move(
      before.x + before.width / 2,
      before.y + before.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      before.x + before.width / 2 + 60,
      before.y + before.height / 2 + 30,
      { steps: 6 }
    );
    await page.mouse.up();

    const after = await page.locator(".selection.selected").boundingBox();
    expect(after?.x).toBeGreaterThan(before.x + 40);
    expect(after?.width).toBeCloseTo(before.width, 0);
    await expect(selectedChip(page)).toHaveText("81 × 71");
  });
});

test.describe("resizing text by its handles", () => {
  const dragHandle = async (
    page: Page,
    handle: string,
    dx: number,
    dy: number
  ) => {
    const box = await page
      .locator(`.selection.selected [data-resize-handle="${handle}"]`)
      .boundingBox();
    if (!box) throw new Error(`The ${handle} handle is not visible`);
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + dx, startY + dy, { steps: 8 });
  };

  const outline = async (page: Page) => {
    const box = await page.locator(".selection.selected").boundingBox();
    if (!box) throw new Error("The outline is not visible");
    return box;
  };

  for (const anchor of ["lt", "mm", "rb"]) {
    test(`the outline follows the pointer while text anchored at ${anchor} is resized`, async ({
      page,
    }) => {
      await libraryItem(page, "Text").click();
      await chooseAnchor(page, anchor);
      const before = await outline(page);

      await dragHandle(page, "se", 60, 40);
      const during = await outline(page);
      await page.mouse.up();
      const after = await outline(page);

      // The outline grows while the button is down, and stays there when it is released.
      expect(during.width).toBeGreaterThan(before.width + 20);
      expect(Math.abs(after.width - during.width)).toBeLessThanOrEqual(2);
      expect(Math.abs(after.x - during.x)).toBeLessThanOrEqual(2);
    });
  }

  test("the corner opposite the handle stays where it is", async ({ page }) => {
    await libraryItem(page, "Text").click();
    await chooseAnchor(page, "mm");
    const before = await outline(page);

    await dragHandle(page, "se", 60, 40);
    await page.mouse.up();
    const after = await outline(page);

    expect(Math.abs(after.x - before.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(2);
    expect(after.width).toBeGreaterThan(before.width);
  });

  const FIXED_CORNER = {
    se: { x: 0, y: 0 },
    nw: { x: 1, y: 1 },
    ne: { x: 0, y: 1 },
    sw: { x: 1, y: 0 },
  } as const;
  const DRAG = {
    se: [50, 30],
    nw: [-50, -30],
    ne: [50, -30],
    sw: [-50, 30],
  } as const;

  for (const handle of ["se", "nw", "ne", "sw"] as const) {
    test(`${handle} handle: the opposite corner of centred text stays put`, async ({
      page,
    }) => {
      await libraryItem(page, "Text").click();
      await chooseAnchor(page, "mm");
      // Give the text room on every side, so no edge of the canvas limits the drag.
      await page.getByLabel("X", { exact: true }).fill("300");
      await page.getByLabel("X", { exact: true }).press("Tab");
      await page.getByLabel("Y", { exact: true }).fill("200");
      await page.getByLabel("Y", { exact: true }).press("Tab");
      const before = await outline(page);

      await dragHandle(page, handle, ...DRAG[handle]);
      await page.mouse.up();
      const after = await outline(page);

      const corner = FIXED_CORNER[handle];
      const fixed = (box: typeof before) => ({
        x: box.x + box.width * corner.x,
        y: box.y + box.height * corner.y,
      });
      expect(Math.abs(fixed(after).x - fixed(before).x)).toBeLessThanOrEqual(2);
      expect(Math.abs(fixed(after).y - fixed(before).y)).toBeLessThanOrEqual(2);
      expect(Math.abs(after.width - before.width)).toBeGreaterThan(10);
    });
  }
});

test.describe("the anchor picker", () => {
  test("shows the nine places and marks the one in use", async ({ page }) => {
    await libraryItem(page, "Text").click();

    await page.getByRole("button", { name: "Anchor", exact: true }).click();

    const grid = page.locator("ods-popover ods-anchor-picker");
    await expect(grid.getByRole("button")).toHaveCount(9);
    await expect(
      grid.getByRole("button", { name: "Top left", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      grid.getByRole("button", { name: "Center", exact: true })
    ).toHaveAttribute("aria-pressed", "false");
  });

  test("closes after a choice and shows it in the field", async ({ page }) => {
    await libraryItem(page, "Text").click();

    await chooseAnchor(page, "rb");

    await expect(page.locator("ods-popover ods-anchor-picker")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Anchor", exact: true })
    ).toContainText("Bottom right");
  });

  test("closes on Escape and on a click outside, without choosing", async ({
    page,
  }) => {
    await libraryItem(page, "Text").click();
    const anchor = page.getByRole("button", { name: "Anchor", exact: true });

    await anchor.click();
    await page.keyboard.press("Escape");
    await expect(page.locator("ods-popover ods-anchor-picker")).toHaveCount(0);

    await anchor.click();
    await page.locator(".inspector-title").click();
    await expect(page.locator("ods-popover ods-anchor-picker")).toHaveCount(0);
    await expect(anchor).toContainText("Top left");
  });

  test("keeps the text where it is drawn when the anchor changes", async ({
    page,
  }) => {
    await libraryItem(page, "Text").click();
    await page.getByLabel("X", { exact: true }).fill("300");
    await page.getByLabel("X", { exact: true }).press("Tab");
    const before = await page.locator(".selection.selected").boundingBox();

    await chooseAnchor(page, "mm");

    const after = await page.locator(".selection.selected").boundingBox();
    expect(Math.abs((after?.x ?? 0) - (before?.x ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((after?.y ?? 0) - (before?.y ?? 0))).toBeLessThanOrEqual(1);
    // The coordinates are now those of the centre, which moved with the anchor point.
    await expect(page.getByLabel("X", { exact: true })).not.toHaveValue("300");
  });
});

test.describe("the color picker", () => {
  const colorField = (page: Page, name: string) =>
    page.getByRole("button", { name, exact: true });

  test("offers the colors of the display, and the accent", async ({ page }) => {
    await libraryItem(page, "Rectangle").click();

    await colorField(page, "Outline").click();

    const picker = page.locator("ods-color-picker");
    // The Kitchen display shows black, white and red; an outline cannot be left out.
    await expect(picker.getByRole("button")).toHaveText([
      "Black",
      "White",
      "Red",
    ]);
  });

  test("offers no color for a fill, which may be empty", async ({ page }) => {
    await libraryItem(page, "Rectangle").click();

    await colorField(page, "Fill").click();

    await expect(
      page.locator("ods-color-picker").getByRole("button").first()
    ).toHaveText("None");
  });

  test("applies a color and closes", async ({ page }) => {
    await libraryItem(page, "Rectangle").click();

    await colorField(page, "Outline").click();
    await page
      .locator("ods-color-picker")
      .getByRole("button", { name: "Red", exact: true })
      .click();

    await expect(page.locator("ods-color-picker")).toHaveCount(0);
    await expect(colorField(page, "Outline")).toContainText("Red");
  });

  test("clears a color that may be empty", async ({ page }) => {
    await libraryItem(page, "Rectangle").click();
    await colorField(page, "Fill").click();
    await page
      .locator("ods-color-picker")
      .getByRole("button", { name: "Black", exact: true })
      .click();
    await expect(colorField(page, "Fill")).toContainText("Black");

    await page.getByRole("button", { name: "Clear color" }).click();

    await expect(colorField(page, "Fill")).toContainText("None");
  });
});

test.describe("the compact properties", () => {
  test("number fields are 28 px boxes with their unit inside", async ({
    page,
  }) => {
    await libraryItem(page, "Circle").click();

    const radius = page
      .locator("ods-value-field[data-field], ods-property-field")
      .first();
    const box = await page
      .locator("ods-property-field .box")
      .first()
      .boundingBox();

    expect(box?.height).toBeCloseTo(28, 0);
    await expect(radius).toBeVisible();
    await expect(page.locator("ods-property-field .unit").first()).toHaveText(
      "px"
    );
  });
});

test.describe("elements positioned by an expression", () => {
  test("are outlined where the backend put them, not at their stored position", async ({
    page,
  }) => {
    await libraryItem(page, "Circle").click();
    const canvas = await page.locator(".canvas").boundingBox();
    if (!canvas) throw new Error("The canvas is not visible");

    await page.locator('[data-toggle="x"]').click();
    const editor = page.locator('textarea[data-expression="x"]');
    await editor.fill("{{ 123 }}");
    await editor.press("Tab");

    const scale = canvas.width / 800;
    await expect
      .poll(async () => {
        const outline = await page.locator(".selection.selected").boundingBox();
        return (
          ((outline?.x ?? 0) + (outline?.width ?? 0) / 2 - canvas.x) / scale
        );
      })
      .toBeCloseTo(123, -1);
  });
});

test.describe("Align in Parent", () => {
  const canvasCentre = async (page: Page) => {
    const canvas = await page.locator(".canvas").boundingBox();
    if (!canvas) throw new Error("The canvas is not visible");
    return { x: canvas.x + canvas.width / 2, y: canvas.y + canvas.height / 2 };
  };

  test("centres a circle on the canvas", async ({ page }) => {
    await libraryItem(page, "Circle").click();

    await page.getByText("Align in Parent", { exact: true }).click();
    await page
      .locator("ods-anchor-picker")
      .getByRole("button", { name: "Center", exact: true })
      .click();

    const outline = await page.locator(".selection.selected").boundingBox();
    const centre = await canvasCentre(page);
    expect(
      Math.abs((outline?.x ?? 0) + (outline?.width ?? 0) / 2 - centre.x)
    ).toBeLessThanOrEqual(2);
    expect(
      Math.abs((outline?.y ?? 0) + (outline?.height ?? 0) / 2 - centre.y)
    ).toBeLessThanOrEqual(2);
  });

  test("puts text in a corner by the size the backend measured", async ({
    page,
  }) => {
    await libraryItem(page, "Text").click();

    await page.getByText("Align in Parent", { exact: true }).click();
    await page
      .locator("ods-anchor-picker")
      .getByRole("button", { name: "Bottom right", exact: true })
      .click();

    const outline = await page.locator(".selection.selected").boundingBox();
    const canvas = await page.locator(".canvas").boundingBox();
    const scale = (canvas?.width ?? 800) / 800;
    const right =
      ((outline?.x ?? 0) + (outline?.width ?? 0) - (canvas?.x ?? 0)) / scale;
    // The Kitchen display keeps a padding of 20 px.
    expect(Math.abs(right - 780)).toBeLessThanOrEqual(2);
  });

  test("is one undo step", async ({ page }) => {
    await libraryItem(page, "Circle").click();
    const before = await page.locator(".selection.selected").boundingBox();

    await page.getByText("Align in Parent", { exact: true }).click();
    await page
      .locator("ods-anchor-picker")
      .getByRole("button", { name: "Bottom right", exact: true })
      .click();
    await page.keyboard.press("Control+z");

    const after = await page.locator(".selection.selected").boundingBox();
    expect(after?.x).toBeCloseTo(before?.x ?? 0, 0);
  });
});

test.describe("snap guides", () => {
  /** Press in the middle of the box, away from its handles, and drag by (dx, dy). */
  const dragFrom = async (
    page: Page,
    box: { x: number; y: number; width: number; height: number },
    dx: number,
    dy: number
  ) => {
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + dx, startY + dy, { steps: 8 });
  };

  test("a moved element is pulled to the edge of another and a guide is drawn", async ({
    page,
  }) => {
    await libraryItem(page, "Rectangle").click();
    const first = await page.locator(".selection.selected").boundingBox();
    if (!first) throw new Error("The rectangle is not visible");
    // Move a second rectangle so its left edge is a few pixels off the first one's.
    await libraryItem(page, "Rectangle").click();
    const second = await page.locator(".selection.selected").boundingBox();
    if (!second) throw new Error("The second rectangle is not visible");

    await dragFrom(page, second, first.x - second.x + 2, 120);

    await expect(page.locator(".guide.vertical").first()).toBeVisible();
    await page.mouse.up();
    await expect(page.locator(".guide")).toHaveCount(0);
    const after = await page.locator(".selection.selected").boundingBox();
    expect(Math.abs((after?.x ?? 0) - first.x)).toBeLessThanOrEqual(1);
  });

  test("a resized element is pulled to the edge of another and a guide is drawn", async ({
    page,
  }) => {
    await libraryItem(page, "Rectangle").click();
    const first = await page.locator(".selection.selected").boundingBox();
    if (!first) throw new Error("The rectangle is not visible");
    await libraryItem(page, "Rectangle").click();
    const handle = page.locator(".selected [data-resize-handle='e']");
    const grip = await handle.boundingBox();
    if (!grip) throw new Error("The east handle is not visible");
    const second = await page.locator(".selection.selected").boundingBox();
    if (!second) throw new Error("The second rectangle is not visible");
    const gripX = grip.x + grip.width / 2;
    const gripY = grip.y + grip.height / 2;
    const toFirstEdge = first.x + first.width - (second.x + second.width);

    await page.mouse.move(gripX, gripY);
    await page.mouse.down();
    // Start the drag well away from the other edge, then bring it back to within a few pixels.
    await page.mouse.move(gripX + 40, gripY, { steps: 4 });
    await page.mouse.move(gripX + toFirstEdge + 2, gripY, { steps: 6 });

    await expect(page.locator(".guide.vertical").first()).toBeVisible();
    await page.mouse.up();
    await expect(page.locator(".guide")).toHaveCount(0);
    const after = await page.locator(".selection.selected").boundingBox();
    const right = (after?.x ?? 0) + (after?.width ?? 0);
    expect(Math.abs(right - (first.x + first.width))).toBeLessThanOrEqual(1);
  });

  test("Escape during a resize puts the size back", async ({ page }) => {
    await libraryItem(page, "Rectangle").click();
    const before = await page.locator(".selection.selected").boundingBox();
    const grip = await page
      .locator(".selected [data-resize-handle='e']")
      .boundingBox();
    if (!before || !grip) throw new Error("The rectangle is not visible");
    const gripX = grip.x + grip.width / 2;
    const gripY = grip.y + grip.height / 2;

    await page.mouse.move(gripX, gripY);
    await page.mouse.down();
    await page.mouse.move(gripX + 60, gripY, { steps: 6 });
    await page.keyboard.press("Escape");
    await page.mouse.up();

    const after = await page.locator(".selection.selected").boundingBox();
    expect(after?.width).toBeCloseTo(before.width, 0);
  });

  const place = async (
    page: Page,
    box: { x: number; y: number; width: number; height: number }
  ) => {
    await libraryItem(page, "Rectangle").click();
    for (const [label, value] of [
      ["X", box.x],
      ["Y", box.y],
      ["Width", box.width],
      ["Height", box.height],
    ] as const) {
      const field = page.getByLabel(label, { exact: true });
      await field.fill(String(value));
      await field.press("Tab");
    }
  };

  test("a moved element stays on the edge of the working area until it is pulled away", async ({
    page,
  }) => {
    await place(page, { x: 100, y: 100, width: 80, height: 40 });
    const box = await page.locator(".selection.selected").boundingBox();
    const area = await page.locator(".working-area").boundingBox();
    if (!box || !area) throw new Error("The rectangle is not visible");
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const toEdge = area.x - box.x;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    // Three pixels short of the edge it is pulled onto it; ten short is beyond a fresh pull.
    await page.mouse.move(startX + toEdge + 3, startY, { steps: 8 });
    await page.mouse.move(startX + toEdge + 10, startY, { steps: 4 });
    const held = await page.locator(".selection.selected").boundingBox();
    await page.mouse.up();

    expect(Math.abs((held?.x ?? 0) - area.x)).toBeLessThanOrEqual(1);
  });

  test("the equal gaps on both sides of a moved element are shown with their size", async ({
    page,
  }) => {
    await place(page, { x: 20, y: 100, width: 100, height: 40 });
    await place(page, { x: 300, y: 100, width: 100, height: 40 });
    await place(page, { x: 156, y: 100, width: 100, height: 40 });
    const box = await page.locator(".selection.selected").boundingBox();
    if (!box) throw new Error("The rectangle is not visible");
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 8, y, { steps: 6 });

    await expect(page.locator(".spacing span")).toHaveText(["40", "40"]);
    await page.mouse.up();
    await expect(page.locator(".spacing")).toHaveCount(0);
  });

  test("holding Ctrl while dragging turns snapping off", async ({ page }) => {
    await libraryItem(page, "Rectangle").click();
    const first = await page.locator(".selection.selected").boundingBox();
    await libraryItem(page, "Rectangle").click();
    const second = await page.locator(".selection.selected").boundingBox();
    if (!first || !second) throw new Error("A rectangle is not visible");

    await page.keyboard.down("Control");
    await dragFrom(page, second, first.x - second.x + 2, 120);

    await expect(page.locator(".guide")).toHaveCount(0);
    await page.mouse.up();
    await page.keyboard.up("Control");
  });
});

test.describe("the number steppers", () => {
  test("show on hover and step the value, ten with Shift", async ({ page }) => {
    await libraryItem(page, "Circle").click();
    const field = page.getByLabel("Radius", { exact: true });
    const before = Number(await field.inputValue());
    const box = page
      .locator("ods-property-field")
      .filter({ has: field })
      .locator(".box");

    await box.hover();
    await box.getByRole("button", { name: "Increase" }).click();
    await expect(field).toHaveValue(String(before + 1));

    await box
      .getByRole("button", { name: "Decrease" })
      .click({ modifiers: ["Shift"] });
    await expect(field).toHaveValue(String(before - 9));
  });
});

test.describe("the sections", () => {
  test("open and close from their title, which shows an arrow", async ({
    page,
  }) => {
    await libraryItem(page, "Circle").click();
    const layout = page.locator("details.inspector-section").first();

    await expect(layout).toHaveAttribute("open", "");
    await layout.locator(":scope > summary").click();
    await expect(layout).not.toHaveAttribute("open", "");
    await layout.locator(":scope > summary").click();
    await expect(layout).toHaveAttribute("open", "");
  });
});

test.describe("snapping a circle to the centre of the canvas", () => {
  test("never stores a coordinate between two pixels, so the preview still renders", async ({
    page,
  }) => {
    await libraryItem(page, "Circle").click();
    const canvas = await page.locator(".canvas").boundingBox();
    const outline = await page.locator(".selection.selected").boundingBox();
    if (!canvas || !outline) {
      throw new Error("The canvas or circle is not visible");
    }
    const centreX = canvas.x + canvas.width / 2;
    const startX = outline.x + outline.width / 2;
    const startY = outline.y + outline.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    // Stop three pixels short of the vertical centre line of the canvas.
    await page.mouse.move(centreX - 3, startY + 40, { steps: 10 });
    await expect(page.locator(".guide.vertical").first()).toBeVisible();
    await page.mouse.up();

    for (const label of ["Center X", "Center Y"]) {
      const value = await page.getByLabel(label, { exact: true }).inputValue();
      expect(Number.isInteger(Number(value)), `${label} = ${value}`).toBe(true);
    }
    await expect(page.getByText("Could not render the preview")).toHaveCount(0);
  });
});

test.describe("the icon picker", () => {
  test("searches the icons the renderer draws and sets the icon", async ({
    page,
  }) => {
    await libraryItem(page, "Icon").click();

    await page
      .getByRole("button", { name: "MDI icon name", exact: true })
      .click();
    const picker = page.locator("ods-icon-picker");
    await picker.getByRole("searchbox").fill("thermo");
    await expect(picker.getByRole("button")).toHaveCount(2);
    await picker
      .getByRole("button", { name: "thermometer", exact: true })
      .click();

    await expect(picker).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "MDI icon name", exact: true })
    ).toContainText("thermometer");
  });

  test("says when nothing matches", async ({ page }) => {
    await libraryItem(page, "Icon").click();
    await page
      .getByRole("button", { name: "MDI icon name", exact: true })
      .click();

    await page.locator("ods-icon-picker").getByRole("searchbox").fill("zzzz");

    await expect(page.getByText("No icons found")).toBeVisible();
  });

  test("builds a row of icons: add, replace, reorder and remove", async ({
    page,
  }) => {
    await libraryItem(page, "Icon sequence").click();
    const chips = page.locator("ods-icon-field .chip");
    await expect(chips).toHaveCount(3);

    await page.getByRole("button", { name: "Add icon" }).click();
    await page.locator("ods-icon-picker").getByRole("searchbox").fill("lock");
    await page
      .locator("ods-icon-picker")
      .getByRole("button", { name: "lock", exact: true })
      .click();
    await expect(chips).toHaveCount(4);
    await expect(chips.last()).toHaveAttribute("data-icon", "lock");

    await chips.last().getByRole("button", { name: "Move left" }).click();
    await expect(chips.nth(2)).toHaveAttribute("data-icon", "lock");

    await chips
      .first()
      .getByRole("button", { name: /^Remove icon/ })
      .click();
    await expect(chips).toHaveCount(3);
  });

  test("never removes the last icon of a row", async ({ page }) => {
    await libraryItem(page, "Icon sequence").click();
    const chips = page.locator("ods-icon-field .chip");
    const removeFirst = () =>
      chips
        .first()
        .getByRole("button", { name: /^Remove icon/ })
        .click();
    await removeFirst();
    await removeFirst();

    await expect(chips).toHaveCount(1);
    await expect(
      chips.first().getByRole("button", { name: /^Remove icon/ })
    ).toBeDisabled();
  });
});

test.describe("the image picker", () => {
  test("shows where the image comes from and takes an address", async ({
    page,
  }) => {
    await libraryItem(page, "Image").click();
    const field = page
      .locator(".properties")
      .getByRole("button", { name: "Image", exact: true });
    await expect(field).toContainText("/media/local/image.png");

    await field.click();
    const address = page
      .locator("ods-image-picker")
      .getByLabel("Address or path");
    await address.fill("camera.front_door");
    await address.press("Tab");

    await expect(page.locator("ods-image-picker")).toHaveCount(0);
    await expect(field).toContainText("camera.front_door");
  });

  test("offers the media browser and the camera and image entities", async ({
    page,
  }) => {
    await libraryItem(page, "Image").click();

    await page
      .locator(".properties")
      .getByRole("button", { name: "Image", exact: true })
      .click();

    const picker = page.locator("ods-image-picker");
    await expect(picker.getByLabel("Choose from media")).toBeVisible();
    await expect(picker.getByLabel("Camera or image entity")).toBeVisible();
  });
});

test.describe("the fields of a container", () => {
  test("are the controls of every other element", async ({ page }) => {
    await libraryItem(page, "Container").click();

    await expect(
      page.getByRole("button", { name: "Fill", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Outline", exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("spinbutton", { name: "Outline width" })
    ).toBeVisible();
    await expect(page.locator("ods-value-field")).toHaveCount(5);
    await expect(page.locator("ha-form")).toHaveCount(0);
  });

  test("pick their colors from the display", async ({ page }) => {
    await libraryItem(page, "Container").click();

    await page.getByRole("button", { name: "Outline", exact: true }).click();

    await expect(
      page.locator("ods-color-picker").getByRole("button")
    ).toHaveText(["Black", "White", "Red"]);
  });
});

test.describe("elements outside the canvas", () => {
  test("can be dragged out of the display and stay there", async ({ page }) => {
    await libraryItem(page, "Circle").click();
    const canvas = await page.locator(".canvas").boundingBox();
    const outline = await page.locator(".selection.selected").boundingBox();
    if (!canvas || !outline) {
      throw new Error("The canvas or circle is not visible");
    }
    const startX = outline.x + outline.width / 2;
    const startY = outline.y + outline.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(canvas.x - 20, startY, { steps: 12 });
    await page.mouse.up();

    const after = await page.locator(".selection.selected").boundingBox();
    expect(after?.x).toBeLessThan(canvas.x);
    await expect(page.getByText("Could not render the preview")).toHaveCount(0);
  });

  test("keep the layout section on top for every kind of element", async ({
    page,
  }) => {
    await libraryItem(page, "Circle").click();
    await expect(
      page.locator("details.inspector-section > summary").first()
    ).toHaveText("Layout");
  });
});

test.describe("the sections of the properties", () => {
  test("show a dot when something is not at its default, and reset puts it back in one step", async ({
    page,
  }) => {
    await libraryItem(page, "Circle").click();
    const appearance = page.locator(".inspector-section", {
      hasText: "Appearance",
    });
    await expect(appearance.locator(".changed-dot")).toHaveCount(0);
    await expect(appearance.getByRole("button", { name: "reset" })).toHaveCount(
      0
    );

    const outlineWidth = page.getByLabel("Outline width", { exact: true });
    const defaultWidth = await outlineWidth.inputValue();
    await outlineWidth.fill("7");
    await outlineWidth.press("Tab");
    await expect(appearance.locator(".changed-dot")).toHaveCount(1);

    await appearance.getByRole("button", { name: "reset" }).click();

    await expect(outlineWidth).toHaveValue(defaultWidth);
    await expect(appearance.locator(".changed-dot")).toHaveCount(0);
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(outlineWidth).toHaveValue("7");
  });

  test("the Hidden switch of an element hides it and shows it again", async ({
    page,
  }) => {
    await libraryItem(page, "Circle").click();
    const hidden = page.getByRole("switch", { name: "Hidden" });
    await expect(hidden).not.toBeChecked();

    await hidden.click();

    await expect(hidden).toBeChecked();
    await expect(page.locator(".selection.selected.hidden")).toHaveCount(1);
    await hidden.click();
    await expect(page.locator(".selection.selected.hidden")).toHaveCount(0);
  });
});

test.describe("the advanced fields", () => {
  test("are closed until asked for, and open again when one has been changed", async ({
    page,
  }) => {
    await libraryItem(page, "Text").click();
    const advanced = page.locator(".properties .disclosure", {
      hasText: "Advanced",
    });
    const strokeWidth = page.getByLabel("Stroke width", { exact: true });
    await expect(strokeWidth).toBeHidden();

    await advanced.locator("summary").click();
    await strokeWidth.fill("2");
    await strokeWidth.press("Tab");
    // Another element and back: the panel is built again, now with a changed advanced field.
    await libraryItem(page, "Circle").click();
    await page.locator(".layer-row", { hasText: "text_1" }).click();

    await expect(strokeWidth).toBeVisible();
  });
});

test.describe("the series of a history plot", () => {
  test("are picked with an entity picker each, and added and removed", async ({
    page,
  }) => {
    await libraryItem(page, "History plot").click();
    const cards = page.locator("[data-series]");
    await expect(cards).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "Remove series 1" })
    ).toBeDisabled();

    const entity = cards.first().getByLabel("Entity", { exact: true });
    await entity.fill("sensor.kitchen_power");
    await entity.press("Tab");
    await expect(entity).toHaveValue("sensor.kitchen_power");

    await page.getByRole("button", { name: "Add series" }).click();
    await expect(cards).toHaveCount(2);
    await page.getByRole("button", { name: "Remove series 2" }).click();
    await expect(cards).toHaveCount(1);
    await expect(
      cards.first().getByLabel("Entity", { exact: true })
    ).toHaveValue("sensor.kitchen_power");
  });
});
