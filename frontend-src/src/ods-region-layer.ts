import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { widgetInRegion } from "./basic-ops";
import { emit } from "./events";
import type { BasicStep } from "./events";
import {
  canMerge,
  rectangleBetween,
  regionLetter,
  regionAt,
  type CellPosition,
  type CellRectangle,
} from "./grid-layout";
import { strings } from "./strings";
import { baseStyles } from "./studio-styles";
import type {
  Dashboard,
  GridLayout,
  GridRegion,
  ItemFrame,
  LayoutFrames,
} from "./types";

/** A box on the display, as the canvas draws it: in display pixels. */
const boxStyle = (frame: ItemFrame): Record<string, string> => ({
  left: `${frame.x}px`,
  top: `${frame.y}px`,
  width: `${frame.width}px`,
  height: `${frame.height}px`,
});

/**
 * The regions of a basic dashboard, drawn over the picture of the display. On the Layout
 * tab the cells of the grid take two clicks to join into a region; on the Widgets tab each
 * region is a place a widget goes into, and a click selects what is in it.
 */
@customElement("ods-region-layer")
export class OdsRegionLayer extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      button {
        position: absolute;
        box-sizing: border-box;
        padding: 0;
        pointer-events: auto;
        cursor: pointer;
        background: transparent;
        color: var(--studio-text);
      }
      .cell {
        border: calc(1px * var(--ui, 1)) dashed var(--studio-accent);
      }
      .cell.joined {
        border-color: transparent;
      }
      .cell:hover,
      .cell.in-rectangle {
        background: var(--studio-accent-soft);
      }
      .cell.corner {
        background: var(--studio-accent-soft);
        border-style: solid;
      }
      .cell.in-rectangle.invalid {
        background: color-mix(
          in srgb,
          var(--error-color, #db4437) 18%,
          transparent
        );
        border-color: var(--error-color, #db4437);
      }
      .outline {
        position: absolute;
        box-sizing: border-box;
        border: calc(2px * var(--ui, 1)) solid var(--studio-accent);
        pointer-events: none;
      }
      .outline {
        display: grid;
        place-content: center;
        justify-items: center;
        gap: calc(2px * var(--ui, 1));
        color: var(--studio-text);
      }
      .letter {
        font-size: calc(26px * var(--ui, 1));
        font-weight: 700;
      }
      .size {
        color: var(--studio-muted);
        font: calc(10px * var(--ui, 1)) var(--code-font-family, monospace);
      }
      .outline.selected {
        background: var(--studio-accent-soft);
        box-shadow: 0 0 0 calc(2px * var(--ui, 1)) var(--studio-accent);
      }
      /* A region with a widget draws nothing of its own, so the picture is what will be
         rendered; only an empty region is marked, and the selected one is outlined. */
      .slot {
        border: 0;
      }
      .slot:hover {
        box-shadow: inset 0 0 0 calc(1px * var(--ui, 1)) var(--studio-accent);
      }
      .slot.empty {
        border: calc(1px * var(--ui, 1)) dashed var(--studio-accent);
        background: color-mix(in srgb, var(--studio-surface) 70%, transparent);
      }
      .slot.empty:hover {
        background: var(--studio-accent-soft);
        box-shadow: none;
      }
      .slot.selected {
        border: calc(2px * var(--ui, 1)) solid var(--studio-accent);
        box-shadow: none;
      }
      .slot.empty.selected {
        background: var(--studio-accent-soft);
      }
      .slot-label {
        position: absolute;
        top: 0;
        left: 0;
        max-width: 100%;
        padding: calc(2px * var(--ui, 1)) calc(6px * var(--ui, 1));
        overflow: hidden;
        background: var(--studio-accent);
        color: var(--studio-on-accent, #fff);
        font-size: calc(11px * var(--ui, 1));
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .slot-empty {
        display: grid;
        gap: calc(4px * var(--ui, 1));
        place-items: center;
        font-size: calc(12px * var(--ui, 1));
      }
      .slot-empty ha-icon {
        --mdc-icon-size: calc(28px * var(--ui, 1));
        color: var(--studio-accent);
      }
      .status {
        position: absolute;
        bottom: calc(8px * var(--ui, 1));
        left: 50%;
        padding: calc(4px * var(--ui, 1)) calc(10px * var(--ui, 1));
        border-radius: 999px;
        background: var(--studio-text);
        color: var(--studio-surface);
        font-size: calc(12px * var(--ui, 1));
        transform: translateX(-50%);
        white-space: nowrap;
      }
    `,
  ];

  @property({ attribute: false }) public dashboard!: Dashboard;
  @property({ attribute: false }) public frames?: LayoutFrames;
  @property() public step: BasicStep = "layout";
  @property() public selectedRegionId = "";

  /** The first corner of a region being drawn. */
  @state() private corner?: CellPosition;
  /** The cell under the pointer; with a corner set, it is the second corner. */
  @state() private hover?: CellPosition;

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("step")) {
      this.stopJoining();
    }
  }

  private get layout(): GridLayout | undefined {
    return this.dashboard.layout;
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.corner) {
      this.stopJoining();
    }
  };

  private hoverCell(cell: CellPosition): void {
    this.hover = cell;
  }

  private stopJoining(): void {
    this.corner = undefined;
    this.hover = undefined;
  }

  private cellAt(index: number, layout: GridLayout): CellPosition {
    return {
      row: Math.floor(index / layout.columns),
      column: index % layout.columns,
    };
  }

  private isCorner(cell: CellPosition): boolean {
    return this.corner?.row === cell.row && this.corner.column === cell.column;
  }

  /** The cells from the first corner to the one under the pointer. */
  private get joining(): CellRectangle | undefined {
    if (!this.corner || !this.hover) return undefined;
    return rectangleBetween(this.corner, this.hover);
  }

  private isInJoin(cell: CellPosition): boolean {
    const join = this.joining;
    if (!join) return false;
    return (
      cell.row >= join.row &&
      cell.row < join.row + join.rowSpan &&
      cell.column >= join.column &&
      cell.column < join.column + join.columnSpan
    );
  }

  /** A cell of a region of several cells shows no border, so the region reads as one. */
  private isInJoinedRegion(cell: CellPosition, layout: GridLayout): boolean {
    const region = regionAt(layout, cell);
    return (
      region !== undefined && (region.rowSpan > 1 || region.columnSpan > 1)
    );
  }

  private joinIsValid(layout: GridLayout): boolean {
    const join = this.joining;
    return join !== undefined && canMerge(layout, join);
  }

  private onCellClick(cell: CellPosition, layout: GridLayout): void {
    const region = regionAt(layout, cell);
    if (!this.corner) {
      this.corner = cell;
      if (region) emit(this, "region-select", { regionId: region.id });
      return;
    }
    const rectangle = rectangleBetween(this.corner, cell);
    if (rectangle.rowSpan === 1 && rectangle.columnSpan === 1) {
      this.stopJoining();
      return;
    }
    if (!canMerge(layout, rectangle)) return;
    this.stopJoining();
    emit(this, "regions-merge", { rectangle });
  }

  /** Double-clicking a joined region cuts it back into cells. */
  private onCellDoubleClick(cell: CellPosition, layout: GridLayout): void {
    const region = regionAt(layout, cell);
    if (region && this.isInJoinedRegion(cell, layout)) {
      this.stopJoining();
      emit(this, "region-split", { regionId: region.id });
    }
  }

  private onSlotClick(regionId: string): void {
    emit(this, "region-select", { regionId });
  }

  private renderCell(
    frame: ItemFrame,
    index: number,
    layout: GridLayout
  ): TemplateResult {
    const cell = this.cellAt(index, layout);
    const inJoin = this.isInJoin(cell);
    const classes = [
      "cell",
      this.isCorner(cell) ? "corner" : "",
      inJoin ? "in-rectangle" : "",
      this.isInJoinedRegion(cell, layout) ? "joined" : "",
      inJoin && !this.joinIsValid(layout) ? "invalid" : "",
    ].join(" ");
    return html`
      <button
        type="button"
        class=${classes}
        style=${styleMap(boxStyle(frame))}
        aria-label=${strings.basic.cell(cell.row + 1, cell.column + 1)}
        @pointerenter=${() => this.hoverCell(cell)}
        @click=${() => this.onCellClick(cell, layout)}
        @dblclick=${() => this.onCellDoubleClick(cell, layout)}
      ></button>
    `;
  }

  /** A region of the layout: its letter, and how many cells wide and high it is. */
  private renderOutline(
    frames: LayoutFrames,
    region: GridRegion,
    index: number
  ): TemplateResult | typeof nothing {
    // The frames come from the backend a moment after the layout changes.
    const frame = frames.regions.find(
      (candidate) => candidate.id === region.id
    );
    if (!frame) return nothing;
    const selected = region.id === this.selectedRegionId;
    return html`
      <div
        class="outline ${selected ? "selected" : ""}"
        style=${styleMap(boxStyle(frame))}
      >
        <span class="letter">${regionLetter(index)}</span>
        <span class="size">
          ${strings.basic.regionSize(region.columnSpan, region.rowSpan)}
        </span>
      </div>
    `;
  }

  private renderLayoutStep(
    frames: LayoutFrames,
    layout: GridLayout
  ): TemplateResult {
    return html`
      ${layout.regions.map((region, index) =>
        this.renderOutline(frames, region, index)
      )}
      ${frames.cells.map((frame, index) =>
        this.renderCell(frame, index, layout)
      )}
      ${this.renderStatus(layout)}
    `;
  }

  /** What to do next while a region is being drawn. */
  private statusMessage(layout: GridLayout): string | undefined {
    if (this.corner) {
      const invalid = this.joining !== undefined && !this.joinIsValid(layout);
      return invalid ? strings.basic.joinInvalid : strings.basic.joinStarted;
    }
    return undefined;
  }

  private renderStatus(layout: GridLayout): TemplateResult | typeof nothing {
    const message = this.statusMessage(layout);
    if (!message) return nothing;
    return html`
      <div class="status" role="status">${message}</div>
    `;
  }

  /** An empty region says so; a filled one names its widget while it is selected. */
  private renderSlotContent(
    regionId: string,
    letter: string
  ): TemplateResult | typeof nothing {
    const widget = widgetInRegion(this.dashboard, regionId);
    if (!widget) {
      return html`
        <span class="slot-empty">
          <span class="letter">${letter}</span>
          <span>${strings.basic.emptyRegion}</span>
        </span>
      `;
    }
    if (regionId !== this.selectedRegionId) return nothing;
    return html`
      <span class="slot-label">${widget.name}</span>
    `;
  }

  private renderSlot(
    frame: ItemFrame,
    regionId: string,
    letter: string
  ): TemplateResult {
    const empty = !widgetInRegion(this.dashboard, regionId);
    const selected = regionId === this.selectedRegionId;
    const classes = [
      "slot",
      empty ? "empty" : "",
      selected ? "selected" : "",
    ].join(" ");
    return html`
      <button
        type="button"
        class=${classes}
        data-region-id=${regionId}
        style=${styleMap(boxStyle(frame))}
        aria-label=${strings.basic.region(letter)}
        aria-pressed=${selected ? "true" : "false"}
        @click=${() => this.onSlotClick(regionId)}
      >
        ${this.renderSlotContent(regionId, letter)}
      </button>
    `;
  }

  private renderWidgetsStep(frames: LayoutFrames): TemplateResult {
    return html`
      ${frames.regions.map((region, index) =>
        this.renderSlot(region, region.id, regionLetter(index))
      )}
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    const layout = this.layout;
    const frames = this.frames;
    if (!layout || !frames) return nothing;
    return this.step === "layout"
      ? this.renderLayoutStep(frames, layout)
      : this.renderWidgetsStep(frames);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-region-layer": OdsRegionLayer;
  }
}
