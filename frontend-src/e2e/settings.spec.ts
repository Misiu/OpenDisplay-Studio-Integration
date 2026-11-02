import { expect, test, type Page } from "@playwright/test";
import {
  lastCall,
  libraryItem,
  openDashboard,
  openGallery,
  openKitchen,
} from "./helpers";

/**
 * The settings of the whole studio, opened from the list of dashboards: an overview, the
 * fonts the user installs and every widget there is.
 */

const LORA = {
  name: "Lora-Regular.ttf",
  mimeType: "font/ttf",
  buffer: Buffer.from("not really a font, the harness does not read it"),
};

const settingsButton = (page: Page) =>
  page.getByRole("button", { name: "Open settings" });

const openSettings = async (page: Page) => {
  await openGallery(page);
  await settingsButton(page).click();
  await expect(
    page.getByRole("heading", { name: "Settings", exact: true })
  ).toBeVisible();
};

const openTab = async (page: Page, name: string) => {
  await page.getByRole("tab", { name }).click();
};

const installFont = async (page: Page, file = LORA) => {
  await page.locator("ods-settings-fonts input[type=file]").setInputFiles(file);
};

const fontRow = (page: Page, file: string) =>
  page.locator(`ods-settings-fonts li[data-font="${file}"]`);

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
});

test("the list of dashboards has a Settings button that opens the settings and back", async ({
  page,
}) => {
  await openSettings(page);

  await page.getByRole("button", { name: "Back to dashboards" }).click();

  await expect(
    page.getByRole("heading", { name: "Dashboards", exact: true })
  ).toBeVisible();
});

test("the overview counts dashboards, elements, widgets and fonts", async ({
  page,
}) => {
  await openSettings(page);

  const tiles = page.locator("ods-settings-overview .tile");
  await expect(tiles).toHaveCount(4);
  await expect(tiles.filter({ hasText: "Dashboards" })).toContainText("3");
  await expect(tiles.filter({ hasText: "Fonts installed" })).toContainText("9");
});

test("the fonts that come with OpenDisplay are listed and cannot be removed", async ({
  page,
}) => {
  // Two of the renderer and four of the integration: Carlito and Atkinson Hyperlegible.
  await openSettings(page);
  await openTab(page, "Fonts");

  for (const name of [
    "Carlito-Regular.ttf",
    "Carlito-Bold.ttf",
    "AtkinsonHyperlegible-Regular.ttf",
    "AtkinsonHyperlegible-Bold.ttf",
    "Inter-SemiBold.ttf",
    "IBMPlexMono-Medium.ttf",
    "BarlowCondensed-Bold.ttf",
  ]) {
    await expect(fontRow(page, name)).toContainText("Comes with OpenDisplay");
    await expect(
      fontRow(page, name).getByRole("button", { name: /Remove/ })
    ).toHaveCount(0);
  }
  const bundled = fontRow(page, "ppb.ttf");
  await expect(bundled).toContainText("Comes with OpenDisplay");
  await expect(bundled.getByRole("button", { name: /Remove/ })).toHaveCount(0);
  await expect(bundled.locator("ods-font-sample .sample")).toBeVisible();
});

test("an installed font is listed with its picture and is not used yet", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Fonts");

  await installFont(page);

  const row = fontRow(page, LORA.name);
  await expect(row).toContainText("Lora-Regular");
  await expect(row).toContainText("Not used");
  await expect(row.locator("ods-font-sample .sample")).toBeVisible();
  await expect(
    await page.evaluate(
      () =>
        window.__ODS_E2E__
          .calls()
          .filter((call) => call.type === "opendisplay_studio/install_font")
          .length
    )
  ).toBe(1);
});

test("a file that is not a font is refused and says why", async ({ page }) => {
  await openSettings(page);
  await openTab(page, "Fonts");

  await installFont(page, {
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("hello"),
  });
  await expect(page.locator("ods-settings-fonts ha-alert")).toContainText(
    "notes.txt is not a .ttf or .otf file"
  );

  await installFont(page, { ...LORA, name: "broken.ttf" });
  await expect(page.locator("ods-settings-fonts ha-alert")).toContainText(
    "That file is not a font the renderer can read"
  );
  await expect(fontRow(page, "broken.ttf")).toHaveCount(0);
});

test("a font installed twice is refused", async ({ page }) => {
  await openSettings(page);
  await openTab(page, "Fonts");
  await installFont(page);
  await expect(fontRow(page, LORA.name)).toBeVisible();

  await installFont(page);

  await expect(page.locator("ods-settings-fonts ha-alert")).toContainText(
    "A font with that name is already installed"
  );
});

test("a font nobody uses is removed after one confirmation", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Fonts");
  await installFont(page);

  await fontRow(page, LORA.name)
    .getByRole("button", { name: `Remove ${LORA.name}` })
    .click();
  await expect(page.locator("ods-confirm-dialog")).toContainText(
    "The font file is deleted"
  );
  await page
    .locator("ods-confirm-dialog")
    .getByRole("button", { name: "Remove font" })
    .click();

  await expect(fontRow(page, LORA.name)).toHaveCount(0);
});

