import { expect, test } from "@playwright/test";
import { callCount, openDashboard, openGallery } from "./helpers";

/**
 * A preview that reads Home Assistant entities is composed again, after a short wait, when
 * one of them changes, and only then.
 */

const COMPOSE = "opendisplay_studio/compose_preview";

test.beforeEach(async ({ page }) => {
  await openGallery(page);
  await openDashboard(page, "Hallway overview");
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
});

test("composes again when an entity the expressions read changes", async ({
  page,
}) => {
  const before = await callCount(page, COMPOSE);

  await page.evaluate(() =>
    window.__ODS_E2E__.setState("sensor.kitchen_temperature", "23.0")
  );

  await expect.poll(() => callCount(page, COMPOSE)).toBe(before + 1);
});

test("ignores changes to entities nothing reads", async ({ page }) => {
  const before = await callCount(page, COMPOSE);

  await page.evaluate(() => window.__ODS_E2E__.setState("sensor.other", "1"));
  await page.waitForTimeout(900);

  expect(await callCount(page, COMPOSE)).toBe(before);
});

test("waits for a burst of changes to settle before composing", async ({
  page,
}) => {
  const before = await callCount(page, COMPOSE);

  for (const value of ["22", "23", "24", "25"]) {
    await page.evaluate(
      (state) =>
        window.__ODS_E2E__.setState("sensor.kitchen_temperature", state),
      value
    );
  }

  await expect.poll(() => callCount(page, COMPOSE)).toBe(before + 1);
  await page.waitForTimeout(900);
  expect(await callCount(page, COMPOSE)).toBe(before + 1);
});
