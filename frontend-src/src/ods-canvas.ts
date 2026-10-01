import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { commandById, commandView, type CommandId } from "./commands";
import { isMacPlatform } from "./dom";
import { emit, type OdsEvent } from "./events";
import { transformItem, workingArea, type ItemGesture } from "./geometry";
import {
  boxBetween,
  marqueeSelection,
  moveSelection,
  displayBoxOf,
  movedGuides,
  moveTargets,
  snapTargetsFor,
  type MeasuredBox,
  selectionBox,
} from "./selection-gesture";
import {
  containerAt,
  countItems,
  findItem,
  isContainer,
  locate,
  selectionTarget,
  withOffsets,
  type Placed,
} from "./tree";
import { trackPointerGesture } from "./pointer-gesture";
import { remeasured } from "./primitive-shape";
import type { Guide } from "./snapping";
import { itemLocks } from "./locks";
import { isResizable } from "./primitive-resize";
import { RESIZE_HANDLES, type ResizeHandle } from "./resize";
import { baseStyles } from "./studio-styles";
import { strings } from "./strings";
import type {
  PreviewState,
  Dashboard,
  ItemBounds,
  PrimitiveDefinition,
  StudioItem,
  WidgetDefinition,
} from "./types";
import {
  DEFAULT_VIEWPORT,
  fitViewport,
  withZoom,
  wheelViewport,
  type Viewport,
} from "./viewport";
import "./ods-zoom-bar";

const GESTURE_THRESHOLD = 3;

/** A box in display pixels as percentages of the display, so it scales with the canvas. */
const percentBox = (
  box: ItemBounds,
  display: { width: number; height: number }
): Record<string, string> => ({
  left: `${(box.x / display.width) * 100}%`,
  top: `${(box.y / display.height) * 100}%`,
  width: `${(box.width / display.width) * 100}%`,
  height: `${(box.height / display.height) * 100}%`,
});

/**
 * The canvas: the rendered PNG, an interaction overlay drawn from the backend's
 * bounds, and the viewport.
 */
