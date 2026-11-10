import {
  css,
  html,
  LitElement,
  svg,
  type SVGTemplateResult,
  type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  displayShape,
  fitScale,
  inkView,
  type DisplayShape,
  type Size,
} from "./display-shape";
import { shortestTurn, TURN_DURATION_MS, turnAngleAt } from "./rotation-motion";
import { strings } from "./strings";
import type { Rotation } from "./types";

/** The field a display is drawn in when the owner does not say. */
const DEFAULT_BOX: Size = { width: 240, height: 92 };

/**
 * A drawing of a display in the proportions of its resolution and turned as it is set up: the
 * light and the button sit where they are on the housing, so a turned display shows. With
 * `turns` a change of `rotation` turns it: a lean back, a swing past, and a settle.
 */
@customElement("ods-display-preview")
export class OdsDisplayPreview extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    .housing {
      fill: #35383b;
    }
    .screen {
      stroke: color-mix(in srgb, var(--studio-text, #202124) 30%, transparent);
      stroke-width: 0.5;
    }
    .light {
      fill: #4fd1a5;
    }
    .button {
      fill: #8a9096;
    }
    .skeleton-title {
      fill: color-mix(in srgb, var(--studio-muted, #68727a) 50%, transparent);
    }
    .skeleton-line {
      fill: color-mix(in srgb, var(--studio-muted, #68727a) 28%, transparent);
    }
    .skeleton-block {
      fill: color-mix(
        in srgb,
        var(--display-accent, #202124) 18%,
        var(--studio-surface, #fff)
      );
    }
    .skeleton-accent {
      fill: var(--display-accent, #202124);
    }
  `;

  /** The canvas of the dashboard, so a quarter turn has already swapped them. */
  @property({ type: Number }) public width = 800;
  @property({ type: Number }) public height = 480;
  @property({ type: Number }) public rotation: Rotation = 0;
  @property() public background = "white";
  @property() public accent = "#202124";
  @property({ attribute: false }) public box: Size = DEFAULT_BOX;
  /** Whether a change of `rotation` is shown as a turn instead of a jump. */
  @property({ type: Boolean }) public turns = false;

  /** Where the display is turned to now, which is not `rotation` while it is moving. */
  @state() private angle = 0;
  /** Where the turn ends; it is not wrapped, so the display never turns the long way. */
  private target = 0;
  private frame = 0;

  connectedCallback(): void {
    super.connectedCallback();
    this.angle = this.rotation;
    this.target = this.rotation;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    cancelAnimationFrame(this.frame);
  }

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("rotation") && this.hasUpdated) {
      this.turnTo(this.rotation);
    }
  }

  private turnTo(rotation: Rotation): void {
    cancelAnimationFrame(this.frame);
    const from = this.angle;
    this.target += shortestTurn(this.target, rotation);
    if (!this.turns || prefersReducedMotion()) {
      this.angle = this.target;
      return;
    }
    const to = this.target;
    const started = performance.now();
    const step = (now: number): void => {
      const progress = (now - started) / TURN_DURATION_MS;
      this.angle = turnAngleAt(from, to, progress);
      if (progress < 1) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  /** The skeleton of a dashboard, drawn upright in the largest box the screen holds. */
  private renderSkeleton(view: Size): SVGTemplateResult {
    const left = -view.width / 2;
    const top = -view.height / 2;
    const barHeight = Math.max(3, view.height * 0.04);
    const barTop = top + view.height * 0.25;
    return svg`
      <rect
        class="skeleton-title"
        x=${left + view.width * 0.12}
        y=${barTop}
        width=${view.width * 0.25}
        height=${barHeight}
        rx=${barHeight / 2}
      ></rect>
      <circle
        class="skeleton-accent"
        cx=${left + view.width * 0.88 - 2.5}
        cy=${barTop + barHeight / 2}
        r="2.5"
      ></circle>
      <rect
        class="skeleton-block"
        x=${left + view.width * 0.12}
        y=${top + view.height * 0.48}
        width=${view.width * 0.72}
        height=${view.height * 0.13}
        rx=${view.height * 0.065}
      ></rect>
      <rect
        class="skeleton-line"
        x=${left + view.width * 0.12}
        y=${top + view.height * 0.7}
        width=${view.width * 0.48}
        height=${barHeight}
        rx=${barHeight / 2}
      ></rect>
    `;
  }

  private renderHousing(shape: DisplayShape): SVGTemplateResult {
    const { housing, screen, bezel } = shape;
    return svg`
      <rect
        class="housing"
        x=${-housing.width / 2}
        y=${-housing.height / 2}
        width=${housing.width}
        height=${housing.height}
        rx=${bezel * 1.6}
      ></rect>
      <rect
        class="screen"
        x=${-screen.width / 2}
        y=${-screen.height / 2}
        width=${screen.width}
        height=${screen.height}
        rx="1"
        fill=${this.background}
      ></rect>
      <circle
        class="light"
        cx=${-housing.width / 2 + bezel * 1.6}
        cy=${housing.height / 2 - bezel / 2}
        r=${bezel * 0.32}
      ></circle>
      <rect
        class="button"
        x=${housing.width / 2 - bezel * 7}
        y=${housing.height / 2 - bezel * 0.78}
        width=${bezel * 5}
        height=${bezel * 0.5}
        rx=${bezel * 0.25}
      ></rect>
    `;
  }

  protected render(): TemplateResult {
    const box = this.box;
    const shape = displayShape(
      { width: this.width, height: this.height, rotation: this.rotation },
      box
    );
    const scale = fitScale(shape.housing, this.angle, box);
    const view = inkView(shape.screen, this.angle);
    const size = strings.common.sizeInPixels(this.width, this.height);
    const label = `${size} · ${this.rotation}°`;
    const middle = `${box.width / 2} ${box.height / 2}`;
    const placement = `translate(${middle}) rotate(${this.angle}) scale(${scale})`;
    return html`
      <svg
        viewBox="0 0 ${box.width} ${box.height}"
        style="--display-accent: ${this.accent}"
        role="img"
        aria-label=${label}
      >
        <g transform=${placement}>
          ${this.renderHousing(shape)}
          <g transform="rotate(${-this.angle})">${this.renderSkeleton(view)}</g>
        </g>
      </svg>
    `;
  }
}

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

declare global {
  interface HTMLElementTagNameMap {
    "ods-display-preview": OdsDisplayPreview;
  }
}
