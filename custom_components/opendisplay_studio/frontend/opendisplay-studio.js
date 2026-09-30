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
						ctor: r[1] === "." ? Te : r[1] === "?" ? Ee : r[1] === "@" ? De : we
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
function j(e, t, n = e, r) {
	if (t === O) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = ce(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = j(e, i._$AS(e, t.values), i, r)), t;
}
var Se = class {
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
				s.type === 2 ? t = new Ce(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Oe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = A.nextNode(), a++);
		}
		return A.currentNode = w, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Ce = class e {
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
		e = j(this, e, t), ce(e) ? e === k || e == null || e === "" ? (this._$AH !== k && this._$AR(), this._$AH = k) : e !== this._$AH && e !== O && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ue(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
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
			let e = new Se(r, this), n = e.u(this.options);
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
}, we = class {
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
		if (i === void 0) e = j(this, e, t, 0), a = !ce(e) || e !== this._$AH && e !== O, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = j(this, r[n + o], t, o), s === O && (s = this._$AH[o]), a ||= !ce(s) || s !== this._$AH[o], s === k ? e = k : e !== k && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === k ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Te = class extends we {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === k ? void 0 : e;
	}
}, Ee = class extends we {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== k);
	}
}, De = class extends we {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = j(this, e, t, 0) ?? k) === O) return;
		let n = this._$AH, r = e === k && n !== k || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== k && (n === k || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Oe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		j(this, e);
	}
}, ke = re.litHtmlPolyfillSupport;
ke?.(xe, Ce), (re.litHtmlVersions ??= []).push("3.3.3");
var Ae = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Ce(t.insertBefore(T(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, je = globalThis, M = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ae(t, this.renderRoot, this.renderOptions);
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
M._$litElement$ = !0, M.finalized = !0, je.litElementHydrateSupport?.({ LitElement: M });
var Me = je.litElementPolyfillSupport;
Me?.({ LitElement: M }), (je.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var N = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Ne = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	hasChanged: y
}, Pe = (e = Ne, t, n) => {
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
function P(e) {
	return (t, n) => typeof n == "object" ? Pe(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function F(e) {
	return P({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Fe = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function Ie(e, t) {
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
			return Fe(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Fe(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/lit-html/directive.js
var Le = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Re = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), ze = class {
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
}, Be = "important", Ve = " !" + Be, I = Re(class extends ze {
	constructor(e) {
		if (super(e), e.type !== Le.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(Ve);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? Be : "") : n[e] = r;
			}
		}
		return O;
	}
}), L = (e, t, n) => Math.max(t, Math.min(n, e)), He = (e, t, n = 0) => n + Math.round((e - n) / t) * t, Ue = [
	"nw",
	"n",
	"ne",
	"e",
	"se",
	"s",
	"sw",
	"w"
], We = (e) => e.includes("e") || e.includes("w"), Ge = (e) => e.includes("n") || e.includes("s"), Ke = (e, t, n, r) => r ? He(e, t, n) : Math.round(e), qe = ({ bounds: e, handle: t, deltaX: n, deltaY: r, minimumWidth: i, minimumHeight: a, area: o, preserveAspect: s, snapSize: c, snapEnabled: l }) => {
	let u = o.x + o.width, d = o.y + o.height, f = e.x, p = e.y, m = e.x + e.width, h = e.y + e.height, ee = f + e.width / 2, te = p + e.height / 2, g = f, _ = p, v = m, y = h;
	if (t.includes("w") && (g = Ke(f + n, c, o.x, l)), t.includes("e") && (v = Ke(m + n, c, o.x, l)), t.includes("n") && (_ = Ke(p + r, c, o.y, l)), t.includes("s") && (y = Ke(h + r, c, o.y, l)), t.includes("w") && (g = L(g, o.x, m - i)), t.includes("e") && (v = L(v, f + i, u)), t.includes("n") && (_ = L(_, o.y, h - a)), t.includes("s") && (y = L(y, p + a, d)), !s) return {
		x: Math.round(g),
		y: Math.round(_),
		width: Math.round(v - g),
		height: Math.round(y - _)
	};
	let ne = e.width / Math.max(1, e.height), b = Math.max(i, v - g), re = Math.max(a, y - _), ie = Math.abs(b - e.width) / Math.max(1, e.width), ae = Math.abs(re - e.height) / Math.max(1, e.height), x, S;
	We(t) && (!Ge(t) || ie >= ae) ? (x = b, S = x / ne) : (S = re, x = S * ne);
	let C = t.includes("w") ? m - o.x : t.includes("e") ? u - f : Math.max(1, Math.min(ee - o.x, u - ee) * 2), oe = t.includes("n") ? h - o.y : t.includes("s") ? d - p : Math.max(1, Math.min(te - o.y, d - te) * 2), se = Math.max(i / Math.max(1, e.width), a / Math.max(1, e.height)), w = Math.min(C / Math.max(1, e.width), oe / Math.max(1, e.height)), T = L(Math.max(x / Math.max(1, e.width), S / Math.max(1, e.height)), Math.min(se, w), w);
	return x = Math.max(1, Math.round(e.width * T)), S = Math.max(1, Math.round(e.height * T)), g = t.includes("w") ? m - x : t.includes("e") ? f : ee - x / 2, _ = t.includes("n") ? h - S : t.includes("s") ? p : te - S / 2, g = L(Math.round(g), o.x, u - x), _ = L(Math.round(_), o.y, d - S), {
		x: g,
		y: _,
		width: x,
		height: S
	};
}, Je = (e, t, n, r) => {
	let i = r.includes("w") ? e.x + e.width - t : r.includes("e") ? e.x : e.x + (e.width - t) / 2, a = r.includes("n") ? e.y + e.height - n : r.includes("s") ? e.y : e.y + (e.height - n) / 2;
	return {
		x: Math.round(i),
		y: Math.round(a),
		width: t,
		height: n
	};
}, Ye = (e) => "x_start" in e, Xe = (e) => {
	if (Ye(e)) return {
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
}, Ze = (e) => e.kind === "widget" ? e.frame : Xe(e.primitive), R = (e) => {
	let t = e.display.padding;
	return {
		x: t,
		y: t,
		width: e.display.width - t * 2,
		height: e.display.height - t * 2
	};
}, z = (e, t, n) => n ? He(e, t.display.snapSize, t.display.padding) : Math.round(e), Qe = (e, t, n) => {
	if (e.kind === "widget") {
		e.frame.x += t, e.frame.y += n;
		return;
	}
	let r = e.primitive;
	Ye(r) ? (r.x_start += t, r.x_end += t, r.y_start += n, r.y_end += n) : (r.x += t, r.y += n);
}, $e = (e, t) => {
	let n = R(t), r = Ze(e);
	Qe(e, L(r.x, n.x, Math.max(n.x, n.x + n.width - r.width)) - r.x, L(r.y, n.y, Math.max(n.y, n.y + n.height - r.height)) - r.y), e.kind === "widget" && (e.frame.width = Math.min(e.frame.width, n.width), e.frame.height = Math.min(e.frame.height, n.height));
}, et = {
	width: 60,
	height: 48
}, tt = (e, t) => {
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
		let e = Xe({
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
}, nt = {
	n: "ne",
	e: "se",
	s: "se",
	w: "sw"
}, rt = (e, t, n, r, i, a, o) => {
	let s = Ze(e), { minimumWidth: c, minimumHeight: l, intrinsicAspect: u } = tt(e, o.minSize ?? et), d = u ? nt[t] ?? t : t, f = qe({
		bounds: s,
		handle: d,
		deltaX: n,
		deltaY: r,
		minimumWidth: c,
		minimumHeight: l,
		area: R(a),
		preserveAspect: i || u,
		snapSize: a.display.snapSize,
		snapEnabled: o.snapEnabled
	});
	if (e.kind === "widget") {
		e.frame = f;
		return;
	}
	let p = e.primitive;
	if (Ye(p)) {
		let e = f.x + f.width - 1, t = f.y + f.height - 1;
		if (p.type === "line") {
			let n = p.x_start <= p.x_end, r = p.y_start <= p.y_end;
			p.x_start = n ? f.x : e, p.x_end = n ? e : f.x, p.y_start = r ? f.y : t, p.y_end = r ? t : f.y, p.x_start === p.x_end && p.y_start === p.y_end && (p.x_end = Math.min(a.display.width - 1, p.x_start + 1));
		} else p.x_start = f.x, p.y_start = f.y, p.x_end = e, p.y_end = t;
		return;
	}
	if (p.type === "circle") {
		let e = Math.max(1, Math.floor((Math.min(f.width, f.height) - 1) / 2)), t = e * 2 + 1, n = Je(f, t, t, d);
		p.x = n.x + e, p.y = n.y + e, p.radius = e;
		return;
	}
	if (p.type === "qrcode") {
		let e = 21 + p.border * 2;
		p.boxsize = L(Math.floor(Math.min(f.width, f.height) / e), 1, 16);
		let t = e * p.boxsize, n = Je(f, t, t, d);
		p.x = n.x, p.y = n.y;
		return;
	}
	if (p.type === "icon") {
		p.size = L(Math.floor(Math.min(f.width, f.height)), 8, 256);
		let e = Je(f, p.size, p.size, d);
		p.x = e.x, p.y = e.y;
		return;
	}
	p.size = L(Math.round(p.size * f.width / Math.max(1, s.width)), 6, 256);
	let m = Xe(p), h = Je(f, m.width, m.height, d);
	p.x = h.x, p.y = h.y;
}, it = (e, t, n, r, i, a) => {
	let o = structuredClone(e);
	if (o.locked) return o;
	if (t.mode === "resize") return rt(o, t.handle, n, r, t.shiftKey, i, a), o;
	let s = R(i), c = Ze(o), l = L(z(c.x + n, i, a.snapEnabled), s.x, Math.max(s.x, s.x + s.width - c.width)), u = L(z(c.y + r, i, a.snapEnabled), s.y, Math.max(s.y, s.y + s.height - c.height));
	return Qe(o, l - c.x, u - c.y), o;
}, at = () => Math.floor(Math.random() * 256), ot = () => {
	let e = globalThis.crypto;
	if (typeof e?.randomUUID == "function") return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	typeof e?.getRandomValues == "function" ? e.getRandomValues(t) : t.forEach((e, n) => {
		t[n] = at();
	}), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0"));
	return `${n.slice(0, 4).join("")}-${n.slice(4, 6).join("")}-${n.slice(6, 8).join("")}-${n.slice(8, 10).join("")}-${n.slice(10).join("")}`;
}, st = (e, t) => {
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
}, B = {
	bw: "Black / white",
	bwr: "Black / white / red",
	bwy: "Black / white / yellow",
	bwry: "Black / white / red / yellow",
	spectra6: "Spectra 6 · black / white / red / yellow / blue / green"
}, ct = {
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
}, V = (e, t, n, r, i = !1) => ({
	id: `solum-${e}`,
	manufacturer: "SOLUM",
	name: `Newton Pro ${t}`,
	width: n,
	height: r,
	palettes: i ? ["bw"] : ["bw", "bwry"],
	defaultPalette: i ? "bw" : "bwry"
}), lt = [
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
	V("1-6-v", "1.6″ V", 200, 200),
	V("1-6-h", "1.6″ H", 200, 200),
	V("2-2", "2.2″", 296, 160),
	V("2-2-freezer", "2.2″ Freezer", 296, 160, !0),
	V("2-6", "2.6″", 360, 184),
	V("2-6-freezer", "2.6″ Freezer", 360, 184, !0),
	V("2-7", "2.7″", 300, 200),
	V("2-9", "2.9″", 384, 168),
	V("2-9-freezer", "2.9″ Freezer", 384, 168, !0),
	V("3-45", "3.5″ · 3.45 panel", 480, 224),
	V("3-52", "3.5″ · 3.52 panel", 384, 180),
	V("4-2", "4.2″", 400, 300),
	V("4-3", "4.3″", 522, 152),
	V("4-5", "4.5″", 480, 176),
	V("5-8", "5.8″", 792, 272),
	V("6-1", "6.1″", 648, 480),
	V("7-5", "7.5″", 800, 480),
	V("9-7", "9.7″", 672, 960),
	V("11-6", "11.6″", 640, 960),
	V("12-2", "12.2″", 768, 960),
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
], ut = (e) => lt.find((t) => t.id === e) ?? lt[0], dt = (e) => e in B, ft = (e, t, n, r) => {
	let i = e.items.find((e) => e.id === t);
	if (!i || i.locked) return;
	let a = R(e);
	if (i.kind === "widget") {
		n === "padding" && (i.layout.padding = L(r, 0, 128)), n === "x" && (i.frame.x = L(r, a.x, a.x + a.width - i.frame.width)), n === "y" && (i.frame.y = L(r, a.y, a.y + a.height - i.frame.height)), n === "width" && (i.frame.width = L(r, 1, a.x + a.width - i.frame.x)), n === "height" && (i.frame.height = L(r, 1, a.y + a.height - i.frame.y));
		return;
	}
	let o = i.primitive;
	if (Ye(o)) {
		if (n === "x") {
			let e = o.x_end - o.x_start;
			o.x_start = L(r, a.x, a.x + a.width - e - 1), o.x_end = o.x_start + e;
		}
		if (n === "y") {
			let e = o.y_end - o.y_start;
			o.y_start = L(r, a.y, a.y + a.height - e - 1), o.y_end = o.y_start + e;
		}
		n === "width" && (o.x_end = L(o.x_start + Math.max(1, r) - 1, o.x_start + 1, a.x + a.width - 1)), n === "height" && (o.y_end = L(o.y_start + Math.max(1, r) - 1, o.y_start + 1, a.y + a.height - 1));
	} else o.type === "circle" ? (n === "x" && (o.x = L(r, a.x + o.radius, a.x + a.width - o.radius)), n === "y" && (o.y = L(r, a.y + o.radius, a.y + a.height - o.radius)), n === "radius" && (o.radius = L(r, 1, Math.floor(Math.min(a.width, a.height) / 2)))) : (n === "x" && (o.x = L(r, a.x, a.x + a.width - 1)), n === "y" && (o.y = L(r, a.y, a.y + a.height - 1)), n === "size" && o.type !== "qrcode" && (o.size = L(r, o.type === "text" ? 6 : 8, 256)), n === "boxsize" && o.type === "qrcode" && (o.boxsize = L(r, 1, 16)));
}, pt = (e) => e.items.forEach((t) => $e(t, e)), mt = (e, t, n) => {
	(t === "width" || t === "height") && (e.display[t] = L(n, 64, 4096)), t === "padding" && (e.display.padding = L(n, 0, Math.floor((Math.min(e.display.width, e.display.height) - 1) / 2))), t === "snapSize" && (e.display.snapSize = L(n, 1, 256)), pt(e);
}, ht = (e, t) => {
	e.display.profileId = t.id, e.display.width = t.width, e.display.height = t.height, e.display.palette = t.defaultPalette, pt(e);
}, gt = (e, t) => {
	e.display.palette = t, ct[t].includes(e.display.background) || (e.display.background = "white");
}, _t = (e, t) => {
	e.display.background = t;
}, vt = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r && (r[n] = !r[n]);
}, yt = (e, t) => {
	e.items = e.items.filter((e) => e.id !== t);
}, bt = (e, t, n, r) => {
	let i = [...e.items].reverse(), a = i.findIndex((e) => e.id === t);
	if (a < 0) return;
	let [o] = i.splice(a, 1), s = i.findIndex((e) => e.id === n);
	s < 0 || (i.splice(r === "before" ? s : s + 1, 0, o), e.items = i.reverse());
}, xt = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r?.kind === "widget" && (r.widget.config = n);
}, St = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	if (r?.kind !== "primitive") return;
	let i = {
		...r.primitive,
		...n
	};
	"fill" in i && i.fill === "transparent" && (i.fill = null), r.primitive = i;
}, Ct = (e, t, n, r) => {
	let i = R(r), a = Math.min(e.layout.defaultSize?.width ?? 240, i.width), o = Math.min(e.layout.defaultSize?.height ?? 144, i.height);
	return {
		id: ot(),
		kind: "widget",
		locked: !1,
		hidden: !1,
		widget: {
			type: e.id,
			version: e.version,
			config: structuredClone(e.defaults)
		},
		frame: {
			x: L(Math.round(t - a / 2), i.x, i.x + i.width - a),
			y: L(Math.round(n - o / 2), i.y, i.y + i.height - o),
			width: a,
			height: o
		},
		layout: { padding: 0 }
	};
}, wt = (e, t, n, r) => {
	let { width: i, height: a } = r.display, o = st(e.trim(), {
		x: Math.round(i / 2),
		y: Math.round(a / 2),
		displayWidth: i,
		displayHeight: a
	});
	if (!o) return;
	let s = {
		id: ot(),
		kind: "primitive",
		locked: !1,
		hidden: !1,
		primitive: o
	}, c = Ze(s);
	return Qe(s, Math.round(t - (c.x + c.width / 2)), Math.round(n - (c.y + c.height / 2))), $e(s, r), s;
}, Tt = (e, t) => {
	let n = R(e), r = e.items.length * Math.max(e.display.snapSize, 5) * 3 % Math.max(1, Math.min(n.width, n.height) / 3);
	return {
		x: z(n.x + Math.min(24 + r, Math.max(0, n.width - 1)), e, t),
		y: z(n.y + Math.min(24 + r, Math.max(0, n.height - 1)), e, t)
	};
}, Et = (e, t = "custom") => {
	let n = ut(t);
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
}, Dt = (e) => ({
	name: e.name,
	width: e.display.width,
	height: e.display.height,
	palette: e.display.palette,
	padding: e.display.padding,
	snapSize: e.display.snapSize
}), Ot = (e, t) => {
	let n = {
		...Dt(e),
		...t
	}, r = structuredClone(e);
	return r.name = String(n.name), r.display.profileId = "custom", r.display.width = Math.round(Number(n.width) || 0), r.display.height = Math.round(Number(n.height) || 0), r.display.palette = n.palette in B ? n.palette : "bw", r.display.padding = Math.round(Number(n.padding) || 0), r.display.snapSize = Math.round(Number(n.snapSize) || 0), ct[r.display.palette].includes(r.display.background) || (r.display.background = "white"), r;
}, kt = (e) => {
	let { width: t, height: n, padding: r, snapSize: i } = e.display;
	return !!e.name.trim() && t >= 64 && t <= 4096 && n >= 64 && n <= 4096 && r >= 0 && r * 2 < Math.min(t, n) && i >= 1 && i <= 256;
}, At = (e, t, n, r) => {
	let i = t.trim().toLocaleLowerCase(r);
	return e.filter((e) => !i || e.name.toLocaleLowerCase(r).includes(i)).sort((e, t) => n === "name" ? e.name.localeCompare(t.name, r) : t.updatedAt.localeCompare(e.updatedAt) || e.name.localeCompare(t.name, r));
}, jt = (e, t, n) => {
	let r = new Set(t.map((e) => e.name.toLocaleLowerCase(n))), i = `${e.name} copy`, a = i, o = 2;
	for (; r.has(a.toLocaleLowerCase(n));) a = `${i} ${o++}`;
	return a;
}, Mt = () => [
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
			options: Object.entries(B).map(([e, t]) => ({
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
], Nt = (e) => "label" in e ? e.label : e.title ?? "", Pt = {
	bwr: "#d32f2f",
	bwry: "#d32f2f",
	bwy: "#d6a800",
	spectra6: "#246bfd"
}, Ft = (e) => Pt[e] ?? "#202124", It = (e, t) => {
	let n = new Date(e.updatedAt);
	return Number.isNaN(n.getTime()) ? "" : new Intl.DateTimeFormat(t, { dateStyle: "medium" }).format(n);
}, H = (e, t, ...n) => {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n[0],
		bubbles: !0,
		composed: !0
	}));
}, Lt = 100, Rt = class {
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
		this.undoStack.push(structuredClone(e)), this.undoStack.length > Lt && this.undoStack.shift(), this.redoStack = [];
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
}, zt = {
	text: "Text",
	rectangle: "Rectangle",
	line: "Line",
	circle: "Circle",
	ellipse: "Ellipse",
	icon: "Icon",
	qrcode: "QR code",
	progress_bar: "Progress bar"
}, Bt = {
	text: "mdi:format-text",
	rectangle: "mdi:rectangle-outline",
	line: "mdi:vector-line",
	circle: "mdi:circle-outline",
	ellipse: "mdi:ellipse-outline",
	icon: "mdi:star-outline",
	qrcode: "mdi:qrcode",
	progress_bar: "mdi:progress-helper"
}, Vt = {
	nw: "north west",
	n: "north",
	ne: "north east",
	e: "east",
	se: "south east",
	s: "south",
	sw: "south west",
	w: "west"
}, Ht = (e, t) => e.kind === "widget" ? t.find((t) => t.id === e.widget.type) : void 0, Ut = (e, t) => {
	if (e.kind === "primitive") return zt[e.primitive.type];
	let n = e.widget.config.title;
	return typeof n == "string" && n.trim() ? n : Ht(e, t)?.name ?? e.widget.type;
}, Wt = (e, t) => e.kind === "primitive" ? Bt[e.primitive.type] : Ht(e, t)?.icon ?? "mdi:puzzle", U = o`
  * { box-sizing: border-box; }
  button, input, select { font: inherit; color: inherit; }
  button { cursor: pointer; }
  ha-icon { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 18px; height: 18px; color: currentColor; line-height: 1; }
`, W = o`
  .status { padding: 5px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
  .status.ready { color: #197438; background: #dff5e6; }
  .status.draft { color: #635b00; background: #f7efc3; }
  .eyebrow { display: block; color: var(--studio-muted); font: 700 9px/1.2 var(--code-font-family, monospace); letter-spacing: .14em; text-transform: uppercase; }
  .icon-button { border: 0; border-radius: 7px; width: 34px; height: 34px; display: inline-grid; place-items: center; background: transparent; color: var(--studio-muted); }
  .icon-button:hover { background: var(--studio-accent-soft); color: var(--studio-accent); }
  .count { min-width: 22px; padding: 2px 6px; border-radius: 999px; text-align: center; background: var(--secondary-background-color, #eef1f2); }
  ha-dialog { --dialog-content-padding: 0; }
`, Gt = .25, Kt = 96, qt = 3, Jt = .1, Yt = {
	zoom: 1,
	panX: 0,
	panY: 0
}, Xt = (e, t) => ({
	...e,
	zoom: L(t, Gt, 4)
}), Zt = (e, t) => {
	let n = Math.max(100, e.width - Kt), r = Math.max(100, e.height - Kt);
	return {
		zoom: L(Math.min(n / t.width, r / t.height), Gt, qt),
		panX: 0,
		panY: 0
	};
}, Qt = (e, t) => t.shiftKey ? Xt(e, e.zoom + (t.deltaY < 0 ? Jt : -.1)) : t.altKey ? {
	...e,
	panX: e.panX - t.deltaY
} : {
	...e,
	panY: e.panY - t.deltaY
}, $t = (e) => {
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
function G(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/ods-zoom-bar.ts
var en = [
	.5,
	1,
	2,
	3
], tn = .25, nn = class extends M {
	constructor(...e) {
		super(...e), this.zoom = 1;
	}
	static {
		this.styles = [U, o`
    :host { display: contents; }
    .zoom-controls { position: absolute; right: 16px; bottom: 14px; display: flex; align-items: center; padding: 4px; border: 1px solid var(--studio-border); border-radius: 9px; background: var(--studio-surface); box-shadow: 0 8px 24px rgba(28,38,48,.14); }
    .zoom-controls button { min-width: 34px; height: 30px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; color: var(--studio-muted); font-size: 11px; }
    .zoom-controls button:hover { color: var(--studio-text); background: var(--secondary-background-color, #eef1f4); }
    .zoom-controls button.active { color: #fff; background: var(--studio-accent); }
    @media (max-width: 900px) {
      .zoom-controls { right: 8px; bottom: 8px; }
      .zoom-controls button:nth-of-type(2), .zoom-controls button:nth-of-type(4) { display: none; }
    }
  `];
	}
	zoomTo(e) {
		H(this, "zoom-change", { zoom: e });
	}
	render() {
		return D`<div class="zoom-controls"><button aria-label="Zoom out" @click=${() => this.zoomTo(this.zoom - tn)}>−</button>${en.map((e) => D`<button class=${this.zoom === e ? "active" : ""} aria-label=${`${e}×`} @click=${() => this.zoomTo(e)}>${e}×</button>`)}<button aria-label="Zoom in" @click=${() => this.zoomTo(this.zoom + tn)}>+</button><button aria-label="Reset" @click=${() => H(this, "zoom-reset")}>Reset</button><button aria-label="Fit" @click=${() => H(this, "zoom-fit")}>Fit</button></div>`;
	}
};
G([P({ type: Number })], nn.prototype, "zoom", void 0), nn = G([N("ods-zoom-bar")], nn);
//#endregion
//#region src/ods-canvas.ts
var rn = 3, an = (e, t) => ({
	left: `${e.x / t.width * 100}%`,
	top: `${e.y / t.height * 100}%`,
	width: `${e.width / t.width * 100}%`,
	height: `${e.height / t.height * 100}%`
}), K = class extends M {
	constructor(...e) {
		super(...e), this.widgets = [], this.selectedItemId = "", this.snapEnabled = !0, this.acceptingDrop = !1, this.undoCount = 0, this.redoCount = 0, this.viewport = Yt;
	}
	static {
		this.styles = [U, o`
    :host { display: contents; }
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
    @media (max-width: 900px) {
      .workspace-meta { gap: 8px; padding: 0 8px; }
      .workspace-meta > span:nth-child(2), .workspace-meta > span:nth-child(3) { display: none; }
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
		H(this, "viewport-change", e);
	}
	resetView() {
		this.setViewport(Yt);
	}
	fitView() {
		let e = this.stage;
		e && this.setViewport(Zt({
			width: e.clientWidth,
			height: e.clientHeight
		}, this.dashboard.display));
	}
	onWheel(e) {
		e.preventDefault(), this.setViewport(Qt(this.viewport, e));
	}
	beginGesture(e, t, n) {
		if (e.stopPropagation(), e.preventDefault(), H(this, "item-select", { itemId: t.id }), t.locked) return;
		this.stopGesture?.();
		let r = structuredClone(this.dashboard), i = structuredClone(t), a = t.kind === "widget" ? this.widgets.find((e) => e.id === t.widget.type)?.layout.minSize : void 0;
		this.stopGesture = $t({
			origin: e,
			threshold: rn,
			onMove: (t) => {
				let r = this.canvas;
				if (!r) return;
				let o = r.getBoundingClientRect(), { width: s, height: c } = this.dashboard.display, l = Math.round((t.clientX - e.clientX) / o.width * s), u = Math.round((t.clientY - e.clientY) / o.height * c), d = n ? {
					mode: "resize",
					handle: n,
					shiftKey: t.shiftKey
				} : { mode: "move" };
				H(this, "item-transform", { item: it(i, d, l, u, this.dashboard, {
					snapEnabled: this.snapEnabled,
					minSize: a
				}) });
			},
			onEnd: (e, t) => {
				t && H(this, "item-transform-end", { before: r });
			}
		});
	}
	renderItem(e) {
		let t = Ze(e), n = e.id === this.selectedItemId;
		return D`
      <div
        data-item-id=${e.id}
        class=${`selection ${n ? "selected" : ""} ${e.locked ? "locked" : ""} ${e.hidden ? "hidden" : ""}`}
        style=${I(an(t, this.dashboard.display))}
        @pointerdown=${(t) => this.beginGesture(t, e)}
      >
        ${e.hidden ? D`<span class="hidden-label">Hidden</span>` : k}
        ${e.locked ? D`<ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>` : k}
        ${n ? D`<output class="selection-size" aria-live="off">${Math.round(t.width)} × ${Math.round(t.height)}</output>` : k}
        ${n && !e.locked ? Ue.map((t) => D`
          <button
            data-resize-handle=${t}
            class=${`resize-handle resize-${t}`}
            tabindex="-1"
            aria-label=${`Resize ${Ut(e, this.widgets)} from ${Vt[t]}`}
            @pointerdown=${(n) => this.beginGesture(n, e, t)}
          ></button>
        `) : k}
      </div>
    `;
	}
	render() {
		let e = this.dashboard, { width: t, height: n, padding: r, snapSize: i } = e.display, a = R(e), { zoom: o, panX: s, panY: c } = this.viewport, l = `translate(${s}px, ${c}px) scale(${o})`;
		return D`
      <main class="workspace">
        <div class="workspace-meta">
          <span>${t} × ${n} px</span>
          <span>${e.items.length} layers</span>
          <span>Padding ${r}px</span>
          <div class="history-controls"><button aria-label="Undo" title="Undo (Ctrl+Z)" ?disabled=${!this.undoCount} @click=${() => H(this, "undo")}><ha-icon icon="mdi:undo"></ha-icon></button><button aria-label="Redo" title="Redo (Ctrl+Shift+Z)" ?disabled=${!this.redoCount} @click=${() => H(this, "redo")}><ha-icon icon="mdi:redo"></ha-icon></button></div>
          <button class=${this.snapEnabled ? "tool-toggle active" : "tool-toggle"} aria-pressed=${this.snapEnabled} @click=${() => H(this, "snap-toggle")}>
            <ha-icon icon="mdi:magnet"></ha-icon><span>Snap ${i}px</span>
          </button>
          <span class="zoom-readout">${Math.round(o * 100)}%</span>
        </div>
        <section class=${this.acceptingDrop ? "canvas-stage accepting-drop" : "canvas-stage"} @wheel=${this.onWheel} @dragover=${(e) => {
			this.acceptingDrop && e.preventDefault();
		}} @drop=${(e) => e.preventDefault()}>
          <div class="canvas-viewport" style=${I({ transform: l })}>
            <div class="canvas" style=${I({
			width: `${t}px`,
			height: `${n}px`
		})} @pointerdown=${() => H(this, "item-select", { itemId: "" })}>
              ${this.preview ? D`<img draggable="false" src=${this.preview.imageUrl} alt="Authoritative rendered display preview">` : D`<div class="canvas-placeholder">Rendering…</div>`}
              <div class="working-area" aria-hidden="true" style=${I({
			...an(a, e.display),
			"--snap-size": `${i * o}px`
		})}></div>
              ${e.items.map((e) => this.renderItem(e))}
            </div>
          </div>
          <ods-zoom-bar .zoom=${o} @zoom-change=${(e) => {
			e.stopPropagation(), this.setViewport(Xt(this.viewport, e.detail.zoom));
		}} @zoom-reset=${(e) => {
			e.stopPropagation(), this.resetView();
		}} @zoom-fit=${(e) => {
			e.stopPropagation(), this.fitView();
		}}></ods-zoom-bar>
        </section>
      </main>
    `;
	}
};
G([P({ attribute: !1 })], K.prototype, "dashboard", void 0), G([P({ attribute: !1 })], K.prototype, "preview", void 0), G([P({ attribute: !1 })], K.prototype, "widgets", void 0), G([P()], K.prototype, "selectedItemId", void 0), G([P({ type: Boolean })], K.prototype, "snapEnabled", void 0), G([P({ type: Boolean })], K.prototype, "acceptingDrop", void 0), G([P({ type: Number })], K.prototype, "undoCount", void 0), G([P({ type: Number })], K.prototype, "redoCount", void 0), G([P({ attribute: !1 })], K.prototype, "viewport", void 0), G([Ie(".canvas")], K.prototype, "canvas", void 0), G([Ie(".canvas-stage")], K.prototype, "stage", void 0), K = G([N("ods-canvas")], K);
//#endregion
//#region src/ods-code-view.ts
var on = {
	idle: "Copy YAML",
	copied: "Copied",
	failed: "Copy failed"
}, sn = {
	idle: "mdi:content-copy",
	copied: "mdi:check",
	failed: "mdi:alert-circle-outline"
}, cn = {
	idle: "",
	copied: "YAML copied to clipboard",
	failed: "Clipboard access failed"
}, ln = 2200, un = class extends M {
	constructor(...e) {
		super(...e), this.copyState = "idle";
	}
	static {
		this.styles = [
			U,
			W,
			o`
    :host { display: contents; }
    .code-workspace { flex: 1; min-height: 0; overflow: auto; padding: clamp(18px, 3vw, 36px); background: var(--primary-background-color, #f5f7f8); }
    .code-panel { width: min(1080px, 100%); min-height: 100%; display: flex; flex-direction: column; gap: 12px; margin-inline: auto; padding: clamp(16px, 2vw, 24px); border: 1px solid var(--studio-border); border-radius: 12px; background: var(--studio-surface); box-shadow: 0 1px 3px rgba(0,0,0,.06); }
    .code-panel > header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
    .code-panel h1 { margin: 4px 0 0; font-size: 20px; }
    .code-panel p { margin: 5px 0 0; color: var(--studio-muted); font-size: 12px; }
    .code-panel textarea { flex: 1; min-height: 420px; width: 100%; resize: none; padding: 15px; border: 1px solid var(--studio-border); border-radius: 9px; outline: 0; color: #d9e4ee; background: #121a24; font: 12px/1.55 var(--code-font-family, monospace); white-space: pre; tab-size: 2; }
    .code-panel textarea:focus { border-color: var(--studio-accent); box-shadow: 0 0 0 1px var(--studio-accent); }
    .copy-status { min-height: 16px; color: var(--studio-muted); font-size: 11px; text-align: end; }
    @media (max-width: 600px) {
      .code-workspace { padding: 10px; }
      .code-panel { padding: 13px; }
      .code-panel > header { align-items: stretch; flex-direction: column; }
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
			}, ln);
		}
	}
	render() {
		return D`
      <main class="code-workspace">
        <section class="code-panel" aria-labelledby="generated-code-title">
          <header>
            <div>
              <span class="eyebrow">Generated output</span>
              <h1 id="generated-code-title">Generated ODL YAML</h1>
              <p>Read-only output generated from the current dashboard.</p>
            </div>
            <ha-button appearance="plain" aria-label="Copy generated ODL YAML" .disabled=${!this.preview?.yaml} @click=${this.copy}><ha-icon slot="start" .icon=${sn[this.copyState]}></ha-icon>${on[this.copyState]}</ha-button>
          </header>
          ${this.preview?.warnings.map((e) => D`<ha-alert alert-type="warning">${e}</ha-alert>`) ?? k}
          <textarea aria-label="Generated ODL YAML" readonly spellcheck="false" dir="ltr" .value=${this.preview?.yaml ?? ""}></textarea>
          <output class="copy-status" aria-live="polite">${cn[this.copyState]}</output>
        </section>
      </main>
    `;
	}
};
G([P({ attribute: !1 })], un.prototype, "preview", void 0), G([F()], un.prototype, "copyState", void 0), un = G([N("ods-code-view")], un);
//#endregion
//#region src/ods-context-menu.ts
var dn = class extends M {
	constructor(...e) {
		super(...e), this.entries = [], this.label = "";
	}
	static {
		this.styles = [U, o`
    :host { display: block; width: 190px; }
    .menu { padding: 5px; border: 1px solid var(--studio-border); border-radius: 10px; background: var(--studio-surface); box-shadow: 0 16px 36px rgba(0,0,0,.18); }
    .menu button { width: 100%; min-height: 36px; display: grid; grid-template-columns: 20px minmax(0,1fr); align-items: center; gap: 8px; padding: 0 9px; border: 0; border-radius: 6px; text-align: start; color: var(--studio-text); background: transparent; font-size: 12px; }
    .menu button:hover, .menu button:focus-visible { outline: 0; background: var(--secondary-background-color, #f3f5f6); }
    .menu button.delete { margin-top: 4px; border-top: 1px solid var(--studio-border); border-radius: 0 0 6px 6px; color: var(--error-color, #db4437); }
    .menu ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
  `];
	}
	render() {
		return D`<div class="menu" role="menu" aria-label=${this.label}>${this.entries.map((e) => D`<button class=${e.danger ? "delete" : ""} role="menuitem" @click=${(t) => {
			t.stopPropagation(), H(this, "menu-select", { id: e.id });
		}}><ha-icon icon=${e.icon}></ha-icon><span>${e.label}</span></button>`)}</div>`;
	}
};
G([P({ attribute: !1 })], dn.prototype, "entries", void 0), G([P()], dn.prototype, "label", void 0), dn = G([N("ods-context-menu")], dn);
//#endregion
//#region src/ods-gallery.ts
var fn = [
	{
		id: "rename",
		label: "Rename",
		icon: "mdi:pencil-outline"
	},
	{
		id: "duplicate",
		label: "Duplicate",
		icon: "mdi:content-copy"
	},
	{
		id: "settings",
		label: "Display Settings",
		icon: "mdi:monitor-cog"
	},
	{
		id: "delete",
		label: "Delete",
		icon: "mdi:delete-outline",
		danger: !0
	}
], q = class extends M {
	constructor(...e) {
		super(...e), this.dashboards = [], this.error = "", this.saving = !1, this.searchText = "", this.sort = "updated", this.menuDashboardId = "", this.onOutsidePointerDown = (e) => {
			this.menuDashboardId && (e.composedPath().some((e) => e instanceof HTMLElement && (e.classList.contains("dashboard-menu") || e.classList.contains("dashboard-menu-trigger"))) || (this.menuDashboardId = ""));
		}, this.onKeyDown = (e) => {
			e.key === "Escape" && (this.menuDashboardId ? (this.menuDashboardId = "", e.stopPropagation()) : this.dialog && (H(this, "dashboard-dialog-close"), e.stopPropagation()));
		};
	}
	static {
		this.styles = [
			U,
			W,
			o`
    :host { display: contents; }
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
    .dashboard-menu { position: absolute; inset-block-start: 45px; inset-inline-end: 9px; z-index: 8; }
    .dashboard-add-card { display: grid; place-items: center; align-content: center; gap: 10px; border-style: dashed; color: var(--studio-muted); box-shadow: none; }
    .dashboard-add-card ha-icon { width: 38px; height: 38px; display: grid; place-items: center; padding: 9px; border-radius: 10px; color: var(--studio-accent); background: var(--studio-accent-soft); line-height: 1; --mdc-icon-size: 20px; }
    .dashboard-add-card strong { color: var(--studio-text); font-size: 13px; }
    .dashboard-no-results { min-height: 236px; display: grid; place-items: center; align-content: center; gap: 8px; color: var(--studio-muted); text-align: center; }
    .dashboard-no-results ha-icon { width: 30px; height: 30px; }
    .dashboard-no-results strong { color: var(--studio-text); }
    .dashboard-no-results span { font-size: 12px; }
    .dashboard-settings-content { padding: 18px 22px 22px; }
    .dashboard-delete-content { padding: 8px 22px 22px; color: var(--studio-muted); font-size: 13px; line-height: 1.5; }
    .dashboard-delete-content p { margin: 0; }
    .dashboard-delete-content p + p { margin-top: 8px; }
    .dashboard-delete-content strong { color: var(--studio-text); }
    @media (hover: none) { .dashboard-menu-trigger { opacity: 1; pointer-events: auto; } }
    @media (max-width: 600px) {
      .dashboard-library { padding: 18px 12px; }
      .dashboard-library-header { align-items: flex-start; }
      .dashboard-library-tools { grid-template-columns: 1fr; }
      .dashboard-sort { justify-content: space-between; }
      .dashboard-grid { grid-template-columns: 1fr; }
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
	updated(e) {
		e.has("dialog") && this.dialog === "rename" && (this.renameInput?.focus(), this.renameInput?.select());
	}
	toggleMenu(e, t) {
		e.stopPropagation(), this.menuDashboardId = this.menuDashboardId === t ? "" : t;
	}
	selectMenu(e, t) {
		let n = fn.find((e) => e.id === t.detail.id);
		n && (this.menuDashboardId = "", H(this, "dashboard-menu-action", {
			dashboard: e,
			action: n.id
		}));
	}
	onRenameKeyDown(e) {
		e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), H(this, "dashboard-rename-commit")) : e.key === "Escape" && (e.preventDefault(), H(this, "dashboard-rename-cancel"));
	}
	settingsChanged(e) {
		H(this, "dashboard-settings-change", { value: e.detail.value });
	}
	renderCard(e) {
		let t = ct[e.display.palette], n = this.menuDashboardId === e.id, r = this.dialog === "rename" && this.draft?.id === e.id, i = `dashboard-menu-${e.id}`;
		return D`
      <article class=${`dashboard-card${n ? " menu-open" : ""}`} data-dashboard-id=${e.id}>
        <div class="dashboard-card-preview">
          <div class="dashboard-miniature" style=${I({
			aspectRatio: `${e.display.width} / ${e.display.height}`,
			background: e.display.background,
			"--dashboard-accent": Ft(e.display.palette)
		})}>
            <span class="miniature-title"></span>
            <span class="miniature-accent"></span>
            <span class="miniature-line long"></span>
            <span class="miniature-line"></span>
          </div>
          <span class="dashboard-resolution">${e.display.width} × ${e.display.height}</span>
        </div>
        <div class="dashboard-card-copy">
          <span class="dashboard-card-title">
            ${r ? D`<input class="dashboard-rename-input" aria-label=${`Rename dashboard ${e.name}`} .value=${this.draft?.name ?? e.name} @input=${(e) => H(this, "dashboard-rename-input", { name: e.target.value })} @keydown=${this.onRenameKeyDown} @blur=${() => H(this, "dashboard-rename-commit")}>` : D`<strong>${e.name}</strong>`}
            <span class=${`status ${e.status}`}>${e.status}</span>
          </span>
          <span class="dashboard-card-meta">
            <span>${e.display.width} × ${e.display.height}</span>
            <span class="palette-dots" aria-label=${B[e.display.palette]}>${t.map((e) => D`<i style=${I({ background: e })}></i>`)}</span>
            <span>${B[e.display.palette]}</span>
          </span>
          <small>Updated ${It(e, this.language)}</small>
        </div>
        <button class="dashboard-card-open" aria-label=${`Open dashboard ${e.name}`} @click=${() => H(this, "dashboard-open", { dashboard: e })}></button>
        <button class="dashboard-menu-trigger" aria-label=${`Dashboard actions for ${e.name}`} aria-haspopup="menu" aria-controls=${i} aria-expanded=${n} @click=${(t) => this.toggleMenu(t, e.id)}><ha-icon icon="mdi:dots-horizontal"></ha-icon></button>
        ${n ? D`<ods-context-menu class="dashboard-menu" id=${i} label=${`Actions for ${e.name}`} .entries=${fn} @menu-select=${(t) => this.selectMenu(e, t)}></ods-context-menu>` : k}
      </article>
    `;
	}
	renderDialog() {
		let e = this.draft;
		return !e || !this.dialog || this.dialog === "rename" ? k : this.dialog === "delete" ? D`
      <ha-dialog .open=${!0} width="small" header-title="Delete dashboard?" @closed=${() => H(this, "dashboard-dialog-close")}>
        <div class="dashboard-delete-content">
          <p><strong>${e.name}</strong> and all of its elements will be permanently removed.</p>
          <p>This action cannot be undone.</p>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${() => H(this, "dashboard-dialog-close")}>Cancel</ha-button>
          <ha-button slot="primaryAction" variant="danger" appearance="filled" .disabled=${this.saving} @click=${() => H(this, "dashboard-delete-confirm")}>${this.saving ? "Deleting…" : "Delete dashboard"}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    ` : D`
      <ha-dialog .open=${!0} width="medium" header-title="Display settings" header-subtitle=${e.name} @closed=${() => H(this, "dashboard-dialog-close")}>
        <div class="dashboard-settings-content">
          <ha-form autofocus .hass=${this.hass} .data=${Dt(e)} .schema=${Mt()} .computeLabel=${Nt} @value-changed=${this.settingsChanged}></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${() => H(this, "dashboard-dialog-close")}>Cancel</ha-button>
          <ha-button slot="primaryAction" appearance="filled" .disabled=${this.saving || !kt(e)} @click=${() => H(this, "dashboard-settings-save")}>${this.saving ? "Saving…" : "Save changes"}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
	render() {
		let e = At(this.dashboards, this.searchText, this.sort, this.language);
		return D`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div><h1>Dashboards</h1><p>${this.dashboards.length} ${this.dashboards.length === 1 ? "dashboard" : "dashboards"}</p></div>
          <ha-button class="dashboard-new-button" appearance="filled" aria-label="New dashboard" @click=${() => H(this, "dashboard-new")}><span class="dashboard-new-button-label"><ha-icon icon="mdi:plus"></ha-icon><span>New dashboard</span></span></ha-button>
        </header>
        ${this.error ? D`<ha-alert alert-type="error">${this.error}</ha-alert>` : k}
        <section class="dashboard-library-tools" aria-label="Dashboard filters">
          <label class="dashboard-search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" aria-label="Search dashboards" placeholder="Search dashboards…" .value=${this.searchText} @input=${(e) => {
			this.searchText = e.target.value;
		}}></label>
          <label class="dashboard-sort"><span>Sort</span><select aria-label="Sort dashboards" .value=${this.sort} @change=${(e) => {
			this.sort = e.target.value === "name" ? "name" : "updated";
		}}><option value="updated">Last updated</option><option value="name">Name A–Z</option></select></label>
        </section>
        <section class="dashboard-grid" aria-label="Saved dashboards">
          <button class="dashboard-add-card" aria-label="Add dashboard" @click=${() => H(this, "dashboard-new")}><ha-icon icon="mdi:plus"></ha-icon><strong>New dashboard</strong></button>
          ${e.map((e) => this.renderCard(e))}
          ${e.length ? k : D`<div class="dashboard-no-results"><ha-icon icon="mdi:magnify"></ha-icon><strong>No dashboards found</strong><span>Try a different search.</span></div>`}
        </section>
      </main>
      ${this.renderDialog()}
    `;
	}
};
G([P({ attribute: !1 })], q.prototype, "dashboards", void 0), G([P({ attribute: !1 })], q.prototype, "hass", void 0), G([P()], q.prototype, "error", void 0), G([P({ type: Boolean })], q.prototype, "saving", void 0), G([P()], q.prototype, "dialog", void 0), G([P({ attribute: !1 })], q.prototype, "draft", void 0), G([F()], q.prototype, "searchText", void 0), G([F()], q.prototype, "sort", void 0), G([F()], q.prototype, "menuDashboardId", void 0), G([Ie(".dashboard-rename-input")], q.prototype, "renameInput", void 0), q = G([N("ods-gallery")], q);
//#endregion
//#region src/ods-header.ts
var pn = class extends M {
	constructor(...e) {
		super(...e), this.view = "design", this.dirty = !1, this.saving = !1;
	}
	static {
		this.styles = [
			U,
			W,
			o`
    :host { display: contents; }
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
    @media (max-width: 900px) {
      .topbar { height: auto; min-height: calc(var(--header-height, 56px) + var(--safe-area-inset-top, 0px)); grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'breadcrumb actions' 'switch switch'; gap: 5px 10px; padding: calc(var(--safe-area-inset-top, 0px) + 6px) 9px 6px; }
      .editor-breadcrumb { grid-area: breadcrumb; }
      .studio-name, .editor-actions .status { display: none; }
      .dashboard-name { width: min(180px, 36vw); }
      .view-switch { grid-area: switch; justify-self: center; }
      .editor-actions { grid-area: actions; }
    }
    @media (max-width: 600px) {
      .breadcrumb-divider:first-of-type { display: none; }
      .editor-actions ha-button:first-of-type { display: none; }
    }
  `
		];
	}
	render() {
		let e = this.dashboard;
		return D`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">OpenDisplay Studio</strong>
          <span class="breadcrumb-divider">/</span>
          <button class="breadcrumb-link" @click=${() => H(this, "show-dashboards")}>Dashboards</button>
          <span class="breadcrumb-divider">/</span>
          <input class="dashboard-name" aria-label="Dashboard name" .value=${e.name} @input=${(e) => H(this, "dashboard-name-change", { name: e.target.value })}>
        </div>
        <nav class="view-switch" aria-label="Dashboard view">
          <button class=${this.view === "design" ? "active" : ""} aria-pressed=${this.view === "design"} @click=${() => H(this, "view-change", { view: "design" })}><ha-icon icon="mdi:tools"></ha-icon>Design</button>
          <button class=${this.view === "code" ? "active" : ""} aria-pressed=${this.view === "code"} @click=${() => H(this, "view-change", { view: "code" })}><ha-icon icon="mdi:code-tags"></ha-icon>Code</button>
        </nav>
        <div class="editor-actions">
          <span class="status ${e.status}">${e.status}</span>
          <ha-button appearance="plain" @click=${() => H(this, "toggle-ready")}>${e.status === "ready" ? "Set Draft" : "Set Ready"}</ha-button>
          <ha-button appearance="filled" .disabled=${!this.dirty || this.saving} @click=${() => H(this, "dashboard-save")}>${this.saving ? "Saving…" : "Save"}</ha-button>
        </div>
      </header>
    `;
	}
};
G([P({ attribute: !1 })], pn.prototype, "dashboard", void 0), G([P()], pn.prototype, "view", void 0), G([P({ type: Boolean })], pn.prototype, "dirty", void 0), G([P({ type: Boolean })], pn.prototype, "saving", void 0), pn = G([N("ods-header")], pn);
//#endregion
//#region src/item-fields.ts
var mn = (e, t) => {
	let { width: n, height: r } = t.display, i = (e, t, n, r, i) => ({
		label: e,
		key: t,
		value: n,
		min: r,
		max: i
	});
	if (e.kind === "widget") return {
		grid: [
			i("X", "x", e.frame.x, 0, n),
			i("Y", "y", e.frame.y, 0, r),
			i("Width", "width", e.frame.width, 1, n),
			i("Height", "height", e.frame.height, 1, r)
		],
		extra: [i("Inner padding", "padding", e.layout.padding, 0, 128)]
	};
	let a = e.primitive;
	return Ye(a) ? {
		grid: [
			i("X", "x", Math.min(a.x_start, a.x_end), 0, n),
			i("Y", "y", Math.min(a.y_start, a.y_end), 0, r),
			i("Width", "width", Math.abs(a.x_end - a.x_start) + 1, 1, n),
			i("Height", "height", Math.abs(a.y_end - a.y_start) + 1, 1, r)
		],
		extra: []
	} : a.type === "circle" ? {
		grid: [
			i("Center X", "x", a.x, 0, n),
			i("Center Y", "y", a.y, 0, r),
			i("Radius", "radius", a.radius, 1, Math.min(n, r))
		],
		extra: []
	} : a.type === "qrcode" ? {
		grid: [
			i("X", "x", a.x, 0, n),
			i("Y", "y", a.y, 0, r),
			i("Module size", "boxsize", a.boxsize, 1, 16)
		],
		extra: []
	} : {
		grid: [
			i("X", "x", a.x, 0, n),
			i("Y", "y", a.y, 0, r),
			i("Size", "size", a.size, 6, 256)
		],
		extra: []
	};
}, hn = (e, t) => {
	let n = [...ct[t], "accent"], r = (e, t, r = n) => ({
		name: e,
		label: t,
		selector: { select: { options: r } }
	}), i = (e, t, n, r) => ({
		name: e,
		label: t,
		selector: { number: {
			min: n,
			max: r
		} }
	}), a = (e, t) => ({
		name: e,
		label: t,
		selector: { text: {} }
	}), o = (e, t) => ({
		name: e,
		label: t,
		selector: { boolean: {} }
	});
	switch (e.primitive.type) {
		case "text": return [a("value", "Text"), r("color", "Color")];
		case "line": return [
			r("fill", "Color"),
			i("width", "Line width", 1, 32),
			o("dashed", "Dashed")
		];
		case "icon": return [a("value", "MDI icon name"), r("color", "Color")];
		case "qrcode": return [
			a("data", "Content"),
			i("border", "Quiet zone", 0, 8),
			r("color", "Foreground"),
			r("bgcolor", "Background")
		];
		case "progress_bar": return [
			i("progress", "Progress", 0, 100),
			r("direction", "Direction", [
				"right",
				"left",
				"up",
				"down"
			]),
			r("fill", "Fill"),
			r("background", "Background"),
			o("show_percentage", "Show percentage")
		];
		default: return [
			r("fill", "Fill", ["transparent", ...n]),
			r("outline", "Outline"),
			i("width", "Outline width", 0, 32)
		];
	}
}, J = class extends M {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.value = 0, this.min = 0, this.max = 4096, this.disabled = !1;
	}
	static {
		this.styles = [U, o`
    :host { display: block; min-width: 0; }
    .number-field { display: grid; gap: 5px; min-width: 0; color: var(--studio-muted); font-size: 10px; }
    .number-field input { width: 100%; min-width: 0; height: 36px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 7px; background: var(--secondary-background-color, #f3f5f6); color: var(--studio-text); }
    .number-field input:disabled { opacity: .55; }
  `];
	}
	render() {
		return D`<label class="number-field"><span>${this.label}</span><input data-field=${this.fieldKey} aria-label=${this.label} type="number" .value=${String(this.value)} min=${this.min} max=${this.max} .disabled=${this.disabled} @change=${(e) => H(this, "field-change", {
			key: this.fieldKey,
			value: e.target.value
		})}></label>`;
	}
};
G([P()], J.prototype, "label", void 0), G([P()], J.prototype, "fieldKey", void 0), G([P({ type: Number })], J.prototype, "value", void 0), G([P({ type: Number })], J.prototype, "min", void 0), G([P({ type: Number })], J.prototype, "max", void 0), G([P({ type: Boolean })], J.prototype, "disabled", void 0), J = G([N("ods-property-field")], J);
//#endregion
//#region src/ods-structure.ts
var gn = 4, Y = class extends M {
	constructor(...e) {
		super(...e), this.items = [], this.widgets = [], this.selectedItemId = "", this.draggingId = "";
	}
	static {
		this.styles = [
			U,
			W,
			o`
    :host { display: contents; }
    .layers { min-height: 150px; flex: 0 0 clamp(176px, 27%, 250px); display: flex; flex-direction: column; border-bottom: 1px solid var(--studio-border); overflow-anchor: none; }
    .layers > header { min-height: 48px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 8px 7px 11px; }
    .layers h2 { margin: 1px 0 0; font-size: 15px; }
    .layers-header-actions { display: flex; align-items: center; gap: 3px; }
    .layer-list { min-height: 0; flex: 1; overflow: auto; padding: 0 6px 8px; }
    .empty-layers { margin: 10px 2px; color: var(--studio-muted); font-size: 12px; line-height: 1.45; }
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
  `
		];
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.stopGesture?.();
	}
	startDrag(e, t) {
		e.button === 0 && (e.stopPropagation(), e.preventDefault(), this.stopGesture = $t({
			origin: e,
			threshold: gn,
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
				this.clearDrag(), n && r && r.itemId !== t && H(this, "layers-reorder", {
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
	flagButton(e, t, n) {
		let r = t === "hidden", i = e[t];
		return D`<button title=${r ? i ? "Show layer" : "Hide layer" : i ? "Unlock position" : "Lock position"} aria-label=${r ? i ? `Show ${n}` : `Hide ${n}` : i ? `Unlock ${n}` : `Lock ${n}`} @click=${(n) => {
			n.stopPropagation(), H(this, "item-flag-toggle", {
				itemId: e.id,
				flag: t
			});
		}}><ha-icon .icon=${r ? i ? "mdi:eye-off-outline" : "mdi:eye-outline" : i ? "mdi:lock" : "mdi:lock-open-variant-outline"}></ha-icon></button>`;
	}
	renderRow(e) {
		let t = this.dropTarget?.itemId === e.id ? `drop-${this.dropTarget.edge}` : "", n = Ut(e, this.widgets);
		return D`<div data-item-id=${e.id} class=${`layer-row ${e.id === this.selectedItemId ? "active" : ""} ${e.hidden ? "is-hidden" : ""} ${e.id === this.draggingId ? "dragging" : ""} ${t}`} @click=${() => H(this, "item-select", { itemId: e.id })}><button class="drag" title="Reorder layer" aria-label=${`Reorder ${n}`} @pointerdown=${(t) => this.startDrag(t, e.id)}><ha-icon icon="mdi:drag-vertical"></ha-icon></button><ha-icon class="layer-type-icon" .icon=${Wt(e, this.widgets)}></ha-icon><span><strong>${n}</strong><small>${e.kind === "widget" ? "Widget" : e.primitive.type}</small></span><div class="layer-actions">${this.flagButton(e, "hidden", n)}${this.flagButton(e, "locked", n)}<button class="delete" title="Delete layer" aria-label=${`Delete ${n}`} @click=${(t) => {
			t.stopPropagation(), H(this, "item-delete-request", { itemId: e.id });
		}}><ha-icon icon="mdi:delete-outline"></ha-icon></button></div></div>`;
	}
	render() {
		let e = [...this.items].reverse();
		return D`<section class="layers"><header><div><span class="eyebrow">Structure</span><h2>Elements</h2></div><div class="layers-header-actions"><span class="count">${e.length}</span><button class="icon-button" title="Collapse inspector" aria-label="Collapse inspector" @click=${() => H(this, "inspector-collapse", { collapsed: !0 })}><ha-icon icon="mdi:chevron-right"></ha-icon></button></div></header><div class="layer-list">${e.length ? e.map((e) => this.renderRow(e)) : D`<p class="empty-layers">Drag widgets or primitives onto the canvas.</p>`}</div></section>`;
	}
};
G([P({ attribute: !1 })], Y.prototype, "items", void 0), G([P({ attribute: !1 })], Y.prototype, "widgets", void 0), G([P()], Y.prototype, "selectedItemId", void 0), G([F()], Y.prototype, "draggingId", void 0), G([F()], Y.prototype, "dropTarget", void 0), Y = G([N("ods-structure")], Y);
//#endregion
//#region src/ods-inspector.ts
var _n = 286, vn = 560, X = class extends M {
	constructor(...e) {
		super(...e), this.widgets = [], this.selectedItemId = "", this.collapsed = !1, this.width = 350;
	}
	static {
		this.styles = [
			U,
			W,
			o`
    :host { display: contents; }
    .panel { position: relative; min-width: 0; min-height: 0; background: var(--studio-surface); }
    .inspector { min-width: 0; border-left: 1px solid var(--studio-border); display: flex; flex-direction: column; overflow: hidden; overflow-anchor: none; }
    .panel-rail { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 12px; padding: 10px 6px; }
    .right-rail { border-left: 1px solid var(--studio-border); }
    .rail-label { writing-mode: vertical-rl; color: var(--studio-muted); font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .panel-resizer { position: absolute; left: -4px; top: 0; bottom: 0; width: 8px; cursor: ew-resize; z-index: 6; }
    .panel-resizer:hover { background: color-mix(in srgb, var(--studio-accent) 30%, transparent); }
    .properties { min-height: 0; flex: 1 1 auto; overflow: auto; overflow-anchor: none; overscroll-behavior: contain; }
    .inspector-title { min-height: 58px; display: grid; grid-template-columns: 30px minmax(0,1fr); align-items: center; gap: 7px; padding: 8px 12px; border-bottom: 1px solid var(--studio-border); }
    .inspector-title > ha-icon { color: var(--studio-accent); }
    .inspector-title h2 { margin: 0; font-size: 15px; }
    .inspector-title p { margin: 3px 0 0; color: var(--studio-muted); font-size: 10px; }
    .inspector-section { border-bottom: 1px solid var(--studio-border); }
    .inspector-section > summary { padding: 12px 14px; cursor: pointer; list-style-position: inside; color: var(--studio-muted); font: 700 10px var(--code-font-family, monospace); letter-spacing: .09em; text-transform: uppercase; }
    .section-body { padding: 2px 14px 14px; }
    .field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .stack-field { display: grid; gap: 5px; min-width: 0; color: var(--studio-muted); font-size: 10px; }
    .stack-field select { width: 100%; min-width: 0; height: 36px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 7px; background: var(--secondary-background-color, #f3f5f6); color: var(--studio-text); }
    .section-body > ods-property-field { margin-top: 10px; }
    .field-grid + .field-grid, .field-grid + .stack-field, .stack-field + .field-grid { margin-top: 10px; }
    .field-help { color: var(--studio-muted); font-size: 10px; line-height: 1.45; }
    .danger-zone { padding: 12px 14px; border-bottom: 1px solid var(--studio-border); color: var(--error-color, #db4437); }
    .metrics { display: grid; grid-template-columns: 1fr auto; gap: 5px 12px; font: 10px var(--code-font-family, monospace); }
    .metrics strong { text-align: right; }
    .locked-notice { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 8px 12px; padding: 7px 9px; border: 1px solid color-mix(in srgb, var(--warning-color, #ffa600) 45%, var(--studio-border)); border-radius: 7px; background: color-mix(in srgb, var(--warning-color, #ffa600) 10%, var(--studio-surface)); font-size: 11px; }
    .locked-notice span { display: inline-flex; align-items: center; gap: 6px; }
    .locked-notice ha-icon { width: 15px; height: 15px; --mdc-icon-size: 15px; }
    .locked-notice button { min-height: 26px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 6px; color: var(--primary-text-color); background: var(--studio-surface); font-size: 11px; font-weight: 700; cursor: pointer; }
    @media (max-width: 900px) { .inspector, .panel-rail { display: none; } }
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
		this.stopGesture = $t({
			origin: e,
			onMove: (e) => H(this, "inspector-resize", { width: L(n + t - e.clientX, _n, vn) })
		});
	}
	numberFrom(e) {
		let t = Math.round(Number(e.detail.value));
		return Number.isFinite(t) ? t : void 0;
	}
	itemNumberChanged(e) {
		e.stopPropagation();
		let t = this.numberFrom(e);
		t !== void 0 && H(this, "item-number-change", {
			key: e.detail.key,
			value: t
		});
	}
	displayNumberChanged(e, t) {
		t.stopPropagation();
		let n = this.numberFrom(t);
		n !== void 0 && H(this, "display-number-change", {
			key: e,
			value: n
		});
	}
	renderField(e, t) {
		return D`<ods-property-field .label=${e.label} .fieldKey=${e.key} .value=${e.value} .min=${e.min} .max=${e.max} .disabled=${t} @field-change=${this.itemNumberChanged}></ods-property-field>`;
	}
	renderDisplayField(e, t, n, r, i) {
		return D`<ods-property-field .label=${e} .fieldKey=${n} .value=${t} .min=${r} .max=${i} @field-change=${(e) => this.displayNumberChanged(n, e)}></ods-property-field>`;
	}
	renderHeader(e, t, n) {
		return D`<div class="inspector-title"><ha-icon .icon=${n}></ha-icon><div><h2>${e}</h2><p>${t}</p></div></div>`;
	}
	renderMetrics() {
		let e = this.preview;
		if (!e) return k;
		let { timings: t } = e, n = [
			["Queue", t.queue],
			["Data", t.data],
			["Compile", t.compile],
			["Render", t.render],
			["Encode", t.encode],
			["Total", t.pipeline]
		];
		return D`${e.warnings.map((e) => D`<ha-alert class="warning" alert-type="warning">${e}</ha-alert>`)}<details class="inspector-section telemetry"><summary>Render diagnostics</summary><div class="section-body metrics">${n.map(([e, t]) => D`<span>${e}</span><strong>${t.toFixed(1)} ms</strong>`)}</div></details>`;
	}
	paletteChanged(e) {
		let t = e.target.value;
		dt(t) && H(this, "palette-change", { palette: t });
	}
	renderDashboardInspector() {
		let e = this.dashboard, t = ut(e.display.profileId), n = t.id === "custom" ? Object.keys(B).filter(dt) : t.palettes;
		return D`${this.renderHeader("Dashboard", "Display and canvas settings", "mdi:monitor")}<details class="inspector-section" open><summary>Display</summary><div class="section-body"><label class="stack-field">Display type<select @change=${(e) => H(this, "profile-change", { profileId: e.target.value })}>${lt.map((t) => D`<option value=${t.id} ?selected=${t.id === e.display.profileId}>${t.manufacturer} · ${t.name}</option>`)}</select></label><div class="field-grid">${this.renderDisplayField("Width", e.display.width, "width", 64, 4096)}${this.renderDisplayField("Height", e.display.height, "height", 64, 4096)}</div><div class="field-grid"><label class="stack-field">Palette<select @change=${this.paletteChanged}>${n.map((t) => D`<option value=${t} ?selected=${t === e.display.palette}>${B[t]}</option>`)}</select></label><label class="stack-field">Background<select @change=${(e) => H(this, "background-change", { color: e.target.value })}>${ct[e.display.palette].map((t) => D`<option value=${t} ?selected=${t === e.display.background}>${t[0].toUpperCase()}${t.slice(1)}</option>`)}</select></label></div></div></details><details class="inspector-section" open><summary>Working area</summary><div class="section-body"><div class="field-grid">${this.renderDisplayField("Outer padding", e.display.padding, "padding", 0, 1024)}${this.renderDisplayField("Snap size", e.display.snapSize, "snapSize", 1, 256)}</div><p class="field-help">Padding defines the editable safe area. Snap aligns movement and resizing to pixel increments.</p></div></details><div class="danger-zone"><ha-button appearance="plain" @click=${() => H(this, "dashboard-delete-request")}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Delete dashboard</ha-button></div>${this.renderMetrics()}`;
	}
	renderItemInspector(e) {
		let t = e.kind === "widget" ? this.widgets.find((t) => t.id === e.widget.type) : void 0, n = `${e.kind === "widget" ? "Widget" : "ODL primitive"} · ${e.locked ? "position locked" : "editable"}`, { grid: r, extra: i } = mn(e, this.dashboard);
		return D`${this.renderHeader(Ut(e, this.widgets), n, Wt(e, this.widgets))}${e.locked ? D`<div class="locked-notice"><span><ha-icon icon="mdi:lock"></ha-icon>Position is locked</span><button type="button" aria-label="Unlock element position" @click=${() => H(this, "item-flag-toggle", {
			itemId: e.id,
			flag: "locked"
		})}>Unlock</button></div>` : k}<details class="inspector-section" open><summary>Layout</summary><div class="section-body"><div class="field-grid">${r.map((t) => this.renderField(t, e.locked))}</div>${i.map((t) => this.renderField(t, e.locked))}</div></details>${e.kind === "widget" ? this.renderWidgetSettings(e, t) : this.renderAppearance(e)}<div class="danger-zone"><ha-button appearance="plain" @click=${() => H(this, "item-delete-request", { itemId: e.id })}><ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>Remove element</ha-button></div>${this.renderMetrics()}`;
	}
	renderWidgetSettings(e, t) {
		let n = t?.fields.map((e) => ({
			name: e.key,
			label: e.label,
			required: e.required,
			selector: e.selector
		})) ?? [];
		return D`<details class="inspector-section" open><summary>Widget settings</summary><div class="section-body"><ha-form .hass=${this.hass} .data=${e.widget.config} .schema=${n} .computeLabel=${(e) => e.label} @value-changed=${(e) => H(this, "widget-config-change", { value: e.detail.value })}></ha-form></div></details>`;
	}
	renderAppearance(e) {
		let t = "fill" in e.primitive ? {
			...e.primitive,
			fill: e.primitive.fill ?? "transparent"
		} : e.primitive;
		return D`<details class="inspector-section" open><summary>Appearance</summary><div class="section-body"><ha-form .hass=${this.hass} .data=${t} .schema=${hn(e, this.dashboard.display.palette)} .computeLabel=${(e) => e.label} @value-changed=${(e) => H(this, "primitive-change", { value: e.detail.value })}></ha-form></div></details>`;
	}
	render() {
		if (this.collapsed) return D`<aside class="panel panel-rail right-rail"><button class="icon-button" title="Expand inspector" aria-label="Expand inspector" @click=${() => H(this, "inspector-collapse", { collapsed: !1 })}><ha-icon icon="mdi:chevron-left"></ha-icon></button><span class="rail-label">Layers</span></aside>`;
		let e = this.dashboard.items.find((e) => e.id === this.selectedItemId);
		return D`<aside class="panel inspector"><div class="panel-resizer" role="separator" aria-orientation="vertical" aria-label="Resize inspector" @pointerdown=${this.startResize}></div><ods-structure .items=${this.dashboard.items} .widgets=${this.widgets} .selectedItemId=${this.selectedItemId}></ods-structure><section class="properties">${e ? this.renderItemInspector(e) : this.renderDashboardInspector()}</section></aside>`;
	}
};
G([P({ attribute: !1 })], X.prototype, "hass", void 0), G([P({ attribute: !1 })], X.prototype, "dashboard", void 0), G([P({ attribute: !1 })], X.prototype, "widgets", void 0), G([P({ attribute: !1 })], X.prototype, "preview", void 0), G([P()], X.prototype, "selectedItemId", void 0), G([P({ type: Boolean })], X.prototype, "collapsed", void 0), G([P({ type: Number })], X.prototype, "width", void 0), G([Ie(".properties")], X.prototype, "propertiesPanel", void 0), X = G([N("ods-inspector")], X);
//#endregion
//#region src/catalog.ts
var yn = (e, t) => {
	let n = t.trim().toLocaleLowerCase();
	return n ? e.filter((e) => `${e.name} ${e.description}`.toLocaleLowerCase().includes(n)) : e;
}, bn = 4, Z = class extends M {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.collapsed = !1, this.searchText = "", this.suppressClick = !1;
	}
	static {
		this.styles = [
			U,
			W,
			o`
    :host { display: contents; }
    .panel { position: relative; min-width: 0; min-height: 0; background: var(--studio-surface); }
    .toolbox { border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; overflow: hidden; }
    .panel-title { min-height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 11px 12px; }
    .panel-title h2 { margin: 1px 0 0; font-size: 15px; }
    .search { margin: 0 10px 10px 9px; min-height: 30px; display: flex; align-items: center; gap: 7px; padding: 0 9px; border: 1px solid var(--studio-border); border-radius: 8px; background: var(--secondary-background-color, #f3f5f6); }
    .search ha-icon { width: 17px; }
    .search input { width: 100%; border: 0; outline: 0; background: transparent; font-size: 13px; }
    .catalog-scroll { flex: 1; min-height: 0; overflow: auto; padding: 0 9px 16px; }
    .catalog-section { margin-top: 8px; }
    .catalog-section > header { display: flex; justify-content: space-between; align-items: center; padding: 7px 2px; color: var(--studio-muted); font: 700 10px var(--code-font-family, monospace); letter-spacing: .11em; text-transform: uppercase; }
    .catalog-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    .catalog-item { min-height: 34px; display: grid; grid-template-columns: 16px minmax(0, 1fr); gap: 8px; align-items: center; padding: 0 10px; text-align: start; border: 1px solid var(--studio-border); border-radius: 8px; background: var(--studio-surface); cursor: grab; touch-action: none; user-select: none; }
    .catalog-item:hover { border-color: var(--studio-accent); background: var(--studio-accent-soft); transform: translateY(-1px); }
    .catalog-item:active { cursor: grabbing; }
    .catalog-item ha-icon { width: 16px; height: 16px; color: var(--studio-accent); --mdc-icon-size: 16px; }
    .catalog-item strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; line-height: 1.2; }
    .catalog-item small { display: none; }
    .empty-result { grid-column: 1 / -1; margin: 10px 2px; color: var(--studio-muted); font-size: 12px; line-height: 1.45; }
    .panel-rail { border-right: 1px solid var(--studio-border); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 12px; padding: 10px 6px; }
    .rail-label { writing-mode: vertical-rl; color: var(--studio-muted); font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    .catalog-drag-ghost { position: fixed; z-index: 1200; box-sizing: border-box; display: grid; grid-template-columns: 16px minmax(0, 1fr) 14px; align-items: center; gap: 5px; min-height: 34px; padding: 0 7px; border: 1px solid var(--studio-accent); border-radius: 8px; color: var(--primary-text-color, #182026); background: var(--studio-surface); box-shadow: 0 7px 18px rgba(0,0,0,.22); font-size: 11px; font-weight: 700; pointer-events: none; }
    .catalog-drag-ghost ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }
    .catalog-drag-ghost .drag-type-icon, .catalog-drag-ghost .drag-add-icon { color: var(--studio-accent); }
    @media (max-width: 900px) { .toolbox, .panel-rail { display: none; } }
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
		this.stopGesture = $t({
			origin: e,
			threshold: bn,
			onActivate: () => H(this, "catalog-drag", { active: !0 }),
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
				this.ghost = void 0, n && (H(this, "catalog-drag", { active: !1 }), this.suppressClick = !0, H(this, "catalog-drop", {
					value: t,
					clientX: e.clientX,
					clientY: e.clientY
				}), window.setTimeout(() => {
					this.suppressClick = !1;
				}, 0));
			},
			onCancel: () => {
				this.ghost = void 0, H(this, "catalog-drag", { active: !1 });
			}
		});
	}
	renderEntries(e, t, n) {
		return D`${e.map((e) => {
			let n = `${t}:${e.id}`;
			return D`<button class="catalog-item" title=${`${e.description} Click or drag to add.`} @click=${() => {
				this.suppressClick || H(this, "catalog-add", { value: n });
			}} @pointerdown=${(t) => this.startDrag(t, n, e)}><ha-icon .icon=${e.icon}></ha-icon><strong>${e.name}</strong><small>${e.description}</small></button>`;
		})}${e.length ? k : D`<p class="empty-result">${n}</p>`}`;
	}
	renderGhost() {
		let e = this.ghost;
		return e ? D`<div class="catalog-drag-ghost" data-catalog-value=${e.value} style=${I({
			left: `${e.x}px`,
			top: `${e.y}px`,
			width: `${e.width}px`,
			height: `${e.height}px`
		})}><ha-icon class="drag-type-icon" .icon=${e.icon}></ha-icon><span>${e.name}</span><ha-icon class="drag-add-icon" icon="mdi:plus"></ha-icon></div>` : k;
	}
	render() {
		if (this.collapsed) return D`<aside class="panel panel-rail"><button class="icon-button" title="Expand element catalog" aria-label="Expand element catalog" @click=${() => H(this, "library-collapse", { collapsed: !1 })}><ha-icon icon="mdi:chevron-right"></ha-icon></button><span class="rail-label">Library</span></aside>`;
		let e = yn(this.widgets, this.searchText), t = yn(this.primitives, this.searchText);
		return D`${this.renderGhost()}<aside class="panel toolbox"><div class="panel-title"><div><span class="eyebrow">Library</span><h2>Elements</h2></div><button class="icon-button" title="Collapse element catalog" aria-label="Collapse element catalog" @click=${() => H(this, "library-collapse", { collapsed: !0 })}><ha-icon icon="mdi:chevron-left"></ha-icon></button></div><label class="search"><ha-icon icon="mdi:magnify"></ha-icon><input type="search" aria-label="Search widgets and primitives" placeholder="Search elements…" .value=${this.searchText} @input=${(e) => {
			this.searchText = e.target.value;
		}}></label><div class="catalog-scroll"><section class="catalog-section"><header><span>Widgets</span><span class="count">${e.length}</span></header><div class="catalog-grid">${this.renderEntries(e, "widget", "No matching widgets")}</div></section><section class="catalog-section"><header><span>Primitives</span><span class="count">${t.length}</span></header><div class="catalog-grid">${this.renderEntries(t, "primitive", "No matching primitives")}</div></section></div></aside>`;
	}
};
G([P({ attribute: !1 })], Z.prototype, "widgets", void 0), G([P({ attribute: !1 })], Z.prototype, "primitives", void 0), G([P({ type: Boolean })], Z.prototype, "collapsed", void 0), G([F()], Z.prototype, "searchText", void 0), G([F()], Z.prototype, "ghost", void 0), Z = G([N("ods-library")], Z);
//#endregion
//#region src/ods-new-dashboard-dialog.ts
var xn = class extends M {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [
			U,
			W,
			o`
    :host { display: contents; }
    .new-dashboard-content { display: grid; gap: 16px; padding: 18px 22px 22px; }
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
    @media (max-width: 600px) { .dashboard-source-options { grid-template-columns: 1fr; } }
  `
		];
	}
	formChanged(e) {
		H(this, "new-dashboard-change", { value: e.detail.value });
	}
	render() {
		return D`
      <ha-dialog .open=${!0} width="medium" header-title="New dashboard" header-subtitle="Create a custom OpenDisplay canvas" @closed=${() => H(this, "new-dashboard-close")}>
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
            .data=${Dt(this.dashboard)}
            .schema=${Mt()}
            .computeLabel=${Nt}
            @value-changed=${this.formChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${() => H(this, "new-dashboard-close")}>Cancel</ha-button>
          <ha-button slot="primaryAction" appearance="filled" .disabled=${this.saving || !kt(this.dashboard)} @click=${() => H(this, "dashboard-create")}>${this.saving ? "Creating…" : "Create dashboard"}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
};
G([P({ attribute: !1 })], xn.prototype, "hass", void 0), G([P({ attribute: !1 })], xn.prototype, "dashboard", void 0), G([P({ type: Boolean })], xn.prototype, "saving", void 0), xn = G([N("ods-new-dashboard-dialog")], xn);
//#endregion
//#region src/ods-app.ts
var Sn = 220, Q = (e, t) => e instanceof Error && e.message ? e.message : typeof e == "string" && e ? e : t, $ = class extends M {
	constructor(...e) {
		super(...e), this.dashboards = [], this.view = "dashboards", this.widgets = [], this.primitives = [], this.selectedItemId = "", this.loading = !0, this.saving = !1, this.dirty = !1, this.error = "", this.draggingCatalog = !1, this.undoCount = 0, this.redoCount = 0, this.pendingDeleteItemId = "", this.leftCollapsed = !1, this.rightCollapsed = !1, this.inspectorWidth = 350, this.snapEnabled = !0, this.viewport = Yt, this.newDashboardOpen = !1, this.newDashboard = Et("en"), this.previewRequest = 0, this.bootstrapStarted = !1, this.history = new Rt(), this.undo = () => {
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
			U,
			W,
			o`
    :host {
      --studio-accent: var(--primary-color, #03a9f4);
      --studio-accent-soft: color-mix(in srgb, var(--studio-accent) 14%, transparent);
      --studio-border: var(--divider-color, #d5dadd);
      --studio-surface: var(--card-background-color, #fff);
      --studio-text: var(--primary-text-color, #202124);
      --studio-muted: var(--secondary-text-color, #68727a);
      display: block; width: 100%; height: 100vh; height: 100dvh; max-height: 100vh; max-height: 100dvh; min-height: 0; color: var(--studio-text); background: var(--primary-background-color, #f5f7f8); font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif); overflow: hidden; overflow-anchor: none; contain: size layout paint;
    }
    .shell { height: 100%; max-height: 100%; min-height: 0; display: flex; flex-direction: column; overflow: hidden; overflow-anchor: none; }
    .layout { flex: 1; min-height: 0; display: grid; grid-template-columns: var(--toolbox-width) minmax(0, 1fr) var(--inspector-width); overflow: hidden; }
    .dashboard-empty { position: relative; height: 100%; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--studio-accent) 12%, transparent), transparent 42%), var(--primary-background-color, #f5f7f8); }
    .dialog-scrim { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(8, 15, 24, .62); backdrop-filter: blur(3px); }
    .dialog { width: min(560px, 100%); max-height: calc(100vh - 40px); overflow: auto; border-radius: 14px; background: var(--studio-surface); box-shadow: 0 24px 80px rgba(0,0,0,.35); }
    .dialog > header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px 12px; }
    .dialog h2 { margin: 3px 0 0; font-size: 21px; }
    .confirm-dialog { width: min(430px, 100%); }
    .confirm-dialog > p { margin: 0; padding: 4px 20px 18px; color: var(--studio-muted); font-size: 13px; line-height: 1.5; }
    .confirm-dialog .confirm-delete { color: var(--error-color, #db4437); }
    .dialog footer { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 20px; border-top: 1px solid var(--studio-border); }
    @media (max-width: 900px) { .layout { grid-template-columns: minmax(0, 1fr) !important; } }
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
				let t = await e.callWS({ type: "opendisplay_studio/bootstrap" });
				this.dashboards = t.dashboards, this.widgets = t.widgets, this.primitives = t.primitives, this.current = void 0, this.preview = void 0, this.view = "dashboards", this.clearHistory(), this.newDashboard = Et(e.language);
			} catch (e) {
				this.error = Q(e, "Could not load OpenDisplay Studio");
			} finally {
				this.loading = !1;
			}
		}
	}
	openNewDashboard() {
		this.newDashboard = Et(this.language), this.newDashboardOpen = !0;
	}
	async createDashboard() {
		if (this.hass) {
			this.saving = !0, this.error = "";
			try {
				let e = await this.hass.callWS({
					type: "opendisplay_studio/create_dashboard",
					dashboard: this.newDashboard
				});
				this.dashboards = [...this.dashboards, e.dashboard], this.current = structuredClone(e.dashboard), this.selectedItemId = "", this.dirty = !1, this.newDashboardOpen = !1, this.view = "design", this.clearHistory(), await this.composePreview(), await this.updateComplete, this.showWholeCanvas();
			} catch (e) {
				this.error = Q(e, "Could not create the dashboard");
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
				this.current = structuredClone(e.dashboard), this.dashboards = this.dashboards.map((t) => t.id === e.dashboard.id ? e.dashboard : t), this.dirty = !1;
			} catch (e) {
				this.error = Q(e, "Could not save the dashboard");
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
			this.error = Q(e, "Could not delete the dashboard");
		}
	}
	openDashboard(e) {
		if (this.current?.id === e.id) {
			this.view = "design", this.preview || this.composePreview();
			return;
		}
		this.dirty && !window.confirm("Discard unsaved dashboard changes?") || (this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.clearHistory(), this.view = "design", this.composePreview().then(() => this.showWholeCanvas()));
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
				let t = await this.hass.callWS({
					type: "opendisplay_studio/update_dashboard",
					dashboard_id: e.id,
					dashboard: e
				});
				return this.dashboards = this.dashboards.map((e) => e.id === t.dashboard.id ? t.dashboard : e), this.current?.id === t.dashboard.id && (this.current = structuredClone(t.dashboard), this.preview = void 0, this.dirty = !1), t.dashboard;
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
			this.error = "Dashboard name cannot be empty";
			return;
		}
		if (this.dashboards.find((t) => t.id === e.id)?.name === e.name) {
			this.closeAction();
			return;
		}
		await this.updateFromGallery(e, "Could not rename the dashboard") && this.closeAction();
	}
	async duplicateDashboard(e) {
		if (!this.hass || this.saving) return;
		this.saving = !0, this.error = "";
		let t = structuredClone(e);
		t.id = "", t.name = jt(e, this.dashboards, this.language), t.status = "draft", t.createdAt = "", t.updatedAt = "";
		try {
			let e = await this.hass.callWS({
				type: "opendisplay_studio/create_dashboard",
				dashboard: t
			});
			this.dashboards = [...this.dashboards, e.dashboard];
		} catch (e) {
			this.error = Q(e, "Could not duplicate the dashboard");
		} finally {
			this.saving = !1;
		}
	}
	async saveSettings() {
		if (this.dashboardDialog !== "settings" || !this.dashboardDraft || !kt(this.dashboardDraft)) return;
		let e = structuredClone(this.dashboardDraft);
		e.name = e.name.trim(), await this.updateFromGallery(e, "Could not update dashboard settings") && this.closeAction();
	}
	async confirmDeleteDashboard() {
		if (this.dashboardDialog !== "delete" || !this.dashboardDraft || !this.hass || this.saving) return;
		let e = this.dashboardDraft.id;
		this.saving = !0, this.error = "";
		try {
			await this.hass.callWS({
				type: "opendisplay_studio/delete_dashboard",
				dashboard_id: e
			}), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current?.id === e && (this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.clearHistory()), this.closeAction();
		} catch (e) {
			this.error = Q(e, "Could not delete the dashboard");
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
		this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.composePreview(), Sn);
	}
	async composePreview() {
		if (!this.hass || !this.current) return;
		this.error = "";
		let e = ++this.previewRequest;
		try {
			let t = await this.hass.callWS({
				type: "opendisplay_studio/compose_preview",
				dashboard: structuredClone(this.current)
			});
			e === this.previewRequest && (this.preview = t);
		} catch (e) {
			this.error = Q(e, "Could not render the preview");
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
			e && (o = Ct(e, t, n, r));
		} else if (i === "primitive" && (o = wt(a, t, n, r), !o)) {
			this.error = `Unsupported primitive type: ${a || "(empty)"}`;
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
		let { x: t, y: n } = Tt(this.current, this.snapEnabled);
		this.addAt(e, t, n);
	}
	dropFromCatalog(e, t, n) {
		let r = this.current, i = this.canvas?.displayPointAt(t, n);
		if (!r || !i) return;
		let a = R(r);
		this.addAt(e, L(z(i.x, r, this.snapEnabled), a.x, a.x + a.width - 1), L(z(i.y, r, this.snapEnabled), a.y, a.y + a.height - 1));
	}
	confirmDeleteItem() {
		let e = this.pendingDeleteItemId;
		e && (this.pendingDeleteItemId = "", this.mutate((t) => yt(t, e)), this.selectedItemId === e && this.selectItem(""));
	}
	renderDeleteDialog() {
		let e = this.current?.items.find((e) => e.id === this.pendingDeleteItemId);
		return e ? D`<div class="dialog-scrim" @click=${(e) => {
			e.target === e.currentTarget && (this.pendingDeleteItemId = "");
		}}><section class="dialog confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-element-title"><header><div><span class="eyebrow">Confirm removal</span><h2 id="delete-element-title">Delete ${Ut(e, this.widgets)}?</h2></div><button class="icon-button" aria-label="Close" @click=${() => {
			this.pendingDeleteItemId = "";
		}}><ha-icon icon="mdi:close"></ha-icon></button></header><p>This removes the element from the dashboard. You can restore it with Undo.</p><footer><ha-button appearance="plain" @click=${() => {
			this.pendingDeleteItemId = "";
		}}>Cancel</ha-button><ha-button appearance="filled" class="confirm-delete" @click=${this.confirmDeleteItem}>Delete element</ha-button></footer></section></div>` : k;
	}
	renderGallery() {
		return D`
      <ods-gallery
        .dashboards=${this.dashboards} .hass=${this.hass} .error=${this.error} .saving=${this.saving} .dialog=${this.dashboardDialog} .draft=${this.dashboardDraft}
        @dashboard-new=${this.openNewDashboard}
        @dashboard-open=${(e) => this.openDashboard(e.detail.dashboard)}
        @dashboard-menu-action=${(e) => e.detail.action === "duplicate" ? void this.duplicateDashboard(e.detail.dashboard) : this.openAction(e.detail.dashboard, e.detail.action)}
        @dashboard-rename-input=${(e) => {
			this.dashboardDraft &&= {
				...this.dashboardDraft,
				name: e.detail.name
			};
		}}
        @dashboard-rename-commit=${this.saveRename}
        @dashboard-rename-cancel=${this.closeAction}
        @dashboard-settings-change=${(e) => {
			this.dashboardDraft &&= Ot(this.dashboardDraft, e.detail.value);
		}}
        @dashboard-settings-save=${this.saveSettings}
        @dashboard-delete-confirm=${this.confirmDeleteDashboard}
        @dashboard-dialog-close=${this.closeAction}
      ></ods-gallery>
      ${this.newDashboardOpen ? D`
        <ods-new-dashboard-dialog
          .hass=${this.hass} .dashboard=${this.newDashboard} .saving=${this.saving}
          @new-dashboard-change=${(e) => {
			this.newDashboard = Ot(this.newDashboard, e.detail.value);
		}}
          @new-dashboard-close=${() => {
			this.newDashboardOpen = !1;
		}}
          @dashboard-create=${this.createDashboard}
        ></ods-new-dashboard-dialog>` : k}
    `;
	}
	renderDesign(e) {
		return D`
      <div
        class="layout" style=${I({
			"--toolbox-width": this.leftCollapsed ? "48px" : "255px",
			"--inspector-width": this.rightCollapsed ? "48px" : `${this.inspectorWidth}px`
		})}
        @item-select=${(e) => this.selectItem(e.detail.itemId)}
        @item-flag-toggle=${(e) => this.mutate((t) => vt(t, e.detail.itemId, e.detail.flag))}
        @item-delete-request=${(e) => {
			this.pendingDeleteItemId = e.detail.itemId;
		}}
      >
        <ods-library
          .widgets=${this.widgets} .primitives=${this.primitives} .collapsed=${this.leftCollapsed}
          @library-collapse=${(e) => {
			this.leftCollapsed = e.detail.collapsed;
		}}
          @catalog-add=${(e) => this.addFromCatalog(e.detail.value)}
          @catalog-drag=${(e) => {
			this.draggingCatalog = e.detail.active;
		}}
          @catalog-drop=${(e) => this.dropFromCatalog(e.detail.value, e.detail.clientX, e.detail.clientY)}
        ></ods-library>
        <ods-canvas
          .dashboard=${e} .preview=${this.preview} .widgets=${this.widgets} .selectedItemId=${this.selectedItemId} .snapEnabled=${this.snapEnabled}
          .acceptingDrop=${this.draggingCatalog} .undoCount=${this.undoCount} .redoCount=${this.redoCount} .viewport=${this.viewport}
          @viewport-change=${(e) => {
			this.viewport = e.detail;
		}}
          @item-transform=${(e) => this.mutate((t) => {
			let n = t.items.findIndex((t) => t.id === e.detail.item.id);
			n >= 0 && (t.items[n] = e.detail.item);
		}, !1, !1)}
          @item-transform-end=${(e) => {
			this.recordHistory(e.detail.before), this.schedulePreview();
		}}
          @snap-toggle=${() => {
			this.snapEnabled = !this.snapEnabled;
		}}
          @undo=${this.undo} @redo=${this.redo}
        ></ods-canvas>
        <ods-inspector
          .hass=${this.hass} .dashboard=${e} .widgets=${this.widgets} .preview=${this.preview} .selectedItemId=${this.selectedItemId} .collapsed=${this.rightCollapsed} .width=${this.inspectorWidth}
          @inspector-collapse=${(e) => {
			this.rightCollapsed = e.detail.collapsed;
		}}
          @inspector-resize=${(e) => {
			this.inspectorWidth = e.detail.width;
		}}
          @layers-reorder=${(e) => this.mutate((t) => bt(t, e.detail.itemId, e.detail.targetId, e.detail.edge))}
          @item-number-change=${(e) => this.mutate((t) => ft(t, this.selectedItemId, e.detail.key, e.detail.value))}
          @display-number-change=${(e) => this.mutate((t) => mt(t, e.detail.key, e.detail.value))}
          @profile-change=${(e) => {
			let t = ut(e.detail.profileId);
			this.mutate((e) => ht(e, t)), requestAnimationFrame(() => this.canvas?.fitView());
		}}
          @palette-change=${(e) => this.mutate((t) => gt(t, e.detail.palette))}
          @background-change=${(e) => this.mutate((t) => _t(t, e.detail.color))}
          @widget-config-change=${(e) => this.mutate((t) => xt(t, this.selectedItemId, e.detail.value))}
          @primitive-change=${(e) => this.mutate((t) => St(t, this.selectedItemId, e.detail.value))}
          @dashboard-delete-request=${this.deleteDashboard}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()}
    `;
	}
	render() {
		if (this.loading) return D`<div class="dashboard-empty"><p>Loading OpenDisplay Studio…</p></div>`;
		let e = this.current;
		return this.view === "dashboards" || !e ? this.renderGallery() : D`
      <div class="shell">
        <ods-header
          .dashboard=${e} .view=${this.view} .dirty=${this.dirty} .saving=${this.saving}
          @show-dashboards=${() => {
			this.view = "dashboards";
		}}
          @dashboard-name-change=${(e) => this.mutate((t) => {
			t.name = e.detail.name;
		}, !1)}
          @view-change=${(e) => this.setEditorView(e.detail.view)}
          @toggle-ready=${() => this.mutate((e) => {
			e.status = e.status === "ready" ? "draft" : "ready";
		}, !1)}
          @dashboard-save=${this.saveDashboard}
        ></ods-header>
        ${this.error ? D`<ha-alert alert-type="error">${this.error}</ha-alert>` : k}
        ${this.view === "code" ? D`<ods-code-view .preview=${this.preview}></ods-code-view>` : this.renderDesign(e)}
      </div>
    `;
	}
};
G([P({ attribute: !1 })], $.prototype, "hass", void 0), G([F()], $.prototype, "dashboards", void 0), G([F()], $.prototype, "view", void 0), G([F()], $.prototype, "widgets", void 0), G([F()], $.prototype, "primitives", void 0), G([F()], $.prototype, "current", void 0), G([F()], $.prototype, "selectedItemId", void 0), G([F()], $.prototype, "preview", void 0), G([F()], $.prototype, "loading", void 0), G([F()], $.prototype, "saving", void 0), G([F()], $.prototype, "dirty", void 0), G([F()], $.prototype, "error", void 0), G([F()], $.prototype, "draggingCatalog", void 0), G([F()], $.prototype, "undoCount", void 0), G([F()], $.prototype, "redoCount", void 0), G([F()], $.prototype, "pendingDeleteItemId", void 0), G([F()], $.prototype, "leftCollapsed", void 0), G([F()], $.prototype, "rightCollapsed", void 0), G([F()], $.prototype, "inspectorWidth", void 0), G([F()], $.prototype, "snapEnabled", void 0), G([F()], $.prototype, "viewport", void 0), G([F()], $.prototype, "newDashboardOpen", void 0), G([F()], $.prototype, "newDashboard", void 0), G([F()], $.prototype, "dashboardDialog", void 0), G([F()], $.prototype, "dashboardDraft", void 0), G([Ie("ods-canvas")], $.prototype, "canvas", void 0), $ = G([N("ods-app")], $);
//#endregion
export { $ as OdsApp };