test("the font field lists every installed font in its own letters", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Fonts");
  await installFont(page);
  await page.getByRole("button", { name: "Back to dashboards" }).click();
  await page
    .getByRole("button", { name: "Open dashboard Kitchen display" })
    .click();
  await libraryItem(page, "Text").click();

  await page.locator("ods-font-field .trigger").first().click();

  const options = page.locator("ods-popover [role=option]");
  await expect(options).toHaveCount(10);
  await expect(
    options
      .filter({ hasText: "Lora Regular" })
      .locator("ods-font-sample .sample")
  ).toBeVisible();
});

const useLoraInATextAndSave = async (page: Page) => {
  await openDashboard(page, "Kitchen display");
  await libraryItem(page, "Text").click();
  await page.locator("ods-font-field .trigger").first().click();
  await page.locator(`ods-popover [data-font="${LORA.name}"]`).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
};

test("a font in use says where before it is removed, and the dashboard keeps its choice", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Fonts");
  await installFont(page);
  await page.getByRole("button", { name: "Back to dashboards" }).click();
  await useLoraInATextAndSave(page);
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();
  await settingsButton(page).click();
  await openTab(page, "Fonts");

  const row = fontRow(page, LORA.name);
  await expect(row).toContainText("Used in 1 dashboard");
  await row.getByRole("button", { name: `Remove ${LORA.name}` }).click();
  await expect(page.locator("ods-confirm-dialog")).toContainText(
    "Kitchen display"
  );
  await expect(page.locator("ods-confirm-dialog")).toContainText(
    "default font"
  );

  await page
    .locator("ods-confirm-dialog")
    .getByRole("button", { name: "Cancel" })
    .click();
  await expect(row).toBeVisible();

  await row.getByRole("button", { name: `Remove ${LORA.name}` }).click();
  await page
    .locator("ods-confirm-dialog")
    .getByRole("button", { name: "Remove font" })
    .click();
  await expect(fontRow(page, LORA.name)).toHaveCount(0);

  const saved = (await lastCall(
    page,
    "opendisplay_studio/update_dashboard"
  )) as {
    dashboard: { items: Array<{ primitive?: { font?: string } }> };
  };
  expect(
    saved.dashboard.items.some((item) => item.primitive?.font === LORA.name)
  ).toBe(true);
});

test("a font that is gone is marked in the font field instead of being swapped", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Fonts");
  await installFont(page);
  await page.getByRole("button", { name: "Back to dashboards" }).click();
  await useLoraInATextAndSave(page);
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();
  await settingsButton(page).click();
  await openTab(page, "Fonts");
  await fontRow(page, LORA.name)
    .getByRole("button", { name: /Remove/ })
    .click();
  await page
    .locator("ods-confirm-dialog")
    .getByRole("button", { name: "Remove font" })
    .click();
  await page.getByRole("button", { name: "Back to dashboards" }).click();

  await page
    .getByRole("button", { name: "Open dashboard Kitchen display" })
    .click();
  await page
    .locator("ods-structure")
    .getByText("text_1", { exact: true })
    .click();

  await expect(
    page.locator("ods-font-field .name.missing").first()
  ).toContainText(`${LORA.name} (not installed)`);
});

test("the widgets tab lists every widget and picks up a package after a reload", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Widgets");

  await expect(
    page.locator("ods-settings-widgets li[data-widget=gauge]")
  ).toContainText("Gauge");
  await expect(
    page.locator("ods-settings-widgets li[data-widget=hello-world]")
  ).toHaveCount(0);

  await page.evaluate(() => window.__ODS_E2E__.installPackage("hello"));
  await page.getByRole("button", { name: "Reload widgets" }).click();

  await expect(
    page.locator("ods-settings-widgets li[data-widget=hello-world]")
  ).toContainText("Yours");
});

/** A section of the inspector, opened and scrolled to. */
const openSection = async (page: Page, name: RegExp) => {
  const section = page.locator("details.inspector-section", {
    has: page.locator("summary", { hasText: name }),
  });
  await section.scrollIntoViewIfNeeded();
  if ((await section.getAttribute("open")) === null) {
    await section.locator("summary").click();
  }
};

test("a widget has a font and a text size that is automatic until a size is typed", async ({
  page,
}) => {
  await openKitchen(page);
  await libraryItem(page, "Sensor list").click();
  await openSection(page, /Appearance/);

  await expect(page.locator("ods-font-field").first()).toBeVisible();
  const size = page.getByRole("spinbutton", { name: "Text size" });
  await expect(size).toHaveValue("");
  await expect(size).toHaveAttribute("placeholder", "Auto");

  await size.fill("14");
  await size.press("Enter");
  await page.getByRole("button", { name: "Save", exact: true }).click();

  const saved = (await lastCall(
    page,
    "opendisplay_studio/update_dashboard"
  )) as {
    dashboard: {
      items: Array<{
        name: string;
        widget?: { options: { textSize?: number | null; font?: string } };
      }>;
    };
  };
  const list = saved.dashboard.items.find(
    (item) => item.name === "sensor-list_1"
  );
  expect(list?.widget?.options.textSize).toBe(14);
  expect(list?.widget?.options.font).toBe("ppb.ttf");
});

