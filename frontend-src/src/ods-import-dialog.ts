import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { suggestedMapping, type ColorToMap } from "./dashboard-file";
import { emit, type OdsEvent } from "./events";
import { sourceColorHex } from "./palettes";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import type {
  Dashboard,
  HomeAssistant,
  PaletteId,
  PrimitiveField,
} from "./types";
import "./ods-value-field";

/**
 * The dialog that confirms an import. It says what is replaced and, when the file uses colors
 * the dashboard's palette does not have, lists each of them with a picker for the color of the
 * palette it becomes. It reports the choice with `import-confirm`.
 */
@customElement("ods-import-dialog")
export class OdsImportDialog extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .scrim {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: grid;
        place-items: center;
        padding: 20px;
        background: rgba(8, 15, 24, 0.62);
        backdrop-filter: blur(3px);
      }
      .dialog {
        width: min(480px, 100%);
        max-height: calc(100vh - 40px);
        overflow: auto;
        border-radius: 14px;
        background: var(--studio-surface);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
      }
      .dialog > header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px 8px;
      }
      .dialog h2 {
        margin: 3px 0 0;
        font-size: 21px;
      }
      .body {
        display: grid;
        gap: 12px;
        padding: 4px 20px 16px;
        font-size: 13px;
        line-height: 1.5;
      }
      .body p {
        margin: 0;
        color: var(--studio-muted);
      }
      .mapping {
        display: grid;
        gap: 8px;
      }
      .mapping-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1.4fr);
        align-items: center;
        gap: 8px;
      }
      .source {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        font-family: var(--code-font-family, monospace);
        font-size: 12px;
      }
      .swatch {
        flex: none;
        width: 18px;
        height: 18px;
        border: 1px solid var(--studio-border);
        border-radius: 5px;
      }
      .arrow {
        color: var(--studio-muted);
        text-align: center;
      }
      .dialog footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 14px 20px;
        border-top: 1px solid var(--studio-border);
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  /** The colors of the file the palette lacks. */
  @property({ attribute: false }) public colors: ColorToMap[] = [];
  /** Whether the open dashboard has elements that the import replaces. */
  @property({ type: Boolean }) public replaces = false;
  @property({ type: Boolean }) public busy = false;
  /** Elements were made smaller or moved nearer so that they fit this display. */
  @property({ type: Boolean }) public adjusted = false;
  @property({ attribute: false }) public display!: Dashboard["display"];

  /** The color of the palette chosen for each color of the file. */
  @state() private mapping: Record<string, string> = {};

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("colors")) this.mapping = suggestedMapping(this.colors);
  }

  private get palette(): PaletteId {
    return this.display.palette;
  }

  private cancel(): void {
    emit(this, "import-cancel");
  }

  private confirm(): void {
    emit(this, "import-confirm", { colorMap: this.mapping });
  }

  private onScrimClick(event: Event): void {
    if (event.target === event.currentTarget) this.cancel();
  }

  private onTargetChange(event: OdsEvent<"primitive-field-change">): void {
    event.stopPropagation();
    const { key, value } = event.detail;
    if (typeof value === "string") {
      this.mapping = { ...this.mapping, [key]: value };
    }
  }

  private targetField(row: ColorToMap): PrimitiveField {
    return {
      key: row.source,
      label: "",
      shape: "color",
      section: "appearance",
      default: row.suggestion,
    };
  }

  private renderRow(row: ColorToMap): TemplateResult {
    const swatch = sourceColorHex(row.source) ?? "transparent";
    return html`
      <div class="mapping-row" data-source-color=${row.source}>
        <span class="source">
          <span class="swatch" style=${`background: ${swatch}`}></span>
          ${row.source}
        </span>
        <span class="arrow" aria-hidden="true">→</span>
        <ods-value-field
          .hass=${this.hass}
          .field=${this.targetField(row)}
          .value=${this.mapping[row.source] ?? row.suggestion}
          .palette=${this.palette}
          .display=${this.display}
          @primitive-field-change=${this.onTargetChange}
        ></ods-value-field>
      </div>
    `;
  }

  private renderMapping(): TemplateResult | typeof nothing {
    if (this.colors.length === 0) return nothing;
    return html`
      <ha-alert alert-type="warning">
        <strong>${strings.importDialog.colorsTitle}</strong>
        <br />
        ${strings.importDialog.colorsHelp}
      </ha-alert>
      <div class="mapping">
        ${this.colors.map((row) => this.renderRow(row))}
      </div>
    `;
  }

  private renderReplaceNotice(): TemplateResult | typeof nothing {
    if (!this.replaces) return nothing;
    return html`
      <p>${strings.importDialog.replaces}</p>
    `;
  }

  private renderAdjusted(): TemplateResult | typeof nothing {
    if (!this.adjusted) return nothing;
    return html`
      <ha-alert alert-type="info">${strings.importDialog.adjusted}</ha-alert>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="scrim" role="presentation" @click=${this.onScrimClick}>
        <section
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-title"
        >
          <header>
            <div>
              <span class="eyebrow">${strings.importDialog.eyebrow}</span>
              <h2 id="import-title">${strings.importDialog.heading}</h2>
            </div>
            <button
              class="icon-button"
              aria-label=${strings.common.close}
              @click=${this.cancel}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="body">
            ${this.renderReplaceNotice()} ${this.renderAdjusted()}
            ${this.renderMapping()}
          </div>
          <footer>
            <ha-button appearance="plain" @click=${this.cancel}>
              ${strings.common.cancel}
            </ha-button>
            <ha-button
              appearance="filled"
              .disabled=${this.busy}
              @click=${this.confirm}
            >
              ${strings.importDialog.confirm}
            </ha-button>
          </footer>
        </section>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-import-dialog": OdsImportDialog;
  }
}
