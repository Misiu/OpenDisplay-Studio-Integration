import { expect, test, type Locator, type Page } from '@playwright/test'

/**
 * One group of tests per custom element: what the user sees and does in that area,
 * through real pointer and keyboard input. The wiring between elements is covered by
 * `designer-v3.spec.ts` and `dashboard-library.spec.ts`.
 */

const openGallery = async (page: Page) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Dashboards', exact: true })).toBeVisible()
}

const openDashboard = async (page: Page, name: string) => {
  await page.getByRole('button', { name: `Open dashboard ${name}` }).click()
  await expect(page.getByRole('button', { name: 'Dashboards', exact: true })).toBeVisible()
}

const openKitchen = async (page: Page) => {
  await openGallery(page)
  await openDashboard(page, 'Kitchen display')
  await expect(page.getByAltText('Authoritative rendered display preview')).toBeVisible()
}

const kitchenWidget = (page: Page) => page.locator('.selection[data-item-id="temperature"]')
const xField = (page: Page) => page.locator('.properties input[data-field="x"]')
const zoomReadout = (page: Page) => page.locator('.zoom-readout')
/** Row actions only appear while the row is hovered, focused or selected. */
const revealRowActions = (page: Page) => page.locator('.layer-row').first().hover()

const dragBy = async (page: Page, target: Locator, dx: number, dy = 0) => {
  const box = await target.boundingBox()
  if (!box) throw new Error('Drag target is not visible')
  const x = box.x + box.width / 2; const y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + dx, y + dy, { steps: 6 })
  await page.mouse.up()
}

const lastCall = (page: Page, type: string) => page.evaluate(wanted => window.__ODS_E2E__.calls().findLast(call => call.type === wanted), type)
const callCount = (page: Page, type: string) => page.evaluate(wanted => window.__ODS_E2E__.calls().filter(call => call.type === wanted).length, type)

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(globalThis.crypto, 'randomUUID', { configurable: true, value: undefined })
  })
})

test.describe('ods-app', () => {
  test('mounts one element per area for the current view and nothing else', async ({ page }) => {
    await openGallery(page)
    await expect(page.locator('ods-app')).toHaveCount(1)
    await expect(page.locator('ods-gallery')).toHaveCount(1)
    for (const tag of ['ods-header', 'ods-library', 'ods-canvas', 'ods-inspector', 'ods-code-view', 'ods-new-dashboard-dialog']) {
      await expect(page.locator(tag), `${tag} must not exist in the gallery`).toHaveCount(0)
    }

    await openDashboard(page, 'Kitchen display')
    await expect(page.locator('ods-gallery')).toHaveCount(0)
    for (const tag of ['ods-header', 'ods-library', 'ods-canvas', 'ods-inspector']) await expect(page.locator(tag)).toHaveCount(1)
    await expect(page.locator('ods-inspector').locator('ods-structure')).toHaveCount(1)
    await expect(page.locator('ods-canvas').locator('ods-zoom-bar')).toHaveCount(1)

    await page.getByRole('button', { name: 'Code', exact: true }).click()
    await expect(page.locator('ods-code-view')).toHaveCount(1)
    for (const tag of ['ods-canvas', 'ods-library', 'ods-inspector']) await expect(page.locator(tag)).toHaveCount(0)
    await expect(page.locator('ods-header')).toHaveCount(1)

    await page.getByRole('button', { name: 'Design', exact: true }).click()
    await expect(page.locator('ods-canvas')).toHaveCount(1)
    await expect(page.locator('ods-code-view')).toHaveCount(0)
  })

  test('keeps zoom and pan when the code view is opened and closed', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: '2×' }).click()
    await page.locator('.canvas-stage').dispatchEvent('wheel', { deltaY: 60 })
    const transform = () => page.locator('.canvas-viewport').evaluate(element => (element as HTMLElement).style.transform)
    const before = await transform()
    await page.getByRole('button', { name: 'Code', exact: true }).click()
    await page.getByRole('button', { name: 'Design', exact: true }).click()
    await expect.poll(transform).toBe(before)
    await expect(zoomReadout(page)).toHaveText('200%')
  })
})

