import { html, type TemplateResult } from 'lit'
import type { WidgetConfig } from '../types'

export const configText = (
  config: WidgetConfig,
  key: string,
): string => String(config[key] ?? '')

export const configNumber = (
  config: WidgetConfig,
  key: string,
): number => Number(config[key] ?? 0)

export const renderIcon = (path: string, label = ''): TemplateResult => html`
  <svg class="widget-icon" viewBox="0 0 24 24" role="img" aria-label=${label}>
    <path d=${path}></path>
  </svg>
`

export const renderButtonIcon = (path: string): TemplateResult => html`
  <svg slot="start" class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d=${path}></path>
  </svg>
`
