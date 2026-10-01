import { expect, test, type Locator, type Page } from "@playwright/test";
import { lastCall, openDashboard } from "./helpers";

const openGallery = async (page: Page) => {
  await page.clock.setFixedTime(new Date("2026-09-28T12:00:00Z"));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Dashboards", exact: true })
  ).toBeVisible();
};

const dashboardNames = async (page: Page) =>
  page
    .getByRole("button", { name: /^Open dashboard / })
    .evaluateAll((buttons) =>
      buttons.map((button) =>
        button.getAttribute("aria-label")?.replace("Open dashboard ", "")
      )
    );

const dashboardCard = (page: Page, name: string) =>
  page
    .getByRole("button", { name: `Open dashboard ${name}`, exact: true })
    .locator("xpath=..");

const openDashboardMenu = async (page: Page, name: string) => {
  await page
    .getByRole("button", { name: `Open dashboard ${name}`, exact: true })
    .hover();
  const trigger = page.getByRole("button", {
    name: `Dashboard actions for ${name}`,
    exact: true,
  });
  await expect(trigger).toHaveCSS("opacity", "1");
  await trigger.click();
  const menu = page.getByRole("menu", {
    name: `Actions for ${name}`,
    exact: true,
  });
  await expect(menu).toBeVisible();
  return menu;
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, "randomUUID", {
      configurable: true,
      value: undefined,
    });
  });
  await openGallery(page);
});

test("shows the dashboard gallery without rendering a dashboard first", async ({
  page,
}) => {
  await expect(page.getByText("3 dashboards", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("searchbox", { name: "Search dashboards" })
  ).toBeVisible();
  await expect(
    page.getByRole("combobox", { name: "Sort dashboards" })
  ).toHaveValue(/updated/);
  await expect(dashboardCard(page, "Kitchen display")).toContainText(
    "800 × 480"
  );
  await expect(dashboardCard(page, "Hallway overview")).toContainText(
    "1280 × 800"
  );
  await expect(dashboardCard(page, "Office status")).toContainText("320 × 240");
  await expect
    .poll(() => dashboardNames(page))
    .toEqual(["Kitchen display", "Hallway overview", "Office status"]);

  const calls = await page.evaluate(() => window.__ODS_E2E__.calls());
  expect(
    calls.filter((call) => call.type === "opendisplay_studio/bootstrap")
  ).toHaveLength(1);
  expect(
    calls.filter((call) => call.type === "opendisplay_studio/compose_preview")
  ).toHaveLength(0);

  const newButtonAlignment = await page
    .getByRole("button", { name: "New dashboard", exact: true })
    .evaluate((button) => {
      const icon = button.querySelector("ha-icon")!.getBoundingClientRect();
      const label = button
        .querySelector(".dashboard-new-button-label")!
        .getBoundingClientRect();
      return Math.abs(
        icon.top + icon.height / 2 - (label.top + label.height / 2)
      );
    });
  expect(newButtonAlignment).toBeLessThan(0.5);
  await expect(page.locator("ods-app")).toHaveScreenshot(
    "dashboard-gallery.png"
  );
});

test("filters dashboards and changes their sort order", async ({ page }) => {
  const search = page.getByRole("searchbox", { name: "Search dashboards" });
  await search.fill("OFFICE");
  await expect(
    page.getByRole("button", { name: "Open dashboard Office status" })
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open dashboard Kitchen display" })
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /^Open dashboard / })
  ).toHaveCount(1);

  await search.fill("missing dashboard");
  await expect(
    page.getByRole("button", { name: /^Open dashboard / })
  ).toHaveCount(0);

  await search.clear();
  await page
    .getByRole("combobox", { name: "Sort dashboards" })
    .selectOption({ label: "Name A–Z" });
  await expect
    .poll(() => dashboardNames(page))
    .toEqual(["Hallway overview", "Kitchen display", "Office status"]);
});

