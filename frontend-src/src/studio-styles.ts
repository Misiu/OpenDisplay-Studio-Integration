import { css } from 'lit'

/** Reset and controls every element needs: each element has its own shadow root. */
export const baseStyles = css`
  * { box-sizing: border-box; }
  button, input, select { font: inherit; color: inherit; }
  button { cursor: pointer; }
  ha-icon { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 18px; height: 18px; color: currentColor; line-height: 1; }
`

/** Small pieces used by more than one element. */
export const chromeStyles = css`
  .status { padding: 5px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .status.ready { color: #197438; background: #dff5e6; }
  .status.draft { color: #635b00; background: #f7efc3; }
  .eyebrow { display: block; color: var(--studio-muted); font: 700 9px/1.2 var(--code-font-family, monospace); letter-spacing: .14em; text-transform: uppercase; }
  .icon-button { border: 0; border-radius: 7px; width: 34px; height: 34px; display: inline-grid; place-items: center; background: transparent; color: var(--studio-muted); }
  .icon-button:hover { background: var(--studio-accent-soft); color: var(--studio-accent); }
  .count { min-width: 22px; padding: 2px 6px; border-radius: 999px; text-align: center; background: var(--secondary-background-color, #eef1f2); }
  ha-dialog { --dialog-content-padding: 0; }
`
