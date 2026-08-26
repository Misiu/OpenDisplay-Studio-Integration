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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, re = f.trustedTypes, ie = re ? re.emptyScript : "", ae = f.reactiveElementPolyfillSupport, p = (e, t) => e, m = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ie : null;
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
}, h = (e, t) => !l(e, t), oe = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	useDefault: !1,
	hasChanged: h
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var g = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = oe) {
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
		return this.elementProperties.get(e) ?? oe;
	}
	static _$Ei() {
		if (this.hasOwnProperty(p("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(p("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(p("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? m : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? m : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? h)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
g.elementStyles = [], g.shadowRootOptions = { mode: "open" }, g[p("elementProperties")] = /* @__PURE__ */ new Map(), g[p("finalized")] = /* @__PURE__ */ new Map(), ae?.({ ReactiveElement: g }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var se = globalThis, ce = (e) => e, _ = se.trustedTypes, le = _ ? _.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ue = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + v, fe = `<${de}>`, y = document, b = () => y.createComment(""), x = (e) => e === null || typeof e != "object" && typeof e != "function", S = Array.isArray, pe = (e) => S(e) || typeof e?.[Symbol.iterator] == "function", C = "[ 	\n\f\r]", w = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, he = />/g, T = RegExp(`>|${C}(?:([^\\s"'>=/]+)(${C}*=${C}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), ge = /'/g, _e = /"/g, ve = /^(?:script|style|textarea|title)$/i, E = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), D = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), ye = /* @__PURE__ */ new WeakMap(), k = y.createTreeWalker(y, 129);
function be(e, t) {
	if (!S(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return le === void 0 ? t : le.createHTML(t);
}
var xe = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = w;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === w ? c[1] === "!--" ? o = me : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = T) : (ve.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = T) : o = he : o === T ? c[0] === ">" ? (o = i ?? w, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? T : c[3] === "\"" ? _e : ge) : o === _e || o === ge ? o = T : o === me || o === he ? o = w : (o = T, i = void 0);
		let d = o === T && e[t + 1].startsWith("/>") ? " " : "";
		a += o === w ? n + fe : l >= 0 ? (r.push(s), n.slice(0, l) + ue + n.slice(l) + v + d) : n + v + (l === -2 ? t : d);
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
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ue)) {
					let t = u[o++], n = i.getAttribute(e).split(v), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Te : r[1] === "?" ? Ee : r[1] === "@" ? De : j
					}), i.removeAttribute(e);
				} else e.startsWith(v) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (ve.test(i.tagName)) {
					let e = i.textContent.split(v), t = e.length - 1;
					if (t > 0) {
						i.textContent = _ ? _.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], b()), k.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], b());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === de) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(v, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += v.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = y.createElement("template");
		return n.innerHTML = e, n;
	}
};
function A(e, t, n = e, r) {
	if (t === D) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = x(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = A(e, i._$AS(e, t.values), i, r)), t;
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? y).importNode(t, !0);
		k.currentNode = r;
		let i = k.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new we(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Oe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = k.nextNode(), a++);
		}
		return k.currentNode = y, r;
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
		e = A(this, e, t), x(e) ? e === O || e == null || e === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : e !== this._$AH && e !== D && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== O && x(this._$AH) ? this._$AA.nextSibling.data = e : this.T(y.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Se.createElement(be(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ce(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ye.get(e.strings);
		return t === void 0 && ye.set(e.strings, t = new Se(e)), t;
	}
	k(t) {
		S(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(b()), this.O(b()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ce(e).nextSibling;
			ce(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, j = class {
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
		if (i === void 0) e = A(this, e, t, 0), a = !x(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = A(this, r[n + o], t, o), s === D && (s = this._$AH[o]), a ||= !x(s) || s !== this._$AH[o], s === O ? e = O : e !== O && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Te = class extends j {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === O ? void 0 : e;
	}
}, Ee = class extends j {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== O);
	}
}, De = class extends j {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = A(this, e, t, 0) ?? O) === D) return;
		let n = this._$AH, r = e === O && n !== O || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== O && (n === O || r);
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
		A(this, e);
	}
}, ke = se.litHtmlPolyfillSupport;
ke?.(Se, we), (se.litHtmlVersions ??= []).push("3.3.3");
var Ae = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new we(t.insertBefore(b(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, M = globalThis, N = class extends g {
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
		return D;
	}
};
N._$litElement$ = !0, N.finalized = !0, M.litElementHydrateSupport?.({ LitElement: N });
var je = M.litElementPolyfillSupport;
je?.({ LitElement: N }), (M.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var Me = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Ne = {
	attribute: !0,
	type: String,
	converter: m,
	reflect: !1,
	hasChanged: h
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
function Fe(e) {
	return (t, n) => typeof n == "object" ? Pe(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function P(e) {
	return Fe({
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
function F(e, t) {
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
		return D;
	}
}), He = "M7 11H9V13H7V11M21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H6V1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5M5 7H19V5H5V7M19 19V9H5V19H19M15 13V11H17V13H15M11 13V11H13V13H11M7 15H9V17H7V15M15 17V15H17V17H15M11 17V15H13V17H11Z", Ue = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z", We = "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z", Ge = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z", Ke = "M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z", qe = "M19 8C20.11 8 21 8.9 21 10V16.76C21.61 17.31 22 18.11 22 19C22 20.66 20.66 22 19 22C17.34 22 16 20.66 16 19C16 18.11 16.39 17.31 17 16.76V10C17 8.9 17.9 8 19 8M19 9C18.45 9 18 9.45 18 10V11H20V10C20 9.45 19.55 9 19 9M12 5.69L7 10.19V18H14.1L14 19L14.1 20H5V12H2L12 3L16.4 6.96C15.89 7.4 15.5 7.97 15.25 8.61L12 5.69Z", Je = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z", Ye = "M15 16L11 20H21V16H15M12.06 7.19L3 16.25V20H6.75L15.81 10.94L12.06 7.19M5.92 18H5V17.08L12.06 10L13 10.94L5.92 18M18.71 8.04C19.1 7.65 19.1 7 18.71 6.63L16.37 4.29C16.17 4.09 15.92 4 15.66 4C15.41 4 15.15 4.1 14.96 4.29L13.13 6.12L16.88 9.87L18.71 8.04Z", Xe = "M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z", Ze = "M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z", Qe = o`
  :host {
    --odx-blue: var(--primary-color, #03a9f4);
    --odx-blue-strong: #0086c5;
    --odx-ink: var(--primary-text-color, #182026);
    --odx-muted: var(--secondary-text-color, #66727a);
    --odx-canvas: var(--primary-background-color, #f4f6f7);
    --odx-surface: var(--card-background-color, #ffffff);
    --odx-line: var(--divider-color, #dfe4e7);
    --odx-warning: var(--warning-color, #f4a000);
    --odx-danger: var(--error-color, #db4437);
    --odx-radius: var(--ha-card-border-radius, 14px);
    --odx-canvas-max-width: 880px;
    --odx-canvas-max-height: 520px;
    display: block;
    min-width: 320px;
    min-height: 100svh;
    color: var(--odx-ink);
    background: var(--odx-canvas);
    font-family: Roboto, 'Segoe UI', system-ui, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    color: inherit;
  }

  .loading-state {
    min-height: 70svh;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: var(--ha-space-4, 16px);
    padding: var(--ha-space-6, 24px);
  }

  .loading-state ha-alert {
    max-width: 560px;
  }

  .project-card-copy code {
    display: block;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--odx-muted);
    font-size: 10px;
  }

  .app-shell {
    height: 100svh;
    min-height: 100svh;
    display: grid;
    grid-template-rows: 64px minmax(0, 1fr);
  }

  .topbar {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr) auto;
    align-items: center;
    gap: 20px;
    padding: 0 20px 0 14px;
    border-bottom: 1px solid var(--odx-line);
    background: color-mix(in srgb, var(--odx-surface) 96%, transparent);
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
  }

  .brand-mark {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    background: var(--odx-ink);
    color: var(--odx-surface);
    border-radius: 10px 10px 10px 2px;
    font: 800 12px/1 ui-monospace, SFMono-Regular, Consolas, monospace;
    letter-spacing: -0.04em;
  }

  .brand-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .brand-copy strong {
    font-size: 14px;
    letter-spacing: -0.01em;
  }

  .brand-copy span {
    font-size: 10px;
    color: var(--odx-muted);
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .project-title {
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .project-context {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ha-space-4, 16px);
  }

  .workflow {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    color: var(--odx-muted);
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  .workflow span {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .workflow b {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border: 1px solid var(--odx-line);
    border-radius: 50%;
    background: var(--odx-surface);
    font: 800 10px/1 ui-monospace, Consolas, monospace;
  }

  .workflow .active {
    color: var(--odx-blue-strong);
  }

  .workflow .active b,
  .workflow .complete b {
    border-color: var(--odx-blue);
    background: color-mix(in srgb, var(--odx-blue) 13%, var(--odx-surface));
  }

  .workflow i {
    width: 22px;
    height: 1px;
    background: var(--odx-line);
  }

  .project-title strong {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 16px;
  }

  .autosave-state {
    color: var(--odx-muted);
    font-size: 12px;
  }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .button-icon {
    width: 1em;
    height: 1em;
    display: block;
    flex: none;
    fill: currentColor;
  }

  .export-actions {
    flex: none;
  }

  .export-actions wa-dropdown {
    display: inline-flex;
  }

  .workspace {
    min-height: 0;
    display: grid;
    grid-template-columns: 220px minmax(480px, 1fr) 328px;
  }

  .welcome-topbar {
    grid-template-columns: 220px minmax(0, 1fr) auto;
  }

  .welcome-topline {
    color: var(--odx-muted);
    font-size: 12px;
    font-weight: 600;
  }

  .workspace.welcome-workspace {
    grid-template-columns: 220px minmax(0, 1fr);
  }

  .empty-rail {
    min-height: 0;
  }

  .empty-library {
    min-height: 0;
    flex: 1 1 auto;
    display: grid;
    place-content: center;
    justify-items: center;
    padding: var(--ha-space-6, 24px) var(--ha-space-2, 8px);
    color: var(--odx-muted);
    text-align: center;
  }

  .empty-library-count {
    width: 46px;
    height: 30px;
    margin-block-end: var(--ha-space-3, 12px);
    display: grid;
    place-items: center;
    border: 2px solid var(--odx-ink);
    background: var(--odx-surface);
    color: var(--odx-ink);
    font: 800 10px/1 ui-monospace, Consolas, monospace;
  }

  .empty-library strong {
    color: var(--odx-ink);
    font-size: 13px;
  }

  .empty-library p {
    max-width: 150px;
    margin: 5px 0 0;
    font-size: 11px;
    line-height: 1.45;
  }

  .import-empty {
    width: 100%;
    justify-content: center;
  }

  .welcome-main {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(360px, 1fr) minmax(380px, 1fr);
    align-items: center;
    gap: clamp(28px, 4vw, 56px);
    overflow: auto;
    padding: clamp(28px, 4vw, 64px);
    background-color: var(--odx-canvas);
    background-image: radial-gradient(circle, color-mix(in srgb, var(--odx-muted) 24%, transparent) 1px, transparent 1px);
    background-size: 18px 18px;
  }

  .welcome-copy {
    max-width: 560px;
  }

  .welcome-copy h1 {
    max-width: 640px;
    margin: var(--ha-space-3, 12px) 0 var(--ha-space-4, 16px);
    color: var(--odx-ink);
    font-size: clamp(34px, 4vw, 54px);
    line-height: 0.98;
    letter-spacing: -0.055em;
  }

  .welcome-copy > p {
    max-width: 540px;
    margin: 0;
    color: var(--odx-muted);
    font-size: 15px;
    line-height: 1.65;
  }

  .welcome-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--ha-space-3, 12px);
    margin-block: var(--ha-space-5, 20px) var(--ha-space-6, 24px);
  }

  .welcome-facts {
    margin: 0;
    display: grid;
    gap: 0;
    border-block: 1px solid var(--odx-line);
  }

  .welcome-facts div {
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: var(--ha-space-3, 12px);
    padding-block: var(--ha-space-3, 12px);
    border-bottom: 1px solid var(--odx-line);
  }

  .welcome-facts div:last-child {
    border-bottom: 0;
  }

  .welcome-facts dt {
    color: var(--odx-blue-strong);
    font: 800 11px/1.4 ui-monospace, Consolas, monospace;
  }

  .welcome-facts dd {
    margin: 0;
  }

  .welcome-facts strong,
  .welcome-facts span {
    display: block;
  }

  .welcome-facts strong {
    font-size: 12px;
  }

  .welcome-facts span {
    margin-block-start: 3px;
    color: var(--odx-muted);
    font-size: 11px;
  }

  .welcome-visual {
    width: min(100%, 720px);
    justify-self: center;
  }

  .welcome-device-meta {
    display: flex;
    justify-content: space-between;
    margin-block-end: var(--ha-space-3, 12px);
    color: var(--odx-muted);
    font: 700 10px/1 ui-monospace, Consolas, monospace;
    letter-spacing: 0.08em;
  }

  .welcome-device {
    padding: clamp(10px, 1.6vw, 16px);
    border-radius: clamp(14px, 2vw, 26px);
    background: #25292c;
    box-shadow: 0 24px 70px rgba(31, 43, 50, 0.24), 0 3px 9px rgba(31, 43, 50, 0.24);
  }

  .welcome-screen {
    aspect-ratio: 5 / 3;
    padding: 6px;
    display: grid;
    grid-template-columns: 1.4fr 0.6fr;
    grid-template-rows: 1fr 0.62fr;
    gap: 5px;
    background: #fffdf4;
  }

  .welcome-region {
    position: relative;
    overflow: hidden;
    border: 2px solid #111;
    color: #111;
    background: #fffdf4;
  }

  .welcome-region > span {
    position: absolute;
    inset-block-start: 7px;
    inset-inline-start: 9px;
    color: #c82723;
    font: 800 10px/1 ui-monospace, Consolas, monospace;
  }

  .welcome-region-a {
    padding: 22% 10px 10px;
  }

  .welcome-region-a i {
    display: block;
    height: 3px;
    margin-block-start: 12%;
    background: #c82723;
    transform: rotate(-5deg);
  }

  .welcome-region-a i:last-child {
    width: 68%;
    margin-inline-start: 20%;
    background: #285995;
    transform: rotate(7deg);
  }

  .welcome-region-b {
    display: grid;
    place-content: center;
    text-align: center;
  }

  .welcome-region-b b {
    font-size: clamp(28px, 5vw, 58px);
    letter-spacing: -0.08em;
  }

  .welcome-region-b small {
    color: #285995;
    font-size: 8px;
    font-weight: 800;
  }

  .welcome-region-c {
    grid-column: 1 / -1;
    display: grid;
    align-content: center;
    gap: 10%;
    padding: 8% 12px 8px;
  }

  .welcome-region-c em {
    height: 2px;
    background: #111;
  }

  .welcome-palette {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    margin-block-start: var(--ha-space-3, 12px);
  }

  .welcome-palette i {
    width: 11px;
    height: 11px;
    border: 1px solid color-mix(in srgb, var(--odx-ink) 35%, transparent);
    border-radius: 50%;
  }

  .welcome-palette i:nth-child(1) { background: #fff; }
  .welcome-palette i:nth-child(2) { background: #111; }
  .welcome-palette i:nth-child(3) { background: #c82723; }
  .welcome-palette i:nth-child(4) { background: #e5b600; }
  .welcome-palette i:nth-child(5) { background: #285995; }
  .welcome-palette i:nth-child(6) { background: #72a85a; }

  .welcome-palette span {
    margin-inline-start: 5px;
    color: var(--odx-muted);
    font: 700 9px/1 ui-monospace, Consolas, monospace;
    letter-spacing: 0.06em;
  }

  .project-rail,
  .inspector {
    min-height: 0;
    background: var(--odx-surface);
  }

  .project-rail {
    overflow: hidden;
    border-right: 1px solid var(--odx-line);
    padding: 18px 12px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .rail-heading,
  .inspector-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .rail-heading h2,
  .inspector-heading h2 {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .text-button {
    appearance: none;
    border: 0;
    background: transparent;
    padding: 5px;
    color: var(--odx-blue-strong);
    font-weight: 700;
    cursor: pointer;
    border-radius: 6px;
  }

  .text-button:hover,
  .text-button:focus-visible {
    background: color-mix(in srgb, var(--odx-blue) 12%, transparent);
    outline: none;
  }

  .project-list {
    min-height: 0;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow: auto;
  }

  .project-card {
    width: 100%;
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 10px;
    background: transparent;
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr);
    gap: 10px;
    align-items: center;
    text-align: left;
    cursor: pointer;
  }

  .project-card:hover {
    background: var(--odx-canvas);
  }

  .project-card.active {
    background: color-mix(in srgb, var(--odx-blue) 10%, var(--odx-surface));
    border-color: color-mix(in srgb, var(--odx-blue) 38%, var(--odx-line));
  }

  .mini-screen {
    width: 42px;
    aspect-ratio: var(--mini-aspect, 1.6);
    border: 2px solid var(--odx-ink);
    background: #fefefe;
    display: grid;
    place-items: center;
    font: 700 8px/1 ui-monospace, Consolas, monospace;
  }

  .project-card-copy {
    min-width: 0;
  }

  .project-card-copy strong,
  .project-card-copy span {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .project-card-copy strong {
    font-size: 13px;
  }

  .project-card-copy span {
    margin-top: 3px;
    color: var(--odx-muted);
    font-size: 11px;
  }

  .rail-footer {
    padding: 12px 8px 2px;
    border-top: 1px solid var(--odx-line);
    color: var(--odx-muted);
    font-size: 11px;
    line-height: 1.5;
  }

  .rail-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .rail-action {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
    border: 1px solid var(--odx-line);
    border-radius: 8px;
    background: var(--odx-surface);
    color: var(--odx-muted);
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .rail-action:hover,
  .rail-action:focus-visible {
    border-color: var(--odx-blue);
    color: var(--odx-blue-strong);
    outline: none;
  }

  .rail-action:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .rail-action:disabled:hover,
  .rail-action:disabled:focus-visible {
    border-color: var(--odx-line);
    color: var(--odx-muted);
  }

  .rail-action.danger:hover,
  .rail-action.danger:focus-visible {
    border-color: var(--odx-danger);
    color: var(--odx-danger);
  }

  .rail-action svg {
    width: 15px;
    height: 15px;
    flex: none;
    fill: currentColor;
  }

  .editor {
    min-width: 0;
    min-height: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .device-toolbar {
    padding: 12px 16px;
    border-bottom: 1px solid var(--odx-line);
    background: color-mix(in srgb, var(--odx-surface) 85%, var(--odx-canvas));
    display: flex;
    align-items: end;
    gap: 10px;
    flex-wrap: wrap;
  }

  .widget-toolbar {
    align-items: center;
    justify-content: space-between;
    min-height: 72px;
  }

  .device-summary {
    min-width: 0;
    display: grid;
    gap: 2px;
  }

  .step-kicker {
    color: var(--odx-blue-strong);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .device-summary strong {
    font-size: 13px;
  }

  .device-summary > span:last-child {
    overflow: hidden;
    color: var(--odx-muted);
    font-size: 11px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .control {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .control.grow {
    min-width: 240px;
    flex: 1 1 300px;
  }

  .custom-control {
    min-width: 210px;
    flex: 1 1 220px;
  }

  .panel-control {
    min-width: 260px;
    flex-basis: 300px;
  }

  .control label,
  .field-label {
    color: var(--odx-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  select,
  input[type='text'],
  input[type='number'],
  textarea {
    width: 100%;
    min-height: 38px;
    border: 1px solid var(--odx-line);
    border-radius: 9px;
    background: var(--odx-surface);
    color: var(--odx-ink);
    padding: 0 10px;
  }

  textarea {
    min-height: 88px;
    resize: vertical;
    padding-block: 9px;
  }

  select:focus,
  input:focus,
  textarea:focus {
    outline: 2px solid color-mix(in srgb, var(--odx-blue) 45%, transparent);
    outline-offset: 1px;
    border-color: var(--odx-blue);
  }

  .segment {
    display: inline-flex;
    padding: 3px;
    border: 1px solid var(--odx-line);
    border-radius: 10px;
    background: var(--odx-surface);
  }

  .segment button {
    border: 0;
    background: transparent;
    border-radius: 7px;
    min-height: 30px;
    padding: 0 10px;
    color: var(--odx-muted);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .segment button.active {
    color: var(--odx-ink);
    background: color-mix(in srgb, var(--odx-blue) 15%, var(--odx-surface));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--odx-blue) 34%, transparent);
  }

  .grid-badge {
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 10px;
    border-left: 1px solid var(--odx-line);
    color: var(--odx-muted);
    font: 600 11px/1 ui-monospace, Consolas, monospace;
  }

  .canvas-area {
    min-height: 0;
    overflow: hidden;
    container-type: size;
    padding: 28px;
    background-color: var(--odx-canvas);
    background-image: radial-gradient(circle, color-mix(in srgb, var(--odx-muted) 23%, transparent) 0.8px, transparent 0.9px);
    background-size: 18px 18px;
  }

  .canvas-stage {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .screen-meta {
    width: min(100%, var(--odx-canvas-max-width));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: var(--odx-muted);
    font-size: 11px;
    font-weight: 600;
  }

  .screen-meta code {
    font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
    color: var(--odx-ink);
  }

  .preview-boundary {
    width: min(100%, var(--odx-canvas-max-width));
    height: min(var(--odx-canvas-max-height), calc(100cqh - 110px));
    min-height: 180px;
    display: grid;
    place-items: center;
    container-type: size;
  }

  .screen-fit {
    position: relative;
    flex: none;
  }

  .screen-bezel {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    padding: 12px;
    border-radius: clamp(12px, 2vw, 24px);
    background: #25292c;
    box-shadow: 0 16px 42px rgba(31, 43, 50, 0.18), 0 2px 7px rgba(31, 43, 50, 0.22);
    transform-origin: top left;
  }

  .screen-bezel::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    right: 7px;
    top: 50%;
    background: #62696d;
  }

  .display-screen {
    aspect-ratio: auto;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    grid-template-rows: repeat(var(--grid-rows), minmax(0, 1fr));
    gap: clamp(2px, 0.36cqw, 5px);
    padding: clamp(3px, 0.5cqw, 7px);
    color: var(--screen-ink);
    background: var(--screen-paper);
    container-type: inline-size;
    font-family: 'Arial Narrow', Roboto, Arial, sans-serif;
    filter: contrast(0.98);
  }

  .display-screen.live-preview {
    display: block;
    padding: 0;
    gap: 0;
    filter: none;
  }

  .html-preview {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
    background: #fff;
    pointer-events: none;
  }

  .preview-overlay {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    grid-template-rows: repeat(var(--grid-rows), minmax(0, 1fr));
    gap: var(--preview-gap);
    padding: var(--preview-gap);
    box-sizing: border-box;
  }

  .preview-overlay .screen-region.preview-region {
    border-color: transparent;
    background: transparent;
  }

  .preview-overlay .screen-region.preview-region.empty {
    border-style: dashed;
    border-color: color-mix(in srgb, var(--screen-ink) 38%, transparent);
  }

  .display-screen[data-palette='bw'] {
    --screen-paper: #fff;
    --screen-ink: #080808;
    --screen-muted: #080808;
    --screen-accent: #080808;
    --screen-accent-2: #fff;
    --screen-soft: repeating-linear-gradient(45deg, #fff 0 2px, #111 2px 3px);
  }

  .display-screen[data-palette='gray4'] {
    --screen-paper: #f7f7f4;
    --screen-ink: #10110f;
    --screen-muted: #777872;
    --screen-accent: #363733;
    --screen-accent-2: #a9aaa4;
    --screen-soft: #d0d1cc;
  }

  .display-screen[data-palette='gray16'] {
    --screen-paper: #fafaf7;
    --screen-ink: #111210;
    --screen-muted: #686963;
    --screen-accent: #30312d;
    --screen-accent-2: #9b9c96;
    --screen-soft: #dedfd9;
  }

  .display-screen[data-palette='bwr'] {
    --screen-paper: #fffdf8;
    --screen-ink: #101010;
    --screen-muted: #444;
    --screen-accent: #c81e1e;
    --screen-accent-2: #c81e1e;
    --screen-soft: #f4d9d2;
  }

  .display-screen[data-palette='bwy'] {
    --screen-paper: #fffdf7;
    --screen-ink: #111;
    --screen-muted: #444;
    --screen-accent: #e4b800;
    --screen-accent-2: #111;
    --screen-soft: #f6e699;
  }

  .display-screen[data-palette='bwry'] {
    --screen-paper: #fffdf7;
    --screen-ink: #111;
    --screen-muted: #464646;
    --screen-accent: #d22626;
    --screen-accent-2: #e5b800;
    --screen-soft: #f3e3a6;
  }

  .display-screen[data-palette='spectra6'] {
    --screen-paper: #fffef5;
    --screen-ink: #101010;
    --screen-muted: #285995;
    --screen-accent: #c82723;
    --screen-accent-2: #e5b600;
    --screen-soft: #72a85a;
  }

  .screen-region {
    min-width: 0;
    min-height: 0;
    position: relative;
    overflow: hidden;
    container-type: size;
    border: max(1px, 0.14cqw) solid var(--screen-ink);
    background: var(--screen-paper);
    cursor: pointer;
    isolation: isolate;
  }

  .screen-region:hover,
  .screen-region.selected {
    outline: max(2px, 0.3cqw) solid var(--screen-accent);
    outline-offset: calc(max(2px, 0.3cqw) * -1);
    z-index: 2;
  }

  .screen-region.empty {
    display: grid;
    place-items: center;
    border-style: dashed;
    color: var(--screen-muted);
  }

  .screen-region.layout-region {
    display: grid;
    place-items: center;
    border-style: solid;
    background: color-mix(in srgb, var(--screen-accent) 7%, var(--screen-paper));
  }

  .layout-region-copy {
    display: grid;
    place-items: center;
    gap: 0.25em;
    text-align: center;
  }

  .layout-region-copy strong {
    font-size: clamp(14px, 22cqh, 44px);
    line-height: 1;
  }

  .layout-region-copy span {
    color: var(--screen-muted);
    font: 700 clamp(6px, 6cqh, 11px)/1 ui-monospace, Consolas, monospace;
  }

  .empty-region-copy {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35em;
    font-size: clamp(7px, 5cqh, 14px);
    text-align: center;
  }

  .empty-region-copy strong {
    color: var(--screen-ink);
  }

  .empty-region-copy span {
    opacity: 0.7;
    font-size: 0.78em;
  }

  .merge-layer {
    position: absolute;
    inset: clamp(3px, 0.5cqw, 7px);
    z-index: 8;
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
    grid-template-rows: repeat(var(--grid-rows), minmax(0, 1fr));
    gap: clamp(2px, 0.36cqw, 5px);
    pointer-events: none;
  }

  .merge-layer.active {
    pointer-events: auto;
  }

  .merge-cell {
    appearance: none;
    border: max(1px, 0.15cqw) dashed color-mix(in srgb, var(--screen-ink) 50%, transparent);
    background: color-mix(in srgb, var(--screen-paper) 76%, transparent);
    cursor: crosshair;
    color: var(--screen-muted);
    font: 700 clamp(7px, 1.5cqw, 12px)/1 ui-monospace, Consolas, monospace;
    transition: background 90ms ease, border-color 90ms ease;
  }

  .merge-cell:hover,
  .merge-cell:focus-visible {
    border-style: solid;
    border-color: var(--screen-accent);
    background: color-mix(in srgb, var(--screen-accent) 12%, var(--screen-paper));
    outline: none;
  }

  .merge-cell.preview {
    border-style: solid;
    border-color: var(--screen-accent);
    background: color-mix(in srgb, var(--screen-accent) 22%, var(--screen-paper));
    color: var(--screen-ink);
  }

  .merge-cell.preview.invalid {
    border-color: var(--odx-danger);
    background: color-mix(in srgb, var(--odx-danger) 20%, var(--screen-paper));
  }

  .merge-cell.anchor {
    color: var(--screen-paper);
    background: var(--screen-accent);
  }

  .merge-cell.occupied {
    border: 0;
    background: transparent;
    cursor: zoom-out;
  }

  .merge-cell.occupied:hover,
  .merge-cell.occupied:focus-visible {
    background: transparent;
    outline: none;
  }

  .inspector {
    border-left: 1px solid var(--odx-line);
    padding: 18px;
    overflow: auto;
  }

  .layout-guide {
    display: flex;
    flex-direction: column;
    gap: var(--ha-space-3, 12px);
  }

  .layout-guide h2 {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.03em;
  }

  .layout-guide > p {
    margin: 0;
    color: var(--odx-muted);
    font-size: 12px;
    line-height: 1.55;
  }

  .device-facts {
    margin: var(--ha-space-2, 8px) 0 0;
    border-block: 1px solid var(--odx-line);
  }

  .device-facts div {
    display: grid;
    grid-template-columns: 74px minmax(0, 1fr);
    gap: var(--ha-space-2, 8px);
    padding-block: 9px;
    border-bottom: 1px solid var(--odx-line);
  }

  .device-facts div:last-child {
    border-bottom: 0;
  }

  .device-facts dt {
    color: var(--odx-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .device-facts dd {
    min-width: 0;
    margin: 0;
    font-size: 12px;
    font-weight: 700;
  }

  .layout-instructions {
    margin: 0;
    padding-inline-start: 20px;
    color: var(--odx-muted);
    font-size: 12px;
    line-height: 1.55;
  }

  .layout-instructions li + li {
    margin-block-start: var(--ha-space-2, 8px);
  }

  .layout-instructions strong {
    color: var(--odx-ink);
  }

  .inspector-heading {
    margin-bottom: 16px;
  }

  .region-address {
    color: var(--odx-muted);
    font: 600 11px/1 ui-monospace, Consolas, monospace;
  }

  .inspector-empty {
    min-height: 260px;
    display: grid;
    place-items: center;
    text-align: center;
    color: var(--odx-muted);
  }

  .inspector-empty strong {
    display: block;
    margin-bottom: 7px;
    color: var(--odx-ink);
    font-size: 14px;
  }

  .inspector-empty p {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
  }

  .widget-picker {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 18px;
  }

  .widget-choice {
    min-height: 90px;
    padding: 10px;
    border: 1px solid var(--odx-line);
    border-radius: 10px;
    background: var(--odx-surface);
    text-align: left;
    cursor: pointer;
  }

  .widget-choice:hover,
  .widget-choice.active {
    border-color: var(--odx-blue);
    background: color-mix(in srgb, var(--odx-blue) 8%, var(--odx-surface));
  }

  .widget-choice svg {
    width: 22px;
    height: 22px;
    fill: var(--odx-blue-strong);
  }

  .widget-choice strong,
  .widget-choice span {
    display: block;
  }

  .widget-choice strong {
    margin-top: 7px;
    font-size: 12px;
  }

  .widget-choice span {
    margin-top: 3px;
    color: var(--odx-muted);
    font-size: 10px;
    line-height: 1.35;
  }

  .option-form {
    display: flex;
    flex-direction: column;
    gap: 13px;
    padding-top: 16px;
    border-top: 1px solid var(--odx-line);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .toggle-field {
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .toggle-field label {
    font-size: 12px;
    font-weight: 600;
  }

  .toggle {
    appearance: none;
    width: 38px;
    height: 22px;
    border: 0;
    border-radius: 20px;
    background: #aeb7bc;
    padding: 3px;
    cursor: pointer;
  }

  .toggle::before {
    content: '';
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    transition: transform 120ms ease;
  }

  .toggle:checked {
    background: var(--odx-blue-strong);
  }

  .toggle:checked::before {
    transform: translateX(16px);
  }

  .danger-zone {
    margin-top: 20px;
    padding-top: 14px;
    border-top: 1px solid var(--odx-line);
  }

  .merge-help {
    width: min(100%, 900px);
    min-height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 7px 12px;
    border: 1px solid color-mix(in srgb, var(--odx-blue) 34%, var(--odx-line));
    border-radius: 9px;
    color: var(--odx-blue-strong);
    background: color-mix(in srgb, var(--odx-blue) 7%, var(--odx-surface));
    font-size: 12px;
    font-weight: 600;
  }

  .merge-help strong {
    color: var(--odx-ink);
  }

  dialog {
    width: min(92vw, 440px);
    border: 1px solid var(--odx-line);
    border-radius: 16px;
    padding: 0;
    color: var(--odx-ink);
    background: var(--odx-surface);
    box-shadow: 0 24px 80px rgba(20, 32, 40, 0.28);
  }

  dialog::backdrop {
    background: rgba(15, 24, 30, 0.42);
  }

  .dialog-body {
    padding: 22px;
  }

  .dialog-body h2 {
    margin: 0 0 6px;
    font-size: 19px;
  }

  .dialog-body p {
    margin: 0 0 18px;
    color: var(--odx-muted);
    font-size: 12px;
    line-height: 1.5;
  }

  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
  }

  .toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    z-index: 100;
    transform: translateX(-50%);
    padding: 10px 14px;
    border-radius: 9px;
    color: white;
    background: #20282d;
    box-shadow: 0 8px 24px rgba(20, 32, 40, 0.24);
    font-size: 12px;
    font-weight: 600;
  }

  .exporting .screen-region:hover,
  .exporting .screen-region.selected {
    outline: none;
  }

  @media (max-width: 1180px) {
    .workspace {
      grid-template-columns: 188px minmax(420px, 1fr) 290px;
    }

    .topbar {
      grid-template-columns: 188px minmax(0, 1fr) auto;
    }

    .workspace.welcome-workspace {
      grid-template-columns: 188px minmax(0, 1fr);
    }

    .welcome-main {
      gap: clamp(24px, 3vw, 40px);
      padding: clamp(24px, 3vw, 40px);
    }

    .project-rail {
      padding-inline: 8px;
    }

    .inspector {
      padding: 14px;
    }
  }

  @media (max-width: 900px) {
    .app-shell {
      height: auto;
    }

    .topbar {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .project-context {
      display: none;
    }

    .welcome-topline {
      display: none;
    }

    .workspace {
      grid-template-columns: 1fr;
    }

    .workspace.welcome-workspace {
      grid-template-columns: 1fr;
    }

    .project-rail {
      display: none;
    }

    .inspector {
      border-left: 0;
      border-top: 1px solid var(--odx-line);
      min-height: 420px;
    }

    .welcome-main {
      grid-template-columns: minmax(0, 1fr);
      align-content: start;
      padding: clamp(28px, 7vw, 56px);
    }

    .welcome-copy {
      max-width: 680px;
    }

    .welcome-visual {
      width: min(100%, 620px);
    }

    .canvas-area {
      min-height: 520px;
      overflow: hidden;
      padding: 20px 14px;
    }

    .preview-boundary {
      height: min(var(--odx-canvas-max-height), calc(100cqh - 94px));
    }
  }

  @media (max-width: 560px) {
    .app-shell {
      grid-template-rows: 56px minmax(0, 1fr);
    }

    .topbar {
      padding-inline: 10px;
    }

    .brand-copy span,
    .top-actions .secondary-action {
      display: none;
    }

    .welcome-main {
      gap: var(--ha-space-8, 32px);
      padding: var(--ha-space-6, 24px) var(--ha-space-4, 16px) var(--ha-space-10, 40px);
    }

    .welcome-copy h1 {
      font-size: clamp(34px, 12vw, 48px);
    }

    .welcome-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .welcome-actions ha-button {
      width: 100%;
    }

    .device-toolbar {
      align-items: stretch;
    }

    .widget-toolbar {
      align-items: center;
    }

    .control.grow {
      min-width: 100%;
    }

    .custom-control,
    .panel-control {
      min-width: 100%;
    }

    .grid-badge {
      border-left: 0;
    }

    .canvas-area {
      min-height: 440px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
`, L = "https://opendisplay.org/firmware/toolbox/index.html";
`${L}`, `${L}`, `${L}`, `${L}`;
var $e = (e) => e <= 1.6 ? {
	landscape: {
		columns: 1,
		rows: 1
	},
	portrait: {
		columns: 1,
		rows: 1
	}
} : e <= 2.2 ? {
	landscape: {
		columns: 2,
		rows: 1
	},
	portrait: {
		columns: 1,
		rows: 2
	}
} : e <= 3.6 ? {
	landscape: {
		columns: 3,
		rows: 1
	},
	portrait: {
		columns: 1,
		rows: 3
	}
} : e <= 4.3 ? {
	landscape: {
		columns: 2,
		rows: 2
	},
	portrait: {
		columns: 2,
		rows: 2
	}
} : e <= 6 ? {
	landscape: {
		columns: 3,
		rows: 2
	},
	portrait: {
		columns: 2,
		rows: 3
	}
} : {
	landscape: {
		columns: 3,
		rows: 3
	},
	portrait: {
		columns: 3,
		rows: 3
	}
}, R = (e, t, n, r, i, a, o) => ({
	id: `custom-${e}`,
	manufacturer: "Custom",
	family: "Custom",
	name: t,
	diagonal: n,
	nativeWidth: r,
	nativeHeight: i,
	nativeOrientation: r >= i ? "landscape" : "portrait",
	palettes: a === "bw" ? ["bw"] : ["bw", a],
	defaultPalette: a,
	grid: $e(n),
	source: L,
	connectorPins: o,
	toolboxId: e
}), et = [
	R("ep154-200x200", "1.54″ Monochrome · 200×200", 1.54, 200, 200, "bw", [24]),
	R("ep154-152x152", "1.54″ B/W/R · 152×152", 1.54, 152, 152, "bwr", [24]),
	R("ep154yr-200x200", "1.54″ B/W/R/Y · 200×200", 1.54, 200, 200, "bwry", [24]),
	R("ep213-122x250", "2.13″ Monochrome · 122×250", 2.13, 122, 250, "bw", [24]),
	R("ep213r-122x250", "2.13″ B/W/R/Y · 122×250", 2.13, 122, 250, "bwry", [24]),
	R("ep266yr-184x360", "2.66″ B/W/R/Y · 184×360", 2.66, 184, 360, "bwry", [24]),
	R("ep29-128x296", "2.9″ Flexible monochrome · 128×296", 2.9, 128, 296, "bw", [24]),
	R("ep29r-128x296", "2.9″ B/W/R/Y · 128×296", 2.9, 128, 296, "bwry", [24]),
	R("ep29yr-168x384", "2.9″ B/W/R/Y · 168×384", 2.9, 168, 384, "bwry", [24]),
	R("ep35yr-184x384", "3.5″ B/W/R/Y · 184×384", 3.5, 184, 384, "bwry", [24]),
	R("ep397-800x480", "3.97″ Monochrome · 800×480", 3.97, 800, 480, "bw", [24]),
	R("ep397-800x480-4gray", "3.97″ 4-level grayscale · 800×480", 3.97, 800, 480, "gray4", [24]),
	R("ep397yr-800x480", "3.97″ B/W/R/Y · 800×480", 3.97, 800, 480, "bwry", [24]),
	R("ep42-400x300", "4.2″ Monochrome · 400×300", 4.2, 400, 300, "bw", [24]),
	R("ep42yr-400x300", "4.2″ B/W/R/Y · 400×300", 4.2, 400, 300, "bwry", [24]),
	R("ep426-800x480", "4.26″ Monochrome · 800×480", 4.26, 800, 480, "bw", [24]),
	R("ep426-800x480-4g", "4.26″ 4-level grayscale · 800×480", 4.26, 800, 480, "gray4", [24]),
	R("ep583-648x480", "5.83″ Monochrome · 648×480", 5.83, 648, 480, "bw", [24]),
	R("ep75-800x480", "7.5″ Monochrome · 800×480", 7.5, 800, 480, "bw", [24]),
	R("ep75-800x480-4gray", "7.5″ 4-level grayscale · 800×480", 7.5, 800, 480, "gray4", [24]),
	R("ep73-spectra-800x480", "7.3″ Spectra 6 · 800×480", 7.3, 800, 480, "spectra6", [50]),
	R("ep75-bwry-800x480", "7.5″ B/W/R/Y · 800×480", 7.5, 800, 480, "bwry", [24])
], z = {
	bw: "Monochrome · black / white",
	gray4: "Grayscale · 4 levels",
	gray16: "Grayscale · 16 levels",
	bwr: "Black / white / red",
	bwy: "Black / white / yellow",
	bwry: "Black / white / red / yellow",
	spectra6: "Spectra 6 · B/W/R/Y/B/G"
}, tt = "https://www.solum-group.com/esl-n-iot/product-lineup/professional-esl/newton-pro", B = "https://opendisplay.org/what-hardware-to-buy.html", V = (e, t, n, r, i, a, o, s, c, l) => ({
	id: e,
	manufacturer: t,
	family: "OpenDisplay",
	name: n,
	diagonal: r,
	nativeWidth: i,
	nativeHeight: a,
	nativeOrientation: i >= a ? "landscape" : "portrait",
	palettes: o,
	defaultPalette: s,
	grid: {
		landscape: c,
		portrait: l
	},
	source: B
}), H = (e, t, n, r, i, a, o, s = !1) => ({
	id: e,
	manufacturer: "SOLUM",
	family: "Newton Pro",
	name: t,
	diagonal: n,
	nativeWidth: r,
	nativeHeight: i,
	nativeOrientation: r >= i ? "landscape" : "portrait",
	palettes: s ? ["bw"] : ["bw", "bwry"],
	defaultPalette: s ? "bw" : "bwry",
	grid: {
		landscape: a,
		portrait: o
	},
	freezer: s,
	source: tt
}), U = [
	H("solum-newton-pro-1-6-v", "Newton Pro 1.6″ V", 1.6, 200, 200, {
		columns: 1,
		rows: 1
	}, {
		columns: 1,
		rows: 1
	}),
	H("solum-newton-pro-1-6-h", "Newton Pro 1.6″ H", 1.6, 200, 200, {
		columns: 1,
		rows: 1
	}, {
		columns: 1,
		rows: 1
	}),
	H("solum-newton-pro-2-2", "Newton Pro 2.2″", 2.2, 296, 160, {
		columns: 2,
		rows: 1
	}, {
		columns: 1,
		rows: 2
	}),
	H("solum-newton-pro-2-2-f", "Newton Pro 2.2″ Freezer", 2.2, 296, 160, {
		columns: 2,
		rows: 1
	}, {
		columns: 1,
		rows: 2
	}, !0),
	H("solum-newton-pro-2-6", "Newton Pro 2.6″", 2.6, 360, 184, {
		columns: 2,
		rows: 1
	}, {
		columns: 1,
		rows: 2
	}),
	H("solum-newton-pro-2-6-f", "Newton Pro 2.6″ Freezer", 2.6, 360, 184, {
		columns: 2,
		rows: 1
	}, {
		columns: 1,
		rows: 2
	}, !0),
	H("solum-newton-pro-2-7", "Newton Pro 2.7″", 2.7, 300, 200, {
		columns: 2,
		rows: 1
	}, {
		columns: 1,
		rows: 2
	}),
	H("solum-newton-pro-2-9", "Newton Pro 2.9″", 2.9, 384, 168, {
		columns: 3,
		rows: 1
	}, {
		columns: 1,
		rows: 3
	}),
	H("solum-newton-pro-2-9-f", "Newton Pro 2.9″ Freezer", 2.9, 384, 168, {
		columns: 3,
		rows: 1
	}, {
		columns: 1,
		rows: 3
	}, !0),
	H("solum-newton-pro-3-45", "Newton Pro 3.5″ · 3.45 panel", 3.45, 480, 224, {
		columns: 3,
		rows: 1
	}, {
		columns: 1,
		rows: 3
	}),
	H("solum-newton-pro-3-45-f", "Newton Pro 3.5″ Freezer · 3.45 panel", 3.45, 480, 224, {
		columns: 3,
		rows: 1
	}, {
		columns: 1,
		rows: 3
	}, !0),
	H("solum-newton-pro-3-52", "Newton Pro 3.5″ · 3.52 panel", 3.52, 384, 180, {
		columns: 3,
		rows: 1
	}, {
		columns: 1,
		rows: 3
	}),
	H("solum-newton-pro-3-52-f", "Newton Pro 3.5″ Freezer · 3.52 panel", 3.52, 384, 180, {
		columns: 3,
		rows: 1
	}, {
		columns: 1,
		rows: 3
	}, !0),
	H("solum-newton-pro-4-2", "Newton Pro 4.2″", 4.2, 400, 300, {
		columns: 2,
		rows: 2
	}, {
		columns: 2,
		rows: 2
	}),
	H("solum-newton-pro-4-3", "Newton Pro 4.3″", 4.3, 522, 152, {
		columns: 4,
		rows: 1
	}, {
		columns: 1,
		rows: 4
	}),
	H("solum-newton-pro-4-5", "Newton Pro 4.5″", 4.5, 480, 176, {
		columns: 4,
		rows: 1
	}, {
		columns: 1,
		rows: 4
	}),
	H("solum-newton-pro-5-8", "Newton Pro 5.8″", 5.8, 792, 272, {
		columns: 4,
		rows: 2
	}, {
		columns: 2,
		rows: 4
	}),
	H("solum-newton-pro-5-8-f", "Newton Pro 5.8″ Freezer", 5.8, 792, 272, {
		columns: 4,
		rows: 2
	}, {
		columns: 2,
		rows: 4
	}, !0),
	H("solum-newton-pro-6-1", "Newton Pro 6.1″", 6.1, 648, 480, {
		columns: 3,
		rows: 3
	}, {
		columns: 3,
		rows: 3
	}),
	H("solum-newton-pro-7-5", "Newton Pro 7.5″", 7.5, 480, 800, {
		columns: 3,
		rows: 3
	}, {
		columns: 3,
		rows: 3
	}),
	H("solum-newton-pro-9-7", "Newton Pro 9.7″", 9.7, 672, 960, {
		columns: 4,
		rows: 3
	}, {
		columns: 3,
		rows: 4
	}),
	H("solum-newton-pro-11-6", "Newton Pro 11.6″", 11.6, 640, 960, {
		columns: 4,
		rows: 3
	}, {
		columns: 3,
		rows: 4
	}),
	H("solum-newton-pro-12-2", "Newton Pro 12.2″", 12.2, 768, 960, {
		columns: 4,
		rows: 4
	}, {
		columns: 4,
		rows: 4
	}),
	V("opendisplay-e1001", "Seeed Studio", "reTerminal E1001 7.5″", 7.5, 800, 480, ["bw"], "bw", {
		columns: 3,
		rows: 3
	}, {
		columns: 3,
		rows: 3
	}),
	{
		id: "opendisplay-reterminal-sticky",
		manufacturer: "Seeed Studio",
		family: "OpenDisplay",
		name: "reTerminal sticky 3.97″",
		diagonal: 3.97,
		nativeWidth: 800,
		nativeHeight: 480,
		nativeOrientation: "landscape",
		palettes: ["bw"],
		defaultPalette: "bw",
		grid: {
			landscape: {
				columns: 3,
				rows: 2
			},
			portrait: {
				columns: 2,
				rows: 3
			}
		},
		source: B
	},
	{
		id: "opendisplay-e1002",
		manufacturer: "Seeed Studio",
		family: "OpenDisplay",
		name: "reTerminal E1002 7.3″ Spectra 6",
		diagonal: 7.3,
		nativeWidth: 800,
		nativeHeight: 480,
		nativeOrientation: "landscape",
		palettes: ["bw", "spectra6"],
		defaultPalette: "spectra6",
		grid: {
			landscape: {
				columns: 3,
				rows: 3
			},
			portrait: {
				columns: 3,
				rows: 3
			}
		},
		source: B
	},
	{
		id: "opendisplay-e1003",
		manufacturer: "Seeed Studio",
		family: "OpenDisplay",
		name: "reTerminal E1003 10.3″",
		diagonal: 10.3,
		nativeWidth: 1404,
		nativeHeight: 1872,
		nativeOrientation: "portrait",
		palettes: [
			"bw",
			"gray4",
			"gray16"
		],
		defaultPalette: "gray16",
		grid: {
			landscape: {
				columns: 4,
				rows: 3
			},
			portrait: {
				columns: 3,
				rows: 4
			}
		},
		source: B
	},
	V("opendisplay-e1004", "Seeed Studio", "reTerminal E1004 13.3″ Spectra 6", 13.3, 1200, 1600, ["bw", "spectra6"], "spectra6", {
		columns: 4,
		rows: 3
	}, {
		columns: 3,
		rows: 4
	}),
	V("opendisplay-xiao-7-5", "Seeed Studio", "XIAO 7.5″ ePaper kit", 7.5, 800, 480, ["bw"], "bw", {
		columns: 3,
		rows: 3
	}, {
		columns: 3,
		rows: 3
	}),
	V("opendisplay-seeed-7-5-diy", "Seeed Studio", "7.5″ DIY · EE04", 7.5, 800, 480, ["bw"], "bw", {
		columns: 3,
		rows: 3
	}, {
		columns: 3,
		rows: 3
	}),
	V("opendisplay-4-26-mono-kit", "OpenDisplay", "OpenDisplay 4.26″ Mono Kit", 4.26, 800, 480, ["bw"], "bw", {
		columns: 2,
		rows: 2
	}, {
		columns: 2,
		rows: 2
	}),
	V("opendisplay-7-3-color-kit", "OpenDisplay", "OpenDisplay 7.3″ Color Kit", 7.3, 800, 480, ["bw", "spectra6"], "spectra6", {
		columns: 3,
		rows: 3
	}, {
		columns: 3,
		rows: 3
	}),
	V("opendisplay-waveshare-photopainter", "Waveshare", "ESP32-S3 PhotoPainter 7.3″", 7.3, 800, 480, ["bw", "spectra6"], "spectra6", {
		columns: 3,
		rows: 3
	}, {
		columns: 3,
		rows: 3
	}),
	...et
], W = (e) => U.find((t) => t.id === e) ?? U.find((e) => e.id === "solum-newton-pro-5-8") ?? U[0], nt = (e, t) => e.nativeOrientation === t ? {
	width: e.nativeWidth,
	height: e.nativeHeight
} : {
	width: e.nativeHeight,
	height: e.nativeWidth
}, G = () => crypto.randomUUID(), K = (e) => {
	let t = [];
	for (let n = 1; n <= e.rows; n += 1) for (let r = 1; r <= e.columns; r += 1) t.push({
		id: G(),
		row: n,
		column: r,
		rowSpan: 1,
		columnSpan: 1
	});
	return t;
}, rt = (e, t) => t.row >= e.row && t.row < e.row + e.rowSpan && t.column >= e.column && t.column < e.column + e.columnSpan, it = (e, t, n) => {
	let r = Math.min(t.row, n.row), i = Math.min(t.column, n.column), a = Math.max(t.row, n.row), o = Math.max(t.column, n.column), s = e.filter((e) => e.row >= r && e.column >= i && e.row + e.rowSpan - 1 <= a && e.column + e.columnSpan - 1 <= o);
	if ((a - r + 1) * (o - i + 1) !== s.reduce((e, t) => e + t.rowSpan * t.columnSpan, 0) || s.length === 0) return null;
	let c = s.find((e) => e.widget)?.widget, l = new Set(s.map((e) => e.id));
	return [...e.filter((e) => !l.has(e.id)), {
		id: G(),
		row: r,
		column: i,
		rowSpan: a - r + 1,
		columnSpan: o - i + 1,
		widget: c
	}];
}, at = (e, t) => {
	let n = e.find((e) => e.id === t);
	if (!n || n.rowSpan === 1 && n.columnSpan === 1 && !n.label) return e;
	if (n.rowSpan === 1 && n.columnSpan === 1) return e.map((e) => e.id === t ? {
		id: G(),
		row: e.row,
		column: e.column,
		rowSpan: 1,
		columnSpan: 1
	} : e);
	let r = [];
	for (let e = n.row; e < n.row + n.rowSpan; e += 1) for (let t = n.column; t < n.column + n.columnSpan; t += 1) r.push({
		id: G(),
		row: e,
		column: t,
		rowSpan: 1,
		columnSpan: 1
	});
	return [...e.filter((e) => e.id !== t), ...r];
}, ot = (e, t, n, r) => t.columns === n.rows && t.rows === n.columns ? e.map((e) => r === "clockwise" ? {
	...e,
	row: e.column,
	column: t.rows - e.row - e.rowSpan + 2,
	rowSpan: e.columnSpan,
	columnSpan: e.rowSpan
} : {
	...e,
	row: t.columns - e.column - e.columnSpan + 2,
	column: e.row,
	rowSpan: e.columnSpan,
	columnSpan: e.rowSpan
}) : K(n), q = (e, t) => ({ ...e.grid[t] }), st = "solum-newton-pro-5-8", ct = (e = "Kitchen display") => {
	let t = W(st), n = "landscape", r = q(t, n), i = (/* @__PURE__ */ new Date()).toISOString();
	return {
		id: G(),
		schemaVersion: 1,
		name: e,
		status: "draft",
		displayId: t.id,
		orientation: n,
		palette: t.defaultPalette,
		width: t.nativeWidth,
		height: t.nativeHeight,
		grid: r,
		regions: K(r),
		createdAt: i,
		updatedAt: i
	};
}, J = (e, t) => String(e[t] ?? ""), lt = (e, t) => Number(e[t] ?? 0), Y = (e, t = "") => E`
  <svg class="widget-icon" viewBox="0 0 24 24" role="img" aria-label=${t}>
    <path d=${e}></path>
  </svg>
`, X = (e) => E`
  <svg slot="start" class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d=${e}></path>
  </svg>
`, ut = [
	{
		id: "calendar",
		version: 1,
		name: "Calendar",
		description: "An agenda from one or more calendar entities.",
		icon: He,
		styles: o`
  .event-list {
    min-height: 0;
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    justify-content: space-evenly;
  }

  .event-row {
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(38px, 0.7fr) minmax(36px, 0.5fr) minmax(0, 3fr);
    gap: 0.6em;
    align-items: center;
    padding: 0.32em 0;
    border-bottom: 1px solid var(--screen-muted);
    font-size: clamp(6px, 5.6cqh, 13px);
  }

  .event-row:last-child {
    border-bottom: 0;
  }

  .event-day {
    color: var(--screen-accent);
    font-weight: 900;
    font-size: 0.82em;
  }

  .event-time {
    font-variant-numeric: tabular-nums;
  }

  .event-row strong {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`,
		defaults: {
			calendar: "",
			title: "Upcoming events",
			days: 5,
			showLocation: !0,
			showDescription: !1,
			time24h: !0
		},
		options: [
			{
				key: "calendar",
				label: "Calendar",
				type: "calendar"
			},
			{
				key: "title",
				label: "Title",
				type: "text"
			},
			{
				key: "days",
				label: "Day range",
				type: "number",
				min: 1,
				max: 31,
				step: 1
			},
			{
				key: "showLocation",
				label: "Show location",
				type: "toggle"
			},
			{
				key: "showDescription",
				label: "Show description",
				type: "toggle"
			},
			{
				key: "time24h",
				label: "24-hour time",
				type: "toggle"
			}
		],
		render: (e, t) => {
			let n = t.compact ? 2 : 4, r = [
				[
					"TODAY",
					"09:30",
					"Team stand-up"
				],
				[
					"TODAY",
					"14:00",
					"Project review"
				],
				[
					"THU",
					"18:15",
					"Training"
				],
				[
					"FRI",
					"08:00",
					"Dentist"
				],
				[
					"SAT",
					"12:30",
					"Family lunch"
				]
			].slice(0, n);
			return E`
      <div class="widget calendar-widget ${t.compact ? "compact" : ""}">
        <div class="widget-heading">
          <span>${Y(He)}</span>
          <strong>${J(e, "title")}</strong>
          <span class="widget-kicker">${lt(e, "days")} days</span>
        </div>
        <div class="event-list">
          ${r.map(([e, t, n]) => E`
              <div class="event-row">
                <span class="event-day">${e}</span>
                <span class="event-time">${t}</span>
                <strong>${n}</strong>
              </div>
            `)}
        </div>
      </div>
    `;
		}
	},
	{
		id: "entity-state",
		version: 1,
		name: "Entity State",
		description: "A prominent value from a single entity.",
		icon: qe,
		styles: o`
  .entity-widget {
    align-items: flex-start;
    justify-content: space-between;
  }

  .entity-widget > .widget-icon {
    width: clamp(18px, 18cqh, 44px);
    height: clamp(18px, 18cqh, 44px);
    color: var(--screen-accent);
  }

  .entity-label {
    font-size: clamp(7px, 7cqh, 15px);
    font-weight: 800;
    text-transform: uppercase;
  }

  .entity-value {
    align-self: flex-end;
    font-size: clamp(22px, 35cqh, 74px);
    line-height: 0.85;
    letter-spacing: -0.07em;
  }

  .entity-value small {
    margin-left: 0.15em;
    color: var(--screen-accent);
    font-size: 0.32em;
    letter-spacing: 0;
  }
`,
		defaults: {
			entity: "",
			title: "",
			layout: "large",
			showIcon: !0,
			showName: !0,
			showUnit: !0
		},
		options: [
			{
				key: "entity",
				label: "Entity",
				type: "entity"
			},
			{
				key: "title",
				label: "Title",
				type: "text"
			},
			{
				key: "layout",
				label: "Layout",
				type: "select",
				options: [{
					label: "Large value",
					value: "large"
				}, {
					label: "Compact",
					value: "compact"
				}]
			},
			{
				key: "showIcon",
				label: "Show icon",
				type: "toggle"
			},
			{
				key: "showName",
				label: "Show name",
				type: "toggle"
			},
			{
				key: "showUnit",
				label: "Show unit",
				type: "toggle"
			}
		],
		render: (e) => E`
    <div class="widget entity-widget">
      ${Y(Xe, "Entity state")}
      <span class="entity-label">${J(e, "title") || J(e, "entity") || "Choose an entity"}</span>
      <strong class="entity-value">Live data</strong>
    </div>
  `
	},
	{
		id: "text",
		version: 1,
		name: "Text",
		description: "A simple message or heading.",
		icon: Ke,
		styles: o`
  .note-widget {
    justify-content: center;
    gap: 0.45em;
  }

  .note-widget.align-center {
    text-align: center;
    align-items: center;
  }

  .note-widget.align-right {
    text-align: right;
    align-items: flex-end;
  }

  .note-eyebrow {
    color: var(--screen-accent);
    font-size: clamp(6px, min(7cqh, 8cqw), 16px);
    font-weight: 900;
    letter-spacing: 0.1em;
  }

  .note-widget strong {
    max-width: 95%;
    font-size: clamp(9px, min(17cqh, 15cqw), 42px);
    line-height: 0.98;
    letter-spacing: -0.04em;
  }

  .note-widget.emphasis-strong strong {
    text-transform: uppercase;
  }

  .note-widget.emphasis-accent {
    background: var(--screen-accent);
    color: var(--screen-paper);
  }

  .note-widget.emphasis-accent .note-eyebrow {
    color: var(--screen-accent-2);
  }
`,
		defaults: {
			title: "",
			text: "Text",
			align: "left"
		},
		options: [
			{
				key: "title",
				label: "Title",
				type: "text"
			},
			{
				key: "text",
				label: "Content",
				type: "text"
			},
			{
				key: "align",
				label: "Alignment",
				type: "select",
				options: [
					{
						label: "Left",
						value: "left"
					},
					{
						label: "Center",
						value: "center"
					},
					{
						label: "Right",
						value: "right"
					}
				]
			}
		],
		render: (e) => E`
    <div class="widget note-widget align-${J(e, "align")}">
      <span class="note-eyebrow">${J(e, "title")}</span>
      <strong>${J(e, "text")}</strong>
    </div>
  `
	}
], dt = (e) => ut.find((t) => t.id === e), ft = ut.map((e) => e.styles), pt = o`
  .widget {
    width: 100%;
    height: 100%;
    padding: clamp(5px, 2.4cqw, 18px);
    display: flex;
    flex-direction: column;
    color: var(--screen-ink);
    background: var(--screen-paper);
    overflow: hidden;
  }

  .widget-heading {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.5em;
    align-items: center;
    border-bottom: max(1px, 0.12cqw) solid var(--screen-ink);
    padding-bottom: 0.42em;
    font-size: clamp(7px, 6.5cqh, 15px);
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .widget-heading strong {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .widget-icon {
    width: 1.2em;
    height: 1.2em;
    display: block;
    fill: currentColor;
  }

  .widget-kicker {
    color: var(--screen-accent);
    font-weight: 800;
  }
`;
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/decorate.js
function Z(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/odx-app.ts
var mt = (e) => {
	let t = (/* @__PURE__ */ new Date()).toISOString();
	return {
		...structuredClone(e),
		id: G(),
		name: `${e.name} copy`,
		createdAt: t,
		updatedAt: t,
		regions: e.regions.map((e) => ({
			...structuredClone(e),
			id: G()
		}))
	};
}, Q = (e) => {
	let t = e + 1, n = "";
	for (; t > 0;) --t, n = String.fromCharCode(65 + t % 26) + n, t = Math.floor(t / 26);
	return n;
}, $ = class extends N {
	constructor(...e) {
		super(...e), this.store = {
			schemaVersion: 1,
			activeProjectId: "",
			projects: []
		}, this.selectedRegionId = "", this.toastMessage = "", this.loading = !0, this.saving = !1, this.loadError = "", this.renameDraft = "", this.editorMode = "widgets", this.widgetMetadata = [], this.previewHtml = "", this.previewLoading = !1, this.previewError = "", this.saveRevision = 0, this.previewRevision = 0, this.entityStateSignature = "";
	}
	static {
		this.styles = [
			Qe,
			pt,
			...ft
		];
	}
	firstUpdated() {
		this.previewResizeObserver = new ResizeObserver(() => this.updatePreviewScale()), this.previewBoundary && this.previewResizeObserver.observe(this.previewBoundary), this.updatePreviewScale(), this.loadProjects();
	}
	updated(e) {
		if (this.previewBoundary && this.previewResizeObserver?.observe(this.previewBoundary), this.updatePreviewScale(), e.has("hass")) {
			let e = this.currentEntityStateSignature();
			e !== this.entityStateSignature && (this.entityStateSignature = e, this.schedulePreview());
		}
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this.previewResizeObserver?.disconnect(), this.previewTimer && window.clearTimeout(this.previewTimer);
	}
	get project() {
		return this.store.projects.find((e) => e.id === this.store.activeProjectId) ?? this.store.projects[0];
	}
	get canvasProject() {
		return this.layoutDraft ?? this.project;
	}
	get canvasDisplay() {
		return W(this.canvasProject.displayId);
	}
	get canvasPixels() {
		return {
			width: this.canvasProject.width,
			height: this.canvasProject.height
		};
	}
	displayName(e) {
		return e.displayId === "custom" ? "Custom display" : W(e.displayId).name;
	}
	get selectedRegion() {
		return this.project.regions.find((e) => e.id === this.selectedRegionId);
	}
	widgetDefinition(e) {
		let t = dt(e), n = this.widgetMetadata.find((t) => t.id === e);
		return !t || !n ? t : {
			...t,
			version: n.version,
			name: n.name,
			description: n.description,
			defaults: n.defaults,
			options: n.fields
		};
	}
	updatePreviewScale() {
		if (!this.previewBoundary || !this.screenFit || !this.screenBezel) return;
		let e = this.canvasPixels, t = e.width + 24, n = e.height + 24, r = Math.max(.05, Math.min(2, this.previewBoundary.clientWidth / t, this.previewBoundary.clientHeight / n));
		this.screenFit.style.width = `${t * r}px`, this.screenFit.style.height = `${n * r}px`, this.screenBezel.style.width = `${t}px`, this.screenBezel.style.height = `${n}px`, this.screenBezel.style.transform = `scale(${r})`;
	}
	persist(e) {
		this.store = e;
	}
	currentEntityStateSignature() {
		return this.store.projects.length ? this.project.regions.flatMap((e) => e.widget?.type === "entity-state" ? [String(e.widget.config.entity ?? "")] : []).filter(Boolean).sort().map((e) => {
			let t = this.hass.states?.[e];
			return `${e}:${t?.state ?? ""}:${t?.last_updated ?? ""}`;
		}).join("|") : "";
	}
	schedulePreview(e = 250) {
		this.editorMode !== "widgets" || !this.store.projects.length || (this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => {
			this.previewTimer = void 0, this.composePreview(this.project);
		}, e));
	}
	async composePreview(e) {
		let t = ++this.previewRevision;
		this.previewLoading = !0, this.previewError = "";
		try {
			let n = await this.hass.callWS({
				type: "opendisplay_studio/compose_preview",
				project: e
			});
			if (t !== this.previewRevision) return;
			this.previewHtml = n.html, this.previewTimings = n.timings;
		} catch (e) {
			if (t !== this.previewRevision) return;
			this.previewError = e instanceof Error ? e.message : "Could not compose live preview";
		} finally {
			t === this.previewRevision && (this.previewLoading = !1);
		}
	}
	previewDocument() {
		return `<!doctype html><html><head><meta charset="utf-8"><meta name="color-scheme" content="light"><style>html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#fff}body.trmnl{font-family:Arial,sans-serif;color:#000}.screen{box-sizing:border-box}</style></head><body class="trmnl">${this.previewHtml}</body></html>`;
	}
	async loadProjects() {
		this.loading = !0, this.loadError = "";
		try {
			let e = await this.hass.callWS({ type: "opendisplay_studio/bootstrap" });
			this.store = {
				schemaVersion: 1,
				activeProjectId: e.projects[0]?.id ?? "",
				projects: e.projects
			}, this.widgetMetadata = e.widgets, this.schedulePreview(0);
		} catch (e) {
			this.loadError = e instanceof Error ? e.message : "Unable to load projects";
		} finally {
			this.loading = !1;
		}
	}
	async saveProject(e) {
		let t = ++this.saveRevision;
		this.saving = !0;
		try {
			let n = await this.hass.callWS({
				type: "opendisplay_studio/update_project",
				project_id: e.id,
				project: e
			});
			t === this.saveRevision && (this.store = {
				...this.store,
				projects: this.store.projects.map((e) => e.id === n.project.id ? n.project : e)
			}, this.schedulePreview());
		} catch (e) {
			this.showToast(e instanceof Error ? e.message : "Could not save project");
		} finally {
			t === this.saveRevision && (this.saving = !1);
		}
	}
	updateProject(e) {
		let t = this.store.projects.map((t) => t.id === this.store.activeProjectId ? {
			...e(t),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} : t);
		this.persist({
			...this.store,
			projects: t
		});
		let n = t.find((e) => e.id === this.store.activeProjectId);
		n && (this.saveProject(n), this.schedulePreview());
	}
	updateLayoutDraft(e) {
		this.layoutDraft &&= e(this.layoutDraft);
	}
	openLayoutEditor() {
		this.layoutDraft = structuredClone(this.project), this.editorMode = "layout", this.selectedRegionId = "", this.mergeAnchor = void 0, this.mergeHover = void 0;
	}
	cancelLayoutEditor() {
		this.layoutDraft = void 0, this.editorMode = "widgets", this.mergeAnchor = void 0, this.mergeHover = void 0;
	}
	applyLayoutEditor() {
		if (!this.layoutDraft) return;
		let e = this.layoutDraft;
		this.updateProject(() => e), this.layoutDraft = void 0, this.editorMode = "widgets", this.mergeAnchor = void 0, this.mergeHover = void 0, this.selectedRegionId = "", this.showToast("Device and layout updated"), this.schedulePreview(0);
	}
	showToast(e) {
		this.toastMessage = e, this.toastTimer && window.clearTimeout(this.toastTimer), this.toastTimer = window.setTimeout(() => {
			this.toastMessage = "";
		}, 2600);
	}
	selectProject(e) {
		this.selectedRegionId = "", this.mergeAnchor = void 0, this.mergeHover = void 0, this.layoutDraft = void 0, this.editorMode = "widgets", this.persist({
			...this.store,
			activeProjectId: e
		}), this.previewHtml = "", this.schedulePreview(0);
	}
	async addProject() {
		let e = ct(`Untitled display ${this.store.projects.length + 1}`);
		try {
			let t = (await this.hass.callWS({
				type: "opendisplay_studio/create_project",
				project: e
			})).project;
			this.persist({
				...this.store,
				activeProjectId: t.id,
				projects: [...this.store.projects, t]
			}), this.selectedRegionId = "", this.layoutDraft = structuredClone(t), this.editorMode = "layout", this.showToast("Display created");
		} catch (e) {
			this.showToast(e instanceof Error ? e.message : "Could not create display");
		}
	}
	async duplicateProject() {
		let e = mt(this.project), t = (await this.hass.callWS({
			type: "opendisplay_studio/create_project",
			project: e
		})).project;
		this.persist({
			...this.store,
			activeProjectId: t.id,
			projects: [...this.store.projects, t]
		}), this.selectedRegionId = "", this.previewHtml = "", this.schedulePreview(0), this.showToast("Display duplicated");
	}
	async deleteProject() {
		await this.hass.callWS({
			type: "opendisplay_studio/delete_project",
			project_id: this.project.id
		});
		let e = this.store.projects.filter((e) => e.id !== this.project.id);
		this.persist({
			...this.store,
			activeProjectId: e[0]?.id ?? "",
			projects: e
		}), this.selectedRegionId = "", this.layoutDraft = void 0, this.editorMode = "widgets", this.previewHtml = "", this.schedulePreview(0), this.showToast("Display deleted");
	}
	setProjectStatus(e) {
		this.updateProject((t) => ({
			...t,
			status: e
		})), this.showToast(e === "ready" ? "Media Source is ready" : "Project moved to Draft");
	}
	openRenameDialog() {
		this.renameDraft = this.project.name, this.renameDialog?.showModal();
	}
	saveProjectName() {
		let e = this.renameDraft.trim();
		e && (this.updateProject((t) => ({
			...t,
			name: e
		})), this.renameDialog?.close(), this.showToast("Name updated"));
	}
	applyDisplayProfile(e, t) {
		let n = W(e), r = q(n, this.canvasProject.orientation), i = r.columns === this.canvasProject.grid.columns && r.rows === this.canvasProject.grid.rows, a = this.canvasProject.regions.flatMap((e) => e.widget ? [e.widget] : []), o = i ? this.canvasProject.regions : K(r).map((e, t) => ({
			...e,
			widget: a[t]
		})), s = nt(n, this.canvasProject.orientation);
		this.updateLayoutDraft((i) => ({
			...i,
			displayId: e,
			driverId: t,
			width: s.width,
			height: s.height,
			palette: n.palettes.includes(i.palette) ? i.palette : n.defaultPalette,
			grid: r,
			regions: o
		})), this.selectedRegionId = "", this.mergeAnchor = void 0, this.mergeHover = void 0, i || this.showToast("Grid adapted to the selected display");
	}
	changeDisplay(e) {
		let t = e.currentTarget.value;
		if (t === "custom") {
			this.updateLayoutDraft((e) => ({
				...e,
				displayId: "custom",
				driverId: void 0
			}));
			return;
		}
		this.applyDisplayProfile(t);
	}
	changePalette(e) {
		let t = e.currentTarget.value;
		this.updateLayoutDraft((e) => ({
			...e,
			palette: t
		}));
	}
	changeOrientation(e) {
		if (e === this.canvasProject.orientation) return;
		let t = this.canvasProject.displayId === "custom" ? {
			columns: this.canvasProject.grid.rows,
			rows: this.canvasProject.grid.columns
		} : q(this.canvasDisplay, e), n = e === "portrait" ? "clockwise" : "counterclockwise", r = ot(this.canvasProject.regions, this.canvasProject.grid, t, n), i = this.canvasProject.displayId === "custom" ? {
			width: this.canvasProject.height,
			height: this.canvasProject.width
		} : nt(this.canvasDisplay, e);
		this.updateLayoutDraft((n) => ({
			...n,
			orientation: e,
			grid: t,
			regions: r,
			...i
		})), this.selectedRegionId = "", this.mergeAnchor = void 0, this.mergeHover = void 0;
	}
	changeCustomSize(e, t) {
		let n = Math.max(64, Math.min(4096, Number(t.currentTarget.value)));
		this.updateLayoutDraft((t) => ({
			...t,
			[e]: n
		}));
	}
	changeGrid(e, t) {
		let n = Math.max(1, Math.min(24, Number(t.currentTarget.value))), r = {
			...this.canvasProject.grid,
			[e]: n
		}, i = this.canvasProject.regions.flatMap((e) => e.widget ? [e.widget] : []), a = K(r).map((e, t) => ({
			...e,
			widget: i[t]
		}));
		this.updateLayoutDraft((e) => ({
			...e,
			grid: r,
			regions: a
		})), this.selectedRegionId = "", this.mergeAnchor = void 0, this.mergeHover = void 0;
	}
	selectionContainsComposedRegion(e, t) {
		let n = Math.min(e.row, t.row), r = Math.max(e.row, t.row), i = Math.min(e.column, t.column), a = Math.max(e.column, t.column);
		return this.canvasProject.regions.some((e) => {
			if (e.rowSpan === 1 && e.columnSpan === 1 && !e.label) return !1;
			let t = e.row + e.rowSpan - 1, o = e.column + e.columnSpan - 1;
			return e.row <= r && t >= n && e.column <= a && o >= i;
		});
	}
	selectMergeCell(e) {
		let t = this.canvasProject.regions.find((t) => rt(t, e));
		if (t && (t.label || t.rowSpan > 1 || t.columnSpan > 1)) return;
		if (!this.mergeAnchor) {
			this.mergeAnchor = e, this.mergeHover = e;
			return;
		}
		if (this.selectionContainsComposedRegion(this.mergeAnchor, e)) {
			this.mergeAnchor = void 0, this.mergeHover = void 0, this.showToast("Remove the existing region before drawing across it");
			return;
		}
		let n = it(this.canvasProject.regions, this.mergeAnchor, e);
		if (!n) {
			this.mergeAnchor = void 0, this.mergeHover = void 0, this.showToast("The selected rectangle crosses an existing merged region");
			return;
		}
		let r = new Set(this.canvasProject.regions.map((e) => e.id)), i = n.find((e) => !r.has(e.id)), a = this.canvasProject.regions.filter((e) => e.label || e.rowSpan > 1 || e.columnSpan > 1).sort((e, t) => e.row - t.row || e.column - t.column), o = new Set(a.map((e, t) => e.label ?? Q(t))), s = 0;
		for (; o.has(Q(s));) s += 1;
		let c = Q(s), l = n.map((e) => e.id === i?.id ? {
			...e,
			label: c
		} : e);
		this.updateLayoutDraft((e) => ({
			...e,
			regions: l
		})), this.selectedRegionId = i?.id ?? "", this.mergeAnchor = void 0, this.mergeHover = void 0, this.showToast(`Region ${c} created`);
	}
	splitSelectedRegion(e) {
		let t = this.canvasProject.regions.find((t) => t.id === e);
		!t || t.rowSpan === 1 && t.columnSpan === 1 && !t.label || (this.updateLayoutDraft((t) => ({
			...t,
			regions: at(t.regions, e)
		})), this.selectedRegionId = "", this.mergeAnchor = void 0, this.mergeHover = void 0, this.showToast("Region removed"));
	}
	assignWidget(e) {
		let t = this.widgetDefinition(e);
		!t || !this.selectedRegion || this.updateProject((e) => ({
			...e,
			regions: e.regions.map((e) => e.id === this.selectedRegionId ? {
				...e,
				widget: {
					type: t.id,
					version: t.version,
					config: { ...t.defaults }
				}
			} : e)
		}));
	}
	removeWidget() {
		this.updateProject((e) => ({
			...e,
			regions: e.regions.map((e) => e.id === this.selectedRegionId ? {
				...e,
				widget: void 0
			} : e)
		}));
	}
	updateWidgetOption(e, t) {
		let n = t.currentTarget, r = e.type === "toggle" ? n.checked : e.type === "number" ? Number(n.value) : n.value;
		this.updateProject((t) => ({
			...t,
			regions: t.regions.map((t) => t.id !== this.selectedRegionId || !t.widget ? t : {
				...t,
				widget: {
					...t.widget,
					config: {
						...t.widget.config,
						[e.key]: r
					}
				}
			})
		}));
	}
	renderProjectRail() {
		return E`
      <aside class="project-rail" aria-label="Saved displays">
        <div class="rail-heading"><h2>Displays</h2><button class="text-button" @click=${this.addProject}>+ New</button></div>
        <div class="project-list">
          ${this.store.projects.map((e) => {
			let t = {
				width: e.width,
				height: e.height
			};
			return E`
              <button class="project-card ${e.id === this.project.id ? "active" : ""}" @click=${() => this.selectProject(e.id)}>
                <span class="mini-screen" style=${I({ "--mini-aspect": String(t.width / t.height) })}>${e.grid.columns}×${e.grid.rows}</span>
                <span class="project-card-copy"><strong>${e.name}</strong><span>${this.displayName(e)} · ${e.status === "ready" ? "Ready" : "Draft"}</span>${e.status === "ready" ? E`<code>media-source://opendisplay_studio/${e.id}</code>` : O}</span>
              </button>
            `;
		})}
        </div>
        <div class="rail-footer">Stored by Home Assistant.<br />Ready displays become Media Sources.</div>
        <div class="rail-actions" aria-label="Project actions">
          <button class="rail-action danger" @click=${this.deleteProject}>${Y(Ge)} Delete</button>
        </div>
      </aside>
    `;
	}
	renderToolbar() {
		let e = this.canvasProject, t = this.canvasDisplay;
		return E`
      <div class="device-toolbar layout-toolbar">
        <div class="control grow">
          <label for="device-model">Device model</label>
          <select id="device-model" .value=${e.displayId === "custom" ? "custom" : t.id} @change=${this.changeDisplay}>
            <optgroup label="SOLUM · Newton Pro">
              ${U.filter((e) => e.family === "Newton Pro").map((e) => E`
                <option value=${e.id}>${e.name} · ${e.nativeWidth}×${e.nativeHeight}${e.freezer ? " · mono" : ""}</option>
              `)}
            </optgroup>
            <optgroup label="Seeed · ready to use">
              ${U.filter((e) => e.family === "OpenDisplay" && e.manufacturer === "Seeed Studio").map((e) => E`
                <option value=${e.id}>${e.name} · ${e.nativeWidth}×${e.nativeHeight}</option>
              `)}
            </optgroup>
            <optgroup label="Other OpenDisplay hardware">
              ${U.filter((e) => e.family === "OpenDisplay" && e.manufacturer !== "Seeed Studio").map((e) => E`
                <option value=${e.id}>${e.name} · ${e.nativeWidth}×${e.nativeHeight}</option>
              `)}
            </optgroup>
            <optgroup label="Custom hardware">
              <option value="custom">Custom resolution</option>
            </optgroup>
          </select>
        </div>
        ${e.displayId === "custom" ? E`
          <div class="control custom-control">
            <label for="custom-width">Width</label>
            <input id="custom-width" type="number" min="64" max="4096" .value=${String(e.width)} @change=${(e) => this.changeCustomSize("width", e)} />
          </div>
          <div class="control custom-control">
            <label for="custom-height">Height</label>
            <input id="custom-height" type="number" min="64" max="4096" .value=${String(e.height)} @change=${(e) => this.changeCustomSize("height", e)} />
          </div>
        ` : O}
        <div class="control">
          <label for="palette">Palette</label>
          <select id="palette" .value=${e.palette} @change=${this.changePalette}>
            ${(e.displayId === "custom" ? Object.keys(z) : t.palettes).map((e) => E`<option value=${e}>${z[e]}</option>`)}
          </select>
        </div>
        <div class="control">
          <span class="field-label">Orientation</span>
          <div class="segment" role="group" aria-label="Display orientation">
            <button class=${e.orientation === "landscape" ? "active" : ""} @click=${() => this.changeOrientation("landscape")}>Landscape</button>
            <button class=${e.orientation === "portrait" ? "active" : ""} @click=${() => this.changeOrientation("portrait")}>Portrait</button>
          </div>
        </div>
        <div class="control"><label for="grid-columns">Columns</label><input id="grid-columns" type="number" min="1" max="24" .value=${String(e.grid.columns)} @change=${(e) => this.changeGrid("columns", e)} /></div>
        <div class="control"><label for="grid-rows">Rows</label><input id="grid-rows" type="number" min="1" max="24" .value=${String(e.grid.rows)} @change=${(e) => this.changeGrid("rows", e)} /></div>
      </div>
    `;
	}
	renderWidgetToolbar() {
		let e = {
			width: this.project.width,
			height: this.project.height
		};
		return E`
      <div class="device-toolbar widget-toolbar">
        <div class="device-summary">
          <span class="step-kicker">Step 2 · Widgets</span>
          <strong>${this.displayName(this.project)}</strong>
          <span>${e.width}×${e.height} · ${z[this.project.palette]} · ${this.project.grid.columns}×${this.project.grid.rows} grid</span>
        </div>
        <ha-button size="s" appearance="outlined" @click=${this.openLayoutEditor}>${X(Ze)} Edit device & layout</ha-button>
      </div>
    `;
	}
	renderScreenRegion(e) {
		let t = e.widget ? this.widgetDefinition(e.widget.type) : void 0, n = e.columnSpan === 1 || e.rowSpan === 1, r = this.editorMode === "layout", i = !r && !!this.previewHtml, a = !!e.label || e.rowSpan > 1 || e.columnSpan > 1, o = this.canvasProject.regions.filter((e) => e.label || e.rowSpan > 1 || e.columnSpan > 1).sort((e, t) => e.row - t.row || e.column - t.column), s = a ? e.label ?? Q(o.findIndex((t) => t.id === e.id)) : `${e.column}.${e.row}`;
		return E`
      <section
        class="screen-region ${r ? "layout-region" : e.widget ? "" : "empty"} ${i ? "preview-region" : ""} ${!r && e.id === this.selectedRegionId ? "selected" : ""}"
        style=${I({
			gridColumn: `${e.column} / span ${e.columnSpan}`,
			gridRow: `${e.row} / span ${e.rowSpan}`
		})}
        aria-label=${r ? a ? `Region ${s}` : `Grid cell ${s}` : t ? `${t.name} region` : "Empty region"}
        @click=${() => {
			r || (this.selectedRegionId = e.id);
		}}
        @dblclick=${() => {
			r && this.splitSelectedRegion(e.id);
		}}
      >
        ${i ? O : r ? a ? E`<div class="layout-region-copy composed"><strong>${s}</strong><span>${e.columnSpan}×${e.rowSpan} region</span></div>` : O : t && e.widget ? t.render(e.widget.config, {
			compact: n,
			palette: this.project.palette
		}) : E`<div class="empty-region-copy"><strong>Add widget</strong><span>${e.columnSpan}×${e.rowSpan} region</span></div>`}
      </section>
    `;
	}
	renderMergeLayer() {
		if (this.editorMode !== "layout") return E``;
		let e = Array.from({ length: this.canvasProject.grid.columns * this.canvasProject.grid.rows }, (e, t) => ({
			row: Math.floor(t / this.canvasProject.grid.columns) + 1,
			column: t % this.canvasProject.grid.columns + 1
		})), t = this.mergeHover ?? this.mergeAnchor, n = !!(this.mergeAnchor && t && this.selectionContainsComposedRegion(this.mergeAnchor, t));
		return E`
      <div class="merge-layer active" aria-label="Region composition grid" @pointerleave=${() => {
			this.mergeHover = void 0;
		}}>
        ${e.map((e) => {
			let r = this.canvasProject.regions.find((t) => rt(t, e)), i = !!(r && (r.label || r.rowSpan > 1 || r.columnSpan > 1)), a = !!(this.mergeAnchor && t && e.row >= Math.min(this.mergeAnchor.row, t.row) && e.row <= Math.max(this.mergeAnchor.row, t.row) && e.column >= Math.min(this.mergeAnchor.column, t.column) && e.column <= Math.max(this.mergeAnchor.column, t.column));
			return E`
            <button
              class="merge-cell ${i ? "occupied" : ""} ${a ? "preview" : ""} ${n && a ? "invalid" : ""} ${this.mergeAnchor?.row === e.row && this.mergeAnchor?.column === e.column ? "anchor" : ""}"
              aria-label=${i ? `Existing region at column ${e.column}, row ${e.row}; double-click to remove` : `Grid cell column ${e.column}, row ${e.row}`}
              @pointerenter=${() => {
				this.mergeAnchor && (this.mergeHover = e);
			}}
              @click=${() => this.selectMergeCell(e)}
              @dblclick=${(e) => {
				e.preventDefault(), e.stopPropagation(), i && r && this.splitSelectedRegion(r.id);
			}}
            >${i ? O : `${e.column}.${e.row}`}</button>
          `;
		})}
      </div>
    `;
	}
	renderCanvas() {
		let e = this.canvasProject, t = this.canvasDisplay, n = {
			width: e.width,
			height: e.height
		};
		return E`
      <main class="canvas-area">
        <div class="canvas-stage">
          <div class="screen-meta"><span>${e.displayId === "custom" ? "CUSTOM DISPLAY" : `${t.manufacturer} · ${t.diagonal}″`}</span><code>${n.width} × ${n.height} px</code></div>
          <div class="preview-boundary">
            <div class="screen-fit">
              <div class="screen-bezel">
                <div
                  id="display-screen"
                  class="display-screen ${this.editorMode === "widgets" && this.previewHtml ? "live-preview" : ""}"
                  data-palette=${e.palette}
                  style=${I({
			"--grid-columns": String(e.grid.columns),
			"--grid-rows": String(e.grid.rows),
			width: `${n.width}px`,
			height: `${n.height}px`
		})}
                >
                  ${this.editorMode === "widgets" && this.previewHtml ? E`
                      <iframe class="html-preview" title="Live Home Assistant data preview" sandbox="" .srcdoc=${this.previewDocument()}></iframe>
                      <div
                        class="preview-overlay"
                        style=${I({
			"--grid-columns": String(e.grid.columns),
			"--grid-rows": String(e.grid.rows),
			"--preview-gap": `${Math.max(3, Math.min(10, Math.round(Math.min(n.width, n.height) / 60)))}px`
		})}
                      >${e.regions.map((e) => this.renderScreenRegion(e))}</div>
                    ` : E`
                      ${e.regions.map((e) => this.renderScreenRegion(e))}
                      ${this.renderMergeLayer()}
                    `}
                </div>
              </div>
            </div>
          </div>
          ${this.editorMode === "layout" ? this.mergeAnchor ? E`<div class="merge-help"><strong>First corner selected.</strong> Move across the grid and click the opposite corner.</div>` : E`<div class="merge-help"><strong>Draw a region:</strong> Click two opposite corners. Double-click a region to remove it.</div>` : E`<div class="merge-help"><strong>Live preview:</strong> ${this.previewError ? this.previewError : this.previewLoading ? "Refreshing current Home Assistant data…" : this.previewTimings ? `Liquid + data composed in ${this.previewTimings.compose.toFixed(1)} ms. Select a region to configure it.` : "Select a region to configure its content."}</div>`}
        </div>
      </main>
    `;
	}
	renderOption(e) {
		let t = this.selectedRegion?.widget, n = t?.config[e.key] ?? (t ? this.widgetDefinition(t.type)?.defaults[e.key] : void 0), r = e.selector ?? (e.type === "calendar" ? { entity: { filter: { domain: "calendar" } } } : e.type === "entities" ? { entity: { multiple: !0 } } : e.type === "entity" ? { entity: {} } : void 0);
		return r ? E`
        <ha-form
          .hass=${this.hass}
          .data=${{ [e.key]: n ?? "" }}
          .schema=${[{
			name: e.key,
			label: e.label,
			required: e.required ?? !1,
			selector: r
		}]}
          @value-changed=${(t) => this.updateWidgetValue(e, t.detail.value[e.key])}
        ></ha-form>
      ` : e.type === "toggle" ? E`
      <div class="toggle-field"><label for=${`option-${e.key}`}>${e.label}</label><input id=${`option-${e.key}`} class="toggle" type="checkbox" .checked=${!!n} @change=${(t) => this.updateWidgetOption(e, t)} /></div>
    ` : e.type === "select" ? E`
      <div class="field">
        <label class="field-label" for=${`option-${e.key}`}>${e.label}</label>
        <select id=${`option-${e.key}`} .value=${String(n ?? "")} @change=${(t) => this.updateWidgetOption(e, t)}>
          ${e.options?.map((e) => E`<option value=${e.value}>${e.label}</option>`)}
        </select>
      </div>
    ` : e.type === "text" && e.multiline ? E`
      <div class="field">
        <label class="field-label" for=${`option-${e.key}`}>${e.label}</label>
        <textarea id=${`option-${e.key}`} rows="4" .value=${String(n ?? "")} @change=${(t) => this.updateWidgetOption(e, t)}></textarea>
      </div>
    ` : E`
      <div class="field">
        <label class="field-label" for=${`option-${e.key}`}>${e.label}</label>
        <input id=${`option-${e.key}`} type=${e.type} .value=${String(n ?? "")} min=${e.min ?? O} max=${e.max ?? O} step=${e.step ?? O} @change=${(t) => this.updateWidgetOption(e, t)} />
      </div>
    `;
	}
	updateWidgetValue(e, t) {
		let n = Array.isArray(t) ? t.map((e) => String(e)) : typeof t == "string" || typeof t == "number" || typeof t == "boolean" ? t : String(t ?? "");
		this.updateProject((t) => ({
			...t,
			regions: t.regions.map((t) => t.id !== this.selectedRegionId || !t.widget ? t : {
				...t,
				widget: {
					...t.widget,
					config: {
						...t.widget.config,
						[e.key]: n
					}
				}
			})
		}));
	}
	renderInspector() {
		let e = this.selectedRegion;
		if (!e) return E`
      <aside class="inspector"><div class="inspector-heading"><h2>Region settings</h2></div><div class="inspector-empty"><div><strong>Select a region</strong><p>Choose a region on the display to assign a widget and configure its data.</p></div></div></aside>
    `;
		let t = e.widget ? this.widgetDefinition(e.widget.type) : void 0;
		return E`
      <aside class="inspector">
        <div class="inspector-heading"><h2>Region settings</h2><span class="region-address">R${e.row}:C${e.column} · ${e.columnSpan}×${e.rowSpan}</span></div>
        <div class="widget-picker">
          ${ut.map((e) => E`
            <button class="widget-choice ${t?.id === e.id ? "active" : ""}" @click=${() => this.assignWidget(e.id)}>
              ${Y(e.icon)}<strong>${e.name}</strong><span>${e.description}</span>
            </button>
          `)}
        </div>
        ${t ? E`<div class="option-form">${t.options.map((e) => this.renderOption(e))}</div><div class="danger-zone"><ha-button size="s" variant="danger" appearance="outlined" @click=${this.removeWidget}>${X(Ge)} Remove widget</ha-button></div>` : E`<div class="inspector-empty"><div><strong>Choose a widget</strong><p>Each widget brings its own data source and configuration fields.</p></div></div>`}
      </aside>
    `;
	}
	renderLayoutGuide() {
		let e = this.canvasProject, t = {
			width: e.width,
			height: e.height
		};
		return E`
      <aside class="inspector layout-guide">
        <span class="step-kicker">Step 1 · Device & layout</span>
        <h2>Prepare the canvas</h2>
        <p>Choose the hardware and palette, then compose regions before assigning widgets.</p>
        <dl class="device-facts">
          <div><dt>Device</dt><dd>${this.displayName(e)}</dd></div>
          <div><dt>Output</dt><dd>${t.width} × ${t.height} px</dd></div>
          <div><dt>Grid</dt><dd>${e.grid.columns} × ${e.grid.rows}</dd></div>
          <div><dt>Regions</dt><dd>${e.regions.length}</dd></div>
        </dl>
        <ol class="layout-instructions">
          <li>Click the first corner of a new region.</li>
          <li>Move across the grid and click the opposite corner.</li>
          <li>Double-click an existing region to remove it.</li>
        </ol>
      </aside>
    `;
	}
	renderRenameDialog() {
		return E`
      <dialog id="rename-dialog"><div class="dialog-body">
        <h2>Rename display</h2><p>Use a name that describes where this display will be installed.</p>
        <div class="field"><label class="field-label" for="display-name">Display name</label><input id="display-name" type="text" .value=${this.renameDraft} @input=${(e) => {
			this.renameDraft = e.currentTarget.value;
		}} @keydown=${(e) => {
			e.key === "Enter" && this.saveProjectName();
		}} /></div>
        <div class="dialog-actions"><ha-button appearance="outlined" @click=${() => this.renameDialog?.close()}>Cancel</ha-button><ha-button variant="brand" @click=${this.saveProjectName}>Save name</ha-button></div>
      </div></dialog>
    `;
	}
	renderWelcome() {
		return E`
      <div class="app-shell welcome-shell">
        <header class="topbar welcome-topbar">
          <div class="brand"><span class="brand-mark">ODX</span><span class="brand-copy"><strong>OpenDisplay Studio</strong><span>Proof of Concept</span></span></div>
          <span class="welcome-topline">Device-accurate e-paper composition</span>
          <ha-button size="s" variant="brand" @click=${this.addProject}>${X(Je)} New display</ha-button>
        </header>
        <div class="workspace welcome-workspace">
          <aside class="project-rail empty-rail" aria-label="Saved displays">
            <div class="rail-heading"><h2>Displays</h2><button class="text-button" @click=${this.addProject}>+ New</button></div>
            <div class="empty-library"><span class="empty-library-count">0</span><strong>No displays yet</strong><p>Your saved screens will appear here.</p></div>
            <div class="rail-footer">Stored securely by Home Assistant.</div>
          </aside>
          <main class="welcome-main">
            <section class="welcome-copy">
              <span class="step-kicker">Start with the hardware</span>
              <h1>Design an e-paper screen that fits the device.</h1>
              <p>Choose a verified display, compose its native-pixel layout, then add widgets and export the exact screen as PNG or JPG.</p>
              <div class="welcome-actions">
                <ha-button size="l" variant="brand" @click=${this.addProject}>${X(Je)} Create your first display</ha-button>
              </div>
              <dl class="welcome-facts">
                <div><dt>1</dt><dd><strong>Select hardware</strong><span>Model, palette and orientation</span></dd></div>
                <div><dt>2</dt><dd><strong>Compose regions</strong><span>Device-aware native grid</span></dd></div>
                <div><dt>3</dt><dd><strong>Add widgets</strong><span>Preview and export one surface</span></dd></div>
              </dl>
            </section>
            <div class="welcome-visual" aria-hidden="true">
              <div class="welcome-device-meta"><span>OPEN DISPLAY</span><code>800 × 480</code></div>
              <div class="welcome-device">
                <div class="welcome-screen">
                  <div class="welcome-region welcome-region-a"><span>A</span><i></i><i></i></div>
                  <div class="welcome-region welcome-region-b"><span>B</span><b>21°</b><small>HOME</small></div>
                  <div class="welcome-region welcome-region-c"><span>C</span><em></em><em></em><em></em></div>
                </div>
              </div>
              <div class="welcome-palette"><i></i><i></i><i></i><i></i><i></i><i></i><span>SPECTRA 6</span></div>
            </div>
          </main>
        </div>
      </div>
      ${this.toastMessage ? E`<div class="toast" role="status">${this.toastMessage}</div>` : O}
    `;
	}
	render() {
		return this.loading ? E`<div class="loading-state"><ha-circular-progress active></ha-circular-progress><p>Loading OpenDisplay Studio…</p></div>` : this.loadError ? E`<div class="loading-state"><ha-alert alert-type="error">${this.loadError}</ha-alert><ha-button @click=${this.loadProjects}>Retry</ha-button></div>` : this.store.projects.length === 0 ? this.renderWelcome() : E`
      <div class="app-shell">
        <header class="topbar">
          <div class="brand"><span class="brand-mark">ODX</span><span class="brand-copy"><strong>OpenDisplay Studio</strong><span>Proof of Concept</span></span></div>
          <div class="project-context">
            <div class="project-title"><strong>${this.project.name}</strong><span class="autosave-state">${this.editorMode === "layout" ? "Changes not applied" : this.saving ? "Saving…" : "Saved in Home Assistant"}</span></div>
            <div class="workflow" aria-label="Editor workflow">
              <span class=${this.editorMode === "layout" ? "active" : "complete"}><b>1</b> Device & layout</span>
              <i aria-hidden="true"></i>
              <span class=${this.editorMode === "widgets" ? "active" : ""}><b>2</b> Widgets</span>
            </div>
          </div>
          <div class="top-actions">
            ${this.editorMode === "layout" ? E`<ha-button size="s" appearance="plain" @click=${this.cancelLayoutEditor}>Cancel</ha-button><ha-button size="s" variant="brand" appearance="filled" @click=${this.applyLayoutEditor}>${X(Ue)} Apply layout</ha-button>` : E`
                  <ha-button class="secondary-action" size="s" appearance="outlined" @click=${this.openRenameDialog}>${X(Ye)} Rename</ha-button>
                  <ha-button class="secondary-action" size="s" appearance="outlined" @click=${this.duplicateProject}>${X(We)} Duplicate</ha-button>
                  <ha-button size="s" variant=${this.project.status === "ready" ? "neutral" : "brand"} @click=${() => this.setProjectStatus(this.project.status === "ready" ? "draft" : "ready")}>${this.project.status === "ready" ? "Move to Draft" : "Mark Ready"}</ha-button>
                `}
          </div>
        </header>
        <div class="workspace">
          ${this.renderProjectRail()}
          <section class="editor">${this.editorMode === "layout" ? this.renderToolbar() : this.renderWidgetToolbar()}${this.renderCanvas()}</section>
          ${this.editorMode === "layout" ? this.renderLayoutGuide() : this.renderInspector()}
        </div>
      </div>
      ${this.renderRenameDialog()}
      ${this.toastMessage ? E`<div class="toast" role="status">${this.toastMessage}</div>` : O}
    `;
	}
};
Z([Fe({ attribute: !1 })], $.prototype, "hass", void 0), Z([P()], $.prototype, "store", void 0), Z([P()], $.prototype, "selectedRegionId", void 0), Z([P()], $.prototype, "mergeAnchor", void 0), Z([P()], $.prototype, "mergeHover", void 0), Z([P()], $.prototype, "toastMessage", void 0), Z([P()], $.prototype, "loading", void 0), Z([P()], $.prototype, "saving", void 0), Z([P()], $.prototype, "loadError", void 0), Z([P()], $.prototype, "renameDraft", void 0), Z([P()], $.prototype, "editorMode", void 0), Z([P()], $.prototype, "layoutDraft", void 0), Z([P()], $.prototype, "widgetMetadata", void 0), Z([P()], $.prototype, "previewHtml", void 0), Z([P()], $.prototype, "previewLoading", void 0), Z([P()], $.prototype, "previewError", void 0), Z([P()], $.prototype, "previewTimings", void 0), Z([F(".preview-boundary")], $.prototype, "previewBoundary", void 0), Z([F(".screen-fit")], $.prototype, "screenFit", void 0), Z([F(".screen-bezel")], $.prototype, "screenBezel", void 0), Z([F("#rename-dialog")], $.prototype, "renameDialog", void 0), $ = Z([Me("opendisplay-studio-panel")], $);
//#endregion
export { $ as OdxApp };
