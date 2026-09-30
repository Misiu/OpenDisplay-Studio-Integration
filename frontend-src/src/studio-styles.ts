import { css } from "lit";

/** Reset and controls every element needs: each element has its own shadow root. */
export const baseStyles = css`
  * {
    box-sizing: border-box;
  }
  button,
  input,
  select {
    font: inherit;
    color: inherit;
  }
  button {
    cursor: pointer;
  }
  ha-icon {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: currentColor;
    line-height: 1;
  }
`;

/** Small pieces used by more than one element. */
export const chromeStyles = css`
  .status {
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .status.ready {
    color: #197438;
    background: #dff5e6;
  }
  .status.draft {
    color: #635b00;
    background: #f7efc3;
  }
  .eyebrow {
    display: block;
    color: var(--studio-muted);
    font: 700 9px/1.2 var(--code-font-family, monospace);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .icon-button {
    border: 0;
    border-radius: 7px;
    width: 34px;
    height: 34px;
    display: inline-grid;
    place-items: center;
    background: transparent;
    color: var(--studio-muted);
  }
  .icon-button:hover {
    background: var(--studio-accent-soft);
    color: var(--studio-accent);
  }
  .count {
    min-width: 22px;
    padding: 2px 6px;
    border-radius: 999px;
    text-align: center;
    background: var(--secondary-background-color, #eef1f2);
  }
  ha-dialog {
    --dialog-content-padding: 0;
  }
`;

/** The look shared by a dashboard card and the "add dashboard" tile next to it. */
export const tileStyles = css`
  .dashboard-card,
  .dashboard-add-card {
    min-width: 0;
    min-height: 236px;
    padding: 0;
    border: 1px solid var(--studio-border);
    border-radius: 13px;
    text-align: start;
    background: var(--studio-surface);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }
  .dashboard-card:hover,
  .dashboard-card:focus-within,
  .dashboard-add-card:hover,
  .dashboard-add-card:focus-visible {
    border-color: color-mix(
      in srgb,
      var(--studio-accent) 55%,
      var(--studio-border)
    );
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
    outline: 0;
    transform: translateY(-1px);
  }
`;
