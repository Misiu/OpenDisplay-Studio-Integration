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
  ha-icon { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 18px; height: 18px; color: currentColor; line-height: 1; }
  .shell { height: 100%; max-height: 100%; min-height: 0; display: flex; flex-direction: column; overflow: hidden; overflow-anchor: none; }
  .topbar { flex: none; height: calc(var(--header-height, 56px) + var(--safe-area-inset-top, 0px)); min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); align-items: center; gap: 14px; padding: var(--safe-area-inset-top, 0px) 14px 0; border-bottom: 1px solid var(--studio-border); background: var(--studio-surface); z-index: 5; }
  .editor-breadcrumb { min-width: 0; display: flex; align-items: center; gap: 8px; overflow: hidden; white-space: nowrap; }
  .studio-name { flex: none; font-size: 14px; letter-spacing: -.01em; }
  .breadcrumb-divider { flex: none; color: var(--studio-border); }
  .breadcrumb-link { flex: none; min-height: 30px; padding: 0 3px; border: 0; color: var(--studio-accent); background: transparent; font-size: 12px; font-weight: 600; }
  .breadcrumb-link:hover { text-decoration: underline; }
  .project-name { min-width: 80px; width: min(210px, 18vw); height: 32px; border: 1px solid transparent; border-radius: 7px; padding: 0 7px; background: transparent; font-size: 12px; font-weight: 600; text-overflow: ellipsis; }
  .project-name:hover, .project-name:focus { border-color: var(--studio-border); background: var(--secondary-background-color, #f3f5f6); outline: 0; }
  .view-switch { display: inline-flex; align-items: center; padding: 3px; border: 1px solid var(--studio-border); border-radius: 9px; background: var(--secondary-background-color, #f3f5f6); }
  .view-switch button { min-height: 30px; display: inline-flex; align-items: center; gap: 6px; padding: 0 12px; border: 0; border-radius: 6px; color: var(--studio-muted); background: transparent; font-size: 11px; font-weight: 700; }
  .view-switch button.active { color: var(--studio-text); background: var(--studio-surface); box-shadow: 0 1px 3px rgba(0,0,0,.12); }
  .view-switch ha-icon { width: 15px; height: 15px; --mdc-icon-size: 15px; }
  .editor-actions { min-width: 0; display: flex; justify-content: flex-end; align-items: center; gap: 4px; }
  .status { padding: 5px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .status.ready { color: #197438; background: #dff5e6; }
  .status.draft { color: #635b00; background: #f7efc3; }

  .dashboard-library { height: 100%; overflow: auto; padding: clamp(22px, 4vw, 48px); background: var(--primary-background-color, #f5f7f8); }
  .dashboard-library-header, .dashboard-library-tools, .dashboard-grid, .dashboard-library > ha-alert { width: min(1180px, 100%); margin-inline: auto; }
  .dashboard-library-header { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 24px; }
  .dashboard-library-header h1 { margin: 0; font-size: 25px; letter-spacing: -.025em; }
  .dashboard-library-header p { margin: 5px 0 0; color: var(--studio-muted); font-size: 12px; }
  .dashboard-new-button-label { display: inline-flex; align-items: center; justify-content: center; gap: 7px; line-height: 1; }
  .dashboard-new-button-label ha-icon { width: 17px; height: 17px; line-height: 1; --mdc-icon-size: 17px; }
  .dashboard-library-tools { display: grid; grid-template-columns: minmax(220px, 1fr) auto; gap: 10px; margin-bottom: 18px; }
  .dashboard-search, .dashboard-sort { min-height: 40px; display: flex; align-items: center; gap: 8px; padding: 0 12px; border: 1px solid var(--studio-border); border-radius: 10px; background: var(--studio-surface); }
  .dashboard-search ha-icon { width: 17px; color: var(--studio-muted); }
  .dashboard-search input { width: 100%; border: 0; outline: 0; background: transparent; }
  .dashboard-sort span { color: var(--studio-muted); font-size: 11px; }
  .dashboard-sort select { min-width: 130px; border: 0; outline: 0; background: transparent; font-size: 12px; }
  .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; align-items: stretch; }
  .dashboard-card, .dashboard-add-card { min-width: 0; min-height: 236px; padding: 0; border: 1px solid var(--studio-border); border-radius: 13px; text-align: start; background: var(--studio-surface); box-shadow: 0 1px 3px rgba(0,0,0,.06); }
  .dashboard-card { position: relative; display: grid; grid-template-rows: 150px auto; }
  .dashboard-card.menu-open { z-index: 20; }
  .dashboard-card:hover, .dashboard-card:focus-within, .dashboard-add-card:hover, .dashboard-add-card:focus-visible { border-color: color-mix(in srgb, var(--studio-accent) 55%, var(--studio-border)); box-shadow: 0 8px 24px rgba(0,0,0,.09); outline: 0; transform: translateY(-1px); }
  .dashboard-card-open { position: absolute; inset: 0; z-index: 1; padding: 0; border: 0; border-radius: inherit; background: transparent; }
  .dashboard-card-open:focus-visible { outline: 2px solid var(--studio-accent); outline-offset: 2px; }
  .dashboard-card-preview { position: relative; display: grid; place-items: center; overflow: hidden; padding: 23px; border-radius: 12px 12px 0 0; background: color-mix(in srgb, var(--primary-background-color, #f5f7f8) 70%, var(--studio-surface)); pointer-events: none; }
  .dashboard-miniature { position: relative; width: min(145px, 70%); max-height: 96px; overflow: hidden; border: 2px solid color-mix(in srgb, var(--dashboard-accent) 22%, var(--studio-border)); border-radius: 9px; box-shadow: 0 7px 18px rgba(0,0,0,.12); }
  .dashboard-miniature > span { position: absolute; display: block; border-radius: 99px; }
  .miniature-title { left: 12%; top: 25%; width: 25%; height: 4%; min-height: 3px; background: color-mix(in srgb, var(--studio-muted) 50%, transparent); }
  .miniature-accent { right: 12%; top: 25%; width: 5px; height: 5px; background: var(--dashboard-accent); }
  .miniature-line { left: 12%; bottom: 26%; width: 48%; height: 4%; min-height: 3px; background: color-mix(in srgb, var(--studio-muted) 28%, transparent); }
  .miniature-line.long { bottom: 39%; width: 72%; height: 13%; background: color-mix(in srgb, var(--dashboard-accent) 18%, var(--studio-surface)); }
  .dashboard-resolution { position: absolute; right: 11px; bottom: 8px; color: var(--studio-muted); font: 9px var(--code-font-family, monospace); }
  .dashboard-card-copy { min-width: 0; display: grid; align-content: start; gap: 7px; padding: 13px 15px 15px; border-radius: 0 0 12px 12px; pointer-events: none; }
  .dashboard-card-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .dashboard-card-title strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; }
  .dashboard-card-title .status { flex: none; padding: 3px 7px; font-size: 8px; }
  .dashboard-rename-input { position: relative; z-index: 7; min-width: 0; width: 100%; height: 28px; padding: 0 7px; border: 1px solid var(--studio-accent); border-radius: 6px; outline: 0; background: var(--secondary-background-color, #f3f5f6); font-size: 13px; font-weight: 700; pointer-events: auto; }
  .dashboard-card-meta { display: flex; align-items: center; gap: 7px; color: var(--studio-muted); font-size: 10px; }
  .dashboard-card-meta > span + span::before { content: '·'; margin-right: 7px; }
  .dashboard-card-copy small { color: var(--studio-muted); font-size: 10px; }
  .palette-dots { display: inline-flex; align-items: center; gap: 2px; }
  .palette-dots i { width: 8px; height: 8px; border: 1px solid color-mix(in srgb, var(--studio-text) 22%, transparent); border-radius: 50%; }
  .dashboard-menu-trigger { position: absolute; inset-block-start: 9px; inset-inline-end: 9px; z-index: 5; width: 32px; height: 32px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 8px; color: var(--studio-muted); background: color-mix(in srgb, var(--studio-surface) 90%, transparent); box-shadow: 0 1px 3px rgba(0,0,0,.08); opacity: 0; pointer-events: none; transition: opacity 120ms ease, color 120ms ease, background 120ms ease; }
  .dashboard-menu-trigger:hover, .dashboard-menu-trigger:focus-visible { color: var(--studio-text); background: var(--studio-surface); outline: 0; }
  .dashboard-card:hover .dashboard-menu-trigger, .dashboard-card:focus-within .dashboard-menu-trigger, .dashboard-card.menu-open .dashboard-menu-trigger { opacity: 1; pointer-events: auto; }
  .dashboard-menu-trigger ha-icon { width: 17px; height: 17px; --mdc-icon-size: 17px; }
  .dashboard-menu { position: absolute; inset-block-start: 45px; inset-inline-end: 9px; z-index: 8; width: 190px; padding: 5px; border: 1px solid var(--studio-border); border-radius: 10px; background: var(--studio-surface); box-shadow: 0 16px 36px rgba(0,0,0,.18); }
  .dashboard-menu button { width: 100%; min-height: 36px; display: grid; grid-template-columns: 20px minmax(0,1fr); align-items: center; gap: 8px; padding: 0 9px; border: 0; border-radius: 6px; text-align: start; color: var(--studio-text); background: transparent; font-size: 12px; }
  .dashboard-menu button:hover, .dashboard-menu button:focus-visible { outline: 0; background: var(--secondary-background-color, #f3f5f6); }
  .dashboard-menu button.delete { margin-top: 4px; border-top: 1px solid var(--studio-border); border-radius: 0 0 6px 6px; color: var(--error-color, #db4437); }
  .dashboard-menu ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
  .dashboard-add-card { display: grid; place-items: center; align-content: center; gap: 10px; border-style: dashed; color: var(--studio-muted); box-shadow: none; }
  .dashboard-add-card ha-icon { width: 38px; height: 38px; display: grid; place-items: center; padding: 9px; border-radius: 10px; color: var(--studio-accent); background: var(--studio-accent-soft); line-height: 1; --mdc-icon-size: 20px; }
  .dashboard-add-card strong { color: var(--studio-text); font-size: 13px; }
  .dashboard-no-results { min-height: 236px; display: grid; place-items: center; align-content: center; gap: 8px; color: var(--studio-muted); text-align: center; }
  .dashboard-no-results ha-icon { width: 30px; height: 30px; }
  .dashboard-no-results strong { color: var(--studio-text); }
  .dashboard-no-results span { font-size: 12px; }

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

  .workspace { min-width: 0; min-height: 0; display: grid; grid-template-rows: 42px minmax(0, 1fr); background: var(--primary-background-color, #f4f6f8); color: var(--studio-text); overflow: hidden; }
  .history-controls { flex: none; display: flex; align-items: center; gap: 2px; margin-inline-start: auto; }
  .history-controls button { width: 30px; height: 30px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--studio-muted); }
  .history-controls button:hover:not(:disabled) { color: var(--studio-text); background: var(--secondary-background-color, #eef1f4); }
  .history-controls button:disabled { cursor: default; opacity: .32; }
  .history-controls ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
  .workspace-meta { display: flex; align-items: center; gap: 16px; padding: 0 16px; border-bottom: 1px solid var(--studio-border); color: var(--studio-muted); background: var(--studio-surface); font: 11px var(--code-font-family, monospace); }
  .tool-toggle { display: inline-flex; flex: none; align-items: center; gap: 6px; min-height: 28px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 7px; background: var(--studio-surface); color: var(--studio-muted); font-size: 10px; line-height: 1; white-space: nowrap; }
  .tool-toggle ha-icon { width: 14px; height: 14px; --mdc-icon-size: 14px; }
  .tool-toggle.active { color: var(--studio-accent); border-color: color-mix(in srgb, var(--studio-accent) 65%, var(--studio-border)); background: var(--studio-accent-soft); }
  .zoom-readout { min-width: 42px; text-align: right; color: var(--studio-text); }
  .canvas-stage { position: relative; min-width: 0; min-height: 0; overflow: hidden; overflow-anchor: none; overscroll-behavior: contain; contain: layout paint; background-color: var(--secondary-background-color, #eef1f4); background-image: radial-gradient(circle, color-mix(in srgb, var(--studio-muted) 27%, transparent) .8px, transparent .9px); background-size: 18px 18px; }
  .canvas-stage.accepting-drop { box-shadow: inset 0 0 0 3px var(--studio-accent); }
  .catalog-drag-ghost { position: fixed; z-index: 1200; box-sizing: border-box; display: grid; grid-template-columns: 16px minmax(0, 1fr) 14px; align-items: center; gap: 5px; min-height: 34px; padding: 0 7px; border: 1px solid var(--studio-accent); border-radius: 8px; color: var(--primary-text-color, #182026); background: var(--studio-surface); box-shadow: 0 7px 18px rgba(0,0,0,.22); font-size: 11px; font-weight: 700; pointer-events: none; }
  .catalog-drag-ghost ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
  .catalog-drag-ghost .drag-type-icon, .catalog-drag-ghost .drag-add-icon { color: var(--studio-accent); }
  .canvas-viewport { position: absolute; left: 50%; top: 50%; transform-origin: center; overflow-anchor: none; }
  .canvas { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); background: #fff; box-shadow: 0 14px 38px rgba(28, 38, 48, .18); user-select: none; touch-action: none; overflow-anchor: none; }
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
  .zoom-controls { position: absolute; right: 16px; bottom: 14px; display: flex; align-items: center; padding: 4px; border: 1px solid var(--studio-border); border-radius: 9px; background: var(--studio-surface); box-shadow: 0 8px 24px rgba(28,38,48,.14); }
  .zoom-controls button { min-width: 34px; height: 30px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; color: var(--studio-muted); font-size: 11px; }
  .zoom-controls button:hover { color: var(--studio-text); background: var(--secondary-background-color, #eef1f4); }
  .zoom-controls button.active { color: #fff; background: var(--studio-accent); }

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
  .field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .number-field, .stack-field { display: grid; gap: 5px; min-width: 0; color: var(--studio-muted); font-size: 10px; }
  .number-field input, .stack-field select { width: 100%; min-width: 0; height: 36px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 7px; background: var(--secondary-background-color, #f3f5f6); color: var(--studio-text); }
  .number-field input:disabled { opacity: .55; }
  .section-body > .number-field { margin-top: 10px; }
  .field-grid + .field-grid, .field-grid + .stack-field, .stack-field + .field-grid { margin-top: 10px; }
  .field-help { color: var(--studio-muted); font-size: 10px; line-height: 1.45; }
  .danger-zone { padding: 12px 14px; border-bottom: 1px solid var(--studio-border); color: var(--error-color, #db4437); }
  .metrics { display: grid; grid-template-columns: 1fr auto; gap: 5px 12px; font: 10px var(--code-font-family, monospace); }
  .metrics strong { text-align: right; }

  .code-workspace { flex: 1; min-height: 0; overflow: auto; padding: clamp(18px, 3vw, 36px); background: var(--primary-background-color, #f5f7f8); }
  .code-panel { width: min(1080px, 100%); min-height: 100%; display: flex; flex-direction: column; gap: 12px; margin-inline: auto; padding: clamp(16px, 2vw, 24px); border: 1px solid var(--studio-border); border-radius: 12px; background: var(--studio-surface); box-shadow: 0 1px 3px rgba(0,0,0,.06); }
  .code-panel > header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .code-panel h1 { margin: 4px 0 0; font-size: 20px; }
  .code-panel p { margin: 5px 0 0; color: var(--studio-muted); font-size: 12px; }
  .code-panel textarea { flex: 1; min-height: 420px; width: 100%; resize: none; padding: 15px; border: 1px solid var(--studio-border); border-radius: 9px; outline: 0; color: #d9e4ee; background: #121a24; font: 12px/1.55 var(--code-font-family, monospace); white-space: pre; tab-size: 2; }
  .code-panel textarea:focus { border-color: var(--studio-accent); box-shadow: 0 0 0 1px var(--studio-accent); }
  .copy-status { min-height: 16px; color: var(--studio-muted); font-size: 11px; text-align: end; }

  .project-empty { position: relative; height: 100%; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--studio-accent) 12%, transparent), transparent 42%), var(--primary-background-color, #f5f7f8); }
  ha-dialog { --dialog-content-padding: 0; }
  .new-dashboard-content { display: grid; gap: 16px; padding: 18px 22px 22px; }
  .dashboard-settings-content { padding: 18px 22px 22px; }
  .dashboard-delete-content { padding: 8px 22px 22px; color: var(--studio-muted); font-size: 13px; line-height: 1.5; }
  .dashboard-delete-content p { margin: 0; }
  .dashboard-delete-content p + p { margin-top: 8px; }
  .dashboard-delete-content strong { color: var(--studio-text); }
  .form-label { color: var(--studio-muted); font-size: 11px; font-weight: 700; }
  .dashboard-source-options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
  .dashboard-source { min-width: 0; min-height: 64px; display: grid; grid-template-columns: 24px minmax(0,1fr); align-items: center; gap: 9px; padding: 9px 11px; border: 1px solid var(--studio-border); border-radius: 9px; text-align: start; background: var(--studio-surface); }
  .dashboard-source.selected { border-color: var(--studio-accent); box-shadow: inset 0 0 0 1px var(--studio-accent); background: var(--studio-accent-soft); }
  .dashboard-source:disabled { cursor: not-allowed; opacity: .52; }
  .dashboard-source ha-icon { color: var(--studio-accent); }
  .dashboard-source span { min-width: 0; display: grid; gap: 3px; }
  .dashboard-source strong { font-size: 12px; }
  .dashboard-source small { overflow: hidden; color: var(--studio-muted); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
  .new-dashboard-content ha-form { display: block; }
  .dialog-scrim { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(8, 15, 24, .62); backdrop-filter: blur(3px); }
  .dialog { width: min(560px, 100%); max-height: calc(100vh - 40px); overflow: auto; border-radius: 14px; background: var(--studio-surface); box-shadow: 0 24px 80px rgba(0,0,0,.35); }
  .dialog > header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 12px; }
  .dialog h2 { margin: 3px 0 0; font-size: 21px; }
  .confirm-dialog { width: min(430px, 100%); }
  .confirm-dialog > p { margin: 0; padding: 4px 20px 18px; color: var(--studio-muted); font-size: 13px; line-height: 1.5; }
  .confirm-dialog .confirm-delete { color: var(--error-color, #db4437); }
  .dialog footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--studio-border); }

  @media (hover: none) {
    .dashboard-menu-trigger { opacity: 1; pointer-events: auto; }
  }

  @media (max-width: 900px) {
    .topbar { height: auto; min-height: calc(var(--header-height, 56px) + var(--safe-area-inset-top, 0px)); grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'breadcrumb actions' 'switch switch'; gap: 5px 10px; padding: calc(var(--safe-area-inset-top, 0px) + 6px) 9px 6px; }
    .editor-breadcrumb { grid-area: breadcrumb; }
    .studio-name, .editor-actions .status { display: none; }
    .project-name { width: min(180px, 36vw); }
    .view-switch { grid-area: switch; justify-self: center; }
    .editor-actions { grid-area: actions; }
    .layout { grid-template-columns: minmax(0, 1fr) !important; }
    .toolbox, .inspector, .panel-rail { display: none; }
    .workspace-meta { gap: 8px; padding: 0 8px; }
    .workspace-meta > span:nth-child(2), .workspace-meta > span:nth-child(3) { display: none; }
    .zoom-controls { right: 8px; bottom: 8px; }
    .zoom-controls button:nth-of-type(2), .zoom-controls button:nth-of-type(4) { display: none; }
  }
  @media (max-width: 600px) {
    .dashboard-library { padding: 18px 12px; }
    .dashboard-library-header { align-items: flex-start; }
    .dashboard-library-tools { grid-template-columns: 1fr; }
    .dashboard-sort { justify-content: space-between; }
    .dashboard-grid { grid-template-columns: 1fr; }
    .dashboard-source-options { grid-template-columns: 1fr; }
    .breadcrumb-divider:first-of-type { display: none; }
    .editor-actions ha-button:first-of-type { display: none; }
    .code-workspace { padding: 10px; }
    .code-panel { padding: 13px; }
    .code-panel > header { align-items: stretch; flex-direction: column; }
  }
`
