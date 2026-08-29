import { expect, test } from '@playwright/test'
import { openStudio, projects, waitForProject } from './helpers'

test.describe('project actions', () => {
  test.beforeEach(async ({ page }) => {
    await openStudio(page)
  })

  test('renames, duplicates, changes status, selects, and deletes a display', async ({ page }) => {
    await page.getByRole('button', { name: 'Rename' }).click()
    await page.getByLabel('Display name').fill('Discarded name')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.locator('.project-title strong')).toHaveText('Kitchen dashboard')

    await page.getByRole('button', { name: 'Rename' }).click()
    await page.getByLabel('Display name').fill('Hall dashboard')
    await page.getByRole('button', { name: 'Save name' }).click()
    await waitForProject(page, (project) => project.name === 'Hall dashboard')
    await expect(page.locator('.project-title strong')).toHaveText('Hall dashboard')

    await page.getByRole('button', { name: 'Duplicate' }).click()
    await waitForProject(page, (project) => project.name === 'Hall dashboard copy')
    await expect(page.locator('.project-title strong')).toHaveText('Hall dashboard copy')
    expect(await projects(page)).toHaveLength(2)

    await page.getByRole('button', { name: 'Move to Draft' }).click()
    await waitForProject(page, (project) => project.name === 'Hall dashboard copy' && project.status === 'draft')
    await expect(page.getByRole('button', { name: 'Mark Ready' })).toBeVisible()
    await page.getByRole('button', { name: 'Mark Ready' }).click()
    await waitForProject(page, (project) => project.name === 'Hall dashboard copy' && project.status === 'ready')

    await page.locator('.project-card').filter({ hasText: 'Hall dashboard' }).first().click()
    await expect(page.locator('.project-title strong')).toHaveText('Hall dashboard')

    await page.getByRole('button', { name: 'Delete' }).click()
    await expect.poll(async () => (await projects(page)).length).toBe(1)
    await expect(page.locator('.project-title strong')).toHaveText('Hall dashboard copy')
  })

  test('collapses and expands the saved display rail', async ({ page }) => {
    const rail = page.getByLabel('Saved displays')
    await page.getByRole('button', { name: 'Collapse displays panel' }).click()
    await expect(rail).toHaveClass(/collapsed/)
    await expect(page.locator('.project-list')).toBeHidden()

    await page.getByRole('button', { name: 'Expand displays panel' }).click()
    await expect(rail).not.toHaveClass(/collapsed/)
    await expect(page.locator('.project-list')).toBeVisible()
  })

  test('adds another display from the saved display rail', async ({ page }) => {
    await page.getByRole('button', { name: '+ New' }).click()
    await expect(page.getByText('Prepare the canvas', { exact: true })).toBeVisible()
    await expect.poll(async () => (await projects(page)).length).toBe(2)
    await expect(page.locator('#device-model')).toHaveValue('opendisplay-seeed-7-5-diy')
  })
})

test('creates the first display with the canonical default device', async ({ page }) => {
  await openStudio(page, 'empty')
  await expect(page.getByText('No displays yet')).toBeVisible()

  await page.getByRole('button', { name: 'Create your first display' }).click()
  await expect(page.getByText('Prepare the canvas', { exact: true })).toBeVisible()
  await expect(page.locator('#device-model')).toHaveValue('opendisplay-seeed-7-5-diy')

  const [project] = await projects(page)
  expect(project).toMatchObject({
    name: 'Untitled display 1',
    displayId: 'opendisplay-seeed-7-5-diy',
    width: 800,
    height: 480,
  })
})