test.describe('ods-header', () => {
  test('enables Save only after an edit and sends the edited dashboard', async ({ page }) => {
    await openKitchen(page)
    const save = page.getByRole('button', { name: 'Save', exact: true })
    await expect(save).toBeDisabled()

    await page.getByRole('textbox', { name: 'Dashboard name' }).fill('Kitchen renamed')
    await expect(save).toBeEnabled()
    await save.click()
    await expect(save).toBeDisabled()
    expect(await lastCall(page, 'opendisplay_studio/update_dashboard')).toMatchObject({ dashboard_id: 'demo', dashboard: { name: 'Kitchen renamed' } })
  })

  test('toggles between Ready and Draft and shows the status', async ({ page }) => {
    await openKitchen(page)
    const status = page.locator('ods-header .status')
    await expect(status).toHaveText('draft')
    await page.getByRole('button', { name: 'Set Ready', exact: true }).click()
    await expect(status).toHaveText('ready')
    await page.getByRole('button', { name: 'Set Draft', exact: true }).click()
    await expect(status).toHaveText('draft')
  })

  test('marks the active view and returns to the gallery from the breadcrumb', async ({ page }) => {
    await openKitchen(page)
    await expect(page.getByRole('button', { name: 'Design', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Code', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Code', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'Design', exact: true })).toHaveAttribute('aria-pressed', 'false')
    await page.getByRole('button', { name: 'Dashboards', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Dashboards', exact: true })).toBeVisible()
  })
})

test.describe('ods-library', () => {
  test('collapses to a rail, reclaims the column and expands again', async ({ page }) => {
    await openKitchen(page)
    const firstColumn = () => page.locator('.layout').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ')[0])
    expect(await firstColumn()).toBe('255px')
    await page.getByRole('button', { name: 'Collapse element catalog' }).click()
    await expect(page.getByRole('button', { name: 'Expand element catalog' })).toBeVisible()
    expect(await firstColumn()).toBe('48px')
    await page.getByRole('button', { name: 'Expand element catalog' }).click()
    await expect(page.getByRole('searchbox', { name: 'Search widgets and primitives' })).toBeVisible()
    expect(await firstColumn()).toBe('255px')
  })

  test('says when nothing matches and restores the list when the search is cleared', async ({ page }) => {
    await openKitchen(page)
    const search = page.getByRole('searchbox', { name: 'Search widgets and primitives' })
    await search.fill('zzzz')
    await expect(page.getByText('No matching widgets')).toBeVisible()
    await expect(page.getByText('No matching primitives')).toBeVisible()
    await search.fill('')
    await expect(page.getByRole('button', { name: /Rectangle/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Temperature/ })).toBeVisible()
  })

  test('adds an element with a click and selects it', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: /Circle/ }).click()
    await expect(page.getByRole('heading', { name: 'Circle', exact: true })).toBeVisible()
    await expect(page.locator('.layer-row')).toHaveCount(2)
    await expect(page.locator('.layer-row.active')).toContainText('Circle')
  })
})

test.describe('ods-structure', () => {
  test('counts layers, marks the selected one and shows an empty hint', async ({ page }) => {
    await openKitchen(page)
    const count = page.locator('ods-structure .count')
    await expect(count).toHaveText('1')
    await kitchenWidget(page).click()
    await expect(page.locator('.layer-row[data-item-id="temperature"]')).toHaveClass(/active/)
    await page.getByRole('button', { name: /Rectangle/ }).click()
    await expect(count).toHaveText('2')

    await page.getByRole('button', { name: 'Dashboards', exact: true }).click()
    page.once('dialog', dialog => void dialog.accept())
    await openDashboard(page, 'Hallway overview')
    await expect(page.getByText('Drag widgets or primitives onto the canvas.')).toBeVisible()
    await expect(page.locator('ods-structure .count')).toHaveText('0')
  })

  test('lists the top layer first', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: /Circle/ }).click()
    const names = await page.locator('.layer-row strong').allTextContents()
    expect(names).toEqual(['Circle', 'Kitchen'])
  })

  test('asks before deleting and keeps the element when cancelled or dismissed', async ({ page }) => {
    await openKitchen(page)
    await revealRowActions(page)
    await page.getByRole('button', { name: 'Delete Kitchen' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { name: 'Delete Kitchen?' })).toBeVisible()
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog).toHaveCount(0)
    await expect(page.locator('.layer-row')).toHaveCount(1)

    await revealRowActions(page)
    await page.getByRole('button', { name: 'Delete Kitchen' }).click()
    await expect(dialog).toBeVisible()
    await page.mouse.click(4, 4)
    await expect(dialog).toHaveCount(0)
    await expect(page.locator('.layer-row')).toHaveCount(1)
  })
})

