//#region src/strings.ts
var e = (e, t) => `${e} × ${t}`, t = {
	common: {
		cancel: "Cancel",
		close: "Close",
		size: e,
		sizeInPixels: (t, n) => `${e(t, n)} px`,
		milliseconds: (e) => `${e.toFixed(1)} ms`
	},
	commands: {
		undo: "Undo",
		redo: "Redo",
		delete: "Delete",
		hide: "Hide",
		show: "Show",
		lock: "Lock",
		unlock: "Unlock"
	},
	app: {
		loading: "Loading OpenDisplay Studio…",
		loadFailed: "Could not load OpenDisplay Studio",
		createFailed: "Could not create the dashboard",
		saveFailed: "Could not save the dashboard",
		deleteFailed: "Could not delete the dashboard",
		renameFailed: "Could not rename the dashboard",
		duplicateFailed: "Could not duplicate the dashboard",
		settingsFailed: "Could not update dashboard settings",
		previewFailed: "Could not render the preview",
		renameEmpty: "Dashboard name cannot be empty",
		discardChanges: "Discard unsaved dashboard changes?",
		unsupportedPrimitive: (e) => `Unsupported primitive type: ${e || "(empty)"}`,
		confirmRemoval: "Confirm removal",
		deleteElementTitle: (e) => `Delete ${e}?`,
		deleteElementBody: "This removes the element from the dashboard. You can restore it with Undo.",
		deleteElement: "Delete element"
	},
	gallery: {
		title: "Dashboards",
		count: (e) => `${e} ${e === 1 ? "dashboard" : "dashboards"}`,
		newDashboard: "New dashboard",
		addDashboard: "Add dashboard",
		filters: "Dashboard filters",
		search: "Search dashboards",
		searchPlaceholder: "Search dashboards…",
		sort: "Sort",
		sortDashboards: "Sort dashboards",
		sortUpdated: "Last updated",
		sortName: "Name A–Z",
		savedDashboards: "Saved dashboards",
		noResults: "No dashboards found",
		noResultsHint: "Try a different search.",
		updated: (e) => `Updated ${e}`,
		open: (e) => `Open dashboard ${e}`,
		actionsFor: (e) => `Dashboard actions for ${e}`,
		menuFor: (e) => `Actions for ${e}`,
		renameField: (e) => `Rename dashboard ${e}`,
		menu: {
			rename: "Rename",
			duplicate: "Duplicate",
			settings: "Display Settings",
			delete: "Delete"
		},
		deleteTitle: "Delete dashboard?",
		deleteBody: "and all of its elements will be permanently removed.",
		deleteWarning: "This action cannot be undone.",
		deleteAction: "Delete dashboard",
		deleting: "Deleting…",
		settingsTitle: "Display settings",
		settingsSave: "Save changes",
		saving: "Saving…"
	},
	newDashboard: {
		title: "New dashboard",
		subtitle: "Create a custom OpenDisplay canvas",
		startFrom: "Start from",
		sources: "Dashboard source",
		customSize: "Custom size",
		customSizeHint: "Set resolution and colors",
		fromDevice: "From OpenDisplay device",
		fromDeviceHint: "Coming later",
		create: "Create dashboard",
		creating: "Creating…"
	},
	header: {
		studio: "OpenDisplay Studio",
		dashboards: "Dashboards",
		name: "Dashboard name",
		view: "Dashboard view",
		design: "Design",
		code: "Code",
		setDraft: "Set Draft",
		setReady: "Set Ready",
		save: "Save",
		saving: "Saving…"
	},
	library: {
		title: "Library",
		heading: "Elements",
		expand: "Expand element catalog",
		collapse: "Collapse element catalog",
		search: "Search widgets and primitives",
		searchPlaceholder: "Search elements…",
		widgets: "Widgets",
		primitives: "Primitives",
		noWidgets: "No matching widgets",
		reloadWidgets: "Reload widgets",
		userWidget: "user",
		widgetErrors: (e) => `${e} widget ${e === 1 ? "package" : "packages"} could not be loaded`,
		widgetsReloaded: (e, t) => t === 0 ? `Widgets reloaded — ${e} loaded` : `Widgets reloaded — ${e} loaded, ${t} failed`,
		reloadFailed: "Could not reload the widgets",
		noPrimitives: "No matching primitives",
		entryHint: (e) => `${e} Click or drag to add.`
	},
	structure: {
		title: "Structure",
		heading: "Elements",
		collapse: "Collapse inspector",
		empty: "Drag widgets or primitives onto the canvas.",
		widget: "Widget",
		reorderTitle: "Reorder layer",
		reorder: (e) => `Reorder ${e}`
	},
	inspector: {
		expand: "Expand inspector",
		rail: "Layers",
		resize: "Resize inspector",
		dashboard: "Dashboard",
		dashboardHint: "Display and canvas settings",
		display: "Display",
		displayType: "Display type",
		workingArea: "Working area",
		workingAreaHelp: "Padding defines the editable safe area. Snap aligns movement and resizing to pixel increments.",
		layout: "Layout",
		widgetSettings: "Widget settings",
		dataSources: "Data sources",
		widgetMissing: (e) => `The widget ${e} is not installed. It keeps its settings and draws again once the package returns.`,
		appearance: "Appearance",
		diagnostics: "Render diagnostics",
		deleteDashboard: "Delete dashboard",
		removeElement: "Remove element",
		locked: "Position is locked",
		unlock: "Unlock",
		unlockElement: "Unlock element position",
		kindWidget: "Widget",
		kindPrimitive: "ODL primitive",
		subtitle: (e, t) => `${e} · ${t ? "position locked" : "editable"}`,
		metrics: {
			queue: "Queue",
			data: "Data",
			compile: "Compile",
			render: "Render",
			encode: "Encode",
			total: "Total"
		}
	},
	expression: {
		toggleLabel: (e) => `Expression for ${e}`,
		toggleTooltip: "Expression (or type {)",
		placeholder: "{{ states('sensor.example') }}",
		visibleLabel: "Visible",
		alwaysVisible: "Always shown",
		positionLocked: (e) => `Position is driven by an expression (${e})`,
		cornerFields: "Edit corners",
		derivedFields: "Edit position and size"
	},
	canvas: {
		rendering: "Rendering…",
		previewAlt: "Authoritative rendered display preview",
		hidden: "Hidden",
		layers: (e) => `${e} layers`,
		padding: (e) => `Padding ${e}px`,
		snap: (e) => `Snap ${e}px`,
		resizeHandle: (e, t) => `Resize ${e} from ${t}`,
		sides: {
			nw: "north west",
			n: "north",
			ne: "north east",
			e: "east",
			se: "south east",
			s: "south",
			sw: "south west",
			w: "west"
		}
	},
	zoom: {
		out: "Zoom out",
		in: "Zoom in",
		reset: "Reset",
		fit: "Fit",
		preset: (e) => `${e}×`
	},
	code: {
		eyebrow: "Generated output",
		title: "Generated ODL YAML",
		description: "Read-only output generated from the current dashboard.",
		copyLabel: "Copy generated ODL YAML",
		yaml: "Generated ODL YAML",
		copy: {
			idle: "Copy YAML",
			copied: "Copied",
			failed: "Copy failed"
		},
		status: {
			idle: "",
			copied: "YAML copied to clipboard",
			failed: "Clipboard access failed"
		}
	},
	fields: {
		name: "Dashboard name",
		width: "Width",
		height: "Height",
		palette: "Palette",
		background: "Background",
		advanced: "Advanced display options",
		padding: "Outer padding",
		snapSize: "Snap size",
		x: "X",
		y: "Y",
		innerPadding: "Inner padding"
	},
	customDisplay: {
		manufacturer: "Custom",
		name: "Custom display"
	},
	palettes: {
		bw: "Black / white",
		bwr: "Black / white / red",
		bwy: "Black / white / yellow",
		bwry: "Black / white / red / yellow",
		spectra6: "Spectra 6 · black / white / red / yellow / blue / green"
	}
}, n = t.palettes, r = {
	bw: ["black", "white"],
	bwr: [
		"black",
		"white",
		"red"
	],
	bwy: [
		"black",
		"white",
		"yellow"
	],
	bwry: [
		"black",
		"white",
		"red",
		"yellow"
	],
	spectra6: [
		"black",
		"white",
		"red",
		"yellow",
		"blue",
		"green"
	]
}, i = (e, t, n, r, i = !1) => ({
	id: `solum-${e}`,
	manufacturer: "SOLUM",
	name: `Newton Pro ${t}`,
	width: n,
	height: r,
	palettes: i ? ["bw"] : ["bw", "bwry"],
	defaultPalette: i ? "bw" : "bwry"
}), a = [
	{
		id: "seeed-e1001",
		manufacturer: "Seeed Studio",
		name: "reTerminal E1001 7.5″",
		width: 800,
		height: 480,
		palettes: ["bw"],
		defaultPalette: "bw"
	},
	{
		id: "seeed-sticky",
		manufacturer: "Seeed Studio",
		name: "reTerminal sticky 3.97″",
		width: 800,
		height: 480,
		palettes: ["bw"],
		defaultPalette: "bw"
	},
	{
		id: "seeed-xiao-7-5",
		manufacturer: "Seeed Studio",
		name: "XIAO 7.5″ ePaper kit",
		width: 800,
		height: 480,
		palettes: ["bw"],
		defaultPalette: "bw"
	},
	{
		id: "opendisplay-4-26",
		manufacturer: "OpenDisplay",
		name: "OpenDisplay 4.26″ Mono Kit",
		width: 800,
		height: 480,
		palettes: ["bw"],
		defaultPalette: "bw"
	},
	{
		id: "eink-spectra6-7-3",
		manufacturer: "E Ink",
		name: "Spectra 6 7.3″ · ED2208-GCA",
		width: 800,
		height: 480,
		palettes: ["spectra6"],
		defaultPalette: "spectra6"
	},
	{
		id: "eink-spectra6-13-3",
		manufacturer: "E Ink",
		name: "Spectra 6 13.3″ · ED2208-NCA",
		width: 1200,
		height: 1600,
		palettes: ["spectra6"],
		defaultPalette: "spectra6"
	},
	i("1-6-v", "1.6″ V", 200, 200),
	i("1-6-h", "1.6″ H", 200, 200),
	i("2-2", "2.2″", 296, 160),
	i("2-2-freezer", "2.2″ Freezer", 296, 160, !0),
	i("2-6", "2.6″", 360, 184),
	i("2-6-freezer", "2.6″ Freezer", 360, 184, !0),
	i("2-7", "2.7″", 300, 200),
	i("2-9", "2.9″", 384, 168),
	i("2-9-freezer", "2.9″ Freezer", 384, 168, !0),
	i("3-45", "3.5″ · 3.45 panel", 480, 224),
	i("3-52", "3.5″ · 3.52 panel", 384, 180),
	i("4-2", "4.2″", 400, 300),
	i("4-3", "4.3″", 522, 152),
	i("4-5", "4.5″", 480, 176),
	i("5-8", "5.8″", 792, 272),
	i("6-1", "6.1″", 648, 480),
	i("7-5", "7.5″", 800, 480),
	i("9-7", "9.7″", 672, 960),
	i("11-6", "11.6″", 640, 960),
	i("12-2", "12.2″", 768, 960),
	{
		id: "custom",
		...t.customDisplay,
		width: 800,
		height: 480,
		palettes: [
			"bw",
			"bwr",
			"bwy",
			"bwry",
			"spectra6"
		],
		defaultPalette: "bw"
	}
], o = (e) => a.find((t) => t.id === e) ?? a[0], s = (e) => e in n, c = "opendisplay_color", l = "accent", u = (e, t) => c in e ? { select: { options: [...r[t], l] } } : e, d = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || Array.isArray(e) && e.every((e) => typeof e == "string"), f = (e) => e.default === void 0 ? "boolean" in e.selector ? !1 : "number" in e.selector ? 0 : "" : e.default, p = (e) => Object.fromEntries(e.options.flatMap((e) => e.fields).map((e) => [e.key, f(e)])), m = (e, t) => {
	let n = new Set(t.options.flatMap((e) => e.fields.map((e) => e.key)));
	return Object.fromEntries(Object.entries(e).filter((e) => n.has(e[0]) && d(e[1])));
}, h = (e) => Object.values(e.selector).some((e) => typeof e == "object" && !!e && "multiple" in e), ee = (e, t) => {
	let n = t.map((e) => e.id);
	return h(e) ? n : n[0] ?? "";
}, te = (e, t) => (Array.isArray(t) ? t : [t]).filter((e) => typeof e == "string" && e !== "").map((t) => e.find((e) => e.id === t) ?? { id: t }), g = (e, t, n, r) => {
	let i = new Set(r.perSource.map((e) => e.key));
	return e.map((e) => {
		if (e.id !== t) return e;
		let r = { id: e.id }, a = {
			...e,
			...n
		};
		for (let e of i) {
			let t = a[e];
			(typeof t == "string" && t !== "" || typeof t == "number" || typeof t == "boolean") && (r[e] = t);
		}
		return r;
	});
}, _ = 6e4, ne = (e) => e.split(".", 1)[0] ?? "", re = (e, t) => [.../* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])].filter((n) => e[n] !== t[n]), ie = (e, t, n) => {
	if (!t || !n || t === n) return !1;
	let r = re(t, n);
	return e.allStates ? r.length > 0 : r.some((t) => e.entities.includes(t) || e.domains.includes(ne(t)));
}, ae = globalThis, oe = ae.ShadowRoot && (ae.ShadyCSS === void 0 || ae.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, se = Symbol(), ce = /* @__PURE__ */ new WeakMap(), v = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== se) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (oe && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = ce.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ce.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, y = (e) => new v(typeof e == "string" ? e : e + "", void 0, se), b = (e, ...t) => new v(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, se), le = (e, t) => {
	if (oe) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = ae.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, ue = oe ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return y(t);
})(e) : e, { is: de, defineProperty: fe, getOwnPropertyDescriptor: pe, getOwnPropertyNames: me, getOwnPropertySymbols: he, getPrototypeOf: ge } = Object, _e = globalThis, ve = _e.trustedTypes, ye = ve ? ve.emptyScript : "", be = _e.reactiveElementPolyfillSupport, xe = (e, t) => e, Se = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ye : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, Ce = (e, t) => !de(e, t), we = {
	attribute: !0,
	type: String,
	converter: Se,
	reflect: !1,
	useDefault: !1,
	hasChanged: Ce
};
Symbol.metadata ??= Symbol("metadata"), _e.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var Te = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = we) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && fe(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = pe(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? we;
	}
	static _$Ei() {
		if (this.hasOwnProperty(xe("elementProperties"))) return;
		let e = ge(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(xe("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(xe("properties"))) {
			let e = this.properties, t = [...me(e), ...he(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(ue(e));
		} else e !== void 0 && t.push(ue(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return le(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? Se : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? Se : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? Ce)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
Te.elementStyles = [], Te.shadowRootOptions = { mode: "open" }, Te[xe("elementProperties")] = /* @__PURE__ */ new Map(), Te[xe("finalized")] = /* @__PURE__ */ new Map(), be?.({ ReactiveElement: Te }), (_e.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var Ee = globalThis, De = (e) => e, Oe = Ee.trustedTypes, ke = Oe ? Oe.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Ae = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, je = "?" + x, Me = `<${je}>`, S = document, Ne = () => S.createComment(""), Pe = (e) => e === null || typeof e != "object" && typeof e != "function", Fe = Array.isArray, Ie = (e) => Fe(e) || typeof e?.[Symbol.iterator] == "function", Le = "[ 	\n\f\r]", Re = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ze = /-->/g, Be = />/g, C = RegExp(`>|${Le}(?:([^\\s"'>=/]+)(${Le}*=${Le}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), Ve = /'/g, He = /"/g, Ue = /^(?:script|style|textarea|title)$/i, w = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), We = /* @__PURE__ */ new WeakMap(), D = S.createTreeWalker(S, 129);
function Ge(e, t) {
	if (!Fe(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ke === void 0 ? t : ke.createHTML(t);
}
var Ke = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Re;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === Re ? c[1] === "!--" ? o = ze : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = C) : (Ue.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = C) : o = Be : o === C ? c[0] === ">" ? (o = i ?? Re, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? C : c[3] === "\"" ? He : Ve) : o === He || o === Ve ? o = C : o === ze || o === Be ? o = Re : (o = C, i = void 0);
		let d = o === C && e[t + 1].startsWith("/>") ? " " : "";
		a += o === Re ? n + Me : l >= 0 ? (r.push(s), n.slice(0, l) + Ae + n.slice(l) + x + d) : n + x + (l === -2 ? t : d);
	}
	return [Ge(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, qe = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ke(t, n);
		if (this.el = e.createElement(l, r), D.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = D.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(Ae)) {
					let t = u[o++], n = i.getAttribute(e).split(x), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Qe : r[1] === "?" ? $e : r[1] === "@" ? et : Ze
					}), i.removeAttribute(e);
				} else e.startsWith(x) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ue.test(i.tagName)) {
					let e = i.textContent.split(x), t = e.length - 1;
					if (t > 0) {
						i.textContent = Oe ? Oe.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], Ne()), D.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], Ne());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === je) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(x, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += x.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = S.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Je(e, t, n = e, r) {
	if (t === T) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = Pe(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Je(e, i._$AS(e, t.values), i, r)), t;
}
var Ye = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? S).importNode(t, !0);
		D.currentNode = r;
		let i = D.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Xe(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new tt(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = D.nextNode(), a++);
		}
		return D.currentNode = S, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Xe = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = Je(this, e, t), Pe(e) ? e === E || e == null || e === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : e !== this._$AH && e !== T && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Ie(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== E && Pe(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = qe.createElement(Ge(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ye(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = We.get(e.strings);
		return t === void 0 && We.set(e.strings, t = new qe(e)), t;
	}
	k(t) {
		Fe(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(Ne()), this.O(Ne()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = De(e).nextSibling;
			De(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Ze = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = E, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = E;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Je(this, e, t, 0), a = !Pe(e) || e !== this._$AH && e !== T, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Je(this, r[n + o], t, o), s === T && (s = this._$AH[o]), a ||= !Pe(s) || s !== this._$AH[o], s === E ? e = E : e !== E && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Qe = class extends Ze {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === E ? void 0 : e;
	}
}, $e = class extends Ze {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== E);
	}
}, et = class extends Ze {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Je(this, e, t, 0) ?? E) === T) return;
		let n = this._$AH, r = e === E && n !== E || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== E && (n === E || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, tt = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Je(this, e);
	}
}, nt = Ee.litHtmlPolyfillSupport;
nt?.(qe, Xe), (Ee.litHtmlVersions ??= []).push("3.3.3");
var rt = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Xe(t.insertBefore(Ne(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, it = globalThis, O = class extends Te {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = rt(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return T;
	}
};
O._$litElement$ = !0, O.finalized = !0, it.litElementHydrateSupport?.({ LitElement: O });
var at = it.litElementPolyfillSupport;
at?.({ LitElement: O }), (it.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var k = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, ot = {
	attribute: !0,
	type: String,
	converter: Se,
	reflect: !1,
	hasChanged: Ce
}, st = (e = ot, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function A(e) {
	return (t, n) => typeof n == "object" ? st(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function j(e) {
	return A({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var ct = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function lt(e, t) {
	return (n, r, i) => {
		let a = (t) => t.renderRoot?.querySelector(e) ?? null;
		if (t) {
			let { get: e, set: t } = typeof r == "object" ? n : i ?? (() => {
				let e = Symbol();
				return {
					get() {
						return this[e];
					},
					set(t) {
						this[e] = t;
					}
				};
			})();
			return ct(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return ct(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/lit-html/directive.js
var ut = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, dt = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), ft = class {
	constructor(e) {}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AT(e, t, n) {
		this._$Ct = e, this._$AM = t, this._$Ci = n;
	}
	_$AS(e, t) {
		return this.update(e, t);
	}
	update(e, t) {
		return this.render(...t);
	}
}, pt = "important", mt = " !" + pt, M = dt(class extends ft {
	constructor(e) {
		if (super(e), e.type !== ut.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return Object.keys(e).reduce((t, n) => {
			let r = e[n];
			return r == null ? t : t + `${n = n.includes("-") ? n : n.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
		}, "");
	}
	update(e, [t]) {
		let { style: n } = e.element;
		if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
		for (let e of this.ft) t[e] ?? (this.ft.delete(e), e.includes("-") ? n.removeProperty(e) : n[e] = null);
		for (let e in t) {
			let r = t[e];
			if (r != null) {
				this.ft.add(e);
				let t = typeof r == "string" && r.endsWith(mt);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? pt : "") : n[e] = r;
			}
		}
		return T;
	}
}), ht = "visible", gt = (e) => typeof e == "string" && (e.includes("{{") || e.includes("{%")), _t = "\\", vt = (e) => `'${e.replaceAll(_t, "\\\\").replaceAll("'", `${_t}'`)}'`, yt = (e) => typeof e == "string" ? `{{ ${vt(e)} }}` : typeof e == "boolean" || typeof e == "number" ? `{{ ${e} }}` : "{{ none }}", bt = (e) => e.kind === "widget" ? e.widget.type : e.primitive.type, xt = (e, t) => {
	let n = new Set(e.map((e) => e.name)), r = e.filter((e) => bt(e) === t).length + 1;
	for (; n.has(`${t}_${r}`);) r += 1;
	return `${t}_${r}`;
}, N = (e, t, n) => Math.max(t, Math.min(n, e)), St = (e, t, n = 0) => n + Math.round((e - n) / t) * t, Ct = [
	"nw",
	"n",
	"ne",
	"e",
	"se",
	"s",
	"sw",
	"w"
], wt = (e) => e.includes("e") || e.includes("w"), Tt = (e) => e.includes("n") || e.includes("s"), Et = (e, t, n, r) => r ? St(e, t, n) : Math.round(e), Dt = (e) => {
	if (e.startHandle) return e.originalEnd - e.areaStart;
	if (e.endHandle) return e.areaEnd - e.originalStart;
	let t = Math.min(e.originalCenter - e.areaStart, e.areaEnd - e.originalCenter);
	return Math.max(1, t * 2);
}, Ot = (e, t, n, r, i) => e ? n + r - i : t ? n : n + (r - i) / 2, kt = ({ bounds: e, handle: t, deltaX: n, deltaY: r, minimumWidth: i, minimumHeight: a, area: o, preserveAspect: s, snapSize: c, snapEnabled: l }) => {
	let u = o.x + o.width, d = o.y + o.height, f = e.x, p = e.y, m = e.x + e.width, h = e.y + e.height, ee = f + e.width / 2, te = p + e.height / 2, g = f, _ = p, ne = m, re = h;
	if (t.includes("w") && (g = Et(f + n, c, o.x, l)), t.includes("e") && (ne = Et(m + n, c, o.x, l)), t.includes("n") && (_ = Et(p + r, c, o.y, l)), t.includes("s") && (re = Et(h + r, c, o.y, l)), t.includes("w") && (g = N(g, o.x, m - i)), t.includes("e") && (ne = N(ne, f + i, u)), t.includes("n") && (_ = N(_, o.y, h - a)), t.includes("s") && (re = N(re, p + a, d)), !s) return {
		x: Math.round(g),
		y: Math.round(_),
		width: Math.round(ne - g),
		height: Math.round(re - _)
	};
	let ie = e.width / Math.max(1, e.height), ae = Math.max(i, ne - g), oe = Math.max(a, re - _), se = Math.abs(ae - e.width) / Math.max(1, e.width), ce = Math.abs(oe - e.height) / Math.max(1, e.height), v, y;
	wt(t) && (!Tt(t) || se >= ce) ? (v = ae, y = v / ie) : (y = oe, v = y * ie);
	let b = Dt({
		startHandle: t.includes("w"),
		endHandle: t.includes("e"),
		originalStart: f,
		originalEnd: m,
		originalCenter: ee,
		areaStart: o.x,
		areaEnd: u
	}), le = Dt({
		startHandle: t.includes("n"),
		endHandle: t.includes("s"),
		originalStart: p,
		originalEnd: h,
		originalCenter: te,
		areaStart: o.y,
		areaEnd: d
	}), ue = Math.max(i / Math.max(1, e.width), a / Math.max(1, e.height)), de = Math.min(b / Math.max(1, e.width), le / Math.max(1, e.height)), fe = N(Math.max(v / Math.max(1, e.width), y / Math.max(1, e.height)), Math.min(ue, de), de);
	return v = Math.max(1, Math.round(e.width * fe)), y = Math.max(1, Math.round(e.height * fe)), g = t.includes("w") ? m - v : t.includes("e") ? f : ee - v / 2, _ = t.includes("n") ? h - y : t.includes("s") ? p : te - y / 2, g = N(Math.round(g), o.x, u - v), _ = N(Math.round(_), o.y, d - y), {
		x: g,
		y: _,
		width: v,
		height: y
	};
}, At = (e, t, n, r) => {
	let i = Ot(r.includes("w"), r.includes("e"), e.x, e.width, t), a = Ot(r.includes("n"), r.includes("s"), e.y, e.height, n);
	return {
		x: Math.round(i),
		y: Math.round(a),
		width: t,
		height: n
	};
}, P = (e) => "x_start" in e, jt = (e) => {
	if (P(e)) return {
		x: Math.min(e.x_start, e.x_end),
		y: Math.min(e.y_start, e.y_end),
		width: Math.abs(e.x_end - e.x_start) + 1,
		height: Math.abs(e.y_end - e.y_start) + 1
	};
	if (e.type === "circle") return {
		x: e.x - e.radius,
		y: e.y - e.radius,
		width: e.radius * 2 + 1,
		height: e.radius * 2 + 1
	};
	if (e.type === "qrcode") {
		let t = (21 + e.border * 2) * e.boxsize;
		return {
			x: e.x,
			y: e.y,
			width: t,
			height: t
		};
	}
	return e.type === "icon" ? {
		x: e.x,
		y: e.y,
		width: e.size,
		height: e.size
	} : {
		x: e.x,
		y: e.y,
		width: Math.max(e.size, Math.round(e.value.length * e.size * .62)),
		height: Math.max(1, Math.round(e.size * 1.25))
	};
}, Mt = (e) => e.type === "text" || e.type === "qrcode", Nt = (e, t) => {
	if (e.kind === "widget") return e.frame;
	let n = jt(e.primitive);
	return t && Mt(e.primitive) ? {
		...n,
		width: t.width,
		height: t.height
	} : n;
}, Pt = (e, t) => t ? Math.max(1, Math.round(t.width / e.boxsize)) : 21 + e.border * 2, F = (e) => {
	let t = e.display.padding;
	return {
		x: t,
		y: t,
		width: e.display.width - t * 2,
		height: e.display.height - t * 2
	};
}, Ft = (e, t, n) => n ? St(e, t.display.snapSize, t.display.padding) : Math.round(e), It = (e, t, n) => {
	if (e.kind === "widget") {
		e.frame.x += t, e.frame.y += n;
		return;
	}
	let r = e.primitive;
	P(r) ? (r.x_start += t, r.x_end += t, r.y_start += n, r.y_end += n) : (r.x += t, r.y += n);
}, Lt = (e, t, n) => {
	let r = F(t), i = Nt(e, n);
	It(e, N(i.x, r.x, Math.max(r.x, r.x + r.width - i.width)) - i.x, N(i.y, r.y, Math.max(r.y, r.y + r.height - i.height)) - i.y), e.kind === "widget" && (e.frame.width = Math.min(e.frame.width, r.width), e.frame.height = Math.min(e.frame.height, r.height));
}, Rt = {
	width: 60,
	height: 48
}, zt = (e, t, n) => {
	if (e.kind === "widget") return {
		minimumWidth: t.width,
		minimumHeight: t.height,
		intrinsicAspect: !1
	};
	let r = e.primitive;
	if (r.type === "circle") return {
		minimumWidth: 3,
		minimumHeight: 3,
		intrinsicAspect: !0
	};
	if (r.type === "qrcode") {
		let e = Pt(r, n);
		return {
			minimumWidth: e,
			minimumHeight: e,
			intrinsicAspect: !0
		};
	}
	if (r.type === "icon") return {
		minimumWidth: 8,
		minimumHeight: 8,
		intrinsicAspect: !0
	};
	if (r.type === "text") {
		let e = Bt(r, 6, n);
		return {
			minimumWidth: e.width,
			minimumHeight: e.height,
			intrinsicAspect: !0
		};
	}
	return r.type === "line" ? {
		minimumWidth: 1,
		minimumHeight: 1,
		intrinsicAspect: !1
	} : {
		minimumWidth: 2,
		minimumHeight: 2,
		intrinsicAspect: !1
	};
}, Bt = (e, t, n) => {
	if (!n) return jt({
		...e,
		size: t
	});
	let r = t / e.size;
	return {
		x: e.x,
		y: e.y,
		width: Math.max(1, Math.round(n.width * r)),
		height: Math.max(1, Math.round(n.height * r))
	};
}, Vt = {
	n: "ne",
	e: "se",
	s: "se",
	w: "sw"
}, Ht = (e, t, n, r, i, a, o) => {
	let s = Nt(e, o.measured), { minimumWidth: c, minimumHeight: l, intrinsicAspect: u } = zt(e, o.minSize ?? Rt, o.measured), d = u ? Vt[t] ?? t : t, f = kt({
		bounds: s,
		handle: d,
		deltaX: n,
		deltaY: r,
		minimumWidth: c,
		minimumHeight: l,
		area: F(a),
		preserveAspect: i || u,
		snapSize: a.display.snapSize,
		snapEnabled: o.snapEnabled
	});
	if (e.kind === "widget") {
		e.frame = f;
		return;
	}
	let p = e.primitive;
	if (P(p)) {
		let e = f.x + f.width - 1, t = f.y + f.height - 1;
		if (p.type === "line") {
			let n = p.x_start <= p.x_end, r = p.y_start <= p.y_end;
			p.x_start = n ? f.x : e, p.x_end = n ? e : f.x, p.y_start = r ? f.y : t, p.y_end = r ? t : f.y, p.x_start === p.x_end && p.y_start === p.y_end && (p.x_end = Math.min(a.display.width - 1, p.x_start + 1));
		} else p.x_start = f.x, p.y_start = f.y, p.x_end = e, p.y_end = t;
		return;
	}
	if (p.type === "circle") {
		let e = Math.max(1, Math.floor((Math.min(f.width, f.height) - 1) / 2)), t = e * 2 + 1, n = At(f, t, t, d);
		p.x = n.x + e, p.y = n.y + e, p.radius = e;
		return;
	}
	if (p.type === "qrcode") {
		let e = Pt(p, o.measured);
		p.boxsize = N(Math.floor(Math.min(f.width, f.height) / e), 1, 16);
		let t = e * p.boxsize, n = At(f, t, t, d);
		p.x = n.x, p.y = n.y;
		return;
	}
	if (p.type === "icon") {
		p.size = N(Math.floor(Math.min(f.width, f.height)), 8, 256);
		let e = At(f, p.size, p.size, d);
		p.x = e.x, p.y = e.y;
		return;
	}
	let m = p.size;
	p.size = N(Math.round(m * f.width / Math.max(1, s.width)), 6, 256);
	let h = o.measured ? Bt({
		...p,
		size: m
	}, p.size, o.measured) : jt(p), ee = At(f, h.width, h.height, d);
	p.x = ee.x, p.y = ee.y;
}, Ut = (e, t, n, r, i, a) => {
	let o = structuredClone(e);
	if (o.locked) return o;
	if (t.mode === "resize") return Ht(o, t.handle, n, r, t.shiftKey, i, a), o;
	let s = F(i), c = Nt(o, a.measured), l = N(Ft(c.x + n, i, a.snapEnabled), s.x, Math.max(s.x, s.x + s.width - c.width)), u = N(Ft(c.y + r, i, a.snapEnabled), s.y, Math.max(s.y, s.y + s.height - c.height));
	return It(o, l - c.x, u - c.y), o;
}, Wt = () => Math.floor(Math.random() * 256), Gt = () => {
	let e = globalThis.crypto;
	if (typeof e?.randomUUID == "function") return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	typeof e?.getRandomValues == "function" ? e.getRandomValues(t) : t.forEach((e, n) => {
		t[n] = Wt();
	}), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0"));
	return `${n.slice(0, 4).join("")}-${n.slice(4, 6).join("")}-${n.slice(6, 8).join("")}-${n.slice(8, 10).join("")}-${n.slice(10).join("")}`;
}, I = (e, t, n) => e === "display_width" ? t.width : e === "display_height" ? t.height : e === "display_shorter_side" ? Math.min(t.width, t.height) : e ?? n, Kt = (e, t) => e.default === void 0 ? e.nullable ? null : 0 : e.shape !== "number" || typeof e.default != "number" ? e.default : N(e.default, I(e.min, t, -Infinity), I(e.max, t, Infinity)), qt = (e, t, n) => {
	let { x: r, y: i, displayWidth: a, displayHeight: o } = n;
	if (e.geometry === "point") {
		t.x = r, t.y = i;
		return;
	}
	let s = e.extent ?? {
		x: 0,
		y: 0
	};
	t.x_start = r, t.y_start = i, t.x_end = Math.min(a - 1, r + s.x), t.y_end = Math.min(o - 1, i + s.y);
}, Jt = (e, t) => {
	if (!e) return;
	let n = {
		width: t.displayWidth,
		height: t.displayHeight
	}, r = { type: e.type };
	for (let t of e.fields) r[t.key] = Kt(t, n);
	return qt(e, r, t), r;
}, Yt = {
	grid: [],
	extra: []
}, Xt = "transparent", L = (e, t) => t.find((t) => t.type === e.primitive.type), R = (e, t, n, r, i, a = !1) => ({
	label: e,
	key: t,
	value: n,
	min: r,
	max: i,
	stored: a
}), Zt = (e, n) => {
	let { width: r, height: i } = n.display, a = t.fields;
	return {
		grid: [
			R(a.x, "x", e.frame.x, 0, r),
			R(a.y, "y", e.frame.y, 0, i),
			R(a.width, "width", e.frame.width, 1, r),
			R(a.height, "height", e.frame.height, 1, i)
		],
		extra: [R(a.innerPadding, "padding", e.layout.padding, 0, 128)]
	};
}, Qt = (e, n) => {
	let r = e.primitive;
	if (!P(r)) return Yt;
	let { width: i, height: a } = n.display, o = t.fields, s = jt(r);
	return {
		grid: [
			R(o.x, "x", s.x, 0, i),
			R(o.y, "y", s.y, 0, a),
			R(o.width, "width", s.width, 1, i),
			R(o.height, "height", s.height, 1, a)
		],
		extra: []
	};
}, $t = (e, t, n) => {
	let r = n.display, i = e.axis === "x" ? r.width : r.height, a = e.shape === "coordinate";
	return R(e.label, e.key, Number(t[e.key]), a ? 0 : I(e.min, r, 0), a ? i : I(e.max, r, i), !0);
}, en = (e, t, n) => {
	let r = { ...e.primitive };
	return {
		grid: t.fields.filter((e) => e.section === "layout").map((e) => $t(e, r, n)),
		extra: []
	};
}, tn = (e, t) => e.kind === "primitive" && L(e, t)?.geometry !== "point", nn = (e, t, n, r = !1) => {
	if (e.kind === "widget") return Zt(e, t);
	let i = L(e, n);
	return i ? i.geometry === "point" || r ? en(e, i, t) : Qt(e, t) : Yt;
}, rn = (e, t) => {
	switch (e.shape) {
		case "boolean": return { boolean: {} };
		case "enum": return { select: { options: e.options ?? [] } };
		case "color": return { select: { options: e.nullable ? [Xt, ...t] : t } };
		case "number": return { number: {
			min: typeof e.min == "number" ? e.min : void 0,
			max: typeof e.max == "number" ? e.max : void 0
		} };
		default: return { text: {} };
	}
}, an = (e) => e.section === "appearance" && e.visible !== !1, on = (e, t, n) => {
	let i = L(e, n);
	if (!i) return [];
	let a = [...r[t], "accent"];
	return i.fields.filter(an).map((e) => ({
		name: e.key,
		label: e.label,
		selector: rn(e, a)
	}));
}, sn = (e, t) => {
	let n = { ...e.primitive }, r = L(e, t);
	for (let e of r?.fields ?? []) e.nullable && n[e.key] === null && (n[e.key] = Xt);
	return n;
}, cn = (e, t) => {
	let n = { ...e };
	for (let e of t?.fields ?? []) e.nullable && n[e.key] === Xt && (n[e.key] = null);
	return n;
}, ln = (e, t, n, r, i, a) => {
	let o = e.primitive;
	if (P(o)) return;
	let s = Nt(e);
	if (t === "x") {
		let e = s.x - o.x, t = r.x - e, i = r.x + r.width - s.width - e;
		Object.assign(o, { x: N(n, t, Math.max(t, i)) });
		return;
	}
	if (t === "y") {
		let e = s.y - o.y, t = r.y - e, i = r.y + r.height - s.height - e;
		Object.assign(o, { y: N(n, t, Math.max(t, i)) });
		return;
	}
	let c = a?.fields.find((e) => e.key === t && e.shape === "number" && e.section === "layout");
	if (c) {
		let e = I(c.min, i, n), r = I(c.max, i, n);
		Object.assign(o, { [t]: N(n, e, r) });
	}
}, un = (e, t, n, r, i) => {
	let a = e.items.find((e) => e.id === t);
	if (!a || a.locked) return;
	let o = F(e);
	if (a.kind === "widget") {
		n === "padding" && (a.layout.padding = N(r, 0, 128)), n === "x" && (a.frame.x = N(r, o.x, o.x + o.width - a.frame.width)), n === "y" && (a.frame.y = N(r, o.y, o.y + o.height - a.frame.height)), n === "width" && (a.frame.width = N(r, 1, o.x + o.width - a.frame.x)), n === "height" && (a.frame.height = N(r, 1, o.y + o.height - a.frame.y));
		return;
	}
	let s = a.primitive, c = L(a, i);
	if (P(s)) {
		if (n === "x") {
			let e = s.x_end - s.x_start;
			s.x_start = N(r, o.x, o.x + o.width - e - 1), s.x_end = s.x_start + e;
		}
		if (n === "y") {
			let e = s.y_end - s.y_start;
			s.y_start = N(r, o.y, o.y + o.height - e - 1), s.y_end = s.y_start + e;
		}
		n === "width" && (s.x_end = N(s.x_start + Math.max(1, r) - 1, s.x_start + 1, o.x + o.width - 1)), n === "height" && (s.y_end = N(s.y_start + Math.max(1, r) - 1, s.y_start + 1, o.y + o.height - 1));
	} else ln(a, n, r, o, e.display, c);
}, dn = (e) => e.items.forEach((t) => Lt(t, e)), fn = (e, t, n) => {
	(t === "width" || t === "height") && (e.display[t] = N(n, 64, 4096)), t === "padding" && (e.display.padding = N(n, 0, Math.floor((Math.min(e.display.width, e.display.height) - 1) / 2))), t === "snapSize" && (e.display.snapSize = N(n, 1, 256)), dn(e);
}, pn = (e, t) => {
	e.display.profileId = t.id, e.display.width = t.width, e.display.height = t.height, e.display.palette = t.defaultPalette, dn(e);
}, mn = (e, t) => {
	e.display.palette = t, r[t].includes(e.display.background) || (e.display.background = "white");
}, hn = (e, t) => {
	e.display.background = t;
}, gn = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r && (r[n] = !r[n]);
}, _n = (e, t) => {
	e.items = e.items.filter((e) => e.id !== t);
}, vn = (e, t, n, r) => {
	let i = [...e.items].reverse(), a = i.findIndex((e) => e.id === t);
	if (a < 0) return;
	let [o] = i.splice(a, 1), s = i.findIndex((e) => e.id === n);
	s < 0 || (i.splice(r === "before" ? s : s + 1, 0, o), e.items = i.reverse());
}, yn = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r?.kind === "widget" && (r.widget.options = {
		...r.widget.options,
		...n
	});
}, bn = (e, t, n, r) => {
	let i = e.items.find((e) => e.id === t);
	i?.kind === "widget" && (i.widget.sources = {
		...i.widget.sources,
		[n]: r
	});
}, xn = (e, t, n, r) => {
	let i = e.items.find((e) => e.id === t);
	if (i?.kind !== "primitive") return;
	let a = cn(n, L(i, r));
	i.primitive = {
		...i.primitive,
		...a
	};
}, Sn = (e, t, n, r) => {
	let i = F(r), a = Math.min(e.layout.defaultSize?.width ?? 240, i.width), o = Math.min(e.layout.defaultSize?.height ?? 144, i.height);
	return {
		id: Gt(),
		name: xt(r.items, e.id),
		kind: "widget",
		locked: !1,
		hidden: !1,
		widget: {
			type: e.id,
			version: e.version,
			sources: Object.fromEntries(e.sources.map((e) => [e.key, []])),
			options: p(e)
		},
		frame: {
			x: N(Math.round(t - a / 2), i.x, i.x + i.width - a),
			y: N(Math.round(n - o / 2), i.y, i.y + i.height - o),
			width: a,
			height: o
		},
		layout: { padding: 0 }
	};
}, Cn = (e, t, n, r, i) => {
	let { width: a, height: o } = i.display, s = Jt(e.find((e) => e.type === t.trim()), {
		x: Math.round(a / 2),
		y: Math.round(o / 2),
		displayWidth: a,
		displayHeight: o
	});
	if (!s) return;
	let c = {
		id: Gt(),
		name: xt(i.items, s.type),
		kind: "primitive",
		locked: !1,
		hidden: !1,
		primitive: s
	}, l = Nt(c);
	return It(c, Math.round(n - (l.x + l.width / 2)), Math.round(r - (l.y + l.height / 2))), Lt(c, i), c;
}, wn = (e, t) => {
	let n = F(e), r = e.items.length * Math.max(e.display.snapSize, 5) * 3 % Math.max(1, Math.min(n.width, n.height) / 3);
	return {
		x: Ft(n.x + Math.min(24 + r, Math.max(0, n.width - 1)), e, t),
		y: Ft(n.y + Math.min(24 + r, Math.max(0, n.height - 1)), e, t)
	};
}, Tn = (e, t) => {
	if (t === "visible") return !e.hidden;
	if (e.kind === "primitive") return Object.entries(e.primitive).find(([e]) => e === t)?.[1];
}, En = (e, t, n, r) => {
	let i = e.items.find((e) => e.id === t);
	if (!i || i.locked) return;
	let a = { ...i.expressions };
	r === null ? delete a[n] : a[n] = r ?? yt(Tn(i, n)), Object.keys(a).length === 0 ? delete i.expressions : i.expressions = a;
}, Dn = (e) => ({
	canUndo: !1,
	canRedo: !1,
	item: e
}), On = (e) => e.item !== void 0, kn = [
	{
		id: "undo",
		label: () => t.commands.undo,
		icon: () => "mdi:undo",
		shortcuts: [{
			key: "z",
			mod: !0
		}],
		isEnabled: (e) => e.canUndo,
		run: (e, t) => t.undo()
	},
	{
		id: "redo",
		label: () => t.commands.redo,
		icon: () => "mdi:redo",
		shortcuts: [{
			key: "z",
			mod: !0,
			shift: !0
		}, {
			key: "y",
			mod: !0
		}],
		isEnabled: (e) => e.canRedo,
		run: (e, t) => t.redo()
	},
	{
		id: "delete-item",
		label: () => t.commands.delete,
		icon: () => "mdi:delete-outline",
		shortcuts: [{ key: "Delete" }, { key: "Backspace" }],
		isEnabled: On,
		run: ({ item: e }, t) => {
			e && t.requestDelete(e.id);
		}
	},
	{
		id: "toggle-hidden",
		label: ({ item: e }) => e?.hidden ? t.commands.show : t.commands.hide,
		icon: ({ item: e }) => e?.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline",
		shortcuts: [],
		isEnabled: On,
		run: ({ item: e }, t) => {
			e && t.toggleFlag(e.id, "hidden");
		}
	},
	{
		id: "toggle-locked",
		label: ({ item: e }) => e?.locked ? t.commands.unlock : t.commands.lock,
		icon: ({ item: e }) => e?.locked ? "mdi:lock" : "mdi:lock-open-variant-outline",
		shortcuts: [],
		isEnabled: On,
		run: ({ item: e }, t) => {
			e && t.toggleFlag(e.id, "locked");
		}
	}
], An = (e) => {
	let t = kn.find((t) => t.id === e);
	if (!t) throw Error(`Unknown command ${e}`);
	return t;
}, jn = (e, t) => {
	let n = t.ctrlKey || t.metaKey;
	return t.key.toLowerCase() === e.key.toLowerCase() && n === !!e.mod && t.shiftKey === !!e.shift && !t.altKey;
}, Mn = (e) => kn.find((t) => t.shortcuts.some((t) => jn(t, e))), Nn = {
	Delete: "Del",
	Backspace: "⌫"
}, Pn = (e, t) => {
	let n = Nn[e.key] ?? e.key.toUpperCase();
	return t ? `${e.mod ? "⌘" : ""}${e.shift ? "⇧" : ""}${n}` : [
		e.mod ? "Ctrl" : "",
		e.shift ? "Shift" : "",
		n
	].filter(Boolean).join("+");
}, Fn = (e, t, n = !1) => {
	let r = e.label(t), [i] = e.shortcuts;
	return {
		label: r,
		icon: e.icon(t),
		title: i ? `${r} (${Pn(i, n)})` : r,
		enabled: e.isEnabled(t)
	};
}, In = (e, t = "custom") => {
	let n = o(t);
	return {
		id: "",
		schemaVersion: 1,
		name: "",
		status: "draft",
		language: e || "en",
		display: {
			profileId: n.id,
			width: n.width,
			height: n.height,
			palette: n.defaultPalette,
			background: "white",
			padding: 0,
			snapSize: 5
		},
		items: [],
		createdAt: "",
		updatedAt: ""
	};
}, Ln = (e) => ({
	name: e.name,
	width: e.display.width,
	height: e.display.height,
	palette: e.display.palette,
	padding: e.display.padding,
	snapSize: e.display.snapSize
}), Rn = (e, t) => {
	let i = {
		...Ln(e),
		...t
	}, a = structuredClone(e);
	return a.name = String(i.name), a.display.profileId = "custom", a.display.width = Math.round(Number(i.width) || 0), a.display.height = Math.round(Number(i.height) || 0), a.display.palette = i.palette in n ? i.palette : "bw", a.display.padding = Math.round(Number(i.padding) || 0), a.display.snapSize = Math.round(Number(i.snapSize) || 0), r[a.display.palette].includes(a.display.background) || (a.display.background = "white"), a;
}, zn = (e) => {
	let { width: t, height: n, padding: r, snapSize: i } = e.display;
	return !!e.name.trim() && t >= 64 && t <= 4096 && n >= 64 && n <= 4096 && r >= 0 && r * 2 < Math.min(t, n) && i >= 1 && i <= 256;
}, Bn = (e, t, n, r) => {
	let i = t.trim().toLocaleLowerCase(r);
	return e.filter((e) => !i || e.name.toLocaleLowerCase(r).includes(i)).sort((e, t) => n === "name" ? e.name.localeCompare(t.name, r) : t.updatedAt.localeCompare(e.updatedAt) || e.name.localeCompare(t.name, r));
}, Vn = (e, t, n) => {
	let r = new Set(t.map((e) => e.name.toLocaleLowerCase(n))), i = `${e.name} copy`, a = i, o = 2;
	for (; r.has(a.toLocaleLowerCase(n));) a = `${i} ${o++}`;
	return a;
}, Hn = () => [
	{
		name: "name",
		label: t.fields.name,
		required: !0,
		selector: { text: {} }
	},
	{
		name: "dimensions",
		type: "grid",
		flatten: !0,
		schema: [{
			name: "width",
			label: t.fields.width,
			required: !0,
			selector: { number: {
				mode: "box",
				min: 64,
				max: 4096,
				unit_of_measurement: "px"
			} }
		}, {
			name: "height",
			label: t.fields.height,
			required: !0,
			selector: { number: {
				mode: "box",
				min: 64,
				max: 4096,
				unit_of_measurement: "px"
			} }
		}]
	},
	{
		name: "palette",
		label: t.fields.palette,
		required: !0,
		selector: { select: {
			mode: "dropdown",
			options: Object.entries(n).map(([e, t]) => ({
				value: e,
				label: t
			}))
		} }
	},
	{
		name: "advanced",
		type: "expandable",
		flatten: !0,
		title: t.fields.advanced,
		expanded: !1,
		schema: [{
			name: "padding",
			label: t.fields.padding,
			selector: { number: {
				mode: "box",
				min: 0,
				max: 1024,
				unit_of_measurement: "px"
			} }
		}, {
			name: "snapSize",
			label: t.fields.snapSize,
			selector: { number: {
				mode: "box",
				min: 1,
				max: 256,
				unit_of_measurement: "px"
			} }
		}]
	}
], Un = (e) => "label" in e ? e.label : e.title ?? "", Wn = {
	bwr: "#d32f2f",
	bwry: "#d32f2f",
	bwy: "#d6a800",
	spectra6: "#246bfd"
}, Gn = (e) => Wn[e] ?? "#202124", Kn = (e, t) => {
	let n = new Date(e.updatedAt);
	return Number.isNaN(n.getTime()) ? "" : new Intl.DateTimeFormat(t, { dateStyle: "medium" }).format(n);
}, z = (e) => e.target.value, qn = (e) => e.composedPath().some((e) => e instanceof HTMLElement && (e.matches("input, textarea, select") || e.isContentEditable)), Jn = () => /Mac|iPhone|iPad/.test(navigator.platform), B = (e, t, ...n) => {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n[0],
		bubbles: !0,
		composed: !0
	}));
}, Yn = 100, Xn = class {
	constructor() {
		this.undoStack = [], this.redoStack = [];
	}
	get undoCount() {
		return this.undoStack.length;
	}
	get redoCount() {
		return this.redoStack.length;
	}
	record(e) {
		this.undoStack.push(structuredClone(e)), this.undoStack.length > Yn && this.undoStack.shift(), this.redoStack = [];
	}
	undo(e) {
		let t = this.undoStack.pop();
		if (t !== void 0) return this.redoStack.push(structuredClone(e)), t;
	}
	redo(e) {
		let t = this.redoStack.pop();
		if (t !== void 0) return this.undoStack.push(structuredClone(e)), t;
	}
	clear() {
		this.undoStack = [], this.redoStack = [];
	}
}, Zn = (e) => e.callWS({
	type: "opendisplay_studio/bootstrap",
	language: e.language
}), Qn = (e) => e.callWS({
	type: "opendisplay_studio/reload_widgets",
	language: e.language
}), $n = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/create_dashboard",
	dashboard: t
})).dashboard, er = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/update_dashboard",
	dashboard_id: t.id,
	dashboard: t
})).dashboard, tr = async (e, t) => {
	await e.callWS({
		type: "opendisplay_studio/delete_dashboard",
		dashboard_id: t
	});
}, nr = (e, t) => e.callWS({
	type: "opendisplay_studio/compose_preview",
	dashboard: structuredClone(t)
}), V = b`
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
`, H = b`
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
`, rr = b`
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
`, ir = .25, ar = 96, or = 3, sr = .1, cr = {
	zoom: 1,
	panX: 0,
	panY: 0
}, lr = (e, t) => ({
	...e,
	zoom: N(t, ir, 4)
}), ur = (e, t) => {
	let n = Math.max(100, e.width - ar), r = Math.max(100, e.height - ar);
	return {
		zoom: N(Math.min(n / t.width, r / t.height), ir, or),
		panX: 0,
		panY: 0
	};
}, dr = (e, t) => t.shiftKey ? lr(e, e.zoom + (t.deltaY < 0 ? sr : -.1)) : t.altKey ? {
	...e,
	panX: e.panX - t.deltaY
} : {
	...e,
	panY: e.panY - t.deltaY
}, fr = dt(class extends ft {
	constructor(e) {
		if (super(e), e.type !== ut.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
	}
	render(e) {
		return " " + Object.keys(e).filter((t) => e[t]).join(" ") + " ";
	}
	update(e, [t]) {
		if (this.st === void 0) {
			this.st = /* @__PURE__ */ new Set(), e.strings !== void 0 && (this.nt = new Set(e.strings.join(" ").split(/\s/).filter((e) => e !== "")));
			for (let e in t) t[e] && !this.nt?.has(e) && this.st.add(e);
			return this.render(t);
		}
		let n = e.element.classList;
		for (let e of this.st) e in t || (n.remove(e), this.st.delete(e));
		for (let e in t) {
			let r = !!t[e];
			r === this.st.has(e) || this.nt?.has(e) || (r ? (n.add(e), this.st.add(e)) : (n.remove(e), this.st.delete(e)));
		}
		return T;
	}
}), pr = (e) => {
	let { origin: t, threshold: n = 0, target: r = window, onActivate: i, onMove: a, onEnd: o, onCancel: s } = e, c = !1, l = () => {
		r.removeEventListener("pointermove", u), r.removeEventListener("pointerup", d), r.removeEventListener("pointercancel", f);
	}, u = (e) => {
		if (!c) {
			if (Math.hypot(e.clientX - t.clientX, e.clientY - t.clientY) < n) return;
			c = !0, i?.(e);
		}
		a?.(e);
	}, d = (e) => {
		l(), o?.(e, c);
	}, f = () => {
		l(), s?.();
	};
	return r.addEventListener("pointermove", u), r.addEventListener("pointerup", d), r.addEventListener("pointercancel", f), l;
}, mr = {
	position: [],
	handles: []
}, hr = (e, t, n) => {
	let r = e.primitive;
	if (!P(r)) return t;
	let i = t === "x" ? r.x_start > r.x_end : r.y_start > r.y_end;
	return `${t}_${(n === "start" ? !i : i) ? "start" : "end"}`;
}, gr = (e, t) => [
	...t.includes("w") ? [hr(e, "x", "start")] : [],
	...t.includes("e") ? [hr(e, "x", "end")] : [],
	...t.includes("n") ? [hr(e, "y", "start")] : [],
	...t.includes("s") ? [hr(e, "y", "end")] : []
], _r = (e, t) => {
	let n = new Set(Object.keys(e.expressions ?? {}));
	n.delete(ht);
	let r = t.fields.filter((e) => e.section === "layout" && n.has(e.key)), i = r.filter((e) => e.shape === "coordinate").map((e) => e.key);
	return t.geometry === "point" ? {
		position: i,
		handles: r.some((e) => e.shape !== "coordinate") ? [...Ct] : []
	} : {
		position: i,
		handles: Ct.filter((t) => gr(e, t).some((e) => n.has(e)))
	};
}, vr = (e, t) => {
	if (e.kind !== "primitive") return mr;
	let n = L(e, t);
	return n ? _r(e, n) : mr;
};
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/decorate.js
function U(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/ods-zoom-bar.ts
var yr = [
	.5,
	1,
	2,
	3
], br = .25, xr = class extends O {
	constructor(...e) {
		super(...e), this.zoom = 1;
	}
	static {
		this.styles = [V, b`
      :host {
        display: contents;
      }
      .zoom-controls {
        position: absolute;
        right: 16px;
        bottom: 14px;
        display: flex;
        align-items: center;
        padding: 4px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
        background: var(--studio-surface);
        box-shadow: 0 8px 24px rgba(28, 38, 48, 0.14);
      }
      .zoom-controls button {
        min-width: 34px;
        height: 30px;
        padding: 0 8px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .zoom-controls button:hover {
        color: var(--studio-text);
        background: var(--secondary-background-color, #eef1f4);
      }
      .zoom-controls button.active {
        color: #fff;
        background: var(--studio-accent);
      }
      @media (max-width: 900px) {
        .zoom-controls {
          right: 8px;
          bottom: 8px;
        }
        .zoom-controls button:nth-of-type(2),
        .zoom-controls button:nth-of-type(4) {
          display: none;
        }
      }
    `];
	}
	zoomTo(e) {
		B(this, "zoom-change", { zoom: e });
	}
	render() {
		return w`
      <div class="zoom-controls">
        <button
          aria-label=${t.zoom.out}
          @click=${() => this.zoomTo(this.zoom - br)}
        >
          −
        </button>
        ${yr.map((e) => w`
            <button
              class=${this.zoom === e ? "active" : ""}
              aria-label=${t.zoom.preset(e)}
              @click=${() => this.zoomTo(e)}
            >
              ${t.zoom.preset(e)}
            </button>
          `)}
        <button
          aria-label=${t.zoom.in}
          @click=${() => this.zoomTo(this.zoom + br)}
        >
          +
        </button>
        <button
          aria-label=${t.zoom.reset}
          @click=${() => B(this, "zoom-reset")}
        >
          ${t.zoom.reset}
        </button>
        <button
          aria-label=${t.zoom.fit}
          @click=${() => B(this, "zoom-fit")}
        >
          ${t.zoom.fit}
        </button>
      </div>
    `;
	}
};
U([A({ type: Number })], xr.prototype, "zoom", void 0), xr = U([k("ods-zoom-bar")], xr);
//#endregion
//#region src/ods-canvas.ts
var Sr = 3, Cr = (e, t) => ({
	left: `${e.x / t.width * 100}%`,
	top: `${e.y / t.height * 100}%`,
	width: `${e.width / t.width * 100}%`,
	height: `${e.height / t.height * 100}%`
}), W = class extends O {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.snapEnabled = !0, this.acceptingDrop = !1, this.canUndo = !1, this.canRedo = !1, this.viewport = cr;
	}
	static {
		this.styles = [V, b`
      :host {
        display: contents;
      }
      .workspace {
        min-width: 0;
        min-height: 0;
        display: grid;
        grid-template-rows: 42px minmax(0, 1fr);
        background: var(--primary-background-color, #f4f6f8);
        color: var(--studio-text);
        overflow: hidden;
      }
      .history-controls {
        flex: none;
        display: flex;
        align-items: center;
        gap: 2px;
        margin-inline-start: auto;
      }
      .history-controls button {
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        padding: 0;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--studio-muted);
      }
      .history-controls button:hover:not(:disabled) {
        color: var(--studio-text);
        background: var(--secondary-background-color, #eef1f4);
      }
      .history-controls button:disabled {
        cursor: default;
        opacity: 0.32;
      }
      .history-controls ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
      .workspace-meta {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 0 16px;
        border-bottom: 1px solid var(--studio-border);
        color: var(--studio-muted);
        background: var(--studio-surface);
        font: 11px var(--code-font-family, monospace);
      }
      .tool-toggle {
        display: inline-flex;
        flex: none;
        align-items: center;
        gap: 6px;
        min-height: 28px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--studio-surface);
        color: var(--studio-muted);
        font-size: 10px;
        line-height: 1;
        white-space: nowrap;
      }
      .tool-toggle ha-icon {
        width: 14px;
        height: 14px;
        --mdc-icon-size: 14px;
      }
      .tool-toggle.active {
        color: var(--studio-accent);
        border-color: color-mix(
          in srgb,
          var(--studio-accent) 65%,
          var(--studio-border)
        );
        background: var(--studio-accent-soft);
      }
      .zoom-readout {
        min-width: 42px;
        text-align: right;
        color: var(--studio-text);
      }
      .canvas-stage {
        position: relative;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        overflow-anchor: none;
        overscroll-behavior: contain;
        contain: layout paint;
        background-color: var(--secondary-background-color, #eef1f4);
        background-image: radial-gradient(
          circle,
          color-mix(in srgb, var(--studio-muted) 27%, transparent) 0.8px,
          transparent 0.9px
        );
        background-size: 18px 18px;
      }
      .canvas-stage.accepting-drop {
        box-shadow: inset 0 0 0 3px var(--studio-accent);
      }
      .canvas-viewport {
        position: absolute;
        left: 50%;
        top: 50%;
        transform-origin: center;
        overflow-anchor: none;
      }
      .canvas {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        box-shadow: 0 14px 38px rgba(28, 38, 48, 0.18);
        user-select: none;
        touch-action: none;
        overflow-anchor: none;
      }
      .canvas > img,
      .canvas-placeholder {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
      }
      .canvas-placeholder {
        display: grid;
        place-items: center;
        color: #59636b;
        background: #fff;
      }
      .working-area {
        position: absolute;
        pointer-events: none;
        z-index: 2;
        border: 1px dashed rgba(3, 169, 244, 0.72);
        background-image: radial-gradient(
          circle,
          rgba(3, 169, 244, 0.22) 0.7px,
          transparent 0.8px
        );
        background-size: max(12px, var(--snap-size)) max(12px, var(--snap-size));
      }
      .selection {
        position: absolute;
        z-index: 3;
        min-width: 3px;
        min-height: 3px;
        border: 1px solid transparent;
        cursor: move;
        touch-action: none;
      }
      .selection:hover {
        border-color: rgba(3, 169, 244, 0.65);
      }
      .selection.selected {
        border: 2px solid #00aef0;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9);
      }
      .selection.locked {
        cursor: default;
        border-style: dashed;
      }
      .selection.hidden {
        background: rgba(3, 169, 244, 0.09);
        border: 1px dashed rgba(3, 169, 244, 0.75);
      }
      .hidden-label {
        position: absolute;
        left: 3px;
        top: 3px;
        color: #006d99;
        background: rgba(255, 255, 255, 0.9);
        padding: 1px 4px;
        font-size: 8px;
      }
      .lock-badge {
        position: absolute;
        right: 2px;
        top: 2px;
        width: 15px;
        height: 15px;
        padding: 2px;
        color: #fff;
        background: #283746;
        border-radius: 3px;
      }
      .resize-handle {
        position: absolute;
        z-index: 7;
        width: 11px;
        height: 11px;
        padding: 0;
        border: 2px solid #00aef0;
        border-radius: 1px;
        background: #fff;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85);
        touch-action: none;
      }
      .resize-nw {
        left: 0;
        top: 0;
        transform: translate(-50%, -50%);
        cursor: nwse-resize;
      }
      .resize-n {
        left: 50%;
        top: 0;
        transform: translate(-50%, -50%);
        cursor: ns-resize;
      }
      .resize-ne {
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        cursor: nesw-resize;
      }
      .resize-e {
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
        cursor: ew-resize;
      }
      .resize-se {
        right: 0;
        bottom: 0;
        transform: translate(50%, 50%);
        cursor: nwse-resize;
      }
      .resize-s {
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
        cursor: ns-resize;
      }
      .resize-sw {
        left: 0;
        bottom: 0;
        transform: translate(-50%, 50%);
        cursor: nesw-resize;
      }
      .resize-w {
        left: 0;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: ew-resize;
      }
      .selection-size {
        position: absolute;
        z-index: 6;
        left: 50%;
        top: calc(100% + 9px);
        transform: translateX(-50%);
        min-width: max-content;
        padding: 2px 7px;
        border: 1px solid #2788b8;
        border-radius: 999px;
        color: #9cddff;
        background: #102033;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);
        font: 700 10px/1.2 var(--code-font-family, monospace);
        white-space: nowrap;
        pointer-events: none;
      }
      @media (max-width: 900px) {
        .workspace-meta {
          gap: 8px;
          padding: 0 8px;
        }
        .workspace-meta > span:nth-child(2),
        .workspace-meta > span:nth-child(3) {
          display: none;
        }
      }
    `];
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopGesture?.();
	}
	displayPointAt(e, t) {
		let n = this.canvas;
		if (!n) return;
		let r = n.getBoundingClientRect();
		if (e < r.left || e > r.right || t < r.top || t > r.bottom) return;
		let { width: i, height: a } = this.dashboard.display;
		return {
			x: (e - r.left) / r.width * i,
			y: (t - r.top) / r.height * a
		};
	}
	setViewport(e) {
		B(this, "viewport-change", e);
	}
	resetView() {
		this.setViewport(cr);
	}
	fitView() {
		let e = this.stage;
		e && this.setViewport(ur({
			width: e.clientWidth,
			height: e.clientHeight
		}, this.dashboard.display));
	}
	onWheel(e) {
		e.preventDefault(), this.setViewport(dr(this.viewport, e));
	}
	beginGesture(e, t, n) {
		if (e.stopPropagation(), e.preventDefault(), B(this, "item-select", { itemId: t.id }), t.locked) return;
		let r = vr(t, this.primitives);
		if (n ? r.handles.includes(n) : r.position.length > 0) return;
		this.stopGesture?.();
		let i = structuredClone(this.dashboard), a = structuredClone(t), o = this.measuredBounds(t), s = t.kind === "widget" ? this.widgets.find((e) => e.id === t.widget.type)?.layout.minSize : void 0;
		this.stopGesture = pr({
			origin: e,
			threshold: Sr,
			onMove: (t) => {
				let r = this.canvas;
				if (!r) return;
				let i = r.getBoundingClientRect(), { width: c, height: l } = this.dashboard.display, u = Math.round((t.clientX - e.clientX) / i.width * c), d = Math.round((t.clientY - e.clientY) / i.height * l), f = n ? {
					mode: "resize",
					handle: n,
					shiftKey: t.shiftKey
				} : { mode: "move" };
				B(this, "item-transform", { item: Ut(a, f, u, d, this.dashboard, {
					snapEnabled: this.snapEnabled,
					minSize: s,
					measured: o
				}) });
			},
			onEnd: (e, t) => {
				t && B(this, "item-transform-end", { before: i });
			}
		});
	}
	runCommand(e) {
		B(this, "command", { id: e });
	}
	toggleSnap() {
		B(this, "snap-toggle");
	}
	deselect() {
		B(this, "item-select", { itemId: "" });
	}
	onStageDragOver(e) {
		this.acceptingDrop && e.preventDefault();
	}
	onStageDrop(e) {
		e.preventDefault();
	}
	onZoomChange(e) {
		e.stopPropagation(), this.setViewport(lr(this.viewport, e.detail.zoom));
	}
	onZoomReset(e) {
		e.stopPropagation(), this.resetView();
	}
	onZoomFit(e) {
		e.stopPropagation(), this.fitView();
	}
	measuredBounds(e) {
		return this.preview?.itemBounds[e.id];
	}
	resizeHandleLabel(e, n) {
		return t.canvas.resizeHandle(e.name, t.canvas.sides[n]);
	}
	renderBadges(e) {
		return w`
      ${e.hidden ? w`
              <span class="hidden-label">${t.canvas.hidden}</span>
            ` : E}
      ${e.locked ? w`
              <ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>
            ` : this.renderExpressionLock(e)}
    `;
	}
	renderExpressionLock(e) {
		let { position: n } = vr(e, this.primitives);
		if (n.length === 0) return E;
		let r = t.expression.positionLocked(n.join(", "));
		return w`
      <ha-icon
        class="lock-badge expression-lock"
        icon="mdi:function-variant"
        title=${r}
        aria-label=${r}
      ></ha-icon>
    `;
	}
	renderSelectionSize(e) {
		let n = Math.round(e.width), r = Math.round(e.height);
		return w`
      <output class="selection-size" aria-live="off">
        ${t.common.size(n, r)}
      </output>
    `;
	}
	renderHandles(e) {
		let t = vr(e, this.primitives).handles;
		return Ct.filter((e) => !t.includes(e)).map((t) => w`
        <button
          data-resize-handle=${t}
          class=${`resize-handle resize-${t}`}
          tabindex="-1"
          aria-label=${this.resizeHandleLabel(e, t)}
          @pointerdown=${(n) => this.beginGesture(n, e, t)}
        ></button>
      `);
	}
	renderItem(e) {
		let t = Nt(e, this.measuredBounds(e)), n = e.id === this.selectedItemId, r = fr({
			selection: !0,
			selected: n,
			locked: e.locked,
			hidden: e.hidden
		});
		return w`
      <div
        data-item-id=${e.id}
        class=${r}
        style=${M(Cr(t, this.dashboard.display))}
        @pointerdown=${(t) => this.beginGesture(t, e)}
      >
        ${this.renderBadges(e)}
        ${n ? this.renderSelectionSize(t) : E}
        ${n && !e.locked ? this.renderHandles(e) : E}
      </div>
    `;
	}
	renderHistoryButton(e) {
		let t = Fn(An(e), {
			canUndo: this.canUndo,
			canRedo: this.canRedo
		}, Jn());
		return w`
      <button
        aria-label=${t.label}
        title=${t.title}
        ?disabled=${!t.enabled}
        @click=${() => this.runCommand(e)}
      >
        <ha-icon icon=${t.icon}></ha-icon>
      </button>
    `;
	}
	renderToolbar() {
		let e = this.dashboard, { width: n, height: r, padding: i, snapSize: a } = e.display, o = fr({
			"tool-toggle": !0,
			active: this.snapEnabled
		});
		return w`
      <div class="workspace-meta">
        <span>${t.common.sizeInPixels(n, r)}</span>
        <span>${t.canvas.layers(e.items.length)}</span>
        <span>${t.canvas.padding(i)}</span>
        <div class="history-controls">
          ${this.renderHistoryButton("undo")}
          ${this.renderHistoryButton("redo")}
        </div>
        <button
          class=${o}
          aria-pressed=${this.snapEnabled}
          @click=${this.toggleSnap}
        >
          <ha-icon icon="mdi:magnet"></ha-icon>
          <span>${t.canvas.snap(a)}</span>
        </button>
        <span class="zoom-readout">
          ${Math.round(this.viewport.zoom * 100)}%
        </span>
      </div>
    `;
	}
	renderPreview() {
		return this.preview ? w`
      <img
        draggable="false"
        src=${this.preview.imageUrl}
        alt=${t.canvas.previewAlt}
      />
    ` : w`
        <div class="canvas-placeholder">${t.canvas.rendering}</div>
      `;
	}
	renderStage() {
		let e = this.dashboard, { width: t, height: n, snapSize: r } = e.display, { zoom: i, panX: a, panY: o } = this.viewport, s = M({ transform: `translate(${a}px, ${o}px) scale(${i})` }), c = M({
			width: `${t}px`,
			height: `${n}px`
		}), l = M({
			...Cr(F(e), e.display),
			"--snap-size": `${r * i}px`
		});
		return w`
      <section
        class=${fr({
			"canvas-stage": !0,
			"accepting-drop": this.acceptingDrop
		})}
        @wheel=${this.onWheel}
        @dragover=${this.onStageDragOver}
        @drop=${this.onStageDrop}
      >
        <div class="canvas-viewport" style=${s}>
          <div
            class="canvas"
            style=${c}
            @pointerdown=${this.deselect}
          >
            ${this.renderPreview()}
            <div
              class="working-area"
              aria-hidden="true"
              style=${l}
            ></div>
            ${e.items.map((e) => this.renderItem(e))}
          </div>
        </div>
        <ods-zoom-bar
          .zoom=${i}
          @zoom-change=${this.onZoomChange}
          @zoom-reset=${this.onZoomReset}
          @zoom-fit=${this.onZoomFit}
        ></ods-zoom-bar>
      </section>
    `;
	}
	render() {
		return w`
      <main class="workspace">
        ${this.renderToolbar()} ${this.renderStage()}
      </main>
    `;
	}
};
U([A({ attribute: !1 })], W.prototype, "dashboard", void 0), U([A({ attribute: !1 })], W.prototype, "preview", void 0), U([A({ attribute: !1 })], W.prototype, "widgets", void 0), U([A({ attribute: !1 })], W.prototype, "primitives", void 0), U([A()], W.prototype, "selectedItemId", void 0), U([A({ type: Boolean })], W.prototype, "snapEnabled", void 0), U([A({ type: Boolean })], W.prototype, "acceptingDrop", void 0), U([A({ type: Boolean })], W.prototype, "canUndo", void 0), U([A({ type: Boolean })], W.prototype, "canRedo", void 0), U([A({ attribute: !1 })], W.prototype, "viewport", void 0), U([lt(".canvas")], W.prototype, "canvas", void 0), U([lt(".canvas-stage")], W.prototype, "stage", void 0), W = U([k("ods-canvas")], W);
//#endregion
//#region src/ods-code-view.ts
var wr = {
	idle: "mdi:content-copy",
	copied: "mdi:check",
	failed: "mdi:alert-circle-outline"
}, Tr = 2200, Er = class extends O {
	constructor(...e) {
		super(...e), this.copyState = "idle";
	}
	static {
		this.styles = [
			V,
			H,
			b`
      :host {
        display: contents;
      }
      .code-workspace {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: clamp(18px, 3vw, 36px);
        background: var(--primary-background-color, #f5f7f8);
      }
      .code-panel {
        width: min(1080px, 100%);
        min-height: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-inline: auto;
        padding: clamp(16px, 2vw, 24px);
        border: 1px solid var(--studio-border);
        border-radius: 12px;
        background: var(--studio-surface);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }
      .code-panel > header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
      }
      .code-panel h1 {
        margin: 4px 0 0;
        font-size: 20px;
      }
      .code-panel p {
        margin: 5px 0 0;
        color: var(--studio-muted);
        font-size: 12px;
      }
      .code-panel textarea {
        flex: 1;
        min-height: 420px;
        width: 100%;
        resize: none;
        padding: 15px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
        outline: 0;
        color: #d9e4ee;
        background: #121a24;
        font: 12px/1.55 var(--code-font-family, monospace);
        white-space: pre;
        tab-size: 2;
      }
      .code-panel textarea:focus {
        border-color: var(--studio-accent);
        box-shadow: 0 0 0 1px var(--studio-accent);
      }
      .copy-status {
        min-height: 16px;
        color: var(--studio-muted);
        font-size: 11px;
        text-align: end;
      }
      @media (max-width: 600px) {
        .code-workspace {
          padding: 10px;
        }
        .code-panel {
          padding: 13px;
        }
        .code-panel > header {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `
		];
	}
	willUpdate(e) {
		e.has("preview") && (this.copyState = "idle");
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.copyTimer && window.clearTimeout(this.copyTimer);
	}
	async copy() {
		if (this.preview?.yaml) {
			this.copyTimer && window.clearTimeout(this.copyTimer);
			try {
				await navigator.clipboard.writeText(this.preview.yaml), this.copyState = "copied";
			} catch {
				this.copyState = "failed";
			}
			this.copyTimer = window.setTimeout(() => {
				this.copyState = "idle";
			}, Tr);
		}
	}
	render() {
		return w`
      <main class="code-workspace">
        <section class="code-panel" aria-labelledby="generated-code-title">
          <header>
            <div>
              <span class="eyebrow">${t.code.eyebrow}</span>
              <h1 id="generated-code-title">${t.code.title}</h1>
              <p>${t.code.description}</p>
            </div>
            <ha-button
              appearance="plain"
              aria-label=${t.code.copyLabel}
              .disabled=${!this.preview?.yaml}
              @click=${this.copy}
            >
              <ha-icon
                slot="start"
                .icon=${wr[this.copyState]}
              ></ha-icon>
              ${t.code.copy[this.copyState]}
            </ha-button>
          </header>
          ${this.preview?.warnings.map((e) => w`
                <ha-alert alert-type="warning">${e}</ha-alert>
              `) ?? E}
          <textarea
            aria-label=${t.code.yaml}
            readonly
            spellcheck="false"
            dir="ltr"
            .value=${this.preview?.yaml ?? ""}
          ></textarea>
          <output class="copy-status" aria-live="polite">
            ${t.code.status[this.copyState]}
          </output>
        </section>
      </main>
    `;
	}
};
U([A({ attribute: !1 })], Er.prototype, "preview", void 0), U([j()], Er.prototype, "copyState", void 0), Er = U([k("ods-code-view")], Er);
//#endregion
//#region src/ods-confirm-dialog.ts
var Dr = class extends O {
	constructor(...e) {
		super(...e), this.eyebrow = "", this.heading = "", this.body = "", this.confirmLabel = "";
	}
	static {
		this.styles = [
			V,
			H,
			b`
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
        backdrop-filter: blur(3px);
      }
      .dialog {
        width: min(430px, 100%);
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
        padding: 18px 20px 12px;
      }
      .dialog h2 {
        margin: 3px 0 0;
        font-size: 21px;
      }
      .dialog > p {
        margin: 0;
        padding: 4px 20px 18px;
        color: var(--studio-muted);
        font-size: 13px;
        line-height: 1.5;
      }
      .dialog footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 14px 20px;
        border-top: 1px solid var(--studio-border);
      }
      .confirm {
        color: var(--error-color, #db4437);
      }
    `
		];
	}
	cancel() {
		B(this, "confirm-cancel");
	}
	accept() {
		B(this, "confirm-accept");
	}
	onScrimClick(e) {
		e.target === e.currentTarget && this.cancel();
	}
	render() {
		return w`
      <div class="scrim" role="presentation" @click=${this.onScrimClick}>
        <section
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <header>
            <div>
              <span class="eyebrow">${this.eyebrow}</span>
              <h2 id="confirm-title">${this.heading}</h2>
            </div>
            <button
              class="icon-button"
              aria-label=${t.common.close}
              @click=${this.cancel}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <p>${this.body}</p>
          <footer>
            <ha-button appearance="plain" @click=${this.cancel}>
              ${t.common.cancel}
            </ha-button>
            <ha-button
              class="confirm"
              appearance="filled"
              @click=${this.accept}
            >
              ${this.confirmLabel}
            </ha-button>
          </footer>
        </section>
      </div>
    `;
	}
};
U([A()], Dr.prototype, "eyebrow", void 0), U([A()], Dr.prototype, "heading", void 0), U([A()], Dr.prototype, "body", void 0), U([A()], Dr.prototype, "confirmLabel", void 0), Dr = U([k("ods-confirm-dialog")], Dr);
//#endregion
//#region src/ods-context-menu.ts
var Or = class extends O {
	constructor(...e) {
		super(...e), this.entries = [], this.label = "";
	}
	static {
		this.styles = [V, b`
      :host {
        display: block;
        width: 190px;
      }
      .menu {
        padding: 5px;
        border: 1px solid var(--studio-border);
        border-radius: 10px;
        background: var(--studio-surface);
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
      }
      .menu button {
        width: 100%;
        min-height: 36px;
        display: grid;
        grid-template-columns: 20px minmax(0, 1fr);
        align-items: center;
        gap: 8px;
        padding: 0 9px;
        border: 0;
        border-radius: 6px;
        text-align: start;
        color: var(--studio-text);
        background: transparent;
        font-size: 12px;
      }
      .menu button:hover,
      .menu button:focus-visible {
        outline: 0;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .menu button.delete {
        margin-top: 4px;
        border-top: 1px solid var(--studio-border);
        border-radius: 0 0 6px 6px;
        color: var(--error-color, #db4437);
      }
      .menu ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
    `];
	}
	render() {
		return w`
      <div class="menu" role="menu" aria-label=${this.label}>
        ${this.entries.map((e) => w`
            <button
              class=${e.danger ? "delete" : ""}
              role="menuitem"
              @click=${(t) => {
			t.stopPropagation(), B(this, "menu-select", { id: e.id });
		}}
            >
              <ha-icon icon=${e.icon}></ha-icon>
              <span>${e.label}</span>
            </button>
          `)}
      </div>
    `;
	}
};
U([A({ attribute: !1 })], Or.prototype, "entries", void 0), U([A()], Or.prototype, "label", void 0), Or = U([k("ods-context-menu")], Or);
//#endregion
//#region src/ods-dashboard-card.ts
var kr = [
	{
		id: "rename",
		label: t.gallery.menu.rename,
		icon: "mdi:pencil-outline"
	},
	{
		id: "duplicate",
		label: t.gallery.menu.duplicate,
		icon: "mdi:content-copy"
	},
	{
		id: "settings",
		label: t.gallery.menu.settings,
		icon: "mdi:monitor-cog"
	},
	{
		id: "delete",
		label: t.gallery.menu.delete,
		icon: "mdi:delete-outline",
		danger: !0
	}
], G = class extends O {
	constructor(...e) {
		super(...e), this.language = "en", this.menuOpen = !1, this.renaming = !1, this.draftName = "";
	}
	static {
		this.styles = [
			V,
			H,
			rr,
			b`
      :host {
        display: contents;
      }
      .dashboard-card {
        position: relative;
        display: grid;
        grid-template-rows: 150px auto;
      }
      .dashboard-card.menu-open {
        z-index: 20;
      }
      .dashboard-card-open {
        position: absolute;
        inset: 0;
        z-index: 1;
        padding: 0;
        border: 0;
        border-radius: inherit;
        background: transparent;
      }
      .dashboard-card-open:focus-visible {
        outline: 2px solid var(--studio-accent);
        outline-offset: 2px;
      }
      .dashboard-card-preview {
        position: relative;
        display: grid;
        place-items: center;
        overflow: hidden;
        padding: 23px;
        border-radius: 12px 12px 0 0;
        background: color-mix(
          in srgb,
          var(--primary-background-color, #f5f7f8) 70%,
          var(--studio-surface)
        );
        pointer-events: none;
      }
      .dashboard-miniature {
        position: relative;
        width: min(145px, 70%);
        max-height: 96px;
        overflow: hidden;
        border: 2px solid
          color-mix(in srgb, var(--dashboard-accent) 22%, var(--studio-border));
        border-radius: 9px;
        box-shadow: 0 7px 18px rgba(0, 0, 0, 0.12);
      }
      .dashboard-miniature > span {
        position: absolute;
        display: block;
        border-radius: 99px;
      }
      .miniature-title {
        left: 12%;
        top: 25%;
        width: 25%;
        height: 4%;
        min-height: 3px;
        background: color-mix(in srgb, var(--studio-muted) 50%, transparent);
      }
      .miniature-accent {
        right: 12%;
        top: 25%;
        width: 5px;
        height: 5px;
        background: var(--dashboard-accent);
      }
      .miniature-line {
        left: 12%;
        bottom: 26%;
        width: 48%;
        height: 4%;
        min-height: 3px;
        background: color-mix(in srgb, var(--studio-muted) 28%, transparent);
      }
      .miniature-line.long {
        bottom: 39%;
        width: 72%;
        height: 13%;
        background: color-mix(
          in srgb,
          var(--dashboard-accent) 18%,
          var(--studio-surface)
        );
      }
      .dashboard-resolution {
        position: absolute;
        right: 11px;
        bottom: 8px;
        color: var(--studio-muted);
        font: 9px var(--code-font-family, monospace);
      }
      .dashboard-card-copy {
        min-width: 0;
        display: grid;
        align-content: start;
        gap: 7px;
        padding: 13px 15px 15px;
        border-radius: 0 0 12px 12px;
        pointer-events: none;
      }
      .dashboard-card-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .dashboard-card-title strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }
      .dashboard-card-title .status {
        flex: none;
        padding: 3px 7px;
        font-size: 8px;
      }
      .dashboard-rename-input {
        position: relative;
        z-index: 7;
        min-width: 0;
        width: 100%;
        height: 28px;
        padding: 0 7px;
        border: 1px solid var(--studio-accent);
        border-radius: 6px;
        outline: 0;
        background: var(--secondary-background-color, #f3f5f6);
        font-size: 13px;
        font-weight: 700;
        pointer-events: auto;
      }
      .dashboard-card-meta {
        display: flex;
        align-items: center;
        gap: 7px;
        color: var(--studio-muted);
        font-size: 10px;
      }
      .dashboard-card-meta > span + span::before {
        content: "·";
        margin-right: 7px;
      }
      .dashboard-card-copy small {
        color: var(--studio-muted);
        font-size: 10px;
      }
      .palette-dots {
        display: inline-flex;
        align-items: center;
        gap: 2px;
      }
      .palette-dots i {
        width: 8px;
        height: 8px;
        border: 1px solid
          color-mix(in srgb, var(--studio-text) 22%, transparent);
        border-radius: 50%;
      }
      .dashboard-menu-trigger {
        position: absolute;
        inset-block-start: 9px;
        inset-inline-end: 9px;
        z-index: 5;
        width: 32px;
        height: 32px;
        display: grid;
        place-items: center;
        padding: 0;
        border: 0;
        border-radius: 8px;
        color: var(--studio-muted);
        background: color-mix(in srgb, var(--studio-surface) 90%, transparent);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        opacity: 0;
        pointer-events: none;
        transition:
          opacity 120ms ease,
          color 120ms ease,
          background 120ms ease;
      }
      .dashboard-menu-trigger:hover,
      .dashboard-menu-trigger:focus-visible {
        color: var(--studio-text);
        background: var(--studio-surface);
        outline: 0;
      }
      .dashboard-card:hover .dashboard-menu-trigger,
      .dashboard-card:focus-within .dashboard-menu-trigger,
      .dashboard-card.menu-open .dashboard-menu-trigger {
        opacity: 1;
        pointer-events: auto;
      }
      .dashboard-menu-trigger ha-icon {
        width: 17px;
        height: 17px;
        --mdc-icon-size: 17px;
      }
      .dashboard-menu {
        position: absolute;
        inset-block-start: 45px;
        inset-inline-end: 9px;
        z-index: 8;
      }
      @media (hover: none) {
        .dashboard-menu-trigger {
          opacity: 1;
          pointer-events: auto;
        }
      }
    `
		];
	}
	updated(e) {
		e.has("renaming") && this.renaming && (this.renameInput?.focus(), this.renameInput?.select());
	}
	get menuId() {
		return `dashboard-menu-${this.dashboard.id}`;
	}
	open() {
		B(this, "dashboard-open", { dashboard: this.dashboard });
	}
	toggleMenu(e) {
		e.stopPropagation(), B(this, "dashboard-menu-toggle", { dashboardId: this.dashboard.id });
	}
	onMenuSelect(e) {
		let t = kr.find((t) => t.id === e.detail.id);
		t && (e.stopPropagation(), B(this, "dashboard-menu-action", {
			dashboard: this.dashboard,
			action: t.id
		}));
	}
	onRenameInput(e) {
		B(this, "dashboard-rename-input", { name: z(e) });
	}
	onRenameKeyDown(e) {
		e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), B(this, "dashboard-rename-commit")) : e.key === "Escape" && (e.preventDefault(), B(this, "dashboard-rename-cancel"));
	}
	commitRename() {
		B(this, "dashboard-rename-commit");
	}
	renderMiniature() {
		let { display: e } = this.dashboard;
		return w`
      <div class="dashboard-card-preview">
        <div class="dashboard-miniature" style=${M({
			aspectRatio: `${e.width} / ${e.height}`,
			background: e.background,
			"--dashboard-accent": Gn(e.palette)
		})}>
          <span class="miniature-title"></span>
          <span class="miniature-accent"></span>
          <span class="miniature-line long"></span>
          <span class="miniature-line"></span>
        </div>
        <span class="dashboard-resolution">
          ${t.common.size(e.width, e.height)}
        </span>
      </div>
    `;
	}
	renderTitle() {
		let { name: e, status: n } = this.dashboard;
		return w`
      <span class="dashboard-card-title">
        ${this.renaming ? w`
                <input
                  class="dashboard-rename-input"
                  aria-label=${t.gallery.renameField(e)}
                  .value=${this.draftName}
                  @input=${this.onRenameInput}
                  @keydown=${this.onRenameKeyDown}
                  @blur=${this.commitRename}
                />
              ` : w`
                <strong>${e}</strong>
              `}
        <span class=${`status ${n}`}>${n}</span>
      </span>
    `;
	}
	renderMeta() {
		let { display: e } = this.dashboard;
		return w`
      <span class="dashboard-card-meta">
        <span>${t.common.size(e.width, e.height)}</span>
        <span
          class="palette-dots"
          aria-label=${n[e.palette]}
        >
          ${r[e.palette].map((e) => w`
              <i style=${M({ background: e })}></i>
            `)}
        </span>
        <span>${n[e.palette]}</span>
      </span>
    `;
	}
	renderMenu() {
		return this.menuOpen ? w`
      <ods-context-menu
        class="dashboard-menu"
        id=${this.menuId}
        label=${t.gallery.menuFor(this.dashboard.name)}
        .entries=${kr}
        @menu-select=${this.onMenuSelect}
      ></ods-context-menu>
    ` : E;
	}
	render() {
		let e = this.dashboard;
		return w`
      <article class=${fr({
			"dashboard-card": !0,
			"menu-open": this.menuOpen
		})} data-dashboard-id=${e.id}>
        ${this.renderMiniature()}
        <div class="dashboard-card-copy">
          ${this.renderTitle()} ${this.renderMeta()}
          <small>
            ${t.gallery.updated(Kn(e, this.language))}
          </small>
        </div>
        <button
          class="dashboard-card-open"
          aria-label=${t.gallery.open(e.name)}
          @click=${this.open}
        ></button>
        <button
          class="dashboard-menu-trigger"
          aria-label=${t.gallery.actionsFor(e.name)}
          aria-haspopup="menu"
          aria-controls=${this.menuId}
          aria-expanded=${this.menuOpen}
          @click=${this.toggleMenu}
        >
          <ha-icon icon="mdi:dots-horizontal"></ha-icon>
        </button>
        ${this.renderMenu()}
      </article>
    `;
	}
};
U([A({ attribute: !1 })], G.prototype, "dashboard", void 0), U([A()], G.prototype, "language", void 0), U([A({ type: Boolean })], G.prototype, "menuOpen", void 0), U([A({ type: Boolean })], G.prototype, "renaming", void 0), U([A()], G.prototype, "draftName", void 0), U([lt(".dashboard-rename-input")], G.prototype, "renameInput", void 0), G = U([k("ods-dashboard-card")], G);
//#endregion
//#region src/ods-gallery.ts
var K = class extends O {
	constructor(...e) {
		super(...e), this.dashboards = [], this.error = "", this.saving = !1, this.searchText = "", this.sort = "updated", this.menuDashboardId = "", this.onOutsidePointerDown = (e) => {
			this.menuDashboardId && (e.composedPath().some((e) => e instanceof HTMLElement && (e.classList.contains("dashboard-menu") || e.classList.contains("dashboard-menu-trigger"))) || (this.menuDashboardId = ""));
		}, this.onKeyDown = (e) => {
			e.key === "Escape" && (this.menuDashboardId ? (this.menuDashboardId = "", e.stopPropagation()) : this.dialog && (B(this, "dashboard-dialog-close"), e.stopPropagation()));
		};
	}
	static {
		this.styles = [
			V,
			H,
			rr,
			b`
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
    `
		];
	}
	get language() {
		return this.hass?.language || "en";
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("keydown", this.onKeyDown), window.addEventListener("pointerdown", this.onOutsidePointerDown);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.removeEventListener("keydown", this.onKeyDown), window.removeEventListener("pointerdown", this.onOutsidePointerDown);
	}
	onSearchInput(e) {
		this.searchText = z(e);
	}
	onSortChange(e) {
		this.sort = z(e) === "name" ? "name" : "updated";
	}
	onMenuToggle(e) {
		e.stopPropagation();
		let { dashboardId: t } = e.detail;
		this.menuDashboardId = this.menuDashboardId === t ? "" : t;
	}
	closeMenu() {
		this.menuDashboardId = "";
	}
	settingsChanged(e) {
		B(this, "dashboard-settings-change", { value: e.detail.value });
	}
	renderCard(e) {
		let t = this.dialog === "rename" && this.draft?.id === e.id;
		return w`
      <ods-dashboard-card
        .dashboard=${e}
        .language=${this.language}
        .menuOpen=${this.menuDashboardId === e.id}
        .renaming=${t}
        .draftName=${this.draft?.name ?? e.name}
        @dashboard-menu-toggle=${this.onMenuToggle}
        @dashboard-menu-action=${this.closeMenu}
      ></ods-dashboard-card>
    `;
	}
	renderDialog() {
		let e = this.draft;
		return !e || !this.dialog || this.dialog === "rename" ? E : this.dialog === "delete" ? w`
        <ha-dialog
          .open=${!0}
          width="small"
          header-title=${t.gallery.deleteTitle}
          @closed=${() => B(this, "dashboard-dialog-close")}
        >
          <div class="dashboard-delete-content">
            <p>
              <strong>${e.name}</strong>
              ${t.gallery.deleteBody}
            </p>
            <p>${t.gallery.deleteWarning}</p>
          </div>
          <ha-dialog-footer slot="footer">
            <ha-button
              slot="secondaryAction"
              appearance="plain"
              @click=${() => B(this, "dashboard-dialog-close")}
            >
              ${t.common.cancel}
            </ha-button>
            <ha-button
              slot="primaryAction"
              variant="danger"
              appearance="filled"
              .disabled=${this.saving}
              @click=${() => B(this, "dashboard-delete-confirm")}
            >
              ${this.saving ? t.gallery.deleting : t.gallery.deleteAction}
            </ha-button>
          </ha-dialog-footer>
        </ha-dialog>
      ` : w`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${t.gallery.settingsTitle}
        header-subtitle=${e.name}
        @closed=${() => B(this, "dashboard-dialog-close")}
      >
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Ln(e)}
            .schema=${Hn()}
            .computeLabel=${Un}
            @value-changed=${this.settingsChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => B(this, "dashboard-dialog-close")}
          >
            ${t.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !zn(e)}
            @click=${() => B(this, "dashboard-settings-save")}
          >
            ${this.saving ? t.gallery.saving : t.gallery.settingsSave}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
	render() {
		let e = Bn(this.dashboards, this.searchText, this.sort, this.language);
		return w`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div>
            <h1>${t.gallery.title}</h1>
            <p>${t.gallery.count(this.dashboards.length)}</p>
          </div>
          <ha-button
            class="dashboard-new-button"
            appearance="filled"
            aria-label=${t.gallery.newDashboard}
            @click=${() => B(this, "dashboard-new")}
          >
            <span class="dashboard-new-button-label">
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>${t.gallery.newDashboard}</span>
            </span>
          </ha-button>
        </header>
        ${this.error ? w`
                <ha-alert alert-type="error">${this.error}</ha-alert>
              ` : E}
        <section
          class="dashboard-library-tools"
          aria-label=${t.gallery.filters}
        >
          <label class="dashboard-search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              type="search"
              aria-label=${t.gallery.search}
              placeholder=${t.gallery.searchPlaceholder}
              .value=${this.searchText}
              @input=${this.onSearchInput}
            />
          </label>
          <label class="dashboard-sort">
            <span>${t.gallery.sort}</span>
            <select
              aria-label=${t.gallery.sortDashboards}
              .value=${this.sort}
              @change=${this.onSortChange}
            >
              <option value="updated">${t.gallery.sortUpdated}</option>
              <option value="name">${t.gallery.sortName}</option>
            </select>
          </label>
        </section>
        <section
          class="dashboard-grid"
          aria-label=${t.gallery.savedDashboards}
        >
          <button
            class="dashboard-add-card"
            aria-label=${t.gallery.addDashboard}
            @click=${() => B(this, "dashboard-new")}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            <strong>${t.gallery.newDashboard}</strong>
          </button>
          ${e.map((e) => this.renderCard(e))}
          ${e.length ? E : w`
                  <div class="dashboard-no-results">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <strong>${t.gallery.noResults}</strong>
                    <span>${t.gallery.noResultsHint}</span>
                  </div>
                `}
        </section>
      </main>
      ${this.renderDialog()}
    `;
	}
};
U([A({ attribute: !1 })], K.prototype, "dashboards", void 0), U([A({ attribute: !1 })], K.prototype, "hass", void 0), U([A()], K.prototype, "error", void 0), U([A({ type: Boolean })], K.prototype, "saving", void 0), U([A()], K.prototype, "dialog", void 0), U([A({ attribute: !1 })], K.prototype, "draft", void 0), U([j()], K.prototype, "searchText", void 0), U([j()], K.prototype, "sort", void 0), U([j()], K.prototype, "menuDashboardId", void 0), K = U([k("ods-gallery")], K);
//#endregion
//#region src/ods-header.ts
var Ar = class extends O {
	constructor(...e) {
		super(...e), this.view = "design", this.dirty = !1, this.saving = !1;
	}
	static {
		this.styles = [
			V,
			H,
			b`
      :host {
        display: contents;
      }
      .topbar {
        flex: none;
        height: calc(
          var(--header-height, 56px) + var(--safe-area-inset-top, 0px)
        );
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: center;
        gap: 14px;
        padding: var(--safe-area-inset-top, 0px) 14px 0;
        border-bottom: 1px solid var(--studio-border);
        background: var(--studio-surface);
        z-index: 5;
      }
      .editor-breadcrumb {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        overflow: hidden;
        white-space: nowrap;
      }
      .studio-name {
        flex: none;
        font-size: 14px;
        letter-spacing: -0.01em;
      }
      .breadcrumb-divider {
        flex: none;
        color: var(--studio-border);
      }
      .breadcrumb-link {
        flex: none;
        min-height: 30px;
        padding: 0 3px;
        border: 0;
        color: var(--studio-accent);
        background: transparent;
        font-size: 12px;
        font-weight: 600;
      }
      .breadcrumb-link:hover {
        text-decoration: underline;
      }
      .dashboard-name {
        min-width: 80px;
        width: min(210px, 18vw);
        height: 32px;
        border: 1px solid transparent;
        border-radius: 7px;
        padding: 0 7px;
        background: transparent;
        font-size: 12px;
        font-weight: 600;
        text-overflow: ellipsis;
      }
      .dashboard-name:hover,
      .dashboard-name:focus {
        border-color: var(--studio-border);
        background: var(--secondary-background-color, #f3f5f6);
        outline: 0;
      }
      .view-switch {
        display: inline-flex;
        align-items: center;
        padding: 3px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .view-switch button {
        min-height: 30px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0 12px;
        border: 0;
        border-radius: 6px;
        color: var(--studio-muted);
        background: transparent;
        font-size: 11px;
        font-weight: 700;
      }
      .view-switch button.active {
        color: var(--studio-text);
        background: var(--studio-surface);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      }
      .view-switch ha-icon {
        width: 15px;
        height: 15px;
        --mdc-icon-size: 15px;
      }
      .editor-actions {
        min-width: 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 4px;
      }
      @media (max-width: 900px) {
        .topbar {
          height: auto;
          min-height: calc(
            var(--header-height, 56px) + var(--safe-area-inset-top, 0px)
          );
          grid-template-columns: minmax(0, 1fr) auto;
          grid-template-areas: "breadcrumb actions" "switch switch";
          gap: 5px 10px;
          padding: calc(var(--safe-area-inset-top, 0px) + 6px) 9px 6px;
        }
        .editor-breadcrumb {
          grid-area: breadcrumb;
        }
        .studio-name,
        .editor-actions .status {
          display: none;
        }
        .dashboard-name {
          width: min(180px, 36vw);
        }
        .view-switch {
          grid-area: switch;
          justify-self: center;
        }
        .editor-actions {
          grid-area: actions;
        }
      }
      @media (max-width: 600px) {
        .breadcrumb-divider:first-of-type {
          display: none;
        }
        .editor-actions ha-button:first-of-type {
          display: none;
        }
      }
    `
		];
	}
	onNameInput(e) {
		B(this, "dashboard-name-change", { name: z(e) });
	}
	get statusToggleLabel() {
		return this.dashboard.status === "ready" ? t.header.setDraft : t.header.setReady;
	}
	render() {
		let e = this.dashboard;
		return w`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">${t.header.studio}</strong>
          <span class="breadcrumb-divider">/</span>
          <button
            class="breadcrumb-link"
            @click=${() => B(this, "show-dashboards")}
          >
            ${t.header.dashboards}
          </button>
          <span class="breadcrumb-divider">/</span>
          <input
            class="dashboard-name"
            aria-label=${t.header.name}
            .value=${e.name}
            @input=${this.onNameInput}
          />
        </div>
        <nav class="view-switch" aria-label=${t.header.view}>
          <button
            class=${this.view === "design" ? "active" : ""}
            aria-pressed=${this.view === "design"}
            @click=${() => B(this, "view-change", { view: "design" })}
          >
            <ha-icon icon="mdi:tools"></ha-icon>
            ${t.header.design}
          </button>
          <button
            class=${this.view === "code" ? "active" : ""}
            aria-pressed=${this.view === "code"}
            @click=${() => B(this, "view-change", { view: "code" })}
          >
            <ha-icon icon="mdi:code-tags"></ha-icon>
            ${t.header.code}
          </button>
        </nav>
        <div class="editor-actions">
          <span class="status ${e.status}">${e.status}</span>
          <ha-button
            appearance="plain"
            @click=${() => B(this, "toggle-ready")}
          >
            ${this.statusToggleLabel}
          </ha-button>
          <ha-button
            appearance="filled"
            .disabled=${!this.dirty || this.saving}
            @click=${() => B(this, "dashboard-save")}
          >
            ${this.saving ? t.header.saving : t.header.save}
          </ha-button>
        </div>
      </header>
    `;
	}
};
U([A({ attribute: !1 })], Ar.prototype, "dashboard", void 0), U([A()], Ar.prototype, "view", void 0), U([A({ type: Boolean })], Ar.prototype, "dirty", void 0), U([A({ type: Boolean })], Ar.prototype, "saving", void 0), Ar = U([k("ods-header")], Ar);
//#endregion
//#region src/item-labels.ts
var jr = (e, t, n) => e.kind === "widget" ? t.find((t) => t.id === e.widget.type) : n.find((t) => t.type === e.primitive.type), Mr = (e, t, n) => jr(e, t, n)?.icon ?? "mdi:puzzle", Nr = "{{  }}", q = class extends O {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.disabled = !1, this.focusEditor = !1;
	}
	static {
		this.styles = [V, b`
      :host {
        display: block;
        min-width: 0;
      }
      .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 24px;
        gap: 6px;
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
        min-height: 36px;
        padding: 8px 9px;
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
        margin-bottom: 6px;
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
    `];
	}
	updated() {
		if (this.fitEditor(), this.focusEditor && this.editor) {
			this.focusEditor = !1, this.editor.focus();
			let e = this.editor.value.length - 3;
			this.editor.setSelectionRange(e, e);
		}
	}
	fitEditor() {
		this.editor && (this.editor.style.height = "auto", this.editor.style.height = `${this.editor.scrollHeight}px`);
	}
	change(e) {
		B(this, "expression-change", {
			key: this.fieldKey,
			template: e
		});
	}
	toggle() {
		this.change(this.expression === void 0 ? void 0 : null);
	}
	onLiteralInput(e) {
		let t = e.composedPath()[0];
		t instanceof HTMLInputElement && t.type === "text" && t.value.trimStart().startsWith("{") && (this.focusEditor = !0, this.change(Nr));
	}
	onEditorChange(e) {
		if (!(e.target instanceof HTMLTextAreaElement)) return;
		let t = e.target.value;
		this.change(gt(t) ? t : null);
	}
	renderEditor(e) {
		return w`
      <label class="expression">
        <span>${this.label}</span>
        <textarea
          data-expression=${this.fieldKey}
          aria-label=${this.label}
          placeholder=${t.expression.placeholder}
          rows="1"
          spellcheck="false"
          .value=${e}
          .disabled=${this.disabled}
          @input=${this.fitEditor}
          @change=${this.onEditorChange}
        ></textarea>
      </label>
    `;
	}
	render() {
		let e = this.expression !== void 0;
		return w`
      <div class="row" @input=${e ? E : this.onLiteralInput}>
        ${this.expression === void 0 ? w`
                <slot></slot>
              ` : this.renderEditor(this.expression)}
        <button
          type="button"
          class="toggle"
          data-toggle=${this.fieldKey}
          aria-pressed=${e ? "true" : "false"}
          aria-label=${t.expression.toggleLabel(this.label)}
          title=${t.expression.toggleTooltip}
          .disabled=${this.disabled}
          @click=${this.toggle}
        >
          {}
        </button>
      </div>
    `;
	}
};
U([A()], q.prototype, "label", void 0), U([A()], q.prototype, "fieldKey", void 0), U([A()], q.prototype, "expression", void 0), U([A({ type: Boolean })], q.prototype, "disabled", void 0), U([lt("textarea")], q.prototype, "editor", void 0), q = U([k("ods-expression-field")], q);
//#endregion
//#region src/ods-property-field.ts
var J = class extends O {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.value = 0, this.min = 0, this.max = 4096, this.disabled = !1;
	}
	static {
		this.styles = [V, b`
      :host {
        display: block;
        min-width: 0;
      }
      .number-field {
        display: grid;
        gap: 5px;
        min-width: 0;
        color: var(--studio-muted);
        font-size: 10px;
      }
      .number-field input {
        width: 100%;
        min-width: 0;
        height: 36px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--secondary-background-color, #f3f5f6);
        color: var(--studio-text);
      }
      .number-field input:disabled {
        opacity: 0.55;
      }
    `];
	}
	onChange(e) {
		B(this, "field-change", {
			key: this.fieldKey,
			value: z(e)
		});
	}
	render() {
		return w`
      <label class="number-field">
        <span>${this.label}</span>
        <input
          data-field=${this.fieldKey}
          aria-label=${this.label}
          type="number"
          .value=${String(this.value)}
          min=${this.min}
          max=${this.max}
          .disabled=${this.disabled}
          @change=${this.onChange}
        />
      </label>
    `;
	}
};
U([A()], J.prototype, "label", void 0), U([A()], J.prototype, "fieldKey", void 0), U([A({ type: Number })], J.prototype, "value", void 0), U([A({ type: Number })], J.prototype, "min", void 0), U([A({ type: Number })], J.prototype, "max", void 0), U([A({ type: Boolean })], J.prototype, "disabled", void 0), J = U([k("ods-property-field")], J);
//#endregion
//#region src/ods-structure.ts
var Pr = 4, Y = class extends O {
	constructor(...e) {
		super(...e), this.items = [], this.widgets = [], this.primitives = [], this.selectedItemId = "", this.draggingId = "";
	}
	static {
		this.styles = [
			V,
			H,
			b`
      :host {
        display: contents;
      }
      .layers {
        min-height: 150px;
        flex: 0 0 clamp(176px, 27%, 250px);
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid var(--studio-border);
        overflow-anchor: none;
      }
      .layers > header {
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 7px 8px 7px 11px;
      }
      .layers h2 {
        margin: 1px 0 0;
        font-size: 15px;
      }
      .layers-header-actions {
        display: flex;
        align-items: center;
        gap: 3px;
      }
      .layer-list {
        min-height: 0;
        flex: 1;
        overflow: auto;
        padding: 0 6px 8px;
      }
      .empty-layers {
        margin: 10px 2px;
        color: var(--studio-muted);
        font-size: 12px;
        line-height: 1.45;
      }
      .layer-row {
        position: relative;
        display: grid;
        grid-template-columns: 24px 18px minmax(0, 1fr) auto;
        align-items: center;
        min-height: 34px;
        gap: 4px;
        padding: 2px 3px;
        border: 1px solid transparent;
        border-radius: 5px;
      }
      .layer-row:hover {
        background: var(--secondary-background-color, #f3f5f6);
      }
      .layer-row.active {
        color: var(--studio-accent);
        border-color: color-mix(
          in srgb,
          var(--studio-accent) 45%,
          var(--studio-border)
        );
        background: var(--studio-accent-soft);
      }
      .layer-row.is-hidden > span {
        opacity: 0.5;
      }
      .layer-row.dragging {
        opacity: 0.42;
      }
      .layer-row.drop-before::before,
      .layer-row.drop-after::after {
        content: "";
        position: absolute;
        left: 2px;
        right: 2px;
        z-index: 4;
        height: 2px;
        border-radius: 2px;
        background: var(--studio-accent);
        box-shadow: 0 0 0 1px
          color-mix(in srgb, var(--studio-accent) 22%, transparent);
        pointer-events: none;
      }
      .layer-row.drop-before::before {
        top: -2px;
      }
      .layer-row.drop-after::after {
        bottom: -2px;
      }
      .layer-row .drag {
        width: 24px;
        height: 28px;
        color: var(--studio-muted);
        cursor: grab;
        touch-action: none;
      }
      .layer-row .drag:active {
        cursor: grabbing;
      }
      .layer-row .layer-type-icon {
        width: 16px;
        height: 16px;
        color: var(--studio-accent);
        --mdc-icon-size: 16px;
      }
      .layer-row > span {
        min-width: 0;
        display: grid;
      }
      .layer-row strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 11px;
        line-height: 1.2;
      }
      .layer-row small {
        color: var(--studio-muted);
        font-size: 8px;
        line-height: 1.15;
        text-transform: capitalize;
      }
      .layer-actions {
        display: flex;
        align-items: center;
        gap: 1px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 100ms ease;
      }
      .layer-row:hover .layer-actions,
      .layer-row:focus-within .layer-actions,
      .layer-row.active .layer-actions {
        opacity: 1;
        pointer-events: auto;
      }
      .layer-row button {
        display: grid;
        place-items: center;
        width: 27px;
        height: 27px;
        padding: 0;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--studio-muted);
      }
      .layer-row button:hover {
        color: var(--studio-text);
        background: color-mix(in srgb, var(--studio-text) 8%, transparent);
      }
      .layer-row button.delete:hover {
        color: var(--error-color, #db4437);
      }
      .layer-row button ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
    `
		];
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopGesture?.();
	}
	startDrag(e, t) {
		e.button === 0 && (e.stopPropagation(), e.preventDefault(), this.stopGesture = pr({
			origin: e,
			threshold: Pr,
			onActivate: () => {
				this.draggingId = t;
			},
			onMove: (e) => {
				e.preventDefault();
				let n = this.shadowRoot?.elementFromPoint(e.clientX, e.clientY)?.closest(".layer-row"), r = n?.dataset.itemId;
				if (!n || !r || r === t) {
					this.dropTarget = void 0;
					return;
				}
				let i = n.getBoundingClientRect();
				this.dropTarget = {
					itemId: r,
					edge: e.clientY < i.top + i.height / 2 ? "before" : "after"
				};
			},
			onEnd: (e, n) => {
				let r = this.dropTarget;
				this.clearDrag(), n && r && r.itemId !== t && B(this, "layers-reorder", {
					itemId: t,
					targetId: r.itemId,
					edge: r.edge
				});
			},
			onCancel: () => this.clearDrag()
		}));
	}
	clearDrag() {
		this.draggingId = "", this.dropTarget = void 0;
	}
	runCommand(e, t, n) {
		e.stopPropagation(), B(this, "command", {
			id: t,
			itemId: n.id
		});
	}
	renderCommandButton(e, t, n) {
		let r = Fn(An(e), Dn(t), Jn());
		return w`
      <button
        class=${e === "delete-item" ? "delete" : ""}
        title=${r.title}
        aria-label=${`${r.label} ${n}`}
        @click=${(n) => this.runCommand(n, e, t)}
      >
        <ha-icon .icon=${r.icon}></ha-icon>
      </button>
    `;
	}
	collapse() {
		B(this, "inspector-collapse", { collapsed: !0 });
	}
	selectItem(e) {
		B(this, "item-select", { itemId: e.id });
	}
	onRowKeyDown(e, t) {
		e.target === e.currentTarget && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.selectItem(t));
	}
	renderRow(e) {
		let n = e.name, r = this.dropTarget?.itemId === e.id ? this.dropTarget.edge : void 0, i = fr({
			"layer-row": !0,
			active: e.id === this.selectedItemId,
			"is-hidden": e.hidden,
			dragging: e.id === this.draggingId,
			"drop-before": r === "before",
			"drop-after": r === "after"
		});
		return w`
      <div
        role="treeitem"
        tabindex="0"
        aria-label=${n}
        aria-selected=${e.id === this.selectedItemId}
        data-item-id=${e.id}
        class=${i}
        @click=${() => this.selectItem(e)}
        @keydown=${(t) => this.onRowKeyDown(t, e)}
      >
        <button
          class="drag"
          title=${t.structure.reorderTitle}
          aria-label=${t.structure.reorder(n)}
          @pointerdown=${(t) => this.startDrag(t, e.id)}
        >
          <ha-icon icon="mdi:drag-vertical"></ha-icon>
        </button>
        <ha-icon
          class="layer-type-icon"
          .icon=${Mr(e, this.widgets, this.primitives)}
        ></ha-icon>
        <span>
          <strong>${n}</strong>
          <small>${this.kindLabel(e)}</small>
        </span>
        <div class="layer-actions">
          ${this.renderCommandButton("toggle-hidden", e, n)}
          ${this.renderCommandButton("toggle-locked", e, n)}
          ${this.renderCommandButton("delete-item", e, n)}
        </div>
      </div>
    `;
	}
	kindLabel(e) {
		return e.kind === "widget" ? t.structure.widget : e.primitive.type;
	}
	render() {
		let e = [...this.items].reverse();
		return w`
      <section class="layers">
        <header>
          <div>
            <span class="eyebrow">${t.structure.title}</span>
            <h2>${t.structure.heading}</h2>
          </div>
          <div class="layers-header-actions">
            <span class="count">${e.length}</span>
            <button
              class="icon-button"
              title=${t.structure.collapse}
              aria-label=${t.structure.collapse}
              @click=${this.collapse}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        </header>
        <div class="layer-list" role="tree">
          ${e.length ? e.map((e) => this.renderRow(e)) : w`
                  <p class="empty-layers">${t.structure.empty}</p>
                `}
        </div>
      </section>
    `;
	}
};
U([A({ attribute: !1 })], Y.prototype, "items", void 0), U([A({ attribute: !1 })], Y.prototype, "widgets", void 0), U([A({ attribute: !1 })], Y.prototype, "primitives", void 0), U([A()], Y.prototype, "selectedItemId", void 0), U([j()], Y.prototype, "draggingId", void 0), U([j()], Y.prototype, "dropTarget", void 0), Y = U([k("ods-structure")], Y);
//#endregion
//#region src/ods-inspector.ts
var Fr = 286, Ir = 560, Lr = [
	"width",
	"height",
	"padding",
	"snapSize"
], Rr = (e) => Lr.some((t) => t === e), zr = (e) => e.label, X = class extends O {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.collapsed = !1, this.width = 350, this.showCorners = !1;
	}
	static {
		this.styles = [
			V,
			H,
			b`
      :host {
        display: contents;
      }
      .panel {
        position: relative;
        min-width: 0;
        min-height: 0;
        background: var(--studio-surface);
      }
      .inspector {
        min-width: 0;
        border-left: 1px solid var(--studio-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        overflow-anchor: none;
      }
      .panel-rail {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        padding: 10px 6px;
      }
      .right-rail {
        border-left: 1px solid var(--studio-border);
      }
      .rail-label {
        writing-mode: vertical-rl;
        color: var(--studio-muted);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .panel-resizer {
        position: absolute;
        left: -4px;
        top: 0;
        bottom: 0;
        width: 8px;
        cursor: ew-resize;
        z-index: 6;
      }
      .panel-resizer:hover {
        background: color-mix(in srgb, var(--studio-accent) 30%, transparent);
      }
      .properties {
        min-height: 0;
        flex: 1 1 auto;
        overflow: auto;
        overflow-anchor: none;
        overscroll-behavior: contain;
      }
      .inspector-title {
        min-height: 58px;
        display: grid;
        grid-template-columns: 30px minmax(0, 1fr);
        align-items: center;
        gap: 7px;
        padding: 8px 12px;
        border-bottom: 1px solid var(--studio-border);
      }
      .inspector-title > ha-icon {
        color: var(--studio-accent);
      }
      .inspector-title h2 {
        margin: 0;
        font-size: 15px;
      }
      .inspector-title p {
        margin: 3px 0 0;
        color: var(--studio-muted);
        font-size: 10px;
      }
      .inspector-section {
        border-bottom: 1px solid var(--studio-border);
      }
      .inspector-section > summary {
        padding: 12px 14px;
        cursor: pointer;
        list-style-position: inside;
        color: var(--studio-muted);
        font: 700 10px var(--code-font-family, monospace);
        letter-spacing: 0.09em;
        text-transform: uppercase;
      }
      .section-body {
        padding: 2px 14px 14px;
      }
      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }
      .stack-field {
        display: grid;
        gap: 5px;
        min-width: 0;
        color: var(--studio-muted);
        font-size: 10px;
      }
      .stack-field select {
        width: 100%;
        min-width: 0;
        height: 36px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--secondary-background-color, #f3f5f6);
        color: var(--studio-text);
      }
      .section-body > ods-property-field,
      .section-body > ods-expression-field,
      .section-body > .text-button {
        margin-top: 10px;
      }
      .text-button {
        padding: 0;
        border: 0;
        background: none;
        color: var(--primary-color);
        font-size: 11px;
      }
      .field-grid + .field-grid,
      .field-grid + .stack-field,
      .stack-field + .field-grid {
        margin-top: 10px;
      }
      .field-help {
        color: var(--studio-muted);
        font-size: 10px;
        line-height: 1.45;
      }
      .danger-zone {
        padding: 12px 14px;
        border-bottom: 1px solid var(--studio-border);
        color: var(--error-color, #db4437);
      }
      .metrics {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 5px 12px;
        font: 10px var(--code-font-family, monospace);
      }
      .metrics strong {
        text-align: right;
      }
      .locked-notice {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin: 8px 12px;
        padding: 7px 9px;
        border: 1px solid
          color-mix(
            in srgb,
            var(--warning-color, #ffa600) 45%,
            var(--studio-border)
          );
        border-radius: 7px;
        background: color-mix(
          in srgb,
          var(--warning-color, #ffa600) 10%,
          var(--studio-surface)
        );
        font-size: 11px;
      }
      .locked-notice span {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .locked-notice ha-icon {
        width: 15px;
        height: 15px;
        --mdc-icon-size: 15px;
      }
      .locked-notice button {
        min-height: 26px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 6px;
        color: var(--primary-text-color);
        background: var(--studio-surface);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }
      @media (max-width: 900px) {
        .inspector,
        .panel-rail {
          display: none;
        }
      }
    `
		];
	}
	willUpdate(e) {
		e.has("selectedItemId") && (this.showCorners = !1);
	}
	updated(e) {
		e.has("selectedItemId") && this.propertiesPanel && (this.propertiesPanel.scrollTop = 0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopGesture?.();
	}
	startResize(e) {
		e.preventDefault();
		let t = e.clientX, n = this.width;
		this.stopGesture = pr({
			origin: e,
			onMove: (e) => {
				let r = n + t - e.clientX;
				B(this, "inspector-resize", { width: N(r, Fr, Ir) });
			}
		});
	}
	expand() {
		B(this, "inspector-collapse", { collapsed: !1 });
	}
	numberFrom(e) {
		let t = Math.round(Number(e.detail.value));
		return Number.isFinite(t) ? t : void 0;
	}
	onItemFieldChange(e, t) {
		e.stopPropagation();
		let n = this.numberFrom(e);
		n !== void 0 && (t.stored && t.key.includes("_") ? B(this, "primitive-change", { value: { [t.key]: n } }) : B(this, "item-number-change", {
			key: t.key,
			value: n
		}));
	}
	onDisplayFieldChange(e) {
		e.stopPropagation();
		let { key: t } = e.detail, n = this.numberFrom(e);
		n !== void 0 && Rr(t) && B(this, "display-number-change", {
			key: t,
			value: n
		});
	}
	onProfileChange(e) {
		B(this, "profile-change", { profileId: z(e) });
	}
	onPaletteChange(e) {
		let t = z(e);
		s(t) && B(this, "palette-change", { palette: t });
	}
	onBackgroundChange(e) {
		B(this, "background-change", { color: z(e) });
	}
	onWidgetOptionsChange(e) {
		B(this, "widget-options-change", { value: e.detail.value });
	}
	onPicksChange(e, t, n) {
		let r = n.widget.sources[t.key] ?? [], i = e.detail.value[t.key];
		B(this, "widget-picks-change", {
			sourceKey: t.key,
			picks: te(r, i)
		});
	}
	onPickFieldsChange(e, t, n, r) {
		let i = n.widget.sources[t.key] ?? [];
		B(this, "widget-picks-change", {
			sourceKey: t.key,
			picks: g(i, r, e.detail.value, t)
		});
	}
	reloadWidgets() {
		B(this, "widgets-reload");
	}
	onPrimitiveChange(e) {
		B(this, "primitive-change", { value: e.detail.value });
	}
	requestDashboardDelete() {
		B(this, "dashboard-delete-request");
	}
	unlock(e) {
		B(this, "command", {
			id: "toggle-locked",
			itemId: e.id
		});
	}
	requestItemDelete(e) {
		B(this, "command", {
			id: "delete-item",
			itemId: e.id
		});
	}
	renderHeader(e, t, n) {
		return w`
      <div class="inspector-title">
        <ha-icon .icon=${n}></ha-icon>
        <div>
          <h2>${e}</h2>
          <p>${t}</p>
        </div>
      </div>
    `;
	}
	renderDangerZone(e, t) {
		return w`
      <div class="danger-zone">
        <ha-button appearance="plain" @click=${t}>
          <ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>
          ${e}
        </ha-button>
      </div>
    `;
	}
	renderMetrics() {
		let e = this.preview;
		if (!e) return E;
		let { timings: n } = e, r = t.inspector.metrics, i = [
			[r.queue, n.queue],
			[r.data, n.data],
			[r.compile, n.compile],
			[r.render, n.render],
			[r.encode, n.encode],
			[r.total, n.pipeline]
		];
		return w`
      ${e.warnings.map((e) => w`
          <ha-alert class="warning" alert-type="warning">${e}</ha-alert>
        `)}
      <details class="inspector-section telemetry">
        <summary>${t.inspector.diagnostics}</summary>
        <div class="section-body metrics">
          ${i.map(([e, n]) => w`
              <span>${e}</span>
              <strong>${t.common.milliseconds(n)}</strong>
            `)}
        </div>
      </details>
    `;
	}
	renderDisplayField(e, t, n, r) {
		return w`
      <ods-property-field
        .label=${e}
        .fieldKey=${t}
        .value=${this.dashboard.display[t]}
        .min=${n}
        .max=${r}
        @field-change=${this.onDisplayFieldChange}
      ></ods-property-field>
    `;
	}
	renderProfileSelect() {
		let e = this.dashboard.display.profileId;
		return w`
      <label class="stack-field">
        ${t.inspector.displayType}
        <select @change=${this.onProfileChange}>
          ${a.map((t) => w`
              <option value=${t.id} ?selected=${t.id === e}>
                ${t.manufacturer} · ${t.name}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderPaletteSelect() {
		let { profileId: e, palette: r } = this.dashboard.display, i = o(e), a = i.id === "custom" ? Object.keys(n).filter(s) : i.palettes;
		return w`
      <label class="stack-field">
        ${t.fields.palette}
        <select @change=${this.onPaletteChange}>
          ${a.map((e) => w`
              <option value=${e} ?selected=${e === r}>
                ${n[e]}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderBackgroundSelect() {
		let { palette: e, background: n } = this.dashboard.display;
		return w`
      <label class="stack-field">
        ${t.fields.background}
        <select @change=${this.onBackgroundChange}>
          ${r[e].map((e) => w`
              <option value=${e} ?selected=${e === n}>
                ${e[0].toUpperCase()}${e.slice(1)}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderDashboardInspector() {
		return w`
      ${this.renderHeader(t.inspector.dashboard, t.inspector.dashboardHint, "mdi:monitor")}
      <details class="inspector-section" open>
        <summary>${t.inspector.display}</summary>
        <div class="section-body">
          ${this.renderProfileSelect()}
          <div class="field-grid">
            ${this.renderDisplayField(t.fields.width, "width", 64, 4096)}
            ${this.renderDisplayField(t.fields.height, "height", 64, 4096)}
          </div>
          <div class="field-grid">
            ${this.renderPaletteSelect()} ${this.renderBackgroundSelect()}
          </div>
        </div>
      </details>
      <details class="inspector-section" open>
        <summary>${t.inspector.workingArea}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${this.renderDisplayField(t.fields.padding, "padding", 0, 1024)}
            ${this.renderDisplayField(t.fields.snapSize, "snapSize", 1, 256)}
          </div>
          <p class="field-help">${t.inspector.workingAreaHelp}</p>
        </div>
      </details>
      ${this.renderDangerZone(t.inspector.deleteDashboard, this.requestDashboardDelete)}
      ${this.renderMetrics()}
    `;
	}
	renderLayoutField(e, t) {
		let n = w`
      <ods-property-field
        .label=${e.label}
        .fieldKey=${e.key}
        .value=${e.value}
        .min=${e.min}
        .max=${e.max}
        .disabled=${t.locked}
        @field-change=${(t) => this.onItemFieldChange(t, e)}
      ></ods-property-field>
    `;
		return e.stored ? this.renderExpressible(t, e.key, e.label, n) : n;
	}
	renderExpressible(e, t, n, r) {
		return w`
      <ods-expression-field
        .label=${n}
        .fieldKey=${t}
        .expression=${e.expressions?.[t]}
        .disabled=${e.locked}
      >
        ${r}
      </ods-expression-field>
    `;
	}
	renderVisibility(e) {
		return this.renderExpressible(e, ht, t.expression.visibleLabel, w`
        <span class="field-help">${t.expression.alwaysVisible}</span>
      `);
	}
	renderCornerToggle(e) {
		return tn(e, this.primitives) ? w`
      <button
        type="button"
        class="text-button"
        @click=${() => this.showCorners = !this.showCorners}
      >
        ${this.showCorners ? t.expression.derivedFields : t.expression.cornerFields}
      </button>
    ` : E;
	}
	renderLockedNotice(e) {
		return e.locked ? w`
      <div class="locked-notice">
        <span>
          <ha-icon icon="mdi:lock"></ha-icon>
          ${t.inspector.locked}
        </span>
        <button
          type="button"
          aria-label=${t.inspector.unlockElement}
          @click=${() => this.unlock(e)}
        >
          ${t.inspector.unlock}
        </button>
      </div>
    ` : E;
	}
	renderLayoutSection(e) {
		let { grid: n, extra: r } = nn(e, this.dashboard, this.primitives, this.showCorners);
		return w`
      <details class="inspector-section" open>
        <summary>${t.inspector.layout}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${n.map((t) => this.renderLayoutField(t, e))}
          </div>
          ${r.map((t) => this.renderLayoutField(t, e))}
          ${this.renderCornerToggle(e)} ${this.renderVisibility(e)}
        </div>
      </details>
    `;
	}
	formSchema(e, t = !1) {
		return {
			name: e.key,
			label: e.label,
			required: t,
			selector: u(e.selector, this.dashboard.display.palette)
		};
	}
	renderPickFields(e, t, n) {
		let r = typeof n.label == "string" && n.label ? n.label : n.id;
		return w`
      <details class="pick-fields" data-pick=${n.id}>
        <summary>${r}</summary>
        <ha-form
          .hass=${this.hass}
          .data=${n}
          .schema=${t.perSource.map((e) => this.formSchema(e))}
          .computeLabel=${zr}
          @value-changed=${(r) => this.onPickFieldsChange(r, t, e, n.id)}
        ></ha-form>
      </details>
    `;
	}
	renderSource(e, t) {
		let n = e.widget.sources[t.key] ?? [];
		return w`
      <div class="widget-source" data-source=${t.key}>
        <ha-form
          .hass=${this.hass}
          .data=${{ [t.key]: ee(t, n) }}
          .schema=${[this.formSchema(t, t.required)]}
          .computeLabel=${zr}
          @value-changed=${(n) => this.onPicksChange(n, t, e)}
        ></ha-form>
        ${t.perSource.length > 0 ? n.map((n) => this.renderPickFields(e, t, n)) : E}
      </div>
    `;
	}
	renderSources(e, n) {
		return n.sources.length === 0 ? E : w`
      <details class="inspector-section" open>
        <summary>${t.inspector.dataSources}</summary>
        <div class="section-body">
          ${n.sources.map((t) => this.renderSource(e, t))}
        </div>
      </details>
    `;
	}
	renderOptionSection(e, t, n) {
		return w`
      <details class="inspector-section" ?open=${n}>
        <summary>${t.section}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${e.widget.options}
            .schema=${t.fields.map((e) => this.formSchema(e))}
            .computeLabel=${zr}
            @value-changed=${this.onWidgetOptionsChange}
          ></ha-form>
        </div>
      </details>
    `;
	}
	renderMissingWidget(e) {
		return w`
      <details class="inspector-section" open>
        <summary>${t.inspector.widgetSettings}</summary>
        <div class="section-body">
          <ha-alert alert-type="warning">
            ${t.inspector.widgetMissing(e.widget.type)}
          </ha-alert>
          <button
            type="button"
            class="text-button"
            @click=${this.reloadWidgets}
          >
            ${t.library.reloadWidgets}
          </button>
        </div>
      </details>
    `;
	}
	renderWidgetSettings(e) {
		let t = this.widgets.find((t) => t.id === e.widget.type);
		return t ? w`
      ${this.renderSources(e, t)}
      ${t.options.map((t, n) => this.renderOptionSection(e, t, n === 0))}
    ` : this.renderMissingWidget(e);
	}
	renderAppearanceField(e, t, n) {
		return this.renderExpressible(e, t.name, t.label, w`
        <ha-form
          .hass=${this.hass}
          .data=${n}
          .schema=${[t]}
          .computeLabel=${zr}
          @value-changed=${this.onPrimitiveChange}
        ></ha-form>
      `);
	}
	renderAppearance(e) {
		let n = sn(e, this.primitives), r = on(e, this.dashboard.display.palette, this.primitives);
		return w`
      <details class="inspector-section" open>
        <summary>${t.inspector.appearance}</summary>
        <div class="section-body">
          ${r.map((t) => this.renderAppearanceField(e, t, n))}
        </div>
      </details>
    `;
	}
	renderItemSections(e) {
		return e.kind === "widget" ? w`
        ${this.renderWidgetSettings(e)} ${this.renderLayoutSection(e)}
      ` : w`
      ${this.renderLayoutSection(e)} ${this.renderAppearance(e)}
    `;
	}
	renderItemInspector(e) {
		let n = e.kind === "widget" ? t.inspector.kindWidget : t.inspector.kindPrimitive;
		return w`
      ${this.renderHeader(e.name, t.inspector.subtitle(n, e.locked), Mr(e, this.widgets, this.primitives))}
      ${this.renderLockedNotice(e)} ${this.renderItemSections(e)}
      ${this.renderDangerZone(t.inspector.removeElement, () => this.requestItemDelete(e))}
      ${this.renderMetrics()}
    `;
	}
	renderRail() {
		return w`
      <aside class="panel panel-rail right-rail">
        <button
          class="icon-button"
          title=${t.inspector.expand}
          aria-label=${t.inspector.expand}
          @click=${this.expand}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="rail-label">${t.inspector.rail}</span>
      </aside>
    `;
	}
	render() {
		if (this.collapsed) return this.renderRail();
		let e = this.dashboard.items.find((e) => e.id === this.selectedItemId);
		return w`
      <aside class="panel inspector">
        <div
          class="panel-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label=${t.inspector.resize}
          @pointerdown=${this.startResize}
        ></div>
        <ods-structure
          .items=${this.dashboard.items}
          .widgets=${this.widgets}
          .primitives=${this.primitives}
          .selectedItemId=${this.selectedItemId}
        ></ods-structure>
        <section class="properties">
          ${e ? this.renderItemInspector(e) : this.renderDashboardInspector()}
        </section>
      </aside>
    `;
	}
};
U([A({ attribute: !1 })], X.prototype, "hass", void 0), U([A({ attribute: !1 })], X.prototype, "dashboard", void 0), U([A({ attribute: !1 })], X.prototype, "widgets", void 0), U([A({ attribute: !1 })], X.prototype, "primitives", void 0), U([A({ attribute: !1 })], X.prototype, "preview", void 0), U([A()], X.prototype, "selectedItemId", void 0), U([A({ type: Boolean })], X.prototype, "collapsed", void 0), U([A({ type: Number })], X.prototype, "width", void 0), U([j()], X.prototype, "showCorners", void 0), U([lt(".properties")], X.prototype, "propertiesPanel", void 0), X = U([k("ods-inspector")], X);
//#endregion
//#region src/catalog.ts
var Br = (e, t) => {
	let n = t.trim().toLocaleLowerCase();
	return n ? e.filter((e) => `${e.name} ${e.description}`.toLocaleLowerCase().includes(n)) : e;
}, Vr = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.category, [...t.get(n.category) ?? [], n]);
	return [...t.entries()];
}, Hr = 4, Z = class extends O {
	constructor(...e) {
		super(...e), this.widgets = [], this.widgetErrors = [], this.primitives = [], this.collapsed = !1, this.searchText = "", this.suppressClick = !1;
	}
	static {
		this.styles = [
			V,
			H,
			b`
      :host {
        display: contents;
      }
      .panel {
        position: relative;
        min-width: 0;
        min-height: 0;
        background: var(--studio-surface);
      }
      .toolbox {
        border-right: 1px solid var(--studio-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .panel-title {
        min-height: 58px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 11px 12px;
      }
      .panel-title h2 {
        margin: 1px 0 0;
        font-size: 15px;
      }
      .search {
        margin: 0 10px 10px 9px;
        min-height: 30px;
        display: flex;
        align-items: center;
        gap: 7px;
        padding: 0 9px;
        border: 1px solid var(--studio-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .search ha-icon {
        width: 17px;
      }
      .search input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        font-size: 13px;
      }
      .catalog-scroll {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 0 9px 16px;
      }
      .catalog-section {
        margin-top: 8px;
      }
      .catalog-section > header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 7px 2px;
        color: var(--studio-muted);
        font: 700 10px var(--code-font-family, monospace);
        letter-spacing: 0.11em;
        text-transform: uppercase;
      }
      .catalog-category {
        margin: 10px 0 6px;
        color: var(--studio-muted);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .user-badge {
        justify-self: start;
        padding: 1px 6px;
        border: 1px solid var(--studio-border);
        border-radius: 999px;
        color: var(--studio-muted);
        font-size: 9px;
      }
      .widget-errors {
        margin: 6px 0;
        padding: 6px 8px;
        border: 1px solid var(--warning-color, #ffa600);
        border-radius: 7px;
        font-size: 11px;
      }
      .widget-errors summary {
        cursor: pointer;
      }
      .widget-errors ul {
        margin: 6px 0 0;
        padding-left: 16px;
      }
      .catalog-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
      }
      .catalog-item {
        min-height: 34px;
        display: grid;
        grid-template-columns: 16px minmax(0, 1fr);
        gap: 8px;
        align-items: center;
        padding: 0 10px;
        text-align: start;
        border: 1px solid var(--studio-border);
        border-radius: 8px;
        background: var(--studio-surface);
        cursor: grab;
        touch-action: none;
        user-select: none;
      }
      .catalog-item:hover {
        border-color: var(--studio-accent);
        background: var(--studio-accent-soft);
        transform: translateY(-1px);
      }
      .catalog-item:active {
        cursor: grabbing;
      }
      .catalog-item ha-icon {
        width: 16px;
        height: 16px;
        color: var(--studio-accent);
        --mdc-icon-size: 16px;
      }
      .catalog-item strong {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        line-height: 1.2;
      }
      .catalog-item small {
        display: none;
      }
      .empty-result {
        grid-column: 1 / -1;
        margin: 10px 2px;
        color: var(--studio-muted);
        font-size: 12px;
        line-height: 1.45;
      }
      .panel-rail {
        border-right: 1px solid var(--studio-border);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: 12px;
        padding: 10px 6px;
      }
      .rail-label {
        writing-mode: vertical-rl;
        color: var(--studio-muted);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .catalog-drag-ghost {
        position: fixed;
        z-index: 1200;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 16px minmax(0, 1fr) 14px;
        align-items: center;
        gap: 5px;
        min-height: 34px;
        padding: 0 7px;
        border: 1px solid var(--studio-accent);
        border-radius: 8px;
        color: var(--primary-text-color, #182026);
        background: var(--studio-surface);
        box-shadow: 0 7px 18px rgba(0, 0, 0, 0.22);
        font-size: 11px;
        font-weight: 700;
        pointer-events: none;
      }
      .catalog-drag-ghost ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
      .catalog-drag-ghost .drag-type-icon,
      .catalog-drag-ghost .drag-add-icon {
        color: var(--studio-accent);
      }
      @media (max-width: 900px) {
        .toolbox,
        .panel-rail {
          display: none;
        }
      }
    `
		];
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopGesture?.();
	}
	panelOrigin() {
		let e = this.getRootNode();
		return (e instanceof ShadowRoot ? e.host : this).getBoundingClientRect();
	}
	startDrag(e, t, n) {
		if (e.button !== 0) return;
		e.preventDefault();
		let r = e.currentTarget.getBoundingClientRect(), i = e.clientX - r.left, a = e.clientY - r.top;
		this.stopGesture = pr({
			origin: e,
			threshold: Hr,
			onActivate: () => B(this, "catalog-drag", { active: !0 }),
			onMove: (e) => {
				e.preventDefault();
				let o = this.panelOrigin();
				this.ghost = {
					value: t,
					icon: n.icon,
					name: n.name,
					x: e.clientX - o.left - i,
					y: e.clientY - o.top - a,
					width: r.width,
					height: r.height
				};
			},
			onEnd: (e, n) => {
				this.ghost = void 0, n && (B(this, "catalog-drag", { active: !1 }), this.suppressClick = !0, B(this, "catalog-drop", {
					value: t,
					clientX: e.clientX,
					clientY: e.clientY
				}), window.setTimeout(() => {
					this.suppressClick = !1;
				}, 0));
			},
			onCancel: () => {
				this.ghost = void 0, B(this, "catalog-drag", { active: !1 });
			}
		});
	}
	onSearchInput(e) {
		this.searchText = z(e);
	}
	addFromClick(e) {
		this.suppressClick || B(this, "catalog-add", { value: e });
	}
	renderEntry(e, n) {
		let r = `${n}:${e.id}`;
		return w`
      <button
        class="catalog-item"
        title=${t.library.entryHint(e.description)}
        @click=${() => this.addFromClick(r)}
        @pointerdown=${(t) => this.startDrag(t, r, e)}
      >
        <ha-icon .icon=${e.icon}></ha-icon>
        <strong>${e.name}</strong>
        ${e.user ? w`
                <span class="user-badge">${t.library.userWidget}</span>
              ` : E}
        <small>${e.description}</small>
      </button>
    `;
	}
	renderEntries(e, t, n) {
		return e.length ? w`
      ${e.map((e) => this.renderEntry(e, t))}
    ` : w`
        <p class="empty-result">${n}</p>
      `;
	}
	reloadWidgets() {
		B(this, "widgets-reload");
	}
	renderWidgetErrors() {
		return this.widgetErrors.length === 0 ? E : w`
      <details class="widget-errors">
        <summary>
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          ${t.library.widgetErrors(this.widgetErrors.length)}
        </summary>
        <ul>
          ${this.widgetErrors.map((e) => w`
              <li>
                <strong>${e.folder}</strong>
                ${e.message}
              </li>
            `)}
        </ul>
      </details>
    `;
	}
	renderWidgetEntries(e) {
		return e.length === 0 ? w`
        <p class="empty-result">${t.library.noWidgets}</p>
      ` : w`
      ${Vr(e).map(([e, t]) => w`
          <h4 class="catalog-category">${e}</h4>
          <div class="catalog-grid">
            ${t.map((e) => this.renderEntry({
			...e,
			user: !e.builtin
		}, "widget"))}
          </div>
        `)}
    `;
	}
	renderGhost() {
		let e = this.ghost;
		if (!e) return E;
		let t = M({
			left: `${e.x}px`,
			top: `${e.y}px`,
			width: `${e.width}px`,
			height: `${e.height}px`
		});
		return w`
      <div
        class="catalog-drag-ghost"
        data-catalog-value=${e.value}
        style=${t}
      >
        <ha-icon class="drag-type-icon" .icon=${e.icon}></ha-icon>
        <span>${e.name}</span>
        <ha-icon class="drag-add-icon" icon="mdi:plus"></ha-icon>
      </div>
    `;
	}
	render() {
		if (this.collapsed) return w`
        <aside class="panel panel-rail">
          <button
            class="icon-button"
            title=${t.library.expand}
            aria-label=${t.library.expand}
            @click=${() => B(this, "library-collapse", { collapsed: !1 })}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <span class="rail-label">${t.library.title}</span>
        </aside>
      `;
		let e = Br(this.widgets, this.searchText), n = Br(this.primitives, this.searchText).map((e) => ({
			...e,
			id: e.type
		}));
		return w`
      ${this.renderGhost()}
      <aside class="panel toolbox">
        <div class="panel-title">
          <div>
            <span class="eyebrow">${t.library.title}</span>
            <h2>${t.library.heading}</h2>
          </div>
          <button
            class="icon-button"
            title=${t.library.collapse}
            aria-label=${t.library.collapse}
            @click=${() => B(this, "library-collapse", { collapsed: !0 })}
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
        </div>
        <label class="search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            aria-label=${t.library.search}
            placeholder=${t.library.searchPlaceholder}
            .value=${this.searchText}
            @input=${this.onSearchInput}
          />
        </label>
        <div class="catalog-scroll">
          <section class="catalog-section">
            <header>
              <span>${t.library.widgets}</span>
              <span class="count">${e.length}</span>
              <button
                class="icon-button"
                title=${t.library.reloadWidgets}
                aria-label=${t.library.reloadWidgets}
                @click=${this.reloadWidgets}
              >
                <ha-icon icon="mdi:refresh"></ha-icon>
              </button>
            </header>
            ${this.renderWidgetErrors()} ${this.renderWidgetEntries(e)}
          </section>
          <section class="catalog-section">
            <header>
              <span>${t.library.primitives}</span>
              <span class="count">${n.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(n, "primitive", t.library.noPrimitives)}
            </div>
          </section>
        </div>
      </aside>
    `;
	}
};
U([A({ attribute: !1 })], Z.prototype, "widgets", void 0), U([A({ attribute: !1 })], Z.prototype, "widgetErrors", void 0), U([A({ attribute: !1 })], Z.prototype, "primitives", void 0), U([A({ type: Boolean })], Z.prototype, "collapsed", void 0), U([j()], Z.prototype, "searchText", void 0), U([j()], Z.prototype, "ghost", void 0), Z = U([k("ods-library")], Z);
//#endregion
//#region src/ods-new-dashboard-dialog.ts
var Ur = class extends O {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [
			V,
			H,
			b`
      :host {
        display: contents;
      }
      .new-dashboard-content {
        display: grid;
        gap: 16px;
        padding: 18px 22px 22px;
      }
      .form-label {
        color: var(--studio-muted);
        font-size: 11px;
        font-weight: 700;
      }
      .dashboard-source-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
      }
      .dashboard-source {
        min-width: 0;
        min-height: 64px;
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        align-items: center;
        gap: 9px;
        padding: 9px 11px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
        text-align: start;
        background: var(--studio-surface);
      }
      .dashboard-source.selected {
        border-color: var(--studio-accent);
        box-shadow: inset 0 0 0 1px var(--studio-accent);
        background: var(--studio-accent-soft);
      }
      .dashboard-source:disabled {
        cursor: not-allowed;
        opacity: 0.52;
      }
      .dashboard-source ha-icon {
        color: var(--studio-accent);
      }
      .dashboard-source span {
        min-width: 0;
        display: grid;
        gap: 3px;
      }
      .dashboard-source strong {
        font-size: 12px;
      }
      .dashboard-source small {
        overflow: hidden;
        color: var(--studio-muted);
        font-size: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .new-dashboard-content ha-form {
        display: block;
      }
      @media (max-width: 600px) {
        .dashboard-source-options {
          grid-template-columns: 1fr;
        }
      }
    `
		];
	}
	formChanged(e) {
		B(this, "new-dashboard-change", { value: e.detail.value });
	}
	render() {
		return w`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${t.newDashboard.title}
        header-subtitle=${t.newDashboard.subtitle}
        @closed=${() => B(this, "new-dashboard-close")}
      >
        <div class="new-dashboard-content">
          <span class="form-label">${t.newDashboard.startFrom}</span>
          <div
            class="dashboard-source-options"
            role="radiogroup"
            aria-label=${t.newDashboard.sources}
          >
            <button
              class="dashboard-source selected"
              type="button"
              role="radio"
              aria-checked="true"
            >
              <ha-icon icon="mdi:monitor"></ha-icon>
              <span>
                <strong>${t.newDashboard.customSize}</strong>
                <small>${t.newDashboard.customSizeHint}</small>
              </span>
            </button>
            <button
              class="dashboard-source"
              type="button"
              role="radio"
              aria-checked="false"
              disabled
            >
              <ha-icon icon="mdi:devices"></ha-icon>
              <span>
                <strong>${t.newDashboard.fromDevice}</strong>
                <small>${t.newDashboard.fromDeviceHint}</small>
              </span>
            </button>
          </div>
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Ln(this.dashboard)}
            .schema=${Hn()}
            .computeLabel=${Un}
            @value-changed=${this.formChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => B(this, "new-dashboard-close")}
          >
            ${t.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !zn(this.dashboard)}
            @click=${() => B(this, "dashboard-create")}
          >
            ${this.saving ? t.newDashboard.creating : t.newDashboard.create}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
};
U([A({ attribute: !1 })], Ur.prototype, "hass", void 0), U([A({ attribute: !1 })], Ur.prototype, "dashboard", void 0), U([A({ type: Boolean })], Ur.prototype, "saving", void 0), Ur = U([k("ods-new-dashboard-dialog")], Ur);
//#endregion
//#region src/ods-app.ts
var Wr = 220, Gr = 5e3, Q = (e, t) => e instanceof Error && e.message ? e.message : typeof e == "string" && e ? e : t, $ = class extends O {
	constructor(...e) {
		super(...e), this.dashboards = [], this.view = "dashboards", this.widgets = [], this.widgetErrors = [], this.notice = "", this.primitives = [], this.selectedItemId = "", this.loading = !0, this.saving = !1, this.dirty = !1, this.error = "", this.draggingCatalog = !1, this.undoCount = 0, this.redoCount = 0, this.pendingDeleteItemId = "", this.leftCollapsed = !1, this.rightCollapsed = !1, this.inspectorWidth = 350, this.snapEnabled = !0, this.viewport = cr, this.newDashboardOpen = !1, this.newDashboard = In("en"), this.previewRequest = 0, this.bootstrapStarted = !1, this.history = new Xn(), this.undo = () => {
			this.current && this.restore(this.history.undo(this.current));
		}, this.redo = () => {
			this.current && this.restore(this.history.redo(this.current));
		}, this.commandActions = {
			undo: () => this.undo(),
			redo: () => this.redo(),
			requestDelete: (e) => {
				this.pendingDeleteItemId = e;
			},
			toggleFlag: (e, t) => this.mutate((n) => gn(n, e, t))
		}, this.onKeyDown = (e) => {
			if (this.view !== "design" || qn(e)) return;
			let t = Mn(e);
			t?.isEnabled(this.commandContext(this.selectedItem)) && (e.preventDefault(), this.runCommand(t.id));
		};
	}
	static {
		this.styles = [
			V,
			H,
			b`
      :host {
        --studio-accent: var(--primary-color, #03a9f4);
        --studio-accent-soft: color-mix(
          in srgb,
          var(--studio-accent) 14%,
          transparent
        );
        --studio-border: var(--divider-color, #d5dadd);
        --studio-surface: var(--card-background-color, #fff);
        --studio-text: var(--primary-text-color, #202124);
        --studio-muted: var(--secondary-text-color, #68727a);
        display: block;
        width: 100%;
        height: 100vh;
        height: 100dvh;
        max-height: 100vh;
        max-height: 100dvh;
        min-height: 0;
        color: var(--studio-text);
        background: var(--primary-background-color, #f5f7f8);
        font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
        overflow: hidden;
        overflow-anchor: none;
        contain: size layout paint;
      }
      .shell {
        height: 100%;
        max-height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        overflow-anchor: none;
      }
      .layout {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: var(--toolbox-width) minmax(0, 1fr) var(
            --inspector-width
          );
        overflow: hidden;
      }
      .dashboard-empty {
        position: relative;
        height: 100%;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(
            circle at 50% 30%,
            color-mix(in srgb, var(--studio-accent) 12%, transparent),
            transparent 42%
          ),
          var(--primary-background-color, #f5f7f8);
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: minmax(0, 1fr) !important;
        }
      }
    `
		];
	}
	get language() {
		return this.hass?.language || "en";
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("keydown", this.onKeyDown);
	}
	firstUpdated() {
		this.ensureBootstrap();
	}
	updated(e) {
		e.has("hass") && (this.ensureBootstrap(), this.refreshOnStateChange(e.get("hass")));
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.previewTimer && window.clearTimeout(this.previewTimer), this.stateTimer && window.clearTimeout(this.stateTimer), this.clockTimer && window.clearTimeout(this.clockTimer), this.noticeTimer && window.clearTimeout(this.noticeTimer), window.removeEventListener("keydown", this.onKeyDown);
	}
	ensureBootstrap() {
		!this.hass || this.bootstrapStarted || (this.bootstrapStarted = !0, this.bootstrap());
	}
	async bootstrap() {
		let e = this.hass;
		if (e) {
			this.loading = !0, this.error = "";
			try {
				let t = await Zn(e);
				this.dashboards = t.dashboards, this.widgets = t.widgets, this.widgetErrors = t.widgetErrors, this.primitives = t.primitives, this.current = void 0, this.preview = void 0, this.view = "dashboards", this.clearHistory(), this.newDashboard = In(e.language);
			} catch (e) {
				this.error = Q(e, t.app.loadFailed);
			} finally {
				this.loading = !1;
			}
		}
	}
	openNewDashboard() {
		this.newDashboard = In(this.language), this.newDashboardOpen = !0;
	}
	async createDashboard() {
		if (this.hass) {
			this.saving = !0, this.error = "";
			try {
				let e = await $n(this.hass, this.newDashboard);
				this.dashboards = [...this.dashboards, e], this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.newDashboardOpen = !1, this.view = "design", this.clearHistory(), await this.composePreview(), await this.updateComplete, this.showWholeCanvas();
			} catch (e) {
				this.error = Q(e, t.app.createFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveDashboard() {
		if (!(!this.hass || !this.current)) {
			this.saving = !0, this.error = "";
			try {
				let e = await er(this.hass, this.current);
				this.current = structuredClone(e), this.dashboards = this.dashboards.map((t) => t.id === e.id ? e : t), this.dirty = !1;
			} catch (e) {
				this.error = Q(e, t.app.saveFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async deleteDashboard() {
		if (!this.hass || !this.current) return;
		let e = this.current.id;
		try {
			await tr(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.view = "dashboards", this.clearHistory();
		} catch (e) {
			this.error = Q(e, t.app.deleteFailed);
		}
	}
	openDashboard(e) {
		if (this.current?.id === e.id) {
			this.view = "design", this.preview || this.composePreview();
			return;
		}
		this.dirty && !window.confirm(t.app.discardChanges) || (this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.clearHistory(), this.view = "design", this.composePreview().then(() => this.showWholeCanvas()));
	}
	openAction(e, t) {
		this.dashboardDraft = structuredClone(e), this.dashboardDialog = t;
	}
	closeAction() {
		this.dashboardDialog = void 0, this.dashboardDraft = void 0;
	}
	async updateFromGallery(e, t) {
		if (!(!this.hass || this.saving)) {
			this.saving = !0, this.error = "";
			try {
				let t = await er(this.hass, e);
				return this.dashboards = this.dashboards.map((e) => e.id === t.id ? t : e), this.current?.id === t.id && (this.current = structuredClone(t), this.preview = void 0, this.dirty = !1), t;
			} catch (e) {
				this.error = Q(e, t);
				return;
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveRename() {
		if (this.dashboardDialog !== "rename" || !this.dashboardDraft || this.saving) return;
		let e = structuredClone(this.dashboardDraft);
		if (e.name = e.name.trim(), !e.name) {
			this.error = t.app.renameEmpty;
			return;
		}
		if (this.dashboards.find((t) => t.id === e.id)?.name === e.name) {
			this.closeAction();
			return;
		}
		await this.updateFromGallery(e, t.app.renameFailed) && this.closeAction();
	}
	async duplicateDashboard(e) {
		if (!this.hass || this.saving) return;
		this.saving = !0, this.error = "";
		let n = structuredClone(e);
		n.id = "", n.name = Vn(e, this.dashboards, this.language), n.status = "draft", n.createdAt = "", n.updatedAt = "";
		try {
			let e = await $n(this.hass, n);
			this.dashboards = [...this.dashboards, e];
		} catch (e) {
			this.error = Q(e, t.app.duplicateFailed);
		} finally {
			this.saving = !1;
		}
	}
	async saveSettings() {
		if (this.dashboardDialog !== "settings" || !this.dashboardDraft || !zn(this.dashboardDraft)) return;
		let e = structuredClone(this.dashboardDraft);
		e.name = e.name.trim(), await this.updateFromGallery(e, t.app.settingsFailed) && this.closeAction();
	}
	async confirmDeleteDashboard() {
		if (this.dashboardDialog !== "delete" || !this.dashboardDraft || !this.hass || this.saving) return;
		let e = this.dashboardDraft.id;
		this.saving = !0, this.error = "";
		try {
			await tr(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current?.id === e && (this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.clearHistory()), this.closeAction();
		} catch (e) {
			this.error = Q(e, t.app.deleteFailed);
		} finally {
			this.saving = !1;
		}
	}
	mutate(e, t = !0, n = !0) {
		if (!this.current) return;
		let r = structuredClone(this.current), i = structuredClone(this.current);
		e(i), JSON.stringify(i) !== JSON.stringify(r) && (n && this.recordHistory(r), this.current = i, this.dirty = !0, t && this.schedulePreview());
	}
	recordHistory(e) {
		this.history.record(e), this.syncHistory();
	}
	clearHistory() {
		this.history.clear(), this.syncHistory();
	}
	syncHistory() {
		this.undoCount = this.history.undoCount, this.redoCount = this.history.redoCount;
	}
	restore(e) {
		e && (this.current = e, this.dirty = !0, this.selectedItemId && !e.items.some((e) => e.id === this.selectedItemId) && (this.selectedItemId = ""), this.syncHistory(), this.schedulePreview());
	}
	commandContext(e) {
		return {
			canUndo: this.undoCount > 0,
			canRedo: this.redoCount > 0,
			item: e
		};
	}
	get selectedItem() {
		return this.current?.items.find((e) => e.id === this.selectedItemId);
	}
	runCommand(e, t = this.selectedItem) {
		let n = An(e), r = this.commandContext(t);
		n.isEnabled(r) && n.run(r, this.commandActions);
	}
	onCommand(e) {
		let { id: t, itemId: n } = e.detail, r = n ? this.current?.items.find((e) => e.id === n) : void 0;
		this.runCommand(t, r ?? this.selectedItem);
	}
	schedulePreview() {
		this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.composePreview(), Wr);
	}
	refreshOnStateChange(e) {
		let t = this.preview?.dependencies;
		!t || !ie(t, e?.states, this.hass?.states) || (this.stateTimer && window.clearTimeout(this.stateTimer), this.stateTimer = window.setTimeout(() => void this.composePreview(), 500));
	}
	scheduleClockRefresh() {
		this.clockTimer && window.clearTimeout(this.clockTimer), this.preview?.dependencies.usesTime && (this.clockTimer = window.setTimeout(() => void this.composePreview(), _));
	}
	async composePreview() {
		if (!this.hass || !this.current) return;
		this.error = "";
		let e = ++this.previewRequest;
		try {
			let t = await nr(this.hass, this.current);
			e === this.previewRequest && (this.preview = t, this.scheduleClockRefresh());
		} catch (e) {
			this.error = Q(e, t.app.previewFailed);
		}
	}
	setEditorView(e) {
		this.view = e, e === "code" && !this.preview && this.composePreview();
	}
	selectItem(e) {
		this.selectedItemId !== e && (this.selectedItemId = e);
	}
	showWholeCanvas() {
		this.canvas?.resetView(), requestAnimationFrame(() => this.canvas?.fitView());
	}
	addAt(e, n, r) {
		let i = this.current;
		if (!i) return;
		let [a, o] = e.split(":");
		if (!o) return;
		let s;
		if (a === "widget") {
			let e = this.widgets.find((e) => e.id === o);
			e && (s = Sn(e, n, r, i));
		} else if (a === "primitive" && (s = Cn(this.primitives, o, n, r, i), !s)) {
			this.error = t.app.unsupportedPrimitive(o);
			return;
		}
		if (!s) return;
		let c = s;
		this.mutate((e) => {
			e.items.push(c);
		}), this.selectItem(c.id);
	}
	addFromCatalog(e) {
		if (!this.current) return;
		let { x: t, y: n } = wn(this.current, this.snapEnabled);
		this.addAt(e, t, n);
	}
	dropFromCatalog(e, t, n) {
		let r = this.current, i = this.canvas?.displayPointAt(t, n);
		if (!r || !i) return;
		let a = F(r);
		this.addAt(e, N(Ft(i.x, r, this.snapEnabled), a.x, a.x + a.width - 1), N(Ft(i.y, r, this.snapEnabled), a.y, a.y + a.height - 1));
	}
	confirmDeleteItem() {
		let e = this.pendingDeleteItemId;
		e && (this.pendingDeleteItemId = "", this.mutate((t) => _n(t, e)), this.selectedItemId === e && this.selectItem(""));
	}
	onDashboardOpen(e) {
		this.openDashboard(e.detail.dashboard);
	}
	onDashboardMenuAction(e) {
		let { dashboard: t, action: n } = e.detail;
		if (n === "duplicate") {
			this.duplicateDashboard(t);
			return;
		}
		this.openAction(t, n);
	}
	onRenameInput(e) {
		this.dashboardDraft &&= {
			...this.dashboardDraft,
			name: e.detail.name
		};
	}
	onSettingsChange(e) {
		this.dashboardDraft &&= Rn(this.dashboardDraft, e.detail.value);
	}
	onNewDashboardChange(e) {
		this.newDashboard = Rn(this.newDashboard, e.detail.value);
	}
	closeNewDashboard() {
		this.newDashboardOpen = !1;
	}
	showGallery() {
		this.view = "dashboards";
	}
	onNameChange(e) {
		this.mutate((t) => {
			t.name = e.detail.name;
		}, !1);
	}
	onViewChange(e) {
		this.setEditorView(e.detail.view);
	}
	toggleReady() {
		this.mutate((e) => {
			e.status = e.status === "ready" ? "draft" : "ready";
		}, !1);
	}
	onItemSelect(e) {
		this.selectItem(e.detail.itemId);
	}
	cancelDeleteItem() {
		this.pendingDeleteItemId = "";
	}
	onLibraryCollapse(e) {
		this.leftCollapsed = e.detail.collapsed;
	}
	onCatalogAdd(e) {
		this.addFromCatalog(e.detail.value);
	}
	onCatalogDrag(e) {
		this.draggingCatalog = e.detail.active;
	}
	onCatalogDrop(e) {
		let { value: t, clientX: n, clientY: r } = e.detail;
		this.dropFromCatalog(t, n, r);
	}
	onViewportChange(e) {
		this.viewport = e.detail;
	}
	onItemTransform(e) {
		let { item: t } = e.detail;
		this.mutate((e) => {
			let n = e.items.findIndex((e) => e.id === t.id);
			n >= 0 && (e.items[n] = t);
		}, !1, !1);
	}
	onItemTransformEnd(e) {
		this.recordHistory(e.detail.before), this.schedulePreview();
	}
	toggleSnap() {
		this.snapEnabled = !this.snapEnabled;
	}
	onInspectorCollapse(e) {
		this.rightCollapsed = e.detail.collapsed;
	}
	onInspectorResize(e) {
		this.inspectorWidth = e.detail.width;
	}
	onLayersReorder(e) {
		let { itemId: t, targetId: n, edge: r } = e.detail;
		this.mutate((e) => vn(e, t, n, r));
	}
	onItemNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => un(e, this.selectedItemId, t, n, this.primitives));
	}
	onExpressionChange(e) {
		let { key: t, template: n } = e.detail;
		this.mutate((e) => En(e, this.selectedItemId, t, n));
	}
	onDisplayNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => fn(e, t, n));
	}
	onProfileChange(e) {
		let t = o(e.detail.profileId);
		this.mutate((e) => pn(e, t)), requestAnimationFrame(() => this.canvas?.fitView());
	}
	onPaletteChange(e) {
		this.mutate((t) => mn(t, e.detail.palette));
	}
	onBackgroundChange(e) {
		this.mutate((t) => hn(t, e.detail.color));
	}
	onWidgetOptionsChange(e) {
		let t = this.selectedItem;
		if (t?.kind !== "widget") return;
		let n = this.widgets.find((e) => e.id === t.widget.type);
		if (!n) return;
		let r = m(e.detail.value, n);
		this.mutate((e) => yn(e, t.id, r));
	}
	onWidgetPicksChange(e) {
		let { sourceKey: t, picks: n } = e.detail;
		this.mutate((e) => bn(e, this.selectedItemId, t, n));
	}
	async reloadWidgets() {
		if (this.hass) try {
			let e = await Qn(this.hass);
			this.widgets = e.widgets, this.widgetErrors = e.widgetErrors, this.showNotice(t.library.widgetsReloaded(e.widgets.length, e.widgetErrors.length)), this.composePreview();
		} catch (e) {
			this.error = Q(e, t.library.reloadFailed);
		}
	}
	showNotice(e) {
		this.notice = e, this.noticeTimer && window.clearTimeout(this.noticeTimer), this.noticeTimer = window.setTimeout(() => {
			this.notice = "";
		}, Gr);
	}
	onPrimitiveChange(e) {
		let { value: t } = e.detail;
		this.mutate((e) => xn(e, this.selectedItemId, t, this.primitives));
	}
	renderDeleteDialog() {
		let e = this.current?.items.find((e) => e.id === this.pendingDeleteItemId);
		return e ? w`
      <ods-confirm-dialog
        eyebrow=${t.app.confirmRemoval}
        heading=${t.app.deleteElementTitle(e.name)}
        body=${t.app.deleteElementBody}
        confirmLabel=${t.app.deleteElement}
        @confirm-accept=${this.confirmDeleteItem}
        @confirm-cancel=${this.cancelDeleteItem}
      ></ods-confirm-dialog>
    ` : E;
	}
	renderNewDashboardDialog() {
		return this.newDashboardOpen ? w`
      <ods-new-dashboard-dialog
        .hass=${this.hass}
        .dashboard=${this.newDashboard}
        .saving=${this.saving}
        @new-dashboard-change=${this.onNewDashboardChange}
        @new-dashboard-close=${this.closeNewDashboard}
        @dashboard-create=${this.createDashboard}
      ></ods-new-dashboard-dialog>
    ` : E;
	}
	renderGallery() {
		return w`
      <ods-gallery
        .dashboards=${this.dashboards}
        .hass=${this.hass}
        .error=${this.error}
        .saving=${this.saving}
        .dialog=${this.dashboardDialog}
        .draft=${this.dashboardDraft}
        @dashboard-new=${this.openNewDashboard}
        @dashboard-open=${this.onDashboardOpen}
        @dashboard-menu-action=${this.onDashboardMenuAction}
        @dashboard-rename-input=${this.onRenameInput}
        @dashboard-rename-commit=${this.saveRename}
        @dashboard-rename-cancel=${this.closeAction}
        @dashboard-settings-change=${this.onSettingsChange}
        @dashboard-settings-save=${this.saveSettings}
        @dashboard-delete-confirm=${this.confirmDeleteDashboard}
        @dashboard-dialog-close=${this.closeAction}
      ></ods-gallery>
      ${this.renderNewDashboardDialog()}
    `;
	}
	renderDesign(e) {
		return w`
      <div
        class="layout"
        style=${M({
			"--toolbox-width": this.leftCollapsed ? "48px" : "255px",
			"--inspector-width": this.rightCollapsed ? "48px" : `${this.inspectorWidth}px`
		})}
        @item-select=${this.onItemSelect}
        @command=${this.onCommand}
      >
        <ods-library
          .widgets=${this.widgets}
          .widgetErrors=${this.widgetErrors}
          .primitives=${this.primitives}
          .collapsed=${this.leftCollapsed}
          @widgets-reload=${this.reloadWidgets}
          @library-collapse=${this.onLibraryCollapse}
          @catalog-add=${this.onCatalogAdd}
          @catalog-drag=${this.onCatalogDrag}
          @catalog-drop=${this.onCatalogDrop}
        ></ods-library>
        <ods-canvas
          .dashboard=${e}
          .preview=${this.preview}
          .widgets=${this.widgets}
          .primitives=${this.primitives}
          .selectedItemId=${this.selectedItemId}
          .snapEnabled=${this.snapEnabled}
          .acceptingDrop=${this.draggingCatalog}
          .canUndo=${this.undoCount > 0}
          .canRedo=${this.redoCount > 0}
          .viewport=${this.viewport}
          @viewport-change=${this.onViewportChange}
          @item-transform=${this.onItemTransform}
          @item-transform-end=${this.onItemTransformEnd}
          @snap-toggle=${this.toggleSnap}
        ></ods-canvas>
        <ods-inspector
          .hass=${this.hass}
          .dashboard=${e}
          .widgets=${this.widgets}
          .primitives=${this.primitives}
          .preview=${this.preview}
          .selectedItemId=${this.selectedItemId}
          .collapsed=${this.rightCollapsed}
          .width=${this.inspectorWidth}
          @inspector-collapse=${this.onInspectorCollapse}
          @inspector-resize=${this.onInspectorResize}
          @layers-reorder=${this.onLayersReorder}
          @item-number-change=${this.onItemNumberChange}
          @display-number-change=${this.onDisplayNumberChange}
          @profile-change=${this.onProfileChange}
          @palette-change=${this.onPaletteChange}
          @background-change=${this.onBackgroundChange}
          @widget-options-change=${this.onWidgetOptionsChange}
          @widget-picks-change=${this.onWidgetPicksChange}
          @widgets-reload=${this.reloadWidgets}
          @primitive-change=${this.onPrimitiveChange}
          @expression-change=${this.onExpressionChange}
          @dashboard-delete-request=${this.deleteDashboard}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()}
    `;
	}
	renderError() {
		return this.error ? w`
      <ha-alert alert-type="error">${this.error}</ha-alert>
    ` : E;
	}
	renderNotice() {
		return this.notice ? w`
      <ha-alert alert-type="success" class="notice">${this.notice}</ha-alert>
    ` : E;
	}
	renderEditor(e) {
		return w`
      <div class="shell">
        <ods-header
          .dashboard=${e}
          .view=${this.view}
          .dirty=${this.dirty}
          .saving=${this.saving}
          @show-dashboards=${this.showGallery}
          @dashboard-name-change=${this.onNameChange}
          @view-change=${this.onViewChange}
          @toggle-ready=${this.toggleReady}
          @dashboard-save=${this.saveDashboard}
        ></ods-header>
        ${this.renderError()} ${this.renderNotice()}
        ${this.view === "code" ? w`
                <ods-code-view .preview=${this.preview}></ods-code-view>
              ` : this.renderDesign(e)}
      </div>
    `;
	}
	render() {
		if (this.loading) return w`
        <div class="dashboard-empty">
          <p>${t.app.loading}</p>
        </div>
      `;
		let e = this.current;
		return this.view === "dashboards" || !e ? this.renderGallery() : this.renderEditor(e);
	}
};
U([A({ attribute: !1 })], $.prototype, "hass", void 0), U([j()], $.prototype, "dashboards", void 0), U([j()], $.prototype, "view", void 0), U([j()], $.prototype, "widgets", void 0), U([j()], $.prototype, "widgetErrors", void 0), U([j()], $.prototype, "notice", void 0), U([j()], $.prototype, "primitives", void 0), U([j()], $.prototype, "current", void 0), U([j()], $.prototype, "selectedItemId", void 0), U([j()], $.prototype, "preview", void 0), U([j()], $.prototype, "loading", void 0), U([j()], $.prototype, "saving", void 0), U([j()], $.prototype, "dirty", void 0), U([j()], $.prototype, "error", void 0), U([j()], $.prototype, "draggingCatalog", void 0), U([j()], $.prototype, "undoCount", void 0), U([j()], $.prototype, "redoCount", void 0), U([j()], $.prototype, "pendingDeleteItemId", void 0), U([j()], $.prototype, "leftCollapsed", void 0), U([j()], $.prototype, "rightCollapsed", void 0), U([j()], $.prototype, "inspectorWidth", void 0), U([j()], $.prototype, "snapEnabled", void 0), U([j()], $.prototype, "viewport", void 0), U([j()], $.prototype, "newDashboardOpen", void 0), U([j()], $.prototype, "newDashboard", void 0), U([j()], $.prototype, "dashboardDialog", void 0), U([j()], $.prototype, "dashboardDraft", void 0), U([lt("ods-canvas")], $.prototype, "canvas", void 0), $ = U([k("ods-app")], $);
//#endregion
export { $ as OdsApp };
