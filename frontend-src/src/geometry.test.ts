import { describe, expect, it } from 'vitest'
import { constrainItem, itemBounds, primitiveBounds, resizeItem, snapToGrid, transformItem, translateItem, workingArea } from './geometry'
import { clamp } from './math'
import { circleItem, dashboardWith, rectangleItem, textItem, widgetItem } from './test-support'

describe('clamp and snapToGrid', () => {
  it('clamps into the range', () => {
    expect([clamp(-5, 0, 10), clamp(5, 0, 10), clamp(15, 0, 10)]).toEqual([0, 5, 10])
  })

  it('snaps to the grid measured from the padding when enabled', () => {
    const dashboard = dashboardWith([], { padding: 3, snapSize: 10 })
    expect(snapToGrid(18, dashboard, true)).toBe(23)
    expect(snapToGrid(18.4, dashboard, false)).toBe(18)
  })
})

describe('workingArea', () => {
  it('is the display minus the padding on every side', () => {
    expect(workingArea(dashboardWith([], { padding: 10 }))).toEqual({ x: 10, y: 10, width: 380, height: 280 })
  })
})

describe('itemBounds', () => {
  it('uses the inclusive pixel box of rectangles and the frame of widgets', () => {
    expect(itemBounds(rectangleItem())).toEqual({ x: 20, y: 30, width: 100, height: 50 })
    expect(itemBounds(widgetItem())).toEqual({ x: 10, y: 10, width: 200, height: 100 })
  })

  it('covers the whole circle, icon and QR code', () => {
    expect(itemBounds(circleItem())).toEqual({ x: 80, y: 80, width: 41, height: 41 })
    expect(primitiveBounds({ type: 'icon', value: 'x', x: 5, y: 6, size: 24, color: 'black', anchor: 'lt' })).toEqual({ x: 5, y: 6, width: 24, height: 24 })
    expect(primitiveBounds({ type: 'qrcode', data: 'x', x: 0, y: 0, boxsize: 3, border: 1, color: 'black', bgcolor: 'white' })).toEqual({ x: 0, y: 0, width: 69, height: 69 })
  })
})

describe('translateItem', () => {
  it('moves widgets, box primitives, circles and text by the same offset', () => {
    const widget = widgetItem(); translateItem(widget, 5, -3)
    expect(itemBounds(widget)).toMatchObject({ x: 15, y: 7 })
    const rectangle = rectangleItem(); translateItem(rectangle, 10, 10)
    expect(itemBounds(rectangle)).toEqual({ x: 30, y: 40, width: 100, height: 50 })
    const circle = circleItem(); translateItem(circle, -20, 0)
    expect(itemBounds(circle)).toMatchObject({ x: 60, y: 80 })
    const text = textItem(); translateItem(text, 1, 2)
    expect(itemBounds(text)).toMatchObject({ x: 11, y: 12 })
  })
})

describe('constrainItem', () => {
  it('pulls an item back into the working area', () => {
    const dashboard = dashboardWith([], { padding: 10 })
    const rectangle = rectangleItem('r', { x_start: -50, x_end: 49, y_start: 290, y_end: 339 })
    constrainItem(rectangle, dashboard)
    expect(itemBounds(rectangle)).toEqual({ x: 10, y: 240, width: 100, height: 50 })
  })

  it('shrinks a widget that is larger than the working area', () => {
    const widget = widgetItem(); widget.frame = { x: 0, y: 0, width: 900, height: 900 }
    constrainItem(widget, dashboardWith())
    expect(widget.frame).toMatchObject({ width: 400, height: 300 })
  })
})

describe('resizeItem', () => {
  const resize = (item: ReturnType<typeof rectangleItem>, handle: Parameters<typeof resizeItem>[1], dx: number, dy: number, shift = false) => {
    resizeItem(item, handle, dx, dy, shift, dashboardWith(), { snapEnabled: false })
    return itemBounds(item)
  }

  it('grows a rectangle from its south-east handle', () => {
    expect(resize(rectangleItem(), 'se', 10, 5)).toEqual({ x: 20, y: 30, width: 110, height: 55 })
  })

  it('keeps the circle centred and round when resized', () => {
    const circle = circleItem(); resizeItem(circle, 'se', 20, 20, false, dashboardWith(), { snapEnabled: false })
    const bounds = itemBounds(circle)
    expect(bounds.width).toBe(bounds.height)
    expect(bounds.width).toBeGreaterThan(41)
  })

  it('never shrinks a widget below its minimum size', () => {
    const widget = widgetItem()
    resizeItem(widget, 'se', -500, -500, false, dashboardWith(), { snapEnabled: false, minSize: { width: 60, height: 48 } })
    expect(widget.frame).toMatchObject({ width: 60, height: 48 })
  })
})

describe('transformItem', () => {
  const options = { snapEnabled: true }

  it('moves an item snapped to the grid and leaves the original untouched', () => {
    const original = rectangleItem()
    const moved = transformItem(original, { mode: 'move' }, 13, 7, dashboardWith(), options)
    expect(itemBounds(moved)).toMatchObject({ x: 35, y: 35, width: 100, height: 50 })
    expect(itemBounds(original).x).toBe(20)
  })

  it('does not move an item out of the working area', () => {
    const moved = transformItem(rectangleItem(), { mode: 'move' }, 9999, -9999, dashboardWith(), options)
    expect(itemBounds(moved)).toMatchObject({ x: 300, y: 0 })
  })

  it('moves by whole pixels when snapping is off', () => {
    const moved = transformItem(rectangleItem(), { mode: 'move' }, 13, 7, dashboardWith(), { snapEnabled: false })
    expect(itemBounds(moved)).toMatchObject({ x: 33, y: 37 })
  })

  it('returns a locked item as it was', () => {
    const locked = rectangleItem(); locked.locked = true
    expect(transformItem(locked, { mode: 'move' }, 50, 50, dashboardWith(), options)).toEqual(locked)
  })

  it('resizes from a handle', () => {
    const resized = transformItem(rectangleItem(), { mode: 'resize', handle: 'se', shiftKey: false }, 10, 5, dashboardWith(), { snapEnabled: false })
    expect(itemBounds(resized)).toMatchObject({ width: 110, height: 55 })
  })
})