test.describe('ods-inspector', () => {
  const inspectorWidth = async (page: Page) => (await page.locator('.inspector').boundingBox())?.width ?? 0
  const dragResizer = async (page: Page, toX: number) => {
    const box = await page.getByRole('separator', { name: 'Resize inspector' }).boundingBox()
    if (!box) throw new Error('Inspector resizer is not visible')
    await page.mouse.move(box.x + box.width / 2, box.y + 100)
    await page.mouse.down()
    await page.mouse.move(toX, box.y + 100, { steps: 6 })
    await page.mouse.up()
  }

  test('resizes within 286–560 px and remembers the width across collapse', async ({ page }) => {
    await openKitchen(page)
    await dragResizer(page, 0)
    await expect.poll(() => inspectorWidth(page)).toBeCloseTo(560, 0)
    await dragResizer(page, 1400)
    await expect.poll(() => inspectorWidth(page)).toBeCloseTo(286, 0)

    await page.getByRole('button', { name: 'Collapse inspector' }).click()
    await expect(page.getByRole('button', { name: 'Expand inspector' })).toBeVisible()
    await page.getByRole('button', { name: 'Expand inspector' }).click()
    await expect.poll(() => inspectorWidth(page)).toBeCloseTo(286, 0)
  })

  test('shows dashboard settings when nothing is selected and item settings when something is', async ({ page }) => {
    await openKitchen(page)
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
    await expect(page.getByText('Render diagnostics')).toBeVisible()
    await kitchenWidget(page).click()
    await expect(page.getByRole('heading', { name: 'Kitchen', exact: true })).toBeVisible()
    await expect(page.getByRole('spinbutton', { name: 'Inner padding' })).toBeVisible()
    await page.locator('.canvas').click({ position: { x: 700, y: 400 } })
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
  })

  test('offers the layout fields that belong to the selected primitive', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: /Circle/ }).click()
    for (const label of ['Center X', 'Center Y', 'Radius']) await expect(page.getByRole('spinbutton', { name: label, exact: true })).toBeVisible()
    await page.getByRole('button', { name: /QR code/ }).click()
    for (const label of ['X', 'Y', 'Module size']) await expect(page.getByRole('spinbutton', { name: label, exact: true })).toBeVisible()
  })

  test('changes the display type, palette and background', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('combobox', { name: 'Display type' }).selectOption('eink-spectra6-13-3')
    await expect(page.locator('.workspace-meta')).toContainText('1200 × 1600 px')
    await expect(page.getByRole('combobox', { name: 'Palette' })).toHaveValue('spectra6')
    await page.getByRole('combobox', { name: 'Background' }).selectOption('black')
    await expect(page.getByRole('combobox', { name: 'Background' })).toHaveValue('black')
    await expect(page.getByRole('button', { name: 'Undo' })).toBeEnabled()
  })

  test('deletes the dashboard from the danger zone', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: 'Delete dashboard', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Dashboards', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Open dashboard Kitchen display' })).toHaveCount(0)
    expect(await lastCall(page, 'opendisplay_studio/delete_dashboard')).toMatchObject({ dashboard_id: 'demo' })
  })
})

test.describe('ods-property-field', () => {
  test('clamps typed values into the working area', async ({ page }) => {
    await openKitchen(page)
    await kitchenWidget(page).click()
    await xField(page).fill('99999'); await xField(page).press('Tab')
    await expect(xField(page)).toHaveValue('460')
    await xField(page).fill('5'); await xField(page).press('Tab')
    await expect(xField(page)).toHaveValue('20')
  })

  test('is disabled while the element is locked and enabled again after unlocking', async ({ page }) => {
    await openKitchen(page)
    await kitchenWidget(page).click()
    await page.getByRole('button', { name: 'Lock Kitchen' }).click()
    await expect(page.getByText('Position is locked')).toBeVisible()
    await expect(xField(page)).toBeDisabled()
    await page.getByRole('button', { name: 'Unlock element position' }).click()
    await expect(xField(page)).toBeEnabled()
    await expect(page.getByText('Position is locked')).toHaveCount(0)
  })

  test('applies a value once per change and records it as one undo step', async ({ page }) => {
    await openKitchen(page)
    await kitchenWidget(page).click()
    await xField(page).fill('100'); await xField(page).press('Tab')
    await expect(xField(page)).toHaveValue('100')
    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(xField(page)).toHaveValue('40')
    await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled()
  })
})