@customElement("ods-canvas")
export class OdsCanvas extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: contents;
      }
      .workspace {
        min-width: 0;
        min-height: 0;
        display: grid;
        grid-template-rows: 42px minmax(0, 1fr);
        background: var(--primary-background-color, #f4f6f8);
        color: var(--studio-text);
        overflow: hidden;
      }
      .history-controls {
        flex: none;
        display: flex;
        align-items: center;
        gap: 2px;
        margin-inline-start: auto;
      }
      .history-controls button {
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        padding: 0;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--studio-muted);
      }
      .history-controls button:hover:not(:disabled) {
        color: var(--studio-text);
        background: var(--secondary-background-color, #eef1f4);
      }
      .history-controls button:disabled {
        cursor: default;
        opacity: 0.32;
      }
      .history-controls ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
      .workspace-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0 16px;
        border-bottom: 1px solid var(--studio-border);
        color: var(--studio-muted);
        background: var(--studio-surface);
        font: 11px var(--code-font-family, monospace);
      }
      .tool-toggle {
        display: inline-flex;
        flex: none;
        align-items: center;
        gap: 6px;
        min-height: 28px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--studio-surface);
        color: var(--studio-muted);
        font-size: 10px;
        line-height: 1;
        white-space: nowrap;
      }
      .tool-toggle ha-icon {
        width: 14px;
        height: 14px;
        --mdc-icon-size: 14px;
      }
      .tool-toggle.active {
        color: var(--studio-accent);
        border-color: color-mix(
          in srgb,
          var(--studio-accent) 65%,
          var(--studio-border)
        );
        background: var(--studio-accent-soft);
      }
      .zoom-readout {
        min-width: 42px;
        text-align: right;
        color: var(--studio-text);
      }
      .canvas-stage {
        position: relative;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        overflow-anchor: none;
        overscroll-behavior: contain;
        contain: layout paint;
        background-color: var(--secondary-background-color, #eef1f4);
        background-image: radial-gradient(
          circle,
          color-mix(in srgb, var(--studio-muted) 27%, transparent) 0.8px,
          transparent 0.9px
        );
        background-size: 18px 18px;
      }
      .canvas-stage.accepting-drop {
        box-shadow: inset 0 0 0 3px var(--studio-accent);
      }
      .canvas-viewport {
        position: absolute;
        left: 50%;
        top: 50%;
        transform-origin: center;
        overflow-anchor: none;
      }
      .canvas {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        box-shadow: 0 14px 38px rgba(28, 38, 48, 0.18);
        user-select: none;
        touch-action: none;
        overflow-anchor: none;
      }
      .canvas > img,
      .canvas-placeholder {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
      }
      .canvas-placeholder {
        display: grid;
        place-items: center;
        color: #59636b;
        background: #fff;
      }
      .working-area {
        position: absolute;
        pointer-events: none;
        z-index: 2;
        border: 1px dashed rgba(3, 169, 244, 0.72);
        background-image: radial-gradient(
          circle,
          rgba(3, 169, 244, 0.22) 0.7px,
          transparent 0.8px
        );
        background-size: max(12px, var(--snap-size)) max(12px, var(--snap-size));
      }
      .selection {
        position: absolute;
        z-index: 3;
        min-width: 3px;
        min-height: 3px;
        border: 1px solid transparent;
        cursor: move;
        touch-action: none;
      }
      .selection:hover {
        border-color: rgba(3, 169, 244, 0.65);
      }
      .selection.selected {
        border: 2px solid #00aef0;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9);
      }
      .selection.container {
        z-index: 2;
        border-color: transparent;
      }
      .selection.container:hover {
        border-color: rgba(3, 169, 244, 0.5);
      }
      .selection.holds-selection {
        border: 1px solid rgba(3, 169, 244, 0.7);
      }
      .selection.group {
        border-style: dashed;
      }
      .selection.entered {
        border: 2px dashed #00aef0;
        background: rgba(3, 169, 244, 0.05);
      }
      .selection.drop-target {
        border: 2px solid #00aef0;
        background: rgba(3, 169, 244, 0.14);
      }
      .group-hint {
        position: absolute;
        left: 0;
        bottom: calc(100% + 6px);
        min-width: max-content;
        padding: 2px 7px;
        border-radius: 4px;
        color: #fff;
        background: #283746;
        font-size: 10px;
        pointer-events: none;
      }
      .multi-selection {
        position: absolute;
        z-index: 5;
        border: 2px dashed #00aef0;
        pointer-events: none;
      }
      .guide {
        position: absolute;
        z-index: 7;
        border: 0 dashed #e91e8c;
        pointer-events: none;
      }
      .guide.vertical {
        width: 0;
        border-left-width: 1px;
      }
      .guide.horizontal {
        height: 0;
        border-top-width: 1px;
      }
      .marquee {
        position: absolute;
        z-index: 6;
        border: 1px solid #00aef0;
        background: rgba(0, 174, 240, 0.12);
        pointer-events: none;
      }
      .selection.locked {
        cursor: default;
        border-style: dashed;
      }
      .selection.hidden {
        background: rgba(3, 169, 244, 0.09);
        border: 1px dashed rgba(3, 169, 244, 0.75);
      }
      .hidden-label {
        position: absolute;
        left: 3px;
        top: 3px;
        color: #006d99;
        background: rgba(255, 255, 255, 0.9);
        padding: 1px 4px;
        font-size: 8px;
      }
      .lock-badge {
        position: absolute;
        right: 2px;
        top: 2px;
        width: 15px;
        height: 15px;
        padding: 2px;
        color: #fff;
        background: #283746;
        border-radius: 3px;
      }
      .resize-handle {
        position: absolute;
        z-index: 7;
        width: 11px;
        height: 11px;
        padding: 0;
        border: 2px solid #00aef0;
        border-radius: 1px;
        background: #fff;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85);
        touch-action: none;
      }
      .resize-nw {
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        cursor: nwse-resize;
      }
      .resize-n {
        left: 50%;
        top: 0;
        transform: translate(-50%, -50%);
        cursor: ns-resize;
      }
      .resize-ne {
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        cursor: nesw-resize;
      }
      .resize-e {
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
        cursor: ew-resize;
      }
      .resize-se {
        right: 0;
        bottom: 0;
        transform: translate(50%, 50%);
        cursor: nwse-resize;
      }
      .resize-s {
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
        cursor: ns-resize;
      }
      .resize-sw {
        left: 0;
        bottom: 0;
        transform: translate(-50%, 50%);
        cursor: nesw-resize;
      }
      .resize-w {
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: ew-resize;
      }
      .selection-size {
        position: absolute;
        z-index: 6;
        left: 50%;
        top: calc(100% + 9px);
        transform: translateX(-50%);
        min-width: max-content;
        padding: 2px 7px;
        border: 1px solid #2788b8;
        border-radius: 999px;
        color: #9cddff;
        background: #102033;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
        font: 700 10px/1.2 var(--code-font-family, monospace);
        white-space: nowrap;
        pointer-events: none;
      }
      @media (max-width: 900px) {
        .workspace-meta {
          gap: 8px;
          padding: 0 8px;
        }
        .workspace-meta > span:nth-child(2),
        .workspace-meta > span:nth-child(3) {
          display: none;
        }
      }
    `,
  ];

  @property({ attribute: false }) public dashboard!: Dashboard;
  @property({ attribute: false }) public preview?: PreviewState;
  @property({ attribute: false }) public widgets: WidgetDefinition[] = [];
  @property({ attribute: false }) public primitives: PrimitiveDefinition[] = [];
  @property() public selectedItemId = "";
  /** Every selected item; `selectedItemId` is the main one. */
  @property({ attribute: false }) public selectedItemIds: string[] = [];
  /** The group whose children can be selected one by one. */
  @property() public enteredGroupId = "";
  @property({ type: Boolean }) public snapEnabled = true;
  /** True while a catalog drag is in progress, so the stage shows it accepts a drop. */
  @property({ type: Boolean }) public acceptingDrop = false;
  @property({ type: Boolean }) public canUndo = false;
  @property({ type: Boolean }) public canRedo = false;

  /** Pan and zoom live in the shell so they survive a trip to the code view. */
  @property({ attribute: false }) public viewport: Viewport = DEFAULT_VIEWPORT;
  @query(".canvas") private canvas?: HTMLElement;
  @query(".canvas-stage") private stage?: HTMLElement;
  /** The container a dragged element would drop into. */
  @state() private dropContainerId = "";
  /** The box being dragged out on empty canvas, on the display. */
  @state() private marquee?: ItemBounds;
  /** The lines the moved items share with their siblings and parent. */
  @state() private guides: Guide[] = [];
  private stopGesture?: () => void;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.stopGesture?.();
  }

  /** The display pixel under a screen point, or undefined outside the canvas. */
  public displayPointAt(
    clientX: number,
    clientY: number
  ): { x: number; y: number } | undefined {
    const canvas = this.canvas;
    if (!canvas) return undefined;
    const rect = canvas.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return undefined;
    }
    const { width, height } = this.dashboard.display;
    return {
      x: ((clientX - rect.left) / rect.width) * width,
      y: ((clientY - rect.top) / rect.height) * height,
    };
  }

  private setViewport(viewport: Viewport): void {
    emit(this, "viewport-change", viewport);
  }

  public resetView(): void {
    this.setViewport(DEFAULT_VIEWPORT);
  }

  /** Zoom so the whole display fits the stage with a margin. */
  public fitView(): void {
    const stage = this.stage;
    if (stage) {
      this.setViewport(
        fitViewport(
          { width: stage.clientWidth, height: stage.clientHeight },
          this.dashboard.display
        )
      );
    }
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault();
    this.setViewport(wheelViewport(this.viewport, event));
  }

  /**
   * The item being resized and what was measured for it when the drag began. A preview
   * that arrives mid-drag must not change the size the drag is working from.
   */
  private resizing?: { original: StudioItem; measured?: ItemBounds };

  /** What the backend measured for the item, brought up to date for edits it has not rendered. */
  private measure = (item: StudioItem): MeasuredBox | undefined => {
    const measured = this.measureSize(item);
    if (measured && this.isPlacedByExpression(item)) {
      return { ...measured, absolute: true };
    }
    return measured;
  };

  /** An element whose position or size an expression drives is drawn where the backend put it. */
  private isPlacedByExpression(item: StudioItem): boolean {
    const locks = itemLocks(item, this.primitives);
    return locks.position.length > 0 || locks.handles.length > 0;
  }

  private measureSize = (item: StudioItem): ItemBounds | undefined => {
    const base = this.resizing;
    if (base?.original.id === item.id) {
      return this.remeasure(base.original, item, base.measured);
    }
    const measured = this.preview?.itemBounds[item.id];
    if (!measured || item.kind !== "primitive") return measured;
    const composed = findItem(this.preview?.composedFrom.items ?? [], item.id);
    return this.remeasure(composed, item, measured);
  };

  private remeasure(
    from: StudioItem | undefined,
    to: StudioItem,
    measured: ItemBounds | undefined
  ): ItemBounds | undefined {
    if (!measured || from?.kind !== "primitive" || to.kind !== "primitive") {
      return measured;
    }
    return remeasured(from.primitive, to.primitive, measured);
  }

  /** The display pixel under a screen point; points outside the canvas are clamped to it. */
  private clampedPointAt(
    clientX: number,
    clientY: number
  ): { x: number; y: number } | undefined {
    const canvas = this.canvas;
    if (!canvas) return undefined;
    const rect = canvas.getBoundingClientRect();
    const { width, height } = this.dashboard.display;
    const x = ((clientX - rect.left) / rect.width) * width;
    const y = ((clientY - rect.top) / rect.height) * height;
    return {
      x: Math.min(width, Math.max(0, x)),
      y: Math.min(height, Math.max(0, y)),
    };
  }

  /** What a pointer press on an item selects: its outermost group, unless entered. */
  private targetOf(item: StudioItem): StudioItem {
    const id = selectionTarget(
      this.dashboard.items,
      item.id,
      this.enteredGroupId || undefined
    );
    return findItem(this.dashboard.items, id) ?? item;
  }

  private onItemPointerDown(event: PointerEvent, pressed: StudioItem): void {
    event.stopPropagation();
    event.preventDefault();
    const target = this.targetOf(pressed);
    if (event.shiftKey) {
      emit(this, "item-select", { itemId: target.id, additive: true });
      return;
    }
    const alreadySelected = this.selectedItemIds.includes(target.id);
    if (!alreadySelected) emit(this, "item-select", { itemId: target.id });
    const moving =
      alreadySelected && this.selectedItemIds.length > 1
        ? this.selectedItemIds
        : [target.id];
    this.beginMove(event, target, moving);
  }

  private onHandlePointerDown(
    event: PointerEvent,
    item: StudioItem,
    handle: ResizeHandle
  ): void {
    event.stopPropagation();
    event.preventDefault();
    emit(this, "item-select", { itemId: item.id });
    const locks = itemLocks(item, this.primitives);
    if (item.locked || locks.handles.includes(handle)) return;
    this.beginResize(event, item, handle);
  }

  private beginMove(
    event: PointerEvent,
    target: StudioItem,
    moving: string[]
  ): void {
    const locks = itemLocks(target, this.primitives);
    if (target.locked || locks.position.length > 0) return;
    this.stopGesture?.();
    const before = structuredClone(this.dashboard);
    const targets = moveTargets(this.dashboard, moving, this.measure);
    const snap = snapTargetsFor(
      this.dashboard,
      moving,
      target.id,
      this.measure
    );
    let last = { clientX: event.clientX, clientY: event.clientY };
    this.stopGesture = trackPointerGesture({
      origin: event,
      threshold: GESTURE_THRESHOLD,
      onMove: (move) => {
        last = { clientX: move.clientX, clientY: move.clientY };
        const { dx, dy } = this.displayDelta(event, move);
        // Ctrl or Cmd held turns off every kind of snapping, as the Snap toggle does.
        const snapping = this.snapEnabled && !move.ctrlKey && !move.metaKey;
        const items = moveSelection(
          targets,
          target.id,
          dx,
          dy,
          this.dashboard,
          snapping,
          snap
        );
        this.guides = snapping && snap ? movedGuides(targets, items, snap) : [];
        emit(this, "items-transform", { items });
        this.updateDropContainer(last, moving);
      },
      onEnd: (_end, activated) => {
        this.dropContainerId = "";
        this.guides = [];
        if (!activated) return;
        const point = this.clampedPointAt(last.clientX, last.clientY);
        const drop =
          moving.length === 1 && point
            ? { itemId: target.id, x: point.x, y: point.y }
            : undefined;
        emit(this, "item-transform-end", { before, drop });
      },
      onCancel: () => {
        this.dropContainerId = "";
        this.guides = [];
      },
    });
  }

  private beginResize(
    event: PointerEvent,
    item: StudioItem,
    handle: ResizeHandle
  ): void {
    this.stopGesture?.();
    const before = structuredClone(this.dashboard);
    const original = structuredClone(item);
    const found = locate(this.dashboard.items, item.id);
    const measured = this.measure(item);
    this.resizing = { original, measured };
    const minSize =
      item.kind === "widget"
        ? this.widgets.find((widget) => widget.id === item.widget.type)?.layout
            .minSize
        : undefined;
    this.stopGesture = trackPointerGesture({
      origin: event,
      threshold: GESTURE_THRESHOLD,
      onMove: (move) => {
        const { dx, dy } = this.displayDelta(event, move);
        const gesture: ItemGesture = {
          mode: "resize",
          handle,
          shiftKey: move.shiftKey,
        };
        emit(this, "items-transform", {
          items: [
            transformItem(original, gesture, dx, dy, this.dashboard, {
              snapEnabled: this.snapEnabled,
              minSize,
              measured,
              definitions: this.primitives,
              offset: found?.offset,
            }),
          ],
        });
      },
      onEnd: (_end, activated) => {
        this.resizing = undefined;
        if (activated) emit(this, "item-transform-end", { before });
      },
      onCancel: () => {
        this.resizing = undefined;
      },
    });
  }

  /** How far the pointer moved since the gesture began, in display pixels. */
  private displayDelta(
    origin: PointerEvent,
    move: PointerEvent
  ): { dx: number; dy: number } {
    const canvas = this.canvas;
    if (!canvas) return { dx: 0, dy: 0 };
    const rect = canvas.getBoundingClientRect();
    const { width, height } = this.dashboard.display;
    return {
      dx: Math.round(((move.clientX - origin.clientX) / rect.width) * width),
      dy: Math.round(((move.clientY - origin.clientY) / rect.height) * height),
    };
  }

  /** Highlights the container the dragged element would land in. */
  private updateDropContainer(
    pointer: { clientX: number; clientY: number },
    moving: string[]
  ): void {
    const point = this.clampedPointAt(pointer.clientX, pointer.clientY);
    if (!point || moving.length !== 1) {
      this.dropContainerId = "";
      return;
    }
    const container = containerAt(
      this.dashboard.items,
      point.x,
      point.y,
      moving,
      this.enteredGroupId || undefined
    );
    const parent = locate(this.dashboard.items, moving[0] ?? "")?.parent;
    this.dropContainerId =
      container && container.id !== parent?.id ? container.id : "";
  }

  /** Drag out a box on empty canvas to select what it touches; a plain click deselects. */
  private onCanvasPointerDown(event: PointerEvent): void {
    const start = this.clampedPointAt(event.clientX, event.clientY);
    if (!start) return;
    const additive = event.shiftKey;
    const base = additive ? this.selectedItemIds : [];
    this.stopGesture?.();
    this.stopGesture = trackPointerGesture({
      origin: event,
      threshold: GESTURE_THRESHOLD,
      onMove: (move) => {
        const end = this.clampedPointAt(move.clientX, move.clientY);
        if (!end) return;
        const box = boxBetween(start, end);
        this.marquee = box;
        const touched = marqueeSelection(
          this.dashboard,
          box,
          this.enteredGroupId || undefined,
          this.measure
        );
        emit(this, "selection-change", {
          itemIds: [...new Set([...base, ...touched])],
        });
      },
      onEnd: (_end, activated) => {
        this.marquee = undefined;
        if (!activated && !additive) this.deselect();
      },
      onCancel: () => {
        this.marquee = undefined;
      },
    });
  }

  private onItemContextMenu(event: MouseEvent, pressed: StudioItem): void {
    event.preventDefault();
    event.stopPropagation();
    emit(this, "context-menu", {
      source: "canvas",
      itemId: this.targetOf(pressed).id,
      clientX: event.clientX,
      clientY: event.clientY,
    });
  }

  private onCanvasContextMenu(event: MouseEvent): void {
    event.preventDefault();
    emit(this, "context-menu", {
      source: "empty",
      clientX: event.clientX,
      clientY: event.clientY,
      point: this.clampedPointAt(event.clientX, event.clientY),
    });
  }

  private onItemDoubleClick(event: MouseEvent, pressed: StudioItem): void {
    event.stopPropagation();
    const target = this.targetOf(pressed);
    if (isContainer(target) && target.grouped) {
      emit(this, "group-enter", { groupId: target.id });
    }
  }

  // --- events from the toolbar and the stage -------------------------------

  private runCommand(id: CommandId): void {
    emit(this, "command", { id });
  }

  private toggleSnap(): void {
    emit(this, "snap-toggle");
  }

  private deselect(): void {
    emit(this, "item-select", { itemId: "" });
  }

  private onStageDragOver(event: DragEvent): void {
    if (this.acceptingDrop) {
      event.preventDefault();
    }
  }

  private onStageDrop(event: DragEvent): void {
    event.preventDefault();
  }

  private onZoomChange(event: OdsEvent<"zoom-change">): void {
    event.stopPropagation();
    this.setViewport(withZoom(this.viewport, event.detail.zoom));
  }

  private onZoomReset(event: Event): void {
    event.stopPropagation();
    this.resetView();
  }

  private onZoomFit(event: Event): void {
    event.stopPropagation();
    this.fitView();
  }

  // --- items -----------------------------------------------------------------

  private resizeHandleLabel(item: StudioItem, handle: ResizeHandle): string {
    return strings.canvas.resizeHandle(item.name, strings.canvas.sides[handle]);
  }

  private renderBadges(item: StudioItem): TemplateResult {
    return html`
      ${
        item.hidden
          ? html`
              <span class="hidden-label">${strings.canvas.hidden}</span>
            `
          : nothing
      }
      ${
        item.locked
          ? html`
              <ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>
            `
          : this.renderExpressionLock(item)
      }
    `;
  }

  /** Says why an item cannot be dragged: a position field is an expression. */
  private renderExpressionLock(
    item: StudioItem
  ): TemplateResult | typeof nothing {
    const { position, scalingBlockedBy } = itemLocks(item, this.primitives);
    const reason = this.lockReason(position, scalingBlockedBy);
    if (!reason) return nothing;
    return html`
      <ha-icon
        class="lock-badge expression-lock"
        icon="mdi:function-variant"
        title=${reason}
        aria-label=${reason}
      ></ha-icon>
    `;
  }

  private lockReason(position: string[], blockedBy: string[]): string {
    if (position.length > 0) {
      return strings.expression.positionLocked(position.join(", "));
    }
    if (blockedBy.length > 0) {
      return strings.expression.scalingLocked(blockedBy.join(", "));
    }
    return "";
  }

  private renderSelectionSize(box: ItemBounds): TemplateResult {
    const width = Math.round(box.width);
    const height = Math.round(box.height);
    return html`
      <output class="selection-size" aria-live="off">
        ${strings.common.size(width, height)}
      </output>
    `;
  }

  private renderHandles(item: StudioItem): TemplateResult[] {
    if (item.kind === "primitive" && !isResizable(item.primitive)) return [];
    const disabled = itemLocks(item, this.primitives).handles;
    return RESIZE_HANDLES.filter((handle) => !disabled.includes(handle)).map(
      (handle) => html`
        <button
          data-resize-handle=${handle}
          class=${`resize-handle resize-${handle}`}
          tabindex="-1"
          aria-label=${this.resizeHandleLabel(item, handle)}
          @pointerdown=${(event: PointerEvent) =>
            this.onHandlePointerDown(event, item, handle)}
        ></button>
      `
    );
  }

  /** Several items have no shared handles; a group scales what is in it. */
  private showsHandles(item: StudioItem, selected: boolean): boolean {
    if (!selected || item.locked || this.selectedItemIds.length !== 1) {
      return false;
    }
    return true;
  }

  private showsGroupHint(item: StudioItem, selected: boolean): boolean {
    return (
      selected &&
      this.selectedItemIds.length === 1 &&
      isContainer(item) &&
      item.grouped &&
      this.enteredGroupId !== item.id
    );
  }

  private renderGroupHint(): TemplateResult {
    return html`
      <span class="group-hint">${strings.canvas.enterGroupHint}</span>
    `;
  }

  private itemClasses(placed: Placed): Record<string, boolean> {
    const { item } = placed;
    const selected = this.selectedItemIds.includes(item.id);
    const holdsSelection =
      isContainer(item) &&
      this.selectedItemIds.some(
        (id) => id !== item.id && locate(item.children, id) !== undefined
      );
    return {
      selection: true,
      selected,
      container: isContainer(item),
      group: isContainer(item) && item.grouped,
      entered: item.id === this.enteredGroupId,
      "holds-selection": holdsSelection,
      "drop-target": item.id === this.dropContainerId,
      locked: item.locked,
      hidden: item.hidden,
    };
  }

  private renderPlaced(placed: Placed): TemplateResult {
    const { item } = placed;
    const box = displayBoxOf(item, placed.offset, this.measure(item));
    const selected = this.selectedItemIds.includes(item.id);
    const single = this.selectedItemIds.length === 1;
    return html`
      <div
        data-item-id=${item.id}
        class=${classMap(this.itemClasses(placed))}
        style=${styleMap(percentBox(box, this.dashboard.display))}
        @pointerdown=${(event: PointerEvent) =>
          this.onItemPointerDown(event, item)}
        @dblclick=${(event: MouseEvent) => this.onItemDoubleClick(event, item)}
        @contextmenu=${(event: MouseEvent) =>
          this.onItemContextMenu(event, item)}
      >
        ${this.renderBadges(item)}
        ${selected && single ? this.renderSelectionSize(box) : nothing}
        ${this.showsGroupHint(item, selected) ? this.renderGroupHint() : nothing}
        ${this.showsHandles(item, selected) ? this.renderHandles(item) : nothing}
      </div>
    `;
  }

  /** One box around a selection of several items, with the size of all of them. */
  private renderSelectionBox(): TemplateResult | typeof nothing {
    if (this.selectedItemIds.length < 2) return nothing;
    const box = selectionBox(
      this.dashboard,
      this.selectedItemIds,
      this.measure
    );
    if (!box) return nothing;
    return html`
      <div
        class="multi-selection"
        style=${styleMap(percentBox(box, this.dashboard.display))}
      >
        ${this.renderSelectionSize(box)}
      </div>
    `;
  }

  private renderGuide(guide: Guide): TemplateResult {
    const { width, height } = this.dashboard.display;
    const vertical = guide.axis === "x";
    const style = vertical
      ? {
          left: `${(guide.position / width) * 100}%`,
          top: `${(guide.from / height) * 100}%`,
          height: `${((guide.to - guide.from) / height) * 100}%`,
        }
      : {
          top: `${(guide.position / height) * 100}%`,
          left: `${(guide.from / width) * 100}%`,
          width: `${((guide.to - guide.from) / width) * 100}%`,
        };
    return html`
      <div
        class="guide ${vertical ? "vertical" : "horizontal"}"
        style=${styleMap(style)}
      ></div>
    `;
  }

  private renderMarquee(): TemplateResult | typeof nothing {
    if (!this.marquee) return nothing;
    return html`
      <div
        class="marquee"
        style=${styleMap(percentBox(this.marquee, this.dashboard.display))}
      ></div>
    `;
  }

  // --- the canvas ------------------------------------------------------------

  private renderHistoryButton(id: "undo" | "redo"): TemplateResult {
    const view = commandView(
      commandById(id),
      { canUndo: this.canUndo, canRedo: this.canRedo },
      isMacPlatform()
    );
    return html`
      <button
        aria-label=${view.label}
        title=${view.title}
        ?disabled=${!view.enabled}
        @click=${() => this.runCommand(id)}
      >
        <ha-icon icon=${view.icon}></ha-icon>
      </button>
    `;
  }

  private renderToolbar(): TemplateResult {
    const dashboard = this.dashboard;
    const { width, height, padding, snapSize } = dashboard.display;
    const snapClasses = classMap({
      "tool-toggle": true,
      active: this.snapEnabled,
    });
    return html`
      <div class="workspace-meta">
        <span>${strings.common.sizeInPixels(width, height)}</span>
        <span>${strings.canvas.layers(countItems(dashboard.items))}</span>
        <span>${strings.canvas.padding(padding)}</span>
        <div class="history-controls">
          ${this.renderHistoryButton("undo")}
          ${this.renderHistoryButton("redo")}
        </div>
        <button
          class=${snapClasses}
          aria-pressed=${this.snapEnabled}
          @click=${this.toggleSnap}
        >
          <ha-icon icon="mdi:magnet"></ha-icon>
          <span>${strings.canvas.snap(snapSize)}</span>
        </button>
        <span class="zoom-readout">
          ${Math.round(this.viewport.zoom * 100)}%
        </span>
      </div>
    `;
  }

  private renderPreview(): TemplateResult {
    if (!this.preview) {
      return html`
        <div class="canvas-placeholder">${strings.canvas.rendering}</div>
      `;
    }
    return html`
      <img
        draggable="false"
        src=${this.preview.imageUrl}
        alt=${strings.canvas.previewAlt}
      />
    `;
  }

  private renderStage(): TemplateResult {
    const dashboard = this.dashboard;
    const { width, height, snapSize } = dashboard.display;
    const { zoom, panX, panY } = this.viewport;
    const viewportStyle = styleMap({
      transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
    });
    const canvasStyle = styleMap({
      width: `${width}px`,
      height: `${height}px`,
    });
    const workingAreaStyle = styleMap({
      ...percentBox(workingArea(dashboard), dashboard.display),
      "--snap-size": `${snapSize * zoom}px`,
    });
    const stageClasses = classMap({
      "canvas-stage": true,
      "accepting-drop": this.acceptingDrop,
    });
    return html`
      <section
        class=${stageClasses}
        @wheel=${this.onWheel}
        @dragover=${this.onStageDragOver}
        @drop=${this.onStageDrop}
      >
        <div class="canvas-viewport" style=${viewportStyle}>
          <div
            class="canvas"
            style=${canvasStyle}
            @pointerdown=${this.onCanvasPointerDown}
            @contextmenu=${this.onCanvasContextMenu}
          >
            ${this.renderPreview()}
            <div
              class="working-area"
              aria-hidden="true"
              style=${workingAreaStyle}
            ></div>
            ${withOffsets(dashboard.items).map((placed) =>
              this.renderPlaced(placed)
            )}
            ${this.renderSelectionBox()} ${this.renderMarquee()}
            ${this.guides.map((guide) => this.renderGuide(guide))}
          </div>
        </div>
        <ods-zoom-bar
          .zoom=${zoom}
          @zoom-change=${this.onZoomChange}
          @zoom-reset=${this.onZoomReset}
          @zoom-fit=${this.onZoomFit}
        ></ods-zoom-bar>
      </section>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <main class="workspace">
        ${this.renderToolbar()} ${this.renderStage()}
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-canvas": OdsCanvas;
  }
}
