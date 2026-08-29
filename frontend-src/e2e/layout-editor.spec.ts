import { expect, test } from '@playwright/test'
import {
  openLayoutEditor,
  openStudio,
  projects,
  setAndCommit,
  waitForPreview,
  waitForProject,
} from './helpers'

const backgroundUri = 'media-source://media_source/local/backgrounds/very-long-mountain-background-file-name.png'

test.describe('layout editor', () => {
  test.beforeEach(async ({ page }) => {
    await openStudio(page)
    await waitForPreview(page)
    await openLayoutEditor(page)
  })

  test('cancels draft changes without persisting them', async ({ page }) => {
    await page.getByRole('group', { name: 'Display theme' }).getByRole('button', { name: 'Dark' }).click()
    await setAndCommit(page.locator('#grid-columns'), '12')
    await setAndCommit(page.locator('#grid-rows'), '8')
    await page.getByRole('button', { name: 'Cancel' }).click()

    const [project] = await projects(page)
    expect(project.theme).toBe('light')
    expect(project.grid).toEqual({ columns: 3, rows: 2 })
    await expect(page.locator('.widget-toolbar')).toBeVisible()
  })

  test('applies device, palette, typography, orientation, grid, background, and spacing', async ({ page }) => {
    await page.locator('#device-model').selectOption('custom')
    await setAndCommit(page.locator('#custom-width'), '1024')
    await setAndCommit(page.locator('#custom-height'), '600')
    await page.locator('#palette').selectOption('bwr')
    await page.getByRole('group', { name: 'Display theme' }).getByRole('button', { name: 'Dark' }).click()
    await page.locator('#font-family').selectOption('classic')
    await page.locator('#text-scale').selectOption('large')
    await page.getByRole('group', { name: 'Display orientation' }).getByRole('button', { name: 'Portrait' }).click()
    await setAndCommit(page.locator('#grid-columns'), '12')
    await setAndCommit(page.locator('#grid-rows'), '8')

    await page.locator('ha-form.background-media-form input').fill(backgroundUri)
    await page.getByRole('button', { name: 'Manual' }).click()
    await page.getByRole('button', { name: 'Bottom right' }).click()
    await setAndCommit(page.locator('#background-scale'), '50')
    await setAndCommit(page.locator('#screen-padding'), '20')
    await setAndCommit(page.locator('#region-gap'), '6')
    await page.getByRole('textbox', { name: 'Display language' }).fill('pl')
    await page.getByRole('textbox', { name: 'Display language' }).press('Tab')

    await page.getByRole('button', { name: 'Grid cell column 5, row 4' }).click()
    await page.getByRole('button', { name: 'Grid cell column 8, row 7' }).click()
    await expect(page.getByText('Region A created')).toBeVisible()
    await page.getByRole('button', { name: 'Apply layout' }).click()

    const project = await waitForProject(page, (item) => item.grid.columns === 12 && item.grid.rows === 8)
    expect(project).toMatchObject({
      displayId: 'custom',
      width: 600,
      height: 1024,
      orientation: 'portrait',
      palette: 'bwr',
      theme: 'dark',
      fontFamily: 'classic',
      textScale: 'large',
      language: 'pl',
      screenPadding: 20,
      regionGap: 6,
      background: {
        media: { media_content_id: backgroundUri },
        mode: 'manual',
        anchor: 'bottom-right',
        scale: 50,
      },
    })
    expect(project.regions).toContainEqual(expect.objectContaining({
      label: 'A',
      row: 4,
      column: 5,
      rowSpan: 4,
      columnSpan: 4,
    }))
  })

  test('draws and removes a composed region without creating a second grid', async ({ page }) => {
    await setAndCommit(page.locator('#grid-columns'), '12')
    await setAndCommit(page.locator('#grid-rows'), '8')
    const mergeCells = page.locator('.merge-cell')
    const layoutCells = page.locator('.screen-region.layout-region')
    await expect(mergeCells).toHaveCount(96)
    await expect(layoutCells).toHaveCount(96)

    const mergeBox = await mergeCells.first().boundingBox()
    const layoutBox = await layoutCells.first().boundingBox()
    expect(mergeBox).not.toBeNull()
    expect(layoutBox).not.toBeNull()
    expect(Math.abs(mergeBox!.x - layoutBox!.x)).toBeLessThan(1)
    expect(Math.abs(mergeBox!.y - layoutBox!.y)).toBeLessThan(1)
    expect(Math.abs(mergeBox!.width - layoutBox!.width)).toBeLessThan(1)
    expect(Math.abs(mergeBox!.height - layoutBox!.height)).toBeLessThan(1)

    await page.getByRole('button', { name: 'Grid cell column 2, row 2' }).click()
    await page.getByRole('button', { name: 'Grid cell column 5, row 5' }).click()
    await expect(page.getByRole('region', { name: 'Region A' })).toBeVisible()
    await page.getByRole('button', { name: 'Existing region at column 3, row 3; double-click to remove' }).dblclick()
    await expect(page.getByRole('region', { name: 'Region A' })).toHaveCount(0)
    await expect(mergeCells).toHaveCount(96)
  })

  test('removes an assigned background', async ({ page }) => {
    await page.locator('ha-form.background-media-form input').fill(backgroundUri)
    await expect(page.getByRole('button', { name: 'Remove' }).last()).toBeVisible()
    await page.getByRole('button', { name: 'Remove' }).last().click()
    await expect(page.getByText('No background image.')).toBeVisible()
  })

  test('supports every background fit mode and anchor position', async ({ page }) => {
    await page.locator('ha-form.background-media-form input').fill(backgroundUri)

    for (const mode of ['Stretch', 'Fit', 'Cover', 'Manual']) {
      const button = page.getByRole('button', { name: mode })
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
    }

    await page.getByRole('button', { name: 'Fit' }).click()
    for (const anchor of [
      'Top left',
      'Top center',
      'Top right',
      'Center left',
      'Center',
      'Center right',
      'Bottom left',
      'Bottom center',
      'Bottom right',
    ]) {
      const button = page.getByRole('button', { name: anchor, exact: true })
      await button.click()
      await expect(button).toHaveAttribute('aria-pressed', 'true')
    }
  })
})
