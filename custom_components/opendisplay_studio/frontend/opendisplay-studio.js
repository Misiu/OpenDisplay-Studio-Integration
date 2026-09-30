//#region src/preview-refresh.ts
var e = (e) => e.split(".", 1)[0] ?? "", t = (e, t) => [.../* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])].filter((n) => e[n] !== t[n]), n = (n, r, i) => {
	if (!r || !i || r === i) return !1;
	let a = t(r, i);
	return n.allStates ? a.length > 0 : a.some((t) => n.entities.includes(t) || n.domains.includes(e(t)));
}, r = globalThis, i = r.ShadowRoot && (r.ShadyCSS === void 0 || r.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, a = Symbol(), o = /* @__PURE__ */ new WeakMap(), s = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== a) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (i && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = o.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && o.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, c = (e) => new s(typeof e == "string" ? e : e + "", void 0, a), l = (e, ...t) => new s(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, a), u = (e, t) => {
	if (i) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), i = r.litNonce;
		i !== void 0 && t.setAttribute("nonce", i), t.textContent = n.cssText, e.appendChild(t);
	}
}, d = i ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return c(t);
})(e) : e, { is: f, defineProperty: p, getOwnPropertyDescriptor: m, getOwnPropertyNames: h, getOwnPropertySymbols: ee, getPrototypeOf: te } = Object, g = globalThis, _ = g.trustedTypes, ne = _ ? _.emptyScript : "", re = g.reactiveElementPolyfillSupport, v = (e, t) => e, ie = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ne : null;
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
}, ae = (e, t) => !f(e, t), oe = {
	attribute: !0,
	type: String,
	converter: ie,
	reflect: !1,
	useDefault: !1,
	hasChanged: ae
};
Symbol.metadata ??= Symbol("metadata"), g.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = oe) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && p(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = m(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? oe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(v("elementProperties"))) return;
		let e = te(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(v("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(v("properties"))) {
			let e = this.properties, t = [...h(e), ...ee(e)];
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
			for (let e of n) t.unshift(d(e));
		} else e !== void 0 && t.push(d(e));
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
		return u(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? ie : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? ie : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? ae)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[v("elementProperties")] = /* @__PURE__ */ new Map(), y[v("finalized")] = /* @__PURE__ */ new Map(), re?.({ ReactiveElement: y }), (g.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var b = globalThis, x = (e) => e, se = b.trustedTypes, ce = se ? se.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, le = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, ue = "?" + S, de = `<${ue}>`, fe = document, pe = () => fe.createComment(""), me = (e) => e === null || typeof e != "object" && typeof e != "function", he = Array.isArray, ge = (e) => he(e) || typeof e?.[Symbol.iterator] == "function", _e = "[ 	\n\f\r]", ve = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ye = /-->/g, be = />/g, C = RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), xe = /'/g, Se = /"/g, Ce = /^(?:script|style|textarea|title)$/i, w = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), T = Symbol.for("lit-noChange"), E = Symbol.for("lit-nothing"), we = /* @__PURE__ */ new WeakMap(), D = fe.createTreeWalker(fe, 129);
function Te(e, t) {
	if (!he(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return ce === void 0 ? t : ce.createHTML(t);
}
var Ee = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = ve;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === ve ? c[1] === "!--" ? o = ye : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = C) : (Ce.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = C) : o = be : o === C ? c[0] === ">" ? (o = i ?? ve, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? C : c[3] === "\"" ? Se : xe) : o === Se || o === xe ? o = C : o === ye || o === be ? o = ve : (o = C, i = void 0);
		let d = o === C && e[t + 1].startsWith("/>") ? " " : "";
		a += o === ve ? n + de : l >= 0 ? (r.push(s), n.slice(0, l) + le + n.slice(l) + S + d) : n + S + (l === -2 ? t : d);
	}
	return [Te(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, De = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ee(t, n);
		if (this.el = e.createElement(l, r), D.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = D.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(le)) {
					let t = u[o++], n = i.getAttribute(e).split(S), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Me : r[1] === "?" ? Ne : r[1] === "@" ? Pe : je
					}), i.removeAttribute(e);
				} else e.startsWith(S) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (Ce.test(i.tagName)) {
					let e = i.textContent.split(S), t = e.length - 1;
					if (t > 0) {
						i.textContent = se ? se.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], pe()), D.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], pe());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === ue) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(S, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += S.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = fe.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Oe(e, t, n = e, r) {
	if (t === T) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = me(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Oe(e, i._$AS(e, t.values), i, r)), t;
}
var ke = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? fe).importNode(t, !0);
		D.currentNode = r;
		let i = D.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Ae(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Fe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = D.nextNode(), a++);
		}
		return D.currentNode = fe, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Ae = class e {
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
		e = Oe(this, e, t), me(e) ? e === E || e == null || e === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : e !== this._$AH && e !== T && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ge(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== E && me(this._$AH) ? this._$AA.nextSibling.data = e : this.T(fe.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = De.createElement(Te(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ke(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = we.get(e.strings);
		return t === void 0 && we.set(e.strings, t = new De(e)), t;
	}
	k(t) {
		he(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(pe()), this.O(pe()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = x(e).nextSibling;
			x(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, je = class {
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
		if (i === void 0) e = Oe(this, e, t, 0), a = !me(e) || e !== this._$AH && e !== T, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Oe(this, r[n + o], t, o), s === T && (s = this._$AH[o]), a ||= !me(s) || s !== this._$AH[o], s === E ? e = E : e !== E && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Me = class extends je {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === E ? void 0 : e;
	}
}, Ne = class extends je {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== E);
	}
}, Pe = class extends je {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Oe(this, e, t, 0) ?? E) === T) return;
		let n = this._$AH, r = e === E && n !== E || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== E && (n === E || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Fe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Oe(this, e);
	}
}, Ie = b.litHtmlPolyfillSupport;
Ie?.(De, Ae), (b.litHtmlVersions ??= []).push("3.3.3");
var Le = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Ae(t.insertBefore(pe(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Re = globalThis, O = class extends y {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Le(t, this.renderRoot, this.renderOptions);
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
O._$litElement$ = !0, O.finalized = !0, Re.litElementHydrateSupport?.({ LitElement: O });
var ze = Re.litElementPolyfillSupport;
ze?.({ LitElement: O }), (Re.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var k = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Be = {
	attribute: !0,
	type: String,
	converter: ie,
	reflect: !1,
	hasChanged: ae
}, Ve = (e = Be, t, n) => {
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
	return (t, n) => typeof n == "object" ? Ve(e, t, n) : ((e, t, n) => {
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
var He = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function Ue(e, t) {
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
			return He(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return He(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/lit-html/directive.js
var We = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Ge = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ke = class {
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
}, qe = "important", Je = " !" + qe, M = Ge(class extends Ke {
	constructor(e) {
		if (super(e), e.type !== We.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(Je);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? qe : "") : n[e] = r;
			}
		}
		return T;
	}
}), Ye = "visible", Xe = (e) => typeof e == "string" && (e.includes("{{") || e.includes("{%")), Ze = "\\", Qe = (e) => `'${e.replaceAll(Ze, "\\\\").replaceAll("'", `${Ze}'`)}'`, $e = (e) => typeof e == "string" ? `{{ ${Qe(e)} }}` : typeof e == "boolean" || typeof e == "number" ? `{{ ${e} }}` : "{{ none }}", et = (e) => e.kind === "widget" ? e.widget.type : e.primitive.type, tt = (e, t) => {
	let n = new Set(e.map((e) => e.name)), r = e.filter((e) => et(e) === t).length + 1;
	for (; n.has(`${t}_${r}`);) r += 1;
	return `${t}_${r}`;
}, N = (e, t, n) => Math.max(t, Math.min(n, e)), nt = (e, t, n = 0) => n + Math.round((e - n) / t) * t, rt = [
	"nw",
	"n",
	"ne",
	"e",
	"se",
	"s",
	"sw",
	"w"
], it = (e) => e.includes("e") || e.includes("w"), at = (e) => e.includes("n") || e.includes("s"), ot = (e, t, n, r) => r ? nt(e, t, n) : Math.round(e), st = (e) => {
	if (e.startHandle) return e.originalEnd - e.areaStart;
	if (e.endHandle) return e.areaEnd - e.originalStart;
	let t = Math.min(e.originalCenter - e.areaStart, e.areaEnd - e.originalCenter);
	return Math.max(1, t * 2);
}, ct = (e, t, n, r, i) => e ? n + r - i : t ? n : n + (r - i) / 2, lt = ({ bounds: e, handle: t, deltaX: n, deltaY: r, minimumWidth: i, minimumHeight: a, area: o, preserveAspect: s, snapSize: c, snapEnabled: l }) => {
	let u = o.x + o.width, d = o.y + o.height, f = e.x, p = e.y, m = e.x + e.width, h = e.y + e.height, ee = f + e.width / 2, te = p + e.height / 2, g = f, _ = p, ne = m, re = h;
	if (t.includes("w") && (g = ot(f + n, c, o.x, l)), t.includes("e") && (ne = ot(m + n, c, o.x, l)), t.includes("n") && (_ = ot(p + r, c, o.y, l)), t.includes("s") && (re = ot(h + r, c, o.y, l)), t.includes("w") && (g = N(g, o.x, m - i)), t.includes("e") && (ne = N(ne, f + i, u)), t.includes("n") && (_ = N(_, o.y, h - a)), t.includes("s") && (re = N(re, p + a, d)), !s) return {
		x: Math.round(g),
		y: Math.round(_),
		width: Math.round(ne - g),
		height: Math.round(re - _)
	};
	let v = e.width / Math.max(1, e.height), ie = Math.max(i, ne - g), ae = Math.max(a, re - _), oe = Math.abs(ie - e.width) / Math.max(1, e.width), y = Math.abs(ae - e.height) / Math.max(1, e.height), b, x;
	it(t) && (!at(t) || oe >= y) ? (b = ie, x = b / v) : (x = ae, b = x * v);
	let se = st({
		startHandle: t.includes("w"),
		endHandle: t.includes("e"),
		originalStart: f,
		originalEnd: m,
		originalCenter: ee,
		areaStart: o.x,
		areaEnd: u
	}), ce = st({
		startHandle: t.includes("n"),
		endHandle: t.includes("s"),
		originalStart: p,
		originalEnd: h,
		originalCenter: te,
		areaStart: o.y,
		areaEnd: d
	}), le = Math.max(i / Math.max(1, e.width), a / Math.max(1, e.height)), S = Math.min(se / Math.max(1, e.width), ce / Math.max(1, e.height)), ue = N(Math.max(b / Math.max(1, e.width), x / Math.max(1, e.height)), Math.min(le, S), S);
	return b = Math.max(1, Math.round(e.width * ue)), x = Math.max(1, Math.round(e.height * ue)), g = t.includes("w") ? m - b : t.includes("e") ? f : ee - b / 2, _ = t.includes("n") ? h - x : t.includes("s") ? p : te - x / 2, g = N(Math.round(g), o.x, u - b), _ = N(Math.round(_), o.y, d - x), {
		x: g,
		y: _,
		width: b,
		height: x
	};
}, ut = (e, t, n, r) => {
	let i = ct(r.includes("w"), r.includes("e"), e.x, e.width, t), a = ct(r.includes("n"), r.includes("s"), e.y, e.height, n);
	return {
		x: Math.round(i),
		y: Math.round(a),
		width: t,
		height: n
	};
}, P = (e) => "x_start" in e, dt = (e) => {
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
}, ft = (e) => e.type === "text" || e.type === "qrcode", pt = (e, t) => {
	if (e.kind === "widget") return e.frame;
	let n = dt(e.primitive);
	return t && ft(e.primitive) ? {
		...n,
		width: t.width,
		height: t.height
	} : n;
}, mt = (e, t) => t ? Math.max(1, Math.round(t.width / e.boxsize)) : 21 + e.border * 2, F = (e) => {
	let t = e.display.padding;
	return {
		x: t,
		y: t,
		width: e.display.width - t * 2,
		height: e.display.height - t * 2
	};
}, ht = (e, t, n) => n ? nt(e, t.display.snapSize, t.display.padding) : Math.round(e), gt = (e, t, n) => {
	if (e.kind === "widget") {
		e.frame.x += t, e.frame.y += n;
		return;
	}
	let r = e.primitive;
	P(r) ? (r.x_start += t, r.x_end += t, r.y_start += n, r.y_end += n) : (r.x += t, r.y += n);
}, _t = (e, t, n) => {
	let r = F(t), i = pt(e, n);
	gt(e, N(i.x, r.x, Math.max(r.x, r.x + r.width - i.width)) - i.x, N(i.y, r.y, Math.max(r.y, r.y + r.height - i.height)) - i.y), e.kind === "widget" && (e.frame.width = Math.min(e.frame.width, r.width), e.frame.height = Math.min(e.frame.height, r.height));
}, vt = {
	width: 60,
	height: 48
}, yt = (e, t, n) => {
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
		let e = mt(r, n);
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
		let e = bt(r, 6, n);
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
}, bt = (e, t, n) => {
	if (!n) return dt({
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
}, xt = {
	n: "ne",
	e: "se",
	s: "se",
	w: "sw"
}, St = (e, t, n, r, i, a, o) => {
	let s = pt(e, o.measured), { minimumWidth: c, minimumHeight: l, intrinsicAspect: u } = yt(e, o.minSize ?? vt, o.measured), d = u ? xt[t] ?? t : t, f = lt({
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
		let e = Math.max(1, Math.floor((Math.min(f.width, f.height) - 1) / 2)), t = e * 2 + 1, n = ut(f, t, t, d);
		p.x = n.x + e, p.y = n.y + e, p.radius = e;
		return;
	}
	if (p.type === "qrcode") {
		let e = mt(p, o.measured);
		p.boxsize = N(Math.floor(Math.min(f.width, f.height) / e), 1, 16);
		let t = e * p.boxsize, n = ut(f, t, t, d);
		p.x = n.x, p.y = n.y;
		return;
	}
	if (p.type === "icon") {
		p.size = N(Math.floor(Math.min(f.width, f.height)), 8, 256);
		let e = ut(f, p.size, p.size, d);
		p.x = e.x, p.y = e.y;
		return;
	}
	let m = p.size;
	p.size = N(Math.round(m * f.width / Math.max(1, s.width)), 6, 256);
	let h = o.measured ? bt({
		...p,
		size: m
	}, p.size, o.measured) : dt(p), ee = ut(f, h.width, h.height, d);
	p.x = ee.x, p.y = ee.y;
}, Ct = (e, t, n, r, i, a) => {
	let o = structuredClone(e);
	if (o.locked) return o;
	if (t.mode === "resize") return St(o, t.handle, n, r, t.shiftKey, i, a), o;
	let s = F(i), c = pt(o, a.measured), l = N(ht(c.x + n, i, a.snapEnabled), s.x, Math.max(s.x, s.x + s.width - c.width)), u = N(ht(c.y + r, i, a.snapEnabled), s.y, Math.max(s.y, s.y + s.height - c.height));
	return gt(o, l - c.x, u - c.y), o;
}, wt = () => Math.floor(Math.random() * 256), Tt = () => {
	let e = globalThis.crypto;
	if (typeof e?.randomUUID == "function") return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	typeof e?.getRandomValues == "function" ? e.getRandomValues(t) : t.forEach((e, n) => {
		t[n] = wt();
	}), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0"));
	return `${n.slice(0, 4).join("")}-${n.slice(4, 6).join("")}-${n.slice(6, 8).join("")}-${n.slice(8, 10).join("")}-${n.slice(10).join("")}`;
}, Et = (e, t) => `${e} × ${t}`, I = {
	common: {
		cancel: "Cancel",
		close: "Close",
		size: Et,
		sizeInPixels: (e, t) => `${Et(e, t)} px`,
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
}, L = I.palettes, Dt = {
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
}, R = (e, t, n, r, i = !1) => ({
	id: `solum-${e}`,
	manufacturer: "SOLUM",
	name: `Newton Pro ${t}`,
	width: n,
	height: r,
	palettes: i ? ["bw"] : ["bw", "bwry"],
	defaultPalette: i ? "bw" : "bwry"
}), Ot = [
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
	R("1-6-v", "1.6″ V", 200, 200),
	R("1-6-h", "1.6″ H", 200, 200),
	R("2-2", "2.2″", 296, 160),
	R("2-2-freezer", "2.2″ Freezer", 296, 160, !0),
	R("2-6", "2.6″", 360, 184),
	R("2-6-freezer", "2.6″ Freezer", 360, 184, !0),
	R("2-7", "2.7″", 300, 200),
	R("2-9", "2.9″", 384, 168),
	R("2-9-freezer", "2.9″ Freezer", 384, 168, !0),
	R("3-45", "3.5″ · 3.45 panel", 480, 224),
	R("3-52", "3.5″ · 3.52 panel", 384, 180),
	R("4-2", "4.2″", 400, 300),
	R("4-3", "4.3″", 522, 152),
	R("4-5", "4.5″", 480, 176),
	R("5-8", "5.8″", 792, 272),
	R("6-1", "6.1″", 648, 480),
	R("7-5", "7.5″", 800, 480),
	R("9-7", "9.7″", 672, 960),
	R("11-6", "11.6″", 640, 960),
	R("12-2", "12.2″", 768, 960),
	{
		id: "custom",
		...I.customDisplay,
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
], kt = (e) => Ot.find((t) => t.id === e) ?? Ot[0], At = (e) => e in L, jt = (e, t, n) => e === "display_width" ? t.width : e === "display_height" ? t.height : e === "display_shorter_side" ? Math.min(t.width, t.height) : e ?? n, Mt = (e, t) => e.default === void 0 ? e.nullable ? null : 0 : e.shape !== "number" || typeof e.default != "number" ? e.default : N(e.default, jt(e.min, t, -Infinity), jt(e.max, t, Infinity)), Nt = (e, t, n) => {
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
}, Pt = (e, t) => {
	if (!e) return;
	let n = {
		width: t.displayWidth,
		height: t.displayHeight
	}, r = { type: e.type };
	for (let t of e.fields) r[t.key] = Mt(t, n);
	return Nt(e, r, t), r;
}, Ft = {
	grid: [],
	extra: []
}, It = "transparent", z = (e, t) => t.find((t) => t.type === e.primitive.type), B = (e, t, n, r, i, a = !1) => ({
	label: e,
	key: t,
	value: n,
	min: r,
	max: i,
	stored: a
}), Lt = (e, t) => {
	let { width: n, height: r } = t.display, i = I.fields;
	return {
		grid: [
			B(i.x, "x", e.frame.x, 0, n),
			B(i.y, "y", e.frame.y, 0, r),
			B(i.width, "width", e.frame.width, 1, n),
			B(i.height, "height", e.frame.height, 1, r)
		],
		extra: [B(i.innerPadding, "padding", e.layout.padding, 0, 128)]
	};
}, Rt = (e, t) => {
	let n = e.primitive;
	if (!P(n)) return Ft;
	let { width: r, height: i } = t.display, a = I.fields, o = dt(n);
	return {
		grid: [
			B(a.x, "x", o.x, 0, r),
			B(a.y, "y", o.y, 0, i),
			B(a.width, "width", o.width, 1, r),
			B(a.height, "height", o.height, 1, i)
		],
		extra: []
	};
}, zt = (e, t, n) => {
	let r = n.display, i = e.axis === "x" ? r.width : r.height, a = e.shape === "coordinate";
	return B(e.label, e.key, Number(t[e.key]), a ? 0 : jt(e.min, r, 0), a ? i : jt(e.max, r, i), !0);
}, Bt = (e, t, n) => {
	let r = { ...e.primitive };
	return {
		grid: t.fields.filter((e) => e.section === "layout").map((e) => zt(e, r, n)),
		extra: []
	};
}, Vt = (e, t) => e.kind === "primitive" && z(e, t)?.geometry !== "point", Ht = (e, t, n, r = !1) => {
	if (e.kind === "widget") return Lt(e, t);
	let i = z(e, n);
	return i ? i.geometry === "point" || r ? Bt(e, i, t) : Rt(e, t) : Ft;
}, Ut = (e, t) => {
	switch (e.shape) {
		case "boolean": return { boolean: {} };
		case "enum": return { select: { options: e.options ?? [] } };
		case "color": return { select: { options: e.nullable ? [It, ...t] : t } };
		case "number": return { number: {
			min: typeof e.min == "number" ? e.min : void 0,
			max: typeof e.max == "number" ? e.max : void 0
		} };
		default: return { text: {} };
	}
}, Wt = (e) => e.section === "appearance" && e.visible !== !1, Gt = (e, t, n) => {
	let r = z(e, n);
	if (!r) return [];
	let i = [...Dt[t], "accent"];
	return r.fields.filter(Wt).map((e) => ({
		name: e.key,
		label: e.label,
		selector: Ut(e, i)
	}));
}, Kt = (e, t) => {
	let n = { ...e.primitive }, r = z(e, t);
	for (let e of r?.fields ?? []) e.nullable && n[e.key] === null && (n[e.key] = It);
	return n;
}, qt = (e, t) => {
	let n = { ...e };
	for (let e of t?.fields ?? []) e.nullable && n[e.key] === It && (n[e.key] = null);
	return n;
}, Jt = (e, t, n, r, i, a) => {
	let o = e.primitive;
	if (P(o)) return;
	let s = pt(e);
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
		let e = jt(c.min, i, n), r = jt(c.max, i, n);
		Object.assign(o, { [t]: N(n, e, r) });
	}
}, Yt = (e, t, n, r, i) => {
	let a = e.items.find((e) => e.id === t);
	if (!a || a.locked) return;
	let o = F(e);
	if (a.kind === "widget") {
		n === "padding" && (a.layout.padding = N(r, 0, 128)), n === "x" && (a.frame.x = N(r, o.x, o.x + o.width - a.frame.width)), n === "y" && (a.frame.y = N(r, o.y, o.y + o.height - a.frame.height)), n === "width" && (a.frame.width = N(r, 1, o.x + o.width - a.frame.x)), n === "height" && (a.frame.height = N(r, 1, o.y + o.height - a.frame.y));
		return;
	}
	let s = a.primitive, c = z(a, i);
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
	} else Jt(a, n, r, o, e.display, c);
}, Xt = (e) => e.items.forEach((t) => _t(t, e)), Zt = (e, t, n) => {
	(t === "width" || t === "height") && (e.display[t] = N(n, 64, 4096)), t === "padding" && (e.display.padding = N(n, 0, Math.floor((Math.min(e.display.width, e.display.height) - 1) / 2))), t === "snapSize" && (e.display.snapSize = N(n, 1, 256)), Xt(e);
}, Qt = (e, t) => {
	e.display.profileId = t.id, e.display.width = t.width, e.display.height = t.height, e.display.palette = t.defaultPalette, Xt(e);
}, $t = (e, t) => {
	e.display.palette = t, Dt[t].includes(e.display.background) || (e.display.background = "white");
}, en = (e, t) => {
	e.display.background = t;
}, tn = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r && (r[n] = !r[n]);
}, nn = (e, t) => {
	e.items = e.items.filter((e) => e.id !== t);
}, rn = (e, t, n, r) => {
	let i = [...e.items].reverse(), a = i.findIndex((e) => e.id === t);
	if (a < 0) return;
	let [o] = i.splice(a, 1), s = i.findIndex((e) => e.id === n);
	s < 0 || (i.splice(r === "before" ? s : s + 1, 0, o), e.items = i.reverse());
}, an = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r?.kind === "widget" && (r.widget.config = n);
}, on = (e, t, n, r) => {
	let i = e.items.find((e) => e.id === t);
	if (i?.kind !== "primitive") return;
	let a = qt(n, z(i, r));
	i.primitive = {
		...i.primitive,
		...a
	};
}, sn = (e, t, n, r) => {
	let i = F(r), a = Math.min(e.layout.defaultSize?.width ?? 240, i.width), o = Math.min(e.layout.defaultSize?.height ?? 144, i.height);
	return {
		id: Tt(),
		name: tt(r.items, e.id),
		kind: "widget",
		locked: !1,
		hidden: !1,
		widget: {
			type: e.id,
			version: e.version,
			config: structuredClone(e.defaults)
		},
		frame: {
			x: N(Math.round(t - a / 2), i.x, i.x + i.width - a),
			y: N(Math.round(n - o / 2), i.y, i.y + i.height - o),
			width: a,
			height: o
		},
		layout: { padding: 0 }
	};
}, cn = (e, t, n, r, i) => {
	let { width: a, height: o } = i.display, s = Pt(e.find((e) => e.type === t.trim()), {
		x: Math.round(a / 2),
		y: Math.round(o / 2),
		displayWidth: a,
		displayHeight: o
	});
	if (!s) return;
	let c = {
		id: Tt(),
		name: tt(i.items, s.type),
		kind: "primitive",
		locked: !1,
		hidden: !1,
		primitive: s
	}, l = pt(c);
	return gt(c, Math.round(n - (l.x + l.width / 2)), Math.round(r - (l.y + l.height / 2))), _t(c, i), c;
}, ln = (e, t) => {
	let n = F(e), r = e.items.length * Math.max(e.display.snapSize, 5) * 3 % Math.max(1, Math.min(n.width, n.height) / 3);
	return {
		x: ht(n.x + Math.min(24 + r, Math.max(0, n.width - 1)), e, t),
		y: ht(n.y + Math.min(24 + r, Math.max(0, n.height - 1)), e, t)
	};
}, un = (e, t) => {
	if (t === "visible") return !e.hidden;
	if (e.kind === "primitive") return Object.entries(e.primitive).find(([e]) => e === t)?.[1];
}, dn = (e, t, n, r) => {
	let i = e.items.find((e) => e.id === t);
	if (!i || i.locked) return;
	let a = { ...i.expressions };
	r === null ? delete a[n] : a[n] = r ?? $e(un(i, n)), Object.keys(a).length === 0 ? delete i.expressions : i.expressions = a;
}, fn = (e) => ({
	canUndo: !1,
	canRedo: !1,
	item: e
}), pn = (e) => e.item !== void 0, mn = [
	{
		id: "undo",
		label: () => I.commands.undo,
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
		label: () => I.commands.redo,
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
		label: () => I.commands.delete,
		icon: () => "mdi:delete-outline",
		shortcuts: [{ key: "Delete" }, { key: "Backspace" }],
		isEnabled: pn,
		run: ({ item: e }, t) => {
			e && t.requestDelete(e.id);
		}
	},
	{
		id: "toggle-hidden",
		label: ({ item: e }) => e?.hidden ? I.commands.show : I.commands.hide,
		icon: ({ item: e }) => e?.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline",
		shortcuts: [],
		isEnabled: pn,
		run: ({ item: e }, t) => {
			e && t.toggleFlag(e.id, "hidden");
		}
	},
	{
		id: "toggle-locked",
		label: ({ item: e }) => e?.locked ? I.commands.unlock : I.commands.lock,
		icon: ({ item: e }) => e?.locked ? "mdi:lock" : "mdi:lock-open-variant-outline",
		shortcuts: [],
		isEnabled: pn,
		run: ({ item: e }, t) => {
			e && t.toggleFlag(e.id, "locked");
		}
	}
], hn = (e) => {
	let t = mn.find((t) => t.id === e);
	if (!t) throw Error(`Unknown command ${e}`);
	return t;
}, gn = (e, t) => {
	let n = t.ctrlKey || t.metaKey;
	return t.key.toLowerCase() === e.key.toLowerCase() && n === !!e.mod && t.shiftKey === !!e.shift && !t.altKey;
}, _n = (e) => mn.find((t) => t.shortcuts.some((t) => gn(t, e))), vn = {
	Delete: "Del",
	Backspace: "⌫"
}, yn = (e, t) => {
	let n = vn[e.key] ?? e.key.toUpperCase();
	return t ? `${e.mod ? "⌘" : ""}${e.shift ? "⇧" : ""}${n}` : [
		e.mod ? "Ctrl" : "",
		e.shift ? "Shift" : "",
		n
	].filter(Boolean).join("+");
}, bn = (e, t, n = !1) => {
	let r = e.label(t), [i] = e.shortcuts;
	return {
		label: r,
		icon: e.icon(t),
		title: i ? `${r} (${yn(i, n)})` : r,
		enabled: e.isEnabled(t)
	};
}, xn = (e, t = "custom") => {
	let n = kt(t);
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
}, Sn = (e) => ({
	name: e.name,
	width: e.display.width,
	height: e.display.height,
	palette: e.display.palette,
	padding: e.display.padding,
	snapSize: e.display.snapSize
}), Cn = (e, t) => {
	let n = {
		...Sn(e),
		...t
	}, r = structuredClone(e);
	return r.name = String(n.name), r.display.profileId = "custom", r.display.width = Math.round(Number(n.width) || 0), r.display.height = Math.round(Number(n.height) || 0), r.display.palette = n.palette in L ? n.palette : "bw", r.display.padding = Math.round(Number(n.padding) || 0), r.display.snapSize = Math.round(Number(n.snapSize) || 0), Dt[r.display.palette].includes(r.display.background) || (r.display.background = "white"), r;
}, wn = (e) => {
	let { width: t, height: n, padding: r, snapSize: i } = e.display;
	return !!e.name.trim() && t >= 64 && t <= 4096 && n >= 64 && n <= 4096 && r >= 0 && r * 2 < Math.min(t, n) && i >= 1 && i <= 256;
}, Tn = (e, t, n, r) => {
	let i = t.trim().toLocaleLowerCase(r);
	return e.filter((e) => !i || e.name.toLocaleLowerCase(r).includes(i)).sort((e, t) => n === "name" ? e.name.localeCompare(t.name, r) : t.updatedAt.localeCompare(e.updatedAt) || e.name.localeCompare(t.name, r));
}, En = (e, t, n) => {
	let r = new Set(t.map((e) => e.name.toLocaleLowerCase(n))), i = `${e.name} copy`, a = i, o = 2;
	for (; r.has(a.toLocaleLowerCase(n));) a = `${i} ${o++}`;
	return a;
}, Dn = () => [
	{
		name: "name",
		label: I.fields.name,
		required: !0,
		selector: { text: {} }
	},
	{
		name: "dimensions",
		type: "grid",
		flatten: !0,
		schema: [{
			name: "width",
			label: I.fields.width,
			required: !0,
			selector: { number: {
				mode: "box",
				min: 64,
				max: 4096,
				unit_of_measurement: "px"
			} }
		}, {
			name: "height",
			label: I.fields.height,
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
		label: I.fields.palette,
		required: !0,
		selector: { select: {
			mode: "dropdown",
			options: Object.entries(L).map(([e, t]) => ({
				value: e,
				label: t
			}))
		} }
	},
	{
		name: "advanced",
		type: "expandable",
		flatten: !0,
		title: I.fields.advanced,
		expanded: !1,
		schema: [{
			name: "padding",
			label: I.fields.padding,
			selector: { number: {
				mode: "box",
				min: 0,
				max: 1024,
				unit_of_measurement: "px"
			} }
		}, {
			name: "snapSize",
			label: I.fields.snapSize,
			selector: { number: {
				mode: "box",
				min: 1,
				max: 256,
				unit_of_measurement: "px"
			} }
		}]
	}
], On = (e) => "label" in e ? e.label : e.title ?? "", kn = {
	bwr: "#d32f2f",
	bwry: "#d32f2f",
	bwy: "#d6a800",
	spectra6: "#246bfd"
}, An = (e) => kn[e] ?? "#202124", jn = (e, t) => {
	let n = new Date(e.updatedAt);
	return Number.isNaN(n.getTime()) ? "" : new Intl.DateTimeFormat(t, { dateStyle: "medium" }).format(n);
}, V = (e) => e.target.value, Mn = (e) => e.composedPath().some((e) => e instanceof HTMLElement && (e.matches("input, textarea, select") || e.isContentEditable)), Nn = () => /Mac|iPhone|iPad/.test(navigator.platform), H = (e, t, ...n) => {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n[0],
		bubbles: !0,
		composed: !0
	}));
}, Pn = 100, Fn = class {
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
		this.undoStack.push(structuredClone(e)), this.undoStack.length > Pn && this.undoStack.shift(), this.redoStack = [];
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
}, In = (e) => e.callWS({ type: "opendisplay_studio/bootstrap" }), Ln = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/create_dashboard",
	dashboard: t
})).dashboard, Rn = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/update_dashboard",
	dashboard_id: t.id,
	dashboard: t
})).dashboard, zn = async (e, t) => {
	await e.callWS({
		type: "opendisplay_studio/delete_dashboard",
		dashboard_id: t
	});
}, Bn = (e, t) => e.callWS({
	type: "opendisplay_studio/compose_preview",
	dashboard: structuredClone(t)
}), U = l`
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
`, W = l`
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
`, Vn = l`
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
`, Hn = .25, Un = 96, Wn = 3, Gn = .1, Kn = {
	zoom: 1,
	panX: 0,
	panY: 0
}, qn = (e, t) => ({
	...e,
	zoom: N(t, Hn, 4)
}), Jn = (e, t) => {
	let n = Math.max(100, e.width - Un), r = Math.max(100, e.height - Un);
	return {
		zoom: N(Math.min(n / t.width, r / t.height), Hn, Wn),
		panX: 0,
		panY: 0
	};
}, Yn = (e, t) => t.shiftKey ? qn(e, e.zoom + (t.deltaY < 0 ? Gn : -.1)) : t.altKey ? {
	...e,
	panX: e.panX - t.deltaY
} : {
	...e,
	panY: e.panY - t.deltaY
}, Xn = Ge(class extends Ke {
	constructor(e) {
		if (super(e), e.type !== We.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
}), Zn = (e) => {
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
}, Qn = {
	position: [],
	handles: []
}, $n = (e, t, n) => {
	let r = e.primitive;
	if (!P(r)) return t;
	let i = t === "x" ? r.x_start > r.x_end : r.y_start > r.y_end;
	return `${t}_${(n === "start" ? !i : i) ? "start" : "end"}`;
}, er = (e, t) => [
	...t.includes("w") ? [$n(e, "x", "start")] : [],
	...t.includes("e") ? [$n(e, "x", "end")] : [],
	...t.includes("n") ? [$n(e, "y", "start")] : [],
	...t.includes("s") ? [$n(e, "y", "end")] : []
], tr = (e, t) => {
	let n = new Set(Object.keys(e.expressions ?? {}));
	n.delete(Ye);
	let r = t.fields.filter((e) => e.section === "layout" && n.has(e.key)), i = r.filter((e) => e.shape === "coordinate").map((e) => e.key);
	return t.geometry === "point" ? {
		position: i,
		handles: r.some((e) => e.shape !== "coordinate") ? [...rt] : []
	} : {
		position: i,
		handles: rt.filter((t) => er(e, t).some((e) => n.has(e)))
	};
}, nr = (e, t) => {
	if (e.kind !== "primitive") return Qn;
	let n = z(e, t);
	return n ? tr(e, n) : Qn;
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
var rr = [
	.5,
	1,
	2,
	3
], ir = .25, ar = class extends O {
	constructor(...e) {
		super(...e), this.zoom = 1;
	}
	static {
		this.styles = [U, l`
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
		H(this, "zoom-change", { zoom: e });
	}
	render() {
		return w`
      <div class="zoom-controls">
        <button
          aria-label=${I.zoom.out}
          @click=${() => this.zoomTo(this.zoom - ir)}
        >
          −
        </button>
        ${rr.map((e) => w`
            <button
              class=${this.zoom === e ? "active" : ""}
              aria-label=${I.zoom.preset(e)}
              @click=${() => this.zoomTo(e)}
            >
              ${I.zoom.preset(e)}
            </button>
          `)}
        <button
          aria-label=${I.zoom.in}
          @click=${() => this.zoomTo(this.zoom + ir)}
        >
          +
        </button>
        <button
          aria-label=${I.zoom.reset}
          @click=${() => H(this, "zoom-reset")}
        >
          ${I.zoom.reset}
        </button>
        <button
          aria-label=${I.zoom.fit}
          @click=${() => H(this, "zoom-fit")}
        >
          ${I.zoom.fit}
        </button>
      </div>
    `;
	}
};
G([A({ type: Number })], ar.prototype, "zoom", void 0), ar = G([k("ods-zoom-bar")], ar);
//#endregion
//#region src/ods-canvas.ts
var or = 3, sr = (e, t) => ({
	left: `${e.x / t.width * 100}%`,
	top: `${e.y / t.height * 100}%`,
	width: `${e.width / t.width * 100}%`,
	height: `${e.height / t.height * 100}%`
}), K = class extends O {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.snapEnabled = !0, this.acceptingDrop = !1, this.canUndo = !1, this.canRedo = !1, this.viewport = Kn;
	}
	static {
		this.styles = [U, l`
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
		H(this, "viewport-change", e);
	}
	resetView() {
		this.setViewport(Kn);
	}
	fitView() {
		let e = this.stage;
		e && this.setViewport(Jn({
			width: e.clientWidth,
			height: e.clientHeight
		}, this.dashboard.display));
	}
	onWheel(e) {
		e.preventDefault(), this.setViewport(Yn(this.viewport, e));
	}
	beginGesture(e, t, n) {
		if (e.stopPropagation(), e.preventDefault(), H(this, "item-select", { itemId: t.id }), t.locked) return;
		let r = nr(t, this.primitives);
		if (n ? r.handles.includes(n) : r.position.length > 0) return;
		this.stopGesture?.();
		let i = structuredClone(this.dashboard), a = structuredClone(t), o = this.measuredBounds(t), s = t.kind === "widget" ? this.widgets.find((e) => e.id === t.widget.type)?.layout.minSize : void 0;
		this.stopGesture = Zn({
			origin: e,
			threshold: or,
			onMove: (t) => {
				let r = this.canvas;
				if (!r) return;
				let i = r.getBoundingClientRect(), { width: c, height: l } = this.dashboard.display, u = Math.round((t.clientX - e.clientX) / i.width * c), d = Math.round((t.clientY - e.clientY) / i.height * l), f = n ? {
					mode: "resize",
					handle: n,
					shiftKey: t.shiftKey
				} : { mode: "move" };
				H(this, "item-transform", { item: Ct(a, f, u, d, this.dashboard, {
					snapEnabled: this.snapEnabled,
					minSize: s,
					measured: o
				}) });
			},
			onEnd: (e, t) => {
				t && H(this, "item-transform-end", { before: i });
			}
		});
	}
	runCommand(e) {
		H(this, "command", { id: e });
	}
	toggleSnap() {
		H(this, "snap-toggle");
	}
	deselect() {
		H(this, "item-select", { itemId: "" });
	}
	onStageDragOver(e) {
		this.acceptingDrop && e.preventDefault();
	}
	onStageDrop(e) {
		e.preventDefault();
	}
	onZoomChange(e) {
		e.stopPropagation(), this.setViewport(qn(this.viewport, e.detail.zoom));
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
	resizeHandleLabel(e, t) {
		return I.canvas.resizeHandle(e.name, I.canvas.sides[t]);
	}
	renderBadges(e) {
		return w`
      ${e.hidden ? w`
              <span class="hidden-label">${I.canvas.hidden}</span>
            ` : E}
      ${e.locked ? w`
              <ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>
            ` : this.renderExpressionLock(e)}
    `;
	}
	renderExpressionLock(e) {
		let { position: t } = nr(e, this.primitives);
		if (t.length === 0) return E;
		let n = I.expression.positionLocked(t.join(", "));
		return w`
      <ha-icon
        class="lock-badge expression-lock"
        icon="mdi:function-variant"
        title=${n}
        aria-label=${n}
      ></ha-icon>
    `;
	}
	renderSelectionSize(e) {
		let t = Math.round(e.width), n = Math.round(e.height);
		return w`
      <output class="selection-size" aria-live="off">
        ${I.common.size(t, n)}
      </output>
    `;
	}
	renderHandles(e) {
		let t = nr(e, this.primitives).handles;
		return rt.filter((e) => !t.includes(e)).map((t) => w`
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
		let t = pt(e, this.measuredBounds(e)), n = e.id === this.selectedItemId, r = Xn({
			selection: !0,
			selected: n,
			locked: e.locked,
			hidden: e.hidden
		});
		return w`
      <div
        data-item-id=${e.id}
        class=${r}
        style=${M(sr(t, this.dashboard.display))}
        @pointerdown=${(t) => this.beginGesture(t, e)}
      >
        ${this.renderBadges(e)}
        ${n ? this.renderSelectionSize(t) : E}
        ${n && !e.locked ? this.renderHandles(e) : E}
      </div>
    `;
	}
	renderHistoryButton(e) {
		let t = bn(hn(e), {
			canUndo: this.canUndo,
			canRedo: this.canRedo
		}, Nn());
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
		let e = this.dashboard, { width: t, height: n, padding: r, snapSize: i } = e.display, a = Xn({
			"tool-toggle": !0,
			active: this.snapEnabled
		});
		return w`
      <div class="workspace-meta">
        <span>${I.common.sizeInPixels(t, n)}</span>
        <span>${I.canvas.layers(e.items.length)}</span>
        <span>${I.canvas.padding(r)}</span>
        <div class="history-controls">
          ${this.renderHistoryButton("undo")}
          ${this.renderHistoryButton("redo")}
        </div>
        <button
          class=${a}
          aria-pressed=${this.snapEnabled}
          @click=${this.toggleSnap}
        >
          <ha-icon icon="mdi:magnet"></ha-icon>
          <span>${I.canvas.snap(i)}</span>
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
        alt=${I.canvas.previewAlt}
      />
    ` : w`
        <div class="canvas-placeholder">${I.canvas.rendering}</div>
      `;
	}
	renderStage() {
		let e = this.dashboard, { width: t, height: n, snapSize: r } = e.display, { zoom: i, panX: a, panY: o } = this.viewport, s = M({ transform: `translate(${a}px, ${o}px) scale(${i})` }), c = M({
			width: `${t}px`,
			height: `${n}px`
		}), l = M({
			...sr(F(e), e.display),
			"--snap-size": `${r * i}px`
		});
		return w`
      <section
        class=${Xn({
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
G([A({ attribute: !1 })], K.prototype, "dashboard", void 0), G([A({ attribute: !1 })], K.prototype, "preview", void 0), G([A({ attribute: !1 })], K.prototype, "widgets", void 0), G([A({ attribute: !1 })], K.prototype, "primitives", void 0), G([A()], K.prototype, "selectedItemId", void 0), G([A({ type: Boolean })], K.prototype, "snapEnabled", void 0), G([A({ type: Boolean })], K.prototype, "acceptingDrop", void 0), G([A({ type: Boolean })], K.prototype, "canUndo", void 0), G([A({ type: Boolean })], K.prototype, "canRedo", void 0), G([A({ attribute: !1 })], K.prototype, "viewport", void 0), G([Ue(".canvas")], K.prototype, "canvas", void 0), G([Ue(".canvas-stage")], K.prototype, "stage", void 0), K = G([k("ods-canvas")], K);
//#endregion
//#region src/ods-code-view.ts
var cr = {
	idle: "mdi:content-copy",
	copied: "mdi:check",
	failed: "mdi:alert-circle-outline"
}, lr = 2200, ur = class extends O {
	constructor(...e) {
		super(...e), this.copyState = "idle";
	}
	static {
		this.styles = [
			U,
			W,
			l`
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
			}, lr);
		}
	}
	render() {
		return w`
      <main class="code-workspace">
        <section class="code-panel" aria-labelledby="generated-code-title">
          <header>
            <div>
              <span class="eyebrow">${I.code.eyebrow}</span>
              <h1 id="generated-code-title">${I.code.title}</h1>
              <p>${I.code.description}</p>
            </div>
            <ha-button
              appearance="plain"
              aria-label=${I.code.copyLabel}
              .disabled=${!this.preview?.yaml}
              @click=${this.copy}
            >
              <ha-icon
                slot="start"
                .icon=${cr[this.copyState]}
              ></ha-icon>
              ${I.code.copy[this.copyState]}
            </ha-button>
          </header>
          ${this.preview?.warnings.map((e) => w`
                <ha-alert alert-type="warning">${e}</ha-alert>
              `) ?? E}
          <textarea
            aria-label=${I.code.yaml}
            readonly
            spellcheck="false"
            dir="ltr"
            .value=${this.preview?.yaml ?? ""}
          ></textarea>
          <output class="copy-status" aria-live="polite">
            ${I.code.status[this.copyState]}
          </output>
        </section>
      </main>
    `;
	}
};
G([A({ attribute: !1 })], ur.prototype, "preview", void 0), G([j()], ur.prototype, "copyState", void 0), ur = G([k("ods-code-view")], ur);
//#endregion
//#region src/ods-confirm-dialog.ts
var dr = class extends O {
	constructor(...e) {
		super(...e), this.eyebrow = "", this.heading = "", this.body = "", this.confirmLabel = "";
	}
	static {
		this.styles = [
			U,
			W,
			l`
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
		H(this, "confirm-cancel");
	}
	accept() {
		H(this, "confirm-accept");
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
              aria-label=${I.common.close}
              @click=${this.cancel}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <p>${this.body}</p>
          <footer>
            <ha-button appearance="plain" @click=${this.cancel}>
              ${I.common.cancel}
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
G([A()], dr.prototype, "eyebrow", void 0), G([A()], dr.prototype, "heading", void 0), G([A()], dr.prototype, "body", void 0), G([A()], dr.prototype, "confirmLabel", void 0), dr = G([k("ods-confirm-dialog")], dr);
//#endregion
//#region src/ods-context-menu.ts
var fr = class extends O {
	constructor(...e) {
		super(...e), this.entries = [], this.label = "";
	}
	static {
		this.styles = [U, l`
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
			t.stopPropagation(), H(this, "menu-select", { id: e.id });
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
G([A({ attribute: !1 })], fr.prototype, "entries", void 0), G([A()], fr.prototype, "label", void 0), fr = G([k("ods-context-menu")], fr);
//#endregion
//#region src/ods-dashboard-card.ts
var pr = [
	{
		id: "rename",
		label: I.gallery.menu.rename,
		icon: "mdi:pencil-outline"
	},
	{
		id: "duplicate",
		label: I.gallery.menu.duplicate,
		icon: "mdi:content-copy"
	},
	{
		id: "settings",
		label: I.gallery.menu.settings,
		icon: "mdi:monitor-cog"
	},
	{
		id: "delete",
		label: I.gallery.menu.delete,
		icon: "mdi:delete-outline",
		danger: !0
	}
], q = class extends O {
	constructor(...e) {
		super(...e), this.language = "en", this.menuOpen = !1, this.renaming = !1, this.draftName = "";
	}
	static {
		this.styles = [
			U,
			W,
			Vn,
			l`
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
		H(this, "dashboard-open", { dashboard: this.dashboard });
	}
	toggleMenu(e) {
		e.stopPropagation(), H(this, "dashboard-menu-toggle", { dashboardId: this.dashboard.id });
	}
	onMenuSelect(e) {
		let t = pr.find((t) => t.id === e.detail.id);
		t && (e.stopPropagation(), H(this, "dashboard-menu-action", {
			dashboard: this.dashboard,
			action: t.id
		}));
	}
	onRenameInput(e) {
		H(this, "dashboard-rename-input", { name: V(e) });
	}
	onRenameKeyDown(e) {
		e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), H(this, "dashboard-rename-commit")) : e.key === "Escape" && (e.preventDefault(), H(this, "dashboard-rename-cancel"));
	}
	commitRename() {
		H(this, "dashboard-rename-commit");
	}
	renderMiniature() {
		let { display: e } = this.dashboard;
		return w`
      <div class="dashboard-card-preview">
        <div class="dashboard-miniature" style=${M({
			aspectRatio: `${e.width} / ${e.height}`,
			background: e.background,
			"--dashboard-accent": An(e.palette)
		})}>
          <span class="miniature-title"></span>
          <span class="miniature-accent"></span>
          <span class="miniature-line long"></span>
          <span class="miniature-line"></span>
        </div>
        <span class="dashboard-resolution">
          ${I.common.size(e.width, e.height)}
        </span>
      </div>
    `;
	}
	renderTitle() {
		let { name: e, status: t } = this.dashboard;
		return w`
      <span class="dashboard-card-title">
        ${this.renaming ? w`
                <input
                  class="dashboard-rename-input"
                  aria-label=${I.gallery.renameField(e)}
                  .value=${this.draftName}
                  @input=${this.onRenameInput}
                  @keydown=${this.onRenameKeyDown}
                  @blur=${this.commitRename}
                />
              ` : w`
                <strong>${e}</strong>
              `}
        <span class=${`status ${t}`}>${t}</span>
      </span>
    `;
	}
	renderMeta() {
		let { display: e } = this.dashboard;
		return w`
      <span class="dashboard-card-meta">
        <span>${I.common.size(e.width, e.height)}</span>
        <span
          class="palette-dots"
          aria-label=${L[e.palette]}
        >
          ${Dt[e.palette].map((e) => w`
              <i style=${M({ background: e })}></i>
            `)}
        </span>
        <span>${L[e.palette]}</span>
      </span>
    `;
	}
	renderMenu() {
		return this.menuOpen ? w`
      <ods-context-menu
        class="dashboard-menu"
        id=${this.menuId}
        label=${I.gallery.menuFor(this.dashboard.name)}
        .entries=${pr}
        @menu-select=${this.onMenuSelect}
      ></ods-context-menu>
    ` : E;
	}
	render() {
		let e = this.dashboard;
		return w`
      <article class=${Xn({
			"dashboard-card": !0,
			"menu-open": this.menuOpen
		})} data-dashboard-id=${e.id}>
        ${this.renderMiniature()}
        <div class="dashboard-card-copy">
          ${this.renderTitle()} ${this.renderMeta()}
          <small>
            ${I.gallery.updated(jn(e, this.language))}
          </small>
        </div>
        <button
          class="dashboard-card-open"
          aria-label=${I.gallery.open(e.name)}
          @click=${this.open}
        ></button>
        <button
          class="dashboard-menu-trigger"
          aria-label=${I.gallery.actionsFor(e.name)}
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
G([A({ attribute: !1 })], q.prototype, "dashboard", void 0), G([A()], q.prototype, "language", void 0), G([A({ type: Boolean })], q.prototype, "menuOpen", void 0), G([A({ type: Boolean })], q.prototype, "renaming", void 0), G([A()], q.prototype, "draftName", void 0), G([Ue(".dashboard-rename-input")], q.prototype, "renameInput", void 0), q = G([k("ods-dashboard-card")], q);
//#endregion
//#region src/ods-gallery.ts
var J = class extends O {
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
			Vn,
			l`
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
		this.searchText = V(e);
	}
	onSortChange(e) {
		this.sort = V(e) === "name" ? "name" : "updated";
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
		H(this, "dashboard-settings-change", { value: e.detail.value });
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
          header-title=${I.gallery.deleteTitle}
          @closed=${() => H(this, "dashboard-dialog-close")}
        >
          <div class="dashboard-delete-content">
            <p>
              <strong>${e.name}</strong>
              ${I.gallery.deleteBody}
            </p>
            <p>${I.gallery.deleteWarning}</p>
          </div>
          <ha-dialog-footer slot="footer">
            <ha-button
              slot="secondaryAction"
              appearance="plain"
              @click=${() => H(this, "dashboard-dialog-close")}
            >
              ${I.common.cancel}
            </ha-button>
            <ha-button
              slot="primaryAction"
              variant="danger"
              appearance="filled"
              .disabled=${this.saving}
              @click=${() => H(this, "dashboard-delete-confirm")}
            >
              ${this.saving ? I.gallery.deleting : I.gallery.deleteAction}
            </ha-button>
          </ha-dialog-footer>
        </ha-dialog>
      ` : w`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${I.gallery.settingsTitle}
        header-subtitle=${e.name}
        @closed=${() => H(this, "dashboard-dialog-close")}
      >
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Sn(e)}
            .schema=${Dn()}
            .computeLabel=${On}
            @value-changed=${this.settingsChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => H(this, "dashboard-dialog-close")}
          >
            ${I.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !wn(e)}
            @click=${() => H(this, "dashboard-settings-save")}
          >
            ${this.saving ? I.gallery.saving : I.gallery.settingsSave}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
	render() {
		let e = Tn(this.dashboards, this.searchText, this.sort, this.language);
		return w`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div>
            <h1>${I.gallery.title}</h1>
            <p>${I.gallery.count(this.dashboards.length)}</p>
          </div>
          <ha-button
            class="dashboard-new-button"
            appearance="filled"
            aria-label=${I.gallery.newDashboard}
            @click=${() => H(this, "dashboard-new")}
          >
            <span class="dashboard-new-button-label">
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>${I.gallery.newDashboard}</span>
            </span>
          </ha-button>
        </header>
        ${this.error ? w`
                <ha-alert alert-type="error">${this.error}</ha-alert>
              ` : E}
        <section
          class="dashboard-library-tools"
          aria-label=${I.gallery.filters}
        >
          <label class="dashboard-search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              type="search"
              aria-label=${I.gallery.search}
              placeholder=${I.gallery.searchPlaceholder}
              .value=${this.searchText}
              @input=${this.onSearchInput}
            />
          </label>
          <label class="dashboard-sort">
            <span>${I.gallery.sort}</span>
            <select
              aria-label=${I.gallery.sortDashboards}
              .value=${this.sort}
              @change=${this.onSortChange}
            >
              <option value="updated">${I.gallery.sortUpdated}</option>
              <option value="name">${I.gallery.sortName}</option>
            </select>
          </label>
        </section>
        <section
          class="dashboard-grid"
          aria-label=${I.gallery.savedDashboards}
        >
          <button
            class="dashboard-add-card"
            aria-label=${I.gallery.addDashboard}
            @click=${() => H(this, "dashboard-new")}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            <strong>${I.gallery.newDashboard}</strong>
          </button>
          ${e.map((e) => this.renderCard(e))}
          ${e.length ? E : w`
                  <div class="dashboard-no-results">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <strong>${I.gallery.noResults}</strong>
                    <span>${I.gallery.noResultsHint}</span>
                  </div>
                `}
        </section>
      </main>
      ${this.renderDialog()}
    `;
	}
};
G([A({ attribute: !1 })], J.prototype, "dashboards", void 0), G([A({ attribute: !1 })], J.prototype, "hass", void 0), G([A()], J.prototype, "error", void 0), G([A({ type: Boolean })], J.prototype, "saving", void 0), G([A()], J.prototype, "dialog", void 0), G([A({ attribute: !1 })], J.prototype, "draft", void 0), G([j()], J.prototype, "searchText", void 0), G([j()], J.prototype, "sort", void 0), G([j()], J.prototype, "menuDashboardId", void 0), J = G([k("ods-gallery")], J);
//#endregion
//#region src/ods-header.ts
var mr = class extends O {
	constructor(...e) {
		super(...e), this.view = "design", this.dirty = !1, this.saving = !1;
	}
	static {
		this.styles = [
			U,
			W,
			l`
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
		H(this, "dashboard-name-change", { name: V(e) });
	}
	get statusToggleLabel() {
		return this.dashboard.status === "ready" ? I.header.setDraft : I.header.setReady;
	}
	render() {
		let e = this.dashboard;
		return w`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">${I.header.studio}</strong>
          <span class="breadcrumb-divider">/</span>
          <button
            class="breadcrumb-link"
            @click=${() => H(this, "show-dashboards")}
          >
            ${I.header.dashboards}
          </button>
          <span class="breadcrumb-divider">/</span>
          <input
            class="dashboard-name"
            aria-label=${I.header.name}
            .value=${e.name}
            @input=${this.onNameInput}
          />
        </div>
        <nav class="view-switch" aria-label=${I.header.view}>
          <button
            class=${this.view === "design" ? "active" : ""}
            aria-pressed=${this.view === "design"}
            @click=${() => H(this, "view-change", { view: "design" })}
          >
            <ha-icon icon="mdi:tools"></ha-icon>
            ${I.header.design}
          </button>
          <button
            class=${this.view === "code" ? "active" : ""}
            aria-pressed=${this.view === "code"}
            @click=${() => H(this, "view-change", { view: "code" })}
          >
            <ha-icon icon="mdi:code-tags"></ha-icon>
            ${I.header.code}
          </button>
        </nav>
        <div class="editor-actions">
          <span class="status ${e.status}">${e.status}</span>
          <ha-button
            appearance="plain"
            @click=${() => H(this, "toggle-ready")}
          >
            ${this.statusToggleLabel}
          </ha-button>
          <ha-button
            appearance="filled"
            .disabled=${!this.dirty || this.saving}
            @click=${() => H(this, "dashboard-save")}
          >
            ${this.saving ? I.header.saving : I.header.save}
          </ha-button>
        </div>
      </header>
    `;
	}
};
G([A({ attribute: !1 })], mr.prototype, "dashboard", void 0), G([A()], mr.prototype, "view", void 0), G([A({ type: Boolean })], mr.prototype, "dirty", void 0), G([A({ type: Boolean })], mr.prototype, "saving", void 0), mr = G([k("ods-header")], mr);
//#endregion
//#region src/item-labels.ts
var hr = (e, t, n) => e.kind === "widget" ? t.find((t) => t.id === e.widget.type) : n.find((t) => t.type === e.primitive.type), gr = (e, t, n) => hr(e, t, n)?.icon ?? "mdi:puzzle", _r = "{{  }}", vr = class extends O {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.disabled = !1, this.focusEditor = !1;
	}
	static {
		this.styles = [U, l`
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
		H(this, "expression-change", {
			key: this.fieldKey,
			template: e
		});
	}
	toggle() {
		this.change(this.expression === void 0 ? void 0 : null);
	}
	onLiteralInput(e) {
		let t = e.composedPath()[0];
		t instanceof HTMLInputElement && t.type === "text" && t.value.trimStart().startsWith("{") && (this.focusEditor = !0, this.change(_r));
	}
	onEditorChange(e) {
		if (!(e.target instanceof HTMLTextAreaElement)) return;
		let t = e.target.value;
		this.change(Xe(t) ? t : null);
	}
	renderEditor(e) {
		return w`
      <label class="expression">
        <span>${this.label}</span>
        <textarea
          data-expression=${this.fieldKey}
          aria-label=${this.label}
          placeholder=${I.expression.placeholder}
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
          aria-label=${I.expression.toggleLabel(this.label)}
          title=${I.expression.toggleTooltip}
          .disabled=${this.disabled}
          @click=${this.toggle}
        >
          {}
        </button>
      </div>
    `;
	}
};
G([A()], vr.prototype, "label", void 0), G([A()], vr.prototype, "fieldKey", void 0), G([A()], vr.prototype, "expression", void 0), G([A({ type: Boolean })], vr.prototype, "disabled", void 0), G([Ue("textarea")], vr.prototype, "editor", void 0), vr = G([k("ods-expression-field")], vr);
//#endregion
//#region src/ods-property-field.ts
var Y = class extends O {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.value = 0, this.min = 0, this.max = 4096, this.disabled = !1;
	}
	static {
		this.styles = [U, l`
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
		H(this, "field-change", {
			key: this.fieldKey,
			value: V(e)
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
G([A()], Y.prototype, "label", void 0), G([A()], Y.prototype, "fieldKey", void 0), G([A({ type: Number })], Y.prototype, "value", void 0), G([A({ type: Number })], Y.prototype, "min", void 0), G([A({ type: Number })], Y.prototype, "max", void 0), G([A({ type: Boolean })], Y.prototype, "disabled", void 0), Y = G([k("ods-property-field")], Y);
//#endregion
//#region src/ods-structure.ts
var yr = 4, X = class extends O {
	constructor(...e) {
		super(...e), this.items = [], this.widgets = [], this.primitives = [], this.selectedItemId = "", this.draggingId = "";
	}
	static {
		this.styles = [
			U,
			W,
			l`
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
		e.button === 0 && (e.stopPropagation(), e.preventDefault(), this.stopGesture = Zn({
			origin: e,
			threshold: yr,
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
	runCommand(e, t, n) {
		e.stopPropagation(), H(this, "command", {
			id: t,
			itemId: n.id
		});
	}
	renderCommandButton(e, t, n) {
		let r = bn(hn(e), fn(t), Nn());
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
		H(this, "inspector-collapse", { collapsed: !0 });
	}
	selectItem(e) {
		H(this, "item-select", { itemId: e.id });
	}
	onRowKeyDown(e, t) {
		e.target === e.currentTarget && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.selectItem(t));
	}
	renderRow(e) {
		let t = e.name, n = this.dropTarget?.itemId === e.id ? this.dropTarget.edge : void 0, r = Xn({
			"layer-row": !0,
			active: e.id === this.selectedItemId,
			"is-hidden": e.hidden,
			dragging: e.id === this.draggingId,
			"drop-before": n === "before",
			"drop-after": n === "after"
		});
		return w`
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
          title=${I.structure.reorderTitle}
          aria-label=${I.structure.reorder(t)}
          @pointerdown=${(t) => this.startDrag(t, e.id)}
        >
          <ha-icon icon="mdi:drag-vertical"></ha-icon>
        </button>
        <ha-icon
          class="layer-type-icon"
          .icon=${gr(e, this.widgets, this.primitives)}
        ></ha-icon>
        <span>
          <strong>${t}</strong>
          <small>${this.kindLabel(e)}</small>
        </span>
        <div class="layer-actions">
          ${this.renderCommandButton("toggle-hidden", e, t)}
          ${this.renderCommandButton("toggle-locked", e, t)}
          ${this.renderCommandButton("delete-item", e, t)}
        </div>
      </div>
    `;
	}
	kindLabel(e) {
		return e.kind === "widget" ? I.structure.widget : e.primitive.type;
	}
	render() {
		let e = [...this.items].reverse();
		return w`
      <section class="layers">
        <header>
          <div>
            <span class="eyebrow">${I.structure.title}</span>
            <h2>${I.structure.heading}</h2>
          </div>
          <div class="layers-header-actions">
            <span class="count">${e.length}</span>
            <button
              class="icon-button"
              title=${I.structure.collapse}
              aria-label=${I.structure.collapse}
              @click=${this.collapse}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        </header>
        <div class="layer-list" role="tree">
          ${e.length ? e.map((e) => this.renderRow(e)) : w`
                  <p class="empty-layers">${I.structure.empty}</p>
                `}
        </div>
      </section>
    `;
	}
};
G([A({ attribute: !1 })], X.prototype, "items", void 0), G([A({ attribute: !1 })], X.prototype, "widgets", void 0), G([A({ attribute: !1 })], X.prototype, "primitives", void 0), G([A()], X.prototype, "selectedItemId", void 0), G([j()], X.prototype, "draggingId", void 0), G([j()], X.prototype, "dropTarget", void 0), X = G([k("ods-structure")], X);
//#endregion
//#region src/ods-inspector.ts
var br = 286, xr = 560, Sr = [
	"width",
	"height",
	"padding",
	"snapSize"
], Cr = (e) => Sr.some((t) => t === e), wr = (e) => e.label, Z = class extends O {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.collapsed = !1, this.width = 350, this.showCorners = !1;
	}
	static {
		this.styles = [
			U,
			W,
			l`
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
		this.stopGesture = Zn({
			origin: e,
			onMove: (e) => {
				let r = n + t - e.clientX;
				H(this, "inspector-resize", { width: N(r, br, xr) });
			}
		});
	}
	expand() {
		H(this, "inspector-collapse", { collapsed: !1 });
	}
	numberFrom(e) {
		let t = Math.round(Number(e.detail.value));
		return Number.isFinite(t) ? t : void 0;
	}
	onItemFieldChange(e, t) {
		e.stopPropagation();
		let n = this.numberFrom(e);
		n !== void 0 && (t.stored && t.key.includes("_") ? H(this, "primitive-change", { value: { [t.key]: n } }) : H(this, "item-number-change", {
			key: t.key,
			value: n
		}));
	}
	onDisplayFieldChange(e) {
		e.stopPropagation();
		let { key: t } = e.detail, n = this.numberFrom(e);
		n !== void 0 && Cr(t) && H(this, "display-number-change", {
			key: t,
			value: n
		});
	}
	onProfileChange(e) {
		H(this, "profile-change", { profileId: V(e) });
	}
	onPaletteChange(e) {
		let t = V(e);
		At(t) && H(this, "palette-change", { palette: t });
	}
	onBackgroundChange(e) {
		H(this, "background-change", { color: V(e) });
	}
	onWidgetConfigChange(e) {
		H(this, "widget-config-change", { value: e.detail.value });
	}
	onPrimitiveChange(e) {
		H(this, "primitive-change", { value: e.detail.value });
	}
	requestDashboardDelete() {
		H(this, "dashboard-delete-request");
	}
	unlock(e) {
		H(this, "command", {
			id: "toggle-locked",
			itemId: e.id
		});
	}
	requestItemDelete(e) {
		H(this, "command", {
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
		let { timings: t } = e, n = I.inspector.metrics, r = [
			[n.queue, t.queue],
			[n.data, t.data],
			[n.compile, t.compile],
			[n.render, t.render],
			[n.encode, t.encode],
			[n.total, t.pipeline]
		];
		return w`
      ${e.warnings.map((e) => w`
          <ha-alert class="warning" alert-type="warning">${e}</ha-alert>
        `)}
      <details class="inspector-section telemetry">
        <summary>${I.inspector.diagnostics}</summary>
        <div class="section-body metrics">
          ${r.map(([e, t]) => w`
              <span>${e}</span>
              <strong>${I.common.milliseconds(t)}</strong>
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
        ${I.inspector.displayType}
        <select @change=${this.onProfileChange}>
          ${Ot.map((t) => w`
              <option value=${t.id} ?selected=${t.id === e}>
                ${t.manufacturer} · ${t.name}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderPaletteSelect() {
		let { profileId: e, palette: t } = this.dashboard.display, n = kt(e), r = n.id === "custom" ? Object.keys(L).filter(At) : n.palettes;
		return w`
      <label class="stack-field">
        ${I.fields.palette}
        <select @change=${this.onPaletteChange}>
          ${r.map((e) => w`
              <option value=${e} ?selected=${e === t}>
                ${L[e]}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderBackgroundSelect() {
		let { palette: e, background: t } = this.dashboard.display;
		return w`
      <label class="stack-field">
        ${I.fields.background}
        <select @change=${this.onBackgroundChange}>
          ${Dt[e].map((e) => w`
              <option value=${e} ?selected=${e === t}>
                ${e[0].toUpperCase()}${e.slice(1)}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderDashboardInspector() {
		return w`
      ${this.renderHeader(I.inspector.dashboard, I.inspector.dashboardHint, "mdi:monitor")}
      <details class="inspector-section" open>
        <summary>${I.inspector.display}</summary>
        <div class="section-body">
          ${this.renderProfileSelect()}
          <div class="field-grid">
            ${this.renderDisplayField(I.fields.width, "width", 64, 4096)}
            ${this.renderDisplayField(I.fields.height, "height", 64, 4096)}
          </div>
          <div class="field-grid">
            ${this.renderPaletteSelect()} ${this.renderBackgroundSelect()}
          </div>
        </div>
      </details>
      <details class="inspector-section" open>
        <summary>${I.inspector.workingArea}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${this.renderDisplayField(I.fields.padding, "padding", 0, 1024)}
            ${this.renderDisplayField(I.fields.snapSize, "snapSize", 1, 256)}
          </div>
          <p class="field-help">${I.inspector.workingAreaHelp}</p>
        </div>
      </details>
      ${this.renderDangerZone(I.inspector.deleteDashboard, this.requestDashboardDelete)}
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
		return this.renderExpressible(e, Ye, I.expression.visibleLabel, w`
        <span class="field-help">${I.expression.alwaysVisible}</span>
      `);
	}
	renderCornerToggle(e) {
		return Vt(e, this.primitives) ? w`
      <button
        type="button"
        class="text-button"
        @click=${() => this.showCorners = !this.showCorners}
      >
        ${this.showCorners ? I.expression.derivedFields : I.expression.cornerFields}
      </button>
    ` : E;
	}
	renderLockedNotice(e) {
		return e.locked ? w`
      <div class="locked-notice">
        <span>
          <ha-icon icon="mdi:lock"></ha-icon>
          ${I.inspector.locked}
        </span>
        <button
          type="button"
          aria-label=${I.inspector.unlockElement}
          @click=${() => this.unlock(e)}
        >
          ${I.inspector.unlock}
        </button>
      </div>
    ` : E;
	}
	renderLayoutSection(e) {
		let { grid: t, extra: n } = Ht(e, this.dashboard, this.primitives, this.showCorners);
		return w`
      <details class="inspector-section" open>
        <summary>${I.inspector.layout}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${t.map((t) => this.renderLayoutField(t, e))}
          </div>
          ${n.map((t) => this.renderLayoutField(t, e))}
          ${this.renderCornerToggle(e)} ${this.renderVisibility(e)}
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
		return w`
      <details class="inspector-section" open>
        <summary>${I.inspector.widgetSettings}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${e.widget.config}
            .schema=${t}
            .computeLabel=${wr}
            @value-changed=${this.onWidgetConfigChange}
          ></ha-form>
        </div>
      </details>
    `;
	}
	renderAppearanceField(e, t, n) {
		return this.renderExpressible(e, t.name, t.label, w`
        <ha-form
          .hass=${this.hass}
          .data=${n}
          .schema=${[t]}
          .computeLabel=${wr}
          @value-changed=${this.onPrimitiveChange}
        ></ha-form>
      `);
	}
	renderAppearance(e) {
		let t = Kt(e, this.primitives), n = Gt(e, this.dashboard.display.palette, this.primitives);
		return w`
      <details class="inspector-section" open>
        <summary>${I.inspector.appearance}</summary>
        <div class="section-body">
          ${n.map((n) => this.renderAppearanceField(e, n, t))}
        </div>
      </details>
    `;
	}
	renderItemInspector(e) {
		let t = e.kind === "widget" ? I.inspector.kindWidget : I.inspector.kindPrimitive;
		return w`
      ${this.renderHeader(e.name, I.inspector.subtitle(t, e.locked), gr(e, this.widgets, this.primitives))}
      ${this.renderLockedNotice(e)} ${this.renderLayoutSection(e)}
      ${e.kind === "widget" ? this.renderWidgetSettings(e) : this.renderAppearance(e)}
      ${this.renderDangerZone(I.inspector.removeElement, () => this.requestItemDelete(e))}
      ${this.renderMetrics()}
    `;
	}
	renderRail() {
		return w`
      <aside class="panel panel-rail right-rail">
        <button
          class="icon-button"
          title=${I.inspector.expand}
          aria-label=${I.inspector.expand}
          @click=${this.expand}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="rail-label">${I.inspector.rail}</span>
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
          aria-label=${I.inspector.resize}
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
G([A({ attribute: !1 })], Z.prototype, "hass", void 0), G([A({ attribute: !1 })], Z.prototype, "dashboard", void 0), G([A({ attribute: !1 })], Z.prototype, "widgets", void 0), G([A({ attribute: !1 })], Z.prototype, "primitives", void 0), G([A({ attribute: !1 })], Z.prototype, "preview", void 0), G([A()], Z.prototype, "selectedItemId", void 0), G([A({ type: Boolean })], Z.prototype, "collapsed", void 0), G([A({ type: Number })], Z.prototype, "width", void 0), G([j()], Z.prototype, "showCorners", void 0), G([Ue(".properties")], Z.prototype, "propertiesPanel", void 0), Z = G([k("ods-inspector")], Z);
//#endregion
//#region src/catalog.ts
var Tr = (e, t) => {
	let n = t.trim().toLocaleLowerCase();
	return n ? e.filter((e) => `${e.name} ${e.description}`.toLocaleLowerCase().includes(n)) : e;
}, Er = 4, Dr = class extends O {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.collapsed = !1, this.searchText = "", this.suppressClick = !1;
	}
	static {
		this.styles = [
			U,
			W,
			l`
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
		this.stopGesture = Zn({
			origin: e,
			threshold: Er,
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
	onSearchInput(e) {
		this.searchText = V(e);
	}
	addFromClick(e) {
		this.suppressClick || H(this, "catalog-add", { value: e });
	}
	renderEntry(e, t) {
		let n = `${t}:${e.id}`;
		return w`
      <button
        class="catalog-item"
        title=${I.library.entryHint(e.description)}
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
		return e.length ? w`
      ${e.map((e) => this.renderEntry(e, t))}
    ` : w`
        <p class="empty-result">${n}</p>
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
            title=${I.library.expand}
            aria-label=${I.library.expand}
            @click=${() => H(this, "library-collapse", { collapsed: !1 })}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <span class="rail-label">${I.library.title}</span>
        </aside>
      `;
		let e = Tr(this.widgets, this.searchText), t = Tr(this.primitives, this.searchText).map((e) => ({
			...e,
			id: e.type
		}));
		return w`
      ${this.renderGhost()}
      <aside class="panel toolbox">
        <div class="panel-title">
          <div>
            <span class="eyebrow">${I.library.title}</span>
            <h2>${I.library.heading}</h2>
          </div>
          <button
            class="icon-button"
            title=${I.library.collapse}
            aria-label=${I.library.collapse}
            @click=${() => H(this, "library-collapse", { collapsed: !0 })}
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
        </div>
        <label class="search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            aria-label=${I.library.search}
            placeholder=${I.library.searchPlaceholder}
            .value=${this.searchText}
            @input=${this.onSearchInput}
          />
        </label>
        <div class="catalog-scroll">
          <section class="catalog-section">
            <header>
              <span>${I.library.widgets}</span>
              <span class="count">${e.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(e, "widget", I.library.noWidgets)}
            </div>
          </section>
          <section class="catalog-section">
            <header>
              <span>${I.library.primitives}</span>
              <span class="count">${t.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(t, "primitive", I.library.noPrimitives)}
            </div>
          </section>
        </div>
      </aside>
    `;
	}
};
G([A({ attribute: !1 })], Dr.prototype, "widgets", void 0), G([A({ attribute: !1 })], Dr.prototype, "primitives", void 0), G([A({ type: Boolean })], Dr.prototype, "collapsed", void 0), G([j()], Dr.prototype, "searchText", void 0), G([j()], Dr.prototype, "ghost", void 0), Dr = G([k("ods-library")], Dr);
//#endregion
//#region src/ods-new-dashboard-dialog.ts
var Or = class extends O {
	constructor(...e) {
		super(...e), this.saving = !1;
	}
	static {
		this.styles = [
			U,
			W,
			l`
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
		H(this, "new-dashboard-change", { value: e.detail.value });
	}
	render() {
		return w`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${I.newDashboard.title}
        header-subtitle=${I.newDashboard.subtitle}
        @closed=${() => H(this, "new-dashboard-close")}
      >
        <div class="new-dashboard-content">
          <span class="form-label">${I.newDashboard.startFrom}</span>
          <div
            class="dashboard-source-options"
            role="radiogroup"
            aria-label=${I.newDashboard.sources}
          >
            <button
              class="dashboard-source selected"
              type="button"
              role="radio"
              aria-checked="true"
            >
              <ha-icon icon="mdi:monitor"></ha-icon>
              <span>
                <strong>${I.newDashboard.customSize}</strong>
                <small>${I.newDashboard.customSizeHint}</small>
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
                <strong>${I.newDashboard.fromDevice}</strong>
                <small>${I.newDashboard.fromDeviceHint}</small>
              </span>
            </button>
          </div>
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Sn(this.dashboard)}
            .schema=${Dn()}
            .computeLabel=${On}
            @value-changed=${this.formChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => H(this, "new-dashboard-close")}
          >
            ${I.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !wn(this.dashboard)}
            @click=${() => H(this, "dashboard-create")}
          >
            ${this.saving ? I.newDashboard.creating : I.newDashboard.create}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
};
G([A({ attribute: !1 })], Or.prototype, "hass", void 0), G([A({ attribute: !1 })], Or.prototype, "dashboard", void 0), G([A({ type: Boolean })], Or.prototype, "saving", void 0), Or = G([k("ods-new-dashboard-dialog")], Or);
//#endregion
//#region src/ods-app.ts
var kr = 220, Q = (e, t) => e instanceof Error && e.message ? e.message : typeof e == "string" && e ? e : t, $ = class extends O {
	constructor(...e) {
		super(...e), this.dashboards = [], this.view = "dashboards", this.widgets = [], this.primitives = [], this.selectedItemId = "", this.loading = !0, this.saving = !1, this.dirty = !1, this.error = "", this.draggingCatalog = !1, this.undoCount = 0, this.redoCount = 0, this.pendingDeleteItemId = "", this.leftCollapsed = !1, this.rightCollapsed = !1, this.inspectorWidth = 350, this.snapEnabled = !0, this.viewport = Kn, this.newDashboardOpen = !1, this.newDashboard = xn("en"), this.previewRequest = 0, this.bootstrapStarted = !1, this.history = new Fn(), this.undo = () => {
			this.current && this.restore(this.history.undo(this.current));
		}, this.redo = () => {
			this.current && this.restore(this.history.redo(this.current));
		}, this.commandActions = {
			undo: () => this.undo(),
			redo: () => this.redo(),
			requestDelete: (e) => {
				this.pendingDeleteItemId = e;
			},
			toggleFlag: (e, t) => this.mutate((n) => tn(n, e, t))
		}, this.onKeyDown = (e) => {
			if (this.view !== "design" || Mn(e)) return;
			let t = _n(e);
			t?.isEnabled(this.commandContext(this.selectedItem)) && (e.preventDefault(), this.runCommand(t.id));
		};
	}
	static {
		this.styles = [
			U,
			W,
			l`
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
		super.disconnectedCallback(), this.previewTimer && window.clearTimeout(this.previewTimer), this.stateTimer && window.clearTimeout(this.stateTimer), this.clockTimer && window.clearTimeout(this.clockTimer), window.removeEventListener("keydown", this.onKeyDown);
	}
	ensureBootstrap() {
		!this.hass || this.bootstrapStarted || (this.bootstrapStarted = !0, this.bootstrap());
	}
	async bootstrap() {
		let e = this.hass;
		if (e) {
			this.loading = !0, this.error = "";
			try {
				let t = await In(e);
				this.dashboards = t.dashboards, this.widgets = t.widgets, this.primitives = t.primitives, this.current = void 0, this.preview = void 0, this.view = "dashboards", this.clearHistory(), this.newDashboard = xn(e.language);
			} catch (e) {
				this.error = Q(e, I.app.loadFailed);
			} finally {
				this.loading = !1;
			}
		}
	}
	openNewDashboard() {
		this.newDashboard = xn(this.language), this.newDashboardOpen = !0;
	}
	async createDashboard() {
		if (this.hass) {
			this.saving = !0, this.error = "";
			try {
				let e = await Ln(this.hass, this.newDashboard);
				this.dashboards = [...this.dashboards, e], this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.newDashboardOpen = !1, this.view = "design", this.clearHistory(), await this.composePreview(), await this.updateComplete, this.showWholeCanvas();
			} catch (e) {
				this.error = Q(e, I.app.createFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveDashboard() {
		if (!(!this.hass || !this.current)) {
			this.saving = !0, this.error = "";
			try {
				let e = await Rn(this.hass, this.current);
				this.current = structuredClone(e), this.dashboards = this.dashboards.map((t) => t.id === e.id ? e : t), this.dirty = !1;
			} catch (e) {
				this.error = Q(e, I.app.saveFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async deleteDashboard() {
		if (!this.hass || !this.current) return;
		let e = this.current.id;
		try {
			await zn(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.view = "dashboards", this.clearHistory();
		} catch (e) {
			this.error = Q(e, I.app.deleteFailed);
		}
	}
	openDashboard(e) {
		if (this.current?.id === e.id) {
			this.view = "design", this.preview || this.composePreview();
			return;
		}
		this.dirty && !window.confirm(I.app.discardChanges) || (this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.clearHistory(), this.view = "design", this.composePreview().then(() => this.showWholeCanvas()));
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
				let t = await Rn(this.hass, e);
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
			this.error = I.app.renameEmpty;
			return;
		}
		if (this.dashboards.find((t) => t.id === e.id)?.name === e.name) {
			this.closeAction();
			return;
		}
		await this.updateFromGallery(e, I.app.renameFailed) && this.closeAction();
	}
	async duplicateDashboard(e) {
		if (!this.hass || this.saving) return;
		this.saving = !0, this.error = "";
		let t = structuredClone(e);
		t.id = "", t.name = En(e, this.dashboards, this.language), t.status = "draft", t.createdAt = "", t.updatedAt = "";
		try {
			let e = await Ln(this.hass, t);
			this.dashboards = [...this.dashboards, e];
		} catch (e) {
			this.error = Q(e, I.app.duplicateFailed);
		} finally {
			this.saving = !1;
		}
	}
	async saveSettings() {
		if (this.dashboardDialog !== "settings" || !this.dashboardDraft || !wn(this.dashboardDraft)) return;
		let e = structuredClone(this.dashboardDraft);
		e.name = e.name.trim(), await this.updateFromGallery(e, I.app.settingsFailed) && this.closeAction();
	}
	async confirmDeleteDashboard() {
		if (this.dashboardDialog !== "delete" || !this.dashboardDraft || !this.hass || this.saving) return;
		let e = this.dashboardDraft.id;
		this.saving = !0, this.error = "";
		try {
			await zn(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current?.id === e && (this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.clearHistory()), this.closeAction();
		} catch (e) {
			this.error = Q(e, I.app.deleteFailed);
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
		let n = hn(e), r = this.commandContext(t);
		n.isEnabled(r) && n.run(r, this.commandActions);
	}
	onCommand(e) {
		let { id: t, itemId: n } = e.detail, r = n ? this.current?.items.find((e) => e.id === n) : void 0;
		this.runCommand(t, r ?? this.selectedItem);
	}
	schedulePreview() {
		this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.composePreview(), kr);
	}
	refreshOnStateChange(e) {
		let t = this.preview?.dependencies;
		!t || !n(t, e?.states, this.hass?.states) || (this.stateTimer && window.clearTimeout(this.stateTimer), this.stateTimer = window.setTimeout(() => void this.composePreview(), 500));
	}
	scheduleClockRefresh() {
		this.clockTimer && window.clearTimeout(this.clockTimer), this.preview?.dependencies.usesTime && (this.clockTimer = window.setTimeout(() => void this.composePreview(), 6e4));
	}
	async composePreview() {
		if (!this.hass || !this.current) return;
		this.error = "";
		let e = ++this.previewRequest;
		try {
			let t = await Bn(this.hass, this.current);
			e === this.previewRequest && (this.preview = t, this.scheduleClockRefresh());
		} catch (e) {
			this.error = Q(e, I.app.previewFailed);
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
			e && (o = sn(e, t, n, r));
		} else if (i === "primitive" && (o = cn(this.primitives, a, t, n, r), !o)) {
			this.error = I.app.unsupportedPrimitive(a);
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
		let { x: t, y: n } = ln(this.current, this.snapEnabled);
		this.addAt(e, t, n);
	}
	dropFromCatalog(e, t, n) {
		let r = this.current, i = this.canvas?.displayPointAt(t, n);
		if (!r || !i) return;
		let a = F(r);
		this.addAt(e, N(ht(i.x, r, this.snapEnabled), a.x, a.x + a.width - 1), N(ht(i.y, r, this.snapEnabled), a.y, a.y + a.height - 1));
	}
	confirmDeleteItem() {
		let e = this.pendingDeleteItemId;
		e && (this.pendingDeleteItemId = "", this.mutate((t) => nn(t, e)), this.selectedItemId === e && this.selectItem(""));
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
		this.dashboardDraft &&= Cn(this.dashboardDraft, e.detail.value);
	}
	onNewDashboardChange(e) {
		this.newDashboard = Cn(this.newDashboard, e.detail.value);
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
		this.mutate((e) => rn(e, t, n, r));
	}
	onItemNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => Yt(e, this.selectedItemId, t, n, this.primitives));
	}
	onExpressionChange(e) {
		let { key: t, template: n } = e.detail;
		this.mutate((e) => dn(e, this.selectedItemId, t, n));
	}
	onDisplayNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => Zt(e, t, n));
	}
	onProfileChange(e) {
		let t = kt(e.detail.profileId);
		this.mutate((e) => Qt(e, t)), requestAnimationFrame(() => this.canvas?.fitView());
	}
	onPaletteChange(e) {
		this.mutate((t) => $t(t, e.detail.palette));
	}
	onBackgroundChange(e) {
		this.mutate((t) => en(t, e.detail.color));
	}
	onWidgetConfigChange(e) {
		let t = e.detail.value;
		this.mutate((e) => an(e, this.selectedItemId, t));
	}
	onPrimitiveChange(e) {
		let { value: t } = e.detail;
		this.mutate((e) => on(e, this.selectedItemId, t, this.primitives));
	}
	renderDeleteDialog() {
		let e = this.current?.items.find((e) => e.id === this.pendingDeleteItemId);
		return e ? w`
      <ods-confirm-dialog
        eyebrow=${I.app.confirmRemoval}
        heading=${I.app.deleteElementTitle(e.name)}
        body=${I.app.deleteElementBody}
        confirmLabel=${I.app.deleteElement}
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
          @widget-config-change=${this.onWidgetConfigChange}
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
        ${this.renderError()}
        ${this.view === "code" ? w`
                <ods-code-view .preview=${this.preview}></ods-code-view>
              ` : this.renderDesign(e)}
      </div>
    `;
	}
	render() {
		if (this.loading) return w`
        <div class="dashboard-empty">
          <p>${I.app.loading}</p>
        </div>
      `;
		let e = this.current;
		return this.view === "dashboards" || !e ? this.renderGallery() : this.renderEditor(e);
	}
};
G([A({ attribute: !1 })], $.prototype, "hass", void 0), G([j()], $.prototype, "dashboards", void 0), G([j()], $.prototype, "view", void 0), G([j()], $.prototype, "widgets", void 0), G([j()], $.prototype, "primitives", void 0), G([j()], $.prototype, "current", void 0), G([j()], $.prototype, "selectedItemId", void 0), G([j()], $.prototype, "preview", void 0), G([j()], $.prototype, "loading", void 0), G([j()], $.prototype, "saving", void 0), G([j()], $.prototype, "dirty", void 0), G([j()], $.prototype, "error", void 0), G([j()], $.prototype, "draggingCatalog", void 0), G([j()], $.prototype, "undoCount", void 0), G([j()], $.prototype, "redoCount", void 0), G([j()], $.prototype, "pendingDeleteItemId", void 0), G([j()], $.prototype, "leftCollapsed", void 0), G([j()], $.prototype, "rightCollapsed", void 0), G([j()], $.prototype, "inspectorWidth", void 0), G([j()], $.prototype, "snapEnabled", void 0), G([j()], $.prototype, "viewport", void 0), G([j()], $.prototype, "newDashboardOpen", void 0), G([j()], $.prototype, "newDashboard", void 0), G([j()], $.prototype, "dashboardDialog", void 0), G([j()], $.prototype, "dashboardDraft", void 0), G([Ue("ods-canvas")], $.prototype, "canvas", void 0), $ = G([k("ods-app")], $);
//#endregion
export { $ as OdsApp };
