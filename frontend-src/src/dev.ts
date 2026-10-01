import "./index.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./ods-app";
import { createId } from "./ids";
import { loadPrimitiveDefinitions } from "./primitive-definitions";
import { primitiveBounds } from "./primitive-shape";
import { createPrimitive } from "./primitives";
import { allItems } from "./tree";
import { optionDefaults } from "./widget-fields";
import { loadWidgetDefinitions } from "./widget-definitions";
import type {
  WidgetDefinition,
  WidgetLoadError,
  HomeAssistant,
  Dashboard,
  DisplayDevice,
  LeafItem,
  Primitive,
  PrimitiveItem,
  StudioItem,
} from "./types";

const primitiveDefinitions = loadPrimitiveDefinitions();

/** The OpenDisplay devices the harness pretends Home Assistant has set up. */
const DISPLAY_DEVICES: DisplayDevice[] = [
  {
    id: "hallway",
    name: "Hallway display",
    manufacturer: "Seeed Studio",
    model: '7.5" BWR',
    width: 800,
    height: 480,
    palette: "bwr",
    colors: ["black", "white", "red"],
  },
  {
    id: "kitchen",
    name: "Kitchen e-paper",
    manufacturer: "OpenDisplay",
    model: '2.9" MONO',
    width: 296,
    height: 128,
    palette: "bw",
    colors: ["black", "white"],
  },
];

/** A primitive as the panel creates it, with the given fields changed. */
const primitiveOf = (
  type: Primitive["type"],
  values: Record<string, unknown>
): Primitive => {
  const primitive = createPrimitive(
    primitiveDefinitions.find((definition) => definition.type === type),
    { x: 0, y: 0, displayWidth: 1280, displayHeight: 800 }
  );
  if (!primitive) throw new Error(`No definition for ${type}`);
  return Object.assign(primitive, values);
};

if (!customElements.get("ha-icon")) {
  customElements.define(
    "ha-icon",
    class extends HTMLElement {
      connectedCallback(): void {
        this.setAttribute("aria-hidden", "true");
        this.textContent =
          (
            {
              "mdi:thermometer": "♨",
              "mdi:format-text": "T",
              "mdi:rectangle-outline": "□",
              "mdi:vector-line": "╱",
              "mdi:circle-outline": "○",
              "mdi:ellipse-outline": "⬭",
              "mdi:star-outline": "☆",
              "mdi:qrcode": "▦",
              "mdi:progress-helper": "◒",
              "mdi:magnify": "⌕",
              "mdi:plus": "+",
              "mdi:plus-circle": "⊕",
              "mdi:dots-horizontal": "⋯",
              "mdi:pencil-outline": "✎",
              "mdi:monitor-cog": "⚙",
              "mdi:delete-outline": "×",
              "mdi:monitor-edit": "▣",
              "mdi:monitor": "▣",
              "mdi:devices": "▦",
              "mdi:tools": "⚒",
              "mdi:code-tags": "</>",
              "mdi:chevron-left": "‹",
              "mdi:chevron-right": "›",
              "mdi:content-copy": "⧉",
              "mdi:check": "✓",
              "mdi:alert-circle-outline": "!",
              "mdi:close": "×",
              "mdi:magnet": "∩",
              "mdi:lock": "●",
              "mdi:lock-open-variant-outline": "○",
              "mdi:eye-outline": "◉",
              "mdi:eye-off-outline": "⊘",
              "mdi:drag-vertical": "⋮",
              "mdi:undo": "↶",
              "mdi:redo": "↷",
            } as Record<string, string>
          )[this.getAttribute("icon") ?? ""] ?? "•";
      }
      set icon(value: string) {
        this.setAttribute("icon", value);
        this.connectedCallback();
      }
    }
  );
}

