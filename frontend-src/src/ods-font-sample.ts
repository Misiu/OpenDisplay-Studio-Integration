import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { loadFontFace } from "./font-faces";
import { strings } from "./strings";
import type { FontInfo, HomeAssistant } from "./types";

/**
 * A font in its own letters: the sample text written in the font itself, in the color of the
 * text around it, so it follows the light and dark theme. A font the browser cannot load
 * says so in words.
 */
@customElement("ods-font-sample")
export class OdsFontSample extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-width: 0;
      color: var(--primary-text-color);
    }
    .sample {
      overflow: hidden;
      font-size: var(--ods-sample-size, 20px);
      line-height: 1.3;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sample.loading {
      visibility: hidden;
    }
    .none {
      color: var(--studio-muted);
      font-size: 11px;
    }
  `;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public font?: FontInfo;

  @state() private family?: string;
  @state() private failed = false;

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("font") || changed.has("hass")) void this.load();
  }

  private async load(): Promise<void> {
    const { hass, font } = this;
    if (!hass || !font) return;
    const family = await loadFontFace(hass, font);
    // The font may have changed while the file was on its way.
    if (font !== this.font) return;
    this.family = family;
    this.failed = family === undefined;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.font) return nothing;
    if (this.failed) {
      return html`
        <span class="none">${strings.settings.fonts.noPreview}</span>
      `;
    }
    return html`
      <div
        class="sample ${this.family ? "" : "loading"}"
        style=${`font-family: "${this.family ?? "inherit"}"`}
      >
        ${strings.settings.fonts.sample}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-font-sample": OdsFontSample;
  }
}
