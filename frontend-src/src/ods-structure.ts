import {
  css,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  commandById,
  commandView,
  itemContext,
  type CommandId,
} from "./commands";
import { inputValue, isMacPlatform } from "./dom";
import { emit } from "./events";
import { itemIcon } from "./item-labels";
import { trackPointerGesture } from "./pointer-gesture";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import {
  dropZone,
  neighbour,
  visibleRows,
  type DropZone,
  type Row,
} from "./structure-model";
import { ancestors, countItems, findItem, isContainer, isWithin } from "./tree";
import type {
  PrimitiveDefinition,
  StudioItem,
  WidgetDefinition,
} from "./types";

/** Where a dragged row would land; an empty id is the Root row. */
interface DropTarget {
  itemId: string;
  zone: DropZone;
}

const DRAG_THRESHOLD = 4;
const INDENT_PX = 16;

/** The row buttons of an item, in the order they appear. */
const rowCommands = (item: StudioItem): CommandId[] => {
  const common: CommandId[] = ["toggle-hidden", "toggle-locked", "delete-item"];
  if (!isContainer(item)) {
    return common;
  }
  const grouping: CommandId[] = item.grouped
    ? ["enter-group", "ungroup"]
    : ["group"];
  return [...grouping, ...common];
};

/**
 * The layer tree of a dashboard: the top item first, containers that open and close,
 * select, hide, lock, group, delete, rename, and drag to reorder or to move into a
 * container.
 */
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
        flex: 0 0 clamp(176px, 38%, 420px);
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
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 8px 4px;
        padding: 3px 4px 3px 8px;
        border: 1px solid var(--studio-accent);
        border-radius: 6px;
        background: var(--studio-accent-soft);
        color: var(--studio-accent);
        font-size: 11px;
      }
      .breadcrumb strong {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .breadcrumb button {
        border: 0;
        border-radius: 4px;
        background: transparent;
        color: inherit;
        font-size: 11px;
      }
      .tree-search {
        margin: 0 8px 6px;
      }
      .tree-search input {
        width: 100%;
        height: 28px;
        padding: 0 8px;
        border: 1px solid var(--studio-border);
        border-radius: 6px;
        background: var(--secondary-background-color, #f3f5f6);
        color: var(--studio-text);
        font-size: 11px;
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
      .root-row {
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 28px;
        padding: 2px 6px;
        border: 1px solid transparent;
        border-radius: 5px;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .root-row.active {
        color: var(--text-primary-color, #fff);
        background: var(--studio-accent);
      }
      .root-row:hover {
        background: var(--secondary-background-color, #f3f5f6);
      }
      .root-row.drop-inside,
      .layer-row.drop-inside {
        border-color: var(--studio-accent);
        background: var(--studio-accent-soft);
      }
      .layer-row {
        position: relative;
        display: grid;
        grid-template-columns: 18px 18px minmax(0, 1fr) auto;
        align-items: center;
        min-height: 34px;
        gap: 4px;
        padding: 2px 3px 2px calc(var(--depth, 0) * ${INDENT_PX}px + 3px);
        border: 1px solid transparent;
        border-radius: 5px;
      }
      .layer-row[data-depth]:not([data-depth="0"])::after {
        content: "";
        position: absolute;
        left: calc(var(--depth) * ${INDENT_PX}px - 5px);
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--studio-border);
        pointer-events: none;
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
      .layer-row.drop-after::before {
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
      .layer-row.drop-after::before {
        bottom: -2px;
      }
      .layer-row {
        cursor: default;
        user-select: none;
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
      .layer-row .chevron {
        width: 16px;
        height: 24px;
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
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--studio-muted);
        font-size: 8px;
        line-height: 1.15;
        text-transform: capitalize;
      }
      .badge {
        padding: 0 4px;
        border: 1px solid var(--studio-border);
        border-radius: 999px;
        font-size: 8px;
        text-transform: none;
      }
      .rename {
        width: 100%;
        height: 20px;
        padding: 0 4px;
        border: 1px solid var(--studio-accent);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--studio-text);
        font-size: 11px;
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
  @property({ attribute: false }) public primitives: PrimitiveDefinition[] = [];
  @property() public selectedItemId = "";
  @property({ attribute: false }) public selectedItemIds: string[] = [];
  @property() public enteredGroupId = "";
  /** An element whose name should be edited now, asked for by the Rename command. */
  @property() public renameRequestId = "";

  @state() private collapsed = new Set<string>();
  @state() private searchText = "";
  @state() private renamingId = "";
  @state() private draggingId = "";
  @state() private dropTarget?: DropTarget;
  @query(".layer-list") private layerList?: HTMLElement;
  private stopGesture?: () => void;
  private suppressClick = false;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopGesture?.();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("selectedItemId") && this.selectedItemId) {
      this.expandAbove(this.selectedItemId);
    }
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("renameRequestId") && this.renameRequestId) {
      const item = findItem(this.items, this.renameRequestId);
      if (item) this.startRename(item);
      emit(this, "rename-handled");
    }
    if (changed.has("selectedItemId") && this.selectedItemId) {
      this.scrollToRow(this.selectedItemId);
    }
  }

  /** Opens every container above an item, so the row of a selected item is visible. */
  private expandAbove(itemId: string): void {
    const closed = ancestors(this.items, itemId).filter((container) =>
      this.collapsed.has(container.id)
    );
    if (closed.length === 0) return;
    const next = new Set(this.collapsed);
    for (const container of closed) next.delete(container.id);
    this.collapsed = next;
  }

  /** Scrolls the tree, and only the tree, so the selected row is in view. */
  private scrollToRow(itemId: string): void {
    const list = this.layerList;
    const row = this.shadowRoot?.querySelector<HTMLElement>(
      `.layer-row[data-item-id="${CSS.escape(itemId)}"]`
    );
    if (!list || !row) return;
    const above = row.offsetTop - list.offsetTop;
    if (above < list.scrollTop) list.scrollTop = above;
    const below = above + row.offsetHeight - list.clientHeight;
    if (below > list.scrollTop) list.scrollTop = below;
  }

  // --- collapsing, searching, renaming -----------------------------------------

  private toggleCollapsed(event: Event, item: StudioItem): void {
    event.stopPropagation();
    const next = new Set(this.collapsed);
    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      next.add(item.id);
    }
    this.collapsed = next;
  }

  private onSearchInput(event: Event): void {
    this.searchText = inputValue(event);
  }

  private startRename(item: StudioItem): void {
    this.renamingId = item.id;
    void this.updateComplete.then(() =>
      this.shadowRoot?.querySelector<HTMLInputElement>(".rename")?.select()
    );
  }

  private commitRename(event: Event, item: StudioItem): void {
    if (this.renamingId !== item.id) return;
    this.renamingId = "";
    emit(this, "item-rename", { itemId: item.id, name: inputValue(event) });
  }

  private onRenameKeyDown(event: KeyboardEvent, item: StudioItem): void {
    event.stopPropagation();
    if (event.key === "Enter") {
      this.commitRename(event, item);
    }
    if (event.key === "Escape") {
      this.renamingId = "";
    }
  }

  // --- dragging rows -------------------------------------------------------------

  /** A press on a row, away from its buttons, can turn into a drag. */
  private onRowPointerDown(event: PointerEvent, item: StudioItem): void {
    const pressed = event.composedPath()[0];
    if (
      event.button !== 0 ||
      !(pressed instanceof HTMLElement) ||
      pressed.closest("button, input")
    ) {
      return;
    }
    this.startDrag(event, item.id);
  }

  private startDrag(event: PointerEvent, itemId: string): void {
    this.stopGesture = trackPointerGesture({
      origin: event,
      threshold: DRAG_THRESHOLD,
      onActivate: () => {
        this.draggingId = itemId;
        this.suppressClick = true;
      },
      onMove: (move) => {
        move.preventDefault();
        this.dropTarget = this.dropTargetAt(move, itemId);
      },
      onEnd: (_end, activated) => {
        const target = this.dropTarget;
        this.clearDrag();
        window.setTimeout(() => {
          this.suppressClick = false;
        }, 0);
        if (activated && target) {
          emit(this, "layers-reorder", {
            itemId,
            targetId: target.itemId,
            edge: target.zone,
          });
        }
      },
      onCancel: () => this.clearDrag(),
    });
  }

  /** The row under the pointer and where in it, unless dropping there is impossible. */
  private dropTargetAt(
    move: PointerEvent,
    draggedId: string
  ): DropTarget | undefined {
    const row = this.shadowRoot
      ?.elementFromPoint(move.clientX, move.clientY)
      ?.closest<HTMLElement>(".layer-row, .root-row");
    if (!row) return undefined;
    if (row.classList.contains("root-row")) {
      return { itemId: "", zone: "inside" };
    }
    const targetId = row.dataset.itemId;
    const target = targetId ? findItem(this.items, targetId) : undefined;
    if (!target || isWithin(this.items, target.id, draggedId)) return undefined;
    const rect = row.getBoundingClientRect();
    return {
      itemId: target.id,
      zone: dropZone(
        (move.clientY - rect.top) / rect.height,
        isContainer(target)
      ),
    };
  }

  private clearDrag(): void {
    this.draggingId = "";
    this.dropTarget = undefined;
  }

  // --- selecting and keys --------------------------------------------------------

  private runCommand(event: Event, id: CommandId, item: StudioItem): void {
    event.stopPropagation();
    emit(this, "command", { id, itemId: item.id });
  }

  private collapse(): void {
    emit(this, "inspector-collapse", { collapsed: true });
  }

  private selectRow(event: MouseEvent, item: StudioItem): void {
    if (this.suppressClick) return;
    emit(this, "item-select", { itemId: item.id, additive: event.shiftKey });
  }

  private selectRoot(): void {
    emit(this, "item-select", { itemId: "" });
  }

  private exitGroup(): void {
    emit(this, "command", { id: "exit-group" });
  }

  private onRowContextMenu(event: MouseEvent, item: StudioItem): void {
    event.preventDefault();
    event.stopPropagation();
    emit(this, "context-menu", {
      source: "tree",
      itemId: item.id,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  private onRootKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.selectRoot();
    }
  }

  private onRowKeyDown(event: KeyboardEvent, item: StudioItem): void {
    if (event.target !== event.currentTarget) return;
    if (event.key === " ") {
      event.preventDefault();
      emit(this, "item-select", { itemId: item.id });
    }
    if (event.key === "F2") {
      event.preventDefault();
      this.startRename(item);
    }
  }

  /** Arrow keys walk the tree: up and down between rows, left and right to fold. */
  private onTreeKeyDown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement) return;
    const rows = visibleRows(this.items, this.collapsed, this.searchText);
    const selected = findItem(this.items, this.selectedItemId);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const row = neighbour(
        rows,
        this.selectedItemId,
        event.key === "ArrowDown" ? 1 : -1
      );
      if (row) this.focusAndSelect(row);
    }
    if (event.key === "ArrowLeft" && selected) {
      event.preventDefault();
      this.foldOrGoUp(selected, rows);
    }
    if (event.key === "ArrowRight" && selected) {
      event.preventDefault();
      this.unfoldOrGoDown(selected, rows);
    }
  }

  private focusAndSelect(row: Row): void {
    emit(this, "item-select", { itemId: row.item.id });
    void this.updateComplete.then(() =>
      this.shadowRoot
        ?.querySelector<HTMLElement>(
          `.layer-row[data-item-id="${CSS.escape(row.item.id)}"]`
        )
        ?.focus()
    );
  }

  private foldOrGoUp(item: StudioItem, rows: Row[]): void {
    if (isContainer(item) && !this.collapsed.has(item.id)) {
      this.collapsed = new Set([...this.collapsed, item.id]);
      return;
    }
    const parent = ancestors(this.items, item.id)[0];
    const row =
      parent && rows.find((candidate) => candidate.item.id === parent.id);
    if (row) this.focusAndSelect(row);
  }

  private unfoldOrGoDown(item: StudioItem, rows: Row[]): void {
    if (!isContainer(item)) return;
    if (this.collapsed.has(item.id)) {
      const next = new Set(this.collapsed);
      next.delete(item.id);
      this.collapsed = next;
      return;
    }
    const last = item.children[item.children.length - 1];
    const row = last && rows.find((candidate) => candidate.item.id === last.id);
    if (row) this.focusAndSelect(row);
  }

  // --- rendering ---------------------------------------------------------------------

  /** A button for a command about one row's item, described by the registry. */
  private renderCommandButton(
    id: CommandId,
    item: StudioItem
  ): TemplateResult | typeof nothing {
    const context = itemContext(item);
    const command = commandById(id);
    if (!command.isEnabled(context)) return nothing;
    const view = commandView(command, context, isMacPlatform());
    return html`
      <button
        class=${id === "delete-item" ? "delete" : ""}
        title=${view.title}
        aria-label=${`${view.label} ${item.name}`}
        @click=${(event: Event) => this.runCommand(event, id, item)}
      >
        <ha-icon .icon=${view.icon}></ha-icon>
      </button>
    `;
  }

  private chevronLabel(item: StudioItem, open: boolean): string {
    return open
      ? strings.structure.collapseRow(item.name)
      : strings.structure.expandRow(item.name);
  }

  private renderChevron(item: StudioItem): TemplateResult {
    if (!isContainer(item)) {
      return html`
        <span></span>
      `;
    }
    const open = !this.collapsed.has(item.id);
    return html`
      <button
        class="chevron"
        aria-label=${this.chevronLabel(item, open)}
        aria-expanded=${open}
        @click=${(event: Event) => this.toggleCollapsed(event, item)}
      >
        <ha-icon
          icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}
        ></ha-icon>
      </button>
    `;
  }

  private renderName(item: StudioItem): TemplateResult {
    if (this.renamingId !== item.id) {
      return html`
        <strong>${item.name}</strong>
      `;
    }
    return html`
      <input
        class="rename"
        aria-label=${strings.structure.rename}
        .value=${item.name}
        @click=${(event: Event) => event.stopPropagation()}
        @keydown=${(event: KeyboardEvent) => this.onRenameKeyDown(event, item)}
        @blur=${(event: Event) => this.commitRename(event, item)}
      />
    `;
  }

  private kindLabel(item: StudioItem): string {
    if (item.kind === "widget") return strings.structure.widget;
    if (item.kind === "container") {
      return item.grouped
        ? strings.structure.group
        : strings.structure.container;
    }
    return item.primitive.type;
  }

  private renderCaption(item: StudioItem): TemplateResult {
    return html`
      <small>
        ${this.kindLabel(item)}
        ${
          isContainer(item)
            ? html`
                <span>(${item.children.length})</span>
              `
            : nothing
        }
        ${
          isContainer(item) && item.grouped
            ? html`
                <span class="badge">${strings.structure.groupBadge}</span>
              `
            : nothing
        }
      </small>
    `;
  }

  private renderRow(row: Row): TemplateResult {
    const { item, depth } = row;
    const drop =
      this.dropTarget?.itemId === item.id ? this.dropTarget.zone : undefined;
    const rowClasses = classMap({
      "layer-row": true,
      active: this.selectedItemIds.includes(item.id),
      "is-hidden": item.hidden,
      dragging: item.id === this.draggingId,
      "drop-before": drop === "before",
      "drop-after": drop === "after",
      "drop-inside": drop === "inside",
    });
    return html`
      <div
        role="treeitem"
        tabindex="0"
        aria-label=${item.name}
        aria-level=${depth + 1}
        aria-expanded=${isContainer(item) ? !this.collapsed.has(item.id) : nothing}
        aria-selected=${this.selectedItemIds.includes(item.id)}
        data-item-id=${item.id}
        data-depth=${depth}
        style=${styleMap({ "--depth": String(depth) })}
        class=${rowClasses}
        @pointerdown=${(event: PointerEvent) =>
          this.onRowPointerDown(event, item)}
        @click=${(event: MouseEvent) => this.selectRow(event, item)}
        @contextmenu=${(event: MouseEvent) => this.onRowContextMenu(event, item)}
        @keydown=${(event: KeyboardEvent) => this.onRowKeyDown(event, item)}
      >
        ${this.renderChevron(item)}
        <ha-icon
          class="layer-type-icon"
          .icon=${itemIcon(item, this.widgets, this.primitives)}
        ></ha-icon>
        <span>${this.renderName(item)} ${this.renderCaption(item)}</span>
        <div class="layer-actions">
          ${rowCommands(item).map((id) => this.renderCommandButton(id, item))}
        </div>
      </div>
    `;
  }

  private renderRootRow(): TemplateResult {
    const dropInside =
      this.dropTarget?.itemId === "" && this.dropTarget.zone === "inside";
    return html`
      <div
        class=${classMap({
          "root-row": true,
          active: this.selectedItemIds.length === 0,
          "drop-inside": dropInside,
        })}
        role="treeitem"
        tabindex="0"
        aria-label=${strings.structure.rootName}
        aria-level="0"
        aria-selected=${this.selectedItemIds.length === 0}
        @click=${this.selectRoot}
        @keydown=${this.onRootKeyDown}
      >
        <ha-icon icon="mdi:monitor-dashboard"></ha-icon>
        ${strings.structure.root(this.items.length)}
      </div>
    `;
  }

  private renderBreadcrumb(): TemplateResult | typeof nothing {
    const group = findItem(this.items, this.enteredGroupId);
    if (!group) return nothing;
    return html`
      <nav class="breadcrumb" aria-label=${strings.structure.breadcrumb}>
        <span>${strings.structure.rootName}</span>
        <span>›</span>
        <strong>${group.name}</strong>
        <button @click=${this.exitGroup}>${strings.structure.exit}</button>
      </nav>
    `;
  }

  private renderRows(): TemplateResult {
    const rows = visibleRows(this.items, this.collapsed, this.searchText);
    if (this.items.length === 0) {
      return html`
        <p class="empty-layers">${strings.structure.empty}</p>
      `;
    }
    return html`
      ${this.renderRootRow()} ${rows.map((row) => this.renderRow(row))}
    `;
  }

  protected render(): TemplateResult {
    return html`
      <section class="layers">
        <header>
          <div>
            <span class="eyebrow">${strings.structure.title}</span>
            <h2>${strings.structure.heading}</h2>
          </div>
          <div class="layers-header-actions">
            <span class="count">${countItems(this.items)}</span>
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
        ${this.renderBreadcrumb()}
        <label class="tree-search">
          <input
            type="search"
            aria-label=${strings.structure.search}
            placeholder=${strings.structure.searchPlaceholder}
            .value=${this.searchText}
            @input=${this.onSearchInput}
          />
        </label>
        <div class="layer-list" role="tree" @keydown=${this.onTreeKeyDown}>
          ${this.renderRows()}
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
