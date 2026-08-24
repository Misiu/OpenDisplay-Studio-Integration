import type { CSSResult, TemplateResult } from 'lit'

export type Orientation = 'landscape' | 'portrait'

export type PaletteId =
  | 'bw'
  | 'gray4'
  | 'gray16'
  | 'bwr'
  | 'bwy'
  | 'bwry'
  | 'spectra6'

export interface GridSize {
  columns: number
  rows: number
}

export interface DisplayProfile {
  id: string
  manufacturer: string
  family: string
  name: string
  diagonal: number
  nativeWidth: number
  nativeHeight: number
  nativeOrientation: Orientation
  palettes: PaletteId[]
  defaultPalette: PaletteId
  grid: Record<Orientation, GridSize>
  freezer?: boolean
  source?: string
  connectorPins?: number[]
  toolboxId?: string
}

export interface CustomDriverProfile {
  id: string
  name: string
  connectorPins: number[]
  source: string
}

export interface WidgetInstance {
  type: string
  version: number
  config: WidgetConfig
}

export interface GridRegion {
  id: string
  label?: string
  row: number
  column: number
  rowSpan: number
  columnSpan: number
  widget?: WidgetInstance
}

export interface ScreenProject {
  id: string
  schemaVersion: 1
  name: string
  status: 'draft' | 'ready'
  displayId: string
  driverId?: string
  orientation: Orientation
  palette: PaletteId
  width: number
  height: number
  grid: GridSize
  regions: GridRegion[]
  createdAt: string
  updatedAt: string
}

export interface PersistedState {
  schemaVersion: 1
  activeProjectId: string
  projects: ScreenProject[]
}

export type WidgetConfigValue = string | number | boolean | string[]
export type WidgetConfig = Record<string, WidgetConfigValue>

export type WidgetFieldType = 'text' | 'number' | 'select' | 'toggle' | 'entity' | 'entities' | 'calendar'

export interface WidgetOption {
  key: string
  label: string
  type: WidgetFieldType
  min?: number
  max?: number
  step?: number
  options?: Array<{ label: string; value: string }>
  help?: string
  required?: boolean
  multiline?: boolean
}

export interface WidgetRenderContext {
  compact: boolean
  palette: PaletteId
}

export interface WidgetDefinition {
  id: string
  version: number
  name: string
  description: string
  icon: string
  defaults: WidgetConfig
  options: WidgetOption[]
  styles: CSSResult
  render: (
    config: WidgetConfig,
    context: WidgetRenderContext,
  ) => TemplateResult
}

export interface HomeAssistant {
  callWS<T>(message: Record<string, unknown>): Promise<T>
}

export interface BootstrapResponse {
  projects: ScreenProject[]
  widgets: Array<{
    id: string
    version: number
    name: string
    description: string
    icon: string
    defaults: WidgetConfig
    fields: WidgetOption[]
    dataRequirements: Array<{
      key: string
      provider: string
      configKey: string
      cardinality: 'one' | 'many'
      optional: boolean
      rangeConfigKey?: string
    }>
  }>
}

export interface CellCoordinate {
  row: number
  column: number
}
