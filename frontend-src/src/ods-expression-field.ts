import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { emit } from "./events";
import { isExpressionValue } from "./expressions";
import { strings } from "./strings";
import { baseStyles } from "./studio-styles";

const EMPTY_EXPRESSION = "{{  }}";

/**
 * Wraps the control for one field with the `{}` toggle. While the field holds a
 * literal the slotted control shows; while it holds an expression a textarea does.
 * It reports intent only; its owner changes the item.
 */
@customElement("ods-expression-field")
export class OdsExpressionField extends LitElement {
  static styles = [
    baseStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 24px;
        gap: 4px;
        align-items: end;
      }
      .expression {
        display: grid;
        gap: 5px;
        min-width: 0;
        color: var(--studio-muted);
        font-size: 10px;
      }
      textarea {
        width: 100%;
        min-height: 28px;
        padding: 6px 8px;
        border: 1px solid var(--primary-color);
        border-radius: 7px;
        background: var(--secondary-background-color, #f3f5f6);
        color: var(--studio-text);
        font-family: var(--code-font-family, monospace);
        font-size: 12px;
        line-height: 1.4;
        resize: none;
        overflow: hidden;
      }
      textarea:disabled {
        opacity: 0.55;
      }
      .toggle {
        width: 24px;
        height: 24px;
        margin-bottom: 2px;
        padding: 0;
        border: 1px solid var(--studio-border);
        border-radius: 6px;
        background: transparent;
        color: var(--studio-muted);
        font-family: var(--code-font-family, monospace);
        font-size: 11px;
        font-weight: 700;
      }
      .toggle[aria-pressed="true"] {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
      .toggle:disabled {
        opacity: 0.55;
        cursor: default;
      }
    `,
  ];

  @property() public label = "";
  @property() public fieldKey = "";
  /** The expression, or undefined while the field holds its literal. */
  @property() public expression?: string;
  @property({ type: Boolean }) public disabled = false;

  @query("textarea") private editor?: HTMLTextAreaElement;
  private focusEditor = false;

  protected updated(): void {
    this.fitEditor();
    if (this.focusEditor && this.editor) {
      this.focusEditor = false;
      this.editor.focus();
      const inside = this.editor.value.length - 3;
      this.editor.setSelectionRange(inside, inside);
    }
  }

  private fitEditor(): void {
    if (!this.editor) return;
    this.editor.style.height = "auto";
    this.editor.style.height = `${this.editor.scrollHeight}px`;
  }

  private change(template: string | null | undefined): void {
    emit(this, "expression-change", { key: this.fieldKey, template });
  }

  private toggle(): void {
    this.change(this.expression === undefined ? undefined : null);
  }

  /** Typing a brace into the literal control starts an expression. */
  private onLiteralInput(event: Event): void {
    const target = event.composedPath()[0];
    if (
      target instanceof HTMLInputElement &&
      target.type === "text" &&
      target.value.trimStart().startsWith("{")
    ) {
      this.focusEditor = true;
      this.change(EMPTY_EXPRESSION);
    }
  }

  /** Commit on blur; a text without delimiters is a literal again. */
  private onEditorChange(event: Event): void {
    if (!(event.target instanceof HTMLTextAreaElement)) return;
    const text = event.target.value;
    this.change(isExpressionValue(text) ? text : null);
  }

  private renderEditor(expression: string): TemplateResult {
    return html`
      <label class="expression">
        <span>${this.label}</span>
        <textarea
          data-expression=${this.fieldKey}
          aria-label=${this.label}
          placeholder=${strings.expression.placeholder}
          rows="1"
          spellcheck="false"
          .value=${expression}
          .disabled=${this.disabled}
          @input=${this.fitEditor}
          @change=${this.onEditorChange}
        ></textarea>
      </label>
    `;
  }

  protected render(): TemplateResult {
    const active = this.expression !== undefined;
    return html`
      <div class="row" @input=${active ? nothing : this.onLiteralInput}>
        ${
          this.expression === undefined
            ? html`
                <slot></slot>
              `
            : this.renderEditor(this.expression)
        }
        <button
          type="button"
          class="toggle"
          data-toggle=${this.fieldKey}
          aria-pressed=${active ? "true" : "false"}
          aria-label=${strings.expression.toggleLabel(this.label)}
          title=${strings.expression.toggleTooltip}
          .disabled=${this.disabled}
          @click=${this.toggle}
        >
          {}
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ods-expression-field": OdsExpressionField;
  }
}
