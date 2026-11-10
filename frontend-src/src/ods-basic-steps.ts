import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { emit } from "./events";
import type { BasicStep } from "./events";
import { strings } from "./strings";
import { baseStyles, chromeStyles, fieldStyles } from "./studio-styles";

/** The two tabs of the basic editor: draw the regions, then put widgets into them. */
@customElement("ods-basic-steps")
export class OdsBasicSteps extends LitElement {
  static styles = [
    baseStyles,
    chromeStyles,
    fieldStyles,
    css`
      :host {
        display: block;
        padding: var(--ha-space-2, 8px) 9px;
        border-inline-end: 1px solid var(--studio-border);
        border-bottom: 1px solid var(--studio-border);
        background: var(--studio-surface);
      }
      .segmented {
        height: 32px;
      }
      .segmented button {
        font-size: 12px;
      }
      .segmented button[aria-pressed="true"] {
        background: var(--studio-accent);
      }
    `,
  ];

  @property() public step: BasicStep = "layout";

  private renderStep(step: BasicStep, label: string): TemplateResult {
    return html`
      <button
        type="button"
        aria-pressed=${this.step === step ? "true" : "false"}
        @click=${() => emit(this, "basic-step-change", { step })}
      >
        ${label}
      </button>
    `;
  }

  protected render(): TemplateResult {
    return html`
      <div
        class="segmented"
        role="group"
        aria-label=${strings.basic.stepsLabel}
      >
        ${this.renderStep("layout", strings.basic.stepLayout)}
        ${this.renderStep("widgets", strings.basic.stepWidgets)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-basic-steps": OdsBasicSteps;
  }
}
