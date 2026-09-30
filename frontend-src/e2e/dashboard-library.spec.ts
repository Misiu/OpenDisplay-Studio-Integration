import { expect, test, type Page } from '@playwright/test'

const openGallery = async (page: Page) => {
  await page.clock.setFixedTime(new Date('2026-09-28T12:00:00Z'))
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Dashboards', exact: true })).toBeVisible()
}

const dashboardNames = async (page: Page) => page
  .getByRole('button', { name: /^Open dashboard / })
  .evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-label')?.replace('Open dashboard ', '')))

const dashboardCard = (page: Page, name: string) => page
  .getByRole('button', { name: `Open dashboard ${name}`, exact: true })
  .locator('xpath=..')

const openDashboardMenu = async (page: Page, name: string) => {
  await page.getByRole('button', { name: `Open dashboard ${name}`, exact: true }).hover()
  const trigger = page.getByRole('button', { name: `Dashboard actions for ${name}`, exact: true })
  await expect(trigger).toHaveCSS('opacity', '1')
  await trigger.click()
  const menu = page.getByRole('menu', { name: `Actions for ${name}`, exact: true })
  await expect(menu).toBeVisible()
  return menu
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', { configurable: true, value: undefined })
  })
  await openGallery(page)
})

test('shows the dashboard gallery without rendering a dashboard first', async ({ page }) => {
  await expect(page.getByText('3 dashboards', { exact: true })).toBeVisible()
  await expect(page.getByRole('searchbox', { name: 'Search dashboards' })).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'Sort dashboards' })).toHaveValue(/updated/)
  await expect(dashboardCard(page, 'Kitchen display')).toContainText('800 × 480')
  await expect(dashboardCard(page, 'Hallway overview')).toContainText('1280 × 800')
  await expect(dashboardCard(page, 'Office status')).toContainText('320 × 240')
  await expect.poll(() => dashboardNames(page)).toEqual(['Kitchen display', 'Hallway overview', 'Office status'])

  const calls = await page.evaluate(() => window.__ODX_E2E__.calls())
  expect(calls.filter(call => call.type === 'opendisplay_studio/bootstrap')).toHaveLength(1)
  expect(calls.filter(call => call.type === 'opendisplay_studio/compose_preview')).toHaveLength(0)

  const newButtonAlignment = await page.getByRole('button', { name: 'New dashboard', exact: true }).evaluate(button => {
    const icon = button.querySelector('ha-icon')!.getBoundingClientRect()
    const label = button.querySelector('.dashboard-new-button-label')!.getBoundingClientRect()
    return Math.abs((icon.top + icon.height / 2) - (label.top + label.height / 2))
  })
  expect(newButtonAlignment).toBeLessThan(.5)
  await expect(page.locator('opendisplay-studio-panel')).toHaveScreenshot('dashboard-gallery.png')
})

