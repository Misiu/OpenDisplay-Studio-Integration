import type { Dashboard, PrimitiveItem, StudioItem, WidgetItem } from './types'

export const rectangleItem = (id = 'rect', overrides: Partial<PrimitiveItem['primitive']> = {}): PrimitiveItem => ({
  id, kind: 'primitive', locked: false, hidden: false,
  primitive: { type: 'rectangle', x_start: 20, y_start: 30, x_end: 119, y_end: 79, fill: null, outline: 'black', width: 2, ...overrides } as PrimitiveItem['primitive'],
})

export const circleItem = (id = 'circle'): PrimitiveItem => ({
  id, kind: 'primitive', locked: false, hidden: false,
  primitive: { type: 'circle', x: 100, y: 100, radius: 20, fill: null, outline: 'black', width: 2 },
})

export const textItem = (id = 'text'): PrimitiveItem => ({
  id, kind: 'primitive', locked: false, hidden: false,
  primitive: { type: 'text', value: 'Text', x: 10, y: 10, size: 32, color: 'black' },
})

export const widgetItem = (id = 'widget'): WidgetItem => ({
  id, kind: 'widget', locked: false, hidden: false,
  widget: { type: 'sensor', version: '1', config: {} },
  frame: { x: 10, y: 10, width: 200, height: 100 },
  layout: { padding: 0 },
})

export const dashboardWith = (items: StudioItem[] = [], display: Partial<Dashboard['display']> = {}): Dashboard => ({
  id: 'd1', schemaVersion: 1, name: 'Test', status: 'draft', language: 'en',
  display: { profileId: 'custom', width: 400, height: 300, palette: 'bw', background: 'white', padding: 0, snapSize: 5, ...display },
  items, createdAt: '', updatedAt: '',
})
