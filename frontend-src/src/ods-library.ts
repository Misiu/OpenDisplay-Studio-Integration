import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { filterCatalog, groupByCategory } from "./catalog";
import { inputValue } from "./dom";
import { emit } from "./events";
import { strings } from "./strings";
import { trackPointerGesture } from "./pointer-gesture";
import { baseStyles, chromeStyles } from "./studio-styles";
import type {
  PrimitiveDefinition,
  WidgetDefinition,
  WidgetLoadError,
} from "./types";

type EntryKind = "widget" | "primitive" | "container";

interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  icon: string;
  /** An installed package, not one that ships with the integration. */
  user?: boolean;
}
interface DragGhost {
  value: string;
  icon: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const DRAG_THRESHOLD = 4;

/** The one container the library offers; groups are made from a selection. */
const containerEntry = (): CatalogEntry => ({
  id: "container",
  name: strings.library.container,
  description: strings.library.containerHint,
  icon: "mdi:select-all",
});

/** The element catalog: search, click to add, drag onto the canvas. Collapses to a rail. */
@customElement("ods-library")
export class OdsLibrary extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .panel {
        position: relative;
        min-width: 0;
        min-height: 0;
        background: var(--studio-surface);
      }
      .toolbox {
        border-right: 1px solid var(--studio-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .panel-title {
        min-height: 58px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 11px 12px;
      }
      .panel-title h2 {
        margin: 1px 0 0;
        font-size: 15px;
      }
      .search {
        margin: 0 10px 10px 9px;
        min-height: 30px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .search ha-icon {
        width: 17px;
      }
      .search input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        font-size: 13px;
      }
      .catalog-scroll {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 0 9px 16px;
      }
      .catalog-section {
        margin-top: 8px;
      }
      .catalog-section > header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 7px 2px;
        color: var(--studio-muted);
        font: 700 10px var(--code-font-family, monospace);
        letter-spacing: 0.11em;
        text-transform: uppercase;
      }
      .catalog-category {
        margin: 10px 0 6px;
        color: var(--studio-muted);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .user-badge {
        justify-self: start;
        padding: 1px 6px;
        border: 1px solid var(--studio-border);
        border-radius: 999px;
        color: var(--studio-muted);
        font-size: 9px;
      }
      .widget-errors {
        margin: 6px 0;
        padding: 6px 8px;
        border: 1px solid var(--warning-color, #ffa600);
        border-radius: 7px;
        font-size: 11px;
      }
      .widget-errors summary {
        cursor: pointer;
      }
      .widget-errors ul {
        margin: 6px 0 0;
        padding-left: 16px;
      }
      .catalog-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
      }
      .catalog-item {
        min-height: 34px;
        display: grid;
        grid-template-columns: 16px minmax(0, 1fr);
        gap: 8px;
        align-items: center;
        padding: 0 10px;
        text-align: start;
        border: 1px solid var(--studio-border);
        border-radius: 8px;
        background: var(--studio-surface);
        cursor: grab;
        touch-action: none;
        user-select: none;
      }
      .catalog-item:hover {
        border-color: var(--studio-accent);
        background: var(--studio-accent-soft);
        transform: translateY(-1px);
      }
      .catalog-item:active {
        cursor: grabbing;
      }
      .catalog-item ha-icon {
        width: 16px;
        height: 16px;
        color: var(--studio-accent);
        --mdc-icon-size: 16px;
      }
      .catalog-item strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        line-height: 1.2;
      }
      .catalog-item small {
        display: none;
      }
      .empty-result {
        grid-column: 1 / -1;
        margin: 10px 2px;
        color: var(--studio-muted);
        font-size: 12px;
        line-height: 1.45;
      }
      .panel-rail {
        border-right: 1px solid var(--studio-border);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        padding: 10px 6px;
      }
      .rail-label {
        writing-mode: vertical-rl;
        color: var(--studio-muted);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .catalog-drag-ghost {
        position: fixed;
        z-index: 1200;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 16px minmax(0, 1fr) 14px;
        align-items: center;
        gap: 5px;
        min-height: 34px;
        padding: 0 7px;
        border: 1px solid var(--studio-accent);
        border-radius: 8px;
        color: var(--primary-text-color, #182026);
        background: var(--studio-surface);
        box-shadow: 0 7px 18px rgba(0, 0, 0, 0.22);
        font-size: 11px;
        font-weight: 700;
        pointer-events: none;
      }
      .catalog-drag-ghost ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
      .catalog-drag-ghost .drag-type-icon,
      .catalog-drag-ghost .drag-add-icon {
        color: var(--studio-accent);
      }
      @media (max-width: 900px) {
        .toolbox,
        .panel-rail {
          display: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) public widgets: WidgetDefinition[] = [];
  @property({ attribute: false }) public widgetErrors: WidgetLoadError[] = [];
  @property({ attribute: false }) public primitives: PrimitiveDefinition[] = [];
  @property({ type: Boolean }) public collapsed = false;

  @state() private searchText = "";
  @state() private ghost?: DragGhost;
  private suppressClick = false;
  private stopGesture?: () => void;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopGesture?.();
  }

  /** The panel host: the ghost is `position: fixed` in it, so it measures from there. */
  private panelOrigin(): DOMRect {
    const root = this.getRootNode();
    return (
      root instanceof ShadowRoot ? root.host : this
    ).getBoundingClientRect();
  }

  private startDrag(
    event: PointerEvent,
    value: string,
    entry: CatalogEntry
  ): void {
    if (event.button !== 0) return;
    event.preventDefault();
    const source = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const grabX = event.clientX - source.left;
    const grabY = event.clientY - source.top;
    this.stopGesture = trackPointerGesture({
      origin: event,
      threshold: DRAG_THRESHOLD,
      onActivate: () => emit(this, "catalog-drag", { active: true }),
      onMove: (move) => {
        move.preventDefault();
        const origin = this.panelOrigin();
        this.ghost = {
          value,
          icon: entry.icon,
          name: entry.name,
          x: move.clientX - origin.left - grabX,
          y: move.clientY - origin.top - grabY,
          width: source.width,
          height: source.height,
        };
      },
      onEnd: (end, activated) => {
        this.ghost = undefined;
        if (!activated) return;
        emit(this, "catalog-drag", { active: false });
        this.suppressClick = true;
        emit(this, "catalog-drop", {
          value,
          clientX: end.clientX,
          clientY: end.clientY,
        });
        window.setTimeout(() => {
          this.suppressClick = false;
        }, 0);
      },
      onCancel: () => {
        this.ghost = undefined;
        emit(this, "catalog-drag", { active: false });
      },
    });
  }

  private onSearchInput(event: Event): void {
    this.searchText = inputValue(event);
  }

  private addFromClick(value: string): void {
    if (!this.suppressClick) {
      emit(this, "catalog-add", { value });
    }
  }

  private renderEntry(entry: CatalogEntry, kind: EntryKind): TemplateResult {
    const value = `${kind}:${entry.id}`;
    return html`
      <button
        class="catalog-item"
        title=${strings.library.entryHint(entry.description)}
        @click=${() => this.addFromClick(value)}
        @pointerdown=${(event: PointerEvent) =>
          this.startDrag(event, value, entry)}
      >
        <ha-icon .icon=${entry.icon}></ha-icon>
        <strong>${entry.name}</strong>
        ${
          entry.user
            ? html`
                <span class="user-badge">${strings.library.userWidget}</span>
              `
            : nothing
        }
        <small>${entry.description}</small>
      </button>
    `;
  }

  private renderEntries(
    entries: CatalogEntry[],
    kind: EntryKind,
    emptyText: string
  ): TemplateResult {
    if (!entries.length) {
      return html`
        <p class="empty-result">${emptyText}</p>
      `;
    }
    return html`
      ${entries.map((entry) => this.renderEntry(entry, kind))}
    `;
  }

  private reloadWidgets(): void {
    emit(this, "widgets-reload");
  }

  private renderWidgetErrors(): TemplateResult | typeof nothing {
    if (this.widgetErrors.length === 0) return nothing;
    return html`
      <details class="widget-errors">
        <summary>
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          ${strings.library.widgetErrors(this.widgetErrors.length)}
        </summary>
        <ul>
          ${this.widgetErrors.map(
            (error) => html`
              <li>
                <strong>${error.folder}</strong>
                ${error.message}
              </li>
            `
          )}
        </ul>
      </details>
    `;
  }

  private renderWidgetEntries(widgets: WidgetDefinition[]): TemplateResult {
    if (widgets.length === 0) {
      return html`
        <p class="empty-result">${strings.library.noWidgets}</p>
      `;
    }
    return html`
      ${groupByCategory(widgets).map(
        ([category, members]) => html`
          <h4 class="catalog-category">${category}</h4>
          <div class="catalog-grid">
            ${members.map((widget) =>
              this.renderEntry({ ...widget, user: !widget.builtin }, "widget")
            )}
          </div>
        `
      )}
    `;
  }

  private renderGhost(): TemplateResult | typeof nothing {
    const ghost = this.ghost;
    if (!ghost) {
      return nothing;
    }
    const style = styleMap({
      left: `${ghost.x}px`,
      top: `${ghost.y}px`,
      width: `${ghost.width}px`,
      height: `${ghost.height}px`,
    });
    return html`
      <div
        class="catalog-drag-ghost"
        data-catalog-value=${ghost.value}
        style=${style}
      >
        <ha-icon class="drag-type-icon" .icon=${ghost.icon}></ha-icon>
        <span>${ghost.name}</span>
        <ha-icon class="drag-add-icon" icon="mdi:plus"></ha-icon>
      </div>
    `;
  }

  protected render(): TemplateResult {
    if (this.collapsed) {
      return html`
        <aside class="panel panel-rail">
          <button
            class="icon-button"
            title=${strings.library.expand}
            aria-label=${strings.library.expand}
            @click=${() => emit(this, "library-collapse", { collapsed: false })}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <span class="rail-label">${strings.library.title}</span>
        </aside>
      `;
    }
    const widgets = filterCatalog(this.widgets, this.searchText);
    const containers = filterCatalog([containerEntry()], this.searchText);
    const primitives = filterCatalog(this.primitives, this.searchText).map(
      (definition): CatalogEntry => ({ ...definition, id: definition.type })
    );
    return html`
      ${this.renderGhost()}
      <aside class="panel toolbox">
        <div class="panel-title">
          <div>
            <span class="eyebrow">${strings.library.title}</span>
            <h2>${strings.library.heading}</h2>
          </div>
          <button
            class="icon-button"
            title=${strings.library.collapse}
            aria-label=${strings.library.collapse}
            @click=${() => emit(this, "library-collapse", { collapsed: true })}
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
        </div>
        <label class="search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            aria-label=${strings.library.search}
            placeholder=${strings.library.searchPlaceholder}
            .value=${this.searchText}
            @input=${this.onSearchInput}
          />
        </label>
        <div class="catalog-scroll">
          <section class="catalog-section">
            <header>
              <span>${strings.library.widgets}</span>
              <span class="count">${widgets.length}</span>
              <button
                class="icon-button"
                title=${strings.library.reloadWidgets}
                aria-label=${strings.library.reloadWidgets}
                @click=${this.reloadWidgets}
              >
                <ha-icon icon="mdi:refresh"></ha-icon>
              </button>
            </header>
            ${this.renderWidgetErrors()} ${this.renderWidgetEntries(widgets)}
          </section>
          <section class="catalog-section">
            <header>
              <span>${strings.library.primitives}</span>
              <span class="count">${primitives.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(primitives, "primitive", strings.library.noPrimitives)}
            </div>
          </section>
          <section class="catalog-section">
            <header>
              <span>${strings.library.containers}</span>
              <span class="count">${containers.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(containers, "container", strings.library.noContainers)}
            </div>
          </section>
        </div>
      </aside>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-library": OdsLibrary;
  }
}
