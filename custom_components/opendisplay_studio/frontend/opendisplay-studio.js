//#region src/strings.ts
var e = (e, t) => `${e} × ${t}`, t = {
	common: {
		increase: "Increase",
		decrease: "Decrease",
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
		unlock: "Unlock",
		group: "Make group",
		ungroup: "Ungroup",
		enterGroup: "Enter group",
		exitGroup: "Exit group",
		deselect: "Deselect",
		copy: "Copy",
		cut: "Cut",
		paste: "Paste",
		pasteHere: "Paste here",
		duplicate: "Duplicate",
		rename: "Rename",
		bringToFront: "Bring to front",
		sendToBack: "Send to back",
		moveUp: "Move up",
		moveDown: "Move down",
		save: "Save dashboard",
		toggleCode: "Switch between design and code",
		zoomIn: "Zoom in",
		zoomOut: "Zoom out",
		zoomReset: "Reset zoom",
		showShortcuts: "Keyboard shortcuts",
		nudge: {
			left: "Nudge left",
			right: "Nudge right",
			up: "Nudge up",
			down: "Nudge down"
		}
	},
	app: {
		loading: "Loading OpenDisplay Studio…",
		loadFailed: "Could not load OpenDisplay Studio",
		createFailed: "Could not create the dashboard",
		sentToDevice: "Sent to the device",
		sendFailed: "Could not send the dashboard to the device",
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
		deleteElementsTitle: (e) => `Delete ${e} elements?`,
		deleteContainerBody: "This removes the container and everything in it. You can restore it with Undo.",
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
		fromDevice: "From device",
		fromDeviceHint: "Size and colors",
		preset: "Predefined display",
		presetHint: "Pick a known display",
		customSize: "Custom size",
		customSizeHint: "Set size and colors",
		device: "Device",
		display: "Display",
		loadingDevices: "Looking for OpenDisplay devices…",
		noDevices: "No OpenDisplay devices found. Set up the OpenDisplay integration, or start from a predefined display.",
		deviceDetails: "Dashboard size and colors",
		colors: "Colors",
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
		sendToDevice: "Send to device",
		sendingToDevice: "Sending…",
		save: "Save",
		saving: "Saving…",
		help: "Keyboard shortcuts"
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
		containers: "Containers",
		container: "Container",
		containerHint: "Holds other elements and moves them together.",
		noContainers: "No matching containers",
		noWidgets: "No matching widgets",
		reloadWidgets: "Reload widgets",
		userWidget: "user",
		widgetErrors: (e) => `${e} widget ${e === 1 ? "package" : "packages"} could not be loaded`,
		widgetsReloaded: (e, t) => t === 0 ? `Widgets reloaded — ${e} loaded` : `Widgets reloaded — ${e} loaded, ${t} failed`,
		reloadFailed: "Could not reload the widgets",
		noPrimitives: "No matching primitives",
		entryHint: (e) => `${e} Click or drag to add.`
	},
	shortcuts: {
		eyebrow: "Help",
		title: "Keyboard shortcuts",
		open: "Keyboard shortcuts",
		groups: {
			edit: "Edit",
			arrange: "Arrange",
			group: "Groups",
			view: "View",
			history: "History"
		}
	},
	structure: {
		title: "Structure",
		heading: "Elements",
		collapse: "Collapse inspector",
		empty: "Drag widgets or primitives onto the canvas.",
		widget: "Widget",
		reorderTitle: "Reorder layer",
		reorder: (e) => `Reorder ${e}`,
		root: (e) => `Root (${e} ${e === 1 ? "widget" : "widgets"})`,
		rootName: "Root",
		breadcrumb: "Group being edited",
		exit: "Exit",
		container: "Container",
		group: "Group",
		groupBadge: "Group",
		search: "Search layers",
		searchPlaceholder: "Search layers…",
		rename: "Element name",
		collapseRow: (e) => `Collapse ${e}`,
		expandRow: (e) => `Expand ${e}`
	},
	inspector: {
		alignInParent: "Align in Parent",
		expand: "Expand inspector",
		rail: "Layers",
		resize: "Resize inspector",
		dashboard: "Dashboard",
		dashboardHint: "Working area settings",
		workingArea: "Working area",
		workingAreaHelp: "Padding defines the editable safe area. Snap aligns movement and resizing to pixel increments.",
		layout: "Layout",
		widgetSettings: "Widget settings",
		background: "Background",
		backgroundEnabled: "Background",
		backgroundFill: "Fill",
		backgroundOutline: "Outline",
		backgroundWidth: "Outline width",
		backgroundRadius: "Corner radius",
		kindContainer: "Container",
		kindGroup: "Group",
		groupedChip: "Grouped",
		selectedElements: (e) => `${e} elements`,
		selectionHint: "Move, hide, lock or delete them together. Group them to keep them as one.",
		boundingBox: "Bounding box",
		removeElements: "Remove elements",
		dataSources: "Data sources",
		widgetMissing: (e) => `The widget ${e} is not installed. It keeps its settings and draws again once the package returns.`,
		appearance: "Appearance",
		diagnostics: "Render diagnostics",
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
		scalingLocked: (e) => `The group cannot be resized: ${e} has a position or size driven by an expression`,
		cornerFields: "Edit corners",
		derivedFields: "Edit position and size"
	},
	canvas: {
		rendering: "Rendering…",
		menuLabel: "Canvas actions",
		enterGroupHint: "Enter / double-click to edit",
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
		anchor: "Anchor",
		name: "Dashboard name",
		rotation: "Rotation",
		resolution: "Resolution",
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
	rotations: {
		0: "0°",
		90: "90°",
		180: "180°",
		270: "270°"
	},
	anchors: {
		lt: "Top left",
		mt: "Top center",
		rt: "Top right",
		lm: "Middle left",
		mm: "Center",
		rm: "Middle right",
		lb: "Bottom left",
		mb: "Bottom center",
		rb: "Bottom right"
	},
	colors: {
		clear: "Clear color",
		none: "None",
		accent: "Accent",
		gray: (e) => `Gray ${e}`,
		names: {
			black: "Black",
			white: "White",
			red: "Red",
			yellow: "Yellow",
			blue: "Blue",
			green: "Green",
			orange: "Orange"
		}
	},
	palettes: {
		bw: "Black / white",
		bwr: "Black / white / red",
		bwy: "Black / white / yellow",
		bwry: "Black / white / red / yellow",
		spectra6: "Spectra 6 · black / white / red / yellow / blue / green",
		seven_color: "Seven colors · Spectra 6 and orange",
		grayscale4: "Grayscale · 4 levels",
		grayscale8: "Grayscale · 8 levels",
		grayscale16: "Grayscale · 16 levels"
	}
}, n = {
	common: {
		increase: "Erhöhen",
		decrease: "Verringern",
		cancel: "Abbrechen",
		close: "Schließen"
	},
	commands: {
		undo: "Rückgängig",
		redo: "Wiederholen",
		delete: "Löschen",
		hide: "Ausblenden",
		show: "Einblenden",
		lock: "Sperren",
		unlock: "Entsperren"
	},
	app: {
		loading: "OpenDisplay Studio wird geladen…",
		loadFailed: "OpenDisplay Studio konnte nicht geladen werden",
		createFailed: "Das Dashboard konnte nicht erstellt werden",
		sentToDevice: "An das Gerät gesendet",
		sendFailed: "Das Dashboard konnte nicht an das Gerät gesendet werden",
		saveFailed: "Das Dashboard konnte nicht gespeichert werden",
		deleteFailed: "Das Dashboard konnte nicht gelöscht werden",
		renameFailed: "Das Dashboard konnte nicht umbenannt werden",
		duplicateFailed: "Das Dashboard konnte nicht dupliziert werden",
		settingsFailed: "Die Dashboard-Einstellungen konnten nicht aktualisiert werden",
		previewFailed: "Die Vorschau konnte nicht gerendert werden",
		renameEmpty: "Der Dashboard-Name darf nicht leer sein",
		discardChanges: "Ungespeicherte Änderungen am Dashboard verwerfen?",
		unsupportedPrimitive: (e) => `Nicht unterstützter Primitiv-Typ: ${e || "(leer)"}`,
		confirmRemoval: "Entfernen bestätigen",
		deleteElementTitle: (e) => `${e} löschen?`,
		deleteElementBody: "Das Element wird aus dem Dashboard entfernt. Mit Rückgängig kannst du es wiederherstellen.",
		deleteElement: "Element löschen"
	},
	gallery: {
		title: "Dashboards",
		count: (e) => `${e} ${e === 1 ? "Dashboard" : "Dashboards"}`,
		newDashboard: "Neues Dashboard",
		addDashboard: "Dashboard hinzufügen",
		filters: "Dashboard-Filter",
		search: "Dashboards durchsuchen",
		searchPlaceholder: "Dashboards durchsuchen…",
		sort: "Sortieren",
		sortDashboards: "Dashboards sortieren",
		sortUpdated: "Zuletzt geändert",
		sortName: "Name A–Z",
		savedDashboards: "Gespeicherte Dashboards",
		noResults: "Keine Dashboards gefunden",
		noResultsHint: "Versuche eine andere Suche.",
		updated: (e) => `Geändert ${e}`,
		open: (e) => `Dashboard ${e} öffnen`,
		actionsFor: (e) => `Aktionen für Dashboard ${e}`,
		menuFor: (e) => `Aktionen für ${e}`,
		renameField: (e) => `Dashboard ${e} umbenennen`,
		menu: {
			rename: "Umbenennen",
			duplicate: "Duplizieren",
			settings: "Display-Einstellungen",
			delete: "Löschen"
		},
		deleteTitle: "Dashboard löschen?",
		deleteBody: "und alle seine Elemente werden endgültig entfernt.",
		deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden.",
		deleteAction: "Dashboard löschen",
		deleting: "Wird gelöscht…",
		settingsTitle: "Display-Einstellungen",
		settingsSave: "Änderungen speichern",
		saving: "Wird gespeichert…"
	},
	newDashboard: {
		title: "Neues Dashboard",
		subtitle: "Eine eigene OpenDisplay-Fläche erstellen",
		startFrom: "Beginnen mit",
		sources: "Dashboard-Quelle",
		fromDevice: "Von Gerät",
		fromDeviceHint: "Größe und Farben",
		preset: "Vordefiniertes Display",
		presetHint: "Ein bekanntes Display wählen",
		customSize: "Eigene Größe",
		customSizeHint: "Größe und Farben festlegen",
		device: "Gerät",
		display: "Display",
		loadingDevices: "OpenDisplay-Geräte werden gesucht…",
		noDevices: "Keine OpenDisplay-Geräte gefunden. Richte die OpenDisplay-Integration ein oder beginne mit einem vordefinierten Display.",
		deviceDetails: "Größe und Farben des Dashboards",
		colors: "Farben",
		create: "Dashboard erstellen",
		creating: "Wird erstellt…"
	},
	header: {
		dashboards: "Dashboards",
		name: "Dashboard-Name",
		view: "Dashboard-Ansicht",
		design: "Entwurf",
		code: "Code",
		setDraft: "Als Entwurf markieren",
		setReady: "Als fertig markieren",
		sendToDevice: "An Gerät senden",
		sendingToDevice: "Wird gesendet…",
		save: "Speichern",
		saving: "Wird gespeichert…"
	},
	library: {
		title: "Bibliothek",
		heading: "Elemente",
		expand: "Elementkatalog ausklappen",
		collapse: "Elementkatalog einklappen",
		search: "Widgets und Primitive durchsuchen",
		searchPlaceholder: "Elemente durchsuchen…",
		widgets: "Widgets",
		primitives: "Primitive",
		noWidgets: "Keine passenden Widgets",
		reloadWidgets: "Widgets neu laden",
		userWidget: "eigenes",
		widgetErrors: (e) => `${e} ${e === 1 ? "Widget-Paket konnte" : "Widget-Pakete konnten"} nicht geladen werden`,
		widgetsReloaded: (e, t) => t === 0 ? `Widgets neu geladen — ${e} geladen` : `Widgets neu geladen — ${e} geladen, ${t} fehlgeschlagen`,
		reloadFailed: "Die Widgets konnten nicht neu geladen werden",
		noPrimitives: "Keine passenden Primitive",
		entryHint: (e) => `${e} Zum Hinzufügen klicken oder ziehen.`
	},
	structure: {
		title: "Struktur",
		heading: "Elemente",
		collapse: "Inspektor einklappen",
		empty: "Ziehe Widgets oder Primitive auf die Fläche.",
		widget: "Widget",
		reorderTitle: "Ebene neu anordnen",
		reorder: (e) => `${e} neu anordnen`
	},
	inspector: {
		alignInParent: "Im Elternelement ausrichten",
		expand: "Inspektor ausklappen",
		rail: "Ebenen",
		resize: "Breite des Inspektors ändern",
		dashboard: "Dashboard",
		dashboardHint: "Einstellungen des Arbeitsbereichs",
		workingArea: "Arbeitsbereich",
		workingAreaHelp: "Der Rand legt den sicheren Bearbeitungsbereich fest. Das Einrasten richtet Bewegen und Skalieren an ganzen Pixeln aus.",
		layout: "Layout",
		widgetSettings: "Widget-Einstellungen",
		dataSources: "Datenquellen",
		widgetMissing: (e) => `Das Widget ${e} ist nicht installiert. Es behält seine Einstellungen und wird wieder gezeichnet, sobald das Paket zurückkehrt.`,
		appearance: "Darstellung",
		diagnostics: "Render-Diagnose",
		removeElement: "Element entfernen",
		locked: "Position ist gesperrt",
		unlock: "Entsperren",
		unlockElement: "Elementposition entsperren",
		kindWidget: "Widget",
		kindPrimitive: "ODL-Primitiv",
		subtitle: (e, t) => `${e} · ${t ? "Position gesperrt" : "bearbeitbar"}`,
		metrics: {
			queue: "Warteschlange",
			data: "Daten",
			compile: "Kompilieren",
			render: "Rendern",
			encode: "Kodieren",
			total: "Gesamt"
		}
	},
	expression: {
		toggleLabel: (e) => `Ausdruck für ${e}`,
		toggleTooltip: "Ausdruck (oder { eingeben)",
		visibleLabel: "Sichtbarkeit",
		alwaysVisible: "Immer sichtbar",
		positionLocked: (e) => `Die Position wird von einem Ausdruck bestimmt (${e})`,
		cornerFields: "Ecken bearbeiten",
		derivedFields: "Position und Größe bearbeiten"
	},
	canvas: {
		rendering: "Wird gerendert…",
		previewAlt: "Vom Backend gerenderte Display-Vorschau",
		hidden: "Ausgeblendet",
		layers: (e) => `${e} ${e === 1 ? "Ebene" : "Ebenen"}`,
		padding: (e) => `Rand ${e}px`,
		snap: (e) => `Einrasten ${e}px`,
		resizeHandle: (e, t) => `${e} von ${t} skalieren`,
		sides: {
			nw: "Nordwesten",
			n: "Norden",
			ne: "Nordosten",
			e: "Osten",
			se: "Südosten",
			s: "Süden",
			sw: "Südwesten",
			w: "Westen"
		}
	},
	zoom: {
		out: "Verkleinern",
		in: "Vergrößern",
		reset: "Zurücksetzen",
		fit: "Einpassen"
	},
	code: {
		eyebrow: "Erzeugte Ausgabe",
		title: "Erzeugtes ODL-YAML",
		description: "Schreibgeschützte Ausgabe, erzeugt aus dem aktuellen Dashboard.",
		copyLabel: "Erzeugtes ODL-YAML kopieren",
		yaml: "Erzeugtes ODL-YAML",
		copy: {
			idle: "YAML kopieren",
			copied: "Kopiert",
			failed: "Kopieren fehlgeschlagen"
		},
		status: {
			copied: "YAML in die Zwischenablage kopiert",
			failed: "Kein Zugriff auf die Zwischenablage"
		}
	},
	fields: {
		anchor: "Anker",
		name: "Dashboard-Name",
		rotation: "Drehung",
		resolution: "Auflösung",
		width: "Breite",
		height: "Höhe",
		palette: "Palette",
		background: "Hintergrund",
		advanced: "Erweiterte Display-Optionen",
		padding: "Äußerer Rand",
		snapSize: "Rasterschritt",
		innerPadding: "Innerer Rand"
	},
	customDisplay: {
		manufacturer: "Eigenes",
		name: "Eigenes Display"
	},
	rotations: {
		0: "0°",
		90: "90°",
		180: "180°",
		270: "270°"
	},
	anchors: {
		lt: "Oben links",
		mt: "Oben Mitte",
		rt: "Oben rechts",
		lm: "Mitte links",
		mm: "Mitte",
		rm: "Mitte rechts",
		lb: "Unten links",
		mb: "Unten Mitte",
		rb: "Unten rechts"
	},
	colors: {
		clear: "Farbe entfernen",
		none: "Keine",
		accent: "Akzent",
		gray: (e) => `Grau ${e}`,
		names: {
			black: "Schwarz",
			white: "Weiß",
			red: "Rot",
			yellow: "Gelb",
			blue: "Blau",
			green: "Grün",
			orange: "Orange"
		}
	},
	palettes: {
		bw: "Schwarz / Weiß",
		bwr: "Schwarz / Weiß / Rot",
		bwy: "Schwarz / Weiß / Gelb",
		bwry: "Schwarz / Weiß / Rot / Gelb",
		spectra6: "Spectra 6 · Schwarz / Weiß / Rot / Gelb / Blau / Grün",
		seven_color: "Sieben Farben · Spectra 6 und Orange",
		grayscale4: "Graustufen · 4 Stufen",
		grayscale8: "Graustufen · 8 Stufen",
		grayscale16: "Graustufen · 16 Stufen"
	}
}, r = (e, t, n, r) => {
	if (e === 1) return t;
	let i = e % 10, a = e % 100;
	return i >= 2 && i <= 4 && (a < 12 || a > 14) ? n : r;
}, i = {
	common: {
		increase: "Zwiększ",
		decrease: "Zmniejsz",
		cancel: "Anuluj",
		close: "Zamknij"
	},
	commands: {
		undo: "Cofnij",
		redo: "Ponów",
		delete: "Usuń",
		hide: "Ukryj",
		show: "Pokaż",
		lock: "Zablokuj",
		unlock: "Odblokuj"
	},
	app: {
		loading: "Ładowanie OpenDisplay Studio…",
		loadFailed: "Nie udało się załadować OpenDisplay Studio",
		createFailed: "Nie udało się utworzyć dashboardu",
		sentToDevice: "Wysłano na urządzenie",
		sendFailed: "Nie udało się wysłać dashboardu na urządzenie",
		saveFailed: "Nie udało się zapisać dashboardu",
		deleteFailed: "Nie udało się usunąć dashboardu",
		renameFailed: "Nie udało się zmienić nazwy dashboardu",
		duplicateFailed: "Nie udało się zduplikować dashboardu",
		settingsFailed: "Nie udało się zaktualizować ustawień dashboardu",
		previewFailed: "Nie udało się wyrenderować podglądu",
		renameEmpty: "Nazwa dashboardu nie może być pusta",
		discardChanges: "Odrzucić niezapisane zmiany w dashboardzie?",
		unsupportedPrimitive: (e) => `Nieobsługiwany typ prymitywu: ${e || "(pusty)"}`,
		confirmRemoval: "Potwierdź usunięcie",
		deleteElementTitle: (e) => `Usunąć ${e}?`,
		deleteElementBody: "Element zostanie usunięty z dashboardu. Możesz go przywrócić przyciskiem Cofnij.",
		deleteElement: "Usuń element"
	},
	gallery: {
		title: "Dashboardy",
		count: (e) => `${e} ${r(e, "dashboard", "dashboardy", "dashboardów")}`,
		newDashboard: "Nowy dashboard",
		addDashboard: "Dodaj dashboard",
		filters: "Filtry dashboardów",
		search: "Szukaj dashboardów",
		searchPlaceholder: "Szukaj dashboardów…",
		sort: "Sortuj",
		sortDashboards: "Sortuj dashboardy",
		sortUpdated: "Ostatnio zmieniane",
		sortName: "Nazwa A–Z",
		savedDashboards: "Zapisane dashboardy",
		noResults: "Nie znaleziono dashboardów",
		noResultsHint: "Spróbuj innego wyszukiwania.",
		updated: (e) => `Zmieniono ${e}`,
		open: (e) => `Otwórz dashboard ${e}`,
		actionsFor: (e) => `Akcje dashboardu ${e}`,
		menuFor: (e) => `Akcje dla ${e}`,
		renameField: (e) => `Zmień nazwę dashboardu ${e}`,
		menu: {
			rename: "Zmień nazwę",
			duplicate: "Duplikuj",
			settings: "Ustawienia wyświetlacza",
			delete: "Usuń"
		},
		deleteTitle: "Usunąć dashboard?",
		deleteBody: "oraz wszystkie jego elementy zostaną trwale usunięte.",
		deleteWarning: "Tej operacji nie można cofnąć.",
		deleteAction: "Usuń dashboard",
		deleting: "Usuwanie…",
		settingsTitle: "Ustawienia wyświetlacza",
		settingsSave: "Zapisz zmiany",
		saving: "Zapisywanie…"
	},
	newDashboard: {
		title: "Nowy dashboard",
		subtitle: "Utwórz własne płótno OpenDisplay",
		startFrom: "Zacznij od",
		sources: "Źródło dashboardu",
		fromDevice: "Z urządzenia",
		fromDeviceHint: "Rozmiar i kolory",
		preset: "Gotowy wyświetlacz",
		presetHint: "Wybierz znany wyświetlacz",
		customSize: "Własny rozmiar",
		customSizeHint: "Ustaw rozmiar i kolory",
		device: "Urządzenie",
		display: "Wyświetlacz",
		loadingDevices: "Szukanie urządzeń OpenDisplay…",
		noDevices: "Nie znaleziono urządzeń OpenDisplay. Skonfiguruj integrację OpenDisplay albo zacznij od gotowego wyświetlacza.",
		deviceDetails: "Rozmiar i kolory dashboardu",
		colors: "Kolory",
		create: "Utwórz dashboard",
		creating: "Tworzenie…"
	},
	header: {
		dashboards: "Dashboardy",
		name: "Nazwa dashboardu",
		view: "Widok dashboardu",
		design: "Projekt",
		code: "Kod",
		setDraft: "Ustaw jako szkic",
		setReady: "Ustaw jako gotowy",
		sendToDevice: "Wyślij na urządzenie",
		sendingToDevice: "Wysyłanie…",
		save: "Zapisz",
		saving: "Zapisywanie…"
	},
	library: {
		title: "Biblioteka",
		heading: "Elementy",
		expand: "Rozwiń katalog elementów",
		collapse: "Zwiń katalog elementów",
		search: "Szukaj widżetów i prymitywów",
		searchPlaceholder: "Szukaj elementów…",
		widgets: "Widżety",
		primitives: "Prymitywy",
		noWidgets: "Brak pasujących widżetów",
		reloadWidgets: "Przeładuj widżety",
		userWidget: "własny",
		widgetErrors: (e) => `Nie udało się załadować ${e} ${r(e, "pakietu", "pakietów", "pakietów")} widżetów`,
		widgetsReloaded: (e, t) => t === 0 ? `Widżety przeładowane — załadowano: ${e}` : `Widżety przeładowane — załadowano: ${e}, błędy: ${t}`,
		reloadFailed: "Nie udało się przeładować widżetów",
		noPrimitives: "Brak pasujących prymitywów",
		entryHint: (e) => `${e} Kliknij lub przeciągnij, aby dodać.`
	},
	structure: {
		title: "Struktura",
		heading: "Elementy",
		collapse: "Zwiń inspektor",
		empty: "Przeciągnij widżety lub prymitywy na płótno.",
		widget: "Widżet",
		reorderTitle: "Zmień kolejność warstwy",
		reorder: (e) => `Zmień kolejność: ${e}`
	},
	inspector: {
		alignInParent: "Wyrównaj w rodzicu",
		expand: "Rozwiń inspektor",
		rail: "Warstwy",
		resize: "Zmień szerokość inspektora",
		dashboard: "Dashboard",
		dashboardHint: "Ustawienia obszaru roboczego",
		workingArea: "Obszar roboczy",
		workingAreaHelp: "Margines wyznacza bezpieczny obszar edycji. Przyciąganie wyrównuje ruch i zmianę rozmiaru do pełnych pikseli.",
		layout: "Układ",
		widgetSettings: "Ustawienia widżetu",
		dataSources: "Źródła danych",
		widgetMissing: (e) => `Widżet ${e} nie jest zainstalowany. Zachowuje ustawienia i zostanie narysowany, gdy pakiet wróci.`,
		appearance: "Wygląd",
		diagnostics: "Diagnostyka renderowania",
		removeElement: "Usuń element",
		locked: "Pozycja jest zablokowana",
		unlock: "Odblokuj",
		unlockElement: "Odblokuj pozycję elementu",
		kindWidget: "Widżet",
		kindPrimitive: "Prymityw ODL",
		subtitle: (e, t) => `${e} · ${t ? "pozycja zablokowana" : "edytowalny"}`,
		metrics: {
			queue: "Kolejka",
			data: "Dane",
			compile: "Kompilacja",
			render: "Renderowanie",
			encode: "Kodowanie",
			total: "Razem"
		}
	},
	expression: {
		toggleLabel: (e) => `Wyrażenie dla pola: ${e}`,
		toggleTooltip: "Wyrażenie (lub wpisz {)",
		visibleLabel: "Widoczność",
		alwaysVisible: "Zawsze widoczny",
		positionLocked: (e) => `Pozycję wyznacza wyrażenie (${e})`,
		cornerFields: "Edytuj rogi",
		derivedFields: "Edytuj pozycję i rozmiar"
	},
	canvas: {
		rendering: "Renderowanie…",
		previewAlt: "Podgląd wyświetlacza wyrenderowany przez backend",
		hidden: "Ukryty",
		layers: (e) => `${e} ${r(e, "warstwa", "warstwy", "warstw")}`,
		padding: (e) => `Margines ${e}px`,
		snap: (e) => `Przyciąganie ${e}px`,
		resizeHandle: (e, t) => `Zmień rozmiar: ${e}, od strony ${t}`,
		sides: {
			nw: "północno-zachodniej",
			n: "północnej",
			ne: "północno-wschodniej",
			e: "wschodniej",
			se: "południowo-wschodniej",
			s: "południowej",
			sw: "południowo-zachodniej",
			w: "zachodniej"
		}
	},
	zoom: {
		out: "Pomniejsz",
		in: "Powiększ",
		reset: "Resetuj",
		fit: "Dopasuj"
	},
	code: {
		eyebrow: "Wygenerowany wynik",
		title: "Wygenerowany YAML ODL",
		description: "Wynik tylko do odczytu, wygenerowany z bieżącego dashboardu.",
		copyLabel: "Kopiuj wygenerowany YAML ODL",
		yaml: "Wygenerowany YAML ODL",
		copy: {
			idle: "Kopiuj YAML",
			copied: "Skopiowano",
			failed: "Nie udało się skopiować"
		},
		status: {
			copied: "YAML skopiowany do schowka",
			failed: "Brak dostępu do schowka"
		}
	},
	fields: {
		anchor: "Kotwica",
		name: "Nazwa dashboardu",
		rotation: "Obrót",
		resolution: "Rozdzielczość",
		width: "Szerokość",
		height: "Wysokość",
		palette: "Paleta",
		background: "Tło",
		advanced: "Zaawansowane ustawienia wyświetlacza",
		padding: "Margines zewnętrzny",
		snapSize: "Krok przyciągania",
		innerPadding: "Margines wewnętrzny"
	},
	customDisplay: {
		manufacturer: "Własny",
		name: "Własny wyświetlacz"
	},
	rotations: {
		0: "0°",
		90: "90°",
		180: "180°",
		270: "270°"
	},
	anchors: {
		lt: "Lewy górny",
		mt: "Górny środek",
		rt: "Prawy górny",
		lm: "Lewy środek",
		mm: "Środek",
		rm: "Prawy środek",
		lb: "Lewy dolny",
		mb: "Dolny środek",
		rb: "Prawy dolny"
	},
	colors: {
		clear: "Wyczyść kolor",
		none: "Brak",
		accent: "Akcent",
		gray: (e) => `Szary ${e}`,
		names: {
			black: "Czarny",
			white: "Biały",
			red: "Czerwony",
			yellow: "Żółty",
			blue: "Niebieski",
			green: "Zielony",
			orange: "Pomarańczowy"
		}
	},
	palettes: {
		bw: "Czarny / biały",
		bwr: "Czarny / biały / czerwony",
		bwy: "Czarny / biały / żółty",
		bwry: "Czarny / biały / czerwony / żółty",
		spectra6: "Spectra 6 · czarny / biały / czerwony / żółty / niebieski / zielony",
		seven_color: "Siedem kolorów · Spectra 6 i pomarańczowy",
		grayscale4: "Skala szarości · 4 poziomy",
		grayscale8: "Skala szarości · 8 poziomów",
		grayscale16: "Skala szarości · 16 poziomów"
	}
}, a = "en", o = {
	de: n,
	pl: i
}, s = (e) => typeof e == "object" && !!e, c = (e, t) => {
	for (let [n, r] of Object.entries(t)) {
		let t = e[n];
		s(r) && s(t) ? c(t, r) : e[n] = r;
	}
}, l = (e) => Object.fromEntries(Object.entries(e).map(([e, t]) => [e, s(t) ? l(t) : t])), u = l(t), d = (e) => e.split("-", 1)[0]?.toLowerCase() || a, f = (e) => {
	c(t, u);
	let n = o[d(e)];
	n && c(t, n);
}, p = "{\r\n  \"bw\": {\r\n    \"schemes\": [\r\n      \"MONO\"\r\n    ],\r\n    \"accent\": \"red\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      }\r\n    ]\r\n  },\r\n  \"bwr\": {\r\n    \"schemes\": [\r\n      \"BWR\"\r\n    ],\r\n    \"accent\": \"red\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"red\",\r\n        \"value\": \"red\",\r\n        \"hex\": \"#ff0000\"\r\n      }\r\n    ]\r\n  },\r\n  \"bwy\": {\r\n    \"schemes\": [\r\n      \"BWY\"\r\n    ],\r\n    \"accent\": \"yellow\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"yellow\",\r\n        \"value\": \"yellow\",\r\n        \"hex\": \"#ffff00\"\r\n      }\r\n    ]\r\n  },\r\n  \"bwry\": {\r\n    \"schemes\": [\r\n      \"BWRY\"\r\n    ],\r\n    \"accent\": \"yellow\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"red\",\r\n        \"value\": \"red\",\r\n        \"hex\": \"#ff0000\"\r\n      },\r\n      {\r\n        \"id\": \"yellow\",\r\n        \"value\": \"yellow\",\r\n        \"hex\": \"#ffff00\"\r\n      }\r\n    ]\r\n  },\r\n  \"spectra6\": {\r\n    \"schemes\": [\r\n      \"BWGBRY\",\r\n      \"BWGBRY_SPLIT\"\r\n    ],\r\n    \"accent\": \"red\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"red\",\r\n        \"value\": \"red\",\r\n        \"hex\": \"#ff0000\"\r\n      },\r\n      {\r\n        \"id\": \"yellow\",\r\n        \"value\": \"yellow\",\r\n        \"hex\": \"#ffff00\"\r\n      },\r\n      {\r\n        \"id\": \"blue\",\r\n        \"value\": \"blue\",\r\n        \"hex\": \"#0000ff\"\r\n      },\r\n      {\r\n        \"id\": \"green\",\r\n        \"value\": \"green\",\r\n        \"hex\": \"#00ff00\"\r\n      }\r\n    ]\r\n  },\r\n  \"seven_color\": {\r\n    \"schemes\": [\r\n      \"SEVEN_COLOR\"\r\n    ],\r\n    \"accent\": \"red\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"red\",\r\n        \"value\": \"red\",\r\n        \"hex\": \"#ff0000\"\r\n      },\r\n      {\r\n        \"id\": \"yellow\",\r\n        \"value\": \"yellow\",\r\n        \"hex\": \"#ffff00\"\r\n      },\r\n      {\r\n        \"id\": \"blue\",\r\n        \"value\": \"blue\",\r\n        \"hex\": \"#0000ff\"\r\n      },\r\n      {\r\n        \"id\": \"green\",\r\n        \"value\": \"green\",\r\n        \"hex\": \"#00ff00\"\r\n      },\r\n      {\r\n        \"id\": \"orange\",\r\n        \"value\": \"#ff8000\",\r\n        \"hex\": \"#ff8000\"\r\n      }\r\n    ]\r\n  },\r\n  \"grayscale4\": {\r\n    \"schemes\": [\r\n      \"GRAYSCALE_4\"\r\n    ],\r\n    \"accent\": \"black\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"gray1\",\r\n        \"value\": \"#555555\",\r\n        \"hex\": \"#555555\"\r\n      },\r\n      {\r\n        \"id\": \"gray2\",\r\n        \"value\": \"#aaaaaa\",\r\n        \"hex\": \"#aaaaaa\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      }\r\n    ]\r\n  },\r\n  \"grayscale8\": {\r\n    \"schemes\": [\r\n      \"GRAYSCALE_8\"\r\n    ],\r\n    \"accent\": \"black\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"gray1\",\r\n        \"value\": \"#242424\",\r\n        \"hex\": \"#242424\"\r\n      },\r\n      {\r\n        \"id\": \"gray2\",\r\n        \"value\": \"#494949\",\r\n        \"hex\": \"#494949\"\r\n      },\r\n      {\r\n        \"id\": \"gray3\",\r\n        \"value\": \"#6d6d6d\",\r\n        \"hex\": \"#6d6d6d\"\r\n      },\r\n      {\r\n        \"id\": \"gray4\",\r\n        \"value\": \"#929292\",\r\n        \"hex\": \"#929292\"\r\n      },\r\n      {\r\n        \"id\": \"gray5\",\r\n        \"value\": \"#b6b6b6\",\r\n        \"hex\": \"#b6b6b6\"\r\n      },\r\n      {\r\n        \"id\": \"gray6\",\r\n        \"value\": \"#dbdbdb\",\r\n        \"hex\": \"#dbdbdb\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      }\r\n    ]\r\n  },\r\n  \"grayscale16\": {\r\n    \"schemes\": [\r\n      \"GRAYSCALE_16\"\r\n    ],\r\n    \"accent\": \"black\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"gray1\",\r\n        \"value\": \"#111111\",\r\n        \"hex\": \"#111111\"\r\n      },\r\n      {\r\n        \"id\": \"gray2\",\r\n        \"value\": \"#222222\",\r\n        \"hex\": \"#222222\"\r\n      },\r\n      {\r\n        \"id\": \"gray3\",\r\n        \"value\": \"#333333\",\r\n        \"hex\": \"#333333\"\r\n      },\r\n      {\r\n        \"id\": \"gray4\",\r\n        \"value\": \"#444444\",\r\n        \"hex\": \"#444444\"\r\n      },\r\n      {\r\n        \"id\": \"gray5\",\r\n        \"value\": \"#555555\",\r\n        \"hex\": \"#555555\"\r\n      },\r\n      {\r\n        \"id\": \"gray6\",\r\n        \"value\": \"#666666\",\r\n        \"hex\": \"#666666\"\r\n      },\r\n      {\r\n        \"id\": \"gray7\",\r\n        \"value\": \"#777777\",\r\n        \"hex\": \"#777777\"\r\n      },\r\n      {\r\n        \"id\": \"gray8\",\r\n        \"value\": \"#888888\",\r\n        \"hex\": \"#888888\"\r\n      },\r\n      {\r\n        \"id\": \"gray9\",\r\n        \"value\": \"#999999\",\r\n        \"hex\": \"#999999\"\r\n      },\r\n      {\r\n        \"id\": \"gray10\",\r\n        \"value\": \"#aaaaaa\",\r\n        \"hex\": \"#aaaaaa\"\r\n      },\r\n      {\r\n        \"id\": \"gray11\",\r\n        \"value\": \"#bbbbbb\",\r\n        \"hex\": \"#bbbbbb\"\r\n      },\r\n      {\r\n        \"id\": \"gray12\",\r\n        \"value\": \"#cccccc\",\r\n        \"hex\": \"#cccccc\"\r\n      },\r\n      {\r\n        \"id\": \"gray13\",\r\n        \"value\": \"#dddddd\",\r\n        \"hex\": \"#dddddd\"\r\n      },\r\n      {\r\n        \"id\": \"gray14\",\r\n        \"value\": \"#eeeeee\",\r\n        \"hex\": \"#eeeeee\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      }\r\n    ]\r\n  }\r\n}\r\n", m = Symbol.for("yaml.alias"), h = Symbol.for("yaml.document"), g = Symbol.for("yaml.map"), _ = Symbol.for("yaml.pair"), v = Symbol.for("yaml.scalar"), y = Symbol.for("yaml.seq"), b = Symbol.for("yaml.node.type"), x = (e) => !!e && typeof e == "object" && e[b] === m, S = (e) => !!e && typeof e == "object" && e[b] === h, ee = (e) => !!e && typeof e == "object" && e[b] === g, C = (e) => !!e && typeof e == "object" && e[b] === _, w = (e) => !!e && typeof e == "object" && e[b] === v, te = (e) => !!e && typeof e == "object" && e[b] === y;
function T(e) {
	if (e && typeof e == "object") switch (e[b]) {
		case g:
		case y: return !0;
	}
	return !1;
}
function E(e) {
	if (e && typeof e == "object") switch (e[b]) {
		case m:
		case g:
		case v:
		case y: return !0;
	}
	return !1;
}
var ne = (e) => (w(e) || T(e)) && !!e.anchor, re = Symbol("break visit"), ie = Symbol("skip children"), ae = Symbol("remove node");
function oe(e, t) {
	let n = ce(t);
	S(e) ? se(null, e.contents, n, Object.freeze([e])) === ae && (e.contents = null) : se(null, e, n, Object.freeze([]));
}
oe.BREAK = re, oe.SKIP = ie, oe.REMOVE = ae;
function se(e, t, n, r) {
	let i = le(e, t, n, r);
	if (E(i) || C(i)) return ue(e, r, i), se(e, i, n, r);
	if (typeof i != "symbol") {
		if (T(t)) {
			r = Object.freeze(r.concat(t));
			for (let e = 0; e < t.items.length; ++e) {
				let i = se(e, t.items[e], n, r);
				if (typeof i == "number") e = i - 1;
				else if (i === re) return re;
				else i === ae && (t.items.splice(e, 1), --e);
			}
		} else if (C(t)) {
			r = Object.freeze(r.concat(t));
			let e = se("key", t.key, n, r);
			if (e === re) return re;
			e === ae && (t.key = null);
			let i = se("value", t.value, n, r);
			if (i === re) return re;
			i === ae && (t.value = null);
		}
	}
	return i;
}
function ce(e) {
	return typeof e == "object" && (e.Collection || e.Node || e.Value) ? Object.assign({
		Alias: e.Node,
		Map: e.Node,
		Scalar: e.Node,
		Seq: e.Node
	}, e.Value && {
		Map: e.Value,
		Scalar: e.Value,
		Seq: e.Value
	}, e.Collection && {
		Map: e.Collection,
		Seq: e.Collection
	}, e) : e;
}
function le(e, t, n, r) {
	if (typeof n == "function") return n(e, t, r);
	if (ee(t)) return n.Map?.(e, t, r);
	if (te(t)) return n.Seq?.(e, t, r);
	if (C(t)) return n.Pair?.(e, t, r);
	if (w(t)) return n.Scalar?.(e, t, r);
	if (x(t)) return n.Alias?.(e, t, r);
}
function ue(e, t, n) {
	let r = t[t.length - 1];
	if (T(r)) r.items[e] = n;
	else if (C(r)) e === "key" ? r.key = n : r.value = n;
	else if (S(r)) r.contents = n;
	else {
		let e = x(r) ? "alias" : "scalar";
		throw Error(`Cannot replace node with ${e} parent`);
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/directives.js
var de = {
	"!": "%21",
	",": "%2C",
	"[": "%5B",
	"]": "%5D",
	"{": "%7B",
	"}": "%7D"
}, fe = (e) => e.replace(/[!,[\]{}]/g, (e) => de[e]), pe = class e {
	constructor(t, n) {
		this.docStart = null, this.docEnd = !1, this.yaml = Object.assign({}, e.defaultYaml, t), this.tags = Object.assign({}, e.defaultTags, n);
	}
	clone() {
		let t = new e(this.yaml, this.tags);
		return t.docStart = this.docStart, t;
	}
	atDocument() {
		let t = new e(this.yaml, this.tags);
		switch (this.yaml.version) {
			case "1.1":
				this.atNextDocument = !0;
				break;
			case "1.2": this.atNextDocument = !1, this.yaml = {
				explicit: e.defaultYaml.explicit,
				version: "1.2"
			}, this.tags = Object.assign({}, e.defaultTags);
		}
		return t;
	}
	add(t, n) {
		this.atNextDocument &&= (this.yaml = {
			explicit: e.defaultYaml.explicit,
			version: "1.1"
		}, this.tags = Object.assign({}, e.defaultTags), !1);
		let r = t.trim().split(/[ \t]+/), i = r.shift();
		switch (i) {
			case "%TAG": {
				if (r.length !== 2 && (n(0, "%TAG directive should contain exactly two parts"), r.length < 2)) return !1;
				let [e, t] = r;
				return this.tags[e] = t, !0;
			}
			case "%YAML": {
				if (this.yaml.explicit = !0, r.length !== 1) return n(0, "%YAML directive should contain exactly one part"), !1;
				let [e] = r;
				if (e === "1.1" || e === "1.2") return this.yaml.version = e, !0;
				{
					let t = /^\d+\.\d+$/.test(e);
					return n(6, `Unsupported YAML version ${e}`, t), !1;
				}
			}
			default: return n(0, `Unknown directive ${i}`, !0), !1;
		}
	}
	tagName(e, t) {
		if (e === "!") return "!";
		if (e[0] !== "!") return t(`Not a valid tag: ${e}`), null;
		if (e[1] === "<") {
			let n = e.slice(2, -1);
			return n === "!" || n === "!!" ? (t(`Verbatim tags aren't resolved, so ${e} is invalid.`), null) : (e[e.length - 1] !== ">" && t("Verbatim tags must end with a >"), n);
		}
		let [, n, r] = e.match(/^(.*!)([^!]*)$/s);
		r || t(`The ${e} tag has no suffix`);
		let i = this.tags[n];
		if (i) try {
			return i + decodeURIComponent(r);
		} catch (e) {
			return t(String(e)), null;
		}
		return n === "!" ? e : (t(`Could not resolve tag: ${e}`), null);
	}
	tagString(e) {
		for (let [t, n] of Object.entries(this.tags)) if (e.startsWith(n)) return t + fe(e.substring(n.length));
		return e[0] === "!" ? e : `!<${e}>`;
	}
	toString(e) {
		let t = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], n = Object.entries(this.tags), r;
		if (e && n.length > 0 && E(e.contents)) {
			let t = {};
			oe(e.contents, (e, n) => {
				E(n) && n.tag && (t[n.tag] = !0);
			}), r = Object.keys(t);
		} else r = [];
		for (let [i, a] of n) (i !== "!!" || a !== "tag:yaml.org,2002:") && (!e || r.some((e) => e.startsWith(a))) && t.push(`%TAG ${i} ${a}`);
		return t.join("\n");
	}
};
pe.defaultYaml = {
	explicit: !1,
	version: "1.2"
}, pe.defaultTags = { "!!": "tag:yaml.org,2002:" };
//#endregion
//#region node_modules/yaml/browser/dist/doc/anchors.js
function me(e) {
	if (/[\x00-\x19\s,[\]{}]/.test(e)) {
		let t = `Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;
		throw Error(t);
	}
	return !0;
}
function he(e) {
	let t = /* @__PURE__ */ new Set();
	return oe(e, { Value(e, n) {
		n.anchor && t.add(n.anchor);
	} }), t;
}
function ge(e, t) {
	for (let n = 1;; ++n) {
		let r = `${e}${n}`;
		if (!t.has(r)) return r;
	}
}
function _e(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = null;
	return {
		onAnchor: (r) => {
			n.push(r), i ??= he(e);
			let a = ge(t, i);
			return i.add(a), a;
		},
		setAnchors: () => {
			for (let e of n) {
				let t = r.get(e);
				if (typeof t == "object" && t.anchor && (w(t.node) || T(t.node))) t.node.anchor = t.anchor;
				else {
					let t = /* @__PURE__ */ Error("Failed to resolve repeated object (this should not happen)");
					throw t.source = e, t;
				}
			}
		},
		sourceObjects: r
	};
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/applyReviver.js
function ve(e, t, n, r) {
	if (r && typeof r == "object") {
		if (Array.isArray(r)) for (let t = 0, n = r.length; t < n; ++t) {
			let n = r[t], i = ve(e, r, String(t), n);
			i === void 0 ? delete r[t] : i !== n && (r[t] = i);
		}
		else if (r instanceof Map) for (let t of Array.from(r.keys())) {
			let n = r.get(t), i = ve(e, r, t, n);
			i === void 0 ? r.delete(t) : i !== n && r.set(t, i);
		}
		else if (r instanceof Set) for (let t of Array.from(r)) {
			let n = ve(e, r, t, t);
			n === void 0 ? r.delete(t) : n !== t && (r.delete(t), r.add(n));
		}
		else for (let [t, n] of Object.entries(r)) {
			let i = ve(e, r, t, n);
			i === void 0 ? delete r[t] : i !== n && (r[t] = i);
		}
	}
	return e.call(t, n, r);
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/toJS.js
function D(e, t, n) {
	if (Array.isArray(e)) return e.map((e, t) => D(e, String(t), n));
	if (e && typeof e.toJSON == "function") {
		if (!n || !ne(e)) return e.toJSON(t, n);
		let r = {
			aliasCount: 0,
			count: 1,
			res: void 0
		};
		n.anchors.set(e, r), n.onCreate = (e) => {
			r.res = e, delete n.onCreate;
		};
		let i = e.toJSON(t, n);
		return n.onCreate && n.onCreate(i), i;
	}
	return typeof e == "bigint" && !n?.keep ? Number(e) : e;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Node.js
var ye = class {
	constructor(e) {
		Object.defineProperty(this, b, { value: e });
	}
	clone() {
		let e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
		return this.range && (e.range = this.range.slice()), e;
	}
	toJS(e, { mapAsMap: t, maxAliasCount: n, onAnchor: r, reviver: i } = {}) {
		if (!S(e)) throw TypeError("A document argument is required");
		let a = {
			anchors: /* @__PURE__ */ new Map(),
			doc: e,
			keep: !0,
			mapAsMap: t === !0,
			mapKeyWarned: !1,
			maxAliasCount: typeof n == "number" ? n : 100
		}, o = D(this, "", a);
		if (typeof r == "function") for (let { count: e, res: t } of a.anchors.values()) r(t, e);
		return typeof i == "function" ? ve(i, { "": o }, "", o) : o;
	}
}, be = class extends ye {
	constructor(e) {
		super(m), this.source = e, Object.defineProperty(this, "tag", { set() {
			throw Error("Alias nodes cannot have tags");
		} });
	}
	resolve(e, t) {
		if (t?.maxAliasCount === 0) throw ReferenceError("Alias resolution is disabled");
		let n;
		t?.aliasResolveCache ? n = t.aliasResolveCache : (n = [], oe(e, { Node: (e, t) => {
			(x(t) || ne(t)) && n.push(t);
		} }), t && (t.aliasResolveCache = n));
		let r;
		for (let e of n) {
			if (e === this) break;
			e.anchor === this.source && (r = e);
		}
		if (r && t) {
			let { anchors: e, doc: n, maxAliasCount: i } = t, a = e.get(r);
			/* istanbul ignore if */
			if (a ||= (D(r, null, t), e.get(r)), a?.res === void 0) throw ReferenceError("This should not happen: Alias anchor was not resolved?");
			if (i >= 0 && (a.count += 1, a.aliasCount === 0 && (a.aliasCount = xe(n, r, e)), a.count * a.aliasCount > i)) throw ReferenceError("Excessive alias count indicates a resource exhaustion attack");
		}
		return r;
	}
	toJSON(e, t) {
		if (!t) return { source: this.source };
		let n = this.resolve(t.doc, t);
		if (!n) {
			let e = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
			throw ReferenceError(e);
		}
		return t.anchors.get(n).res;
	}
	toString(e, t, n) {
		let r = `*${this.source}`;
		if (e) {
			if (me(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
				let e = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
				throw Error(e);
			}
			if (e.implicitKey) return `${r} `;
		}
		return r;
	}
};
function xe(e, t, n) {
	if (x(t)) {
		let r = t.resolve(e), i = n && r && n.get(r);
		return i ? i.count * i.aliasCount : 0;
	}
	if (T(t)) {
		let r = 0;
		for (let i of t.items) {
			let t = xe(e, i, n);
			t > r && (r = t);
		}
		return r;
	}
	if (C(t)) {
		let r = xe(e, t.key, n), i = xe(e, t.value, n);
		return Math.max(r, i);
	}
	return 1;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Scalar.js
var Se = (e) => !e || typeof e != "function" && typeof e != "object", O = class extends ye {
	constructor(e) {
		super(v), this.value = e;
	}
	toJSON(e, t) {
		return t?.keep ? this.value : D(this.value, e, t);
	}
	toString() {
		return String(this.value);
	}
};
O.BLOCK_FOLDED = "BLOCK_FOLDED", O.BLOCK_LITERAL = "BLOCK_LITERAL", O.PLAIN = "PLAIN", O.QUOTE_DOUBLE = "QUOTE_DOUBLE", O.QUOTE_SINGLE = "QUOTE_SINGLE";
//#endregion
//#region node_modules/yaml/browser/dist/doc/createNode.js
var Ce = "tag:yaml.org,2002:";
function we(e, t, n) {
	if (t) {
		let e = n.filter((e) => e.tag === t), r = e.find((e) => !e.format) ?? e[0];
		if (!r) throw Error(`Tag ${t} not found`);
		return r;
	}
	return n.find((t) => t.identify?.(e) && !t.format);
}
function Te(e, t, n) {
	if (S(e) && (e = e.contents), E(e)) return e;
	if (C(e)) {
		let t = n.schema[g].createNode?.(n.schema, null, n);
		return t.items.push(e), t;
	}
	(e instanceof String || e instanceof Number || e instanceof Boolean || typeof BigInt < "u" && e instanceof BigInt) && (e = e.valueOf());
	let { aliasDuplicateObjects: r, onAnchor: i, onTagObj: a, schema: o, sourceObjects: s } = n, c;
	if (r && e && typeof e == "object") {
		if (c = s.get(e), c) return c.anchor ?? (c.anchor = i(e)), new be(c.anchor);
		c = {
			anchor: null,
			node: null
		}, s.set(e, c);
	}
	t?.startsWith("!!") && (t = Ce + t.slice(2));
	let l = we(e, t, o.tags);
	if (!l) {
		if (e && typeof e.toJSON == "function" && (e = e.toJSON()), !e || typeof e != "object") {
			let t = new O(e);
			return c && (c.node = t), t;
		}
		l = e instanceof Map ? o[g] : Symbol.iterator in Object(e) ? o[y] : o[g];
	}
	a && (a(l), delete n.onTagObj);
	let u = l?.createNode ? l.createNode(n.schema, e, n) : typeof l?.nodeClass?.from == "function" ? l.nodeClass.from(n.schema, e, n) : new O(e);
	return t ? u.tag = t : l.default || (u.tag = l.tag), c && (c.node = u), u;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Collection.js
function Ee(e, t, n) {
	let r = n;
	for (let e = t.length - 1; e >= 0; --e) {
		let n = t[e];
		if (typeof n == "number" && Number.isInteger(n) && n >= 0) {
			let e = [];
			e[n] = r, r = e;
		} else r = /* @__PURE__ */ new Map([[n, r]]);
	}
	return Te(r, void 0, {
		aliasDuplicateObjects: !1,
		keepUndefined: !1,
		onAnchor: () => {
			throw Error("This should not happen, please report a bug.");
		},
		schema: e,
		sourceObjects: /* @__PURE__ */ new Map()
	});
}
var De = (e) => e == null || typeof e == "object" && !!e[Symbol.iterator]().next().done, Oe = class extends ye {
	constructor(e, t) {
		super(e), Object.defineProperty(this, "schema", {
			value: t,
			configurable: !0,
			enumerable: !1,
			writable: !0
		});
	}
	clone(e) {
		let t = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
		return e && (t.schema = e), t.items = t.items.map((t) => E(t) || C(t) ? t.clone(e) : t), this.range && (t.range = this.range.slice()), t;
	}
	addIn(e, t) {
		if (De(e)) this.add(t);
		else {
			let [n, ...r] = e, i = this.get(n, !0);
			if (T(i)) i.addIn(r, t);
			else if (i === void 0 && this.schema) this.set(n, Ee(this.schema, r, t));
			else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
		}
	}
	deleteIn(e) {
		let [t, ...n] = e;
		if (n.length === 0) return this.delete(t);
		let r = this.get(t, !0);
		if (T(r)) return r.deleteIn(n);
		throw Error(`Expected YAML collection at ${t}. Remaining path: ${n}`);
	}
	getIn(e, t) {
		let [n, ...r] = e, i = this.get(n, !0);
		return r.length === 0 ? !t && w(i) ? i.value : i : T(i) ? i.getIn(r, t) : void 0;
	}
	hasAllNullValues(e) {
		return this.items.every((t) => {
			if (!C(t)) return !1;
			let n = t.value;
			return n == null || e && w(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
		});
	}
	hasIn(e) {
		let [t, ...n] = e;
		if (n.length === 0) return this.has(t);
		let r = this.get(t, !0);
		return T(r) ? r.hasIn(n) : !1;
	}
	setIn(e, t) {
		let [n, ...r] = e;
		if (r.length === 0) this.set(n, t);
		else {
			let e = this.get(n, !0);
			if (T(e)) e.setIn(r, t);
			else if (e === void 0 && this.schema) this.set(n, Ee(this.schema, r, t));
			else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
		}
	}
}, ke = (e) => e.replace(/^(?!$)(?: $)?/gm, "#");
function Ae(e, t) {
	return /^\n+$/.test(e) ? e.substring(1) : t ? e.replace(/^(?! *$)/gm, t) : e;
}
var je = (e, t, n) => e.endsWith("\n") ? Ae(n, t) : n.includes("\n") ? "\n" + Ae(n, t) : (e.endsWith(" ") ? "" : " ") + n, Me = "flow", Ne = "block", Pe = "quoted";
function Fe(e, t, n = "flow", { indentAtStart: r, lineWidth: i = 80, minContentWidth: a = 20, onFold: o, onOverflow: s } = {}) {
	if (!i || i < 0) return e;
	i < a && (a = 0);
	let c = Math.max(1 + a, 1 + i - t.length);
	if (e.length <= c) return e;
	let l = [], u = {}, d = i - t.length;
	typeof r == "number" && (r > i - Math.max(2, a) ? l.push(0) : d = i - r);
	let f, p, m = !1, h = -1, g = -1, _ = -1;
	n === "block" && (h = Ie(e, h, t.length), h !== -1 && (d = h + c));
	for (let r; r = e[h += 1];) {
		if (n === "quoted" && r === "\\") {
			switch (g = h, e[h + 1]) {
				case "x":
					h += 3;
					break;
				case "u":
					h += 5;
					break;
				case "U":
					h += 9;
					break;
				default: h += 1;
			}
			_ = h;
		}
		if (r === "\n") n === "block" && (h = Ie(e, h, t.length)), d = h + t.length + c, f = void 0;
		else {
			if (r === " " && p && p !== " " && p !== "\n" && p !== "	") {
				let t = e[h + 1];
				t && t !== " " && t !== "\n" && t !== "	" && (f = h);
			}
			if (h >= d) {
				if (f) l.push(f), d = f + c, f = void 0;
				else if (n === "quoted") {
					for (; p === " " || p === "	";) p = r, r = e[h += 1], m = !0;
					let t = h > _ + 1 ? h - 2 : g - 1;
					if (u[t]) return e;
					l.push(t), u[t] = !0, d = t + c, f = void 0;
				} else m = !0;
			}
		}
		p = r;
	}
	if (m && s && s(), l.length === 0) return e;
	o && o();
	let v = e.slice(0, l[0]);
	for (let r = 0; r < l.length; ++r) {
		let i = l[r], a = l[r + 1] || e.length;
		i === 0 ? v = `\n${t}${e.slice(0, a)}` : (n === "quoted" && u[i] && (v += `${e[i]}\\`), v += `\n${t}${e.slice(i + 1, a)}`);
	}
	return v;
}
function Ie(e, t, n) {
	let r = t, i = t + 1, a = e[i];
	for (; a === " " || a === "	";) if (t < i + n) a = e[++t];
	else {
		do
			a = e[++t];
		while (a && a !== "\n");
		r = t, i = t + 1, a = e[i];
	}
	return r;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyString.js
var Le = (e, t) => ({
	indentAtStart: t ? e.indent.length : e.indentAtStart,
	lineWidth: e.options.lineWidth,
	minContentWidth: e.options.minContentWidth
}), Re = (e) => /^(%|---|\.\.\.)/m.test(e);
function ze(e, t, n) {
	if (!t || t < 0) return !1;
	let r = t - n, i = e.length;
	if (i <= r) return !1;
	for (let t = 0, n = 0; t < i; ++t) if (e[t] === "\n") {
		if (t - n > r) return !0;
		if (n = t + 1, i - n <= r) return !1;
	}
	return !0;
}
function Be(e, t) {
	let n = JSON.stringify(e);
	if (t.options.doubleQuotedAsJSON) return n;
	let { implicitKey: r } = t, i = t.options.doubleQuotedMinMultiLineLength, a = t.indent || (Re(e) ? "  " : ""), o = "", s = 0;
	for (let e = 0, t = n[e]; t; t = n[++e]) if (t === " " && n[e + 1] === "\\" && n[e + 2] === "n" && (o += n.slice(s, e) + "\\ ", e += 1, s = e, t = "\\"), t === "\\") switch (n[e + 1]) {
		case "u":
			{
				o += n.slice(s, e);
				let t = n.substr(e + 2, 4);
				switch (t) {
					case "0000":
						o += "\\0";
						break;
					case "0007":
						o += "\\a";
						break;
					case "000b":
						o += "\\v";
						break;
					case "001b":
						o += "\\e";
						break;
					case "0085":
						o += "\\N";
						break;
					case "00a0":
						o += "\\_";
						break;
					case "2028":
						o += "\\L";
						break;
					case "2029":
						o += "\\P";
						break;
					default: t.substr(0, 2) === "00" ? o += "\\x" + t.substr(2) : o += n.substr(e, 6);
				}
				e += 5, s = e + 1;
			}
			break;
		case "n":
			if (r || n[e + 2] === "\"" || n.length < i) e += 1;
			else {
				for (o += n.slice(s, e) + "\n\n"; n[e + 2] === "\\" && n[e + 3] === "n" && n[e + 4] !== "\"";) o += "\n", e += 2;
				o += a, n[e + 2] === " " && (o += "\\"), e += 1, s = e + 1;
			}
			break;
		default: e += 1;
	}
	return o = s ? o + n.slice(s) : n, r ? o : Fe(o, a, Pe, Le(t, !1));
}
function Ve(e, t) {
	if (t.options.singleQuote === !1 || t.implicitKey && e.includes("\n") || /[ \t]\n|\n[ \t]/.test(e)) return Be(e, t);
	let n = t.indent || (Re(e) ? "  " : ""), r = "'" + e.replace(/'/g, "''").replace(/\n+/g, `$&\n${n}`) + "'";
	return t.implicitKey ? r : Fe(r, n, Me, Le(t, !1));
}
function He(e, t) {
	let { singleQuote: n } = t.options, r;
	if (n === !1) r = Be;
	else {
		let t = e.includes("\""), i = e.includes("'");
		r = t && !i ? Ve : i && !t ? Be : n ? Ve : Be;
	}
	return r(e, t);
}
var Ue;
try {
	Ue = /* @__PURE__ */ RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch {
	Ue = /\n+(?!\n|$)/g;
}
function We({ comment: e, type: t, value: n }, r, i, a) {
	let { blockQuote: o, commentString: s, lineWidth: c } = r.options;
	if (!o || /\n[\t ]+$/.test(n)) return He(n, r);
	let l = r.indent || (r.forceBlockIndent || Re(n) ? "  " : ""), u = o === "literal" ? !0 : o === "folded" || t === O.BLOCK_FOLDED ? !1 : t === O.BLOCK_LITERAL || !ze(n, c, l.length);
	if (!n) return u ? "|\n" : ">\n";
	let d, f;
	for (f = n.length; f > 0; --f) {
		let e = n[f - 1];
		if (e !== "\n" && e !== "	" && e !== " ") break;
	}
	let p = n.substring(f), m = p.indexOf("\n");
	m === -1 ? d = "-" : n === p || m !== p.length - 1 ? (d = "+", a && a()) : d = "", p &&= (n = n.slice(0, -p.length), p[p.length - 1] === "\n" && (p = p.slice(0, -1)), p.replace(Ue, `$&${l}`));
	let h = !1, g, _ = -1;
	for (g = 0; g < n.length; ++g) {
		let e = n[g];
		if (e === " ") h = !0;
		else if (e === "\n") _ = g;
		else break;
	}
	let v = n.substring(0, _ < g ? _ + 1 : g);
	v &&= (n = n.substring(v.length), v.replace(/\n+/g, `$&${l}`));
	let y = (h ? l ? "2" : "1" : "") + d;
	if (e && (y += " " + s(e.replace(/ ?[\r\n]+/g, " ")), i && i()), !u) {
		let e = n.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${l}`), i = !1, a = Le(r, !0);
		o !== "folded" && t !== O.BLOCK_FOLDED && (a.onOverflow = () => {
			i = !0;
		});
		let s = Fe(`${v}${e}${p}`, l, Ne, a);
		if (!i) return `>${y}\n${l}${s}`;
	}
	return n = n.replace(/\n+/g, `$&${l}`), `|${y}\n${l}${v}${n}${p}`;
}
function Ge(e, t, n, r) {
	let { type: i, value: a } = e, { actualString: o, implicitKey: s, indent: c, indentStep: l, inFlow: u } = t;
	if (s && a.includes("\n") || u && /[[\]{},]/.test(a)) return He(a, t);
	if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a)) return s || u || !a.includes("\n") ? He(a, t) : We(e, t, n, r);
	if (!s && !u && i !== O.PLAIN && a.includes("\n")) return We(e, t, n, r);
	if (Re(a)) {
		if (c === "") return t.forceBlockIndent = !0, We(e, t, n, r);
		if (s && c === l) return He(a, t);
	}
	let d = a.replace(/\n+/g, `$&\n${c}`);
	if (o) {
		let e = (e) => e.default && e.tag !== "tag:yaml.org,2002:str" && e.test?.test(d), { compat: n, tags: r } = t.doc.schema;
		if (r.some(e) || n?.some(e)) return He(a, t);
	}
	return s ? d : Fe(d, c, Me, Le(t, !1));
}
function Ke(e, t, n, r) {
	let { implicitKey: i, inFlow: a } = t, o = typeof e.value == "string" ? e : Object.assign({}, e, { value: String(e.value) }), { type: s } = e;
	s !== O.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) && (s = O.QUOTE_DOUBLE);
	let c = (e) => {
		switch (e) {
			case O.BLOCK_FOLDED:
			case O.BLOCK_LITERAL: return i || a ? He(o.value, t) : We(o, t, n, r);
			case O.QUOTE_DOUBLE: return Be(o.value, t);
			case O.QUOTE_SINGLE: return Ve(o.value, t);
			case O.PLAIN: return Ge(o, t, n, r);
			default: return null;
		}
	}, l = c(s);
	if (l === null) {
		let { defaultKeyType: e, defaultStringType: n } = t.options, r = i && e || n;
		if (l = c(r), l === null) throw Error(`Unsupported default string type ${r}`);
	}
	return l;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringify.js
function qe(e, t) {
	let n = Object.assign({
		blockQuote: !0,
		commentString: ke,
		defaultKeyType: null,
		defaultStringType: "PLAIN",
		directives: null,
		doubleQuotedAsJSON: !1,
		doubleQuotedMinMultiLineLength: 40,
		falseStr: "false",
		flowCollectionPadding: !0,
		indentSeq: !0,
		lineWidth: 80,
		minContentWidth: 20,
		nullStr: "null",
		simpleKeys: !1,
		singleQuote: null,
		trailingComma: !1,
		trueStr: "true",
		verifyAliasOrder: !0
	}, e.schema.toStringOptions, t), r;
	switch (n.collectionStyle) {
		case "block":
			r = !1;
			break;
		case "flow":
			r = !0;
			break;
		default: r = null;
	}
	return {
		anchors: /* @__PURE__ */ new Set(),
		doc: e,
		flowCollectionPadding: n.flowCollectionPadding ? " " : "",
		indent: "",
		indentStep: typeof n.indent == "number" ? " ".repeat(n.indent) : "  ",
		inFlow: r,
		options: n
	};
}
function Je(e, t) {
	if (t.tag) {
		let n = e.filter((e) => e.tag === t.tag);
		if (n.length > 0) return n.find((e) => e.format === t.format) ?? n[0];
	}
	let n, r;
	if (w(t)) {
		r = t.value;
		let i = e.filter((e) => e.identify?.(r));
		if (i.length > 1) {
			let e = i.filter((e) => e.test);
			e.length > 0 && (i = e);
		}
		n = i.find((e) => e.format === t.format) ?? i.find((e) => !e.format);
	} else r = t, n = e.find((e) => e.nodeClass && r instanceof e.nodeClass);
	if (!n) {
		let e = r?.constructor?.name ?? (r === null ? "null" : typeof r);
		throw Error(`Tag not resolved for ${e} value`);
	}
	return n;
}
function Ye(e, t, { anchors: n, doc: r }) {
	if (!r.directives) return "";
	let i = [], a = (w(e) || T(e)) && e.anchor;
	a && me(a) && (n.add(a), i.push(`&${a}`));
	let o = e.tag ?? (t.default ? null : t.tag);
	return o && i.push(r.directives.tagString(o)), i.join(" ");
}
function Xe(e, t, n, r) {
	if (C(e)) return e.toString(t, n, r);
	if (x(e)) {
		if (t.doc.directives) return e.toString(t);
		if (t.resolvedAliases?.has(e)) throw TypeError("Cannot stringify circular structure without alias nodes");
		t.resolvedAliases ? t.resolvedAliases.add(e) : t.resolvedAliases = /* @__PURE__ */ new Set([e]), e = e.resolve(t.doc);
	}
	let i, a = E(e) ? e : t.doc.createNode(e, { onTagObj: (e) => i = e });
	i ??= Je(t.doc.schema.tags, a);
	let o = Ye(a, i, t);
	o.length > 0 && (t.indentAtStart = (t.indentAtStart ?? 0) + o.length + 1);
	let s = typeof i.stringify == "function" ? i.stringify(a, t, n, r) : w(a) ? Ke(a, t, n, r) : a.toString(t, n, r);
	return o ? w(a) || s[0] === "{" || s[0] === "[" ? `${o} ${s}` : `${o}\n${t.indent}${s}` : s;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyPair.js
function Ze({ key: e, value: t }, n, r, i) {
	let { allNullValues: a, doc: o, indent: s, indentStep: c, options: { commentString: l, indentSeq: u, simpleKeys: d } } = n, f = E(e) && e.comment || null;
	if (d) {
		if (f) throw Error("With simple keys, key nodes cannot have comments");
		if (T(e) || !E(e) && typeof e == "object") throw Error("With simple keys, collection cannot be used as a key value");
	}
	let p = !d && (!e || f && t == null && !n.inFlow || T(e) || (w(e) ? e.type === O.BLOCK_FOLDED || e.type === O.BLOCK_LITERAL : typeof e == "object"));
	n = Object.assign({}, n, {
		allNullValues: !1,
		implicitKey: !p && (d || !a),
		indent: s + c
	});
	let m = !1, h = !1, g = Xe(e, n, () => m = !0, () => h = !0);
	if (!p && !n.inFlow && g.length > 1024) {
		if (d) throw Error("With simple keys, single line scalar must not span more than 1024 characters");
		p = !0;
	}
	if (n.inFlow) {
		if (a || t == null) return m && r && r(), g === "" ? "?" : p ? `? ${g}` : g;
	} else if (a && !d || t == null && p) return g = `? ${g}`, f && !m ? g += je(g, n.indent, l(f)) : h && i && i(), g;
	m && (f = null), p ? (f && (g += je(g, n.indent, l(f))), g = `? ${g}\n${s}:`) : (g = `${g}:`, f && (g += je(g, n.indent, l(f))));
	let _, v, y;
	E(t) ? (_ = !!t.spaceBefore, v = t.commentBefore, y = t.comment) : (_ = !1, v = null, y = null, t && typeof t == "object" && (t = o.createNode(t))), n.implicitKey = !1, !p && !f && w(t) && (n.indentAtStart = g.length + 1), h = !1, !u && c.length >= 2 && !n.inFlow && !p && te(t) && !t.flow && !t.tag && !t.anchor && (n.indent = n.indent.substring(2));
	let b = !1, x = Xe(t, n, () => b = !0, () => h = !0), S = " ";
	if (f || _ || v) {
		if (S = _ ? "\n" : "", v) {
			let e = l(v);
			S += `\n${Ae(e, n.indent)}`;
		}
		x === "" && !n.inFlow ? S === "\n" && y && (S = "\n\n") : S += `\n${n.indent}`;
	} else if (!p && T(t)) {
		let e = x[0], r = x.indexOf("\n"), i = r !== -1, a = n.inFlow ?? t.flow ?? t.items.length === 0;
		if (i || !a) {
			let t = !1;
			if (i && (e === "&" || e === "!")) {
				let n = x.indexOf(" ");
				e === "&" && n !== -1 && n < r && x[n + 1] === "!" && (n = x.indexOf(" ", n + 1)), (n === -1 || r < n) && (t = !0);
			}
			t || (S = `\n${n.indent}`);
		}
	} else (x === "" || x[0] === "\n") && (S = "");
	return g += S + x, n.inFlow ? b && r && r() : y && !b ? g += je(g, n.indent, l(y)) : h && i && i(), g;
}
//#endregion
//#region node_modules/yaml/browser/dist/log.js
function Qe(e, t) {
	(e === "debug" || e === "warn") && console.warn(t);
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var $e = "<<", et = {
	identify: (e) => e === $e || typeof e == "symbol" && e.description === $e,
	default: "key",
	tag: "tag:yaml.org,2002:merge",
	test: /^<<$/,
	resolve: () => Object.assign(new O(Symbol($e)), { addToJSMap: nt }),
	stringify: () => $e
}, tt = (e, t) => (et.identify(t) || w(t) && (!t.type || t.type === O.PLAIN) && et.identify(t.value)) && e?.doc.schema.tags.some((e) => e.tag === et.tag && e.default);
function nt(e, t, n) {
	let r = it(e, n);
	if (te(r)) for (let n of r.items) rt(e, t, n);
	else if (Array.isArray(r)) for (let n of r) rt(e, t, n);
	else rt(e, t, r);
}
function rt(e, t, n) {
	let r = it(e, n);
	if (!ee(r)) throw Error("Merge sources must be maps or map aliases");
	let i = r.toJSON(null, e, Map);
	for (let [e, n] of i) t instanceof Map ? t.has(e) || t.set(e, n) : t instanceof Set ? t.add(e) : Object.prototype.hasOwnProperty.call(t, e) || Object.defineProperty(t, e, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
	return t;
}
function it(e, t) {
	return e && x(t) ? t.resolve(e.doc, e) : t;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function at(e, t, { key: n, value: r }) {
	if (E(n) && n.addToJSMap) n.addToJSMap(e, t, r);
	else if (tt(e, n)) nt(e, t, r);
	else {
		let i = D(n, "", e);
		if (t instanceof Map) t.set(i, D(r, i, e));
		else if (t instanceof Set) t.add(i);
		else {
			let a = ot(n, i, e), o = D(r, a, e);
			a in t ? Object.defineProperty(t, a, {
				value: o,
				writable: !0,
				enumerable: !0,
				configurable: !0
			}) : t[a] = o;
		}
	}
	return t;
}
function ot(e, t, n) {
	if (t === null) return "";
	if (typeof t != "object") return String(t);
	if (E(e) && n?.doc) {
		let t = qe(n.doc, {});
		t.anchors = /* @__PURE__ */ new Set();
		for (let e of n.anchors.keys()) t.anchors.add(e.anchor);
		t.inFlow = !0, t.inStringifyKey = !0;
		let r = e.toString(t);
		if (!n.mapKeyWarned) {
			let e = JSON.stringify(r);
			e.length > 40 && (e = e.substring(0, 36) + "...\""), Qe(n.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`), n.mapKeyWarned = !0;
		}
		return r;
	}
	return JSON.stringify(t);
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Pair.js
function st(e, t, n) {
	return new k(Te(e, void 0, n), Te(t, void 0, n));
}
var k = class e {
	constructor(e, t = null) {
		Object.defineProperty(this, b, { value: _ }), this.key = e, this.value = t;
	}
	clone(t) {
		let { key: n, value: r } = this;
		return E(n) && (n = n.clone(t)), E(r) && (r = r.clone(t)), new e(n, r);
	}
	toJSON(e, t) {
		return at(t, t?.mapAsMap ? /* @__PURE__ */ new Map() : {}, this);
	}
	toString(e, t, n) {
		return e?.doc ? Ze(this, e, t, n) : JSON.stringify(this);
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function ct(e, t, n) {
	return (t.inFlow ?? e.flow ? ut : lt)(e, t, n);
}
function lt({ comment: e, items: t }, n, { blockItemPrefix: r, flowChars: i, itemIndent: a, onChompKeep: o, onComment: s }) {
	let { indent: c, options: { commentString: l } } = n, u = Object.assign({}, n, {
		indent: a,
		type: null
	}), d = !1, f = [];
	for (let e = 0; e < t.length; ++e) {
		let i = t[e], o = null;
		if (E(i)) !d && i.spaceBefore && f.push(""), dt(n, f, i.commentBefore, d), i.comment && (o = i.comment);
		else if (C(i)) {
			let e = E(i.key) ? i.key : null;
			e && (!d && e.spaceBefore && f.push(""), dt(n, f, e.commentBefore, d));
		}
		d = !1;
		let s = Xe(i, u, () => o = null, () => d = !0);
		o && (s += je(s, a, l(o))), d && o && (d = !1), f.push(r + s);
	}
	let p;
	if (f.length === 0) p = i.start + i.end;
	else {
		p = f[0];
		for (let e = 1; e < f.length; ++e) {
			let t = f[e];
			p += t ? `\n${c}${t}` : "\n";
		}
	}
	return e ? (p += "\n" + Ae(l(e), c), s && s()) : d && o && o(), p;
}
function ut({ items: e }, t, { flowChars: n, itemIndent: r }) {
	let { indent: i, indentStep: a, flowCollectionPadding: o, options: { commentString: s } } = t;
	r += a;
	let c = Object.assign({}, t, {
		indent: r,
		inFlow: !0,
		type: null
	}), l = !1, u = 0, d = [];
	for (let n = 0; n < e.length; ++n) {
		let i = e[n], a = null;
		if (E(i)) i.spaceBefore && d.push(""), dt(t, d, i.commentBefore, !1), i.comment && (a = i.comment);
		else if (C(i)) {
			let e = E(i.key) ? i.key : null;
			e && (e.spaceBefore && d.push(""), dt(t, d, e.commentBefore, !1), e.comment && (l = !0));
			let n = E(i.value) ? i.value : null;
			n ? (n.comment && (a = n.comment), n.commentBefore && (l = !0)) : i.value == null && e?.comment && (a = e.comment);
		}
		a && (l = !0);
		let o = Xe(i, c, () => a = null);
		l ||= d.length > u || o.includes("\n"), n < e.length - 1 ? o += "," : t.options.trailingComma && (t.options.lineWidth > 0 && (l ||= d.reduce((e, t) => e + t.length + 2, 2) + (o.length + 2) > t.options.lineWidth), l && (o += ",")), a && (o += je(o, r, s(a))), d.push(o), u = d.length;
	}
	let { start: f, end: p } = n;
	if (d.length === 0) return f + p;
	if (!l) {
		let e = d.reduce((e, t) => e + t.length + 2, 2);
		l = t.options.lineWidth > 0 && e > t.options.lineWidth;
	}
	if (l) {
		let e = f;
		for (let t of d) e += t ? `\n${a}${i}${t}` : "\n";
		return `${e}\n${i}${p}`;
	}
	return `${f}${o}${d.join(" ")}${o}${p}`;
}
function dt({ indent: e, options: { commentString: t } }, n, r, i) {
	if (r && i && (r = r.replace(/^\n+/, "")), r) {
		let i = Ae(t(r), e);
		n.push(i.trimStart());
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/YAMLMap.js
function ft(e, t) {
	let n = w(t) ? t.value : t;
	for (let r of e) if (C(r) && (r.key === t || r.key === n || w(r.key) && r.key.value === n)) return r;
}
var A = class extends Oe {
	static get tagName() {
		return "tag:yaml.org,2002:map";
	}
	constructor(e) {
		super(g, e), this.items = [];
	}
	static from(e, t, n) {
		let { keepUndefined: r, replacer: i } = n, a = new this(e), o = (e, o) => {
			if (typeof i == "function") o = i.call(t, e, o);
			else if (Array.isArray(i) && !i.includes(e)) return;
			(o !== void 0 || r) && a.items.push(st(e, o, n));
		};
		if (t instanceof Map) for (let [e, n] of t) o(e, n);
		else if (t && typeof t == "object") for (let e of Object.keys(t)) o(e, t[e]);
		return typeof e.sortMapEntries == "function" && a.items.sort(e.sortMapEntries), a;
	}
	add(e, t) {
		let n;
		n = C(e) ? e : !e || typeof e != "object" || !("key" in e) ? new k(e, e?.value) : new k(e.key, e.value);
		let r = ft(this.items, n.key), i = this.schema?.sortMapEntries;
		if (r) {
			if (!t) throw Error(`Key ${n.key} already set`);
			w(r.value) && Se(n.value) ? r.value.value = n.value : r.value = n.value;
		} else if (i) {
			let e = this.items.findIndex((e) => i(n, e) < 0);
			e === -1 ? this.items.push(n) : this.items.splice(e, 0, n);
		} else this.items.push(n);
	}
	delete(e) {
		let t = ft(this.items, e);
		return t ? this.items.splice(this.items.indexOf(t), 1).length > 0 : !1;
	}
	get(e, t) {
		let n = ft(this.items, e)?.value;
		return (!t && w(n) ? n.value : n) ?? void 0;
	}
	has(e) {
		return !!ft(this.items, e);
	}
	set(e, t) {
		this.add(new k(e, t), !0);
	}
	toJSON(e, t, n) {
		let r = n ? new n() : t?.mapAsMap ? /* @__PURE__ */ new Map() : {};
		t?.onCreate && t.onCreate(r);
		for (let e of this.items) at(t, r, e);
		return r;
	}
	toString(e, t, n) {
		if (!e) return JSON.stringify(this);
		for (let e of this.items) if (!C(e)) throw Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`);
		return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), ct(this, e, {
			blockItemPrefix: "",
			flowChars: {
				start: "{",
				end: "}"
			},
			itemIndent: e.indent || "",
			onChompKeep: n,
			onComment: t
		});
	}
}, pt = {
	collection: "map",
	default: !0,
	nodeClass: A,
	tag: "tag:yaml.org,2002:map",
	resolve(e, t) {
		return ee(e) || t("Expected a mapping for this tag"), e;
	},
	createNode: (e, t, n) => A.from(e, t, n)
}, mt = class extends Oe {
	static get tagName() {
		return "tag:yaml.org,2002:seq";
	}
	constructor(e) {
		super(y, e), this.items = [];
	}
	add(e) {
		this.items.push(e);
	}
	delete(e) {
		let t = ht(e);
		return typeof t == "number" && this.items.splice(t, 1).length > 0;
	}
	get(e, t) {
		let n = ht(e);
		if (typeof n != "number") return;
		let r = this.items[n];
		return !t && w(r) ? r.value : r;
	}
	has(e) {
		let t = ht(e);
		return typeof t == "number" && t < this.items.length;
	}
	set(e, t) {
		let n = ht(e);
		if (typeof n != "number") throw Error(`Expected a valid index, not ${e}.`);
		let r = this.items[n];
		w(r) && Se(t) ? r.value = t : this.items[n] = t;
	}
	toJSON(e, t) {
		let n = [];
		t?.onCreate && t.onCreate(n);
		let r = 0;
		for (let e of this.items) n.push(D(e, String(r++), t));
		return n;
	}
	toString(e, t, n) {
		return e ? ct(this, e, {
			blockItemPrefix: "- ",
			flowChars: {
				start: "[",
				end: "]"
			},
			itemIndent: (e.indent || "") + "  ",
			onChompKeep: n,
			onComment: t
		}) : JSON.stringify(this);
	}
	static from(e, t, n) {
		let { replacer: r } = n, i = new this(e);
		if (t && Symbol.iterator in Object(t)) {
			let e = 0;
			for (let a of t) {
				if (typeof r == "function") {
					let n = t instanceof Set ? a : String(e++);
					a = r.call(t, n, a);
				}
				i.items.push(Te(a, void 0, n));
			}
		}
		return i;
	}
};
function ht(e) {
	let t = w(e) ? e.value : e;
	return t && typeof t == "string" && (t = Number(t)), typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : null;
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/common/seq.js
var gt = {
	collection: "seq",
	default: !0,
	nodeClass: mt,
	tag: "tag:yaml.org,2002:seq",
	resolve(e, t) {
		return te(e) || t("Expected a sequence for this tag"), e;
	},
	createNode: (e, t, n) => mt.from(e, t, n)
}, _t = {
	identify: (e) => typeof e == "string",
	default: !0,
	tag: "tag:yaml.org,2002:str",
	resolve: (e) => e,
	stringify(e, t, n, r) {
		return t = Object.assign({ actualString: !0 }, t), Ke(e, t, n, r);
	}
}, vt = {
	identify: (e) => e == null,
	createNode: () => new O(null),
	default: !0,
	tag: "tag:yaml.org,2002:null",
	test: /^(?:~|[Nn]ull|NULL)?$/,
	resolve: () => new O(null),
	stringify: ({ source: e }, t) => typeof e == "string" && vt.test.test(e) ? e : t.options.nullStr
}, yt = {
	identify: (e) => typeof e == "boolean",
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
	resolve: (e) => new O(e[0] === "t" || e[0] === "T"),
	stringify({ source: e, value: t }, n) {
		return e && yt.test.test(e) && t === (e[0] === "t" || e[0] === "T") ? e : t ? n.options.trueStr : n.options.falseStr;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function bt({ format: e, minFractionDigits: t, tag: n, value: r }) {
	if (typeof r == "bigint") return String(r);
	let i = typeof r == "number" ? r : Number(r);
	if (!isFinite(i)) return isNaN(i) ? ".nan" : i < 0 ? "-.inf" : ".inf";
	let a = Object.is(r, -0) ? "-0" : JSON.stringify(r);
	if (!e && t && (!n || n === "tag:yaml.org,2002:float") && /^-?\d/.test(a) && !a.includes("e")) {
		let e = a.indexOf(".");
		e < 0 && (e = a.length, a += ".");
		let n = t - (a.length - e - 1);
		for (; n-- > 0;) a += "0";
	}
	return a;
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/core/float.js
var xt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
	resolve: (e) => e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? -Infinity : Infinity,
	stringify: bt
}, St = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "EXP",
	test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
	resolve: (e) => parseFloat(e),
	stringify(e) {
		let t = Number(e.value);
		return isFinite(t) ? t.toExponential() : bt(e);
	}
}, Ct = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
	resolve(e) {
		let t = new O(parseFloat(e)), n = e.indexOf(".");
		return n !== -1 && e[e.length - 1] === "0" && (t.minFractionDigits = e.length - n - 1), t;
	},
	stringify: bt
}, wt = (e) => typeof e == "bigint" || Number.isInteger(e), Tt = (e, t, n, { intAsBigInt: r }) => r ? BigInt(e) : parseInt(e.substring(t), n);
function Et(e, t, n) {
	let { value: r } = e;
	return wt(r) && r >= 0 ? n + r.toString(t) : bt(e);
}
var Dt = {
	identify: (e) => wt(e) && e >= 0,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "OCT",
	test: /^0o[0-7]+$/,
	resolve: (e, t, n) => Tt(e, 2, 8, n),
	stringify: (e) => Et(e, 8, "0o")
}, Ot = {
	identify: wt,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	test: /^[-+]?[0-9]+$/,
	resolve: (e, t, n) => Tt(e, 0, 10, n),
	stringify: bt
}, kt = {
	identify: (e) => wt(e) && e >= 0,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "HEX",
	test: /^0x[0-9a-fA-F]+$/,
	resolve: (e, t, n) => Tt(e, 2, 16, n),
	stringify: (e) => Et(e, 16, "0x")
}, At = [
	pt,
	gt,
	_t,
	vt,
	yt,
	Dt,
	Ot,
	kt,
	xt,
	St,
	Ct
];
//#endregion
//#region node_modules/yaml/browser/dist/schema/json/schema.js
function jt(e) {
	return typeof e == "bigint" || Number.isInteger(e);
}
var Mt = ({ value: e }) => JSON.stringify(e), Nt = [
	{
		identify: (e) => typeof e == "string",
		default: !0,
		tag: "tag:yaml.org,2002:str",
		resolve: (e) => e,
		stringify: Mt
	},
	{
		identify: (e) => e == null,
		createNode: () => new O(null),
		default: !0,
		tag: "tag:yaml.org,2002:null",
		test: /^null$/,
		resolve: () => null,
		stringify: Mt
	},
	{
		identify: (e) => typeof e == "boolean",
		default: !0,
		tag: "tag:yaml.org,2002:bool",
		test: /^true$|^false$/,
		resolve: (e) => e === "true",
		stringify: Mt
	},
	{
		identify: jt,
		default: !0,
		tag: "tag:yaml.org,2002:int",
		test: /^-?(?:0|[1-9][0-9]*)$/,
		resolve: (e, t, { intAsBigInt: n }) => n ? BigInt(e) : parseInt(e, 10),
		stringify: ({ value: e }) => jt(e) ? e.toString() : JSON.stringify(e)
	},
	{
		identify: (e) => typeof e == "number",
		default: !0,
		tag: "tag:yaml.org,2002:float",
		test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
		resolve: (e) => parseFloat(e),
		stringify: Mt
	}
], Pt = [pt, gt].concat(Nt, {
	default: !0,
	tag: "",
	test: /^/,
	resolve(e, t) {
		return t(`Unresolved plain scalar ${JSON.stringify(e)}`), e;
	}
}), Ft = {
	identify: (e) => e instanceof Uint8Array,
	default: !1,
	tag: "tag:yaml.org,2002:binary",
	resolve(e, t) {
		if (typeof atob == "function") {
			let t = atob(e.replace(/[\n\r]/g, "")), n = new Uint8Array(t.length);
			for (let e = 0; e < t.length; ++e) n[e] = t.charCodeAt(e);
			return n;
		}
		return t("This environment does not support reading binary tags; either Buffer or atob is required"), e;
	},
	stringify({ comment: e, type: t, value: n }, r, i, a) {
		if (!n) return "";
		let o = n, s;
		if (typeof btoa == "function") {
			let e = "";
			for (let t = 0; t < o.length; ++t) e += String.fromCharCode(o[t]);
			s = btoa(e);
		} else throw Error("This environment does not support writing binary tags; either Buffer or btoa is required");
		if (t ??= O.BLOCK_LITERAL, t !== O.QUOTE_DOUBLE) {
			let e = Math.max(r.options.lineWidth - r.indent.length, r.options.minContentWidth), n = Math.ceil(s.length / e), i = Array(n);
			for (let t = 0, r = 0; t < n; ++t, r += e) i[t] = s.substr(r, e);
			s = i.join(t === O.BLOCK_LITERAL ? "\n" : " ");
		}
		return Ke({
			comment: e,
			type: t,
			value: s
		}, r, i, a);
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function It(e, t) {
	if (te(e)) for (let n = 0; n < e.items.length; ++n) {
		let r = e.items[n];
		if (!C(r)) {
			if (ee(r)) {
				r.items.length > 1 && t("Each pair must have its own sequence indicator");
				let e = r.items[0] || new k(new O(null));
				if (r.commentBefore && (e.key.commentBefore = e.key.commentBefore ? `${r.commentBefore}\n${e.key.commentBefore}` : r.commentBefore), r.comment) {
					let t = e.value ?? e.key;
					t.comment = t.comment ? `${r.comment}\n${t.comment}` : r.comment;
				}
				r = e;
			}
			e.items[n] = C(r) ? r : new k(r);
		}
	}
	else t("Expected a sequence for this tag");
	return e;
}
function Lt(e, t, n) {
	let { replacer: r } = n, i = new mt(e);
	i.tag = "tag:yaml.org,2002:pairs";
	let a = 0;
	if (t && Symbol.iterator in Object(t)) for (let e of t) {
		typeof r == "function" && (e = r.call(t, String(a++), e));
		let o, s;
		if (Array.isArray(e)) {
			if (e.length === 2) o = e[0], s = e[1];
			else throw TypeError(`Expected [key, value] tuple: ${e}`);
		} else if (e && e instanceof Object) {
			let t = Object.keys(e);
			if (t.length === 1) o = t[0], s = e[o];
			else throw TypeError(`Expected tuple with one key, not ${t.length} keys`);
		} else o = e;
		i.items.push(st(o, s, n));
	}
	return i;
}
var Rt = {
	collection: "seq",
	default: !1,
	tag: "tag:yaml.org,2002:pairs",
	resolve: It,
	createNode: Lt
}, zt = class e extends mt {
	constructor() {
		super(), this.add = A.prototype.add.bind(this), this.delete = A.prototype.delete.bind(this), this.get = A.prototype.get.bind(this), this.has = A.prototype.has.bind(this), this.set = A.prototype.set.bind(this), this.tag = e.tag;
	}
	toJSON(e, t) {
		if (!t) return super.toJSON(e);
		let n = /* @__PURE__ */ new Map();
		t?.onCreate && t.onCreate(n);
		for (let e of this.items) {
			let r, i;
			if (C(e) ? (r = D(e.key, "", t), i = D(e.value, r, t)) : r = D(e, "", t), n.has(r)) throw Error("Ordered maps must not include duplicate keys");
			n.set(r, i);
		}
		return n;
	}
	static from(e, t, n) {
		let r = Lt(e, t, n), i = new this();
		return i.items = r.items, i;
	}
};
zt.tag = "tag:yaml.org,2002:omap";
var Bt = {
	collection: "seq",
	identify: (e) => e instanceof Map,
	nodeClass: zt,
	default: !1,
	tag: "tag:yaml.org,2002:omap",
	resolve(e, t) {
		let n = It(e, t), r = [];
		for (let { key: e } of n.items) w(e) && (r.includes(e.value) ? t(`Ordered maps must not include duplicate keys: ${e.value}`) : r.push(e.value));
		return Object.assign(new zt(), n);
	},
	createNode: (e, t, n) => zt.from(e, t, n)
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function Vt({ value: e, source: t }, n) {
	return t && (e ? Ht : Ut).test.test(t) ? t : e ? n.options.trueStr : n.options.falseStr;
}
var Ht = {
	identify: (e) => e === !0,
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
	resolve: () => new O(!0),
	stringify: Vt
}, Ut = {
	identify: (e) => e === !1,
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
	resolve: () => new O(!1),
	stringify: Vt
}, Wt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
	resolve: (e) => e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? -Infinity : Infinity,
	stringify: bt
}, Gt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "EXP",
	test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
	resolve: (e) => parseFloat(e.replace(/_/g, "")),
	stringify(e) {
		let t = Number(e.value);
		return isFinite(t) ? t.toExponential() : bt(e);
	}
}, Kt = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
	resolve(e) {
		let t = new O(parseFloat(e.replace(/_/g, ""))), n = e.indexOf(".");
		if (n !== -1) {
			let r = e.substring(n + 1).replace(/_/g, "");
			r[r.length - 1] === "0" && (t.minFractionDigits = r.length);
		}
		return t;
	},
	stringify: bt
}, qt = (e) => typeof e == "bigint" || Number.isInteger(e);
function Jt(e, t, n, { intAsBigInt: r }) {
	let i = e[0];
	if ((i === "-" || i === "+") && (t += 1), e = e.substring(t).replace(/_/g, ""), r) {
		switch (n) {
			case 2:
				e = `0b${e}`;
				break;
			case 8:
				e = `0o${e}`;
				break;
			case 16: e = `0x${e}`;
		}
		let t = BigInt(e);
		return i === "-" ? BigInt(-1) * t : t;
	}
	let a = parseInt(e, n);
	return i === "-" ? -1 * a : a;
}
function Yt(e, t, n) {
	let { value: r } = e;
	if (qt(r)) {
		let e = r.toString(t);
		return r < 0 ? "-" + n + e.substr(1) : n + e;
	}
	return bt(e);
}
var Xt = {
	identify: qt,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "BIN",
	test: /^[-+]?0b[0-1_]+$/,
	resolve: (e, t, n) => Jt(e, 2, 2, n),
	stringify: (e) => Yt(e, 2, "0b")
}, Zt = {
	identify: qt,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "OCT",
	test: /^[-+]?0[0-7_]+$/,
	resolve: (e, t, n) => Jt(e, 1, 8, n),
	stringify: (e) => Yt(e, 8, "0")
}, Qt = {
	identify: qt,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	test: /^[-+]?[0-9][0-9_]*$/,
	resolve: (e, t, n) => Jt(e, 0, 10, n),
	stringify: bt
}, $t = {
	identify: qt,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "HEX",
	test: /^[-+]?0x[0-9a-fA-F_]+$/,
	resolve: (e, t, n) => Jt(e, 2, 16, n),
	stringify: (e) => Yt(e, 16, "0x")
}, en = class e extends A {
	constructor(t) {
		super(t), this.tag = e.tag;
	}
	add(e) {
		let t;
		t = C(e) ? e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? new k(e.key, null) : new k(e, null), ft(this.items, t.key) || this.items.push(t);
	}
	get(e, t) {
		let n = ft(this.items, e);
		return !t && C(n) ? w(n.key) ? n.key.value : n.key : n;
	}
	set(e, t) {
		if (typeof t != "boolean") throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);
		let n = ft(this.items, e);
		n && !t ? this.items.splice(this.items.indexOf(n), 1) : !n && t && this.items.push(new k(e));
	}
	toJSON(e, t) {
		return super.toJSON(e, t, Set);
	}
	toString(e, t, n) {
		if (!e) return JSON.stringify(this);
		if (this.hasAllNullValues(!0)) return super.toString(Object.assign({}, e, { allNullValues: !0 }), t, n);
		throw Error("Set items must all have null values");
	}
	static from(e, t, n) {
		let { replacer: r } = n, i = new this(e);
		if (t && Symbol.iterator in Object(t)) for (let e of t) typeof r == "function" && (e = r.call(t, e, e)), i.items.push(st(e, null, n));
		return i;
	}
};
en.tag = "tag:yaml.org,2002:set";
var tn = {
	collection: "map",
	identify: (e) => e instanceof Set,
	nodeClass: en,
	default: !1,
	tag: "tag:yaml.org,2002:set",
	createNode: (e, t, n) => en.from(e, t, n),
	resolve(e, t) {
		if (ee(e)) {
			if (e.hasAllNullValues(!0)) return Object.assign(new en(), e);
			t("Set items must all have null values");
		} else t("Expected a mapping for this tag");
		return e;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function nn(e, t) {
	let n = e[0], r = n === "-" || n === "+" ? e.substring(1) : e, i = (e) => t ? BigInt(e) : Number(e), a = r.replace(/_/g, "").split(":").reduce((e, t) => e * i(60) + i(t), i(0));
	return n === "-" ? i(-1) * a : a;
}
function rn(e) {
	let { value: t } = e, n = (e) => e;
	if (typeof t == "bigint") n = (e) => BigInt(e);
	else if (isNaN(t) || !isFinite(t)) return bt(e);
	let r = "";
	t < 0 && (r = "-", t *= n(-1));
	let i = n(60), a = [t % i];
	return t < 60 ? a.unshift(0) : (t = (t - a[0]) / i, a.unshift(t % i), t >= 60 && (t = (t - a[0]) / i, a.unshift(t))), r + a.map((e) => String(e).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var an = {
	identify: (e) => typeof e == "bigint" || Number.isInteger(e),
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "TIME",
	test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
	resolve: (e, t, { intAsBigInt: n }) => nn(e, n),
	stringify: rn
}, on = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "TIME",
	test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
	resolve: (e) => nn(e, !1),
	stringify: rn
}, sn = {
	identify: (e) => e instanceof Date,
	default: !0,
	tag: "tag:yaml.org,2002:timestamp",
	test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
	resolve(e) {
		let t = e.match(sn.test);
		if (!t) throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
		let [, n, r, i, a, o, s] = t.map(Number), c = t[7] ? Number((t[7] + "00").substr(1, 3)) : 0, l = Date.UTC(n, r - 1, i, a || 0, o || 0, s || 0, c), u = t[8];
		if (u && u !== "Z") {
			let e = nn(u, !1);
			Math.abs(e) < 30 && (e *= 60), l -= 6e4 * e;
		}
		return new Date(l);
	},
	stringify: ({ value: e }) => e?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
}, cn = [
	pt,
	gt,
	_t,
	vt,
	Ht,
	Ut,
	Xt,
	Zt,
	Qt,
	$t,
	Wt,
	Gt,
	Kt,
	Ft,
	et,
	Bt,
	Rt,
	tn,
	an,
	on,
	sn
], ln = /* @__PURE__ */ new Map([
	["core", At],
	["failsafe", [
		pt,
		gt,
		_t
	]],
	["json", Pt],
	["yaml11", cn],
	["yaml-1.1", cn]
]), un = {
	binary: Ft,
	bool: yt,
	float: Ct,
	floatExp: St,
	floatNaN: xt,
	floatTime: on,
	int: Ot,
	intHex: kt,
	intOct: Dt,
	intTime: an,
	map: pt,
	merge: et,
	null: vt,
	omap: Bt,
	pairs: Rt,
	seq: gt,
	set: tn,
	timestamp: sn
}, dn = {
	"tag:yaml.org,2002:binary": Ft,
	"tag:yaml.org,2002:merge": et,
	"tag:yaml.org,2002:omap": Bt,
	"tag:yaml.org,2002:pairs": Rt,
	"tag:yaml.org,2002:set": tn,
	"tag:yaml.org,2002:timestamp": sn
};
function fn(e, t, n) {
	let r = ln.get(t);
	if (r && !e) return n && !r.includes(et) ? r.concat(et) : r.slice();
	let i = r;
	if (!i) {
		if (Array.isArray(e)) i = [];
		else {
			let e = Array.from(ln.keys()).filter((e) => e !== "yaml11").map((e) => JSON.stringify(e)).join(", ");
			throw Error(`Unknown schema "${t}"; use one of ${e} or define customTags array`);
		}
	}
	if (Array.isArray(e)) for (let t of e) i = i.concat(t);
	else typeof e == "function" && (i = e(i.slice()));
	return n && (i = i.concat(et)), i.reduce((e, t) => {
		let n = typeof t == "string" ? un[t] : t;
		if (!n) {
			let e = JSON.stringify(t), n = Object.keys(un).map((e) => JSON.stringify(e)).join(", ");
			throw Error(`Unknown custom tag ${e}; use one of ${n}`);
		}
		return e.includes(n) || e.push(n), e;
	}, []);
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/Schema.js
var pn = (e, t) => e.key < t.key ? -1 : +(e.key > t.key), mn = class e {
	constructor({ compat: e, customTags: t, merge: n, resolveKnownTags: r, schema: i, sortMapEntries: a, toStringDefaults: o }) {
		this.compat = Array.isArray(e) ? fn(e, "compat") : e ? fn(null, e) : null, this.name = typeof i == "string" && i || "core", this.knownTags = r ? dn : {}, this.tags = fn(t, this.name, n), this.toStringOptions = o ?? null, Object.defineProperty(this, g, { value: pt }), Object.defineProperty(this, v, { value: _t }), Object.defineProperty(this, y, { value: gt }), this.sortMapEntries = typeof a == "function" ? a : a === !0 ? pn : null;
	}
	clone() {
		let t = Object.create(e.prototype, Object.getOwnPropertyDescriptors(this));
		return t.tags = this.tags.slice(), t;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function hn(e, t) {
	let n = [], r = t.directives === !0;
	if (t.directives !== !1 && e.directives) {
		let t = e.directives.toString(e);
		t ? (n.push(t), r = !0) : e.directives.docStart && (r = !0);
	}
	r && n.push("---");
	let i = qe(e, t), { commentString: a } = i.options;
	if (e.commentBefore) {
		n.length !== 1 && n.unshift("");
		let t = a(e.commentBefore);
		n.unshift(Ae(t, ""));
	}
	let o = !1, s = null;
	if (e.contents) {
		if (E(e.contents)) {
			if (e.contents.spaceBefore && r && n.push(""), e.contents.commentBefore) {
				let t = a(e.contents.commentBefore);
				n.push(Ae(t, ""));
			}
			i.forceBlockIndent = !!e.comment, s = e.contents.comment;
		}
		let t = s ? void 0 : () => o = !0, c = Xe(e.contents, i, () => s = null, t);
		s && (c += je(c, "", a(s))), (c[0] === "|" || c[0] === ">") && n[n.length - 1] === "---" ? n[n.length - 1] = `--- ${c}` : n.push(c);
	} else n.push(Xe(e.contents, i));
	if (e.directives?.docEnd) {
		if (e.comment) {
			let t = a(e.comment);
			t.includes("\n") ? (n.push("..."), n.push(Ae(t, ""))) : n.push(`... ${t}`);
		} else n.push("...");
	} else {
		let t = e.comment;
		t && o && (t = t.replace(/^\n+/, "")), t && ((!o || s) && n[n.length - 1] !== "" && n.push(""), n.push(Ae(a(t), "")));
	}
	return n.join("\n") + "\n";
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/Document.js
var gn = class e {
	constructor(e, t, n) {
		this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, b, { value: h });
		let r = null;
		typeof t == "function" || Array.isArray(t) ? r = t : n === void 0 && t && (n = t, t = void 0);
		let i = Object.assign({
			intAsBigInt: !1,
			keepSourceTokens: !1,
			logLevel: "warn",
			prettyErrors: !0,
			strict: !0,
			stringKeys: !1,
			uniqueKeys: !0,
			version: "1.2"
		}, n);
		this.options = i;
		let { version: a } = i;
		n?._directives ? (this.directives = n._directives.atDocument(), this.directives.yaml.explicit && (a = this.directives.yaml.version)) : this.directives = new pe({ version: a }), this.setSchema(a, n), this.contents = e === void 0 ? null : this.createNode(e, r, n);
	}
	clone() {
		let t = Object.create(e.prototype, { [b]: { value: h } });
		return t.commentBefore = this.commentBefore, t.comment = this.comment, t.errors = this.errors.slice(), t.warnings = this.warnings.slice(), t.options = Object.assign({}, this.options), this.directives && (t.directives = this.directives.clone()), t.schema = this.schema.clone(), t.contents = E(this.contents) ? this.contents.clone(t.schema) : this.contents, this.range && (t.range = this.range.slice()), t;
	}
	add(e) {
		_n(this.contents) && this.contents.add(e);
	}
	addIn(e, t) {
		_n(this.contents) && this.contents.addIn(e, t);
	}
	createAlias(e, t) {
		if (!e.anchor) {
			let n = he(this);
			e.anchor = !t || n.has(t) ? ge(t || "a", n) : t;
		}
		return new be(e.anchor);
	}
	createNode(e, t, n) {
		let r;
		if (typeof t == "function") e = t.call({ "": e }, "", e), r = t;
		else if (Array.isArray(t)) {
			let e = t.filter((e) => typeof e == "number" || e instanceof String || e instanceof Number).map(String);
			e.length > 0 && (t = t.concat(e)), r = t;
		} else n === void 0 && t && (n = t, t = void 0);
		let { aliasDuplicateObjects: i, anchorPrefix: a, flow: o, keepUndefined: s, onTagObj: c, tag: l } = n ?? {}, { onAnchor: u, setAnchors: d, sourceObjects: f } = _e(this, a || "a"), p = {
			aliasDuplicateObjects: i ?? !0,
			keepUndefined: s ?? !1,
			onAnchor: u,
			onTagObj: c,
			replacer: r,
			schema: this.schema,
			sourceObjects: f
		}, m = Te(e, l, p);
		return o && T(m) && (m.flow = !0), d(), m;
	}
	createPair(e, t, n = {}) {
		return new k(this.createNode(e, null, n), this.createNode(t, null, n));
	}
	delete(e) {
		return _n(this.contents) ? this.contents.delete(e) : !1;
	}
	deleteIn(e) {
		return De(e) ? this.contents != null && (this.contents = null, !0) : _n(this.contents) ? this.contents.deleteIn(e) : !1;
	}
	get(e, t) {
		return T(this.contents) ? this.contents.get(e, t) : void 0;
	}
	getIn(e, t) {
		return De(e) ? !t && w(this.contents) ? this.contents.value : this.contents : T(this.contents) ? this.contents.getIn(e, t) : void 0;
	}
	has(e) {
		return T(this.contents) ? this.contents.has(e) : !1;
	}
	hasIn(e) {
		return De(e) ? this.contents !== void 0 : T(this.contents) ? this.contents.hasIn(e) : !1;
	}
	set(e, t) {
		this.contents == null ? this.contents = Ee(this.schema, [e], t) : _n(this.contents) && this.contents.set(e, t);
	}
	setIn(e, t) {
		De(e) ? this.contents = t : this.contents == null ? this.contents = Ee(this.schema, Array.from(e), t) : _n(this.contents) && this.contents.setIn(e, t);
	}
	setSchema(e, t = {}) {
		typeof e == "number" && (e = String(e));
		let n;
		switch (e) {
			case "1.1":
				this.directives ? this.directives.yaml.version = "1.1" : this.directives = new pe({ version: "1.1" }), n = {
					resolveKnownTags: !1,
					schema: "yaml-1.1"
				};
				break;
			case "1.2":
			case "next":
				this.directives ? this.directives.yaml.version = e : this.directives = new pe({ version: e }), n = {
					resolveKnownTags: !0,
					schema: "core"
				};
				break;
			case null:
				this.directives && delete this.directives, n = null;
				break;
			default: {
				let t = JSON.stringify(e);
				throw Error(`Expected '1.1', '1.2' or null as first argument, but found: ${t}`);
			}
		}
		if (t.schema instanceof Object) this.schema = t.schema;
		else if (n) this.schema = new mn(Object.assign(n, t));
		else throw Error("With a null YAML version, the { schema: Schema } option is required");
	}
	toJS({ json: e, jsonArg: t, mapAsMap: n, maxAliasCount: r, onAnchor: i, reviver: a } = {}) {
		let o = {
			anchors: /* @__PURE__ */ new Map(),
			doc: this,
			keep: !e,
			mapAsMap: n === !0,
			mapKeyWarned: !1,
			maxAliasCount: typeof r == "number" ? r : 100
		}, s = D(this.contents, t ?? "", o);
		if (typeof i == "function") for (let { count: e, res: t } of o.anchors.values()) i(t, e);
		return typeof a == "function" ? ve(a, { "": s }, "", s) : s;
	}
	toJSON(e, t) {
		return this.toJS({
			json: !0,
			jsonArg: e,
			mapAsMap: !1,
			onAnchor: t
		});
	}
	toString(e = {}) {
		if (this.errors.length > 0) throw Error("Document with errors cannot be stringified");
		if ("indent" in e && (!Number.isInteger(e.indent) || Number(e.indent) <= 0)) {
			let t = JSON.stringify(e.indent);
			throw Error(`"indent" option must be a positive integer, not ${t}`);
		}
		return hn(this, e);
	}
};
function _n(e) {
	if (T(e)) return !0;
	throw Error("Expected a YAML collection as document contents");
}
//#endregion
//#region node_modules/yaml/browser/dist/errors.js
var vn = class extends Error {
	constructor(e, t, n, r) {
		super(), this.name = e, this.code = n, this.message = r, this.pos = t;
	}
}, yn = class extends vn {
	constructor(e, t, n) {
		super("YAMLParseError", e, t, n);
	}
}, bn = class extends vn {
	constructor(e, t, n) {
		super("YAMLWarning", e, t, n);
	}
}, xn = (e, t) => (n) => {
	if (n.pos[0] === -1) return;
	n.linePos = n.pos.map((e) => t.linePos(e));
	let { line: r, col: i } = n.linePos[0];
	n.message += ` at line ${r}, column ${i}`;
	let a = i - 1, o = e.substring(t.lineStarts[r - 1], t.lineStarts[r]).replace(/[\n\r]+$/, "");
	if (a >= 60 && o.length > 80) {
		let e = Math.min(a - 39, o.length - 79);
		o = "…" + o.substring(e), a -= e - 1;
	}
	if (o.length > 80 && (o = o.substring(0, 79) + "…"), r > 1 && /^ *$/.test(o.substring(0, a))) {
		let n = e.substring(t.lineStarts[r - 2], t.lineStarts[r - 1]);
		n.length > 80 && (n = n.substring(0, 79) + "…\n"), o = n + o;
	}
	if (/[^ ]/.test(o)) {
		let e = 1, t = n.linePos[1];
		t?.line === r && t.col > i && (e = Math.max(1, Math.min(t.col - i, 80 - a)));
		let s = " ".repeat(a) + "^".repeat(e);
		n.message += `:\n\n${o}\n${s}\n`;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-props.js
function Sn(e, { flow: t, indicator: n, next: r, offset: i, onError: a, parentIndent: o, startOnNewline: s }) {
	let c = !1, l = s, u = s, d = "", f = "", p = !1, m = !1, h = null, g = null, _ = null, v = null, y = null, b = null, x = null;
	for (let i of e) switch (m &&= (i.type !== "space" && i.type !== "newline" && i.type !== "comma" && a(i.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), !1), h &&= (l && i.type !== "comment" && i.type !== "newline" && a(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), null), i.type) {
		case "space":
			!t && (n !== "doc-start" || r?.type !== "flow-collection") && i.source.includes("	") && (h = i), u = !0;
			break;
		case "comment": {
			u || a(i, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
			let e = i.source.substring(1) || " ";
			d ? d += f + e : d = e, f = "", l = !1;
			break;
		}
		case "newline":
			l ? d ? d += i.source : (!b || n !== "seq-item-ind") && (c = !0) : f += i.source, l = !0, p = !0, (g || _) && (v = i), u = !0;
			break;
		case "anchor":
			g && a(i, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), i.source.endsWith(":") && a(i.offset + i.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), g = i, x ??= i.offset, l = !1, u = !1, m = !0;
			break;
		case "tag":
			_ && a(i, "MULTIPLE_TAGS", "A node can have at most one tag"), _ = i, x ??= i.offset, l = !1, u = !1, m = !0;
			break;
		case n:
			(g || _) && a(i, "BAD_PROP_ORDER", `Anchors and tags must be after the ${i.source} indicator`), b && a(i, "UNEXPECTED_TOKEN", `Unexpected ${i.source} in ${t ?? "collection"}`), b = i, l = n === "seq-item-ind" || n === "explicit-key-ind", u = !1;
			break;
		case "comma": if (t) {
			y && a(i, "UNEXPECTED_TOKEN", `Unexpected , in ${t}`), y = i, l = !1, u = !1;
			break;
		}
		default: a(i, "UNEXPECTED_TOKEN", `Unexpected ${i.type} token`), l = !1, u = !1;
	}
	let S = e[e.length - 1], ee = S ? S.offset + S.source.length : i;
	return m && r && r.type !== "space" && r.type !== "newline" && r.type !== "comma" && (r.type !== "scalar" || r.source !== "") && a(r.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), h && (l && h.indent <= o || r?.type === "block-map" || r?.type === "block-seq") && a(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
		comma: y,
		found: b,
		spaceBefore: c,
		comment: d,
		hasNewline: p,
		anchor: g,
		tag: _,
		newlineAfterProp: v,
		end: ee,
		start: x ?? ee
	};
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-contains-newline.js
function Cn(e) {
	if (!e) return null;
	switch (e.type) {
		case "alias":
		case "scalar":
		case "double-quoted-scalar":
		case "single-quoted-scalar":
			if (e.source.includes("\n")) return !0;
			if (e.end) {
				for (let t of e.end) if (t.type === "newline") return !0;
			}
			return !1;
		case "flow-collection":
			for (let t of e.items) {
				for (let e of t.start) if (e.type === "newline") return !0;
				if (t.sep) {
					for (let e of t.sep) if (e.type === "newline") return !0;
				}
				if (Cn(t.key) || Cn(t.value)) return !0;
			}
			return !1;
		default: return !0;
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
function wn(e, t, n) {
	if (t?.type === "flow-collection") {
		let r = t.end[0];
		r.indent === e && (r.source === "]" || r.source === "}") && Cn(t) && n(r, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-map-includes.js
function Tn(e, t, n) {
	let { uniqueKeys: r } = e.options;
	if (r === !1) return !1;
	let i = typeof r == "function" ? r : (e, t) => e === t || w(e) && w(t) && e.value === t.value;
	return t.some((e) => i(e.key, n));
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-block-map.js
var En = "All mapping items must start at the same column";
function Dn({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = new ((a?.nodeClass) ?? A)(n.schema);
	n.atRoot &&= !1;
	let s = r.offset, c = null;
	for (let a of r.items) {
		let { start: l, key: u, sep: d, value: f } = a, p = Sn(l, {
			indicator: "explicit-key-ind",
			next: u ?? d?.[0],
			offset: s,
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !0
		}), m = !p.found;
		if (m) {
			if (u && (u.type === "block-seq" ? i(s, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in u && u.indent !== r.indent && i(s, "BAD_INDENT", En)), !p.anchor && !p.tag && !d) {
				c = p.end, p.comment && (o.comment ? o.comment += "\n" + p.comment : o.comment = p.comment);
				continue;
			}
			(p.newlineAfterProp || Cn(u)) && i(u ?? l[l.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
		} else p.found?.indent !== r.indent && i(s, "BAD_INDENT", En);
		n.atKey = !0;
		let h = p.end, g = u ? e(n, u, p, i) : t(n, h, l, null, p, i);
		n.schema.compat && wn(r.indent, u, i), n.atKey = !1, Tn(n, o.items, g) && i(h, "DUPLICATE_KEY", "Map keys must be unique");
		let _ = Sn(d ?? [], {
			indicator: "map-value-ind",
			next: f,
			offset: g.range[2],
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !u || u.type === "block-scalar"
		});
		if (s = _.end, _.found) {
			m && (f?.type === "block-map" && !_.hasNewline && i(s, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings"), n.options.strict && p.start < _.found.offset - 1024 && i(g.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));
			let c = f ? e(n, f, _, i) : t(n, s, d, null, _, i);
			n.schema.compat && wn(r.indent, f, i), s = c.range[2];
			let l = new k(g, c);
			n.options.keepSourceTokens && (l.srcToken = a), o.items.push(l);
		} else {
			m && i(g.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), _.comment && (g.comment ? g.comment += "\n" + _.comment : g.comment = _.comment);
			let e = new k(g);
			n.options.keepSourceTokens && (e.srcToken = a), o.items.push(e);
		}
	}
	return c && c < s && i(c, "IMPOSSIBLE", "Map comment with trailing content"), o.range = [
		r.offset,
		s,
		c ?? s
	], o;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-block-seq.js
function On({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = new ((a?.nodeClass) ?? mt)(n.schema);
	n.atRoot &&= !1, n.atKey &&= !1;
	let s = r.offset, c = null;
	for (let { start: a, value: l } of r.items) {
		let u = Sn(a, {
			indicator: "seq-item-ind",
			next: l,
			offset: s,
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !0
		});
		if (!u.found) {
			if (u.anchor || u.tag || l) l?.type === "block-seq" ? i(u.end, "BAD_INDENT", "All sequence items must start at the same column") : i(s, "MISSING_CHAR", "Sequence item without - indicator");
			else {
				c = u.end, u.comment && (o.comment = u.comment);
				continue;
			}
		}
		let d = l ? e(n, l, u, i) : t(n, u.end, a, null, u, i);
		n.schema.compat && wn(r.indent, l, i), s = d.range[2], o.items.push(d);
	}
	return o.range = [
		r.offset,
		s,
		c ?? s
	], o;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-end.js
function kn(e, t, n, r) {
	let i = "";
	if (e) {
		let a = !1, o = "";
		for (let s of e) {
			let { source: e, type: c } = s;
			switch (c) {
				case "space":
					a = !0;
					break;
				case "comment": {
					n && !a && r(s, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
					let t = e.substring(1) || " ";
					i ? i += o + t : i = t, o = "";
					break;
				}
				case "newline":
					i && (o += e), a = !0;
					break;
				default: r(s, "UNEXPECTED_TOKEN", `Unexpected ${c} at node end`);
			}
			t += e.length;
		}
	}
	return {
		comment: i,
		offset: t
	};
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-flow-collection.js
var An = "Block collections are not allowed within flow collections", jn = (e) => e && (e.type === "block-map" || e.type === "block-seq");
function Mn({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = r.start.source === "{", s = o ? "flow map" : "flow sequence", c = new ((a?.nodeClass) ?? (o ? A : mt))(n.schema);
	c.flow = !0;
	let l = n.atRoot;
	l && (n.atRoot = !1), n.atKey &&= !1;
	let u = r.offset + r.start.source.length;
	for (let a = 0; a < r.items.length; ++a) {
		let l = r.items[a], { start: d, key: f, sep: p, value: m } = l, h = Sn(d, {
			flow: s,
			indicator: "explicit-key-ind",
			next: f ?? p?.[0],
			offset: u,
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !1
		});
		if (!h.found) {
			if (!h.anchor && !h.tag && !p && !m) {
				a === 0 && h.comma ? i(h.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${s}`) : a < r.items.length - 1 && i(h.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${s}`), h.comment && (c.comment ? c.comment += "\n" + h.comment : c.comment = h.comment), u = h.end;
				continue;
			}
			!o && n.options.strict && Cn(f) && i(f, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
		}
		if (a === 0) h.comma && i(h.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${s}`);
		else if (h.comma || i(h.start, "MISSING_CHAR", `Missing , between ${s} items`), h.comment) {
			let e = "";
			loop: for (let t of d) switch (t.type) {
				case "comma":
				case "space": break;
				case "comment":
					e = t.source.substring(1);
					break loop;
				default: break loop;
			}
			if (e) {
				let t = c.items[c.items.length - 1];
				C(t) && (t = t.value ?? t.key), t.comment ? t.comment += "\n" + e : t.comment = e, h.comment = h.comment.substring(e.length + 1);
			}
		}
		if (!o && !p && !h.found) {
			let r = m ? e(n, m, h, i) : t(n, h.end, p, null, h, i);
			c.items.push(r), u = r.range[2], jn(m) && i(r.range, "BLOCK_IN_FLOW", An);
		} else {
			n.atKey = !0;
			let a = h.end, g = f ? e(n, f, h, i) : t(n, a, d, null, h, i);
			jn(f) && i(g.range, "BLOCK_IN_FLOW", An), n.atKey = !1;
			let _ = Sn(p ?? [], {
				flow: s,
				indicator: "map-value-ind",
				next: m,
				offset: g.range[2],
				onError: i,
				parentIndent: r.indent,
				startOnNewline: !1
			});
			if (_.found) {
				if (!o && !h.found && n.options.strict) {
					if (p) for (let e of p) {
						if (e === _.found) break;
						if (e.type === "newline") {
							i(e, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
							break;
						}
					}
					h.start < _.found.offset - 1024 && i(_.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
				}
			} else m && ("source" in m && m.source?.[0] === ":" ? i(m, "MISSING_CHAR", `Missing space after : in ${s}`) : i(_.start, "MISSING_CHAR", `Missing , or : between ${s} items`));
			let v = m ? e(n, m, _, i) : _.found ? t(n, _.end, p, null, _, i) : null;
			v ? jn(m) && i(v.range, "BLOCK_IN_FLOW", An) : _.comment && (g.comment ? g.comment += "\n" + _.comment : g.comment = _.comment);
			let y = new k(g, v);
			if (n.options.keepSourceTokens && (y.srcToken = l), o) {
				let e = c;
				Tn(n, e.items, g) && i(a, "DUPLICATE_KEY", "Map keys must be unique"), e.items.push(y);
			} else {
				let e = new A(n.schema);
				e.flow = !0, e.items.push(y);
				let t = (v ?? g).range;
				e.range = [
					g.range[0],
					t[1],
					t[2]
				], c.items.push(e);
			}
			u = v ? v.range[2] : _.end;
		}
	}
	let d = o ? "}" : "]", [f, ...p] = r.end, m = u;
	if (f?.source === d) m = f.offset + f.source.length;
	else {
		let e = s[0].toUpperCase() + s.substring(1), t = l ? `${e} must end with a ${d}` : `${e} in block collection must be sufficiently indented and end with a ${d}`;
		i(u, l ? "MISSING_CHAR" : "BAD_INDENT", t), f && f.source.length !== 1 && p.unshift(f);
	}
	if (p.length > 0) {
		let e = kn(p, m, n.options.strict, i);
		e.comment && (c.comment ? c.comment += "\n" + e.comment : c.comment = e.comment), c.range = [
			r.offset,
			m,
			e.offset
		];
	} else c.range = [
		r.offset,
		m,
		m
	];
	return c;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-collection.js
function Nn(e, t, n, r, i, a) {
	let o = n.type === "block-map" ? Dn(e, t, n, r, a) : n.type === "block-seq" ? On(e, t, n, r, a) : Mn(e, t, n, r, a), s = o.constructor;
	return i === "!" || i === s.tagName ? (o.tag = s.tagName, o) : (i && (o.tag = i), o);
}
function Pn(e, t, n, r, i) {
	let a = r.tag, o = a ? t.directives.tagName(a.source, (e) => i(a, "TAG_RESOLVE_FAILED", e)) : null;
	if (n.type === "block-seq") {
		let { anchor: e, newlineAfterProp: t } = r, n = e && a ? e.offset > a.offset ? e : a : e ?? a;
		n && (!t || t.offset < n.offset) && i(n, "MISSING_CHAR", "Missing newline after block sequence props");
	}
	let s = n.type === "block-map" ? "map" : n.type === "block-seq" ? "seq" : n.start.source === "{" ? "map" : "seq";
	if (!a || !o || o === "!" || o === A.tagName && s === "map" || o === mt.tagName && s === "seq") return Nn(e, t, n, i, o);
	let c = t.schema.tags.find((e) => e.tag === o && e.collection === s);
	if (!c) {
		let r = t.schema.knownTags[o];
		if (r?.collection === s) t.schema.tags.push(Object.assign({}, r, { default: !1 })), c = r;
		else return r ? i(a, "BAD_COLLECTION_TYPE", `${r.tag} used for ${s} collection, but expects ${r.collection ?? "scalar"}`, !0) : i(a, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0), Nn(e, t, n, i, o);
	}
	let l = Nn(e, t, n, i, o, c), u = c.resolve?.(l, (e) => i(a, "TAG_RESOLVE_FAILED", e), t.options) ?? l, d = E(u) ? u : new O(u);
	return d.range = l.range, d.tag = o, c?.format && (d.format = c.format), d;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
function Fn(e, t, n) {
	let r = t.offset, i = In(t, e.options.strict, n);
	if (!i) return {
		value: "",
		type: null,
		comment: "",
		range: [
			r,
			r,
			r
		]
	};
	let a = i.mode === ">" ? O.BLOCK_FOLDED : O.BLOCK_LITERAL, o = t.source ? Ln(t.source) : [], s = o.length;
	for (let e = o.length - 1; e >= 0; --e) {
		let t = o[e][1];
		if (t === "" || t === "\r") s = e;
		else break;
	}
	if (s === 0) {
		let e = i.chomp === "+" && o.length > 0 ? "\n".repeat(Math.max(1, o.length - 1)) : "", n = r + i.length;
		return t.source && (n += t.source.length), {
			value: e,
			type: a,
			comment: i.comment,
			range: [
				r,
				n,
				n
			]
		};
	}
	let c = t.indent + i.indent, l = t.offset + i.length, u = 0;
	for (let t = 0; t < s; ++t) {
		let [r, a] = o[t];
		if (a === "" || a === "\r") i.indent === 0 && r.length > c && (c = r.length);
		else {
			r.length < c && n(l + r.length, "MISSING_CHAR", "Block scalars with more-indented leading empty lines must use an explicit indentation indicator"), i.indent === 0 && (c = r.length), u = t, c === 0 && !e.atRoot && n(l, "BAD_INDENT", "Block scalar values in collections must be indented");
			break;
		}
		l += r.length + a.length + 1;
	}
	for (let e = o.length - 1; e >= s; --e) o[e][0].length > c && (s = e + 1);
	let d = "", f = "", p = !1;
	for (let e = 0; e < u; ++e) d += o[e][0].slice(c) + "\n";
	for (let e = u; e < s; ++e) {
		let [t, r] = o[e];
		l += t.length + r.length + 1;
		let s = r[r.length - 1] === "\r";
		/* istanbul ignore if already caught in lexer */
		if (s && (r = r.slice(0, -1)), r && t.length < c) {
			let e = `Block scalar lines must not be less indented than their ${i.indent ? "explicit indentation indicator" : "first line"}`;
			n(l - r.length - (s ? 2 : 1), "BAD_INDENT", e), t = "";
		}
		a === O.BLOCK_LITERAL ? (d += f + t.slice(c) + r, f = "\n") : t.length > c || r[0] === "	" ? (f === " " ? f = "\n" : !p && f === "\n" && (f = "\n\n"), d += f + t.slice(c) + r, f = "\n", p = !0) : r === "" ? f === "\n" ? d += "\n" : f = "\n" : (d += f + r, f = " ", p = !1);
	}
	switch (i.chomp) {
		case "-": break;
		case "+":
			for (let e = s; e < o.length; ++e) d += "\n" + o[e][0].slice(c);
			d[d.length - 1] !== "\n" && (d += "\n");
			break;
		default: d += "\n";
	}
	let m = r + i.length + t.source.length;
	return {
		value: d,
		type: a,
		comment: i.comment,
		range: [
			r,
			m,
			m
		]
	};
}
function In({ offset: e, props: t }, n, r) {
	/* istanbul ignore if should not happen */
	if (t[0].type !== "block-scalar-header") return r(t[0], "IMPOSSIBLE", "Block scalar header not found"), null;
	let { source: i } = t[0], a = i[0], o = 0, s = "", c = -1;
	for (let t = 1; t < i.length; ++t) {
		let n = i[t];
		if (!s && (n === "-" || n === "+")) s = n;
		else {
			let r = Number(n);
			!o && r ? o = r : c === -1 && (c = e + t);
		}
	}
	c !== -1 && r(c, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${i}`);
	let l = !1, u = "", d = i.length;
	for (let e = 1; e < t.length; ++e) {
		let i = t[e];
		switch (i.type) {
			case "space": l = !0;
			case "newline":
				d += i.source.length;
				break;
			case "comment":
				n && !l && r(i, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters"), d += i.source.length, u = i.source.substring(1);
				break;
			case "error":
				r(i, "UNEXPECTED_TOKEN", i.message), d += i.source.length;
				break;
			/* istanbul ignore next should not happen */
			default: {
				r(i, "UNEXPECTED_TOKEN", `Unexpected token in block scalar header: ${i.type}`);
				let e = i.source;
				e && typeof e == "string" && (d += e.length);
			}
		}
	}
	return {
		mode: a,
		indent: o,
		chomp: s,
		comment: u,
		length: d
	};
}
function Ln(e) {
	let t = e.split(/\n( *)/), n = t[0], r = n.match(/^( *)/), i = [r?.[1] ? [r[1], n.slice(r[1].length)] : ["", n]];
	for (let e = 1; e < t.length; e += 2) i.push([t[e], t[e + 1]]);
	return i;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
function Rn(e, t, n) {
	let { offset: r, type: i, source: a, end: o } = e, s, c, l = (e, t, i) => n(r + e, t, i);
	switch (i) {
		case "scalar":
			s = O.PLAIN, c = zn(a, l);
			break;
		case "single-quoted-scalar":
			s = O.QUOTE_SINGLE, c = Bn(a, l);
			break;
		case "double-quoted-scalar":
			s = O.QUOTE_DOUBLE, c = Hn(a, l);
			break;
		/* istanbul ignore next should not happen */
		default: return n(e, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${i}`), {
			value: "",
			type: null,
			comment: "",
			range: [
				r,
				r + a.length,
				r + a.length
			]
		};
	}
	let u = r + a.length, d = kn(o, u, t, n);
	return {
		value: c,
		type: s,
		comment: d.comment,
		range: [
			r,
			u,
			d.offset
		]
	};
}
function zn(e, t) {
	let n = "";
	switch (e[0]) {
		/* istanbul ignore next should not happen */
		case "	":
			n = "a tab character";
			break;
		case ",":
			n = "flow indicator character ,";
			break;
		case "%":
			n = "directive indicator character %";
			break;
		case "|":
		case ">":
			n = `block scalar indicator ${e[0]}`;
			break;
		case "@":
		case "`": n = `reserved character ${e[0]}`;
	}
	return n && t(0, "BAD_SCALAR_START", `Plain value cannot start with ${n}`), Vn(e);
}
function Bn(e, t) {
	return (e[e.length - 1] !== "'" || e.length === 1) && t(e.length, "MISSING_CHAR", "Missing closing 'quote"), Vn(e.slice(1, -1)).replace(/''/g, "'");
}
function Vn(e) {
	let t = /(.*?)\r?\n/sy, n = t.exec(e);
	if (!n) return e;
	let r, i;
	try {
		r = /* @__PURE__ */ RegExp("(?<![ 	])[ 	]+$"), i = /* @__PURE__ */ RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
	} catch {
		r = /[ \t]+$/, i = /^[ \t]+|[ \t]+$/g;
	}
	let a = n[1].replace(r, ""), o = " ", s = t.lastIndex;
	for (; n = t.exec(e);) {
		let e = n[1].replace(i, "");
		e === "" ? o === "\n" ? a += o : o = "\n" : (a += o + e, o = " "), s = t.lastIndex;
	}
	let c = /[ \t]*(.*)/sy;
	return c.lastIndex = s, n = c.exec(e), a + o + (n?.[1] ?? "");
}
function Hn(e, t) {
	let n = "";
	for (let r = 1; r < e.length - 1; ++r) {
		let i = e[r];
		if (i !== "\r" || e[r + 1] !== "\n") {
			if (i === "\n") {
				let { fold: t, offset: i } = Un(e, r);
				n += t, r = i;
			} else if (i === "\\") {
				let i = e[++r], a = Wn[i];
				if (a) n += a;
				else if (i === "\n") for (i = e[r + 1]; i === " " || i === "	";) i = e[++r + 1];
				else if (i === "\r" && e[r + 1] === "\n") for (i = e[++r + 1]; i === " " || i === "	";) i = e[++r + 1];
				else if (i === "x" || i === "u" || i === "U") {
					let a = i === "x" ? 2 : i === "u" ? 4 : 8;
					n += Gn(e, r + 1, a, t), r += a;
				} else {
					let i = e.substr(r - 1, 2);
					t(r - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${i}`), n += i;
				}
			} else if (i === " " || i === "	") {
				let t = r, a = e[r + 1];
				for (; a === " " || a === "	";) a = e[++r + 1];
				a !== "\n" && (a !== "\r" || e[r + 2] !== "\n") && (n += r > t ? e.slice(t, r + 1) : i);
			} else n += i;
		}
	}
	return (e[e.length - 1] !== "\"" || e.length === 1) && t(e.length, "MISSING_CHAR", "Missing closing \"quote"), n;
}
function Un(e, t) {
	let n = "", r = e[t + 1];
	for (; (r === " " || r === "	" || r === "\n" || r === "\r") && (r !== "\r" || e[t + 2] === "\n");) r === "\n" && (n += "\n"), t += 1, r = e[t + 1];
	return n ||= " ", {
		fold: n,
		offset: t
	};
}
var Wn = {
	0: "\0",
	a: "\x07",
	b: "\b",
	e: "\x1B",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	",
	v: "\v",
	N: "",
	_: "\xA0",
	L: "\u2028",
	P: "\u2029",
	" ": " ",
	"\"": "\"",
	"/": "/",
	"\\": "\\",
	"	": "	"
};
function Gn(e, t, n, r) {
	let i = e.substr(t, n), a = i.length === n && /^[0-9a-fA-F]+$/.test(i) ? parseInt(i, 16) : NaN;
	try {
		return String.fromCodePoint(a);
	} catch {
		let i = e.substr(t - 2, n + 2);
		return r(t - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${i}`), i;
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-scalar.js
function Kn(e, t, n, r) {
	let { value: i, type: a, comment: o, range: s } = t.type === "block-scalar" ? Fn(e, t, r) : Rn(t, e.options.strict, r), c = n ? e.directives.tagName(n.source, (e) => r(n, "TAG_RESOLVE_FAILED", e)) : null, l;
	l = e.options.stringKeys && e.atKey ? e.schema[v] : c ? qn(e.schema, i, c, n, r) : t.type === "scalar" ? Jn(e, i, t, r) : e.schema[v];
	let u;
	try {
		let a = l.resolve(i, (e) => r(n ?? t, "TAG_RESOLVE_FAILED", e), e.options);
		u = w(a) ? a : new O(a);
	} catch (e) {
		let a = e instanceof Error ? e.message : String(e);
		r(n ?? t, "TAG_RESOLVE_FAILED", a), u = new O(i);
	}
	return u.range = s, u.source = i, a && (u.type = a), c && (u.tag = c), l.format && (u.format = l.format), o && (u.comment = o), u;
}
function qn(e, t, n, r, i) {
	if (n === "!") return e[v];
	let a = [];
	for (let t of e.tags) if (!t.collection && t.tag === n) {
		if (t.default && t.test) a.push(t);
		else return t;
	}
	for (let e of a) if (e.test?.test(t)) return e;
	let o = e.knownTags[n];
	return o && !o.collection ? (e.tags.push(Object.assign({}, o, {
		default: !1,
		test: void 0
	})), o) : (i(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${n}`, n !== "tag:yaml.org,2002:str"), e[v]);
}
function Jn({ atKey: e, directives: t, schema: n }, r, i, a) {
	let o = n.tags.find((t) => (t.default === !0 || e && t.default === "key") && t.test?.test(r)) || n[v];
	if (n.compat) {
		let e = n.compat.find((e) => e.default && e.test?.test(r)) ?? n[v];
		o.tag !== e.tag && a(i, "TAG_RESOLVE_FAILED", `Value may be parsed as either ${t.tagString(o.tag)} or ${t.tagString(e.tag)}`, !0);
	}
	return o;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
function Yn(e, t, n) {
	if (t) {
		n ??= t.length;
		for (let r = n - 1; r >= 0; --r) {
			let n = t[r];
			switch (n.type) {
				case "space":
				case "comment":
				case "newline":
					e -= n.source.length;
					continue;
			}
			for (n = t[++r]; n?.type === "space";) e += n.source.length, n = t[++r];
			break;
		}
	}
	return e;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-node.js
var Xn = {
	composeNode: Zn,
	composeEmptyNode: Qn
};
function Zn(e, t, n, r) {
	let i = e.atKey, { spaceBefore: a, comment: o, anchor: s, tag: c } = n, l, u = !0;
	switch (t.type) {
		case "alias":
			l = $n(e, t, r), (s || c) && r(t, "ALIAS_PROPS", "An alias node must not specify any properties");
			break;
		case "scalar":
		case "single-quoted-scalar":
		case "double-quoted-scalar":
		case "block-scalar":
			l = Kn(e, t, c, r), s && (l.anchor = s.source.substring(1));
			break;
		case "block-map":
		case "block-seq":
		case "flow-collection":
			try {
				l = Pn(Xn, e, t, n, r), s && (l.anchor = s.source.substring(1));
			} catch (e) {
				r(t, "RESOURCE_EXHAUSTION", e instanceof Error ? e.message : String(e));
			}
			break;
		default: r(t, "UNEXPECTED_TOKEN", t.type === "error" ? t.message : `Unsupported token (type: ${t.type})`), u = !1;
	}
	return l ??= Qn(e, t.offset, void 0, null, n, r), s && l.anchor === "" && r(s, "BAD_ALIAS", "Anchor cannot be an empty string"), i && e.options.stringKeys && (!w(l) || typeof l.value != "string" || l.tag && l.tag !== "tag:yaml.org,2002:str") && r(c ?? t, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), a && (l.spaceBefore = !0), o && (t.type === "scalar" && t.source === "" ? l.comment = o : l.commentBefore = o), e.options.keepSourceTokens && u && (l.srcToken = t), l;
}
function Qn(e, t, n, r, { spaceBefore: i, comment: a, anchor: o, tag: s, end: c }, l) {
	let u = Kn(e, {
		type: "scalar",
		offset: Yn(t, n, r),
		indent: -1,
		source: ""
	}, s, l);
	return o && (u.anchor = o.source.substring(1), u.anchor === "" && l(o, "BAD_ALIAS", "Anchor cannot be an empty string")), i && (u.spaceBefore = !0), a && (u.comment = a, u.range[2] = c), u;
}
function $n({ options: e }, { offset: t, source: n, end: r }, i) {
	let a = new be(n.substring(1));
	a.source === "" && i(t, "BAD_ALIAS", "Alias cannot be an empty string"), a.source.endsWith(":") && i(t + n.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
	let o = t + n.length, s = kn(r, o, e.strict, i);
	return a.range = [
		t,
		o,
		s.offset
	], s.comment && (a.comment = s.comment), a;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-doc.js
function er(e, t, { offset: n, start: r, value: i, end: a }, o) {
	let s = new gn(void 0, Object.assign({ _directives: t }, e)), c = {
		atKey: !1,
		atRoot: !0,
		directives: s.directives,
		options: s.options,
		schema: s.schema
	}, l = Sn(r, {
		indicator: "doc-start",
		next: i ?? a?.[0],
		offset: n,
		onError: o,
		parentIndent: 0,
		startOnNewline: !0
	});
	l.found && (s.directives.docStart = !0, i && (i.type === "block-map" || i.type === "block-seq") && !l.hasNewline && o(l.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), s.contents = i ? Zn(c, i, l, o) : Qn(c, l.end, r, null, l, o);
	let u = s.contents.range[2], d = kn(a, u, !1, o);
	return d.comment && (s.comment = d.comment), s.range = [
		n,
		u,
		d.offset
	], s;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/composer.js
function tr(e) {
	if (typeof e == "number") return [e, e + 1];
	if (Array.isArray(e)) return e.length === 2 ? e : [e[0], e[1]];
	let { offset: t, source: n } = e;
	return [t, t + (typeof n == "string" ? n.length : 1)];
}
function nr(e) {
	let t = "", n = !1, r = !1;
	for (let i = 0; i < e.length; ++i) {
		let a = e[i];
		switch (a[0]) {
			case "#":
				t += (t === "" ? "" : r ? "\n\n" : "\n") + (a.substring(1) || " "), n = !0, r = !1;
				break;
			case "%":
				e[i + 1]?.[0] !== "#" && (i += 1), n = !1;
				break;
			default: n || (r = !0), n = !1;
		}
	}
	return {
		comment: t,
		afterEmptyLine: r
	};
}
var rr = class {
	constructor(e = {}) {
		this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (e, t, n, r) => {
			let i = tr(e);
			r ? this.warnings.push(new bn(i, t, n)) : this.errors.push(new yn(i, t, n));
		}, this.directives = new pe({ version: e.version || "1.2" }), this.options = e;
	}
	decorate(e, t) {
		let { comment: n, afterEmptyLine: r } = nr(this.prelude);
		if (n) {
			let i = e.contents;
			if (t) e.comment = e.comment ? `${e.comment}\n${n}` : n;
			else if (r || e.directives.docStart || !i) e.commentBefore = n;
			else if (T(i) && !i.flow && i.items.length > 0) {
				let e = i.items[0];
				C(e) && (e = e.key);
				let t = e.commentBefore;
				e.commentBefore = t ? `${n}\n${t}` : n;
			} else {
				let e = i.commentBefore;
				i.commentBefore = e ? `${n}\n${e}` : n;
			}
		}
		if (t) {
			for (let t = 0; t < this.errors.length; ++t) e.errors.push(this.errors[t]);
			for (let t = 0; t < this.warnings.length; ++t) e.warnings.push(this.warnings[t]);
		} else e.errors = this.errors, e.warnings = this.warnings;
		this.prelude = [], this.errors = [], this.warnings = [];
	}
	streamInfo() {
		return {
			comment: nr(this.prelude).comment,
			directives: this.directives,
			errors: this.errors,
			warnings: this.warnings
		};
	}
	*compose(e, t = !1, n = -1) {
		for (let t of e) yield* this.next(t);
		yield* this.end(t, n);
	}
	*next(e) {
		switch (e.type) {
			case "directive":
				this.directives.add(e.source, (t, n, r) => {
					let i = tr(e);
					i[0] += t, this.onError(i, "BAD_DIRECTIVE", n, r);
				}), this.prelude.push(e.source), this.atDirectives = !0;
				break;
			case "document": {
				let t = er(this.options, this.directives, e, this.onError);
				this.atDirectives && !t.directives.docStart && this.onError(e, "MISSING_CHAR", "Missing directives-end/doc-start indicator line"), this.decorate(t, !1), this.doc && (yield this.doc), this.doc = t, this.atDirectives = !1;
				break;
			}
			case "byte-order-mark":
			case "space": break;
			case "comment":
			case "newline":
				this.prelude.push(e.source);
				break;
			case "error": {
				let t = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message, n = new yn(tr(e), "UNEXPECTED_TOKEN", t);
				this.atDirectives || !this.doc ? this.errors.push(n) : this.doc.errors.push(n);
				break;
			}
			case "doc-end": {
				if (!this.doc) {
					this.errors.push(new yn(tr(e), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
					break;
				}
				this.doc.directives.docEnd = !0;
				let t = kn(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
				if (this.decorate(this.doc, !0), t.comment) {
					let e = this.doc.comment;
					this.doc.comment = e ? `${e}\n${t.comment}` : t.comment;
				}
				this.doc.range[2] = t.offset;
				break;
			}
			default: this.errors.push(new yn(tr(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
		}
	}
	*end(e = !1, t = -1) {
		if (this.doc) this.decorate(this.doc, !0), yield this.doc, this.doc = null;
		else if (e) {
			let e = new gn(void 0, Object.assign({ _directives: this.directives }, this.options));
			this.atDirectives && this.onError(t, "MISSING_CHAR", "Missing directives-end indicator line"), e.range = [
				0,
				t,
				t
			], this.decorate(e, !1), yield e;
		}
	}
}, ir = Symbol("break visit"), ar = Symbol("skip children"), or = Symbol("remove item");
function sr(e, t) {
	"type" in e && e.type === "document" && (e = {
		start: e.start,
		value: e.value
	}), cr(Object.freeze([]), e, t);
}
sr.BREAK = ir, sr.SKIP = ar, sr.REMOVE = or, sr.itemAtPath = (e, t) => {
	let n = e;
	for (let [e, r] of t) {
		let t = n?.[e];
		if (t && "items" in t) n = t.items[r];
		else return;
	}
	return n;
}, sr.parentCollection = (e, t) => {
	let n = sr.itemAtPath(e, t.slice(0, -1)), r = t[t.length - 1][0], i = n?.[r];
	if (i && "items" in i) return i;
	throw Error("Parent collection not found");
};
function cr(e, t, n) {
	let r = n(t, e);
	if (typeof r == "symbol") return r;
	for (let i of ["key", "value"]) {
		let a = t[i];
		if (a && "items" in a) {
			for (let t = 0; t < a.items.length; ++t) {
				let r = cr(Object.freeze(e.concat([[i, t]])), a.items[t], n);
				if (typeof r == "number") t = r - 1;
				else if (r === ir) return ir;
				else r === or && (a.items.splice(t, 1), --t);
			}
			typeof r == "function" && i === "key" && (r = r(t, e));
		}
	}
	return typeof r == "function" ? r(t, e) : r;
}
function lr(e) {
	switch (e) {
		case "﻿": return "byte-order-mark";
		case "": return "doc-mode";
		case "": return "flow-error-end";
		case "": return "scalar";
		case "---": return "doc-start";
		case "...": return "doc-end";
		case "":
		case "\n":
		case "\r\n": return "newline";
		case "-": return "seq-item-ind";
		case "?": return "explicit-key-ind";
		case ":": return "map-value-ind";
		case "{": return "flow-map-start";
		case "}": return "flow-map-end";
		case "[": return "flow-seq-start";
		case "]": return "flow-seq-end";
		case ",": return "comma";
	}
	switch (e[0]) {
		case " ":
		case "	": return "space";
		case "#": return "comment";
		case "%": return "directive-line";
		case "*": return "alias";
		case "&": return "anchor";
		case "!": return "tag";
		case "'": return "single-quoted-scalar";
		case "\"": return "double-quoted-scalar";
		case "|":
		case ">": return "block-scalar-header";
	}
	return null;
}
//#endregion
//#region node_modules/yaml/browser/dist/parse/lexer.js
function ur(e) {
	switch (e) {
		case void 0:
		case " ":
		case "\n":
		case "\r":
		case "	": return !0;
		default: return !1;
	}
}
var dr = /* @__PURE__ */ new Set("0123456789ABCDEFabcdef"), fr = /* @__PURE__ */ new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), pr = /* @__PURE__ */ new Set(",[]{}"), mr = /* @__PURE__ */ new Set(" ,[]{}\n\r	"), hr = (e) => !e || mr.has(e), gr = class {
	constructor() {
		this.atEnd = !1, this.blockScalarIndent = -1, this.blockScalarKeep = !1, this.buffer = "", this.flowKey = !1, this.flowLevel = 0, this.indentNext = 0, this.indentValue = 0, this.lineEndPos = null, this.next = null, this.pos = 0;
	}
	*lex(e, t = !1) {
		if (e) {
			if (typeof e != "string") throw TypeError("source is not a string");
			this.buffer = this.buffer ? this.buffer + e : e, this.lineEndPos = null;
		}
		this.atEnd = !t;
		let n = this.next ?? "stream";
		for (; n && (t || this.hasChars(1));) n = yield* this.parseNext(n);
	}
	atLineEnd() {
		let e = this.pos, t = this.buffer[e];
		for (; t === " " || t === "	";) t = this.buffer[++e];
		return !t || t === "#" || t === "\n" || t === "\r" && this.buffer[e + 1] === "\n";
	}
	charAt(e) {
		return this.buffer[this.pos + e];
	}
	continueScalar(e) {
		let t = this.buffer[e];
		if (this.indentNext > 0) {
			let n = 0;
			for (; t === " ";) t = this.buffer[++n + e];
			if (t === "\r") {
				let t = this.buffer[n + e + 1];
				if (t === "\n" || !t && !this.atEnd) return e + n + 1;
			}
			return t === "\n" || n >= this.indentNext || !t && !this.atEnd ? e + n : -1;
		}
		if (t === "-" || t === ".") {
			let t = this.buffer.substr(e, 3);
			if ((t === "---" || t === "...") && ur(this.buffer[e + 3])) return -1;
		}
		return e;
	}
	getLine() {
		let e = this.lineEndPos;
		return (typeof e != "number" || e !== -1 && e < this.pos) && (e = this.buffer.indexOf("\n", this.pos), this.lineEndPos = e), e === -1 ? this.atEnd ? this.buffer.substring(this.pos) : null : (this.buffer[e - 1] === "\r" && --e, this.buffer.substring(this.pos, e));
	}
	hasChars(e) {
		return this.pos + e <= this.buffer.length;
	}
	setNext(e) {
		return this.buffer = this.buffer.substring(this.pos), this.pos = 0, this.lineEndPos = null, this.next = e, null;
	}
	peek(e) {
		return this.buffer.substr(this.pos, e);
	}
	*parseNext(e) {
		switch (e) {
			case "stream": return yield* this.parseStream();
			case "line-start": return yield* this.parseLineStart();
			case "block-start": return yield* this.parseBlockStart();
			case "doc": return yield* this.parseDocument();
			case "flow": return yield* this.parseFlowCollection();
			case "quoted-scalar": return yield* this.parseQuotedScalar();
			case "block-scalar": return yield* this.parseBlockScalar();
			case "plain-scalar": return yield* this.parsePlainScalar();
		}
	}
	*parseStream() {
		let e = this.getLine();
		if (e === null) return this.setNext("stream");
		if (e[0] === "﻿" && (yield* this.pushCount(1), e = e.substring(1)), e[0] === "%") {
			let t = e.length, n = e.indexOf("#");
			for (; n !== -1;) {
				let r = e[n - 1];
				if (r === " " || r === "	") {
					t = n - 1;
					break;
				}
				n = e.indexOf("#", n + 1);
			}
			for (;;) {
				let n = e[t - 1];
				if (n === " " || n === "	") --t;
				else break;
			}
			let r = (yield* this.pushCount(t)) + (yield* this.pushSpaces(!0));
			return yield* this.pushCount(e.length - r), this.pushNewline(), "stream";
		}
		if (this.atLineEnd()) {
			let t = yield* this.pushSpaces(!0);
			return yield* this.pushCount(e.length - t), yield* this.pushNewline(), "stream";
		}
		return yield "", yield* this.parseLineStart();
	}
	*parseLineStart() {
		let e = this.charAt(0);
		if (!e && !this.atEnd) return this.setNext("line-start");
		if (e === "-" || e === ".") {
			if (!this.atEnd && !this.hasChars(4)) return this.setNext("line-start");
			let e = this.peek(3);
			if ((e === "---" || e === "...") && ur(this.charAt(3))) return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, e === "---" ? "doc" : "stream";
		}
		return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !ur(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
	}
	*parseBlockStart() {
		let [e, t] = this.peek(2);
		if (!t && !this.atEnd) return this.setNext("block-start");
		if ((e === "-" || e === "?" || e === ":") && ur(t)) {
			let e = (yield* this.pushCount(1)) + (yield* this.pushSpaces(!0));
			return this.indentNext = this.indentValue + 1, this.indentValue += e, "block-start";
		}
		return "doc";
	}
	*parseDocument() {
		yield* this.pushSpaces(!0);
		let e = this.getLine();
		if (e === null) return this.setNext("doc");
		let t = yield* this.pushIndicators();
		switch (e[t]) {
			case "#": yield* this.pushCount(e.length - t);
			case void 0: return yield* this.pushNewline(), yield* this.parseLineStart();
			case "{":
			case "[": return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel = 1, "flow";
			case "}":
			case "]": return yield* this.pushCount(1), "doc";
			case "*": return yield* this.pushUntil(hr), "doc";
			case "\"":
			case "'": return yield* this.parseQuotedScalar();
			case "|":
			case ">": return t += yield* this.parseBlockScalarHeader(), t += yield* this.pushSpaces(!0), yield* this.pushCount(e.length - t), yield* this.pushNewline(), yield* this.parseBlockScalar();
			default: return yield* this.parsePlainScalar();
		}
	}
	*parseFlowCollection() {
		let e, t, n = -1;
		do
			e = yield* this.pushNewline(), e > 0 ? (t = yield* this.pushSpaces(!1), this.indentValue = n = t) : t = 0, t += yield* this.pushSpaces(!0);
		while (e + t > 0);
		let r = this.getLine();
		if (r === null) return this.setNext("flow");
		if ((n !== -1 && n < this.indentNext && r[0] !== "#" || n === 0 && (r.startsWith("---") || r.startsWith("...")) && ur(r[3])) && (n !== this.indentNext - 1 || this.flowLevel !== 1 || r[0] !== "]" && r[0] !== "}")) return this.flowLevel = 0, yield "", yield* this.parseLineStart();
		let i = 0;
		for (; r[i] === ",";) i += yield* this.pushCount(1), i += yield* this.pushSpaces(!0), this.flowKey = !1;
		switch (i += yield* this.pushIndicators(), r[i]) {
			case void 0: return "flow";
			case "#": return yield* this.pushCount(r.length - i), "flow";
			case "{":
			case "[": return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
			case "}":
			case "]": return yield* this.pushCount(1), this.flowKey = !0, --this.flowLevel, this.flowLevel ? "flow" : "doc";
			case "*": return yield* this.pushUntil(hr), "flow";
			case "\"":
			case "'": return this.flowKey = !0, yield* this.parseQuotedScalar();
			case ":": {
				let e = this.charAt(1);
				if (this.flowKey || ur(e) || e === ",") return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
			}
			default: return this.flowKey = !1, yield* this.parsePlainScalar();
		}
	}
	*parseQuotedScalar() {
		let e = this.charAt(0), t = this.buffer.indexOf(e, this.pos + 1);
		if (e === "'") for (; t !== -1 && this.buffer[t + 1] === "'";) t = this.buffer.indexOf("'", t + 2);
		else for (; t !== -1;) {
			let e = 0;
			for (; this.buffer[t - 1 - e] === "\\";) e += 1;
			if (e % 2 == 0) break;
			t = this.buffer.indexOf("\"", t + 1);
		}
		let n = this.buffer.substring(0, t), r = n.indexOf("\n", this.pos);
		if (r !== -1) {
			for (; r !== -1;) {
				let e = this.continueScalar(r + 1);
				if (e === -1) break;
				r = n.indexOf("\n", e);
			}
			r !== -1 && (t = r - (n[r - 1] === "\r" ? 2 : 1));
		}
		if (t === -1) {
			if (!this.atEnd) return this.setNext("quoted-scalar");
			t = this.buffer.length;
		}
		return yield* this.pushToIndex(t + 1, !1), this.flowLevel ? "flow" : "doc";
	}
	*parseBlockScalarHeader() {
		this.blockScalarIndent = -1, this.blockScalarKeep = !1;
		let e = this.pos;
		for (;;) {
			let t = this.buffer[++e];
			if (t === "+") this.blockScalarKeep = !0;
			else if (t > "0" && t <= "9") this.blockScalarIndent = Number(t) - 1;
			else if (t !== "-") break;
		}
		return yield* this.pushUntil((e) => ur(e) || e === "#");
	}
	*parseBlockScalar() {
		let e = this.pos - 1, t = 0, n;
		loop: for (let r = this.pos; n = this.buffer[r]; ++r) switch (n) {
			case " ":
				t += 1;
				break;
			case "\n":
				e = r, t = 0;
				break;
			case "\r": {
				let e = this.buffer[r + 1];
				if (!e && !this.atEnd) return this.setNext("block-scalar");
				if (e === "\n") break;
			}
			default: break loop;
		}
		if (!n && !this.atEnd) return this.setNext("block-scalar");
		if (t >= this.indentNext) {
			this.indentNext = this.blockScalarIndent === -1 ? t : this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
			do {
				let t = this.continueScalar(e + 1);
				if (t === -1) break;
				e = this.buffer.indexOf("\n", t);
			} while (e !== -1);
			if (e === -1) {
				if (!this.atEnd) return this.setNext("block-scalar");
				e = this.buffer.length;
			}
		}
		let r = e + 1;
		for (n = this.buffer[r]; n === " ";) n = this.buffer[++r];
		if (n === "	") {
			for (; n === "	" || n === " " || n === "\r" || n === "\n";) n = this.buffer[++r];
			e = r - 1;
		} else if (!this.blockScalarKeep) do {
			let n = e - 1, r = this.buffer[n];
			r === "\r" && (r = this.buffer[--n]);
			let i = n;
			for (; r === " ";) r = this.buffer[--n];
			if (r === "\n" && n >= this.pos && n + 1 + t > i) e = n;
			else break;
		} while (!0);
		return yield "", yield* this.pushToIndex(e + 1, !0), yield* this.parseLineStart();
	}
	*parsePlainScalar() {
		let e = this.flowLevel > 0, t = this.pos - 1, n = this.pos - 1, r;
		for (; r = this.buffer[++n];) if (r === ":") {
			let r = this.buffer[n + 1];
			if (ur(r) || e && pr.has(r)) break;
			t = n;
		} else if (ur(r)) {
			let i = this.buffer[n + 1];
			if (r === "\r" && (i === "\n" ? (n += 1, r = "\n", i = this.buffer[n + 1]) : t = n), i === "#" || e && pr.has(i)) break;
			if (r === "\n") {
				let e = this.continueScalar(n + 1);
				if (e === -1) break;
				n = Math.max(n, e - 2);
			}
		} else {
			if (e && pr.has(r)) break;
			t = n;
		}
		return !r && !this.atEnd ? this.setNext("plain-scalar") : (yield "", yield* this.pushToIndex(t + 1, !0), e ? "flow" : "doc");
	}
	*pushCount(e) {
		return e > 0 ? (yield this.buffer.substr(this.pos, e), this.pos += e, e) : 0;
	}
	*pushToIndex(e, t) {
		let n = this.buffer.slice(this.pos, e);
		return n ? (yield n, this.pos += n.length, n.length) : (t && (yield ""), 0);
	}
	*pushIndicators() {
		let e = 0;
		loop: for (;;) {
			switch (this.charAt(0)) {
				case "!":
					e += yield* this.pushTag(), e += yield* this.pushSpaces(!0);
					continue loop;
				case "&":
					e += yield* this.pushUntil(hr), e += yield* this.pushSpaces(!0);
					continue loop;
				case "-":
				case "?":
				case ":": {
					let t = this.flowLevel > 0, n = this.charAt(1);
					if (ur(n) || t && pr.has(n)) {
						t ? this.flowKey &&= !1 : this.indentNext = this.indentValue + 1, e += yield* this.pushCount(1), e += yield* this.pushSpaces(!0);
						continue loop;
					}
				}
			}
			break loop;
		}
		return e;
	}
	*pushTag() {
		if (this.charAt(1) === "<") {
			let e = this.pos + 2, t = this.buffer[e];
			for (; !ur(t) && t !== ">";) t = this.buffer[++e];
			return yield* this.pushToIndex(t === ">" ? e + 1 : e, !1);
		}
		{
			let e = this.pos + 1, t = this.buffer[e];
			for (; t;) if (fr.has(t)) t = this.buffer[++e];
			else if (t === "%" && dr.has(this.buffer[e + 1]) && dr.has(this.buffer[e + 2])) t = this.buffer[e += 3];
			else break;
			return yield* this.pushToIndex(e, !1);
		}
	}
	*pushNewline() {
		let e = this.buffer[this.pos];
		return e === "\n" ? yield* this.pushCount(1) : e === "\r" && this.charAt(1) === "\n" ? yield* this.pushCount(2) : 0;
	}
	*pushSpaces(e) {
		let t = this.pos - 1, n;
		do
			n = this.buffer[++t];
		while (n === " " || e && n === "	");
		let r = t - this.pos;
		return r > 0 && (yield this.buffer.substr(this.pos, r), this.pos = t), r;
	}
	*pushUntil(e) {
		let t = this.pos, n = this.buffer[t];
		for (; !e(n);) n = this.buffer[++t];
		return yield* this.pushToIndex(t, !1);
	}
}, _r = class {
	constructor() {
		this.lineStarts = [], this.addNewLine = (e) => this.lineStarts.push(e), this.linePos = (e) => {
			let t = 0, n = this.lineStarts.length;
			for (; t < n;) {
				let r = t + n >> 1;
				this.lineStarts[r] < e ? t = r + 1 : n = r;
			}
			if (this.lineStarts[t] === e) return {
				line: t + 1,
				col: 1
			};
			if (t === 0) return {
				line: 0,
				col: e
			};
			let r = this.lineStarts[t - 1];
			return {
				line: t,
				col: e - r + 1
			};
		};
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/parse/parser.js
function vr(e, t) {
	for (let n = 0; n < e.length; ++n) if (e[n].type === t) return !0;
	return !1;
}
function yr(e) {
	for (let t = 0; t < e.length; ++t) switch (e[t].type) {
		case "space":
		case "comment":
		case "newline": break;
		default: return t;
	}
	return -1;
}
function br(e) {
	switch (e?.type) {
		case "alias":
		case "scalar":
		case "single-quoted-scalar":
		case "double-quoted-scalar":
		case "flow-collection": return !0;
		default: return !1;
	}
}
function xr(e) {
	switch (e.type) {
		case "document": return e.start;
		case "block-map": {
			let t = e.items[e.items.length - 1];
			return t.sep ?? t.start;
		}
		case "block-seq": return e.items[e.items.length - 1].start;
		/* istanbul ignore next should not happen */
		default: return [];
	}
}
function Sr(e) {
	if (e.length === 0) return [];
	let t = e.length;
	loop: for (; --t >= 0;) switch (e[t].type) {
		case "doc-start":
		case "explicit-key-ind":
		case "map-value-ind":
		case "seq-item-ind":
		case "newline": break loop;
	}
	for (; e[++t]?.type === "space";);
	return e.splice(t, e.length);
}
function Cr(e, t) {
	if (t.length < 1e5) Array.prototype.push.apply(e, t);
	else for (let n = 0; n < t.length; ++n) e.push(t[n]);
}
function wr(e) {
	if (e.start.type === "flow-seq-start") for (let t of e.items) t.sep && !t.value && !vr(t.start, "explicit-key-ind") && !vr(t.sep, "map-value-ind") && (t.key && (t.value = t.key), delete t.key, br(t.value) ? t.value.end ? Cr(t.value.end, t.sep) : t.value.end = t.sep : Cr(t.start, t.sep), delete t.sep);
}
var Tr = class {
	constructor(e) {
		this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new gr(), this.onNewLine = e;
	}
	*parse(e, t = !1) {
		this.onNewLine && this.offset === 0 && this.onNewLine(0);
		for (let n of this.lexer.lex(e, t)) yield* this.next(n);
		t || (yield* this.end());
	}
	*next(e) {
		if (this.source = e, this.atScalar) {
			this.atScalar = !1, yield* this.step(), this.offset += e.length;
			return;
		}
		let t = lr(e);
		if (!t) {
			let t = `Not a YAML token: ${e}`;
			yield* this.pop({
				type: "error",
				offset: this.offset,
				message: t,
				source: e
			}), this.offset += e.length;
		} else if (t === "scalar") this.atNewLine = !1, this.atScalar = !0, this.type = "scalar";
		else {
			switch (this.type = t, yield* this.step(), t) {
				case "newline":
					this.atNewLine = !0, this.indent = 0, this.onNewLine && this.onNewLine(this.offset + e.length);
					break;
				case "space":
					this.atNewLine && e[0] === " " && (this.indent += e.length);
					break;
				case "explicit-key-ind":
				case "map-value-ind":
				case "seq-item-ind":
					this.atNewLine && (this.indent += e.length);
					break;
				case "doc-mode":
				case "flow-error-end": return;
				default: this.atNewLine = !1;
			}
			this.offset += e.length;
		}
	}
	*end() {
		for (; this.stack.length > 0;) yield* this.pop();
	}
	get sourceToken() {
		return {
			type: this.type,
			offset: this.offset,
			indent: this.indent,
			source: this.source
		};
	}
	*step() {
		let e = this.peek(1);
		if (this.type === "doc-end" && e?.type !== "doc-end") {
			for (; this.stack.length > 0;) yield* this.pop();
			this.stack.push({
				type: "doc-end",
				offset: this.offset,
				source: this.source
			});
			return;
		}
		if (!e) return yield* this.stream();
		switch (e.type) {
			case "document": return yield* this.document(e);
			case "alias":
			case "scalar":
			case "single-quoted-scalar":
			case "double-quoted-scalar": return yield* this.scalar(e);
			case "block-scalar": return yield* this.blockScalar(e);
			case "block-map": return yield* this.blockMap(e);
			case "block-seq": return yield* this.blockSequence(e);
			case "flow-collection": return yield* this.flowCollection(e);
			case "doc-end": return yield* this.documentEnd(e);
		}
		/* istanbul ignore next should not happen */
		yield* this.pop();
	}
	peek(e) {
		return this.stack[this.stack.length - e];
	}
	*pop(e) {
		let t = e ?? this.stack.pop();
		/* istanbul ignore if should not happen */
		if (!t) yield {
			type: "error",
			offset: this.offset,
			source: "",
			message: "Tried to pop an empty stack"
		};
		else if (this.stack.length === 0) yield t;
		else {
			let e = this.peek(1);
			switch (t.type === "block-scalar" ? t.indent = "indent" in e ? e.indent : 0 : t.type === "flow-collection" && e.type === "document" && (t.indent = 0), t.type === "flow-collection" && wr(t), e.type) {
				case "document":
					e.value = t;
					break;
				case "block-scalar":
					e.props.push(t);
					break;
				case "block-map": {
					let n = e.items[e.items.length - 1];
					if (n.value) {
						e.items.push({
							start: [],
							key: t,
							sep: []
						}), this.onKeyLine = !0;
						return;
					}
					if (n.sep) n.value = t;
					else {
						Object.assign(n, {
							key: t,
							sep: []
						}), this.onKeyLine = !n.explicitKey;
						return;
					}
					break;
				}
				case "block-seq": {
					let n = e.items[e.items.length - 1];
					n.value ? e.items.push({
						start: [],
						value: t
					}) : n.value = t;
					break;
				}
				case "flow-collection": {
					let n = e.items[e.items.length - 1];
					!n || n.value ? e.items.push({
						start: [],
						key: t,
						sep: []
					}) : n.sep ? n.value = t : Object.assign(n, {
						key: t,
						sep: []
					});
					return;
				}
				/* istanbul ignore next should not happen */
				default: yield* this.pop(), yield* this.pop(t);
			}
			if ((e.type === "document" || e.type === "block-map" || e.type === "block-seq") && (t.type === "block-map" || t.type === "block-seq")) {
				let n = t.items[t.items.length - 1];
				n && !n.sep && !n.value && n.start.length > 0 && yr(n.start) === -1 && (t.indent === 0 || n.start.every((e) => e.type !== "comment" || e.indent < t.indent)) && (e.type === "document" ? e.end = n.start : e.items.push({ start: n.start }), t.items.splice(-1, 1));
			}
		}
	}
	*stream() {
		switch (this.type) {
			case "directive-line":
				yield {
					type: "directive",
					offset: this.offset,
					source: this.source
				};
				return;
			case "byte-order-mark":
			case "space":
			case "comment":
			case "newline":
				yield this.sourceToken;
				return;
			case "doc-mode":
			case "doc-start": {
				let e = {
					type: "document",
					offset: this.offset,
					start: []
				};
				this.type === "doc-start" && e.start.push(this.sourceToken), this.stack.push(e);
				return;
			}
		}
		yield {
			type: "error",
			offset: this.offset,
			message: `Unexpected ${this.type} token in YAML stream`,
			source: this.source
		};
	}
	*document(e) {
		if (e.value) return yield* this.lineEnd(e);
		switch (this.type) {
			case "doc-start":
				yr(e.start) === -1 ? e.start.push(this.sourceToken) : (yield* this.pop(), yield* this.step());
				return;
			case "anchor":
			case "tag":
			case "space":
			case "comment":
			case "newline":
				e.start.push(this.sourceToken);
				return;
		}
		let t = this.startBlockValue(e);
		t ? this.stack.push(t) : yield {
			type: "error",
			offset: this.offset,
			message: `Unexpected ${this.type} token in YAML document`,
			source: this.source
		};
	}
	*scalar(e) {
		if (this.type === "map-value-ind") {
			let t = Sr(xr(this.peek(2))), n;
			e.end ? (n = e.end, n.push(this.sourceToken), delete e.end) : n = [this.sourceToken];
			let r = {
				type: "block-map",
				offset: e.offset,
				indent: e.indent,
				items: [{
					start: t,
					key: e,
					sep: n
				}]
			};
			this.onKeyLine = !0, this.stack[this.stack.length - 1] = r;
		} else yield* this.lineEnd(e);
	}
	*blockScalar(e) {
		switch (this.type) {
			case "space":
			case "comment":
			case "newline":
				e.props.push(this.sourceToken);
				return;
			case "scalar":
				if (e.source = this.source, this.atNewLine = !0, this.indent = 0, this.onNewLine) {
					let e = this.source.indexOf("\n") + 1;
					for (; e !== 0;) this.onNewLine(this.offset + e), e = this.source.indexOf("\n", e) + 1;
				}
				yield* this.pop();
				break;
			/* istanbul ignore next should not happen */
			default: yield* this.pop(), yield* this.step();
		}
	}
	*blockMap(e) {
		let t = e.items[e.items.length - 1];
		switch (this.type) {
			case "newline":
				if (this.onKeyLine = !1, t.value) {
					let n = "end" in t.value ? t.value.end : void 0;
					(Array.isArray(n) ? n[n.length - 1] : void 0)?.type === "comment" ? n?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
				} else t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
				return;
			case "space":
			case "comment":
				if (t.value) e.items.push({ start: [this.sourceToken] });
				else if (t.sep) t.sep.push(this.sourceToken);
				else {
					if (this.atIndentedComment(t.start, e.indent)) {
						let n = e.items[e.items.length - 2]?.value?.end;
						if (Array.isArray(n)) {
							Cr(n, t.start), n.push(this.sourceToken), e.items.pop();
							return;
						}
					}
					t.start.push(this.sourceToken);
				}
				return;
		}
		if (this.indent >= e.indent) {
			let n = !this.onKeyLine && this.indent === e.indent, r = n && (t.sep || t.explicitKey) && this.type !== "seq-item-ind", i = [];
			if (r && t.sep && !t.value) {
				let n = [];
				for (let r = 0; r < t.sep.length; ++r) {
					let i = t.sep[r];
					switch (i.type) {
						case "newline":
							n.push(r);
							break;
						case "space": break;
						case "comment":
							i.indent > e.indent && (n.length = 0);
							break;
						default: n.length = 0;
					}
				}
				n.length >= 2 && (i = t.sep.splice(n[1]));
			}
			switch (this.type) {
				case "anchor":
				case "tag":
					r || t.value ? (i.push(this.sourceToken), e.items.push({ start: i }), this.onKeyLine = !0) : t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
					return;
				case "explicit-key-ind":
					!t.sep && !t.explicitKey ? (t.start.push(this.sourceToken), t.explicitKey = !0) : r || t.value ? (i.push(this.sourceToken), e.items.push({
						start: i,
						explicitKey: !0
					})) : this.stack.push({
						type: "block-map",
						offset: this.offset,
						indent: this.indent,
						items: [{
							start: [this.sourceToken],
							explicitKey: !0
						}]
					}), this.onKeyLine = !0;
					return;
				case "map-value-ind":
					if (t.explicitKey) {
						if (!t.sep) {
							if (vr(t.start, "newline")) Object.assign(t, {
								key: null,
								sep: [this.sourceToken]
							});
							else {
								let e = Sr(t.start);
								this.stack.push({
									type: "block-map",
									offset: this.offset,
									indent: this.indent,
									items: [{
										start: e,
										key: null,
										sep: [this.sourceToken]
									}]
								});
							}
						} else if (t.value) e.items.push({
							start: [],
							key: null,
							sep: [this.sourceToken]
						});
						else if (vr(t.sep, "map-value-ind")) this.stack.push({
							type: "block-map",
							offset: this.offset,
							indent: this.indent,
							items: [{
								start: i,
								key: null,
								sep: [this.sourceToken]
							}]
						});
						else if (br(t.key) && !vr(t.sep, "newline")) {
							let e = Sr(t.start), n = t.key, r = t.sep;
							r.push(this.sourceToken), delete t.key, delete t.sep, this.stack.push({
								type: "block-map",
								offset: this.offset,
								indent: this.indent,
								items: [{
									start: e,
									key: n,
									sep: r
								}]
							});
						} else i.length > 0 ? t.sep = t.sep.concat(i, this.sourceToken) : t.sep.push(this.sourceToken);
					} else t.sep ? t.value || r ? e.items.push({
						start: i,
						key: null,
						sep: [this.sourceToken]
					}) : vr(t.sep, "map-value-ind") ? this.stack.push({
						type: "block-map",
						offset: this.offset,
						indent: this.indent,
						items: [{
							start: [],
							key: null,
							sep: [this.sourceToken]
						}]
					}) : t.sep.push(this.sourceToken) : Object.assign(t, {
						key: null,
						sep: [this.sourceToken]
					});
					this.onKeyLine = !0;
					return;
				case "alias":
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar": {
					let n = this.flowScalar(this.type);
					r || t.value ? (e.items.push({
						start: i,
						key: n,
						sep: []
					}), this.onKeyLine = !0) : t.sep ? this.stack.push(n) : (Object.assign(t, {
						key: n,
						sep: []
					}), this.onKeyLine = !0);
					return;
				}
				default: {
					let r = this.startBlockValue(e);
					if (r) {
						if (r.type === "block-seq") {
							if (!t.explicitKey && t.sep && !vr(t.sep, "newline")) {
								yield* this.pop({
									type: "error",
									offset: this.offset,
									message: "Unexpected block-seq-ind on same line with key",
									source: this.source
								});
								return;
							}
						} else n && e.items.push({ start: i });
						this.stack.push(r);
						return;
					}
				}
			}
		}
		yield* this.pop(), yield* this.step();
	}
	*blockSequence(e) {
		let t = e.items[e.items.length - 1];
		switch (this.type) {
			case "newline":
				if (t.value) {
					let n = "end" in t.value ? t.value.end : void 0;
					(Array.isArray(n) ? n[n.length - 1] : void 0)?.type === "comment" ? n?.push(this.sourceToken) : e.items.push({ start: [this.sourceToken] });
				} else t.start.push(this.sourceToken);
				return;
			case "space":
			case "comment":
				if (t.value) e.items.push({ start: [this.sourceToken] });
				else {
					if (this.atIndentedComment(t.start, e.indent)) {
						let n = e.items[e.items.length - 2]?.value?.end;
						if (Array.isArray(n)) {
							Cr(n, t.start), n.push(this.sourceToken), e.items.pop();
							return;
						}
					}
					t.start.push(this.sourceToken);
				}
				return;
			case "anchor":
			case "tag":
				if (t.value || this.indent <= e.indent) break;
				t.start.push(this.sourceToken);
				return;
			case "seq-item-ind":
				if (this.indent !== e.indent) break;
				t.value || vr(t.start, "seq-item-ind") ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
				return;
		}
		if (this.indent > e.indent) {
			let t = this.startBlockValue(e);
			if (t) {
				this.stack.push(t);
				return;
			}
		}
		yield* this.pop(), yield* this.step();
	}
	*flowCollection(e) {
		let t = e.items[e.items.length - 1];
		if (this.type === "flow-error-end") {
			let e;
			do
				yield* this.pop(), e = this.peek(1);
			while (e?.type === "flow-collection");
		} else if (e.end.length === 0) {
			switch (this.type) {
				case "comma":
				case "explicit-key-ind":
					!t || t.sep ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
					return;
				case "map-value-ind":
					!t || t.value ? e.items.push({
						start: [],
						key: null,
						sep: [this.sourceToken]
					}) : t.sep ? t.sep.push(this.sourceToken) : Object.assign(t, {
						key: null,
						sep: [this.sourceToken]
					});
					return;
				case "space":
				case "comment":
				case "newline":
				case "anchor":
				case "tag":
					!t || t.value ? e.items.push({ start: [this.sourceToken] }) : t.sep ? t.sep.push(this.sourceToken) : t.start.push(this.sourceToken);
					return;
				case "alias":
				case "scalar":
				case "single-quoted-scalar":
				case "double-quoted-scalar": {
					let n = this.flowScalar(this.type);
					!t || t.value ? e.items.push({
						start: [],
						key: n,
						sep: []
					}) : t.sep ? this.stack.push(n) : Object.assign(t, {
						key: n,
						sep: []
					});
					return;
				}
				case "flow-map-end":
				case "flow-seq-end":
					e.end.push(this.sourceToken);
					return;
			}
			let n = this.startBlockValue(e);
			/* istanbul ignore else should not happen */
			n ? this.stack.push(n) : (yield* this.pop(), yield* this.step());
		} else {
			let t = this.peek(2);
			if (t.type === "block-map" && (this.type === "map-value-ind" && t.indent === e.indent || this.type === "newline" && !t.items[t.items.length - 1].sep)) yield* this.pop(), yield* this.step();
			else if (this.type === "map-value-ind" && t.type !== "flow-collection") {
				let n = Sr(xr(t));
				wr(e);
				let r = e.end.splice(1, e.end.length);
				r.push(this.sourceToken);
				let i = {
					type: "block-map",
					offset: e.offset,
					indent: e.indent,
					items: [{
						start: n,
						key: e,
						sep: r
					}]
				};
				this.onKeyLine = !0, this.stack[this.stack.length - 1] = i;
			} else yield* this.lineEnd(e);
		}
	}
	flowScalar(e) {
		if (this.onNewLine) {
			let e = this.source.indexOf("\n") + 1;
			for (; e !== 0;) this.onNewLine(this.offset + e), e = this.source.indexOf("\n", e) + 1;
		}
		return {
			type: e,
			offset: this.offset,
			indent: this.indent,
			source: this.source
		};
	}
	startBlockValue(e) {
		switch (this.type) {
			case "alias":
			case "scalar":
			case "single-quoted-scalar":
			case "double-quoted-scalar": return this.flowScalar(this.type);
			case "block-scalar-header": return {
				type: "block-scalar",
				offset: this.offset,
				indent: this.indent,
				props: [this.sourceToken],
				source: ""
			};
			case "flow-map-start":
			case "flow-seq-start": return {
				type: "flow-collection",
				offset: this.offset,
				indent: this.indent,
				start: this.sourceToken,
				items: [],
				end: []
			};
			case "seq-item-ind": return {
				type: "block-seq",
				offset: this.offset,
				indent: this.indent,
				items: [{ start: [this.sourceToken] }]
			};
			case "explicit-key-ind": {
				this.onKeyLine = !0;
				let t = Sr(xr(e));
				return t.push(this.sourceToken), {
					type: "block-map",
					offset: this.offset,
					indent: this.indent,
					items: [{
						start: t,
						explicitKey: !0
					}]
				};
			}
			case "map-value-ind": {
				this.onKeyLine = !0;
				let t = Sr(xr(e));
				return {
					type: "block-map",
					offset: this.offset,
					indent: this.indent,
					items: [{
						start: t,
						key: null,
						sep: [this.sourceToken]
					}]
				};
			}
		}
		return null;
	}
	atIndentedComment(e, t) {
		return this.type !== "comment" || this.indent <= t ? !1 : e.every((e) => e.type === "newline" || e.type === "space");
	}
	*documentEnd(e) {
		this.type !== "doc-mode" && (e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop()));
	}
	*lineEnd(e) {
		switch (this.type) {
			case "comma":
			case "doc-start":
			case "doc-end":
			case "flow-seq-end":
			case "flow-map-end":
			case "map-value-ind":
				yield* this.pop(), yield* this.step();
				break;
			case "newline": this.onKeyLine = !1;
			default: e.end ? e.end.push(this.sourceToken) : e.end = [this.sourceToken], this.type === "newline" && (yield* this.pop());
		}
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/public-api.js
function Er(e) {
	let t = e.prettyErrors !== !1;
	return {
		lineCounter: e.lineCounter || t && new _r() || null,
		prettyErrors: t
	};
}
function Dr(e, t = {}) {
	let { lineCounter: n, prettyErrors: r } = Er(t), i = new Tr(n?.addNewLine), a = new rr(t), o = null;
	for (let t of a.compose(i.parse(e), !0, e.length)) if (!o) o = t;
	else if (o.options.logLevel !== "silent") {
		o.errors.push(new yn(t.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
		break;
	}
	return r && n && (o.errors.forEach(xn(e, n)), o.warnings.forEach(xn(e, n))), o;
}
function Or(e, t, n) {
	let r;
	typeof t == "function" ? r = t : n === void 0 && t && typeof t == "object" && (n = t);
	let i = Dr(e, n);
	if (!i) return null;
	if (i.warnings.forEach((e) => Qe(i.options.logLevel, e)), i.errors.length > 0) {
		if (i.options.logLevel !== "silent") throw i.errors[0];
		i.errors = [];
	}
	return i.toJS(Object.assign({ reviver: r }, n));
}
//#endregion
//#region src/palettes.ts
var kr = Object.values(/* @__PURE__ */ Object.assign({ "../../custom_components/opendisplay_studio/palettes.json": p })).map((e) => Or(String(e)))[0], Ar = Object.keys(kr), jr = t.palettes, Mr = Object.fromEntries(Ar.map((e) => [e, kr[e].colors.map((e) => e.value)])), Nr = Object.fromEntries(Ar.map((e) => [e, kr[e].colors])), Pr = "accent", Fr = (e, t) => {
	let n = e === Pr ? kr[t].accent : e;
	return kr[t].colors.find((e) => e.value === n || e.id === n)?.hex;
}, Ir = (e) => {
	if (e === Pr) return t.colors.accent;
	let n = /^gray(\d+)$/.exec(e);
	return n ? t.colors.gray(Number(n[1])) : t.colors.names[e] ?? e;
}, j = (e, t, n, r, i = !1) => ({
	id: `solum-${e}`,
	manufacturer: "SOLUM",
	name: `Newton Pro ${t}`,
	width: n,
	height: r,
	palettes: i ? ["bw"] : ["bw", "bwry"],
	defaultPalette: i ? "bw" : "bwry"
}), Lr = [
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
	j("1-6-v", "1.6″ V", 200, 200),
	j("1-6-h", "1.6″ H", 200, 200),
	j("2-2", "2.2″", 296, 160),
	j("2-2-freezer", "2.2″ Freezer", 296, 160, !0),
	j("2-6", "2.6″", 360, 184),
	j("2-6-freezer", "2.6″ Freezer", 360, 184, !0),
	j("2-7", "2.7″", 300, 200),
	j("2-9", "2.9″", 384, 168),
	j("2-9-freezer", "2.9″ Freezer", 384, 168, !0),
	j("3-45", "3.5″ · 3.45 panel", 480, 224),
	j("3-52", "3.5″ · 3.52 panel", 384, 180),
	j("4-2", "4.2″", 400, 300),
	j("4-3", "4.3″", 522, 152),
	j("4-5", "4.5″", 480, 176),
	j("5-8", "5.8″", 792, 272),
	j("6-1", "6.1″", 648, 480),
	j("7-5", "7.5″", 800, 480),
	j("9-7", "9.7″", 672, 960),
	j("11-6", "11.6″", 640, 960),
	j("12-2", "12.2″", 768, 960),
	{
		id: "custom",
		...t.customDisplay,
		width: 800,
		height: 480,
		palettes: Ar,
		defaultPalette: "bw"
	}
], Rr = (e) => Lr.find((t) => t.id === e) ?? Lr[0], zr = (e) => e in jr, Br = (e) => e.kind === "widget" ? e.widget.type : e.kind === "container" ? "container" : e.primitive.type, Vr = (e, t) => {
	let n = new Set(e.map((e) => e.name)), r = e.filter((e) => Br(e) === t).length + 1;
	for (; n.has(`${t}_${r}`);) r += 1;
	return `${t}_${r}`;
}, Hr = () => Math.floor(Math.random() * 256), Ur = () => {
	let e = globalThis.crypto;
	if (typeof e?.randomUUID == "function") return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	typeof e?.getRandomValues == "function" ? e.getRandomValues(t) : t.forEach((e, n) => {
		t[n] = Hr();
	}), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0"));
	return `${n.slice(0, 4).join("")}-${n.slice(4, 6).join("")}-${n.slice(6, 8).join("")}-${n.slice(8, 10).join("")}-${n.slice(10).join("")}`;
}, M = (e, t, n) => Math.max(t, Math.min(n, e)), Wr = (e, t, n = 0) => n + Math.round((e - n) / t) * t, Gr = [
	"nw",
	"n",
	"ne",
	"e",
	"se",
	"s",
	"sw",
	"w"
], Kr = (e) => e.includes("e") || e.includes("w"), qr = (e) => e.includes("n") || e.includes("s"), Jr = (e, t, n, r) => r ? Wr(e, t, n) : Math.round(e), Yr = (e) => {
	if (e.startHandle) return e.originalEnd - e.areaStart;
	if (e.endHandle) return e.areaEnd - e.originalStart;
	let t = Math.min(e.originalCenter - e.areaStart, e.areaEnd - e.originalCenter);
	return Math.max(1, t * 2);
}, Xr = (e, t, n, r, i) => e ? n + r - i : t ? n : n + (r - i) / 2, Zr = ({ bounds: e, handle: t, deltaX: n, deltaY: r, minimumWidth: i, minimumHeight: a, area: o, preserveAspect: s, snapSize: c, snapEnabled: l }) => {
	let u = o.x + o.width, d = o.y + o.height, f = e.x, p = e.y, m = e.x + e.width, h = e.y + e.height, g = f + e.width / 2, _ = p + e.height / 2, v = f, y = p, b = m, x = h;
	if (t.includes("w") && (v = Jr(f + n, c, o.x, l)), t.includes("e") && (b = Jr(m + n, c, o.x, l)), t.includes("n") && (y = Jr(p + r, c, o.y, l)), t.includes("s") && (x = Jr(h + r, c, o.y, l)), t.includes("w") && (v = M(v, o.x, m - i)), t.includes("e") && (b = M(b, f + i, u)), t.includes("n") && (y = M(y, o.y, h - a)), t.includes("s") && (x = M(x, p + a, d)), !s) return {
		x: Math.round(v),
		y: Math.round(y),
		width: Math.round(b - v),
		height: Math.round(x - y)
	};
	let S = e.width / Math.max(1, e.height), ee = Math.max(i, b - v), C = Math.max(a, x - y), w = Math.abs(ee - e.width) / Math.max(1, e.width), te = Math.abs(C - e.height) / Math.max(1, e.height), T, E;
	Kr(t) && (!qr(t) || w >= te) ? (T = ee, E = T / S) : (E = C, T = E * S);
	let ne = Yr({
		startHandle: t.includes("w"),
		endHandle: t.includes("e"),
		originalStart: f,
		originalEnd: m,
		originalCenter: g,
		areaStart: o.x,
		areaEnd: u
	}), re = Yr({
		startHandle: t.includes("n"),
		endHandle: t.includes("s"),
		originalStart: p,
		originalEnd: h,
		originalCenter: _,
		areaStart: o.y,
		areaEnd: d
	}), ie = Math.max(i / Math.max(1, e.width), a / Math.max(1, e.height)), ae = Math.min(ne / Math.max(1, e.width), re / Math.max(1, e.height)), oe = M(Math.max(T / Math.max(1, e.width), E / Math.max(1, e.height)), Math.min(ie, ae), ae);
	return T = Math.max(1, Math.round(e.width * oe)), E = Math.max(1, Math.round(e.height * oe)), v = t.includes("w") ? m - T : t.includes("e") ? f : g - T / 2, y = t.includes("n") ? h - E : t.includes("s") ? p : _ - E / 2, v = M(Math.round(v), o.x, u - T), y = M(Math.round(y), o.y, d - E), {
		x: v,
		y,
		width: T,
		height: E
	};
}, Qr = (e, t, n, r) => {
	let i = Xr(r.includes("w"), r.includes("e"), e.x, e.width, t), a = Xr(r.includes("n"), r.includes("s"), e.y, e.height, n);
	return {
		x: Math.round(i),
		y: Math.round(a),
		width: t,
		height: n
	};
}, $r = {
	l: 0,
	m: .5,
	r: 1
}, ei = {
	a: 0,
	t: 0,
	m: .5,
	s: .8,
	b: 1,
	d: 1
}, ti = (e, t) => {
	let n = e && e.length === 2 ? e : t;
	return {
		x: $r[n[0]] ?? 0,
		y: ei[n[1]] ?? 0
	};
}, ni = (e, t, n, r) => ({
	x: Math.round(e - n.width * r.x),
	y: Math.round(t - n.height * r.y),
	width: n.width,
	height: n.height
}), ri = (e) => "x_end" in e, ii = 21, ai = "lt", oi = "lm", si = "la", ci = .62, li = 1.25, ui = (e) => [
	"text",
	"multiline",
	"qrcode",
	"debug_grid"
].includes(e.type), di = (e, t) => {
	let n = e.split("\n"), r = Math.max(...n.map((e) => e.length));
	return {
		width: Math.max(t, Math.round(r * t * ci)),
		height: Math.max(1, Math.round(n.length * t * li))
	};
}, fi = (e, t) => {
	let n = di(e.value, e.size), r = t ?? {
		width: e.max_width ? Math.min(n.width, e.max_width) : n.width,
		height: n.height
	};
	return ni(e.x, e.y, r, ti(e.anchor, ai));
}, pi = (e, t) => {
	let n = e.value.replaceAll("\n", "").split(e.delimiter), r = (n.length - 1) * e.offset_y, i = Math.max(...n.map((e) => e.length)), a = t ?? {
		width: Math.max(e.size, Math.round(i * e.size * ci)),
		height: Math.round(e.size * li) + r
	}, o = ti(e.anchor, oi), s = a.height - r;
	return {
		x: Math.round(e.x - a.width * o.x),
		y: Math.round(e.y - s * o.y),
		width: a.width,
		height: a.height
	};
}, mi = (e) => ni(e.x, e.y, {
	width: e.size,
	height: e.size
}, ti(e.anchor, si)), hi = (e) => e.size + (e.spacing ?? Math.floor(e.size / 4)), gi = {
	right: {
		x: 1,
		y: 0
	},
	left: {
		x: -1,
		y: 0
	},
	down: {
		x: 0,
		y: 1
	},
	up: {
		x: 0,
		y: -1
	}
}, _i = (e) => {
	let t = gi[e.direction], n = hi(e), r = ti(e.anchor, si), i = {
		width: e.size,
		height: e.size
	}, a = ni(e.x, e.y, i, r), o = ni(e.x + t.x * n * (e.icons.length - 1), e.y + t.y * n * (e.icons.length - 1), i, r), s = Math.min(a.x, o.x), c = Math.min(a.y, o.y);
	return {
		x: s,
		y: c,
		width: Math.max(a.x, o.x) + e.size - s,
		height: Math.max(a.y, o.y) + e.size - c
	};
}, vi = (e) => ({
	x: Math.min(e.x_start, e.x_end),
	y: Math.min(e.y_start, e.y_end),
	width: Math.abs(e.x_end - e.x_start) + 1,
	height: Math.abs(e.y_end - e.y_start) + 1
}), yi = (e) => ({
	x: e.x - e.radius,
	y: e.y - e.radius,
	width: e.radius * 2 + 1,
	height: e.radius * 2 + 1
}), bi = (e) => ({
	x: e.x_start,
	y: e.y_start,
	width: (e.x_repeat - 1) * (e.x_size + e.x_offset) + e.x_size + 1,
	height: (e.y_repeat - 1) * (e.y_size + e.y_offset) + e.y_size + 1
}), xi = (e) => {
	let t = e.points.map(([e]) => e), n = e.points.map(([, e]) => e), r = Math.min(...t), i = Math.min(...n);
	return {
		x: r,
		y: i,
		width: Math.max(...t) - r + 1,
		height: Math.max(...n) - i + 1
	};
}, Si = (e, t) => {
	let n = t?.width ?? (ii + e.border * 2) * e.boxsize;
	return {
		x: e.x,
		y: e.y,
		width: n,
		height: n
	};
}, Ci = (e, t) => ({
	...e,
	width: Math.max(1, Math.round(e.width * t)),
	height: Math.max(1, Math.round(e.height * t))
}), wi = (e, t, n) => {
	if ((e.type === "text" || e.type === "multiline") && t.type === e.type) return Ci(n, t.size / e.size);
	if (e.type === "qrcode" && t.type === "qrcode") {
		let r = (n.width / e.boxsize - 2 * e.border + 2 * t.border) * t.boxsize;
		return {
			...n,
			width: r,
			height: r
		};
	}
	return n;
}, Ti = (e, t) => {
	switch (e.type) {
		case "text": return fi(e, t);
		case "multiline": return pi(e, t);
		case "rectangle":
		case "ellipse":
		case "line":
		case "progress_bar":
		case "plot": return vi(e);
		case "rectangle_pattern": return bi(e);
		case "polygon": return xi(e);
		case "circle":
		case "arc": return yi(e);
		case "icon": return mi(e);
		case "icon_sequence": return _i(e);
		case "qrcode": return Si(e, t);
		case "dlimg": return {
			x: e.x,
			y: e.y,
			width: e.xsize,
			height: e.ysize
		};
		case "debug_grid": return {
			x: 0,
			y: 0,
			width: t?.width ?? 1,
			height: t?.height ?? 1
		};
	}
}, Ei = (e, t, n) => {
	if (!("anchor" in e) || !("x" in e)) return;
	let r = Ti(e, n);
	e.anchor = t;
	let i = Ti(e, n);
	Di(e, r.x - i.x, r.y - i.y);
}, Di = (e, t, n) => {
	if (ri(e)) {
		e.x_start += t, e.x_end += t, e.y_start += n, e.y_end += n;
		return;
	}
	switch (e.type) {
		case "rectangle_pattern":
			e.x_start += t, e.y_start += n;
			return;
		case "polygon":
			e.points = e.points.map(([e, r]) => [e + t, r + n]);
			return;
		case "debug_grid": return;
		default: e.x += t, e.y += n;
	}
}, Oi = 6, ki = 256, Ai = 8, ji = (e, t) => t ? Math.max(1, Math.round(t.width / e.boxsize)) : 21 + e.border * 2, Mi = (e, t, n) => {
	let r = t / e.size, i = Ti(e, n);
	return {
		x: i.x,
		y: i.y,
		width: Math.max(1, Math.round(i.width * r)),
		height: Math.max(1, Math.round(i.height * r))
	};
}, Ni = (e, t) => {
	switch (e.type) {
		case "circle":
		case "arc": return {
			minimumWidth: 3,
			minimumHeight: 3,
			intrinsicAspect: !0
		};
		case "qrcode": {
			let n = ji(e, t);
			return {
				minimumWidth: n,
				minimumHeight: n,
				intrinsicAspect: !0
			};
		}
		case "icon":
		case "icon_sequence": return {
			minimumWidth: Ai,
			minimumHeight: Ai,
			intrinsicAspect: !0
		};
		case "text":
		case "multiline": {
			let n = Mi(e, Oi, t);
			return {
				minimumWidth: n.width,
				minimumHeight: n.height,
				intrinsicAspect: !0
			};
		}
		case "line":
		case "dlimg": return {
			minimumWidth: 1,
			minimumHeight: 1,
			intrinsicAspect: !1
		};
		default: return {
			minimumWidth: 2,
			minimumHeight: 2,
			intrinsicAspect: !1
		};
	}
}, Pi = (e) => e.type !== "debug_grid", Fi = (e, { requested: t }, n) => {
	let r = t.x + t.width - 1, i = t.y + t.height - 1;
	if (e.type !== "line") {
		e.x_start = t.x, e.y_start = t.y, e.x_end = r, e.y_end = i;
		return;
	}
	let a = e.x_start <= e.x_end, o = e.y_start <= e.y_end;
	e.x_start = a ? t.x : r, e.x_end = a ? r : t.x, e.y_start = o ? t.y : i, e.y_end = o ? i : t.y, e.x_start === e.x_end && e.y_start === e.y_end && (e.x_end = Math.min(n - 1, e.x_start + 1));
}, Ii = (e, { requested: t, handle: n }) => {
	let r = Math.max(1, Math.floor((Math.min(t.width, t.height) - 1) / 2)), i = r * 2 + 1, a = Qr(t, i, i, n);
	e.x = a.x + r, e.y = a.y + r, e.radius = r;
}, Li = (e, { requested: t, handle: n, measured: r }) => {
	let i = ji(e, r);
	e.boxsize = M(Math.floor(Math.min(t.width, t.height) / i), 1, 16);
	let a = i * e.boxsize, o = Qr(t, a, a, n);
	e.x = o.x, e.y = o.y;
}, Ri = (e, t, n) => Di(e, n.x - t.x, n.y - t.y), zi = (e, { requested: t, before: n, handle: r }) => {
	let i = e.size, a = e.type === "icon" ? Math.min(t.width, t.height) / Math.max(1, i) : t.width / Math.max(1, n.width);
	e.size = M(Math.round(i * a), Ai, 256), e.type === "icon_sequence" && e.spacing !== null && (e.spacing = Math.round(e.spacing * e.size / i));
	let o = Ti(e);
	Ri(e, o, Qr(t, o.width, o.height, r));
}, Bi = (e, { requested: t, before: n, handle: r, measured: i }) => {
	let a = e.size, o = M(Math.round(a * t.width / Math.max(1, n.width)), Oi, ki), s = Mi(e, o, i);
	e.size = o, e.type === "multiline" && (e.offset_y = Math.max(1, Math.round(e.offset_y * o / a)));
	let c = Ti(e, s);
	Ri(e, c, Qr(t, c.width, c.height, r));
}, Vi = (e, t, n) => Math.max(1, Math.floor((e - 1 - (t - 1) * n) / t)), Hi = (e, { requested: t }) => {
	e.x_start = t.x, e.y_start = t.y, e.x_size = Vi(t.width, e.x_repeat, e.x_offset), e.y_size = Vi(t.height, e.y_repeat, e.y_offset);
}, Ui = (e, { requested: t, before: n }) => {
	let r = (t.width - 1) / Math.max(1, n.width - 1), i = (t.height - 1) / Math.max(1, n.height - 1);
	e.points = e.points.map(([e, a]) => [Math.round(t.x + (e - n.x) * r), Math.round(t.y + (a - n.y) * i)]);
}, Wi = (e, t) => {
	if (ri(e)) {
		Fi(e, t, t.displayWidth);
		return;
	}
	switch (e.type) {
		case "circle":
		case "arc":
			Ii(e, t);
			return;
		case "qrcode":
			Li(e, t);
			return;
		case "icon":
		case "icon_sequence":
			zi(e, t);
			return;
		case "text":
		case "multiline":
			Bi(e, t);
			return;
		case "rectangle_pattern":
			Hi(e, t);
			return;
		case "polygon":
			Ui(e, t);
			return;
		case "dlimg":
			e.x = t.requested.x, e.y = t.requested.y, e.xsize = t.requested.width, e.ysize = t.requested.height;
			return;
		case "debug_grid": return;
	}
}, Gi = (e, t, n) => e === "display_width" ? t.width : e === "display_height" ? t.height : e === "display_shorter_side" ? Math.min(t.width, t.height) : e ?? n, Ki = (e, t) => e.default === void 0 ? e.nullable || e.optional ? null : 0 : e.shape !== "number" || typeof e.default != "number" ? structuredClone(e.default) : M(e.default, Gi(e.min, t, -Infinity), Gi(e.max, t, Infinity)), qi = (e, t, n) => {
	if (!Array.isArray(e)) return;
	let [r] = e, [i, a] = Array.isArray(r) ? r : [0, 0];
	e.forEach((r, o) => {
		Array.isArray(r) && (e[o] = [t + r[0] - i, n + r[1] - a]);
	});
}, Ji = (e, t, n) => {
	let { x: r, y: i, displayWidth: a, displayHeight: o } = n;
	switch (e.geometry) {
		case "canvas": return;
		case "pattern":
			t.x_start = r, t.y_start = i;
			return;
		case "points":
			qi(t.points, r, i);
			return;
		case "box":
		case "line": {
			let n = e.extent ?? {
				x: 0,
				y: 0
			};
			t.x_start = r, t.y_start = i, t.x_end = Math.min(a - 1, r + n.x), t.y_end = Math.min(o - 1, i + n.y);
			return;
		}
		default: t.x = r, t.y = i;
	}
}, Yi = (e, t) => {
	if (!e) return;
	let n = {
		width: t.displayWidth,
		height: t.displayHeight
	}, r = { type: e.type };
	for (let t of e.fields) r[t.key] = Ki(t, n);
	return Ji(e, r, t), r;
}, Xi = (e) => Math.sqrt(e.sx * e.sy), Zi = (e, t, n) => Math.max(n, Math.round(e * t)), Qi = (e, t) => {
	let n = t.definitions.find((t) => t.type === e.primitive.type), r = { ...e.primitive };
	for (let e of n?.fields ?? []) {
		let n = r[e.key];
		if (e.shape === "points" && Array.isArray(n)) {
			r[e.key] = n.map(([e, n]) => [Math.round(e * t.sx), Math.round(n * t.sy)]);
			continue;
		}
		if (typeof n == "number") {
			if (e.shape === "coordinate") {
				r[e.key] = Math.round(n * (e.axis === "x" ? t.sx : t.sy));
				continue;
			}
			if (e.shape === "number" && e.unit === "px") {
				let i = e.min === 0 && n === 0 ? 0 : 1, a = Gi(e.max, t.display, Infinity);
				r[e.key] = M(Zi(n, Xi(t), i), i, a);
			}
		}
	}
	Object.assign(e.primitive, r), $i(e);
}, $i = (e) => {
	let t = e.primitive;
	if (ri(t)) {
		if (t.type === "line") {
			t.x_start === t.x_end && t.y_start === t.y_end && (t.x_end += 1);
			return;
		}
		t.x_end <= t.x_start && (t.x_end = t.x_start + 1), t.y_end <= t.y_start && (t.y_end = t.y_start + 1);
	}
}, ea = (e, t) => {
	e.x = Math.round(e.x * t.sx), e.y = Math.round(e.y * t.sy), e.width = Zi(e.width, t.sx, 1), e.height = Zi(e.height, t.sy, 1);
}, ta = (e, t) => {
	if (e.kind === "primitive") {
		Qi(e, t);
		return;
	}
	if (e.kind === "widget") {
		ea(e.frame, t), e.layout.padding = Zi(e.layout.padding, Xi(t), 0);
		return;
	}
	ea(e, t);
	for (let n of e.children) ta(n, t);
}, na = (e, t, n, r, i) => {
	let a = {
		sx: t,
		sy: n,
		definitions: r,
		display: i
	};
	for (let t of e.children) ta(t, a);
}, N = (e, t) => e.kind === "widget" ? e.frame : e.kind === "container" ? {
	x: e.x,
	y: e.y,
	width: e.width,
	height: e.height
} : Ti(e.primitive, ui(e.primitive) ? t : void 0), ra = (e) => {
	let t = e.display.padding;
	return {
		x: t,
		y: t,
		width: e.display.width - t * 2,
		height: e.display.height - t * 2
	};
}, ia = (e, t, n) => n ? Wr(e, t.display.snapSize, t.display.padding) : Math.round(e), P = (e, t, n) => {
	if (e.kind === "widget") {
		e.frame.x += t, e.frame.y += n;
		return;
	}
	if (e.kind === "container") {
		e.x += t, e.y += n;
		return;
	}
	Di(e.primitive, t, n);
}, aa = (e, t, n) => {
	let r = ra(t), i = N(e, n);
	P(e, M(i.x, r.x, Math.max(r.x, r.x + r.width - i.width)) - i.x, M(i.y, r.y, Math.max(r.y, r.y + r.height - i.height)) - i.y), e.kind === "widget" && (e.frame.width = Math.min(e.frame.width, r.width), e.frame.height = Math.min(e.frame.height, r.height)), e.kind === "container" && (e.width = Math.min(e.width, r.width), e.height = Math.min(e.height, r.height));
}, oa = (e, t) => {
	let n = Math.min(e.x, t.x), r = Math.min(e.y, t.y), i = Math.max(e.x + e.width, t.x + t.width), a = Math.max(e.y + e.height, t.y + t.height);
	return {
		x: n,
		y: r,
		width: i - n,
		height: a - r
	};
}, sa = {
	width: 60,
	height: 48
}, ca = (e, t, n) => e.kind === "widget" ? {
	minimumWidth: t.width,
	minimumHeight: t.height,
	intrinsicAspect: !1
} : e.kind === "container" ? {
	minimumWidth: 8,
	minimumHeight: 8,
	intrinsicAspect: !1
} : Ni(e.primitive, n), la = {
	n: "ne",
	e: "se",
	s: "se",
	w: "sw"
}, ua = (e, t, n, r, i, a, o) => {
	let s = N(e, o.measured), { minimumWidth: c, minimumHeight: l, intrinsicAspect: u } = ca(e, o.minSize ?? sa, o.measured), d = u ? la[t] ?? t : t, f = Zr({
		bounds: s,
		handle: d,
		deltaX: n,
		deltaY: r,
		minimumWidth: c,
		minimumHeight: l,
		area: oa(ra(a), s),
		preserveAspect: i || u,
		snapSize: a.display.snapSize,
		snapEnabled: o.snapEnabled
	});
	if (e.kind === "widget") {
		e.frame = f;
		return;
	}
	if (e.kind === "container") {
		Object.assign(e, {
			x: f.x,
			y: f.y,
			width: f.width,
			height: f.height
		}), e.grouped && na(e, f.width / Math.max(1, s.width), f.height / Math.max(1, s.height), o.definitions ?? [], a.display);
		return;
	}
	Pi(e.primitive) && Wi(e.primitive, {
		requested: f,
		before: s,
		handle: d,
		measured: o.measured,
		displayWidth: a.display.width,
		displayHeight: a.display.height
	});
}, da = (e, t, n, r, i, a) => {
	let o = structuredClone(e);
	if (o.locked) return o;
	let s = a.offset ?? {
		x: 0,
		y: 0
	};
	return P(o, s.x, s.y), fa(o, t, n, r, i, a), P(o, -s.x, -s.y), o;
}, fa = (e, t, n, r, i, a) => {
	if (t.mode === "resize") {
		ua(e, t.handle, n, r, t.shiftKey, i, a);
		return;
	}
	let o = N(e, a.measured), s = oa(ra(i), o), c = M(ia(o.x + n, i, a.snapEnabled), s.x, Math.max(s.x, s.x + s.width - o.width)), l = M(ia(o.y + r, i, a.snapEnabled), s.y, Math.max(s.y, s.y + s.height - o.height));
	P(e, c - o.x, l - o.y);
}, pa = {
	x: 0,
	y: 0
}, F = (e) => e.kind === "container", ma = (e) => e.kind === "container" && e.grouped, ha = (e, t, n, r) => {
	for (let [i, a] of e.entries()) {
		if (a.id === t) return {
			item: a,
			parent: n,
			siblings: e,
			index: i,
			offset: r
		};
		if (F(a)) {
			let e = ha(a.children, t, a, {
				x: r.x + a.x,
				y: r.y + a.y
			});
			if (e) return e;
		}
	}
}, I = (e, t) => ha(e, t, void 0, pa), L = (e, t) => I(e, t)?.item, ga = (e) => e.flatMap((e) => F(e) ? [e, ...ga(e.children)] : [e]), _a = (e) => ga(e).length, va = (e, t) => {
	let n = [], r = I(e, t)?.parent;
	for (; r;) n.push(r), r = I(e, r.id)?.parent;
	return n;
}, ya = (e, t, n) => t === n || va(e, t).some((e) => e.id === n), ba = (e, t) => ({
	...e,
	x: e.x + t.x,
	y: e.y + t.y
}), xa = (e, t, n) => t >= e.x && t < e.x + e.width && n >= e.y && n < e.y + e.height, Sa = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Ca = (e, t, n, r, i) => {
	let a = I(e.items, t);
	if (!a || n !== void 0 && ya(e.items, n, t)) return;
	a.siblings.splice(a.index, 1);
	let o = n === void 0 ? void 0 : I(e.items, n), s = o && F(o.item) ? o.item : void 0, c = o && s ? {
		x: o.offset.x + s.x,
		y: o.offset.y + s.y
	} : pa, l = s ? s.children : e.items;
	r(a.item, a.offset.x - c.x, a.offset.y - c.y), l.splice(i ?? l.length, 0, a.item);
}, wa = (e, t) => {
	let n = I(e.items, t);
	n && n.siblings.splice(n.index, 1);
}, Ta = (e, t) => {
	let n = t.map((t) => I(e, t));
	return n.length === 0 || n.some((e) => !e) || new Set(n.map((e) => e?.parent?.id)).size !== 1 ? !1 : { parentId: n[0]?.parent?.id };
}, Ea = (e, t) => {
	let n = new Set(t);
	return ga(e).filter((e) => n.has(e.id)).map((e) => e.id);
}, Da = (e, t, n) => {
	let r = [...va(e, t)].reverse(), i = n ? /* @__PURE__ */ new Set([n, ...va(e, n).map((e) => e.id)]) : /* @__PURE__ */ new Set();
	return r.find((e) => e.grouped && !i.has(e.id))?.id ?? t;
}, Oa = (e, t, n, r, i) => {
	if (t === n || ya(e.items, n, t)) return;
	let a = I(e.items, t);
	if (!a || !I(e.items, n)) return;
	a.siblings.splice(a.index, 1);
	let o = I(e.items, n);
	if (!o) return;
	let s = o.offset;
	i(a.item, a.offset.x - s.x, a.offset.y - s.y), o.siblings.splice(r === "before" ? o.index + 1 : o.index, 0, a.item);
}, ka = (e, t = pa, n, r = 0) => e.flatMap((e) => {
	let i = {
		item: e,
		offset: t,
		parent: n,
		depth: r
	};
	return F(e) ? [i, ...ka(e.children, {
		x: t.x + e.x,
		y: t.y + e.y
	}, e, r + 1)] : [i];
}), Aa = (e) => F(e.item) ? {
	x: e.offset.x + e.item.x,
	y: e.offset.y + e.item.y,
	width: e.item.width,
	height: e.item.height
} : void 0, ja = (e, t, n, r, i) => {
	let a = new Set(i ? [i, ...va(e, i).map((e) => e.id)] : []), o = ka(e).filter((i) => {
		let o = Aa(i);
		return !o || !F(i.item) || i.item.hidden || i.item.locked || i.item.grouped && !a.has(i.item.id) || r.some((t) => ya(e, i.item.id, t)) ? !1 : xa(o, t, n);
	}), s = o[o.length - 1]?.item;
	return s && F(s) ? s : void 0;
}, Ma = (e, t) => {
	let n = I(e.items, t.id);
	n && (n.siblings[n.index] = t);
}, Na = (e, t) => e.filter((e) => t.has(e.id)), Pa = (e, t) => new Set(t.flatMap((t) => {
	let n = I(e.items, t)?.siblings;
	return n ? [n] : [];
})), Fa = (e, t) => {
	let n = new Set(t), r = Pa(e, t);
	for (let e of r) La(e, n, "end");
}, Ia = (e, t) => {
	let n = new Set(t), r = Pa(e, t);
	for (let e of r) La(e, n, "start");
}, La = (e, t, n) => {
	let r = Na(e, t), i = e.filter((e) => !t.has(e.id));
	e.splice(0, e.length, ...n === "end" ? [...i, ...r] : [...r, ...i]);
}, Ra = (e, t, n) => {
	let r = new Set(t), i = Pa(e, t);
	for (let e of i) {
		let t = n === "up" ? e.map((t, n) => e.length - 1 - n) : e.map((e, t) => t);
		for (let i of t) {
			let t = e[i], a = e[i + (n === "up" ? 1 : -1)];
			t && a && r.has(t.id) && !r.has(a.id) && (e[i] = a, e[i + (n === "up" ? 1 : -1)] = t);
		}
	}
}, za = "container", Ba = () => ({
	fill: "white",
	outline: "black",
	width: 1,
	radius: 0
}), Va = (e, t, n) => ({
	id: Ur(),
	name: Vr(ga(e.items), za),
	kind: "container",
	locked: !1,
	hidden: !1,
	x: Math.round(t - 50),
	y: Math.round(n - 50),
	width: 100,
	height: 100,
	grouped: !1,
	background: Ba(),
	children: []
}), Ha = (e) => {
	let t = Math.min(...e.map((e) => e.x)), n = Math.min(...e.map((e) => e.y)), r = Math.max(...e.map((e) => e.x + e.width)), i = Math.max(...e.map((e) => e.y + e.height));
	return {
		x: t,
		y: n,
		width: r - t,
		height: i - n
	};
}, Ua = (e, t) => {
	if (!Ta(e.items, t)) return !1;
	let [n] = t, r = n ? I(e.items, n)?.item : void 0;
	return t.length === 1 && r && F(r) ? !r.grouped : t.every((t) => !I(e.items, t)?.item.locked);
}, Wa = (e, t) => {
	let n = I(e.items, t)?.item;
	return n !== void 0 && F(n) && n.grouped;
}, Ga = (e, t, n = () => void 0) => {
	if (!Ua(e, t)) return;
	let [r] = t, i = r ? I(e.items, r)?.item : void 0;
	if (t.length === 1 && i && F(i)) return i.grouped = !0, i.background = null, i.id;
	let a = Ea(e.items, t), o = a.flatMap((t) => I(e.items, t)?.item ?? []), s = Ha(o.map((e) => N(e, n(e)))), c = I(e.items, a[0] ?? ""), l = I(e.items, a[a.length - 1] ?? "");
	if (!c || !l) return;
	let u = c.siblings, d = l.index - (o.length - 1), f = {
		id: Ur(),
		name: Vr(ga(e.items), za),
		kind: "container",
		locked: !1,
		hidden: !1,
		x: s.x,
		y: s.y,
		width: s.width,
		height: s.height,
		grouped: !0,
		background: null,
		children: o
	};
	for (let e of o) {
		let t = u.indexOf(e);
		u.splice(t, 1), P(e, -s.x, -s.y);
	}
	return u.splice(d, 0, f), f.id;
}, Ka = (e, t) => {
	let n = I(e.items, t);
	if (!n || !F(n.item) || !n.item.grouped) return [];
	let r = n.item;
	for (let e of r.children) P(e, r.x, r.y);
	return n.siblings.splice(n.index, 1, ...r.children), r.children.map((e) => e.id);
}, qa = P, Ja = (e, t, n) => {
	let r = n ? I(e.items, n) : void 0;
	if (!r || !F(r.item)) {
		e.items.push(t);
		return;
	}
	qa(t, -(r.offset.x + r.item.x), -(r.offset.y + r.item.y)), r.item.children.push(t);
}, Ya = (e, t, n) => {
	let r = I(e.items, t);
	if (!r || r.parent?.id === n) return;
	let i = n === void 0 ? Xa(e, t) : Za(e, t, n);
	if (Ca(e, t, n, qa), !i) return;
	let a = I(e.items, t), o = I(e.items, i.id);
	if (!a || !o || a.siblings !== o.siblings) return;
	a.siblings.splice(a.index, 1);
	let s = I(e.items, i.id);
	s?.siblings.splice((s?.index ?? 0) + 1, 0, a.item);
}, Xa = (e, t) => {
	let n = va(e.items, t);
	return n[n.length - 1];
}, Za = (e, t, n) => {
	let r = va(e.items, t), i = r.findIndex((e) => e.id === n);
	return i > 0 ? r[i - 1] : void 0;
}, Qa = (e, t, n) => {
	let r = I(e.items, t)?.item;
	r && F(r) && !r.grouped && !r.locked && (r.background = n);
}, $a = "none", eo = 32, to = 256, no = (e, t) => {
	let n = [...Mr[e], "accent"];
	return [
		{
			name: "enabled",
			label: t.enabled,
			selector: { boolean: {} }
		},
		{
			name: "fill",
			label: t.fill,
			selector: { select: { options: [$a, ...n] } }
		},
		{
			name: "outline",
			label: t.outline,
			selector: { select: { options: n } }
		},
		{
			name: "width",
			label: t.width,
			selector: { number: {
				min: 0,
				max: eo
			} }
		},
		{
			name: "radius",
			label: t.radius,
			selector: { number: {
				min: 0,
				max: to
			} }
		}
	];
}, ro = (e) => {
	let t = e.background ?? Ba();
	return {
		enabled: e.background !== null,
		fill: t.fill ?? $a,
		outline: t.outline,
		width: t.width,
		radius: t.radius
	};
}, io = (e, t, n) => typeof e != "number" || !Number.isFinite(e) ? t : Math.min(n, Math.max(0, Math.round(e))), ao = (e) => {
	if (e.enabled !== !0) return null;
	let t = Ba(), n = typeof e.fill == "string" ? e.fill : t.fill;
	return {
		fill: n === $a ? null : n,
		outline: typeof e.outline == "string" ? e.outline : t.outline,
		width: io(e.width, t.width, eo),
		radius: io(e.radius, t.radius, to)
	};
}, oo = (e, t) => Ea(e.items, t).filter((n) => !va(e.items, n).some((e) => t.includes(e.id))), so = (e, t) => ({ items: oo(e, t).flatMap((t) => {
	let n = I(e.items, t);
	if (!n) return [];
	let r = structuredClone(n.item);
	return P(r, n.offset.x, n.offset.y), [r];
}) }), co = (e, t) => {
	if (e.id = Ur(), e.name = Vr(t, Br(e)), t.push(e), F(e)) for (let n of e.children) co(n, t);
}, lo = (e, t) => {
	let n = t.at(-1), r = n ? I(e.items, n) : void 0;
	return r ? r.item.kind === "container" && !r.item.grouped ? { parentId: r.item.id } : {
		parentId: r.parent?.id,
		afterId: r.item.id
	} : {};
}, uo = (e, t) => {
	let n = t ? I(e.items, t) : void 0;
	return !n || !F(n.item) ? {
		x: 0,
		y: 0
	} : {
		x: n.offset.x + n.item.x,
		y: n.offset.y + n.item.y
	};
}, fo = (e) => e.items.length > 0 ? Ha(e.items.map((e) => N(e))) : void 0, po = (e, t, n, r) => {
	let i = fo(t);
	if (!i) return [];
	let a = "anchor" in r ? {
		x: r.anchor.x - i.x,
		y: r.anchor.y - i.y
	} : r.delta, o = uo(e, n.parentId), s = ga(e.items), c = n.parentId ? I(e.items, n.parentId)?.item : void 0, l = c && F(c) ? c.children : e.items, u = n.afterId ? l.findIndex((e) => e.id === n.afterId) : -1, d = u >= 0 ? u + 1 : l.length;
	return t.items.map((e) => {
		let t = structuredClone(e);
		return P(t, a.x - o.x, a.y - o.y), co(t, s), l.splice(d, 0, t), d += 1, t.id;
	});
}, mo = (e, t) => {
	let n = ga(e.items);
	return oo(e, t).flatMap((t) => {
		let r = I(e.items, t);
		if (!r) return [];
		let i = structuredClone(r.item);
		return P(i, 8, 8), co(i, n), r.siblings.splice(r.siblings.indexOf(r.item) + 1, 0, i), [i.id];
	});
}, ho = (e, t, n, r, i, a) => {
	let o = t.flatMap((t) => {
		let n = I(e.items, t);
		return n && !n.item.locked && a(n.item) ? [n] : [];
	});
	if (o.length === 0) return !1;
	let s = o.map((e) => ({
		x: N(e.item).x + e.offset.x,
		y: N(e.item).y + e.offset.y,
		width: N(e.item).width,
		height: N(e.item).height
	})), c = Math.min(...s.map((e) => e.x)), l = Math.min(...s.map((e) => e.y)), u = Math.max(...s.map((e) => e.x + e.width)), d = Math.max(...s.map((e) => e.y + e.height)), f = Math.min(Math.max(n, i.x - c), i.x + i.width - u), p = Math.min(Math.max(r, i.y - l), i.y + i.height - d);
	if (f === 0 && p === 0) return !1;
	for (let { item: e } of o) P(e, f, p);
	return !0;
}, go = "visible", _o = (e) => typeof e == "string" && (e.includes("{{") || e.includes("{%")), vo = "\\", yo = (e) => `'${e.replaceAll(vo, "\\\\").replaceAll("'", `${vo}'`)}'`, bo = (e) => typeof e == "string" ? `{{ ${yo(e)} }}` : typeof e == "boolean" || typeof e == "number" ? `{{ ${e} }}` : "{{ none }}", xo = Symbol("unchanged"), So = "transparent", Co = /^\s*(-?\d+)\s*[,;\s]\s*(-?\d+)\s*$/, wo = (e) => typeof e == "object" && !!e && Object.keys(e).length === 0, To = {
	flags: {
		toForm: (e) => typeof e == "string" && e !== "" ? e.split(",") : [],
		fromForm: (e) => Array.isArray(e) && e.length > 0 ? e.join(",") : null
	},
	points: {
		toForm: (e) => Array.isArray(e) ? e.map((e) => String(e).replace(",", ", ")).join("\n") : "",
		fromForm: (e) => {
			if (typeof e != "string") return xo;
			let t = e.split("\n").filter((e) => e.trim() !== ""), n = [];
			for (let e of t) {
				let t = Co.exec(e);
				if (!t) return xo;
				n.push([Number(t[1]), Number(t[2])]);
			}
			return n;
		}
	},
	icons: {
		toForm: (e) => Array.isArray(e) ? e.join("\n") : "",
		fromForm: (e) => typeof e == "string" ? e.split("\n").map((e) => e.trim()).filter((e) => e !== "") : xo
	},
	object: {
		toForm: (e) => e ?? {},
		fromForm: (e) => wo(e) ? null : e
	}
}, Eo = (e) => e === void 0 || e === "" || Number.isNaN(e), Do = (e, t) => {
	if (e.nullable && e.shape === "color" && t === null) return So;
	if (!(t === null && e.optional && !To[e.shape])) return To[e.shape]?.toForm(t) ?? t;
}, Oo = (e, t) => {
	if (e.nullable && e.shape === "color" && t === So) return null;
	let n = To[e.shape];
	return n ? n.fromForm(t) : e.optional && Eo(t) ? null : t;
}, ko = {
	grid: [],
	extra: []
}, Ao = "transparent", jo = (e, t) => t.find((t) => t.type === e.primitive.type), R = (e, t, n, r, i, a = !1) => ({
	label: e,
	key: t,
	value: n,
	min: r,
	max: i,
	stored: a
}), Mo = (e, n) => {
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
}, No = (e, n) => {
	let { width: r, height: i } = n.display, a = t.fields;
	return {
		grid: [
			R(a.x, "x", e.x, -r, r),
			R(a.y, "y", e.y, -i, i),
			R(a.width, "width", e.width, 1, r),
			R(a.height, "height", e.height, 1, i)
		],
		extra: []
	};
}, Po = (e, n) => {
	let r = e.primitive;
	if (!ri(r)) return ko;
	let { width: i, height: a } = n.display, o = t.fields, s = Ti(r);
	return {
		grid: [
			R(o.x, "x", s.x, 0, i),
			R(o.y, "y", s.y, 0, a),
			R(o.width, "width", s.width, 1, i),
			R(o.height, "height", s.height, 1, a)
		],
		extra: []
	};
}, Fo = (e, t, n) => {
	let r = n.display, i = e.axis === "x" ? r.width : r.height, a = e.shape === "coordinate";
	return R(e.label, e.key, Number(t[e.key]), a ? 0 : Gi(e.min, r, 0), a ? i : Gi(e.max, r, i), !0);
}, Io = (e) => e.shape === "coordinate" || e.shape === "number", Lo = (e, t, n) => {
	let r = { ...e.primitive };
	return {
		grid: t.fields.filter((e) => e.section === "layout" && Io(e)).map((e) => Fo(e, r, n)),
		extra: []
	};
}, Ro = (e) => e.geometry === "box" || e.geometry === "line", zo = (e, t) => {
	if (e.kind !== "primitive") return !1;
	let n = jo(e, t);
	return n !== void 0 && Ro(n);
}, Bo = (e, t, n, r = !1) => {
	if (e.kind === "widget") return Mo(e, t);
	if (e.kind === "container") return No(e, t);
	let i = jo(e, n);
	return i ? Ro(i) && !r ? Po(e, t) : Lo(e, i, t) : ko;
}, Vo = (e, t) => Object.fromEntries((e.nested ?? []).map((e) => [e.key, {
	label: e.label,
	selector: Ho(e, t)
}])), Ho = (e, t) => {
	switch (e.shape) {
		case "boolean": return { boolean: {} };
		case "enum": return { select: { options: e.options ?? [] } };
		case "flags": return { select: {
			options: e.options ?? [],
			multiple: !0
		} };
		case "font": return { select: {
			options: e.options ?? [],
			custom_value: !0
		} };
		case "color": return { select: { options: e.nullable ? [Ao, ...t] : t } };
		case "number": return { number: {
			min: typeof e.min == "number" ? e.min : void 0,
			max: typeof e.max == "number" ? e.max : void 0
		} };
		case "points":
		case "icons": return { text: { multiline: !0 } };
		case "object": return { object: { fields: Vo(e, t) } };
		case "objects": return { object: {
			multiple: !0,
			label_field: e.nested?.[0]?.key,
			fields: Vo(e, t)
		} };
		default: return { text: {} };
	}
}, Uo = (e, t) => ({
	name: e.key,
	label: e.label,
	selector: Ho(e, [...Mr[t], "accent"])
}), Wo = (e, t, n) => (jo(e, t)?.fields ?? []).filter((e) => e.visible !== !1 && e.section === n && (n === "appearance" || !Io(e))), Go = (e, t) => {
	let n = { ...e };
	for (let e of t?.fields ?? []) {
		if (!(e.key in n)) continue;
		let t = Oo(e, n[e.key]);
		t === xo ? delete n[e.key] : n[e.key] = t;
	}
	return n;
}, Ko = {
	position: [],
	handles: [],
	scalingBlockedBy: []
}, qo = (e, t, n) => {
	let r = e.primitive;
	if (!ri(r)) return t;
	let i = t === "x" ? r.x_start > r.x_end : r.y_start > r.y_end;
	return `${t}_${(n === "start" ? !i : i) ? "start" : "end"}`;
}, Jo = (e, t) => [
	...t.includes("w") ? [qo(e, "x", "start")] : [],
	...t.includes("e") ? [qo(e, "x", "end")] : [],
	...t.includes("n") ? [qo(e, "y", "start")] : [],
	...t.includes("s") ? [qo(e, "y", "end")] : []
], Yo = (e) => e.geometry === "box" || e.geometry === "line", Xo = (e, t) => {
	let n = new Set(Object.keys(e.expressions ?? {}));
	n.delete(go);
	let r = t.fields.filter((e) => e.section === "layout" && n.has(e.key)), i = t.fields.filter((e) => e.shape === "points" && n.has(e.key)), a = [...r.filter((e) => e.shape === "coordinate"), ...i].map((e) => e.key);
	return Yo(t) ? {
		position: a,
		handles: Gr.filter((t) => Jo(e, t).some((e) => n.has(e))),
		scalingBlockedBy: []
	} : {
		position: a,
		handles: r.some((e) => e.shape !== "coordinate") || i.length > 0 ? [...Gr] : [],
		scalingBlockedBy: []
	};
}, Zo = (e, t) => {
	let n = $o(e, t);
	return n.position.length > 0 || n.handles.length > 0;
}, Qo = (e, t) => {
	let n = ga(e.children).filter((e) => !F(e) && Zo(e, t));
	return {
		position: [],
		handles: n.length > 0 ? [...Gr] : [],
		scalingBlockedBy: n.map((e) => e.name)
	};
}, $o = (e, t) => {
	if (e.kind === "container") return e.grouped ? Qo(e, t) : Ko;
	if (e.kind !== "primitive") return Ko;
	let n = jo(e, t);
	return n ? Xo(e, n) : Ko;
}, es = .25, ts = 96, ns = 3, rs = .1, is = {
	zoom: 1,
	panX: 0,
	panY: 0
}, as = (e, t) => ({
	...e,
	zoom: M(t, es, 4)
}), os = (e, t) => {
	let n = Math.max(100, e.width - ts), r = Math.max(100, e.height - ts);
	return {
		zoom: M(Math.min(n / t.width, r / t.height), es, ns),
		panX: 0,
		panY: 0
	};
}, ss = (e, t) => t.shiftKey ? as(e, e.zoom + (t.deltaY < 0 ? rs : -.1)) : t.altKey ? {
	...e,
	panX: e.panX - t.deltaY
} : {
	...e,
	panY: e.panY - t.deltaY
}, cs = "opendisplay_color", ls = "accent", us = (e, t) => cs in e ? { select: { options: [...Mr[t], ls] } } : e, ds = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || Array.isArray(e) && e.every((e) => typeof e == "string"), fs = (e) => e.default === void 0 ? "boolean" in e.selector ? !1 : "number" in e.selector ? 0 : "" : e.default, ps = (e) => Object.fromEntries(e.options.flatMap((e) => e.fields).map((e) => [e.key, fs(e)])), ms = (e, t) => {
	let n = new Set(t.options.flatMap((e) => e.fields.map((e) => e.key)));
	return Object.fromEntries(Object.entries(e).filter((e) => n.has(e[0]) && ds(e[1])));
}, hs = (e) => Object.values(e.selector).some((e) => typeof e == "object" && !!e && "multiple" in e), gs = (e, t) => {
	let n = t.map((e) => e.id);
	return hs(e) ? n : n[0] ?? "";
}, _s = (e, t) => (Array.isArray(t) ? t : [t]).filter((e) => typeof e == "string" && e !== "").map((t) => e.find((e) => e.id === t) ?? { id: t }), vs = (e, t, n, r) => {
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
}, ys = 6e4, bs = (e) => e.split(".", 1)[0] ?? "", xs = (e, t) => [.../* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])].filter((n) => e[n] !== t[n]), Ss = (e, t, n) => {
	if (!t || !n || t === n) return !1;
	let r = xs(t, n);
	return e.allStates ? r.length > 0 : r.some((t) => e.entities.includes(t) || e.domains.includes(bs(t)));
}, Cs = globalThis, ws = Cs.ShadowRoot && (Cs.ShadyCSS === void 0 || Cs.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ts = Symbol(), Es = /* @__PURE__ */ new WeakMap(), Ds = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== Ts) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (ws && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = Es.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Es.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, Os = (e) => new Ds(typeof e == "string" ? e : e + "", void 0, Ts), z = (e, ...t) => new Ds(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, Ts), ks = (e, t) => {
	if (ws) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = Cs.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, As = ws ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return Os(t);
})(e) : e, { is: js, defineProperty: Ms, getOwnPropertyDescriptor: Ns, getOwnPropertyNames: Ps, getOwnPropertySymbols: Fs, getPrototypeOf: Is } = Object, Ls = globalThis, Rs = Ls.trustedTypes, zs = Rs ? Rs.emptyScript : "", Bs = Ls.reactiveElementPolyfillSupport, Vs = (e, t) => e, Hs = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? zs : null;
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
}, Us = (e, t) => !js(e, t), Ws = {
	attribute: !0,
	type: String,
	converter: Hs,
	reflect: !1,
	useDefault: !1,
	hasChanged: Us
};
Symbol.metadata ??= Symbol("metadata"), Ls.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var Gs = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = Ws) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && Ms(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = Ns(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? Ws;
	}
	static _$Ei() {
		if (this.hasOwnProperty(Vs("elementProperties"))) return;
		let e = Is(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(Vs("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Vs("properties"))) {
			let e = this.properties, t = [...Ps(e), ...Fs(e)];
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
			for (let e of n) t.unshift(As(e));
		} else e !== void 0 && t.push(As(e));
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
		return ks(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? Hs : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? Hs : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? Us)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
Gs.elementStyles = [], Gs.shadowRootOptions = { mode: "open" }, Gs[Vs("elementProperties")] = /* @__PURE__ */ new Map(), Gs[Vs("finalized")] = /* @__PURE__ */ new Map(), Bs?.({ ReactiveElement: Gs }), (Ls.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var Ks = globalThis, qs = (e) => e, Js = Ks.trustedTypes, Ys = Js ? Js.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Xs = "$lit$", Zs = `lit$${Math.random().toFixed(9).slice(2)}$`, Qs = "?" + Zs, $s = `<${Qs}>`, ec = document, tc = () => ec.createComment(""), nc = (e) => e === null || typeof e != "object" && typeof e != "function", rc = Array.isArray, ic = (e) => rc(e) || typeof e?.[Symbol.iterator] == "function", ac = "[ 	\n\f\r]", oc = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, sc = /-->/g, cc = />/g, lc = RegExp(`>|${ac}(?:([^\\s"'>=/]+)(${ac}*=${ac}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), uc = /'/g, dc = /"/g, fc = /^(?:script|style|textarea|title)$/i, B = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), pc = Symbol.for("lit-noChange"), V = Symbol.for("lit-nothing"), mc = /* @__PURE__ */ new WeakMap(), hc = ec.createTreeWalker(ec, 129);
function gc(e, t) {
	if (!rc(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return Ys === void 0 ? t : Ys.createHTML(t);
}
var _c = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = oc;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === oc ? c[1] === "!--" ? o = sc : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = lc) : (fc.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = lc) : o = cc : o === lc ? c[0] === ">" ? (o = i ?? oc, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? lc : c[3] === "\"" ? dc : uc) : o === dc || o === uc ? o = lc : o === sc || o === cc ? o = oc : (o = lc, i = void 0);
		let d = o === lc && e[t + 1].startsWith("/>") ? " " : "";
		a += o === oc ? n + $s : l >= 0 ? (r.push(s), n.slice(0, l) + Xs + n.slice(l) + Zs + d) : n + Zs + (l === -2 ? t : d);
	}
	return [gc(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, vc = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = _c(t, n);
		if (this.el = e.createElement(l, r), hc.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = hc.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(Xs)) {
					let t = u[o++], n = i.getAttribute(e).split(Zs), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Cc : r[1] === "?" ? wc : r[1] === "@" ? Tc : Sc
					}), i.removeAttribute(e);
				} else e.startsWith(Zs) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (fc.test(i.tagName)) {
					let e = i.textContent.split(Zs), t = e.length - 1;
					if (t > 0) {
						i.textContent = Js ? Js.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], tc()), hc.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], tc());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === Qs) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(Zs, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += Zs.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = ec.createElement("template");
		return n.innerHTML = e, n;
	}
};
function yc(e, t, n = e, r) {
	if (t === pc) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = nc(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = yc(e, i._$AS(e, t.values), i, r)), t;
}
var bc = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? ec).importNode(t, !0);
		hc.currentNode = r;
		let i = hc.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new xc(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ec(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = hc.nextNode(), a++);
		}
		return hc.currentNode = ec, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, xc = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = V, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = yc(this, e, t), nc(e) ? e === V || e == null || e === "" ? (this._$AH !== V && this._$AR(), this._$AH = V) : e !== this._$AH && e !== pc && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ic(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== V && nc(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ec.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = vc.createElement(gc(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new bc(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = mc.get(e.strings);
		return t === void 0 && mc.set(e.strings, t = new vc(e)), t;
	}
	k(t) {
		rc(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(tc()), this.O(tc()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = qs(e).nextSibling;
			qs(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Sc = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = V, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = V;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = yc(this, e, t, 0), a = !nc(e) || e !== this._$AH && e !== pc, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = yc(this, r[n + o], t, o), s === pc && (s = this._$AH[o]), a ||= !nc(s) || s !== this._$AH[o], s === V ? e = V : e !== V && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === V ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Cc = class extends Sc {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === V ? void 0 : e;
	}
}, wc = class extends Sc {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== V);
	}
}, Tc = class extends Sc {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = yc(this, e, t, 0) ?? V) === pc) return;
		let n = this._$AH, r = e === V && n !== V || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== V && (n === V || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ec = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		yc(this, e);
	}
}, Dc = Ks.litHtmlPolyfillSupport;
Dc?.(vc, xc), (Ks.litHtmlVersions ??= []).push("3.3.3");
var Oc = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new xc(t.insertBefore(tc(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, kc = globalThis, H = class extends Gs {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Oc(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return pc;
	}
};
H._$litElement$ = !0, H.finalized = !0, kc.litElementHydrateSupport?.({ LitElement: H });
var Ac = kc.litElementPolyfillSupport;
Ac?.({ LitElement: H }), (kc.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var U = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, jc = {
	attribute: !0,
	type: String,
	converter: Hs,
	reflect: !1,
	hasChanged: Us
}, Mc = (e = jc, t, n) => {
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
function W(e) {
	return (t, n) => typeof n == "object" ? Mc(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function G(e) {
	return W({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Nc = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function Pc(e, t) {
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
			return Nc(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Nc(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/lit-html/directive.js
var Fc = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, Ic = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), Lc = class {
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
}, Rc = "important", zc = " !" + Rc, K = Ic(class extends Lc {
	constructor(e) {
		if (super(e), e.type !== Fc.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(zc);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? Rc : "") : n[e] = r;
			}
		}
		return pc;
	}
}), Bc = (e, t, n, r, i, a) => {
	let o = e.primitive, s = a?.fields.find((e) => e.key === t);
	if (s?.shape === "coordinate") {
		let i = N(e), a = { ...o }, c = Number(Reflect.get(a, t)), l = s.axis === "x", u = (l ? i.x : i.y) - c, d = l ? r.x : r.y, f = l ? r.width : r.height, p = l ? i.width : i.height, m = d - u, h = d + f - p - u;
		Object.assign(o, { [t]: M(n, m, Math.max(m, h)) });
		return;
	}
	if (s?.shape === "number" && s.section === "layout") {
		let e = Gi(s.min, i, n), r = Gi(s.max, i, n);
		Object.assign(o, { [t]: M(n, e, r) });
	}
}, Vc = (e, t, n, r) => {
	t === "x" && (e.x = M(n, r.x, r.x + r.width - e.width)), t === "y" && (e.y = M(n, r.y, r.y + r.height - e.height)), t === "width" && (e.width = M(n, 1, r.x + r.width - e.x)), t === "height" && (e.height = M(n, 1, r.y + r.height - e.y));
}, Hc = (e, t, n, r) => {
	if (t === "x") {
		let t = e.x_end - e.x_start;
		e.x_start = M(n, r.x, r.x + r.width - t - 1), e.x_end = e.x_start + t;
	}
	if (t === "y") {
		let t = e.y_end - e.y_start;
		e.y_start = M(n, r.y, r.y + r.height - t - 1), e.y_end = e.y_start + t;
	}
	t === "width" && (e.x_end = M(e.x_start + Math.max(1, n) - 1, e.x_start + 1, r.x + r.width - 1)), t === "height" && (e.y_end = M(e.y_start + Math.max(1, n) - 1, e.y_start + 1, r.y + r.height - 1));
}, Uc = (e, t, n, r, i) => {
	let a = ra(r);
	if (e.kind === "widget") {
		t === "padding" && (e.layout.padding = M(n, 0, 128)), Vc(e.frame, t, n, a);
		return;
	}
	if (e.kind === "container") {
		let o = {
			width: e.width,
			height: e.height
		};
		Vc(e, t, n, a), e.grouped && na(e, e.width / Math.max(1, o.width), e.height / Math.max(1, o.height), i, r.display);
		return;
	}
	let o = e.primitive;
	ri(o) ? Hc(o, t, n, a) : Bc(e, t, n, a, r.display, jo(e, i));
}, Wc = (e, t, n, r, i) => {
	let a = I(e.items, t);
	if (!a || a.item.locked) return;
	let { item: o, offset: s } = a;
	P(o, s.x, s.y), Uc(o, n, Gc(n, r, s), e, i), P(o, -s.x, -s.y);
}, Gc = (e, t, n) => e === "x" ? t + n.x : e === "y" ? t + n.y : t, Kc = (e) => e.items.forEach((t) => aa(t, e)), qc = (e, t, n) => {
	t === "padding" && (e.display.padding = M(n, 0, Math.floor((Math.min(e.display.width, e.display.height) - 1) / 2))), t === "snapSize" && (e.display.snapSize = M(n, 1, 256)), Kc(e);
}, Jc = (e, t, n) => {
	let r = L(e.items, t);
	r && (r[n] = !r[n]);
}, Yc = (e, t) => {
	wa(e, t);
}, Xc = (e, t, n, r) => {
	if (r === "inside") {
		Ca(e, t, n || void 0, P);
		return;
	}
	Oa(e, t, n, r, P);
}, Zc = (e, t, n) => {
	let r = L(e.items, t), i = n.trim();
	r && i && (r.name = i.slice(0, 100));
}, Qc = (e, t, n) => {
	let r = L(e.items, t);
	r?.kind === "widget" && (r.widget.options = {
		...r.widget.options,
		...n
	});
}, $c = (e, t, n, r) => {
	let i = L(e.items, t);
	i?.kind === "widget" && (i.widget.sources = {
		...i.widget.sources,
		[n]: r
	});
}, el = (e, t, n, r, i) => {
	let a = I(e.items, t);
	if (a?.item.kind !== "primitive" || a.item.locked) return;
	let o = a.item, s = ["x", "y"].some((e) => o.expressions?.[e]);
	if (n === "anchor" && typeof r == "string" && !s) {
		Ei(o.primitive, r, i);
		return;
	}
	o.primitive = {
		...o.primitive,
		[n]: r
	};
}, tl = (e, t, n, r) => {
	let i = L(e.items, t);
	if (i?.kind !== "primitive") return;
	let a = Go(n, jo(i, r));
	i.primitive = {
		...i.primitive,
		...a
	};
}, nl = (e, t, n, r) => {
	let i = ra(r), a = Math.min(e.layout.defaultSize?.width ?? 240, i.width), o = Math.min(e.layout.defaultSize?.height ?? 144, i.height);
	return {
		id: Ur(),
		name: Vr(ga(r.items), e.id),
		kind: "widget",
		locked: !1,
		hidden: !1,
		widget: {
			type: e.id,
			version: e.version,
			sources: Object.fromEntries(e.sources.map((e) => [e.key, []])),
			options: ps(e)
		},
		frame: {
			x: M(Math.round(t - a / 2), i.x, i.x + i.width - a),
			y: M(Math.round(n - o / 2), i.y, i.y + i.height - o),
			width: a,
			height: o
		},
		layout: { padding: 0 }
	};
}, rl = (e, t, n, r, i) => {
	let { width: a, height: o } = i.display, s = Yi(e.find((e) => e.type === t.trim()), {
		x: Math.round(a / 2),
		y: Math.round(o / 2),
		displayWidth: a,
		displayHeight: o
	});
	if (!s) return;
	let c = {
		id: Ur(),
		name: Vr(ga(i.items), s.type),
		kind: "primitive",
		locked: !1,
		hidden: !1,
		primitive: s
	}, l = N(c);
	return P(c, Math.round(n - (l.x + l.width / 2)), Math.round(r - (l.y + l.height / 2))), aa(c, i), c;
}, il = (e, t) => {
	let n = ra(e), r = ga(e.items).length * Math.max(e.display.snapSize, 5) * 3 % Math.max(1, Math.min(n.width, n.height) / 3);
	return {
		x: ia(n.x + Math.min(24 + r, Math.max(0, n.width - 1)), e, t),
		y: ia(n.y + Math.min(24 + r, Math.max(0, n.height - 1)), e, t)
	};
}, al = (e, t) => {
	if (t === "visible") return !e.hidden;
	if (e.kind === "primitive") return Object.entries(e.primitive).find(([e]) => e === t)?.[1];
}, ol = (e, t, n, r) => {
	let i = L(e.items, t);
	if (!i || i.locked) return;
	let a = { ...i.expressions };
	r === null ? delete a[n] : a[n] = r ?? bo(al(i, n)), Object.keys(a).length === 0 ? delete i.expressions : i.expressions = a;
}, sl = (e) => ({
	canUndo: !1,
	canRedo: !1,
	item: e,
	targets: [e],
	canGroup: e.kind === "container" && !e.grouped,
	canUngroup: e.kind === "container" && e.grouped,
	canEnter: e.kind === "container" && e.grouped
}), cl = (e) => e.targets ?? (e.item ? [e.item] : []), ll = (e) => cl(e).length > 0, ul = (e, t) => {
	let n = cl(e).map((e) => e.id);
	n.length > 0 && t(n);
}, dl = {
	left: {
		key: "ArrowLeft",
		icon: "mdi:arrow-left"
	},
	right: {
		key: "ArrowRight",
		icon: "mdi:arrow-right"
	},
	up: {
		key: "ArrowUp",
		icon: "mdi:arrow-up"
	},
	down: {
		key: "ArrowDown",
		icon: "mdi:arrow-down"
	}
}, fl = [
	{
		id: "undo",
		group: "history",
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
		group: "history",
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
		group: "edit",
		label: () => t.commands.delete,
		icon: () => "mdi:delete-outline",
		shortcuts: [{ key: "Delete" }, { key: "Backspace" }],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.requestDelete(e))
	},
	{
		id: "toggle-hidden",
		group: "edit",
		label: ({ item: e }) => e?.hidden ? t.commands.show : t.commands.hide,
		icon: ({ item: e }) => e?.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline",
		shortcuts: [],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.toggleFlag(e, "hidden"))
	},
	{
		id: "toggle-locked",
		group: "edit",
		label: ({ item: e }) => e?.locked ? t.commands.unlock : t.commands.lock,
		icon: ({ item: e }) => e?.locked ? "mdi:lock" : "mdi:lock-open-variant-outline",
		shortcuts: [],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.toggleFlag(e, "locked"))
	},
	{
		id: "copy",
		group: "edit",
		label: () => t.commands.copy,
		icon: () => "mdi:content-copy",
		shortcuts: [{
			key: "c",
			mod: !0
		}],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.copy(e))
	},
	{
		id: "cut",
		group: "edit",
		label: () => t.commands.cut,
		icon: () => "mdi:content-cut",
		shortcuts: [{
			key: "x",
			mod: !0
		}],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.cut(e))
	},
	{
		id: "paste",
		group: "edit",
		label: () => t.commands.paste,
		icon: () => "mdi:content-paste",
		shortcuts: [{
			key: "v",
			mod: !0
		}],
		isEnabled: (e) => !!e.canPaste,
		run: (e, t) => t.paste()
	},
	{
		id: "paste-here",
		group: "edit",
		label: () => t.commands.pasteHere,
		icon: () => "mdi:content-paste",
		shortcuts: [],
		isEnabled: (e) => !!e.canPaste,
		run: (e, t) => t.pasteHere()
	},
	{
		id: "duplicate",
		group: "edit",
		label: () => t.commands.duplicate,
		icon: () => "mdi:content-duplicate",
		shortcuts: [{
			key: "d",
			mod: !0
		}],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.duplicate(e))
	},
	{
		id: "rename",
		group: "edit",
		label: () => t.commands.rename,
		icon: () => "mdi:pencil-outline",
		shortcuts: [{ key: "F2" }],
		isEnabled: (e) => e.item !== void 0,
		run: ({ item: e }, t) => {
			e && t.rename(e.id);
		}
	},
	{
		id: "bring-to-front",
		group: "arrange",
		label: () => t.commands.bringToFront,
		icon: () => "mdi:arrange-bring-to-front",
		shortcuts: [],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.arrange(e, "front"))
	},
	{
		id: "send-to-back",
		group: "arrange",
		label: () => t.commands.sendToBack,
		icon: () => "mdi:arrange-send-to-back",
		shortcuts: [],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.arrange(e, "back"))
	},
	{
		id: "move-up",
		group: "arrange",
		label: () => t.commands.moveUp,
		icon: () => "mdi:arrow-up",
		shortcuts: [],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.arrange(e, "up"))
	},
	{
		id: "move-down",
		group: "arrange",
		label: () => t.commands.moveDown,
		icon: () => "mdi:arrow-down",
		shortcuts: [],
		isEnabled: ll,
		run: (e, t) => ul(e, (e) => t.arrange(e, "down"))
	},
	...Object.keys(dl).flatMap((e) => [!1, !0].map((n) => ({
		id: n ? `nudge-${e}-snap` : `nudge-${e}`,
		group: "arrange",
		label: () => t.commands.nudge[e],
		icon: () => dl[e].icon,
		shortcuts: [{
			key: dl[e].key,
			shift: n
		}],
		isEnabled: ll,
		isRelevant: () => !1,
		run: (t, r) => ul(t, (t) => r.nudge(t, e, n))
	}))),
	{
		id: "group",
		group: "group",
		label: () => t.commands.group,
		icon: () => "mdi:group",
		shortcuts: [{
			key: "g",
			mod: !0
		}],
		isEnabled: (e) => !!e.canGroup,
		isRelevant: (e) => !!e.canGroup,
		run: (e, t) => ul(e, (e) => t.group(e))
	},
	{
		id: "ungroup",
		group: "group",
		label: () => t.commands.ungroup,
		icon: () => "mdi:ungroup",
		shortcuts: [{
			key: "g",
			mod: !0,
			shift: !0
		}],
		isEnabled: (e) => !!e.canUngroup,
		isRelevant: (e) => !!e.canUngroup,
		run: ({ item: e }, t) => {
			e && t.ungroup(e.id);
		}
	},
	{
		id: "enter-group",
		group: "group",
		label: () => t.commands.enterGroup,
		icon: () => "mdi:login-variant",
		shortcuts: [{ key: "Enter" }],
		isEnabled: (e) => !!e.canEnter,
		isRelevant: (e) => !!e.canEnter,
		run: ({ item: e }, t) => {
			e && t.enterGroup(e.id);
		}
	},
	{
		id: "exit-group",
		group: "group",
		label: () => t.commands.exitGroup,
		icon: () => "mdi:logout-variant",
		shortcuts: [{ key: "Escape" }],
		isEnabled: (e) => !!e.entered,
		isRelevant: (e) => !!e.entered,
		run: (e, t) => t.exitGroup()
	},
	{
		id: "deselect",
		group: "edit",
		label: () => t.commands.deselect,
		icon: () => "mdi:selection-off",
		shortcuts: [{ key: "Escape" }],
		isEnabled: ll,
		isRelevant: () => !1,
		run: (e, t) => t.deselect()
	},
	{
		id: "save",
		group: "view",
		label: () => t.commands.save,
		icon: () => "mdi:content-save-outline",
		shortcuts: [{
			key: "s",
			mod: !0
		}],
		anywhere: !0,
		isEnabled: (e) => !!e.dirty,
		run: (e, t) => t.save()
	},
	{
		id: "toggle-code",
		group: "view",
		label: () => t.commands.toggleCode,
		icon: () => "mdi:code-tags",
		shortcuts: [{
			key: "e",
			mod: !0
		}],
		anywhere: !0,
		isEnabled: () => !0,
		run: (e, t) => t.toggleCode()
	},
	{
		id: "zoom-in",
		group: "view",
		label: () => t.commands.zoomIn,
		icon: () => "mdi:magnify-plus-outline",
		shortcuts: [{
			key: "=",
			mod: !0
		}, {
			key: "+",
			mod: !0
		}],
		isEnabled: () => !0,
		run: (e, t) => t.zoom("in")
	},
	{
		id: "zoom-out",
		group: "view",
		label: () => t.commands.zoomOut,
		icon: () => "mdi:magnify-minus-outline",
		shortcuts: [{
			key: "-",
			mod: !0
		}],
		isEnabled: () => !0,
		run: (e, t) => t.zoom("out")
	},
	{
		id: "zoom-reset",
		group: "view",
		label: () => t.commands.zoomReset,
		icon: () => "mdi:magnify-scan",
		shortcuts: [{
			key: "0",
			mod: !0
		}],
		isEnabled: () => !0,
		run: (e, t) => t.zoom("reset")
	},
	{
		id: "show-shortcuts",
		group: "view",
		label: () => t.commands.showShortcuts,
		icon: () => "mdi:keyboard-outline",
		shortcuts: [{ key: "?" }],
		anywhere: !0,
		isEnabled: () => !0,
		run: (e, t) => t.showShortcuts()
	}
], pl = (e) => fl.some((t) => t.id === e), ml = (e) => {
	let t = fl.find((t) => t.id === e);
	if (!t) throw Error(`Unknown command ${e}`);
	return t;
}, hl = (e, t) => {
	let n = t.ctrlKey || t.metaKey;
	return t.key.toLowerCase() === e.key.toLowerCase() && n === !!e.mod && (t.shiftKey === !!e.shift || gl(e)) && !t.altKey;
}, gl = (e) => e.key === "?" || e.key === "+", _l = (e, t) => {
	let n = fl.filter((t) => t.shortcuts.some((t) => hl(t, e)));
	return t ? n.find((e) => e.isEnabled(t)) : n[0];
}, vl = {
	Delete: "Del",
	Backspace: "⌫",
	Escape: "Esc",
	ArrowLeft: "←",
	ArrowRight: "→",
	ArrowUp: "↑",
	ArrowDown: "↓"
}, yl = (e, t) => {
	let n = vl[e.key] ?? e.key.toUpperCase();
	return t ? `${e.mod ? "⌘" : ""}${e.shift ? "⇧" : ""}${n}` : [
		e.mod ? "Ctrl" : "",
		e.shift ? "Shift" : "",
		n
	].filter(Boolean).join("+");
}, bl = (e, t, n = !1) => {
	let r = e.label(t), [i] = e.shortcuts, a = i ? yl(i, n) : "";
	return {
		label: r,
		icon: e.icon(t),
		title: a ? `${r} (${a})` : r,
		shortcut: a,
		enabled: e.isEnabled(t)
	};
}, xl = [
	[
		"copy",
		"cut",
		"paste",
		"duplicate"
	],
	["delete-item"],
	["bring-to-front", "send-to-back"],
	[
		"group",
		"ungroup",
		"enter-group",
		"exit-group"
	]
], Sl = [
	[
		"copy",
		"cut",
		"paste"
	],
	["move-up", "move-down"],
	["toggle-hidden", "toggle-locked"],
	["delete-item"],
	["rename"],
	[
		"group",
		"ungroup",
		"enter-group",
		"exit-group"
	]
], Cl = [["paste", "paste-here"]], wl = (e, t, n) => e.flatMap((e, r) => e.map((e) => ml(e)).filter((e) => e.isRelevant?.(t) ?? !0).map((e, i) => {
	let a = bl(e, t, n);
	return {
		id: e.id,
		label: a.label,
		icon: a.icon,
		shortcut: a.shortcut,
		disabled: !a.enabled,
		danger: e.id === "delete-item",
		separatorBefore: i === 0 && r > 0
	};
})), Tl = [
	0,
	90,
	180,
	270
], El = (e) => Tl.some((t) => t === e), Dl = (e) => e === 90 || e === 270, Ol = (e, t) => Dl(t) ? {
	width: e.height,
	height: e.width
} : {
	width: e.width,
	height: e.height
}, kl = (e, t, n) => Dl(t) === Dl(n) ? e : {
	width: e.height,
	height: e.width
}, Al = (e, t) => {
	let n = Number(e);
	return El(n) ? n : t;
}, jl = (e, t = "custom") => {
	let n = Rr(t);
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
			snapSize: 5,
			rotation: 0,
			deviceId: null
		},
		items: [],
		createdAt: "",
		updatedAt: ""
	};
}, Ml = (e) => ({
	name: e.name,
	width: e.display.width,
	height: e.display.height,
	palette: e.display.palette,
	background: e.display.background,
	rotation: String(e.display.rotation),
	padding: e.display.padding,
	snapSize: e.display.snapSize
}), Nl = (e, t) => {
	let n = structuredClone(e);
	return Object.assign(n.display, t), Mr[t.palette].includes(n.display.background) || (n.display.background = "white"), n;
}, Pl = (e, t) => Nl(e, {
	profileId: "custom",
	deviceId: t.id,
	...Ol(t, e.display.rotation),
	palette: t.palette
}), Fl = (e, t, n = t.defaultPalette) => Nl(e, {
	profileId: t.id,
	deviceId: null,
	...Ol(t, e.display.rotation),
	palette: t.palettes.includes(n) ? n : t.defaultPalette
}), Il = (e, t) => {
	let n = {
		...Ml(e),
		...t
	}, r = structuredClone(e);
	r.name = String(n.name);
	let i = {
		width: Math.round(Number(n.width) || 0),
		height: Math.round(Number(n.height) || 0)
	}, a = i.width !== e.display.width || i.height !== e.display.height, o = Al(n.rotation, e.display.rotation), s = a ? i : kl(i, e.display.rotation, o);
	a && (r.display.profileId = "custom", r.display.deviceId = null), r.display.width = s.width, r.display.height = s.height, r.display.rotation = o, r.display.palette = n.palette in jr ? n.palette : "bw", r.display.padding = Math.round(Number(n.padding) || 0), r.display.snapSize = Math.round(Number(n.snapSize) || 0);
	let c = Mr[r.display.palette];
	return r.display.background = c.includes(n.background) ? n.background : "white", r;
}, Ll = (e) => {
	let { width: t, height: n, padding: r, snapSize: i } = e.display;
	return !!e.name.trim() && t >= 64 && t <= 4096 && n >= 64 && n <= 4096 && r >= 0 && r * 2 < Math.min(t, n) && i >= 1 && i <= 256;
}, Rl = (e, t, n, r) => {
	let i = t.trim().toLocaleLowerCase(r);
	return e.filter((e) => !i || e.name.toLocaleLowerCase(r).includes(i)).sort((e, t) => n === "name" ? e.name.localeCompare(t.name, r) : t.updatedAt.localeCompare(e.updatedAt) || e.name.localeCompare(t.name, r));
}, zl = (e, t, n) => {
	let r = new Set(t.map((e) => e.name.toLocaleLowerCase(n))), i = `${e.name} copy`, a = i, o = 2;
	for (; r.has(a.toLocaleLowerCase(n));) a = `${i} ${o++}`;
	return a;
}, Bl = Object.keys(jr).filter(zr), Vl = Lr.filter((e) => e.id !== "custom"), Hl = {
	size: !0,
	palettes: Bl,
	backgrounds: []
}, Ul = (e) => ({
	...Hl,
	backgrounds: Mr[e.display.palette]
}), Wl = (e, t) => ({
	name: e,
	label: t,
	required: !0,
	selector: { number: {
		mode: "box",
		min: 64,
		max: 4096,
		unit_of_measurement: "px"
	} }
}), Gl = () => [{
	name: "dimensions",
	type: "grid",
	flatten: !0,
	schema: [Wl("width", t.fields.width), Wl("height", t.fields.height)]
}], Kl = (e) => [{
	name: "palette",
	label: t.fields.palette,
	required: !0,
	selector: { select: {
		mode: "dropdown",
		options: e.map((e) => ({
			value: e,
			label: jr[e]
		}))
	} }
}], ql = (e) => [{
	name: "background",
	label: t.fields.background,
	required: !0,
	selector: { select: {
		mode: "dropdown",
		options: e.map((e) => ({
			value: e,
			label: `${e[0].toUpperCase()}${e.slice(1)}`
		}))
	} }
}], Jl = () => [{
	name: "rotation",
	label: t.fields.rotation,
	required: !0,
	selector: { select: {
		mode: "dropdown",
		options: Tl.map((e) => ({
			value: String(e),
			label: t.rotations[e]
		}))
	} }
}], Yl = () => [{
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
}], Xl = (e = Hl) => [
	{
		name: "name",
		label: t.fields.name,
		required: !0,
		selector: { text: {} }
	},
	...e.size ? Gl() : [],
	...e.palettes.length > 1 ? Kl(e.palettes) : [],
	...e.backgrounds.length > 0 ? ql(e.backgrounds) : [],
	...Jl(),
	...Yl()
], Zl = (e) => "label" in e ? e.label : e.title ?? "", Ql = {
	bwr: "#d32f2f",
	bwry: "#d32f2f",
	bwy: "#d6a800",
	spectra6: "#246bfd",
	seven_color: "#ff8000"
}, $l = (e) => Ql[e] ?? "#202124", eu = (e, t) => {
	let n = new Date(e.updatedAt);
	return Number.isNaN(n.getTime()) ? "" : new Intl.DateTimeFormat(t, { dateStyle: "medium" }).format(n);
}, tu = (e) => e.target.value, nu = (e) => e.composedPath().some((e) => e instanceof HTMLElement && (e.matches("input, textarea, select") || e.isContentEditable)), ru = () => /Mac|iPhone|iPad/.test(navigator.platform), q = (e, t, ...n) => {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n[0],
		bubbles: !0,
		composed: !0
	}));
}, iu = 100, au = class {
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
		this.undoStack.push(structuredClone(e)), this.undoStack.length > iu && this.undoStack.shift(), this.redoStack = [];
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
}, ou = (e, t) => {
	let n = I(e.items, t);
	if (!n) return;
	let { parent: r } = n;
	return r ? {
		x: 0,
		y: 0,
		width: r.width,
		height: r.height
	} : ra(e);
}, su = (e, t, n, r) => {
	let i = I(e.items, t), a = ou(e, t);
	if (!i || !a || i.item.locked) return;
	let o = N(i.item, r), s = ti(n, "lt"), c = a.x + (a.width - o.width) * s.x, l = a.y + (a.height - o.height) * s.y;
	P(i.item, Math.round(c - o.x), Math.round(l - o.y));
}, cu = (e) => e.callWS({
	type: "opendisplay_studio/bootstrap",
	language: e.language
}), lu = (e) => e.callWS({
	type: "opendisplay_studio/reload_widgets",
	language: e.language
}), uu = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/create_dashboard",
	dashboard: t
})).dashboard, du = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/update_dashboard",
	dashboard_id: t.id,
	dashboard: t
})).dashboard, fu = async (e, t) => {
	await e.callWS({
		type: "opendisplay_studio/delete_dashboard",
		dashboard_id: t
	});
}, pu = (e, t) => e.callWS({
	type: "opendisplay_studio/compose_preview",
	dashboard: structuredClone(t)
}), mu = async (e) => (await e.callWS({ type: "opendisplay_studio/list_devices" })).devices, hu = async (e, t) => {
	await e.callWS({
		type: "opendisplay_studio/send_to_device",
		dashboard: structuredClone(t)
	});
}, J = z`
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
`, gu = z`
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
`, _u = z`
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
`, vu = z`
  .box {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--studio-border);
    border-radius: 7px;
    background: var(--secondary-background-color, #f3f5f6);
    color: var(--studio-text);
  }
  .box:hover {
    border-color: color-mix(
      in srgb,
      var(--studio-text) 25%,
      var(--studio-border)
    );
  }
  .box:focus-within {
    border-color: var(--primary-color);
  }
  .box.disabled {
    opacity: 0.55;
  }
  .box .inner-label,
  .box .unit {
    flex: none;
    color: var(--studio-muted);
    font-size: 10px;
  }
  .box input,
  .box select {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: 12px;
  }
  .box input.mono {
    font-family: var(--code-font-family, monospace);
  }
  .field-label {
    display: block;
    margin-bottom: 4px;
    color: var(--studio-muted);
    font-size: 11px;
    font-weight: 500;
  }
  textarea.compact {
    display: block;
    width: 100%;
    min-height: 56px;
    padding: 8px;
    border: 1px solid var(--studio-border);
    border-radius: 7px;
    background: var(--secondary-background-color, #f3f5f6);
    color: var(--studio-text);
    font-size: 12px;
    resize: vertical;
  }
  textarea.compact.mono {
    font-family: var(--code-font-family, monospace);
  }
  textarea.compact:focus {
    border-color: var(--primary-color);
    outline: 0;
  }
  .segmented {
    display: flex;
    height: 28px;
    padding: 2px;
    border: 1px solid var(--studio-border);
    border-radius: 7px;
    background: var(--secondary-background-color, #f3f5f6);
  }
  .segmented button {
    flex: 1;
    min-width: 0;
    border: 0;
    border-radius: 5px;
    background: transparent;
    color: var(--studio-muted);
    font-size: 11px;
    font-weight: 500;
  }
  .segmented button[aria-pressed="true"] {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
  }
`, yu = Ic(class extends Lc {
	constructor(e) {
		if (super(e), e.type !== Fc.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
		return pc;
	}
}), bu = 2, xu = (e, t) => t === "x" ? e.x : e.y, Su = (e, t) => t === "x" ? e.width : e.height, Cu = (e, t) => {
	let n = xu(e, t), r = Su(e, t);
	return [
		n,
		n + r / 2,
		n + r
	];
}, wu = (e, t, n) => {
	let r = [], i = (t, i, a) => {
		for (let o of Cu(t, n)) for (let t of Cu(e, n)) {
			let e = Math.abs(o - t);
			e <= i && r.push({
				offset: o - t,
				distance: e,
				source: a
			});
		}
	};
	return t.siblings.forEach((e) => i(e, 5, "sibling")), i(t.parent, 8, "parent"), r.sort(Eu)[0];
}, Tu = (e) => e.distance - (e.source === "parent" ? bu : 0), Eu = (e, t) => Tu(e) - Tu(t) || Number(t.source === "parent") - Number(e.source === "parent"), Du = (e, t) => ({
	dx: wu(e, t, "x")?.offset ?? 0,
	dy: wu(e, t, "y")?.offset ?? 0
}), Ou = .5, ku = (e, t) => {
	let n = [], r = [...t.siblings, t.parent];
	for (let t of ["x", "y"]) {
		let i = t === "x" ? "y" : "x";
		for (let a of Cu(e, t)) {
			let o = r.filter((e) => Cu(e, t).some((e) => Math.abs(e - a) < Ou));
			if (o.length === 0) continue;
			let s = [e, ...o].map((e) => [xu(e, i), xu(e, i) + Su(e, i)]);
			n.push({
				axis: t,
				position: a,
				from: Math.min(...s.map(([e]) => e)),
				to: Math.max(...s.map(([, e]) => e))
			});
		}
	}
	return Au(n);
}, Au = (e) => e.filter((t, n) => e.findIndex((e) => e.axis === t.axis && Math.abs(e.position - t.position) < Ou) === n), ju = (e, t, n) => n?.absolute ? {
	x: n.x,
	y: n.y,
	width: n.width,
	height: n.height
} : ba(N(e, n), t), Mu = (e, t, n) => t.flatMap((t) => {
	let r = I(e.items, t);
	return r ? [{
		original: structuredClone(r.item),
		offset: r.offset,
		measured: n(r.item)
	}] : [];
}), Nu = (e) => Ha(e.map((e) => ba(N(e.original, e.measured), e.offset))), Pu = (e, t, n, r) => {
	let i = I(e.items, n);
	if (!i) return;
	let a = i.parent?.id, o = ka(e.items).filter((e) => e.parent?.id === a).filter((e) => !e.item.hidden).filter((e) => !t.includes(e.item.id)).flatMap((e) => {
		let t = F(e.item) ? Aa(e) : ba(N(e.item, r(e.item)), e.offset);
		return t ? [t] : [];
	}), s = i.parent ? Fu(e, i.parent.id) : ra(e);
	return s ? {
		siblings: o,
		parent: s
	} : void 0;
}, Fu = (e, t) => {
	let n = I(e.items, t);
	return n && F(n.item) ? ba(N(n.item), n.offset) : void 0;
}, Iu = (e, t, n, r, i, a, o) => {
	let s = e.find((e) => e.original.id === t);
	if (!s) return [];
	let c = da(s.original, { mode: "move" }, n, r, i, {
		snapEnabled: a,
		offset: s.offset,
		measured: s.measured
	}), l = N(s.original, s.measured), u = N(c, s.measured), d = u.x - l.x, f = u.y - l.y;
	if (o && a && !s.original.locked) {
		let t = Nu(e), i = Du({
			...t,
			x: t.x + n,
			y: t.y + r
		}, o);
		i.dx !== 0 && (d = n + i.dx), i.dy !== 0 && (f = r + i.dy);
	}
	return e.map((e) => {
		if (e.original.id === t && d === u.x - l.x && f === u.y - l.y) return c;
		let n = structuredClone(e.original);
		return n.locked || P(n, d, f), n;
	});
}, Lu = (e, t, n) => {
	let r = e.flatMap((e) => {
		let n = t.find((t) => t.id === e.original.id);
		return n ? [ba(N(n, e.measured), e.offset)] : [];
	});
	return r.length > 0 ? ku(Ha(r), n) : [];
}, Ru = (e, t, n) => {
	let r = I(e.items, t);
	if (r) return ju(r.item, r.offset, n(r.item));
}, zu = (e, t, n) => {
	let r = t.flatMap((t) => Ru(e, t, n) ?? []);
	return r.length > 0 ? Ha(r) : void 0;
}, Bu = (e, t, n, r) => {
	let i = n ? I(e.items, n)?.item : void 0, a = i && F(i) ? i.id : void 0;
	return ka(e.items).filter((e) => (e.parent?.id ?? void 0) === a).filter((e) => !e.item.hidden).filter((e) => {
		let n = F(e.item) ? Aa(e) : ju(e.item, e.offset, r(e.item));
		return n !== void 0 && Sa(n, t);
	}).map((e) => e.item.id);
}, Vu = (e, t) => ({
	x: Math.min(e.x, t.x),
	y: Math.min(e.y, t.y),
	width: Math.abs(t.x - e.x),
	height: Math.abs(t.y - e.y)
}), Hu = (e) => {
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
function Y(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/ods-zoom-bar.ts
var Uu = [
	.5,
	1,
	2,
	3
], Wu = .25, Gu = class extends H {
	constructor(...e) {
		super(...e), this.zoom = 1;
	}
	static {
		this.styles = [J, z`
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
		q(this, "zoom-change", { zoom: e });
	}
	render() {
		return B`
      <div class="zoom-controls">
        <button
          aria-label=${t.zoom.out}
          @click=${() => this.zoomTo(this.zoom - Wu)}
        >
          −
        </button>
        ${Uu.map((e) => B`
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
          @click=${() => this.zoomTo(this.zoom + Wu)}
        >
          +
        </button>
        <button
          aria-label=${t.zoom.reset}
          @click=${() => q(this, "zoom-reset")}
        >
          ${t.zoom.reset}
        </button>
        <button
          aria-label=${t.zoom.fit}
          @click=${() => q(this, "zoom-fit")}
        >
          ${t.zoom.fit}
        </button>
      </div>
    `;
	}
};
Y([W({ type: Number })], Gu.prototype, "zoom", void 0), Gu = Y([U("ods-zoom-bar")], Gu);
//#endregion
//#region src/ods-canvas.ts
var Ku = 3, qu = (e, t) => ({
	left: `${e.x / t.width * 100}%`,
	top: `${e.y / t.height * 100}%`,
	width: `${e.width / t.width * 100}%`,
	height: `${e.height / t.height * 100}%`
}), X = class extends H {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.selectedItemIds = [], this.enteredGroupId = "", this.snapEnabled = !0, this.acceptingDrop = !1, this.canUndo = !1, this.canRedo = !1, this.viewport = is, this.dropContainerId = "", this.guides = [], this.measure = (e) => {
			let t = this.measureSize(e);
			return t && this.isPlacedByExpression(e) ? {
				...t,
				absolute: !0
			} : t;
		}, this.measureSize = (e) => {
			let t = this.resizing;
			if (t?.original.id === e.id) return this.remeasure(t.original, e, t.measured);
			let n = this.preview?.itemBounds[e.id];
			if (!n || e.kind !== "primitive") return n;
			let r = L(this.preview?.composedFrom.items ?? [], e.id);
			return this.remeasure(r, e, n);
		};
	}
	static {
		this.styles = [J, z`
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
      .selection.container {
        z-index: 2;
        border-color: transparent;
      }
      .selection.container:hover {
        border-color: rgba(3, 169, 244, 0.5);
      }
      .selection.holds-selection {
        border: 1px solid rgba(3, 169, 244, 0.7);
      }
      .selection.group {
        border-style: dashed;
      }
      .selection.entered {
        border: 2px dashed #00aef0;
        background: rgba(3, 169, 244, 0.05);
      }
      .selection.drop-target {
        border: 2px solid #00aef0;
        background: rgba(3, 169, 244, 0.14);
      }
      .group-hint {
        position: absolute;
        left: 0;
        bottom: calc(100% + 6px);
        min-width: max-content;
        padding: 2px 7px;
        border-radius: 4px;
        color: #fff;
        background: #283746;
        font-size: 10px;
        pointer-events: none;
      }
      .multi-selection {
        position: absolute;
        z-index: 5;
        border: 2px dashed #00aef0;
        pointer-events: none;
      }
      .guide {
        position: absolute;
        z-index: 7;
        border: 0 dashed #e91e8c;
        pointer-events: none;
      }
      .guide.vertical {
        width: 0;
        border-left-width: 1px;
      }
      .guide.horizontal {
        height: 0;
        border-top-width: 1px;
      }
      .marquee {
        position: absolute;
        z-index: 6;
        border: 1px solid #00aef0;
        background: rgba(0, 174, 240, 0.12);
        pointer-events: none;
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
		q(this, "viewport-change", e);
	}
	resetView() {
		this.setViewport(is);
	}
	fitView() {
		let e = this.stage;
		e && this.setViewport(os({
			width: e.clientWidth,
			height: e.clientHeight
		}, this.dashboard.display));
	}
	onWheel(e) {
		e.preventDefault(), this.setViewport(ss(this.viewport, e));
	}
	isPlacedByExpression(e) {
		let t = $o(e, this.primitives);
		return t.position.length > 0 || t.handles.length > 0;
	}
	remeasure(e, t, n) {
		return !n || e?.kind !== "primitive" || t.kind !== "primitive" ? n : wi(e.primitive, t.primitive, n);
	}
	clampedPointAt(e, t) {
		let n = this.canvas;
		if (!n) return;
		let r = n.getBoundingClientRect(), { width: i, height: a } = this.dashboard.display, o = (e - r.left) / r.width * i, s = (t - r.top) / r.height * a;
		return {
			x: Math.min(i, Math.max(0, o)),
			y: Math.min(a, Math.max(0, s))
		};
	}
	targetOf(e) {
		let t = Da(this.dashboard.items, e.id, this.enteredGroupId || void 0);
		return L(this.dashboard.items, t) ?? e;
	}
	onItemPointerDown(e, t) {
		e.stopPropagation(), e.preventDefault();
		let n = this.targetOf(t);
		if (e.shiftKey) {
			q(this, "item-select", {
				itemId: n.id,
				additive: !0
			});
			return;
		}
		let r = this.selectedItemIds.includes(n.id);
		r || q(this, "item-select", { itemId: n.id });
		let i = r && this.selectedItemIds.length > 1 ? this.selectedItemIds : [n.id];
		this.beginMove(e, n, i);
	}
	onHandlePointerDown(e, t, n) {
		e.stopPropagation(), e.preventDefault(), q(this, "item-select", { itemId: t.id });
		let r = $o(t, this.primitives);
		t.locked || r.handles.includes(n) || this.beginResize(e, t, n);
	}
	beginMove(e, t, n) {
		let r = $o(t, this.primitives);
		if (t.locked || r.position.length > 0) return;
		this.stopGesture?.();
		let i = structuredClone(this.dashboard), a = Mu(this.dashboard, n, this.measure), o = Pu(this.dashboard, n, t.id, this.measure), s = {
			clientX: e.clientX,
			clientY: e.clientY
		};
		this.stopGesture = Hu({
			origin: e,
			threshold: Ku,
			onMove: (r) => {
				s = {
					clientX: r.clientX,
					clientY: r.clientY
				};
				let { dx: i, dy: c } = this.displayDelta(e, r), l = this.snapEnabled && !r.ctrlKey && !r.metaKey, u = Iu(a, t.id, i, c, this.dashboard, l, o);
				this.guides = l && o ? Lu(a, u, o) : [], q(this, "items-transform", { items: u }), this.updateDropContainer(s, n);
			},
			onEnd: (e, r) => {
				if (this.dropContainerId = "", this.guides = [], !r) return;
				let a = this.clampedPointAt(s.clientX, s.clientY), o = n.length === 1 && a ? {
					itemId: t.id,
					x: a.x,
					y: a.y
				} : void 0;
				q(this, "item-transform-end", {
					before: i,
					drop: o
				});
			},
			onCancel: () => {
				this.dropContainerId = "", this.guides = [];
			}
		});
	}
	beginResize(e, t, n) {
		this.stopGesture?.();
		let r = structuredClone(this.dashboard), i = structuredClone(t), a = I(this.dashboard.items, t.id), o = this.measure(t);
		this.resizing = {
			original: i,
			measured: o
		};
		let s = t.kind === "widget" ? this.widgets.find((e) => e.id === t.widget.type)?.layout.minSize : void 0;
		this.stopGesture = Hu({
			origin: e,
			threshold: Ku,
			onMove: (t) => {
				let { dx: r, dy: c } = this.displayDelta(e, t), l = {
					mode: "resize",
					handle: n,
					shiftKey: t.shiftKey
				};
				q(this, "items-transform", { items: [da(i, l, r, c, this.dashboard, {
					snapEnabled: this.snapEnabled,
					minSize: s,
					measured: o,
					definitions: this.primitives,
					offset: a?.offset
				})] });
			},
			onEnd: (e, t) => {
				this.resizing = void 0, t && q(this, "item-transform-end", { before: r });
			},
			onCancel: () => {
				this.resizing = void 0;
			}
		});
	}
	displayDelta(e, t) {
		let n = this.canvas;
		if (!n) return {
			dx: 0,
			dy: 0
		};
		let r = n.getBoundingClientRect(), { width: i, height: a } = this.dashboard.display;
		return {
			dx: Math.round((t.clientX - e.clientX) / r.width * i),
			dy: Math.round((t.clientY - e.clientY) / r.height * a)
		};
	}
	updateDropContainer(e, t) {
		let n = this.clampedPointAt(e.clientX, e.clientY);
		if (!n || t.length !== 1) {
			this.dropContainerId = "";
			return;
		}
		let r = ja(this.dashboard.items, n.x, n.y, t, this.enteredGroupId || void 0), i = I(this.dashboard.items, t[0] ?? "")?.parent;
		this.dropContainerId = r && r.id !== i?.id ? r.id : "";
	}
	onCanvasPointerDown(e) {
		let t = this.clampedPointAt(e.clientX, e.clientY);
		if (!t) return;
		let n = e.shiftKey, r = n ? this.selectedItemIds : [];
		this.stopGesture?.(), this.stopGesture = Hu({
			origin: e,
			threshold: Ku,
			onMove: (e) => {
				let n = this.clampedPointAt(e.clientX, e.clientY);
				if (!n) return;
				let i = Vu(t, n);
				this.marquee = i;
				let a = Bu(this.dashboard, i, this.enteredGroupId || void 0, this.measure);
				q(this, "selection-change", { itemIds: [.../* @__PURE__ */ new Set([...r, ...a])] });
			},
			onEnd: (e, t) => {
				this.marquee = void 0, !t && !n && this.deselect();
			},
			onCancel: () => {
				this.marquee = void 0;
			}
		});
	}
	onItemContextMenu(e, t) {
		e.preventDefault(), e.stopPropagation(), q(this, "context-menu", {
			source: "canvas",
			itemId: this.targetOf(t).id,
			clientX: e.clientX,
			clientY: e.clientY
		});
	}
	onCanvasContextMenu(e) {
		e.preventDefault(), q(this, "context-menu", {
			source: "empty",
			clientX: e.clientX,
			clientY: e.clientY,
			point: this.clampedPointAt(e.clientX, e.clientY)
		});
	}
	onItemDoubleClick(e, t) {
		e.stopPropagation();
		let n = this.targetOf(t);
		F(n) && n.grouped && q(this, "group-enter", { groupId: n.id });
	}
	runCommand(e) {
		q(this, "command", { id: e });
	}
	toggleSnap() {
		q(this, "snap-toggle");
	}
	deselect() {
		q(this, "item-select", { itemId: "" });
	}
	onStageDragOver(e) {
		this.acceptingDrop && e.preventDefault();
	}
	onStageDrop(e) {
		e.preventDefault();
	}
	onZoomChange(e) {
		e.stopPropagation(), this.setViewport(as(this.viewport, e.detail.zoom));
	}
	onZoomReset(e) {
		e.stopPropagation(), this.resetView();
	}
	onZoomFit(e) {
		e.stopPropagation(), this.fitView();
	}
	resizeHandleLabel(e, n) {
		return t.canvas.resizeHandle(e.name, t.canvas.sides[n]);
	}
	renderBadges(e) {
		return B`
      ${e.hidden ? B`
              <span class="hidden-label">${t.canvas.hidden}</span>
            ` : V}
      ${e.locked ? B`
              <ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>
            ` : this.renderExpressionLock(e)}
    `;
	}
	renderExpressionLock(e) {
		let { position: t, scalingBlockedBy: n } = $o(e, this.primitives), r = this.lockReason(t, n);
		return r ? B`
      <ha-icon
        class="lock-badge expression-lock"
        icon="mdi:function-variant"
        title=${r}
        aria-label=${r}
      ></ha-icon>
    ` : V;
	}
	lockReason(e, n) {
		return e.length > 0 ? t.expression.positionLocked(e.join(", ")) : n.length > 0 ? t.expression.scalingLocked(n.join(", ")) : "";
	}
	renderSelectionSize(e) {
		let n = Math.round(e.width), r = Math.round(e.height);
		return B`
      <output class="selection-size" aria-live="off">
        ${t.common.size(n, r)}
      </output>
    `;
	}
	renderHandles(e) {
		if (e.kind === "primitive" && !Pi(e.primitive)) return [];
		let t = $o(e, this.primitives).handles;
		return Gr.filter((e) => !t.includes(e)).map((t) => B`
        <button
          data-resize-handle=${t}
          class=${`resize-handle resize-${t}`}
          tabindex="-1"
          aria-label=${this.resizeHandleLabel(e, t)}
          @pointerdown=${(n) => this.onHandlePointerDown(n, e, t)}
        ></button>
      `);
	}
	showsHandles(e, t) {
		return !(!t || e.locked || this.selectedItemIds.length !== 1);
	}
	showsGroupHint(e, t) {
		return t && this.selectedItemIds.length === 1 && F(e) && e.grouped && this.enteredGroupId !== e.id;
	}
	renderGroupHint() {
		return B`
      <span class="group-hint">${t.canvas.enterGroupHint}</span>
    `;
	}
	itemClasses(e) {
		let { item: t } = e, n = this.selectedItemIds.includes(t.id), r = F(t) && this.selectedItemIds.some((e) => e !== t.id && I(t.children, e) !== void 0);
		return {
			selection: !0,
			selected: n,
			container: F(t),
			group: F(t) && t.grouped,
			entered: t.id === this.enteredGroupId,
			"holds-selection": r,
			"drop-target": t.id === this.dropContainerId,
			locked: t.locked,
			hidden: t.hidden
		};
	}
	renderPlaced(e) {
		let { item: t } = e, n = ju(t, e.offset, this.measure(t)), r = this.selectedItemIds.includes(t.id), i = this.selectedItemIds.length === 1;
		return B`
      <div
        data-item-id=${t.id}
        class=${yu(this.itemClasses(e))}
        style=${K(qu(n, this.dashboard.display))}
        @pointerdown=${(e) => this.onItemPointerDown(e, t)}
        @dblclick=${(e) => this.onItemDoubleClick(e, t)}
        @contextmenu=${(e) => this.onItemContextMenu(e, t)}
      >
        ${this.renderBadges(t)}
        ${r && i ? this.renderSelectionSize(n) : V}
        ${this.showsGroupHint(t, r) ? this.renderGroupHint() : V}
        ${this.showsHandles(t, r) ? this.renderHandles(t) : V}
      </div>
    `;
	}
	renderSelectionBox() {
		if (this.selectedItemIds.length < 2) return V;
		let e = zu(this.dashboard, this.selectedItemIds, this.measure);
		return e ? B`
      <div
        class="multi-selection"
        style=${K(qu(e, this.dashboard.display))}
      >
        ${this.renderSelectionSize(e)}
      </div>
    ` : V;
	}
	renderGuide(e) {
		let { width: t, height: n } = this.dashboard.display, r = e.axis === "x", i = r ? {
			left: `${e.position / t * 100}%`,
			top: `${e.from / n * 100}%`,
			height: `${(e.to - e.from) / n * 100}%`
		} : {
			top: `${e.position / n * 100}%`,
			left: `${e.from / t * 100}%`,
			width: `${(e.to - e.from) / t * 100}%`
		};
		return B`
      <div
        class="guide ${r ? "vertical" : "horizontal"}"
        style=${K(i)}
      ></div>
    `;
	}
	renderMarquee() {
		return this.marquee ? B`
      <div
        class="marquee"
        style=${K(qu(this.marquee, this.dashboard.display))}
      ></div>
    ` : V;
	}
	renderHistoryButton(e) {
		let t = bl(ml(e), {
			canUndo: this.canUndo,
			canRedo: this.canRedo
		}, ru());
		return B`
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
		let e = this.dashboard, { width: n, height: r, padding: i, snapSize: a } = e.display, o = yu({
			"tool-toggle": !0,
			active: this.snapEnabled
		});
		return B`
      <div class="workspace-meta">
        <span>${t.common.sizeInPixels(n, r)}</span>
        <span>${t.canvas.layers(_a(e.items))}</span>
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
		return this.preview ? B`
      <img
        draggable="false"
        src=${this.preview.imageUrl}
        alt=${t.canvas.previewAlt}
      />
    ` : B`
        <div class="canvas-placeholder">${t.canvas.rendering}</div>
      `;
	}
	renderStage() {
		let e = this.dashboard, { width: t, height: n, snapSize: r } = e.display, { zoom: i, panX: a, panY: o } = this.viewport, s = K({ transform: `translate(${a}px, ${o}px) scale(${i})` }), c = K({
			width: `${t}px`,
			height: `${n}px`
		}), l = K({
			...qu(ra(e), e.display),
			"--snap-size": `${r * i}px`
		});
		return B`
      <section
        class=${yu({
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
            @pointerdown=${this.onCanvasPointerDown}
            @contextmenu=${this.onCanvasContextMenu}
          >
            ${this.renderPreview()}
            <div
              class="working-area"
              aria-hidden="true"
              style=${l}
            ></div>
            ${ka(e.items).map((e) => this.renderPlaced(e))}
            ${this.renderSelectionBox()} ${this.renderMarquee()}
            ${this.guides.map((e) => this.renderGuide(e))}
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
		return B`
      <main class="workspace">
        ${this.renderToolbar()} ${this.renderStage()}
      </main>
    `;
	}
};
Y([W({ attribute: !1 })], X.prototype, "dashboard", void 0), Y([W({ attribute: !1 })], X.prototype, "preview", void 0), Y([W({ attribute: !1 })], X.prototype, "widgets", void 0), Y([W({ attribute: !1 })], X.prototype, "primitives", void 0), Y([W()], X.prototype, "selectedItemId", void 0), Y([W({ attribute: !1 })], X.prototype, "selectedItemIds", void 0), Y([W()], X.prototype, "enteredGroupId", void 0), Y([W({ type: Boolean })], X.prototype, "snapEnabled", void 0), Y([W({ type: Boolean })], X.prototype, "acceptingDrop", void 0), Y([W({ type: Boolean })], X.prototype, "canUndo", void 0), Y([W({ type: Boolean })], X.prototype, "canRedo", void 0), Y([W({ attribute: !1 })], X.prototype, "viewport", void 0), Y([Pc(".canvas")], X.prototype, "canvas", void 0), Y([Pc(".canvas-stage")], X.prototype, "stage", void 0), Y([G()], X.prototype, "dropContainerId", void 0), Y([G()], X.prototype, "marquee", void 0), Y([G()], X.prototype, "guides", void 0), X = Y([U("ods-canvas")], X);
//#endregion
//#region src/ods-code-view.ts
var Ju = {
	idle: "mdi:content-copy",
	copied: "mdi:check",
	failed: "mdi:alert-circle-outline"
}, Yu = 2200, Xu = class extends H {
	constructor(...e) {
		super(...e), this.copyState = "idle";
	}
	static {
		this.styles = [
			J,
			gu,
			z`
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
			}, Yu);
		}
	}
	render() {
		return B`
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
                .icon=${Ju[this.copyState]}
              ></ha-icon>
              ${t.code.copy[this.copyState]}
            </ha-button>
          </header>
          ${this.preview?.warnings.map((e) => B`
                <ha-alert alert-type="warning">${e}</ha-alert>
              `) ?? V}
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
Y([W({ attribute: !1 })], Xu.prototype, "preview", void 0), Y([G()], Xu.prototype, "copyState", void 0), Xu = Y([U("ods-code-view")], Xu);
//#endregion
//#region src/ods-confirm-dialog.ts
var Zu = class extends H {
	constructor(...e) {
		super(...e), this.eyebrow = "", this.heading = "", this.body = "", this.confirmLabel = "";
	}
	static {
		this.styles = [
			J,
			gu,
			z`
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
    `
		];
	}
	cancel() {
		q(this, "confirm-cancel");
	}
	accept() {
		q(this, "confirm-accept");
	}
	onScrimClick(e) {
		e.target === e.currentTarget && this.cancel();
	}
	render() {
		return B`
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
              variant="danger"
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
Y([W()], Zu.prototype, "eyebrow", void 0), Y([W()], Zu.prototype, "heading", void 0), Y([W()], Zu.prototype, "body", void 0), Y([W()], Zu.prototype, "confirmLabel", void 0), Zu = Y([U("ods-confirm-dialog")], Zu);
//#endregion
//#region src/ods-context-menu.ts
var Qu = class extends H {
	constructor(...e) {
		super(...e), this.entries = [], this.label = "";
	}
	static {
		this.styles = [J, z`
      :host {
        display: block;
        width: 228px;
      }
      .menu {
        padding: 5px;
        border: 1px solid var(--studio-border);
        border-radius: 8px;
        background: var(--studio-surface);
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
      }
      .menu button {
        width: 100%;
        min-height: 36px;
        display: grid;
        grid-template-columns: 20px minmax(0, 1fr) auto;
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
      .menu button:hover:not(:disabled),
      .menu button:focus-visible {
        outline: 0;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .menu button:disabled {
        cursor: default;
        opacity: 0.4;
      }
      .menu button.delete {
        color: var(--error-color, #db4437);
      }
      .menu .separator {
        height: 1px;
        margin: 4px 2px;
        background: var(--studio-border);
      }
      .menu .shortcut {
        color: var(--studio-muted);
        font-size: 11px;
        letter-spacing: 0.04em;
      }
      .menu ha-icon {
        width: 16px;
        height: 16px;
        --mdc-icon-size: 16px;
      }
    `];
	}
	select(e, t) {
		e.stopPropagation(), q(this, "menu-select", { id: t.id });
	}
	renderEntry(e) {
		return B`
      ${e.separatorBefore ? B`
              <div class="separator" role="separator"></div>
            ` : V}
      <button
        class=${e.danger ? "delete" : ""}
        role="menuitem"
        data-command=${e.id}
        ?disabled=${e.disabled}
        @click=${(t) => this.select(t, e)}
      >
        <ha-icon icon=${e.icon}></ha-icon>
        <span>${e.label}</span>
        <span class="shortcut">${e.shortcut ?? ""}</span>
      </button>
    `;
	}
	render() {
		return B`
      <div class="menu" role="menu" aria-label=${this.label}>
        ${this.entries.map((e) => this.renderEntry(e))}
      </div>
    `;
	}
};
Y([W({ attribute: !1 })], Qu.prototype, "entries", void 0), Y([W()], Qu.prototype, "label", void 0), Qu = Y([U("ods-context-menu")], Qu);
//#endregion
//#region src/ods-shortcuts-dialog.ts
var $u = [
	"edit",
	"arrange",
	"group",
	"view",
	"history"
], ed = class extends H {
	static {
		this.styles = [
			J,
			gu,
			z`
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
      }
      .dialog {
        width: min(520px, 100%);
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
        padding: 18px 20px 8px;
      }
      .dialog h2 {
        margin: 3px 0 0;
        font-size: 21px;
      }
      section {
        padding: 6px 20px 12px;
      }
      h3 {
        margin: 10px 0 6px;
        color: var(--studio-muted);
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      dl {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 6px 16px;
        margin: 0;
        font-size: 13px;
      }
      dd {
        margin: 0;
        color: var(--studio-muted);
        font: 12px var(--code-font-family, monospace);
      }
    `
		];
	}
	close() {
		q(this, "shortcuts-close");
	}
	onScrimClick(e) {
		e.target === e.currentTarget && this.close();
	}
	renderGroup(e) {
		let n = ru(), r = fl.filter((t) => t.group === e && t.shortcuts.length > 0).map((e) => {
			let t = bl(e, {
				canUndo: !0,
				canRedo: !0
			}, n), r = e.shortcuts.map((t) => bl({
				...e,
				shortcuts: [t]
			}, {
				canUndo: !0,
				canRedo: !0
			}, n).shortcut).join(" · ");
			return B`
        <dt>${t.label}</dt>
        <dd>${r}</dd>
      `;
		});
		return B`
      <section>
        <h3>${t.shortcuts.groups[e]}</h3>
        <dl>${r}</dl>
      </section>
    `;
	}
	render() {
		return B`
      <div class="scrim" role="presentation" @click=${this.onScrimClick}>
        <div
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-label=${t.shortcuts.title}
        >
          <header>
            <div>
              <span class="eyebrow">${t.shortcuts.eyebrow}</span>
              <h2>${t.shortcuts.title}</h2>
            </div>
            <button
              class="icon-button"
              aria-label=${t.common.close}
              @click=${this.close}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          ${$u.map((e) => this.renderGroup(e))}
        </div>
      </div>
    `;
	}
};
ed = Y([U("ods-shortcuts-dialog")], ed);
//#endregion
//#region src/ods-dashboard-card.ts
var td = [
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
], nd = class extends H {
	constructor(...e) {
		super(...e), this.language = "en", this.menuOpen = !1, this.renaming = !1, this.draftName = "";
	}
	static {
		this.styles = [
			J,
			gu,
			_u,
			z`
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
		q(this, "dashboard-open", { dashboard: this.dashboard });
	}
	toggleMenu(e) {
		e.stopPropagation(), q(this, "dashboard-menu-toggle", { dashboardId: this.dashboard.id });
	}
	onMenuSelect(e) {
		let t = td.find((t) => t.id === e.detail.id);
		t && (e.stopPropagation(), q(this, "dashboard-menu-action", {
			dashboard: this.dashboard,
			action: t.id
		}));
	}
	onRenameInput(e) {
		q(this, "dashboard-rename-input", { name: tu(e) });
	}
	onRenameKeyDown(e) {
		e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), q(this, "dashboard-rename-commit")) : e.key === "Escape" && (e.preventDefault(), q(this, "dashboard-rename-cancel"));
	}
	commitRename() {
		q(this, "dashboard-rename-commit");
	}
	renderMiniature() {
		let { display: e } = this.dashboard;
		return B`
      <div class="dashboard-card-preview">
        <div class="dashboard-miniature" style=${K({
			aspectRatio: `${e.width} / ${e.height}`,
			background: e.background,
			"--dashboard-accent": $l(e.palette)
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
		return B`
      <span class="dashboard-card-title">
        ${this.renaming ? B`
                <input
                  class="dashboard-rename-input"
                  aria-label=${t.gallery.renameField(e)}
                  .value=${this.draftName}
                  @input=${this.onRenameInput}
                  @keydown=${this.onRenameKeyDown}
                  @blur=${this.commitRename}
                />
              ` : B`
                <strong>${e}</strong>
              `}
        <span class=${`status ${n}`}>${n}</span>
      </span>
    `;
	}
	renderMeta() {
		let { display: e } = this.dashboard;
		return B`
      <span class="dashboard-card-meta">
        <span>${t.common.size(e.width, e.height)}</span>
        <span
          class="palette-dots"
          aria-label=${jr[e.palette]}
        >
          ${Mr[e.palette].map((e) => B`
              <i style=${K({ background: e })}></i>
            `)}
        </span>
        <span>${jr[e.palette]}</span>
      </span>
    `;
	}
	renderMenu() {
		return this.menuOpen ? B`
      <ods-context-menu
        class="dashboard-menu"
        id=${this.menuId}
        label=${t.gallery.menuFor(this.dashboard.name)}
        .entries=${td}
        @menu-select=${this.onMenuSelect}
      ></ods-context-menu>
    ` : V;
	}
	render() {
		let e = this.dashboard;
		return B`
      <article class=${yu({
			"dashboard-card": !0,
			"menu-open": this.menuOpen
		})} data-dashboard-id=${e.id}>
        ${this.renderMiniature()}
        <div class="dashboard-card-copy">
          ${this.renderTitle()} ${this.renderMeta()}
          <small>
            ${t.gallery.updated(eu(e, this.language))}
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
Y([W({ attribute: !1 })], nd.prototype, "dashboard", void 0), Y([W()], nd.prototype, "language", void 0), Y([W({ type: Boolean })], nd.prototype, "menuOpen", void 0), Y([W({ type: Boolean })], nd.prototype, "renaming", void 0), Y([W()], nd.prototype, "draftName", void 0), Y([Pc(".dashboard-rename-input")], nd.prototype, "renameInput", void 0), nd = Y([U("ods-dashboard-card")], nd);
//#endregion
//#region src/ods-gallery.ts
var rd = class extends H {
	constructor(...e) {
		super(...e), this.dashboards = [], this.error = "", this.saving = !1, this.searchText = "", this.sort = "updated", this.menuDashboardId = "", this.onOutsidePointerDown = (e) => {
			this.menuDashboardId && (e.composedPath().some((e) => e instanceof HTMLElement && (e.classList.contains("dashboard-menu") || e.classList.contains("dashboard-menu-trigger"))) || (this.menuDashboardId = ""));
		}, this.onKeyDown = (e) => {
			e.key === "Escape" && (this.menuDashboardId ? (this.menuDashboardId = "", e.stopPropagation()) : this.dialog && (q(this, "dashboard-dialog-close"), e.stopPropagation()));
		};
	}
	static {
		this.styles = [
			J,
			gu,
			_u,
			z`
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
		this.searchText = tu(e);
	}
	onSortChange(e) {
		this.sort = tu(e) === "name" ? "name" : "updated";
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
		q(this, "dashboard-settings-change", { value: e.detail.value });
	}
	renderCard(e) {
		let t = this.dialog === "rename" && this.draft?.id === e.id;
		return B`
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
		return !e || !this.dialog || this.dialog === "rename" ? V : this.dialog === "delete" ? B`
        <ha-dialog
          .open=${!0}
          width="small"
          header-title=${t.gallery.deleteTitle}
          @closed=${() => q(this, "dashboard-dialog-close")}
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
              @click=${() => q(this, "dashboard-dialog-close")}
            >
              ${t.common.cancel}
            </ha-button>
            <ha-button
              slot="primaryAction"
              variant="danger"
              appearance="filled"
              .disabled=${this.saving}
              @click=${() => q(this, "dashboard-delete-confirm")}
            >
              ${this.saving ? t.gallery.deleting : t.gallery.deleteAction}
            </ha-button>
          </ha-dialog-footer>
        </ha-dialog>
      ` : B`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${t.gallery.settingsTitle}
        header-subtitle=${e.name}
        @closed=${() => q(this, "dashboard-dialog-close")}
      >
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Ml(e)}
            .schema=${Xl(Ul(e))}
            .computeLabel=${Zl}
            @value-changed=${this.settingsChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => q(this, "dashboard-dialog-close")}
          >
            ${t.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !Ll(e)}
            @click=${() => q(this, "dashboard-settings-save")}
          >
            ${this.saving ? t.gallery.saving : t.gallery.settingsSave}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
	render() {
		let e = Rl(this.dashboards, this.searchText, this.sort, this.language);
		return B`
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
            @click=${() => q(this, "dashboard-new")}
          >
            <span class="dashboard-new-button-label">
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>${t.gallery.newDashboard}</span>
            </span>
          </ha-button>
        </header>
        ${this.error ? B`
                <ha-alert alert-type="error">${this.error}</ha-alert>
              ` : V}
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
            @click=${() => q(this, "dashboard-new")}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            <strong>${t.gallery.newDashboard}</strong>
          </button>
          ${e.map((e) => this.renderCard(e))}
          ${e.length ? V : B`
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
Y([W({ attribute: !1 })], rd.prototype, "dashboards", void 0), Y([W({ attribute: !1 })], rd.prototype, "hass", void 0), Y([W()], rd.prototype, "error", void 0), Y([W({ type: Boolean })], rd.prototype, "saving", void 0), Y([W()], rd.prototype, "dialog", void 0), Y([W({ attribute: !1 })], rd.prototype, "draft", void 0), Y([G()], rd.prototype, "searchText", void 0), Y([G()], rd.prototype, "sort", void 0), Y([G()], rd.prototype, "menuDashboardId", void 0), rd = Y([U("ods-gallery")], rd);
//#endregion
//#region src/ods-header.ts
var id = class extends H {
	constructor(...e) {
		super(...e), this.view = "design", this.dirty = !1, this.saving = !1, this.sending = !1;
	}
	static {
		this.styles = [
			J,
			gu,
			z`
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
		q(this, "dashboard-name-change", { name: tu(e) });
	}
	get statusToggleLabel() {
		return this.dashboard.status === "ready" ? t.header.setDraft : t.header.setReady;
	}
	sendToDevice() {
		q(this, "send-to-device");
	}
	renderSendButton() {
		return this.dashboard.display.deviceId ? B`
      <ha-button
        appearance="plain"
        .disabled=${this.sending}
        @click=${this.sendToDevice}
      >
        <ha-icon slot="start" icon="mdi:send"></ha-icon>
        ${this.sending ? t.header.sendingToDevice : t.header.sendToDevice}
      </ha-button>
    ` : V;
	}
	render() {
		let e = this.dashboard;
		return B`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">${t.header.studio}</strong>
          <span class="breadcrumb-divider">/</span>
          <button
            class="breadcrumb-link"
            @click=${() => q(this, "show-dashboards")}
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
            @click=${() => q(this, "view-change", { view: "design" })}
          >
            <ha-icon icon="mdi:tools"></ha-icon>
            ${t.header.design}
          </button>
          <button
            class=${this.view === "code" ? "active" : ""}
            aria-pressed=${this.view === "code"}
            @click=${() => q(this, "view-change", { view: "code" })}
          >
            <ha-icon icon="mdi:code-tags"></ha-icon>
            ${t.header.code}
          </button>
        </nav>
        <div class="editor-actions">
          ${this.renderSendButton()}
          <span class="status ${e.status}">${e.status}</span>
          <ha-button
            appearance="plain"
            @click=${() => q(this, "toggle-ready")}
          >
            ${this.statusToggleLabel}
          </ha-button>
          <button
            class="icon-button"
            title=${t.header.help}
            aria-label=${t.header.help}
            @click=${() => q(this, "help-open")}
          >
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <ha-button
            appearance="filled"
            .disabled=${!this.dirty || this.saving}
            @click=${() => q(this, "dashboard-save")}
          >
            ${this.saving ? t.header.saving : t.header.save}
          </ha-button>
        </div>
      </header>
    `;
	}
};
Y([W({ attribute: !1 })], id.prototype, "dashboard", void 0), Y([W()], id.prototype, "view", void 0), Y([W({ type: Boolean })], id.prototype, "dirty", void 0), Y([W({ type: Boolean })], id.prototype, "saving", void 0), Y([W({ type: Boolean })], id.prototype, "sending", void 0), id = Y([U("ods-header")], id);
//#endregion
//#region src/item-labels.ts
var ad = (e, t, n) => {
	if (e.kind === "widget") return t.find((t) => t.id === e.widget.type);
	if (e.kind !== "container") return n.find((t) => t.type === e.primitive.type);
}, od = (e, t, n) => e.kind === "container" ? e.grouped ? "mdi:group" : "mdi:select-all" : ad(e, t, n)?.icon ?? "mdi:puzzle", sd = "{{  }}", cd = class extends H {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.disabled = !1, this.focusEditor = !1;
	}
	static {
		this.styles = [J, z`
      :host {
        display: block;
        min-width: 0;
      }
      .row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 24px;
        gap: 4px;
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
        min-height: 28px;
        padding: 6px 8px;
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
        margin-bottom: 2px;
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
		q(this, "expression-change", {
			key: this.fieldKey,
			template: e
		});
	}
	toggle() {
		this.change(this.expression === void 0 ? void 0 : null);
	}
	onLiteralInput(e) {
		let t = e.composedPath()[0];
		t instanceof HTMLInputElement && t.type === "text" && t.value.trimStart().startsWith("{") && (this.focusEditor = !0, this.change(sd));
	}
	onEditorChange(e) {
		if (!(e.target instanceof HTMLTextAreaElement)) return;
		let t = e.target.value;
		this.change(_o(t) ? t : null);
	}
	renderEditor(e) {
		return B`
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
		return B`
      <div class="row" @input=${e ? V : this.onLiteralInput}>
        ${this.expression === void 0 ? B`
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
Y([W()], cd.prototype, "label", void 0), Y([W()], cd.prototype, "fieldKey", void 0), Y([W()], cd.prototype, "expression", void 0), Y([W({ type: Boolean })], cd.prototype, "disabled", void 0), Y([Pc("textarea")], cd.prototype, "editor", void 0), cd = Y([U("ods-expression-field")], cd);
//#endregion
//#region src/ods-anchor-picker.ts
var ld = [
	"lt",
	"mt",
	"rt",
	"lm",
	"mm",
	"rm",
	"lb",
	"mb",
	"rb"
], ud = (e) => ld.some((t) => t === e), dd = class extends H {
	constructor(...e) {
		super(...e), this.value = "", this.disabled = !1;
	}
	static {
		this.styles = [J, z`
      :host {
        display: inline-block;
      }
      .grid {
        display: inline-grid;
        grid-template-columns: repeat(3, 24px);
        gap: 1px;
        padding: 1px;
        overflow: hidden;
        border-radius: 5px;
        background: var(--studio-border);
      }
      button {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border: 0;
        background: var(--studio-surface);
      }
      button:hover {
        background: var(--studio-accent-soft);
      }
      button:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: -2px;
      }
      .dot {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--studio-muted);
      }
      button[aria-pressed="true"] .dot {
        width: 8px;
        height: 8px;
        background: var(--primary-color);
      }
    `];
	}
	choose(e) {
		q(this, "anchor-change", { anchor: e });
	}
	renderPosition(e) {
		let n = t.anchors[e];
		return B`
      <button
        type="button"
        data-anchor=${e}
        title=${n}
        aria-label=${n}
        aria-pressed=${this.value === e ? "true" : "false"}
        .disabled=${this.disabled}
        @click=${() => this.choose(e)}
      >
        <span class="dot"></span>
      </button>
    `;
	}
	render() {
		return B`
      <div class="grid" role="group" aria-label=${t.fields.anchor}>
        ${ld.map((e) => this.renderPosition(e))}
      </div>
    `;
	}
};
Y([W()], dd.prototype, "value", void 0), Y([W({ type: Boolean })], dd.prototype, "disabled", void 0), dd = Y([U("ods-anchor-picker")], dd);
//#endregion
//#region src/ods-property-field.ts
var fd = class extends H {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.unit = "", this.value = 0, this.min = 0, this.max = 4096, this.disabled = !1;
	}
	static {
		this.styles = [
			J,
			vu,
			z`
      :host {
        display: block;
        min-width: 0;
      }
      .box {
        position: relative;
        width: 100%;
        cursor: text;
      }
      input[type="number"] {
        appearance: textfield;
        -moz-appearance: textfield;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        appearance: none;
        margin: 0;
      }
      /* On hover the unit moves left and the step buttons appear at the right edge. */
      .steppers {
        position: absolute;
        top: 1px;
        right: 1px;
        bottom: 1px;
        display: none;
        flex-direction: column;
        width: 14px;
      }
      .box:hover:not(.disabled) .steppers,
      .box:focus-within:not(.disabled) .steppers {
        display: flex;
      }
      .box:hover:not(.disabled) .unit,
      .box:focus-within:not(.disabled) .unit {
        margin-right: 12px;
      }
      .steppers button {
        flex: 1;
        min-height: 0;
        padding: 0;
        border: 0;
        border-radius: 3px;
        background: transparent;
        color: var(--studio-muted);
        font-size: 7px;
        line-height: 1;
      }
      .steppers button:hover {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
    `
		];
	}
	step(e, t) {
		let n = this.input;
		if (!n) return;
		let r = t.shiftKey ? 10 : 1, i = Number(n.value || 0) + e * r;
		n.value = String(Math.min(this.max, Math.max(this.min, i))), n.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	stepUp(e) {
		this.step(1, e);
	}
	stepDown(e) {
		this.step(-1, e);
	}
	renderSteppers() {
		return this.disabled ? V : B`
      <span class="steppers">
        <button
          type="button"
          tabindex="-1"
          aria-label=${t.common.increase}
          @click=${this.stepUp}
        >
          ▲
        </button>
        <button
          type="button"
          tabindex="-1"
          aria-label=${t.common.decrease}
          @click=${this.stepDown}
        >
          ▼
        </button>
      </span>
    `;
	}
	onChange(e) {
		q(this, "field-change", {
			key: this.fieldKey,
			value: tu(e)
		});
	}
	render() {
		return B`
      <label class="box ${this.disabled ? "disabled" : ""}">
        <span class="inner-label">${this.label}</span>
        <input
          class="mono"
          data-field=${this.fieldKey}
          aria-label=${this.label}
          type="number"
          .value=${this.value === null ? "" : String(this.value)}
          min=${this.min}
          max=${this.max}
          .disabled=${this.disabled}
          @change=${this.onChange}
        />
        ${this.unit ? B`
                <span class="unit">${this.unit}</span>
              ` : V}
        ${this.renderSteppers()}
      </label>
    `;
	}
};
Y([W()], fd.prototype, "label", void 0), Y([W()], fd.prototype, "fieldKey", void 0), Y([W()], fd.prototype, "unit", void 0), Y([W({ attribute: !1 })], fd.prototype, "value", void 0), Y([W({ type: Number })], fd.prototype, "min", void 0), Y([W({ type: Number })], fd.prototype, "max", void 0), Y([W({ type: Boolean })], fd.prototype, "disabled", void 0), Y([Pc("input")], fd.prototype, "input", void 0), fd = Y([U("ods-property-field")], fd);
//#endregion
//#region src/ods-color-picker.ts
var pd = "accent", md = class extends H {
	constructor(...e) {
		super(...e), this.palette = "bw", this.value = "", this.nullable = !1, this.accentHex = "#000000";
	}
	static {
		this.styles = [J, z`
      :host {
        display: block;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        max-height: 260px;
        overflow: auto;
      }
      button {
        display: flex;
        align-items: center;
        gap: 7px;
        min-width: 0;
        height: 30px;
        padding: 0 8px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--studio-surface);
        font-size: 11px;
        text-align: start;
      }
      button:hover {
        border-color: var(--primary-color);
      }
      button[aria-pressed="true"] {
        border-color: var(--primary-color);
        box-shadow: inset 0 0 0 1px var(--primary-color);
      }
      .swatch {
        flex: none;
        width: 16px;
        height: 16px;
        border: 1px solid var(--studio-border);
        border-radius: 4px;
      }
      .swatch.none {
        background: repeating-conic-gradient(#bbb 0 25%, #fff 0 50%) 0 0 / 8px
          8px;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `];
	}
	choose(e) {
		q(this, "color-change", { color: e });
	}
	renderChoice(e, t, n) {
		let r = (e ?? "") === this.value;
		return B`
      <button
        type="button"
        data-color=${e ?? "none"}
        aria-pressed=${r ? "true" : "false"}
        @click=${() => this.choose(e)}
      >
        ${n}
        <span class="name">${t}</span>
      </button>
    `;
	}
	renderNone() {
		return this.nullable ? this.renderChoice(null, t.colors.none, B`
        <span class="swatch none"></span>
      `) : V;
	}
	render() {
		return B`
      <div class="grid">
        ${this.renderNone()}
        ${Nr[this.palette].map((e) => this.renderChoice(e.value, Ir(e.id), B`
              <span class="swatch" style=${`background:${e.hex}`}></span>
            `))}
        ${this.renderChoice(pd, Ir(pd), B`
            <span class="swatch" style=${`background:${this.accentHex}`}></span>
          `)}
      </div>
    `;
	}
};
Y([W()], md.prototype, "palette", void 0), Y([W()], md.prototype, "value", void 0), Y([W({ type: Boolean })], md.prototype, "nullable", void 0), Y([W()], md.prototype, "accentHex", void 0), md = Y([U("ods-color-picker")], md);
//#endregion
//#region src/ods-popover.ts
var hd = 6, gd = 8, _d = class extends H {
	constructor(...e) {
		super(...e), this.heading = "", this.width = 220, this.onOutsidePointer = (e) => {
			e.composedPath().includes(this) || this.close();
		}, this.onKey = (e) => {
			e.key === "Escape" && (e.stopPropagation(), this.close());
		};
	}
	static {
		this.styles = [J, z`
      :host {
        display: contents;
      }
      .popover {
        /* In the top layer, so no ancestor of the panel can offset a fixed position. */
        position: fixed;
        inset: auto;
        margin: 0;
        z-index: 1100;
        padding: 10px 12px 12px;
        border: 1px solid var(--studio-border);
        border-radius: 12px;
        background: var(--studio-surface);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
        user-select: none;
      }
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      h3 {
        margin: 0;
        color: var(--studio-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .close {
        display: grid;
        place-items: center;
        width: 20px;
        height: 20px;
        padding: 0;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--studio-muted);
      }
      .close:hover {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
    `];
	}
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("pointerdown", this.onOutsidePointer, !0), window.addEventListener("keydown", this.onKey, !0);
	}
	disconnectedCallback() {
		window.removeEventListener("pointerdown", this.onOutsidePointer, !0), window.removeEventListener("keydown", this.onKey, !0), super.disconnectedCallback();
	}
	updated() {
		let e = this.panel;
		e && !e.matches(":popover-open") && e.showPopover(), this.place();
	}
	close() {
		q(this, "popover-close");
	}
	place() {
		let e = this.panel;
		if (!e || !this.anchor) return;
		let t = e.offsetHeight, n = this.anchor.bottom + hd, r = n + t + gd <= window.innerHeight ? n : this.anchor.top - hd - t, i = Math.min(this.width, window.innerWidth - 16), a = Math.min(Math.max(gd, this.anchor.left), window.innerWidth - i - gd);
		e.style.top = `${Math.max(gd, r)}px`, e.style.left = `${a}px`, e.style.width = `${i}px`;
	}
	render() {
		return this.anchor ? B`
      <div
        class="popover"
        popover="manual"
        role="dialog"
        aria-label=${this.heading}
      >
        <header>
          <h3>${this.heading}</h3>
          <button
            type="button"
            class="close"
            aria-label=${t.common.close}
            @click=${this.close}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </header>
        <slot></slot>
      </div>
    ` : V;
	}
};
Y([W()], _d.prototype, "heading", void 0), Y([W({ attribute: !1 })], _d.prototype, "anchor", void 0), Y([W({ type: Number })], _d.prototype, "width", void 0), Y([Pc(".popover")], _d.prototype, "panel", void 0), _d = Y([U("ods-popover")], _d);
//#endregion
//#region src/ods-value-field.ts
var vd = 250, yd = 4, bd = "lt", xd = class extends H {
	constructor(...e) {
		super(...e), this.palette = "bw", this.display = {
			width: 800,
			height: 480
		}, this.disabled = !1, this.closedAt = 0;
	}
	static {
		this.styles = [
			J,
			vu,
			z`
      :host {
        display: block;
        min-width: 0;
      }
      .picker-trigger {
        width: 100%;
        cursor: pointer;
        text-align: start;
      }
      .picker-trigger.color {
        height: 30px;
      }
      .picker-trigger .value {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-family: var(--code-font-family, monospace);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .swatch {
        flex: none;
        width: 18px;
        height: 18px;
        border: 1px solid var(--studio-border);
        border-radius: 5px;
      }
      .swatch.none {
        background: repeating-conic-gradient(#bbb 0 25%, #fff 0 50%) 0 0 / 8px
          8px;
      }
      .clear {
        display: grid;
        flex: none;
        place-items: center;
        width: 14px;
        height: 14px;
        padding: 0;
        border: 0;
        border-radius: 4px;
        background: transparent;
        color: var(--studio-muted);
      }
      .clear:hover {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      .anchor-mark {
        display: inline-grid;
        grid-template-columns: repeat(3, 4px);
        gap: 2px;
      }
      .anchor-mark i {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--studio-border);
      }
      .anchor-mark i.on {
        background: var(--primary-color);
      }
      .switch-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        min-height: 28px;
        font-size: 11px;
        font-weight: 500;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .chips button {
        height: 24px;
        padding: 0 8px;
        border: 1px solid var(--studio-border);
        border-radius: 6px;
        background: transparent;
        font-size: 11px;
      }
      .chips button[aria-pressed="true"] {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: var(--text-primary-color, #fff);
      }
    `
		];
	}
	change(e) {
		q(this, "primitive-field-change", {
			key: this.field.key,
			value: e
		});
	}
	openPicker(e, t) {
		if (this.disabled || Date.now() - this.closedAt < vd) return;
		let n = t.currentTarget;
		n instanceof HTMLElement && (this.picker = {
			kind: e,
			anchor: n.getBoundingClientRect()
		});
	}
	closePicker() {
		this.closedAt = Date.now(), this.picker = void 0;
	}
	onAnchorChange(e) {
		this.change(e.detail.anchor), this.closePicker();
	}
	onColorChange(e) {
		this.change(e.detail.color), this.closePicker();
	}
	openColorPicker(e) {
		this.openPicker("color", e);
	}
	openAnchorPicker(e) {
		this.openPicker("anchor", e);
	}
	clearColor(e) {
		e.stopPropagation(), this.change(null);
	}
	onNumberChange(e) {
		e.stopPropagation();
		let t = e.detail.value.trim();
		if (t === "") {
			this.change(this.field.optional ? null : this.field.default);
			return;
		}
		let n = Gi(this.field.min, this.display, -Infinity), r = Gi(this.field.max, this.display, Infinity);
		this.change(Math.min(r, Math.max(n, Math.round(Number(t)))));
	}
	onTextChange(e) {
		let t = e.target;
		(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement) && this.change(t.value);
	}
	onListChange(e) {
		if (!(e.target instanceof HTMLTextAreaElement)) return;
		let t = Oo(this.field, e.target.value);
		t !== xo && this.change(t);
	}
	onSwitchChange(e) {
		e.target instanceof HTMLInputElement && this.change(e.target.checked);
	}
	toggleFlag(e) {
		let t = new Set(String(this.value ?? "").split(",").filter((e) => e !== ""));
		t.has(e) ? t.delete(e) : t.add(e);
		let n = (this.field.options ?? []).filter((e) => t.has(e));
		this.change(n.length > 0 ? n.join(",") : null);
	}
	onFormChange(e) {
		e.stopPropagation();
		let t = Oo(this.field, e.detail.value[this.field.key]);
		t !== xo && this.change(t);
	}
	renderNumber() {
		let { label: e, unit: t, key: n } = this.field, r = this.value === null || this.value === void 0;
		return B`
      <ods-property-field
        .label=${e}
        .fieldKey=${`value-${n}`}
        .unit=${t ?? ""}
        .value=${r ? null : Number(this.value)}
        .min=${Gi(this.field.min, this.display, -Infinity)}
        .max=${Gi(this.field.max, this.display, Infinity)}
        .disabled=${this.disabled}
        @field-change=${this.onNumberChange}
      ></ods-property-field>
    `;
	}
	renderBoolean() {
		return B`
      <label class="switch-row">
        <span>${this.field.label}</span>
        <input
          type="checkbox"
          role="switch"
          aria-checked=${this.value ? "true" : "false"}
          aria-label=${this.field.label}
          .checked=${!!this.value}
          .disabled=${this.disabled}
          @change=${this.onSwitchChange}
        />
      </label>
    `;
	}
	renderSegmented(e) {
		return B`
      <div class="segmented" role="group" aria-label=${this.field.label}>
        ${e.map((e) => B`
            <button
              type="button"
              aria-pressed=${this.value === e ? "true" : "false"}
              .disabled=${this.disabled}
              @click=${() => this.change(e)}
            >
              ${e}
            </button>
          `)}
      </div>
    `;
	}
	renderSelect(e, t = !1) {
		let n = String(this.value ?? ""), r = t && !e.includes(n) ? [...e, n] : e;
		return B`
      <div class="box ${this.disabled ? "disabled" : ""}">
        <select
          aria-label=${this.field.label}
          .disabled=${this.disabled}
          @change=${this.onTextChange}
        >
          ${r.map((e) => B`
              <option value=${e} ?selected=${e === n}>
                ${e}
              </option>
            `)}
        </select>
      </div>
    `;
	}
	renderAnchorMark(e) {
		return B`
      <span class="anchor-mark">
        ${ld.map((t) => B`
            <i class=${t === e ? "on" : ""}></i>
          `)}
      </span>
    `;
	}
	renderAnchor() {
		let e = String(this.value ?? "") || bd, n = ud(e) ? t.anchors[e] : e;
		return B`
      <button
        type="button"
        class="box picker-trigger ${this.disabled ? "disabled" : ""}"
        aria-label=${this.field.label}
        aria-haspopup="dialog"
        data-value-field=${this.field.key}
        @click=${this.openAnchorPicker}
      >
        ${this.renderAnchorMark(e)}
        <span class="value">${e || "—"} · ${n}</span>
      </button>
    `;
	}
	renderEnum() {
		let e = this.field.options ?? [];
		return this.field.key === "anchor" ? this.renderAnchor() : e.length <= yd && e.every((e) => e.length <= 8) ? this.renderSegmented(e) : this.renderSelect(e);
	}
	colorName() {
		let e = String(this.value ?? "");
		return Ir(Nr[this.palette].find((t) => t.value === e)?.id ?? e);
	}
	renderColor() {
		let e = this.value === null || this.value === void 0 ? "" : String(this.value), n = e ? Fr(e, this.palette) : void 0, r = this.field.nullable && e !== "" && !this.disabled;
		return B`
      <div
        class="box picker-trigger color ${this.disabled ? "disabled" : ""}"
        role="button"
        tabindex="0"
        aria-label=${this.field.label}
        aria-haspopup="dialog"
        data-value-field=${this.field.key}
        @click=${this.openColorPicker}
        @keydown=${this.onTriggerKey}
      >
        <span
          class="swatch ${n ? "" : "none"}"
          style=${n ? `background:${n}` : ""}
        ></span>
        <span class="value">
          ${e ? this.colorName() : t.colors.none}
        </span>
        ${r ? B`
                <button
                  type="button"
                  class="clear"
                  aria-label=${t.colors.clear}
                  @click=${this.clearColor}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              ` : V}
      </div>
    `;
	}
	onTriggerKey(e) {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.openColorPicker(e));
	}
	renderText() {
		return this.field.shape === "text" ? B`
        <textarea
          class="compact"
          rows="3"
          aria-label=${this.field.label}
          .value=${String(this.value ?? "")}
          .disabled=${this.disabled}
          @change=${this.onTextChange}
        ></textarea>
      ` : B`
      <div class="box ${this.disabled ? "disabled" : ""}">
        <input
          type="text"
          aria-label=${this.field.label}
          .value=${String(this.value ?? "")}
          .disabled=${this.disabled}
          @change=${this.onTextChange}
        />
      </div>
    `;
	}
	renderList() {
		return B`
      <textarea
        class="compact mono"
        rows="3"
        aria-label=${this.field.label}
        .value=${String(Do(this.field, this.value) ?? "")}
        .disabled=${this.disabled}
        @change=${this.onListChange}
      ></textarea>
    `;
	}
	renderFlags() {
		let e = new Set(String(this.value ?? "").split(","));
		return B`
      <div class="chips" role="group" aria-label=${this.field.label}>
        ${(this.field.options ?? []).map((t) => B`
            <button
              type="button"
              aria-pressed=${e.has(t) ? "true" : "false"}
              .disabled=${this.disabled}
              @click=${() => this.toggleFlag(t)}
            >
              ${t.replaceAll("_", " ")}
            </button>
          `)}
      </div>
    `;
	}
	renderNested() {
		return B`
      <ha-form
        .hass=${this.hass}
        .data=${{ [this.field.key]: Do(this.field, this.value) }}
        .schema=${[Uo(this.field, this.palette)]}
        .computeLabel=${(e) => e.label}
        @value-changed=${this.onFormChange}
      ></ha-form>
    `;
	}
	isLabelledInside() {
		return this.field.shape === "number" || this.field.shape === "coordinate" || this.field.shape === "boolean" || this.field.shape === "object" || this.field.shape === "objects";
	}
	renderControl() {
		switch (this.field.shape) {
			case "number":
			case "coordinate": return this.renderNumber();
			case "boolean": return this.renderBoolean();
			case "enum": return this.renderEnum();
			case "color": return this.renderColor();
			case "font": return this.renderSelect(this.field.options ?? [], !0);
			case "flags": return this.renderFlags();
			case "points":
			case "icons": return this.renderList();
			case "object":
			case "objects": return this.renderNested();
			default: return this.renderText();
		}
	}
	renderPicker() {
		let e = this.picker;
		if (!e) return V;
		let t = e.kind === "color";
		return B`
      <ods-popover
        .heading=${this.field.label}
        .anchor=${e.anchor}
        .width=${t ? 232 : 96}
        @popover-close=${this.closePicker}
      >
        ${t ? B`
                <ods-color-picker
                  .palette=${this.palette}
                  .value=${String(this.value ?? "")}
                  .nullable=${!!this.field.nullable}
                  .accentHex=${Fr("accent", this.palette) ?? "#000000"}
                  @color-change=${this.onColorChange}
                ></ods-color-picker>
              ` : B`
                <ods-anchor-picker
                  .value=${String(this.value ?? "") || bd}
                  @anchor-change=${this.onAnchorChange}
                ></ods-anchor-picker>
              `}
      </ods-popover>
    `;
	}
	render() {
		return B`
      ${this.isLabelledInside() ? V : B`
          <span class="field-label">${this.field.label}</span>
        `} ${this.renderControl()} ${this.renderPicker()}
    `;
	}
};
Y([W({ attribute: !1 })], xd.prototype, "hass", void 0), Y([W({ attribute: !1 })], xd.prototype, "field", void 0), Y([W({ attribute: !1 })], xd.prototype, "value", void 0), Y([W()], xd.prototype, "palette", void 0), Y([W({ attribute: !1 })], xd.prototype, "display", void 0), Y([W({ type: Boolean })], xd.prototype, "disabled", void 0), Y([G()], xd.prototype, "picker", void 0), xd = Y([U("ods-value-field")], xd);
//#endregion
//#region src/structure-model.ts
var Sd = (e, t) => `${e.name} ${Br(e)}`.toLocaleLowerCase().includes(t), Cd = (e, t) => {
	let n = /* @__PURE__ */ new Set();
	for (let r of ga(e)) if (Sd(r, t)) {
		n.add(r.id);
		for (let t of va(e, r.id)) n.add(t.id);
	}
	return n;
}, wd = (e, t, n, r) => [...e].reverse().flatMap((e) => {
	if (r && !r.has(e.id)) return [];
	let i = {
		item: e,
		depth: t
	};
	return F(e) && (r || !n.has(e.id)) ? [i, ...wd(e.children, t + 1, n, r)] : [i];
}), Td = (e, t, n = "") => {
	let r = n.trim().toLocaleLowerCase();
	return wd(e, 0, t, r ? Cd(e, r) : void 0);
}, Ed = (e, t) => t && e >= .25 && e <= .75 ? "inside" : e < .5 ? "before" : "after", Dd = (e, t, n) => {
	let r = e.findIndex((e) => e.item.id === t);
	return r < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, r + n))];
}, Od = 4, kd = 16, Ad = (e) => {
	let t = [
		"toggle-hidden",
		"toggle-locked",
		"delete-item"
	];
	return F(e) ? [...e.grouped ? ["enter-group", "ungroup"] : ["group"], ...t] : t;
}, Z = class extends H {
	constructor(...e) {
		super(...e), this.items = [], this.widgets = [], this.primitives = [], this.selectedItemId = "", this.selectedItemIds = [], this.enteredGroupId = "", this.renameRequestId = "", this.collapsed = /* @__PURE__ */ new Set(), this.searchText = "", this.renamingId = "", this.draggingId = "", this.suppressClick = !1;
	}
	static {
		this.styles = [
			J,
			gu,
			z`
      :host {
        display: contents;
      }
      .layers {
        min-height: 150px;
        flex: 0 0 clamp(176px, 38%, 420px);
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
      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 8px 4px;
        padding: 3px 4px 3px 8px;
        border: 1px solid var(--studio-accent);
        border-radius: 6px;
        background: var(--studio-accent-soft);
        color: var(--studio-accent);
        font-size: 11px;
      }
      .breadcrumb strong {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .breadcrumb button {
        border: 0;
        border-radius: 4px;
        background: transparent;
        color: inherit;
        font-size: 11px;
      }
      .tree-search {
        margin: 0 8px 6px;
      }
      .tree-search input {
        width: 100%;
        height: 28px;
        padding: 0 8px;
        border: 1px solid var(--studio-border);
        border-radius: 6px;
        background: var(--secondary-background-color, #f3f5f6);
        color: var(--studio-text);
        font-size: 11px;
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
      .root-row {
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 28px;
        padding: 2px 6px;
        border: 1px solid transparent;
        border-radius: 5px;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .root-row.active {
        color: var(--text-primary-color, #fff);
        background: var(--studio-accent);
      }
      .root-row:hover {
        background: var(--secondary-background-color, #f3f5f6);
      }
      .root-row.drop-inside,
      .layer-row.drop-inside {
        border-color: var(--studio-accent);
        background: var(--studio-accent-soft);
      }
      .layer-row {
        position: relative;
        display: grid;
        grid-template-columns: 18px 18px minmax(0, 1fr) auto;
        align-items: center;
        min-height: 34px;
        gap: 4px;
        padding: 2px 3px 2px calc(var(--depth, 0) * ${kd}px + 3px);
        border: 1px solid transparent;
        border-radius: 5px;
      }
      .layer-row[data-depth]:not([data-depth="0"])::after {
        content: "";
        position: absolute;
        left: calc(var(--depth) * ${kd}px - 5px);
        top: 0;
        bottom: 0;
        width: 1px;
        background: var(--studio-border);
        pointer-events: none;
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
      .layer-row.drop-after::before {
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
      .layer-row.drop-after::before {
        bottom: -2px;
      }
      .layer-row {
        cursor: default;
        user-select: none;
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
      .layer-row .chevron {
        width: 16px;
        height: 24px;
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
        display: flex;
        align-items: center;
        gap: 5px;
        color: var(--studio-muted);
        font-size: 8px;
        line-height: 1.15;
        text-transform: capitalize;
      }
      .badge {
        padding: 0 4px;
        border: 1px solid var(--studio-border);
        border-radius: 999px;
        font-size: 8px;
        text-transform: none;
      }
      .rename {
        width: 100%;
        height: 20px;
        padding: 0 4px;
        border: 1px solid var(--studio-accent);
        border-radius: 4px;
        background: var(--card-background-color, #fff);
        color: var(--studio-text);
        font-size: 11px;
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
	willUpdate(e) {
		e.has("selectedItemId") && this.selectedItemId && this.expandAbove(this.selectedItemId);
	}
	updated(e) {
		if (e.has("renameRequestId") && this.renameRequestId) {
			let e = L(this.items, this.renameRequestId);
			e && this.startRename(e), q(this, "rename-handled");
		}
		e.has("selectedItemId") && this.selectedItemId && this.scrollToRow(this.selectedItemId);
	}
	expandAbove(e) {
		let t = va(this.items, e).filter((e) => this.collapsed.has(e.id));
		if (t.length === 0) return;
		let n = new Set(this.collapsed);
		for (let e of t) n.delete(e.id);
		this.collapsed = n;
	}
	scrollToRow(e) {
		let t = this.layerList, n = this.shadowRoot?.querySelector(`.layer-row[data-item-id="${CSS.escape(e)}"]`);
		if (!t || !n) return;
		let r = n.offsetTop - t.offsetTop;
		r < t.scrollTop && (t.scrollTop = r);
		let i = r + n.offsetHeight - t.clientHeight;
		i > t.scrollTop && (t.scrollTop = i);
	}
	toggleCollapsed(e, t) {
		e.stopPropagation();
		let n = new Set(this.collapsed);
		n.has(t.id) ? n.delete(t.id) : n.add(t.id), this.collapsed = n;
	}
	onSearchInput(e) {
		this.searchText = tu(e);
	}
	startRename(e) {
		this.renamingId = e.id, this.updateComplete.then(() => this.shadowRoot?.querySelector(".rename")?.select());
	}
	commitRename(e, t) {
		this.renamingId === t.id && (this.renamingId = "", q(this, "item-rename", {
			itemId: t.id,
			name: tu(e)
		}));
	}
	onRenameKeyDown(e, t) {
		e.stopPropagation(), e.key === "Enter" && this.commitRename(e, t), e.key === "Escape" && (this.renamingId = "");
	}
	onRowPointerDown(e, t) {
		let n = e.composedPath()[0];
		e.button !== 0 || !(n instanceof HTMLElement) || n.closest("button, input") || this.startDrag(e, t.id);
	}
	startDrag(e, t) {
		this.stopGesture = Hu({
			origin: e,
			threshold: Od,
			onActivate: () => {
				this.draggingId = t, this.suppressClick = !0;
			},
			onMove: (e) => {
				e.preventDefault(), this.dropTarget = this.dropTargetAt(e, t);
			},
			onEnd: (e, n) => {
				let r = this.dropTarget;
				this.clearDrag(), window.setTimeout(() => {
					this.suppressClick = !1;
				}, 0), n && r && q(this, "layers-reorder", {
					itemId: t,
					targetId: r.itemId,
					edge: r.zone
				});
			},
			onCancel: () => this.clearDrag()
		});
	}
	dropTargetAt(e, t) {
		let n = this.shadowRoot?.elementFromPoint(e.clientX, e.clientY)?.closest(".layer-row, .root-row");
		if (!n) return;
		if (n.classList.contains("root-row")) return {
			itemId: "",
			zone: "inside"
		};
		let r = n.dataset.itemId, i = r ? L(this.items, r) : void 0;
		if (!i || ya(this.items, i.id, t)) return;
		let a = n.getBoundingClientRect();
		return {
			itemId: i.id,
			zone: Ed((e.clientY - a.top) / a.height, F(i))
		};
	}
	clearDrag() {
		this.draggingId = "", this.dropTarget = void 0;
	}
	runCommand(e, t, n) {
		e.stopPropagation(), q(this, "command", {
			id: t,
			itemId: n.id
		});
	}
	collapse() {
		q(this, "inspector-collapse", { collapsed: !0 });
	}
	selectRow(e, t) {
		this.suppressClick || q(this, "item-select", {
			itemId: t.id,
			additive: e.shiftKey
		});
	}
	selectRoot() {
		q(this, "item-select", { itemId: "" });
	}
	exitGroup() {
		q(this, "command", { id: "exit-group" });
	}
	onRowContextMenu(e, t) {
		e.preventDefault(), e.stopPropagation(), q(this, "context-menu", {
			source: "tree",
			itemId: t.id,
			clientX: e.clientX,
			clientY: e.clientY
		});
	}
	onRootKeyDown(e) {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.selectRoot());
	}
	onRowKeyDown(e, t) {
		e.target === e.currentTarget && (e.key === " " && (e.preventDefault(), q(this, "item-select", { itemId: t.id })), e.key === "F2" && (e.preventDefault(), this.startRename(t)));
	}
	onTreeKeyDown(e) {
		if (e.target instanceof HTMLInputElement) return;
		let t = Td(this.items, this.collapsed, this.searchText), n = L(this.items, this.selectedItemId);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let n = Dd(t, this.selectedItemId, e.key === "ArrowDown" ? 1 : -1);
			n && this.focusAndSelect(n);
		}
		e.key === "ArrowLeft" && n && (e.preventDefault(), this.foldOrGoUp(n, t)), e.key === "ArrowRight" && n && (e.preventDefault(), this.unfoldOrGoDown(n, t));
	}
	focusAndSelect(e) {
		q(this, "item-select", { itemId: e.item.id }), this.updateComplete.then(() => this.shadowRoot?.querySelector(`.layer-row[data-item-id="${CSS.escape(e.item.id)}"]`)?.focus());
	}
	foldOrGoUp(e, t) {
		if (F(e) && !this.collapsed.has(e.id)) {
			this.collapsed = /* @__PURE__ */ new Set([...this.collapsed, e.id]);
			return;
		}
		let n = va(this.items, e.id)[0], r = n && t.find((e) => e.item.id === n.id);
		r && this.focusAndSelect(r);
	}
	unfoldOrGoDown(e, t) {
		if (!F(e)) return;
		if (this.collapsed.has(e.id)) {
			let t = new Set(this.collapsed);
			t.delete(e.id), this.collapsed = t;
			return;
		}
		let n = e.children[e.children.length - 1], r = n && t.find((e) => e.item.id === n.id);
		r && this.focusAndSelect(r);
	}
	renderCommandButton(e, t) {
		let n = sl(t), r = ml(e);
		if (!r.isEnabled(n)) return V;
		let i = bl(r, n, ru());
		return B`
      <button
        class=${e === "delete-item" ? "delete" : ""}
        title=${i.title}
        aria-label=${`${i.label} ${t.name}`}
        @click=${(n) => this.runCommand(n, e, t)}
      >
        <ha-icon .icon=${i.icon}></ha-icon>
      </button>
    `;
	}
	chevronLabel(e, n) {
		return n ? t.structure.collapseRow(e.name) : t.structure.expandRow(e.name);
	}
	renderChevron(e) {
		if (!F(e)) return B`
        <span></span>
      `;
		let t = !this.collapsed.has(e.id);
		return B`
      <button
        class="chevron"
        aria-label=${this.chevronLabel(e, t)}
        aria-expanded=${t}
        @click=${(t) => this.toggleCollapsed(t, e)}
      >
        <ha-icon
          icon=${t ? "mdi:chevron-down" : "mdi:chevron-right"}
        ></ha-icon>
      </button>
    `;
	}
	renderName(e) {
		return this.renamingId === e.id ? B`
      <input
        class="rename"
        aria-label=${t.structure.rename}
        .value=${e.name}
        @click=${(e) => e.stopPropagation()}
        @keydown=${(t) => this.onRenameKeyDown(t, e)}
        @blur=${(t) => this.commitRename(t, e)}
      />
    ` : B`
        <strong>${e.name}</strong>
      `;
	}
	kindLabel(e) {
		return e.kind === "widget" ? t.structure.widget : e.kind === "container" ? e.grouped ? t.structure.group : t.structure.container : e.primitive.type;
	}
	renderCaption(e) {
		return B`
      <small>
        ${this.kindLabel(e)}
        ${F(e) ? B`
                <span>(${e.children.length})</span>
              ` : V}
        ${F(e) && e.grouped ? B`
                <span class="badge">${t.structure.groupBadge}</span>
              ` : V}
      </small>
    `;
	}
	renderRow(e) {
		let { item: t, depth: n } = e, r = this.dropTarget?.itemId === t.id ? this.dropTarget.zone : void 0, i = yu({
			"layer-row": !0,
			active: this.selectedItemIds.includes(t.id),
			"is-hidden": t.hidden,
			dragging: t.id === this.draggingId,
			"drop-before": r === "before",
			"drop-after": r === "after",
			"drop-inside": r === "inside"
		});
		return B`
      <div
        role="treeitem"
        tabindex="0"
        aria-label=${t.name}
        aria-level=${n + 1}
        aria-expanded=${F(t) ? !this.collapsed.has(t.id) : V}
        aria-selected=${this.selectedItemIds.includes(t.id)}
        data-item-id=${t.id}
        data-depth=${n}
        style=${K({ "--depth": String(n) })}
        class=${i}
        @pointerdown=${(e) => this.onRowPointerDown(e, t)}
        @click=${(e) => this.selectRow(e, t)}
        @contextmenu=${(e) => this.onRowContextMenu(e, t)}
        @keydown=${(e) => this.onRowKeyDown(e, t)}
      >
        ${this.renderChevron(t)}
        <ha-icon
          class="layer-type-icon"
          .icon=${od(t, this.widgets, this.primitives)}
        ></ha-icon>
        <span>${this.renderName(t)} ${this.renderCaption(t)}</span>
        <div class="layer-actions">
          ${Ad(t).map((e) => this.renderCommandButton(e, t))}
        </div>
      </div>
    `;
	}
	renderRootRow() {
		let e = this.dropTarget?.itemId === "" && this.dropTarget.zone === "inside";
		return B`
      <div
        class=${yu({
			"root-row": !0,
			active: this.selectedItemIds.length === 0,
			"drop-inside": e
		})}
        role="treeitem"
        tabindex="0"
        aria-label=${t.structure.rootName}
        aria-level="0"
        aria-selected=${this.selectedItemIds.length === 0}
        @click=${this.selectRoot}
        @keydown=${this.onRootKeyDown}
      >
        <ha-icon icon="mdi:monitor-dashboard"></ha-icon>
        ${t.structure.root(this.items.length)}
      </div>
    `;
	}
	renderBreadcrumb() {
		let e = L(this.items, this.enteredGroupId);
		return e ? B`
      <nav class="breadcrumb" aria-label=${t.structure.breadcrumb}>
        <span>${t.structure.rootName}</span>
        <span>›</span>
        <strong>${e.name}</strong>
        <button @click=${this.exitGroup}>${t.structure.exit}</button>
      </nav>
    ` : V;
	}
	renderRows() {
		let e = Td(this.items, this.collapsed, this.searchText);
		return this.items.length === 0 ? B`
        <p class="empty-layers">${t.structure.empty}</p>
      ` : B`
      ${this.renderRootRow()} ${e.map((e) => this.renderRow(e))}
    `;
	}
	render() {
		return B`
      <section class="layers">
        <header>
          <div>
            <span class="eyebrow">${t.structure.title}</span>
            <h2>${t.structure.heading}</h2>
          </div>
          <div class="layers-header-actions">
            <span class="count">${_a(this.items)}</span>
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
        ${this.renderBreadcrumb()}
        <label class="tree-search">
          <input
            type="search"
            aria-label=${t.structure.search}
            placeholder=${t.structure.searchPlaceholder}
            .value=${this.searchText}
            @input=${this.onSearchInput}
          />
        </label>
        <div class="layer-list" role="tree" @keydown=${this.onTreeKeyDown}>
          ${this.renderRows()}
        </div>
      </section>
    `;
	}
};
Y([W({ attribute: !1 })], Z.prototype, "items", void 0), Y([W({ attribute: !1 })], Z.prototype, "widgets", void 0), Y([W({ attribute: !1 })], Z.prototype, "primitives", void 0), Y([W()], Z.prototype, "selectedItemId", void 0), Y([W({ attribute: !1 })], Z.prototype, "selectedItemIds", void 0), Y([W()], Z.prototype, "enteredGroupId", void 0), Y([W()], Z.prototype, "renameRequestId", void 0), Y([G()], Z.prototype, "collapsed", void 0), Y([G()], Z.prototype, "searchText", void 0), Y([G()], Z.prototype, "renamingId", void 0), Y([G()], Z.prototype, "draggingId", void 0), Y([G()], Z.prototype, "dropTarget", void 0), Y([Pc(".layer-list")], Z.prototype, "layerList", void 0), Z = Y([U("ods-structure")], Z);
//#endregion
//#region src/ods-inspector.ts
var jd = 340, Md = 560, Nd = ["padding", "snapSize"], Pd = (e) => Nd.some((t) => t === e), Fd = (e) => e.label, Q = class extends H {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.selectedItemIds = [], this.enteredGroupId = "", this.renameRequestId = "", this.collapsed = !1, this.width = 350, this.showCorners = !1;
	}
	static {
		this.styles = [
			J,
			gu,
			z`
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
        min-height: 46px;
        display: grid;
        grid-template-columns: 30px minmax(0, 1fr);
        align-items: center;
        gap: 7px;
        padding: 6px 12px;
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
        display: flex;
        align-items: center;
        height: 38px;
        padding: 0 14px;
        cursor: pointer;
        gap: 7px;
        list-style: none;
        color: var(--studio-muted);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.045em;
        text-transform: uppercase;
      }
      .inspector-section > summary::-webkit-details-marker {
        display: none;
      }
      /* The arrow that says a section opens and closes: right when closed, down when open. */
      .inspector-section > summary::before {
        content: "";
        flex: none;
        border: 4px solid transparent;
        border-left: 5px solid currentColor;
        border-right: 0;
        transition: transform 0.12s;
      }
      .inspector-section[open] > summary::before {
        transform: rotate(90deg);
      }
      .section-body {
        padding: 0 14px 12px;
      }
      .field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
      }
      .disclosure {
        margin-top: 10px;
      }
      .disclosure > summary {
        display: flex;
        align-items: center;
        gap: 7px;
        list-style: none;
        color: var(--studio-muted);
        font-size: 11px;
        cursor: pointer;
      }
      .disclosure > summary::-webkit-details-marker {
        display: none;
      }
      .disclosure > summary::before {
        content: "";
        flex: none;
        border: 4px solid transparent;
        border-left: 5px solid currentColor;
        border-right: 0;
        transition: transform 0.12s;
      }
      .disclosure[open] > summary::before {
        transform: rotate(90deg);
      }
      .disclosure > ods-anchor-picker {
        margin-top: 6px;
      }
      .value-fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px 8px;
        margin-top: 10px;
      }
      .value-fields:first-child {
        margin-top: 0;
      }
      .value-field {
        min-width: 0;
      }
      .value-field.wide {
        grid-column: span 2;
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
		this.stopGesture = Hu({
			origin: e,
			onMove: (e) => {
				let r = n + t - e.clientX;
				q(this, "inspector-resize", { width: M(r, jd, Md) });
			}
		});
	}
	expand() {
		q(this, "inspector-collapse", { collapsed: !1 });
	}
	numberFrom(e) {
		let t = Math.round(Number(e.detail.value));
		return Number.isFinite(t) ? t : void 0;
	}
	onItemFieldChange(e, t) {
		e.stopPropagation();
		let n = this.numberFrom(e);
		n !== void 0 && (t.stored && t.key.includes("_") ? q(this, "primitive-change", { value: { [t.key]: n } }) : q(this, "item-number-change", {
			key: t.key,
			value: n
		}));
	}
	onDisplayFieldChange(e) {
		e.stopPropagation();
		let { key: t } = e.detail, n = this.numberFrom(e);
		n !== void 0 && Pd(t) && q(this, "display-number-change", {
			key: t,
			value: n
		});
	}
	onWidgetOptionsChange(e) {
		q(this, "widget-options-change", { value: e.detail.value });
	}
	onPicksChange(e, t, n) {
		let r = n.widget.sources[t.key] ?? [], i = e.detail.value[t.key];
		q(this, "widget-picks-change", {
			sourceKey: t.key,
			picks: _s(r, i)
		});
	}
	onPickFieldsChange(e, t, n, r) {
		let i = n.widget.sources[t.key] ?? [];
		q(this, "widget-picks-change", {
			sourceKey: t.key,
			picks: vs(i, r, e.detail.value, t)
		});
	}
	reloadWidgets() {
		q(this, "widgets-reload");
	}
	unlock(e) {
		q(this, "command", {
			id: "toggle-locked",
			itemId: e.id
		});
	}
	requestItemDelete(e) {
		q(this, "command", {
			id: "delete-item",
			itemId: e.id
		});
	}
	renderHeader(e, t, n) {
		return B`
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
		return B`
      <div class="danger-zone">
        <ha-button appearance="plain" variant="danger" @click=${t}>
          <ha-icon slot="start" icon="mdi:delete-outline"></ha-icon>
          ${e}
        </ha-button>
      </div>
    `;
	}
	renderMetrics() {
		let e = this.preview;
		if (!e) return V;
		let { timings: n } = e, r = t.inspector.metrics, i = [
			[r.queue, n.queue],
			[r.data, n.data],
			[r.compile, n.compile],
			[r.render, n.render],
			[r.encode, n.encode],
			[r.total, n.pipeline]
		];
		return B`
      ${e.warnings.map((e) => B`
          <ha-alert class="warning" alert-type="warning">${e}</ha-alert>
        `)}
      <details class="inspector-section telemetry">
        <summary>${t.inspector.diagnostics}</summary>
        <div class="section-body metrics">
          ${i.map(([e, n]) => B`
              <span>${e}</span>
              <strong>${t.common.milliseconds(n)}</strong>
            `)}
        </div>
      </details>
    `;
	}
	renderDisplayField(e, t, n, r) {
		return B`
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
	renderDashboardInspector() {
		return B`
      ${this.renderHeader(t.inspector.dashboard, t.inspector.dashboardHint, "mdi:monitor")}
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
      ${this.renderMetrics()}
    `;
	}
	renderLayoutField(e, t) {
		let n = B`
      <ods-property-field
        .label=${e.label}
        .fieldKey=${e.key}
        unit="px"
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
		return B`
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
		return this.renderExpressible(e, go, t.expression.visibleLabel, B`
        <span class="field-help">${t.expression.alwaysVisible}</span>
      `);
	}
	renderCornerToggle(e) {
		return zo(e, this.primitives) ? B`
      <button
        type="button"
        class="text-button"
        @click=${() => this.showCorners = !this.showCorners}
      >
        ${this.showCorners ? t.expression.derivedFields : t.expression.cornerFields}
      </button>
    ` : V;
	}
	renderLockedNotice(e) {
		return e.locked ? B`
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
    ` : V;
	}
	onAlignChoice(e) {
		e.stopPropagation(), q(this, "align-in-parent", { place: e.detail.anchor });
	}
	renderAlignInParent(e) {
		let n = $o(e, this.primitives), r = e.locked || n.position.length > 0;
		return B`
      <details class="disclosure">
        <summary>${t.inspector.alignInParent}</summary>
        <ods-anchor-picker
          .disabled=${r}
          @anchor-change=${this.onAlignChoice}
        ></ods-anchor-picker>
      </details>
    `;
	}
	renderLayoutSection(e) {
		let { grid: n, extra: r } = Bo(e, this.dashboard, this.primitives, this.showCorners);
		return B`
      <details class="inspector-section" open>
        <summary>${t.inspector.layout}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${n.map((t) => this.renderLayoutField(t, e))}
          </div>
          ${r.map((t) => this.renderLayoutField(t, e))}
          ${e.kind === "primitive" ? this.renderValueFields(e, "layout") : V}
          ${this.renderCornerToggle(e)} ${this.renderAlignInParent(e)}
          ${this.renderVisibility(e)}
        </div>
      </details>
    `;
	}
	formSchema(e, t = !1) {
		return {
			name: e.key,
			label: e.label,
			required: t,
			selector: us(e.selector, this.dashboard.display.palette)
		};
	}
	renderPickFields(e, t, n) {
		let r = typeof n.label == "string" && n.label ? n.label : n.id;
		return B`
      <details class="pick-fields" data-pick=${n.id}>
        <summary>${r}</summary>
        <ha-form
          .hass=${this.hass}
          .data=${n}
          .schema=${t.perSource.map((e) => this.formSchema(e))}
          .computeLabel=${Fd}
          @value-changed=${(r) => this.onPickFieldsChange(r, t, e, n.id)}
        ></ha-form>
      </details>
    `;
	}
	renderSource(e, t) {
		let n = e.widget.sources[t.key] ?? [];
		return B`
      <div class="widget-source" data-source=${t.key}>
        <ha-form
          .hass=${this.hass}
          .data=${{ [t.key]: gs(t, n) }}
          .schema=${[this.formSchema(t, t.required)]}
          .computeLabel=${Fd}
          @value-changed=${(n) => this.onPicksChange(n, t, e)}
        ></ha-form>
        ${t.perSource.length > 0 ? n.map((n) => this.renderPickFields(e, t, n)) : V}
      </div>
    `;
	}
	renderSources(e, n) {
		return n.sources.length === 0 ? V : B`
      <details class="inspector-section" open>
        <summary>${t.inspector.dataSources}</summary>
        <div class="section-body">
          ${n.sources.map((t) => this.renderSource(e, t))}
        </div>
      </details>
    `;
	}
	renderOptionSection(e, t, n) {
		return B`
      <details class="inspector-section" ?open=${n}>
        <summary>${t.section}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${e.widget.options}
            .schema=${t.fields.map((e) => this.formSchema(e))}
            .computeLabel=${Fd}
            @value-changed=${this.onWidgetOptionsChange}
          ></ha-form>
        </div>
      </details>
    `;
	}
	renderMissingWidget(e) {
		return B`
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
		return t ? B`
      ${this.renderSources(e, t)}
      ${t.options.map((t, n) => this.renderOptionSection(e, t, n === 0))}
    ` : this.renderMissingWidget(e);
	}
	fieldSpan(e) {
		return e.shape === "number" ? "" : "wide";
	}
	renderValueField(e, t) {
		let n = { ...e.primitive }, r = B`
      <ods-value-field
        .hass=${this.hass}
        .field=${t}
        .value=${n[t.key]}
        .palette=${this.dashboard.display.palette}
        .display=${this.dashboard.display}
        .disabled=${e.locked}
      ></ods-value-field>
    `;
		return B`
      <div class=${`value-field ${this.fieldSpan(t)}`}>
        ${this.renderExpressible(e, t.key, t.label, r)}
      </div>
    `;
	}
	renderValueFields(e, t) {
		return B`
      <div class="value-fields">
        ${Wo(e, this.primitives, t).map((t) => this.renderValueField(e, t))}
      </div>
    `;
	}
	renderAppearance(e) {
		return B`
      <details class="inspector-section" open>
        <summary>${t.inspector.appearance}</summary>
        <div class="section-body">
          ${this.renderValueFields(e, "appearance")}
        </div>
      </details>
    `;
	}
	onContainerBackgroundChange(e) {
		q(this, "container-background-change", { value: e.detail.value });
	}
	renderContainerBackground(e) {
		if (e.grouped) return V;
		let n = t.inspector, r = no(this.dashboard.display.palette, {
			enabled: n.backgroundEnabled,
			fill: n.backgroundFill,
			outline: n.backgroundOutline,
			width: n.backgroundWidth,
			radius: n.backgroundRadius
		});
		return B`
      <details class="inspector-section" open>
        <summary>${n.background}</summary>
        <div class="section-body">
          <ha-form
            .hass=${this.hass}
            .data=${ro(e)}
            .schema=${r}
            .computeLabel=${Fd}
            @value-changed=${this.onContainerBackgroundChange}
          ></ha-form>
        </div>
      </details>
    `;
	}
	renderItemSections(e) {
		return e.kind === "widget" ? B`
        ${this.renderWidgetSettings(e)} ${this.renderLayoutSection(e)}
      ` : e.kind === "container" ? B`
        ${this.renderLayoutSection(e)}
        ${this.renderContainerBackground(e)}
      ` : B`
      ${this.renderLayoutSection(e)} ${this.renderAppearance(e)}
    `;
	}
	kindOf(e) {
		return e.kind === "widget" ? t.inspector.kindWidget : e.kind === "container" ? e.grouped ? t.inspector.kindGroup : t.inspector.kindContainer : t.inspector.kindPrimitive;
	}
	renderGroupedChip(e) {
		return e.kind !== "container" || !e.grouped ? V : B`
      <div class="locked-notice grouped-chip">
        <span>
          <ha-icon icon="mdi:group"></ha-icon>
          ${t.inspector.groupedChip}
        </span>
      </div>
    `;
	}
	renderItemInspector(e) {
		return B`
      ${this.renderHeader(e.name, t.inspector.subtitle(this.kindOf(e), e.locked), od(e, this.widgets, this.primitives))}
      ${this.renderGroupedChip(e)} ${this.renderLockedNotice(e)}
      ${this.renderItemSections(e)}
      ${this.renderDangerZone(t.inspector.removeElement, () => this.requestItemDelete(e))}
      ${this.renderMetrics()}
    `;
	}
	renderMultiInspector() {
		let e = this.selectedItemIds.length, n = zu(this.dashboard, this.selectedItemIds, (e) => this.preview?.itemBounds[e.id]);
		return B`
      ${this.renderHeader(t.inspector.selectedElements(e), t.inspector.selectionHint, "mdi:select-multiple")}
      ${n ? B`
              <details class="inspector-section" open>
                <summary>${t.inspector.boundingBox}</summary>
                <div class="section-body">
                  <div class="field-grid">
                    ${this.renderBoxValue(t.fields.x, n.x)}
                    ${this.renderBoxValue(t.fields.y, n.y)}
                    ${this.renderBoxValue(t.fields.width, n.width)}
                    ${this.renderBoxValue(t.fields.height, n.height)}
                  </div>
                </div>
              </details>
            ` : V}
      ${this.renderDangerZone(t.inspector.removeElements, () => q(this, "command", { id: "delete-item" }))}
    `;
	}
	renderBoxValue(e, t) {
		return B`
      <ods-property-field
        .label=${e}
        .fieldKey=${e}
        .value=${Math.round(t)}
        .disabled=${!0}
      ></ods-property-field>
    `;
	}
	renderRail() {
		return B`
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
	renderProperties(e) {
		return this.selectedItemIds.length > 1 ? this.renderMultiInspector() : e ? this.renderItemInspector(e) : this.renderDashboardInspector();
	}
	render() {
		if (this.collapsed) return this.renderRail();
		let e = L(this.dashboard.items, this.selectedItemId);
		return B`
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
          .selectedItemIds=${this.selectedItemIds}
          .enteredGroupId=${this.enteredGroupId}
          .renameRequestId=${this.renameRequestId}
        ></ods-structure>
        <section class="properties">${this.renderProperties(e)}</section>
      </aside>
    `;
	}
};
Y([W({ attribute: !1 })], Q.prototype, "hass", void 0), Y([W({ attribute: !1 })], Q.prototype, "dashboard", void 0), Y([W({ attribute: !1 })], Q.prototype, "widgets", void 0), Y([W({ attribute: !1 })], Q.prototype, "primitives", void 0), Y([W({ attribute: !1 })], Q.prototype, "preview", void 0), Y([W()], Q.prototype, "selectedItemId", void 0), Y([W({ attribute: !1 })], Q.prototype, "selectedItemIds", void 0), Y([W()], Q.prototype, "enteredGroupId", void 0), Y([W()], Q.prototype, "renameRequestId", void 0), Y([W({ type: Boolean })], Q.prototype, "collapsed", void 0), Y([W({ type: Number })], Q.prototype, "width", void 0), Y([G()], Q.prototype, "showCorners", void 0), Y([Pc(".properties")], Q.prototype, "propertiesPanel", void 0), Q = Y([U("ods-inspector")], Q);
//#endregion
//#region src/catalog.ts
var Id = (e, t) => {
	let n = t.trim().toLocaleLowerCase();
	return n ? e.filter((e) => `${e.name} ${e.description}`.toLocaleLowerCase().includes(n)) : e;
}, Ld = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.category, [...t.get(n.category) ?? [], n]);
	return [...t.entries()];
}, Rd = 4, zd = () => ({
	id: "container",
	name: t.library.container,
	description: t.library.containerHint,
	icon: "mdi:select-all"
}), Bd = class extends H {
	constructor(...e) {
		super(...e), this.widgets = [], this.widgetErrors = [], this.primitives = [], this.collapsed = !1, this.searchText = "", this.suppressClick = !1;
	}
	static {
		this.styles = [
			J,
			gu,
			z`
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
		this.stopGesture = Hu({
			origin: e,
			threshold: Rd,
			onActivate: () => q(this, "catalog-drag", { active: !0 }),
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
				this.ghost = void 0, n && (q(this, "catalog-drag", { active: !1 }), this.suppressClick = !0, q(this, "catalog-drop", {
					value: t,
					clientX: e.clientX,
					clientY: e.clientY
				}), window.setTimeout(() => {
					this.suppressClick = !1;
				}, 0));
			},
			onCancel: () => {
				this.ghost = void 0, q(this, "catalog-drag", { active: !1 });
			}
		});
	}
	onSearchInput(e) {
		this.searchText = tu(e);
	}
	addFromClick(e) {
		this.suppressClick || q(this, "catalog-add", { value: e });
	}
	renderEntry(e, n) {
		let r = `${n}:${e.id}`;
		return B`
      <button
        class="catalog-item"
        title=${t.library.entryHint(e.description)}
        @click=${() => this.addFromClick(r)}
        @pointerdown=${(t) => this.startDrag(t, r, e)}
      >
        <ha-icon .icon=${e.icon}></ha-icon>
        <strong>${e.name}</strong>
        ${e.user ? B`
                <span class="user-badge">${t.library.userWidget}</span>
              ` : V}
        <small>${e.description}</small>
      </button>
    `;
	}
	renderEntries(e, t, n) {
		return e.length ? B`
      ${e.map((e) => this.renderEntry(e, t))}
    ` : B`
        <p class="empty-result">${n}</p>
      `;
	}
	reloadWidgets() {
		q(this, "widgets-reload");
	}
	renderWidgetErrors() {
		return this.widgetErrors.length === 0 ? V : B`
      <details class="widget-errors">
        <summary>
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          ${t.library.widgetErrors(this.widgetErrors.length)}
        </summary>
        <ul>
          ${this.widgetErrors.map((e) => B`
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
		return e.length === 0 ? B`
        <p class="empty-result">${t.library.noWidgets}</p>
      ` : B`
      ${Ld(e).map(([e, t]) => B`
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
		if (!e) return V;
		let t = K({
			left: `${e.x}px`,
			top: `${e.y}px`,
			width: `${e.width}px`,
			height: `${e.height}px`
		});
		return B`
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
		if (this.collapsed) return B`
        <aside class="panel panel-rail">
          <button
            class="icon-button"
            title=${t.library.expand}
            aria-label=${t.library.expand}
            @click=${() => q(this, "library-collapse", { collapsed: !1 })}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <span class="rail-label">${t.library.title}</span>
        </aside>
      `;
		let e = Id(this.widgets, this.searchText), n = Id([zd()], this.searchText), r = Id(this.primitives, this.searchText).map((e) => ({
			...e,
			id: e.type
		}));
		return B`
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
            @click=${() => q(this, "library-collapse", { collapsed: !0 })}
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
              <span class="count">${r.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(r, "primitive", t.library.noPrimitives)}
            </div>
          </section>
          <section class="catalog-section">
            <header>
              <span>${t.library.containers}</span>
              <span class="count">${n.length}</span>
            </header>
            <div class="catalog-grid">
              ${this.renderEntries(n, "container", t.library.noContainers)}
            </div>
          </section>
        </div>
      </aside>
    `;
	}
};
Y([W({ attribute: !1 })], Bd.prototype, "widgets", void 0), Y([W({ attribute: !1 })], Bd.prototype, "widgetErrors", void 0), Y([W({ attribute: !1 })], Bd.prototype, "primitives", void 0), Y([W({ type: Boolean })], Bd.prototype, "collapsed", void 0), Y([G()], Bd.prototype, "searchText", void 0), Y([G()], Bd.prototype, "ghost", void 0), Bd = Y([U("ods-library")], Bd);
//#endregion
//#region src/ods-new-dashboard-dialog.ts
var Vd = class extends H {
	constructor(...e) {
		super(...e), this.devices = [], this.source = "custom", this.deviceId = "", this.saving = !1;
	}
	static {
		this.styles = [
			J,
			gu,
			z`
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
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 9px;
      }
      .dashboard-source {
        min-width: 0;
        min-height: 52px;
        display: grid;
        grid-template-columns: 24px minmax(0, 1fr);
        align-items: center;
        gap: 9px;
        padding: 8px 10px;
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
      .display-summary {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
        margin: 0;
      }
      .display-summary div {
        padding: 9px 11px;
        border: 1px solid var(--studio-border);
        border-radius: 9px;
      }
      .display-summary dt {
        color: var(--studio-muted);
        font-size: 10px;
      }
      .display-summary dd {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 3px 0 0;
        font-size: 12px;
        font-weight: 700;
      }
      .swatch {
        width: 12px;
        height: 12px;
        border: 1px solid var(--studio-border);
        border-radius: 50%;
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
		q(this, "new-dashboard-change", { value: e.detail.value });
	}
	deviceChanged(e) {
		q(this, "new-dashboard-device", { deviceId: e.detail.value.deviceId ?? "" });
	}
	profileChanged(e) {
		q(this, "new-dashboard-profile", { profileId: e.detail.value.profileId ?? "" });
	}
	close() {
		q(this, "new-dashboard-close");
	}
	create() {
		q(this, "dashboard-create");
	}
	renderSource(e, t, n, r) {
		let i = this.source === e;
		return B`
      <button
        class=${i ? "dashboard-source selected" : "dashboard-source"}
        type="button"
        role="radio"
        aria-checked=${i ? "true" : "false"}
        @click=${() => q(this, "new-dashboard-source", { source: e })}
      >
        <ha-icon icon=${t}></ha-icon>
        <span>
          <strong>${n}</strong>
          <small>${r}</small>
        </span>
      </button>
    `;
	}
	renderSources() {
		let e = t.newDashboard;
		return B`
      <div
        class="dashboard-source-options"
        role="radiogroup"
        aria-label=${e.sources}
      >
        ${this.renderSource("device", "mdi:devices", e.fromDevice, e.fromDeviceHint)}
        ${this.renderSource("preset", "mdi:format-list-bulleted", e.preset, e.presetHint)}
        ${this.renderSource("custom", "mdi:monitor", e.customSize, e.customSizeHint)}
      </div>
    `;
	}
	renderDisplaySummary() {
		let { width: e, height: n, palette: r } = this.dashboard.display;
		return B`
      <dl
        class="display-summary"
        role="group"
        aria-label=${t.newDashboard.deviceDetails}
      >
        <div>
          <dt>${t.fields.resolution}</dt>
          <dd>${t.common.sizeInPixels(e, n)}</dd>
        </div>
        <div>
          <dt>${t.newDashboard.colors}</dt>
          <dd class="swatches">
            ${Mr[r].map((e) => B`
                <span
                  class="swatch"
                  title=${e}
                  style=${`background:${e}`}
                ></span>
              `)}
            ${jr[r]}
          </dd>
        </div>
      </dl>
    `;
	}
	renderPicker(e, t, n, r, i) {
		return B`
      <ha-form
        .hass=${this.hass}
        .data=${{ [e]: r }}
        .schema=${[{
			name: e,
			label: t,
			selector: { select: {
				mode: "dropdown",
				options: n
			} }
		}]}
        .computeLabel=${Zl}
        @value-changed=${i}
      ></ha-form>
    `;
	}
	renderDevicePicker() {
		if (this.devices.length === 0) return B`
        <ha-alert alert-type="info">${t.newDashboard.noDevices}</ha-alert>
      `;
		let e = this.devices.map((e) => ({
			value: e.id,
			label: `${e.name} · ${t.common.size(e.width, e.height)}`
		}));
		return B`
      ${this.renderPicker("deviceId", t.newDashboard.device, e, this.deviceId, this.deviceChanged)}
      ${this.renderDisplaySummary()}
    `;
	}
	renderProfilePicker() {
		let e = Vl.map((e) => ({
			value: e.id,
			label: `${e.manufacturer} · ${e.name}`
		}));
		return B`
      ${this.renderPicker("profileId", t.newDashboard.display, e, this.dashboard.display.profileId ?? "", this.profileChanged)}
      ${this.renderDisplaySummary()}
    `;
	}
	renderSourceBody() {
		return this.source === "device" ? this.renderDevicePicker() : this.source === "preset" ? this.renderProfilePicker() : V;
	}
	displayFields() {
		return this.source === "custom" ? {
			size: !0,
			palettes: Bl,
			backgrounds: []
		} : this.source === "preset" ? {
			size: !1,
			palettes: Rr(this.dashboard.display.profileId).palettes,
			backgrounds: []
		} : {
			size: !1,
			palettes: [],
			backgrounds: []
		};
	}
	render() {
		return B`
      <ha-dialog
        .open=${!0}
        width="medium"
        style="--ha-dialog-width-md: 720px"
        header-title=${t.newDashboard.title}
        header-subtitle=${t.newDashboard.subtitle}
        @closed=${this.close}
      >
        <div class="new-dashboard-content">
          <span class="form-label">${t.newDashboard.startFrom}</span>
          ${this.renderSources()} ${this.renderSourceBody()}
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Ml(this.dashboard)}
            .schema=${Xl(this.displayFields())}
            .computeLabel=${Zl}
            @value-changed=${this.formChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${this.close}
          >
            ${t.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !Ll(this.dashboard)}
            @click=${this.create}
          >
            ${this.saving ? t.newDashboard.creating : t.newDashboard.create}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
};
Y([W({ attribute: !1 })], Vd.prototype, "hass", void 0), Y([W({ attribute: !1 })], Vd.prototype, "dashboard", void 0), Y([W({ attribute: !1 })], Vd.prototype, "devices", void 0), Y([W()], Vd.prototype, "source", void 0), Y([W()], Vd.prototype, "deviceId", void 0), Y([W({ type: Boolean })], Vd.prototype, "saving", void 0), Vd = Y([U("ods-new-dashboard-dialog")], Vd);
//#endregion
//#region src/ods-app.ts
var Hd = (e, t) => va(e.items, t).map((e) => e.id), Ud = "opendisplay_studio.clipboard", Wd = 1.25, Gd = 228, Kd = 36, qd = 9, Jd = 8, Yd = () => {
	try {
		let e = window.localStorage.getItem(Ud), t = e ? JSON.parse(e) : void 0;
		return Xd(t) ? t : void 0;
	} catch {
		return;
	}
}, Xd = (e) => typeof e == "object" && !!e && "items" in e && Array.isArray(e.items), Zd = (e) => {
	try {
		window.localStorage.setItem(Ud, JSON.stringify(e));
	} catch {}
}, Qd = (e, t) => e === "left" ? {
	dx: -t,
	dy: 0
} : e === "right" ? {
	dx: t,
	dy: 0
} : e === "up" ? {
	dx: 0,
	dy: -t
} : {
	dx: 0,
	dy: t
}, $d = 220, ef = 5e3, tf = (e, t) => e instanceof Error && e.message ? e.message : typeof e == "string" && e ? e : t, $ = class extends H {
	constructor(...e) {
		super(...e), this.dashboards = [], this.view = "dashboards", this.widgets = [], this.widgetErrors = [], this.notice = "", this.sending = !1, this.primitives = [], this.selection = [], this.enteredGroupId = "", this.shortcutsOpen = !1, this.renameRequestId = "", this.clipboard = Yd(), this.loading = !0, this.saving = !1, this.dirty = !1, this.error = "", this.draggingCatalog = !1, this.undoCount = 0, this.redoCount = 0, this.pendingDeleteIds = [], this.leftCollapsed = !1, this.rightCollapsed = !1, this.inspectorWidth = 350, this.snapEnabled = !0, this.viewport = is, this.newDashboardOpen = !1, this.newDashboard = jl("en"), this.newDashboardSource = "custom", this.newDashboardDeviceId = "", this.displayDevices = [], this.previewRequest = 0, this.bootstrapStarted = !1, this.history = new au(), this.undo = () => {
			this.current && this.restore(this.history.undo(this.current));
		}, this.redo = () => {
			this.current && this.restore(this.history.redo(this.current));
		}, this.commandActions = {
			undo: () => this.undo(),
			redo: () => this.redo(),
			requestDelete: (e) => {
				this.pendingDeleteIds = e;
			},
			toggleFlag: (e, t) => this.mutate((n) => {
				for (let r of e) Jc(n, r, t);
			}),
			group: (e) => this.groupSelection(e),
			ungroup: (e) => this.ungroup(e),
			enterGroup: (e) => this.enterGroup(e),
			exitGroup: () => this.exitGroup(),
			deselect: () => this.clearSelection(),
			copy: (e) => this.copy(e),
			cut: (e) => this.cut(e),
			paste: () => this.paste(),
			pasteHere: () => this.pasteHere(),
			duplicate: (e) => this.duplicate(e),
			arrange: (e, t) => this.arrange(e, t),
			rename: (e) => {
				this.renameRequestId = e;
			},
			save: () => void this.saveDashboard(),
			toggleCode: () => this.setEditorView(this.view === "code" ? "design" : "code"),
			zoom: (e) => this.zoom(e),
			nudge: (e, t, n) => this.nudge(e, t, n),
			showShortcuts: () => {
				this.shortcutsOpen = !0;
			}
		}, this.onKeyDown = (e) => {
			if (e.defaultPrevented) return;
			if (this.menu && e.key === "Escape") {
				e.preventDefault(), this.closeMenu();
				return;
			}
			if (this.shortcutsOpen && e.key === "Escape") {
				this.shortcutsOpen = !1;
				return;
			}
			if (nu(e) || this.view === "dashboards") return;
			let t = _l(e, this.commandContext());
			!t || this.view === "code" && !t.anywhere || (e.preventDefault(), this.runCommand(t.id));
		};
	}
	static {
		this.styles = [
			J,
			gu,
			z`
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
      .menu-scrim {
        position: absolute;
        inset: 0;
        z-index: 40;
      }
      .menu-layer {
        position: absolute;
        z-index: 41;
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
	get selectedItemId() {
		return this.selection.at(-1) ?? "";
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
	willUpdate(e) {
		e.has("hass") && this.hass && f(this.hass.language);
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
				let t = await cu(e);
				this.dashboards = t.dashboards, this.widgets = t.widgets, this.widgetErrors = t.widgetErrors, this.primitives = t.primitives, this.current = void 0, this.preview = void 0, this.view = "dashboards", this.clearHistory(), this.newDashboard = jl(e.language);
			} catch (e) {
				this.error = tf(e, t.app.loadFailed);
			} finally {
				this.loading = !1;
			}
		}
	}
	async openNewDashboard() {
		this.displayDevices = await this.loadDisplayDevices(), this.newDashboard = jl(this.language), this.newDashboardDeviceId = "", this.newDashboardOpen = !0, this.chooseNewDashboardSource(this.displayDevices.length ? "device" : "preset");
	}
	async loadDisplayDevices() {
		if (!this.hass) return [];
		try {
			return await mu(this.hass);
		} catch {
			return [];
		}
	}
	chooseNewDashboardSource(e) {
		this.newDashboardSource = e, e === "device" && this.useDevice(this.newDashboardDeviceId || this.displayDevices[0]?.id), e === "preset" && this.useProfile(this.newDashboard.display.profileId ?? "");
	}
	useDevice(e) {
		let t = this.displayDevices.find((t) => t.id === e);
		t && (this.newDashboardDeviceId = t.id, this.newDashboard = Pl(this.newDashboard, t));
	}
	useProfile(e) {
		let t = Vl.find((t) => t.id === e) ?? Vl[0];
		this.newDashboard = Fl(this.newDashboard, t);
	}
	async createDashboard() {
		if (this.hass) {
			this.saving = !0, this.error = "";
			try {
				let e = await uu(this.hass, this.newDashboard);
				this.dashboards = [...this.dashboards, e], this.current = structuredClone(e), this.clearSelection(), this.dirty = !1, this.newDashboardOpen = !1, this.view = "design", this.clearHistory(), await this.composePreview(), await this.updateComplete, this.showWholeCanvas();
			} catch (e) {
				this.error = tf(e, t.app.createFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveDashboard() {
		if (!(!this.hass || !this.current)) {
			this.saving = !0, this.error = "";
			try {
				let e = await du(this.hass, this.current);
				this.current = structuredClone(e), this.dashboards = this.dashboards.map((t) => t.id === e.id ? e : t), this.dirty = !1;
			} catch (e) {
				this.error = tf(e, t.app.saveFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async sendToDevice() {
		if (!(!this.hass || !this.current)) {
			this.sending = !0, this.error = "";
			try {
				await hu(this.hass, this.current), this.showNotice(t.app.sentToDevice);
			} catch (e) {
				this.error = tf(e, t.app.sendFailed);
			} finally {
				this.sending = !1;
			}
		}
	}
	openDashboard(e) {
		if (this.current?.id === e.id) {
			this.view = "design", this.preview || this.composePreview();
			return;
		}
		this.dirty && !window.confirm(t.app.discardChanges) || (this.current = structuredClone(e), this.clearSelection(), this.dirty = !1, this.clearHistory(), this.view = "design", this.composePreview().then(() => this.showWholeCanvas()));
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
				let t = await du(this.hass, e);
				return this.dashboards = this.dashboards.map((e) => e.id === t.id ? t : e), this.current?.id === t.id && (this.current = structuredClone(t), this.preview = void 0, this.dirty = !1), t;
			} catch (e) {
				this.error = tf(e, t);
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
		n.id = "", n.name = zl(e, this.dashboards, this.language), n.status = "draft", n.createdAt = "", n.updatedAt = "";
		try {
			let e = await uu(this.hass, n);
			this.dashboards = [...this.dashboards, e];
		} catch (e) {
			this.error = tf(e, t.app.duplicateFailed);
		} finally {
			this.saving = !1;
		}
	}
	async saveSettings() {
		if (this.dashboardDialog !== "settings" || !this.dashboardDraft || !Ll(this.dashboardDraft)) return;
		let e = structuredClone(this.dashboardDraft);
		e.name = e.name.trim(), await this.updateFromGallery(e, t.app.settingsFailed) && this.closeAction();
	}
	async confirmDeleteDashboard() {
		if (this.dashboardDialog !== "delete" || !this.dashboardDraft || !this.hass || this.saving) return;
		let e = this.dashboardDraft.id;
		this.saving = !0, this.error = "";
		try {
			await fu(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current?.id === e && (this.current = void 0, this.clearSelection(), this.preview = void 0, this.dirty = !1, this.clearHistory()), this.closeAction();
		} catch (e) {
			this.error = tf(e, t.app.deleteFailed);
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
		e && (this.current = e, this.dirty = !0, this.keepExistingSelection(e), this.syncHistory(), this.schedulePreview());
	}
	commandContext(e, t) {
		let n = this.current, r = t ?? (e ? [e] : this.selectedItems), i = r.map((e) => e.id), a = e ?? r.at(-1);
		return {
			canUndo: this.undoCount > 0,
			canRedo: this.redoCount > 0,
			item: a,
			targets: r,
			canGroup: n ? Ua(n, i) : !1,
			canUngroup: n && a ? Wa(n, a.id) : !1,
			canEnter: a ? ma(a) : !1,
			entered: this.enteredGroupId !== "",
			canPaste: (this.clipboard?.items.length ?? 0) > 0,
			dirty: this.dirty
		};
	}
	get selectedItems() {
		let e = this.current?.items ?? [];
		return this.selection.flatMap((t) => L(e, t) ?? []);
	}
	get selectedItem() {
		return this.selectedItems.at(-1);
	}
	runCommand(e, t) {
		let n = ml(e), r = this.commandContext(t);
		n.isEnabled(r) && n.run(r, this.commandActions);
	}
	onCommand(e) {
		let { id: t, itemId: n } = e.detail, r = n ? L(this.current?.items ?? [], n) : void 0;
		this.runCommand(t, r);
	}
	copy(e) {
		let t = this.current;
		t && (this.clipboard = so(t, e), Zd(this.clipboard));
	}
	cut(e) {
		this.copy(e), this.mutate((t) => {
			for (let n of e) Yc(t, n);
		}), this.setSelection(this.selection.filter((t) => !e.includes(t)));
	}
	paste() {
		this.pasteWith(() => ({ delta: {
			x: 8,
			y: 8
		} }));
	}
	pasteHere() {
		let e = this.menu?.point, t = this.current;
		if (!e || !t) return;
		let n = ja(t.items, e.x, e.y, [], this.enteredGroupId || void 0);
		this.pasteWith(() => ({ anchor: e }), n ? { parentId: n.id } : {});
	}
	pasteWith(e, t) {
		let n = this.current, r = this.clipboard ?? Yd();
		if (!n || !r) return;
		let i = [];
		this.mutate((n) => {
			let a = t ?? lo(n, this.selection);
			i = po(n, r, a, e());
		}), i.length > 0 && this.setSelection(i);
	}
	duplicate(e) {
		let t = [];
		this.mutate((n) => {
			t = mo(n, e);
		}), t.length > 0 && this.setSelection(t);
	}
	arrange(e, t) {
		this.mutate((n) => {
			t === "front" && Fa(n, e), t === "back" && Ia(n, e), (t === "up" || t === "down") && Ra(n, e, t);
		});
	}
	nudge(e, t, n) {
		let r = this.current;
		if (!r) return;
		let { dx: i, dy: a } = Qd(t, n ? r.display.snapSize : 1);
		this.mutate((t) => {
			ho(t, e, i, a, ra(t), (e) => $o(e, this.primitives).position.length === 0);
		});
	}
	zoom(e) {
		if (e === "reset") {
			this.canvas?.resetView();
			return;
		}
		let t = e === "in" ? Wd : 1 / Wd;
		this.viewport = as(this.viewport, this.viewport.zoom * t);
	}
	closeMenu() {
		this.menu = void 0;
	}
	menuLayout(e) {
		return e === "empty" ? Cl : e === "tree" ? Sl : xl;
	}
	onContextMenu(e) {
		let { source: n, itemId: r, clientX: i, clientY: a, point: o } = e.detail, s = this.current;
		if (!s) return;
		r && !this.selection.includes(r) && this.selectItem(r), !r && n === "empty" && this.clearSelection();
		let c = r ? L(s.items, r) : void 0, l = c ? this.targetsForMenu(c) : [], u = this.commandContext(c, l), d = wl(this.menuLayout(n), u, ru());
		d.length !== 0 && (this.menu = {
			...this.menuPosition(i, a, d),
			label: c?.name ?? t.canvas.menuLabel,
			entries: d,
			itemId: r,
			point: o
		});
	}
	targetsForMenu(e) {
		return this.selection.includes(e.id) ? this.selectedItems : [e];
	}
	menuPosition(e, t, n) {
		let r = this.getBoundingClientRect(), i = n.length * Kd + n.filter((e) => e.separatorBefore).length * qd + 16, a = e - r.left, o = t - r.top;
		return {
			x: a + Gd + Jd > r.width ? Math.max(Jd, a - Gd) : a,
			y: o + i + Jd > r.height ? Math.max(Jd, r.height - i - Jd) : o
		};
	}
	onMenuSelect(e) {
		let t = this.menu;
		if (this.closeMenu(), !t || !this.current) return;
		let n = t.itemId ? L(this.current.items, t.itemId) : void 0;
		if (!pl(e.detail.id)) return;
		let r = ml(e.detail.id), i = this.commandContext(n, n ? this.targetsForMenu(n) : []);
		r.isEnabled(i) && (this.menu = t, r.run(i, this.commandActions), this.menu = void 0);
	}
	renderMenu() {
		let e = this.menu;
		return e ? B`
      <div
        class="menu-scrim"
        @pointerdown=${this.closeMenu}
        @contextmenu=${this.dismissMenu}
      ></div>
      <div
        class="menu-layer"
        style=${K({
			left: `${e.x}px`,
			top: `${e.y}px`
		})}
      >
        <ods-context-menu
          .entries=${e.entries}
          .label=${e.label}
          @menu-select=${this.onMenuSelect}
        ></ods-context-menu>
      </div>
    ` : V;
	}
	dismissMenu(e) {
		e.preventDefault(), this.closeMenu();
	}
	renderShortcutsDialog() {
		return this.shortcutsOpen ? B`
      <ods-shortcuts-dialog
        @shortcuts-close=${() => {
			this.shortcutsOpen = !1;
		}}
      ></ods-shortcuts-dialog>
    ` : V;
	}
	schedulePreview() {
		this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.composePreview(), $d);
	}
	refreshOnStateChange(e) {
		let t = this.preview?.dependencies;
		!t || !Ss(t, e?.states, this.hass?.states) || (this.stateTimer && window.clearTimeout(this.stateTimer), this.stateTimer = window.setTimeout(() => void this.composePreview(), 500));
	}
	scheduleClockRefresh() {
		this.clockTimer && window.clearTimeout(this.clockTimer), this.preview?.dependencies.usesTime && (this.clockTimer = window.setTimeout(() => void this.composePreview(), ys));
	}
	async composePreview() {
		if (!this.hass || !this.current) return;
		this.error = "";
		let e = ++this.previewRequest, n = structuredClone(this.current);
		try {
			let t = await pu(this.hass, n);
			e === this.previewRequest && (this.preview = {
				...t,
				composedFrom: n
			}, this.scheduleClockRefresh());
		} catch (e) {
			this.error = tf(e, t.app.previewFailed);
		}
	}
	setEditorView(e) {
		this.view = e, e === "code" && !this.preview && this.composePreview();
	}
	selectItem(e) {
		this.setSelection(e ? [e] : []);
	}
	clearSelection() {
		this.setSelection([]);
	}
	setSelection(e) {
		e.length === this.selection.length && e.every((e, t) => e === this.selection[t]) || (this.selection = e);
		let t = e.at(-1), n = this.current;
		this.enteredGroupId && t && n && (I(n.items, t) && this.isInsideEntered(n, t) || (this.enteredGroupId = ""));
	}
	keepExistingSelection(e) {
		let t = this.selection.filter((t) => L(e.items, t));
		t.length !== this.selection.length && (this.selection = t), this.enteredGroupId && !L(e.items, this.enteredGroupId) && (this.enteredGroupId = "");
	}
	isInsideEntered(e, t) {
		let n = this.enteredGroupId;
		return !n || [t, ...Hd(e, t)].includes(n) || Hd(e, n).includes(t);
	}
	showWholeCanvas() {
		this.canvas?.resetView(), requestAnimationFrame(() => this.canvas?.fitView());
	}
	createFromCatalog(e, n, r, i) {
		let [a, o] = e.split(":");
		if (!o) return;
		if (a === "container") return Va(i, n, r);
		if (a === "widget") {
			let e = this.widgets.find((e) => e.id === o);
			return e ? nl(e, n, r, i) : void 0;
		}
		let s = rl(this.primitives, o, n, r, i);
		return s || (this.error = t.app.unsupportedPrimitive(o)), s;
	}
	addAt(e, t, n, r) {
		let i = this.current;
		if (!i) return;
		let a = this.createFromCatalog(e, t, n, i);
		a && (this.mutate((e) => Ja(e, a, r)), this.selectItem(a.id), this.composePreview());
	}
	addFromCatalog(e) {
		if (!this.current) return;
		let { x: t, y: n } = il(this.current, this.snapEnabled);
		this.addAt(e, t, n);
	}
	dropFromCatalog(e, t, n) {
		let r = this.current, i = this.canvas?.displayPointAt(t, n);
		if (!r || !i) return;
		let a = ra(r), o = M(ia(i.x, r, this.snapEnabled), a.x, a.x + a.width - 1), s = M(ia(i.y, r, this.snapEnabled), a.y, a.y + a.height - 1), c = ja(r.items, o, s, [], this.enteredGroupId || void 0);
		this.addAt(e, o, s, c?.id);
	}
	groupSelection(e) {
		let t;
		this.mutate((n) => {
			t = Ga(n, e, (e) => this.preview?.itemBounds[e.id]);
		}), t && this.selectItem(t);
	}
	ungroup(e) {
		let t = [];
		this.mutate((n) => {
			t = Ka(n, e);
		}), this.enteredGroupId === e && (this.enteredGroupId = ""), this.setSelection(t);
	}
	enterGroup(e) {
		this.enteredGroupId = e, this.setSelection([e]);
	}
	exitGroup() {
		let e = this.enteredGroupId;
		this.enteredGroupId = "", e && this.selectItem(e);
	}
	confirmDeleteItem() {
		let e = this.pendingDeleteIds;
		e.length !== 0 && (this.pendingDeleteIds = [], this.mutate((t) => {
			for (let n of e) Yc(t, n);
		}), this.setSelection(this.selection.filter((t) => !e.includes(t))));
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
		this.dashboardDraft &&= Il(this.dashboardDraft, e.detail.value);
	}
	onNewDashboardChange(e) {
		this.newDashboard = Il(this.newDashboard, e.detail.value);
	}
	onNewDashboardSource(e) {
		this.chooseNewDashboardSource(e.detail.source);
	}
	onNewDashboardDevice(e) {
		this.useDevice(e.detail.deviceId);
	}
	onNewDashboardProfile(e) {
		this.useProfile(e.detail.profileId);
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
		let { itemId: t, additive: n } = e.detail;
		if (!n || !t) {
			this.selectItem(t);
			return;
		}
		let r = this.selection.filter((e) => e !== t), i = r.length !== this.selection.length;
		this.setSelection(i ? r : [...this.selection, t]);
	}
	onSelectionChange(e) {
		this.setSelection(e.detail.itemIds);
	}
	onGroupEnter(e) {
		this.enterGroup(e.detail.groupId);
	}
	onItemRename(e) {
		let { itemId: t, name: n } = e.detail;
		this.mutate((e) => Zc(e, t, n));
	}
	cancelDeleteItem() {
		this.pendingDeleteIds = [];
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
	onItemsTransform(e) {
		let { items: t } = e.detail;
		this.mutate((e) => {
			for (let n of t) Ma(e, n);
		}, !1, !1);
	}
	onItemTransformEnd(e) {
		let { before: t, drop: n } = e.detail;
		n && this.dropOnContainer(n.itemId, n.x, n.y), this.recordHistory(t), this.schedulePreview();
	}
	dropOnContainer(e, t, n) {
		let r = this.current;
		if (!r) return;
		let i = ja(r.items, t, n, [e], this.enteredGroupId || void 0);
		i?.id !== I(r.items, e)?.parent?.id && this.mutate((t) => Ya(t, e, i?.id), !1, !1);
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
		this.mutate((e) => Xc(e, t, n, r));
	}
	onItemNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => Wc(e, this.selectedItemId, t, n, this.primitives));
	}
	onExpressionChange(e) {
		let { key: t, template: n } = e.detail;
		this.mutate((e) => ol(e, this.selectedItemId, t, n));
	}
	onDisplayNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => qc(e, t, n));
	}
	onWidgetOptionsChange(e) {
		let t = this.selectedItem;
		if (t?.kind !== "widget") return;
		let n = this.widgets.find((e) => e.id === t.widget.type);
		if (!n) return;
		let r = ms(e.detail.value, n);
		this.mutate((e) => Qc(e, t.id, r));
	}
	onWidgetPicksChange(e) {
		let { sourceKey: t, picks: n } = e.detail;
		this.mutate((e) => $c(e, this.selectedItemId, t, n));
	}
	async reloadWidgets() {
		if (this.hass) try {
			let e = await lu(this.hass);
			this.widgets = e.widgets, this.widgetErrors = e.widgetErrors, this.showNotice(t.library.widgetsReloaded(e.widgets.length, e.widgetErrors.length)), this.composePreview();
		} catch (e) {
			this.error = tf(e, t.library.reloadFailed);
		}
	}
	showNotice(e) {
		this.notice = e, this.noticeTimer && window.clearTimeout(this.noticeTimer), this.noticeTimer = window.setTimeout(() => {
			this.notice = "";
		}, ef);
	}
	onContainerBackgroundChange(e) {
		let t = ao(e.detail.value);
		this.mutate((e) => Qa(e, this.selectedItemId, t));
	}
	onAlignInParent(e) {
		let t = this.selectedItemId, n = this.preview?.itemBounds[t];
		this.mutate((r) => su(r, t, e.detail.place, n));
	}
	onPrimitiveFieldChange(e) {
		let { key: t, value: n } = e.detail, r = this.selectedItemId, i = this.preview?.itemBounds[r];
		this.mutate((e) => el(e, r, t, n, i));
	}
	onPrimitiveChange(e) {
		let { value: t } = e.detail;
		this.mutate((e) => tl(e, this.selectedItemId, t, this.primitives));
	}
	renderDeleteDialog() {
		let e = this.pendingDeleteIds.flatMap((e) => L(this.current?.items ?? [], e) ?? []), [n] = e;
		if (!n) return V;
		let r = e.some((e) => F(e) && e.children.length > 0), i = e.length === 1 ? t.app.deleteElementTitle(n.name) : t.app.deleteElementsTitle(e.length);
		return B`
      <ods-confirm-dialog
        eyebrow=${t.app.confirmRemoval}
        heading=${i}
        body=${r ? t.app.deleteContainerBody : t.app.deleteElementBody}
        confirmLabel=${t.app.deleteElement}
        @confirm-accept=${this.confirmDeleteItem}
        @confirm-cancel=${this.cancelDeleteItem}
      ></ods-confirm-dialog>
    `;
	}
	renderNewDashboardDialog() {
		return this.newDashboardOpen ? B`
      <ods-new-dashboard-dialog
        .hass=${this.hass}
        .dashboard=${this.newDashboard}
        .devices=${this.displayDevices}
        .source=${this.newDashboardSource}
        .deviceId=${this.newDashboardDeviceId}
        .saving=${this.saving}
        @new-dashboard-change=${this.onNewDashboardChange}
        @new-dashboard-source=${this.onNewDashboardSource}
        @new-dashboard-device=${this.onNewDashboardDevice}
        @new-dashboard-profile=${this.onNewDashboardProfile}
        @new-dashboard-close=${this.closeNewDashboard}
        @dashboard-create=${this.createDashboard}
      ></ods-new-dashboard-dialog>
    ` : V;
	}
	renderGallery() {
		return B`
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
		return B`
      <div
        class="layout"
        style=${K({
			"--toolbox-width": this.leftCollapsed ? "48px" : "255px",
			"--inspector-width": this.rightCollapsed ? "48px" : `${this.inspectorWidth}px`
		})}
        @item-select=${this.onItemSelect}
        @selection-change=${this.onSelectionChange}
        @group-enter=${this.onGroupEnter}
        @item-rename=${this.onItemRename}
        @context-menu=${this.onContextMenu}
        @rename-handled=${() => {
			this.renameRequestId = "";
		}}
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
          .selectedItemIds=${this.selection}
          .enteredGroupId=${this.enteredGroupId}
          .snapEnabled=${this.snapEnabled}
          .acceptingDrop=${this.draggingCatalog}
          .canUndo=${this.undoCount > 0}
          .canRedo=${this.redoCount > 0}
          .viewport=${this.viewport}
          @viewport-change=${this.onViewportChange}
          @items-transform=${this.onItemsTransform}
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
          .selectedItemIds=${this.selection}
          .enteredGroupId=${this.enteredGroupId}
          .renameRequestId=${this.renameRequestId}
          .collapsed=${this.rightCollapsed}
          .width=${this.inspectorWidth}
          @inspector-collapse=${this.onInspectorCollapse}
          @inspector-resize=${this.onInspectorResize}
          @layers-reorder=${this.onLayersReorder}
          @item-number-change=${this.onItemNumberChange}
          @display-number-change=${this.onDisplayNumberChange}
          @widget-options-change=${this.onWidgetOptionsChange}
          @widget-picks-change=${this.onWidgetPicksChange}
          @widgets-reload=${this.reloadWidgets}
          @primitive-change=${this.onPrimitiveChange}
          @primitive-field-change=${this.onPrimitiveFieldChange}
          @align-in-parent=${this.onAlignInParent}
          @container-background-change=${this.onContainerBackgroundChange}
          @expression-change=${this.onExpressionChange}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()} ${this.renderMenu()}
      ${this.renderShortcutsDialog()}
    `;
	}
	renderError() {
		return this.error ? B`
      <ha-alert alert-type="error">${this.error}</ha-alert>
    ` : V;
	}
	renderNotice() {
		return this.notice ? B`
      <ha-alert alert-type="success" class="notice">${this.notice}</ha-alert>
    ` : V;
	}
	renderEditor(e) {
		return B`
      <div class="shell">
        <ods-header
          .dashboard=${e}
          .view=${this.view}
          .dirty=${this.dirty}
          .saving=${this.saving}
          .sending=${this.sending}
          @show-dashboards=${this.showGallery}
          @dashboard-name-change=${this.onNameChange}
          @view-change=${this.onViewChange}
          @toggle-ready=${this.toggleReady}
          @dashboard-save=${this.saveDashboard}
          @send-to-device=${this.sendToDevice}
          @help-open=${() => {
			this.shortcutsOpen = !0;
		}}
        ></ods-header>
        ${this.renderError()} ${this.renderNotice()}
        ${this.view === "code" ? B`
                <ods-code-view .preview=${this.preview}></ods-code-view>
              ` : this.renderDesign(e)}
      </div>
    `;
	}
	render() {
		if (this.loading) return B`
        <div class="dashboard-empty">
          <p>${t.app.loading}</p>
        </div>
      `;
		let e = this.current;
		return this.view === "dashboards" || !e ? this.renderGallery() : this.renderEditor(e);
	}
};
Y([W({ attribute: !1 })], $.prototype, "hass", void 0), Y([G()], $.prototype, "dashboards", void 0), Y([G()], $.prototype, "view", void 0), Y([G()], $.prototype, "widgets", void 0), Y([G()], $.prototype, "widgetErrors", void 0), Y([G()], $.prototype, "notice", void 0), Y([G()], $.prototype, "sending", void 0), Y([G()], $.prototype, "primitives", void 0), Y([G()], $.prototype, "current", void 0), Y([G()], $.prototype, "selection", void 0), Y([G()], $.prototype, "enteredGroupId", void 0), Y([G()], $.prototype, "menu", void 0), Y([G()], $.prototype, "shortcutsOpen", void 0), Y([G()], $.prototype, "renameRequestId", void 0), Y([G()], $.prototype, "preview", void 0), Y([G()], $.prototype, "loading", void 0), Y([G()], $.prototype, "saving", void 0), Y([G()], $.prototype, "dirty", void 0), Y([G()], $.prototype, "error", void 0), Y([G()], $.prototype, "draggingCatalog", void 0), Y([G()], $.prototype, "undoCount", void 0), Y([G()], $.prototype, "redoCount", void 0), Y([G()], $.prototype, "pendingDeleteIds", void 0), Y([G()], $.prototype, "leftCollapsed", void 0), Y([G()], $.prototype, "rightCollapsed", void 0), Y([G()], $.prototype, "inspectorWidth", void 0), Y([G()], $.prototype, "snapEnabled", void 0), Y([G()], $.prototype, "viewport", void 0), Y([G()], $.prototype, "newDashboardOpen", void 0), Y([G()], $.prototype, "newDashboard", void 0), Y([G()], $.prototype, "newDashboardSource", void 0), Y([G()], $.prototype, "newDashboardDeviceId", void 0), Y([G()], $.prototype, "displayDevices", void 0), Y([G()], $.prototype, "dashboardDialog", void 0), Y([G()], $.prototype, "dashboardDraft", void 0), Y([Pc("ods-canvas")], $.prototype, "canvas", void 0), $ = Y([U("ods-app")], $);
//#endregion
export { $ as OdsApp };
