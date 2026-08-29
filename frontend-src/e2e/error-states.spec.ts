import { expect, test } from '@playwright/test'
import { openStudio } from './helpers'

test('shows bootstrap failures and allows retry', async ({ page }) => {
  await openStudio(page, 'bootstrap-error')
  await expect(page.getByText('Demo bootstrap failed')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Retry' })).toBeVisible()
})

test('shows exact preview failures without hiding editable regions', async ({ page }) => {
  await openStudio(page, 'preview-error')
  await expect(page.getByText('Demo renderer failed').first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sensor region' })).toBeVisible()
})

