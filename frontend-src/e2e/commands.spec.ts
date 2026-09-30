import { expect, test, type Page } from "@playwright/test";
import { openKitchen, withoutRandomUuid } from "./helpers";

/**
 * Undo, redo, delete, hide and lock are commands in one registry. Their buttons and
 * their keyboard shortcuts must agree on what is possible and what it is called.
 */

const kitchenWidget = (page: Page) =>
  page.locator('.selection[data-item-id="temperature"]');
const layerRow = (page: Page) =>
  page.locator('.layer-row[data-item-id="temperature"]');
const undoButton = (page: Page) => page.getByRole("button", { name: "Undo" });
const redoButton = (page: Page) => page.getByRole("button", { name: "Redo" });

/** Select the widget and hide it: one undoable change, done with a row button. */
const hideKitchen = async (page: Page) => {
  await kitchenWidget(page).click();
  await page.getByRole("button", { name: "Hide Kitchen" }).click();
  await expect(
    page.getByRole("button", { name: "Show Kitchen" })
  ).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await withoutRandomUuid(page);
  await openKitchen(page);
});

test.describe("undo and redo", () => {
  test("start out unavailable and say which keys run them", async ({
    page,
  }) => {
    await expect(undoButton(page)).toBeDisabled();
    await expect(redoButton(page)).toBeDisabled();
    await expect(undoButton(page)).toHaveAttribute(
      "title",
      /^Undo \((Ctrl\+Z|⌘Z)\)$/
    );
    await expect(redoButton(page)).toHaveAttribute(
      "title",
      /^Redo \((Ctrl\+Shift\+Z|⌘⇧Z)\)$/
    );
  });

  test("run from the keyboard and from the buttons alike", async ({ page }) => {
    await hideKitchen(page);
    await expect(undoButton(page)).toBeEnabled();

    await page.keyboard.press("Control+z");
    await expect(
      page.getByRole("button", { name: "Hide Kitchen" })
    ).toBeVisible();
    await expect(redoButton(page)).toBeEnabled();

    await page.keyboard.press("Control+y");
    await expect(
      page.getByRole("button", { name: "Show Kitchen" })
    ).toBeVisible();

    await undoButton(page).click();
    await expect(
      page.getByRole("button", { name: "Hide Kitchen" })
    ).toBeVisible();
    await page.keyboard.press("Control+Shift+z");
    await expect(
      page.getByRole("button", { name: "Show Kitchen" })
    ).toBeVisible();
  });

  test("do nothing, and keep the buttons disabled, when there is nothing to do", async ({
    page,
  }) => {
    await page.keyboard.press("Control+z");
    await page.keyboard.press("Control+y");
    await expect(undoButton(page)).toBeDisabled();
    await expect(redoButton(page)).toBeDisabled();
    await expect(page.locator(".layer-row")).toHaveCount(1);
  });

  test("leave the keys to a field while the user is typing in it", async ({
    page,
  }) => {
    await hideKitchen(page);
    const name = page.getByRole("textbox", { name: "Dashboard name" });
    await name.click();

    await page.keyboard.press("Control+z");

    await expect(
      page.getByRole("button", { name: "Show Kitchen" })
    ).toBeVisible();
  });
});

test.describe("delete", () => {
  test("asks first when Delete or Backspace is pressed on a selected element", async ({
    page,
  }) => {
    await kitchenWidget(page).click();

    for (const key of ["Delete", "Backspace"]) {
      await page.keyboard.press(key);
      const dialog = page.getByRole("dialog");
      await expect(
        dialog.getByRole("heading", { name: "Delete Kitchen?" })
      ).toBeVisible();
      await dialog.getByRole("button", { name: "Cancel" }).click();
      await expect(dialog).toHaveCount(0);
      await expect(layerRow(page)).toHaveCount(1);
    }
  });

  test("removes the element once confirmed, and undo brings it back", async ({
    page,
  }) => {
    await kitchenWidget(page).click();
    await page.keyboard.press("Delete");
    await page.getByRole("button", { name: "Delete element" }).click();
    await expect(page.locator(".layer-row")).toHaveCount(0);

    await page.keyboard.press("Control+z");
    await expect(layerRow(page)).toHaveCount(1);
  });

  test("does nothing without a selection", async ({ page }) => {
    await page.locator(".canvas").click({ position: { x: 700, y: 420 } });
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();

    await page.keyboard.press("Delete");
    await page.keyboard.press("Backspace");

    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("leaves Delete to a field while the user is typing in it", async ({
    page,
  }) => {
    await kitchenWidget(page).click();
    const x = page.locator('.properties input[data-field="x"]');
    await x.focus();

    await page.keyboard.press("Delete");
    await page.keyboard.press("Backspace");

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(layerRow(page)).toHaveCount(1);
  });

  test("is not available in the code view", async ({ page }) => {
    await kitchenWidget(page).click();
    await page.getByRole("button", { name: "Code", exact: true }).click();

    await page.keyboard.press("Delete");
    await page.getByRole("button", { name: "Design", exact: true }).click();

    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("is offered by the row button under the registry's name", async ({
    page,
  }) => {
    await layerRow(page).hover();
    const button = page.getByRole("button", { name: "Delete Kitchen" });
    await expect(button).toHaveAttribute("title", /^Delete \(Del\)$/);

    await button.click();

    await expect(
      page.getByRole("dialog").getByRole("heading", { name: "Delete Kitchen?" })
    ).toBeVisible();
  });
});

test.describe("hide and lock", () => {
  test("change name and icon with the state of the element", async ({
    page,
  }) => {
    await kitchenWidget(page).click();
    await page.getByRole("button", { name: "Lock Kitchen" }).click();

    await expect(
      page.getByRole("button", { name: "Unlock Kitchen" })
    ).toBeVisible();
    await expect(page.getByText("Position is locked")).toBeVisible();

    await page.getByRole("button", { name: "Unlock element position" }).click();

    await expect(
      page.getByRole("button", { name: "Lock Kitchen" })
    ).toBeVisible();
    await expect(page.getByText("Position is locked")).toHaveCount(0);
  });

  test("are one undo step each", async ({ page }) => {
    await hideKitchen(page);
    await page.getByRole("button", { name: "Lock Kitchen" }).click();

    await page.keyboard.press("Control+z");
    await expect(
      page.getByRole("button", { name: "Lock Kitchen" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Show Kitchen" })
    ).toBeVisible();

    await page.keyboard.press("Control+z");
    await expect(
      page.getByRole("button", { name: "Hide Kitchen" })
    ).toBeVisible();
  });
});
