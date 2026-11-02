import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { emit } from "./events";
import { loadFonts } from "./font-catalog";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";
import type {
  Dashboard,
  HomeAssistant,
  WidgetDefinition,
  WidgetLoadError,
} from "./types";
import "./ods-settings-fonts";
import "./ods-settings-overview";
import "./ods-settings-widgets";

type SettingsTab = "overview" | "fonts" | "widgets";

/** Something a tab lets you do; `soon` for what is shown but cannot be done yet. */
interface Ability {
  label: string;
  soon?: boolean;
}

/** What each tab is for and what can be done there. */
const about = (): Record<
  SettingsTab,
  { text: string; abilities: Ability[] }
> => ({
  overview: { text: strings.settings.about.overview, abilities: [] },
  fonts: {
    text: strings.settings.about.fonts,
    abilities: [
      { label: strings.settings.abilities.install },
      { label: strings.settings.abilities.preview },
      { label: strings.settings.abilities.remove },
    ],
  },
  widgets: {
    text: strings.settings.about.widgets,
    abilities: [
      { label: strings.settings.abilities.reload },
      { label: strings.settings.abilities.add, soon: true },
      { label: strings.settings.abilities.remove, soon: true },
      { label: strings.settings.abilities.switch, soon: true },
    ],
  },
});

const tabs = (): Array<{ id: SettingsTab; label: string; icon: string }> => [
  {
    id: "overview",
    label: strings.settings.tabs.overview,
    icon: "mdi:view-dashboard-outline",
  },
  { id: "fonts", label: strings.settings.tabs.fonts, icon: "mdi:format-font" },
  {
    id: "widgets",
    label: strings.settings.tabs.widgets,
    icon: "mdi:widgets-outline",
  },
];

/**
 * The settings that belong to the whole studio and not to one dashboard: an overview, the
 * fonts and the widgets. It is opened from the list of dashboards and closes back to it.
 */
@customElement("ods-settings")
export class OdsSettings extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .settings {
        height: 100%;
        overflow: auto;
        padding: clamp(22px, 4vw, 48px);
        background: var(--primary-background-color, #f5f7f8);
      }
      header,
      nav,
      .body {
        width: min(1180px, 100%);
        margin-inline: auto;
      }
      header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 22px;
      }
      header h1 {
        margin: 0;
        font-size: 25px;
        letter-spacing: -0.025em;
      }
      header p {
        margin: 5px 0 0;
        color: var(--studio-muted);
        font-size: 12px;
      }
      nav {
        display: flex;
        gap: 4px;
        margin-bottom: 22px;
        border-bottom: 1px solid var(--studio-border);
      }
      nav button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        border: 0;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: var(--studio-muted);
        font-size: 13px;
        font-weight: 600;
      }
      nav button:hover {
        color: var(--studio-text);
      }
      nav button[aria-selected="true"] {
        border-bottom-color: var(--studio-accent);
        color: var(--studio-text);
      }
      .about {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 10px;
        margin-bottom: 18px;
      }
      .about p {
        flex: 1 1 360px;
        margin: 0;
        color: var(--studio-muted);
        font-size: 13px;
        line-height: 1.5;
      }
      .about ul {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .about li {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 10px 3px 6px;
        border-radius: 999px;
        background: var(--studio-accent-soft);
        font-size: 12px;
      }
      .about li ha-icon {
        width: 14px;
        height: 14px;
        --mdc-icon-size: 14px;
      }
      .about li.soon {
        background: var(--secondary-background-color, #eef1f2);
        color: var(--studio-muted);
      }
      .about li small {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
    `,
  ];

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public dashboards: Dashboard[] = [];
  @property({ attribute: false }) public widgets: WidgetDefinition[] = [];
  @property({ attribute: false }) public widgetErrors: WidgetLoadError[] = [];

  @state() private tab: SettingsTab = "overview";
  @state() private fontCount = 0;

  connectedCallback(): void {
    super.connectedCallback();
    void this.countFonts();
  }

  private async countFonts(): Promise<void> {
    if (!this.hass) return;
    try {
      this.fontCount = (await loadFonts(this.hass)).length;
    } catch {
      // The overview then shows no fonts; the fonts tab says what went wrong.
      this.fontCount = 0;
    }
  }

  private close(): void {
    emit(this, "settings-close");
  }

  private select(tab: SettingsTab): void {
    this.tab = tab;
    if (tab === "overview") void this.countFonts();
  }

  private renderTab(tab: ReturnType<typeof tabs>[number]): TemplateResult {
    return html`
      <button
        type="button"
        role="tab"
        data-tab=${tab.id}
        aria-selected=${this.tab === tab.id ? "true" : "false"}
        @click=${() => this.select(tab.id)}
      >
        <ha-icon icon=${tab.icon}></ha-icon>
        ${tab.label}
      </button>
    `;
  }

  private renderAbility(ability: Ability): TemplateResult {
    return html`
      <li class=${ability.soon ? "soon" : ""}>
        <ha-icon
          icon=${ability.soon ? "mdi:clock-outline" : "mdi:check"}
        ></ha-icon>
        ${ability.label}
        ${
          ability.soon
            ? html`
                <small>${strings.settings.soon}</small>
              `
            : nothing
        }
      </li>
    `;
  }

  /** What the open tab is for, and what can be done there. */
  private renderAbout(): TemplateResult {
    const current = about()[this.tab];
    return html`
      <div class="about">
        <p>${current.text}</p>
        <ul>
          ${current.abilities.map((ability) => this.renderAbility(ability))}
        </ul>
      </div>
    `;
  }

  private renderBody(): TemplateResult {
    if (this.tab === "fonts") {
      return html`
        <ods-settings-fonts .hass=${this.hass}></ods-settings-fonts>
      `;
    }
    if (this.tab === "widgets") {
      return html`
        <ods-settings-widgets
          .widgets=${this.widgets}
          .errors=${this.widgetErrors}
        ></ods-settings-widgets>
      `;
    }
    return html`
      <ods-settings-overview
        .dashboards=${this.dashboards}
        .widgets=${this.widgets}
        .fontCount=${this.fontCount}
      ></ods-settings-overview>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <main class="settings">
        <header>
          <button
            type="button"
            class="icon-button"
            title=${strings.settings.back}
            aria-label=${strings.settings.back}
            @click=${this.close}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <div>
            <h1>${strings.settings.title}</h1>
            <p>${strings.settings.subtitle}</p>
          </div>
        </header>
        <nav role="tablist" aria-label=${strings.settings.sections}>
          ${tabs().map((tab) => this.renderTab(tab))}
        </nav>
        <div class="body" role="tabpanel">
          ${this.renderAbout()} ${this.renderBody()}
        </div>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-settings": OdsSettings;
  }
}
