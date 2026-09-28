export type PaletteId = 'bw' | 'bwr' | 'bwy' | 'bwry' | 'spectra6'
export type ProjectStatus = 'draft' | 'ready'

export type WidgetConfigValue = string | number | boolean | string[]
export type WidgetConfig = Record<string, WidgetConfigValue>

export interface ItemFrame { x: number; y: number; width: number; height: number }
export interface ItemState { locked: boolean; hidden: boolean }

export interface WidgetItem extends ItemState {
  id: string
  kind: 'widget'
  widget: { type: string; version: string; config: WidgetConfig }
  frame: ItemFrame
  layout: { padding: number }
}

export interface TextPrimitive { type: 'text'; value: string; x: number; y: number; size: number; color: string }
export interface RectanglePrimitive { type: 'rectangle'; x_start: number; y_start: number; x_end: number; y_end: number; fill: string | null; outline: string; width: number }
export interface LinePrimitive { type: 'line'; x_start: number; y_start: number; x_end: number; y_end: number; fill: string; width: number; dashed: boolean }
export interface CirclePrimitive { type: 'circle'; x: number; y: number; radius: number; fill: string | null; outline: string; width: number }
export interface EllipsePrimitive extends Omit<RectanglePrimitive, 'type'> { type: 'ellipse' }
export interface IconPrimitive { type: 'icon'; value: string; x: number; y: number; size: number; color: string; anchor: 'lt' }
export interface QrCodePrimitive { type: 'qrcode'; data: string; x: number; y: number; boxsize: number; border: number; color: string; bgcolor: string }
export interface ProgressBarPrimitive extends Omit<RectanglePrimitive, 'type' | 'fill'> { type: 'progress_bar'; progress: number; direction: 'right' | 'left' | 'up' | 'down'; background: string; fill: string; show_percentage: boolean }

export type Primitive = TextPrimitive | RectanglePrimitive | LinePrimitive | CirclePrimitive | EllipsePrimitive | IconPrimitive | QrCodePrimitive | ProgressBarPrimitive

export interface PrimitiveItem extends ItemState { id: string; kind: 'primitive'; primitive: Primitive }
export type StudioItem = WidgetItem | PrimitiveItem

export interface ScreenProject {
  id: string
  schemaVersion: 3
  name: string
  status: ProjectStatus
  language: string
  display: { profileId: string | null; width: number; height: number; palette: PaletteId; background: string; padding: number; snapSize: number }
  items: StudioItem[]
  createdAt: string
  updatedAt: string
}

export interface DisplayProfile { id: string; manufacturer: string; name: string; width: number; height: number; palettes: PaletteId[]; defaultPalette: PaletteId }

export interface WidgetField { key: string; label: string; required?: boolean; selector: Record<string, unknown> }
export interface WidgetDefinition {
  id: string
  version: string
  name: string
  description: string
  icon: string
  defaults: WidgetConfig
  fields: WidgetField[]
  layout: { defaultSize: { width: number; height: number }; minSize: { width: number; height: number } }
  dataRequirements: Array<Record<string, unknown>>
}

export interface PrimitiveDefinition { id: Primitive['type']; name: string; description: string; icon: string }
export interface ItemBounds { x: number; y: number; width: number; height: number }
export interface ComposePreviewResponse {
  imageUrl: string
  yaml: string
  itemBounds: Record<string, ItemBounds>
  warnings: string[]
  timings: { queue: number; data: number; compile: number; render: number; encode: number; pipeline: number }
}
export interface BootstrapResponse { version: string; projects: ScreenProject[]; widgets: WidgetDefinition[]; primitives: PrimitiveDefinition[] }
export interface HomeAssistant { callWS<T>(message: Record<string, unknown>): Promise<T>; language: string; states?: Record<string, { state: string; attributes?: Record<string, unknown> }> }
export interface HaFormSchema { name: string; label: string; required?: boolean; selector: Record<string, unknown> }
