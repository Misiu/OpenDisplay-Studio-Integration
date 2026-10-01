import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  dashboardFormData,
  dashboardFormLabel,
  dashboardFormSchema,
  settingsFormFields,
  dashboardIsValid,
  listDashboards,
  type DashboardFormData,
  type DashboardSort,
} from "./dashboards";
import { inputValue } from "./dom";
import { emit, type DashboardDialog, type OdsEvent } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles, tileStyles } from "./studio-styles";
import type { Dashboard, HomeAssistant } from "./types";
import "./ods-dashboard-card";

/** The dashboard library: search, sort, the cards, and the settings and delete dialogs. */
@customElement("ods-gallery")
export class OdsGallery extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    tileStyles,
    css`
      :host {
        display: contents;
      }
      .dashboard-library {
        height: 100%;
        overflow: auto;
        padding: clamp(22px, 4vw, 48px);
        background: var(--primary-background-color, #f5f7f8);
      }
      .dashboard-library-header,
      .dashboard-library-tools,
      .dashboard-grid,
      .dashboard-library > ha-alert {
        width: min(1180px, 100%);
        margin-inline: auto;
      }
      .dashboard-library-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        margin-bottom: 24px;
      }
      .dashboard-library-header h1 {
        margin: 0;
        font-size: 25px;
        letter-spacing: -0.025em;
      }
      .dashboard-library-header p {
        margin: 5px 0 0;
        color: var(--studio-muted);
        font-size: 12px;
      }
      .dashboard-new-button-label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        line-height: 1;
      }
      .dashboard-new-button-label ha-icon {
        width: 17px;
        height: 17px;
        line-height: 1;
        --mdc-icon-size: 17px;
      }
      .dashboard-library-tools {
        display: grid;
        grid-template-columns: minmax(220px, 1fr) auto;
        gap: 10px;
        margin-bottom: 18px;
      }
      .dashboard-search,
      .dashboard-sort {
        min-height: 40px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0 12px;
        border: 1px solid var(--studio-border);
        border-radius: 10px;
        background: var(--studio-surface);
      }
      .dashboard-search ha-icon {
        width: 17px;
        color: var(--studio-muted);
      }
      .dashboard-search input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
      }
      .dashboard-sort span {
        color: var(--studio-muted);
        font-size: 11px;
      }
      .dashboard-sort select {
        min-width: 130px;
        border: 0;
        outline: 0;
        background: transparent;
        font-size: 12px;
      }
      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
        align-items: stretch;
      }
      .dashboard-add-card {
        display: grid;
        place-items: center;
        align-content: center;
        gap: 10px;
        border-style: dashed;
        color: var(--studio-muted);
        box-shadow: none;
      }
      .dashboard-add-card ha-icon {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        padding: 9px;
        border-radius: 10px;
        color: var(--studio-accent);
        background: var(--studio-accent-soft);
        line-height: 1;
        --mdc-icon-size: 20px;
      }
      .dashboard-add-card strong {
        color: var(--studio-text);
        font-size: 13px;
      }
      .dashboard-no-results {
        min-height: 236px;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 8px;
        color: var(--studio-muted);
        text-align: center;
      }
      .dashboard-no-results ha-icon {
        width: 30px;
        height: 30px;
      }
      .dashboard-no-results strong {
        color: var(--studio-text);
      }
      .dashboard-no-results span {
        font-size: 12px;
      }
      .dashboard-settings-content {
        padding: 18px 22px 22px;
      }
      .dashboard-delete-content {
        padding: 8px 22px 22px;
        color: var(--studio-muted);
        font-size: 13px;
        line-height: 1.5;
      }
      .dashboard-delete-content p {
        margin: 0;
      }
      .dashboard-delete-content p + p {
        margin-top: 8px;
      }
      .dashboard-delete-content strong {
        color: var(--studio-text);
      }
      @media (max-width: 600px) {
        .dashboard-library {
          padding: 18px 12px;
        }
        .dashboard-library-header {
          align-items: flex-start;
        }
        .dashboard-library-tools {
          grid-template-columns: 1fr;
        }
        .dashboard-sort {
          justify-content: space-between;
        }
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  @property({ attribute: false }) public dashboards: Dashboard[] = [];
  @property({ attribute: false }) public hass?: HomeAssistant;
  @property() public error = "";
  @property({ type: Boolean }) public saving = false;
  /** The open dialog, if any; the owner keeps it so it can close it once a save succeeds. */
  @property() public dialog?: DashboardDialog;
  @property({ attribute: false }) public draft?: Dashboard;

  @state() private searchText = "";
  @state() private sort: DashboardSort = "updated";
  @state() private menuDashboardId = "";

  private get language(): string {
    return this.hass?.language || "en";
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("pointerdown", this.onOutsidePointerDown);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("pointerdown", this.onOutsidePointerDown);
  }

  private onOutsidePointerDown = (event: PointerEvent): void => {
    if (!this.menuDashboardId) return;
    const insideMenu = event
      .composedPath()
      .some(
        (node) =>
          node instanceof HTMLElement &&
          (node.classList.contains("dashboard-menu") ||
            node.classList.contains("dashboard-menu-trigger"))
      );
    if (!insideMenu) this.menuDashboardId = "";
  };
  private onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    if (this.menuDashboardId) {
      this.menuDashboardId = "";
      event.stopPropagation();
    } else if (this.dialog) {
      emit(this, "dashboard-dialog-close");
      event.stopPropagation();
    }
  };

  private onSearchInput(event: Event): void {
    this.searchText = inputValue(event);
  }

  private onSortChange(event: Event): void {
    this.sort = inputValue(event) === "name" ? "name" : "updated";
  }

  private onMenuToggle(event: OdsEvent<"dashboard-menu-toggle">): void {
    event.stopPropagation();
    const { dashboardId } = event.detail;
    this.menuDashboardId =
      this.menuDashboardId === dashboardId ? "" : dashboardId;
  }

  /** An action was chosen in a card's menu; the menu closes, the action goes on to the app. */
  private closeMenu(): void {
    this.menuDashboardId = "";
  }

  private settingsChanged(
    event: CustomEvent<{ value: Partial<DashboardFormData> }>
  ): void {
    emit(this, "dashboard-settings-change", { value: event.detail.value });
  }

  private renderCard(dashboard: Dashboard): TemplateResult {
    const renaming =
      this.dialog === "rename" && this.draft?.id === dashboard.id;
    return html`
      <ods-dashboard-card
        .dashboard=${dashboard}
        .language=${this.language}
        .menuOpen=${this.menuDashboardId === dashboard.id}
        .renaming=${renaming}
        .draftName=${this.draft?.name ?? dashboard.name}
        @dashboard-menu-toggle=${this.onMenuToggle}
        @dashboard-menu-action=${this.closeMenu}
      ></ods-dashboard-card>
    `;
  }

  private renderDialog(): TemplateResult | typeof nothing {
    const dashboard = this.draft;
    if (!dashboard || !this.dialog || this.dialog === "rename") return nothing;
    if (this.dialog === "delete") {
      return html`
        <ha-dialog
          .open=${true}
          width="small"
          header-title=${strings.gallery.deleteTitle}
          @closed=${() => emit(this, "dashboard-dialog-close")}
        >
          <div class="dashboard-delete-content">
            <p>
              <strong>${dashboard.name}</strong>
              ${strings.gallery.deleteBody}
            </p>
            <p>${strings.gallery.deleteWarning}</p>
          </div>
          <ha-dialog-footer slot="footer">
            <ha-button
              slot="secondaryAction"
              appearance="plain"
              @click=${() => emit(this, "dashboard-dialog-close")}
            >
              ${strings.common.cancel}
            </ha-button>
            <ha-button
              slot="primaryAction"
              variant="danger"
              appearance="filled"
              .disabled=${this.saving}
              @click=${() => emit(this, "dashboard-delete-confirm")}
            >
              ${this.saving ? strings.gallery.deleting : strings.gallery.deleteAction}
            </ha-button>
          </ha-dialog-footer>
        </ha-dialog>
      `;
    }
    return html`
      <ha-dialog
        .open=${true}
        width="medium"
        header-title=${strings.gallery.settingsTitle}
        header-subtitle=${dashboard.name}
        @closed=${() => emit(this, "dashboard-dialog-close")}
      >
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${dashboardFormData(dashboard)}
            .schema=${dashboardFormSchema(settingsFormFields(dashboard))}
            .computeLabel=${dashboardFormLabel}
            @value-changed=${this.settingsChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => emit(this, "dashboard-dialog-close")}
          >
            ${strings.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !dashboardIsValid(dashboard)}
            @click=${() => emit(this, "dashboard-settings-save")}
          >
            ${this.saving ? strings.gallery.saving : strings.gallery.settingsSave}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
  }

  protected render(): TemplateResult {
    const dashboards = listDashboards(
      this.dashboards,
      this.searchText,
      this.sort,
      this.language
    );
    return html`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div>
            <h1>${strings.gallery.title}</h1>
            <p>${strings.gallery.count(this.dashboards.length)}</p>
          </div>
          <ha-button
            class="dashboard-new-button"
            appearance="filled"
            aria-label=${strings.gallery.newDashboard}
            @click=${() => emit(this, "dashboard-new")}
          >
            <span class="dashboard-new-button-label">
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>${strings.gallery.newDashboard}</span>
            </span>
          </ha-button>
        </header>
        ${
          this.error
            ? html`
                <ha-alert alert-type="error">${this.error}</ha-alert>
              `
            : nothing
        }
        <section
          class="dashboard-library-tools"
          aria-label=${strings.gallery.filters}
        >
          <label class="dashboard-search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              type="search"
              aria-label=${strings.gallery.search}
              placeholder=${strings.gallery.searchPlaceholder}
              .value=${this.searchText}
              @input=${this.onSearchInput}
            />
          </label>
          <label class="dashboard-sort">
            <span>${strings.gallery.sort}</span>
            <select
              aria-label=${strings.gallery.sortDashboards}
              .value=${this.sort}
              @change=${this.onSortChange}
            >
              <option value="updated">${strings.gallery.sortUpdated}</option>
              <option value="name">${strings.gallery.sortName}</option>
            </select>
          </label>
        </section>
        <section
          class="dashboard-grid"
          aria-label=${strings.gallery.savedDashboards}
        >
          <button
            class="dashboard-add-card"
            aria-label=${strings.gallery.addDashboard}
            @click=${() => emit(this, "dashboard-new")}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            <strong>${strings.gallery.newDashboard}</strong>
          </button>
          ${dashboards.map((dashboard) => this.renderCard(dashboard))}
          ${
            !dashboards.length
              ? html`
                  <div class="dashboard-no-results">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <strong>${strings.gallery.noResults}</strong>
                    <span>${strings.gallery.noResultsHint}</span>
                  </div>
                `
              : nothing
          }
        </section>
      </main>
      ${this.renderDialog()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-gallery": OdsGallery;
  }
}
