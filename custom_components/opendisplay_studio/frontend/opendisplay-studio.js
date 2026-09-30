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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, ee = h.trustedTypes, te = ee ? ee.emptyScript : "", g = h.reactiveElementPolyfillSupport, _ = (e, t) => e, v = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? te : null;
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
}, y = (e, t) => !l(e, t), ne = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	useDefault: !1,
	hasChanged: y
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ne) {
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
		return this.elementProperties.get(e) ?? ne;
	}
	static _$Ei() {
		if (this.hasOwnProperty(_("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(_("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_("properties"))) {
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
			let i = (n.converter?.toAttribute === void 0 ? v : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? v : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? y)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[_("elementProperties")] = /* @__PURE__ */ new Map(), b[_("finalized")] = /* @__PURE__ */ new Map(), g?.({ ReactiveElement: b }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var re = globalThis, ie = (e) => e, ae = re.trustedTypes, x = ae ? ae.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, S = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, oe = "?" + C, se = `<${oe}>`, w = document, T = () => w.createComment(""), ce = (e) => e === null || typeof e != "object" && typeof e != "function", le = Array.isArray, ue = (e) => le(e) || typeof e?.[Symbol.iterator] == "function", de = "[ 	\n\f\r]", fe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pe = /-->/g, me = />/g, E = RegExp(`>|${de}(?:([^\\s"'>=/]+)(${de}*=${de}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), he = /'/g, ge = /"/g, _e = /^(?:script|style|textarea|title)$/i, D = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), O = Symbol.for("lit-noChange"), k = Symbol.for("lit-nothing"), ve = /* @__PURE__ */ new WeakMap(), A = w.createTreeWalker(w, 129);
function ye(e, t) {
	if (!le(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return x === void 0 ? t : x.createHTML(t);
}
var be = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = fe;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === fe ? c[1] === "!--" ? o = pe : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = E) : (_e.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = E) : o = me : o === E ? c[0] === ">" ? (o = i ?? fe, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? E : c[3] === "\"" ? ge : he) : o === ge || o === he ? o = E : o === pe || o === me ? o = fe : (o = E, i = void 0);
		let d = o === E && e[t + 1].startsWith("/>") ? " " : "";
		a += o === fe ? n + se : l >= 0 ? (r.push(s), n.slice(0, l) + S + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
	}
	return [ye(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, xe = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = be(t, n);
		if (this.el = e.createElement(l, r), A.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = A.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(S)) {
					let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Ee : r[1] === "?" ? De : r[1] === "@" ? Oe : Te
					}), i.removeAttribute(e);
				} else e.startsWith(C) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (_e.test(i.tagName)) {
					let e = i.textContent.split(C), t = e.length - 1;
					if (t > 0) {
						i.textContent = ae ? ae.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], T()), A.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], T());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === oe) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(C, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += C.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = w.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Se(e, t, n = e, r) {
	if (t === O) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = ce(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Se(e, i._$AS(e, t.values), i, r)), t;
}
var Ce = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? w).importNode(t, !0);
		A.currentNode = r;
		let i = A.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new we(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ke(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = A.nextNode(), a++);
		}
		return A.currentNode = w, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, we = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = k, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = Se(this, e, t), ce(e) ? e === k || e == null || e === "" ? (this._$AH !== k && this._$AR(), this._$AH = k) : e !== this._$AH && e !== O && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ue(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== k && ce(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = xe.createElement(ye(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ce(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ve.get(e.strings);
		return t === void 0 && ve.set(e.strings, t = new xe(e)), t;
	}
	k(t) {
		le(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(T()), this.O(T()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ie(e).nextSibling;
			ie(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Te = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = k, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = k;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Se(this, e, t, 0), a = !ce(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Se(this, r[n + o], t, o), s === O && (s = this._$AH[o]), a ||= !ce(s) || s !== this._$AH[o], s === k ? e = k : e !== k && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === k ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Ee = class extends Te {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === k ? void 0 : e;
	}
}, De = class extends Te {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== k);
	}
}, Oe = class extends Te {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Se(this, e, t, 0) ?? k) === O) return;
		let n = this._$AH, r = e === k && n !== k || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== k && (n === k || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ke = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Se(this, e);
	}
}, Ae = re.litHtmlPolyfillSupport;
Ae?.(xe, we), (re.litHtmlVersions ??= []).push("3.3.3");
var je = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new we(t.insertBefore(T(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Me = globalThis, j = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = je(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return O;
	}
};
j._$litElement$ = !0, j.finalized = !0, Me.litElementHydrateSupport?.({ LitElement: j });
var Ne = Me.litElementPolyfillSupport;
Ne?.({ LitElement: j }), (Me.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var M = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Pe = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	hasChanged: y
}, Fe = (e = Pe, t, n) => {
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
function N(e) {
	return (t, n) => typeof n == "object" ? Fe(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function P(e) {
	return N({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Ie = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function Le(e, t) {
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
			return Ie(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Ie(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/lit-html/directive.js
var Re = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, ze = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Be = class {
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
}, Ve = "important", He = " !" + Ve, F = ze(class extends Be {
	constructor(e) {
		if (super(e), e.type !== Re.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(He);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? Ve : "") : n[e] = r;
			}
		}
		return O;
	}
}), I = (e, t, n) => Math.max(t, Math.min(n, e)), Ue = (e, t, n = 0) => n + Math.round((e - n) / t) * t, We = [
	"nw",
	"n",
	"ne",
	"e",
	"se",
	"s",
	"sw",
	"w"
], Ge = (e) => e.includes("e") || e.includes("w"), Ke = (e) => e.includes("n") || e.includes("s"), qe = (e, t, n, r) => r ? Ue(e, t, n) : Math.round(e), Je = (e) => {
	if (e.startHandle) return e.originalEnd - e.areaStart;
	if (e.endHandle) return e.areaEnd - e.originalStart;
	let t = Math.min(e.originalCenter - e.areaStart, e.areaEnd - e.originalCenter);
	return Math.max(1, t * 2);
}, Ye = (e, t, n, r, i) => e ? n + r - i : t ? n : n + (r - i) / 2, Xe = ({ bounds: e, handle: t, deltaX: n, deltaY: r, minimumWidth: i, minimumHeight: a, area: o, preserveAspect: s, snapSize: c, snapEnabled: l }) => {
	let u = o.x + o.width, d = o.y + o.height, f = e.x, p = e.y, m = e.x + e.width, h = e.y + e.height, ee = f + e.width / 2, te = p + e.height / 2, g = f, _ = p, v = m, y = h;
	if (t.includes("w") && (g = qe(f + n, c, o.x, l)), t.includes("e") && (v = qe(m + n, c, o.x, l)), t.includes("n") && (_ = qe(p + r, c, o.y, l)), t.includes("s") && (y = qe(h + r, c, o.y, l)), t.includes("w") && (g = I(g, o.x, m - i)), t.includes("e") && (v = I(v, f + i, u)), t.includes("n") && (_ = I(_, o.y, h - a)), t.includes("s") && (y = I(y, p + a, d)), !s) return {
		x: Math.round(g),
		y: Math.round(_),
		width: Math.round(v - g),
		height: Math.round(y - _)
	};
	let ne = e.width / Math.max(1, e.height), b = Math.max(i, v - g), re = Math.max(a, y - _), ie = Math.abs(b - e.width) / Math.max(1, e.width), ae = Math.abs(re - e.height) / Math.max(1, e.height), x, S;
	Ge(t) && (!Ke(t) || ie >= ae) ? (x = b, S = x / ne) : (S = re, x = S * ne);
	let C = Je({
		startHandle: t.includes("w"),
		endHandle: t.includes("e"),
		originalStart: f,
		originalEnd: m,
		originalCenter: ee,
		areaStart: o.x,
		areaEnd: u
	}), oe = Je({
		startHandle: t.includes("n"),
		endHandle: t.includes("s"),
		originalStart: p,
		originalEnd: h,
		originalCenter: te,
		areaStart: o.y,
		areaEnd: d
	}), se = Math.max(i / Math.max(1, e.width), a / Math.max(1, e.height)), w = Math.min(C / Math.max(1, e.width), oe / Math.max(1, e.height)), T = I(Math.max(x / Math.max(1, e.width), S / Math.max(1, e.height)), Math.min(se, w), w);
	return x = Math.max(1, Math.round(e.width * T)), S = Math.max(1, Math.round(e.height * T)), g = t.includes("w") ? m - x : t.includes("e") ? f : ee - x / 2, _ = t.includes("n") ? h - S : t.includes("s") ? p : te - S / 2, g = I(Math.round(g), o.x, u - x), _ = I(Math.round(_), o.y, d - S), {
		x: g,
		y: _,
		width: x,
		height: S
	};
}, Ze = (e, t, n, r) => {
	let i = Ye(r.includes("w"), r.includes("e"), e.x, e.width, t), a = Ye(r.includes("n"), r.includes("s"), e.y, e.height, n);
	return {
		x: Math.round(i),
		y: Math.round(a),
		width: t,
		height: n
	};
}, Qe = (e) => "x_start" in e, $e = (e) => {
	if (Qe(e)) return {
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
}, et = (e) => e.kind === "widget" ? e.frame : $e(e.primitive), L = (e) => {
	let t = e.display.padding;
	return {
		x: t,
		y: t,
		width: e.display.width - t * 2,
		height: e.display.height - t * 2
	};
}, tt = (e, t, n) => n ? Ue(e, t.display.snapSize, t.display.padding) : Math.round(e), nt = (e, t, n) => {
	if (e.kind === "widget") {
		e.frame.x += t, e.frame.y += n;
		return;
	}
	let r = e.primitive;
	Qe(r) ? (r.x_start += t, r.x_end += t, r.y_start += n, r.y_end += n) : (r.x += t, r.y += n);
}, rt = (e, t) => {
	let n = L(t), r = et(e);
	nt(e, I(r.x, n.x, Math.max(n.x, n.x + n.width - r.width)) - r.x, I(r.y, n.y, Math.max(n.y, n.y + n.height - r.height)) - r.y), e.kind === "widget" && (e.frame.width = Math.min(e.frame.width, n.width), e.frame.height = Math.min(e.frame.height, n.height));
}, it = {
	width: 60,
	height: 48
}, at = (e, t) => {
	if (e.kind === "widget") return {
		minimumWidth: t.width,
		minimumHeight: t.height,
		intrinsicAspect: !1
	};
	let n = e.primitive;
	if (n.type === "circle") return {
		minimumWidth: 3,
		minimumHeight: 3,
		intrinsicAspect: !0
	};
	if (n.type === "qrcode") {
		let e = 21 + n.border * 2;
		return {
			minimumWidth: e,
			minimumHeight: e,
			intrinsicAspect: !0
		};
	}
	if (n.type === "icon") return {
		minimumWidth: 8,
		minimumHeight: 8,
		intrinsicAspect: !0
	};
	if (n.type === "text") {
		let e = $e({
			...n,
			size: 6
		});
		return {
			minimumWidth: e.width,
			minimumHeight: e.height,
			intrinsicAspect: !0
		};
	}
	return n.type === "line" ? {
		minimumWidth: 1,
		minimumHeight: 1,
		intrinsicAspect: !1
	} : {
		minimumWidth: 2,
		minimumHeight: 2,
		intrinsicAspect: !1
	};
}, ot = {
	n: "ne",
	e: "se",
	s: "se",
	w: "sw"
}, st = (e, t, n, r, i, a, o) => {
	let s = et(e), { minimumWidth: c, minimumHeight: l, intrinsicAspect: u } = at(e, o.minSize ?? it), d = u ? ot[t] ?? t : t, f = Xe({
		bounds: s,
		handle: d,
		deltaX: n,
		deltaY: r,
		minimumWidth: c,
		minimumHeight: l,
		area: L(a),
		preserveAspect: i || u,
		snapSize: a.display.snapSize,
		snapEnabled: o.snapEnabled
	});
	if (e.kind === "widget") {
		e.frame = f;
		return;
	}
	let p = e.primitive;
	if (Qe(p)) {
		let e = f.x + f.width - 1, t = f.y + f.height - 1;
		if (p.type === "line") {
			let n = p.x_start <= p.x_end, r = p.y_start <= p.y_end;
			p.x_start = n ? f.x : e, p.x_end = n ? e : f.x, p.y_start = r ? f.y : t, p.y_end = r ? t : f.y, p.x_start === p.x_end && p.y_start === p.y_end && (p.x_end = Math.min(a.display.width - 1, p.x_start + 1));
		} else p.x_start = f.x, p.y_start = f.y, p.x_end = e, p.y_end = t;
		return;
	}
	if (p.type === "circle") {
		let e = Math.max(1, Math.floor((Math.min(f.width, f.height) - 1) / 2)), t = e * 2 + 1, n = Ze(f, t, t, d);
		p.x = n.x + e, p.y = n.y + e, p.radius = e;
		return;
	}
	if (p.type === "qrcode") {
		let e = 21 + p.border * 2;
		p.boxsize = I(Math.floor(Math.min(f.width, f.height) / e), 1, 16);
		let t = e * p.boxsize, n = Ze(f, t, t, d);
		p.x = n.x, p.y = n.y;
		return;
	}
	if (p.type === "icon") {
		p.size = I(Math.floor(Math.min(f.width, f.height)), 8, 256);
		let e = Ze(f, p.size, p.size, d);
		p.x = e.x, p.y = e.y;
		return;
	}
	p.size = I(Math.round(p.size * f.width / Math.max(1, s.width)), 6, 256);
	let m = $e(p), h = Ze(f, m.width, m.height, d);
	p.x = h.x, p.y = h.y;
}, ct = (e, t, n, r, i, a) => {
	let o = structuredClone(e);
	if (o.locked) return o;
	if (t.mode === "resize") return st(o, t.handle, n, r, t.shiftKey, i, a), o;
	let s = L(i), c = et(o), l = I(tt(c.x + n, i, a.snapEnabled), s.x, Math.max(s.x, s.x + s.width - c.width)), u = I(tt(c.y + r, i, a.snapEnabled), s.y, Math.max(s.y, s.y + s.height - c.height));
	return nt(o, l - c.x, u - c.y), o;
}, lt = () => Math.floor(Math.random() * 256), ut = () => {
	let e = globalThis.crypto;
	if (typeof e?.randomUUID == "function") return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	typeof e?.getRandomValues == "function" ? e.getRandomValues(t) : t.forEach((e, n) => {
		t[n] = lt();
	}), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0"));
	return `${n.slice(0, 4).join("")}-${n.slice(4, 6).join("")}-${n.slice(6, 8).join("")}-${n.slice(8, 10).join("")}-${n.slice(10).join("")}`;
}, dt = (e, t) => `${e} × ${t}`, R = {
	common: {
		cancel: "Cancel",
		close: "Close",
		size: dt,
		sizeInPixels: (e, t) => `${dt(e, t)} px`,
		milliseconds: (e) => `${e.toFixed(1)} ms`
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
		reorder: (e) => `Reorder ${e}`,
		deleteTitle: "Delete layer",
		delete: (e) => `Delete ${e}`,
		showTitle: "Show layer",
		hideTitle: "Hide layer",
		show: (e) => `Show ${e}`,
		hide: (e) => `Hide ${e}`,
		unlockTitle: "Unlock position",
		lockTitle: "Lock position",
		unlock: (e) => `Unlock ${e}`,
		lock: (e) => `Lock ${e}`
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
	canvas: {
		rendering: "Rendering…",
		previewAlt: "Authoritative rendered display preview",
		hidden: "Hidden",
		undo: "Undo",
		undoTitle: "Undo (Ctrl+Z)",
		redo: "Redo",
		redoTitle: "Redo (Ctrl+Shift+Z)",
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
		innerPadding: "Inner padding",
		centerX: "Center X",
		centerY: "Center Y",
		radius: "Radius",
		moduleSize: "Module size",
		size: "Size",
		text: "Text",
		color: "Color",
		lineWidth: "Line width",
		dashed: "Dashed",
		iconName: "MDI icon name",
		content: "Content",
		quietZone: "Quiet zone",
		foreground: "Foreground",
		progress: "Progress",
		direction: "Direction",
		fill: "Fill",
		showPercentage: "Show percentage",
		outline: "Outline",
		outlineWidth: "Outline width"
	},
	primitives: {
		text: "Text",
		rectangle: "Rectangle",
		line: "Line",
		circle: "Circle",
		ellipse: "Ellipse",
		icon: "Icon",
		qrcode: "QR code",
		progress_bar: "Progress bar"
	},
	customDisplay: {
		manufacturer: "Custom",
		name: "Custom display"
	},
	defaults: { text: "Text" },
	palettes: {
		bw: "Black / white",
		bwr: "Black / white / red",
		bwy: "Black / white / yellow",
		bwry: "Black / white / red / yellow",
		spectra6: "Spectra 6 · black / white / red / yellow / blue / green"
	}
}, ft = (e, t) => {
	let { x: n, y: r, displayWidth: i, displayHeight: a } = t, o = Math.min(i - 1, n + 160), s = Math.min(a - 1, r + 90);
	switch (e) {
		case "text": return {
			type: "text",
			value: R.defaults.text,
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
}, z = R.palettes, pt = {
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
}, B = (e, t, n, r, i = !1) => ({
	id: `solum-${e}`,
	manufacturer: "SOLUM",
	name: `Newton Pro ${t}`,
	width: n,
	height: r,
	palettes: i ? ["bw"] : ["bw", "bwry"],
	defaultPalette: i ? "bw" : "bwry"
}), mt = [
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
	B("1-6-v", "1.6″ V", 200, 200),
	B("1-6-h", "1.6″ H", 200, 200),
	B("2-2", "2.2″", 296, 160),
	B("2-2-freezer", "2.2″ Freezer", 296, 160, !0),
	B("2-6", "2.6″", 360, 184),
	B("2-6-freezer", "2.6″ Freezer", 360, 184, !0),
	B("2-7", "2.7″", 300, 200),
	B("2-9", "2.9″", 384, 168),
	B("2-9-freezer", "2.9″ Freezer", 384, 168, !0),
	B("3-45", "3.5″ · 3.45 panel", 480, 224),
	B("3-52", "3.5″ · 3.52 panel", 384, 180),
	B("4-2", "4.2″", 400, 300),
	B("4-3", "4.3″", 522, 152),
	B("4-5", "4.5″", 480, 176),
	B("5-8", "5.8″", 792, 272),
	B("6-1", "6.1″", 648, 480),
	B("7-5", "7.5″", 800, 480),
	B("9-7", "9.7″", 672, 960),
	B("11-6", "11.6″", 640, 960),
	B("12-2", "12.2″", 768, 960),
	{
		id: "custom",
		...R.customDisplay,
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
], ht = (e) => mt.find((t) => t.id === e) ?? mt[0], gt = (e) => e in z, _t = (e, t, n, r) => {
	let i = e.items.find((e) => e.id === t);
	if (!i || i.locked) return;
	let a = L(e);
	if (i.kind === "widget") {
		n === "padding" && (i.layout.padding = I(r, 0, 128)), n === "x" && (i.frame.x = I(r, a.x, a.x + a.width - i.frame.width)), n === "y" && (i.frame.y = I(r, a.y, a.y + a.height - i.frame.height)), n === "width" && (i.frame.width = I(r, 1, a.x + a.width - i.frame.x)), n === "height" && (i.frame.height = I(r, 1, a.y + a.height - i.frame.y));
		return;
	}
	let o = i.primitive;
	if (Qe(o)) {
		if (n === "x") {
			let e = o.x_end - o.x_start;
			o.x_start = I(r, a.x, a.x + a.width - e - 1), o.x_end = o.x_start + e;
		}
		if (n === "y") {
			let e = o.y_end - o.y_start;
			o.y_start = I(r, a.y, a.y + a.height - e - 1), o.y_end = o.y_start + e;
		}
		n === "width" && (o.x_end = I(o.x_start + Math.max(1, r) - 1, o.x_start + 1, a.x + a.width - 1)), n === "height" && (o.y_end = I(o.y_start + Math.max(1, r) - 1, o.y_start + 1, a.y + a.height - 1));
	} else o.type === "circle" ? (n === "x" && (o.x = I(r, a.x + o.radius, a.x + a.width - o.radius)), n === "y" && (o.y = I(r, a.y + o.radius, a.y + a.height - o.radius)), n === "radius" && (o.radius = I(r, 1, Math.floor(Math.min(a.width, a.height) / 2)))) : (n === "x" && (o.x = I(r, a.x, a.x + a.width - 1)), n === "y" && (o.y = I(r, a.y, a.y + a.height - 1)), n === "size" && o.type !== "qrcode" && (o.size = I(r, o.type === "text" ? 6 : 8, 256)), n === "boxsize" && o.type === "qrcode" && (o.boxsize = I(r, 1, 16)));
}, vt = (e) => e.items.forEach((t) => rt(t, e)), yt = (e, t, n) => {
	(t === "width" || t === "height") && (e.display[t] = I(n, 64, 4096)), t === "padding" && (e.display.padding = I(n, 0, Math.floor((Math.min(e.display.width, e.display.height) - 1) / 2))), t === "snapSize" && (e.display.snapSize = I(n, 1, 256)), vt(e);
}, bt = (e, t) => {
	e.display.profileId = t.id, e.display.width = t.width, e.display.height = t.height, e.display.palette = t.defaultPalette, vt(e);
}, xt = (e, t) => {
	e.display.palette = t, pt[t].includes(e.display.background) || (e.display.background = "white");
}, St = (e, t) => {
	e.display.background = t;
}, Ct = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r && (r[n] = !r[n]);
}, wt = (e, t) => {
	e.items = e.items.filter((e) => e.id !== t);
}, Tt = (e, t, n, r) => {
	let i = [...e.items].reverse(), a = i.findIndex((e) => e.id === t);
	if (a < 0) return;
	let [o] = i.splice(a, 1), s = i.findIndex((e) => e.id === n);
	s < 0 || (i.splice(r === "before" ? s : s + 1, 0, o), e.items = i.reverse());
}, Et = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r?.kind === "widget" && (r.widget.config = n);
}, Dt = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	if (r?.kind !== "primitive") return;
	let i = {
		...r.primitive,
		...n
	};
	"fill" in i && i.fill === "transparent" && (i.fill = null), r.primitive = i;
}, Ot = (e, t, n, r) => {
	let i = L(r), a = Math.min(e.layout.defaultSize?.width ?? 240, i.width), o = Math.min(e.layout.defaultSize?.height ?? 144, i.height);
	return {
		id: ut(),
		kind: "widget",
		locked: !1,
		hidden: !1,
		widget: {
			type: e.id,
			version: e.version,
			config: structuredClone(e.defaults)
		},
		frame: {
			x: I(Math.round(t - a / 2), i.x, i.x + i.width - a),
			y: I(Math.round(n - o / 2), i.y, i.y + i.height - o),
			width: a,
			height: o
		},
		layout: { padding: 0 }
	};
}, kt = (e, t, n, r) => {
	let { width: i, height: a } = r.display, o = ft(e.trim(), {
		x: Math.round(i / 2),
		y: Math.round(a / 2),
		displayWidth: i,
		displayHeight: a
	});
	if (!o) return;
	let s = {
		id: ut(),
		kind: "primitive",
		locked: !1,
		hidden: !1,
		primitive: o
	}, c = et(s);
	return nt(s, Math.round(t - (c.x + c.width / 2)), Math.round(n - (c.y + c.height / 2))), rt(s, r), s;
}, At = (e, t) => {
	let n = L(e), r = e.items.length * Math.max(e.display.snapSize, 5) * 3 % Math.max(1, Math.min(n.width, n.height) / 3);
	return {
		x: tt(n.x + Math.min(24 + r, Math.max(0, n.width - 1)), e, t),
		y: tt(n.y + Math.min(24 + r, Math.max(0, n.height - 1)), e, t)
	};
}, jt = (e, t = "custom") => {
	let n = ht(t);
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
}, Mt = (e) => ({
	name: e.name,
	width: e.display.width,
	height: e.display.height,
	palette: e.display.palette,
	padding: e.display.padding,
	snapSize: e.display.snapSize
}), Nt = (e, t) => {
	let n = {
		...Mt(e),
		...t
	}, r = structuredClone(e);
	return r.name = String(n.name), r.display.profileId = "custom", r.display.width = Math.round(Number(n.width) || 0), r.display.height = Math.round(Number(n.height) || 0), r.display.palette = n.palette in z ? n.palette : "bw", r.display.padding = Math.round(Number(n.padding) || 0), r.display.snapSize = Math.round(Number(n.snapSize) || 0), pt[r.display.palette].includes(r.display.background) || (r.display.background = "white"), r;
}, Pt = (e) => {
	let { width: t, height: n, padding: r, snapSize: i } = e.display;
	return !!e.name.trim() && t >= 64 && t <= 4096 && n >= 64 && n <= 4096 && r >= 0 && r * 2 < Math.min(t, n) && i >= 1 && i <= 256;
}, Ft = (e, t, n, r) => {
	let i = t.trim().toLocaleLowerCase(r);
	return e.filter((e) => !i || e.name.toLocaleLowerCase(r).includes(i)).sort((e, t) => n === "name" ? e.name.localeCompare(t.name, r) : t.updatedAt.localeCompare(e.updatedAt) || e.name.localeCompare(t.name, r));
}, It = (e, t, n) => {
	let r = new Set(t.map((e) => e.name.toLocaleLowerCase(n))), i = `${e.name} copy`, a = i, o = 2;
	for (; r.has(a.toLocaleLowerCase(n));) a = `${i} ${o++}`;
	return a;
}, Lt = () => [
	{
		name: "name",
		label: R.fields.name,
		required: !0,
		selector: { text: {} }
	},
	{
		name: "dimensions",
		type: "grid",
		flatten: !0,
		schema: [{
			name: "width",
			label: R.fields.width,
			required: !0,
			selector: { number: {
				mode: "box",
				min: 64,
				max: 4096,
				unit_of_measurement: "px"
			} }
		}, {
			name: "height",
			label: R.fields.height,
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
		label: R.fields.palette,
		required: !0,
		selector: { select: {
			mode: "dropdown",
			options: Object.entries(z).map(([e, t]) => ({
				value: e,
				label: t
			}))
		} }
	},
	{
		name: "advanced",
		type: "expandable",
		flatten: !0,
		title: R.fields.advanced,
		expanded: !1,
		schema: [{
			name: "padding",
			label: R.fields.padding,
			selector: { number: {
				mode: "box",
				min: 0,
				max: 1024,
				unit_of_measurement: "px"
			} }
		}, {
			name: "snapSize",
			label: R.fields.snapSize,
			selector: { number: {
				mode: "box",
				min: 1,
				max: 256,
				unit_of_measurement: "px"
			} }
		}]
	}
], Rt = (e) => "label" in e ? e.label : e.title ?? "", zt = {
	bwr: "#d32f2f",
	bwry: "#d32f2f",
	bwy: "#d6a800",
	spectra6: "#246bfd"
}, Bt = (e) => zt[e] ?? "#202124", Vt = (e, t) => {
	let n = new Date(e.updatedAt);
	return Number.isNaN(n.getTime()) ? "" : new Intl.DateTimeFormat(t, { dateStyle: "medium" }).format(n);
}, V = (e, t, ...n) => {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n[0],
		bubbles: !0,
		composed: !0
	}));
}, Ht = 100, Ut = class {
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
		this.undoStack.push(structuredClone(e)), this.undoStack.length > Ht && this.undoStack.shift(), this.redoStack = [];
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
}, Wt = {
	text: "mdi:format-text",
	rectangle: "mdi:rectangle-outline",
	line: "mdi:vector-line",
	circle: "mdi:circle-outline",
	ellipse: "mdi:ellipse-outline",
	icon: "mdi:star-outline",
	qrcode: "mdi:qrcode",
	progress_bar: "mdi:progress-helper"
}, Gt = (e, t) => e.kind === "widget" ? t.find((t) => t.id === e.widget.type) : void 0, Kt = (e, t) => {
	if (e.kind === "primitive") return R.primitives[e.primitive.type];
	let n = e.widget.config.title;
	return typeof n == "string" && n.trim() ? n : Gt(e, t)?.name ?? e.widget.type;
}, qt = (e, t) => e.kind === "primitive" ? Wt[e.primitive.type] : Gt(e, t)?.icon ?? "mdi:puzzle", Jt = (e) => e.callWS({ type: "opendisplay_studio/bootstrap" }), Yt = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/create_dashboard",
	dashboard: t
})).dashboard, Xt = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/update_dashboard",
	dashboard_id: t.id,
	dashboard: t
})).dashboard, Zt = async (e, t) => {
	await e.callWS({
		type: "opendisplay_studio/delete_dashboard",
		dashboard_id: t
	});
}, Qt = (e, t) => e.callWS({
	type: "opendisplay_studio/compose_preview",
	dashboard: structuredClone(t)
}), H = o`
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
`, U = o`
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
`, $t = o`
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
`, en = .25, tn = 96, nn = 3, rn = .1, an = {
	zoom: 1,
	panX: 0,
	panY: 0
}, on = (e, t) => ({
	...e,
	zoom: I(t, en, 4)
}), sn = (e, t) => {
	let n = Math.max(100, e.width - tn), r = Math.max(100, e.height - tn);
	return {
		zoom: I(Math.min(n / t.width, r / t.height), en, nn),
		panX: 0,
		panY: 0
	};
}, cn = (e, t) => t.shiftKey ? on(e, e.zoom + (t.deltaY < 0 ? rn : -.1)) : t.altKey ? {
	...e,
	panX: e.panX - t.deltaY
} : {
	...e,
	panY: e.panY - t.deltaY
}, ln = ze(class extends Be {
	constructor(e) {
		if (super(e), e.type !== Re.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
		return O;
	}
}), un = (e) => {
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
};
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/decorate.js
function W(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/ods-zoom-bar.ts
var dn = [
	.5,
	1,
	2,
	3
], fn = .25, pn = class extends j {
	constructor(...e) {
		super(...e), this.zoom = 1;
	}
	static {
		this.styles = [H, o`
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
		V(this, "zoom-change", { zoom: e });
	}
	render() {
		return D`
      <div class="zoom-controls">
        <button
          aria-label=${R.zoom.out}
          @click=${() => this.zoomTo(this.zoom - fn)}
        >
          −
        </button>
        ${dn.map((e) => D`
            <button
              class=${this.zoom === e ? "active" : ""}
              aria-label=${R.zoom.preset(e)}
              @click=${() => this.zoomTo(e)}
            >
              ${R.zoom.preset(e)}
            </button>
          `)}
        <button
          aria-label=${R.zoom.in}
          @click=${() => this.zoomTo(this.zoom + fn)}
        >
          +
        </button>
        <button
          aria-label=${R.zoom.reset}
          @click=${() => V(this, "zoom-reset")}
        >
          ${R.zoom.reset}
        </button>
        <button
          aria-label=${R.zoom.fit}
          @click=${() => V(this, "zoom-fit")}
        >
          ${R.zoom.fit}
        </button>
      </div>
    `;
	}
};
W([N({ type: Number })], pn.prototype, "zoom", void 0), pn = W([M("ods-zoom-bar")], pn);
//#endregion
//#region src/ods-canvas.ts
var mn = 3, hn = (e, t) => ({
	left: `${e.x / t.width * 100}%`,
	top: `${e.y / t.height * 100}%`,
	width: `${e.width / t.width * 100}%`,
	height: `${e.height / t.height * 100}%`
}), G = class extends j {
	constructor(...e) {
		super(...e), this.widgets = [], this.selectedItemId = "", this.snapEnabled = !0, this.acceptingDrop = !1, this.undoCount = 0, this.redoCount = 0, this.viewport = an;
	}
	static {
		this.styles = [H, o`
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
		V(this, "viewport-change", e);
	}
	resetView() {
		this.setViewport(an);
	}
	fitView() {
		let e = this.stage;
		e && this.setViewport(sn({
			width: e.clientWidth,
			height: e.clientHeight
		}, this.dashboard.display));
	}
	onWheel(e) {
		e.preventDefault(), this.setViewport(cn(this.viewport, e));
	}
	beginGesture(e, t, n) {
		if (e.stopPropagation(), e.preventDefault(), V(this, "item-select", { itemId: t.id }), t.locked) return;
		this.stopGesture?.();
		let r = structuredClone(this.dashboard), i = structuredClone(t), a = t.kind === "widget" ? this.widgets.find((e) => e.id === t.widget.type)?.layout.minSize : void 0;
		this.stopGesture = un({
			origin: e,
			threshold: mn,
			onMove: (t) => {
				let r = this.canvas;
				if (!r) return;
				let o = r.getBoundingClientRect(), { width: s, height: c } = this.dashboard.display, l = Math.round((t.clientX - e.clientX) / o.width * s), u = Math.round((t.clientY - e.clientY) / o.height * c), d = n ? {
					mode: "resize",
					handle: n,
					shiftKey: t.shiftKey
				} : { mode: "move" };
				V(this, "item-transform", { item: ct(i, d, l, u, this.dashboard, {
					snapEnabled: this.snapEnabled,
					minSize: a
				}) });
			},
			onEnd: (e, t) => {
				t && V(this, "item-transform-end", { before: r });
			}
		});
	}
	requestUndo() {
		V(this, "undo");
	}
	requestRedo() {
		V(this, "redo");
	}
	toggleSnap() {
		V(this, "snap-toggle");
	}
	deselect() {
		V(this, "item-select", { itemId: "" });
	}
	onStageDragOver(e) {
		this.acceptingDrop && e.preventDefault();
	}
	onStageDrop(e) {
		e.preventDefault();
	}
	onZoomChange(e) {
		e.stopPropagation(), this.setViewport(on(this.viewport, e.detail.zoom));
	}
	onZoomReset(e) {
		e.stopPropagation(), this.resetView();
	}
	onZoomFit(e) {
		e.stopPropagation(), this.fitView();
	}
	resizeHandleLabel(e, t) {
		return R.canvas.resizeHandle(Kt(e, this.widgets), R.canvas.sides[t]);
	}
	renderBadges(e) {
		return D`
      ${e.hidden ? D`
              <span class="hidden-label">${R.canvas.hidden}</span>
            ` : k}
      ${e.locked ? D`
              <ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>
            ` : k}
    `;
	}
	renderSelectionSize(e) {
		let t = Math.round(e.width), n = Math.round(e.height);
		return D`
      <output class="selection-size" aria-live="off">
        ${R.common.size(t, n)}
      </output>
    `;
	}
	renderHandles(e) {
		return We.map((t) => D`
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
		let t = et(e), n = e.id === this.selectedItemId, r = ln({
			selection: !0,
			selected: n,
			locked: e.locked,
			hidden: e.hidden
		});
		return D`
      <div
        data-item-id=${e.id}
        class=${r}
        style=${F(hn(t, this.dashboard.display))}
        @pointerdown=${(t) => this.beginGesture(t, e)}
      >
        ${this.renderBadges(e)}
        ${n ? this.renderSelectionSize(t) : k}
        ${n && !e.locked ? this.renderHandles(e) : k}
      </div>
    `;
	}
	renderToolbar() {
		let e = this.dashboard, { width: t, height: n, padding: r, snapSize: i } = e.display, a = ln({
			"tool-toggle": !0,
			active: this.snapEnabled
		});
		return D`
      <div class="workspace-meta">
        <span>${R.common.sizeInPixels(t, n)}</span>
        <span>${R.canvas.layers(e.items.length)}</span>
        <span>${R.canvas.padding(r)}</span>
        <div class="history-controls">
          <button
            aria-label=${R.canvas.undo}
            title=${R.canvas.undoTitle}
            ?disabled=${!this.undoCount}
            @click=${this.requestUndo}
          >
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button
            aria-label=${R.canvas.redo}
            title=${R.canvas.redoTitle}
            ?disabled=${!this.redoCount}
            @click=${this.requestRedo}
          >
            <ha-icon icon="mdi:redo"></ha-icon>
          </button>
        </div>
        <button
          class=${a}
          aria-pressed=${this.snapEnabled}
          @click=${this.toggleSnap}
        >
          <ha-icon icon="mdi:magnet"></ha-icon>
          <span>${R.canvas.snap(i)}</span>
        </button>
        <span class="zoom-readout">
          ${Math.round(this.viewport.zoom * 100)}%
        </span>
      </div>
    `;
	}
	renderPreview() {
		return this.preview ? D`
      <img
        draggable="false"
        src=${this.preview.imageUrl}
        alt=${R.canvas.previewAlt}
      />
    ` : D`
        <div class="canvas-placeholder">${R.canvas.rendering}</div>
      `;
	}
	renderStage() {
		let e = this.dashboard, { width: t, height: n, snapSize: r } = e.display, { zoom: i, panX: a, panY: o } = this.viewport, s = F({ transform: `translate(${a}px, ${o}px) scale(${i})` }), c = F({
			width: `${t}px`,
			height: `${n}px`
		}), l = F({
			...hn(L(e), e.display),
			"--snap-size": `${r * i}px`
		});
		return D`
      <section
        class=${ln({
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
		return D`
      <main class="workspace">
        ${this.renderToolbar()} ${this.renderStage()}
      </main>
    `;
	}
};
W([N({ attribute: !1 })], G.prototype, "dashboard", void 0), W([N({ attribute: !1 })], G.prototype, "preview", void 0), W([N({ attribute: !1 })], G.prototype, "widgets", void 0), W([N()], G.prototype, "selectedItemId", void 0), W([N({ type: Boolean })], G.prototype, "snapEnabled", void 0), W([N({ type: Boolean })], G.prototype, "acceptingDrop", void 0), W([N({ type: Number })], G.prototype, "undoCount", void 0), W([N({ type: Number })], G.prototype, "redoCount", void 0), W([N({ attribute: !1 })], G.prototype, "viewport", void 0), W([Le(".canvas")], G.prototype, "canvas", void 0), W([Le(".canvas-stage")], G.prototype, "stage", void 0), G = W([M("ods-canvas")], G);
//#endregion
//#region src/ods-code-view.ts
var gn = {
	idle: "mdi:content-copy",
	copied: "mdi:check",
	failed: "mdi:alert-circle-outline"
}, _n = 2200, vn = class extends j {
	constructor(...e) {
		super(...e), this.copyState = "idle";
	}
	static {
		this.styles = [
			H,
			U,
			o`
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
			}, _n);
		}
	}
	render() {
		return D`
      <main class="code-workspace">
        <section class="code-panel" aria-labelledby="generated-code-title">
          <header>
            <div>
              <span class="eyebrow">${R.code.eyebrow}</span>
              <h1 id="generated-code-title">${R.code.title}</h1>
              <p>${R.code.description}</p>
            </div>
            <ha-button
              appearance="plain"
              aria-label=${R.code.copyLabel}
              .disabled=${!this.preview?.yaml}
              @click=${this.copy}
            >
              <ha-icon
                slot="start"
                .icon=${gn[this.copyState]}
              ></ha-icon>
              ${R.code.copy[this.copyState]}
            </ha-button>
          </header>
          ${this.preview?.warnings.map((e) => D`
                <ha-alert alert-type="warning">${e}</ha-alert>
              `) ?? k}
          <textarea
            aria-label=${R.code.yaml}
            readonly
            spellcheck="false"
            dir="ltr"
            .value=${this.preview?.yaml ?? ""}
          ></textarea>
          <output class="copy-status" aria-live="polite">
            ${R.code.status[this.copyState]}
          </output>
        </section>
      </main>
    `;
	}
};
W([N({ attribute: !1 })], vn.prototype, "preview", void 0), W([P()], vn.prototype, "copyState", void 0), vn = W([M("ods-code-view")], vn);
//#endregion
//#region src/ods-confirm-dialog.ts
var yn = class extends j {
	constructor(...e) {
		super(...e), this.eyebrow = "", this.heading = "", this.body = "", this.confirmLabel = "";
	}
	static {
		this.styles = [
			H,
			U,
			o`
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
		V(this, "confirm-cancel");
	}
	accept() {
		V(this, "confirm-accept");
	}
	onScrimClick(e) {
		e.target === e.currentTarget && this.cancel();
	}
	render() {
		return D`
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
              aria-label=${R.common.close}
              @click=${this.cancel}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <p>${this.body}</p>
          <footer>
            <ha-button appearance="plain" @click=${this.cancel}>
              ${R.common.cancel}
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
W([N()], yn.prototype, "eyebrow", void 0), W([N()], yn.prototype, "heading", void 0), W([N()], yn.prototype, "body", void 0), W([N()], yn.prototype, "confirmLabel", void 0), yn = W([M("ods-confirm-dialog")], yn);
//#endregion
//#region src/dom.ts
var K = (e) => e.target.value, bn = class extends j {
	constructor(...e) {
		super(...e), this.entries = [], this.label = "";
	}
	static {
		this.styles = [H, o`
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
		return D`
      <div class="menu" role="menu" aria-label=${this.label}>
        ${this.entries.map((e) => D`
            <button
              class=${e.danger ? "delete" : ""}
              role="menuitem"
              @click=${(t) => {
			t.stopPropagation(), V(this, "menu-select", { id: e.id });
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
W([N({ attribute: !1 })], bn.prototype, "entries", void 0), W([N()], bn.prototype, "label", void 0), bn = W([M("ods-context-menu")], bn);
//#endregion
//#region src/ods-dashboard-card.ts
var xn = [
	{
		id: "rename",
		label: R.gallery.menu.rename,
		icon: "mdi:pencil-outline"
	},
	{
		id: "duplicate",
		label: R.gallery.menu.duplicate,
		icon: "mdi:content-copy"
	},
	{
		id: "settings",
		label: R.gallery.menu.settings,
		icon: "mdi:monitor-cog"
	},
	{
		id: "delete",
		label: R.gallery.menu.delete,
		icon: "mdi:delete-outline",
		danger: !0
	}
], q = class extends j {
	constructor(...e) {
		super(...e), this.language = "en", this.menuOpen = !1, this.renaming = !1, this.draftName = "";
	}
	static {
		this.styles = [
			H,
			U,
			$t,
			o`
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
		V(this, "dashboard-open", { dashboard: this.dashboard });
	}
	toggleMenu(e) {
		e.stopPropagation(), V(this, "dashboard-menu-toggle", { dashboardId: this.dashboard.id });
	}
	onMenuSelect(e) {
		let t = xn.find((t) => t.id === e.detail.id);
		t && (e.stopPropagation(), V(this, "dashboard-menu-action", {
			dashboard: this.dashboard,
			action: t.id
		}));
	}
	onRenameInput(e) {
		V(this, "dashboard-rename-input", { name: K(e) });
	}
	onRenameKeyDown(e) {
		e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), V(this, "dashboard-rename-commit")) : e.key === "Escape" && (e.preventDefault(), V(this, "dashboard-rename-cancel"));
	}
	commitRename() {
		V(this, "dashboard-rename-commit");
	}
	renderMiniature() {
		let { display: e } = this.dashboard;
		return D`
      <div class="dashboard-card-preview">
        <div class="dashboard-miniature" style=${F({
			aspectRatio: `${e.width} / ${e.height}`,
			background: e.background,
			"--dashboard-accent": Bt(e.palette)
		})}>
          <span class="miniature-title"></span>
          <span class="miniature-accent"></span>
          <span class="miniature-line long"></span>
          <span class="miniature-line"></span>
        </div>
        <span class="dashboard-resolution">
          ${R.common.size(e.width, e.height)}
        </span>
      </div>
    `;
	}
	renderTitle() {
		let { name: e, status: t } = this.dashboard;
		return D`
      <span class="dashboard-card-title">
        ${this.renaming ? D`
                <input
                  class="dashboard-rename-input"
                  aria-label=${R.gallery.renameField(e)}
                  .value=${this.draftName}
                  @input=${this.onRenameInput}
                  @keydown=${this.onRenameKeyDown}
                  @blur=${this.commitRename}
                />
              ` : D`
                <strong>${e}</strong>
              `}
        <span class=${`status ${t}`}>${t}</span>
      </span>
    `;
	}
	renderMeta() {
		let { display: e } = this.dashboard;
		return D`
      <span class="dashboard-card-meta">
        <span>${R.common.size(e.width, e.height)}</span>
        <span
          class="palette-dots"
          aria-label=${z[e.palette]}
        >
          ${pt[e.palette].map((e) => D`
              <i style=${F({ background: e })}></i>
            `)}
        </span>
        <span>${z[e.palette]}</span>
      </span>
    `;
	}
	renderMenu() {
		return this.menuOpen ? D`
      <ods-context-menu
        class="dashboard-menu"
        id=${this.menuId}
        label=${R.gallery.menuFor(this.dashboard.name)}
        .entries=${xn}
        @menu-select=${this.onMenuSelect}
      ></ods-context-menu>
    ` : k;
	}
	render() {
		let e = this.dashboard;
		return D`
      <article class=${ln({
			"dashboard-card": !0,
			"menu-open": this.menuOpen
		})} data-dashboard-id=${e.id}>
        ${this.renderMiniature()}
        <div class="dashboard-card-copy">
          ${this.renderTitle()} ${this.renderMeta()}
          <small>
            ${R.gallery.updated(Vt(e, this.language))}
          </small>
        </div>
        <button
          class="dashboard-card-open"
          aria-label=${R.gallery.open(e.name)}
          @click=${this.open}
        ></button>
        <button
          class="dashboard-menu-trigger"
          aria-label=${R.gallery.actionsFor(e.name)}
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
W([N({ attribute: !1 })], q.prototype, "dashboard", void 0), W([N()], q.prototype, "language", void 0), W([N({ type: Boolean })], q.prototype, "menuOpen", void 0), W([N({ type: Boolean })], q.prototype, "renaming", void 0), W([N()], q.prototype, "draftName", void 0), W([Le(".dashboard-rename-input")], q.prototype, "renameInput", void 0), q = W([M("ods-dashboard-card")], q);
//#endregion
//#region src/ods-gallery.ts
var J = class extends j {
	constructor(...e) {
		super(...e), this.dashboards = [], this.error = "", this.saving = !1, this.searchText = "", this.sort = "updated", this.menuDashboardId = "", this.onOutsidePointerDown = (e) => {
			this.menuDashboardId && (e.composedPath().some((e) => e instanceof HTMLElement && (e.classList.contains("dashboard-menu") || e.classList.contains("dashboard-menu-trigger"))) || (this.menuDashboardId = ""));
		}, this.onKeyDown = (e) => {
			e.key === "Escape" && (this.menuDashboardId ? (this.menuDashboardId = "", e.stopPropagation()) : this.dialog && (V(this, "dashboard-dialog-close"), e.stopPropagation()));
		};
	}
	static {
		this.styles = [
			H,
			U,
			$t,
			o`
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
		this.searchText = K(e);
	}
	onSortChange(e) {
		this.sort = K(e) === "name" ? "name" : "updated";
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
		V(this, "dashboard-settings-change", { value: e.detail.value });
	}
	renderCard(e) {
		let t = this.dialog === "rename" && this.draft?.id === e.id;
		return D`
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
		return !e || !this.dialog || this.dialog === "rename" ? k : this.dialog === "delete" ? D`
        <ha-dialog
          .open=${!0}
          width="small"
          header-title=${R.gallery.deleteTitle}
          @closed=${() => V(this, "dashboard-dialog-close")}
        >
          <div class="dashboard-delete-content">
            <p>
              <strong>${e.name}</strong>
              ${R.gallery.deleteBody}
            </p>
            <p>${R.gallery.deleteWarning}</p>
          </div>
          <ha-dialog-footer slot="footer">
            <ha-button
              slot="secondaryAction"
              appearance="plain"
              @click=${() => V(this, "dashboard-dialog-close")}
            >
              ${R.common.cancel}
            </ha-button>
            <ha-button
              slot="primaryAction"
              variant="danger"
              appearance="filled"
              .disabled=${this.saving}
              @click=${() => V(this, "dashboard-delete-confirm")}
            >
              ${this.saving ? R.gallery.deleting : R.gallery.deleteAction}
            </ha-button>
          </ha-dialog-footer>
        </ha-dialog>
      ` : D`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${R.gallery.settingsTitle}
        header-subtitle=${e.name}
        @closed=${() => V(this, "dashboard-dialog-close")}
      >
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Mt(e)}
            .schema=${Lt()}
            .computeLabel=${Rt}
            @value-changed=${this.settingsChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => V(this, "dashboard-dialog-close")}
          >
            ${R.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !Pt(e)}
            @click=${() => V(this, "dashboard-settings-save")}
          >
            ${this.saving ? R.gallery.saving : R.gallery.settingsSave}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
	render() {
		let e = Ft(this.dashboards, this.searchText, this.sort, this.language);
		return D`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div>
            <h1>${R.gallery.title}</h1>
            <p>${R.gallery.count(this.dashboards.length)}</p>
          </div>
          <ha-button
            class="dashboard-new-button"
            appearance="filled"
            aria-label=${R.gallery.newDashboard}
            @click=${() => V(this, "dashboard-new")}
          >
            <span class="dashboard-new-button-label">
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>${R.gallery.newDashboard}</span>
            </span>
          </ha-button>
        </header>
        ${this.error ? D`
                <ha-alert alert-type="error">${this.error}</ha-alert>
              ` : k}
        <section
          class="dashboard-library-tools"
          aria-label=${R.gallery.filters}
        >
          <label class="dashboard-search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              type="search"
              aria-label=${R.gallery.search}
              placeholder=${R.gallery.searchPlaceholder}
              .value=${this.searchText}
              @input=${this.onSearchInput}
            />
          </label>
          <label class="dashboard-sort">
            <span>${R.gallery.sort}</span>
            <select
              aria-label=${R.gallery.sortDashboards}
              .value=${this.sort}
              @change=${this.onSortChange}
            >
              <option value="updated">${R.gallery.sortUpdated}</option>
              <option value="name">${R.gallery.sortName}</option>
            </select>
          </label>
        </section>
        <section
          class="dashboard-grid"
          aria-label=${R.gallery.savedDashboards}
        >
          <button
            class="dashboard-add-card"
            aria-label=${R.gallery.addDashboard}
            @click=${() => V(this, "dashboard-new")}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            <strong>${R.gallery.newDashboard}</strong>
          </button>
          ${e.map((e) => this.renderCard(e))}
          ${e.length ? k : D`
                  <div class="dashboard-no-results">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <strong>${R.gallery.noResults}</strong>
                    <span>${R.gallery.noResultsHint}</span>
                  </div>
                `}
        </section>
      </main>
      ${this.renderDialog()}
    `;
	}
};
W([N({ attribute: !1 })], J.prototype, "dashboards", void 0), W([N({ attribute: !1 })], J.prototype, "hass", void 0), W([N()], J.prototype, "error", void 0), W([N({ type: Boolean })], J.prototype, "saving", void 0), W([N()], J.prototype, "dialog", void 0), W([N({ attribute: !1 })], J.prototype, "draft", void 0), W([P()], J.prototype, "searchText", void 0), W([P()], J.prototype, "sort", void 0), W([P()], J.prototype, "menuDashboardId", void 0), J = W([M("ods-gallery")], J);
//#endregion
//#region src/ods-header.ts
var Sn = class extends j {
	constructor(...e) {
		super(...e), this.view = "design", this.dirty = !1, this.saving = !1;
	}
	static {
		this.styles = [
			H,
			U,
			o`
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
		V(this, "dashboard-name-change", { name: K(e) });
	}
	get statusToggleLabel() {
		return this.dashboard.status === "ready" ? R.header.setDraft : R.header.setReady;
	}
	render() {
		let e = this.dashboard;
		return D`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">${R.header.studio}</strong>
          <span class="breadcrumb-divider">/</span>
          <button
            class="breadcrumb-link"
            @click=${() => V(this, "show-dashboards")}
          >
            ${R.header.dashboards}
          </button>
          <span class="breadcrumb-divider">/</span>
          <input
            class="dashboard-name"
            aria-label=${R.header.name}
            .value=${e.name}
            @input=${this.onNameInput}
          />
        </div>
        <nav class="view-switch" aria-label=${R.header.view}>
          <button
            class=${this.view === "design" ? "active" : ""}
            aria-pressed=${this.view === "design"}
            @click=${() => V(this, "view-change", { view: "design" })}
          >
            <ha-icon icon="mdi:tools"></ha-icon>
            ${R.header.design}
          </button>
          <button
            class=${this.view === "code" ? "active" : ""}
            aria-pressed=${this.view === "code"}
            @click=${() => V(this, "view-change", { view: "code" })}
          >
            <ha-icon icon="mdi:code-tags"></ha-icon>
            ${R.header.code}
          </button>
        </nav>
        <div class="editor-actions">
          <span class="status ${e.status}">${e.status}</span>
          <ha-button
            appearance="plain"
            @click=${() => V(this, "toggle-ready")}
          >
            ${this.statusToggleLabel}
          </ha-button>
          <ha-button
            appearance="filled"
            .disabled=${!this.dirty || this.saving}
            @click=${() => V(this, "dashboard-save")}
          >
            ${this.saving ? R.header.saving : R.header.save}
          </ha-button>
        </div>
      </header>
    `;
	}
};
W([N({ attribute: !1 })], Sn.prototype, "dashboard", void 0), W([N()], Sn.prototype, "view", void 0), W([N({ type: Boolean })], Sn.prototype, "dirty", void 0), W([N({ type: Boolean })], Sn.prototype, "saving", void 0), Sn = W([M("ods-header")], Sn);
//#endregion
//#region src/item-fields.ts
var Cn = (e, t) => {
	let { width: n, height: r } = t.display, i = R.fields, a = (e, t, n, r, i) => ({
		label: e,
		key: t,
		value: n,
		min: r,
		max: i
	});
	if (e.kind === "widget") return {
		grid: [
			a(i.x, "x", e.frame.x, 0, n),
			a(i.y, "y", e.frame.y, 0, r),
			a(i.width, "width", e.frame.width, 1, n),
			a(i.height, "height", e.frame.height, 1, r)
		],
		extra: [a(i.innerPadding, "padding", e.layout.padding, 0, 128)]
	};
	let o = e.primitive;
	return Qe(o) ? {
		grid: [
			a(i.x, "x", Math.min(o.x_start, o.x_end), 0, n),
			a(i.y, "y", Math.min(o.y_start, o.y_end), 0, r),
			a(i.width, "width", Math.abs(o.x_end - o.x_start) + 1, 1, n),
			a(i.height, "height", Math.abs(o.y_end - o.y_start) + 1, 1, r)
		],
		extra: []
	} : o.type === "circle" ? {
		grid: [
			a(i.centerX, "x", o.x, 0, n),
			a(i.centerY, "y", o.y, 0, r),
			a(i.radius, "radius", o.radius, 1, Math.min(n, r))
		],
		extra: []
	} : o.type === "qrcode" ? {
		grid: [
			a(i.x, "x", o.x, 0, n),
			a(i.y, "y", o.y, 0, r),
			a(i.moduleSize, "boxsize", o.boxsize, 1, 16)
		],
		extra: []
	} : {
		grid: [
			a(i.x, "x", o.x, 0, n),
			a(i.y, "y", o.y, 0, r),
			a(i.size, "size", o.size, 6, 256)
		],
		extra: []
	};
}, wn = (e, t) => {
	let n = [...pt[t], "accent"], r = R.fields, i = (e, t, r = n) => ({
		name: e,
		label: t,
		selector: { select: { options: r } }
	}), a = (e, t, n, r) => ({
		name: e,
		label: t,
		selector: { number: {
			min: n,
			max: r
		} }
	}), o = (e, t) => ({
		name: e,
		label: t,
		selector: { text: {} }
	}), s = (e, t) => ({
		name: e,
		label: t,
		selector: { boolean: {} }
	});
	switch (e.primitive.type) {
		case "text": return [o("value", r.text), i("color", r.color)];
		case "line": return [
			i("fill", r.color),
			a("width", r.lineWidth, 1, 32),
			s("dashed", r.dashed)
		];
		case "icon": return [o("value", r.iconName), i("color", r.color)];
		case "qrcode": return [
			o("data", r.content),
			a("border", r.quietZone, 0, 8),
			i("color", r.foreground),
			i("bgcolor", r.background)
		];
		case "progress_bar": return [
			a("progress", r.progress, 0, 100),
			i("direction", r.direction, [
				"right",
				"left",
				"up",
				"down"
			]),
			i("fill", r.fill),
			i("background", r.background),
			s("show_percentage", r.showPercentage)
		];
		default: return [
			i("fill", r.fill, ["transparent", ...n]),
			i("outline", r.outline),
			a("width", r.outlineWidth, 0, 32)
		];
	}
}, Y = class extends j {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.value = 0, this.min = 0, this.max = 4096, this.disabled = !1;
	}
	static {
		this.styles = [H, o`
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
		V(this, "field-change", {
			key: this.fieldKey,
			value: K(e)
		});
	}
	render() {
		return D`
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
W([N()], Y.prototype, "label", void 0), W([N()], Y.prototype, "fieldKey", void 0), W([N({ type: Number })], Y.prototype, "value", void 0), W([N({ type: Number })], Y.prototype, "min", void 0), W([N({ type: Number })], Y.prototype, "max", void 0), W([N({ type: Boolean })], Y.prototype, "disabled", void 0), Y = W([M("ods-property-field")], Y);
//#endregion
//#region src/ods-structure.ts
var Tn = 4, X = class extends j {
	constructor(...e) {
		super(...e), this.items = [], this.widgets = [], this.selectedItemId = "", this.draggingId = "";
	}
	static {
		this.styles = [
			H,
			U,
			o`
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
		e.button === 0 && (e.stopPropagation(), e.preventDefault(), this.stopGesture = un({
			origin: e,
			threshold: Tn,
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
				this.clearDrag(), n && r && r.itemId !== t && V(this, "layers-reorder", {
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
	flagView(e, t, n) {
		let r = R.structure;
		return e === "hidden" ? t ? {
			title: r.showTitle,
			label: r.show(n),
			icon: "mdi:eye-off-outline"
		} : {
			title: r.hideTitle,
			label: r.hide(n),
			icon: "mdi:eye-outline"
		} : t ? {
			title: r.unlockTitle,
			label: r.unlock(n),
			icon: "mdi:lock"
		} : {
			title: r.lockTitle,
			label: r.lock(n),
			icon: "mdi:lock-open-variant-outline"
		};
	}
	flagButton(e, t, n) {
		let { title: r, label: i, icon: a } = this.flagView(t, e[t], n);
		return D`
      <button
        title=${r}
        aria-label=${i}
        @click=${(n) => {
			n.stopPropagation(), V(this, "item-flag-toggle", {
				itemId: e.id,
				flag: t
			});
		}}
      >
        <ha-icon .icon=${a}></ha-icon>
      </button>
    `;
	}
	collapse() {
		V(this, "inspector-collapse", { collapsed: !0 });
	}
	selectItem(e) {
		V(this, "item-select", { itemId: e.id });
	}
	onRowKeyDown(e, t) {
		e.target === e.currentTarget && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.selectItem(t));
	}
	requestDelete(e, t) {
		e.stopPropagation(), V(this, "item-delete-request", { itemId: t.id });
	}
	renderRow(e) {
		let t = Kt(e, this.widgets), n = this.dropTarget?.itemId === e.id ? this.dropTarget.edge : void 0, r = ln({
			"layer-row": !0,
			active: e.id === this.selectedItemId,
			"is-hidden": e.hidden,
			dragging: e.id === this.draggingId,
			"drop-before": n === "before",
			"drop-after": n === "after"
		});
		return D`
      <div
        role="treeitem"
        tabindex="0"
        aria-label=${t}
        aria-selected=${e.id === this.selectedItemId}
        data-item-id=${e.id}
        class=${r}
        @click=${() => this.selectItem(e)}
        @keydown=${(t) => this.onRowKeyDown(t, e)}
      >
        <button
          class="drag"
          title=${R.structure.reorderTitle}
          aria-label=${R.structure.reorder(t)}
          @pointerdown=${(t) => this.startDrag(t, e.id)}
        >
          <ha-icon icon="mdi:drag-vertical"></ha-icon>
        </button>
        <ha-icon
          class="layer-type-icon"
          .icon=${qt(e, this.widgets)}
        ></ha-icon>
        <span>
          <strong>${t}</strong>
          <small>${this.kindLabel(e)}</small>
        </span>
        <div class="layer-actions">
          ${this.flagButton(e, "hidden", t)}
          ${this.flagButton(e, "locked", t)}
          <button
            class="delete"
            title=${R.structure.deleteTitle}
            aria-label=${R.structure.delete(t)}
            @click=${(t) => this.requestDelete(t, e)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
      </div>
    `;
	}
	kindLabel(e) {
		return e.kind === "widget" ? R.structure.widget : e.primitive.type;
	}
	render() {
		let e = [...this.items].reverse();
		return D`
      <section class="layers">
        <header>
          <div>
            <span class="eyebrow">${R.structure.title}</span>
            <h2>${R.structure.heading}</h2>
          </div>
          <div class="layers-header-actions">
            <span class="count">${e.length}</span>
            <button
              class="icon-button"
              title=${R.structure.collapse}
              aria-label=${R.structure.collapse}
              @click=${this.collapse}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        </header>
        <div class="layer-list" role="tree">
          ${e.length ? e.map((e) => this.renderRow(e)) : D`
                  <p class="empty-layers">${R.structure.empty}</p>
                `}
        </div>
      </section>
    `;
	}
};
W([N({ attribute: !1 })], X.prototype, "items", void 0), W([N({ attribute: !1 })], X.prototype, "widgets", void 0), W([N()], X.prototype, "selectedItemId", void 0), W([P()], X.prototype, "draggingId", void 0), W([P()], X.prototype, "dropTarget", void 0), X = W([M("ods-structure")], X);
//#endregion
//#region src/ods-inspector.ts
var En = 286, Dn = 560, On = [
	"width",
	"height",
	"padding",
	"snapSize"
], kn = (e) => On.some((t) => t === e), An = (e) => e.label, Z = class extends j {
	constructor(...e) {
		super(...e), this.widgets = [], this.selectedItemId = "", this.collapsed = !1, this.width = 350;
	}
	static {
		this.styles = [
			H,
			U,
			o`
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
      .section-body > ods-property-field {
        margin-top: 10px;
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
	updated(e) {
		e.has("selectedItemId") && this.propertiesPanel && (this.propertiesPanel.scrollTop = 0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopGesture?.();
	}
	startResize(e) {
		e.preventDefault();
		let t = e.clientX, n = this.width;
		this.stopGesture = un({
			origin: e,
			onMove: (e) => {
				let r = n + t - e.clientX;
				V(this, "inspector-resize", { width: I(r, En, Dn) });
			}
		});
	}
	expand() {
		V(this, "inspector-collapse", { collapsed: !1 });
	}
	numberFrom(e) {
		let t = Math.round(Number(e.detail.value));
		return Number.isFinite(t) ? t : void 0;
	}
	onItemFieldChange(e) {
		e.stopPropagation();
		let t = this.numberFrom(e);
		t !== void 0 && V(this, "item-number-change", {
			key: e.detail.key,
			value: t
		});
	}
	onDisplayFieldChange(e) {
		e.stopPropagation();
		let { key: t } = e.detail, n = this.numberFrom(e);
		n !== void 0 && kn(t) && V(this, "display-number-change", {
			key: t,
			value: n
		});
	}
	onProfileChange(e) {
		V(this, "profile-change", { profileId: K(e) });
	}
	onPaletteChange(e) {
		let t = K(e);
		gt(t) && V(this, "palette-change", { palette: t });
	}
	onBackgroundChange(e) {
		V(this, "background-change", { color: K(e) });
	}
	onWidgetConfigChange(e) {
		V(this, "widget-config-change", { value: e.detail.value });
	}
	onPrimitiveChange(e) {
		V(this, "primitive-change", { value: e.detail.value });
	}
	requestDashboardDelete() {
		V(this, "dashboard-delete-request");
	}
	unlock(e) {
		V(this, "item-flag-toggle", {
			itemId: e.id,
			flag: "locked"
		});
	}
	requestItemDelete(e) {
		V(this, "item-delete-request", { itemId: e.id });
	}
	renderHeader(e, t, n) {
		return D`
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
		return D`
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
		if (!e) return k;
		let { timings: t } = e, n = R.inspector.metrics, r = [
			[n.queue, t.queue],
			[n.data, t.data],
			[n.compile, t.compile],
			[n.render, t.render],
			[n.encode, t.encode],
			[n.total, t.pipeline]
		];
		return D`
      ${e.warnings.map((e) => D`
          <ha-alert class="warning" alert-type="warning">${e}</ha-alert>
        `)}
      <details class="inspector-section telemetry">
        <summary>${R.inspector.diagnostics}</summary>
        <div class="section-body metrics">
          ${r.map(([e, t]) => D`
              <span>${e}</span>
              <strong>${R.common.milliseconds(t)}</strong>
            `)}
        </div>
      </details>
    `;
	}
	renderDisplayField(e, t, n, r) {
		return D`
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
		return D`
      <label class="stack-field">
        ${R.inspector.displayType}
        <select @change=${this.onProfileChange}>
          ${mt.map((t) => D`
              <option value=${t.id} ?selected=${t.id === e}>
                ${t.manufacturer} · ${t.name}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderPaletteSelect() {
		let { profileId: e, palette: t } = this.dashboard.display, n = ht(e), r = n.id === "custom" ? Object.keys(z).filter(gt) : n.palettes;
		return D`
      <label class="stack-field">
        ${R.fields.palette}
        <select @change=${this.onPaletteChange}>
          ${r.map((e) => D`
              <option value=${e} ?selected=${e === t}>
                ${z[e]}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderBackgroundSelect() {
		let { palette: e, background: t } = this.dashboard.display;
		return D`
      <label class="stack-field">
        ${R.fields.background}
        <select @change=${this.onBackgroundChange}>
          ${pt[e].map((e) => D`
              <option value=${e} ?selected=${e === t}>
                ${e[0].toUpperCase()}${e.slice(1)}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderDashboardInspector() {
		return D`
      ${this.renderHeader(R.inspector.dashboard, R.inspector.dashboardHint, "mdi:monitor")}
      <details class="inspector-section" open>
        <summary>${R.inspector.display}</summary>
        <div class="section-body">
          ${this.renderProfileSelect()}
          <div class="field-grid">
            ${this.renderDisplayField(R.fields.width, "width", 64, 4096)}
            ${this.renderDisplayField(R.fields.height, "height", 64, 4096)}
          </div>
          <div class="field-grid">
            ${this.renderPaletteSelect()} ${this.renderBackgroundSelect()}
          </div>
        </div>
      </details>
      <details class="inspector-section" open>
        <summary>${R.inspector.workingArea}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${this.renderDisplayField(R.fields.padding, "padding", 0, 1024)}
            ${this.renderDisplayField(R.fields.snapSize, "snapSize", 1, 256)}
          </div>
          <p class="field-help">${R.inspector.workingAreaHelp}</p>
        </div>
      </details>
      ${this.renderDangerZone(R.inspector.deleteDashboard, this.requestDashboardDelete)}
      ${this.renderMetrics()}
    `;
	}
	renderLayoutField(e, t) {
		return D`
      <ods-property-field
        .label=${e.label}
        .fieldKey=${e.key}
        .value=${e.value}
        .min=${e.min}
        .max=${e.max}
        .disabled=${t}
        @field-change=${this.onItemFieldChange}
      ></ods-property-field>
    `;
	}
	renderLockedNotice(e) {
		return e.locked ? D`
      <div class="locked-notice">
        <span>
          <ha-icon icon="mdi:lock"></ha-icon>
          ${R.inspector.locked}
        </span>
        <button
          type="button"
          aria-label=${R.inspector.unlockElement}
          @click=${() => this.unlock(e)}
        >
          ${R.inspector.unlock}
        </button>
      </div>
    ` : k;
	}
	renderLayoutSection(e) {
		let { grid: t, extra: n } = Cn(e, this.dashboard);
		return D`
      <details class="inspector-section" open>
        <summary>${R.inspector.layout}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${t.map((t) => this.renderLayoutField(t, e.locked))}
          </div>
          ${n.map((t) => this.renderLayoutField(t, e.locked))}
        </div>
      </details>
    `;
	}
	renderWidgetSettings(e) {
		let t = this.widgets.find((t) => t.id === e.widget.type)?.fields.map((e) => ({
			name: e.key,
			label: e.label,
			required: e.required,
			selector: e.selector
		})) ?? [];
		return D`
      <details class="inspector-section" open>
        <summary>${R.inspector.widgetSettings}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${e.widget.config}
            .schema=${t}
            .computeLabel=${An}
            @value-changed=${this.onWidgetConfigChange}
          ></ha-form>
        </div>
      </details>
    `;
	}
	renderAppearance(e) {
		let t = "fill" in e.primitive ? {
			...e.primitive,
			fill: e.primitive.fill ?? "transparent"
		} : e.primitive, n = wn(e, this.dashboard.display.palette);
		return D`
      <details class="inspector-section" open>
        <summary>${R.inspector.appearance}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${t}
            .schema=${n}
            .computeLabel=${An}
            @value-changed=${this.onPrimitiveChange}
          ></ha-form>
        </div>
      </details>
    `;
	}
	renderItemInspector(e) {
		let t = e.kind === "widget" ? R.inspector.kindWidget : R.inspector.kindPrimitive;
		return D`
      ${this.renderHeader(Kt(e, this.widgets), R.inspector.subtitle(t, e.locked), qt(e, this.widgets))}
      ${this.renderLockedNotice(e)} ${this.renderLayoutSection(e)}
      ${e.kind === "widget" ? this.renderWidgetSettings(e) : this.renderAppearance(e)}
      ${this.renderDangerZone(R.inspector.removeElement, () => this.requestItemDelete(e))}
      ${this.renderMetrics()}
    `;
	}
	renderRail() {
		return D`
      <aside class="panel panel-rail right-rail">
        <button
          class="icon-button"
          title=${R.inspector.expand}
          aria-label=${R.inspector.expand}
          @click=${this.expand}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="rail-label">${R.inspector.rail}</span>
      </aside>
    `;
	}
	render() {
		if (this.collapsed) return this.renderRail();
		let e = this.dashboard.items.find((e) => e.id === this.selectedItemId);
		return D`
      <aside class="panel inspector">
        <div
          class="panel-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label=${R.inspector.resize}
          @pointerdown=${this.startResize}
        ></div>
        <ods-structure
          .items=${this.dashboard.items}
          .widgets=${this.widgets}
          .selectedItemId=${this.selectedItemId}
        ></ods-structure>
        <section class="properties">
          ${e ? this.renderItemInspector(e) : this.renderDashboardInspector()}
        </section>
      </aside>
    `;
	}
};
W([N({ attribute: !1 })], Z.prototype, "hass", void 0), W([N({ attribute: !1 })], Z.prototype, "dashboard", void 0), W([N({ attribute: !1 })], Z.prototype, "widgets", void 0), W([N({ attribute: !1 })], Z.prototype, "preview", void 0), W([N()], Z.prototype, "selectedItemId", void 0), W([N({ type: Boolean })], Z.prototype, "collapsed", void 0), W([N({ type: Number })], Z.prototype, "width", void 0), W([Le(".properties")], Z.prototype, "propertiesPanel", void 0), Z = W([M("ods-inspector")], Z);
//#endregion
//#region src/catalog.ts
var jn = (e, t) => {
	let n = t.trim().toLocaleLowerCase();
	return n ? e.filter((e) => `${e.name} ${e.description}`.toLocaleLowerCase().includes(n)) : e;
}, Mn = 4, Nn = class extends j {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.collapsed = !1, this.searchText = "", this.suppressClick = !1;
	}
	static {
		this.styles = [
			H,
			U,
			o`
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
		this.stopGesture = un({
			origin: e,
			threshold: Mn,
			onActivate: () => V(this, "catalog-drag", { active: !0 }),
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
				this.ghost = void 0, n && (V(this, "catalog-drag", { active: !1 }), this.suppressClick = !0, V(this, "catalog-drop", {
					value: t,
					clientX: e.clientX,
					clientY: e.clientY
				}), window.setTimeout(() => {
					this.suppressClick = !1;
				}, 0));
			},
			onCancel: () => {
				this.ghost = void 0, V(this, "catalog-drag", { active: !1 });
			}
		});
	}
	onSearchInput(e) {
		this.searchText = K(e);
	}
	addFromClick(e) {
		this.suppressClick || V(this, "catalog-add", { value: e });
	}
	renderEntry(e, t) {
		let n = `${t}:${e.id}`;
		return D`
      <button
        class="catalog-item"
        title=${R.library.entryHint(e.description)}
        @click=${() => this.addFromClick(n)}
        @pointerdown=${(t) => this.startDrag(t, n, e)}
      >
        <ha-icon .icon=${e.icon}></ha-icon>
        <strong>${e.name}</strong>
        <small>${e.description}</small>
      </button>
    `;
	}
	renderEntries(e, t, n) {
		return e.length ? D`
      ${e.map((e) => this.renderEntry(e, t))}
    ` : D`
        <p class="empty-result">${n}</p>
      `;
	}
	renderGhost() {
		let e = this.ghost;
		if (!e) return k;
		let t = F({
			left: `${e.x}px`,
			top: `${e.y}px`,
			width: `${e.width}px`,
			height: `${e.height}px`
		});
		return D`
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
		if (this.collapsed) return D`
        <aside class="panel panel-rail">
          <button
            class="icon-button"
            title=${R.library.expand}
            aria-label=${R.library.expand}
            @click=${() => V(this, "library-collapse", { collapsed: !1 })}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <span class="rail-label">${R.library.title}</span>
        </aside>
      `;
		let e = jn(this.widgets, this.searchText), t = jn(this.primitives, this.searchText);
		return D`
      ${this.renderGhost()}
      <aside class="panel toolbox">
        <div class="panel-title">
          <div>
            <span class="eyebrow">${R.library.title}</span>
            <h2>${R.library.heading}</h2>
          </div>
          <button
            class="icon-button"
            title=${R.library.collapse}
            aria-label=${R.library.collapse}
            @click=${() => V(this, "library-collapse", { collapsed: !0 })}
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
        </div>
        <label class="search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            aria-label=${R.library.search}
            placeholder=${R.library.searchPlaceholder}
            .value=${this.searchText}
            @input=${this.onSearchInput}
          />
        </label>
        <div class="catalog-scroll">
          <section class="catalog-section">
            <header>
              <span>${R.library.widgets}</span>
              <span class="count">${e.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(e, "widget", R.library.noWidgets)}
            </div>
          </section>
          <section class="catalog-section">
            <header>
              <span>${R.library.primitives}</span>
              <span class="count">${t.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(t, "primitive", R.library.noPrimitives)}
            </div>
          </section>
        </div>
      </aside>
    `;
	}
};
W([N({ attribute: !1 })], Nn.prototype, "widgets", void 0), W([N({ attribute: !1 })], Nn.prototype, "primitives", void 0), W([N({ type: Boolean })], Nn.prototype, "collapsed", void 0), W([P()], Nn.prototype, "searchText", void 0), W([P()], Nn.prototype, "ghost", void 0), Nn = W([M("ods-library")], Nn);
//#endregion
//#region src/ods-new-dashboard-dialog.ts
var Pn = class extends j {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [
			H,
			U,
			o`
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
		V(this, "new-dashboard-change", { value: e.detail.value });
	}
	render() {
		return D`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${R.newDashboard.title}
        header-subtitle=${R.newDashboard.subtitle}
        @closed=${() => V(this, "new-dashboard-close")}
      >
        <div class="new-dashboard-content">
          <span class="form-label">${R.newDashboard.startFrom}</span>
          <div
            class="dashboard-source-options"
            role="radiogroup"
            aria-label=${R.newDashboard.sources}
          >
            <button
              class="dashboard-source selected"
              type="button"
              role="radio"
              aria-checked="true"
            >
              <ha-icon icon="mdi:monitor"></ha-icon>
              <span>
                <strong>${R.newDashboard.customSize}</strong>
                <small>${R.newDashboard.customSizeHint}</small>
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
                <strong>${R.newDashboard.fromDevice}</strong>
                <small>${R.newDashboard.fromDeviceHint}</small>
              </span>
            </button>
          </div>
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Mt(this.dashboard)}
            .schema=${Lt()}
            .computeLabel=${Rt}
            @value-changed=${this.formChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => V(this, "new-dashboard-close")}
          >
            ${R.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !Pt(this.dashboard)}
            @click=${() => V(this, "dashboard-create")}
          >
            ${this.saving ? R.newDashboard.creating : R.newDashboard.create}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
};
W([N({ attribute: !1 })], Pn.prototype, "hass", void 0), W([N({ attribute: !1 })], Pn.prototype, "dashboard", void 0), W([N({ type: Boolean })], Pn.prototype, "saving", void 0), Pn = W([M("ods-new-dashboard-dialog")], Pn);
//#endregion
//#region src/ods-app.ts
var Fn = 220, Q = (e, t) => e instanceof Error && e.message ? e.message : typeof e == "string" && e ? e : t, $ = class extends j {
	constructor(...e) {
		super(...e), this.dashboards = [], this.view = "dashboards", this.widgets = [], this.primitives = [], this.selectedItemId = "", this.loading = !0, this.saving = !1, this.dirty = !1, this.error = "", this.draggingCatalog = !1, this.undoCount = 0, this.redoCount = 0, this.pendingDeleteItemId = "", this.leftCollapsed = !1, this.rightCollapsed = !1, this.inspectorWidth = 350, this.snapEnabled = !0, this.viewport = an, this.newDashboardOpen = !1, this.newDashboard = jt("en"), this.previewRequest = 0, this.bootstrapStarted = !1, this.history = new Ut(), this.undo = () => {
			this.current && this.restore(this.history.undo(this.current));
		}, this.redo = () => {
			this.current && this.restore(this.history.redo(this.current));
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
		};
	}
	static {
		this.styles = [
			H,
			U,
			o`
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
		super.connectedCallback(), window.addEventListener("keydown", this.onHistoryKeyDown);
	}
	firstUpdated() {
		this.ensureBootstrap();
	}
	updated(e) {
		e.has("hass") && this.ensureBootstrap();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.previewTimer && window.clearTimeout(this.previewTimer), window.removeEventListener("keydown", this.onHistoryKeyDown);
	}
	ensureBootstrap() {
		!this.hass || this.bootstrapStarted || (this.bootstrapStarted = !0, this.bootstrap());
	}
	async bootstrap() {
		let e = this.hass;
		if (e) {
			this.loading = !0, this.error = "";
			try {
				let t = await Jt(e);
				this.dashboards = t.dashboards, this.widgets = t.widgets, this.primitives = t.primitives, this.current = void 0, this.preview = void 0, this.view = "dashboards", this.clearHistory(), this.newDashboard = jt(e.language);
			} catch (e) {
				this.error = Q(e, R.app.loadFailed);
			} finally {
				this.loading = !1;
			}
		}
	}
	openNewDashboard() {
		this.newDashboard = jt(this.language), this.newDashboardOpen = !0;
	}
	async createDashboard() {
		if (this.hass) {
			this.saving = !0, this.error = "";
			try {
				let e = await Yt(this.hass, this.newDashboard);
				this.dashboards = [...this.dashboards, e], this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.newDashboardOpen = !1, this.view = "design", this.clearHistory(), await this.composePreview(), await this.updateComplete, this.showWholeCanvas();
			} catch (e) {
				this.error = Q(e, R.app.createFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveDashboard() {
		if (!(!this.hass || !this.current)) {
			this.saving = !0, this.error = "";
			try {
				let e = await Xt(this.hass, this.current);
				this.current = structuredClone(e), this.dashboards = this.dashboards.map((t) => t.id === e.id ? e : t), this.dirty = !1;
			} catch (e) {
				this.error = Q(e, R.app.saveFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async deleteDashboard() {
		if (!this.hass || !this.current) return;
		let e = this.current.id;
		try {
			await Zt(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.view = "dashboards", this.clearHistory();
		} catch (e) {
			this.error = Q(e, R.app.deleteFailed);
		}
	}
	openDashboard(e) {
		if (this.current?.id === e.id) {
			this.view = "design", this.preview || this.composePreview();
			return;
		}
		this.dirty && !window.confirm(R.app.discardChanges) || (this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.clearHistory(), this.view = "design", this.composePreview().then(() => this.showWholeCanvas()));
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
				let t = await Xt(this.hass, e);
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
			this.error = R.app.renameEmpty;
			return;
		}
		if (this.dashboards.find((t) => t.id === e.id)?.name === e.name) {
			this.closeAction();
			return;
		}
		await this.updateFromGallery(e, R.app.renameFailed) && this.closeAction();
	}
	async duplicateDashboard(e) {
		if (!this.hass || this.saving) return;
		this.saving = !0, this.error = "";
		let t = structuredClone(e);
		t.id = "", t.name = It(e, this.dashboards, this.language), t.status = "draft", t.createdAt = "", t.updatedAt = "";
		try {
			let e = await Yt(this.hass, t);
			this.dashboards = [...this.dashboards, e];
		} catch (e) {
			this.error = Q(e, R.app.duplicateFailed);
		} finally {
			this.saving = !1;
		}
	}
	async saveSettings() {
		if (this.dashboardDialog !== "settings" || !this.dashboardDraft || !Pt(this.dashboardDraft)) return;
		let e = structuredClone(this.dashboardDraft);
		e.name = e.name.trim(), await this.updateFromGallery(e, R.app.settingsFailed) && this.closeAction();
	}
	async confirmDeleteDashboard() {
		if (this.dashboardDialog !== "delete" || !this.dashboardDraft || !this.hass || this.saving) return;
		let e = this.dashboardDraft.id;
		this.saving = !0, this.error = "";
		try {
			await Zt(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current?.id === e && (this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.clearHistory()), this.closeAction();
		} catch (e) {
			this.error = Q(e, R.app.deleteFailed);
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
	schedulePreview() {
		this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.composePreview(), Fn);
	}
	async composePreview() {
		if (!this.hass || !this.current) return;
		this.error = "";
		let e = ++this.previewRequest;
		try {
			let t = await Qt(this.hass, this.current);
			e === this.previewRequest && (this.preview = t);
		} catch (e) {
			this.error = Q(e, R.app.previewFailed);
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
	addAt(e, t, n) {
		let r = this.current;
		if (!r) return;
		let [i, a] = e.split(":");
		if (!a) return;
		let o;
		if (i === "widget") {
			let e = this.widgets.find((e) => e.id === a);
			e && (o = Ot(e, t, n, r));
		} else if (i === "primitive" && (o = kt(a, t, n, r), !o)) {
			this.error = R.app.unsupportedPrimitive(a);
			return;
		}
		if (!o) return;
		let s = o;
		this.mutate((e) => {
			e.items.push(s);
		}), this.selectItem(s.id);
	}
	addFromCatalog(e) {
		if (!this.current) return;
		let { x: t, y: n } = At(this.current, this.snapEnabled);
		this.addAt(e, t, n);
	}
	dropFromCatalog(e, t, n) {
		let r = this.current, i = this.canvas?.displayPointAt(t, n);
		if (!r || !i) return;
		let a = L(r);
		this.addAt(e, I(tt(i.x, r, this.snapEnabled), a.x, a.x + a.width - 1), I(tt(i.y, r, this.snapEnabled), a.y, a.y + a.height - 1));
	}
	confirmDeleteItem() {
		let e = this.pendingDeleteItemId;
		e && (this.pendingDeleteItemId = "", this.mutate((t) => wt(t, e)), this.selectedItemId === e && this.selectItem(""));
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
		this.dashboardDraft &&= Nt(this.dashboardDraft, e.detail.value);
	}
	onNewDashboardChange(e) {
		this.newDashboard = Nt(this.newDashboard, e.detail.value);
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
	onItemFlagToggle(e) {
		let { itemId: t, flag: n } = e.detail;
		this.mutate((e) => Ct(e, t, n));
	}
	onItemDeleteRequest(e) {
		this.pendingDeleteItemId = e.detail.itemId;
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
		this.mutate((e) => Tt(e, t, n, r));
	}
	onItemNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => _t(e, this.selectedItemId, t, n));
	}
	onDisplayNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => yt(e, t, n));
	}
	onProfileChange(e) {
		let t = ht(e.detail.profileId);
		this.mutate((e) => bt(e, t)), requestAnimationFrame(() => this.canvas?.fitView());
	}
	onPaletteChange(e) {
		this.mutate((t) => xt(t, e.detail.palette));
	}
	onBackgroundChange(e) {
		this.mutate((t) => St(t, e.detail.color));
	}
	onWidgetConfigChange(e) {
		let t = e.detail.value;
		this.mutate((e) => Et(e, this.selectedItemId, t));
	}
	onPrimitiveChange(e) {
		let { value: t } = e.detail;
		this.mutate((e) => Dt(e, this.selectedItemId, t));
	}
	renderDeleteDialog() {
		let e = this.current?.items.find((e) => e.id === this.pendingDeleteItemId);
		return e ? D`
      <ods-confirm-dialog
        eyebrow=${R.app.confirmRemoval}
        heading=${R.app.deleteElementTitle(Kt(e, this.widgets))}
        body=${R.app.deleteElementBody}
        confirmLabel=${R.app.deleteElement}
        @confirm-accept=${this.confirmDeleteItem}
        @confirm-cancel=${this.cancelDeleteItem}
      ></ods-confirm-dialog>
    ` : k;
	}
	renderNewDashboardDialog() {
		return this.newDashboardOpen ? D`
      <ods-new-dashboard-dialog
        .hass=${this.hass}
        .dashboard=${this.newDashboard}
        .saving=${this.saving}
        @new-dashboard-change=${this.onNewDashboardChange}
        @new-dashboard-close=${this.closeNewDashboard}
        @dashboard-create=${this.createDashboard}
      ></ods-new-dashboard-dialog>
    ` : k;
	}
	renderGallery() {
		return D`
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
		return D`
      <div
        class="layout"
        style=${F({
			"--toolbox-width": this.leftCollapsed ? "48px" : "255px",
			"--inspector-width": this.rightCollapsed ? "48px" : `${this.inspectorWidth}px`
		})}
        @item-select=${this.onItemSelect}
        @item-flag-toggle=${this.onItemFlagToggle}
        @item-delete-request=${this.onItemDeleteRequest}
      >
        <ods-library
          .widgets=${this.widgets}
          .primitives=${this.primitives}
          .collapsed=${this.leftCollapsed}
          @library-collapse=${this.onLibraryCollapse}
          @catalog-add=${this.onCatalogAdd}
          @catalog-drag=${this.onCatalogDrag}
          @catalog-drop=${this.onCatalogDrop}
        ></ods-library>
        <ods-canvas
          .dashboard=${e}
          .preview=${this.preview}
          .widgets=${this.widgets}
          .selectedItemId=${this.selectedItemId}
          .snapEnabled=${this.snapEnabled}
          .acceptingDrop=${this.draggingCatalog}
          .undoCount=${this.undoCount}
          .redoCount=${this.redoCount}
          .viewport=${this.viewport}
          @viewport-change=${this.onViewportChange}
          @item-transform=${this.onItemTransform}
          @item-transform-end=${this.onItemTransformEnd}
          @snap-toggle=${this.toggleSnap}
          @undo=${this.undo}
          @redo=${this.redo}
        ></ods-canvas>
        <ods-inspector
          .hass=${this.hass}
          .dashboard=${e}
          .widgets=${this.widgets}
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
          @widget-config-change=${this.onWidgetConfigChange}
          @primitive-change=${this.onPrimitiveChange}
          @dashboard-delete-request=${this.deleteDashboard}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()}
    `;
	}
	renderError() {
		return this.error ? D`
      <ha-alert alert-type="error">${this.error}</ha-alert>
    ` : k;
	}
	renderEditor(e) {
		return D`
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
        ${this.renderError()}
        ${this.view === "code" ? D`
                <ods-code-view .preview=${this.preview}></ods-code-view>
              ` : this.renderDesign(e)}
      </div>
    `;
	}
	render() {
		if (this.loading) return D`
        <div class="dashboard-empty">
          <p>${R.app.loading}</p>
        </div>
      `;
		let e = this.current;
		return this.view === "dashboards" || !e ? this.renderGallery() : this.renderEditor(e);
	}
};
W([N({ attribute: !1 })], $.prototype, "hass", void 0), W([P()], $.prototype, "dashboards", void 0), W([P()], $.prototype, "view", void 0), W([P()], $.prototype, "widgets", void 0), W([P()], $.prototype, "primitives", void 0), W([P()], $.prototype, "current", void 0), W([P()], $.prototype, "selectedItemId", void 0), W([P()], $.prototype, "preview", void 0), W([P()], $.prototype, "loading", void 0), W([P()], $.prototype, "saving", void 0), W([P()], $.prototype, "dirty", void 0), W([P()], $.prototype, "error", void 0), W([P()], $.prototype, "draggingCatalog", void 0), W([P()], $.prototype, "undoCount", void 0), W([P()], $.prototype, "redoCount", void 0), W([P()], $.prototype, "pendingDeleteItemId", void 0), W([P()], $.prototype, "leftCollapsed", void 0), W([P()], $.prototype, "rightCollapsed", void 0), W([P()], $.prototype, "inspectorWidth", void 0), W([P()], $.prototype, "snapEnabled", void 0), W([P()], $.prototype, "viewport", void 0), W([P()], $.prototype, "newDashboardOpen", void 0), W([P()], $.prototype, "newDashboard", void 0), W([P()], $.prototype, "dashboardDialog", void 0), W([P()], $.prototype, "dashboardDraft", void 0), W([Le("ods-canvas")], $.prototype, "canvas", void 0), $ = W([M("ods-app")], $);
//#endregion
export { $ as OdsApp };
