import { describe, expect, it } from 'vitest'
import { layoutFields, primitiveAppearanceSchema } from './item-fields'
import { circleItem, dashboardWith, rectangleItem, textItem, widgetItem } from './test-support'
import type { PrimitiveItem } from './types'

const dashboard = dashboardWith()
const keys = (fields: { key: string }[]) => fields.map(field => field.key)

describe('layoutFields', () => {
  it('gives widgets position, size and a separate inner padding field', () => {
    const fields = layoutFields(widgetItem(), dashboard)
    expect(keys(fields.grid)).toEqual(['x', 'y', 'width', 'height'])
    expect(keys(fields.extra)).toEqual(['padding'])
    expect(fields.grid[2]).toMatchObject({ label: 'Width', value: 200, min: 1, max: 400 })
  })

  it('reports box primitives as top-left plus inclusive size', () => {
    const { grid } = layoutFields(rectangleItem(), dashboard)
    expect(grid.map(field => field.value)).toEqual([20, 30, 100, 50])
  })

  it('reports a reversed line by its top-left corner', () => {
    const line = rectangleItem('l', { x_start: 100, x_end: 40 })
    expect(layoutFields(line, dashboard).grid[0].value).toBe(40)
  })

  it('uses centre and radius for circles, module size for QR codes, size for text', () => {
    expect(layoutFields(circleItem(), dashboard).grid.map(field => field.label)).toEqual(['Center X', 'Center Y', 'Radius'])
    const qr: PrimitiveItem = { id: 'q', kind: 'primitive', locked: false, hidden: false, primitive: { type: 'qrcode', data: 'x', x: 1, y: 2, boxsize: 3, border: 1, color: 'black', bgcolor: 'white' } }
    expect(layoutFields(qr, dashboard).grid.map(field => field.key)).toEqual(['x', 'y', 'boxsize'])
    expect(layoutFields(textItem(), dashboard).grid.map(field => field.key)).toEqual(['x', 'y', 'size'])
  })
})

describe('primitiveAppearanceSchema', () => {
  const names = (item: PrimitiveItem, palette = 'bw' as const) => primitiveAppearanceSchema(item, palette).map(entry => entry.name)

  it('offers the fields of each primitive type', () => {
    expect(names(textItem())).toEqual(['value', 'color'])
    expect(names(rectangleItem())).toEqual(['fill', 'outline', 'width'])
    expect(names(circleItem())).toEqual(['fill', 'outline', 'width'])
    expect(names(rectangleItem('l', { type: 'line', fill: 'black', dashed: false } as never))).toEqual(['fill', 'width', 'dashed'])
  })

  it('limits colours to the palette plus accent, and lets fills be transparent', () => {
    const schema = primitiveAppearanceSchema(rectangleItem(), 'bwr')
    const fill = schema.find(entry => entry.name === 'fill')
    expect(fill?.selector).toEqual({ select: { options: ['transparent', 'black', 'white', 'red', 'accent'] } })
    const outline = schema.find(entry => entry.name === 'outline')
    expect(outline?.selector).toEqual({ select: { options: ['black', 'white', 'red', 'accent'] } })
  })
})
