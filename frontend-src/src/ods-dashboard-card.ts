import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { dashboardAccent, dashboardDate } from "./dashboards";
import { inputValue } from "./dom";
import { PALETTE_COLORS, PALETTE_LABELS } from "./display-profiles";
import { emit, type DashboardAction, type OdsEvent } from "./events";
import type { ContextMenuEntry } from "./ods-context-menu";
import { strings } from "./strings";
import { baseStyles, chromeStyles, tileStyles } from "./studio-styles";
import type { Size } from "./display-shape";
import type { Dashboard } from "./types";
import "./ods-context-menu";
import "./ods-display-preview";

/** The field the display is drawn in: the picture area of a card, less its padding. */
const DISPLAY_BOX: Size = { width: 240, height: 92 };

/** The actions of a card, read when it is drawn so they speak the language of the panel. */
const menu = (): Array<ContextMenuEntry & { id: DashboardAction }> => [
  {
    id: "rename",
    label: strings.gallery.menu.rename,
    icon: "mdi:pencil-outline",
  },
  {
    id: "duplicate",
    label: strings.gallery.menu.duplicate,
    icon: "mdi:content-copy",
  },
  {
    id: "settings",
    label: strings.gallery.menu.settings,
    icon: "mdi:monitor-cog",
  },
  {
    id: "delete",
    label: strings.gallery.menu.delete,
    icon: "mdi:delete-outline",
    danger: true,
  },
];

