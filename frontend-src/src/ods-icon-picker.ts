import type { nothing } from "lit";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, fieldStyles } from "./studio-styles";

/** How many matches are drawn; the rest is one more letter of the search away. */
const MAX_SHOWN = 96;
const MDI = "mdi:";

/** The name an icon is stored under: without the `mdi:` prefix, as ODL writes it. */
export const storedIconName = (value: string): string =>
  value.startsWith(MDI) ? value.slice(MDI.length) : value;

/** The icons whose name contains every word of the search, names that start with it first. */
export const matchingIcons = (icons: string[], search: string): string[] => {
  const words = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return icons.slice(0, MAX_SHOWN);
  const matches = icons.filter((icon) =>
    words.every((word) => icon.includes(word))
  );
  const first = words[0];
  const starting = matches.filter((icon) => icon.startsWith(first));
  const rest = matches.filter((icon) => !icon.startsWith(first));
  return [...starting, ...rest].slice(0, MAX_SHOWN);
};

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
      .grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 4px;
        max-height: 216px;
        margin-top: 8px;
        overflow: auto;
      }
      .grid button {
        display: grid;
        place-items: center;
        height: 34px;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 7px;
        background: transparent;
        color: var(--studio-text);
      }
      .grid button:hover {
        background: var(--studio-accent-soft);
      }
      .grid button[aria-pressed="true"] {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      ha-icon {
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

  private onSearch(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.search = event.target.value;
    }
  }

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
    return html`
      <div class="grid">${shown.map((icon) => this.renderIcon(icon))}</div>
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
