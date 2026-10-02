import type { nothing } from "lit";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";

const MDI = "mdi:";
const ROW_HEIGHT = 36;
const LIST_HEIGHT = 288;
/** Rows drawn above and below the visible ones, so a fast scroll does not show gaps. */
const OVERSCAN = 6;

/** The name an icon is stored under: without the `mdi:` prefix, as ODL writes it. */
export const storedIconName = (value: string): string =>
  value.startsWith(MDI) ? value.slice(MDI.length) : value;

/** The icons whose name contains every word of the search, names that start with it first. */
export const matchingIcons = (icons: string[], search: string): string[] => {
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return icons;
  const matches = icons.filter((icon) =>
    words.every((word) => icon.includes(word))
  );
  const first = words[0];
  const starting = matches.filter((icon) => icon.startsWith(first));
  const rest = matches.filter((icon) => !icon.startsWith(first));
  return [...starting, ...rest];
};

/** The rows of a long list worth drawing for a scroll position, with a margin. */
export const visibleRows = (
  scrollTop: number,
  rowCount: number
): { first: number; last: number } => ({
  first: Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN),
  last: Math.min(
    rowCount,
    Math.ceil((scrollTop + LIST_HEIGHT) / ROW_HEIGHT) + OVERSCAN
  ),
});

/**
 * Picks one of the Material Design icons the renderer can draw: a search box and a grid
 * of the matches. It reports the name without its prefix with `icon-change`.
 */
@customElement("ods-icon-picker")
export class OdsIconPicker extends LitElement {
  static styles = [
    baseStyles,
    fieldStyles,
    css`
      :host {
        display: block;
      }
      .list {
        position: relative;
        height: ${LIST_HEIGHT}px;
        margin-top: 8px;
        overflow: auto;
        overscroll-behavior: contain;
      }
      .rows {
        position: absolute;
        inset-inline: 0;
        top: 0;
      }
      .list button {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        height: ${ROW_HEIGHT}px;
        padding: 0 8px;
        border: 1px solid transparent;
        border-radius: 7px;
        background: transparent;
        color: var(--studio-text);
        font-size: 12px;
        text-align: start;
      }
      .list button span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list button:hover {
        background: var(--studio-accent-soft);
      }
      .list button[aria-pressed="true"] {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      ha-icon {
        flex: none;
        --mdi-icon-size: 22px;
        width: 22px;
        height: 22px;
      }
      .empty {
        padding: 12px 0 4px;
        color: var(--studio-muted);
        font-size: 11px;
      }
    `,
  ];

  /** Every icon the renderer has; empty until the list has arrived. */
  @property({ attribute: false }) public icons: string[] = [];
  @property() public value = "";

  @state() private search = "";
  @state() private listScroll = 0;

  private onSearch(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.search = event.target.value;
      this.listScroll = 0;
      this.list?.scrollTo({ top: 0 });
    }
  }

  private onScroll(event: Event): void {
    if (event.target instanceof HTMLElement) {
      this.listScroll = event.target.scrollTop;
    }
  }

  @query(".list") private list?: HTMLElement;

  private choose(icon: string): void {
    emit(this, "icon-change", { icon });
  }

  private renderIcon(icon: string): TemplateResult {
    return html`
      <button
        type="button"
        title=${icon}
        aria-label=${icon}
        aria-pressed=${icon === storedIconName(this.value) ? "true" : "false"}
        @click=${() => this.choose(icon)}
      >
        <ha-icon icon=${`${MDI}${icon}`}></ha-icon>
        <span>${icon}</span>
      </button>
    `;
  }

  private renderResults(): TemplateResult | typeof nothing {
    const shown = matchingIcons(this.icons, this.search);
    if (shown.length === 0) {
      return html`
        <p class="empty">${strings.iconPicker.noMatch}</p>
      `;
    }
    const { first, last } = visibleRows(this.listScroll, shown.length);
    return html`
      <div class="list" @scroll=${this.onScroll}>
        <div style=${styleMap({ height: `${shown.length * ROW_HEIGHT}px` })}>
          <div
            class="rows"
            style=${styleMap({ top: `${first * ROW_HEIGHT}px` })}
          >
            ${shown.slice(first, last).map((icon) => this.renderIcon(icon))}
          </div>
        </div>
      </div>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="box">
        <input
          type="search"
          aria-label=${strings.iconPicker.search}
          placeholder=${strings.iconPicker.search}
          .value=${this.search}
          @input=${this.onSearch}
        />
      </div>
      ${this.renderResults()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-icon-picker": OdsIconPicker;
  }
}
