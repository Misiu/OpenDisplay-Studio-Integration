import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { emit, type ItemFlag } from "./events";
import { strings } from "./strings";
import { itemIcon, itemName } from "./item-labels";
import { trackPointerGesture } from "./pointer-gesture";
import { baseStyles, chromeStyles } from "./studio-styles";
import type { StudioItem, WidgetDefinition } from "./types";

interface DropTarget {
  itemId: string;
  edge: "before" | "after";
}

const DRAG_THRESHOLD = 4;

/** The layer list of a dashboard: top item first; select, hide, lock, delete, drag to reorder. */
@customElement("ods-structure")
export class OdsStructure extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .layers {
        min-height: 150px;
        flex: 0 0 clamp(176px, 27%, 250px);
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid var(--studio-border);
        overflow-anchor: none;
      }
      .layers > header {
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 7px 8px 7px 11px;
      }
      .layers h2 {
        margin: 1px 0 0;
        font-size: 15px;
      }
      .layers-header-actions {
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .layer-list {
        min-height: 0;
        flex: 1;
        overflow: auto;
        padding: 0 6px 8px;
      }
      .empty-layers {
        margin: 10px 2px;
        color: var(--studio-muted);
        font-size: 12px;
        line-height: 1.45;
      }
      .layer-row {
        position: relative;
        display: grid;
        grid-template-columns: 24px 18px minmax(0, 1fr) auto;
        align-items: center;
        min-height: 34px;
        gap: 4px;
        padding: 2px 3px;
        border: 1px solid transparent;
        border-radius: 5px;
      }
      .layer-row:hover {
        background: var(--secondary-background-color, #f3f5f6);
      }
      .layer-row.active {
        color: var(--studio-accent);
        border-color: color-mix(
          in srgb,
          var(--studio-accent) 45%,
          var(--studio-border)
        );
        background: var(--studio-accent-soft);
      }
      .layer-row.is-hidden > span {
        opacity: 0.5;
      }
      .layer-row.dragging {
        opacity: 0.42;
      }
      .layer-row.drop-before::before,
      .layer-row.drop-after::after {
        content: "";
        position: absolute;
        left: 2px;
        right: 2px;
        z-index: 4;
        height: 2px;
        border-radius: 2px;
        background: var(--studio-accent);
        box-shadow: 0 0 0 1px
          color-mix(in srgb, var(--studio-accent) 22%, transparent);
        pointer-events: none;
      }
      .layer-row.drop-before::before {
        top: -2px;
      }
      .layer-row.drop-after::after {
        bottom: -2px;
      }
      .layer-row .drag {
        width: 24px;
        height: 28px;
        color: var(--studio-muted);
        cursor: grab;
        touch-action: none;
      }
      .layer-row .drag:active {
        cursor: grabbing;
      }
      .layer-row .layer-type-icon {
        width: 16px;
        height: 16px;
        color: var(--studio-accent);
        --mdc-icon-size: 16px;
      }
      .layer-row > span {
        min-width: 0;
        display: grid;
      }
      .layer-row strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 11px;
        line-height: 1.2;
      }
      .layer-row small {
        color: var(--studio-muted);
        font-size: 8px;
        line-height: 1.15;
        text-transform: capitalize;
      }
      .layer-actions {
        display: flex;
        align-items: center;
        gap: 1px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 100ms ease;
      }
      .layer-row:hover .layer-actions,
      .layer-row:focus-within .layer-actions,
      .layer-row.active .layer-actions {
        opacity: 1;
        pointer-events: auto;
      }
      .layer-row button {
        display: grid;
        place-items: center;
        width: 27px;
        height: 27px;
        padding: 0;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--studio-muted);
      }
      .layer-row button:hover {
        color: var(--studio-text);
        background: color-mix(in srgb, var(--studio-text) 8%, transparent);
      }
      .layer-row button.delete:hover {
        color: var(--error-color, #db4437);
      }
      .layer-row button ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
    `,
  ];

  @property({ attribute: false }) public items: StudioItem[] = [];
  @property({ attribute: false }) public widgets: WidgetDefinition[] = [];
  @property() public selectedItemId = "";

  @state() private draggingId = "";
  @state() private dropTarget?: DropTarget;
  private stopGesture?: () => void;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopGesture?.();
  }

  private startDrag(event: PointerEvent, itemId: string): void {
    if (event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    this.stopGesture = trackPointerGesture({
      origin: event,
      threshold: DRAG_THRESHOLD,
      onActivate: () => {
        this.draggingId = itemId;
      },
      onMove: (move) => {
        move.preventDefault();
        const row = this.shadowRoot
          ?.elementFromPoint(move.clientX, move.clientY)
          ?.closest<HTMLElement>(".layer-row");
        const targetId = row?.dataset.itemId;
        if (!row || !targetId || targetId === itemId) {
          this.dropTarget = undefined;
          return;
        }
        const rect = row.getBoundingClientRect();
        this.dropTarget = {
          itemId: targetId,
          edge: move.clientY < rect.top + rect.height / 2 ? "before" : "after",
        };
      },
      onEnd: (_end, activated) => {
        const target = this.dropTarget;
        this.clearDrag();
        if (activated && target && target.itemId !== itemId) {
          emit(this, "layers-reorder", {
            itemId,
            targetId: target.itemId,
            edge: target.edge,
          });
        }
      },
      onCancel: () => this.clearDrag(),
    });
  }
  private clearDrag(): void {
    this.draggingId = "";
    this.dropTarget = undefined;
  }

  /** Title, accessible label and icon of a hide/lock button in its current state. */
  private flagView(
    flag: ItemFlag,
    on: boolean,
    name: string
  ): { title: string; label: string; icon: string } {
    const text = strings.structure;
    if (flag === "hidden") {
      return on
        ? {
            title: text.showTitle,
            label: text.show(name),
            icon: "mdi:eye-off-outline",
          }
        : {
            title: text.hideTitle,
            label: text.hide(name),
            icon: "mdi:eye-outline",
          };
    }
    return on
      ? {
          title: text.unlockTitle,
          label: text.unlock(name),
          icon: "mdi:lock",
        }
      : {
          title: text.lockTitle,
          label: text.lock(name),
          icon: "mdi:lock-open-variant-outline",
        };
  }

  private flagButton(
    item: StudioItem,
    flag: ItemFlag,
    name: string
  ): TemplateResult {
    const { title, label, icon } = this.flagView(flag, item[flag], name);
    return html`
      <button
        title=${title}
        aria-label=${label}
        @click=${(event: Event) => {
          event.stopPropagation();
          emit(this, "item-flag-toggle", { itemId: item.id, flag });
        }}
      >
        <ha-icon .icon=${icon}></ha-icon>
      </button>
    `;
  }

  private collapse(): void {
    emit(this, "inspector-collapse", { collapsed: true });
  }

  private selectItem(item: StudioItem): void {
    emit(this, "item-select", { itemId: item.id });
  }

  /** Enter or Space on the row itself selects it; nested buttons keep their own keys. */
  private onRowKeyDown(event: KeyboardEvent, item: StudioItem): void {
    if (event.target !== event.currentTarget) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.selectItem(item);
    }
  }

  private requestDelete(event: Event, item: StudioItem): void {
    event.stopPropagation();
    emit(this, "item-delete-request", { itemId: item.id });
  }

  private renderRow(item: StudioItem): TemplateResult {
    const name = itemName(item, this.widgets);
    const drop =
      this.dropTarget?.itemId === item.id ? this.dropTarget.edge : undefined;
    const rowClasses = classMap({
      "layer-row": true,
      active: item.id === this.selectedItemId,
      "is-hidden": item.hidden,
      dragging: item.id === this.draggingId,
      "drop-before": drop === "before",
      "drop-after": drop === "after",
    });
    return html`
      <div
        role="treeitem"
        tabindex="0"
        aria-label=${name}
        aria-selected=${item.id === this.selectedItemId}
        data-item-id=${item.id}
        class=${rowClasses}
        @click=${() => this.selectItem(item)}
        @keydown=${(event: KeyboardEvent) => this.onRowKeyDown(event, item)}
      >
        <button
          class="drag"
          title=${strings.structure.reorderTitle}
          aria-label=${strings.structure.reorder(name)}
          @pointerdown=${(event: PointerEvent) =>
            this.startDrag(event, item.id)}
        >
          <ha-icon icon="mdi:drag-vertical"></ha-icon>
        </button>
        <ha-icon
          class="layer-type-icon"
          .icon=${itemIcon(item, this.widgets)}
        ></ha-icon>
        <span>
          <strong>${name}</strong>
          <small>${this.kindLabel(item)}</small>
        </span>
        <div class="layer-actions">
          ${this.flagButton(item, "hidden", name)}
          ${this.flagButton(item, "locked", name)}
          <button
            class="delete"
            title=${strings.structure.deleteTitle}
            aria-label=${strings.structure.delete(name)}
            @click=${(event: Event) => this.requestDelete(event, item)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }

  private kindLabel(item: StudioItem): string {
    return item.kind === "widget"
      ? strings.structure.widget
      : item.primitive.type;
  }

  protected render(): TemplateResult {
    const items = [...this.items].reverse();
    return html`
      <section class="layers">
        <header>
          <div>
            <span class="eyebrow">${strings.structure.title}</span>
            <h2>${strings.structure.heading}</h2>
          </div>
          <div class="layers-header-actions">
            <span class="count">${items.length}</span>
            <button
              class="icon-button"
              title=${strings.structure.collapse}
              aria-label=${strings.structure.collapse}
              @click=${this.collapse}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        </header>
        <div class="layer-list" role="tree">
          ${
            items.length
              ? items.map((item) => this.renderRow(item))
              : html`
                  <p class="empty-layers">${strings.structure.empty}</p>
                `
          }
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-structure": OdsStructure;
  }
}
