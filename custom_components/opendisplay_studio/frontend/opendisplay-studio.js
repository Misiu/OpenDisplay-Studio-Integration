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
var re = globalThis, ie = (e) => e, ae = re.trustedTypes, x = ae ? ae.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, S = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, oe = "?" + C, se = `<${oe}>`, w = document, ce = () => w.createComment(""), le = (e) => e === null || typeof e != "object" && typeof e != "function", ue = Array.isArray, de = (e) => ue(e) || typeof e?.[Symbol.iterator] == "function", fe = "[ 	\n\f\r]", pe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, he = />/g, T = RegExp(`>|${fe}(?:([^\\s"'>=/]+)(${fe}*=${fe}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ge = /'/g, _e = /"/g, ve = /^(?:script|style|textarea|title)$/i, E = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), D = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), ye = /* @__PURE__ */ new WeakMap(), k = w.createTreeWalker(w, 129);
function be(e, t) {
	if (!ue(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return x === void 0 ? t : x.createHTML(t);
}
var xe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = pe;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === pe ? c[1] === "!--" ? o = me : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = T) : (ve.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = T) : o = he : o === T ? c[0] === ">" ? (o = i ?? pe, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? T : c[3] === "\"" ? _e : ge) : o === _e || o === ge ? o = T : o === me || o === he ? o = pe : (o = T, i = void 0);
		let d = o === T && e[t + 1].startsWith("/>") ? " " : "";
		a += o === pe ? n + se : l >= 0 ? (r.push(s), n.slice(0, l) + S + n.slice(l) + C + d) : n + C + (l === -2 ? t : d);
	}
	return [be(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Se = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = xe(t, n);
		if (this.el = e.createElement(l, r), k.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = k.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(S)) {
					let t = u[o++], n = i.getAttribute(e).split(C), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? De : r[1] === "?" ? Oe : r[1] === "@" ? ke : Ee
					}), i.removeAttribute(e);
				} else e.startsWith(C) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ve.test(i.tagName)) {
					let e = i.textContent.split(C), t = e.length - 1;
					if (t > 0) {
						i.textContent = ae ? ae.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], ce()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], ce());
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
function Ce(e, t, n = e, r) {
	if (t === D) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = le(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Ce(e, i._$AS(e, t.values), i, r)), t;
}
var we = class {
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
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Te(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ae(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = w, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Te = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = Ce(this, e, t), le(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== D && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? de(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && le(this._$AH) ? this._$AA.nextSibling.data = e : this.T(w.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Se.createElement(be(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new we(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ye.get(e.strings);
		return t === void 0 && ye.set(e.strings, t = new Se(e)), t;
	}
	k(t) {
		ue(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(ce()), this.O(ce()), this, this.options)) : r = n[i], r._$AI(a), i++;
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
}, Ee = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = O, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = O;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Ce(this, e, t, 0), a = !le(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Ce(this, r[n + o], t, o), s === D && (s = this._$AH[o]), a ||= !le(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, De = class extends Ee {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, Oe = class extends Ee {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, ke = class extends Ee {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Ce(this, e, t, 0) ?? O) === D) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ae = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Ce(this, e);
	}
}, je = re.litHtmlPolyfillSupport;
je?.(Se, Te), (re.litHtmlVersions ??= []).push("3.3.3");
var Me = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Te(t.insertBefore(ce(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Ne = globalThis, A = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Me(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return D;
	}
};
A._$litElement$ = !0, A.finalized = !0, Ne.litElementHydrateSupport?.({ LitElement: A });
var Pe = Ne.litElementPolyfillSupport;
Pe?.({ LitElement: A }), (Ne.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var j = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Fe = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	hasChanged: y
}, Ie = (e = Fe, t, n) => {
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
function M(e) {
	return (t, n) => typeof n == "object" ? Ie(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function N(e) {
	return M({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Le = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function Re(e, t) {
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
			return Le(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Le(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/lit-html/directive.js
var ze = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Be = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Ve = class {
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
}, He = "important", Ue = " !" + He, P = Be(class extends Ve {
	constructor(e) {
		if (super(e), e.type !== ze.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(Ue);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? He : "") : n[e] = r;
			}
		}
		return D;
	}
}), F = (e, t, n) => Math.max(t, Math.min(n, e)), We = (e, t, n = 0) => n + Math.round((e - n) / t) * t, Ge = [
	"nw",
	"n",
	"ne",
	"e",
	"se",
	"s",
	"sw",
	"w"
], Ke = (e) => e.includes("e") || e.includes("w"), qe = (e) => e.includes("n") || e.includes("s"), Je = (e, t, n, r) => r ? We(e, t, n) : Math.round(e), Ye = (e) => {
	if (e.startHandle) return e.originalEnd - e.areaStart;
	if (e.endHandle) return e.areaEnd - e.originalStart;
	let t = Math.min(e.originalCenter - e.areaStart, e.areaEnd - e.originalCenter);
	return Math.max(1, t * 2);
}, Xe = (e, t, n, r, i) => e ? n + r - i : t ? n : n + (r - i) / 2, Ze = ({ bounds: e, handle: t, deltaX: n, deltaY: r, minimumWidth: i, minimumHeight: a, area: o, preserveAspect: s, snapSize: c, snapEnabled: l }) => {
	let u = o.x + o.width, d = o.y + o.height, f = e.x, p = e.y, m = e.x + e.width, h = e.y + e.height, ee = f + e.width / 2, te = p + e.height / 2, g = f, _ = p, v = m, y = h;
	if (t.includes("w") && (g = Je(f + n, c, o.x, l)), t.includes("e") && (v = Je(m + n, c, o.x, l)), t.includes("n") && (_ = Je(p + r, c, o.y, l)), t.includes("s") && (y = Je(h + r, c, o.y, l)), t.includes("w") && (g = F(g, o.x, m - i)), t.includes("e") && (v = F(v, f + i, u)), t.includes("n") && (_ = F(_, o.y, h - a)), t.includes("s") && (y = F(y, p + a, d)), !s) return {
		x: Math.round(g),
		y: Math.round(_),
		width: Math.round(v - g),
		height: Math.round(y - _)
	};
	let ne = e.width / Math.max(1, e.height), b = Math.max(i, v - g), re = Math.max(a, y - _), ie = Math.abs(b - e.width) / Math.max(1, e.width), ae = Math.abs(re - e.height) / Math.max(1, e.height), x, S;
	Ke(t) && (!qe(t) || ie >= ae) ? (x = b, S = x / ne) : (S = re, x = S * ne);
	let C = Ye({
		startHandle: t.includes("w"),
		endHandle: t.includes("e"),
		originalStart: f,
		originalEnd: m,
		originalCenter: ee,
		areaStart: o.x,
		areaEnd: u
	}), oe = Ye({
		startHandle: t.includes("n"),
		endHandle: t.includes("s"),
		originalStart: p,
		originalEnd: h,
		originalCenter: te,
		areaStart: o.y,
		areaEnd: d
	}), se = Math.max(i / Math.max(1, e.width), a / Math.max(1, e.height)), w = Math.min(C / Math.max(1, e.width), oe / Math.max(1, e.height)), ce = F(Math.max(x / Math.max(1, e.width), S / Math.max(1, e.height)), Math.min(se, w), w);
	return x = Math.max(1, Math.round(e.width * ce)), S = Math.max(1, Math.round(e.height * ce)), g = t.includes("w") ? m - x : t.includes("e") ? f : ee - x / 2, _ = t.includes("n") ? h - S : t.includes("s") ? p : te - S / 2, g = F(Math.round(g), o.x, u - x), _ = F(Math.round(_), o.y, d - S), {
		x: g,
		y: _,
		width: x,
		height: S
	};
}, Qe = (e, t, n, r) => {
	let i = Xe(r.includes("w"), r.includes("e"), e.x, e.width, t), a = Xe(r.includes("n"), r.includes("s"), e.y, e.height, n);
	return {
		x: Math.round(i),
		y: Math.round(a),
		width: t,
		height: n
	};
}, $e = (e) => "x_start" in e, et = (e) => {
	if ($e(e)) return {
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
}, tt = (e) => e.type === "text" || e.type === "qrcode", nt = (e, t) => {
	if (e.kind === "widget") return e.frame;
	let n = et(e.primitive);
	return t && tt(e.primitive) ? {
		...n,
		width: t.width,
		height: t.height
	} : n;
}, rt = (e, t) => t ? Math.max(1, Math.round(t.width / e.boxsize)) : 21 + e.border * 2, I = (e) => {
	let t = e.display.padding;
	return {
		x: t,
		y: t,
		width: e.display.width - t * 2,
		height: e.display.height - t * 2
	};
}, it = (e, t, n) => n ? We(e, t.display.snapSize, t.display.padding) : Math.round(e), at = (e, t, n) => {
	if (e.kind === "widget") {
		e.frame.x += t, e.frame.y += n;
		return;
	}
	let r = e.primitive;
	$e(r) ? (r.x_start += t, r.x_end += t, r.y_start += n, r.y_end += n) : (r.x += t, r.y += n);
}, ot = (e, t, n) => {
	let r = I(t), i = nt(e, n);
	at(e, F(i.x, r.x, Math.max(r.x, r.x + r.width - i.width)) - i.x, F(i.y, r.y, Math.max(r.y, r.y + r.height - i.height)) - i.y), e.kind === "widget" && (e.frame.width = Math.min(e.frame.width, r.width), e.frame.height = Math.min(e.frame.height, r.height));
}, st = {
	width: 60,
	height: 48
}, ct = (e, t, n) => {
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
		let e = rt(r, n);
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
		let e = lt(r, 6, n);
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
}, lt = (e, t, n) => {
	if (!n) return et({
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
}, ut = {
	n: "ne",
	e: "se",
	s: "se",
	w: "sw"
}, dt = (e, t, n, r, i, a, o) => {
	let s = nt(e, o.measured), { minimumWidth: c, minimumHeight: l, intrinsicAspect: u } = ct(e, o.minSize ?? st, o.measured), d = u ? ut[t] ?? t : t, f = Ze({
		bounds: s,
		handle: d,
		deltaX: n,
		deltaY: r,
		minimumWidth: c,
		minimumHeight: l,
		area: I(a),
		preserveAspect: i || u,
		snapSize: a.display.snapSize,
		snapEnabled: o.snapEnabled
	});
	if (e.kind === "widget") {
		e.frame = f;
		return;
	}
	let p = e.primitive;
	if ($e(p)) {
		let e = f.x + f.width - 1, t = f.y + f.height - 1;
		if (p.type === "line") {
			let n = p.x_start <= p.x_end, r = p.y_start <= p.y_end;
			p.x_start = n ? f.x : e, p.x_end = n ? e : f.x, p.y_start = r ? f.y : t, p.y_end = r ? t : f.y, p.x_start === p.x_end && p.y_start === p.y_end && (p.x_end = Math.min(a.display.width - 1, p.x_start + 1));
		} else p.x_start = f.x, p.y_start = f.y, p.x_end = e, p.y_end = t;
		return;
	}
	if (p.type === "circle") {
		let e = Math.max(1, Math.floor((Math.min(f.width, f.height) - 1) / 2)), t = e * 2 + 1, n = Qe(f, t, t, d);
		p.x = n.x + e, p.y = n.y + e, p.radius = e;
		return;
	}
	if (p.type === "qrcode") {
		let e = rt(p, o.measured);
		p.boxsize = F(Math.floor(Math.min(f.width, f.height) / e), 1, 16);
		let t = e * p.boxsize, n = Qe(f, t, t, d);
		p.x = n.x, p.y = n.y;
		return;
	}
	if (p.type === "icon") {
		p.size = F(Math.floor(Math.min(f.width, f.height)), 8, 256);
		let e = Qe(f, p.size, p.size, d);
		p.x = e.x, p.y = e.y;
		return;
	}
	let m = p.size;
	p.size = F(Math.round(m * f.width / Math.max(1, s.width)), 6, 256);
	let h = o.measured ? lt({
		...p,
		size: m
	}, p.size, o.measured) : et(p), ee = Qe(f, h.width, h.height, d);
	p.x = ee.x, p.y = ee.y;
}, ft = (e, t, n, r, i, a) => {
	let o = structuredClone(e);
	if (o.locked) return o;
	if (t.mode === "resize") return dt(o, t.handle, n, r, t.shiftKey, i, a), o;
	let s = I(i), c = nt(o, a.measured), l = F(it(c.x + n, i, a.snapEnabled), s.x, Math.max(s.x, s.x + s.width - c.width)), u = F(it(c.y + r, i, a.snapEnabled), s.y, Math.max(s.y, s.y + s.height - c.height));
	return at(o, l - c.x, u - c.y), o;
}, pt = () => Math.floor(Math.random() * 256), mt = () => {
	let e = globalThis.crypto;
	if (typeof e?.randomUUID == "function") return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	typeof e?.getRandomValues == "function" ? e.getRandomValues(t) : t.forEach((e, n) => {
		t[n] = pt();
	}), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0"));
	return `${n.slice(0, 4).join("")}-${n.slice(4, 6).join("")}-${n.slice(6, 8).join("")}-${n.slice(8, 10).join("")}-${n.slice(10).join("")}`;
}, ht = (e, t) => `${e} × ${t}`, L = {
	common: {
		cancel: "Cancel",
		close: "Close",
		size: ht,
		sizeInPixels: (e, t) => `${ht(e, t)} px`,
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
}, R = L.palettes, gt = {
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
}, z = (e, t, n, r, i = !1) => ({
	id: `solum-${e}`,
	manufacturer: "SOLUM",
	name: `Newton Pro ${t}`,
	width: n,
	height: r,
	palettes: i ? ["bw"] : ["bw", "bwry"],
	defaultPalette: i ? "bw" : "bwry"
}), _t = [
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
	z("1-6-v", "1.6″ V", 200, 200),
	z("1-6-h", "1.6″ H", 200, 200),
	z("2-2", "2.2″", 296, 160),
	z("2-2-freezer", "2.2″ Freezer", 296, 160, !0),
	z("2-6", "2.6″", 360, 184),
	z("2-6-freezer", "2.6″ Freezer", 360, 184, !0),
	z("2-7", "2.7″", 300, 200),
	z("2-9", "2.9″", 384, 168),
	z("2-9-freezer", "2.9″ Freezer", 384, 168, !0),
	z("3-45", "3.5″ · 3.45 panel", 480, 224),
	z("3-52", "3.5″ · 3.52 panel", 384, 180),
	z("4-2", "4.2″", 400, 300),
	z("4-3", "4.3″", 522, 152),
	z("4-5", "4.5″", 480, 176),
	z("5-8", "5.8″", 792, 272),
	z("6-1", "6.1″", 648, 480),
	z("7-5", "7.5″", 800, 480),
	z("9-7", "9.7″", 672, 960),
	z("11-6", "11.6″", 640, 960),
	z("12-2", "12.2″", 768, 960),
	{
		id: "custom",
		...L.customDisplay,
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
], vt = (e) => _t.find((t) => t.id === e) ?? _t[0], yt = (e) => e in R, bt = (e, t, n) => e === "display_width" ? t.width : e === "display_height" ? t.height : e === "display_shorter_side" ? Math.min(t.width, t.height) : e ?? n, xt = (e, t) => e.default === void 0 ? e.nullable ? null : 0 : e.shape !== "number" || typeof e.default != "number" ? e.default : F(e.default, bt(e.min, t, -Infinity), bt(e.max, t, Infinity)), St = (e, t, n) => {
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
}, Ct = (e, t) => {
	if (!e) return;
	let n = {
		width: t.displayWidth,
		height: t.displayHeight
	}, r = { type: e.type };
	for (let t of e.fields) r[t.key] = xt(t, n);
	return St(e, r, t), r;
}, wt = {
	grid: [],
	extra: []
}, Tt = "transparent", Et = (e, t) => t.find((t) => t.type === e.primitive.type), Dt = (e, t) => {
	let { width: n, height: r } = t.display, i = L.fields;
	return {
		grid: [
			{
				label: i.x,
				key: "x",
				value: e.frame.x,
				min: 0,
				max: n
			},
			{
				label: i.y,
				key: "y",
				value: e.frame.y,
				min: 0,
				max: r
			},
			{
				label: i.width,
				key: "width",
				value: e.frame.width,
				min: 1,
				max: n
			},
			{
				label: i.height,
				key: "height",
				value: e.frame.height,
				min: 1,
				max: r
			}
		],
		extra: [{
			label: i.innerPadding,
			key: "padding",
			value: e.layout.padding,
			min: 0,
			max: 128
		}]
	};
}, Ot = (e, t) => {
	let n = e.primitive;
	if (!$e(n)) return wt;
	let { width: r, height: i } = t.display, a = L.fields;
	return {
		grid: [
			{
				label: a.x,
				key: "x",
				value: Math.min(n.x_start, n.x_end),
				min: 0,
				max: r
			},
			{
				label: a.y,
				key: "y",
				value: Math.min(n.y_start, n.y_end),
				min: 0,
				max: i
			},
			{
				label: a.width,
				key: "width",
				value: Math.abs(n.x_end - n.x_start) + 1,
				min: 1,
				max: r
			},
			{
				label: a.height,
				key: "height",
				value: Math.abs(n.y_end - n.y_start) + 1,
				min: 1,
				max: i
			}
		],
		extra: []
	};
}, kt = (e, t, n) => {
	let r = n.display, i = e.axis === "x" ? r.width : r.height, a = e.shape === "coordinate";
	return {
		label: e.label,
		key: e.key,
		value: Number(t[e.key]),
		min: a ? 0 : bt(e.min, r, 0),
		max: a ? i : bt(e.max, r, i)
	};
}, At = (e, t, n) => {
	let r = { ...e.primitive };
	return {
		grid: t.fields.filter((e) => e.section === "layout").map((e) => kt(e, r, n)),
		extra: []
	};
}, jt = (e, t, n) => {
	if (e.kind === "widget") return Dt(e, t);
	let r = Et(e, n);
	return r ? r.geometry === "point" ? At(e, r, t) : Ot(e, t) : wt;
}, Mt = (e, t) => {
	switch (e.shape) {
		case "boolean": return { boolean: {} };
		case "enum": return { select: { options: e.options ?? [] } };
		case "color": return { select: { options: e.nullable ? [Tt, ...t] : t } };
		case "number": return { number: {
			min: typeof e.min == "number" ? e.min : void 0,
			max: typeof e.max == "number" ? e.max : void 0
		} };
		default: return { text: {} };
	}
}, Nt = (e) => e.section === "appearance" && e.visible !== !1, Pt = (e, t, n) => {
	let r = Et(e, n);
	if (!r) return [];
	let i = [...gt[t], "accent"];
	return r.fields.filter(Nt).map((e) => ({
		name: e.key,
		label: e.label,
		selector: Mt(e, i)
	}));
}, Ft = (e, t) => {
	let n = { ...e.primitive }, r = Et(e, t);
	for (let e of r?.fields ?? []) e.nullable && n[e.key] === null && (n[e.key] = Tt);
	return n;
}, It = (e, t) => {
	let n = { ...e };
	for (let e of t?.fields ?? []) e.nullable && n[e.key] === Tt && (n[e.key] = null);
	return n;
}, Lt = (e, t, n, r, i, a) => {
	let o = e.primitive;
	if ($e(o)) return;
	let s = nt(e);
	if (t === "x") {
		let e = s.x - o.x, t = r.x - e, i = r.x + r.width - s.width - e;
		Object.assign(o, { x: F(n, t, Math.max(t, i)) });
		return;
	}
	if (t === "y") {
		let e = s.y - o.y, t = r.y - e, i = r.y + r.height - s.height - e;
		Object.assign(o, { y: F(n, t, Math.max(t, i)) });
		return;
	}
	let c = a?.fields.find((e) => e.key === t && e.shape === "number" && e.section === "layout");
	if (c) {
		let e = bt(c.min, i, n), r = bt(c.max, i, n);
		Object.assign(o, { [t]: F(n, e, r) });
	}
}, Rt = (e, t, n, r, i) => {
	let a = e.items.find((e) => e.id === t);
	if (!a || a.locked) return;
	let o = I(e);
	if (a.kind === "widget") {
		n === "padding" && (a.layout.padding = F(r, 0, 128)), n === "x" && (a.frame.x = F(r, o.x, o.x + o.width - a.frame.width)), n === "y" && (a.frame.y = F(r, o.y, o.y + o.height - a.frame.height)), n === "width" && (a.frame.width = F(r, 1, o.x + o.width - a.frame.x)), n === "height" && (a.frame.height = F(r, 1, o.y + o.height - a.frame.y));
		return;
	}
	let s = a.primitive, c = Et(a, i);
	if ($e(s)) {
		if (n === "x") {
			let e = s.x_end - s.x_start;
			s.x_start = F(r, o.x, o.x + o.width - e - 1), s.x_end = s.x_start + e;
		}
		if (n === "y") {
			let e = s.y_end - s.y_start;
			s.y_start = F(r, o.y, o.y + o.height - e - 1), s.y_end = s.y_start + e;
		}
		n === "width" && (s.x_end = F(s.x_start + Math.max(1, r) - 1, s.x_start + 1, o.x + o.width - 1)), n === "height" && (s.y_end = F(s.y_start + Math.max(1, r) - 1, s.y_start + 1, o.y + o.height - 1));
	} else Lt(a, n, r, o, e.display, c);
}, zt = (e) => e.items.forEach((t) => ot(t, e)), Bt = (e, t, n) => {
	(t === "width" || t === "height") && (e.display[t] = F(n, 64, 4096)), t === "padding" && (e.display.padding = F(n, 0, Math.floor((Math.min(e.display.width, e.display.height) - 1) / 2))), t === "snapSize" && (e.display.snapSize = F(n, 1, 256)), zt(e);
}, Vt = (e, t) => {
	e.display.profileId = t.id, e.display.width = t.width, e.display.height = t.height, e.display.palette = t.defaultPalette, zt(e);
}, Ht = (e, t) => {
	e.display.palette = t, gt[t].includes(e.display.background) || (e.display.background = "white");
}, Ut = (e, t) => {
	e.display.background = t;
}, Wt = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r && (r[n] = !r[n]);
}, Gt = (e, t) => {
	e.items = e.items.filter((e) => e.id !== t);
}, Kt = (e, t, n, r) => {
	let i = [...e.items].reverse(), a = i.findIndex((e) => e.id === t);
	if (a < 0) return;
	let [o] = i.splice(a, 1), s = i.findIndex((e) => e.id === n);
	s < 0 || (i.splice(r === "before" ? s : s + 1, 0, o), e.items = i.reverse());
}, qt = (e, t, n) => {
	let r = e.items.find((e) => e.id === t);
	r?.kind === "widget" && (r.widget.config = n);
}, Jt = (e, t, n, r) => {
	let i = e.items.find((e) => e.id === t);
	if (i?.kind !== "primitive") return;
	let a = It(n, Et(i, r));
	i.primitive = {
		...i.primitive,
		...a
	};
}, Yt = (e, t, n, r) => {
	let i = I(r), a = Math.min(e.layout.defaultSize?.width ?? 240, i.width), o = Math.min(e.layout.defaultSize?.height ?? 144, i.height);
	return {
		id: mt(),
		kind: "widget",
		locked: !1,
		hidden: !1,
		widget: {
			type: e.id,
			version: e.version,
			config: structuredClone(e.defaults)
		},
		frame: {
			x: F(Math.round(t - a / 2), i.x, i.x + i.width - a),
			y: F(Math.round(n - o / 2), i.y, i.y + i.height - o),
			width: a,
			height: o
		},
		layout: { padding: 0 }
	};
}, Xt = (e, t, n, r, i) => {
	let { width: a, height: o } = i.display, s = Ct(e.find((e) => e.type === t.trim()), {
		x: Math.round(a / 2),
		y: Math.round(o / 2),
		displayWidth: a,
		displayHeight: o
	});
	if (!s) return;
	let c = {
		id: mt(),
		kind: "primitive",
		locked: !1,
		hidden: !1,
		primitive: s
	}, l = nt(c);
	return at(c, Math.round(n - (l.x + l.width / 2)), Math.round(r - (l.y + l.height / 2))), ot(c, i), c;
}, Zt = (e, t) => {
	let n = I(e), r = e.items.length * Math.max(e.display.snapSize, 5) * 3 % Math.max(1, Math.min(n.width, n.height) / 3);
	return {
		x: it(n.x + Math.min(24 + r, Math.max(0, n.width - 1)), e, t),
		y: it(n.y + Math.min(24 + r, Math.max(0, n.height - 1)), e, t)
	};
}, Qt = (e) => ({
	canUndo: !1,
	canRedo: !1,
	item: e
}), $t = (e) => e.item !== void 0, en = [
	{
		id: "undo",
		label: () => L.commands.undo,
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
		label: () => L.commands.redo,
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
		label: () => L.commands.delete,
		icon: () => "mdi:delete-outline",
		shortcuts: [{ key: "Delete" }, { key: "Backspace" }],
		isEnabled: $t,
		run: ({ item: e }, t) => {
			e && t.requestDelete(e.id);
		}
	},
	{
		id: "toggle-hidden",
		label: ({ item: e }) => e?.hidden ? L.commands.show : L.commands.hide,
		icon: ({ item: e }) => e?.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline",
		shortcuts: [],
		isEnabled: $t,
		run: ({ item: e }, t) => {
			e && t.toggleFlag(e.id, "hidden");
		}
	},
	{
		id: "toggle-locked",
		label: ({ item: e }) => e?.locked ? L.commands.unlock : L.commands.lock,
		icon: ({ item: e }) => e?.locked ? "mdi:lock" : "mdi:lock-open-variant-outline",
		shortcuts: [],
		isEnabled: $t,
		run: ({ item: e }, t) => {
			e && t.toggleFlag(e.id, "locked");
		}
	}
], tn = (e) => {
	let t = en.find((t) => t.id === e);
	if (!t) throw Error(`Unknown command ${e}`);
	return t;
}, nn = (e, t) => {
	let n = t.ctrlKey || t.metaKey;
	return t.key.toLowerCase() === e.key.toLowerCase() && n === !!e.mod && t.shiftKey === !!e.shift && !t.altKey;
}, rn = (e) => en.find((t) => t.shortcuts.some((t) => nn(t, e))), an = {
	Delete: "Del",
	Backspace: "⌫"
}, on = (e, t) => {
	let n = an[e.key] ?? e.key.toUpperCase();
	return t ? `${e.mod ? "⌘" : ""}${e.shift ? "⇧" : ""}${n}` : [
		e.mod ? "Ctrl" : "",
		e.shift ? "Shift" : "",
		n
	].filter(Boolean).join("+");
}, sn = (e, t, n = !1) => {
	let r = e.label(t), [i] = e.shortcuts;
	return {
		label: r,
		icon: e.icon(t),
		title: i ? `${r} (${on(i, n)})` : r,
		enabled: e.isEnabled(t)
	};
}, cn = (e, t = "custom") => {
	let n = vt(t);
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
}, ln = (e) => ({
	name: e.name,
	width: e.display.width,
	height: e.display.height,
	palette: e.display.palette,
	padding: e.display.padding,
	snapSize: e.display.snapSize
}), un = (e, t) => {
	let n = {
		...ln(e),
		...t
	}, r = structuredClone(e);
	return r.name = String(n.name), r.display.profileId = "custom", r.display.width = Math.round(Number(n.width) || 0), r.display.height = Math.round(Number(n.height) || 0), r.display.palette = n.palette in R ? n.palette : "bw", r.display.padding = Math.round(Number(n.padding) || 0), r.display.snapSize = Math.round(Number(n.snapSize) || 0), gt[r.display.palette].includes(r.display.background) || (r.display.background = "white"), r;
}, dn = (e) => {
	let { width: t, height: n, padding: r, snapSize: i } = e.display;
	return !!e.name.trim() && t >= 64 && t <= 4096 && n >= 64 && n <= 4096 && r >= 0 && r * 2 < Math.min(t, n) && i >= 1 && i <= 256;
}, fn = (e, t, n, r) => {
	let i = t.trim().toLocaleLowerCase(r);
	return e.filter((e) => !i || e.name.toLocaleLowerCase(r).includes(i)).sort((e, t) => n === "name" ? e.name.localeCompare(t.name, r) : t.updatedAt.localeCompare(e.updatedAt) || e.name.localeCompare(t.name, r));
}, pn = (e, t, n) => {
	let r = new Set(t.map((e) => e.name.toLocaleLowerCase(n))), i = `${e.name} copy`, a = i, o = 2;
	for (; r.has(a.toLocaleLowerCase(n));) a = `${i} ${o++}`;
	return a;
}, mn = () => [
	{
		name: "name",
		label: L.fields.name,
		required: !0,
		selector: { text: {} }
	},
	{
		name: "dimensions",
		type: "grid",
		flatten: !0,
		schema: [{
			name: "width",
			label: L.fields.width,
			required: !0,
			selector: { number: {
				mode: "box",
				min: 64,
				max: 4096,
				unit_of_measurement: "px"
			} }
		}, {
			name: "height",
			label: L.fields.height,
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
		label: L.fields.palette,
		required: !0,
		selector: { select: {
			mode: "dropdown",
			options: Object.entries(R).map(([e, t]) => ({
				value: e,
				label: t
			}))
		} }
	},
	{
		name: "advanced",
		type: "expandable",
		flatten: !0,
		title: L.fields.advanced,
		expanded: !1,
		schema: [{
			name: "padding",
			label: L.fields.padding,
			selector: { number: {
				mode: "box",
				min: 0,
				max: 1024,
				unit_of_measurement: "px"
			} }
		}, {
			name: "snapSize",
			label: L.fields.snapSize,
			selector: { number: {
				mode: "box",
				min: 1,
				max: 256,
				unit_of_measurement: "px"
			} }
		}]
	}
], hn = (e) => "label" in e ? e.label : e.title ?? "", gn = {
	bwr: "#d32f2f",
	bwry: "#d32f2f",
	bwy: "#d6a800",
	spectra6: "#246bfd"
}, _n = (e) => gn[e] ?? "#202124", vn = (e, t) => {
	let n = new Date(e.updatedAt);
	return Number.isNaN(n.getTime()) ? "" : new Intl.DateTimeFormat(t, { dateStyle: "medium" }).format(n);
}, B = (e) => e.target.value, yn = (e) => e.composedPath().some((e) => e instanceof HTMLElement && (e.matches("input, textarea, select") || e.isContentEditable)), bn = () => /Mac|iPhone|iPad/.test(navigator.platform), V = (e, t, ...n) => {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n[0],
		bubbles: !0,
		composed: !0
	}));
}, xn = 100, Sn = class {
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
		this.undoStack.push(structuredClone(e)), this.undoStack.length > xn && this.undoStack.shift(), this.redoStack = [];
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
}, Cn = (e, t, n) => e.kind === "widget" ? t.find((t) => t.id === e.widget.type) : n.find((t) => t.type === e.primitive.type), wn = (e, t, n) => {
	if (e.kind === "widget") {
		let r = e.widget.config.title;
		return typeof r == "string" && r.trim() ? r : Cn(e, t, n)?.name ?? e.widget.type;
	}
	return Cn(e, t, n)?.name ?? e.primitive.type;
}, Tn = (e, t, n) => Cn(e, t, n)?.icon ?? "mdi:puzzle", En = (e) => e.callWS({ type: "opendisplay_studio/bootstrap" }), Dn = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/create_dashboard",
	dashboard: t
})).dashboard, On = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/update_dashboard",
	dashboard_id: t.id,
	dashboard: t
})).dashboard, kn = async (e, t) => {
	await e.callWS({
		type: "opendisplay_studio/delete_dashboard",
		dashboard_id: t
	});
}, An = (e, t) => e.callWS({
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
`, jn = o`
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
`, Mn = .25, Nn = 96, Pn = 3, Fn = .1, In = {
	zoom: 1,
	panX: 0,
	panY: 0
}, Ln = (e, t) => ({
	...e,
	zoom: F(t, Mn, 4)
}), Rn = (e, t) => {
	let n = Math.max(100, e.width - Nn), r = Math.max(100, e.height - Nn);
	return {
		zoom: F(Math.min(n / t.width, r / t.height), Mn, Pn),
		panX: 0,
		panY: 0
	};
}, zn = (e, t) => t.shiftKey ? Ln(e, e.zoom + (t.deltaY < 0 ? Fn : -.1)) : t.altKey ? {
	...e,
	panX: e.panX - t.deltaY
} : {
	...e,
	panY: e.panY - t.deltaY
}, Bn = Be(class extends Ve {
	constructor(e) {
		if (super(e), e.type !== ze.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
		return D;
	}
}), Vn = (e) => {
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
var Hn = [
	.5,
	1,
	2,
	3
], Un = .25, Wn = class extends A {
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
		return E`
      <div class="zoom-controls">
        <button
          aria-label=${L.zoom.out}
          @click=${() => this.zoomTo(this.zoom - Un)}
        >
          −
        </button>
        ${Hn.map((e) => E`
            <button
              class=${this.zoom === e ? "active" : ""}
              aria-label=${L.zoom.preset(e)}
              @click=${() => this.zoomTo(e)}
            >
              ${L.zoom.preset(e)}
            </button>
          `)}
        <button
          aria-label=${L.zoom.in}
          @click=${() => this.zoomTo(this.zoom + Un)}
        >
          +
        </button>
        <button
          aria-label=${L.zoom.reset}
          @click=${() => V(this, "zoom-reset")}
        >
          ${L.zoom.reset}
        </button>
        <button
          aria-label=${L.zoom.fit}
          @click=${() => V(this, "zoom-fit")}
        >
          ${L.zoom.fit}
        </button>
      </div>
    `;
	}
};
W([M({ type: Number })], Wn.prototype, "zoom", void 0), Wn = W([j("ods-zoom-bar")], Wn);
//#endregion
//#region src/ods-canvas.ts
var Gn = 3, Kn = (e, t) => ({
	left: `${e.x / t.width * 100}%`,
	top: `${e.y / t.height * 100}%`,
	width: `${e.width / t.width * 100}%`,
	height: `${e.height / t.height * 100}%`
}), G = class extends A {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.snapEnabled = !0, this.acceptingDrop = !1, this.canUndo = !1, this.canRedo = !1, this.viewport = In;
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
		this.setViewport(In);
	}
	fitView() {
		let e = this.stage;
		e && this.setViewport(Rn({
			width: e.clientWidth,
			height: e.clientHeight
		}, this.dashboard.display));
	}
	onWheel(e) {
		e.preventDefault(), this.setViewport(zn(this.viewport, e));
	}
	beginGesture(e, t, n) {
		if (e.stopPropagation(), e.preventDefault(), V(this, "item-select", { itemId: t.id }), t.locked) return;
		this.stopGesture?.();
		let r = structuredClone(this.dashboard), i = structuredClone(t), a = this.measuredBounds(t), o = t.kind === "widget" ? this.widgets.find((e) => e.id === t.widget.type)?.layout.minSize : void 0;
		this.stopGesture = Vn({
			origin: e,
			threshold: Gn,
			onMove: (t) => {
				let r = this.canvas;
				if (!r) return;
				let s = r.getBoundingClientRect(), { width: c, height: l } = this.dashboard.display, u = Math.round((t.clientX - e.clientX) / s.width * c), d = Math.round((t.clientY - e.clientY) / s.height * l), f = n ? {
					mode: "resize",
					handle: n,
					shiftKey: t.shiftKey
				} : { mode: "move" };
				V(this, "item-transform", { item: ft(i, f, u, d, this.dashboard, {
					snapEnabled: this.snapEnabled,
					minSize: o,
					measured: a
				}) });
			},
			onEnd: (e, t) => {
				t && V(this, "item-transform-end", { before: r });
			}
		});
	}
	runCommand(e) {
		V(this, "command", { id: e });
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
		e.stopPropagation(), this.setViewport(Ln(this.viewport, e.detail.zoom));
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
		return L.canvas.resizeHandle(wn(e, this.widgets, this.primitives), L.canvas.sides[t]);
	}
	renderBadges(e) {
		return E`
      ${e.hidden ? E`
              <span class="hidden-label">${L.canvas.hidden}</span>
            ` : O}
      ${e.locked ? E`
              <ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>
            ` : O}
    `;
	}
	renderSelectionSize(e) {
		let t = Math.round(e.width), n = Math.round(e.height);
		return E`
      <output class="selection-size" aria-live="off">
        ${L.common.size(t, n)}
      </output>
    `;
	}
	renderHandles(e) {
		return Ge.map((t) => E`
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
		let t = nt(e, this.measuredBounds(e)), n = e.id === this.selectedItemId, r = Bn({
			selection: !0,
			selected: n,
			locked: e.locked,
			hidden: e.hidden
		});
		return E`
      <div
        data-item-id=${e.id}
        class=${r}
        style=${P(Kn(t, this.dashboard.display))}
        @pointerdown=${(t) => this.beginGesture(t, e)}
      >
        ${this.renderBadges(e)}
        ${n ? this.renderSelectionSize(t) : O}
        ${n && !e.locked ? this.renderHandles(e) : O}
      </div>
    `;
	}
	renderHistoryButton(e) {
		let t = sn(tn(e), {
			canUndo: this.canUndo,
			canRedo: this.canRedo
		}, bn());
		return E`
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
		let e = this.dashboard, { width: t, height: n, padding: r, snapSize: i } = e.display, a = Bn({
			"tool-toggle": !0,
			active: this.snapEnabled
		});
		return E`
      <div class="workspace-meta">
        <span>${L.common.sizeInPixels(t, n)}</span>
        <span>${L.canvas.layers(e.items.length)}</span>
        <span>${L.canvas.padding(r)}</span>
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
          <span>${L.canvas.snap(i)}</span>
        </button>
        <span class="zoom-readout">
          ${Math.round(this.viewport.zoom * 100)}%
        </span>
      </div>
    `;
	}
	renderPreview() {
		return this.preview ? E`
      <img
        draggable="false"
        src=${this.preview.imageUrl}
        alt=${L.canvas.previewAlt}
      />
    ` : E`
        <div class="canvas-placeholder">${L.canvas.rendering}</div>
      `;
	}
	renderStage() {
		let e = this.dashboard, { width: t, height: n, snapSize: r } = e.display, { zoom: i, panX: a, panY: o } = this.viewport, s = P({ transform: `translate(${a}px, ${o}px) scale(${i})` }), c = P({
			width: `${t}px`,
			height: `${n}px`
		}), l = P({
			...Kn(I(e), e.display),
			"--snap-size": `${r * i}px`
		});
		return E`
      <section
        class=${Bn({
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
		return E`
      <main class="workspace">
        ${this.renderToolbar()} ${this.renderStage()}
      </main>
    `;
	}
};
W([M({ attribute: !1 })], G.prototype, "dashboard", void 0), W([M({ attribute: !1 })], G.prototype, "preview", void 0), W([M({ attribute: !1 })], G.prototype, "widgets", void 0), W([M({ attribute: !1 })], G.prototype, "primitives", void 0), W([M()], G.prototype, "selectedItemId", void 0), W([M({ type: Boolean })], G.prototype, "snapEnabled", void 0), W([M({ type: Boolean })], G.prototype, "acceptingDrop", void 0), W([M({ type: Boolean })], G.prototype, "canUndo", void 0), W([M({ type: Boolean })], G.prototype, "canRedo", void 0), W([M({ attribute: !1 })], G.prototype, "viewport", void 0), W([Re(".canvas")], G.prototype, "canvas", void 0), W([Re(".canvas-stage")], G.prototype, "stage", void 0), G = W([j("ods-canvas")], G);
//#endregion
//#region src/ods-code-view.ts
var qn = {
	idle: "mdi:content-copy",
	copied: "mdi:check",
	failed: "mdi:alert-circle-outline"
}, Jn = 2200, Yn = class extends A {
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
			}, Jn);
		}
	}
	render() {
		return E`
      <main class="code-workspace">
        <section class="code-panel" aria-labelledby="generated-code-title">
          <header>
            <div>
              <span class="eyebrow">${L.code.eyebrow}</span>
              <h1 id="generated-code-title">${L.code.title}</h1>
              <p>${L.code.description}</p>
            </div>
            <ha-button
              appearance="plain"
              aria-label=${L.code.copyLabel}
              .disabled=${!this.preview?.yaml}
              @click=${this.copy}
            >
              <ha-icon
                slot="start"
                .icon=${qn[this.copyState]}
              ></ha-icon>
              ${L.code.copy[this.copyState]}
            </ha-button>
          </header>
          ${this.preview?.warnings.map((e) => E`
                <ha-alert alert-type="warning">${e}</ha-alert>
              `) ?? O}
          <textarea
            aria-label=${L.code.yaml}
            readonly
            spellcheck="false"
            dir="ltr"
            .value=${this.preview?.yaml ?? ""}
          ></textarea>
          <output class="copy-status" aria-live="polite">
            ${L.code.status[this.copyState]}
          </output>
        </section>
      </main>
    `;
	}
};
W([M({ attribute: !1 })], Yn.prototype, "preview", void 0), W([N()], Yn.prototype, "copyState", void 0), Yn = W([j("ods-code-view")], Yn);
//#endregion
//#region src/ods-confirm-dialog.ts
var Xn = class extends A {
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
		return E`
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
              aria-label=${L.common.close}
              @click=${this.cancel}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <p>${this.body}</p>
          <footer>
            <ha-button appearance="plain" @click=${this.cancel}>
              ${L.common.cancel}
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
W([M()], Xn.prototype, "eyebrow", void 0), W([M()], Xn.prototype, "heading", void 0), W([M()], Xn.prototype, "body", void 0), W([M()], Xn.prototype, "confirmLabel", void 0), Xn = W([j("ods-confirm-dialog")], Xn);
//#endregion
//#region src/ods-context-menu.ts
var Zn = class extends A {
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
		return E`
      <div class="menu" role="menu" aria-label=${this.label}>
        ${this.entries.map((e) => E`
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
W([M({ attribute: !1 })], Zn.prototype, "entries", void 0), W([M()], Zn.prototype, "label", void 0), Zn = W([j("ods-context-menu")], Zn);
//#endregion
//#region src/ods-dashboard-card.ts
var Qn = [
	{
		id: "rename",
		label: L.gallery.menu.rename,
		icon: "mdi:pencil-outline"
	},
	{
		id: "duplicate",
		label: L.gallery.menu.duplicate,
		icon: "mdi:content-copy"
	},
	{
		id: "settings",
		label: L.gallery.menu.settings,
		icon: "mdi:monitor-cog"
	},
	{
		id: "delete",
		label: L.gallery.menu.delete,
		icon: "mdi:delete-outline",
		danger: !0
	}
], K = class extends A {
	constructor(...e) {
		super(...e), this.language = "en", this.menuOpen = !1, this.renaming = !1, this.draftName = "";
	}
	static {
		this.styles = [
			H,
			U,
			jn,
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
		let t = Qn.find((t) => t.id === e.detail.id);
		t && (e.stopPropagation(), V(this, "dashboard-menu-action", {
			dashboard: this.dashboard,
			action: t.id
		}));
	}
	onRenameInput(e) {
		V(this, "dashboard-rename-input", { name: B(e) });
	}
	onRenameKeyDown(e) {
		e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), V(this, "dashboard-rename-commit")) : e.key === "Escape" && (e.preventDefault(), V(this, "dashboard-rename-cancel"));
	}
	commitRename() {
		V(this, "dashboard-rename-commit");
	}
	renderMiniature() {
		let { display: e } = this.dashboard;
		return E`
      <div class="dashboard-card-preview">
        <div class="dashboard-miniature" style=${P({
			aspectRatio: `${e.width} / ${e.height}`,
			background: e.background,
			"--dashboard-accent": _n(e.palette)
		})}>
          <span class="miniature-title"></span>
          <span class="miniature-accent"></span>
          <span class="miniature-line long"></span>
          <span class="miniature-line"></span>
        </div>
        <span class="dashboard-resolution">
          ${L.common.size(e.width, e.height)}
        </span>
      </div>
    `;
	}
	renderTitle() {
		let { name: e, status: t } = this.dashboard;
		return E`
      <span class="dashboard-card-title">
        ${this.renaming ? E`
                <input
                  class="dashboard-rename-input"
                  aria-label=${L.gallery.renameField(e)}
                  .value=${this.draftName}
                  @input=${this.onRenameInput}
                  @keydown=${this.onRenameKeyDown}
                  @blur=${this.commitRename}
                />
              ` : E`
                <strong>${e}</strong>
              `}
        <span class=${`status ${t}`}>${t}</span>
      </span>
    `;
	}
	renderMeta() {
		let { display: e } = this.dashboard;
		return E`
      <span class="dashboard-card-meta">
        <span>${L.common.size(e.width, e.height)}</span>
        <span
          class="palette-dots"
          aria-label=${R[e.palette]}
        >
          ${gt[e.palette].map((e) => E`
              <i style=${P({ background: e })}></i>
            `)}
        </span>
        <span>${R[e.palette]}</span>
      </span>
    `;
	}
	renderMenu() {
		return this.menuOpen ? E`
      <ods-context-menu
        class="dashboard-menu"
        id=${this.menuId}
        label=${L.gallery.menuFor(this.dashboard.name)}
        .entries=${Qn}
        @menu-select=${this.onMenuSelect}
      ></ods-context-menu>
    ` : O;
	}
	render() {
		let e = this.dashboard;
		return E`
      <article class=${Bn({
			"dashboard-card": !0,
			"menu-open": this.menuOpen
		})} data-dashboard-id=${e.id}>
        ${this.renderMiniature()}
        <div class="dashboard-card-copy">
          ${this.renderTitle()} ${this.renderMeta()}
          <small>
            ${L.gallery.updated(vn(e, this.language))}
          </small>
        </div>
        <button
          class="dashboard-card-open"
          aria-label=${L.gallery.open(e.name)}
          @click=${this.open}
        ></button>
        <button
          class="dashboard-menu-trigger"
          aria-label=${L.gallery.actionsFor(e.name)}
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
W([M({ attribute: !1 })], K.prototype, "dashboard", void 0), W([M()], K.prototype, "language", void 0), W([M({ type: Boolean })], K.prototype, "menuOpen", void 0), W([M({ type: Boolean })], K.prototype, "renaming", void 0), W([M()], K.prototype, "draftName", void 0), W([Re(".dashboard-rename-input")], K.prototype, "renameInput", void 0), K = W([j("ods-dashboard-card")], K);
//#endregion
//#region src/ods-gallery.ts
var q = class extends A {
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
			jn,
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
		this.searchText = B(e);
	}
	onSortChange(e) {
		this.sort = B(e) === "name" ? "name" : "updated";
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
		return E`
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
		return !e || !this.dialog || this.dialog === "rename" ? O : this.dialog === "delete" ? E`
        <ha-dialog
          .open=${!0}
          width="small"
          header-title=${L.gallery.deleteTitle}
          @closed=${() => V(this, "dashboard-dialog-close")}
        >
          <div class="dashboard-delete-content">
            <p>
              <strong>${e.name}</strong>
              ${L.gallery.deleteBody}
            </p>
            <p>${L.gallery.deleteWarning}</p>
          </div>
          <ha-dialog-footer slot="footer">
            <ha-button
              slot="secondaryAction"
              appearance="plain"
              @click=${() => V(this, "dashboard-dialog-close")}
            >
              ${L.common.cancel}
            </ha-button>
            <ha-button
              slot="primaryAction"
              variant="danger"
              appearance="filled"
              .disabled=${this.saving}
              @click=${() => V(this, "dashboard-delete-confirm")}
            >
              ${this.saving ? L.gallery.deleting : L.gallery.deleteAction}
            </ha-button>
          </ha-dialog-footer>
        </ha-dialog>
      ` : E`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${L.gallery.settingsTitle}
        header-subtitle=${e.name}
        @closed=${() => V(this, "dashboard-dialog-close")}
      >
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${ln(e)}
            .schema=${mn()}
            .computeLabel=${hn}
            @value-changed=${this.settingsChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => V(this, "dashboard-dialog-close")}
          >
            ${L.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !dn(e)}
            @click=${() => V(this, "dashboard-settings-save")}
          >
            ${this.saving ? L.gallery.saving : L.gallery.settingsSave}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
	render() {
		let e = fn(this.dashboards, this.searchText, this.sort, this.language);
		return E`
      <main class="dashboard-library">
        <header class="dashboard-library-header">
          <div>
            <h1>${L.gallery.title}</h1>
            <p>${L.gallery.count(this.dashboards.length)}</p>
          </div>
          <ha-button
            class="dashboard-new-button"
            appearance="filled"
            aria-label=${L.gallery.newDashboard}
            @click=${() => V(this, "dashboard-new")}
          >
            <span class="dashboard-new-button-label">
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>${L.gallery.newDashboard}</span>
            </span>
          </ha-button>
        </header>
        ${this.error ? E`
                <ha-alert alert-type="error">${this.error}</ha-alert>
              ` : O}
        <section
          class="dashboard-library-tools"
          aria-label=${L.gallery.filters}
        >
          <label class="dashboard-search">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              type="search"
              aria-label=${L.gallery.search}
              placeholder=${L.gallery.searchPlaceholder}
              .value=${this.searchText}
              @input=${this.onSearchInput}
            />
          </label>
          <label class="dashboard-sort">
            <span>${L.gallery.sort}</span>
            <select
              aria-label=${L.gallery.sortDashboards}
              .value=${this.sort}
              @change=${this.onSortChange}
            >
              <option value="updated">${L.gallery.sortUpdated}</option>
              <option value="name">${L.gallery.sortName}</option>
            </select>
          </label>
        </section>
        <section
          class="dashboard-grid"
          aria-label=${L.gallery.savedDashboards}
        >
          <button
            class="dashboard-add-card"
            aria-label=${L.gallery.addDashboard}
            @click=${() => V(this, "dashboard-new")}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            <strong>${L.gallery.newDashboard}</strong>
          </button>
          ${e.map((e) => this.renderCard(e))}
          ${e.length ? O : E`
                  <div class="dashboard-no-results">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <strong>${L.gallery.noResults}</strong>
                    <span>${L.gallery.noResultsHint}</span>
                  </div>
                `}
        </section>
      </main>
      ${this.renderDialog()}
    `;
	}
};
W([M({ attribute: !1 })], q.prototype, "dashboards", void 0), W([M({ attribute: !1 })], q.prototype, "hass", void 0), W([M()], q.prototype, "error", void 0), W([M({ type: Boolean })], q.prototype, "saving", void 0), W([M()], q.prototype, "dialog", void 0), W([M({ attribute: !1 })], q.prototype, "draft", void 0), W([N()], q.prototype, "searchText", void 0), W([N()], q.prototype, "sort", void 0), W([N()], q.prototype, "menuDashboardId", void 0), q = W([j("ods-gallery")], q);
//#endregion
//#region src/ods-header.ts
var $n = class extends A {
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
		V(this, "dashboard-name-change", { name: B(e) });
	}
	get statusToggleLabel() {
		return this.dashboard.status === "ready" ? L.header.setDraft : L.header.setReady;
	}
	render() {
		let e = this.dashboard;
		return E`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">${L.header.studio}</strong>
          <span class="breadcrumb-divider">/</span>
          <button
            class="breadcrumb-link"
            @click=${() => V(this, "show-dashboards")}
          >
            ${L.header.dashboards}
          </button>
          <span class="breadcrumb-divider">/</span>
          <input
            class="dashboard-name"
            aria-label=${L.header.name}
            .value=${e.name}
            @input=${this.onNameInput}
          />
        </div>
        <nav class="view-switch" aria-label=${L.header.view}>
          <button
            class=${this.view === "design" ? "active" : ""}
            aria-pressed=${this.view === "design"}
            @click=${() => V(this, "view-change", { view: "design" })}
          >
            <ha-icon icon="mdi:tools"></ha-icon>
            ${L.header.design}
          </button>
          <button
            class=${this.view === "code" ? "active" : ""}
            aria-pressed=${this.view === "code"}
            @click=${() => V(this, "view-change", { view: "code" })}
          >
            <ha-icon icon="mdi:code-tags"></ha-icon>
            ${L.header.code}
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
            ${this.saving ? L.header.saving : L.header.save}
          </ha-button>
        </div>
      </header>
    `;
	}
};
W([M({ attribute: !1 })], $n.prototype, "dashboard", void 0), W([M()], $n.prototype, "view", void 0), W([M({ type: Boolean })], $n.prototype, "dirty", void 0), W([M({ type: Boolean })], $n.prototype, "saving", void 0), $n = W([j("ods-header")], $n);
//#endregion
//#region src/ods-property-field.ts
var J = class extends A {
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
			value: B(e)
		});
	}
	render() {
		return E`
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
W([M()], J.prototype, "label", void 0), W([M()], J.prototype, "fieldKey", void 0), W([M({ type: Number })], J.prototype, "value", void 0), W([M({ type: Number })], J.prototype, "min", void 0), W([M({ type: Number })], J.prototype, "max", void 0), W([M({ type: Boolean })], J.prototype, "disabled", void 0), J = W([j("ods-property-field")], J);
//#endregion
//#region src/ods-structure.ts
var er = 4, Y = class extends A {
	constructor(...e) {
		super(...e), this.items = [], this.widgets = [], this.primitives = [], this.selectedItemId = "", this.draggingId = "";
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
		e.button === 0 && (e.stopPropagation(), e.preventDefault(), this.stopGesture = Vn({
			origin: e,
			threshold: er,
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
	runCommand(e, t, n) {
		e.stopPropagation(), V(this, "command", {
			id: t,
			itemId: n.id
		});
	}
	renderCommandButton(e, t, n) {
		let r = sn(tn(e), Qt(t), bn());
		return E`
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
		V(this, "inspector-collapse", { collapsed: !0 });
	}
	selectItem(e) {
		V(this, "item-select", { itemId: e.id });
	}
	onRowKeyDown(e, t) {
		e.target === e.currentTarget && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.selectItem(t));
	}
	renderRow(e) {
		let t = wn(e, this.widgets, this.primitives), n = this.dropTarget?.itemId === e.id ? this.dropTarget.edge : void 0, r = Bn({
			"layer-row": !0,
			active: e.id === this.selectedItemId,
			"is-hidden": e.hidden,
			dragging: e.id === this.draggingId,
			"drop-before": n === "before",
			"drop-after": n === "after"
		});
		return E`
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
          title=${L.structure.reorderTitle}
          aria-label=${L.structure.reorder(t)}
          @pointerdown=${(t) => this.startDrag(t, e.id)}
        >
          <ha-icon icon="mdi:drag-vertical"></ha-icon>
        </button>
        <ha-icon
          class="layer-type-icon"
          .icon=${Tn(e, this.widgets, this.primitives)}
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
		return e.kind === "widget" ? L.structure.widget : e.primitive.type;
	}
	render() {
		let e = [...this.items].reverse();
		return E`
      <section class="layers">
        <header>
          <div>
            <span class="eyebrow">${L.structure.title}</span>
            <h2>${L.structure.heading}</h2>
          </div>
          <div class="layers-header-actions">
            <span class="count">${e.length}</span>
            <button
              class="icon-button"
              title=${L.structure.collapse}
              aria-label=${L.structure.collapse}
              @click=${this.collapse}
            >
              <ha-icon icon="mdi:chevron-right"></ha-icon>
            </button>
          </div>
        </header>
        <div class="layer-list" role="tree">
          ${e.length ? e.map((e) => this.renderRow(e)) : E`
                  <p class="empty-layers">${L.structure.empty}</p>
                `}
        </div>
      </section>
    `;
	}
};
W([M({ attribute: !1 })], Y.prototype, "items", void 0), W([M({ attribute: !1 })], Y.prototype, "widgets", void 0), W([M({ attribute: !1 })], Y.prototype, "primitives", void 0), W([M()], Y.prototype, "selectedItemId", void 0), W([N()], Y.prototype, "draggingId", void 0), W([N()], Y.prototype, "dropTarget", void 0), Y = W([j("ods-structure")], Y);
//#endregion
//#region src/ods-inspector.ts
var tr = 286, nr = 560, rr = [
	"width",
	"height",
	"padding",
	"snapSize"
], ir = (e) => rr.some((t) => t === e), ar = (e) => e.label, X = class extends A {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.collapsed = !1, this.width = 350;
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
		this.stopGesture = Vn({
			origin: e,
			onMove: (e) => {
				let r = n + t - e.clientX;
				V(this, "inspector-resize", { width: F(r, tr, nr) });
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
		n !== void 0 && ir(t) && V(this, "display-number-change", {
			key: t,
			value: n
		});
	}
	onProfileChange(e) {
		V(this, "profile-change", { profileId: B(e) });
	}
	onPaletteChange(e) {
		let t = B(e);
		yt(t) && V(this, "palette-change", { palette: t });
	}
	onBackgroundChange(e) {
		V(this, "background-change", { color: B(e) });
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
		V(this, "command", {
			id: "toggle-locked",
			itemId: e.id
		});
	}
	requestItemDelete(e) {
		V(this, "command", {
			id: "delete-item",
			itemId: e.id
		});
	}
	renderHeader(e, t, n) {
		return E`
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
		return E`
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
		if (!e) return O;
		let { timings: t } = e, n = L.inspector.metrics, r = [
			[n.queue, t.queue],
			[n.data, t.data],
			[n.compile, t.compile],
			[n.render, t.render],
			[n.encode, t.encode],
			[n.total, t.pipeline]
		];
		return E`
      ${e.warnings.map((e) => E`
          <ha-alert class="warning" alert-type="warning">${e}</ha-alert>
        `)}
      <details class="inspector-section telemetry">
        <summary>${L.inspector.diagnostics}</summary>
        <div class="section-body metrics">
          ${r.map(([e, t]) => E`
              <span>${e}</span>
              <strong>${L.common.milliseconds(t)}</strong>
            `)}
        </div>
      </details>
    `;
	}
	renderDisplayField(e, t, n, r) {
		return E`
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
		return E`
      <label class="stack-field">
        ${L.inspector.displayType}
        <select @change=${this.onProfileChange}>
          ${_t.map((t) => E`
              <option value=${t.id} ?selected=${t.id === e}>
                ${t.manufacturer} · ${t.name}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderPaletteSelect() {
		let { profileId: e, palette: t } = this.dashboard.display, n = vt(e), r = n.id === "custom" ? Object.keys(R).filter(yt) : n.palettes;
		return E`
      <label class="stack-field">
        ${L.fields.palette}
        <select @change=${this.onPaletteChange}>
          ${r.map((e) => E`
              <option value=${e} ?selected=${e === t}>
                ${R[e]}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderBackgroundSelect() {
		let { palette: e, background: t } = this.dashboard.display;
		return E`
      <label class="stack-field">
        ${L.fields.background}
        <select @change=${this.onBackgroundChange}>
          ${gt[e].map((e) => E`
              <option value=${e} ?selected=${e === t}>
                ${e[0].toUpperCase()}${e.slice(1)}
              </option>
            `)}
        </select>
      </label>
    `;
	}
	renderDashboardInspector() {
		return E`
      ${this.renderHeader(L.inspector.dashboard, L.inspector.dashboardHint, "mdi:monitor")}
      <details class="inspector-section" open>
        <summary>${L.inspector.display}</summary>
        <div class="section-body">
          ${this.renderProfileSelect()}
          <div class="field-grid">
            ${this.renderDisplayField(L.fields.width, "width", 64, 4096)}
            ${this.renderDisplayField(L.fields.height, "height", 64, 4096)}
          </div>
          <div class="field-grid">
            ${this.renderPaletteSelect()} ${this.renderBackgroundSelect()}
          </div>
        </div>
      </details>
      <details class="inspector-section" open>
        <summary>${L.inspector.workingArea}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${this.renderDisplayField(L.fields.padding, "padding", 0, 1024)}
            ${this.renderDisplayField(L.fields.snapSize, "snapSize", 1, 256)}
          </div>
          <p class="field-help">${L.inspector.workingAreaHelp}</p>
        </div>
      </details>
      ${this.renderDangerZone(L.inspector.deleteDashboard, this.requestDashboardDelete)}
      ${this.renderMetrics()}
    `;
	}
	renderLayoutField(e, t) {
		return E`
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
		return e.locked ? E`
      <div class="locked-notice">
        <span>
          <ha-icon icon="mdi:lock"></ha-icon>
          ${L.inspector.locked}
        </span>
        <button
          type="button"
          aria-label=${L.inspector.unlockElement}
          @click=${() => this.unlock(e)}
        >
          ${L.inspector.unlock}
        </button>
      </div>
    ` : O;
	}
	renderLayoutSection(e) {
		let { grid: t, extra: n } = jt(e, this.dashboard, this.primitives);
		return E`
      <details class="inspector-section" open>
        <summary>${L.inspector.layout}</summary>
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
		return E`
      <details class="inspector-section" open>
        <summary>${L.inspector.widgetSettings}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${e.widget.config}
            .schema=${t}
            .computeLabel=${ar}
            @value-changed=${this.onWidgetConfigChange}
          ></ha-form>
        </div>
      </details>
    `;
	}
	renderAppearance(e) {
		let t = Ft(e, this.primitives), n = Pt(e, this.dashboard.display.palette, this.primitives);
		return E`
      <details class="inspector-section" open>
        <summary>${L.inspector.appearance}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${t}
            .schema=${n}
            .computeLabel=${ar}
            @value-changed=${this.onPrimitiveChange}
          ></ha-form>
        </div>
      </details>
    `;
	}
	renderItemInspector(e) {
		let t = e.kind === "widget" ? L.inspector.kindWidget : L.inspector.kindPrimitive;
		return E`
      ${this.renderHeader(wn(e, this.widgets, this.primitives), L.inspector.subtitle(t, e.locked), Tn(e, this.widgets, this.primitives))}
      ${this.renderLockedNotice(e)} ${this.renderLayoutSection(e)}
      ${e.kind === "widget" ? this.renderWidgetSettings(e) : this.renderAppearance(e)}
      ${this.renderDangerZone(L.inspector.removeElement, () => this.requestItemDelete(e))}
      ${this.renderMetrics()}
    `;
	}
	renderRail() {
		return E`
      <aside class="panel panel-rail right-rail">
        <button
          class="icon-button"
          title=${L.inspector.expand}
          aria-label=${L.inspector.expand}
          @click=${this.expand}
        >
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <span class="rail-label">${L.inspector.rail}</span>
      </aside>
    `;
	}
	render() {
		if (this.collapsed) return this.renderRail();
		let e = this.dashboard.items.find((e) => e.id === this.selectedItemId);
		return E`
      <aside class="panel inspector">
        <div
          class="panel-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label=${L.inspector.resize}
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
W([M({ attribute: !1 })], X.prototype, "hass", void 0), W([M({ attribute: !1 })], X.prototype, "dashboard", void 0), W([M({ attribute: !1 })], X.prototype, "widgets", void 0), W([M({ attribute: !1 })], X.prototype, "primitives", void 0), W([M({ attribute: !1 })], X.prototype, "preview", void 0), W([M()], X.prototype, "selectedItemId", void 0), W([M({ type: Boolean })], X.prototype, "collapsed", void 0), W([M({ type: Number })], X.prototype, "width", void 0), W([Re(".properties")], X.prototype, "propertiesPanel", void 0), X = W([j("ods-inspector")], X);
//#endregion
//#region src/catalog.ts
var or = (e, t) => {
	let n = t.trim().toLocaleLowerCase();
	return n ? e.filter((e) => `${e.name} ${e.description}`.toLocaleLowerCase().includes(n)) : e;
}, sr = 4, Z = class extends A {
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
		this.stopGesture = Vn({
			origin: e,
			threshold: sr,
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
		this.searchText = B(e);
	}
	addFromClick(e) {
		this.suppressClick || V(this, "catalog-add", { value: e });
	}
	renderEntry(e, t) {
		let n = `${t}:${e.id}`;
		return E`
      <button
        class="catalog-item"
        title=${L.library.entryHint(e.description)}
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
		return e.length ? E`
      ${e.map((e) => this.renderEntry(e, t))}
    ` : E`
        <p class="empty-result">${n}</p>
      `;
	}
	renderGhost() {
		let e = this.ghost;
		if (!e) return O;
		let t = P({
			left: `${e.x}px`,
			top: `${e.y}px`,
			width: `${e.width}px`,
			height: `${e.height}px`
		});
		return E`
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
		if (this.collapsed) return E`
        <aside class="panel panel-rail">
          <button
            class="icon-button"
            title=${L.library.expand}
            aria-label=${L.library.expand}
            @click=${() => V(this, "library-collapse", { collapsed: !1 })}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <span class="rail-label">${L.library.title}</span>
        </aside>
      `;
		let e = or(this.widgets, this.searchText), t = or(this.primitives, this.searchText).map((e) => ({
			...e,
			id: e.type
		}));
		return E`
      ${this.renderGhost()}
      <aside class="panel toolbox">
        <div class="panel-title">
          <div>
            <span class="eyebrow">${L.library.title}</span>
            <h2>${L.library.heading}</h2>
          </div>
          <button
            class="icon-button"
            title=${L.library.collapse}
            aria-label=${L.library.collapse}
            @click=${() => V(this, "library-collapse", { collapsed: !0 })}
          >
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
        </div>
        <label class="search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            aria-label=${L.library.search}
            placeholder=${L.library.searchPlaceholder}
            .value=${this.searchText}
            @input=${this.onSearchInput}
          />
        </label>
        <div class="catalog-scroll">
          <section class="catalog-section">
            <header>
              <span>${L.library.widgets}</span>
              <span class="count">${e.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(e, "widget", L.library.noWidgets)}
            </div>
          </section>
          <section class="catalog-section">
            <header>
              <span>${L.library.primitives}</span>
              <span class="count">${t.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(t, "primitive", L.library.noPrimitives)}
            </div>
          </section>
        </div>
      </aside>
    `;
	}
};
W([M({ attribute: !1 })], Z.prototype, "widgets", void 0), W([M({ attribute: !1 })], Z.prototype, "primitives", void 0), W([M({ type: Boolean })], Z.prototype, "collapsed", void 0), W([N()], Z.prototype, "searchText", void 0), W([N()], Z.prototype, "ghost", void 0), Z = W([j("ods-library")], Z);
//#endregion
//#region src/ods-new-dashboard-dialog.ts
var cr = class extends A {
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
		return E`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${L.newDashboard.title}
        header-subtitle=${L.newDashboard.subtitle}
        @closed=${() => V(this, "new-dashboard-close")}
      >
        <div class="new-dashboard-content">
          <span class="form-label">${L.newDashboard.startFrom}</span>
          <div
            class="dashboard-source-options"
            role="radiogroup"
            aria-label=${L.newDashboard.sources}
          >
            <button
              class="dashboard-source selected"
              type="button"
              role="radio"
              aria-checked="true"
            >
              <ha-icon icon="mdi:monitor"></ha-icon>
              <span>
                <strong>${L.newDashboard.customSize}</strong>
                <small>${L.newDashboard.customSizeHint}</small>
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
                <strong>${L.newDashboard.fromDevice}</strong>
                <small>${L.newDashboard.fromDeviceHint}</small>
              </span>
            </button>
          </div>
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${ln(this.dashboard)}
            .schema=${mn()}
            .computeLabel=${hn}
            @value-changed=${this.formChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => V(this, "new-dashboard-close")}
          >
            ${L.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !dn(this.dashboard)}
            @click=${() => V(this, "dashboard-create")}
          >
            ${this.saving ? L.newDashboard.creating : L.newDashboard.create}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
};
W([M({ attribute: !1 })], cr.prototype, "hass", void 0), W([M({ attribute: !1 })], cr.prototype, "dashboard", void 0), W([M({ type: Boolean })], cr.prototype, "saving", void 0), cr = W([j("ods-new-dashboard-dialog")], cr);
//#endregion
//#region src/ods-app.ts
var lr = 220, Q = (e, t) => e instanceof Error && e.message ? e.message : typeof e == "string" && e ? e : t, $ = class extends A {
	constructor(...e) {
		super(...e), this.dashboards = [], this.view = "dashboards", this.widgets = [], this.primitives = [], this.selectedItemId = "", this.loading = !0, this.saving = !1, this.dirty = !1, this.error = "", this.draggingCatalog = !1, this.undoCount = 0, this.redoCount = 0, this.pendingDeleteItemId = "", this.leftCollapsed = !1, this.rightCollapsed = !1, this.inspectorWidth = 350, this.snapEnabled = !0, this.viewport = In, this.newDashboardOpen = !1, this.newDashboard = cn("en"), this.previewRequest = 0, this.bootstrapStarted = !1, this.history = new Sn(), this.undo = () => {
			this.current && this.restore(this.history.undo(this.current));
		}, this.redo = () => {
			this.current && this.restore(this.history.redo(this.current));
		}, this.commandActions = {
			undo: () => this.undo(),
			redo: () => this.redo(),
			requestDelete: (e) => {
				this.pendingDeleteItemId = e;
			},
			toggleFlag: (e, t) => this.mutate((n) => Wt(n, e, t))
		}, this.onKeyDown = (e) => {
			if (this.view !== "design" || yn(e)) return;
			let t = rn(e);
			t?.isEnabled(this.commandContext(this.selectedItem)) && (e.preventDefault(), this.runCommand(t.id));
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
		super.connectedCallback(), window.addEventListener("keydown", this.onKeyDown);
	}
	firstUpdated() {
		this.ensureBootstrap();
	}
	updated(e) {
		e.has("hass") && this.ensureBootstrap();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.previewTimer && window.clearTimeout(this.previewTimer), window.removeEventListener("keydown", this.onKeyDown);
	}
	ensureBootstrap() {
		!this.hass || this.bootstrapStarted || (this.bootstrapStarted = !0, this.bootstrap());
	}
	async bootstrap() {
		let e = this.hass;
		if (e) {
			this.loading = !0, this.error = "";
			try {
				let t = await En(e);
				this.dashboards = t.dashboards, this.widgets = t.widgets, this.primitives = t.primitives, this.current = void 0, this.preview = void 0, this.view = "dashboards", this.clearHistory(), this.newDashboard = cn(e.language);
			} catch (e) {
				this.error = Q(e, L.app.loadFailed);
			} finally {
				this.loading = !1;
			}
		}
	}
	openNewDashboard() {
		this.newDashboard = cn(this.language), this.newDashboardOpen = !0;
	}
	async createDashboard() {
		if (this.hass) {
			this.saving = !0, this.error = "";
			try {
				let e = await Dn(this.hass, this.newDashboard);
				this.dashboards = [...this.dashboards, e], this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.newDashboardOpen = !1, this.view = "design", this.clearHistory(), await this.composePreview(), await this.updateComplete, this.showWholeCanvas();
			} catch (e) {
				this.error = Q(e, L.app.createFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveDashboard() {
		if (!(!this.hass || !this.current)) {
			this.saving = !0, this.error = "";
			try {
				let e = await On(this.hass, this.current);
				this.current = structuredClone(e), this.dashboards = this.dashboards.map((t) => t.id === e.id ? e : t), this.dirty = !1;
			} catch (e) {
				this.error = Q(e, L.app.saveFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async deleteDashboard() {
		if (!this.hass || !this.current) return;
		let e = this.current.id;
		try {
			await kn(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.view = "dashboards", this.clearHistory();
		} catch (e) {
			this.error = Q(e, L.app.deleteFailed);
		}
	}
	openDashboard(e) {
		if (this.current?.id === e.id) {
			this.view = "design", this.preview || this.composePreview();
			return;
		}
		this.dirty && !window.confirm(L.app.discardChanges) || (this.current = structuredClone(e), this.selectedItemId = "", this.dirty = !1, this.clearHistory(), this.view = "design", this.composePreview().then(() => this.showWholeCanvas()));
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
				let t = await On(this.hass, e);
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
			this.error = L.app.renameEmpty;
			return;
		}
		if (this.dashboards.find((t) => t.id === e.id)?.name === e.name) {
			this.closeAction();
			return;
		}
		await this.updateFromGallery(e, L.app.renameFailed) && this.closeAction();
	}
	async duplicateDashboard(e) {
		if (!this.hass || this.saving) return;
		this.saving = !0, this.error = "";
		let t = structuredClone(e);
		t.id = "", t.name = pn(e, this.dashboards, this.language), t.status = "draft", t.createdAt = "", t.updatedAt = "";
		try {
			let e = await Dn(this.hass, t);
			this.dashboards = [...this.dashboards, e];
		} catch (e) {
			this.error = Q(e, L.app.duplicateFailed);
		} finally {
			this.saving = !1;
		}
	}
	async saveSettings() {
		if (this.dashboardDialog !== "settings" || !this.dashboardDraft || !dn(this.dashboardDraft)) return;
		let e = structuredClone(this.dashboardDraft);
		e.name = e.name.trim(), await this.updateFromGallery(e, L.app.settingsFailed) && this.closeAction();
	}
	async confirmDeleteDashboard() {
		if (this.dashboardDialog !== "delete" || !this.dashboardDraft || !this.hass || this.saving) return;
		let e = this.dashboardDraft.id;
		this.saving = !0, this.error = "";
		try {
			await kn(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current?.id === e && (this.current = void 0, this.selectedItemId = "", this.preview = void 0, this.dirty = !1, this.clearHistory()), this.closeAction();
		} catch (e) {
			this.error = Q(e, L.app.deleteFailed);
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
		let n = tn(e), r = this.commandContext(t);
		n.isEnabled(r) && n.run(r, this.commandActions);
	}
	onCommand(e) {
		let { id: t, itemId: n } = e.detail, r = n ? this.current?.items.find((e) => e.id === n) : void 0;
		this.runCommand(t, r ?? this.selectedItem);
	}
	schedulePreview() {
		this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.composePreview(), lr);
	}
	async composePreview() {
		if (!this.hass || !this.current) return;
		this.error = "";
		let e = ++this.previewRequest;
		try {
			let t = await An(this.hass, this.current);
			e === this.previewRequest && (this.preview = t);
		} catch (e) {
			this.error = Q(e, L.app.previewFailed);
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
			e && (o = Yt(e, t, n, r));
		} else if (i === "primitive" && (o = Xt(this.primitives, a, t, n, r), !o)) {
			this.error = L.app.unsupportedPrimitive(a);
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
		let { x: t, y: n } = Zt(this.current, this.snapEnabled);
		this.addAt(e, t, n);
	}
	dropFromCatalog(e, t, n) {
		let r = this.current, i = this.canvas?.displayPointAt(t, n);
		if (!r || !i) return;
		let a = I(r);
		this.addAt(e, F(it(i.x, r, this.snapEnabled), a.x, a.x + a.width - 1), F(it(i.y, r, this.snapEnabled), a.y, a.y + a.height - 1));
	}
	confirmDeleteItem() {
		let e = this.pendingDeleteItemId;
		e && (this.pendingDeleteItemId = "", this.mutate((t) => Gt(t, e)), this.selectedItemId === e && this.selectItem(""));
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
		this.dashboardDraft &&= un(this.dashboardDraft, e.detail.value);
	}
	onNewDashboardChange(e) {
		this.newDashboard = un(this.newDashboard, e.detail.value);
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
		this.mutate((e) => Kt(e, t, n, r));
	}
	onItemNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => Rt(e, this.selectedItemId, t, n, this.primitives));
	}
	onDisplayNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => Bt(e, t, n));
	}
	onProfileChange(e) {
		let t = vt(e.detail.profileId);
		this.mutate((e) => Vt(e, t)), requestAnimationFrame(() => this.canvas?.fitView());
	}
	onPaletteChange(e) {
		this.mutate((t) => Ht(t, e.detail.palette));
	}
	onBackgroundChange(e) {
		this.mutate((t) => Ut(t, e.detail.color));
	}
	onWidgetConfigChange(e) {
		let t = e.detail.value;
		this.mutate((e) => qt(e, this.selectedItemId, t));
	}
	onPrimitiveChange(e) {
		let { value: t } = e.detail;
		this.mutate((e) => Jt(e, this.selectedItemId, t, this.primitives));
	}
	renderDeleteDialog() {
		let e = this.current?.items.find((e) => e.id === this.pendingDeleteItemId);
		return e ? E`
      <ods-confirm-dialog
        eyebrow=${L.app.confirmRemoval}
        heading=${L.app.deleteElementTitle(wn(e, this.widgets, this.primitives))}
        body=${L.app.deleteElementBody}
        confirmLabel=${L.app.deleteElement}
        @confirm-accept=${this.confirmDeleteItem}
        @confirm-cancel=${this.cancelDeleteItem}
      ></ods-confirm-dialog>
    ` : O;
	}
	renderNewDashboardDialog() {
		return this.newDashboardOpen ? E`
      <ods-new-dashboard-dialog
        .hass=${this.hass}
        .dashboard=${this.newDashboard}
        .saving=${this.saving}
        @new-dashboard-change=${this.onNewDashboardChange}
        @new-dashboard-close=${this.closeNewDashboard}
        @dashboard-create=${this.createDashboard}
      ></ods-new-dashboard-dialog>
    ` : O;
	}
	renderGallery() {
		return E`
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
		return E`
      <div
        class="layout"
        style=${P({
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
          @dashboard-delete-request=${this.deleteDashboard}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()}
    `;
	}
	renderError() {
		return this.error ? E`
      <ha-alert alert-type="error">${this.error}</ha-alert>
    ` : O;
	}
	renderEditor(e) {
		return E`
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
        ${this.view === "code" ? E`
                <ods-code-view .preview=${this.preview}></ods-code-view>
              ` : this.renderDesign(e)}
      </div>
    `;
	}
	render() {
		if (this.loading) return E`
        <div class="dashboard-empty">
          <p>${L.app.loading}</p>
        </div>
      `;
		let e = this.current;
		return this.view === "dashboards" || !e ? this.renderGallery() : this.renderEditor(e);
	}
};
W([M({ attribute: !1 })], $.prototype, "hass", void 0), W([N()], $.prototype, "dashboards", void 0), W([N()], $.prototype, "view", void 0), W([N()], $.prototype, "widgets", void 0), W([N()], $.prototype, "primitives", void 0), W([N()], $.prototype, "current", void 0), W([N()], $.prototype, "selectedItemId", void 0), W([N()], $.prototype, "preview", void 0), W([N()], $.prototype, "loading", void 0), W([N()], $.prototype, "saving", void 0), W([N()], $.prototype, "dirty", void 0), W([N()], $.prototype, "error", void 0), W([N()], $.prototype, "draggingCatalog", void 0), W([N()], $.prototype, "undoCount", void 0), W([N()], $.prototype, "redoCount", void 0), W([N()], $.prototype, "pendingDeleteItemId", void 0), W([N()], $.prototype, "leftCollapsed", void 0), W([N()], $.prototype, "rightCollapsed", void 0), W([N()], $.prototype, "inspectorWidth", void 0), W([N()], $.prototype, "snapEnabled", void 0), W([N()], $.prototype, "viewport", void 0), W([N()], $.prototype, "newDashboardOpen", void 0), W([N()], $.prototype, "newDashboard", void 0), W([N()], $.prototype, "dashboardDialog", void 0), W([N()], $.prototype, "dashboardDraft", void 0), W([Re("ods-canvas")], $.prototype, "canvas", void 0), $ = W([j("ods-app")], $);
//#endregion
export { $ as OdsApp };
