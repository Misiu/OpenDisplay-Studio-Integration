import { expect, test } from '@playwright/test'
import { openStudio, projects, waitForPreview, waitForProject } from './helpers'

test.describe('widget editor', () => {
  test.beforeEach(async ({ page }) => {
    await openStudio(page)
    await waitForPreview(page)
    await page.getByRole('button', { name: 'Sensor region' }).click()
    await expect(page.getByText('Appearance', { exact: true })).toBeVisible()
  })

  test('keeps background and border independent and persists transparent widget regions', async ({ page }) => {
    const background = page.getByLabel('Show background')
    const border = page.getByLabel('Show border')
    await expect(background).not.toBeChecked()
    await expect(border).not.toBeChecked()

    await border.check()
    let project = await waitForProject(page, (item) => item.regions[0]?.appearance?.showBorder === true)
    expect(project.regions[0].appearance).toEqual({ showBackground: false, showBorder: true, borderRadius: null })
    await expect(page.getByRole('button', { name: 'Sensor region' })).toHaveClass(/region-border/)
    await expect(page.getByRole('button', { name: 'Sensor region' })).not.toHaveClass(/region-background/)

    await background.check()
    project = await waitForProject(page, (item) => item.regions[0]?.appearance?.showBackground === true)
    expect(project.regions[0].appearance).toEqual({ showBackground: true, showBorder: true, borderRadius: null })
    await background.uncheck()
    await waitForProject(page, (item) => item.regions[0]?.appearance?.showBackground === false)
  })

  test('assigns and configures every bundled widget type', async ({ page }) => {
    await page.locator('.widget-choice').filter({ hasText: 'Text' }).click()
    await page.getByLabel('Title').fill('Notice')
    await page.getByLabel('Title').press('Tab')
    await page.getByLabel('Content').fill('Doors are locked')
    await page.getByLabel('Content').press('Tab')
    await page.getByLabel('Alignment').selectOption('center')
    await waitForProject(page, (project) => project.regions[0]?.widget?.type === 'text')

    await page.locator('.widget-choice').filter({ hasText: 'Calendar' }).click()
    await page.getByRole('textbox', { name: 'Calendar' }).fill('calendar.family')
    await page.getByRole('textbox', { name: 'Calendar' }).press('Tab')
    await page.getByLabel('Day range').fill('14')
    await page.getByLabel('Day range').press('Tab')
    await page.getByLabel('Show description').check()
    await waitForProject(page, (project) => project.regions[0]?.widget?.type === 'calendar')

    await page.getByRole('button', { name: /^Weather Current conditions/ }).click()
    await page.getByLabel('Weather entity').fill('weather.home')
    await page.getByLabel('Weather entity').press('Tab')
    await page.getByLabel('Show humidity').uncheck()
    await waitForProject(page, (project) => project.regions[0]?.widget?.type === 'weather')

    await page.locator('.widget-choice').filter({ hasText: 'Sensor' }).click()
    await page.getByLabel('Sensor entity').fill('sensor.office_temperature')
    await page.getByLabel('Sensor entity').press('Tab')
    await page.getByLabel('Show entity ID').uncheck()
    const project = await waitForProject(page, (item) => item.regions[0]?.widget?.type === 'sensor')
    expect(project.regions[0].widget?.config).toMatchObject({
      entity: 'sensor.office_temperature',
      showEntityId: false,
      showFooter: true,
    })
  })

  test('supports keyboard selection and widget removal', async ({ page }) => {
    const calendarRegion = page.getByRole('button', { name: 'Calendar region' })
    await calendarRegion.focus()
    await calendarRegion.press('Enter')
    await expect(page.locator('.widget-choice.active')).toContainText('Calendar')

    await page.getByRole('button', { name: 'Remove widget' }).click()
    await expect.poll(async () => (await projects(page))[0].regions.find((region) => region.id === 'calendar')?.widget).toBeUndefined()
    await expect(page.getByText('Choose a widget', { exact: true })).toBeVisible()
  })

  test('supports display and region corner radii', async ({ page }) => {
    await page.getByLabel('Corner radius (px)').fill('7')
    await page.getByLabel('Corner radius (px)').press('Tab')

    const project = await waitForProject(page, (item) => item.regions[0]?.appearance?.borderRadius === 7)
    expect(project.regions[0].appearance?.borderRadius).toBe(7)
    await expect(page.getByRole('button', { name: 'Sensor region' })).toHaveCSS('border-radius', '7px')

    await page.getByLabel('Corner radius (px)').fill('')
    await page.getByLabel('Corner radius (px)').press('Tab')
    await waitForProject(page, (item) => item.regions[0]?.appearance?.borderRadius === null)
  })

  test('offers only display palette colors to new dashboard widgets', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit device & layout' }).click()
    await page.locator('#device-model').selectOption('custom')
    await page.locator('#palette').selectOption('bwry')
    await page.getByRole('button', { name: 'Apply layout' }).click()
    await waitForPreview(page)
    await page.getByRole('button', { name: 'Sensor region' }).click()

    await page.locator('.widget-choice').filter({ hasText: 'Section Title' }).click()
    const dateColors = page.getByRole('group', { name: 'Date color' })
    await expect(dateColors.getByRole('radio')).toHaveCount(4)
    await dateColors.getByText('Red', { exact: true }).click()
    let project = await waitForProject(page, (item) => item.regions[0]?.widget?.type === 'section-title')
    expect(project.regions[0].widget?.config.dateColor).toBe('#d22626')

    await page.locator('.widget-choice').filter({ hasText: 'Hero Weather' }).click()
    await page.getByRole('textbox', { name: 'Weather entity' }).fill('weather.home')
    await page.getByRole('textbox', { name: 'Weather entity' }).press('Tab')
    project = await waitForProject(page, (item) => item.regions[0]?.widget?.type === 'hero-weather')
    expect(project.regions[0].widget?.config).toMatchObject({
      weather: 'weather.home',
      primaryColor: '#000000',
      accentColor: '#d22626',
    })
  })
})
