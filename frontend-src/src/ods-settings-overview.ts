import type { nothing } from "lit";
import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { dashboardStats, type WidgetUse } from "./settings-stats";
import { strings } from "./strings";
import { baseStyles } from "./studio-styles";
import type { Dashboard, WidgetDefinition } from "./types";

/** A look at what has been built: how many dashboards and elements, and which widgets. */
@customElement("ods-settings-overview")
export class OdsSettingsOverview extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
        gap: 12px;
        margin: 0 0 24px;
        padding: 0;
        list-style: none;
      }
      .tile {
        padding: 16px 18px;
        border: 1px solid var(--studio-border);
        border-radius: 12px;
        background: var(--studio-surface);
      }
      .tile strong {
        display: block;
        font-size: 30px;
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .tile span {
        color: var(--studio-muted);
        font-size: 12px;
      }
      h2 {
        margin: 0 0 12px;
        font-size: 15px;
      }
      .use {
        display: grid;
        gap: 8px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .use li {
        display: grid;
        grid-template-columns: minmax(110px, 200px) 1fr auto;
        align-items: center;
        gap: 12px;
        font-size: 13px;
      }
      .bar {
        height: 8px;
        border-radius: 4px;
        background: var(--studio-accent);
      }
      .count {
        color: var(--studio-muted);
        font-size: 12px;
      }
      .none {
        color: var(--studio-muted);
        font-size: 13px;
      }
    `,
  ];

  @property({ attribute: false }) public dashboards: Dashboard[] = [];
  @property({ attribute: false }) public widgets: WidgetDefinition[] = [];
  @property({ type: Number }) public fontCount = 0;

  private renderTile(label: string, value: number): TemplateResult {
    return html`
      <li class="tile">
        <strong>${value}</strong>
        <span>${label}</span>
      </li>
    `;
  }

  private renderUse(use: WidgetUse, most: number): TemplateResult {
    return html`
      <li data-widget=${use.id}>
        <span>${use.name}</span>
        <span
          class="bar"
          style=${styleMap({ width: `${(use.count / most) * 100}%` })}
        ></span>
        <span class="count">${strings.settings.overview.times(use.count)}</span>
      </li>
    `;
  }

  private renderWidgetUse(uses: WidgetUse[]): TemplateResult {
    if (uses.length === 0) {
      return html`
        <p class="none">${strings.settings.overview.noneUsed}</p>
      `;
    }
    const most = uses[0].count;
    return html`
      <ul class="use">
        ${uses.map((use) => this.renderUse(use, most))}
      </ul>
    `;
  }

  protected render(): TemplateResult | typeof nothing {
    const stats = dashboardStats(this.dashboards, this.widgets);
    const overview = strings.settings.overview;
    return html`
      <ul class="tiles">
        ${this.renderTile(overview.dashboards, stats.dashboards)}
        ${this.renderTile(overview.elements, stats.elements)}
        ${this.renderTile(overview.widgetsInstalled, this.widgets.length)}
        ${this.renderTile(overview.fontsInstalled, this.fontCount)}
      </ul>
      <h2>${overview.mostUsed}</h2>
      ${this.renderWidgetUse(stats.widgetUse)}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-settings-overview": OdsSettingsOverview;
  }
}
