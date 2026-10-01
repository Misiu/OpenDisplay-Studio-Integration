import { expect, test, type Locator, type Page } from "@playwright/test";
import { lastCall, openDashboard, openGallery } from "./helpers";

/**
 * Any field can hold an expression beside its literal. The `{}` toggle switches a field
 * between the two, and an expression on a position or size field takes that
 * part of the item away from the mouse.
 */

const reading = (page: Page) =>
  page.locator('.selection[data-item-id="reading"]');
const toggle = (page: Page, key: string) =>
  page.locator(`[data-toggle="${key}"]`);
const editor = (page: Page, key: string): Locator =>
  page.locator(`textarea[data-expression="${key}"]`);

const save = async (page: Page) => {
  await page.getByRole("button", { name: "Save", exact: true }).click();
  return (await lastCall(page, "opendisplay_studio/update_dashboard")) as {
    dashboard: { items: Array<Record<string, unknown>> };
  };
};

test.beforeEach(async ({ page }) => {
  await openGallery(page);
  await openDashboard(page, "Hallway overview");
  await page.locator(".layer-row").filter({ hasText: "Reading" }).click();
});

test("shows the expression a field holds instead of its literal", async ({
  page,
}) => {
  await expect(editor(page, "value")).toHaveValue(
    "{{ states('sensor.kitchen_temperature') }}"
  );
  await expect(toggle(page, "value")).toHaveAttribute("aria-pressed", "true");
  await expect(toggle(page, "x")).toHaveAttribute("aria-pressed", "false");
  await expect(editor(page, "x")).toHaveCount(0);
});

test("switching a field on starts from its current value and keeps the literal", async ({
  page,
}) => {
  await toggle(page, "size").click();

  await expect(editor(page, "size")).toHaveValue("{{ 32 }}");
  const saved = await save(page);
  expect(saved.dashboard.items[0]).toMatchObject({
    expressions: {
      value: "{{ states('sensor.kitchen_temperature') }}",
      size: "{{ 32 }}",
    },
    primitive: { size: 32 },
  });
});

test("switching a field off returns to its literal, and undo brings the expression back", async ({
  page,
}) => {
  await toggle(page, "value").click();

  await expect(editor(page, "value")).toHaveCount(0);
  await expect(toggle(page, "value")).toHaveAttribute("aria-pressed", "false");
  const saved = await save(page);
  expect(saved.dashboard.items[0]).not.toHaveProperty("expressions");

  await page.keyboard.press("Control+z");
  await expect(editor(page, "value")).toHaveCount(1);
});

test("commits an edited expression on blur, exactly as typed", async ({
  page,
}) => {
  await toggle(page, "size").click();
  await editor(page, "size").fill("{{ (states('sensor.a') | int) * 2 }}");
  await editor(page, "size").blur();

  const saved = await save(page);
  expect(saved.dashboard.items[0]).toMatchObject({
    expressions: { size: "{{ (states('sensor.a') | int) * 2 }}" },
  });
});

test("returns to the literal when the delimiters are cleared", async ({
  page,
}) => {
  await toggle(page, "size").click();
  await editor(page, "size").fill("48");
  await editor(page, "size").blur();

  await expect(editor(page, "size")).toHaveCount(0);
  const saved = await save(page);
  expect(saved.dashboard.items[0]).not.toHaveProperty("expressions.size");
});

test("offers a visibility expression on every item", async ({ page }) => {
  await toggle(page, "visible").click();

  await expect(editor(page, "visible")).toHaveValue("{{ true }}");
});

test.describe("locks", () => {
  const dragBy = async (page: Page, dx: number, dy: number) => {
    const box = await reading(page).boundingBox();
    if (!box) throw new Error("The element is not visible");
    // From the centre: the corners are resize handles.
    const centre = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    await page.mouse.move(centre.x, centre.y);
    await page.mouse.down();
    await page.mouse.move(centre.x + dx, centre.y + dy, { steps: 6 });
    await page.mouse.up();
    return box;
  };

  test("an item can be dragged while no position field is an expression", async ({
    page,
  }) => {
    const before = await reading(page).boundingBox();

    await dragBy(page, 60, 40);

    const after = await reading(page).boundingBox();
    expect(after?.x).toBeGreaterThan((before?.x ?? 0) + 20);
  });

  test("an expression on x pins the item and says why", async ({ page }) => {
    await toggle(page, "x").click();
    const before = await reading(page).boundingBox();

    await dragBy(page, 60, 40);

    const after = await reading(page).boundingBox();
    expect(after).toEqual(before);
    await expect(reading(page).locator(".expression-lock")).toHaveAttribute(
      "title",
      "Position is driven by an expression (x)"
    );
  });

  test("an expression on the size takes every handle away, but not moving", async ({
    page,
  }) => {
    await expect(reading(page).locator("[data-resize-handle]")).toHaveCount(8);

    await toggle(page, "size").click();

    await expect(reading(page).locator("[data-resize-handle]")).toHaveCount(0);
    await expect(reading(page).locator(".expression-lock")).toHaveCount(0);
  });

  test("an expression on the text locks nothing", async ({ page }) => {
    await expect(reading(page).locator(".expression-lock")).toHaveCount(0);
    await expect(reading(page).locator("[data-resize-handle]")).toHaveCount(8);
  });
});
