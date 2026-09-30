import { isBoxPrimitive } from './geometry'
import { PALETTE_COLORS } from './display-profiles'
import type { Dashboard, HaFormSchema, PaletteId, PrimitiveItem, StudioItem } from './types'

/** One numeric layout input of the inspector. */
export interface LayoutField { label: string; key: string; value: number; min: number; max: number }

/** The layout inputs of an item: a grid of position/size fields plus any that sit below it. */
export interface LayoutFields { grid: LayoutField[]; extra: LayoutField[] }

/** The numeric layout fields the inspector shows for an item, by kind and primitive type. */
export const layoutFields = (item: StudioItem, dashboard: Dashboard): LayoutFields => {
  const { width, height } = dashboard.display
  const field = (label: string, key: string, value: number, min: number, max: number): LayoutField => ({ label, key, value, min, max })
  if (item.kind === 'widget') {
    return {
      grid: [field('X', 'x', item.frame.x, 0, width), field('Y', 'y', item.frame.y, 0, height), field('Width', 'width', item.frame.width, 1, width), field('Height', 'height', item.frame.height, 1, height)],
      extra: [field('Inner padding', 'padding', item.layout.padding, 0, 128)],
    }
  }
  const primitive = item.primitive
  if (isBoxPrimitive(primitive)) {
    return { grid: [field('X', 'x', Math.min(primitive.x_start, primitive.x_end), 0, width), field('Y', 'y', Math.min(primitive.y_start, primitive.y_end), 0, height), field('Width', 'width', Math.abs(primitive.x_end - primitive.x_start) + 1, 1, width), field('Height', 'height', Math.abs(primitive.y_end - primitive.y_start) + 1, 1, height)], extra: [] }
  }
  if (primitive.type === 'circle') {
    return { grid: [field('Center X', 'x', primitive.x, 0, width), field('Center Y', 'y', primitive.y, 0, height), field('Radius', 'radius', primitive.radius, 1, Math.min(width, height))], extra: [] }
  }
  if (primitive.type === 'qrcode') {
    return { grid: [field('X', 'x', primitive.x, 0, width), field('Y', 'y', primitive.y, 0, height), field('Module size', 'boxsize', primitive.boxsize, 1, 16)], extra: [] }
  }
  return { grid: [field('X', 'x', primitive.x, 0, width), field('Y', 'y', primitive.y, 0, height), field('Size', 'size', primitive.size, 6, 256)], extra: [] }
}

/** The `ha-form` schema for a primitive's appearance, with colours limited to the palette. */
export const primitiveAppearanceSchema = (item: PrimitiveItem, palette: PaletteId): HaFormSchema[] => {
  const colors = [...PALETTE_COLORS[palette], 'accent']
  const color = (name: string, label: string, options: string[] = colors): HaFormSchema => ({ name, label, selector: { select: { options } } })
  const number = (name: string, label: string, min: number, max: number): HaFormSchema => ({ name, label, selector: { number: { min, max } } })
  const text = (name: string, label: string): HaFormSchema => ({ name, label, selector: { text: {} } })
  const toggle = (name: string, label: string): HaFormSchema => ({ name, label, selector: { boolean: {} } })
  switch (item.primitive.type) {
    case 'text': return [text('value', 'Text'), color('color', 'Color')]
    case 'line': return [color('fill', 'Color'), number('width', 'Line width', 1, 32), toggle('dashed', 'Dashed')]
    case 'icon': return [text('value', 'MDI icon name'), color('color', 'Color')]
    case 'qrcode': return [text('data', 'Content'), number('border', 'Quiet zone', 0, 8), color('color', 'Foreground'), color('bgcolor', 'Background')]
    case 'progress_bar': return [number('progress', 'Progress', 0, 100), color('direction', 'Direction', ['right', 'left', 'up', 'down']), color('fill', 'Fill'), color('background', 'Background'), toggle('show_percentage', 'Show percentage')]
    default: return [color('fill', 'Fill', ['transparent', ...colors]), color('outline', 'Outline'), number('width', 'Outline width', 0, 32)]
  }
}
