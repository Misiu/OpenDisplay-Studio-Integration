import { expect, test, type Page } from "@playwright/test";
import {
  lastCall,
  libraryItem,
  openKitchen,
  withoutRandomUuid,
} from "./helpers";

/**
 * A widget is a package: the Library lists it under its category, the inspector asks for
 * its data sources and options, and a package an administrator installs shows up after
 * a reload, without restarting Home Assistant.
 */

const UPDATE = "opendisplay_studio/update_dashboard";

interface SavedWidget {
  type: string;
  sources: Record<string, Array<Record<string, unknown>>>;
  options: Record<string, unknown>;
}

const savedWidgets = async (page: Page): Promise<SavedWidget[]> => {
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const call = (await lastCall(page, UPDATE)) as {
    dashboard: { items: Array<{ kind: string; widget?: SavedWidget }> };
  };
  return call.dashboard.items.flatMap((item) =>
    item.widget ? [item.widget] : []
  );
};

const addAgenda = async (page: Page) => {
  await libraryItem(page, "Agenda").click();
  await expect(
    page.getByRole("heading", { name: "agenda_1", exact: true })
  ).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await withoutRandomUuid(page);
  await openKitchen(page);
});

test.describe("the library", () => {
  test("groups the widgets by category", async ({ page }) => {
    const categories = page.locator(".catalog-category");

    await expect(categories).toHaveText(["Calendar", "Sensors", "Weather"]);
    await expect(page.locator(".user-badge")).toHaveCount(0);
  });

  test("finds a widget by what it does", async ({ page }) => {
    await page.locator("ods-library").getByRole("searchbox").fill("forecast");

    await expect(libraryItem(page, "Weather")).toBeVisible();
    await expect(libraryItem(page, "Agenda")).toHaveCount(0);
  });
});

test.describe("a new widget", () => {
  test("asks for its data sources first, then its options in sections", async ({
    page,
  }) => {
    await addAgenda(page);

    const sections = page.locator(".inspector-section > summary");
    await expect(sections.nth(0)).toHaveText("Data sources");
    await expect(sections.nth(1)).toHaveText("Content");
    await expect(sections.nth(2)).toHaveText("Presentation");
    await expect(page.getByLabel("Calendars", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Number of events")).toHaveValue("5");
  });

  test("starts with the defaults of its package and no picks", async ({
    page,
  }) => {
    await addAgenda(page);

    const widgets = await savedWidgets(page);

    expect(widgets.at(-1)).toMatchObject({
      type: "agenda",
      sources: { calendars: [] },
      options: { maxEvents: 5, days: 14, groupByDay: true, use24h: true },
    });
  });

  test("keeps what was picked, in order, with the fields of each pick", async ({
    page,
  }) => {
    await addAgenda(page);
    await page
      .getByLabel("Calendars", { exact: true })
      .fill("calendar.ola, calendar.jan");

    const picks = page.locator("details.pick-fields");
    await expect(picks).toHaveCount(2);
    await picks.first().locator("summary").click();
    await picks.first().getByLabel("Label").fill("Ola");

    const widgets = await savedWidgets(page);
    expect(widgets.at(-1)?.sources.calendars).toEqual([
      { id: "calendar.ola", label: "Ola" },
      { id: "calendar.jan" },
    ]);
  });

  test("stores an option the way it was typed, as one undo step", async ({
    page,
  }) => {
    await addAgenda(page);

    await page.getByLabel("Number of events").fill("3");

    const widgets = await savedWidgets(page);
    expect(widgets.at(-1)?.options.maxEvents).toBe(3);
    await page.keyboard.press("Control+z");
    await expect(page.getByLabel("Number of events")).toHaveValue("5");
  });

  test("has options a person can read in the language of the package", async ({
    page,
  }) => {
    await addAgenda(page);

    await expect(page.getByLabel("Look ahead (days)")).toBeVisible();
    await expect(page.getByLabel("Group by day")).toBeChecked();
  });
});

test("the kitchen sensor card shows the entity it was given", async ({
  page,
}) => {
  await page.locator(".layer-row").filter({ hasText: "Kitchen" }).click();

  await expect(page.getByLabel("Entities", { exact: true })).toHaveValue(
    "sensor.kitchen_temperature"
  );
});

test.describe("reloading widgets", () => {
  const install = (page: Page, name: "hello" | "broken") =>
    page.evaluate(
      (packageName) => window.__ODS_E2E__.installPackage(packageName),
      name
    );

  const reload = async (page: Page) => {
    await page.getByRole("button", { name: "Reload widgets" }).click();
  };

  test("shows a package that was installed, marked as a user widget", async ({
    page,
  }) => {
    await expect(libraryItem(page, "Hello world")).toHaveCount(0);
    await install(page, "hello");

    await reload(page);

    await expect(libraryItem(page, "Hello world")).toBeVisible();
    await expect(libraryItem(page, "Hello world")).toContainText("user");
    await expect(page.locator(".catalog-category")).toContainText(["Examples"]);
    await expect(page.getByText("Widgets reloaded — 4 loaded")).toBeVisible();
  });

  test("a broken package is reported and the other widgets keep working", async ({
    page,
  }) => {
    await install(page, "broken");

    await reload(page);

    await expect(
      page.getByText("1 widget package could not be loaded")
    ).toBeVisible();
    await page.getByText("1 widget package could not be loaded").click();
    await expect(page.getByText("unsupported widget API 2")).toBeVisible();
    await expect(libraryItem(page, "Agenda")).toBeVisible();
    await expect(
      page.getByText("Widgets reloaded — 3 loaded, 1 failed")
    ).toBeVisible();
  });

  test("a dropped user widget renders like any other", async ({ page }) => {
    await install(page, "hello");
    await reload(page);

    await libraryItem(page, "Hello world").click();

    await expect(
      page.getByRole("heading", { name: "hello-world_1", exact: true })
    ).toBeVisible();
    await expect(
      page.getByAltText("Authoritative rendered display preview")
    ).toBeVisible();
  });
});

test("a widget whose package is gone keeps its place and says so", async ({
  page,
}) => {
  await page.evaluate(() => window.__ODS_E2E__.installPackage("hello"));
  await page.getByRole("button", { name: "Reload widgets" }).click();
  await libraryItem(page, "Hello world").click();
  await page.evaluate(() => window.__ODS_E2E__.uninstallPackage("hello"));
  await page.getByRole("button", { name: "Reload widgets" }).click();

  await page.locator(".layer-row").filter({ hasText: "hello-world_1" }).click();

  await expect(
    page.getByText("The widget hello-world is not installed.")
  ).toBeVisible();
  await expect(page.locator(".layer-row")).toHaveCount(2);
});
