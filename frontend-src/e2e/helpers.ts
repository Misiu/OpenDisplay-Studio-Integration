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