/** One dashboard in the gallery: miniature, details, a menu of actions and inline rename. */
@customElement("ods-dashboard-card")
export class OdsDashboardCard extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    tileStyles,
    css`
      :host {
        display: contents;
      }
      .dashboard-card {
        position: relative;
        display: grid;
        grid-template-rows: 150px auto;
      }
      .dashboard-card.menu-open {
        z-index: 20;
      }
      .dashboard-card-open {
        position: absolute;
        inset: 0;
        z-index: 1;
        padding: 0;
        border: 0;
        border-radius: inherit;
        background: transparent;
      }
      .dashboard-card-open:focus-visible {
        outline: 2px solid var(--studio-accent);
        outline-offset: 2px;
      }
      .dashboard-card-preview {
        position: relative;
        display: grid;
        place-items: center;
        overflow: hidden;
        padding: 35px 23px 23px;
        border-radius: 12px 12px 0 0;
        background: color-mix(
          in srgb,
          var(--primary-background-color, #f5f7f8) 70%,
          var(--studio-surface)
        );
        pointer-events: none;
      }
      .dashboard-resolution {
        position: absolute;
        right: 11px;
        bottom: 8px;
        color: var(--studio-muted);
        font: 9px var(--code-font-family, monospace);
      }
      .dashboard-card-copy {
        min-width: 0;
        display: grid;
        align-content: start;
        gap: 7px;
        padding: 13px 15px 15px;
        border-radius: 0 0 12px 12px;
        pointer-events: none;
      }
      .dashboard-card-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .dashboard-card-title strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }
      .dashboard-card-title .status {
        flex: none;
        padding: 3px 7px;
        font-size: 8px;
      }
      .dashboard-rename-input {
        position: relative;
        z-index: 7;
        min-width: 0;
        width: 100%;
        height: 28px;
        padding: 0 7px;
        border: 1px solid var(--studio-accent);
        border-radius: 6px;
        outline: 0;
        background: var(--secondary-background-color, #f3f5f6);
        font-size: 13px;
        font-weight: 700;
        pointer-events: auto;
      }
      .dashboard-card-copy small {
        color: var(--studio-muted);
        font-size: 10px;
      }
      .mode-badge {
        position: absolute;
        top: var(--ha-space-2, 8px);
        inset-inline-start: var(--ha-space-2, 8px);
        padding: 1px 7px;
        border: 1px solid var(--studio-border);
        border-radius: 999px;
        background: var(--studio-surface);
        color: var(--studio-accent);
        font-size: 10px;
        font-weight: 600;
      }
      .palette-dots {
        position: absolute;
        inset-inline-start: 11px;
        bottom: var(--ha-space-2, 8px);
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .palette-dots i {
        width: 8px;
        height: 8px;
        border: 1px solid
          color-mix(in srgb, var(--studio-text) 22%, transparent);
        border-radius: 50%;
      }
      .dashboard-menu-trigger {
        position: absolute;
        inset-block-start: 9px;
        inset-inline-end: 9px;
        z-index: 5;
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        padding: 0;
        border: 0;
        border-radius: 8px;
        color: var(--studio-muted);
        background: color-mix(in srgb, var(--studio-surface) 90%, transparent);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        opacity: 0;
        pointer-events: none;
        transition:
          opacity 120ms ease,
          color 120ms ease,
          background 120ms ease;
      }
      .dashboard-menu-trigger:hover,
      .dashboard-menu-trigger:focus-visible {
        color: var(--studio-text);
        background: var(--studio-surface);
        outline: 0;
      }
      .dashboard-card:hover .dashboard-menu-trigger,
      .dashboard-card:focus-within .dashboard-menu-trigger,
      .dashboard-card.menu-open .dashboard-menu-trigger {
        opacity: 1;
        pointer-events: auto;
      }
      .dashboard-menu-trigger ha-icon {
        width: 17px;
        height: 17px;
        --mdc-icon-size: 17px;
      }
      .dashboard-menu {
        position: absolute;
        inset-block-start: 45px;
        inset-inline-end: 9px;
        z-index: 8;
      }
      @media (hover: none) {
        .dashboard-menu-trigger {
          opacity: 1;
          pointer-events: auto;
        }
      }
    `,
  ];

  @property({ attribute: false }) public dashboard!: Dashboard;
  @property() public language = "en";
  @property({ type: Boolean }) public menuOpen = false;
  @property({ type: Boolean }) public renaming = false;
  /** The name being typed while renaming. */
  @property() public draftName = "";

  @query(".dashboard-rename-input") private renameInput?: HTMLInputElement;

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("renaming") && this.renaming) {
      this.renameInput?.focus();
      this.renameInput?.select();
    }
  }

  private get menuId(): string {
    return `dashboard-menu-${this.dashboard.id}`;
  }

  private open(): void {
    emit(this, "dashboard-open", { dashboard: this.dashboard });
  }

  private toggleMenu(event: Event): void {
    event.stopPropagation();
    emit(this, "dashboard-menu-toggle", { dashboardId: this.dashboard.id });
  }

  private onMenuSelect(event: OdsEvent<"menu-select">): void {
    const entry = menu().find((candidate) => candidate.id === event.detail.id);
    if (entry) {
      event.stopPropagation();
      emit(this, "dashboard-menu-action", {
        dashboard: this.dashboard,
        action: entry.id,
      });
    }
  }

  private onRenameInput(event: Event): void {
    emit(this, "dashboard-rename-input", { name: inputValue(event) });
  }

  private onRenameKeyDown(event: KeyboardEvent): void {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      emit(this, "dashboard-rename-commit");
    } else if (event.key === "Escape") {
      event.preventDefault();
      emit(this, "dashboard-rename-cancel");
    }
  }

  private commitRename(): void {
    emit(this, "dashboard-rename-commit");
  }

  private renderMiniature(): TemplateResult {
    const { display } = this.dashboard;
    return html`
      <div class="dashboard-card-preview">
        <span class="mode-badge">${this.modeLabel()}</span>
        <ods-display-preview
          .width=${display.width}
          .height=${display.height}
          .rotation=${display.rotation}
          .background=${display.background}
          .accent=${dashboardAccent(display.palette)}
          .box=${DISPLAY_BOX}
        ></ods-display-preview>
        ${this.renderPaletteDots()}
        <span class="dashboard-resolution">${this.resolutionLabel()}</span>
      </div>
    `;
  }

  private renderTitle(): TemplateResult {
    const { name, status } = this.dashboard;
    return html`
      <span class="dashboard-card-title">
        ${
          this.renaming
            ? html`
                <input
                  class="dashboard-rename-input"
                  aria-label=${strings.gallery.renameField(name)}
                  .value=${this.draftName}
                  @input=${this.onRenameInput}
                  @keydown=${this.onRenameKeyDown}
                  @blur=${this.commitRename}
                />
              `
            : html`
                <strong>${name}</strong>
              `
        }
        <span class=${`status ${status}`}>
          ${strings.dashboardStatus[status]}
        </span>
      </span>
    `;
  }

  /** The resolution of the canvas, and the turn when the display is not upright. */
  private resolutionLabel(): string {
    const { width, height, rotation } = this.dashboard.display;
    const size = strings.common.size(width, height);
    return rotation === 0 ? size : `${size} · ${rotation}°`;
  }

  private modeLabel(): string {
    return this.dashboard.mode === "basic"
      ? strings.basic.badgeBasic
      : strings.basic.badgeAdvanced;
  }

  /** The colors of the display, level with its resolution in the picture's corner. */
  private renderPaletteDots(): TemplateResult {
    const { palette } = this.dashboard.display;
    return html`
      <span
        class="palette-dots"
        role="img"
        aria-label=${PALETTE_LABELS[palette]}
        title=${PALETTE_LABELS[palette]}
      >
        ${PALETTE_COLORS[palette].map(
          (color) => html`
            <i style=${styleMap({ background: color })}></i>
          `
        )}
      </span>
    `;
  }

  private renderMenu(): TemplateResult | typeof nothing {
    if (!this.menuOpen) {
      return nothing;
    }
    return html`
      <ods-context-menu
        class="dashboard-menu"
        id=${this.menuId}
        label=${strings.gallery.menuFor(this.dashboard.name)}
        .entries=${menu()}
        @menu-select=${this.onMenuSelect}
      ></ods-context-menu>
    `;
  }

  protected render(): TemplateResult {
    const dashboard = this.dashboard;
    const classes = classMap({
      "dashboard-card": true,
      "menu-open": this.menuOpen,
    });
    return html`
      <article class=${classes} data-dashboard-id=${dashboard.id}>
        ${this.renderMiniature()}
        <div class="dashboard-card-copy">
          ${this.renderTitle()}
          <small>
            ${strings.gallery.updated(dashboardDate(dashboard, this.language))}
          </small>
        </div>
        <button
          class="dashboard-card-open"
          aria-label=${strings.gallery.open(dashboard.name)}
          @click=${this.open}
        ></button>
        <button
          class="dashboard-menu-trigger"
          aria-label=${strings.gallery.actionsFor(dashboard.name)}
          aria-haspopup="menu"
          aria-controls=${this.menuId}
          aria-expanded=${this.menuOpen}
          @click=${this.toggleMenu}
        >
          <ha-icon icon="mdi:dots-horizontal"></ha-icon>
        </button>
        ${this.renderMenu()}
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-dashboard-card": OdsDashboardCard;
  }
}
