import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import type { WidgetDefinition, WidgetLoadError } from "./types";

/**
 * Every widget that can be added to a dashboard, with a picture of it, what it is and how
 * large it starts, and the packages that could not be loaded. A reload picks up packages
 * added to the folder. Adding, removing and switching off packages is shown, but not yet
 * possible.
 */
@customElement("ods-settings-widgets")
export class OdsSettingsWidgets extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: block;
      }
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        margin-bottom: 16px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 14px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .widget {
        display: grid;
        align-content: start;
        gap: 8px;
        padding: 12px 12px 14px;
        border: 1px solid var(--studio-border);
        border-radius: 13px;
        background: var(--studio-surface);
      }
      /* Every preview is shown in the same area, whatever size the picture is. */
      .picture {
        position: relative;
        aspect-ratio: 5 / 3;
        overflow: hidden;
        border-radius: 9px;
        background: var(--secondary-background-color, #eef1f2);
      }
      .picture img {
        position: absolute;
        inset: 10px;
        margin: auto;
        max-width: calc(100% - 20px);
        max-height: calc(100% - 20px);
        border-radius: 4px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
      }
      .picture ha-icon {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 44px;
        height: 44px;
        color: var(--studio-muted);
        --mdc-icon-size: 44px;
      }
      .widget .title {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 4px;
        font-size: 14px;
        font-weight: 600;
      }
      .widget .title ha-icon {
        color: var(--studio-accent);
      }
      .widget p {
        margin: 0;
        padding: 0 4px;
        color: var(--studio-muted);
        font-size: 12px;
        line-height: 1.45;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 0 4px;
      }
      .chip {
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--secondary-background-color, #eef1f2);
        color: var(--studio-muted);
        font-size: 11px;
      }
      .soon {
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--studio-accent-soft);
        color: var(--studio-text);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      ha-alert {
        display: block;
        margin-bottom: 14px;
      }
    `,
  ];

  @property({ attribute: false }) public widgets: WidgetDefinition[] = [];
  @property({ attribute: false }) public errors: WidgetLoadError[] = [];

  private reload(): void {
    emit(this, "widgets-reload");
  }

  /** The widget's picture, or its icon where there is no picture or it did not load. */
  private renderPicture(widget: WidgetDefinition): TemplateResult {
    if (!widget.preview) {
      return html`
        <div class="picture" title=${strings.settings.widgets.noPreview}>
          <ha-icon icon=${widget.icon}></ha-icon>
        </div>
      `;
    }
    return html`
      <div class="picture">
        <img
          src=${widget.preview}
          alt=${widget.name}
          loading="lazy"
          decoding="async"
        />
      </div>
    `;
  }

  private renderWidget(widget: WidgetDefinition): TemplateResult {
    const { width, height } = widget.layout.defaultSize;
    const origin = widget.builtin
      ? strings.settings.widgets.builtin
      : strings.settings.widgets.custom;
    return html`
      <li class="widget" data-widget=${widget.id}>
        ${this.renderPicture(widget)}
        <span class="title">
          <ha-icon icon=${widget.icon}></ha-icon>
          ${widget.name}
        </span>
        <p>${widget.description}</p>
        <div class="meta">
          <span class="chip">${widget.category}</span>
          <span class="chip">${origin}</span>
          <span class="chip">
            ${strings.settings.widgets.version(widget.version)}
          </span>
          <span class="chip" title=${strings.settings.widgets.defaultSize}>
            ${strings.common.size(width, height)}
          </span>
        </div>
      </li>
    `;
  }

  private renderErrors(): TemplateResult | typeof nothing {
    if (this.errors.length === 0) return nothing;
    return html`
      <ha-alert alert-type="warning" title=${strings.settings.widgets.errors}>
        ${this.errors.map(
          (error) => html`
            <div>
              <strong>${error.folder}</strong>
              : ${error.message}
            </div>
          `
        )}
      </ha-alert>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="toolbar">
        <span class="soon">${strings.settings.soon}</span>
        <ha-button appearance="plain" disabled>
          <ha-icon slot="start" icon="mdi:package-variant-plus"></ha-icon>
          ${strings.settings.widgets.upload}
        </ha-button>
        <ha-button appearance="plain" @click=${this.reload}>
          <ha-icon slot="start" icon="mdi:refresh"></ha-icon>
          ${strings.settings.widgets.reload}
        </ha-button>
      </div>
      ${this.renderErrors()}
      <ul class="grid" aria-label=${strings.settings.widgets.list}>
        ${this.widgets.map((widget) => this.renderWidget(widget))}
      </ul>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-settings-widgets": OdsSettingsWidgets;
  }
}
