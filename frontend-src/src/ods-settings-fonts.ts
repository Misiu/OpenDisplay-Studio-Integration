import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { codeFrom, messageFrom } from "./error-message";
import { rememberFonts } from "./font-catalog";
import {
  FONT_ACCEPT,
  MAX_FONT_BYTES,
  fileAsBase64,
  fileSizeLabel,
  isFontFile,
} from "./font-file";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import * as api from "./studio-api";
import type { FontInfo, HomeAssistant } from "./types";
import "./ods-confirm-dialog";
import "./ods-font-sample";

const MAX_NAMES_LISTED = 6;

/** What went wrong with a font, in words: the backend's reason where there is one. */
const failureText = (error: unknown, fallback: string): string => {
  const code = codeFrom(error);
  const known = code ? strings.settings.fonts.errors[code] : undefined;
  return known ?? messageFrom(error, fallback);
};

/**
 * The fonts of the renderer and the ones the user installed: drop or pick font files to add
 * them, see each in its own letters and which dashboards use it, and remove one. A font that
 * dashboards still use asks first, and their text is drawn with the default font meanwhile.
 */
@customElement("ods-settings-fonts")
export class OdsSettingsFonts extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: block;
      }
      .drop {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 18px;
        padding: 14px 16px;
        border: 1px dashed var(--studio-border);
        border-radius: 12px;
        background: var(--studio-surface);
      }
      .drop.over {
        border-color: var(--studio-accent);
        background: var(--studio-accent-soft);
      }
      .drop .hint {
        flex: 1;
        color: var(--studio-muted);
        font-size: 12px;
      }
      .drop .hint strong {
        display: block;
        color: var(--studio-text);
        font-size: 13px;
      }
      .list {
        display: grid;
        gap: 10px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .font {
        display: grid;
        grid-template-columns: 300px minmax(0, 1fr) auto;
        align-items: center;
        gap: 16px;
        padding: 12px 16px;
        border: 1px solid var(--studio-border);
        border-radius: 12px;
        background: var(--studio-surface);
      }
      .font ods-font-sample {
        --ods-sample-size: 26px;
      }
      .font .family {
        display: block;
        overflow: hidden;
        font-size: 14px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .font .file {
        display: block;
        color: var(--studio-muted);
        font: 11px var(--code-font-family, monospace);
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }
      .chip {
        padding: 2px 8px;
        border-radius: 999px;
        background: var(--secondary-background-color, #eef1f2);
        color: var(--studio-muted);
        font-size: 11px;
      }
      .chip.used {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      ha-alert {
        display: block;
        margin-bottom: 14px;
      }
      @media (max-width: 760px) {
        .font {
          grid-template-columns: minmax(0, 1fr) auto;
        }
        .font ods-font-sample {
          grid-column: 1 / -1;
        }
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private fonts: FontInfo[] = [];
  @state() private error = "";
  @state() private busy = false;
  @state() private dragging = false;
  @state() private removing?: FontInfo;

  connectedCallback(): void {
    super.connectedCallback();
    void this.refresh();
  }

  private async refresh(): Promise<void> {
    if (!this.hass) return;
    try {
      this.show(await api.listFonts(this.hass));
    } catch (error) {
      this.error = messageFrom(error, strings.settings.fonts.loadFailed);
    }
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.fonts.length === 0) void this.refresh();
  }

  /** The list is shared with every font field, so a font is there to pick at once. */
  private show(fonts: FontInfo[]): void {
    this.fonts = fonts;
    rememberFonts(fonts);
  }

  // --- installing -------------------------------------------------------------------------

  private async installFile(file: File): Promise<void> {
    if (!this.hass) return;
    if (!isFontFile(file.name)) {
      this.error = strings.settings.fonts.notFontFile(file.name);
      return;
    }
    if (file.size > MAX_FONT_BYTES) {
      this.error = strings.settings.fonts.errors.invalid_size;
      return;
    }
    try {
      const data = await fileAsBase64(file);
      this.show(await api.installFont(this.hass, file.name, data));
    } catch (error) {
      this.error = failureText(error, strings.settings.fonts.installFailed);
    }
  }

  private async installFiles(files: FileList | null): Promise<void> {
    if (!files || this.busy) return;
    this.error = "";
    this.busy = true;
    for (const file of Array.from(files)) {
      await this.installFile(file);
    }
    this.busy = false;
  }

  private onFilesChosen(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    void this.installFiles(input.files).then(() => {
      input.value = "";
    });
  }

  private chooseFiles(): void {
    this.renderRoot
      .querySelector<HTMLInputElement>("input[type=file]")
      ?.click();
  }

  private onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging = true;
  }

  private onDragLeave(): void {
    this.dragging = false;
  }

  private onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    void this.installFiles(event.dataTransfer?.files ?? null);
  }

  // --- removing ---------------------------------------------------------------------------

  private askToRemove(font: FontInfo): void {
    this.removing = font;
  }

  private cancelRemoval(): void {
    this.removing = undefined;
  }

  private async confirmRemoval(): Promise<void> {
    const font = this.removing;
    this.removing = undefined;
    if (!font || !this.hass) return;
    this.error = "";
    try {
      this.show(await api.deleteFont(this.hass, font.name, true));
    } catch (error) {
      this.error = failureText(error, strings.settings.fonts.removeFailed);
    }
  }

  private removalBody(font: FontInfo): string {
    if (font.usedBy.length === 0) {
      return strings.settings.fonts.removeUnusedBody;
    }
    const names = font.usedBy
      .slice(0, MAX_NAMES_LISTED)
      .map((use) => use.name)
      .join(", ");
    const more = font.usedBy.length - MAX_NAMES_LISTED;
    return strings.settings.fonts.removeUsedBody(
      font.usedBy.length,
      more > 0 ? `${names}, +${more}` : names
    );
  }

  // --- rendering --------------------------------------------------------------------------

  private renderDrop(): TemplateResult {
    return html`
      <div
        class="drop ${this.dragging ? "over" : ""}"
        @dragover=${this.onDragOver}
        @dragleave=${this.onDragLeave}
        @drop=${this.onDrop}
      >
        <ha-icon icon="mdi:file-upload-outline"></ha-icon>
        <span class="hint">
          <strong>${strings.settings.fonts.dropHint}</strong>
          ${strings.settings.fonts.limit(fileSizeLabel(MAX_FONT_BYTES))}
        </span>
        <ha-button
          appearance="filled"
          .disabled=${this.busy}
          @click=${this.chooseFiles}
        >
          ${
            this.busy
              ? strings.settings.fonts.installing
              : strings.settings.fonts.install
          }
        </ha-button>
        <input
          type="file"
          accept=${FONT_ACCEPT}
          multiple
          hidden
          aria-label=${strings.settings.fonts.install}
          @change=${this.onFilesChosen}
        />
      </div>
    `;
  }

  private renderUsage(font: FontInfo): TemplateResult {
    if (font.usedBy.length === 0) {
      return html`
        <span class="chip">${strings.settings.fonts.unused}</span>
      `;
    }
    const names = font.usedBy.map((use) => use.name).join(", ");
    return html`
      <span class="chip used" title=${names}>
        ${strings.settings.fonts.usedIn(font.usedBy.length)}
      </span>
    `;
  }

  private renderAction(font: FontInfo): TemplateResult {
    if (font.bundled) {
      return html`
        <span class="chip">${strings.settings.fonts.bundled}</span>
      `;
    }
    const label = strings.settings.fonts.remove(font.name);
    return html`
      <button
        type="button"
        class="icon-button"
        title=${label}
        aria-label=${label}
        @click=${() => this.askToRemove(font)}
      >
        <ha-icon icon="mdi:delete-outline"></ha-icon>
      </button>
    `;
  }

  private renderFont(font: FontInfo): TemplateResult {
    return html`
      <li class="font" data-font=${font.name}>
        <ods-font-sample .hass=${this.hass} .font=${font}></ods-font-sample>
        <div>
          <span class="family">${font.family} ${font.style}</span>
          <span class="file">${font.name} · ${fileSizeLabel(font.size)}</span>
          <div class="chips">${this.renderUsage(font)}</div>
        </div>
        ${this.renderAction(font)}
      </li>
    `;
  }

  private renderError(): TemplateResult | typeof nothing {
    if (!this.error) return nothing;
    return html`
      <ha-alert alert-type="error">${this.error}</ha-alert>
    `;
  }

  private renderRemoval(): TemplateResult | typeof nothing {
    const font = this.removing;
    if (!font) return nothing;
    return html`
      <ods-confirm-dialog
        .eyebrow=${strings.settings.fonts.eyebrow}
        .heading=${strings.settings.fonts.removeTitle(font.name)}
        .body=${this.removalBody(font)}
        .confirmLabel=${strings.settings.fonts.removeAction}
        @confirm-cancel=${this.cancelRemoval}
        @confirm-accept=${this.confirmRemoval}
      ></ods-confirm-dialog>
    `;
  }

  protected render(): TemplateResult {
    return html`
      ${this.renderError()} ${this.renderDrop()}
      <ul class="list" aria-label=${strings.settings.fonts.list}>
        ${this.fonts.map((font) => this.renderFont(font))}
      </ul>
      ${this.renderRemoval()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-settings-fonts": OdsSettingsFonts;
  }
}