test('filters dashboards and changes their sort order', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Search dashboards' })
  await search.fill('OFFICE')
  await expect(page.getByRole('button', { name: 'Open dashboard Office status' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open dashboard Kitchen display' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^Open dashboard / })).toHaveCount(1)

  await search.fill('missing dashboard')
  await expect(page.getByRole('button', { name: /^Open dashboard / })).toHaveCount(0)

  await search.clear()
  await page.getByRole('combobox', { name: 'Sort dashboards' }).selectOption({ label: 'Name A–Z' })
  await expect.poll(() => dashboardNames(page)).toEqual(['Hallway overview', 'Kitchen display', 'Office status'])
})

test('opens the same custom dashboard dialog from both add affordances', async ({ page }) => {
  const addDashboard = [
    page.getByRole('button', { name: 'New dashboard', exact: true }),
    page.getByRole('button', { name: 'Add dashboard', exact: true }),
  ]

  for (let index = 0; index < 2; index += 1) {
    await addDashboard[index].click()
    const dialog = page.getByRole('dialog', { name: 'New dashboard' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('radio', { name: /From OpenDisplay device/ })).toBeDisabled()
    await expect(dialog.getByRole('radio', { name: /Custom size/ })).toBeChecked()
    if (index === 0) await expect(dialog).toHaveScreenshot('new-dashboard-dialog.png')
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog).toHaveCount(0)
  }
})

test('creates a custom dashboard and opens it in the editor', async ({ page }) => {
  await page.getByRole('button', { name: 'New dashboard', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'New dashboard' })
  const create = dialog.getByRole('button', { name: 'Create dashboard' })
  await expect(create).toBeDisabled()

  await dialog.getByRole('textbox', { name: 'Dashboard name' }).fill('Studio board')
  await dialog.getByRole('spinbutton', { name: 'Width' }).fill('640')
  await dialog.getByRole('spinbutton', { name: 'Height' }).fill('384')
  await dialog.getByRole('combobox', { name: 'Palette' }).selectOption('spectra6')
  await expect(create).toBeEnabled()
  await create.click()

  await expect(page.getByRole('button', { name: 'Dashboards', exact: true })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Dashboard name' })).toHaveValue('Studio board')
  await expect(page.locator('.workspace-meta')).toContainText('640 × 384 px')
  await expect(page.getByRole('combobox', { name: 'Display type' })).toHaveValue('custom')
  await expect(page.getByRole('combobox', { name: 'Palette' })).toHaveValue('spectra6')
  const createCall = await page.evaluate(() => window.__ODX_E2E__.calls().findLast(call => call.type === 'opendisplay_studio/create_project'))
  expect(createCall).toMatchObject({
    type: 'opendisplay_studio/create_project',
    project: {
      name: 'Studio board',
      display: { width: 640, height: 384, palette: 'spectra6' },
    },
  })
})

test('returns from the editor to the dashboard gallery', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dashboard Kitchen display' }).click()
  await expect(page.getByAltText('Authoritative rendered display preview')).toBeVisible()
  await page.getByRole('button', { name: 'Dashboards', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Dashboards', exact: true })).toBeVisible()
  expect(await page.evaluate(() => window.__ODX_E2E__.calls().filter(call => call.type === 'opendisplay_studio/bootstrap').length)).toBe(1)
})

test('reveals an accessible dashboard menu on hover and renames in place', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Dashboard actions for Kitchen display', exact: true })
  await expect(trigger).toHaveCSS('opacity', '0')

  let menu = await openDashboardMenu(page, 'Kitchen display')
  await expect(menu.getByRole('menuitem')).toHaveCount(4)
  await expect(menu.getByRole('menuitem', { name: 'Rename', exact: true })).toBeVisible()
  await expect(menu.getByRole('menuitem', { name: 'Duplicate', exact: true })).toBeVisible()
  await expect(menu.getByRole('menuitem', { name: 'Display Settings', exact: true })).toBeVisible()
  await expect(menu.getByRole('menuitem', { name: 'Delete', exact: true })).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  menu = await openDashboardMenu(page, 'Kitchen display')
  await page.getByRole('searchbox', { name: 'Search dashboards' }).click()
  await expect(menu).toHaveCount(0)

  menu = await openDashboardMenu(page, 'Kitchen display')
  await menu.getByRole('menuitem', { name: 'Rename', exact: true }).click()
  const rename = page.getByRole('textbox', { name: 'Rename dashboard Kitchen display', exact: true })
  await expect(rename).toBeFocused()
  await rename.fill('Kitchen dashboard')
  await rename.press('Enter')

  await expect(page.getByRole('button', { name: 'Open dashboard Kitchen dashboard', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dashboards', exact: true })).toBeVisible()
  const update = await page.evaluate(() => window.__ODX_E2E__.calls().findLast(call => call.type === 'opendisplay_studio/update_project'))
  expect(update).toMatchObject({ project_id: 'demo', project: { id: 'demo', name: 'Kitchen dashboard' } })
  expect(await page.evaluate(() => window.__ODX_E2E__.calls().filter(call => call.type === 'opendisplay_studio/compose_preview').length)).toBe(0)
})

test('duplicates a dashboard as Draft and edits its display settings', async ({ page }) => {
  let menu = await openDashboardMenu(page, 'Kitchen display')
  await menu.getByRole('menuitem', { name: 'Duplicate', exact: true }).click()

  await expect(page.getByText('4 dashboards', { exact: true })).toBeVisible()
  const duplicate = dashboardCard(page, 'Kitchen display copy')
  await expect(duplicate).toContainText(/draft/i)
  const create = await page.evaluate(() => window.__ODX_E2E__.calls().findLast(call => call.type === 'opendisplay_studio/create_project'))
  expect(create).toMatchObject({ project: { name: 'Kitchen display copy', status: 'draft', items: [{ id: 'temperature' }] } })

  menu = await openDashboardMenu(page, 'Kitchen display copy')
  await menu.getByRole('menuitem', { name: 'Display Settings', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Display settings', exact: true })
  await dialog.getByRole('spinbutton', { name: 'Width' }).fill('640')
  await dialog.getByRole('spinbutton', { name: 'Height' }).fill('384')
  await dialog.getByRole('combobox', { name: 'Palette' }).selectOption('spectra6')
  await dialog.getByRole('button', { name: 'Save changes', exact: true }).click()
  await expect(dialog).toHaveCount(0)
  await expect(duplicate).toContainText('640 × 384')
  await expect(duplicate).toContainText('Spectra 6')

  const update = await page.evaluate(() => window.__ODX_E2E__.calls().findLast(call => call.type === 'opendisplay_studio/update_project'))
  expect(update).toMatchObject({ project: { name: 'Kitchen display copy', display: { width: 640, height: 384, palette: 'spectra6' } } })
})

test('requires confirmation before deleting a dashboard', async ({ page }) => {
  let menu = await openDashboardMenu(page, 'Kitchen display')
  await menu.getByRole('menuitem', { name: 'Delete', exact: true }).click()
  let dialog = page.getByRole('dialog', { name: 'Delete dashboard?', exact: true })
  await expect(dialog).toContainText('Kitchen display')
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Open dashboard Kitchen display', exact: true })).toBeVisible()

  menu = await openDashboardMenu(page, 'Kitchen display')
  await menu.getByRole('menuitem', { name: 'Delete', exact: true }).click()
  dialog = page.getByRole('dialog', { name: 'Delete dashboard?', exact: true })
  await dialog.getByRole('button', { name: 'Delete dashboard', exact: true }).click()

  await expect(page.getByText('2 dashboards', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Open dashboard Kitchen display', exact: true })).toHaveCount(0)
  const deletion = await page.evaluate(() => window.__ODX_E2E__.calls().findLast(call => call.type === 'opendisplay_studio/delete_project'))
  expect(deletion).toMatchObject({ project_id: 'demo' })
})

test('uses a light dotted canvas workspace', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dashboard Kitchen display' }).click()
  await expect(page.getByAltText('Authoritative rendered display preview')).toBeVisible()
  const appearance = await page.locator('.canvas-stage').evaluate(element => {
    const style = getComputedStyle(element)
    const channels = style.backgroundColor.match(/\d+/g)?.slice(0, 3).map(Number) ?? []
    return { channels, image: style.backgroundImage }
  })
  expect(appearance.channels).toHaveLength(3)
  expect(appearance.channels.every(channel => channel > 220)).toBe(true)
  expect(appearance.image).toContain('radial-gradient')
})

test('switches between Design and read-only Code without losing editor state', async ({ page }) => {
  await page.getByRole('button', { name: 'Open dashboard Kitchen display' }).click()
  await expect(page.getByAltText('Authoritative rendered display preview')).toBeVisible()
  await page.locator('.selection[data-item-id="temperature"]').click()
  const transform = await page.locator('.canvas-viewport').evaluate(element => (element as HTMLElement).style.transform)
  const viewNavigation = page.getByRole('navigation', { name: 'Dashboard view' })

  await viewNavigation.getByRole('button', { name: 'Code' }).click()
  const code = page.getByRole('textbox', { name: 'Generated ODL YAML' })
  await expect(code).toHaveJSProperty('readOnly', true)
  await expect(code).toHaveValue('- type: rectangle\n- type: icon\n- type: text')
  await expect(page.locator('opendisplay-studio-panel')).toHaveScreenshot('dashboard-code-view.png')

  await page.getByRole('button', { name: 'Copy generated ODL YAML' }).click()
  await expect(page.getByText('YAML copied to clipboard')).toBeVisible()
  expect((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n')).toBe(await code.inputValue())

  await viewNavigation.getByRole('button', { name: 'Design' }).click()
  await expect(page.locator('.selection[data-item-id="temperature"].selected')).toHaveCount(1)
  await expect.poll(() => page.locator('.canvas-viewport').evaluate(element => (element as HTMLElement).style.transform)).toBe(transform)
})

declare global {
  interface Window {
    __ODX_E2E__: {
      calls: () => Array<Record<string, unknown>>
    }
  }
}
