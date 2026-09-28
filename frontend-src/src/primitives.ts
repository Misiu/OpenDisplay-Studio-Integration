import type { Primitive } from './types'

interface PrimitiveFactoryContext {
  x: number
  y: number
  displayWidth: number
  displayHeight: number
}

/** Build the exact ODL primitive selected in the catalog. */
export const createPrimitive = (type: string, context: PrimitiveFactoryContext): Primitive | undefined => {
  const { x, y, displayWidth, displayHeight } = context
  const right = Math.min(displayWidth - 1, x + 160)
  const bottom = Math.min(displayHeight - 1, y + 90)

  switch (type) {
    case 'text':
      return { type: 'text', value: 'Text', x, y, size: 32, color: 'black' }
    case 'rectangle':
      return { type: 'rectangle', x_start: x, y_start: y, x_end: right, y_end: bottom, fill: null, outline: 'black', width: 2 }
    case 'line':
      return { type: 'line', x_start: x, y_start: y, x_end: right, y_end: bottom, fill: 'black', width: 2, dashed: false }
    case 'circle': {
      const radius = Math.max(8, Math.min(40, x, y, displayWidth - x - 1, displayHeight - y - 1))
      return { type: 'circle', x, y, radius, fill: null, outline: 'black', width: 2 }
    }
    case 'ellipse':
      return { type: 'ellipse', x_start: x, y_start: y, x_end: right, y_end: bottom, fill: null, outline: 'black', width: 2 }
    case 'icon':
      return { type: 'icon', value: 'star-outline', x, y, size: 48, color: 'black', anchor: 'lt' }
    case 'qrcode':
      return { type: 'qrcode', data: 'ODX', x, y, boxsize: 3, border: 1, color: 'black', bgcolor: 'white' }
    case 'progress_bar':
      return { type: 'progress_bar', x_start: x, y_start: y, x_end: right, y_end: Math.min(displayHeight - 1, y + 32), progress: 50, direction: 'right', background: 'white', fill: 'accent', outline: 'black', width: 1, show_percentage: true }
    default:
      return undefined
  }
}