test("opens the same dashboard dialog from both add affordances", async ({
  page,
}) => {
  const addDashboard = [
    page.getByRole("button", { name: "New dashboard", exact: true }),
    page.getByRole("button", { name: "Add dashboard", exact: true }),
  ];

  for (let index = 0; index < 2; index += 1) {
    await addDashboard[index].click();
    const dialog = page.getByRole("dialog", { name: "New dashboard" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("radio", { name: /From device/ })
    ).toBeChecked();
    await expect(
      dialog.getByRole("radio", { name: /Predefined display/ })
    ).not.toBeChecked();
    await expect(
      dialog.getByRole("radio", { name: /Custom size/ })
    ).not.toBeChecked();
    if (index === 0) {
      await expect(dialog).toHaveScreenshot("new-dashboard-dialog.png");
    }
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toHaveCount(0);
  }
});

test("creates a custom dashboard and opens it in the editor", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "New dashboard", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "New dashboard" });
  const create = dialog.getByRole("button", { name: "Create dashboard" });
  await dialog.getByRole("radio", { name: /Custom size/ }).click();
  await expect(create).toBeDisabled();

  await dialog
    .getByRole("textbox", { name: "Dashboard name" })
    .fill("Studio board");
  await dialog.getByRole("spinbutton", { name: "Width" }).fill("640");
  await dialog.getByRole("spinbutton", { name: "Height" }).fill("384");
  await dialog
    .getByRole("combobox", { name: "Palette" })
    .selectOption("spectra6");
  await expect(create).toBeEnabled();
  await create.click();

  await expect(
    page.getByRole("button", { name: "Dashboards", exact: true })
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Dashboard name" })
  ).toHaveValue("Studio board");
  await expect(page.locator(".workspace-meta")).toContainText("640 × 384 px");
  const createCall = await page.evaluate(() =>
    window.__ODS_E2E__
      .calls()
      .findLast((call) => call.type === "opendisplay_studio/create_dashboard")
  );
  expect(createCall).toMatchObject({
    type: "opendisplay_studio/create_dashboard",
    dashboard: {
      name: "Studio board",
      display: { width: 640, height: 384, palette: "spectra6" },
    },
  });
});

test("returns from the editor to the dashboard gallery", async ({ page }) => {
  await page
    .getByRole("button", { name: "Open dashboard Kitchen display" })
    .click();
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
  await page.getByRole("button", { name: "Dashboards", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Dashboards", exact: true })
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        window.__ODS_E2E__
          .calls()
          .filter((call) => call.type === "opendisplay_studio/bootstrap").length
    )
  ).toBe(1);
});