if (!customElements.get("ha-button")) {
  customElements.define(
    "ha-button",
    class extends HTMLElement {
      connectedCallback(): void {
        const disabled = this.hasAttribute("disabled");
        this.setAttribute("role", "button");
        this.setAttribute("aria-disabled", String(disabled));
        this.setAttribute("tabindex", disabled ? "-1" : "0");
        this.style.cssText =
          "display:inline-flex;align-items:center;min-height:38px;padding:0 14px;border:1px solid #8a949b;border-radius:20px;background:#fff;cursor:pointer;font:500 14px Roboto,sans-serif";
        this.style.opacity = disabled ? ".5" : "1";
      }
      set disabled(value: boolean) {
        this.toggleAttribute("disabled", value);
        this.setAttribute("aria-disabled", String(value));
        this.setAttribute("tabindex", value ? "-1" : "0");
        this.style.opacity = value ? ".5" : "1";
      }
    }
  );
}

if (!customElements.get("ha-alert")) {
  customElements.define(
    "ha-alert",
    class extends HTMLElement {
      connectedCallback(): void {
        this.style.cssText =
          "display:block;margin:8px;padding:10px;border-radius:8px;background:#fff3cd;color:#5d4800";
      }
    }
  );
}

const controlType = (isBoolean: boolean, isNumber: boolean): string => {
  if (isBoolean) {
    return "checkbox";
  }
  return isNumber ? "number" : "text";
};

const controlValue = (input: HTMLInputElement): boolean | number | string => {
  if (input.type === "checkbox") {
    return input.checked;
  }
  if (input.type === "number") {
    return Number(input.value);
  }
  return input.value;
};

interface DemoFormSchema {
  name?: string;
  label?: string;
  type?: string;
  title?: string;
  expanded?: boolean;
  disabled?: boolean;
  selector?: Record<string, unknown>;
  schema?: DemoFormSchema[];
}

