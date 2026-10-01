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
  const primitives = page
    .locator("ods-library .catalog-section")
    .nth(1)
    .locator(".catalog-item strong");

  await expect(primitives).toHaveText([
    "Text",
    "Multiline text",
    "Rectangle",
    "Rectangle pattern",
    "Line",
    "Polygon",
    "Circle",
    "Arc",
    "Ellipse",
    "Icon",
    "Icon sequence",
    "QR code",
    "Image",
    "Progress bar",
    "History plot",
    "Debug grid",
  ]);
  await expect(
    page.locator("ods-library .catalog-section").nth(1).locator(".count")
  ).toHaveText("16");
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
    await page.getByRole("button", { name: "Reset" }).click();

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
    await page.getByRole("button", { name: "Reset" }).click();

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
  test("a polygon is outlined by its points, and follows edits of them", async ({
    page,
  }) => {
    await libraryItem(page, "Polygon").click();
    // The starting triangle is 81 wide and 71 tall, inclusive.
    await expect(selectedChip(page)).toHaveText("81 × 71");

    const points = page.getByRole("textbox", { name: "Points", exact: true });
    await points.fill("10, 10\n110, 10\n110, 60\n10, 60");
    await points.press("Tab");

    await expect(selectedChip(page)).toHaveText("101 × 51");
  });

  test("keeps the points it has while what is typed is not yet a list of pairs", async ({
    page,
  }) => {
    await libraryItem(page, "Polygon").click();

    const points = page.getByRole("textbox", { name: "Points", exact: true });
    await points.fill("10, 10\nnot a point");
    await points.press("Tab");

    await expect(selectedChip(page)).toHaveText("81 × 71");
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

  test("a row of icons is outlined by its icons, and grows with the list", async ({
    page,
  }) => {
    await libraryItem(page, "Icon sequence").click();

    // Three icons of 32 px, a quarter of that apart.
    await expect(selectedChip(page)).toHaveText("112 × 32");
    const icons = page.getByRole("textbox", { name: "Icons", exact: true });
    await icons.fill("home\nstar");
    await icons.press("Tab");
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
      "Accent",
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