test("reveals an accessible dashboard menu on hover and renames in place", async ({
  page,
}) => {
  const trigger = page.getByRole("button", {
    name: "Dashboard actions for Kitchen display",
    exact: true,
  });
  await expect(trigger).toHaveCSS("opacity", "0");

  let menu = await openDashboardMenu(page, "Kitchen display");
  await expect(menu.getByRole("menuitem")).toHaveCount(4);
  await expect(
    menu.getByRole("menuitem", { name: "Rename", exact: true })
  ).toBeVisible();
  await expect(
    menu.getByRole("menuitem", { name: "Duplicate", exact: true })
  ).toBeVisible();
  await expect(
    menu.getByRole("menuitem", { name: "Display Settings", exact: true })
  ).toBeVisible();
  await expect(
    menu.getByRole("menuitem", { name: "Delete", exact: true })
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  menu = await openDashboardMenu(page, "Kitchen display");
  await page.getByRole("searchbox", { name: "Search dashboards" }).click();
  await expect(menu).toHaveCount(0);

  menu = await openDashboardMenu(page, "Kitchen display");
  await menu.getByRole("menuitem", { name: "Rename", exact: true }).click();
  const rename = page.getByRole("textbox", {
    name: "Rename dashboard Kitchen display",
    exact: true,
  });
  await expect(rename).toBeFocused();
  await rename.fill("Kitchen dashboard");
  await rename.press("Enter");

  await expect(
    page.getByRole("button", {
      name: "Open dashboard Kitchen dashboard",
      exact: true,
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Dashboards", exact: true })
  ).toBeVisible();
  const update = await page.evaluate(() =>
    window.__ODS_E2E__
      .calls()
      .findLast((call) => call.type === "opendisplay_studio/update_dashboard")
  );
  expect(update).toMatchObject({
    dashboard_id: "demo",
    dashboard: { id: "demo", name: "Kitchen dashboard" },
  });
  expect(
    await page.evaluate(
      () =>
        window.__ODS_E2E__
          .calls()
          .filter((call) => call.type === "opendisplay_studio/compose_preview")
          .length
    )
  ).toBe(0);
});

test("duplicates a dashboard as Draft and edits its display settings", async ({
  page,
}) => {
  let menu = await openDashboardMenu(page, "Kitchen display");
  await menu.getByRole("menuitem", { name: "Duplicate", exact: true }).click();

  await expect(page.getByText("4 dashboards", { exact: true })).toBeVisible();
  const duplicate = dashboardCard(page, "Kitchen display copy");
  await expect(duplicate).toContainText(/draft/i);
  const create = await page.evaluate(() =>
    window.__ODS_E2E__
      .calls()
      .findLast((call) => call.type === "opendisplay_studio/create_dashboard")
  );
  expect(create).toMatchObject({
    dashboard: {
      name: "Kitchen display copy",
      status: "draft",
      items: [{ id: "temperature" }],
    },
  });

  menu = await openDashboardMenu(page, "Kitchen display copy");
  await menu
    .getByRole("menuitem", { name: "Display Settings", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Display settings",
    exact: true,
  });
  await dialog.getByRole("spinbutton", { name: "Width" }).fill("640");
  await dialog.getByRole("spinbutton", { name: "Height" }).fill("384");
  await dialog
    .getByRole("combobox", { name: "Palette" })
    .selectOption("spectra6");
  await dialog
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await expect(dialog).toHaveCount(0);
  await expect(duplicate).toContainText("640 × 384");
  await expect(duplicate).toContainText("Spectra 6");

  const update = await page.evaluate(() =>
    window.__ODS_E2E__
      .calls()
      .findLast((call) => call.type === "opendisplay_studio/update_dashboard")
  );
  expect(update).toMatchObject({
    dashboard: {
      name: "Kitchen display copy",
      display: { width: 640, height: 384, palette: "spectra6" },
    },
  });
});

test("requires confirmation before deleting a dashboard", async ({ page }) => {
  let menu = await openDashboardMenu(page, "Kitchen display");
  await menu.getByRole("menuitem", { name: "Delete", exact: true }).click();
  let dialog = page.getByRole("dialog", {
    name: "Delete dashboard?",
    exact: true,
  });
  await expect(dialog).toContainText("Kitchen display");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("button", {
      name: "Open dashboard Kitchen display",
      exact: true,
    })
  ).toBeVisible();

  menu = await openDashboardMenu(page, "Kitchen display");
  await menu.getByRole("menuitem", { name: "Delete", exact: true }).click();
  dialog = page.getByRole("dialog", { name: "Delete dashboard?", exact: true });
  await dialog
    .getByRole("button", { name: "Delete dashboard", exact: true })
    .click();

  await expect(page.getByText("2 dashboards", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Open dashboard Kitchen display",
      exact: true,
    })
  ).toHaveCount(0);
  const deletion = await page.evaluate(() =>
    window.__ODS_E2E__
      .calls()
      .findLast((call) => call.type === "opendisplay_studio/delete_dashboard")
  );
  expect(deletion).toMatchObject({ dashboard_id: "demo" });
});

test("uses a light dotted canvas workspace", async ({ page }) => {
  await page
    .getByRole("button", { name: "Open dashboard Kitchen display" })
    .click();
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
  const appearance = await page.locator(".canvas-stage").evaluate((element) => {
    const style = getComputedStyle(element);
    const channels =
      style.backgroundColor.match(/\d+/g)?.slice(0, 3).map(Number) ?? [];
    return { channels, image: style.backgroundImage };
  });
  expect(appearance.channels).toHaveLength(3);
  expect(appearance.channels.every((channel) => channel > 220)).toBe(true);
  expect(appearance.image).toContain("radial-gradient");
});

test("switches between Design and read-only Code without losing editor state", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Open dashboard Kitchen display" })
    .click();
  await expect(
    page.getByAltText("Authoritative rendered display preview")
  ).toBeVisible();
  await page.locator('.selection[data-item-id="temperature"]').click();
  const transform = await page
    .locator(".canvas-viewport")
    .evaluate((element) => (element as HTMLElement).style.transform);
  const viewNavigation = page.getByRole("navigation", {
    name: "Dashboard view",
  });

  await viewNavigation.getByRole("button", { name: "Code" }).click();
  const code = page.getByRole("textbox", { name: "Generated ODL YAML" });
  await expect(code).toHaveJSProperty("readOnly", true);
  await expect(code).toHaveValue(
    "- type: rectangle\n- type: icon\n- type: text"
  );
  await expect(page.locator("ods-app")).toHaveScreenshot(
    "dashboard-code-view.png"
  );

  await page.getByRole("button", { name: "Copy generated ODL YAML" }).click();
  await expect(page.getByText("YAML copied to clipboard")).toBeVisible();
  expect(
    (await page.evaluate(() => navigator.clipboard.readText())).replaceAll(
      "\r\n",
      "\n"
    )
  ).toBe(await code.inputValue());

  await viewNavigation.getByRole("button", { name: "Design" }).click();
  await expect(
    page.locator('.selection[data-item-id="temperature"].selected')
  ).toHaveCount(1);
  await expect
    .poll(() =>
      page
        .locator(".canvas-viewport")
        .evaluate((element) => (element as HTMLElement).style.transform)
    )
    .toBe(transform);
});