if (!customElements.get("ha-form")) {
  customElements.define(
    "ha-form",
    class DemoForm extends HTMLElement {
      private formData: Record<string, unknown> = {};
      private formSchema: DemoFormSchema[] = [];
      private labelFor?: (entry: DemoFormSchema) => string;
      private openSections = new Set<string>();
      set hass(_value: unknown) {}
      set computeLabel(value: ((entry: DemoFormSchema) => string) | undefined) {
        this.labelFor = value;
        this.draw();
      }
      set data(value: Record<string, unknown>) {
        this.formData = value;
        this.draw();
      }
      set schema(value: DemoFormSchema[]) {
        this.formSchema = value;
        this.draw();
      }
      connectedCallback(): void {
        this.draw();
      }
      private draw(): void {
        if (!this.isConnected) return;
        const fragment = document.createDocumentFragment();
        this.renderFields(this.formSchema, fragment);
        this.replaceChildren(fragment);
      }
      private renderFields(
        schema: DemoFormSchema[],
        target: DocumentFragment | HTMLElement
      ): void {
        for (const entry of schema) {
          if (entry.type === "grid" && entry.schema) {
            const grid = document.createElement("div");
            grid.style.cssText =
              "display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px";
            this.renderFields(entry.schema, grid);
            target.append(grid);
          } else if (entry.type === "expandable" && entry.schema) {
            const details = document.createElement("details");
            const key = entry.name ?? entry.title ?? entry.label ?? "advanced";
            details.open =
              Boolean(entry.expanded) || this.openSections.has(key);
            details.style.cssText =
              "margin:4px 0 10px;border-top:1px solid #d8dde0;padding-top:10px";
            const summary = document.createElement("summary");
            summary.textContent =
              entry.title ??
              entry.label ??
              this.labelFor?.(entry) ??
              entry.name ??
              "Advanced";
            summary.style.cssText =
              "cursor:pointer;font:500 12px Roboto,sans-serif";
            details.append(summary);
            const content = document.createElement("div");
            content.style.cssText = "padding-top:12px";
            this.renderFields(entry.schema, content);
            details.append(content);
            details.addEventListener("toggle", () =>
              details.open
                ? this.openSections.add(key)
                : this.openSections.delete(key)
            );
            target.append(details);
          } else if (entry.name && entry.selector) {
            target.append(this.renderField(entry));
          }
        }
      }
      private renderField(field: DemoFormSchema): HTMLLabelElement {
        const name = field.name!;
        const selector = field.selector!;
        const fieldLabel = field.label ?? this.labelFor?.(field) ?? name;
        const label = document.createElement("label");
        label.style.cssText =
          "display:grid;gap:5px;margin:0 0 12px;font:500 12px Roboto,sans-serif";
        label.append(fieldLabel);
        const selectConfig = selector.select as
          | {
              options?: Array<string | { value: string; label?: string }>;
              multiple?: boolean;
            }
          | undefined;
        if (selectConfig) {
          label.append(this.renderSelect(field, selectConfig, fieldLabel));
          return label;
        }
        const textarea = this.renderTextArea(field, selector, fieldLabel);
        if (textarea) {
          label.append(textarea);
          return label;
        }
        const input = document.createElement("input");
        input.style.cssText =
          "height:38px;padding:0 9px;border:1px solid #aab2b8;border-radius:8px";
        input.setAttribute("aria-label", fieldLabel);
        const isBoolean = "boolean" in selector;
        const numberConfig = selector.number as
          { min?: number; max?: number; step?: number } | undefined;
        input.type = controlType(isBoolean, Boolean(numberConfig));
        input.disabled = Boolean(field.disabled);
        if (numberConfig) {
          if (numberConfig.min !== undefined) {
            input.min = String(numberConfig.min);
          }
          if (numberConfig.max !== undefined) {
            input.max = String(numberConfig.max);
          }
          if (numberConfig.step !== undefined) {
            input.step = String(numberConfig.step);
          }
        }
        const entityConfig = selector.entity as
          { multiple?: boolean } | undefined;
        const picksSeveral = Boolean(entityConfig?.multiple);
        const current = this.formData[name];
        if (isBoolean) input.checked = Boolean(current);
        else if (Array.isArray(current)) input.value = current.join(", ");
        else input.value = String(current ?? "");
        input.addEventListener(isBoolean ? "change" : "input", () =>
          this.updateValue(
            name,
            picksSeveral
              ? input.value
                  .split(",")
                  .map((id) => id.trim())
                  .filter(Boolean)
              : controlValue(input)
          )
        );
        label.append(input);
        return label;
      }
      private renderSelect(
        field: DemoFormSchema,
        config: {
          options?: Array<string | { value: string; label?: string }>;
          multiple?: boolean;
        },
        fieldLabel: string
      ): HTMLSelectElement {
        const name = field.name!;
        const select = document.createElement("select");
        select.style.cssText = `${config.multiple ? "" : "height:38px;"}padding:0 9px;border:1px solid #aab2b8;border-radius:8px`;
        select.setAttribute("aria-label", fieldLabel);
        select.disabled = Boolean(field.disabled);
        select.multiple = Boolean(config.multiple);
        for (const entry of config.options ?? []) {
          const option = document.createElement("option");
          option.value = typeof entry === "string" ? entry : entry.value;
          option.textContent =
            typeof entry === "string" ? entry : (entry.label ?? entry.value);
          select.append(option);
        }
        const current = this.formData[name];
        if (config.multiple) {
          for (const option of select.options) {
            option.selected =
              Array.isArray(current) && current.includes(option.value);
          }
        } else {
          select.value = String(current ?? "");
        }
        select.addEventListener("change", () =>
          this.updateValue(
            name,
            config.multiple
              ? [...select.selectedOptions].map((option) => option.value)
              : select.value
          )
        );
        return select;
      }
      /**
       * Home Assistant edits a multi-line text as it is and an object in its own
       * editor; the harness shows both as text, an object as JSON.
       */
      private renderTextArea(
        field: DemoFormSchema,
        selector: Record<string, unknown>,
        fieldLabel: string
      ): HTMLTextAreaElement | undefined {
        const name = field.name!;
        const isObject = "object" in selector;
        const text = selector.text as { multiline?: boolean } | undefined;
        if (!isObject && !text?.multiline) return undefined;
        const area = document.createElement("textarea");
        area.rows = 4;
        area.style.cssText =
          "padding:6px 9px;border:1px solid #aab2b8;border-radius:8px;font:12px monospace";
        area.setAttribute("aria-label", fieldLabel);
        area.disabled = Boolean(field.disabled);
        const current = this.formData[name];
        area.value = isObject
          ? JSON.stringify(current ?? {}, null, 2)
          : String(current ?? "");
        area.addEventListener("change", () => {
          if (!isObject) {
            this.updateValue(name, area.value);
            return;
          }
          try {
            this.updateValue(name, JSON.parse(area.value));
          } catch {
            // Not JSON yet: keep what was there, as the real editor does.
          }
        });
        return area;
      }
      private updateValue(name: string, value: unknown): void {
        this.formData = { ...this.formData, [name]: value };
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            bubbles: true,
            composed: true,
            detail: { value: this.formData },
          })
        );
      }
    }
  );
}