test.describe('ods-zoom-bar', () => {
  test('steps, presets and limits', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: '2×' }).click()
    await expect(zoomReadout(page)).toHaveText('200%')
    await expect(page.getByRole('button', { name: '2×' })).toHaveClass(/active/)
    await page.getByRole('button', { name: 'Zoom in' }).click()
    await expect(zoomReadout(page)).toHaveText('225%')
    await page.getByRole('button', { name: 'Zoom out' }).click()
    await expect(zoomReadout(page)).toHaveText('200%')

    for (let step = 0; step < 12; step += 1) await page.getByRole('button', { name: 'Zoom in' }).click()
    await expect(zoomReadout(page)).toHaveText('400%')
    for (let step = 0; step < 20; step += 1) await page.getByRole('button', { name: 'Zoom out' }).click()
    await expect(zoomReadout(page)).toHaveText('25%')

    await page.getByRole('button', { name: 'Reset' }).click()
    await expect(zoomReadout(page)).toHaveText('100%')
    await page.getByRole('button', { name: 'Fit' }).click()
    await expect(zoomReadout(page)).not.toHaveText('100%')
  })
})

test.describe('ods-canvas', () => {
  test('starts with undo and redo disabled', async ({ page }) => {
    await openKitchen(page)
    await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Redo' })).toBeDisabled()
  })

  test('moves by the snap grid, or by single pixels when Snap is off, and undoes and redoes', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: 'Reset' }).click()
    await kitchenWidget(page).click()
    await expect(xField(page)).toHaveValue('40')

    await dragBy(page, kitchenWidget(page), 13)
    await expect(xField(page)).toHaveValue('55')
    await expect(page.getByRole('button', { name: 'Undo' })).toBeEnabled()

    await page.getByRole('button', { name: /^Snap/ }).click()
    await expect(page.getByRole('button', { name: /^Snap/ })).toHaveAttribute('aria-pressed', 'false')
    await dragBy(page, kitchenWidget(page), 13)
    await expect(xField(page)).toHaveValue('68')

    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(xField(page)).toHaveValue('55')
    await page.getByRole('button', { name: 'Redo' }).click()
    await expect(xField(page)).toHaveValue('68')
  })

  test('does not move a locked element but still selects it', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: 'Reset' }).click()
    await revealRowActions(page)
    await page.getByRole('button', { name: 'Lock Kitchen' }).click()
    await dragBy(page, kitchenWidget(page), 80)
    await expect(kitchenWidget(page)).toHaveClass(/selected/)
    await expect(xField(page)).toHaveValue('40')
  })

  test('shows the live size next to the selection and clears it on deselect', async ({ page }) => {
    await openKitchen(page)
    await kitchenWidget(page).click()
    await expect(page.locator('.selection-size')).toHaveText('320 × 180')
    await page.locator('.canvas').click({ position: { x: 700, y: 400 } })
    await expect(page.locator('.selection-size')).toHaveCount(0)
  })

  test('ends a move with one history step and one preview request', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: 'Reset' }).click()
    const previewsBefore = await callCount(page, 'opendisplay_studio/compose_preview')
    await dragBy(page, kitchenWidget(page), 40, 20)
    await expect.poll(() => callCount(page, 'opendisplay_studio/compose_preview')).toBe(previewsBefore + 1)
    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(page.getByRole('button', { name: 'Undo' })).toBeDisabled()
  })
})