declare global {
  interface Window {
    __ODS_E2E__: {
      calls: () => Array<Record<string, unknown>>;
    };
  }
}

test.describe("starting a dashboard from a display", () => {
  const openDialog = async (page: Page) => {
    await page
      .getByRole("button", { name: "New dashboard", exact: true })
      .click();
    return page.getByRole("dialog", { name: "New dashboard" });
  };

  const createCall = (page: Page) =>
    page.evaluate(
      () =>
        window.__ODS_E2E__
          .calls()
          .findLast(
            (call) => call.type === "opendisplay_studio/create_dashboard"
          )?.dashboard as { display: Record<string, unknown> } | undefined
    );

  test("lists the OpenDisplay devices and shows the size and colors of the chosen one", async ({
    page,
  }) => {
    const dialog = await openDialog(page);

    const devices = dialog.getByRole("combobox", { name: "Device" });
    await expect(devices.locator("option")).toHaveText([
      "Hallway display · 800 × 480",
      "Kitchen e-paper · 296 × 128",
    ]);
    const summary = dialog.getByRole("group", {
      name: "Dashboard size and colors",
    });
    await expect(summary).toContainText("800 × 480 px");
    await expect(summary).toContainText("Black / white / red");

    await devices.selectOption("kitchen");

    await expect(summary).toContainText("296 × 128 px");
    await expect(summary).toContainText("Black / white");
    await expect(summary.locator(".swatch")).toHaveCount(2);
  });

  test("creates a dashboard with the resolution and colors of the device", async ({
    page,
  }) => {
    const dialog = await openDialog(page);
    await dialog
      .getByRole("combobox", { name: "Device" })
      .selectOption("kitchen");
    await dialog.getByRole("textbox", { name: "Dashboard name" }).fill("Shelf");

    await dialog.getByRole("button", { name: "Create dashboard" }).click();

    await expect(page.locator(".workspace-meta")).toContainText("296 × 128 px");
    expect(await createCall(page)).toMatchObject({
      display: { width: 296, height: 128, palette: "bw" },
    });
  });

  test("does not offer to type a size for a device: it is the device's", async ({
    page,
  }) => {
    const dialog = await openDialog(page);

    await expect(dialog.getByRole("spinbutton", { name: "Width" })).toHaveCount(
      0
    );
    await expect(dialog.getByRole("combobox", { name: "Palette" })).toHaveCount(
      0
    );
  });

  test("lists the predefined displays, with the colors each can show", async ({
    page,
  }) => {
    const dialog = await openDialog(page);
    await dialog.getByRole("radio", { name: /Predefined display/ }).click();

    const displays = dialog.getByRole("combobox", { name: "Display" });
    await expect(displays.locator("option").first()).toContainText(
      "Seeed Studio"
    );
    await displays.selectOption("eink-spectra6-13-3");

    await expect(
      dialog.getByRole("group", { name: "Dashboard size and colors" })
    ).toContainText("1200 × 1600 px");
    await dialog.getByRole("textbox", { name: "Dashboard name" }).fill("Big");
    await dialog.getByRole("button", { name: "Create dashboard" }).click();
    await expect(page.locator(".workspace-meta")).toContainText(
      "1200 × 1600 px"
    );
    expect(await createCall(page)).toMatchObject({
      display: { profileId: "eink-spectra6-13-3", palette: "spectra6" },
    });
  });

  test("lets the size be typed only for a custom display", async ({ page }) => {
    const dialog = await openDialog(page);

    await dialog.getByRole("radio", { name: /Custom size/ }).click();

    await expect(
      dialog.getByRole("spinbutton", { name: "Width" })
    ).toBeVisible();
    await expect(
      dialog.getByRole("combobox", { name: "Palette" })
    ).toBeVisible();
  });
});

