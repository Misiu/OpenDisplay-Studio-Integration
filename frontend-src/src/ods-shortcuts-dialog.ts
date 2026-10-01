import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { COMMANDS, commandView, type CommandGroup } from "./commands";
import { isMacPlatform } from "./dom";
import { emit } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles } from "./studio-styles";

const GROUP_ORDER: CommandGroup[] = [
  "edit",
  "arrange",
  "group",
  "view",
  "history",
];

/** A modal listing every keyboard shortcut, generated from the command registry. */
@customElement("ods-shortcuts-dialog")
export class OdsShortcutsDialog extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    css`
      :host {
        display: contents;
      }
      .scrim {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: grid;
        place-items: center;
        padding: 20px;
        background: rgba(8, 15, 24, 0.62);
      }
      .dialog {
        width: min(520px, 100%);
        max-height: calc(100vh - 40px);
        overflow: auto;
        border-radius: 14px;
        background: var(--studio-surface);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
      }
      .dialog > header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px 8px;
      }
      .dialog h2 {
        margin: 3px 0 0;
        font-size: 21px;
      }
      section {
        padding: 6px 20px 12px;
      }
      h3 {
        margin: 10px 0 6px;
        color: var(--studio-muted);
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      dl {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px 16px;
        margin: 0;
        font-size: 13px;
      }
      dd {
        margin: 0;
        color: var(--studio-muted);
        font: 12px var(--code-font-family, monospace);
      }
    `,
  ];

  private close(): void {
    emit(this, "shortcuts-close");
  }

  private onScrimClick(event: Event): void {
    if (event.target === event.currentTarget) this.close();
  }

  private renderGroup(group: CommandGroup): TemplateResult {
    const mac = isMacPlatform();
    const rows = COMMANDS.filter(
      (command) => command.group === group && command.shortcuts.length > 0
    ).map((command) => {
      const view = commandView(command, { canUndo: true, canRedo: true }, mac);
      const keys = command.shortcuts
        .map(
          (shortcut) =>
            commandView(
              { ...command, shortcuts: [shortcut] },
              { canUndo: true, canRedo: true },
              mac
            ).shortcut
        )
        .join(" · ");
      return html`
        <dt>${view.label}</dt>
        <dd>${keys}</dd>
      `;
    });
    return html`
      <section>
        <h3>${strings.shortcuts.groups[group]}</h3>
        <dl>${rows}</dl>
      </section>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div class="scrim" role="presentation" @click=${this.onScrimClick}>
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-label=${strings.shortcuts.title}
        >
          <header>
            <div>
              <span class="eyebrow">${strings.shortcuts.eyebrow}</span>
              <h2>${strings.shortcuts.title}</h2>
            </div>
            <button
              class="icon-button"
              aria-label=${strings.common.close}
              @click=${this.close}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          ${GROUP_ORDER.map((group) => this.renderGroup(group))}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-shortcuts-dialog": OdsShortcutsDialog;
  }
}