if (!customElements.get("ha-dialog")) {
  customElements.define(
    "ha-dialog",
    class extends HTMLElement {
      static get observedAttributes(): string[] {
        return ["header-title", "heading", "open"];
      }
      connectedCallback(): void {
        this.sync();
      }
      attributeChangedCallback(): void {
        this.sync();
      }
      set heading(value: string) {
        this.setAttribute("heading", value);
      }
      get heading(): string {
        return this.getAttribute("heading") ?? "";
      }
      set open(value: boolean) {
        this.toggleAttribute("open", value);
        this.sync();
      }
      get open(): boolean {
        return this.hasAttribute("open");
      }
      private sync(): void {
        this.setAttribute("role", "dialog");
        this.setAttribute("aria-modal", "true");
        const label = this.getAttribute("header-title") || this.heading;
        if (label) this.setAttribute("aria-label", label);
        this.hidden = !this.open;
        this.style.cssText =
          "position:fixed;inset:50% auto auto 50%;z-index:1000;display:block;width:min(560px,calc(100vw - 40px));max-height:calc(100vh - 40px);overflow:auto;transform:translate(-50%,-50%);border-radius:14px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.35)";
      }
    }
  );
}

if (!customElements.get("ha-dialog-footer")) {
  customElements.define(
    "ha-dialog-footer",
    class extends HTMLElement {
      connectedCallback(): void {
        this.style.cssText =
          "display:flex;justify-content:flex-end;gap:8px;padding:14px 20px;border-top:1px solid #d8dde0";
      }
    }
  );
}

const now = "2026-09-24T12:00:00+00:00";
const sensorCardDefinition = ((): WidgetDefinition => {
  const definition = loadWidgetDefinitions("en").find(
    (widget) => widget.id === "sensor-card"
  );
  if (!definition) throw new Error("The sensor-card package is missing");
  return definition;
})();

const demoDashboard: Dashboard = {
  id: "demo",
  schemaVersion: 1,
  name: "Kitchen display",
  status: "draft",
  language: "en",
  display: {
    profileId: "solum-7-5",
    width: 800,
    height: 480,
    palette: "bwr",
    background: "white",
    padding: 20,
    snapSize: 5,
    rotation: 0,
    deviceId: "hallway",
  },
  items: [
    {
      id: "temperature",
      name: "Kitchen",
      kind: "widget",
      locked: false,
      hidden: false,
      widget: {
        type: "sensor-card",
        version: "1.0.0",
        sources: { entities: [{ id: "sensor.kitchen_temperature" }] },
        options: optionDefaults(sensorCardDefinition),
      },
      frame: { x: 40, y: 40, width: 320, height: 180 },
      layout: { padding: 0 },
    },
  ],
  createdAt: now,
  updatedAt: now,
};