test.describe("the display settings of a dashboard", () => {
  const openSettings = async (page: Page, name: string) => {
    const menu = await openDashboardMenu(page, name);
    await menu
      .getByRole("menuitem", { name: "Display Settings", exact: true })
      .click();
    return page.getByRole("dialog", { name: "Display settings", exact: true });
  };

  const save = async (dialog: Locator) => {
    await dialog
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(dialog).toHaveCount(0);
  };

  test("turn the canvas and change the background", async ({ page }) => {
    const dialog = await openSettings(page, "Kitchen display");

    await dialog.getByRole("combobox", { name: "Rotation" }).selectOption("90");
    await dialog
      .getByRole("combobox", { name: "Background" })
      .selectOption("black");
    await save(dialog);

    await expect(dashboardCard(page, "Kitchen display")).toContainText(
      "480 × 800"
    );
    expect(
      await lastCall(page, "opendisplay_studio/update_dashboard")
    ).toMatchObject({
      dashboard: {
        display: { rotation: 90, width: 480, height: 800, background: "black" },
      },
    });
  });

  test("keep the device through a rotation, so the design can still be sent", async ({
    page,
  }) => {
    const dialog = await openSettings(page, "Kitchen display");
    await dialog.getByRole("combobox", { name: "Rotation" }).selectOption("90");
    await save(dialog);

    await openDashboard(page, "Kitchen display");
    await page.getByRole("button", { name: "Send to device" }).click();

    await expect(page.getByText("Sent to the device")).toBeVisible();
    expect(
      await lastCall(page, "opendisplay_studio/send_to_device")
    ).toMatchObject({
      dashboard: { display: { rotation: 90, deviceId: "hallway" } },
    });
  });

  test("forget the device when the size is typed by hand", async ({ page }) => {
    const dialog = await openSettings(page, "Kitchen display");
    await dialog.getByRole("spinbutton", { name: "Width" }).fill("640");
    await save(dialog);

    await openDashboard(page, "Kitchen display");

    await expect(
      page.getByRole("button", { name: "Send to device" })
    ).toHaveCount(0);
  });

  test("the editor panel no longer lists the delete action of the dashboard", async ({
    page,
  }) => {
    await openDashboard(page, "Kitchen display");

    await expect(
      page.getByRole("button", { name: "Delete dashboard", exact: true })
    ).toHaveCount(0);
  });
});
