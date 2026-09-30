//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, _ = g ? g.emptyScript : "", v = h.reactiveElementPolyfillSupport, y = (e, t) => e, b = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? _ : null;
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
}, x = (e, t) => !l(e, t), ee = {
	attribute: !0,
	type: String,
	converter: b,
	reflect: !1,
	useDefault: !1,
	hasChanged: x
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var S = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ee) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? ee;
	}
	static _$Ei() {
		if (this.hasOwnProperty(y("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(y("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(y("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
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
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
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
		return s(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? b : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? b : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? x)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[y("elementProperties")] = /* @__PURE__ */ new Map(), S[y("finalized")] = /* @__PURE__ */ new Map(), v?.({ ReactiveElement: S }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var C = globalThis, te = (e) => e, w = C.trustedTypes, T = w ? w.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, E = "$lit$", D = `lit$${Math.random().toFixed(9).slice(2)}$`, ne = "?" + D, re = `<${ne}>`, O = document, k = () => O.createComment(""), A = (e) => e === null || typeof e != "object" && typeof e != "function", ie = Array.isArray, ae = (e) => ie(e) || typeof e?.[Symbol.iterator] == "function", oe = "[ 	\n\f\r]", j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, se = /-->/g, ce = />/g, M = RegExp(`>|${oe}(?:([^\\s"'>=/]+)(${oe}*=${oe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), le = /'/g, ue = /"/g, de = /^(?:script|style|textarea|title)$/i, N = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), P = Symbol.for("lit-noChange"), F = Symbol.for("lit-nothing"), fe = /* @__PURE__ */ new WeakMap(), I = O.createTreeWalker(O, 129);
function pe(e, t) {
	if (!ie(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return T === void 0 ? t : T.createHTML(t);
}
var me = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === j ? c[1] === "!--" ? o = se : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = M) : (de.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = M) : o = ce : o === M ? c[0] === ">" ? (o = i ?? j, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? M : c[3] === "\"" ? ue : le) : o === ue || o === le ? o = M : o === se || o === ce ? o = j : (o = M, i = void 0);
		let d = o === M && e[t + 1].startsWith("/>") ? " " : "";
		a += o === j ? n + re : l >= 0 ? (r.push(s), n.slice(0, l) + E + n.slice(l) + D + d) : n + D + (l === -2 ? t : d);
	}
	return [pe(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, he = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = me(t, n);
		if (this.el = e.createElement(l, r), I.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = I.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(E)) {
					let t = u[o++], n = i.getAttribute(e).split(D), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ve : r[1] === "?" ? ye : r[1] === "@" ? be : R
					}), i.removeAttribute(e);
				} else e.startsWith(D) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (de.test(i.tagName)) {
					let e = i.textContent.split(D), t = e.length - 1;
					if (t > 0) {
						i.textContent = w ? w.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], k()), I.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], k());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ne) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(D, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += D.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = O.createElement("template");
		return n.innerHTML = e, n;
	}
};
function L(e, t, n = e, r) {
	if (t === P) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = A(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = L(e, i._$AS(e, t.values), i, r)), t;
}
var ge = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? O).importNode(t, !0);
		I.currentNode = r;
		let i = I.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new _e(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new xe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = I.nextNode(), a++);
		}
		return I.currentNode = O, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, _e = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = F, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = L(this, e, t), A(e) ? e === F || e == null || e === "" ? (this._$AH !== F && this._$AR(), this._$AH = F) : e !== this._$AH && e !== P && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ae(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== F && A(this._$AH) ? this._$AA.nextSibling.data = e : this.T(O.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = he.createElement(pe(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ge(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = fe.get(e.strings);
		return t === void 0 && fe.set(e.strings, t = new he(e)), t;
	}
	k(t) {
		ie(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(k()), this.O(k()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = te(e).nextSibling;
			te(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, R = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = F, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = F;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = L(this, e, t, 0), a = !A(e) || e !== this._$AH && e !== P, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = L(this, r[n + o], t, o), s === P && (s = this._$AH[o]), a ||= !A(s) || s !== this._$AH[o], s === F ? e = F : e !== F && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === F ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ve = class extends R {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === F ? void 0 : e;
	}
}, ye = class extends R {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== F);
	}
}, be = class extends R {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = L(this, e, t, 0) ?? F) === P) return;
		let n = this._$AH, r = e === F && n !== F || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== F && (n === F || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, xe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		L(this, e);
	}
}, Se = C.litHtmlPolyfillSupport;
Se?.(he, _e), (C.litHtmlVersions ??= []).push("3.3.3");
var Ce = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new _e(t.insertBefore(k(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, we = globalThis, z = class extends S {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ce(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return P;
	}
};
z._$litElement$ = !0, z.finalized = !0, we.litElementHydrateSupport?.({ LitElement: z });
var Te = we.litElementPolyfillSupport;
Te?.({ LitElement: z }), (we.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Ee = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, De = {
	attribute: !0,
	type: String,
	converter: b,
	reflect: !1,
	hasChanged: x
}, Oe = (e = De, t, n) => {
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
function ke(e) {
	return (t, n) => typeof n == "object" ? Oe(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function B(e) {
	return ke({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Ae = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function je(e, t) {
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
			return Ae(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Ae(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/lit-html/directive.js
var Me = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Ne = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Pe = class {
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
}, Fe = "important", Ie = " !" + Fe, V = Ne(class extends Pe {
	constructor(e) {
		if (super(e), e.type !== Me.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(Ie);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? Fe : "") : n[e] = r;
			}
		}
		return P;
	}
}), Le = o`
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
  .dashboard-name { min-width: 80px; width: min(210px, 18vw); height: 32px; border: 1px solid transparent; border-radius: 7px; padding: 0 7px; background: transparent; font-size: 12px; font-weight: 600; text-overflow: ellipsis; }
  .dashboard-name:hover, .dashboard-name:focus { border-color: var(--studio-border); background: var(--secondary-background-color, #f3f5f6); outline: 0; }
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

  .dashboard-empty { position: relative; height: 100%; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--studio-accent) 12%, transparent), transparent 42%), var(--primary-background-color, #f5f7f8); }
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
    .dashboard-name { width: min(180px, 36vw); }
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
`, Re = (e, t) => {
	let n = t.trim().toLocaleLowerCase();
	return n ? e.filter((e) => `${e.name} ${e.description}`.toLocaleLowerCase().includes(n)) : e;
}, H = {
	bw: "Black / white",
	bwr: "Black / white / red",
	bwy: "Black / white / yellow",
	bwry: "Black / white / red / yellow",
	spectra6: "Spectra 6 · black / white / red / yellow / blue / green"
}, U = {
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
}, W = (e, t, n, r, i = !1) => ({
	id: `solum-${e}`,
	manufacturer: "SOLUM",
	name: `Newton Pro ${t}`,
	width: n,
	height: r,
	palettes: i ? ["bw"] : ["bw", "bwry"],
	defaultPalette: i ? "bw" : "bwry"
}), ze = [
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
	W("1-6-v", "1.6″ V", 200, 200),
	W("1-6-h", "1.6″ H", 200, 200),
	W("2-2", "2.2″", 296, 160),
	W("2-2-freezer", "2.2″ Freezer", 296, 160, !0),
	W("2-6", "2.6″", 360, 184),
	W("2-6-freezer", "2.6″ Freezer", 360, 184, !0),
	W("2-7", "2.7″", 300, 200),
	W("2-9", "2.9″", 384, 168),
	W("2-9-freezer", "2.9″ Freezer", 384, 168, !0),
	W("3-45", "3.5″ · 3.45 panel", 480, 224),
	W("3-52", "3.5″ · 3.52 panel", 384, 180),
	W("4-2", "4.2″", 400, 300),
	W("4-3", "4.3″", 522, 152),
	W("4-5", "4.5″", 480, 176),
	W("5-8", "5.8″", 792, 272),
	W("6-1", "6.1″", 648, 480),
	W("7-5", "7.5″", 800, 480),
	W("9-7", "9.7″", 672, 960),
	W("11-6", "11.6″", 640, 960),
	W("12-2", "12.2″", 768, 960),
	{
		id: "custom",
		manufacturer: "Custom",
		name: "Custom display",
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
], Be = (e) => ze.find((t) => t.id === e) ?? ze[0], Ve = () => Math.floor(Math.random() * 256), He = () => {
	let e = globalThis.crypto;
	if (typeof e?.randomUUID == "function") return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	typeof e?.getRandomValues == "function" ? e.getRandomValues(t) : t.forEach((e, n) => {
		t[n] = Ve();
	}), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0"));
	return `${n.slice(0, 4).join("")}-${n.slice(4, 6).join("")}-${n.slice(6, 8).join("")}-${n.slice(8, 10).join("")}-${n.slice(10).join("")}`;
}, Ue = (e, t) => {
	let { x: n, y: r, displayWidth: i, displayHeight: a } = t, o = Math.min(i - 1, n + 160), s = Math.min(a - 1, r + 90);
	switch (e) {
		case "text": return {
			type: "text",
			value: "Text",
			x: n,
			y: r,
			size: 32,
			color: "black"
		};
		case "rectangle": return {
			type: "rectangle",
			x_start: n,
			y_start: r,
			x_end: o,
			y_end: s,
			fill: null,
			outline: "black",
			width: 2
		};
		case "line": return {
			type: "line",
			x_start: n,
			y_start: r,
			x_end: o,
			y_end: s,
			fill: "black",
			width: 2,
			dashed: !1
		};
		case "circle": return {
			type: "circle",
			x: n,
			y: r,
			radius: Math.max(8, Math.min(40, n, r, i - n - 1, a - r - 1)),
			fill: null,
			outline: "black",
			width: 2
		};
		case "ellipse": return {
			type: "ellipse",
			x_start: n,
			y_start: r,
			x_end: o,
			y_end: s,
			fill: null,
			outline: "black",
			width: 2
		};
		case "icon": return {
			type: "icon",
			value: "star-outline",
			x: n,
			y: r,
			size: 48,
			color: "black",
			anchor: "lt"
		};
		case "qrcode": return {
			type: "qrcode",
			data: "ODX",
			x: n,
			y: r,
			boxsize: 3,
			border: 1,
			color: "black",
			bgcolor: "white"
		};
		case "progress_bar": return {
			type: "progress_bar",
			x_start: n,
			y_start: r,
			x_end: o,
			y_end: Math.min(a - 1, r + 32),
			progress: 50,
			direction: "right",
			background: "white",
			fill: "accent",
			outline: "black",
			width: 1,
			show_percentage: !0
		};
		default: return;
	}
}, We = [
	"nw",
	"n",
	"ne",
	"e",
	"se",
	"s",
	"sw",
	"w"
], G = (e, t, n) => Math.max(t, Math.min(n, e)), Ge = (e, t, n) => n + Math.round((e - n) / t) * t, Ke = (e) => e.includes("e") || e.includes("w"), qe = (e) => e.includes("n") || e.includes("s"), K = (e, t, n, r) => r ? Ge(e, t, n) : Math.round(e), Je = ({ bounds: e, handle: t, deltaX: n, deltaY: r, minimumWidth: i, minimumHeight: a, area: o, preserveAspect: s, snapSize: c, snapEnabled: l }) => {
	let u = o.x + o.width, d = o.y + o.height, f = e.x, p = e.y, m = e.x + e.width, h = e.y + e.height, g = f + e.width / 2, _ = p + e.height / 2, v = f, y = p, b = m, x = h;
	if (t.includes("w") && (v = K(f + n, c, o.x, l)), t.includes("e") && (b = K(m + n, c, o.x, l)), t.includes("n") && (y = K(p + r, c, o.y, l)), t.includes("s") && (x = K(h + r, c, o.y, l)), t.includes("w") && (v = G(v, o.x, m - i)), t.includes("e") && (b = G(b, f + i, u)), t.includes("n") && (y = G(y, o.y, h - a)), t.includes("s") && (x = G(x, p + a, d)), !s) return {
		x: Math.round(v),
		y: Math.round(y),
		width: Math.round(b - v),
		height: Math.round(x - y)
	};
	let ee = e.width / Math.max(1, e.height), S = Math.max(i, b - v), C = Math.max(a, x - y), te = Math.abs(S - e.width) / Math.max(1, e.width), w = Math.abs(C - e.height) / Math.max(1, e.height), T, E;
	Ke(t) && (!qe(t) || te >= w) ? (T = S, E = T / ee) : (E = C, T = E * ee);
	let D = t.includes("w") ? m - o.x : t.includes("e") ? u - f : Math.max(1, Math.min(g - o.x, u - g) * 2), ne = t.includes("n") ? h - o.y : t.includes("s") ? d - p : Math.max(1, Math.min(_ - o.y, d - _) * 2), re = Math.max(i / Math.max(1, e.width), a / Math.max(1, e.height)), O = Math.min(D / Math.max(1, e.width), ne / Math.max(1, e.height)), k = G(Math.max(T / Math.max(1, e.width), E / Math.max(1, e.height)), Math.min(re, O), O);
	return T = Math.max(1, Math.round(e.width * k)), E = Math.max(1, Math.round(e.height * k)), v = t.includes("w") ? m - T : t.includes("e") ? f : g - T / 2, y = t.includes("n") ? h - E : t.includes("s") ? p : _ - E / 2, v = G(Math.round(v), o.x, u - T), y = G(Math.round(y), o.y, d - E), {
		x: v,
		y,
		width: T,
		height: E
	};
}, Ye = (e, t, n, r) => {
	let i = r.includes("w") ? e.x + e.width - t : r.includes("e") ? e.x : e.x + (e.width - t) / 2, a = r.includes("n") ? e.y + e.height - n : r.includes("s") ? e.y : e.y + (e.height - n) / 2;
	return {
		x: Math.round(i),
		y: Math.round(a),
		width: t,
		height: n
	};
};
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/decorate.js
function q(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/odx-app.ts
var J = (e) => structuredClone(e), Y = (e, t, n) => Math.max(t, Math.min(n, e)), Xe = (e, t, n = 0) => n + Math.round((e - n) / t) * t, X = (e, t) => e instanceof Error && e.message ? e.message : typeof e == "string" && e ? e : t, Z = (e) => "x_start" in e, Ze = {
	text: "Text",
	rectangle: "Rectangle",
	line: "Line",
	circle: "Circle",
	ellipse: "Ellipse",
	icon: "Icon",
	qrcode: "QR code",
	progress_bar: "Progress bar"
}, Qe = {
	text: "mdi:format-text",
	rectangle: "mdi:rectangle-outline",
	line: "mdi:vector-line",
	circle: "mdi:circle-outline",
	ellipse: "mdi:ellipse-outline",
	icon: "mdi:star-outline",
	qrcode: "mdi:qrcode",
	progress_bar: "mdi:progress-helper"
}, $e = {
	nw: "north west",
	n: "north",
	ne: "north east",
	e: "east",
	se: "south east",
	s: "south",
	sw: "south west",
	w: "west"
}, et = (e, t = "custom") => {
	let n = Be(t);
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
}, tt = (e) => {
	if (Z(e)) return {
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
}, Q = (e) => e.kind === "widget" ? e.frame : tt(e.primitive), $ = class extends z {
	constructor(...e) {
		super(...e), this.dashboards = [], this.view = "dashboards", this.dashboardQuery = "", this.dashboardSort = "updated", this.widgets = [], this.primitives = [], this.selectedItemId = "", this.query = "", this.loading = !0, this.saving = !1, this.dirty = !1, this.draggingCatalog = !1, this.draggingLayerId = "", this.undoCount = 0, this.redoCount = 0, this.pendingDeleteItemId = "", this.error = "", this.leftCollapsed = !1, this.rightCollapsed = !1, this.inspectorWidth = 350, this.zoom = 1, this.panX = 0, this.panY = 0, this.snapEnabled = !0, this.newDashboardOpen = !1, this.newDashboard = et("en"), this.dashboardMenuDashboardId = "", this.yamlCopyState = "idle", this.previewRequest = 0, this.bootstrapStarted = !1, this.suppressCatalogClick = !1, this.undoStack = [], this.redoStack = [], this.onDashboardOutsidePointerDown = (e) => {
			this.dashboardMenuDashboardId && (e.composedPath().some((e) => e instanceof HTMLElement && (e.classList.contains("dashboard-menu") || e.classList.contains("dashboard-menu-trigger"))) || (this.dashboardMenuDashboardId = ""));
		}, this.onDashboardMenuKeyDown = (e) => {
			e.key === "Escape" && (this.dashboardMenuDashboardId ? (this.dashboardMenuDashboardId = "", e.stopPropagation()) : this.dashboardDialog && (this.closeDashboardAction(), e.stopPropagation()));
		}, this.undo = () => {
			if (!this.current) return;
			let e = this.undoStack.pop();
			e && (this.redoStack.push(J(this.current)), this.current = J(e), this.dirty = !0, this.selectedItemId && !this.current.items.some((e) => e.id === this.selectedItemId) && (this.selectedItemId = ""), this.syncHistoryState(), this.schedulePreview());
		}, this.redo = () => {
			if (!this.current) return;
			let e = this.redoStack.pop();
			e && (this.undoStack.push(J(this.current)), this.current = J(e), this.dirty = !0, this.selectedItemId && !this.current.items.some((e) => e.id === this.selectedItemId) && (this.selectedItemId = ""), this.syncHistoryState(), this.schedulePreview());
		}, this.onHistoryKeyDown = (e) => {
			if (!e.ctrlKey && !e.metaKey || e.composedPath().some((e) => e instanceof HTMLElement && (e.matches("input, textarea, select") || e.isContentEditable))) return;
			let t = e.key.toLowerCase();
			if (t === "z" && e.shiftKey) {
				e.preventDefault(), this.redo();
				return;
			}
			if (t === "z") {
				e.preventDefault(), this.undo();
				return;
			}
			t === "y" && (e.preventDefault(), this.redo());
		}, this.onCatalogPointerMove = (e) => {
			let t = this.catalogPointerDrag;
			if (!t || !t.active && Math.hypot(e.clientX - t.startX, e.clientY - t.startY) < 4) return;
			e.preventDefault(), t.active = !0, t.currentX = e.clientX, t.currentY = e.clientY;
			let n = this.getBoundingClientRect();
			this.draggingCatalog = !0, this.catalogDragPosition = {
				x: e.clientX - n.left - t.grabOffsetX,
				y: e.clientY - n.top - t.grabOffsetY
			};
		}, this.onCatalogPointerUp = (e) => {
			let t = this.catalogPointerDrag;
			this.finishCatalogPointerDrag(), t?.active && (this.suppressCatalogClick = !0, this.dropCatalogItem(t.value, e.clientX, e.clientY), window.setTimeout(() => {
				this.suppressCatalogClick = !1;
			}, 0));
		}, this.onCatalogPointerCancel = () => {
			this.finishCatalogPointerDrag();
		}, this.onPointerMove = (e) => {
			if (!this.current || !this.pointerEdit) return;
			let t = this.renderRoot.querySelector(".canvas");
			if (!t) return;
			let n = this.pointerEdit;
			if (!n.changed && Math.hypot(e.clientX - n.startX, e.clientY - n.startY) < 3) return;
			n.changed = !0;
			let r = t.getBoundingClientRect(), i = Math.round((e.clientX - n.startX) / r.width * this.current.display.width), a = Math.round((e.clientY - n.startY) / r.height * this.current.display.height);
			this.mutate((t) => {
				let r = t.items.findIndex((e) => e.id === n.itemId);
				if (r < 0) return;
				let o = J(n.original);
				if (o.locked) return;
				let s = this.workingArea(t), c = Q(o);
				if (n.mode === "move") {
					let e = Y(this.snapValue(c.x + i, t), s.x, Math.max(s.x, s.x + s.width - c.width)), n = Y(this.snapValue(c.y + a, t), s.y, Math.max(s.y, s.y + s.height - c.height));
					this.translateItem(o, e - c.x, n - c.y);
				} else n.resizeHandle && this.resizeItem(o, n.resizeHandle, i, a, e.shiftKey, t);
				t.items[r] = o;
			}, !1, !1);
		}, this.onPointerUp = () => {
			let e = this.pointerEdit;
			window.removeEventListener("pointermove", this.onPointerMove), window.removeEventListener("pointerup", this.onPointerUp), this.pointerEdit = void 0, e?.changed && (this.recordHistory(e.beforeDashboard), this.schedulePreview());
		}, this.onLayerPointerMove = (e) => {
			let t = this.layerPointerDrag;
			if (!t || !t.active && Math.hypot(e.clientX - t.startX, e.clientY - t.startY) < 4) return;
			e.preventDefault(), t.active = !0, this.draggingLayerId = t.itemId;
			let n = this.shadowRoot?.elementFromPoint(e.clientX, e.clientY)?.closest(".layer-row"), r = n?.dataset.itemId;
			if (!n || !r || r === t.itemId) {
				this.layerDropTarget = void 0;
				return;
			}
			let i = n.getBoundingClientRect();
			this.layerDropTarget = {
				itemId: r,
				edge: e.clientY < i.top + i.height / 2 ? "before" : "after"
			};
		}, this.onLayerPointerUp = () => {
			let e = this.layerPointerDrag, t = this.layerDropTarget;
			this.finishLayerPointerDrag(), !(!e?.active || !t || e.itemId === t.itemId) && this.mutate((n) => {
				let r = [...n.items].reverse(), i = r.findIndex((t) => t.id === e.itemId);
				if (i < 0) return;
				let [a] = r.splice(i, 1), o = r.findIndex((e) => e.id === t.itemId);
				if (o < 0) return;
				let s = t.edge === "before" ? o : o + 1;
				r.splice(s, 0, a), n.items = r.reverse();
			});
		}, this.onLayerPointerCancel = () => {
			this.finishLayerPointerDrag();
		}, this.onPanelResizeMove = (e) => {
			this.panelResize && (this.inspectorWidth = Y(this.panelResize.startWidth + this.panelResize.startX - e.clientX, 286, 560));
		}, this.onPanelResizeEnd = () => {
			this.panelResize = void 0, window.removeEventListener("pointermove", this.onPanelResizeMove), window.removeEventListener("pointerup", this.onPanelResizeEnd);
		};
	}
	static {
		this.styles = Le;
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("keydown", this.onHistoryKeyDown), window.addEventListener("keydown", this.onDashboardMenuKeyDown), window.addEventListener("pointerdown", this.onDashboardOutsidePointerDown);
	}
	firstUpdated() {
		this.ensureBootstrap();
	}
	updated(e) {
		e.has("hass") && this.ensureBootstrap();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.previewTimer && window.clearTimeout(this.previewTimer), this.yamlCopyTimer && window.clearTimeout(this.yamlCopyTimer), window.removeEventListener("pointermove", this.onPointerMove), window.removeEventListener("pointerup", this.onPointerUp), window.removeEventListener("pointermove", this.onCatalogPointerMove), window.removeEventListener("pointerup", this.onCatalogPointerUp), window.removeEventListener("pointercancel", this.onCatalogPointerCancel), window.removeEventListener("pointermove", this.onLayerPointerMove), window.removeEventListener("pointerup", this.onLayerPointerUp), window.removeEventListener("pointercancel", this.onLayerPointerCancel), window.removeEventListener("pointermove", this.onPanelResizeMove), window.removeEventListener("pointerup", this.onPanelResizeEnd), window.removeEventListener("keydown", this.onHistoryKeyDown), window.removeEventListener("keydown", this.onDashboardMenuKeyDown), window.removeEventListener("pointerdown", this.onDashboardOutsidePointerDown);
	}
	ensureBootstrap() {
		!this.hass || this.bootstrapStarted || (this.bootstrapStarted = !0, this.bootstrap());
	}
	async bootstrap() {
		let e = this.hass;
		if (e) {
			this.loading = !0, this.error = "";
			try {
				let t = await e.callWS({ type: "opendisplay_studio/bootstrap" });
				this.dashboards = t.dashboards, this.widgets = t.widgets, this.primitives = t.primitives, this.current = void 0, this.preview = void 0, this.view = "dashboards", this.clearHistory(), this.newDashboard = et(e.language);
			} catch (e) {
				this.error = X(e, "Could not load OpenDisplay Studio");
			} finally {
				this.loading = !1;
			}
		}
	}
	openNewDashboard() {
		this.newDashboard = et(this.hass?.language ?? "en"), this.newDashboardOpen = !0;
	}
	dashboardFormData(e) {
		return {
			name: e.name,
			width: e.display.width,
			height: e.display.height,
			palette: e.display.palette,
			padding: e.display.padding,
			snapSize: e.display.snapSize
		};
	}
	dashboardFromForm(e, t) {
		let n = {
			...this.dashboardFormData(e),
			...t
		}, r = J(e);
		return r.name = String(n.name), r.display.profileId = "custom", r.display.width = Math.round(Number(n.width) || 0), r.display.height = Math.round(Number(n.height) || 0), r.display.palette = n.palette in H ? n.palette : "bw", r.display.padding = Math.round(Number(n.padding) || 0), r.display.snapSize = Math.round(Number(n.snapSize) || 0), U[r.display.palette].includes(r.display.background) || (r.display.background = "white"), r;
	}
	updateNewDashboardForm(e) {
		this.newDashboard = this.dashboardFromForm(this.newDashboard, e.detail.value);
	}
	dashboardIsValid(e) {
		let { width: t, height: n, padding: r, snapSize: i } = e.display;
		return !!e.name.trim() && t >= 64 && t <= 4096 && n >= 64 && n <= 4096 && r >= 0 && r * 2 < Math.min(t, n) && i >= 1 && i <= 256;
	}
	async createDashboard() {
		if (this.hass) {
			this.saving = !0, this.error = "";
			try {
				let e = await this.hass.callWS({
					type: "opendisplay_studio/create_dashboard",
					dashboard: this.newDashboard
				});
				this.dashboards = [...this.dashboards, e.dashboard], this.current = J(e.dashboard), this.selectedItemId = "", this.dirty = !1, this.newDashboardOpen = !1, this.view = "design", this.clearHistory(), await this.composePreview(), await this.updateComplete, this.resetCanvas(), requestAnimationFrame(() => this.fitCanvas());
			} catch (e) {
				this.error = X(e, "Could not create the dashboard");
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveDashboard() {
		if (!(!this.hass || !this.current)) {
			this.saving = !0, this.error = "";
			try {
				let e = await this.hass.callWS({
					type: "opendisplay_studio/update_dashboard",
					dashboard_id: this.current.id,
					dashboard: this.current
				});
				this.current = J(e.dashboard), this.dashboards = this.dashboards.map((t) => t.id === e.dashboard.id ? e.dashboard : t), this.dirty = !1;
			} catch (e) {
				this.error = X(e, "Could not save the dashboard");
			} finally {
				this.saving = !1;
			}
		}
	}
	async deleteDashboard() {
		if (!this.hass || !this.current) return;
		let e = this.current.id;
		try {
			await this.hass.callWS({
				type: "opendisplay_studio/delete_dashboard",
				dashboard_id: e
			}), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.view = "dashboards", this.clearHistory();
		} catch (e) {
			this.error = X(e, "Could not delete the dashboard");
		}
	}
	toggleDashboardMenu(e, t) {
		e.stopPropagation(), this.dashboardMenuDashboardId = this.dashboardMenuDashboardId === t ? "" : t;
	}
	openDashboardAction(e, t, n) {
		e.stopPropagation(), this.dashboardMenuDashboardId = "", this.dashboardDraft = J(t), this.dashboardDialog = n, n === "rename" && this.updateComplete.then(() => {
			let e = this.renderRoot.querySelector(".dashboard-rename-input");
			e?.focus(), e?.select();
		});
	}
	closeDashboardAction() {
		this.dashboardDialog = void 0, this.dashboardDraft = void 0;
	}
	updateDashboardRename(e) {
		if (!this.dashboardDraft) return;
		let t = J(this.dashboardDraft);
		t.name = e.target.value, this.dashboardDraft = t;
	}
	onDashboardRenameKeyDown(e) {
		e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), this.saveDashboardRename()) : e.key === "Escape" && (e.preventDefault(), this.closeDashboardAction());
	}
	async updateDashboardFromGallery(e, t) {
		if (!(!this.hass || this.saving)) {
			this.saving = !0, this.error = "";
			try {
				let t = await this.hass.callWS({
					type: "opendisplay_studio/update_dashboard",
					dashboard_id: e.id,
					dashboard: e
				});
				return this.dashboards = this.dashboards.map((e) => e.id === t.dashboard.id ? t.dashboard : e), this.current?.id === t.dashboard.id && (this.current = J(t.dashboard), this.preview = void 0, this.dirty = !1), t.dashboard;
			} catch (e) {
				this.error = X(e, t);
				return;
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveDashboardRename() {
		if (this.dashboardDialog !== "rename" || !this.dashboardDraft || this.saving) return;
		let e = J(this.dashboardDraft);
		if (e.name = e.name.trim(), !e.name) {
			this.error = "Dashboard name cannot be empty";
			return;
		}
		if (this.dashboards.find((t) => t.id === e.id)?.name === e.name) {
			this.closeDashboardAction();
			return;
		}
		await this.updateDashboardFromGallery(e, "Could not rename the dashboard") && this.closeDashboardAction();
	}
	dashboardCopyName(e) {
		let t = new Set(this.dashboards.map((e) => e.name.toLocaleLowerCase(this.hass?.language || "en"))), n = `${e.name} copy`, r = n, i = 2;
		for (; t.has(r.toLocaleLowerCase(this.hass?.language || "en"));) r = `${n} ${i++}`;
		return r;
	}
	async duplicateDashboard(e, t) {
		if (e.stopPropagation(), !this.hass || this.saving) return;
		this.dashboardMenuDashboardId = "", this.saving = !0, this.error = "";
		let n = J(t);
		n.id = "", n.name = this.dashboardCopyName(t), n.status = "draft", n.createdAt = "", n.updatedAt = "";
		try {
			let e = await this.hass.callWS({
				type: "opendisplay_studio/create_dashboard",
				dashboard: n
			});
			this.dashboards = [...this.dashboards, e.dashboard];
		} catch (e) {
			this.error = X(e, "Could not duplicate the dashboard");
		} finally {
			this.saving = !1;
		}
	}
	updateDashboardSettings(e) {
		this.dashboardDraft &&= this.dashboardFromForm(this.dashboardDraft, e.detail.value);
	}
	async saveDashboardSettings() {
		if (this.dashboardDialog !== "settings" || !this.dashboardDraft || !this.dashboardIsValid(this.dashboardDraft)) return;
		let e = J(this.dashboardDraft);
		e.name = e.name.trim(), await this.updateDashboardFromGallery(e, "Could not update dashboard settings") && this.closeDashboardAction();
	}
	async confirmDeleteDashboard() {
		if (this.dashboardDialog !== "delete" || !this.dashboardDraft || !this.hass || this.saving) return;
		let e = this.dashboardDraft.id;
		this.saving = !0, this.error = "";
		try {
			await this.hass.callWS({
				type: "opendisplay_studio/delete_dashboard",
				dashboard_id: e
			}), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current?.id === e && (this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.clearHistory()), this.closeDashboardAction();
		} catch (e) {
			this.error = X(e, "Could not delete the dashboard");
		} finally {
			this.saving = !1;
		}
	}
	openDashboard(e) {
		if (this.current?.id === e.id) {
			this.view = "design", this.preview || this.composePreview();
			return;
		}
		this.dirty && !window.confirm("Discard unsaved dashboard changes?") || (this.current = J(e), this.selectedItemId = "", this.dirty = !1, this.clearHistory(), this.view = "design", this.composePreview().then(() => {
			this.resetCanvas(), requestAnimationFrame(() => this.fitCanvas());
		}));
	}
	showDashboards() {
		this.view = "dashboards";
	}
	setEditorView(e) {
		this.view = e, e === "code" && !this.preview && this.composePreview();
	}
	mutate(e, t = !0, n = !0) {
		if (!this.current) return;
		let r = J(this.current), i = J(this.current);
		e(i), JSON.stringify(i) !== JSON.stringify(r) && (n && this.recordHistory(r), this.current = i, this.dirty = !0, t && this.schedulePreview());
	}
	recordHistory(e) {
		this.undoStack.push(J(e)), this.undoStack.length > 100 && this.undoStack.shift(), this.redoStack = [], this.syncHistoryState();
	}
	clearHistory() {
		this.undoStack = [], this.redoStack = [], this.syncHistoryState();
	}
	syncHistoryState() {
		this.undoCount = this.undoStack.length, this.redoCount = this.redoStack.length;
	}
	selectItemId(e) {
		this.selectedItemId !== e && (this.selectedItemId = e, this.updateComplete.then(() => {
			this.selectedItemId === e && this.propertiesPanel && (this.propertiesPanel.scrollTop = 0);
		}));
	}
	schedulePreview() {
		this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.composePreview(), 220);
	}
	async composePreview() {
		if (!this.hass || !this.current) return;
		this.error = "";
		let e = ++this.previewRequest;
		try {
			let t = await this.hass.callWS({
				type: "opendisplay_studio/compose_preview",
				dashboard: J(this.current)
			});
			e === this.previewRequest && (this.preview = t, this.yamlCopyState = "idle");
		} catch (e) {
			this.error = X(e, "Could not render the preview");
		}
	}
	toggleReady() {
		this.mutate((e) => {
			e.status = e.status === "ready" ? "draft" : "ready";
		}, !1);
	}
	updateName(e) {
		let t = e.target.value;
		this.mutate((e) => {
			e.name = t;
		}, !1);
	}
	workingArea(e = this.current) {
		if (!e) return {
			x: 0,
			y: 0,
			width: 1,
			height: 1
		};
		let t = e.display.padding;
		return {
			x: t,
			y: t,
			width: e.display.width - t * 2,
			height: e.display.height - t * 2
		};
	}
	snapValue(e, t = this.current) {
		return !t || !this.snapEnabled ? Math.round(e) : Xe(e, t.display.snapSize, t.display.padding);
	}
	startCatalogPointerDrag(e, t) {
		if (e.button !== 0) return;
		e.preventDefault();
		let n = e.currentTarget.getBoundingClientRect();
		this.catalogPointerDrag = {
			value: t,
			startX: e.clientX,
			startY: e.clientY,
			currentX: e.clientX,
			currentY: e.clientY,
			grabOffsetX: e.clientX - n.left,
			grabOffsetY: e.clientY - n.top,
			previewWidth: n.width,
			previewHeight: n.height,
			active: !1
		}, window.addEventListener("pointermove", this.onCatalogPointerMove), window.addEventListener("pointerup", this.onCatalogPointerUp), window.addEventListener("pointercancel", this.onCatalogPointerCancel);
	}
	finishCatalogPointerDrag() {
		this.catalogPointerDrag = void 0, this.draggingCatalog = !1, this.catalogDragPosition = void 0, window.removeEventListener("pointermove", this.onCatalogPointerMove), window.removeEventListener("pointerup", this.onCatalogPointerUp), window.removeEventListener("pointercancel", this.onCatalogPointerCancel);
	}
	dropCatalogItem(e, t, n) {
		if (!this.current) return;
		let [r, i] = e.split(":"), a = this.renderRoot.querySelector(".canvas");
		if (!a || !i) return;
		let o = a.getBoundingClientRect();
		if (t < o.left || t > o.right || n < o.top || n > o.bottom) return;
		let s = this.workingArea(), c = Y(this.snapValue((t - o.left) / o.width * this.current.display.width), s.x, s.x + s.width - 1), l = Y(this.snapValue((n - o.top) / o.height * this.current.display.height), s.y, s.y + s.height - 1);
		r === "widget" && this.addWidget(i, c, l), r === "primitive" && this.addPrimitive(i, c, l);
	}
	onCanvasDragOver(e) {
		this.draggingCatalog && e.preventDefault();
	}
	onCanvasDrop(e) {
		e.preventDefault();
	}
	addCatalogItem(e) {
		if (this.suppressCatalogClick || !this.current) return;
		let [t, n] = e.split(":");
		if (!n) return;
		let r = this.workingArea(), i = this.current.items.length * Math.max(this.current.display.snapSize, 5) * 3 % Math.max(1, Math.min(r.width, r.height) / 3), a = this.snapValue(r.x + Math.min(24 + i, Math.max(0, r.width - 1))), o = this.snapValue(r.y + Math.min(24 + i, Math.max(0, r.height - 1)));
		t === "widget" && this.addWidget(n, a, o), t === "primitive" && this.addPrimitive(n, a, o);
	}
	addWidget(e, t, n) {
		if (!this.current) return;
		let r = this.widgets.find((t) => t.id === e);
		if (!r) return;
		let i = this.workingArea(), a = Math.min(r.layout.defaultSize?.width ?? 240, i.width), o = Math.min(r.layout.defaultSize?.height ?? 144, i.height), s = {
			id: He(),
			kind: "widget",
			locked: !1,
			hidden: !1,
			widget: {
				type: e,
				version: r.version,
				config: J(r.defaults)
			},
			frame: {
				x: Y(Math.round(t - a / 2), i.x, i.x + i.width - a),
				y: Y(Math.round(n - o / 2), i.y, i.y + i.height - o),
				width: a,
				height: o
			},
			layout: { padding: 0 }
		};
		this.mutate((e) => {
			e.items.push(s);
		}), this.selectItemId(s.id);
	}
	addPrimitive(e, t, n) {
		if (!this.current) return;
		let r = Ue(e.trim(), {
			x: Math.round(this.current.display.width / 2),
			y: Math.round(this.current.display.height / 2),
			displayWidth: this.current.display.width,
			displayHeight: this.current.display.height
		});
		if (!r) {
			this.error = `Unsupported primitive type: ${e || "(empty)"}`;
			return;
		}
		let i = {
			id: He(),
			kind: "primitive",
			locked: !1,
			hidden: !1,
			primitive: r
		}, a = Q(i);
		this.translateItem(i, Math.round(t - (a.x + a.width / 2)), Math.round(n - (a.y + a.height / 2))), this.constrainItem(i, this.current), this.mutate((e) => {
			e.items.push(i);
		}), this.selectItemId(i.id);
	}
	constrainItem(e, t) {
		let n = this.workingArea(t), r = Q(e), i = Y(r.x, n.x, Math.max(n.x, n.x + n.width - r.width)) - r.x, a = Y(r.y, n.y, Math.max(n.y, n.y + n.height - r.height)) - r.y;
		this.translateItem(e, i, a), e.kind === "widget" && (e.frame.width = Math.min(e.frame.width, n.width), e.frame.height = Math.min(e.frame.height, n.height));
	}
	translateItem(e, t, n) {
		if (e.kind === "widget") {
			e.frame.x += t, e.frame.y += n;
			return;
		}
		let r = e.primitive;
		Z(r) ? (r.x_start += t, r.x_end += t, r.y_start += n, r.y_end += n) : (r.type, r.x += t, r.y += n);
	}
	resizeItem(e, t, n, r, i, a) {
		let o = Q(e), s = 1, c = 1, l = !1;
		if (e.kind === "widget") {
			let t = this.widgets.find((t) => t.id === e.widget.type)?.layout.minSize ?? {
				width: 60,
				height: 48
			};
			s = t.width, c = t.height;
		} else if (e.primitive.type === "circle") s = c = 3, l = !0;
		else if (e.primitive.type === "qrcode") s = c = 21 + e.primitive.border * 2, l = !0;
		else if (e.primitive.type === "icon") s = c = 8, l = !0;
		else if (e.primitive.type === "text") {
			let t = tt({
				...e.primitive,
				size: 6
			});
			s = t.width, c = t.height, l = !0;
		} else e.primitive.type !== "line" && (s = c = 2);
		let u = l ? {
			n: "ne",
			e: "se",
			s: "se",
			w: "sw"
		}[t] ?? t : t, d = Je({
			bounds: o,
			handle: u,
			deltaX: n,
			deltaY: r,
			minimumWidth: s,
			minimumHeight: c,
			area: this.workingArea(a),
			preserveAspect: i || l,
			snapSize: a.display.snapSize,
			snapEnabled: this.snapEnabled
		});
		if (e.kind === "widget") {
			e.frame = d;
			return;
		}
		let f = e.primitive;
		if (Z(f)) {
			let e = d.x + d.width - 1, t = d.y + d.height - 1;
			if (f.type === "line") {
				let n = f.x_start <= f.x_end, r = f.y_start <= f.y_end;
				f.x_start = n ? d.x : e, f.x_end = n ? e : d.x, f.y_start = r ? d.y : t, f.y_end = r ? t : d.y, f.x_start === f.x_end && f.y_start === f.y_end && (f.x_end = Math.min(a.display.width - 1, f.x_start + 1));
			} else f.x_start = d.x, f.y_start = d.y, f.x_end = e, f.y_end = t;
			return;
		}
		if (f.type === "circle") {
			let e = Math.max(1, Math.floor((Math.min(d.width, d.height) - 1) / 2)), t = e * 2 + 1, n = Ye(d, t, t, u);
			f.x = n.x + e, f.y = n.y + e, f.radius = e;
			return;
		}
		if (f.type === "qrcode") {
			let e = 21 + f.border * 2;
			f.boxsize = Y(Math.floor(Math.min(d.width, d.height) / e), 1, 16);
			let t = e * f.boxsize, n = Ye(d, t, t, u);
			f.x = n.x, f.y = n.y;
			return;
		}
		if (f.type === "icon") {
			f.size = Y(Math.floor(Math.min(d.width, d.height)), 8, 256);
			let e = Ye(d, f.size, f.size, u);
			f.x = e.x, f.y = e.y;
			return;
		}
		f.size = Y(Math.round(f.size * d.width / Math.max(1, o.width)), 6, 256);
		let p = tt(f), m = Ye(d, p.width, p.height, u);
		f.x = m.x, f.y = m.y;
	}
	selectItem(e, t, n = "move", r) {
		e.stopPropagation(), e.preventDefault(), this.selectItemId(t.id), !t.locked && (n === "resize" && !r || (this.pointerEdit = {
			itemId: t.id,
			mode: n,
			resizeHandle: r,
			startX: e.clientX,
			startY: e.clientY,
			original: J(t),
			beforeDashboard: J(this.current),
			changed: !1
		}, window.addEventListener("pointermove", this.onPointerMove), window.addEventListener("pointerup", this.onPointerUp)));
	}
	updateWidgetConfig(e) {
		this.mutate((t) => {
			let n = t.items.find((e) => e.id === this.selectedItemId);
			n?.kind === "widget" && (n.widget.config = e.detail.value);
		});
	}
	updatePrimitive(e) {
		this.mutate((t) => {
			let n = t.items.find((e) => e.id === this.selectedItemId);
			if (n?.kind !== "primitive") return;
			let r = {
				...n.primitive,
				...e.detail.value
			};
			"fill" in r && r.fill === "transparent" && (r.fill = null), n.primitive = r;
		});
	}
	updateSelectedNumber(e, t) {
		if (!this.current) return;
		let n = Math.round(Number(t));
		Number.isFinite(n) && this.mutate((t) => {
			let r = t.items.find((e) => e.id === this.selectedItemId);
			if (!r || r.locked) return;
			let i = this.workingArea(t);
			if (r.kind === "widget") {
				e === "padding" && (r.layout.padding = Y(n, 0, 128)), e === "x" && (r.frame.x = Y(n, i.x, i.x + i.width - r.frame.width)), e === "y" && (r.frame.y = Y(n, i.y, i.y + i.height - r.frame.height)), e === "width" && (r.frame.width = Y(n, 1, i.x + i.width - r.frame.x)), e === "height" && (r.frame.height = Y(n, 1, i.y + i.height - r.frame.y));
				return;
			}
			let a = r.primitive;
			if (Z(a)) {
				if (e === "x") {
					let e = a.x_end - a.x_start;
					a.x_start = Y(n, i.x, i.x + i.width - e - 1), a.x_end = a.x_start + e;
				}
				if (e === "y") {
					let e = a.y_end - a.y_start;
					a.y_start = Y(n, i.y, i.y + i.height - e - 1), a.y_end = a.y_start + e;
				}
				e === "width" && (a.x_end = Y(a.x_start + Math.max(1, n) - 1, a.x_start + 1, i.x + i.width - 1)), e === "height" && (a.y_end = Y(a.y_start + Math.max(1, n) - 1, a.y_start + 1, i.y + i.height - 1));
			} else a.type === "circle" ? (e === "x" && (a.x = Y(n, i.x + a.radius, i.x + i.width - a.radius)), e === "y" && (a.y = Y(n, i.y + a.radius, i.y + i.height - a.radius)), e === "radius" && (a.radius = Y(n, 1, Math.floor(Math.min(i.width, i.height) / 2)))) : (e === "x" && (a.x = Y(n, i.x, i.x + i.width - 1)), e === "y" && (a.y = Y(n, i.y, i.y + i.height - 1)), e === "size" && a.type !== "qrcode" && (a.size = Y(n, a.type === "text" ? 6 : 8, 256)), e === "boxsize" && a.type === "qrcode" && (a.boxsize = Y(n, 1, 16)));
		});
	}
	updateDisplayNumber(e, t) {
		let n = Math.round(Number(t));
		Number.isFinite(n) && this.mutate((t) => {
			(e === "width" || e === "height") && (t.display[e] = Y(n, 64, 4096)), e === "padding" && (t.display.padding = Y(n, 0, Math.floor((Math.min(t.display.width, t.display.height) - 1) / 2))), e === "snapSize" && (t.display.snapSize = Y(n, 1, 256)), t.items.forEach((e) => this.constrainItem(e, t));
		});
	}
	updateProfile(e) {
		let t = Be(e);
		this.mutate((e) => {
			e.display.profileId = t.id, e.display.width = t.width, e.display.height = t.height, e.display.palette = t.defaultPalette, e.items.forEach((t) => this.constrainItem(t, e));
		}), requestAnimationFrame(() => this.fitCanvas());
	}
	deleteSelected() {
		this.selectedItemId && (this.pendingDeleteItemId = this.selectedItemId);
	}
	itemName(e) {
		if (e.kind === "primitive") return Ze[e.primitive.type];
		let t = this.widgets.find((t) => t.id === e.widget.type), n = e.widget.config.title;
		return typeof n == "string" && n.trim() ? n : t?.name ?? e.widget.type;
	}
	toggleItemState(e, t) {
		this.mutate((n) => {
			let r = n.items.find((t) => t.id === e);
			r && (r[t] = !r[t]);
		});
	}
	removeItem(e) {
		this.pendingDeleteItemId = e;
	}
	confirmDeleteItem() {
		let e = this.pendingDeleteItemId;
		e && (this.pendingDeleteItemId = "", this.mutate((t) => {
			t.items = t.items.filter((t) => t.id !== e);
		}), this.selectedItemId === e && this.selectItemId(""));
	}
	startLayerPointerDrag(e, t) {
		e.button === 0 && (e.stopPropagation(), e.preventDefault(), this.layerPointerDrag = {
			itemId: t,
			startX: e.clientX,
			startY: e.clientY,
			active: !1
		}, window.addEventListener("pointermove", this.onLayerPointerMove), window.addEventListener("pointerup", this.onLayerPointerUp), window.addEventListener("pointercancel", this.onLayerPointerCancel));
	}
	finishLayerPointerDrag() {
		this.layerPointerDrag = void 0, this.draggingLayerId = "", this.layerDropTarget = void 0, window.removeEventListener("pointermove", this.onLayerPointerMove), window.removeEventListener("pointerup", this.onLayerPointerUp), window.removeEventListener("pointercancel", this.onLayerPointerCancel);
	}
	startPanelResize(e) {
		e.preventDefault(), this.panelResize = {
			startX: e.clientX,
			startWidth: this.inspectorWidth
		}, window.addEventListener("pointermove", this.onPanelResizeMove), window.addEventListener("pointerup", this.onPanelResizeEnd);
	}
	onCanvasWheel(e) {
		e.preventDefault(), e.shiftKey ? this.zoom = Y(this.zoom + (e.deltaY < 0 ? .1 : -.1), .25, 4) : e.altKey ? this.panX -= e.deltaY : this.panY -= e.deltaY;
	}
	resetCanvas() {
		this.zoom = 1, this.panX = 0, this.panY = 0;
	}
	fitCanvas() {
		if (!this.current) return;
		let e = this.renderRoot.querySelector(".canvas-stage");
		if (!e) return;
		let t = Math.max(100, e.clientWidth - 96), n = Math.max(100, e.clientHeight - 96);
		this.zoom = Y(Math.min(t / this.current.display.width, n / this.current.display.height), .25, 3), this.panX = 0, this.panY = 0;
	}
	async copyGeneratedYaml() {
		if (this.preview?.yaml) {
			this.yamlCopyTimer && window.clearTimeout(this.yamlCopyTimer);
			try {
				await navigator.clipboard.writeText(this.preview.yaml), this.yamlCopyState = "copied";
			} catch {
				this.yamlCopyState = "failed";
			}
			this.yamlCopyTimer = window.setTimeout(() => {
				this.yamlCopyState = "idle";
			}, 2200);
		}
	}
	dashboardList() {
		let e = this.dashboardQuery.trim().toLocaleLowerCase(this.hass?.language || "en");
		return this.dashboards.filter((t) => !e || t.name.toLocaleLowerCase(this.hass?.language || "en").includes(e)).sort((e, t) => this.dashboardSort === "name" ? e.name.localeCompare(t.name, this.hass?.language || "en") : t.updatedAt.localeCompare(e.updatedAt) || e.name.localeCompare(t.name, this.hass?.language || "en"));
	}
	dashboardDate(e) {
		let t = new Date(e.updatedAt);
		return Number.isNaN(t.getTime()) ? "" : new Intl.DateTimeFormat(this.hass?.language || "en", { dateStyle: "medium" }).format(t);
	}
	dashboardAccent(e) {
		return e === "bwr" || e === "bwry" ? "#d32f2f" : e === "bwy" ? "#d6a800" : e === "spectra6" ? "#246bfd" : "#202124";
	}
	renderDashboardCard(e) {
		let t = U[e.display.palette], n = this.dashboardMenuDashboardId === e.id, r = this.dashboardDialog === "rename" && this.dashboardDraft?.id === e.id, i = `dashboard-menu-${e.id}`;
		return N`
      <article class=${`dashboard-card${n ? " menu-open" : ""}`} data-dashboard-id=${e.id}>
        <div class="dashboard-card-preview">
          <div
            class="dashboard-miniature"
            style=${V({
			aspectRatio: `${e.display.width} / ${e.display.height}`,
			background: e.display.background,
			"--dashboard-accent": this.dashboardAccent(e.display.palette)
		})}
          >
            <span class="miniature-title"></span>
            <span class="miniature-accent"></span>
            <span class="miniature-line long"></span>
            <span class="miniature-line"></span>
          </div>
          <span class="dashboard-resolution">${e.display.width} × ${e.display.height}</span>
        </div>
        <div class="dashboard-card-copy">
          <span class="dashboard-card-title">
            ${r ? N`<input class="dashboard-rename-input" aria-label=${`Rename dashboard ${e.name}`} .value=${this.dashboardDraft?.name ?? e.name} @input=${this.updateDashboardRename} @keydown=${this.onDashboardRenameKeyDown} @blur=${this.saveDashboardRename}>` : N`<strong>${e.name}</strong>`}
            <span class=${`status ${e.status}`}>${e.status}</span>
          </span>
          <span class="dashboard-card-meta">
            <span>${e.display.width} × ${e.display.height}</span>
            <span class="palette-dots" aria-label=${H[e.display.palette]}>${t.map((e) => N`<i style=${V({ background: e })}></i>`)}</span>
            <span>${H[e.display.palette]}</span>
          </span>
          <small>Updated ${this.dashboardDate(e)}</small>
        </div>
        <button class="dashboard-card-open" aria-label=${`Open dashboard ${e.name}`} @click=${() => this.openDashboard(e)}></button>
        <button class="dashboard-menu-trigger" aria-label=${`Dashboard actions for ${e.name}`} aria-haspopup="menu" aria-controls=${i} aria-expanded=${n} @click=${(t) => this.toggleDashboardMenu(t, e.id)}><ha-icon icon="mdi:dots-horizontal"></ha-icon></button>
        ${n ? N`
          <div class="dashboard-menu" id=${i} role="menu" aria-label=${`Actions for ${e.name}`}>
            <button role="menuitem" @click=${(t) => this.openDashboardAction(t, e, "rename")}><ha-icon icon="mdi:pencil-outline"></ha-icon><span>Rename</span></button>
            <button role="menuitem" @click=${(t) => this.duplicateDashboard(t, e)}><ha-icon icon="mdi:content-copy"></ha-icon><span>Duplicate</span></button>
            <button role="menuitem" @click=${(t) => this.openDashboardAction(t, e, "settings")}><ha-icon icon="mdi:monitor-cog"></ha-icon><span>Display Settings</span></button>
            <button class="delete" role="menuitem" @click=${(t) => this.openDashboardAction(t, e, "delete")}><ha-icon icon="mdi:delete-outline"></ha-icon><span>Delete</span></button>
          </div>
        ` : F}
      </article>
    `;
	}
	renderDashboardLibrary() {
		let e = this.dashboardList();
		return N`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div><h1>Dashboards</h1><p>${this.dashboards.length} ${this.dashboards.length === 1 ? "dashboard" : "dashboards"}</p></div>
          <ha-button class="dashboard-new-button" appearance="filled" aria-label="New dashboard" @click=${this.openNewDashboard}><span class="dashboard-new-button-label"><ha-icon icon="mdi:plus"></ha-icon><span>New dashboard</span></span></ha-button>
        </header>
        ${this.error ? N`<ha-alert alert-type="error">${this.error}</ha-alert>` : F}
        <section class="dashboard-library-tools" aria-label="Dashboard filters">
          <label class="dashboard-search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" aria-label="Search dashboards" placeholder="Search dashboards…" .value=${this.dashboardQuery} @input=${(e) => {
			this.dashboardQuery = e.target.value;
		}}></label>
          <label class="dashboard-sort"><span>Sort</span><select aria-label="Sort dashboards" .value=${this.dashboardSort} @change=${(e) => {
			this.dashboardSort = e.target.value;
		}}><option value="updated">Last updated</option><option value="name">Name A–Z</option></select></label>
        </section>
        <section class="dashboard-grid" aria-label="Saved dashboards">
          <button class="dashboard-add-card" aria-label="Add dashboard" @click=${this.openNewDashboard}><ha-icon icon="mdi:plus"></ha-icon><strong>New dashboard</strong></button>
          ${e.map((e) => this.renderDashboardCard(e))}
          ${e.length ? F : N`<div class="dashboard-no-results"><ha-icon icon="mdi:magnify"></ha-icon><strong>No dashboards found</strong><span>Try a different search.</span></div>`}
        </section>
      </main>
      ${this.renderNewDashboardDialog()}
      ${this.renderDashboardActionDialog()}
    `;
	}
	newDashboardSchema() {
		return [
			{
				name: "name",
				label: "Dashboard name",
				required: !0,
				selector: { text: {} }
			},
			{
				name: "dimensions",
				type: "grid",
				flatten: !0,
				schema: [{
					name: "width",
					label: "Width",
					required: !0,
					selector: { number: {
						mode: "box",
						min: 64,
						max: 4096,
						unit_of_measurement: "px"
					} }
				}, {
					name: "height",
					label: "Height",
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
				label: "Palette",
				required: !0,
				selector: { select: {
					mode: "dropdown",
					options: Object.entries(H).map(([e, t]) => ({
						value: e,
						label: t
					}))
				} }
			},
			{
				name: "advanced",
				type: "expandable",
				flatten: !0,
				title: "Advanced display options",
				expanded: !1,
				schema: [{
					name: "padding",
					label: "Outer padding",
					selector: { number: {
						mode: "box",
						min: 0,
						max: 1024,
						unit_of_measurement: "px"
					} }
				}, {
					name: "snapSize",
					label: "Snap size",
					selector: { number: {
						mode: "box",
						min: 1,
						max: 256,
						unit_of_measurement: "px"
					} }
				}]
			}
		];
	}
	renderNewDashboardDialog() {
		return this.newDashboardOpen ? N`
      <ha-dialog .open=${!0} width="medium" header-title="New dashboard" header-subtitle="Create a custom OpenDisplay canvas" @closed=${() => {
			this.newDashboardOpen = !1;
		}}>
        <div class="new-dashboard-content">
          <span class="form-label">Start from</span>
          <div class="dashboard-source-options" role="radiogroup" aria-label="Dashboard source">
            <button class="dashboard-source selected" type="button" role="radio" aria-checked="true">
              <ha-icon icon="mdi:monitor"></ha-icon><span><strong>Custom size</strong><small>Set resolution and colors</small></span>
            </button>
            <button class="dashboard-source" type="button" role="radio" aria-checked="false" disabled>
              <ha-icon icon="mdi:devices"></ha-icon><span><strong>From OpenDisplay device</strong><small>Coming later</small></span>
            </button>
          </div>
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${this.dashboardFormData(this.newDashboard)}
            .schema=${this.newDashboardSchema()}
            .computeLabel=${(e) => "label" in e ? e.label : e.title ?? ""}
            @value-changed=${this.updateNewDashboardForm}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${() => {
			this.newDashboardOpen = !1;
		}}>Cancel</ha-button>
          <ha-button slot="primaryAction" appearance="filled" .disabled=${this.saving || !this.dashboardIsValid(this.newDashboard)} @click=${this.createDashboard}>${this.saving ? "Creating…" : "Create dashboard"}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    ` : F;
	}
	renderDashboardActionDialog() {
		let e = this.dashboardDraft;
		return !e || this.dashboardDialog === "rename" || !this.dashboardDialog ? F : this.dashboardDialog === "delete" ? N`
      <ha-dialog .open=${!0} width="small" header-title="Delete dashboard?" @closed=${this.closeDashboardAction}>
        <div class="dashboard-delete-content">
          <p><strong>${e.name}</strong> and all of its elements will be permanently removed.</p>
          <p>This action cannot be undone.</p>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${this.closeDashboardAction}>Cancel</ha-button>
          <ha-button slot="primaryAction" variant="danger" appearance="filled" .disabled=${this.saving} @click=${this.confirmDeleteDashboard}>${this.saving ? "Deleting…" : "Delete dashboard"}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    ` : N`
      <ha-dialog .open=${!0} width="medium" header-title="Display settings" header-subtitle=${e.name} @closed=${this.closeDashboardAction}>
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${this.dashboardFormData(e)}
            .schema=${this.newDashboardSchema()}
            .computeLabel=${(e) => "label" in e ? e.label : e.title ?? ""}
            @value-changed=${this.updateDashboardSettings}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${this.closeDashboardAction}>Cancel</ha-button>
          <ha-button slot="primaryAction" appearance="filled" .disabled=${this.saving || !this.dashboardIsValid(e)} @click=${this.saveDashboardSettings}>${this.saving ? "Saving…" : "Save changes"}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
	renderDeleteDialog() {
		if (!this.pendingDeleteItemId || !this.current) return F;
		let e = this.current.items.find((e) => e.id === this.pendingDeleteItemId);
		return e ? N`<div class="dialog-scrim" @click=${(e) => {
			e.target === e.currentTarget && (this.pendingDeleteItemId = "");
		}}><section class="dialog confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-element-title"><header><div><span class="eyebrow">Confirm removal</span><h2 id="delete-element-title">Delete ${this.itemName(e)}?</h2></div><button class="icon-button" aria-label="Close" @click=${() => {
			this.pendingDeleteItemId = "";
		}}><ha-icon icon="mdi:close"></ha-icon></button></header><p>This removes the element from the dashboard. You can restore it with Undo.</p><footer><ha-button appearance="plain" @click=${() => {
			this.pendingDeleteItemId = "";
		}}>Cancel</ha-button><ha-button appearance="filled" class="confirm-delete" @click=${this.confirmDeleteItem}>Delete element</ha-button></footer></section></div>` : F;
	}
	renderToolbox() {
		if (this.leftCollapsed) return N`<aside class="panel panel-rail"><button class="icon-button" title="Expand element catalog" aria-label="Expand element catalog" @click=${() => {
			this.leftCollapsed = !1;
		}}><ha-icon icon="mdi:chevron-right"></ha-icon></button><span class="rail-label">Library</span></aside>`;
		let e = Re(this.widgets, this.query), t = Re(this.primitives, this.query);
		return N`<aside class="panel toolbox"><div class="panel-title"><div><span class="eyebrow">Library</span><h2>Elements</h2></div><button class="icon-button" title="Collapse element catalog" aria-label="Collapse element catalog" @click=${() => {
			this.leftCollapsed = !0;
		}}><ha-icon icon="mdi:chevron-left"></ha-icon></button></div><label class="search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" aria-label="Search widgets and primitives" placeholder="Search elements…" .value=${this.query} @input=${(e) => {
			this.query = e.target.value;
		}}></label><div class="catalog-scroll"><section class="catalog-section"><header><span>Widgets</span><span>${e.length}</span></header><div class="catalog-grid">${e.map((e) => {
			let t = `widget:${e.id}`;
			return N`<button class="catalog-item" title=${`${e.description} Click or drag to add.`} @click=${() => this.addCatalogItem(t)} @pointerdown=${(e) => this.startCatalogPointerDrag(e, t)}><ha-icon .icon=${e.icon}></ha-icon><strong>${e.name}</strong><small>${e.description}</small></button>`;
		})}${e.length ? F : N`<p class="empty-result">No matching widgets</p>`}</div></section><section class="catalog-section"><header><span>Primitives</span><span>${t.length}</span></header><div class="catalog-grid">${t.map((e) => {
			let t = `primitive:${e.id}`;
			return N`<button class="catalog-item" title=${`${e.description} Click or drag to add.`} @click=${() => this.addCatalogItem(t)} @pointerdown=${(e) => this.startCatalogPointerDrag(e, t)}><ha-icon .icon=${e.icon}></ha-icon><strong>${e.name}</strong><small>${e.description}</small></button>`;
		})}${t.length ? F : N`<p class="empty-result">No matching primitives</p>`}</div></section></div></aside>`;
	}
	renderCatalogDragGhost() {
		let e = this.catalogPointerDrag;
		if (!e?.active || !this.catalogDragPosition) return F;
		let [t, n] = e.value.split(":"), r = t === "widget" ? this.widgets.find((e) => e.id === n) : this.primitives.find((e) => e.id === n);
		return r ? N`
      <div
        class="catalog-drag-ghost"
        data-catalog-value=${e.value}
        style=${V({
			left: `${this.catalogDragPosition.x}px`,
			top: `${this.catalogDragPosition.y}px`,
			width: `${e.previewWidth}px`,
			height: `${e.previewHeight}px`
		})}
      >
        <ha-icon class="drag-type-icon" .icon=${r.icon}></ha-icon>
        <span>${r.name}</span>
        <ha-icon class="drag-add-icon" icon="mdi:plus"></ha-icon>
      </div>
    ` : F;
	}
	renderHistoryControls() {
		return N`<div class="history-controls"><button aria-label="Undo" title="Undo (Ctrl+Z)" ?disabled=${!this.undoCount} @click=${this.undo}><ha-icon icon="mdi:undo"></ha-icon></button><button aria-label="Redo" title="Redo (Ctrl+Shift+Z)" ?disabled=${!this.redoCount} @click=${this.redo}><ha-icon icon="mdi:redo"></ha-icon></button></div>`;
	}
	renderCanvasItem(e, t) {
		let n = Q(e), r = e.id === this.selectedItemId;
		return N`
      <div
        data-item-id=${e.id}
        class=${`selection ${r ? "selected" : ""} ${e.locked ? "locked" : ""} ${e.hidden ? "hidden" : ""}`}
        style=${V({
			left: `${n.x / t.display.width * 100}%`,
			top: `${n.y / t.display.height * 100}%`,
			width: `${n.width / t.display.width * 100}%`,
			height: `${n.height / t.display.height * 100}%`
		})}
        @pointerdown=${(t) => this.selectItem(t, e)}
      >
        ${e.hidden ? N`<span class="hidden-label">Hidden</span>` : F}
        ${e.locked ? N`<ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>` : F}
        ${r ? N`<output class="selection-size" aria-live="off">${Math.round(n.width)} × ${Math.round(n.height)}</output>` : F}
        ${r && !e.locked ? We.map((t) => N`
          <button
            data-resize-handle=${t}
            class=${`resize-handle resize-${t}`}
            tabindex="-1"
            aria-label=${`Resize ${this.itemName(e)} from ${$e[t]}`}
            @pointerdown=${(n) => this.selectItem(n, e, "resize", t)}
          ></button>
        `) : F}
      </div>
    `;
	}
	renderCanvas() {
		let e = this.current, t = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`, n = this.workingArea(e);
		return N`
      <main class="workspace">
        ${this.renderCatalogDragGhost()}
        <div class="workspace-meta">
          <span>${e.display.width} × ${e.display.height} px</span>
          <span>${e.items.length} layers</span>
          <span>Padding ${e.display.padding}px</span>
          ${this.renderHistoryControls()}
          <button class=${this.snapEnabled ? "tool-toggle active" : "tool-toggle"} aria-pressed=${this.snapEnabled} @click=${() => {
			this.snapEnabled = !this.snapEnabled;
		}}>
            <ha-icon icon="mdi:magnet"></ha-icon><span>Snap ${e.display.snapSize}px</span>
          </button>
          <span class="zoom-readout">${Math.round(this.zoom * 100)}%</span>
        </div>
        <section class=${this.draggingCatalog ? "canvas-stage accepting-drop" : "canvas-stage"} @wheel=${this.onCanvasWheel} @dragover=${this.onCanvasDragOver} @drop=${this.onCanvasDrop}>
          <div class="canvas-viewport" style=${V({ transform: t })}>
            <div class="canvas" style=${V({
			width: `${e.display.width}px`,
			height: `${e.display.height}px`
		})} @pointerdown=${() => this.selectItemId("")}>
              ${this.preview ? N`<img draggable="false" src=${this.preview.imageUrl} alt="Authoritative rendered display preview">` : N`<div class="canvas-placeholder">Rendering…</div>`}
              <div class="working-area" aria-hidden="true" style=${V({
			left: `${n.x / e.display.width * 100}%`,
			top: `${n.y / e.display.height * 100}%`,
			width: `${n.width / e.display.width * 100}%`,
			height: `${n.height / e.display.height * 100}%`,
			"--snap-size": `${e.display.snapSize * this.zoom}px`
		})}></div>
              ${e.items.map((t) => this.renderCanvasItem(t, e))}
            </div>
          </div>
          <div class="zoom-controls"><button aria-label="Zoom out" @click=${() => {
			this.zoom = Y(this.zoom - .25, .25, 4);
		}}>−</button>${[
			.5,
			1,
			2,
			3
		].map((e) => N`<button class=${this.zoom === e ? "active" : ""} aria-label=${`${e}×`} @click=${() => {
			this.zoom = e;
		}}>${e}×</button>`)}<button aria-label="Zoom in" @click=${() => {
			this.zoom = Y(this.zoom + .25, .25, 4);
		}}>+</button><button aria-label="Reset" @click=${this.resetCanvas}>Reset</button><button aria-label="Fit" @click=${this.fitCanvas}>Fit</button></div>
        </section>
      </main>
    `;
	}
	renderLayers() {
		let e = [...this.current?.items ?? []].reverse();
		return N`<section class="layers"><header><div><span class="eyebrow">Structure</span><h2>Elements</h2></div><div class="layers-header-actions"><span class="count">${e.length}</span><button class="icon-button" title="Collapse inspector" aria-label="Collapse inspector" @click=${() => {
			this.rightCollapsed = !0;
		}}><ha-icon icon="mdi:chevron-right"></ha-icon></button></div></header><div class="layer-list">${e.length ? e.map((e) => {
			let t = this.layerDropTarget?.itemId === e.id ? `drop-${this.layerDropTarget.edge}` : "", n = this.itemName(e);
			return N`<div data-item-id=${e.id} class=${`layer-row ${e.id === this.selectedItemId ? "active" : ""} ${e.hidden ? "is-hidden" : ""} ${e.id === this.draggingLayerId ? "dragging" : ""} ${t}`} @click=${() => this.selectItemId(e.id)}><button class="drag" title="Reorder layer" aria-label=${`Reorder ${n}`} @pointerdown=${(t) => this.startLayerPointerDrag(t, e.id)}><ha-icon icon="mdi:drag-vertical"></ha-icon></button><ha-icon class="layer-type-icon" .icon=${e.kind === "widget" ? this.widgets.find((t) => t.id === e.widget.type)?.icon ?? "mdi:puzzle" : Qe[e.primitive.type]}></ha-icon><span><strong>${n}</strong><small>${e.kind === "widget" ? "Widget" : e.primitive.type}</small></span><div class="layer-actions"><button title=${e.hidden ? "Show layer" : "Hide layer"} aria-label=${e.hidden ? `Show ${n}` : `Hide ${n}`} @click=${(t) => {
				t.stopPropagation(), this.toggleItemState(e.id, "hidden");
			}}><ha-icon .icon=${e.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline"}></ha-icon></button><button title=${e.locked ? "Unlock position" : "Lock position"} aria-label=${e.locked ? `Unlock ${n}` : `Lock ${n}`} @click=${(t) => {
				t.stopPropagation(), this.toggleItemState(e.id, "locked");
			}}><ha-icon .icon=${e.locked ? "mdi:lock" : "mdi:lock-open-variant-outline"}></ha-icon></button><button class="delete" title="Delete layer" aria-label=${`Delete ${n}`} @click=${(t) => {
				t.stopPropagation(), this.removeItem(e.id);
			}}><ha-icon icon="mdi:delete-outline"></ha-icon></button></div></div>`;
		}) : N`<p class="empty-layers">Drag widgets or primitives onto the canvas.</p>`}</div></section>`;
	}
	numberField(e, t, n, r = 0, i = 4096, a = !1) {
		return N`<label class="number-field"><span>${e}</span><input data-field=${n} type="number" .value=${String(t)} min=${r} max=${i} .disabled=${a} @change=${(e) => this.updateSelectedNumber(n, e.target.value)}></label>`;
	}
	screenNumberField(e, t, n, r, i) {
		return N`<label class="number-field"><span>${e}</span><input aria-label=${e} type="number" .value=${String(t)} min=${r} max=${i} @change=${(e) => this.updateDisplayNumber(n, e.target.value)}></label>`;
	}
	renderInspectorHeader(e, t, n) {
		return N`<div class="inspector-title"><ha-icon .icon=${n}></ha-icon><div><h2>${e}</h2><p>${t}</p></div></div>`;
	}
	renderScreenInspector() {
		let e = this.current, t = Be(e.display.profileId);
		return N`${this.renderInspectorHeader("Dashboard", "Display and canvas settings", "mdi:monitor")}<details class="inspector-section" open><summary>Display</summary><div class="section-body"><label class="stack-field">Display type<select @change=${(e) => this.updateProfile(e.target.value)}>${ze.map((t) => N`<option value=${t.id} ?selected=${t.id === e.display.profileId}>${t.manufacturer} · ${t.name}</option>`)}</select></label><div class="field-grid">${this.screenNumberField("Width", e.display.width, "width", 64, 4096)}${this.screenNumberField("Height", e.display.height, "height", 64, 4096)}</div><div class="field-grid"><label class="stack-field">Palette<select @change=${(e) => {
			let t = e.target.value;
			this.mutate((e) => {
				e.display.palette = t, U[t].includes(e.display.background) || (e.display.background = "white");
			});
		}}>${(t.id === "custom" ? Object.keys(H) : t.palettes).map((t) => N`<option value=${t} ?selected=${t === e.display.palette}>${H[t]}</option>`)}</select></label><label class="stack-field">Background<select @change=${(e) => {
			let t = e.target.value;
			this.mutate((e) => {
				e.display.background = t;
			});
		}}>${U[e.display.palette].map((t) => N`<option value=${t} ?selected=${t === e.display.background}>${t[0].toUpperCase()}${t.slice(1)}</option>`)}</select></label></div></div></details><details class="inspector-section" open><summary>Working area</summary><div class="section-body"><div class="field-grid">${this.screenNumberField("Outer padding", e.display.padding, "padding", 0, 1024)}${this.screenNumberField("Snap size", e.display.snapSize, "snapSize", 1, 256)}</div><p class="field-help">Padding defines the editable safe area. Snap aligns movement and resizing to pixel increments.</p></div></details><div class="danger-zone"><ha-button appearance="plain" @click=${this.deleteDashboard}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Delete dashboard</ha-button></div>${this.renderMetrics()}`;
	}
	renderItemLayout(e) {
		let t = e.locked;
		if (e.kind === "widget") return N`<div class="field-grid">${this.numberField("X", e.frame.x, "x", 0, this.current.display.width, t)}${this.numberField("Y", e.frame.y, "y", 0, this.current.display.height, t)}${this.numberField("Width", e.frame.width, "width", 1, this.current.display.width, t)}${this.numberField("Height", e.frame.height, "height", 1, this.current.display.height, t)}</div>${this.numberField("Inner padding", e.layout.padding, "padding", 0, 128, t)}`;
		let n = e.primitive;
		return Z(n) ? N`<div class="field-grid">${this.numberField("X", Math.min(n.x_start, n.x_end), "x", 0, this.current.display.width, t)}${this.numberField("Y", Math.min(n.y_start, n.y_end), "y", 0, this.current.display.height, t)}${this.numberField("Width", Math.abs(n.x_end - n.x_start) + 1, "width", 1, this.current.display.width, t)}${this.numberField("Height", Math.abs(n.y_end - n.y_start) + 1, "height", 1, this.current.display.height, t)}</div>` : n.type === "circle" ? N`<div class="field-grid">${this.numberField("Center X", n.x, "x", 0, this.current.display.width, t)}${this.numberField("Center Y", n.y, "y", 0, this.current.display.height, t)}${this.numberField("Radius", n.radius, "radius", 1, Math.min(this.current.display.width, this.current.display.height), t)}</div>` : n.type === "qrcode" ? N`<div class="field-grid">${this.numberField("X", n.x, "x", 0, this.current.display.width, t)}${this.numberField("Y", n.y, "y", 0, this.current.display.height, t)}${this.numberField("Module size", n.boxsize, "boxsize", 1, 16, t)}</div>` : N`<div class="field-grid">${this.numberField("X", n.x, "x", 0, this.current.display.width, t)}${this.numberField("Y", n.y, "y", 0, this.current.display.height, t)}${this.numberField("Size", n.size, "size", 6, 256, t)}</div>`;
	}
	primitiveAppearanceSchema(e) {
		let t = e.primitive.type, n = [...U[this.current?.display.palette ?? "bw"], "accent"];
		return t === "text" ? [{
			name: "value",
			label: "Text",
			selector: { text: {} }
		}, {
			name: "color",
			label: "Color",
			selector: { select: { options: n } }
		}] : t === "line" ? [
			{
				name: "fill",
				label: "Color",
				selector: { select: { options: n } }
			},
			{
				name: "width",
				label: "Line width",
				selector: { number: {
					min: 1,
					max: 32
				} }
			},
			{
				name: "dashed",
				label: "Dashed",
				selector: { boolean: {} }
			}
		] : t === "icon" ? [{
			name: "value",
			label: "MDI icon name",
			selector: { text: {} }
		}, {
			name: "color",
			label: "Color",
			selector: { select: { options: n } }
		}] : t === "qrcode" ? [
			{
				name: "data",
				label: "Content",
				selector: { text: {} }
			},
			{
				name: "border",
				label: "Quiet zone",
				selector: { number: {
					min: 0,
					max: 8
				} }
			},
			{
				name: "color",
				label: "Foreground",
				selector: { select: { options: n } }
			},
			{
				name: "bgcolor",
				label: "Background",
				selector: { select: { options: n } }
			}
		] : t === "progress_bar" ? [
			{
				name: "progress",
				label: "Progress",
				selector: { number: {
					min: 0,
					max: 100
				} }
			},
			{
				name: "direction",
				label: "Direction",
				selector: { select: { options: [
					"right",
					"left",
					"up",
					"down"
				] } }
			},
			{
				name: "fill",
				label: "Fill",
				selector: { select: { options: n } }
			},
			{
				name: "background",
				label: "Background",
				selector: { select: { options: n } }
			},
			{
				name: "show_percentage",
				label: "Show percentage",
				selector: { boolean: {} }
			}
		] : [
			{
				name: "fill",
				label: "Fill",
				selector: { select: { options: ["transparent", ...n] } }
			},
			{
				name: "outline",
				label: "Outline",
				selector: { select: { options: n } }
			},
			{
				name: "width",
				label: "Outline width",
				selector: { number: {
					min: 0,
					max: 32
				} }
			}
		];
	}
	renderItemInspector(e) {
		let t = e.kind === "widget" ? this.widgets.find((t) => t.id === e.widget.type) : void 0, n = this.itemName(e), r = `${e.kind === "widget" ? "Widget" : "ODL primitive"} · ${e.locked ? "position locked" : "editable"}`, i = e.kind === "widget" ? t?.icon ?? "mdi:puzzle" : Qe[e.primitive.type], a = e.kind === "primitive" && "fill" in e.primitive ? {
			...e.primitive,
			fill: e.primitive.fill ?? "transparent"
		} : e.kind === "primitive" ? e.primitive : void 0;
		return N`${this.renderInspectorHeader(n, r, i)}${e.locked ? N`<div class="locked-notice"><span><ha-icon icon="mdi:lock"></ha-icon>Position is locked</span><button type="button" aria-label="Unlock element position" @click=${() => this.toggleItemState(e.id, "locked")}>Unlock</button></div>` : F}<details class="inspector-section" open><summary>Layout</summary><div class="section-body">${this.renderItemLayout(e)}</div></details>${e.kind === "widget" ? N`<details class="inspector-section" open><summary>Widget settings</summary><div class="section-body"><ha-form .hass=${this.hass} .data=${e.widget.config} .schema=${t?.fields.map((e) => ({
			name: e.key,
			label: e.label,
			required: e.required,
			selector: e.selector
		})) ?? []} .computeLabel=${(e) => e.label} @value-changed=${this.updateWidgetConfig}></ha-form></div></details>` : N`<details class="inspector-section" open><summary>Appearance</summary><div class="section-body"><ha-form .hass=${this.hass} .data=${a} .schema=${this.primitiveAppearanceSchema(e)} .computeLabel=${(e) => e.label} @value-changed=${this.updatePrimitive}></ha-form></div></details>`}<div class="danger-zone"><ha-button appearance="plain" @click=${this.deleteSelected}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Remove element</ha-button></div>${this.renderMetrics()}`;
	}
	renderMetrics() {
		return this.preview ? N`${this.preview.warnings.map((e) => N`<ha-alert class="warning" alert-type="warning">${e}</ha-alert>`)}<details class="inspector-section telemetry"><summary>Render diagnostics</summary><div class="section-body metrics"><span>Queue</span><strong>${this.preview.timings.queue.toFixed(1)} ms</strong><span>Data</span><strong>${this.preview.timings.data.toFixed(1)} ms</strong><span>Compile</span><strong>${this.preview.timings.compile.toFixed(1)} ms</strong><span>Render</span><strong>${this.preview.timings.render.toFixed(1)} ms</strong><span>Encode</span><strong>${this.preview.timings.encode.toFixed(1)} ms</strong><span>Total</span><strong>${this.preview.timings.pipeline.toFixed(1)} ms</strong></div></details>` : F;
	}
	renderInspector() {
		if (this.rightCollapsed) return N`<aside class="panel panel-rail right-rail"><button class="icon-button" title="Expand inspector" aria-label="Expand inspector" @click=${() => {
			this.rightCollapsed = !1;
		}}><ha-icon icon="mdi:chevron-left"></ha-icon></button><span class="rail-label">Layers</span></aside>`;
		let e = this.current?.items.find((e) => e.id === this.selectedItemId);
		return N`<aside class="panel inspector"><div class="panel-resizer" role="separator" aria-orientation="vertical" aria-label="Resize inspector" @pointerdown=${this.startPanelResize}></div>${this.renderLayers()}<section class="properties">${e ? this.renderItemInspector(e) : this.renderScreenInspector()}</section></aside>${this.renderDeleteDialog()}`;
	}
	renderEditorHeader() {
		let e = this.current;
		return N`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">OpenDisplay Studio</strong>
          <span class="breadcrumb-divider">/</span>
          <button class="breadcrumb-link" @click=${this.showDashboards}>Dashboards</button>
          <span class="breadcrumb-divider">/</span>
          <input class="dashboard-name" aria-label="Dashboard name" .value=${e.name} @input=${this.updateName}>
        </div>
        <nav class="view-switch" aria-label="Dashboard view">
          <button class=${this.view === "design" ? "active" : ""} aria-pressed=${this.view === "design"} @click=${() => this.setEditorView("design")}><ha-icon icon="mdi:tools"></ha-icon>Design</button>
          <button class=${this.view === "code" ? "active" : ""} aria-pressed=${this.view === "code"} @click=${() => this.setEditorView("code")}><ha-icon icon="mdi:code-tags"></ha-icon>Code</button>
        </nav>
        <div class="editor-actions">
          <span class="status ${e.status}">${e.status}</span>
          <ha-button appearance="plain" @click=${this.toggleReady}>${e.status === "ready" ? "Set Draft" : "Set Ready"}</ha-button>
          <ha-button appearance="filled" .disabled=${!this.dirty || this.saving} @click=${this.saveDashboard}>${this.saving ? "Saving…" : "Save"}</ha-button>
        </div>
      </header>
    `;
	}
	renderCodeView() {
		let e = this.yamlCopyState === "copied" ? "Copied" : this.yamlCopyState === "failed" ? "Copy failed" : "Copy YAML", t = this.yamlCopyState === "copied" ? "mdi:check" : this.yamlCopyState === "failed" ? "mdi:alert-circle-outline" : "mdi:content-copy";
		return N`
      <main class="code-workspace">
        <section class="code-panel" aria-labelledby="generated-code-title">
          <header>
            <div>
              <span class="eyebrow">Generated output</span>
              <h1 id="generated-code-title">Generated ODL YAML</h1>
              <p>Read-only output generated from the current dashboard.</p>
            </div>
            <ha-button appearance="plain" aria-label="Copy generated ODL YAML" .disabled=${!this.preview?.yaml} @click=${this.copyGeneratedYaml}><ha-icon slot="start" .icon=${t}></ha-icon>${e}</ha-button>
          </header>
          ${this.preview?.warnings.map((e) => N`<ha-alert alert-type="warning">${e}</ha-alert>`) ?? F}
          <textarea aria-label="Generated ODL YAML" readonly spellcheck="false" dir="ltr" .value=${this.preview?.yaml ?? ""}></textarea>
          <output class="copy-status" aria-live="polite">${this.yamlCopyState === "copied" ? "YAML copied to clipboard" : this.yamlCopyState === "failed" ? "Clipboard access failed" : ""}</output>
        </section>
      </main>
    `;
	}
	render() {
		if (this.loading) return N`<div class="dashboard-empty"><p>Loading OpenDisplay Studio…</p></div>`;
		if (this.view === "dashboards" || !this.current) return this.renderDashboardLibrary();
		let e = V({
			"--toolbox-width": this.leftCollapsed ? "48px" : "255px",
			"--inspector-width": this.rightCollapsed ? "48px" : `${this.inspectorWidth}px`
		});
		return N`<div class="shell">${this.renderEditorHeader()}${this.error ? N`<ha-alert alert-type="error">${this.error}</ha-alert>` : F}${this.view === "code" ? this.renderCodeView() : N`<div class="layout" style=${e}>${this.renderToolbox()}${this.renderCanvas()}${this.renderInspector()}</div>`}</div>`;
	}
};
q([ke({ attribute: !1 })], $.prototype, "hass", void 0), q([B()], $.prototype, "dashboards", void 0), q([B()], $.prototype, "view", void 0), q([B()], $.prototype, "dashboardQuery", void 0), q([B()], $.prototype, "dashboardSort", void 0), q([B()], $.prototype, "widgets", void 0), q([B()], $.prototype, "primitives", void 0), q([B()], $.prototype, "current", void 0), q([B()], $.prototype, "selectedItemId", void 0), q([B()], $.prototype, "query", void 0), q([B()], $.prototype, "preview", void 0), q([B()], $.prototype, "loading", void 0), q([B()], $.prototype, "saving", void 0), q([B()], $.prototype, "dirty", void 0), q([B()], $.prototype, "draggingCatalog", void 0), q([B()], $.prototype, "draggingLayerId", void 0), q([B()], $.prototype, "catalogDragPosition", void 0), q([B()], $.prototype, "layerDropTarget", void 0), q([B()], $.prototype, "undoCount", void 0), q([B()], $.prototype, "redoCount", void 0), q([B()], $.prototype, "pendingDeleteItemId", void 0), q([B()], $.prototype, "error", void 0), q([B()], $.prototype, "leftCollapsed", void 0), q([B()], $.prototype, "rightCollapsed", void 0), q([B()], $.prototype, "inspectorWidth", void 0), q([B()], $.prototype, "zoom", void 0), q([B()], $.prototype, "panX", void 0), q([B()], $.prototype, "panY", void 0), q([B()], $.prototype, "snapEnabled", void 0), q([B()], $.prototype, "newDashboardOpen", void 0), q([B()], $.prototype, "newDashboard", void 0), q([B()], $.prototype, "dashboardMenuDashboardId", void 0), q([B()], $.prototype, "dashboardDialog", void 0), q([B()], $.prototype, "dashboardDraft", void 0), q([B()], $.prototype, "yamlCopyState", void 0), q([je(".properties")], $.prototype, "propertiesPanel", void 0), $ = q([Ee("opendisplay-studio-panel")], $);
//#endregion
export { $ as OpenDisplayStudioPanel };
