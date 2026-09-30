import { css, html, LitElement, type TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { emit } from './events'
import { baseStyles } from './studio-styles'

/** One labelled numeric input of the inspector. Reports the raw text; the owner validates and clamps. */
@customElement('ods-property-field')
export class OdsPropertyField extends LitElement {
  static styles = [baseStyles, css`
    :host { display: block; min-width: 0; }
    .number-field { display: grid; gap: 5px; min-width: 0; color: var(--studio-muted); font-size: 10px; }
    .number-field input { width: 100%; min-width: 0; height: 36px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 7px; background: var(--secondary-background-color, #f3f5f6); color: var(--studio-text); }
    .number-field input:disabled { opacity: .55; }
  `]

  @property() public label = ''
  @property() public fieldKey = ''
  @property({ type: Number }) public value = 0
  @property({ type: Number }) public min = 0
  @property({ type: Number }) public max = 4096
  @property({ type: Boolean }) public disabled = false

  protected render(): TemplateResult {
    return html`<label class="number-field"><span>${this.label}</span><input data-field=${this.fieldKey} aria-label=${this.label} type="number" .value=${String(this.value)} min=${this.min} max=${this.max} .disabled=${this.disabled} @change=${(event: Event) => emit(this, 'field-change', { key: this.fieldKey, value: (event.target as HTMLInputElement).value })}></label>`
  }
}

declare global { interface HTMLElementTagNameMap { 'ods-property-field': OdsPropertyField } }
