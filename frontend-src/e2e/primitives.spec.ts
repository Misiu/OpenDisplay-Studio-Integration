import { expect, test, type Page } from "@playwright/test";
import { libraryItem, openKitchen, withoutRandomUuid } from "./helpers";

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
    await page.getByRole("textbox", { name: "Content" }).fill(text);
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
    await page
      .getByRole("textbox", { name: "Text", exact: true })
      .fill("Living room");
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
