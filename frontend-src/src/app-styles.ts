import { css } from 'lit'

export const appStyles = css`
  :host {
    --studio-accent: var(--primary-color, #03a9f4);
    --studio-accent-soft: color-mix(in srgb, var(--studio-accent) 14%, transparent);
    --studio-border: var(--divider-color, #d5dadd);
    --studio-surface: var(--card-background-color, #fff);
    --studio-text: var(--primary-text-color, #202124);
    --studio-muted: var(--secondary-text-color, #68727a);
    display: block; width: 100%; height: 100vh; height: 100dvh; max-height: 100vh; max-height: 100dvh; min-height: 0; color: var(--studio-text); background: var(--primary-background-color, #f5f7f8); font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif); overflow: hidden; overflow-anchor: none; contain: size layout paint;
  }
  * { box-sizing: border-box; }
  button, input, select { font: inherit; color: inherit; }
  button { cursor: pointer; }
  ha-icon { display: inline-flex; flex: none; width: 18px; height: 18px; color: currentColor; }
  .shell { height: 100%; max-height: 100%; min-height: 0; display: flex; flex-direction: column; overflow: hidden; overflow-anchor: none; }
  .topbar { flex: none; height: calc(var(--header-height, 56px) + var(--safe-area-inset-top, 0px)); min-height: 0; display: flex; align-items: center; gap: 12px; padding: var(--safe-area-inset-top, 0px) 16px 0; border-bottom: 1px solid var(--studio-border); background: var(--studio-surface); z-index: 5; }
  .brand { display: grid; min-width: 240px; margin-right: auto; }
  .brand strong { font-size: 15px; letter-spacing: -.01em; }
  .brand span { color: var(--studio-muted); font: 11px/1.4 var(--code-font-family, monospace); }
  .project-name { width: min(230px, 20vw); min-height: 38px; border: 1px solid var(--studio-border); border-radius: 9px; padding: 0 11px; background: var(--studio-surface); }
  .status { padding: 5px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .status.ready { color: #197438; background: #dff5e6; }
  .status.draft { color: #635b00; background: #f7efc3; }
  .actions { display: flex; align-items: center; gap: 4px; }
  .layout { flex: 1; min-height: 0; display: grid; grid-template-columns: var(--toolbox-width) minmax(0, 1fr) var(--inspector-width); overflow: hidden; }
  .panel { position: relative; min-width: 0; min-height: 0; background: var(--studio-surface); }
  .toolbox { border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; overflow: hidden; }
  .panel-title, .layers > header { min-height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 11px 12px; }
  .panel-title h2, .layers h2 { margin: 1px 0 0; font-size: 15px; }
  .eyebrow { display: block; color: var(--studio-muted); font: 700 9px/1.2 var(--code-font-family, monospace); letter-spacing: .14em; text-transform: uppercase; }
  .icon-button { border: 0; border-radius: 7px; width: 34px; height: 34px; display: inline-grid; place-items: center; background: transparent; color: var(--studio-muted); }
  .icon-button:hover { background: var(--studio-accent-soft); color: var(--studio-accent); }
  .search { margin: 0 10px 10px 9px; min-height: 30px; display: flex; align-items: center; gap: 7px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 8px; background: var(--secondary-background-color, #f3f5f6); }
  .search ha-icon { width: 17px; }
  .search input { width: 100%; border: 0; outline: 0; background: transparent; font-size: 13px; }
  .catalog-scroll { flex: 1; min-height: 0; overflow: auto; padding: 0 9px 16px; }
  .catalog-section { margin-top: 8px; }
  .catalog-section > header { display: flex; justify-content: space-between; align-items: center; padding: 7px 2px; color: var(--studio-muted); font: 700 10px var(--code-font-family, monospace); letter-spacing: .11em; text-transform: uppercase; }
  .catalog-section > header span:last-child, .count { min-width: 22px; padding: 2px 6px; border-radius: 999px; text-align: center; background: var(--secondary-background-color, #eef1f2); }
  .catalog-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .catalog-item { min-height: 34px; display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 8px; align-items: center; padding: 0 10px; text-align: start; border: 1px solid var(--studio-border); border-radius: 8px; background: var(--studio-surface); cursor: grab; touch-action: none; user-select: none; }
  .catalog-item:hover { border-color: var(--studio-accent); background: var(--studio-accent-soft); transform: translateY(-1px); }
  .catalog-item:active { cursor: grabbing; }
  .catalog-item ha-icon { width: 16px; height: 16px; color: var(--studio-accent); --mdc-icon-size: 16px; }
  .catalog-item strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; line-height: 1.2; }
  .catalog-item small { display: none; }
  .empty-result, .empty-layers { grid-column: 1 / -1; margin: 10px 2px; color: var(--studio-muted); font-size: 12px; line-height: 1.45; }
  .panel-rail { border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 12px; padding: 10px 6px; }
  .right-rail { border-right: 0; border-left: 1px solid var(--studio-border); }
  .rail-label { writing-mode: vertical-rl; color: var(--studio-muted); font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }

  .workspace { min-width: 0; min-height: 0; display: grid; grid-template-rows: 42px 42px minmax(0, 1fr); background: #182230; color: #e7edf4; overflow: hidden; }
  .dashboard-tabs { display: flex; min-width: 0; align-items: stretch; gap: 1px; padding: 0 10px; background: #0c1420; border-bottom: 1px solid #2a3748; overflow-x: auto; }
  .dashboard-tab, .add-tab { position: relative; display: flex; align-items: center; gap: 7px; padding: 0 12px; border: 0; background: transparent; color: #9caabd; white-space: nowrap; font-size: 12px; }
  .dashboard-tab ha-icon, .add-tab ha-icon { width: 16px; height: 16px; }
  .dashboard-tab.active { color: #fff; }
  .dashboard-tab.active::after { content: ''; position: absolute; left: 8px; right: 8px; bottom: 0; height: 2px; background: var(--studio-accent); }
  .dashboard-tab i { width: 6px; height: 6px; border-radius: 50%; background: #8c96a3; }
  .dashboard-tab i.ready { background: #50d17d; }
  .add-tab { color: var(--studio-accent); }
  .tab-spacer { flex: 1 1 auto; min-width: 12px; }
  .history-controls { flex: none; display: flex; align-items: center; gap: 2px; padding: 5px 0; }
  .history-controls button { width: 30px; height: 30px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 6px; background: transparent; color: #9caabd; }
  .history-controls button:hover:not(:disabled) { color: #fff; background: #1b2a3c; }
  .history-controls button:disabled { cursor: default; opacity: .32; }
  .history-controls ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
  .workspace-meta { display: flex; align-items: center; gap: 16px; padding: 0 16px; border-bottom: 1px solid #2a3748; color: #a9b5c5; font: 11px var(--code-font-family, monospace); }
  .workspace-meta > span:nth-child(2) { margin-left: auto; }
  .tool-toggle { display: inline-flex; flex: none; align-items: center; gap: 6px; min-height: 28px; padding: 0 9px; border: 1px solid #344459; border-radius: 7px; background: #111b28; color: #9eacc0; font-size: 10px; line-height: 1; white-space: nowrap; }
  .tool-toggle ha-icon { width: 14px; height: 14px; --mdc-icon-size: 14px; }
  .tool-toggle.active { color: #8bd9ff; border-color: #2788b8; background: #102b3a; }
  .zoom-readout { min-width: 42px; text-align: right; color: #fff; }
  .canvas-stage { position: relative; min-width: 0; min-height: 0; overflow: hidden; overflow-anchor: none; overscroll-behavior: contain; contain: layout paint; background-color: #202c3b; background-image: radial-gradient(circle, #3b495a 1px, transparent 1px); background-size: 18px 18px; }
  .canvas-stage.accepting-drop { box-shadow: inset 0 0 0 3px var(--studio-accent); }
  .catalog-drag-ghost { position: fixed; z-index: 1200; box-sizing: border-box; display: grid; grid-template-columns: 16px minmax(0, 1fr) 14px; align-items: center; gap: 5px; min-height: 34px; padding: 0 7px; border: 1px solid var(--studio-accent); border-radius: 8px; color: var(--primary-text-color, #182026); background: var(--studio-surface); box-shadow: 0 7px 18px rgba(0,0,0,.22); font-size: 11px; font-weight: 700; pointer-events: none; }
  .catalog-drag-ghost ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
  .catalog-drag-ghost .drag-type-icon, .catalog-drag-ghost .drag-add-icon { color: var(--studio-accent); }
  .canvas-viewport { position: absolute; left: 50%; top: 50%; transform-origin: center; overflow-anchor: none; }
  .canvas { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: #fff; box-shadow: 0 16px 46px rgba(0, 0, 0, .35); user-select: none; touch-action: none; overflow-anchor: none; }
  .canvas > img, .canvas-placeholder { position: absolute; inset: 0; display: block; width: 100%; height: 100%; }
  .canvas-placeholder { display: grid; place-items: center; color: #59636b; background: #fff; }
  .working-area { position: absolute; pointer-events: none; z-index: 2; border: 1px dashed rgba(3, 169, 244, .72); background-image: radial-gradient(circle, rgba(3, 169, 244, .22) .7px, transparent .8px); background-size: max(12px, var(--snap-size)) max(12px, var(--snap-size)); }
  .selection { position: absolute; z-index: 3; min-width: 3px; min-height: 3px; border: 1px solid transparent; cursor: move; touch-action: none; }
  .selection:hover { border-color: rgba(3, 169, 244, .65); }
  .selection.selected { border: 2px solid #00aef0; box-shadow: 0 0 0 1px rgba(255,255,255,.9); }
  .selection.locked { cursor: default; border-style: dashed; }
  .selection.hidden { background: rgba(3, 169, 244, .09); border: 1px dashed rgba(3, 169, 244, .75); }
  .locked-notice { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 8px 12px; padding: 7px 9px; border: 1px solid color-mix(in srgb, var(--warning-color, #ffa600) 45%, var(--studio-border)); border-radius: 7px; background: color-mix(in srgb, var(--warning-color, #ffa600) 10%, var(--studio-surface)); font-size: 11px; }
  .locked-notice span { display: inline-flex; align-items: center; gap: 6px; }
  .locked-notice ha-icon { width: 15px; height: 15px; --mdc-icon-size: 15px; }
  .locked-notice button { min-height: 26px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 6px; color: var(--primary-text-color); background: var(--studio-surface); font-size: 11px; font-weight: 700; cursor: pointer; }
  .hidden-label { position: absolute; left: 3px; top: 3px; color: #006d99; background: rgba(255,255,255,.9); padding: 1px 4px; font-size: 8px; }
  .lock-badge { position: absolute; right: 2px; top: 2px; width: 15px; height: 15px; padding: 2px; color: #fff; background: #283746; border-radius: 3px; }
  .resize-handle { position: absolute; z-index: 7; width: 11px; height: 11px; padding: 0; border: 2px solid #00aef0; border-radius: 1px; background: #fff; box-shadow: 0 0 0 1px rgba(255,255,255,.85); touch-action: none; }
  .resize-nw { left: 0; top: 0; transform: translate(-50%, -50%); cursor: nwse-resize; }
  .resize-n { left: 50%; top: 0; transform: translate(-50%, -50%); cursor: ns-resize; }
  .resize-ne { right: 0; top: 0; transform: translate(50%, -50%); cursor: nesw-resize; }
  .resize-e { right: 0; top: 50%; transform: translate(50%, -50%); cursor: ew-resize; }
  .resize-se { right: 0; bottom: 0; transform: translate(50%, 50%); cursor: nwse-resize; }
  .resize-s { left: 50%; bottom: 0; transform: translate(-50%, 50%); cursor: ns-resize; }
  .resize-sw { left: 0; bottom: 0; transform: translate(-50%, 50%); cursor: nesw-resize; }
  .resize-w { left: 0; top: 50%; transform: translate(-50%, -50%); cursor: ew-resize; }
  .selection-size { position: absolute; z-index: 6; left: 50%; top: calc(100% + 9px); transform: translateX(-50%); min-width: max-content; padding: 2px 7px; border: 1px solid #2788b8; border-radius: 999px; color: #9cddff; background: #102033; box-shadow: 0 2px 6px rgba(0,0,0,.28); font: 700 10px/1.2 var(--code-font-family, monospace); white-space: nowrap; pointer-events: none; }
  .zoom-controls { position: absolute; right: 16px; bottom: 14px; display: flex; align-items: center; padding: 4px; border: 1px solid #354459; border-radius: 9px; background: #101927; box-shadow: 0 8px 24px rgba(0,0,0,.28); }
  .zoom-controls button { min-width: 34px; height: 30px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; color: #aeb9c7; font-size: 11px; }
  .zoom-controls button:hover, .zoom-controls button.active { color: #fff; background: #1976d2; }

  .inspector { min-width: 0; border-left: 1px solid var(--studio-border); display: flex; flex-direction: column; overflow: hidden; overflow-anchor: none; }
  .panel-resizer { position: absolute; left: -4px; top: 0; bottom: 0; width: 8px; cursor: ew-resize; z-index: 6; }
  .panel-resizer:hover { background: color-mix(in srgb, var(--studio-accent) 30%, transparent); }
  .layers { min-height: 150px; flex: 0 0 clamp(176px, 27%, 250px); display: flex; flex-direction: column; border-bottom: 1px solid var(--studio-border); overflow-anchor: none; }
  .layers > header { min-height: 48px; padding: 7px 8px 7px 11px; }
  .layers-header-actions { display: flex; align-items: center; gap: 3px; }
  .layer-list { min-height: 0; flex: 1; overflow: auto; padding: 0 6px 8px; }
  .layer-row { position: relative; display: grid; grid-template-columns: 24px 18px minmax(0,1fr) auto; align-items: center; min-height: 34px; gap: 4px; padding: 2px 3px; border: 1px solid transparent; border-radius: 5px; }
  .layer-row:hover { background: var(--secondary-background-color, #f3f5f6); }
  .layer-row.active { color: var(--studio-accent); border-color: color-mix(in srgb, var(--studio-accent) 45%, var(--studio-border)); background: var(--studio-accent-soft); }
  .layer-row.is-hidden > span { opacity: .5; }
  .layer-row.dragging { opacity: .42; }
  .layer-row.drop-before::before, .layer-row.drop-after::after { content: ''; position: absolute; left: 2px; right: 2px; z-index: 4; height: 2px; border-radius: 2px; background: var(--studio-accent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--studio-accent) 22%, transparent); pointer-events: none; }
  .layer-row.drop-before::before { top: -2px; }
  .layer-row.drop-after::after { bottom: -2px; }
  .layer-row .drag { width: 24px; height: 28px; color: var(--studio-muted); cursor: grab; touch-action: none; }
  .layer-row .drag:active { cursor: grabbing; }
  .layer-row .layer-type-icon { width: 16px; height: 16px; color: var(--studio-accent); --mdc-icon-size: 16px; }
  .layer-row > span { min-width: 0; display: grid; }
  .layer-row strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; line-height: 1.2; }
  .layer-row small { color: var(--studio-muted); font-size: 8px; line-height: 1.15; text-transform: capitalize; }
  .layer-actions { display: flex; align-items: center; gap: 1px; opacity: 0; pointer-events: none; transition: opacity 100ms ease; }
  .layer-row:hover .layer-actions, .layer-row:focus-within .layer-actions, .layer-row.active .layer-actions { opacity: 1; pointer-events: auto; }
  .layer-row button { display: grid; place-items: center; width: 27px; height: 27px; padding: 0; border: 0; border-radius: 5px; background: transparent; color: var(--studio-muted); }
  .layer-row button:hover { color: var(--studio-text); background: color-mix(in srgb, var(--studio-text) 8%, transparent); }
  .layer-row button.delete:hover { color: var(--error-color, #db4437); }
  .layer-row button ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
  .properties { min-height: 0; flex: 1 1 auto; overflow: auto; overflow-anchor: none; overscroll-behavior: contain; }
  .inspector-title { min-height: 58px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 7px; padding: 8px 12px; border-bottom: 1px solid var(--studio-border); }
  .inspector-title > ha-icon { color: var(--studio-accent); }
  .inspector-title h2 { margin: 0; font-size: 15px; }
  .inspector-title p { margin: 3px 0 0; color: var(--studio-muted); font-size: 10px; }
  .inspector-section { border-bottom: 1px solid var(--studio-border); }
  .inspector-section > summary { padding: 12px 14px; cursor: pointer; list-style-position: inside; color: var(--studio-muted); font: 700 10px var(--code-font-family, monospace); letter-spacing: .09em; text-transform: uppercase; }
  .section-body { padding: 2px 14px 14px; }
  .field-grid, .dialog-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .number-field, .stack-field, .dialog label { display: grid; gap: 5px; min-width: 0; color: var(--studio-muted); font-size: 10px; }
  .number-field input, .stack-field select, .dialog input, .dialog select { width: 100%; min-width: 0; height: 36px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 7px; background: var(--secondary-background-color, #f3f5f6); color: var(--studio-text); }
  .number-field input:disabled { opacity: .55; }
  .section-body > .number-field { margin-top: 10px; }
  .field-grid + .field-grid, .field-grid + .stack-field, .stack-field + .field-grid { margin-top: 10px; }
  .field-help { color: var(--studio-muted); font-size: 10px; line-height: 1.45; }
  .danger-zone { padding: 12px 14px; border-bottom: 1px solid var(--studio-border); color: var(--error-color, #db4437); }
  .metrics { display: grid; grid-template-columns: 1fr auto; gap: 5px 12px; font: 10px var(--code-font-family, monospace); }
  .metrics strong { text-align: right; }
  .yaml-actions { display: flex; align-items: center; gap: 8px; padding: 0 10px 8px; }
  .yaml-actions output { color: var(--studio-muted); font-size: 10px; }
  .yaml pre { max-height: 280px; margin: 0; padding: 12px; overflow: auto; background: #121a24; color: #d9e4ee; font: 10px/1.45 var(--code-font-family, monospace); white-space: pre; }

  .project-empty { position: relative; height: 100%; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--studio-accent) 12%, transparent), transparent 42%), var(--primary-background-color, #f5f7f8); }
  .empty-card { width: min(460px, 100%); padding: 38px; border: 1px solid var(--studio-border); border-radius: 16px; text-align: center; background: var(--studio-surface); box-shadow: 0 18px 60px rgba(0,0,0,.1); }
  .empty-card > ha-icon { width: 50px; height: 50px; color: var(--studio-accent); }
  .empty-card h1 { margin: 9px 0; font-size: 27px; }
  .empty-card p { margin: 0 auto 22px; color: var(--studio-muted); line-height: 1.55; }
  .dialog-scrim { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(8, 15, 24, .62); backdrop-filter: blur(3px); }
  .dialog { width: min(560px, 100%); max-height: calc(100vh - 40px); overflow: auto; border-radius: 14px; background: var(--studio-surface); box-shadow: 0 24px 80px rgba(0,0,0,.35); }
  .dialog > header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 12px; }
  .dialog h2 { margin: 3px 0 0; font-size: 21px; }
  .confirm-dialog { width: min(430px, 100%); }
  .confirm-dialog > p { margin: 0; padding: 4px 20px 18px; color: var(--studio-muted); font-size: 13px; line-height: 1.5; }
  .confirm-dialog .confirm-delete { color: var(--error-color, #db4437); }
  .dialog-grid { padding: 10px 20px 20px; }
  .dialog-grid .wide { grid-column: 1 / -1; }
  .dialog footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--studio-border); }

  @media (max-width: 900px) {
    .brand span, .status { display: none; }
    .topbar { height: auto; min-height: calc(var(--header-height, 56px) + var(--safe-area-inset-top, 0px)); display: grid; grid-template-columns: minmax(0, 1fr); align-content: start; gap: 7px; padding: calc(var(--safe-area-inset-top, 0px) + 7px) 10px 7px; }
    .brand { min-width: 0; margin: 0; }
    .project-name { width: 100%; }
    .actions { width: 100%; overflow-x: auto; padding-bottom: 1px; }
    .layout { grid-template-columns: minmax(0, 1fr) !important; }
    .toolbox, .inspector, .panel-rail { display: none; }
    .workspace-meta { gap: 8px; padding: 0 8px; }
    .workspace-meta > span:nth-child(2), .workspace-meta > span:nth-child(3) { display: none; }
    .zoom-controls { right: 8px; bottom: 8px; }
    .zoom-controls button:nth-of-type(2), .zoom-controls button:nth-of-type(4) { display: none; }
  }
`
