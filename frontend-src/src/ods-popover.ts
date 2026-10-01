import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles } from "./studio-styles";

const GAP = 6;
const MARGIN = 8;

/**
 * A small panel that opens next to the control that asked for it, as the color and
 * anchor pickers of lvgl.espboards.dev do. It stays inside the window (below the control,
 * or above when there is no room) and closes on Escape, on a click outside it, or with
 * its close button, which it reports with `popover-close`.
 */
@customElement("ods-popover")
export class OdsPopover extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: contents;
      }
      .popover {
        /* In the top layer, so no ancestor of the panel can offset a fixed position. */
        position: fixed;
        inset: auto;
        margin: 0;
        z-index: 1100;
        max-height: calc(100vh - 16px);
        overflow: auto;
        padding: 10px 12px 12px;
        border: 1px solid var(--studio-border);
        border-radius: 12px;
        background: var(--studio-surface);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
        user-select: none;
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      h3 {
        margin: 0;
        color: var(--studio-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .close {
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;
        padding: 0;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--studio-muted);
      }
      .close:hover {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
    `,
  ];

  @property() public heading = "";
  /** Where the control is on screen. */
  @property({ attribute: false }) public anchor?: DOMRect;
  @property({ type: Number }) public width = 220;

  @query(".popover") private panel?: HTMLElement;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("pointerdown", this.onOutsidePointer, true);
    window.addEventListener("keydown", this.onKey, true);
  }

  disconnectedCallback(): void {
    window.removeEventListener("pointerdown", this.onOutsidePointer, true);
    window.removeEventListener("keydown", this.onKey, true);
    this.resizeObserver.disconnect();
    super.disconnectedCallback();
  }

  /** The picker grows when its content arrives; keep it on screen as it does. */
  private readonly resizeObserver = new ResizeObserver(() => this.place());
  private observed?: HTMLElement;

  protected updated(): void {
    const panel = this.panel;
    if (panel && !panel.matches(":popover-open")) panel.showPopover();
    if (panel && panel !== this.observed) {
      this.observed = panel;
      this.resizeObserver.observe(panel);
    }
    this.place();
  }

  private readonly onOutsidePointer = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) this.close();
  };

  private readonly onKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      event.stopPropagation();
      this.close();
    }
  };

  private close(): void {
    emit(this, "popover-close");
  }

  /** Below the control and level with its left edge; above it when below is cut off. */
  private place(): void {
    const panel = this.panel;
    if (!panel || !this.anchor) return;
    const height = panel.offsetHeight;
    const below = this.anchor.bottom + GAP;
    const fitsBelow = below + height + MARGIN <= window.innerHeight;
    const top = fitsBelow ? below : this.anchor.top - GAP - height;
    const width = Math.min(this.width, window.innerWidth - 2 * MARGIN);
    const left = Math.min(
      Math.max(MARGIN, this.anchor.left),
      window.innerWidth - width - MARGIN
    );
    panel.style.top = `${Math.max(MARGIN, top)}px`;
    panel.style.left = `${left}px`;
    panel.style.width = `${width}px`;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.anchor) return nothing;
    return html`
      <div
        class="popover"
        popover="manual"
        role="dialog"
        aria-label=${this.heading}
      >
        <header>
          <h3>${this.heading}</h3>
          <button
            type="button"
            class="close"
            aria-label=${strings.common.close}
            @click=${this.close}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-popover": OdsPopover;
  }
}