const hallwayDashboard: Dashboard = {
  id: "hallway",
  schemaVersion: 1,
  name: "Hallway overview",
  status: "ready",
  language: "en",
  display: {
    profileId: "custom",
    width: 1280,
    height: 800,
    palette: "spectra6",
    background: "white",
    padding: 0,
    snapSize: 5,
    rotation: 0,
    deviceId: null,
  },
  items: [
    {
      id: "reading",
      name: "Reading",
      kind: "primitive",
      locked: false,
      hidden: false,
      primitive: primitiveOf("text", {
        value: "21.4",
        x: 40,
        y: 40,
        size: 32,
        color: "black",
      }),
      expressions: { value: "{{ states('sensor.kitchen_temperature') }}" },
    },
    {
      id: "panel",
      name: "Panel",
      kind: "container",
      locked: false,
      hidden: false,
      x: 700,
      y: 100,
      width: 400,
      height: 300,
      grouped: false,
      background: { fill: "white", outline: "black", width: 2, radius: 0 },
      children: [
        {
          id: "chip",
          name: "Chip",
          kind: "primitive",
          locked: false,
          hidden: false,
          primitive: primitiveOf("rectangle", {
            x_start: 40,
            y_start: 40,
            x_end: 159,
            y_end: 99,
            fill: null,
            outline: "black",
            width: 2,
          }),
        },
        {
          id: "dot",
          name: "Dot",
          kind: "primitive",
          locked: false,
          hidden: false,
          primitive: primitiveOf("circle", {
            x: 300,
            y: 200,
            radius: 30,
            fill: null,
            outline: "black",
            width: 2,
          }),
        },
      ],
    },
    {
      id: "cluster",
      name: "Cluster",
      kind: "container",
      locked: false,
      hidden: false,
      x: 100,
      y: 500,
      width: 400,
      height: 150,
      grouped: true,
      background: null,
      children: [
        {
          id: "left",
          name: "Left",
          kind: "primitive",
          locked: false,
          hidden: false,
          primitive: primitiveOf("rectangle", {
            x_start: 0,
            y_start: 0,
            x_end: 159,
            y_end: 99,
            fill: null,
            outline: "black",
            width: 2,
          }),
        },
        {
          id: "right",
          name: "Right",
          kind: "primitive",
          locked: false,
          hidden: false,
          primitive: primitiveOf("rectangle", {
            x_start: 200,
            y_start: 0,
            x_end: 359,
            y_end: 99,
            fill: null,
            outline: "black",
            width: 2,
          }),
        },
      ],
    },
  ],
  createdAt: "2026-09-20T08:00:00+00:00",
  updatedAt: "2026-09-23T16:30:00+00:00",
};

const officeDashboard: Dashboard = {
  id: "office",
  schemaVersion: 1,
  name: "Office status",
  status: "draft",
  language: "en",
  display: {
    profileId: "custom",
    width: 320,
    height: 240,
    palette: "bw",
    background: "white",
    padding: 0,
    snapSize: 5,
    rotation: 0,
    deviceId: null,
  },
  items: [],
  createdAt: "2026-09-18T10:00:00+00:00",
  updatedAt: "2026-09-22T09:15:00+00:00",
};

