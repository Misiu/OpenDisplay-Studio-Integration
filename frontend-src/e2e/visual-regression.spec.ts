import { expect, test } from '@playwright/test'
import { openLayoutEditor, openStudio, setAndCommit, waitForPreview } from './helpers'

const backgroundUri = 'media-source://media_source/local/backgrounds/mountain-dashboard-background.png'

test('widget workspace visual baseline', async ({ page }) => {
  await openStudio(page)
  await waitForPreview(page)
  await expect(page.locator('opendisplay-studio-panel')).toHaveScreenshot('widget-workspace.png')
})

test('dense layout with a background has one aligned grid and contained inspector', async ({ page }) => {
  await openStudio(page, 'empty')
  await page.getByRole('button', { name: 'Create your first display' }).click()
  await setAndCommit(page.locator('#grid-columns'), '12')
  await setAndCommit(page.locator('#grid-rows'), '8')
  await page.locator('ha-form.background-media-form input').fill(backgroundUri)
  await setAndCommit(page.locator('#screen-padding'), '16')
  await setAndCommit(page.locator('#region-gap'), '5')
  await page.getByRole('button', { name: 'Grid cell column 5, row 4' }).click()
  await page.getByRole('button', { name: 'Grid cell column 8, row 7' }).click()

  const inspector = page.locator('.layout-guide')
  await expect.poll(() => inspector.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true)
  await expect(page.locator('opendisplay-studio-panel')).toHaveScreenshot('dense-layout-background.png')
})

test('transparent bordered region is the only block in widget preview', async ({ page }) => {
  await openStudio(page, 'empty')
  await page.getByRole('button', { name: 'Create your first display' }).click()
  await page.locator('ha-form.background-media-form input').fill(backgroundUri)
  await page.getByRole('button', { name: 'Grid cell column 1, row 1' }).click()
  await page.getByRole('button', { name: 'Grid cell column 2, row 2' }).click()
  await page.getByRole('button', { name: 'Apply layout' }).click()
  await waitForPreview(page)
  await page.getByRole('button', { name: 'Empty region' }).click()
  await page.getByLabel('Show border').check()
  await page.locator('.widget-choice').filter({ hasText: 'Sensor' }).click()
  await waitForPreview(page)

  await expect(page.locator('.preview-overlay .screen-region')).toHaveCount(1)
  const region = page.getByRole('button', { name: 'Sensor region' })
  await expect(region).toHaveClass(/region-border/)
  await expect(region).not.toHaveClass(/region-background/)
  await expect(page.locator('opendisplay-studio-panel')).toHaveScreenshot('transparent-bordered-region.png')
})

test('layout inspector remains usable at a narrower desktop viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await openStudio(page)
  await openLayoutEditor(page)
  await page.locator('ha-form.background-media-form input').fill(backgroundUri)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await expect(page.locator('opendisplay-studio-panel')).toHaveScreenshot('narrow-layout-inspector.png')
})
