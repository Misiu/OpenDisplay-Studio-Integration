import { expect, type Page } from "@playwright/test";

/** Helpers shared by the specs that open the editor on the Kitchen dashboard. */

export const openGallery = async (page: Page) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Dashboards", exact: true })
  ).toBeVisible();
};

export const openDashboard = async (page: Page, name: string) => {
  await page.getByRole("button", { name: `Open dashboard ${name}` }).click();
  await expect(
    page.getByRole("button", { name: "Dashboards", exact: true })
  ).toBeVisible();
};

export const openKitchen = async (page: Page) => {
  await openGallery(page);
  await openDashboard(page, "Kitchen display");
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
};

/** Make the editor use its own id generator, as Home Assistant's insecure contexts do. */
export const withoutRandomUuid = async (page: Page) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, "randomUUID", {
      configurable: true,
      value: undefined,
    });
  });
};

export const lastCall = (page: Page, type: string) =>
  page.evaluate(
    (wanted) =>
      window.__ODS_E2E__.calls().findLast((call) => call.type === wanted),
    type
  );

export const callCount = (page: Page, type: string) =>
  page.evaluate(
    (wanted) =>
      window.__ODS_E2E__.calls().filter((call) => call.type === wanted).length,
    type
  );

/** A tile of the element library. Its name starts with an icon glyph, so match by text. */
export const libraryItem = (page: Page, name: string) =>
  page.locator("ods-library .catalog-item").filter({
    has: page.locator("strong", { hasText: new RegExp(`^${name}$`) }),
  });

/** The names of the nine anchors as the anchor picker titles them. */
const ANCHOR_NAMES: Record<string, string> = {
  lt: "Top left",
  mt: "Top center",
  rt: "Top right",
  lm: "Middle left",
  mm: "Center",
  rm: "Middle right",
  lb: "Bottom left",
  mb: "Bottom center",
  rb: "Bottom right",
};

/** Opens the anchor picker of the selected element and picks one of the nine places. */
export const chooseAnchor = async (page: Page, anchor: string) => {
  await page.getByRole("button", { name: "Anchor", exact: true }).click();
  await page
    .locator("ods-popover ods-anchor-picker")
    .getByRole("button", { name: ANCHOR_NAMES[anchor], exact: true })
    .click();
};