test("each tab says what it is for and what can be done there", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Fonts");
  const about = page.locator("ods-settings .about");
  await expect(about).toContainText("Fonts decide how every text is drawn");
  await expect(about.locator("li")).toHaveText([
    /Install/,
    /Preview/,
    /Remove/,
  ]);

  await openTab(page, "Widgets");

  await expect(about).toContainText("Widgets read your entities");
  await expect(about.locator("li.soon")).toHaveCount(3);
  await expect(about.locator("li.soon").first()).toContainText("Coming soon");
});

test("a widget in the list has a picture of it", async ({ page }) => {
  await openSettings(page);
  await openTab(page, "Widgets");

  const gauge = page.locator("ods-settings-widgets li[data-widget=gauge]");

  await expect(gauge.locator(".picture img")).toBeVisible();
  await expect(gauge.locator(".picture img")).toHaveAttribute("alt", "Gauge");
});

test("adding a package is shown but not yet possible, and a widget card has no footer", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Widgets");

  await expect(
    page.locator("ods-settings-widgets .toolbar ha-button[disabled]")
  ).toContainText("Add package");
  await expect(
    page.locator("ods-settings-widgets .toolbar .soon")
  ).toContainText("Coming soon");
  const gauge = page.locator("ods-settings-widgets li[data-widget=gauge]");
  await expect(gauge.getByRole("switch")).toHaveCount(0);
  await expect(gauge.locator("ha-button")).toHaveCount(0);
});

test("the properties of an element have no Hidden switch and no remove button", async ({
  page,
}) => {
  await openKitchen(page);
  await libraryItem(page, "Circle").click();

  await expect(page.getByRole("switch", { name: "Hidden" })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Remove element" })
  ).toHaveCount(0);
});

test("the Calendar has a text size that is automatic until a size is typed", async ({
  page,
}) => {
  await openKitchen(page);
  await libraryItem(page, "Calendar").click();
  await openSection(page, /Upcoming and agenda/);

  const size = page.getByRole("spinbutton", { name: "Text size" });

  await size.scrollIntoViewIfNeeded();
  await expect(size).toHaveValue("");
  await expect(size).toHaveAttribute("placeholder", "Auto");
});

test("a font is shown in its own letters, loaded by the browser from the integration", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Fonts");

  const sample = fontRow(page, "ppb.ttf").locator("ods-font-sample .sample");

  await expect(sample).toHaveText("Aa Zażółć gęślą 0123");
  await expect(sample).toHaveCSS("font-family", /ods-font-ppb_ttf-1/);
  await expect
    .poll(() =>
      page.evaluate(() => [...document.fonts].map((face) => face.family))
    )
    .toContain("ods-font-ppb_ttf-1");
});

test("the sample takes the color of the text, so it follows a dark theme", async ({
  page,
}) => {
  await openSettings(page);
  await openTab(page, "Fonts");
  await page.evaluate(() =>
    document
      .querySelector("ods-app")
      ?.style.setProperty("--primary-text-color", "rgb(240, 240, 240)")
  );

  const sample = fontRow(page, "ppb.ttf").locator("ods-font-sample .sample");

  await expect(sample).toHaveCSS("color", "rgb(240, 240, 240)");
  await expect(
    fontRow(page, "ppb.ttf").locator("ods-font-sample img")
  ).toHaveCount(0);
});

test("the icon picker lists the icons with their names", async ({ page }) => {
  await openKitchen(page);
  await libraryItem(page, "Icon").click();

  await page.locator("ods-icon-field .trigger").first().click();

  const home = page.locator('ods-icon-picker button[title="home"]');
  await expect(home).toBeVisible();
  await expect(home.locator("ha-icon, .glyph")).toHaveCount(1);
});

test("the school timetable has a grid line color that is Auto until one is picked", async ({
  page,
}) => {
  await openKitchen(page);
  await libraryItem(page, "School timetable").click();
  await openSection(page, /Appearance/);

  const field = page.locator("ods-value-field", {
    has: page.getByRole("button", { name: "Grid line color" }),
  });

  await field.scrollIntoViewIfNeeded();
  await expect(field).toContainText("Auto");
});

test("the font field shows the name of the font, and its samples are in the list", async ({
  page,
}) => {
  await openKitchen(page);
  await libraryItem(page, "Text").click();

  const trigger = page.locator("ods-font-field .trigger").first();

  await expect(trigger).toContainText("Poppins Bold");
  await expect(trigger.locator("ods-font-sample")).toHaveCount(0);
  await trigger.click();
  await expect(
    page.locator("ods-popover [role=option] ods-font-sample").first()
  ).toBeVisible();
});
