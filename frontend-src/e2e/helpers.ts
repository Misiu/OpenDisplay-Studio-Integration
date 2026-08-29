import { expect, type Locator, type Page } from '@playwright/test'

export interface TestRegion {
  id: string
  label?: string
  row: number
  column: number
  rowSpan: number
  columnSpan: number
  appearance?: { showBackground: boolean, showBorder: boolean }
  widget?: { type: string, version: string, config: Record<string, unknown> }
}

export interface TestProject {
  id: string
  name: string
  status: 'draft' | 'ready'
  language: string
  displayId: string
  width: number
  height: number
  orientation: 'landscape' | 'portrait'
  palette: string
  theme: string
  fontFamily: string
  textScale: string
  grid: { columns: number, rows: number }
  screenPadding: number
  regionGap: number
  regions: TestRegion[]
  background?: {
    media: { media_content_id: string }
    mode: string
    anchor: string
    scale: number
  }
}

export const app = (page: Page): Locator => page.locator('opendisplay-studio-panel')

export const projects = async (page: Page): Promise<TestProject[]> => page.evaluate(() => {
  const testApi = (window as Window & {
    __ODX_E2E__: { projects: () => TestProject[] }
  }).__ODX_E2E__
  return testApi.projects()
})

export const openStudio = async (page: Page, scenario = 'default'): Promise<void> => {
  const query = scenario === 'default' ? '' : `?scenario=${scenario}`
  await page.goto(`/${query}`)
  await expect(app(page)).toBeVisible()
  if (scenario !== 'bootstrap-error') await expect(page.locator('.loading-state')).toHaveCount(0)
}

export const openLayoutEditor = async (page: Page): Promise<void> => {
  await page.getByRole('button', { name: 'Edit device & layout' }).click()
  await expect(page.getByText('Prepare the canvas', { exact: true })).toBeVisible()
}

export const setAndCommit = async (locator: Locator, value: string): Promise<void> => {
  await locator.fill(value)
  await locator.press('Tab')
}

export const waitForPreview = async (page: Page): Promise<void> => {
  const preview = page.locator('.rendered-preview')
  await expect(preview).toBeVisible()
  await expect.poll(() => preview.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true)
}

export const waitForProject = async (
  page: Page,
  predicate: (project: TestProject) => boolean,
): Promise<TestProject> => {
  await expect.poll(async () => (await projects(page)).some(predicate)).toBe(true)
  return (await projects(page)).find(predicate)!
}