test.describe('ods-gallery and ods-context-menu', () => {
  const trigger = (page: Page, name: string) => page.getByRole('button', { name: `Dashboard actions for ${name}`, exact: true })
  const openMenu = async (page: Page, name: string) => {
    await page.getByRole('button', { name: `Open dashboard ${name}`, exact: true }).hover()
    await trigger(page, name).click()
  }

  test('shows one menu at a time and closes it with Escape or an outside click', async ({ page }) => {
    await openGallery(page)
    await openMenu(page, 'Kitchen display')
    await expect(page.getByRole('menu')).toHaveCount(1)
    await openMenu(page, 'Hallway overview')
    await expect(page.getByRole('menu')).toHaveCount(1)
    await expect(page.getByRole('menu', { name: 'Actions for Hallway overview' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('menu')).toHaveCount(0)

    await openMenu(page, 'Office status')
    await expect(page.getByRole('menu')).toHaveCount(1)
    await page.getByRole('heading', { name: 'Dashboards', exact: true }).click()
    await expect(page.getByRole('menu')).toHaveCount(0)
  })

  test('marks the destructive menu action and closes the menu when an action is chosen', async ({ page }) => {
    await openGallery(page)
    await openMenu(page, 'Office status')
    await expect(page.getByRole('menuitem', { name: 'Delete', exact: true })).toHaveClass(/delete/)
    await page.getByRole('menuitem', { name: 'Delete', exact: true }).click()
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expect(page.getByRole('dialog', { name: 'Delete dashboard?' })).toBeVisible()
  })

  test('closes an action dialog with Escape without changing anything', async ({ page }) => {
    await openGallery(page)
    await openMenu(page, 'Office status')
    await page.getByRole('menuitem', { name: 'Delete', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'Delete dashboard?' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: 'Delete dashboard?' })).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Open dashboard Office status' })).toBeVisible()
    expect(await callCount(page, 'opendisplay_studio/delete_dashboard')).toBe(0)
  })

  test('does not rename to an empty name and keeps the dashboard as it was', async ({ page }) => {
    await openGallery(page)
    await openMenu(page, 'Office status')
    await page.getByRole('menuitem', { name: 'Rename', exact: true }).click()
    const rename = page.getByRole('textbox', { name: 'Rename dashboard Office status', exact: true })
    await rename.fill('   ')
    await rename.press('Enter')
    await expect(page.getByText('Dashboard name cannot be empty')).toBeVisible()
    expect(await callCount(page, 'opendisplay_studio/update_dashboard')).toBe(0)
  })
})

test.describe('ods-new-dashboard-dialog', () => {
  test('cannot create without a name and creates nothing when cancelled', async ({ page }) => {
    await openGallery(page)
    await page.getByRole('button', { name: 'New dashboard', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'New dashboard' })
    const create = dialog.getByRole('button', { name: 'Create dashboard' })
    await expect(create).toBeDisabled()
    await dialog.getByRole('textbox', { name: 'Dashboard name' }).fill('Draft board')
    await expect(create).toBeEnabled()
    await dialog.getByRole('spinbutton', { name: 'Width' }).fill('10')
    await expect(create).toBeDisabled()
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await expect(dialog).toHaveCount(0)
    expect(await callCount(page, 'opendisplay_studio/create_dashboard')).toBe(0)
  })

  test('starts fresh every time it is opened', async ({ page }) => {
    await openGallery(page)
    await page.getByRole('button', { name: 'New dashboard', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'New dashboard' })
    await dialog.getByRole('textbox', { name: 'Dashboard name' }).fill('Leftover')
    await dialog.getByRole('button', { name: 'Cancel' }).click()
    await page.getByRole('button', { name: 'New dashboard', exact: true }).click()
    await expect(page.getByRole('dialog', { name: 'New dashboard' }).getByRole('textbox', { name: 'Dashboard name' })).toHaveValue('')
  })
})

test.describe('ods-code-view', () => {
  test('shows read-only YAML and gives feedback when it is copied', async ({ page }) => {
    await openKitchen(page)
    await page.getByRole('button', { name: 'Code', exact: true }).click()
    const yaml = page.getByRole('textbox', { name: 'Generated ODL YAML' })
    await expect(yaml).toHaveAttribute('readonly', '')
    await expect(yaml).not.toHaveValue('')
    await page.getByRole('button', { name: 'Copy generated ODL YAML' }).click()
    await expect(page.getByText('YAML copied to clipboard')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Copy generated ODL YAML' })).toContainText('Copied')
    await expect(page.getByRole('button', { name: 'Copy generated ODL YAML' })).toContainText('Copy YAML', { timeout: 5000 })
  })
})