const preview = (dashboard: Dashboard): string => {
  const { width, height } = dashboard.display;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${dashboard.display.background}"/><rect x="8" y="8" width="388" height="149" rx="3" fill="white" stroke="black"/><circle cx="42" cy="94" r="10" fill="black"/><rect x="38" y="45" width="8" height="50" rx="4" fill="black"/><text x="225" y="52" text-anchor="middle" font-family="Roboto" font-size="22">${dashboard.items.length ? "Kitchen" : ""}</text><text x="225" y="116" text-anchor="middle" font-family="Roboto" font-size="58">21.4 °C</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/** QR capacity in bytes at the renderer's error correction, for versions 1 to 10. */
const QR_CAPACITY = [7, 14, 24, 34, 44, 58, 64, 84, 98, 119];

/**
 * How many modules wide the backend makes a QR code: it grows with the data.
 * The harness has no `qrcode` library, so this follows the capacity table.
 */
const qrModules = (data: string): number => {
  const bytes = new TextEncoder().encode(data).length;
  const version = QR_CAPACITY.findIndex((capacity) => bytes <= capacity) + 1;
  return 17 + 4 * (version || QR_CAPACITY.length);
};

/**
 * What the backend reports as item bounds. Text and QR codes are measured, not
 * computed from their fields, so the harness deliberately differs from the
 * panel's own first guess and tests can tell them apart.
 */
type Box = { x: number; y: number; width: number; height: number };

/** What the harness "measures" for the primitives whose size the backend measures. */
const measuredBox = (primitive: Primitive): Box | undefined => {
  if (primitive.type === "text") {
    return {
      x: primitive.x,
      y: primitive.y,
      width: Math.round(primitive.value.length * primitive.size * 0.55),
      height: Math.round(primitive.size * 1.4),
    };
  }
  if (primitive.type === "qrcode") {
    const side =
      (qrModules(primitive.data) + primitive.border * 2) * primitive.boxsize;
    return { x: primitive.x, y: primitive.y, width: side, height: side };
  }
  return undefined;
};

/** The size the harness reports for a leaf, in the coordinates the item stores. */
const leafBounds = (item: LeafItem): Box => {
  if (item.kind === "widget") return { ...item.frame };
  const primitive = withNumberTemplates(item);
  return primitiveBounds(primitive, measuredBox(primitive));
};

/**
 * The backend evaluates expressions; the harness only reads the simplest, `{{ 123 }}`,
 * so a test can see a position that differs from the stored literal.
 */
const NUMBER_TEMPLATE = /^\{\{\s*(-?\d+)\s*\}\}$/;

const withNumberTemplates = (item: PrimitiveItem): Primitive => {
  const resolved = { ...item.primitive };
  for (const [key, template] of Object.entries(item.expressions ?? {})) {
    const match = NUMBER_TEMPLATE.exec(template);
    if (match && key in resolved) {
      Object.assign(resolved, { [key]: Number(match[1]) });
    }
  }
  return resolved;
};

/**
 * What the backend reports as item bounds, on the display: a container's children
 * store coordinates relative to it, so their offsets are added.
 */
const collectBounds = (
  items: StudioItem[],
  offset: { x: number; y: number },
  result: Record<string, Box>
): void => {
  for (const item of items) {
    if (item.kind === "container") {
      const box = {
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      };
      result[item.id] = { ...box, x: box.x + offset.x, y: box.y + offset.y };
      collectBounds(
        item.children,
        { x: offset.x + item.x, y: offset.y + item.y },
        result
      );
    } else {
      const box = leafBounds(item);
      result[item.id] = { ...box, x: box.x + offset.x, y: box.y + offset.y };
    }
  }
};

const itemBounds = (dashboard: Dashboard): Record<string, Box> => {
  const result: Record<string, Box> = {};
  collectBounds(dashboard.items, { x: 0, y: 0 }, result);
  return result;
};

let dashboards = [demoDashboard, hallwayDashboard, officeDashboard].map(
  (dashboard) => structuredClone(dashboard)
);
const calls: Array<Record<string, unknown>> = [];

/** Packages an e2e test "installs" in the user folder; a reload picks them up. */
const installedPackages = new Set<"hello" | "broken">();
let loadedPackages = new Set<"hello" | "broken">();

const helloWidget = (): WidgetDefinition => ({
  ...sensorCardDefinition,
  id: "hello-world",
  name: "Hello world",
  description: "Says hello.",
  icon: "mdi:hand-wave",
  category: "Examples",
  builtin: false,
  sources: [],
  options: [],
});

const installedWidgets = (language: string): WidgetDefinition[] => [
  ...loadWidgetDefinitions(language),
  ...(loadedPackages.has("hello") ? [helloWidget()] : []),
];

const widgetErrors = (): WidgetLoadError[] =>
  loadedPackages.has("broken")
    ? [
        {
          folder: "broken",
          message: "broken/widget.yml: api: unsupported widget API 2",
        },
      ]
    : [];

/** The entities the backend would report for the templates of a dashboard. */
const expressionEntities = (dashboard: Dashboard): string[] => [
  ...new Set(
    dashboard.items.flatMap((item) =>
      Object.values(item.expressions ?? {}).flatMap((template) =>
        [...template.matchAll(/states\('([^']+)'\)/g)].map((match) => match[1])
      )
    )
  ),
];
const hass: HomeAssistant = {
  language: "en",
  states: {
    "sensor.kitchen_temperature": {
      state: "21.4",
      attributes: {
        friendly_name: "Kitchen temperature",
        unit_of_measurement: "°C",
      },
    },
  },
  async callWS<T>(message: Record<string, unknown>): Promise<T> {
    calls.push(structuredClone(message));
    if (message.type === "opendisplay_studio/bootstrap") {
      await new Promise((resolve) => window.setTimeout(resolve, 60));
      return {
        version: "3.0.6",
        dashboards,
        widgets: installedWidgets(hass.language),
        widgetErrors: widgetErrors(),
        primitives: primitiveDefinitions,
      } as T;
    }
    if (message.type === "opendisplay_studio/send_to_device") {
      return {} as T;
    }
    if (message.type === "opendisplay_studio/list_devices") {
      return { devices: DISPLAY_DEVICES } as T;
    }
    if (message.type === "opendisplay_studio/reload_widgets") {
      loadedPackages = new Set(installedPackages);
      return {
        widgets: installedWidgets(hass.language),
        widgetErrors: widgetErrors(),
      } as T;
    }
    if (message.type === "opendisplay_studio/compose_preview") {
      const dashboard = message.dashboard as Dashboard;
      const yaml = allItems(dashboard.items)
        .filter((item) => item.kind !== "container")
        .map((item) =>
          item.kind === "primitive"
            ? `- type: ${item.primitive.type}`
            : "- type: rectangle\n- type: icon\n- type: text"
        )
        .join("\n");
      return {
        imageUrl: preview(dashboard),
        yaml,
        itemBounds: itemBounds(dashboard),
        warnings: [],
        dependencies: {
          entities: expressionEntities(dashboard),
          domains: [],
          allStates: false,
          usesTime: false,
        },
        timings: {
          queue: 0.1,
          data: 0.2,
          compile: 0.3,
          render: 7.4,
          encode: 1.2,
          pipeline: 9.2,
        },
      } as T;
    }
    if (message.type === "opendisplay_studio/create_dashboard") {
      const dashboard = {
        ...(message.dashboard as Dashboard),
        id: createId(),
        createdAt: now,
        updatedAt: now,
      };
      dashboards = [...dashboards, dashboard];
      return { dashboard } as T;
    }
    if (message.type === "opendisplay_studio/update_dashboard") {
      const dashboard = structuredClone(message.dashboard as Dashboard);
      dashboards = dashboards.map((item) =>
        item.id === dashboard.id ? dashboard : item
      );
      return { dashboard } as T;
    }
    if (message.type === "opendisplay_studio/delete_dashboard") {
      dashboards = dashboards.filter(
        (item) => item.id !== message.dashboard_id
      );
      return {} as T;
    }
    throw new Error(`Unsupported command ${String(message.type)}`);
  },
};

const panel = document.querySelector("ods-app") as HTMLElement & {
  hass: HomeAssistant;
};

const cloneData = <T>(value: T): T => structuredClone(value);
let hassRevision = 0;
const assignFreshHass = (): void => {
  hassRevision += 1;
  panel.hass = {
    ...hass,
    states: { ...hass.states },
    language: hass.language,
  };
};

declare global {
  interface Window {
    __ODS_E2E__: {
      calls: () => Array<Record<string, unknown>>;
      dashboards: () => Dashboard[];
      replaceHass: () => void;
      setState: (entityId: string, state: string) => void;
      installPackage: (name: "hello" | "broken") => void;
      uninstallPackage: (name: "hello" | "broken") => void;
      hassRevision: () => number;
    };
  }
}
window.__ODS_E2E__ = {
  calls: () => cloneData(calls),
  dashboards: () => cloneData(dashboards),
  replaceHass: assignFreshHass,
  installPackage: (name) => {
    installedPackages.add(name);
  },
  uninstallPackage: (name) => {
    installedPackages.delete(name);
  },
  setState: (entityId, state) => {
    hass.states = { ...hass.states, [entityId]: { state } };
    assignFreshHass();
  },
  hassRevision: () => hassRevision,
};

// Home Assistant assigns `hass` after the custom panel has connected and then
// replaces the object on every state update. Reproduce that lifecycle here.
window.setTimeout(assignFreshHass, 10);
window.setTimeout(assignFreshHass, 25);
