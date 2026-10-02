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
		exportFailed: "Could not export the dashboard",
		importFailed: "Could not read the file",
		notAJsonFile: "The file is not a JSON file",
		imported: (e) => `Imported ${e} elements`,
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
		exportDashboard: "Export",
		exportTitle: "Download this dashboard as a file",
		importDashboard: "Import",
		importTitle: "Replace the elements with those of a dashboard file",
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
		sections: {
			text: "Text",
			shapes: "Shapes",
			media: "Icons & media",
			data: "Data",
			debug: "Tools"
		},
		collapseSection: (e) => `Collapse ${e}`,
		expandSection: (e) => `Expand ${e}`,
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
		noWidgets: "No matching widgets",
		reloadWidgets: "Reload widgets",
		userWidget: "user",
		widgetErrors: (e) => `${e} widget ${e === 1 ? "package" : "packages"} could not be loaded`,
		widgetsReloaded: (e, t) => t === 0 ? `Widgets reloaded — ${e} loaded` : `Widgets reloaded — ${e} loaded, ${t} failed`,
		reloadFailed: "Could not reload the widgets",
		noMatches: "No matching elements",
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
		advanced: "Advanced",
		reset: "reset",
		resetTitle: (e) => `Reset ${e} to the defaults`,
		changed: "Changed from the default",
		hiddenSwitch: "Hidden",
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
		grid: "Grid",
		gridTitle: "Show the dots of the snap grid",
		pan: "Pan",
		panTitle: "Pan: the wheel moves the view; Ctrl + wheel zooms. Off: the wheel zooms.",
		addPoint: (e, t) => `Add a point to ${e} after point ${t}`,
		pointHandle: (e, t) => `Move point ${t} of ${e}`,
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
	iconPicker: {
		noMatch: "No icons found",
		search: "Search icons…",
		none: "No icons found",
		add: "Add icon",
		remove: "Remove icon",
		left: "Move left",
		right: "Move right",
		empty: "No icon"
	},
	pointsField: {
		x: "X",
		y: "Y",
		add: "Add point",
		remove: (e) => `Remove point ${e}`
	},
	seriesField: {
		entity: "Entity",
		settings: "Line settings",
		add: "Add series",
		remove: (e) => `Remove series ${e}`
	},
	importDialog: {
		eyebrow: "Import",
		heading: "Import a dashboard",
		replaces: "Importing replaces the elements of this dashboard. Its name, id and display settings stay.",
		adjusted: "The file was made for a larger display, so some elements were made smaller or moved nearer. Move them where you want after the import.",
		colorsTitle: "The file was made for another set of colors",
		colorsHelp: "Choose a color of this dashboard for each color the file uses. Colors both have are kept.",
		confirm: "Import"
	},
	imagePicker: {
		address: "Address or path",
		media: "Choose from media",
		entity: "Camera or image entity",
		hint: "A file of the media browser (local media, Image upload and other sources that are a file on this server), a camera or image entity, or a web address. Streams and online services cannot be drawn.",
		unsupported: "Not a web address, a camera or image entity, a media source, or a file of /local or /media.",
		empty: "No image"
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
		exportFailed: "Das Dashboard konnte nicht exportiert werden",
		importFailed: "Die Datei konnte nicht gelesen werden",
		notAJsonFile: "Die Datei ist keine JSON-Datei",
		imported: (e) => `${e} Elemente importiert`,
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
		exportDashboard: "Exportieren",
		exportTitle: "Dieses Dashboard als Datei herunterladen",
		importDashboard: "Importieren",
		importTitle: "Die Elemente durch die einer Dashboard-Datei ersetzen",
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
		sections: {
			text: "Text",
			shapes: "Formen",
			media: "Symbole & Medien",
			data: "Daten",
			debug: "Werkzeuge"
		},
		collapseSection: (e) => `Einklappen ${e}`,
		expandSection: (e) => `Ausklappen ${e}`,
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
		noMatches: "Keine passenden Elemente",
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
		advanced: "Erweitert",
		reset: "zurücksetzen",
		resetTitle: (e) => `${e} auf Standard zurücksetzen`,
		changed: "Vom Standard abweichend",
		hiddenSwitch: "Ausgeblendet",
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
		grid: "Raster",
		gridTitle: "Punkte des Einrastrasters zeigen",
		pan: "Verschieben",
		panTitle: "Verschieben: Mausrad bewegt die Ansicht, Strg + Mausrad zoomt. Aus: Mausrad zoomt.",
		addPoint: (e, t) => `Punkt zu ${e} nach Punkt ${t} hinzufügen`,
		pointHandle: (e, t) => `Punkt ${t} von ${e} verschieben`,
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
	iconPicker: {
		noMatch: "Keine Symbole gefunden",
		search: "Symbole suchen…",
		none: "Keine Symbole gefunden",
		add: "Symbol hinzufügen",
		remove: "Symbol entfernen",
		left: "Nach links",
		right: "Nach rechts",
		empty: "Kein Symbol"
	},
	pointsField: {
		x: "X",
		y: "Y",
		add: "Punkt hinzufügen",
		remove: (e) => `Punkt ${e} entfernen`
	},
	seriesField: {
		entity: "Entität",
		settings: "Linieneinstellungen",
		add: "Reihe hinzufügen",
		remove: (e) => `Reihe ${e} entfernen`
	},
	importDialog: {
		eyebrow: "Import",
		heading: "Dashboard importieren",
		replaces: "Der Import ersetzt die Elemente dieses Dashboards. Name, ID und Anzeigeeinstellungen bleiben.",
		adjusted: "Die Datei wurde für eine größere Anzeige erstellt, daher wurden einige Elemente verkleinert oder näher gerückt. Verschiebe sie nach dem Import, wohin du möchtest.",
		colorsTitle: "Die Datei wurde für andere Farben erstellt",
		colorsHelp: "Wähle für jede Farbe der Datei eine Farbe dieses Dashboards. Gemeinsame Farben bleiben.",
		confirm: "Importieren"
	},
	imagePicker: {
		address: "Adresse oder Pfad",
		media: "Aus Medien wählen",
		entity: "Kamera- oder Bild-Entität",
		hint: "Eine Datei des Medienbrowsers (lokale Medien, Image upload und andere Quellen, die eine Datei auf diesem Server sind), eine Kamera- oder Bild-Entität oder eine Webadresse. Streams und Online-Dienste lassen sich nicht zeichnen.",
		unsupported: "Keine Webadresse, Kamera- oder Bild-Entität, keine Medienquelle und keine Datei aus /local oder /media.",
		empty: "Kein Bild"
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
		exportFailed: "Nie udało się wyeksportować dashboardu",
		importFailed: "Nie udało się odczytać pliku",
		notAJsonFile: "To nie jest plik JSON",
		imported: (e) => `Zaimportowano elementy: ${e}`,
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
		exportDashboard: "Eksportuj",
		exportTitle: "Pobierz ten dashboard jako plik",
		importDashboard: "Importuj",
		importTitle: "Zastąp elementy elementami z pliku dashboardu",
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
		sections: {
			text: "Tekst",
			shapes: "Kształty",
			media: "Ikony i media",
			data: "Dane",
			debug: "Narzędzia"
		},
		collapseSection: (e) => `Zwiń ${e}`,
		expandSection: (e) => `Rozwiń ${e}`,
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
		noMatches: "Brak pasujących elementów",
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
		advanced: "Zaawansowane",
		reset: "przywróć",
		resetTitle: (e) => `Przywróć domyślne: ${e}`,
		changed: "Zmienione względem domyślnych",
		hiddenSwitch: "Ukryty",
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
		grid: "Siatka",
		gridTitle: "Pokaż punkty siatki przyciągania",
		pan: "Przesuwanie",
		panTitle: "Przesuwanie: kółko przesuwa widok, Ctrl + kółko zmienia powiększenie. Wyłączone: kółko zmienia powiększenie.",
		addPoint: (e, t) => `Dodaj punkt: ${e}, po punkcie ${t}`,
		pointHandle: (e, t) => `Przesuń punkt ${t}: ${e}`,
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
	iconPicker: {
		noMatch: "Nie znaleziono ikon",
		search: "Szukaj ikon…",
		none: "Nie znaleziono ikon",
		add: "Dodaj ikonę",
		remove: "Usuń ikonę",
		left: "Przesuń w lewo",
		right: "Przesuń w prawo",
		empty: "Brak ikony"
	},
	pointsField: {
		x: "X",
		y: "Y",
		add: "Dodaj punkt",
		remove: (e) => `Usuń punkt ${e}`
	},
	seriesField: {
		entity: "Encja",
		settings: "Ustawienia linii",
		add: "Dodaj serię",
		remove: (e) => `Usuń serię ${e}`
	},
	importDialog: {
		eyebrow: "Import",
		heading: "Importuj dashboard",
		replaces: "Import zastępuje elementy tego dashboardu. Jego nazwa, id i ustawienia wyświetlacza zostają.",
		adjusted: "Plik powstał dla większego wyświetlacza, więc część elementów zmniejszono lub przysunięto. Po imporcie przesuń je, gdzie chcesz.",
		colorsTitle: "Plik powstał dla innego zestawu kolorów",
		colorsHelp: "Wybierz kolor tego dashboardu dla każdego koloru z pliku. Kolory wspólne zostają bez zmian.",
		confirm: "Importuj"
	},
	imagePicker: {
		address: "Adres lub ścieżka",
		media: "Wybierz z multimediów",
		entity: "Encja kamery lub obrazu",
		hint: "Plik z przeglądarki multimediów (multimedia lokalne, Image upload i inne źródła będące plikiem na tym serwerze), encja kamery lub obrazu albo adres internetowy. Strumieni i usług online nie można narysować.",
		unsupported: "To nie adres internetowy, encja kamery lub obrazu, źródło multimediów ani plik z /local lub /media.",
		empty: "Brak obrazu"
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
}, p = (e) => e.kind === "widget" ? e.widget.type : e.kind === "container" ? "container" : e.primitive.type, m = (e, t) => {
	let n = new Set(e.map((e) => e.name)), r = e.filter((e) => p(e) === t).length + 1;
	for (; n.has(`${t}_${r}`);) r += 1;
	return `${t}_${r}`;
}, h = () => Math.floor(Math.random() * 256), g = () => {
	let e = globalThis.crypto;
	if (typeof e?.randomUUID == "function") return e.randomUUID();
	let t = /* @__PURE__ */ new Uint8Array(16);
	typeof e?.getRandomValues == "function" ? e.getRandomValues(t) : t.forEach((e, n) => {
		t[n] = h();
	}), t[6] = t[6] & 15 | 64, t[8] = t[8] & 63 | 128;
	let n = [...t].map((e) => e.toString(16).padStart(2, "0"));
	return `${n.slice(0, 4).join("")}-${n.slice(4, 6).join("")}-${n.slice(6, 8).join("")}-${n.slice(8, 10).join("")}-${n.slice(10).join("")}`;
}, _ = (e, t, n) => Math.max(t, Math.min(n, e)), v = (e, t, n = 0) => n + Math.round((e - n) / t) * t, y = [
	"nw",
	"n",
	"ne",
	"e",
	"se",
	"s",
	"sw",
	"w"
], ee = (e) => e.includes("e") || e.includes("w"), b = (e) => e.includes("n") || e.includes("s"), x = (e, t, n, r) => r ? v(e, t, n) : Math.round(e), te = (e) => {
	if (e.startHandle) return e.originalEnd - e.areaStart;
	if (e.endHandle) return e.areaEnd - e.originalStart;
	let t = Math.min(e.originalCenter - e.areaStart, e.areaEnd - e.originalCenter);
	return Math.max(1, t * 2);
}, ne = (e, t, n, r, i) => e ? n + r - i : t ? n : n + (r - i) / 2, re = ({ bounds: e, handle: t, deltaX: n, deltaY: r, minimumWidth: i, minimumHeight: a, area: o, preserveAspect: s, snapSize: c, snapEnabled: l }) => {
	let u = o.x + o.width, d = o.y + o.height, f = e.x, p = e.y, m = e.x + e.width, h = e.y + e.height, g = f + e.width / 2, v = p + e.height / 2, y = f, ne = p, re = m, ie = h;
	if (t.includes("w") && (y = x(f + n, c, o.x, l)), t.includes("e") && (re = x(m + n, c, o.x, l)), t.includes("n") && (ne = x(p + r, c, o.y, l)), t.includes("s") && (ie = x(h + r, c, o.y, l)), t.includes("w") && (y = _(y, o.x, m - i)), t.includes("e") && (re = _(re, f + i, u)), t.includes("n") && (ne = _(ne, o.y, h - a)), t.includes("s") && (ie = _(ie, p + a, d)), !s) return {
		x: Math.round(y),
		y: Math.round(ne),
		width: Math.round(re - y),
		height: Math.round(ie - ne)
	};
	let ae = e.width / Math.max(1, e.height), oe = Math.max(i, re - y), se = Math.max(a, ie - ne), ce = Math.abs(oe - e.width) / Math.max(1, e.width), le = Math.abs(se - e.height) / Math.max(1, e.height), ue, de;
	ee(t) && (!b(t) || ce >= le) ? (ue = oe, de = ue / ae) : (de = se, ue = de * ae);
	let fe = te({
		startHandle: t.includes("w"),
		endHandle: t.includes("e"),
		originalStart: f,
		originalEnd: m,
		originalCenter: g,
		areaStart: o.x,
		areaEnd: u
	}), pe = te({
		startHandle: t.includes("n"),
		endHandle: t.includes("s"),
		originalStart: p,
		originalEnd: h,
		originalCenter: v,
		areaStart: o.y,
		areaEnd: d
	}), me = Math.max(i / Math.max(1, e.width), a / Math.max(1, e.height)), he = Math.min(fe / Math.max(1, e.width), pe / Math.max(1, e.height)), ge = _(Math.max(ue / Math.max(1, e.width), de / Math.max(1, e.height)), Math.min(me, he), he);
	return ue = Math.max(1, Math.round(e.width * ge)), de = Math.max(1, Math.round(e.height * ge)), y = t.includes("w") ? m - ue : t.includes("e") ? f : g - ue / 2, ne = t.includes("n") ? h - de : t.includes("s") ? p : v - de / 2, y = _(Math.round(y), o.x, u - ue), ne = _(Math.round(ne), o.y, d - de), {
		x: y,
		y: ne,
		width: ue,
		height: de
	};
}, ie = (e, t, n, r) => {
	let i = ne(r.includes("w"), r.includes("e"), e.x, e.width, t), a = ne(r.includes("n"), r.includes("s"), e.y, e.height, n);
	return {
		x: Math.round(i),
		y: Math.round(a),
		width: t,
		height: n
	};
}, ae = {
	l: 0,
	m: .5,
	r: 1
}, oe = {
	a: 0,
	t: 0,
	m: .5,
	s: .8,
	b: 1,
	d: 1
}, se = (e, t) => {
	let n = e && e.length === 2 ? e : t;
	return {
		x: ae[n[0]] ?? 0,
		y: oe[n[1]] ?? 0
	};
}, ce = (e, t, n, r) => ({
	x: Math.round(e - n.width * r.x),
	y: Math.round(t - n.height * r.y),
	width: n.width,
	height: n.height
}), le = (e) => "x_end" in e, ue = 21, de = "lt", fe = "lm", pe = "la", me = .62, he = 1.25, ge = (e) => [
	"text",
	"multiline",
	"qrcode",
	"debug_grid"
].includes(e.type), _e = (e, t) => {
	let n = e.split("\n"), r = Math.max(...n.map((e) => e.length));
	return {
		width: Math.max(t, Math.round(r * t * me)),
		height: Math.max(1, Math.round(n.length * t * he))
	};
}, ve = (e, t) => {
	let n = _e(e.value, e.size), r = t ?? {
		width: e.max_width ? Math.min(n.width, e.max_width) : n.width,
		height: n.height
	};
	return ce(e.x, e.y, r, se(e.anchor, de));
}, ye = (e, t) => {
	let n = e.value.replaceAll("\n", "").split(e.delimiter), r = (n.length - 1) * e.offset_y, i = Math.max(...n.map((e) => e.length)), a = t ?? {
		width: Math.max(e.size, Math.round(i * e.size * me)),
		height: Math.round(e.size * he) + r
	}, o = se(e.anchor, fe), s = a.height - r;
	return {
		x: Math.round(e.x - a.width * o.x),
		y: Math.round(e.y - s * o.y),
		width: a.width,
		height: a.height
	};
}, be = (e) => ce(e.x, e.y, {
	width: e.size,
	height: e.size
}, se(e.anchor, pe)), xe = (e) => e.size + (e.spacing ?? Math.floor(e.size / 4)), Se = {
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
}, Ce = (e) => {
	let t = Se[e.direction], n = xe(e), r = se(e.anchor, pe), i = {
		width: e.size,
		height: e.size
	}, a = ce(e.x, e.y, i, r), o = ce(e.x + t.x * n * (e.icons.length - 1), e.y + t.y * n * (e.icons.length - 1), i, r), s = Math.min(a.x, o.x), c = Math.min(a.y, o.y);
	return {
		x: s,
		y: c,
		width: Math.max(a.x, o.x) + e.size - s,
		height: Math.max(a.y, o.y) + e.size - c
	};
}, we = (e) => ({
	x: Math.min(e.x_start, e.x_end),
	y: Math.min(e.y_start, e.y_end),
	width: Math.abs(e.x_end - e.x_start) + 1,
	height: Math.abs(e.y_end - e.y_start) + 1
}), Te = (e) => ({
	x: e.x - e.radius,
	y: e.y - e.radius,
	width: e.radius * 2 + 1,
	height: e.radius * 2 + 1
}), Ee = (e) => ({
	x: e.x_start,
	y: e.y_start,
	width: (e.x_repeat - 1) * (e.x_size + e.x_offset) + e.x_size + 1,
	height: (e.y_repeat - 1) * (e.y_size + e.y_offset) + e.y_size + 1
}), De = (e) => {
	let t = e.points.map(([e]) => e), n = e.points.map(([, e]) => e), r = Math.min(...t), i = Math.min(...n);
	return {
		x: r,
		y: i,
		width: Math.max(...t) - r + 1,
		height: Math.max(...n) - i + 1
	};
}, Oe = (e, t) => {
	let n = t?.width ?? (ue + e.border * 2) * e.boxsize;
	return {
		x: e.x,
		y: e.y,
		width: n,
		height: n
	};
}, ke = (e, t) => ({
	...e,
	width: Math.max(1, Math.round(e.width * t)),
	height: Math.max(1, Math.round(e.height * t))
}), Ae = (e, t, n) => {
	if ((e.type === "text" || e.type === "multiline") && t.type === e.type) return ke(n, t.size / e.size);
	if (e.type === "qrcode" && t.type === "qrcode") {
		let r = (n.width / e.boxsize - 2 * e.border + 2 * t.border) * t.boxsize;
		return {
			...n,
			width: r,
			height: r
		};
	}
	return n;
}, je = (e, t) => {
	switch (e.type) {
		case "text": return ve(e, t);
		case "multiline": return ye(e, t);
		case "rectangle":
		case "ellipse":
		case "line":
		case "progress_bar":
		case "plot": return we(e);
		case "rectangle_pattern": return Ee(e);
		case "polygon": return De(e);
		case "circle":
		case "arc": return Te(e);
		case "icon": return be(e);
		case "icon_sequence": return Ce(e);
		case "qrcode": return Oe(e, t);
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
}, Me = (e, t, n) => {
	if (!("anchor" in e) || !("x" in e)) return;
	let r = je(e, n);
	e.anchor = t;
	let i = je(e, n);
	Ne(e, r.x - i.x, r.y - i.y);
}, Ne = (e, t, n) => {
	if (le(e)) {
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
}, Pe = 6, Fe = 256, Ie = 8, Le = (e, t) => t ? Math.max(1, Math.round(t.width / e.boxsize)) : 21 + e.border * 2, Re = (e, t, n) => {
	let r = t / e.size, i = je(e, n);
	return {
		x: i.x,
		y: i.y,
		width: Math.max(1, Math.round(i.width * r)),
		height: Math.max(1, Math.round(i.height * r))
	};
}, ze = (e, t) => {
	switch (e.type) {
		case "circle":
		case "arc": return {
			minimumWidth: 3,
			minimumHeight: 3,
			intrinsicAspect: !0
		};
		case "qrcode": {
			let n = Le(e, t);
			return {
				minimumWidth: n,
				minimumHeight: n,
				intrinsicAspect: !0
			};
		}
		case "icon":
		case "icon_sequence": return {
			minimumWidth: Ie,
			minimumHeight: Ie,
			intrinsicAspect: !0
		};
		case "text":
		case "multiline": {
			let n = Re(e, Pe, t);
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
}, Be = (e) => e.type !== "debug_grid", Ve = (e, { requested: t }, n) => {
	let r = t.x + t.width - 1, i = t.y + t.height - 1;
	if (e.type !== "line") {
		e.x_start = t.x, e.y_start = t.y, e.x_end = r, e.y_end = i;
		return;
	}
	let a = e.x_start <= e.x_end, o = e.y_start <= e.y_end;
	e.x_start = a ? t.x : r, e.x_end = a ? r : t.x, e.y_start = o ? t.y : i, e.y_end = o ? i : t.y, e.x_start === e.x_end && e.y_start === e.y_end && (e.x_end = Math.min(n - 1, e.x_start + 1));
}, He = (e, { requested: t, handle: n }) => {
	let r = Math.max(1, Math.floor((Math.min(t.width, t.height) - 1) / 2)), i = r * 2 + 1, a = ie(t, i, i, n);
	e.x = a.x + r, e.y = a.y + r, e.radius = r;
}, Ue = (e, { requested: t, handle: n, measured: r }) => {
	let i = Le(e, r);
	e.boxsize = _(Math.floor(Math.min(t.width, t.height) / i), 1, 16);
	let a = i * e.boxsize, o = ie(t, a, a, n);
	e.x = o.x, e.y = o.y;
}, We = (e, t, n) => Ne(e, n.x - t.x, n.y - t.y), Ge = (e, { requested: t, before: n, handle: r }) => {
	let i = e.size, a = e.type === "icon" ? Math.min(t.width, t.height) / Math.max(1, i) : t.width / Math.max(1, n.width);
	e.size = _(Math.round(i * a), Ie, 256), e.type === "icon_sequence" && e.spacing !== null && (e.spacing = Math.round(e.spacing * e.size / i));
	let o = je(e);
	We(e, o, ie(t, o.width, o.height, r));
}, Ke = (e, { requested: t, before: n, handle: r, measured: i }) => {
	let a = e.size, o = _(Math.round(a * t.width / Math.max(1, n.width)), Pe, Fe), s = Re(e, o, i);
	e.size = o, e.type === "multiline" && (e.offset_y = Math.max(1, Math.round(e.offset_y * o / a)));
	let c = je(e, s);
	We(e, c, ie(t, c.width, c.height, r));
}, qe = (e, t, n) => Math.max(1, Math.floor((e - 1 - (t - 1) * n) / t)), Je = (e, { requested: t }) => {
	e.x_start = t.x, e.y_start = t.y, e.x_size = qe(t.width, e.x_repeat, e.x_offset), e.y_size = qe(t.height, e.y_repeat, e.y_offset);
}, Ye = (e, { requested: t, before: n }) => {
	let r = (t.width - 1) / Math.max(1, n.width - 1), i = (t.height - 1) / Math.max(1, n.height - 1);
	e.points = e.points.map(([e, a]) => [Math.round(t.x + (e - n.x) * r), Math.round(t.y + (a - n.y) * i)]);
}, Xe = (e, t) => {
	if (le(e)) {
		Ve(e, t, t.displayWidth);
		return;
	}
	switch (e.type) {
		case "circle":
		case "arc":
			He(e, t);
			return;
		case "qrcode":
			Ue(e, t);
			return;
		case "icon":
		case "icon_sequence":
			Ge(e, t);
			return;
		case "text":
		case "multiline":
			Ke(e, t);
			return;
		case "rectangle_pattern":
			Je(e, t);
			return;
		case "polygon":
			Ye(e, t);
			return;
		case "dlimg":
			e.x = t.requested.x, e.y = t.requested.y, e.xsize = t.requested.width, e.ysize = t.requested.height;
			return;
		case "debug_grid": return;
	}
}, Ze = (e, t, n) => e === "display_width" ? t.width : e === "display_height" ? t.height : e === "display_shorter_side" ? Math.min(t.width, t.height) : e ?? n, Qe = (e, t) => e.default === void 0 ? e.nullable || e.optional ? null : 0 : e.shape !== "number" || typeof e.default != "number" ? structuredClone(e.default) : _(e.default, Ze(e.min, t, -Infinity), Ze(e.max, t, Infinity)), $e = (e, t, n) => {
	if (!Array.isArray(e)) return;
	let [r] = e, [i, a] = Array.isArray(r) ? r : [0, 0];
	e.forEach((r, o) => {
		Array.isArray(r) && (e[o] = [t + r[0] - i, n + r[1] - a]);
	});
}, et = (e, t, n) => {
	let { x: r, y: i, displayWidth: a, displayHeight: o } = n;
	switch (e.geometry) {
		case "canvas": return;
		case "pattern":
			t.x_start = r, t.y_start = i;
			return;
		case "points":
			$e(t.points, r, i);
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
}, tt = (e, t) => {
	if (!e) return;
	let n = {
		width: t.displayWidth,
		height: t.displayHeight
	}, r = { type: e.type };
	for (let t of e.fields) r[t.key] = Qe(t, n);
	return et(e, r, t), r;
}, nt = (e) => Math.sqrt(e.sx * e.sy), rt = (e, t, n) => Math.max(n, Math.round(e * t)), it = (e, t) => {
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
				let i = e.min === 0 && n === 0 ? 0 : 1, a = Ze(e.max, t.display, Infinity);
				r[e.key] = _(rt(n, nt(t), i), i, a);
			}
		}
	}
	Object.assign(e.primitive, r), at(e);
}, at = (e) => {
	let t = e.primitive;
	if (le(t)) {
		if (t.type === "line") {
			t.x_start === t.x_end && t.y_start === t.y_end && (t.x_end += 1);
			return;
		}
		t.x_end <= t.x_start && (t.x_end = t.x_start + 1), t.y_end <= t.y_start && (t.y_end = t.y_start + 1);
	}
}, ot = (e, t) => {
	e.x = Math.round(e.x * t.sx), e.y = Math.round(e.y * t.sy), e.width = rt(e.width, t.sx, 1), e.height = rt(e.height, t.sy, 1);
}, st = (e, t) => {
	if (e.kind === "primitive") {
		it(e, t);
		return;
	}
	if (e.kind === "widget") {
		ot(e.frame, t), e.layout.padding = rt(e.layout.padding, nt(t), 0);
		return;
	}
	ot(e, t);
	for (let n of e.children) st(n, t);
}, ct = (e, t, n, r, i) => {
	let a = {
		sx: t,
		sy: n,
		definitions: r,
		display: i
	};
	for (let t of e.children) st(t, a);
}, S = (e, t) => e.kind === "widget" ? e.frame : e.kind === "container" ? {
	x: e.x,
	y: e.y,
	width: e.width,
	height: e.height
} : je(e.primitive, ge(e.primitive) ? t : void 0), lt = (e) => {
	let t = e.display.padding;
	return {
		x: t,
		y: t,
		width: e.display.width - t * 2,
		height: e.display.height - t * 2
	};
}, ut = (e, t, n) => n ? v(e, t.display.snapSize, t.display.padding) : Math.round(e), C = (e, t, n) => {
	if (e.kind === "widget") {
		e.frame.x += t, e.frame.y += n;
		return;
	}
	if (e.kind === "container") {
		e.x += t, e.y += n;
		return;
	}
	Ne(e.primitive, t, n);
}, dt = (e, t, n) => {
	let r = lt(t), i = S(e, n);
	C(e, _(i.x, r.x, Math.max(r.x, r.x + r.width - i.width)) - i.x, _(i.y, r.y, Math.max(r.y, r.y + r.height - i.height)) - i.y), e.kind === "widget" && (e.frame.width = Math.min(e.frame.width, r.width), e.frame.height = Math.min(e.frame.height, r.height)), e.kind === "container" && (e.width = Math.min(e.width, r.width), e.height = Math.min(e.height, r.height));
}, ft = (e, t, n) => [e - n, e + t], pt = (e, t) => {
	let n = Math.min(e.x, t.x), r = Math.min(e.y, t.y), i = Math.max(e.x + e.width, t.x + t.width), a = Math.max(e.y + e.height, t.y + t.height);
	return {
		x: n,
		y: r,
		width: i - n,
		height: a - r
	};
}, mt = {
	width: 60,
	height: 48
}, ht = (e, t, n) => e.kind === "widget" ? {
	minimumWidth: t.width,
	minimumHeight: t.height,
	intrinsicAspect: !1
} : e.kind === "container" ? {
	minimumWidth: 8,
	minimumHeight: 8,
	intrinsicAspect: !1
} : ze(e.primitive, n), gt = {
	n: "ne",
	e: "se",
	s: "se",
	w: "sw"
}, _t = (e, t, n, r, i, a, o) => {
	let s = S(e, o.measured), { minimumWidth: c, minimumHeight: l, intrinsicAspect: u } = ht(e, o.minSize ?? mt, o.measured), d = u ? gt[t] ?? t : t, f = re({
		bounds: s,
		handle: d,
		deltaX: n,
		deltaY: r,
		minimumWidth: c,
		minimumHeight: l,
		area: pt(lt(a), s),
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
		}), e.grouped && ct(e, f.width / Math.max(1, s.width), f.height / Math.max(1, s.height), o.definitions ?? [], a.display);
		return;
	}
	Be(e.primitive) && Xe(e.primitive, {
		requested: f,
		before: s,
		handle: d,
		measured: o.measured,
		displayWidth: a.display.width,
		displayHeight: a.display.height
	});
}, vt = (e, t, n, r, i, a) => {
	let o = structuredClone(e);
	if (o.locked) return o;
	let s = a.offset ?? {
		x: 0,
		y: 0
	};
	return C(o, s.x, s.y), yt(o, t, n, r, i, a), C(o, -s.x, -s.y), o;
}, yt = (e, t, n, r, i, a) => {
	if (t.mode === "resize") {
		_t(e, t.handle, n, r, t.shiftKey, i, a);
		return;
	}
	let o = S(e, a.measured), s = lt(i), c = _(ut(o.x + n, i, a.snapEnabled), ...ft(s.x, s.width, o.width)), l = _(ut(o.y + r, i, a.snapEnabled), ...ft(s.y, s.height, o.height));
	C(e, c - o.x, l - o.y);
}, bt = {
	x: 0,
	y: 0
}, w = (e) => e.kind === "container", xt = (e) => e.kind === "container" && e.grouped, St = (e, t, n, r) => {
	for (let [i, a] of e.entries()) {
		if (a.id === t) return {
			item: a,
			parent: n,
			siblings: e,
			index: i,
			offset: r
		};
		if (w(a)) {
			let e = St(a.children, t, a, {
				x: r.x + a.x,
				y: r.y + a.y
			});
			if (e) return e;
		}
	}
}, T = (e, t) => St(e, t, void 0, bt), E = (e, t) => T(e, t)?.item, D = (e) => e.flatMap((e) => w(e) ? [e, ...D(e.children)] : [e]), Ct = (e) => D(e).length, wt = (e, t) => {
	let n = [], r = T(e, t)?.parent;
	for (; r;) n.push(r), r = T(e, r.id)?.parent;
	return n;
}, Tt = (e, t, n) => t === n || wt(e, t).some((e) => e.id === n), Et = (e, t) => ({
	...e,
	x: e.x + t.x,
	y: e.y + t.y
}), Dt = (e, t, n) => t >= e.x && t < e.x + e.width && n >= e.y && n < e.y + e.height, Ot = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, kt = (e, t, n, r, i) => {
	let a = T(e.items, t);
	if (!a || n !== void 0 && Tt(e.items, n, t)) return;
	a.siblings.splice(a.index, 1);
	let o = n === void 0 ? void 0 : T(e.items, n), s = o && w(o.item) ? o.item : void 0, c = o && s ? {
		x: o.offset.x + s.x,
		y: o.offset.y + s.y
	} : bt, l = s ? s.children : e.items;
	r(a.item, a.offset.x - c.x, a.offset.y - c.y), l.splice(i ?? l.length, 0, a.item);
}, At = (e, t) => {
	let n = T(e.items, t);
	n && n.siblings.splice(n.index, 1);
}, jt = (e, t) => {
	let n = t.map((t) => T(e, t));
	return n.length === 0 || n.some((e) => !e) || new Set(n.map((e) => e?.parent?.id)).size !== 1 ? !1 : { parentId: n[0]?.parent?.id };
}, Mt = (e, t) => {
	let n = new Set(t);
	return D(e).filter((e) => n.has(e.id)).map((e) => e.id);
}, Nt = (e, t, n) => {
	let r = [...wt(e, t)].reverse(), i = n ? /* @__PURE__ */ new Set([n, ...wt(e, n).map((e) => e.id)]) : /* @__PURE__ */ new Set();
	return r.find((e) => e.grouped && !i.has(e.id))?.id ?? t;
}, Pt = (e, t, n, r, i) => {
	if (t === n || Tt(e.items, n, t)) return;
	let a = T(e.items, t);
	if (!a || !T(e.items, n)) return;
	a.siblings.splice(a.index, 1);
	let o = T(e.items, n);
	if (!o) return;
	let s = o.offset;
	i(a.item, a.offset.x - s.x, a.offset.y - s.y), o.siblings.splice(r === "before" ? o.index + 1 : o.index, 0, a.item);
}, Ft = (e, t = bt, n, r = 0) => e.flatMap((e) => {
	let i = {
		item: e,
		offset: t,
		parent: n,
		depth: r
	};
	return w(e) ? [i, ...Ft(e.children, {
		x: t.x + e.x,
		y: t.y + e.y
	}, e, r + 1)] : [i];
}), It = (e) => w(e.item) ? {
	x: e.offset.x + e.item.x,
	y: e.offset.y + e.item.y,
	width: e.item.width,
	height: e.item.height
} : void 0, Lt = (e, t, n, r, i) => {
	let a = new Set(i ? [i, ...wt(e, i).map((e) => e.id)] : []), o = Ft(e).filter((i) => {
		let o = It(i);
		return !o || !w(i.item) || i.item.hidden || i.item.locked || i.item.grouped && !a.has(i.item.id) || r.some((t) => Tt(e, i.item.id, t)) ? !1 : Dt(o, t, n);
	}), s = o[o.length - 1]?.item;
	return s && w(s) ? s : void 0;
}, Rt = (e, t) => {
	let n = T(e.items, t.id);
	n && (n.siblings[n.index] = t);
}, zt = (e, t) => e.filter((e) => t.has(e.id)), Bt = (e, t) => new Set(t.flatMap((t) => {
	let n = T(e.items, t)?.siblings;
	return n ? [n] : [];
})), Vt = (e, t) => {
	let n = new Set(t), r = Bt(e, t);
	for (let e of r) Ut(e, n, "end");
}, Ht = (e, t) => {
	let n = new Set(t), r = Bt(e, t);
	for (let e of r) Ut(e, n, "start");
}, Ut = (e, t, n) => {
	let r = zt(e, t), i = e.filter((e) => !t.has(e.id));
	e.splice(0, e.length, ...n === "end" ? [...i, ...r] : [...r, ...i]);
}, Wt = (e, t, n) => {
	let r = new Set(t), i = Bt(e, t);
	for (let e of i) {
		let t = n === "up" ? e.map((t, n) => e.length - 1 - n) : e.map((e, t) => t);
		for (let i of t) {
			let t = e[i], a = e[i + (n === "up" ? 1 : -1)];
			t && a && r.has(t.id) && !r.has(a.id) && (e[i] = a, e[i + (n === "up" ? 1 : -1)] = t);
		}
	}
}, Gt = "container", Kt = () => ({
	fill: "white",
	outline: "black",
	width: 1,
	radius: 0
}), qt = (e, t, n) => ({
	id: g(),
	name: m(D(e.items), Gt),
	kind: "container",
	locked: !1,
	hidden: !1,
	x: Math.round(t - 50),
	y: Math.round(n - 50),
	width: 100,
	height: 100,
	grouped: !1,
	background: Kt(),
	children: []
}), Jt = (e) => {
	let t = Math.min(...e.map((e) => e.x)), n = Math.min(...e.map((e) => e.y)), r = Math.max(...e.map((e) => e.x + e.width)), i = Math.max(...e.map((e) => e.y + e.height));
	return {
		x: t,
		y: n,
		width: r - t,
		height: i - n
	};
}, Yt = (e, t) => {
	if (!jt(e.items, t)) return !1;
	let [n] = t, r = n ? T(e.items, n)?.item : void 0;
	return t.length === 1 && r && w(r) ? !r.grouped : t.every((t) => !T(e.items, t)?.item.locked);
}, Xt = (e, t) => {
	let n = T(e.items, t)?.item;
	return n !== void 0 && w(n) && n.grouped;
}, Zt = (e, t, n = () => void 0) => {
	if (!Yt(e, t)) return;
	let [r] = t, i = r ? T(e.items, r)?.item : void 0;
	if (t.length === 1 && i && w(i)) return i.savedBackground = i.background, i.grouped = !0, i.background = null, i.id;
	let a = Mt(e.items, t), o = a.flatMap((t) => T(e.items, t)?.item ?? []), s = Jt(o.map((e) => S(e, n(e)))), c = T(e.items, a[0] ?? ""), l = T(e.items, a[a.length - 1] ?? "");
	if (!c || !l) return;
	let u = c.siblings, d = l.index - (o.length - 1), f = {
		id: g(),
		name: m(D(e.items), Gt),
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
		u.splice(t, 1), C(e, -s.x, -s.y);
	}
	return u.splice(d, 0, f), f.id;
}, Qt = (e, t) => {
	let n = T(e.items, t);
	if (!n || !w(n.item) || !n.item.grouped) return [];
	let r = n.item;
	if (r.savedBackground !== void 0) return r.background = r.savedBackground, r.grouped = !1, delete r.savedBackground, [r.id];
	for (let e of r.children) C(e, r.x, r.y);
	return n.siblings.splice(n.index, 1, ...r.children), r.children.map((e) => e.id);
}, $t = C, en = (e, t, n) => {
	let r = n ? T(e.items, n) : void 0;
	if (!r || !w(r.item)) {
		e.items.push(t);
		return;
	}
	$t(t, -(r.offset.x + r.item.x), -(r.offset.y + r.item.y)), r.item.children.push(t);
}, tn = (e, t, n) => {
	let r = T(e.items, t);
	if (!r || r.parent?.id === n) return;
	let i = n === void 0 ? nn(e, t) : rn(e, t, n);
	if (kt(e, t, n, $t), !i) return;
	let a = T(e.items, t), o = T(e.items, i.id);
	if (!a || !o || a.siblings !== o.siblings) return;
	a.siblings.splice(a.index, 1);
	let s = T(e.items, i.id);
	s?.siblings.splice((s?.index ?? 0) + 1, 0, a.item);
}, nn = (e, t) => {
	let n = wt(e.items, t);
	return n[n.length - 1];
}, rn = (e, t, n) => {
	let r = wt(e.items, t), i = r.findIndex((e) => e.id === n);
	return i > 0 ? r[i - 1] : void 0;
}, an = (e, t, n) => {
	let r = T(e.items, t)?.item;
	r && w(r) && !r.grouped && !r.locked && (r.background = n);
}, on = 32, sn = 256, cn = () => {
	let e = t.inspector;
	return [
		{
			key: "enabled",
			label: e.backgroundEnabled,
			shape: "boolean",
			section: "appearance",
			default: !1
		},
		{
			key: "fill",
			label: e.backgroundFill,
			shape: "color",
			section: "appearance",
			nullable: !0
		},
		{
			key: "outline",
			label: e.backgroundOutline,
			shape: "color",
			section: "appearance",
			default: "black"
		},
		{
			key: "width",
			label: e.backgroundWidth,
			shape: "number",
			section: "appearance",
			unit: "px",
			min: 0,
			max: on,
			default: 1
		},
		{
			key: "radius",
			label: e.backgroundRadius,
			shape: "number",
			section: "appearance",
			unit: "px",
			min: 0,
			max: sn,
			default: 0
		}
	];
}, ln = (e) => {
	let t = e.background ?? Kt();
	return {
		enabled: e.background !== null,
		fill: t.fill,
		outline: t.outline,
		width: t.width,
		radius: t.radius
	};
}, un = (e, t, n) => typeof e != "number" || !Number.isFinite(e) ? t : Math.min(n, Math.max(0, Math.round(e))), dn = (e) => {
	if (e.enabled !== !0) return null;
	let t = Kt(), n = "fill" in e ? e.fill : t.fill;
	return {
		fill: typeof n == "string" ? n : null,
		outline: typeof e.outline == "string" ? e.outline : t.outline,
		width: un(e.width, t.width, on),
		radius: un(e.radius, t.radius, sn)
	};
}, fn = (e, t) => Mt(e.items, t).filter((n) => !wt(e.items, n).some((e) => t.includes(e.id))), pn = (e, t) => ({ items: fn(e, t).flatMap((t) => {
	let n = T(e.items, t);
	if (!n) return [];
	let r = structuredClone(n.item);
	return C(r, n.offset.x, n.offset.y), [r];
}) }), mn = (e, t) => {
	if (e.id = g(), e.name = m(t, p(e)), t.push(e), w(e)) for (let n of e.children) mn(n, t);
}, hn = (e, t) => {
	let n = t.at(-1), r = n ? T(e.items, n) : void 0;
	return r ? r.item.kind === "container" && !r.item.grouped ? { parentId: r.item.id } : {
		parentId: r.parent?.id,
		afterId: r.item.id
	} : {};
}, gn = (e, t) => {
	let n = t ? T(e.items, t) : void 0;
	return !n || !w(n.item) ? {
		x: 0,
		y: 0
	} : {
		x: n.offset.x + n.item.x,
		y: n.offset.y + n.item.y
	};
}, _n = (e) => e.items.length > 0 ? Jt(e.items.map((e) => S(e))) : void 0, vn = (e, t, n, r) => {
	let i = _n(t);
	if (!i) return [];
	let a = "anchor" in r ? {
		x: r.anchor.x - i.x,
		y: r.anchor.y - i.y
	} : r.delta, o = gn(e, n.parentId), s = D(e.items), c = n.parentId ? T(e.items, n.parentId)?.item : void 0, l = c && w(c) ? c.children : e.items, u = n.afterId ? l.findIndex((e) => e.id === n.afterId) : -1, d = u >= 0 ? u + 1 : l.length;
	return t.items.map((e) => {
		let t = structuredClone(e);
		return C(t, a.x - o.x, a.y - o.y), mn(t, s), l.splice(d, 0, t), d += 1, t.id;
	});
}, yn = (e, t) => {
	let n = D(e.items);
	return fn(e, t).flatMap((t) => {
		let r = T(e.items, t);
		if (!r) return [];
		let i = structuredClone(r.item);
		return C(i, 8, 8), mn(i, n), r.siblings.splice(r.siblings.indexOf(r.item) + 1, 0, i), [i.id];
	});
}, bn = (e, t, n, r, i, a) => {
	let o = t.flatMap((t) => {
		let n = T(e.items, t);
		return n && !n.item.locked && a(n.item) ? [n] : [];
	});
	if (o.length === 0) return !1;
	let s = o.map((e) => ({
		x: S(e.item).x + e.offset.x,
		y: S(e.item).y + e.offset.y,
		width: S(e.item).width,
		height: S(e.item).height
	})), c = Math.min(...s.map((e) => e.x)), l = Math.min(...s.map((e) => e.y)), u = Math.max(...s.map((e) => e.x + e.width)), d = Math.max(...s.map((e) => e.y + e.height)), f = Math.min(Math.max(n, i.x - (u - c) - c), i.x + i.width - c), p = Math.min(Math.max(r, i.y - (d - l) - l), i.y + i.height - l);
	if (f === 0 && p === 0) return !1;
	for (let { item: e } of o) C(e, f, p);
	return !0;
}, xn = "visible", Sn = (e) => typeof e == "string" && (e.includes("{{") || e.includes("{%")), Cn = "\\", wn = (e) => `'${e.replaceAll(Cn, "\\\\").replaceAll("'", `${Cn}'`)}'`, Tn = (e) => typeof e == "string" ? `{{ ${wn(e)} }}` : typeof e == "boolean" || typeof e == "number" ? `{{ ${e} }}` : "{{ none }}", En = "{\r\n  \"bw\": {\r\n    \"schemes\": [\r\n      \"MONO\"\r\n    ],\r\n    \"accent\": \"red\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      }\r\n    ]\r\n  },\r\n  \"bwr\": {\r\n    \"schemes\": [\r\n      \"BWR\"\r\n    ],\r\n    \"accent\": \"red\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"red\",\r\n        \"value\": \"red\",\r\n        \"hex\": \"#ff0000\"\r\n      }\r\n    ]\r\n  },\r\n  \"bwy\": {\r\n    \"schemes\": [\r\n      \"BWY\"\r\n    ],\r\n    \"accent\": \"yellow\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"yellow\",\r\n        \"value\": \"yellow\",\r\n        \"hex\": \"#ffff00\"\r\n      }\r\n    ]\r\n  },\r\n  \"bwry\": {\r\n    \"schemes\": [\r\n      \"BWRY\"\r\n    ],\r\n    \"accent\": \"yellow\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"red\",\r\n        \"value\": \"red\",\r\n        \"hex\": \"#ff0000\"\r\n      },\r\n      {\r\n        \"id\": \"yellow\",\r\n        \"value\": \"yellow\",\r\n        \"hex\": \"#ffff00\"\r\n      }\r\n    ]\r\n  },\r\n  \"spectra6\": {\r\n    \"schemes\": [\r\n      \"BWGBRY\",\r\n      \"BWGBRY_SPLIT\"\r\n    ],\r\n    \"accent\": \"red\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"red\",\r\n        \"value\": \"red\",\r\n        \"hex\": \"#ff0000\"\r\n      },\r\n      {\r\n        \"id\": \"yellow\",\r\n        \"value\": \"yellow\",\r\n        \"hex\": \"#ffff00\"\r\n      },\r\n      {\r\n        \"id\": \"blue\",\r\n        \"value\": \"blue\",\r\n        \"hex\": \"#0000ff\"\r\n      },\r\n      {\r\n        \"id\": \"green\",\r\n        \"value\": \"green\",\r\n        \"hex\": \"#00ff00\"\r\n      }\r\n    ]\r\n  },\r\n  \"seven_color\": {\r\n    \"schemes\": [\r\n      \"SEVEN_COLOR\"\r\n    ],\r\n    \"accent\": \"red\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      },\r\n      {\r\n        \"id\": \"red\",\r\n        \"value\": \"red\",\r\n        \"hex\": \"#ff0000\"\r\n      },\r\n      {\r\n        \"id\": \"yellow\",\r\n        \"value\": \"yellow\",\r\n        \"hex\": \"#ffff00\"\r\n      },\r\n      {\r\n        \"id\": \"blue\",\r\n        \"value\": \"blue\",\r\n        \"hex\": \"#0000ff\"\r\n      },\r\n      {\r\n        \"id\": \"green\",\r\n        \"value\": \"green\",\r\n        \"hex\": \"#00ff00\"\r\n      },\r\n      {\r\n        \"id\": \"orange\",\r\n        \"value\": \"#ff8000\",\r\n        \"hex\": \"#ff8000\"\r\n      }\r\n    ]\r\n  },\r\n  \"grayscale4\": {\r\n    \"schemes\": [\r\n      \"GRAYSCALE_4\"\r\n    ],\r\n    \"accent\": \"black\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"gray1\",\r\n        \"value\": \"#555555\",\r\n        \"hex\": \"#555555\"\r\n      },\r\n      {\r\n        \"id\": \"gray2\",\r\n        \"value\": \"#aaaaaa\",\r\n        \"hex\": \"#aaaaaa\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      }\r\n    ]\r\n  },\r\n  \"grayscale8\": {\r\n    \"schemes\": [\r\n      \"GRAYSCALE_8\"\r\n    ],\r\n    \"accent\": \"black\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"gray1\",\r\n        \"value\": \"#242424\",\r\n        \"hex\": \"#242424\"\r\n      },\r\n      {\r\n        \"id\": \"gray2\",\r\n        \"value\": \"#494949\",\r\n        \"hex\": \"#494949\"\r\n      },\r\n      {\r\n        \"id\": \"gray3\",\r\n        \"value\": \"#6d6d6d\",\r\n        \"hex\": \"#6d6d6d\"\r\n      },\r\n      {\r\n        \"id\": \"gray4\",\r\n        \"value\": \"#929292\",\r\n        \"hex\": \"#929292\"\r\n      },\r\n      {\r\n        \"id\": \"gray5\",\r\n        \"value\": \"#b6b6b6\",\r\n        \"hex\": \"#b6b6b6\"\r\n      },\r\n      {\r\n        \"id\": \"gray6\",\r\n        \"value\": \"#dbdbdb\",\r\n        \"hex\": \"#dbdbdb\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      }\r\n    ]\r\n  },\r\n  \"grayscale16\": {\r\n    \"schemes\": [\r\n      \"GRAYSCALE_16\"\r\n    ],\r\n    \"accent\": \"black\",\r\n    \"colors\": [\r\n      {\r\n        \"id\": \"black\",\r\n        \"value\": \"black\",\r\n        \"hex\": \"#000000\"\r\n      },\r\n      {\r\n        \"id\": \"gray1\",\r\n        \"value\": \"#111111\",\r\n        \"hex\": \"#111111\"\r\n      },\r\n      {\r\n        \"id\": \"gray2\",\r\n        \"value\": \"#222222\",\r\n        \"hex\": \"#222222\"\r\n      },\r\n      {\r\n        \"id\": \"gray3\",\r\n        \"value\": \"#333333\",\r\n        \"hex\": \"#333333\"\r\n      },\r\n      {\r\n        \"id\": \"gray4\",\r\n        \"value\": \"#444444\",\r\n        \"hex\": \"#444444\"\r\n      },\r\n      {\r\n        \"id\": \"gray5\",\r\n        \"value\": \"#555555\",\r\n        \"hex\": \"#555555\"\r\n      },\r\n      {\r\n        \"id\": \"gray6\",\r\n        \"value\": \"#666666\",\r\n        \"hex\": \"#666666\"\r\n      },\r\n      {\r\n        \"id\": \"gray7\",\r\n        \"value\": \"#777777\",\r\n        \"hex\": \"#777777\"\r\n      },\r\n      {\r\n        \"id\": \"gray8\",\r\n        \"value\": \"#888888\",\r\n        \"hex\": \"#888888\"\r\n      },\r\n      {\r\n        \"id\": \"gray9\",\r\n        \"value\": \"#999999\",\r\n        \"hex\": \"#999999\"\r\n      },\r\n      {\r\n        \"id\": \"gray10\",\r\n        \"value\": \"#aaaaaa\",\r\n        \"hex\": \"#aaaaaa\"\r\n      },\r\n      {\r\n        \"id\": \"gray11\",\r\n        \"value\": \"#bbbbbb\",\r\n        \"hex\": \"#bbbbbb\"\r\n      },\r\n      {\r\n        \"id\": \"gray12\",\r\n        \"value\": \"#cccccc\",\r\n        \"hex\": \"#cccccc\"\r\n      },\r\n      {\r\n        \"id\": \"gray13\",\r\n        \"value\": \"#dddddd\",\r\n        \"hex\": \"#dddddd\"\r\n      },\r\n      {\r\n        \"id\": \"gray14\",\r\n        \"value\": \"#eeeeee\",\r\n        \"hex\": \"#eeeeee\"\r\n      },\r\n      {\r\n        \"id\": \"white\",\r\n        \"value\": \"white\",\r\n        \"hex\": \"#ffffff\"\r\n      }\r\n    ]\r\n  }\r\n}\r\n", Dn = Symbol.for("yaml.alias"), On = Symbol.for("yaml.document"), kn = Symbol.for("yaml.map"), An = Symbol.for("yaml.pair"), jn = Symbol.for("yaml.scalar"), Mn = Symbol.for("yaml.seq"), Nn = Symbol.for("yaml.node.type"), Pn = (e) => !!e && typeof e == "object" && e[Nn] === Dn, Fn = (e) => !!e && typeof e == "object" && e[Nn] === On, In = (e) => !!e && typeof e == "object" && e[Nn] === kn, O = (e) => !!e && typeof e == "object" && e[Nn] === An, k = (e) => !!e && typeof e == "object" && e[Nn] === jn, Ln = (e) => !!e && typeof e == "object" && e[Nn] === Mn;
function A(e) {
	if (e && typeof e == "object") switch (e[Nn]) {
		case kn:
		case Mn: return !0;
	}
	return !1;
}
function j(e) {
	if (e && typeof e == "object") switch (e[Nn]) {
		case Dn:
		case kn:
		case jn:
		case Mn: return !0;
	}
	return !1;
}
var Rn = (e) => (k(e) || A(e)) && !!e.anchor, zn = Symbol("break visit"), Bn = Symbol("skip children"), Vn = Symbol("remove node");
function Hn(e, t) {
	let n = Wn(t);
	Fn(e) ? Un(null, e.contents, n, Object.freeze([e])) === Vn && (e.contents = null) : Un(null, e, n, Object.freeze([]));
}
Hn.BREAK = zn, Hn.SKIP = Bn, Hn.REMOVE = Vn;
function Un(e, t, n, r) {
	let i = Gn(e, t, n, r);
	if (j(i) || O(i)) return Kn(e, r, i), Un(e, i, n, r);
	if (typeof i != "symbol") {
		if (A(t)) {
			r = Object.freeze(r.concat(t));
			for (let e = 0; e < t.items.length; ++e) {
				let i = Un(e, t.items[e], n, r);
				if (typeof i == "number") e = i - 1;
				else if (i === zn) return zn;
				else i === Vn && (t.items.splice(e, 1), --e);
			}
		} else if (O(t)) {
			r = Object.freeze(r.concat(t));
			let e = Un("key", t.key, n, r);
			if (e === zn) return zn;
			e === Vn && (t.key = null);
			let i = Un("value", t.value, n, r);
			if (i === zn) return zn;
			i === Vn && (t.value = null);
		}
	}
	return i;
}
function Wn(e) {
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
function Gn(e, t, n, r) {
	if (typeof n == "function") return n(e, t, r);
	if (In(t)) return n.Map?.(e, t, r);
	if (Ln(t)) return n.Seq?.(e, t, r);
	if (O(t)) return n.Pair?.(e, t, r);
	if (k(t)) return n.Scalar?.(e, t, r);
	if (Pn(t)) return n.Alias?.(e, t, r);
}
function Kn(e, t, n) {
	let r = t[t.length - 1];
	if (A(r)) r.items[e] = n;
	else if (O(r)) e === "key" ? r.key = n : r.value = n;
	else if (Fn(r)) r.contents = n;
	else {
		let e = Pn(r) ? "alias" : "scalar";
		throw Error(`Cannot replace node with ${e} parent`);
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/directives.js
var qn = {
	"!": "%21",
	",": "%2C",
	"[": "%5B",
	"]": "%5D",
	"{": "%7B",
	"}": "%7D"
}, Jn = (e) => e.replace(/[!,[\]{}]/g, (e) => qn[e]), Yn = class e {
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
		for (let [t, n] of Object.entries(this.tags)) if (e.startsWith(n)) return t + Jn(e.substring(n.length));
		return e[0] === "!" ? e : `!<${e}>`;
	}
	toString(e) {
		let t = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [], n = Object.entries(this.tags), r;
		if (e && n.length > 0 && j(e.contents)) {
			let t = {};
			Hn(e.contents, (e, n) => {
				j(n) && n.tag && (t[n.tag] = !0);
			}), r = Object.keys(t);
		} else r = [];
		for (let [i, a] of n) (i !== "!!" || a !== "tag:yaml.org,2002:") && (!e || r.some((e) => e.startsWith(a))) && t.push(`%TAG ${i} ${a}`);
		return t.join("\n");
	}
};
Yn.defaultYaml = {
	explicit: !1,
	version: "1.2"
}, Yn.defaultTags = { "!!": "tag:yaml.org,2002:" };
//#endregion
//#region node_modules/yaml/browser/dist/doc/anchors.js
function Xn(e) {
	if (/[\x00-\x19\s,[\]{}]/.test(e)) {
		let t = `Anchor must not contain whitespace or control characters: ${JSON.stringify(e)}`;
		throw Error(t);
	}
	return !0;
}
function Zn(e) {
	let t = /* @__PURE__ */ new Set();
	return Hn(e, { Value(e, n) {
		n.anchor && t.add(n.anchor);
	} }), t;
}
function Qn(e, t) {
	for (let n = 1;; ++n) {
		let r = `${e}${n}`;
		if (!t.has(r)) return r;
	}
}
function $n(e, t) {
	let n = [], r = /* @__PURE__ */ new Map(), i = null;
	return {
		onAnchor: (r) => {
			n.push(r), i ??= Zn(e);
			let a = Qn(t, i);
			return i.add(a), a;
		},
		setAnchors: () => {
			for (let e of n) {
				let t = r.get(e);
				if (typeof t == "object" && t.anchor && (k(t.node) || A(t.node))) t.node.anchor = t.anchor;
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
function er(e, t, n, r) {
	if (r && typeof r == "object") {
		if (Array.isArray(r)) for (let t = 0, n = r.length; t < n; ++t) {
			let n = r[t], i = er(e, r, String(t), n);
			i === void 0 ? delete r[t] : i !== n && (r[t] = i);
		}
		else if (r instanceof Map) for (let t of Array.from(r.keys())) {
			let n = r.get(t), i = er(e, r, t, n);
			i === void 0 ? r.delete(t) : i !== n && r.set(t, i);
		}
		else if (r instanceof Set) for (let t of Array.from(r)) {
			let n = er(e, r, t, t);
			n === void 0 ? r.delete(t) : n !== t && (r.delete(t), r.add(n));
		}
		else for (let [t, n] of Object.entries(r)) {
			let i = er(e, r, t, n);
			i === void 0 ? delete r[t] : i !== n && (r[t] = i);
		}
	}
	return e.call(t, n, r);
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/toJS.js
function M(e, t, n) {
	if (Array.isArray(e)) return e.map((e, t) => M(e, String(t), n));
	if (e && typeof e.toJSON == "function") {
		if (!n || !Rn(e)) return e.toJSON(t, n);
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
var tr = class {
	constructor(e) {
		Object.defineProperty(this, Nn, { value: e });
	}
	clone() {
		let e = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
		return this.range && (e.range = this.range.slice()), e;
	}
	toJS(e, { mapAsMap: t, maxAliasCount: n, onAnchor: r, reviver: i } = {}) {
		if (!Fn(e)) throw TypeError("A document argument is required");
		let a = {
			anchors: /* @__PURE__ */ new Map(),
			doc: e,
			keep: !0,
			mapAsMap: t === !0,
			mapKeyWarned: !1,
			maxAliasCount: typeof n == "number" ? n : 100
		}, o = M(this, "", a);
		if (typeof r == "function") for (let { count: e, res: t } of a.anchors.values()) r(t, e);
		return typeof i == "function" ? er(i, { "": o }, "", o) : o;
	}
}, nr = class extends tr {
	constructor(e) {
		super(Dn), this.source = e, Object.defineProperty(this, "tag", { set() {
			throw Error("Alias nodes cannot have tags");
		} });
	}
	resolve(e, t) {
		if (t?.maxAliasCount === 0) throw ReferenceError("Alias resolution is disabled");
		let n;
		t?.aliasResolveCache ? n = t.aliasResolveCache : (n = [], Hn(e, { Node: (e, t) => {
			(Pn(t) || Rn(t)) && n.push(t);
		} }), t && (t.aliasResolveCache = n));
		let r;
		for (let e of n) {
			if (e === this) break;
			e.anchor === this.source && (r = e);
		}
		if (r && t) {
			let { anchors: e, doc: n, maxAliasCount: i } = t, a = e.get(r);
			/* istanbul ignore if */
			if (a ||= (M(r, null, t), e.get(r)), a?.res === void 0) throw ReferenceError("This should not happen: Alias anchor was not resolved?");
			if (i >= 0 && (a.count += 1, a.aliasCount === 0 && (a.aliasCount = rr(n, r, e)), a.count * a.aliasCount > i)) throw ReferenceError("Excessive alias count indicates a resource exhaustion attack");
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
			if (Xn(this.source), e.options.verifyAliasOrder && !e.anchors.has(this.source)) {
				let e = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
				throw Error(e);
			}
			if (e.implicitKey) return `${r} `;
		}
		return r;
	}
};
function rr(e, t, n) {
	if (Pn(t)) {
		let r = t.resolve(e), i = n && r && n.get(r);
		return i ? i.count * i.aliasCount : 0;
	}
	if (A(t)) {
		let r = 0;
		for (let i of t.items) {
			let t = rr(e, i, n);
			t > r && (r = t);
		}
		return r;
	}
	if (O(t)) {
		let r = rr(e, t.key, n), i = rr(e, t.value, n);
		return Math.max(r, i);
	}
	return 1;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Scalar.js
var ir = (e) => !e || typeof e != "function" && typeof e != "object", N = class extends tr {
	constructor(e) {
		super(jn), this.value = e;
	}
	toJSON(e, t) {
		return t?.keep ? this.value : M(this.value, e, t);
	}
	toString() {
		return String(this.value);
	}
};
N.BLOCK_FOLDED = "BLOCK_FOLDED", N.BLOCK_LITERAL = "BLOCK_LITERAL", N.PLAIN = "PLAIN", N.QUOTE_DOUBLE = "QUOTE_DOUBLE", N.QUOTE_SINGLE = "QUOTE_SINGLE";
//#endregion
//#region node_modules/yaml/browser/dist/doc/createNode.js
var ar = "tag:yaml.org,2002:";
function or(e, t, n) {
	if (t) {
		let e = n.filter((e) => e.tag === t), r = e.find((e) => !e.format) ?? e[0];
		if (!r) throw Error(`Tag ${t} not found`);
		return r;
	}
	return n.find((t) => t.identify?.(e) && !t.format);
}
function sr(e, t, n) {
	if (Fn(e) && (e = e.contents), j(e)) return e;
	if (O(e)) {
		let t = n.schema[kn].createNode?.(n.schema, null, n);
		return t.items.push(e), t;
	}
	(e instanceof String || e instanceof Number || e instanceof Boolean || typeof BigInt < "u" && e instanceof BigInt) && (e = e.valueOf());
	let { aliasDuplicateObjects: r, onAnchor: i, onTagObj: a, schema: o, sourceObjects: s } = n, c;
	if (r && e && typeof e == "object") {
		if (c = s.get(e), c) return c.anchor ?? (c.anchor = i(e)), new nr(c.anchor);
		c = {
			anchor: null,
			node: null
		}, s.set(e, c);
	}
	t?.startsWith("!!") && (t = ar + t.slice(2));
	let l = or(e, t, o.tags);
	if (!l) {
		if (e && typeof e.toJSON == "function" && (e = e.toJSON()), !e || typeof e != "object") {
			let t = new N(e);
			return c && (c.node = t), t;
		}
		l = e instanceof Map ? o[kn] : Symbol.iterator in Object(e) ? o[Mn] : o[kn];
	}
	a && (a(l), delete n.onTagObj);
	let u = l?.createNode ? l.createNode(n.schema, e, n) : typeof l?.nodeClass?.from == "function" ? l.nodeClass.from(n.schema, e, n) : new N(e);
	return t ? u.tag = t : l.default || (u.tag = l.tag), c && (c.node = u), u;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Collection.js
function cr(e, t, n) {
	let r = n;
	for (let e = t.length - 1; e >= 0; --e) {
		let n = t[e];
		if (typeof n == "number" && Number.isInteger(n) && n >= 0) {
			let e = [];
			e[n] = r, r = e;
		} else r = /* @__PURE__ */ new Map([[n, r]]);
	}
	return sr(r, void 0, {
		aliasDuplicateObjects: !1,
		keepUndefined: !1,
		onAnchor: () => {
			throw Error("This should not happen, please report a bug.");
		},
		schema: e,
		sourceObjects: /* @__PURE__ */ new Map()
	});
}
var lr = (e) => e == null || typeof e == "object" && !!e[Symbol.iterator]().next().done, ur = class extends tr {
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
		return e && (t.schema = e), t.items = t.items.map((t) => j(t) || O(t) ? t.clone(e) : t), this.range && (t.range = this.range.slice()), t;
	}
	addIn(e, t) {
		if (lr(e)) this.add(t);
		else {
			let [n, ...r] = e, i = this.get(n, !0);
			if (A(i)) i.addIn(r, t);
			else if (i === void 0 && this.schema) this.set(n, cr(this.schema, r, t));
			else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
		}
	}
	deleteIn(e) {
		let [t, ...n] = e;
		if (n.length === 0) return this.delete(t);
		let r = this.get(t, !0);
		if (A(r)) return r.deleteIn(n);
		throw Error(`Expected YAML collection at ${t}. Remaining path: ${n}`);
	}
	getIn(e, t) {
		let [n, ...r] = e, i = this.get(n, !0);
		return r.length === 0 ? !t && k(i) ? i.value : i : A(i) ? i.getIn(r, t) : void 0;
	}
	hasAllNullValues(e) {
		return this.items.every((t) => {
			if (!O(t)) return !1;
			let n = t.value;
			return n == null || e && k(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
		});
	}
	hasIn(e) {
		let [t, ...n] = e;
		if (n.length === 0) return this.has(t);
		let r = this.get(t, !0);
		return A(r) ? r.hasIn(n) : !1;
	}
	setIn(e, t) {
		let [n, ...r] = e;
		if (r.length === 0) this.set(n, t);
		else {
			let e = this.get(n, !0);
			if (A(e)) e.setIn(r, t);
			else if (e === void 0 && this.schema) this.set(n, cr(this.schema, r, t));
			else throw Error(`Expected YAML collection at ${n}. Remaining path: ${r}`);
		}
	}
}, dr = (e) => e.replace(/^(?!$)(?: $)?/gm, "#");
function fr(e, t) {
	return /^\n+$/.test(e) ? e.substring(1) : t ? e.replace(/^(?! *$)/gm, t) : e;
}
var pr = (e, t, n) => e.endsWith("\n") ? fr(n, t) : n.includes("\n") ? "\n" + fr(n, t) : (e.endsWith(" ") ? "" : " ") + n, mr = "flow", hr = "block", gr = "quoted";
function _r(e, t, n = "flow", { indentAtStart: r, lineWidth: i = 80, minContentWidth: a = 20, onFold: o, onOverflow: s } = {}) {
	if (!i || i < 0) return e;
	i < a && (a = 0);
	let c = Math.max(1 + a, 1 + i - t.length);
	if (e.length <= c) return e;
	let l = [], u = {}, d = i - t.length;
	typeof r == "number" && (r > i - Math.max(2, a) ? l.push(0) : d = i - r);
	let f, p, m = !1, h = -1, g = -1, _ = -1;
	n === "block" && (h = vr(e, h, t.length), h !== -1 && (d = h + c));
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
		if (r === "\n") n === "block" && (h = vr(e, h, t.length)), d = h + t.length + c, f = void 0;
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
function vr(e, t, n) {
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
var yr = (e, t) => ({
	indentAtStart: t ? e.indent.length : e.indentAtStart,
	lineWidth: e.options.lineWidth,
	minContentWidth: e.options.minContentWidth
}), br = (e) => /^(%|---|\.\.\.)/m.test(e);
function xr(e, t, n) {
	if (!t || t < 0) return !1;
	let r = t - n, i = e.length;
	if (i <= r) return !1;
	for (let t = 0, n = 0; t < i; ++t) if (e[t] === "\n") {
		if (t - n > r) return !0;
		if (n = t + 1, i - n <= r) return !1;
	}
	return !0;
}
function Sr(e, t) {
	let n = JSON.stringify(e);
	if (t.options.doubleQuotedAsJSON) return n;
	let { implicitKey: r } = t, i = t.options.doubleQuotedMinMultiLineLength, a = t.indent || (br(e) ? "  " : ""), o = "", s = 0;
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
	return o = s ? o + n.slice(s) : n, r ? o : _r(o, a, gr, yr(t, !1));
}
function Cr(e, t) {
	if (t.options.singleQuote === !1 || t.implicitKey && e.includes("\n") || /[ \t]\n|\n[ \t]/.test(e)) return Sr(e, t);
	let n = t.indent || (br(e) ? "  " : ""), r = "'" + e.replace(/'/g, "''").replace(/\n+/g, `$&\n${n}`) + "'";
	return t.implicitKey ? r : _r(r, n, mr, yr(t, !1));
}
function wr(e, t) {
	let { singleQuote: n } = t.options, r;
	if (n === !1) r = Sr;
	else {
		let t = e.includes("\""), i = e.includes("'");
		r = t && !i ? Cr : i && !t ? Sr : n ? Cr : Sr;
	}
	return r(e, t);
}
var Tr;
try {
	Tr = /* @__PURE__ */ RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
} catch {
	Tr = /\n+(?!\n|$)/g;
}
function Er({ comment: e, type: t, value: n }, r, i, a) {
	let { blockQuote: o, commentString: s, lineWidth: c } = r.options;
	if (!o || /\n[\t ]+$/.test(n)) return wr(n, r);
	let l = r.indent || (r.forceBlockIndent || br(n) ? "  " : ""), u = o === "literal" ? !0 : o === "folded" || t === N.BLOCK_FOLDED ? !1 : t === N.BLOCK_LITERAL || !xr(n, c, l.length);
	if (!n) return u ? "|\n" : ">\n";
	let d, f;
	for (f = n.length; f > 0; --f) {
		let e = n[f - 1];
		if (e !== "\n" && e !== "	" && e !== " ") break;
	}
	let p = n.substring(f), m = p.indexOf("\n");
	m === -1 ? d = "-" : n === p || m !== p.length - 1 ? (d = "+", a && a()) : d = "", p &&= (n = n.slice(0, -p.length), p[p.length - 1] === "\n" && (p = p.slice(0, -1)), p.replace(Tr, `$&${l}`));
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
		let e = n.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${l}`), i = !1, a = yr(r, !0);
		o !== "folded" && t !== N.BLOCK_FOLDED && (a.onOverflow = () => {
			i = !0;
		});
		let s = _r(`${v}${e}${p}`, l, hr, a);
		if (!i) return `>${y}\n${l}${s}`;
	}
	return n = n.replace(/\n+/g, `$&${l}`), `|${y}\n${l}${v}${n}${p}`;
}
function Dr(e, t, n, r) {
	let { type: i, value: a } = e, { actualString: o, implicitKey: s, indent: c, indentStep: l, inFlow: u } = t;
	if (s && a.includes("\n") || u && /[[\]{},]/.test(a)) return wr(a, t);
	if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(a)) return s || u || !a.includes("\n") ? wr(a, t) : Er(e, t, n, r);
	if (!s && !u && i !== N.PLAIN && a.includes("\n")) return Er(e, t, n, r);
	if (br(a)) {
		if (c === "") return t.forceBlockIndent = !0, Er(e, t, n, r);
		if (s && c === l) return wr(a, t);
	}
	let d = a.replace(/\n+/g, `$&\n${c}`);
	if (o) {
		let e = (e) => e.default && e.tag !== "tag:yaml.org,2002:str" && e.test?.test(d), { compat: n, tags: r } = t.doc.schema;
		if (r.some(e) || n?.some(e)) return wr(a, t);
	}
	return s ? d : _r(d, c, mr, yr(t, !1));
}
function Or(e, t, n, r) {
	let { implicitKey: i, inFlow: a } = t, o = typeof e.value == "string" ? e : Object.assign({}, e, { value: String(e.value) }), { type: s } = e;
	s !== N.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(o.value) && (s = N.QUOTE_DOUBLE);
	let c = (e) => {
		switch (e) {
			case N.BLOCK_FOLDED:
			case N.BLOCK_LITERAL: return i || a ? wr(o.value, t) : Er(o, t, n, r);
			case N.QUOTE_DOUBLE: return Sr(o.value, t);
			case N.QUOTE_SINGLE: return Cr(o.value, t);
			case N.PLAIN: return Dr(o, t, n, r);
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
function kr(e, t) {
	let n = Object.assign({
		blockQuote: !0,
		commentString: dr,
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
function Ar(e, t) {
	if (t.tag) {
		let n = e.filter((e) => e.tag === t.tag);
		if (n.length > 0) return n.find((e) => e.format === t.format) ?? n[0];
	}
	let n, r;
	if (k(t)) {
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
function jr(e, t, { anchors: n, doc: r }) {
	if (!r.directives) return "";
	let i = [], a = (k(e) || A(e)) && e.anchor;
	a && Xn(a) && (n.add(a), i.push(`&${a}`));
	let o = e.tag ?? (t.default ? null : t.tag);
	return o && i.push(r.directives.tagString(o)), i.join(" ");
}
function Mr(e, t, n, r) {
	if (O(e)) return e.toString(t, n, r);
	if (Pn(e)) {
		if (t.doc.directives) return e.toString(t);
		if (t.resolvedAliases?.has(e)) throw TypeError("Cannot stringify circular structure without alias nodes");
		t.resolvedAliases ? t.resolvedAliases.add(e) : t.resolvedAliases = /* @__PURE__ */ new Set([e]), e = e.resolve(t.doc);
	}
	let i, a = j(e) ? e : t.doc.createNode(e, { onTagObj: (e) => i = e });
	i ??= Ar(t.doc.schema.tags, a);
	let o = jr(a, i, t);
	o.length > 0 && (t.indentAtStart = (t.indentAtStart ?? 0) + o.length + 1);
	let s = typeof i.stringify == "function" ? i.stringify(a, t, n, r) : k(a) ? Or(a, t, n, r) : a.toString(t, n, r);
	return o ? k(a) || s[0] === "{" || s[0] === "[" ? `${o} ${s}` : `${o}\n${t.indent}${s}` : s;
}
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyPair.js
function Nr({ key: e, value: t }, n, r, i) {
	let { allNullValues: a, doc: o, indent: s, indentStep: c, options: { commentString: l, indentSeq: u, simpleKeys: d } } = n, f = j(e) && e.comment || null;
	if (d) {
		if (f) throw Error("With simple keys, key nodes cannot have comments");
		if (A(e) || !j(e) && typeof e == "object") throw Error("With simple keys, collection cannot be used as a key value");
	}
	let p = !d && (!e || f && t == null && !n.inFlow || A(e) || (k(e) ? e.type === N.BLOCK_FOLDED || e.type === N.BLOCK_LITERAL : typeof e == "object"));
	n = Object.assign({}, n, {
		allNullValues: !1,
		implicitKey: !p && (d || !a),
		indent: s + c
	});
	let m = !1, h = !1, g = Mr(e, n, () => m = !0, () => h = !0);
	if (!p && !n.inFlow && g.length > 1024) {
		if (d) throw Error("With simple keys, single line scalar must not span more than 1024 characters");
		p = !0;
	}
	if (n.inFlow) {
		if (a || t == null) return m && r && r(), g === "" ? "?" : p ? `? ${g}` : g;
	} else if (a && !d || t == null && p) return g = `? ${g}`, f && !m ? g += pr(g, n.indent, l(f)) : h && i && i(), g;
	m && (f = null), p ? (f && (g += pr(g, n.indent, l(f))), g = `? ${g}\n${s}:`) : (g = `${g}:`, f && (g += pr(g, n.indent, l(f))));
	let _, v, y;
	j(t) ? (_ = !!t.spaceBefore, v = t.commentBefore, y = t.comment) : (_ = !1, v = null, y = null, t && typeof t == "object" && (t = o.createNode(t))), n.implicitKey = !1, !p && !f && k(t) && (n.indentAtStart = g.length + 1), h = !1, !u && c.length >= 2 && !n.inFlow && !p && Ln(t) && !t.flow && !t.tag && !t.anchor && (n.indent = n.indent.substring(2));
	let ee = !1, b = Mr(t, n, () => ee = !0, () => h = !0), x = " ";
	if (f || _ || v) {
		if (x = _ ? "\n" : "", v) {
			let e = l(v);
			x += `\n${fr(e, n.indent)}`;
		}
		b === "" && !n.inFlow ? x === "\n" && y && (x = "\n\n") : x += `\n${n.indent}`;
	} else if (!p && A(t)) {
		let e = b[0], r = b.indexOf("\n"), i = r !== -1, a = n.inFlow ?? t.flow ?? t.items.length === 0;
		if (i || !a) {
			let t = !1;
			if (i && (e === "&" || e === "!")) {
				let n = b.indexOf(" ");
				e === "&" && n !== -1 && n < r && b[n + 1] === "!" && (n = b.indexOf(" ", n + 1)), (n === -1 || r < n) && (t = !0);
			}
			t || (x = `\n${n.indent}`);
		}
	} else (b === "" || b[0] === "\n") && (x = "");
	return g += x + b, n.inFlow ? ee && r && r() : y && !ee ? g += pr(g, n.indent, l(y)) : h && i && i(), g;
}
//#endregion
//#region node_modules/yaml/browser/dist/log.js
function Pr(e, t) {
	(e === "debug" || e === "warn") && console.warn(t);
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/merge.js
var Fr = "<<", Ir = {
	identify: (e) => e === Fr || typeof e == "symbol" && e.description === Fr,
	default: "key",
	tag: "tag:yaml.org,2002:merge",
	test: /^<<$/,
	resolve: () => Object.assign(new N(Symbol(Fr)), { addToJSMap: Rr }),
	stringify: () => Fr
}, Lr = (e, t) => (Ir.identify(t) || k(t) && (!t.type || t.type === N.PLAIN) && Ir.identify(t.value)) && e?.doc.schema.tags.some((e) => e.tag === Ir.tag && e.default);
function Rr(e, t, n) {
	let r = Br(e, n);
	if (Ln(r)) for (let n of r.items) zr(e, t, n);
	else if (Array.isArray(r)) for (let n of r) zr(e, t, n);
	else zr(e, t, r);
}
function zr(e, t, n) {
	let r = Br(e, n);
	if (!In(r)) throw Error("Merge sources must be maps or map aliases");
	let i = r.toJSON(null, e, Map);
	for (let [e, n] of i) t instanceof Map ? t.has(e) || t.set(e, n) : t instanceof Set ? t.add(e) : Object.prototype.hasOwnProperty.call(t, e) || Object.defineProperty(t, e, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
	return t;
}
function Br(e, t) {
	return e && Pn(t) ? t.resolve(e.doc, e) : t;
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/addPairToJSMap.js
function Vr(e, t, { key: n, value: r }) {
	if (j(n) && n.addToJSMap) n.addToJSMap(e, t, r);
	else if (Lr(e, n)) Rr(e, t, r);
	else {
		let i = M(n, "", e);
		if (t instanceof Map) t.set(i, M(r, i, e));
		else if (t instanceof Set) t.add(i);
		else {
			let a = Hr(n, i, e), o = M(r, a, e);
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
function Hr(e, t, n) {
	if (t === null) return "";
	if (typeof t != "object") return String(t);
	if (j(e) && n?.doc) {
		let t = kr(n.doc, {});
		t.anchors = /* @__PURE__ */ new Set();
		for (let e of n.anchors.keys()) t.anchors.add(e.anchor);
		t.inFlow = !0, t.inStringifyKey = !0;
		let r = e.toString(t);
		if (!n.mapKeyWarned) {
			let e = JSON.stringify(r);
			e.length > 40 && (e = e.substring(0, 36) + "...\""), Pr(n.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${e}. Set mapAsMap: true to use object keys.`), n.mapKeyWarned = !0;
		}
		return r;
	}
	return JSON.stringify(t);
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/Pair.js
function Ur(e, t, n) {
	return new P(sr(e, void 0, n), sr(t, void 0, n));
}
var P = class e {
	constructor(e, t = null) {
		Object.defineProperty(this, Nn, { value: An }), this.key = e, this.value = t;
	}
	clone(t) {
		let { key: n, value: r } = this;
		return j(n) && (n = n.clone(t)), j(r) && (r = r.clone(t)), new e(n, r);
	}
	toJSON(e, t) {
		return Vr(t, t?.mapAsMap ? /* @__PURE__ */ new Map() : {}, this);
	}
	toString(e, t, n) {
		return e?.doc ? Nr(this, e, t, n) : JSON.stringify(this);
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyCollection.js
function Wr(e, t, n) {
	return (t.inFlow ?? e.flow ? Kr : Gr)(e, t, n);
}
function Gr({ comment: e, items: t }, n, { blockItemPrefix: r, flowChars: i, itemIndent: a, onChompKeep: o, onComment: s }) {
	let { indent: c, options: { commentString: l } } = n, u = Object.assign({}, n, {
		indent: a,
		type: null
	}), d = !1, f = [];
	for (let e = 0; e < t.length; ++e) {
		let i = t[e], o = null;
		if (j(i)) !d && i.spaceBefore && f.push(""), qr(n, f, i.commentBefore, d), i.comment && (o = i.comment);
		else if (O(i)) {
			let e = j(i.key) ? i.key : null;
			e && (!d && e.spaceBefore && f.push(""), qr(n, f, e.commentBefore, d));
		}
		d = !1;
		let s = Mr(i, u, () => o = null, () => d = !0);
		o && (s += pr(s, a, l(o))), d && o && (d = !1), f.push(r + s);
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
	return e ? (p += "\n" + fr(l(e), c), s && s()) : d && o && o(), p;
}
function Kr({ items: e }, t, { flowChars: n, itemIndent: r }) {
	let { indent: i, indentStep: a, flowCollectionPadding: o, options: { commentString: s } } = t;
	r += a;
	let c = Object.assign({}, t, {
		indent: r,
		inFlow: !0,
		type: null
	}), l = !1, u = 0, d = [];
	for (let n = 0; n < e.length; ++n) {
		let i = e[n], a = null;
		if (j(i)) i.spaceBefore && d.push(""), qr(t, d, i.commentBefore, !1), i.comment && (a = i.comment);
		else if (O(i)) {
			let e = j(i.key) ? i.key : null;
			e && (e.spaceBefore && d.push(""), qr(t, d, e.commentBefore, !1), e.comment && (l = !0));
			let n = j(i.value) ? i.value : null;
			n ? (n.comment && (a = n.comment), n.commentBefore && (l = !0)) : i.value == null && e?.comment && (a = e.comment);
		}
		a && (l = !0);
		let o = Mr(i, c, () => a = null);
		l ||= d.length > u || o.includes("\n"), n < e.length - 1 ? o += "," : t.options.trailingComma && (t.options.lineWidth > 0 && (l ||= d.reduce((e, t) => e + t.length + 2, 2) + (o.length + 2) > t.options.lineWidth), l && (o += ",")), a && (o += pr(o, r, s(a))), d.push(o), u = d.length;
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
function qr({ indent: e, options: { commentString: t } }, n, r, i) {
	if (r && i && (r = r.replace(/^\n+/, "")), r) {
		let i = fr(t(r), e);
		n.push(i.trimStart());
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/nodes/YAMLMap.js
function Jr(e, t) {
	let n = k(t) ? t.value : t;
	for (let r of e) if (O(r) && (r.key === t || r.key === n || k(r.key) && r.key.value === n)) return r;
}
var Yr = class extends ur {
	static get tagName() {
		return "tag:yaml.org,2002:map";
	}
	constructor(e) {
		super(kn, e), this.items = [];
	}
	static from(e, t, n) {
		let { keepUndefined: r, replacer: i } = n, a = new this(e), o = (e, o) => {
			if (typeof i == "function") o = i.call(t, e, o);
			else if (Array.isArray(i) && !i.includes(e)) return;
			(o !== void 0 || r) && a.items.push(Ur(e, o, n));
		};
		if (t instanceof Map) for (let [e, n] of t) o(e, n);
		else if (t && typeof t == "object") for (let e of Object.keys(t)) o(e, t[e]);
		return typeof e.sortMapEntries == "function" && a.items.sort(e.sortMapEntries), a;
	}
	add(e, t) {
		let n;
		n = O(e) ? e : !e || typeof e != "object" || !("key" in e) ? new P(e, e?.value) : new P(e.key, e.value);
		let r = Jr(this.items, n.key), i = this.schema?.sortMapEntries;
		if (r) {
			if (!t) throw Error(`Key ${n.key} already set`);
			k(r.value) && ir(n.value) ? r.value.value = n.value : r.value = n.value;
		} else if (i) {
			let e = this.items.findIndex((e) => i(n, e) < 0);
			e === -1 ? this.items.push(n) : this.items.splice(e, 0, n);
		} else this.items.push(n);
	}
	delete(e) {
		let t = Jr(this.items, e);
		return t ? this.items.splice(this.items.indexOf(t), 1).length > 0 : !1;
	}
	get(e, t) {
		let n = Jr(this.items, e)?.value;
		return (!t && k(n) ? n.value : n) ?? void 0;
	}
	has(e) {
		return !!Jr(this.items, e);
	}
	set(e, t) {
		this.add(new P(e, t), !0);
	}
	toJSON(e, t, n) {
		let r = n ? new n() : t?.mapAsMap ? /* @__PURE__ */ new Map() : {};
		t?.onCreate && t.onCreate(r);
		for (let e of this.items) Vr(t, r, e);
		return r;
	}
	toString(e, t, n) {
		if (!e) return JSON.stringify(this);
		for (let e of this.items) if (!O(e)) throw Error(`Map items must all be pairs; found ${JSON.stringify(e)} instead`);
		return !e.allNullValues && this.hasAllNullValues(!1) && (e = Object.assign({}, e, { allNullValues: !0 })), Wr(this, e, {
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
}, Xr = {
	collection: "map",
	default: !0,
	nodeClass: Yr,
	tag: "tag:yaml.org,2002:map",
	resolve(e, t) {
		return In(e) || t("Expected a mapping for this tag"), e;
	},
	createNode: (e, t, n) => Yr.from(e, t, n)
}, Zr = class extends ur {
	static get tagName() {
		return "tag:yaml.org,2002:seq";
	}
	constructor(e) {
		super(Mn, e), this.items = [];
	}
	add(e) {
		this.items.push(e);
	}
	delete(e) {
		let t = Qr(e);
		return typeof t == "number" && this.items.splice(t, 1).length > 0;
	}
	get(e, t) {
		let n = Qr(e);
		if (typeof n != "number") return;
		let r = this.items[n];
		return !t && k(r) ? r.value : r;
	}
	has(e) {
		let t = Qr(e);
		return typeof t == "number" && t < this.items.length;
	}
	set(e, t) {
		let n = Qr(e);
		if (typeof n != "number") throw Error(`Expected a valid index, not ${e}.`);
		let r = this.items[n];
		k(r) && ir(t) ? r.value = t : this.items[n] = t;
	}
	toJSON(e, t) {
		let n = [];
		t?.onCreate && t.onCreate(n);
		let r = 0;
		for (let e of this.items) n.push(M(e, String(r++), t));
		return n;
	}
	toString(e, t, n) {
		return e ? Wr(this, e, {
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
				i.items.push(sr(a, void 0, n));
			}
		}
		return i;
	}
};
function Qr(e) {
	let t = k(e) ? e.value : e;
	return t && typeof t == "string" && (t = Number(t)), typeof t == "number" && Number.isInteger(t) && t >= 0 ? t : null;
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/common/seq.js
var $r = {
	collection: "seq",
	default: !0,
	nodeClass: Zr,
	tag: "tag:yaml.org,2002:seq",
	resolve(e, t) {
		return Ln(e) || t("Expected a sequence for this tag"), e;
	},
	createNode: (e, t, n) => Zr.from(e, t, n)
}, ei = {
	identify: (e) => typeof e == "string",
	default: !0,
	tag: "tag:yaml.org,2002:str",
	resolve: (e) => e,
	stringify(e, t, n, r) {
		return t = Object.assign({ actualString: !0 }, t), Or(e, t, n, r);
	}
}, ti = {
	identify: (e) => e == null,
	createNode: () => new N(null),
	default: !0,
	tag: "tag:yaml.org,2002:null",
	test: /^(?:~|[Nn]ull|NULL)?$/,
	resolve: () => new N(null),
	stringify: ({ source: e }, t) => typeof e == "string" && ti.test.test(e) ? e : t.options.nullStr
}, ni = {
	identify: (e) => typeof e == "boolean",
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
	resolve: (e) => new N(e[0] === "t" || e[0] === "T"),
	stringify({ source: e, value: t }, n) {
		return e && ni.test.test(e) && t === (e[0] === "t" || e[0] === "T") ? e : t ? n.options.trueStr : n.options.falseStr;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyNumber.js
function ri({ format: e, minFractionDigits: t, tag: n, value: r }) {
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
var ii = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
	resolve: (e) => e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? -Infinity : Infinity,
	stringify: ri
}, ai = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "EXP",
	test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
	resolve: (e) => parseFloat(e),
	stringify(e) {
		let t = Number(e.value);
		return isFinite(t) ? t.toExponential() : ri(e);
	}
}, oi = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
	resolve(e) {
		let t = new N(parseFloat(e)), n = e.indexOf(".");
		return n !== -1 && e[e.length - 1] === "0" && (t.minFractionDigits = e.length - n - 1), t;
	},
	stringify: ri
}, si = (e) => typeof e == "bigint" || Number.isInteger(e), ci = (e, t, n, { intAsBigInt: r }) => r ? BigInt(e) : parseInt(e.substring(t), n);
function li(e, t, n) {
	let { value: r } = e;
	return si(r) && r >= 0 ? n + r.toString(t) : ri(e);
}
var ui = {
	identify: (e) => si(e) && e >= 0,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "OCT",
	test: /^0o[0-7]+$/,
	resolve: (e, t, n) => ci(e, 2, 8, n),
	stringify: (e) => li(e, 8, "0o")
}, di = {
	identify: si,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	test: /^[-+]?[0-9]+$/,
	resolve: (e, t, n) => ci(e, 0, 10, n),
	stringify: ri
}, fi = {
	identify: (e) => si(e) && e >= 0,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "HEX",
	test: /^0x[0-9a-fA-F]+$/,
	resolve: (e, t, n) => ci(e, 2, 16, n),
	stringify: (e) => li(e, 16, "0x")
}, pi = [
	Xr,
	$r,
	ei,
	ti,
	ni,
	ui,
	di,
	fi,
	ii,
	ai,
	oi
];
//#endregion
//#region node_modules/yaml/browser/dist/schema/json/schema.js
function mi(e) {
	return typeof e == "bigint" || Number.isInteger(e);
}
var hi = ({ value: e }) => JSON.stringify(e), gi = [
	{
		identify: (e) => typeof e == "string",
		default: !0,
		tag: "tag:yaml.org,2002:str",
		resolve: (e) => e,
		stringify: hi
	},
	{
		identify: (e) => e == null,
		createNode: () => new N(null),
		default: !0,
		tag: "tag:yaml.org,2002:null",
		test: /^null$/,
		resolve: () => null,
		stringify: hi
	},
	{
		identify: (e) => typeof e == "boolean",
		default: !0,
		tag: "tag:yaml.org,2002:bool",
		test: /^true$|^false$/,
		resolve: (e) => e === "true",
		stringify: hi
	},
	{
		identify: mi,
		default: !0,
		tag: "tag:yaml.org,2002:int",
		test: /^-?(?:0|[1-9][0-9]*)$/,
		resolve: (e, t, { intAsBigInt: n }) => n ? BigInt(e) : parseInt(e, 10),
		stringify: ({ value: e }) => mi(e) ? e.toString() : JSON.stringify(e)
	},
	{
		identify: (e) => typeof e == "number",
		default: !0,
		tag: "tag:yaml.org,2002:float",
		test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
		resolve: (e) => parseFloat(e),
		stringify: hi
	}
], _i = [Xr, $r].concat(gi, {
	default: !0,
	tag: "",
	test: /^/,
	resolve(e, t) {
		return t(`Unresolved plain scalar ${JSON.stringify(e)}`), e;
	}
}), vi = {
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
		if (t ??= N.BLOCK_LITERAL, t !== N.QUOTE_DOUBLE) {
			let e = Math.max(r.options.lineWidth - r.indent.length, r.options.minContentWidth), n = Math.ceil(s.length / e), i = Array(n);
			for (let t = 0, r = 0; t < n; ++t, r += e) i[t] = s.substr(r, e);
			s = i.join(t === N.BLOCK_LITERAL ? "\n" : " ");
		}
		return Or({
			comment: e,
			type: t,
			value: s
		}, r, i, a);
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/pairs.js
function yi(e, t) {
	if (Ln(e)) for (let n = 0; n < e.items.length; ++n) {
		let r = e.items[n];
		if (!O(r)) {
			if (In(r)) {
				r.items.length > 1 && t("Each pair must have its own sequence indicator");
				let e = r.items[0] || new P(new N(null));
				if (r.commentBefore && (e.key.commentBefore = e.key.commentBefore ? `${r.commentBefore}\n${e.key.commentBefore}` : r.commentBefore), r.comment) {
					let t = e.value ?? e.key;
					t.comment = t.comment ? `${r.comment}\n${t.comment}` : r.comment;
				}
				r = e;
			}
			e.items[n] = O(r) ? r : new P(r);
		}
	}
	else t("Expected a sequence for this tag");
	return e;
}
function bi(e, t, n) {
	let { replacer: r } = n, i = new Zr(e);
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
		i.items.push(Ur(o, s, n));
	}
	return i;
}
var xi = {
	collection: "seq",
	default: !1,
	tag: "tag:yaml.org,2002:pairs",
	resolve: yi,
	createNode: bi
}, Si = class e extends Zr {
	constructor() {
		super(), this.add = Yr.prototype.add.bind(this), this.delete = Yr.prototype.delete.bind(this), this.get = Yr.prototype.get.bind(this), this.has = Yr.prototype.has.bind(this), this.set = Yr.prototype.set.bind(this), this.tag = e.tag;
	}
	toJSON(e, t) {
		if (!t) return super.toJSON(e);
		let n = /* @__PURE__ */ new Map();
		t?.onCreate && t.onCreate(n);
		for (let e of this.items) {
			let r, i;
			if (O(e) ? (r = M(e.key, "", t), i = M(e.value, r, t)) : r = M(e, "", t), n.has(r)) throw Error("Ordered maps must not include duplicate keys");
			n.set(r, i);
		}
		return n;
	}
	static from(e, t, n) {
		let r = bi(e, t, n), i = new this();
		return i.items = r.items, i;
	}
};
Si.tag = "tag:yaml.org,2002:omap";
var Ci = {
	collection: "seq",
	identify: (e) => e instanceof Map,
	nodeClass: Si,
	default: !1,
	tag: "tag:yaml.org,2002:omap",
	resolve(e, t) {
		let n = yi(e, t), r = [];
		for (let { key: e } of n.items) k(e) && (r.includes(e.value) ? t(`Ordered maps must not include duplicate keys: ${e.value}`) : r.push(e.value));
		return Object.assign(new Si(), n);
	},
	createNode: (e, t, n) => Si.from(e, t, n)
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/bool.js
function wi({ value: e, source: t }, n) {
	return t && (e ? Ti : Ei).test.test(t) ? t : e ? n.options.trueStr : n.options.falseStr;
}
var Ti = {
	identify: (e) => e === !0,
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
	resolve: () => new N(!0),
	stringify: wi
}, Ei = {
	identify: (e) => e === !1,
	default: !0,
	tag: "tag:yaml.org,2002:bool",
	test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
	resolve: () => new N(!1),
	stringify: wi
}, Di = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
	resolve: (e) => e.slice(-3).toLowerCase() === "nan" ? NaN : e[0] === "-" ? -Infinity : Infinity,
	stringify: ri
}, Oi = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "EXP",
	test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
	resolve: (e) => parseFloat(e.replace(/_/g, "")),
	stringify(e) {
		let t = Number(e.value);
		return isFinite(t) ? t.toExponential() : ri(e);
	}
}, ki = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
	resolve(e) {
		let t = new N(parseFloat(e.replace(/_/g, ""))), n = e.indexOf(".");
		if (n !== -1) {
			let r = e.substring(n + 1).replace(/_/g, "");
			r[r.length - 1] === "0" && (t.minFractionDigits = r.length);
		}
		return t;
	},
	stringify: ri
}, Ai = (e) => typeof e == "bigint" || Number.isInteger(e);
function ji(e, t, n, { intAsBigInt: r }) {
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
function Mi(e, t, n) {
	let { value: r } = e;
	if (Ai(r)) {
		let e = r.toString(t);
		return r < 0 ? "-" + n + e.substr(1) : n + e;
	}
	return ri(e);
}
var Ni = {
	identify: Ai,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "BIN",
	test: /^[-+]?0b[0-1_]+$/,
	resolve: (e, t, n) => ji(e, 2, 2, n),
	stringify: (e) => Mi(e, 2, "0b")
}, Pi = {
	identify: Ai,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "OCT",
	test: /^[-+]?0[0-7_]+$/,
	resolve: (e, t, n) => ji(e, 1, 8, n),
	stringify: (e) => Mi(e, 8, "0")
}, Fi = {
	identify: Ai,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	test: /^[-+]?[0-9][0-9_]*$/,
	resolve: (e, t, n) => ji(e, 0, 10, n),
	stringify: ri
}, Ii = {
	identify: Ai,
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "HEX",
	test: /^[-+]?0x[0-9a-fA-F_]+$/,
	resolve: (e, t, n) => ji(e, 2, 16, n),
	stringify: (e) => Mi(e, 16, "0x")
}, Li = class e extends Yr {
	constructor(t) {
		super(t), this.tag = e.tag;
	}
	add(e) {
		let t;
		t = O(e) ? e : e && typeof e == "object" && "key" in e && "value" in e && e.value === null ? new P(e.key, null) : new P(e, null), Jr(this.items, t.key) || this.items.push(t);
	}
	get(e, t) {
		let n = Jr(this.items, e);
		return !t && O(n) ? k(n.key) ? n.key.value : n.key : n;
	}
	set(e, t) {
		if (typeof t != "boolean") throw Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);
		let n = Jr(this.items, e);
		n && !t ? this.items.splice(this.items.indexOf(n), 1) : !n && t && this.items.push(new P(e));
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
		if (t && Symbol.iterator in Object(t)) for (let e of t) typeof r == "function" && (e = r.call(t, e, e)), i.items.push(Ur(e, null, n));
		return i;
	}
};
Li.tag = "tag:yaml.org,2002:set";
var Ri = {
	collection: "map",
	identify: (e) => e instanceof Set,
	nodeClass: Li,
	default: !1,
	tag: "tag:yaml.org,2002:set",
	createNode: (e, t, n) => Li.from(e, t, n),
	resolve(e, t) {
		if (In(e)) {
			if (e.hasAllNullValues(!0)) return Object.assign(new Li(), e);
			t("Set items must all have null values");
		} else t("Expected a mapping for this tag");
		return e;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/schema/yaml-1.1/timestamp.js
function zi(e, t) {
	let n = e[0], r = n === "-" || n === "+" ? e.substring(1) : e, i = (e) => t ? BigInt(e) : Number(e), a = r.replace(/_/g, "").split(":").reduce((e, t) => e * i(60) + i(t), i(0));
	return n === "-" ? i(-1) * a : a;
}
function Bi(e) {
	let { value: t } = e, n = (e) => e;
	if (typeof t == "bigint") n = (e) => BigInt(e);
	else if (isNaN(t) || !isFinite(t)) return ri(e);
	let r = "";
	t < 0 && (r = "-", t *= n(-1));
	let i = n(60), a = [t % i];
	return t < 60 ? a.unshift(0) : (t = (t - a[0]) / i, a.unshift(t % i), t >= 60 && (t = (t - a[0]) / i, a.unshift(t))), r + a.map((e) => String(e).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
}
var Vi = {
	identify: (e) => typeof e == "bigint" || Number.isInteger(e),
	default: !0,
	tag: "tag:yaml.org,2002:int",
	format: "TIME",
	test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
	resolve: (e, t, { intAsBigInt: n }) => zi(e, n),
	stringify: Bi
}, Hi = {
	identify: (e) => typeof e == "number",
	default: !0,
	tag: "tag:yaml.org,2002:float",
	format: "TIME",
	test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
	resolve: (e) => zi(e, !1),
	stringify: Bi
}, Ui = {
	identify: (e) => e instanceof Date,
	default: !0,
	tag: "tag:yaml.org,2002:timestamp",
	test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
	resolve(e) {
		let t = e.match(Ui.test);
		if (!t) throw Error("!!timestamp expects a date, starting with yyyy-mm-dd");
		let [, n, r, i, a, o, s] = t.map(Number), c = t[7] ? Number((t[7] + "00").substr(1, 3)) : 0, l = Date.UTC(n, r - 1, i, a || 0, o || 0, s || 0, c), u = t[8];
		if (u && u !== "Z") {
			let e = zi(u, !1);
			Math.abs(e) < 30 && (e *= 60), l -= 6e4 * e;
		}
		return new Date(l);
	},
	stringify: ({ value: e }) => e?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
}, Wi = [
	Xr,
	$r,
	ei,
	ti,
	Ti,
	Ei,
	Ni,
	Pi,
	Fi,
	Ii,
	Di,
	Oi,
	ki,
	vi,
	Ir,
	Ci,
	xi,
	Ri,
	Vi,
	Hi,
	Ui
], Gi = /* @__PURE__ */ new Map([
	["core", pi],
	["failsafe", [
		Xr,
		$r,
		ei
	]],
	["json", _i],
	["yaml11", Wi],
	["yaml-1.1", Wi]
]), Ki = {
	binary: vi,
	bool: ni,
	float: oi,
	floatExp: ai,
	floatNaN: ii,
	floatTime: Hi,
	int: di,
	intHex: fi,
	intOct: ui,
	intTime: Vi,
	map: Xr,
	merge: Ir,
	null: ti,
	omap: Ci,
	pairs: xi,
	seq: $r,
	set: Ri,
	timestamp: Ui
}, qi = {
	"tag:yaml.org,2002:binary": vi,
	"tag:yaml.org,2002:merge": Ir,
	"tag:yaml.org,2002:omap": Ci,
	"tag:yaml.org,2002:pairs": xi,
	"tag:yaml.org,2002:set": Ri,
	"tag:yaml.org,2002:timestamp": Ui
};
function Ji(e, t, n) {
	let r = Gi.get(t);
	if (r && !e) return n && !r.includes(Ir) ? r.concat(Ir) : r.slice();
	let i = r;
	if (!i) {
		if (Array.isArray(e)) i = [];
		else {
			let e = Array.from(Gi.keys()).filter((e) => e !== "yaml11").map((e) => JSON.stringify(e)).join(", ");
			throw Error(`Unknown schema "${t}"; use one of ${e} or define customTags array`);
		}
	}
	if (Array.isArray(e)) for (let t of e) i = i.concat(t);
	else typeof e == "function" && (i = e(i.slice()));
	return n && (i = i.concat(Ir)), i.reduce((e, t) => {
		let n = typeof t == "string" ? Ki[t] : t;
		if (!n) {
			let e = JSON.stringify(t), n = Object.keys(Ki).map((e) => JSON.stringify(e)).join(", ");
			throw Error(`Unknown custom tag ${e}; use one of ${n}`);
		}
		return e.includes(n) || e.push(n), e;
	}, []);
}
//#endregion
//#region node_modules/yaml/browser/dist/schema/Schema.js
var Yi = (e, t) => e.key < t.key ? -1 : +(e.key > t.key), Xi = class e {
	constructor({ compat: e, customTags: t, merge: n, resolveKnownTags: r, schema: i, sortMapEntries: a, toStringDefaults: o }) {
		this.compat = Array.isArray(e) ? Ji(e, "compat") : e ? Ji(null, e) : null, this.name = typeof i == "string" && i || "core", this.knownTags = r ? qi : {}, this.tags = Ji(t, this.name, n), this.toStringOptions = o ?? null, Object.defineProperty(this, kn, { value: Xr }), Object.defineProperty(this, jn, { value: ei }), Object.defineProperty(this, Mn, { value: $r }), this.sortMapEntries = typeof a == "function" ? a : a === !0 ? Yi : null;
	}
	clone() {
		let t = Object.create(e.prototype, Object.getOwnPropertyDescriptors(this));
		return t.tags = this.tags.slice(), t;
	}
};
//#endregion
//#region node_modules/yaml/browser/dist/stringify/stringifyDocument.js
function Zi(e, t) {
	let n = [], r = t.directives === !0;
	if (t.directives !== !1 && e.directives) {
		let t = e.directives.toString(e);
		t ? (n.push(t), r = !0) : e.directives.docStart && (r = !0);
	}
	r && n.push("---");
	let i = kr(e, t), { commentString: a } = i.options;
	if (e.commentBefore) {
		n.length !== 1 && n.unshift("");
		let t = a(e.commentBefore);
		n.unshift(fr(t, ""));
	}
	let o = !1, s = null;
	if (e.contents) {
		if (j(e.contents)) {
			if (e.contents.spaceBefore && r && n.push(""), e.contents.commentBefore) {
				let t = a(e.contents.commentBefore);
				n.push(fr(t, ""));
			}
			i.forceBlockIndent = !!e.comment, s = e.contents.comment;
		}
		let t = s ? void 0 : () => o = !0, c = Mr(e.contents, i, () => s = null, t);
		s && (c += pr(c, "", a(s))), (c[0] === "|" || c[0] === ">") && n[n.length - 1] === "---" ? n[n.length - 1] = `--- ${c}` : n.push(c);
	} else n.push(Mr(e.contents, i));
	if (e.directives?.docEnd) {
		if (e.comment) {
			let t = a(e.comment);
			t.includes("\n") ? (n.push("..."), n.push(fr(t, ""))) : n.push(`... ${t}`);
		} else n.push("...");
	} else {
		let t = e.comment;
		t && o && (t = t.replace(/^\n+/, "")), t && ((!o || s) && n[n.length - 1] !== "" && n.push(""), n.push(fr(a(t), "")));
	}
	return n.join("\n") + "\n";
}
//#endregion
//#region node_modules/yaml/browser/dist/doc/Document.js
var Qi = class e {
	constructor(e, t, n) {
		this.commentBefore = null, this.comment = null, this.errors = [], this.warnings = [], Object.defineProperty(this, Nn, { value: On });
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
		n?._directives ? (this.directives = n._directives.atDocument(), this.directives.yaml.explicit && (a = this.directives.yaml.version)) : this.directives = new Yn({ version: a }), this.setSchema(a, n), this.contents = e === void 0 ? null : this.createNode(e, r, n);
	}
	clone() {
		let t = Object.create(e.prototype, { [Nn]: { value: On } });
		return t.commentBefore = this.commentBefore, t.comment = this.comment, t.errors = this.errors.slice(), t.warnings = this.warnings.slice(), t.options = Object.assign({}, this.options), this.directives && (t.directives = this.directives.clone()), t.schema = this.schema.clone(), t.contents = j(this.contents) ? this.contents.clone(t.schema) : this.contents, this.range && (t.range = this.range.slice()), t;
	}
	add(e) {
		$i(this.contents) && this.contents.add(e);
	}
	addIn(e, t) {
		$i(this.contents) && this.contents.addIn(e, t);
	}
	createAlias(e, t) {
		if (!e.anchor) {
			let n = Zn(this);
			e.anchor = !t || n.has(t) ? Qn(t || "a", n) : t;
		}
		return new nr(e.anchor);
	}
	createNode(e, t, n) {
		let r;
		if (typeof t == "function") e = t.call({ "": e }, "", e), r = t;
		else if (Array.isArray(t)) {
			let e = t.filter((e) => typeof e == "number" || e instanceof String || e instanceof Number).map(String);
			e.length > 0 && (t = t.concat(e)), r = t;
		} else n === void 0 && t && (n = t, t = void 0);
		let { aliasDuplicateObjects: i, anchorPrefix: a, flow: o, keepUndefined: s, onTagObj: c, tag: l } = n ?? {}, { onAnchor: u, setAnchors: d, sourceObjects: f } = $n(this, a || "a"), p = {
			aliasDuplicateObjects: i ?? !0,
			keepUndefined: s ?? !1,
			onAnchor: u,
			onTagObj: c,
			replacer: r,
			schema: this.schema,
			sourceObjects: f
		}, m = sr(e, l, p);
		return o && A(m) && (m.flow = !0), d(), m;
	}
	createPair(e, t, n = {}) {
		return new P(this.createNode(e, null, n), this.createNode(t, null, n));
	}
	delete(e) {
		return $i(this.contents) ? this.contents.delete(e) : !1;
	}
	deleteIn(e) {
		return lr(e) ? this.contents != null && (this.contents = null, !0) : $i(this.contents) ? this.contents.deleteIn(e) : !1;
	}
	get(e, t) {
		return A(this.contents) ? this.contents.get(e, t) : void 0;
	}
	getIn(e, t) {
		return lr(e) ? !t && k(this.contents) ? this.contents.value : this.contents : A(this.contents) ? this.contents.getIn(e, t) : void 0;
	}
	has(e) {
		return A(this.contents) ? this.contents.has(e) : !1;
	}
	hasIn(e) {
		return lr(e) ? this.contents !== void 0 : A(this.contents) ? this.contents.hasIn(e) : !1;
	}
	set(e, t) {
		this.contents == null ? this.contents = cr(this.schema, [e], t) : $i(this.contents) && this.contents.set(e, t);
	}
	setIn(e, t) {
		lr(e) ? this.contents = t : this.contents == null ? this.contents = cr(this.schema, Array.from(e), t) : $i(this.contents) && this.contents.setIn(e, t);
	}
	setSchema(e, t = {}) {
		typeof e == "number" && (e = String(e));
		let n;
		switch (e) {
			case "1.1":
				this.directives ? this.directives.yaml.version = "1.1" : this.directives = new Yn({ version: "1.1" }), n = {
					resolveKnownTags: !1,
					schema: "yaml-1.1"
				};
				break;
			case "1.2":
			case "next":
				this.directives ? this.directives.yaml.version = e : this.directives = new Yn({ version: e }), n = {
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
		else if (n) this.schema = new Xi(Object.assign(n, t));
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
		}, s = M(this.contents, t ?? "", o);
		if (typeof i == "function") for (let { count: e, res: t } of o.anchors.values()) i(t, e);
		return typeof a == "function" ? er(a, { "": s }, "", s) : s;
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
		return Zi(this, e);
	}
};
function $i(e) {
	if (A(e)) return !0;
	throw Error("Expected a YAML collection as document contents");
}
//#endregion
//#region node_modules/yaml/browser/dist/errors.js
var ea = class extends Error {
	constructor(e, t, n, r) {
		super(), this.name = e, this.code = n, this.message = r, this.pos = t;
	}
}, ta = class extends ea {
	constructor(e, t, n) {
		super("YAMLParseError", e, t, n);
	}
}, na = class extends ea {
	constructor(e, t, n) {
		super("YAMLWarning", e, t, n);
	}
}, ra = (e, t) => (n) => {
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
function ia(e, { flow: t, indicator: n, next: r, offset: i, onError: a, parentIndent: o, startOnNewline: s }) {
	let c = !1, l = s, u = s, d = "", f = "", p = !1, m = !1, h = null, g = null, _ = null, v = null, y = null, ee = null, b = null;
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
			l ? d ? d += i.source : (!ee || n !== "seq-item-ind") && (c = !0) : f += i.source, l = !0, p = !0, (g || _) && (v = i), u = !0;
			break;
		case "anchor":
			g && a(i, "MULTIPLE_ANCHORS", "A node can have at most one anchor"), i.source.endsWith(":") && a(i.offset + i.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", !0), g = i, b ??= i.offset, l = !1, u = !1, m = !0;
			break;
		case "tag":
			_ && a(i, "MULTIPLE_TAGS", "A node can have at most one tag"), _ = i, b ??= i.offset, l = !1, u = !1, m = !0;
			break;
		case n:
			(g || _) && a(i, "BAD_PROP_ORDER", `Anchors and tags must be after the ${i.source} indicator`), ee && a(i, "UNEXPECTED_TOKEN", `Unexpected ${i.source} in ${t ?? "collection"}`), ee = i, l = n === "seq-item-ind" || n === "explicit-key-ind", u = !1;
			break;
		case "comma": if (t) {
			y && a(i, "UNEXPECTED_TOKEN", `Unexpected , in ${t}`), y = i, l = !1, u = !1;
			break;
		}
		default: a(i, "UNEXPECTED_TOKEN", `Unexpected ${i.type} token`), l = !1, u = !1;
	}
	let x = e[e.length - 1], te = x ? x.offset + x.source.length : i;
	return m && r && r.type !== "space" && r.type !== "newline" && r.type !== "comma" && (r.type !== "scalar" || r.source !== "") && a(r.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space"), h && (l && h.indent <= o || r?.type === "block-map" || r?.type === "block-seq") && a(h, "TAB_AS_INDENT", "Tabs are not allowed as indentation"), {
		comma: y,
		found: ee,
		spaceBefore: c,
		comment: d,
		hasNewline: p,
		anchor: g,
		tag: _,
		newlineAfterProp: v,
		end: te,
		start: b ?? te
	};
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-contains-newline.js
function aa(e) {
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
				if (aa(t.key) || aa(t.value)) return !0;
			}
			return !1;
		default: return !0;
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-flow-indent-check.js
function oa(e, t, n) {
	if (t?.type === "flow-collection") {
		let r = t.end[0];
		r.indent === e && (r.source === "]" || r.source === "}") && aa(t) && n(r, "BAD_INDENT", "Flow end indicator should be more indented than parent", !0);
	}
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-map-includes.js
function sa(e, t, n) {
	let { uniqueKeys: r } = e.options;
	if (r === !1) return !1;
	let i = typeof r == "function" ? r : (e, t) => e === t || k(e) && k(t) && e.value === t.value;
	return t.some((e) => i(e.key, n));
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-block-map.js
var ca = "All mapping items must start at the same column";
function la({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = new ((a?.nodeClass) ?? Yr)(n.schema);
	n.atRoot &&= !1;
	let s = r.offset, c = null;
	for (let a of r.items) {
		let { start: l, key: u, sep: d, value: f } = a, p = ia(l, {
			indicator: "explicit-key-ind",
			next: u ?? d?.[0],
			offset: s,
			onError: i,
			parentIndent: r.indent,
			startOnNewline: !0
		}), m = !p.found;
		if (m) {
			if (u && (u.type === "block-seq" ? i(s, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key") : "indent" in u && u.indent !== r.indent && i(s, "BAD_INDENT", ca)), !p.anchor && !p.tag && !d) {
				c = p.end, p.comment && (o.comment ? o.comment += "\n" + p.comment : o.comment = p.comment);
				continue;
			}
			(p.newlineAfterProp || aa(u)) && i(u ?? l[l.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
		} else p.found?.indent !== r.indent && i(s, "BAD_INDENT", ca);
		n.atKey = !0;
		let h = p.end, g = u ? e(n, u, p, i) : t(n, h, l, null, p, i);
		n.schema.compat && oa(r.indent, u, i), n.atKey = !1, sa(n, o.items, g) && i(h, "DUPLICATE_KEY", "Map keys must be unique");
		let _ = ia(d ?? [], {
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
			n.schema.compat && oa(r.indent, f, i), s = c.range[2];
			let l = new P(g, c);
			n.options.keepSourceTokens && (l.srcToken = a), o.items.push(l);
		} else {
			m && i(g.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values"), _.comment && (g.comment ? g.comment += "\n" + _.comment : g.comment = _.comment);
			let e = new P(g);
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
function ua({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = new ((a?.nodeClass) ?? Zr)(n.schema);
	n.atRoot &&= !1, n.atKey &&= !1;
	let s = r.offset, c = null;
	for (let { start: a, value: l } of r.items) {
		let u = ia(a, {
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
		n.schema.compat && oa(r.indent, l, i), s = d.range[2], o.items.push(d);
	}
	return o.range = [
		r.offset,
		s,
		c ?? s
	], o;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-end.js
function da(e, t, n, r) {
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
var fa = "Block collections are not allowed within flow collections", pa = (e) => e && (e.type === "block-map" || e.type === "block-seq");
function ma({ composeNode: e, composeEmptyNode: t }, n, r, i, a) {
	let o = r.start.source === "{", s = o ? "flow map" : "flow sequence", c = new ((a?.nodeClass) ?? (o ? Yr : Zr))(n.schema);
	c.flow = !0;
	let l = n.atRoot;
	l && (n.atRoot = !1), n.atKey &&= !1;
	let u = r.offset + r.start.source.length;
	for (let a = 0; a < r.items.length; ++a) {
		let l = r.items[a], { start: d, key: f, sep: p, value: m } = l, h = ia(d, {
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
			!o && n.options.strict && aa(f) && i(f, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
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
				O(t) && (t = t.value ?? t.key), t.comment ? t.comment += "\n" + e : t.comment = e, h.comment = h.comment.substring(e.length + 1);
			}
		}
		if (!o && !p && !h.found) {
			let r = m ? e(n, m, h, i) : t(n, h.end, p, null, h, i);
			c.items.push(r), u = r.range[2], pa(m) && i(r.range, "BLOCK_IN_FLOW", fa);
		} else {
			n.atKey = !0;
			let a = h.end, g = f ? e(n, f, h, i) : t(n, a, d, null, h, i);
			pa(f) && i(g.range, "BLOCK_IN_FLOW", fa), n.atKey = !1;
			let _ = ia(p ?? [], {
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
			v ? pa(m) && i(v.range, "BLOCK_IN_FLOW", fa) : _.comment && (g.comment ? g.comment += "\n" + _.comment : g.comment = _.comment);
			let y = new P(g, v);
			if (n.options.keepSourceTokens && (y.srcToken = l), o) {
				let e = c;
				sa(n, e.items, g) && i(a, "DUPLICATE_KEY", "Map keys must be unique"), e.items.push(y);
			} else {
				let e = new Yr(n.schema);
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
		let e = da(p, m, n.options.strict, i);
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
function ha(e, t, n, r, i, a) {
	let o = n.type === "block-map" ? la(e, t, n, r, a) : n.type === "block-seq" ? ua(e, t, n, r, a) : ma(e, t, n, r, a), s = o.constructor;
	return i === "!" || i === s.tagName ? (o.tag = s.tagName, o) : (i && (o.tag = i), o);
}
function ga(e, t, n, r, i) {
	let a = r.tag, o = a ? t.directives.tagName(a.source, (e) => i(a, "TAG_RESOLVE_FAILED", e)) : null;
	if (n.type === "block-seq") {
		let { anchor: e, newlineAfterProp: t } = r, n = e && a ? e.offset > a.offset ? e : a : e ?? a;
		n && (!t || t.offset < n.offset) && i(n, "MISSING_CHAR", "Missing newline after block sequence props");
	}
	let s = n.type === "block-map" ? "map" : n.type === "block-seq" ? "seq" : n.start.source === "{" ? "map" : "seq";
	if (!a || !o || o === "!" || o === Yr.tagName && s === "map" || o === Zr.tagName && s === "seq") return ha(e, t, n, i, o);
	let c = t.schema.tags.find((e) => e.tag === o && e.collection === s);
	if (!c) {
		let r = t.schema.knownTags[o];
		if (r?.collection === s) t.schema.tags.push(Object.assign({}, r, { default: !1 })), c = r;
		else return r ? i(a, "BAD_COLLECTION_TYPE", `${r.tag} used for ${s} collection, but expects ${r.collection ?? "scalar"}`, !0) : i(a, "TAG_RESOLVE_FAILED", `Unresolved tag: ${o}`, !0), ha(e, t, n, i, o);
	}
	let l = ha(e, t, n, i, o, c), u = c.resolve?.(l, (e) => i(a, "TAG_RESOLVE_FAILED", e), t.options) ?? l, d = j(u) ? u : new N(u);
	return d.range = l.range, d.tag = o, c?.format && (d.format = c.format), d;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-block-scalar.js
function _a(e, t, n) {
	let r = t.offset, i = va(t, e.options.strict, n);
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
	let a = i.mode === ">" ? N.BLOCK_FOLDED : N.BLOCK_LITERAL, o = t.source ? ya(t.source) : [], s = o.length;
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
		a === N.BLOCK_LITERAL ? (d += f + t.slice(c) + r, f = "\n") : t.length > c || r[0] === "	" ? (f === " " ? f = "\n" : !p && f === "\n" && (f = "\n\n"), d += f + t.slice(c) + r, f = "\n", p = !0) : r === "" ? f === "\n" ? d += "\n" : f = "\n" : (d += f + r, f = " ", p = !1);
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
function va({ offset: e, props: t }, n, r) {
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
function ya(e) {
	let t = e.split(/\n( *)/), n = t[0], r = n.match(/^( *)/), i = [r?.[1] ? [r[1], n.slice(r[1].length)] : ["", n]];
	for (let e = 1; e < t.length; e += 2) i.push([t[e], t[e + 1]]);
	return i;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/resolve-flow-scalar.js
function ba(e, t, n) {
	let { offset: r, type: i, source: a, end: o } = e, s, c, l = (e, t, i) => n(r + e, t, i);
	switch (i) {
		case "scalar":
			s = N.PLAIN, c = xa(a, l);
			break;
		case "single-quoted-scalar":
			s = N.QUOTE_SINGLE, c = Sa(a, l);
			break;
		case "double-quoted-scalar":
			s = N.QUOTE_DOUBLE, c = wa(a, l);
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
	let u = r + a.length, d = da(o, u, t, n);
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
function xa(e, t) {
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
	return n && t(0, "BAD_SCALAR_START", `Plain value cannot start with ${n}`), Ca(e);
}
function Sa(e, t) {
	return (e[e.length - 1] !== "'" || e.length === 1) && t(e.length, "MISSING_CHAR", "Missing closing 'quote"), Ca(e.slice(1, -1)).replace(/''/g, "'");
}
function Ca(e) {
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
function wa(e, t) {
	let n = "";
	for (let r = 1; r < e.length - 1; ++r) {
		let i = e[r];
		if (i !== "\r" || e[r + 1] !== "\n") {
			if (i === "\n") {
				let { fold: t, offset: i } = Ta(e, r);
				n += t, r = i;
			} else if (i === "\\") {
				let i = e[++r], a = Ea[i];
				if (a) n += a;
				else if (i === "\n") for (i = e[r + 1]; i === " " || i === "	";) i = e[++r + 1];
				else if (i === "\r" && e[r + 1] === "\n") for (i = e[++r + 1]; i === " " || i === "	";) i = e[++r + 1];
				else if (i === "x" || i === "u" || i === "U") {
					let a = i === "x" ? 2 : i === "u" ? 4 : 8;
					n += Da(e, r + 1, a, t), r += a;
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
function Ta(e, t) {
	let n = "", r = e[t + 1];
	for (; (r === " " || r === "	" || r === "\n" || r === "\r") && (r !== "\r" || e[t + 2] === "\n");) r === "\n" && (n += "\n"), t += 1, r = e[t + 1];
	return n ||= " ", {
		fold: n,
		offset: t
	};
}
var Ea = {
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
function Da(e, t, n, r) {
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
function Oa(e, t, n, r) {
	let { value: i, type: a, comment: o, range: s } = t.type === "block-scalar" ? _a(e, t, r) : ba(t, e.options.strict, r), c = n ? e.directives.tagName(n.source, (e) => r(n, "TAG_RESOLVE_FAILED", e)) : null, l;
	l = e.options.stringKeys && e.atKey ? e.schema[jn] : c ? ka(e.schema, i, c, n, r) : t.type === "scalar" ? Aa(e, i, t, r) : e.schema[jn];
	let u;
	try {
		let a = l.resolve(i, (e) => r(n ?? t, "TAG_RESOLVE_FAILED", e), e.options);
		u = k(a) ? a : new N(a);
	} catch (e) {
		let a = e instanceof Error ? e.message : String(e);
		r(n ?? t, "TAG_RESOLVE_FAILED", a), u = new N(i);
	}
	return u.range = s, u.source = i, a && (u.type = a), c && (u.tag = c), l.format && (u.format = l.format), o && (u.comment = o), u;
}
function ka(e, t, n, r, i) {
	if (n === "!") return e[jn];
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
	})), o) : (i(r, "TAG_RESOLVE_FAILED", `Unresolved tag: ${n}`, n !== "tag:yaml.org,2002:str"), e[jn]);
}
function Aa({ atKey: e, directives: t, schema: n }, r, i, a) {
	let o = n.tags.find((t) => (t.default === !0 || e && t.default === "key") && t.test?.test(r)) || n[jn];
	if (n.compat) {
		let e = n.compat.find((e) => e.default && e.test?.test(r)) ?? n[jn];
		o.tag !== e.tag && a(i, "TAG_RESOLVE_FAILED", `Value may be parsed as either ${t.tagString(o.tag)} or ${t.tagString(e.tag)}`, !0);
	}
	return o;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/util-empty-scalar-position.js
function ja(e, t, n) {
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
var Ma = {
	composeNode: Na,
	composeEmptyNode: Pa
};
function Na(e, t, n, r) {
	let i = e.atKey, { spaceBefore: a, comment: o, anchor: s, tag: c } = n, l, u = !0;
	switch (t.type) {
		case "alias":
			l = Fa(e, t, r), (s || c) && r(t, "ALIAS_PROPS", "An alias node must not specify any properties");
			break;
		case "scalar":
		case "single-quoted-scalar":
		case "double-quoted-scalar":
		case "block-scalar":
			l = Oa(e, t, c, r), s && (l.anchor = s.source.substring(1));
			break;
		case "block-map":
		case "block-seq":
		case "flow-collection":
			try {
				l = ga(Ma, e, t, n, r), s && (l.anchor = s.source.substring(1));
			} catch (e) {
				r(t, "RESOURCE_EXHAUSTION", e instanceof Error ? e.message : String(e));
			}
			break;
		default: r(t, "UNEXPECTED_TOKEN", t.type === "error" ? t.message : `Unsupported token (type: ${t.type})`), u = !1;
	}
	return l ??= Pa(e, t.offset, void 0, null, n, r), s && l.anchor === "" && r(s, "BAD_ALIAS", "Anchor cannot be an empty string"), i && e.options.stringKeys && (!k(l) || typeof l.value != "string" || l.tag && l.tag !== "tag:yaml.org,2002:str") && r(c ?? t, "NON_STRING_KEY", "With stringKeys, all keys must be strings"), a && (l.spaceBefore = !0), o && (t.type === "scalar" && t.source === "" ? l.comment = o : l.commentBefore = o), e.options.keepSourceTokens && u && (l.srcToken = t), l;
}
function Pa(e, t, n, r, { spaceBefore: i, comment: a, anchor: o, tag: s, end: c }, l) {
	let u = Oa(e, {
		type: "scalar",
		offset: ja(t, n, r),
		indent: -1,
		source: ""
	}, s, l);
	return o && (u.anchor = o.source.substring(1), u.anchor === "" && l(o, "BAD_ALIAS", "Anchor cannot be an empty string")), i && (u.spaceBefore = !0), a && (u.comment = a, u.range[2] = c), u;
}
function Fa({ options: e }, { offset: t, source: n, end: r }, i) {
	let a = new nr(n.substring(1));
	a.source === "" && i(t, "BAD_ALIAS", "Alias cannot be an empty string"), a.source.endsWith(":") && i(t + n.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", !0);
	let o = t + n.length, s = da(r, o, e.strict, i);
	return a.range = [
		t,
		o,
		s.offset
	], s.comment && (a.comment = s.comment), a;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/compose-doc.js
function Ia(e, t, { offset: n, start: r, value: i, end: a }, o) {
	let s = new Qi(void 0, Object.assign({ _directives: t }, e)), c = {
		atKey: !1,
		atRoot: !0,
		directives: s.directives,
		options: s.options,
		schema: s.schema
	}, l = ia(r, {
		indicator: "doc-start",
		next: i ?? a?.[0],
		offset: n,
		onError: o,
		parentIndent: 0,
		startOnNewline: !0
	});
	l.found && (s.directives.docStart = !0, i && (i.type === "block-map" || i.type === "block-seq") && !l.hasNewline && o(l.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker")), s.contents = i ? Na(c, i, l, o) : Pa(c, l.end, r, null, l, o);
	let u = s.contents.range[2], d = da(a, u, !1, o);
	return d.comment && (s.comment = d.comment), s.range = [
		n,
		u,
		d.offset
	], s;
}
//#endregion
//#region node_modules/yaml/browser/dist/compose/composer.js
function La(e) {
	if (typeof e == "number") return [e, e + 1];
	if (Array.isArray(e)) return e.length === 2 ? e : [e[0], e[1]];
	let { offset: t, source: n } = e;
	return [t, t + (typeof n == "string" ? n.length : 1)];
}
function Ra(e) {
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
var za = class {
	constructor(e = {}) {
		this.doc = null, this.atDirectives = !1, this.prelude = [], this.errors = [], this.warnings = [], this.onError = (e, t, n, r) => {
			let i = La(e);
			r ? this.warnings.push(new na(i, t, n)) : this.errors.push(new ta(i, t, n));
		}, this.directives = new Yn({ version: e.version || "1.2" }), this.options = e;
	}
	decorate(e, t) {
		let { comment: n, afterEmptyLine: r } = Ra(this.prelude);
		if (n) {
			let i = e.contents;
			if (t) e.comment = e.comment ? `${e.comment}\n${n}` : n;
			else if (r || e.directives.docStart || !i) e.commentBefore = n;
			else if (A(i) && !i.flow && i.items.length > 0) {
				let e = i.items[0];
				O(e) && (e = e.key);
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
			comment: Ra(this.prelude).comment,
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
					let i = La(e);
					i[0] += t, this.onError(i, "BAD_DIRECTIVE", n, r);
				}), this.prelude.push(e.source), this.atDirectives = !0;
				break;
			case "document": {
				let t = Ia(this.options, this.directives, e, this.onError);
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
				let t = e.source ? `${e.message}: ${JSON.stringify(e.source)}` : e.message, n = new ta(La(e), "UNEXPECTED_TOKEN", t);
				this.atDirectives || !this.doc ? this.errors.push(n) : this.doc.errors.push(n);
				break;
			}
			case "doc-end": {
				if (!this.doc) {
					this.errors.push(new ta(La(e), "UNEXPECTED_TOKEN", "Unexpected doc-end without preceding document"));
					break;
				}
				this.doc.directives.docEnd = !0;
				let t = da(e.end, e.offset + e.source.length, this.doc.options.strict, this.onError);
				if (this.decorate(this.doc, !0), t.comment) {
					let e = this.doc.comment;
					this.doc.comment = e ? `${e}\n${t.comment}` : t.comment;
				}
				this.doc.range[2] = t.offset;
				break;
			}
			default: this.errors.push(new ta(La(e), "UNEXPECTED_TOKEN", `Unsupported token ${e.type}`));
		}
	}
	*end(e = !1, t = -1) {
		if (this.doc) this.decorate(this.doc, !0), yield this.doc, this.doc = null;
		else if (e) {
			let e = new Qi(void 0, Object.assign({ _directives: this.directives }, this.options));
			this.atDirectives && this.onError(t, "MISSING_CHAR", "Missing directives-end indicator line"), e.range = [
				0,
				t,
				t
			], this.decorate(e, !1), yield e;
		}
	}
}, Ba = Symbol("break visit"), Va = Symbol("skip children"), Ha = Symbol("remove item");
function Ua(e, t) {
	"type" in e && e.type === "document" && (e = {
		start: e.start,
		value: e.value
	}), Wa(Object.freeze([]), e, t);
}
Ua.BREAK = Ba, Ua.SKIP = Va, Ua.REMOVE = Ha, Ua.itemAtPath = (e, t) => {
	let n = e;
	for (let [e, r] of t) {
		let t = n?.[e];
		if (t && "items" in t) n = t.items[r];
		else return;
	}
	return n;
}, Ua.parentCollection = (e, t) => {
	let n = Ua.itemAtPath(e, t.slice(0, -1)), r = t[t.length - 1][0], i = n?.[r];
	if (i && "items" in i) return i;
	throw Error("Parent collection not found");
};
function Wa(e, t, n) {
	let r = n(t, e);
	if (typeof r == "symbol") return r;
	for (let i of ["key", "value"]) {
		let a = t[i];
		if (a && "items" in a) {
			for (let t = 0; t < a.items.length; ++t) {
				let r = Wa(Object.freeze(e.concat([[i, t]])), a.items[t], n);
				if (typeof r == "number") t = r - 1;
				else if (r === Ba) return Ba;
				else r === Ha && (a.items.splice(t, 1), --t);
			}
			typeof r == "function" && i === "key" && (r = r(t, e));
		}
	}
	return typeof r == "function" ? r(t, e) : r;
}
function Ga(e) {
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
function Ka(e) {
	switch (e) {
		case void 0:
		case " ":
		case "\n":
		case "\r":
		case "	": return !0;
		default: return !1;
	}
}
var qa = /* @__PURE__ */ new Set("0123456789ABCDEFabcdef"), Ja = /* @__PURE__ */ new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"), Ya = /* @__PURE__ */ new Set(",[]{}"), Xa = /* @__PURE__ */ new Set(" ,[]{}\n\r	"), Za = (e) => !e || Xa.has(e), Qa = class {
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
			if ((t === "---" || t === "...") && Ka(this.buffer[e + 3])) return -1;
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
			if ((e === "---" || e === "...") && Ka(this.charAt(3))) return yield* this.pushCount(3), this.indentValue = 0, this.indentNext = 0, e === "---" ? "doc" : "stream";
		}
		return this.indentValue = yield* this.pushSpaces(!1), this.indentNext > this.indentValue && !Ka(this.charAt(1)) && (this.indentNext = this.indentValue), yield* this.parseBlockStart();
	}
	*parseBlockStart() {
		let [e, t] = this.peek(2);
		if (!t && !this.atEnd) return this.setNext("block-start");
		if ((e === "-" || e === "?" || e === ":") && Ka(t)) {
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
			case "*": return yield* this.pushUntil(Za), "doc";
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
		if ((n !== -1 && n < this.indentNext && r[0] !== "#" || n === 0 && (r.startsWith("---") || r.startsWith("...")) && Ka(r[3])) && (n !== this.indentNext - 1 || this.flowLevel !== 1 || r[0] !== "]" && r[0] !== "}")) return this.flowLevel = 0, yield "", yield* this.parseLineStart();
		let i = 0;
		for (; r[i] === ",";) i += yield* this.pushCount(1), i += yield* this.pushSpaces(!0), this.flowKey = !1;
		switch (i += yield* this.pushIndicators(), r[i]) {
			case void 0: return "flow";
			case "#": return yield* this.pushCount(r.length - i), "flow";
			case "{":
			case "[": return yield* this.pushCount(1), this.flowKey = !1, this.flowLevel += 1, "flow";
			case "}":
			case "]": return yield* this.pushCount(1), this.flowKey = !0, --this.flowLevel, this.flowLevel ? "flow" : "doc";
			case "*": return yield* this.pushUntil(Za), "flow";
			case "\"":
			case "'": return this.flowKey = !0, yield* this.parseQuotedScalar();
			case ":": {
				let e = this.charAt(1);
				if (this.flowKey || Ka(e) || e === ",") return this.flowKey = !1, yield* this.pushCount(1), yield* this.pushSpaces(!0), "flow";
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
		return yield* this.pushUntil((e) => Ka(e) || e === "#");
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
			if (Ka(r) || e && Ya.has(r)) break;
			t = n;
		} else if (Ka(r)) {
			let i = this.buffer[n + 1];
			if (r === "\r" && (i === "\n" ? (n += 1, r = "\n", i = this.buffer[n + 1]) : t = n), i === "#" || e && Ya.has(i)) break;
			if (r === "\n") {
				let e = this.continueScalar(n + 1);
				if (e === -1) break;
				n = Math.max(n, e - 2);
			}
		} else {
			if (e && Ya.has(r)) break;
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
					e += yield* this.pushUntil(Za), e += yield* this.pushSpaces(!0);
					continue loop;
				case "-":
				case "?":
				case ":": {
					let t = this.flowLevel > 0, n = this.charAt(1);
					if (Ka(n) || t && Ya.has(n)) {
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
			for (; !Ka(t) && t !== ">";) t = this.buffer[++e];
			return yield* this.pushToIndex(t === ">" ? e + 1 : e, !1);
		}
		{
			let e = this.pos + 1, t = this.buffer[e];
			for (; t;) if (Ja.has(t)) t = this.buffer[++e];
			else if (t === "%" && qa.has(this.buffer[e + 1]) && qa.has(this.buffer[e + 2])) t = this.buffer[e += 3];
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
}, $a = class {
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
function eo(e, t) {
	for (let n = 0; n < e.length; ++n) if (e[n].type === t) return !0;
	return !1;
}
function to(e) {
	for (let t = 0; t < e.length; ++t) switch (e[t].type) {
		case "space":
		case "comment":
		case "newline": break;
		default: return t;
	}
	return -1;
}
function no(e) {
	switch (e?.type) {
		case "alias":
		case "scalar":
		case "single-quoted-scalar":
		case "double-quoted-scalar":
		case "flow-collection": return !0;
		default: return !1;
	}
}
function ro(e) {
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
function io(e) {
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
function ao(e, t) {
	if (t.length < 1e5) Array.prototype.push.apply(e, t);
	else for (let n = 0; n < t.length; ++n) e.push(t[n]);
}
function oo(e) {
	if (e.start.type === "flow-seq-start") for (let t of e.items) t.sep && !t.value && !eo(t.start, "explicit-key-ind") && !eo(t.sep, "map-value-ind") && (t.key && (t.value = t.key), delete t.key, no(t.value) ? t.value.end ? ao(t.value.end, t.sep) : t.value.end = t.sep : ao(t.start, t.sep), delete t.sep);
}
var so = class {
	constructor(e) {
		this.atNewLine = !0, this.atScalar = !1, this.indent = 0, this.offset = 0, this.onKeyLine = !1, this.stack = [], this.source = "", this.type = "", this.lexer = new Qa(), this.onNewLine = e;
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
		let t = Ga(e);
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
			switch (t.type === "block-scalar" ? t.indent = "indent" in e ? e.indent : 0 : t.type === "flow-collection" && e.type === "document" && (t.indent = 0), t.type === "flow-collection" && oo(t), e.type) {
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
				n && !n.sep && !n.value && n.start.length > 0 && to(n.start) === -1 && (t.indent === 0 || n.start.every((e) => e.type !== "comment" || e.indent < t.indent)) && (e.type === "document" ? e.end = n.start : e.items.push({ start: n.start }), t.items.splice(-1, 1));
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
				to(e.start) === -1 ? e.start.push(this.sourceToken) : (yield* this.pop(), yield* this.step());
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
			let t = io(ro(this.peek(2))), n;
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
							ao(n, t.start), n.push(this.sourceToken), e.items.pop();
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
							if (eo(t.start, "newline")) Object.assign(t, {
								key: null,
								sep: [this.sourceToken]
							});
							else {
								let e = io(t.start);
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
						else if (eo(t.sep, "map-value-ind")) this.stack.push({
							type: "block-map",
							offset: this.offset,
							indent: this.indent,
							items: [{
								start: i,
								key: null,
								sep: [this.sourceToken]
							}]
						});
						else if (no(t.key) && !eo(t.sep, "newline")) {
							let e = io(t.start), n = t.key, r = t.sep;
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
					}) : eo(t.sep, "map-value-ind") ? this.stack.push({
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
							if (!t.explicitKey && t.sep && !eo(t.sep, "newline")) {
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
							ao(n, t.start), n.push(this.sourceToken), e.items.pop();
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
				t.value || eo(t.start, "seq-item-ind") ? e.items.push({ start: [this.sourceToken] }) : t.start.push(this.sourceToken);
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
				let n = io(ro(t));
				oo(e);
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
				let t = io(ro(e));
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
				let t = io(ro(e));
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
function co(e) {
	let t = e.prettyErrors !== !1;
	return {
		lineCounter: e.lineCounter || t && new $a() || null,
		prettyErrors: t
	};
}
function lo(e, t = {}) {
	let { lineCounter: n, prettyErrors: r } = co(t), i = new so(n?.addNewLine), a = new za(t), o = null;
	for (let t of a.compose(i.parse(e), !0, e.length)) if (!o) o = t;
	else if (o.options.logLevel !== "silent") {
		o.errors.push(new ta(t.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
		break;
	}
	return r && n && (o.errors.forEach(ra(e, n)), o.warnings.forEach(ra(e, n))), o;
}
function uo(e, t, n) {
	let r;
	typeof t == "function" ? r = t : n === void 0 && t && typeof t == "object" && (n = t);
	let i = lo(e, n);
	if (!i) return null;
	if (i.warnings.forEach((e) => Pr(i.options.logLevel, e)), i.errors.length > 0) {
		if (i.options.logLevel !== "silent") throw i.errors[0];
		i.errors = [];
	}
	return i.toJS(Object.assign({ reviver: r }, n));
}
//#endregion
//#region src/palettes.ts
var fo = Object.values(/* @__PURE__ */ Object.assign({ "../../custom_components/opendisplay_studio/palettes.json": En })).map((e) => uo(String(e)))[0], po = Object.keys(fo), mo = t.palettes, ho = Object.fromEntries(po.map((e) => [e, fo[e].colors.map((e) => e.value)])), go = Object.fromEntries(po.map((e) => [e, fo[e].colors])), _o = "accent", vo = (e) => {
	for (let t of po) {
		let n = fo[t].colors.find((t) => t.value === e || t.id === e);
		if (n) return n.hex;
	}
	return e.startsWith("#") ? e : void 0;
}, yo = (e, t) => {
	let n = e === _o ? fo[t].accent : e;
	return fo[t].colors.find((e) => e.value === n || e.id === n)?.hex;
}, bo = (e) => {
	if (e === _o) return t.colors.accent;
	let n = /^gray(\d+)$/.exec(e);
	return n ? t.colors.gray(Number(n[1])) : t.colors.names[e] ?? e;
}, F = (e, t, n, r, i = !1) => ({
	id: `solum-${e}`,
	manufacturer: "SOLUM",
	name: `Newton Pro ${t}`,
	width: n,
	height: r,
	palettes: i ? ["bw"] : ["bw", "bwry"],
	defaultPalette: i ? "bw" : "bwry"
}), xo = [
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
	F("1-6-v", "1.6″ V", 200, 200),
	F("1-6-h", "1.6″ H", 200, 200),
	F("2-2", "2.2″", 296, 160),
	F("2-2-freezer", "2.2″ Freezer", 296, 160, !0),
	F("2-6", "2.6″", 360, 184),
	F("2-6-freezer", "2.6″ Freezer", 360, 184, !0),
	F("2-7", "2.7″", 300, 200),
	F("2-9", "2.9″", 384, 168),
	F("2-9-freezer", "2.9″ Freezer", 384, 168, !0),
	F("3-45", "3.5″ · 3.45 panel", 480, 224),
	F("3-52", "3.5″ · 3.52 panel", 384, 180),
	F("4-2", "4.2″", 400, 300),
	F("4-3", "4.3″", 522, 152),
	F("4-5", "4.5″", 480, 176),
	F("5-8", "5.8″", 792, 272),
	F("6-1", "6.1″", 648, 480),
	F("7-5", "7.5″", 800, 480),
	F("9-7", "9.7″", 672, 960),
	F("11-6", "11.6″", 640, 960),
	F("12-2", "12.2″", 768, 960),
	{
		id: "custom",
		...t.customDisplay,
		width: 800,
		height: 480,
		palettes: po,
		defaultPalette: "bw"
	}
], So = (e) => xo.find((t) => t.id === e) ?? xo[0], Co = (e) => e in mo, wo = Symbol("unchanged"), To = "transparent", Eo = /^\s*(-?\d+)\s*[,;\s]\s*(-?\d+)\s*$/, Do = (e) => typeof e == "object" && !!e && Object.keys(e).length === 0, Oo = {
	flags: {
		toForm: (e) => typeof e == "string" && e !== "" ? e.split(",") : [],
		fromForm: (e) => Array.isArray(e) && e.length > 0 ? e.join(",") : null
	},
	points: {
		toForm: (e) => Array.isArray(e) ? e.map((e) => String(e).replace(",", ", ")).join("\n") : "",
		fromForm: (e) => {
			if (typeof e != "string") return wo;
			let t = e.split("\n").filter((e) => e.trim() !== ""), n = [];
			for (let e of t) {
				let t = Eo.exec(e);
				if (!t) return wo;
				n.push([Number(t[1]), Number(t[2])]);
			}
			return n;
		}
	},
	icons: {
		toForm: (e) => Array.isArray(e) ? e.join("\n") : "",
		fromForm: (e) => typeof e == "string" ? e.split("\n").map((e) => e.trim()).filter((e) => e !== "") : wo
	},
	object: {
		toForm: (e) => e ?? {},
		fromForm: (e) => Do(e) ? null : e
	}
}, ko = (e) => e === void 0 || e === "" || Number.isNaN(e), Ao = (e, t) => {
	if (e.nullable && e.shape === "color" && t === null) return To;
	if (!(t === null && e.optional && !Oo[e.shape])) return Oo[e.shape]?.toForm(t) ?? t;
}, jo = (e, t) => {
	if (e.nullable && e.shape === "color" && t === To) return null;
	let n = Oo[e.shape];
	return n ? n.fromForm(t) : e.optional && ko(t) ? null : t;
}, Mo = {
	grid: [],
	extra: []
}, No = "transparent", Po = (e, t) => t.find((t) => t.type === e.primitive.type), I = (e, t, n, r, i, a = !1) => ({
	label: e,
	key: t,
	value: n,
	min: r,
	max: i,
	stored: a
}), Fo = (e, n) => {
	let { width: r, height: i } = n.display, a = t.fields;
	return {
		grid: [
			I(a.x, "x", e.frame.x, 0, r),
			I(a.y, "y", e.frame.y, 0, i),
			I(a.width, "width", e.frame.width, 1, r),
			I(a.height, "height", e.frame.height, 1, i)
		],
		extra: [I(a.innerPadding, "padding", e.layout.padding, 0, 128)]
	};
}, Io = (e, n) => {
	let { width: r, height: i } = n.display, a = t.fields;
	return {
		grid: [
			I(a.x, "x", e.x, -r, r),
			I(a.y, "y", e.y, -i, i),
			I(a.width, "width", e.width, 1, r),
			I(a.height, "height", e.height, 1, i)
		],
		extra: []
	};
}, Lo = (e, n) => {
	let r = e.primitive;
	if (!le(r)) return Mo;
	let { width: i, height: a } = n.display, o = t.fields, s = je(r);
	return {
		grid: [
			I(o.x, "x", s.x, 0, i),
			I(o.y, "y", s.y, 0, a),
			I(o.width, "width", s.width, 1, i),
			I(o.height, "height", s.height, 1, a)
		],
		extra: []
	};
}, Ro = (e, t, n) => {
	let r = n.display, i = e.axis === "x" ? r.width : r.height, a = e.shape === "coordinate";
	return I(e.label, e.key, Number(t[e.key]), a ? 0 : Ze(e.min, r, 0), a ? i : Ze(e.max, r, i), !0);
}, zo = (e) => e.shape === "coordinate" || e.shape === "number", Bo = (e, t, n) => {
	let r = { ...e.primitive };
	return {
		grid: t.fields.filter((e) => e.section === "layout" && zo(e)).map((e) => Ro(e, r, n)),
		extra: []
	};
}, Vo = (e) => e.geometry === "box" || e.geometry === "line", Ho = (e, t) => {
	if (e.kind !== "primitive") return !1;
	let n = Po(e, t);
	return n !== void 0 && Vo(n);
}, Uo = (e, t, n, r = !1) => {
	if (e.kind === "widget") return Fo(e, t);
	if (e.kind === "container") return Io(e, t);
	let i = Po(e, n);
	return i ? Vo(i) && !r ? Lo(e, t) : Bo(e, i, t) : Mo;
}, Wo = (e, t) => Object.fromEntries((e.nested ?? []).map((e) => [e.key, {
	label: e.label,
	selector: Go(e, t)
}])), Go = (e, t) => {
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
		case "color": return { select: { options: e.nullable ? [No, ...t] : t } };
		case "number": return { number: {
			min: typeof e.min == "number" ? e.min : void 0,
			max: typeof e.max == "number" ? e.max : void 0,
			step: e.decimal ? "any" : void 0,
			mode: e.decimal ? "box" : void 0
		} };
		case "entity": return { entity: {} };
		case "points":
		case "icons": return { text: { multiline: !0 } };
		case "object": return { object: { fields: Wo(e, t) } };
		case "objects": return { object: {
			multiple: !0,
			label_field: e.nested?.[0]?.key,
			fields: Wo(e, t)
		} };
		default: return { text: {} };
	}
}, Ko = (e, t) => ({
	name: e.key,
	label: e.label,
	selector: Go(e, [...ho[t], "accent"])
}), qo = (e, t, n) => (Po(e, t)?.fields ?? []).filter((e) => e.visible !== !1 && e.section === n && (n === "appearance" || !zo(e))), Jo = (e, t) => {
	let n = { ...e };
	for (let e of t?.fields ?? []) {
		if (!(e.key in n)) continue;
		let t = jo(e, n[e.key]);
		t === wo ? delete n[e.key] : n[e.key] = t;
	}
	return n;
}, Yo = {
	position: [],
	handles: [],
	scalingBlockedBy: []
}, Xo = (e, t, n) => {
	let r = e.primitive;
	if (!le(r)) return t;
	let i = t === "x" ? r.x_start > r.x_end : r.y_start > r.y_end;
	return `${t}_${(n === "start" ? !i : i) ? "start" : "end"}`;
}, Zo = (e, t) => [
	...t.includes("w") ? [Xo(e, "x", "start")] : [],
	...t.includes("e") ? [Xo(e, "x", "end")] : [],
	...t.includes("n") ? [Xo(e, "y", "start")] : [],
	...t.includes("s") ? [Xo(e, "y", "end")] : []
], Qo = (e) => e.geometry === "box" || e.geometry === "line", $o = (e, t) => {
	let n = new Set(Object.keys(e.expressions ?? {}));
	n.delete(xn);
	let r = t.fields.filter((e) => e.section === "layout" && n.has(e.key)), i = t.fields.filter((e) => e.shape === "points" && n.has(e.key)), a = [...r.filter((e) => e.shape === "coordinate"), ...i].map((e) => e.key);
	return Qo(t) ? {
		position: a,
		handles: y.filter((t) => Zo(e, t).some((e) => n.has(e))),
		scalingBlockedBy: []
	} : {
		position: a,
		handles: r.some((e) => e.shape !== "coordinate") || i.length > 0 ? [...y] : [],
		scalingBlockedBy: []
	};
}, es = (e, t) => {
	let n = ns(e, t);
	return n.position.length > 0 || n.handles.length > 0;
}, ts = (e, t) => {
	let n = D(e.children).filter((e) => !w(e) && es(e, t));
	return {
		position: [],
		handles: n.length > 0 ? [...y] : [],
		scalingBlockedBy: n.map((e) => e.name)
	};
}, ns = (e, t) => {
	if (e.kind === "container") return e.grouped ? ts(e, t) : Yo;
	if (e.kind !== "primitive") return Yo;
	let n = Po(e, t);
	return n ? $o(e, n) : Yo;
}, rs = .25, is = .95, as = 32, os = 1.2, ss = {
	zoom: 1,
	panX: 0,
	panY: 0
}, cs = (e, t) => ({
	...e,
	zoom: _(t, rs, 5)
}), ls = (e, t, n) => {
	let r = _(e.zoom * t, rs, 5), i = r / e.zoom;
	return {
		zoom: r,
		panX: n.x - i * (n.x - e.panX),
		panY: n.y - i * (n.y - e.panY)
	};
}, us = (e, t) => ls(e, t === 1 ? os : 1 / os, {
	x: 0,
	y: 0
}), ds = (e, t, n) => ({
	...e,
	panX: e.panX + t,
	panY: e.panY + n
}), fs = (e, t) => ({
	zoom: _(is * Math.min((e.width - as) / t.width, (e.height - as) / t.height), rs, 5),
	panX: 0,
	panY: 0
}), ps = (e, t) => Math.abs(e.zoom - t.zoom) < .005 && Math.abs(e.panX - t.panX) < 1 && Math.abs(e.panY - t.panY) < 1, ms = (e, t, n) => {
	let r = fs(t, n);
	return ps(e, r) ? ss : r;
}, hs = 16, gs = 800, _s = (e, t) => t === 1 ? e * hs : t === 2 ? e * gs : e, vs = .0032, ys = 120, bs = 1.2, xs = (e) => Math.exp(-e * vs * (1 + Math.min(bs, Math.abs(e) / ys))), Ss = (e, t, n, r = !0) => {
	let i = _s(t.deltaY, t.deltaMode ?? 0);
	return t.ctrlKey || t.metaKey || !r ? ls(e, xs(i), n) : ds(e, -_s(t.deltaX, t.deltaMode ?? 0), -i);
}, Cs = "opendisplay_color", ws = "accent", Ts = (e, t) => Cs in e ? { select: { options: [...ho[t], ws] } } : e, Es = (e) => typeof e == "object" && !!e, Ds = (e) => {
	let t = Array.isArray(e.options) ? e.options : [], n = {};
	return {
		options: t.flatMap((e) => typeof e == "string" ? [e] : !Es(e) || typeof e.value != "string" ? [] : (typeof e.label == "string" && (n[e.value] = e.label), [e.value])),
		labels: n
	};
}, Os = (e) => typeof e == "number" ? e : void 0, ks = (e) => {
	let t = {
		key: e.key,
		label: e.label,
		section: "appearance",
		default: e.default
	}, { selector: n } = e;
	if ("boolean" in n) return {
		...t,
		shape: "boolean"
	};
	if (Cs in n) return {
		...t,
		shape: "color"
	};
	let r = n.number;
	if (Es(r)) return {
		...t,
		shape: "number",
		min: Os(r.min),
		max: Os(r.max),
		unit: typeof r.unit_of_measurement == "string" ? r.unit_of_measurement : void 0
	};
	let i = n.select;
	if (Es(i) && i.multiple !== !0) {
		let { options: e, labels: n } = Ds(i);
		return {
			...t,
			shape: "enum",
			options: e,
			optionLabels: n
		};
	}
	let a = n.text;
	if (Es(a)) return {
		...t,
		shape: a.multiline === !0 ? "text" : "string"
	};
}, As = (e) => typeof e == "string" || typeof e == "number" || typeof e == "boolean" || Array.isArray(e) && e.every((e) => typeof e == "string"), js = (e) => e.default === void 0 ? "boolean" in e.selector ? !1 : "number" in e.selector ? 0 : "" : e.default, Ms = (e) => Object.fromEntries(e.options.flatMap((e) => e.fields).map((e) => [e.key, js(e)])), Ns = (e, t) => {
	let n = new Set(t.options.flatMap((e) => e.fields.map((e) => e.key)));
	return Object.fromEntries(Object.entries(e).filter((e) => n.has(e[0]) && As(e[1])));
}, Ps = (e) => Object.values(e.selector).some((e) => typeof e == "object" && !!e && "multiple" in e), Fs = (e, t) => {
	let n = t.map((e) => e.id);
	return Ps(e) ? n : n[0] ?? "";
}, Is = (e, t) => (Array.isArray(t) ? t : [t]).filter((e) => typeof e == "string" && e !== "").map((t) => e.find((e) => e.id === t) ?? { id: t }), Ls = (e, t, n, r) => {
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
}, Rs = 6e4, zs = (e) => e.split(".", 1)[0] ?? "", Bs = (e, t) => [.../* @__PURE__ */ new Set([...Object.keys(e), ...Object.keys(t)])].filter((n) => e[n] !== t[n]), Vs = (e, t, n) => {
	if (!t || !n || t === n) return !1;
	let r = Bs(t, n);
	return e.allStates ? r.length > 0 : r.some((t) => e.entities.includes(t) || e.domains.includes(zs(t)));
}, Hs = globalThis, Us = Hs.ShadowRoot && (Hs.ShadyCSS === void 0 || Hs.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ws = Symbol(), Gs = /* @__PURE__ */ new WeakMap(), Ks = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== Ws) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (Us && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = Gs.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && Gs.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, qs = (e) => new Ks(typeof e == "string" ? e : e + "", void 0, Ws), L = (e, ...t) => new Ks(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, Ws), Js = (e, t) => {
	if (Us) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = Hs.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, Ys = Us ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return qs(t);
})(e) : e, { is: Xs, defineProperty: Zs, getOwnPropertyDescriptor: Qs, getOwnPropertyNames: $s, getOwnPropertySymbols: ec, getPrototypeOf: tc } = Object, nc = globalThis, rc = nc.trustedTypes, ic = rc ? rc.emptyScript : "", ac = nc.reactiveElementPolyfillSupport, oc = (e, t) => e, sc = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ic : null;
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
}, cc = (e, t) => !Xs(e, t), lc = {
	attribute: !0,
	type: String,
	converter: sc,
	reflect: !1,
	useDefault: !1,
	hasChanged: cc
};
Symbol.metadata ??= Symbol("metadata"), nc.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var uc = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = lc) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && Zs(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = Qs(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? lc;
	}
	static _$Ei() {
		if (this.hasOwnProperty(oc("elementProperties"))) return;
		let e = tc(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(oc("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(oc("properties"))) {
			let e = this.properties, t = [...$s(e), ...ec(e)];
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
			for (let e of n) t.unshift(Ys(e));
		} else e !== void 0 && t.push(Ys(e));
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
		return Js(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? sc : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? sc : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? cc)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
uc.elementStyles = [], uc.shadowRootOptions = { mode: "open" }, uc[oc("elementProperties")] = /* @__PURE__ */ new Map(), uc[oc("finalized")] = /* @__PURE__ */ new Map(), ac?.({ ReactiveElement: uc }), (nc.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var dc = globalThis, fc = (e) => e, pc = dc.trustedTypes, mc = pc ? pc.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, hc = "$lit$", gc = `lit$${Math.random().toFixed(9).slice(2)}$`, _c = "?" + gc, vc = `<${_c}>`, yc = document, bc = () => yc.createComment(""), xc = (e) => e === null || typeof e != "object" && typeof e != "function", Sc = Array.isArray, Cc = (e) => Sc(e) || typeof e?.[Symbol.iterator] == "function", wc = "[ 	\n\f\r]", Tc = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ec = /-->/g, Dc = />/g, Oc = RegExp(`>|${wc}(?:([^\\s"'>=/]+)(${wc}*=${wc}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), kc = /'/g, Ac = /"/g, jc = /^(?:script|style|textarea|title)$/i, R = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), Mc = Symbol.for("lit-noChange"), z = Symbol.for("lit-nothing"), Nc = /* @__PURE__ */ new WeakMap(), Pc = yc.createTreeWalker(yc, 129);
function Fc(e, t) {
	if (!Sc(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return mc === void 0 ? t : mc.createHTML(t);
}
var Ic = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Tc;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === Tc ? c[1] === "!--" ? o = Ec : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = Oc) : (jc.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = Oc) : o = Dc : o === Oc ? c[0] === ">" ? (o = i ?? Tc, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? Oc : c[3] === "\"" ? Ac : kc) : o === Ac || o === kc ? o = Oc : o === Ec || o === Dc ? o = Tc : (o = Oc, i = void 0);
		let d = o === Oc && e[t + 1].startsWith("/>") ? " " : "";
		a += o === Tc ? n + vc : l >= 0 ? (r.push(s), n.slice(0, l) + hc + n.slice(l) + gc + d) : n + gc + (l === -2 ? t : d);
	}
	return [Fc(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, Lc = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ic(t, n);
		if (this.el = e.createElement(l, r), Pc.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = Pc.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(hc)) {
					let t = u[o++], n = i.getAttribute(e).split(gc), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Hc : r[1] === "?" ? Uc : r[1] === "@" ? Wc : Vc
					}), i.removeAttribute(e);
				} else e.startsWith(gc) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (jc.test(i.tagName)) {
					let e = i.textContent.split(gc), t = e.length - 1;
					if (t > 0) {
						i.textContent = pc ? pc.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], bc()), Pc.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], bc());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === _c) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(gc, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += gc.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = yc.createElement("template");
		return n.innerHTML = e, n;
	}
};
function Rc(e, t, n = e, r) {
	if (t === Mc) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = xc(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = Rc(e, i._$AS(e, t.values), i, r)), t;
}
var zc = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? yc).importNode(t, !0);
		Pc.currentNode = r;
		let i = Pc.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new Bc(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Gc(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = Pc.nextNode(), a++);
		}
		return Pc.currentNode = yc, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, Bc = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = z, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = Rc(this, e, t), xc(e) ? e === z || e == null || e === "" ? (this._$AH !== z && this._$AR(), this._$AH = z) : e !== this._$AH && e !== Mc && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? Cc(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== z && xc(this._$AH) ? this._$AA.nextSibling.data = e : this.T(yc.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = Lc.createElement(Fc(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new zc(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = Nc.get(e.strings);
		return t === void 0 && Nc.set(e.strings, t = new Lc(e)), t;
	}
	k(t) {
		Sc(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(bc()), this.O(bc()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = fc(e).nextSibling;
			fc(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Vc = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = z, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = z;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = Rc(this, e, t, 0), a = !xc(e) || e !== this._$AH && e !== Mc, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = Rc(this, r[n + o], t, o), s === Mc && (s = this._$AH[o]), a ||= !xc(s) || s !== this._$AH[o], s === z ? e = z : e !== z && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === z ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Hc = class extends Vc {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === z ? void 0 : e;
	}
}, Uc = class extends Vc {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== z);
	}
}, Wc = class extends Vc {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = Rc(this, e, t, 0) ?? z) === Mc) return;
		let n = this._$AH, r = e === z && n !== z || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== z && (n === z || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Gc = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		Rc(this, e);
	}
}, Kc = dc.litHtmlPolyfillSupport;
Kc?.(Lc, Bc), (dc.litHtmlVersions ??= []).push("3.3.3");
var qc = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new Bc(t.insertBefore(bc(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Jc = globalThis, B = class extends uc {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = qc(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return Mc;
	}
};
B._$litElement$ = !0, B.finalized = !0, Jc.litElementHydrateSupport?.({ LitElement: B });
var Yc = Jc.litElementPolyfillSupport;
Yc?.({ LitElement: B }), (Jc.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var V = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, Xc = {
	attribute: !0,
	type: String,
	converter: sc,
	reflect: !1,
	hasChanged: cc
}, Zc = (e = Xc, t, n) => {
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
function H(e) {
	return (t, n) => typeof n == "object" ? Zc(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function U(e) {
	return H({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/base.js
var Qc = (e, t, n) => (n.configurable = !0, n.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(e, t, n), n);
//#endregion
//#region node_modules/@lit/reactive-element/decorators/query.js
function $c(e, t) {
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
			return Qc(n, r, { get() {
				let n = e.call(this);
				return n === void 0 && (n = a(this), (n !== null || this.hasUpdated) && t.call(this, n)), n;
			} });
		}
		return Qc(n, r, { get() {
			return a(this);
		} });
	};
}
//#endregion
//#region node_modules/lit-html/directive.js
var el = {
	ATTRIBUTE: 1,
	CHILD: 2,
	PROPERTY: 3,
	BOOLEAN_ATTRIBUTE: 4,
	EVENT: 5,
	ELEMENT: 6
}, tl = (e) => (...t) => ({
	_$litDirective$: e,
	values: t
}), nl = class {
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
}, rl = "important", il = " !" + rl, W = tl(class extends nl {
	constructor(e) {
		if (super(e), e.type !== el.ATTRIBUTE || e.name !== "style" || e.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
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
				let t = typeof r == "string" && r.endsWith(il);
				e.includes("-") || t ? n.setProperty(e, t ? r.slice(0, -11) : r, t ? rl : "") : n[e] = r;
			}
		}
		return Mc;
	}
}), al = (e, t, n, r, i, a) => {
	let o = e.primitive, s = a?.fields.find((e) => e.key === t);
	if (s?.shape === "coordinate") {
		let i = S(e), a = { ...o }, c = Number(Reflect.get(a, t)), l = s.axis === "x", u = (l ? i.x : i.y) - c, [d, f] = ft(l ? r.x : r.y, l ? r.width : r.height, l ? i.width : i.height);
		Object.assign(o, { [t]: _(n, d - u, f - u) });
		return;
	}
	if (s?.shape === "number" && s.section === "layout") {
		let e = Ze(s.min, i, n), r = Ze(s.max, i, n);
		Object.assign(o, { [t]: _(n, e, r) });
	}
}, ol = (e, t, n, r) => {
	t === "x" && (e.x = _(n, ...ft(r.x, r.width, e.width))), t === "y" && (e.y = _(n, ...ft(r.y, r.height, e.height))), t === "width" && (e.width = _(n, 1, Math.max(1, r.x + r.width - e.x))), t === "height" && (e.height = _(n, 1, Math.max(1, r.y + r.height - e.y)));
}, sl = (e, t, n, r) => {
	if (t === "x") {
		let t = e.x_end - e.x_start;
		e.x_start = _(n, ...ft(r.x, r.width, t + 1)), e.x_end = e.x_start + t;
	}
	if (t === "y") {
		let t = e.y_end - e.y_start;
		e.y_start = _(n, ...ft(r.y, r.height, t + 1)), e.y_end = e.y_start + t;
	}
	t === "width" && (e.x_end = _(e.x_start + Math.max(1, n) - 1, e.x_start + 1, Math.max(e.x_start + 1, r.x + r.width - 1))), t === "height" && (e.y_end = _(e.y_start + Math.max(1, n) - 1, e.y_start + 1, Math.max(e.y_start + 1, r.y + r.height - 1)));
}, cl = (e, t, n, r, i) => {
	let a = lt(r);
	if (e.kind === "widget") {
		t === "padding" && (e.layout.padding = _(n, 0, 128)), ol(e.frame, t, n, a);
		return;
	}
	if (e.kind === "container") {
		let o = {
			width: e.width,
			height: e.height
		};
		ol(e, t, n, a), e.grouped && ct(e, e.width / Math.max(1, o.width), e.height / Math.max(1, o.height), i, r.display);
		return;
	}
	let o = e.primitive;
	le(o) ? sl(o, t, n, a) : al(e, t, n, a, r.display, Po(e, i));
}, ll = (e, t, n, r, i) => {
	let a = T(e.items, t);
	if (!a || a.item.locked) return;
	let { item: o, offset: s } = a;
	C(o, s.x, s.y), cl(o, n, ul(n, r, s), e, i), C(o, -s.x, -s.y);
}, ul = (e, t, n) => e === "x" ? t + n.x : e === "y" ? t + n.y : t, dl = (e) => e.items.forEach((t) => dt(t, e)), fl = (e, t, n) => {
	t === "padding" && (e.display.padding = _(n, 0, Math.floor((Math.min(e.display.width, e.display.height) - 1) / 2))), t === "snapSize" && (e.display.snapSize = _(n, 1, 256)), dl(e);
}, pl = (e, t, n) => {
	let r = E(e.items, t);
	r && (r[n] = !r[n]);
}, ml = (e, t) => {
	At(e, t);
}, hl = (e, t, n, r) => {
	if (r === "inside") {
		kt(e, t, n || void 0, C);
		return;
	}
	Pt(e, t, n, r, C);
}, gl = (e, t, n) => {
	let r = E(e.items, t), i = n.trim();
	r && i && (r.name = i.slice(0, 100));
}, _l = (e, t, n) => {
	let r = E(e.items, t);
	r?.kind === "widget" && (r.widget.options = {
		...r.widget.options,
		...n
	});
}, vl = (e, t, n, r) => {
	let i = E(e.items, t);
	i?.kind === "widget" && (i.widget.sources = {
		...i.widget.sources,
		[n]: r
	});
}, yl = (e, t, n, r, i) => {
	let a = T(e.items, t);
	if (a?.item.kind !== "primitive" || a.item.locked) return;
	let o = a.item, s = ["x", "y"].some((e) => o.expressions?.[e]);
	if (n === "anchor" && typeof r == "string" && !s) {
		Me(o.primitive, r, i);
		return;
	}
	o.primitive = {
		...o.primitive,
		[n]: r
	};
}, bl = (e, t, n) => {
	let r = E(e.items, t);
	if (!(r?.kind !== "primitive" || r.locked) && (r.primitive = {
		...r.primitive,
		...n
	}, r.expressions)) {
		for (let e of Object.keys(n)) delete r.expressions[e];
		Object.keys(r.expressions).length === 0 && delete r.expressions;
	}
}, xl = (e, t, n, r) => {
	let i = E(e.items, t);
	if (i?.kind !== "primitive") return;
	let a = Jo(n, Po(i, r));
	i.primitive = {
		...i.primitive,
		...a
	};
}, Sl = (e, t, n, r) => {
	let i = lt(r), a = Math.min(e.layout.defaultSize?.width ?? 240, i.width), o = Math.min(e.layout.defaultSize?.height ?? 144, i.height);
	return {
		id: g(),
		name: m(D(r.items), e.id),
		kind: "widget",
		locked: !1,
		hidden: !1,
		widget: {
			type: e.id,
			version: e.version,
			sources: Object.fromEntries(e.sources.map((e) => [e.key, []])),
			options: Ms(e)
		},
		frame: {
			x: _(Math.round(t - a / 2), i.x, i.x + i.width - a),
			y: _(Math.round(n - o / 2), i.y, i.y + i.height - o),
			width: a,
			height: o
		},
		layout: { padding: 0 }
	};
}, Cl = (e, t, n, r, i) => {
	let { width: a, height: o } = i.display, s = tt(e.find((e) => e.type === t.trim()), {
		x: Math.round(a / 2),
		y: Math.round(o / 2),
		displayWidth: a,
		displayHeight: o
	});
	if (!s) return;
	let c = {
		id: g(),
		name: m(D(i.items), s.type),
		kind: "primitive",
		locked: !1,
		hidden: !1,
		primitive: s
	}, l = S(c);
	return C(c, Math.round(n - (l.x + l.width / 2)), Math.round(r - (l.y + l.height / 2))), dt(c, i), c;
}, wl = (e, t) => {
	let n = lt(e), r = D(e.items).length * Math.max(e.display.snapSize, 5) * 3 % Math.max(1, Math.min(n.width, n.height) / 3);
	return {
		x: ut(n.x + Math.min(24 + r, Math.max(0, n.width - 1)), e, t),
		y: ut(n.y + Math.min(24 + r, Math.max(0, n.height - 1)), e, t)
	};
}, Tl = (e, t) => {
	if (t === "visible") return !e.hidden;
	if (e.kind === "primitive") return Object.entries(e.primitive).find(([e]) => e === t)?.[1];
}, El = (e, t, n, r) => {
	let i = E(e.items, t);
	if (!i || i.locked) return;
	let a = { ...i.expressions };
	r === null ? delete a[n] : a[n] = r ?? Tn(Tl(i, n)), Object.keys(a).length === 0 ? delete i.expressions : i.expressions = a;
}, Dl = (e) => ({
	canUndo: !1,
	canRedo: !1,
	item: e,
	targets: [e],
	canGroup: e.kind === "container" && !e.grouped,
	canUngroup: e.kind === "container" && e.grouped,
	canEnter: e.kind === "container" && e.grouped
}), Ol = (e) => e.targets ?? (e.item ? [e.item] : []), kl = (e) => Ol(e).length > 0, Al = (e, t) => {
	let n = Ol(e).map((e) => e.id);
	n.length > 0 && t(n);
}, jl = {
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
}, Ml = [
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
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.requestDelete(e))
	},
	{
		id: "toggle-hidden",
		group: "edit",
		label: ({ item: e }) => e?.hidden ? t.commands.show : t.commands.hide,
		icon: ({ item: e }) => e?.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline",
		shortcuts: [],
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.toggleFlag(e, "hidden"))
	},
	{
		id: "toggle-locked",
		group: "edit",
		label: ({ item: e }) => e?.locked ? t.commands.unlock : t.commands.lock,
		icon: ({ item: e }) => e?.locked ? "mdi:lock" : "mdi:lock-open-variant-outline",
		shortcuts: [],
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.toggleFlag(e, "locked"))
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
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.copy(e))
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
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.cut(e))
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
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.duplicate(e))
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
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.arrange(e, "front"))
	},
	{
		id: "send-to-back",
		group: "arrange",
		label: () => t.commands.sendToBack,
		icon: () => "mdi:arrange-send-to-back",
		shortcuts: [],
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.arrange(e, "back"))
	},
	{
		id: "move-up",
		group: "arrange",
		label: () => t.commands.moveUp,
		icon: () => "mdi:arrow-up",
		shortcuts: [],
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.arrange(e, "up"))
	},
	{
		id: "move-down",
		group: "arrange",
		label: () => t.commands.moveDown,
		icon: () => "mdi:arrow-down",
		shortcuts: [],
		isEnabled: kl,
		run: (e, t) => Al(e, (e) => t.arrange(e, "down"))
	},
	...Object.keys(jl).flatMap((e) => [!1, !0].map((n) => ({
		id: n ? `nudge-${e}-snap` : `nudge-${e}`,
		group: "arrange",
		label: () => t.commands.nudge[e],
		icon: () => jl[e].icon,
		shortcuts: [{
			key: jl[e].key,
			shift: n
		}],
		isEnabled: kl,
		isRelevant: () => !1,
		run: (t, r) => Al(t, (t) => r.nudge(t, e, n))
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
		run: (e, t) => Al(e, (e) => t.group(e))
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
		isEnabled: kl,
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
], Nl = (e) => Ml.some((t) => t.id === e), Pl = (e) => {
	let t = Ml.find((t) => t.id === e);
	if (!t) throw Error(`Unknown command ${e}`);
	return t;
}, Fl = (e, t) => {
	let n = t.ctrlKey || t.metaKey;
	return t.key.toLowerCase() === e.key.toLowerCase() && n === !!e.mod && (t.shiftKey === !!e.shift || Il(e)) && !t.altKey;
}, Il = (e) => e.key === "?" || e.key === "+", Ll = (e, t) => {
	let n = Ml.filter((t) => t.shortcuts.some((t) => Fl(t, e)));
	return t ? n.find((e) => e.isEnabled(t)) : n[0];
}, Rl = {
	Delete: "Del",
	Backspace: "⌫",
	Escape: "Esc",
	ArrowLeft: "←",
	ArrowRight: "→",
	ArrowUp: "↑",
	ArrowDown: "↓"
}, zl = (e, t) => {
	let n = Rl[e.key] ?? e.key.toUpperCase();
	return t ? `${e.mod ? "⌘" : ""}${e.shift ? "⇧" : ""}${n}` : [
		e.mod ? "Ctrl" : "",
		e.shift ? "Shift" : "",
		n
	].filter(Boolean).join("+");
}, Bl = (e, t, n = !1) => {
	let r = e.label(t), [i] = e.shortcuts, a = i ? zl(i, n) : "";
	return {
		label: r,
		icon: e.icon(t),
		title: a ? `${r} (${a})` : r,
		shortcut: a,
		enabled: e.isEnabled(t)
	};
}, Vl = [
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
], Hl = [
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
], Ul = [["paste", "paste-here"]], Wl = (e, t, n) => e.flatMap((e, r) => e.map((e) => Pl(e)).filter((e) => e.isRelevant?.(t) ?? !0).map((e, i) => {
	let a = Bl(e, t, n);
	return {
		id: e.id,
		label: a.label,
		icon: a.icon,
		shortcut: a.shortcut,
		disabled: !a.enabled,
		danger: e.id === "delete-item",
		separatorBefore: i === 0 && r > 0
	};
})), Gl = [
	0,
	90,
	180,
	270
], Kl = (e) => Gl.some((t) => t === e), ql = (e) => e === 90 || e === 270, Jl = (e, t) => ql(t) ? {
	width: e.height,
	height: e.width
} : {
	width: e.width,
	height: e.height
}, Yl = (e, t, n) => ql(t) === ql(n) ? e : {
	width: e.height,
	height: e.width
}, Xl = (e, t) => {
	let n = Number(e);
	return Kl(n) ? n : t;
}, Zl = (e, t = "custom") => {
	let n = So(t);
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
}, Ql = (e) => ({
	name: e.name,
	width: e.display.width,
	height: e.display.height,
	palette: e.display.palette,
	background: e.display.background,
	rotation: String(e.display.rotation),
	padding: e.display.padding,
	snapSize: e.display.snapSize
}), $l = (e, t) => {
	let n = structuredClone(e);
	return Object.assign(n.display, t), ho[t.palette].includes(n.display.background) || (n.display.background = "white"), n;
}, eu = (e, t) => $l(e, {
	profileId: "custom",
	deviceId: t.id,
	...Jl(t, e.display.rotation),
	palette: t.palette
}), tu = (e, t, n = t.defaultPalette) => $l(e, {
	profileId: t.id,
	deviceId: null,
	...Jl(t, e.display.rotation),
	palette: t.palettes.includes(n) ? n : t.defaultPalette
}), nu = (e, t) => {
	let n = {
		...Ql(e),
		...t
	}, r = structuredClone(e);
	r.name = String(n.name);
	let i = {
		width: Math.round(Number(n.width) || 0),
		height: Math.round(Number(n.height) || 0)
	}, a = i.width !== e.display.width || i.height !== e.display.height, o = Xl(n.rotation, e.display.rotation), s = a ? i : Yl(i, e.display.rotation, o);
	a && (r.display.profileId = "custom", r.display.deviceId = null), r.display.width = s.width, r.display.height = s.height, r.display.rotation = o, r.display.palette = n.palette in mo ? n.palette : "bw", r.display.padding = Math.round(Number(n.padding) || 0), r.display.snapSize = Math.round(Number(n.snapSize) || 0);
	let c = ho[r.display.palette];
	return r.display.background = c.includes(n.background) ? n.background : "white", r;
}, ru = (e) => {
	let { width: t, height: n, padding: r, snapSize: i } = e.display;
	return !!e.name.trim() && t >= 64 && t <= 4096 && n >= 64 && n <= 4096 && r >= 0 && r * 2 < Math.min(t, n) && i >= 1 && i <= 256;
}, iu = (e, t, n, r) => {
	let i = t.trim().toLocaleLowerCase(r);
	return e.filter((e) => !i || e.name.toLocaleLowerCase(r).includes(i)).sort((e, t) => n === "name" ? e.name.localeCompare(t.name, r) : t.updatedAt.localeCompare(e.updatedAt) || e.name.localeCompare(t.name, r));
}, au = (e, t, n) => {
	let r = new Set(t.map((e) => e.name.toLocaleLowerCase(n))), i = `${e.name} copy`, a = i, o = 2;
	for (; r.has(a.toLocaleLowerCase(n));) a = `${i} ${o++}`;
	return a;
}, ou = Object.keys(mo).filter(Co), su = xo.filter((e) => e.id !== "custom"), cu = {
	size: !0,
	palettes: ou,
	backgrounds: []
}, lu = (e) => ({
	...cu,
	backgrounds: ho[e.display.palette]
}), uu = (e, t) => ({
	name: e,
	label: t,
	required: !0,
	selector: { number: {
		mode: "box",
		min: 64,
		max: 4096,
		unit_of_measurement: "px"
	} }
}), du = () => [{
	name: "dimensions",
	type: "grid",
	flatten: !0,
	schema: [uu("width", t.fields.width), uu("height", t.fields.height)]
}], fu = (e) => [{
	name: "palette",
	label: t.fields.palette,
	required: !0,
	selector: { select: {
		mode: "dropdown",
		options: e.map((e) => ({
			value: e,
			label: mo[e]
		}))
	} }
}], pu = (e) => [{
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
}], mu = () => [{
	name: "rotation",
	label: t.fields.rotation,
	required: !0,
	selector: { select: {
		mode: "dropdown",
		options: Gl.map((e) => ({
			value: String(e),
			label: t.rotations[e]
		}))
	} }
}], hu = () => [{
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
}], gu = (e = cu) => [
	{
		name: "name",
		label: t.fields.name,
		required: !0,
		selector: { text: {} }
	},
	...e.size ? du() : [],
	...e.palettes.length > 1 ? fu(e.palettes) : [],
	...e.backgrounds.length > 0 ? pu(e.backgrounds) : [],
	...mu(),
	...hu()
], _u = (e) => "label" in e ? e.label : e.title ?? "", vu = {
	bwr: "#d32f2f",
	bwry: "#d32f2f",
	bwy: "#d6a800",
	spectra6: "#246bfd",
	seven_color: "#ff8000"
}, yu = (e) => vu[e] ?? "#202124", bu = (e, t) => {
	let n = new Date(e.updatedAt);
	return Number.isNaN(n.getTime()) ? "" : new Intl.DateTimeFormat(t, { dateStyle: "medium" }).format(n);
}, xu = (e) => e.target.value, Su = (e) => e.composedPath().some((e) => e instanceof HTMLElement && (e.matches("input, textarea, select") || e.isContentEditable)), Cu = () => /Mac|iPhone|iPad/.test(navigator.platform), wu = (e, t, n = "application/json") => {
	let r = URL.createObjectURL(new Blob([t], { type: n })), i = document.createElement("a");
	i.href = r, i.download = e, i.click(), URL.revokeObjectURL(r);
}, Tu = (e) => new Promise((t) => {
	let n = document.createElement("input");
	n.type = "file", n.accept = e, n.addEventListener("change", () => t(n.files?.[0])), n.addEventListener("cancel", () => t(void 0)), n.click();
}), Eu = "dashboard", Du = (e) => `${e.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || Eu}.json`, Ou = (e) => Object.fromEntries(e.map((e) => [e.source, e.suggestion])), ku = (e) => {
	try {
		return JSON.parse(e);
	} catch {
		return;
	}
}, Au = (e) => typeof e == "string" && e !== "" ? e : void 0, ju = (e, t) => e instanceof Error || typeof e == "object" && e && "message" in e ? Au(e.message) ?? t : Au(e) ?? t, G = (e, t, ...n) => {
	e.dispatchEvent(new CustomEvent(t, {
		detail: n[0],
		bubbles: !0,
		composed: !0
	}));
}, Mu = 100, Nu = class {
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
		this.undoStack.push(structuredClone(e)), this.undoStack.length > Mu && this.undoStack.shift(), this.redoStack = [];
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
}, Pu = (e, t) => {
	let n = T(e.items, t);
	if (!n) return;
	let { parent: r } = n;
	return r ? {
		x: 0,
		y: 0,
		width: r.width,
		height: r.height
	} : lt(e);
}, Fu = (e, t, n, r) => {
	let i = T(e.items, t), a = Pu(e, t);
	if (!i || !a || i.item.locked) return;
	let o = S(i.item, r), s = se(n, "lt"), c = a.x + (a.width - o.width) * s.x, l = a.y + (a.height - o.height) * s.y;
	C(i.item, Math.round(c - o.x), Math.round(l - o.y));
}, Iu = (e) => e.callWS({
	type: "opendisplay_studio/bootstrap",
	language: e.language
}), Lu = (e) => e.callWS({
	type: "opendisplay_studio/reload_widgets",
	language: e.language
}), Ru = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/create_dashboard",
	dashboard: t
})).dashboard, zu = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/update_dashboard",
	dashboard_id: t.id,
	dashboard: t
})).dashboard, Bu = async (e, t) => {
	await e.callWS({
		type: "opendisplay_studio/delete_dashboard",
		dashboard_id: t
	});
}, Vu = (e, t) => e.callWS({
	type: "opendisplay_studio/compose_preview",
	dashboard: structuredClone(t)
}), Hu = async (e) => (await e.callWS({ type: "opendisplay_studio/list_devices" })).devices, Uu = async (e, t) => {
	await e.callWS({
		type: "opendisplay_studio/send_to_device",
		dashboard: structuredClone(t)
	});
}, Wu = async (e, t) => (await e.callWS({
	type: "opendisplay_studio/export_dashboard",
	dashboard: structuredClone(t)
})).file, Gu = (e, t, n, r = {}) => e.callWS({
	type: "opendisplay_studio/prepare_import",
	file: t,
	display: n,
	colorMap: r
}), Ku, qu = (e) => (Ku ??= e.callWS({ type: "opendisplay_studio/list_icons" }).then((e) => e.icons), Ku), K = L`
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
`, Ju = L`
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
`, Yu = L`
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
`, Xu = L`
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
`, Zu = tl(class extends nl {
	constructor(e) {
		if (super(e), e.type !== el.ATTRIBUTE || e.name !== "class" || e.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
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
		return Mc;
	}
}), Qu = 2, q = (e, t) => t === "x" ? e.x : e.y, J = (e, t) => t === "x" ? e.width : e.height, $u = (e, t) => {
	let n = q(e, t), r = J(e, t);
	return [
		n,
		n + r / 2,
		n + r
	];
}, ed = (e, t, n) => {
	let r = [], i = (t, i, a) => {
		for (let o of $u(t, n)) $u(e, n).forEach((e, t) => {
			let n = Math.abs(o - e);
			n <= i && r.push({
				offset: Math.round(o - e),
				distance: n,
				source: a,
				own: t,
				line: o
			});
		});
	};
	return t.siblings.forEach((e) => i(e, 5, "sibling")), i(t.parent, 8, "parent"), r.push(...nd(e, t.siblings, n)), r.sort(id)[0];
}, td = (e, t, n) => q(e, n) < q(t, n) + J(t, n) && q(t, n) < q(e, n) + J(e, n), nd = (e, t, n) => {
	let r = n === "x" ? "y" : "x", i = t.filter((t) => td(t, e, r)), a = [];
	for (let t of i) for (let r of i) {
		let i = q(r, n) - (q(t, n) + J(t, n)) - J(e, n);
		if (i < 0) continue;
		let o = q(t, n) + J(t, n) + i / 2, s = Math.abs(o - q(e, n));
		s <= 8 && a.push({
			offset: Math.round(o - q(e, n)),
			distance: s,
			source: "spacing"
		});
	}
	return a;
}, rd = (e) => e.distance - (e.source === "parent" ? Qu : 0), id = (e, t) => rd(e) - rd(t) || Number(t.source === "parent") - Number(e.source === "parent"), ad = (e, t, n) => ({
	dx: od(e, t, "x", n),
	dy: od(e, t, "y", n)
}), od = (e, t, n, r) => {
	let i = ed(e, t, n), a = r?.[n];
	if (a) {
		let t = $u(e, n)[a.own], r = Math.abs(a.line - t);
		if (r <= 12 && (!i || i.distance >= r)) return Math.round(a.line - t);
	}
	return r && (i?.source === "parent" && i.own !== void 0 && i.line !== void 0 ? r[n] = {
		own: i.own,
		line: i.line
	} : delete r[n]), i?.offset ?? 0;
}, sd = (e, t, n) => {
	let r = [], i = (t, i, a) => {
		for (let o of $u(t, n)) {
			let t = Math.abs(o - e);
			t <= i && r.push({
				offset: Math.round(o - e),
				distance: t,
				source: a
			});
		}
	};
	return t.siblings.forEach((e) => i(e, 5, "sibling")), i(t.parent, 8, "parent"), r;
}, cd = (e, t, n) => {
	let [r, i] = n === "x" ? ["w", "e"] : ["n", "s"];
	if (t.includes(r)) return q(e, n);
	if (t.includes(i)) return q(e, n) + J(e, n);
}, ld = (e, t, n) => {
	let r = (r) => {
		let i = cd(e, t, r);
		return i === void 0 ? 0 : sd(i, n, r).sort(id)[0]?.offset ?? 0;
	};
	return {
		dx: r("x"),
		dy: r("y")
	};
}, ud = .5, dd = (e, t) => {
	let n = [], r = [...t.siblings, t.parent];
	for (let t of ["x", "y"]) {
		let i = t === "x" ? "y" : "x";
		for (let a of $u(e, t)) {
			let o = r.filter((e) => $u(e, t).some((e) => Math.abs(e - a) <= ud));
			if (o.length === 0) continue;
			let s = [e, ...o].map((e) => [q(e, i), q(e, i) + J(e, i)]);
			n.push({
				axis: t,
				position: a,
				from: Math.min(...s.map(([e]) => e)),
				to: Math.max(...s.map(([, e]) => e))
			});
		}
	}
	return md(n);
}, fd = (e, t, n) => {
	let r = n === "x" ? "y" : "x", i = t.filter((t) => td(t, e, r)), a = (e) => q(e, n) + J(e, n);
	return {
		before: i.filter((t) => a(t) <= q(e, n)).sort((e, t) => a(t) - a(e))[0],
		after: i.filter((t) => q(t, n) >= q(e, n) + J(e, n)).sort((e, t) => q(e, n) - q(t, n))[0]
	};
}, pd = (e, t) => {
	let n = [];
	for (let r of ["x", "y"]) {
		let { before: i, after: a } = fd(e, t, r);
		if (!i || !a) continue;
		let o = q(i, r) + J(i, r), s = q(a, r), c = q(e, r) - o, l = s - (q(e, r) + J(e, r));
		if (Math.abs(c - l) > 3) continue;
		let u = r === "x" ? "y" : "x", d = q(e, u) + J(e, u) / 2;
		n.push({
			axis: r,
			from: o,
			to: q(e, r),
			across: d
		}, {
			axis: r,
			from: q(e, r) + J(e, r),
			to: s,
			across: d
		});
	}
	return n;
}, md = (e) => e.filter((t, n) => e.findIndex((e) => e.axis === t.axis && Math.abs(e.position - t.position) <= ud) === n), hd = (e, t, n) => n?.absolute ? {
	x: n.x,
	y: n.y,
	width: n.width,
	height: n.height
} : Et(S(e, n), t), gd = (e, t, n) => t.flatMap((t) => {
	let r = T(e.items, t);
	return r ? [{
		original: structuredClone(r.item),
		offset: r.offset,
		measured: n(r.item)
	}] : [];
}), _d = (e) => Jt(e.map((e) => Et(S(e.original, e.measured), e.offset))), vd = (e, t, n, r) => Et(S(t, n && e.kind === "primitive" && t.kind === "primitive" ? Ae(e.primitive, t.primitive, n) : n), r), yd = (e, t, n, r, i, a, o) => {
	let s = a.offset ?? {
		x: 0,
		y: 0
	}, c = (r, o, s) => vt(e, {
		mode: "resize",
		handle: t,
		shiftKey: n
	}, r, o, i, {
		...a,
		snapEnabled: s
	}), l = (t) => vd(e, t, a.measured, s), u = c(r.dx, r.dy, a.snapEnabled);
	if (!o || !a.snapEnabled) return {
		item: u,
		guides: []
	};
	let d = l(u), f = ld(d, t, o);
	if (f.dx === 0 && f.dy === 0) return {
		item: u,
		guides: dd(d, o)
	};
	let p = l(e), m = (e) => (cd(d, t, e) ?? 0) - (cd(p, t, e) ?? 0), h = c(m("x") + f.dx, m("y") + f.dy, !1);
	return {
		item: h,
		guides: dd(l(h), o)
	};
}, bd = (e, t, n, r) => {
	let i = T(e.items, n);
	if (!i) return;
	let a = i.parent?.id, o = Ft(e.items).filter((e) => e.parent?.id === a).filter((e) => !e.item.hidden).filter((e) => !t.includes(e.item.id)).flatMap((e) => {
		let t = w(e.item) ? It(e) : Et(S(e.item, r(e.item)), e.offset);
		return t ? [t] : [];
	}), s = i.parent ? xd(e, i.parent.id) : lt(e);
	return s ? {
		siblings: o,
		parent: s
	} : void 0;
}, xd = (e, t) => {
	let n = T(e.items, t);
	return n && w(n.item) ? Et(S(n.item), n.offset) : void 0;
}, Sd = (e, t, n, r, i, a, o, s) => {
	let c = e.find((e) => e.original.id === t);
	if (!c) return [];
	let l = vt(c.original, { mode: "move" }, n, r, i, {
		snapEnabled: a,
		offset: c.offset,
		measured: c.measured
	}), u = S(c.original, c.measured), d = S(l, c.measured), f = d.x - u.x, p = d.y - u.y;
	if (o && a && !c.original.locked) {
		let t = _d(e), i = ad({
			...t,
			x: t.x + n,
			y: t.y + r
		}, o, s);
		i.dx !== 0 && (f = n + i.dx), i.dy !== 0 && (p = r + i.dy);
	}
	return e.map((e) => {
		if (e.original.id === t && f === d.x - u.x && p === d.y - u.y) return l;
		let n = structuredClone(e.original);
		return n.locked || C(n, f, p), n;
	});
}, Cd = (e, t, n) => {
	let r = e.flatMap((e) => {
		let n = t.find((t) => t.id === e.original.id);
		return n ? [Et(S(n, e.measured), e.offset)] : [];
	});
	return r.length > 0 ? dd(Jt(r), n) : [];
}, wd = (e, t, n) => {
	let r = e.flatMap((e) => {
		let n = t.find((t) => t.id === e.original.id);
		return n ? [Et(S(n, e.measured), e.offset)] : [];
	});
	return r.length > 0 ? pd(Jt(r), n.siblings) : [];
}, Td = (e, t, n) => {
	let r = T(e.items, t);
	if (r) return hd(r.item, r.offset, n(r.item));
}, Ed = (e, t, n) => {
	let r = t.flatMap((t) => Td(e, t, n) ?? []);
	return r.length > 0 ? Jt(r) : void 0;
}, Dd = (e, t, n, r) => {
	let i = n ? T(e.items, n)?.item : void 0, a = i && w(i) ? i.id : void 0;
	return Ft(e.items).filter((e) => (e.parent?.id ?? void 0) === a).filter((e) => !e.item.hidden).filter((e) => {
		let n = w(e.item) ? It(e) : hd(e.item, e.offset, r(e.item));
		return n !== void 0 && Ot(n, t);
	}).map((e) => e.item.id);
}, Od = (e, t) => ({
	x: Math.min(e.x, t.x),
	y: Math.min(e.y, t.y),
	width: Math.abs(t.x - e.x),
	height: Math.abs(t.y - e.y)
}), kd = (e) => {
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
}, Ad = (e) => Array.isArray(e) && e.length === 2 && e.every((e) => typeof e == "number"), jd = (e) => Array.isArray(e) ? e.filter(Ad).map(([e, t]) => [e, t]) : [], Md = (e) => e.length < 256, Nd = (e) => e.length > 3, Pd = (e) => {
	if (!Md(e) || e.length === 0) return e;
	let [t, n] = e[e.length - 1], [r, i] = e[0];
	return [...e, [Math.round((t + r) / 2), Math.round((n + i) / 2)]];
}, Fd = (e, t) => Nd(e) ? e.filter((e, n) => n !== t) : e, Id = (e, t, n, r) => e.map((e, i) => i === t ? n === 0 ? [r, e[1]] : [e[0], r] : e), Ld = (e, t, n) => e.map((e, r) => r === t ? n : e), Rd = (e, t, n) => Md(e) ? [
	...e.slice(0, t + 1),
	n,
	...e.slice(t + 1)
] : e, zd = (e, t) => [Math.round((e[0] + t[0]) / 2), Math.round((e[1] + t[1]) / 2)], Bd = (e) => {
	if (e.type === "polygon") return jd(e.points);
	if (e.type === "line") return [[e.x_start, e.y_start], [e.x_end, e.y_end]];
}, Vd = (e, t) => {
	if (e.type === "polygon") return {
		...e,
		points: t
	};
	if (e.type === "line" && t.length === 2) {
		let [[n, r], [i, a]] = t;
		return {
			...e,
			x_start: n,
			y_start: r,
			x_end: i,
			y_end: a
		};
	}
	return e;
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
var Hd = [
	.5,
	1,
	2,
	3
], Ud = class extends B {
	constructor(...e) {
		super(...e), this.zoom = 1;
	}
	static {
		this.styles = [K, L`
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
		G(this, "zoom-change", { zoom: e });
	}
	step(e) {
		G(this, "zoom-step", { direction: e });
	}
	render() {
		return R`
      <div class="zoom-controls">
        <button aria-label=${t.zoom.out} @click=${() => this.step(-1)}>
          −
        </button>
        ${Hd.map((e) => R`
            <button
              class=${this.zoom === e ? "active" : ""}
              aria-label=${t.zoom.preset(e)}
              @click=${() => this.zoomTo(e)}
            >
              ${t.zoom.preset(e)}
            </button>
          `)}
        <button aria-label=${t.zoom.in} @click=${() => this.step(1)}>
          +
        </button>
        <button
          aria-label=${t.zoom.reset}
          @click=${() => G(this, "zoom-reset")}
        >
          ${t.zoom.reset}
        </button>
        <button
          aria-label=${t.zoom.fit}
          @click=${() => G(this, "zoom-fit")}
        >
          ${t.zoom.fit}
        </button>
      </div>
    `;
	}
};
Y([H({ type: Number })], Ud.prototype, "zoom", void 0), Ud = Y([V("ods-zoom-bar")], Ud);
//#endregion
//#region src/ods-canvas.ts
var Wd = 3, Gd = 1, Kd = (e, t) => ({
	left: `${e.x / t.width * 100}%`,
	top: `${e.y / t.height * 100}%`,
	width: `${e.width / t.width * 100}%`,
	height: `${e.height / t.height * 100}%`
}), X = class extends B {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.selectedItemIds = [], this.enteredGroupId = "", this.snapEnabled = !0, this.acceptingDrop = !1, this.canUndo = !1, this.canRedo = !1, this.viewport = ss, this.dropContainerId = "", this.guides = [], this.spacing = [], this.panMode = !0, this.gridVisible = !0, this.spaceHeld = !1, this.onSpaceDown = (e) => {
			e.key !== " " || Su(e) || (e.preventDefault(), this.spaceHeld = !0);
		}, this.onSpaceUp = (e) => {
			e.key === " " && this.releaseSpace();
		}, this.releaseSpace = () => {
			this.spaceHeld = !1;
		}, this.measure = (e) => {
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
			let r = E(this.preview?.composedFrom.items ?? [], e.id);
			return this.remeasure(r, e, n);
		};
	}
	static {
		this.styles = [K, L`
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
      .view-drag,
      .view-drag .selection {
        cursor: grab;
      }
      .canvas {
        --line: calc(1px * var(--ui, 1));
        --line-strong: calc(2px * var(--ui, 1));
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
      .clip-ring {
        position: absolute;
        z-index: 1;
        inset: calc(-1 * var(--margin));
        box-sizing: border-box;
        border: var(--margin) solid rgba(8, 15, 24, 0.2);
        pointer-events: none;
      }
      .clip-frame {
        position: absolute;
        z-index: 2;
        inset: 0;
        box-shadow: 0 0 0 var(--line) rgba(8, 15, 24, 0.7);
        pointer-events: none;
      }
      .working-area {
        position: absolute;
        pointer-events: none;
        z-index: 2;
        border: var(--line) dashed rgba(3, 169, 244, 0.72);
        background-image: radial-gradient(
          circle,
          rgba(3, 169, 244, 0.22) 0.7px,
          transparent 0.8px
        );
        background-size: max(12px, var(--snap-size)) max(12px, var(--snap-size));
      }
      .working-area.no-grid {
        background-image: none;
      }
      .selection {
        position: absolute;
        z-index: 3;
        min-width: calc(3px * var(--ui, 1));
        min-height: calc(3px * var(--ui, 1));
        border: var(--line) solid transparent;
        cursor: move;
        touch-action: none;
      }
      /* A dashed outline just outside the element, so hovering never moves its border. */
      .selection:hover {
        outline: var(--line) dashed rgba(3, 169, 244, 0.65);
        outline-offset: calc(2px * var(--ui, 1));
      }
      .selection.selected {
        border: var(--line-strong) solid #00aef0;
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
        border: var(--line) solid rgba(3, 169, 244, 0.7);
      }
      .selection.group {
        border-style: dashed;
      }
      .selection.entered {
        border: var(--line-strong) dashed #00aef0;
        background: rgba(3, 169, 244, 0.05);
      }
      .selection.drop-target {
        border: var(--line-strong) solid #00aef0;
        background: rgba(3, 169, 244, 0.14);
      }
      .group-hint {
        position: absolute;
        left: 0;
        bottom: calc(100% + 6px * var(--ui, 1));
        min-width: max-content;
        transform: scale(var(--ui, 1));
        transform-origin: left bottom;
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
        border: var(--line-strong) dashed #00aef0;
        pointer-events: none;
      }
      .guide {
        position: absolute;
        z-index: 7;
        border: 0 dashed #e91e8c;
        pointer-events: none;
      }
      .spacing {
        position: absolute;
        z-index: 7;
        border: 0 solid #e91e8c;
        pointer-events: none;
      }
      .spacing.horizontal {
        height: 0;
        border-top-width: var(--line);
      }
      .spacing.vertical {
        width: 0;
        border-left-width: var(--line);
      }
      .spacing span {
        position: absolute;
        padding: 1px 4px;
        border-radius: 3px;
        color: #fff;
        background: #e91e8c;
        font: 700 9px/1.2 var(--code-font-family, monospace);
        transform: translate(-50%, -50%) scale(var(--ui, 1));
      }
      .spacing.horizontal span {
        left: 50%;
        top: 0;
      }
      .spacing.vertical span {
        left: 0;
        top: 50%;
      }
      .guide.vertical {
        width: 0;
        border-left-width: var(--line);
      }
      .guide.horizontal {
        height: 0;
        border-top-width: var(--line);
      }
      .marquee {
        position: absolute;
        z-index: 6;
        border: var(--line) solid #00aef0;
        background: rgba(0, 174, 240, 0.12);
        pointer-events: none;
      }
      .selection.locked {
        cursor: default;
        border-style: dashed;
      }
      .selection.hidden {
        background: rgba(3, 169, 244, 0.09);
        border: var(--line) dashed rgba(3, 169, 244, 0.75);
      }
      .hidden-label {
        position: absolute;
        left: 3px;
        top: 3px;
        transform: scale(var(--ui, 1));
        transform-origin: left top;
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
        width: calc(8px * var(--ui, 1));
        height: calc(8px * var(--ui, 1));
        padding: 0;
        border: var(--line) solid #00aef0;
        border-radius: 1px;
        background: #fff;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85);
        touch-action: none;
      }
      .resize-handle::after,
      .point-handle::after {
        content: "";
        position: absolute;
        inset: calc(-6px * var(--ui, 1));
      }
      .edge-add {
        position: absolute;
        z-index: 7;
        display: grid;
        place-items: center;
        width: calc(12px * var(--ui, 1));
        height: calc(12px * var(--ui, 1));
        padding: 0;
        border: var(--line) dashed #00aef0;
        border-radius: 50%;
        color: #00aef0;
        background: rgba(255, 255, 255, 0.92);
        transform: translate(-50%, -50%);
        cursor: crosshair;
        touch-action: none;
      }
      .edge-add::before {
        content: "+";
        font: 700 calc(11px * var(--ui, 1)) / 1 sans-serif;
      }
      .edge-add::after {
        content: "";
        position: absolute;
        inset: calc(-4px * var(--ui, 1));
      }
      .point-handle {
        position: absolute;
        z-index: 8;
        width: calc(11px * var(--ui, 1));
        height: calc(11px * var(--ui, 1));
        padding: 0;
        border: var(--line-strong) solid #00aef0;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85);
        transform: translate(-50%, -50%);
        /* A cross, not the arrows that move a whole element: this edits one point. */
        cursor: crosshair;
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
        top: calc(100% + 9px * var(--ui, 1));
        transform: translateX(-50%) scale(var(--ui, 1));
        transform-origin: top center;
        min-width: max-content;
        padding: 2px 7px;
        border: var(--line) solid #2788b8;
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
	connectedCallback() {
		super.connectedCallback(), window.addEventListener("keydown", this.onSpaceDown), window.addEventListener("keyup", this.onSpaceUp), window.addEventListener("blur", this.releaseSpace);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), window.removeEventListener("keydown", this.onSpaceDown), window.removeEventListener("keyup", this.onSpaceUp), window.removeEventListener("blur", this.releaseSpace), this.stopGesture?.();
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
		G(this, "viewport-change", e);
	}
	resetView() {
		this.setViewport(ss);
	}
	get stageSize() {
		let e = this.stage;
		if (e) return {
			width: e.clientWidth,
			height: e.clientHeight
		};
	}
	fitView() {
		let e = this.stageSize;
		e && this.setViewport(fs(e, this.dashboard.display));
	}
	toggleFitView() {
		let e = this.stageSize;
		e && this.setViewport(ms(this.viewport, e, this.dashboard.display));
	}
	stagePoint(e, t) {
		let n = this.stage?.getBoundingClientRect();
		return n ? {
			x: e - n.left - n.width / 2,
			y: t - n.top - n.height / 2
		} : {
			x: 0,
			y: 0
		};
	}
	onWheel(e) {
		e.preventDefault();
		let t = this.stagePoint(e.clientX, e.clientY);
		this.setViewport(Ss(this.viewport, e, t, this.panMode));
	}
	startsViewDrag(e, t = !1) {
		return e.button === Gd ? !0 : e.button === 0 ? this.spaceHeld || t && (e.ctrlKey || e.metaKey) : !1;
	}
	onStagePointerDown(e) {
		if (!this.startsViewDrag(e, !0)) return;
		e.preventDefault();
		let t = e;
		this.stopGesture?.(), this.stopGesture = kd({
			origin: e,
			onMove: (e) => {
				this.setViewport(ds(this.viewport, e.clientX - t.clientX, e.clientY - t.clientY)), t = e;
			}
		});
	}
	toggleGrid() {
		this.gridVisible = !this.gridVisible;
	}
	togglePan() {
		this.panMode = !this.panMode;
	}
	isPlacedByExpression(e) {
		let t = ns(e, this.primitives);
		return t.position.length > 0 || t.handles.length > 0;
	}
	remeasure(e, t, n) {
		return !n || e?.kind !== "primitive" || t.kind !== "primitive" ? n : Ae(e.primitive, t.primitive, n);
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
		let t = Nt(this.dashboard.items, e.id, this.enteredGroupId || void 0);
		return E(this.dashboard.items, t) ?? e;
	}
	onItemPointerDown(e, t) {
		if (this.startsViewDrag(e)) return;
		e.stopPropagation(), e.preventDefault();
		let n = this.targetOf(t);
		if (e.shiftKey) {
			G(this, "item-select", {
				itemId: n.id,
				additive: !0
			});
			return;
		}
		let r = this.selectedItemIds.includes(n.id);
		r || G(this, "item-select", { itemId: n.id });
		let i = r && this.selectedItemIds.length > 1 ? this.selectedItemIds : [n.id];
		this.beginMove(e, n, i);
	}
	onHandlePointerDown(e, t, n) {
		if (this.startsViewDrag(e)) return;
		e.stopPropagation(), e.preventDefault(), G(this, "item-select", { itemId: t.id });
		let r = ns(t, this.primitives);
		t.locked || r.handles.includes(n) || this.beginResize(e, t, n);
	}
	beginMove(e, t, n) {
		let r = ns(t, this.primitives);
		if (t.locked || r.position.length > 0) return;
		this.stopGesture?.();
		let i = structuredClone(this.dashboard), a = this.watchEscape(i, () => {
			this.dropContainerId = "", this.guides = [], this.spacing = [];
		}), o = {}, s = gd(this.dashboard, n, this.measure), c = bd(this.dashboard, n, t.id, this.measure), l = {
			clientX: e.clientX,
			clientY: e.clientY
		}, u = kd({
			origin: e,
			threshold: Wd,
			onMove: (r) => {
				l = {
					clientX: r.clientX,
					clientY: r.clientY
				};
				let { dx: i, dy: a } = this.displayDelta(e, r), u = this.snapEnabled && !r.ctrlKey && !r.metaKey, d = Sd(s, t.id, i, a, this.dashboard, u, c, o);
				this.guides = u && c ? Cd(s, d, c) : [], this.spacing = u && c ? wd(s, d, c) : [], G(this, "items-transform", { items: d }), this.updateDropContainer(l, n);
			},
			onEnd: (e, r) => {
				if (a(), this.dropContainerId = "", this.guides = [], this.spacing = [], !r) return;
				let o = this.clampedPointAt(l.clientX, l.clientY), s = n.length === 1 && o ? {
					itemId: t.id,
					x: o.x,
					y: o.y
				} : void 0;
				G(this, "item-transform-end", {
					before: i,
					drop: s
				});
			},
			onCancel: () => {
				a(), this.dropContainerId = "", this.guides = [], this.spacing = [];
			}
		});
		this.stopGesture = () => {
			u(), a();
		};
	}
	watchEscape(e, t) {
		let n = (n) => {
			n.key === "Escape" && (n.preventDefault(), this.stopGesture?.(), t(), G(this, "gesture-cancel", { before: e }));
		};
		return window.addEventListener("keydown", n, !0), () => window.removeEventListener("keydown", n, !0);
	}
	beginResize(e, t, n) {
		this.stopGesture?.();
		let r = structuredClone(this.dashboard), i = this.watchEscape(r, () => {
			this.resizing = void 0, this.guides = [];
		}), a = structuredClone(t), o = T(this.dashboard.items, t.id), s = this.measure(t);
		this.resizing = {
			original: a,
			measured: s
		};
		let c = bd(this.dashboard, [t.id], t.id, this.measure), l = t.kind === "widget" ? this.widgets.find((e) => e.id === t.widget.type)?.layout.minSize : void 0, u = kd({
			origin: e,
			threshold: Wd,
			onMove: (t) => {
				let r = this.snapEnabled && !t.altKey && !t.ctrlKey && !t.metaKey, i = yd(a, n, t.shiftKey, this.displayDelta(e, t), this.dashboard, {
					snapEnabled: r,
					minSize: l,
					measured: s,
					definitions: this.primitives,
					offset: o?.offset
				}, c);
				this.guides = i.guides, G(this, "items-transform", { items: [i.item] });
			},
			onEnd: (e, t) => {
				i(), this.resizing = void 0, this.guides = [], t && G(this, "item-transform-end", { before: r });
			},
			onCancel: () => {
				i(), this.resizing = void 0, this.guides = [];
			}
		});
		this.stopGesture = () => {
			u(), i();
		};
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
		let r = Lt(this.dashboard.items, n.x, n.y, t, this.enteredGroupId || void 0), i = T(this.dashboard.items, t[0] ?? "")?.parent;
		this.dropContainerId = r && r.id !== i?.id ? r.id : "";
	}
	onCanvasPointerDown(e) {
		if (this.startsViewDrag(e, !0)) return;
		let t = this.clampedPointAt(e.clientX, e.clientY);
		if (!t) return;
		let n = e.shiftKey, r = n ? this.selectedItemIds : [];
		this.stopGesture?.(), this.stopGesture = kd({
			origin: e,
			threshold: Wd,
			onMove: (e) => {
				let n = this.clampedPointAt(e.clientX, e.clientY);
				if (!n) return;
				let i = Od(t, n);
				this.marquee = i;
				let a = Dd(this.dashboard, i, this.enteredGroupId || void 0, this.measure);
				G(this, "selection-change", { itemIds: [.../* @__PURE__ */ new Set([...r, ...a])] });
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
		e.preventDefault(), e.stopPropagation(), G(this, "context-menu", {
			source: "canvas",
			itemId: this.targetOf(t).id,
			clientX: e.clientX,
			clientY: e.clientY
		});
	}
	onCanvasContextMenu(e) {
		e.preventDefault(), G(this, "context-menu", {
			source: "empty",
			clientX: e.clientX,
			clientY: e.clientY,
			point: this.clampedPointAt(e.clientX, e.clientY)
		});
	}
	onItemDoubleClick(e, t) {
		e.stopPropagation();
		let n = this.targetOf(t);
		w(n) && n.grouped && G(this, "group-enter", { groupId: n.id });
	}
	runCommand(e) {
		G(this, "command", { id: e });
	}
	toggleSnap() {
		G(this, "snap-toggle");
	}
	deselect() {
		G(this, "item-select", { itemId: "" });
	}
	onStageDragOver(e) {
		this.acceptingDrop && e.preventDefault();
	}
	onStageDrop(e) {
		e.preventDefault();
	}
	onZoomChange(e) {
		e.stopPropagation(), this.setViewport(cs(this.viewport, e.detail.zoom));
	}
	onZoomReset(e) {
		e.stopPropagation(), this.resetView();
	}
	onZoomStep(e) {
		e.stopPropagation(), this.setViewport(us(this.viewport, e.detail.direction));
	}
	onZoomFit(e) {
		e.stopPropagation(), this.toggleFitView();
	}
	resizeHandleLabel(e, n) {
		return t.canvas.resizeHandle(e.name, t.canvas.sides[n]);
	}
	renderBadges(e) {
		return R`
      ${e.hidden ? R`
              <span class="hidden-label">${t.canvas.hidden}</span>
            ` : z}
      ${e.locked ? R`
              <ha-icon class="lock-badge" icon="mdi:lock"></ha-icon>
            ` : this.renderExpressionLock(e)}
    `;
	}
	renderExpressionLock(e) {
		let { position: t, scalingBlockedBy: n } = ns(e, this.primitives), r = this.lockReason(t, n);
		return r ? R`
      <ha-icon
        class="lock-badge expression-lock"
        icon="mdi:function-variant"
        title=${r}
        aria-label=${r}
      ></ha-icon>
    ` : z;
	}
	lockReason(e, n) {
		return e.length > 0 ? t.expression.positionLocked(e.join(", ")) : n.length > 0 ? t.expression.scalingLocked(n.join(", ")) : "";
	}
	renderSelectionSize(e) {
		let n = Math.round(e.width), r = Math.round(e.height);
		return R`
      <output class="selection-size" aria-live="off">
        ${t.common.size(n, r)}
      </output>
    `;
	}
	renderHandles(e) {
		if (e.kind === "primitive" && !Be(e.primitive) || e.kind === "primitive" && e.primitive.type === "line") return [];
		let t = ns(e, this.primitives).handles;
		return y.filter((e) => !t.includes(e)).map((t) => R`
        <button
          data-resize-handle=${t}
          class=${`resize-handle resize-${t}`}
          tabindex="-1"
          aria-label=${this.resizeHandleLabel(e, t)}
          @pointerdown=${(n) => this.onHandlePointerDown(n, e, t)}
        ></button>
      `);
	}
	pointPosition(e, t, n) {
		let r = (e[0] + t.x - n.x + .5) / Math.max(n.width, 1) * 100, i = (e[1] + t.y - n.y + .5) / Math.max(n.height, 1) * 100;
		return {
			left: `${r}%`,
			top: `${i}%`
		};
	}
	renderPointHandles(e, n, r) {
		if (e.kind !== "primitive") return [];
		let i = Bd(e.primitive);
		return !i || ns(e, this.primitives).position.length > 0 ? [] : [...i.map((i, a) => R`
        <button
          data-point-handle=${a}
          class="point-handle"
          tabindex="-1"
          aria-label=${t.canvas.pointHandle(e.name, a + 1)}
          style=${W(this.pointPosition(i, n, r))}
          @pointerdown=${(t) => this.onPointHandlePointerDown(t, e, a)}
          @dblclick=${(t) => this.onPointHandleDoubleClick(t, e, a)}
        ></button>
      `), ...this.renderEdgeAdders(e, i, n, r)];
	}
	renderEdgeAdders(e, n, r, i) {
		return e.primitive.type !== "polygon" || !Md(n) ? [] : n.map((a, o) => R`
        <button
          data-edge-add=${o}
          class="edge-add"
          tabindex="-1"
          aria-label=${t.canvas.addPoint(e.name, o + 1)}
          style=${W(this.pointPosition(zd(a, n[(o + 1) % n.length]), r, i))}
          @pointerdown=${this.stopHandlePress}
          @click=${() => this.addPointAfter(e, n, o)}
        ></button>
      `);
	}
	stopHandlePress(e) {
		this.startsViewDrag(e) || (e.stopPropagation(), e.preventDefault());
	}
	changePoints(e, t) {
		G(this, "item-select", { itemId: e.id }), G(this, "primitive-field-change", {
			key: "points",
			value: t
		});
	}
	addPointAfter(e, t, n) {
		let r = t[(n + 1) % t.length];
		this.changePoints(e, Rd(t, n, zd(t[n], r)));
	}
	onPointHandleDoubleClick(e, t, n) {
		if (e.stopPropagation(), t.kind !== "primitive" || t.locked) return;
		let r = Bd(t.primitive);
		!r || t.primitive.type !== "polygon" || this.changePoints(t, Fd(r, n));
	}
	onPointHandlePointerDown(e, t, n) {
		this.startsViewDrag(e) || (e.stopPropagation(), e.preventDefault(), G(this, "item-select", { itemId: t.id }), !(t.kind !== "primitive" || t.locked) && this.beginPointDrag(e, t, n));
	}
	beginPointDrag(e, t, n) {
		let r = Bd(t.primitive);
		if (!r) return;
		this.stopGesture?.();
		let i = structuredClone(this.dashboard), a = this.watchEscape(i, () => void 0), o = T(this.dashboard.items, t.id)?.offset ?? {
			x: 0,
			y: 0
		}, { width: s, height: c } = this.dashboard.display, l = kd({
			origin: e,
			threshold: Wd,
			onMove: (i) => {
				let { dx: a, dy: l } = this.displayDelta(e, i), u = this.snapEnabled && !i.ctrlKey && !i.metaKey, d = (e, t, n) => _(ut(e + t, this.dashboard, u) - t, -n, 2 * n), f = [d(r[n][0] + a, o.x, s), d(r[n][1] + l, o.y, c)], p = {
					...t,
					primitive: Vd(t.primitive, Ld(r, n, f))
				};
				G(this, "items-transform", { items: [p] });
			},
			onEnd: (e, t) => {
				a(), t && G(this, "item-transform-end", { before: i });
			},
			onCancel: a
		});
		this.stopGesture = () => {
			l(), a();
		};
	}
	showsHandles(e, t) {
		return !(!t || e.locked || this.selectedItemIds.length !== 1);
	}
	showsGroupHint(e, t) {
		return t && this.selectedItemIds.length === 1 && w(e) && e.grouped && this.enteredGroupId !== e.id;
	}
	renderGroupHint() {
		return R`
      <span class="group-hint">${t.canvas.enterGroupHint}</span>
    `;
	}
	itemClasses(e) {
		let { item: t } = e, n = this.selectedItemIds.includes(t.id), r = w(t) && this.selectedItemIds.some((e) => e !== t.id && T(t.children, e) !== void 0);
		return {
			selection: !0,
			selected: n,
			container: w(t),
			group: w(t) && t.grouped,
			entered: t.id === this.enteredGroupId,
			"holds-selection": r,
			"drop-target": t.id === this.dropContainerId,
			locked: t.locked,
			hidden: t.hidden
		};
	}
	renderPlaced(e) {
		let { item: t } = e, n = hd(t, e.offset, this.measure(t)), r = this.selectedItemIds.includes(t.id), i = this.selectedItemIds.length === 1;
		return R`
      <div
        data-item-id=${t.id}
        class=${Zu(this.itemClasses(e))}
        style=${W(Kd(n, this.dashboard.display))}
        @pointerdown=${(e) => this.onItemPointerDown(e, t)}
        @dblclick=${(e) => this.onItemDoubleClick(e, t)}
        @contextmenu=${(e) => this.onItemContextMenu(e, t)}
      >
        ${this.renderBadges(t)}
        ${r && i ? this.renderSelectionSize(n) : z}
        ${this.showsGroupHint(t, r) ? this.renderGroupHint() : z}
        ${this.showsHandles(t, r) ? this.renderHandles(t) : z}
        ${this.showsHandles(t, r) ? this.renderPointHandles(t, e.offset, n) : z}
      </div>
    `;
	}
	renderSelectionBox() {
		if (this.selectedItemIds.length < 2) return z;
		let e = Ed(this.dashboard, this.selectedItemIds, this.measure);
		return e ? R`
      <div
        class="multi-selection"
        style=${W(Kd(e, this.dashboard.display))}
      >
        ${this.renderSelectionSize(e)}
      </div>
    ` : z;
	}
	renderSpacing(e) {
		let { width: t, height: n } = this.dashboard.display, r = e.axis === "x", i = r ? {
			left: `${e.from / t * 100}%`,
			width: `${(e.to - e.from) / t * 100}%`,
			top: `${e.across / n * 100}%`
		} : {
			top: `${e.from / n * 100}%`,
			height: `${(e.to - e.from) / n * 100}%`,
			left: `${e.across / t * 100}%`
		};
		return R`
      <div
        class="spacing ${r ? "horizontal" : "vertical"}"
        style=${W(i)}
      >
        <span>${Math.round(e.to - e.from)}</span>
      </div>
    `;
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
		return R`
      <div
        class="guide ${r ? "vertical" : "horizontal"}"
        style=${W(i)}
      ></div>
    `;
	}
	renderMarquee() {
		return this.marquee ? R`
      <div
        class="marquee"
        style=${W(Kd(this.marquee, this.dashboard.display))}
      ></div>
    ` : z;
	}
	renderHistoryButton(e) {
		let t = Bl(Pl(e), {
			canUndo: this.canUndo,
			canRedo: this.canRedo
		}, Cu());
		return R`
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
		let e = this.dashboard, { width: n, height: r, padding: i, snapSize: a } = e.display, o = Zu({
			"tool-toggle": !0,
			active: this.snapEnabled
		}), s = Zu({
			"tool-toggle": !0,
			active: this.panMode
		}), c = Zu({
			"tool-toggle": !0,
			active: this.gridVisible
		});
		return R`
      <div class="workspace-meta">
        <span>${t.common.sizeInPixels(n, r)}</span>
        <span>${t.canvas.layers(Ct(e.items))}</span>
        <span>${t.canvas.padding(i)}</span>
        <div class="history-controls">
          ${this.renderHistoryButton("undo")}
          ${this.renderHistoryButton("redo")}
        </div>
        <button
          class=${s}
          aria-pressed=${this.panMode}
          title=${t.canvas.panTitle}
          @click=${this.togglePan}
        >
          <ha-icon icon="mdi:pan"></ha-icon>
          <span>${t.canvas.pan}</span>
        </button>
        <button
          class=${c}
          aria-pressed=${this.gridVisible}
          title=${t.canvas.gridTitle}
          @click=${this.toggleGrid}
        >
          <ha-icon icon="mdi:grid"></ha-icon>
          <span>${t.canvas.grid}</span>
        </button>
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
		if (!this.preview) return R`
        <div class="canvas-placeholder">${t.canvas.rendering}</div>
      `;
		let e = this.preview.margin ?? 0;
		return R`
      <img
        draggable="false"
        src=${this.preview.imageUrl}
        alt=${t.canvas.previewAlt}
        style=${W(this.pictureBox(e))}
      />
      ${this.renderClipFrame(e)}
    `;
	}
	pictureBox(e) {
		return {
			left: `${-e}px`,
			top: `${-e}px`,
			width: `calc(100% + ${2 * e}px)`,
			height: `calc(100% + ${2 * e}px)`
		};
	}
	renderClipFrame(e) {
		return e === 0 ? z : R`
      <div
        class="clip-ring"
        aria-hidden="true"
        style=${W({ "--margin": `${e}px` })}
      ></div>
      <div class="clip-frame" aria-hidden="true"></div>
    `;
	}
	renderStage() {
		let e = this.dashboard, { width: t, height: n, snapSize: r } = e.display, { zoom: i, panX: a, panY: o } = this.viewport, s = W({ transform: `translate(${a}px, ${o}px) scale(${i})` }), c = W({
			width: `${t}px`,
			height: `${n}px`,
			"--ui": String(1 / i)
		}), l = W({
			...Kd(lt(e), e.display),
			"--snap-size": `${r * i}px`
		});
		return R`
      <section
        class=${Zu({
			"canvas-stage": !0,
			"view-drag": this.spaceHeld,
			"accepting-drop": this.acceptingDrop
		})}
        @wheel=${this.onWheel}
        @pointerdown=${this.onStagePointerDown}
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
              class="working-area ${this.gridVisible ? "" : "no-grid"}"
              aria-hidden="true"
              style=${l}
            ></div>
            ${Ft(e.items).map((e) => this.renderPlaced(e))}
            ${this.renderSelectionBox()} ${this.renderMarquee()}
            ${this.guides.map((e) => this.renderGuide(e))}
            ${this.spacing.map((e) => this.renderSpacing(e))}
          </div>
        </div>
        <ods-zoom-bar
          .zoom=${i}
          @zoom-change=${this.onZoomChange}
          @zoom-step=${this.onZoomStep}
          @zoom-reset=${this.onZoomReset}
          @zoom-fit=${this.onZoomFit}
        ></ods-zoom-bar>
      </section>
    `;
	}
	render() {
		return R`
      <main class="workspace">
        ${this.renderToolbar()} ${this.renderStage()}
      </main>
    `;
	}
};
Y([H({ attribute: !1 })], X.prototype, "dashboard", void 0), Y([H({ attribute: !1 })], X.prototype, "preview", void 0), Y([H({ attribute: !1 })], X.prototype, "widgets", void 0), Y([H({ attribute: !1 })], X.prototype, "primitives", void 0), Y([H()], X.prototype, "selectedItemId", void 0), Y([H({ attribute: !1 })], X.prototype, "selectedItemIds", void 0), Y([H()], X.prototype, "enteredGroupId", void 0), Y([H({ type: Boolean })], X.prototype, "snapEnabled", void 0), Y([H({ type: Boolean })], X.prototype, "acceptingDrop", void 0), Y([H({ type: Boolean })], X.prototype, "canUndo", void 0), Y([H({ type: Boolean })], X.prototype, "canRedo", void 0), Y([H({ attribute: !1 })], X.prototype, "viewport", void 0), Y([$c(".canvas")], X.prototype, "canvas", void 0), Y([$c(".canvas-stage")], X.prototype, "stage", void 0), Y([U()], X.prototype, "dropContainerId", void 0), Y([U()], X.prototype, "marquee", void 0), Y([U()], X.prototype, "guides", void 0), Y([U()], X.prototype, "spacing", void 0), Y([U()], X.prototype, "panMode", void 0), Y([U()], X.prototype, "gridVisible", void 0), Y([U()], X.prototype, "spaceHeld", void 0), X = Y([V("ods-canvas")], X);
//#endregion
//#region src/ods-code-view.ts
var qd = {
	idle: "mdi:content-copy",
	copied: "mdi:check",
	failed: "mdi:alert-circle-outline"
}, Jd = 2200, Yd = class extends B {
	constructor(...e) {
		super(...e), this.copyState = "idle";
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
			}, Jd);
		}
	}
	render() {
		return R`
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
                .icon=${qd[this.copyState]}
              ></ha-icon>
              ${t.code.copy[this.copyState]}
            </ha-button>
          </header>
          ${this.preview?.warnings.map((e) => R`
                <ha-alert alert-type="warning">${e}</ha-alert>
              `) ?? z}
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
Y([H({ attribute: !1 })], Yd.prototype, "preview", void 0), Y([U()], Yd.prototype, "copyState", void 0), Yd = Y([V("ods-code-view")], Yd);
//#endregion
//#region src/ods-confirm-dialog.ts
var Xd = class extends B {
	constructor(...e) {
		super(...e), this.eyebrow = "", this.heading = "", this.body = "", this.confirmLabel = "";
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
		G(this, "confirm-cancel");
	}
	accept() {
		G(this, "confirm-accept");
	}
	onScrimClick(e) {
		e.target === e.currentTarget && this.cancel();
	}
	render() {
		return R`
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
Y([H()], Xd.prototype, "eyebrow", void 0), Y([H()], Xd.prototype, "heading", void 0), Y([H()], Xd.prototype, "body", void 0), Y([H()], Xd.prototype, "confirmLabel", void 0), Xd = Y([V("ods-confirm-dialog")], Xd);
//#endregion
//#region src/series.ts
var Zd = "entity", Qd = (e) => e.shape === "objects" && (e.nested ?? []).some((e) => e.shape === "entity"), $d = (e) => typeof e == "object" && !!e && !Array.isArray(e), ef = (e) => Array.isArray(e) ? e.filter($d) : [], tf = (e, t = "") => {
	let n = (e.nested ?? []).flatMap((e) => e.default === void 0 ? [] : [[e.key, e.default]]);
	return {
		...Object.fromEntries(n),
		[Zd]: t
	};
}, nf = (e, t) => t.length < (typeof e.max == "number" ? e.max : t.length + 1), rf = (e, t) => t.length > (typeof e.min == "number" ? e.min : 1), af = (e, t, n) => e.map((e, r) => r === t ? {
	...e,
	...n
} : e), of = (e, t) => e.filter((e, n) => n !== t), sf = class extends B {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.unit = "", this.value = 0, this.min = 0, this.max = 4096, this.disabled = !1;
	}
	static {
		this.styles = [
			K,
			Xu,
			L`
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
		return this.disabled ? z : R`
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
		G(this, "field-change", {
			key: this.fieldKey,
			value: xu(e)
		});
	}
	render() {
		return R`
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
        ${this.unit ? R`
                <span class="unit">${this.unit}</span>
              ` : z}
        ${this.renderSteppers()}
      </label>
    `;
	}
};
Y([H()], sf.prototype, "label", void 0), Y([H()], sf.prototype, "fieldKey", void 0), Y([H()], sf.prototype, "unit", void 0), Y([H({ attribute: !1 })], sf.prototype, "value", void 0), Y([H({ type: Number })], sf.prototype, "min", void 0), Y([H({ type: Number })], sf.prototype, "max", void 0), Y([H({ type: Boolean })], sf.prototype, "disabled", void 0), Y([$c("input")], sf.prototype, "input", void 0), sf = Y([V("ods-property-field")], sf);
//#endregion
//#region src/ods-anchor-picker.ts
var cf = [
	"lt",
	"mt",
	"rt",
	"lm",
	"mm",
	"rm",
	"lb",
	"mb",
	"rb"
], lf = (e) => cf.some((t) => t === e), uf = class extends B {
	constructor(...e) {
		super(...e), this.value = "", this.disabled = !1;
	}
	static {
		this.styles = [K, L`
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
		G(this, "anchor-change", { anchor: e });
	}
	renderPosition(e) {
		let n = t.anchors[e];
		return R`
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
		return R`
      <div class="grid" role="group" aria-label=${t.fields.anchor}>
        ${cf.map((e) => this.renderPosition(e))}
      </div>
    `;
	}
};
Y([H()], uf.prototype, "value", void 0), Y([H({ type: Boolean })], uf.prototype, "disabled", void 0), uf = Y([V("ods-anchor-picker")], uf);
//#endregion
//#region src/ods-color-picker.ts
var df = class extends B {
	constructor(...e) {
		super(...e), this.palette = "bw", this.value = "", this.nullable = !1;
	}
	static {
		this.styles = [K, L`
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
		G(this, "color-change", { color: e });
	}
	renderChoice(e, t, n) {
		let r = (e ?? "") === this.value;
		return R`
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
		return this.nullable ? this.renderChoice(null, t.colors.none, R`
        <span class="swatch none"></span>
      `) : z;
	}
	render() {
		return R`
      <div class="grid">
        ${this.renderNone()}
        ${go[this.palette].map((e) => this.renderChoice(e.value, bo(e.id), R`
              <span class="swatch" style=${`background:${e.hex}`}></span>
            `))}
      </div>
    `;
	}
};
Y([H()], df.prototype, "palette", void 0), Y([H()], df.prototype, "value", void 0), Y([H({ type: Boolean })], df.prototype, "nullable", void 0), df = Y([V("ods-color-picker")], df);
//#endregion
//#region src/ods-icon-picker.ts
var ff = "mdi:", pf = 36, mf = 288, hf = 6, gf = (e) => e.startsWith(ff) ? e.slice(4) : e, _f = (e, t) => {
	let n = t.trim().toLowerCase().split(/\s+/).filter(Boolean);
	if (n.length === 0) return e;
	let r = e.filter((e) => n.every((t) => e.includes(t))), i = n[0], a = r.filter((e) => e.startsWith(i)), o = r.filter((e) => !e.startsWith(i));
	return [...a, ...o];
}, vf = (e, t) => ({
	first: Math.max(0, Math.floor(e / pf) - hf),
	last: Math.min(t, Math.ceil((e + mf) / pf) + hf)
}), yf = class extends B {
	constructor(...e) {
		super(...e), this.icons = [], this.value = "", this.search = "", this.listScroll = 0;
	}
	static {
		this.styles = [
			K,
			Xu,
			L`
      :host {
        display: block;
      }
      .list {
        position: relative;
        height: ${mf}px;
        margin-top: 8px;
        overflow: auto;
        overscroll-behavior: contain;
      }
      .rows {
        position: absolute;
        inset-inline: 0;
        top: 0;
      }
      .list button {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        height: ${pf}px;
        padding: 0 8px;
        border: 1px solid transparent;
        border-radius: 7px;
        background: transparent;
        color: var(--studio-text);
        font-size: 12px;
        text-align: start;
      }
      .list button span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list button:hover {
        background: var(--studio-accent-soft);
      }
      .list button[aria-pressed="true"] {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      ha-icon {
        flex: none;
        --mdi-icon-size: 22px;
        width: 22px;
        height: 22px;
      }
      .empty {
        padding: 12px 0 4px;
        color: var(--studio-muted);
        font-size: 11px;
      }
    `
		];
	}
	onSearch(e) {
		e.target instanceof HTMLInputElement && (this.search = e.target.value, this.listScroll = 0, this.list?.scrollTo({ top: 0 }));
	}
	onScroll(e) {
		e.target instanceof HTMLElement && (this.listScroll = e.target.scrollTop);
	}
	choose(e) {
		G(this, "icon-change", { icon: e });
	}
	renderIcon(e) {
		return R`
      <button
        type="button"
        title=${e}
        aria-label=${e}
        aria-pressed=${e === gf(this.value) ? "true" : "false"}
        @click=${() => this.choose(e)}
      >
        <ha-icon icon=${`${ff}${e}`}></ha-icon>
        <span>${e}</span>
      </button>
    `;
	}
	renderResults() {
		let e = _f(this.icons, this.search);
		if (e.length === 0) return R`
        <p class="empty">${t.iconPicker.noMatch}</p>
      `;
		let { first: n, last: r } = vf(this.listScroll, e.length);
		return R`
      <div class="list" @scroll=${this.onScroll}>
        <div style=${W({ height: `${e.length * pf}px` })}>
          <div
            class="rows"
            style=${W({ top: `${n * pf}px` })}
          >
            ${e.slice(n, r).map((e) => this.renderIcon(e))}
          </div>
        </div>
      </div>
    `;
	}
	render() {
		return R`
      <div class="box">
        <input
          type="search"
          aria-label=${t.iconPicker.search}
          placeholder=${t.iconPicker.search}
          .value=${this.search}
          @input=${this.onSearch}
        />
      </div>
      ${this.renderResults()}
    `;
	}
};
Y([H({ attribute: !1 })], yf.prototype, "icons", void 0), Y([H()], yf.prototype, "value", void 0), Y([U()], yf.prototype, "search", void 0), Y([U()], yf.prototype, "listScroll", void 0), Y([$c(".list")], yf.prototype, "list", void 0), yf = Y([V("ods-icon-picker")], yf);
//#endregion
//#region src/ods-popover.ts
var bf = 6, xf = 8, Sf = class extends B {
	constructor(...e) {
		super(...e), this.heading = "", this.width = 220, this.resizeObserver = new ResizeObserver(() => this.place()), this.onOutsidePointer = (e) => {
			e.composedPath().includes(this) || this.close();
		}, this.onKey = (e) => {
			e.key === "Escape" && (e.stopPropagation(), this.close());
		};
	}
	static {
		this.styles = [K, L`
      :host {
        display: contents;
      }
      .popover {
        /* In the top layer, so no ancestor of the panel can offset a fixed position. */
        position: fixed;
        inset: auto;
        margin: 0;
        z-index: 1100;
        max-height: calc(100vh - 16px);
        overflow: auto;
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
		window.removeEventListener("pointerdown", this.onOutsidePointer, !0), window.removeEventListener("keydown", this.onKey, !0), this.resizeObserver.disconnect(), super.disconnectedCallback();
	}
	updated() {
		let e = this.panel;
		e && !e.matches(":popover-open") && e.showPopover(), e && e !== this.observed && (this.observed = e, this.resizeObserver.observe(e)), this.place();
	}
	close() {
		G(this, "popover-close");
	}
	place() {
		let e = this.panel;
		if (!e || !this.anchor) return;
		let t = e.offsetHeight, n = this.anchor.bottom + bf, r = n + t + xf <= window.innerHeight ? n : this.anchor.top - bf - t, i = Math.min(this.width, window.innerWidth - 16), a = Math.min(Math.max(xf, this.anchor.left), window.innerWidth - i - xf);
		e.style.top = `${Math.max(xf, r)}px`, e.style.left = `${a}px`, e.style.width = `${i}px`;
	}
	render() {
		return this.anchor ? R`
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
    ` : z;
	}
};
Y([H()], Sf.prototype, "heading", void 0), Y([H({ attribute: !1 })], Sf.prototype, "anchor", void 0), Y([H({ type: Number })], Sf.prototype, "width", void 0), Y([$c(".popover")], Sf.prototype, "panel", void 0), Sf = Y([V("ods-popover")], Sf);
//#endregion
//#region src/ods-icon-field.ts
var Cf = "mdi:", wf = 250, Tf = -1, Ef = class extends B {
	constructor(...e) {
		super(...e), this.disabled = !1, this.names = [], this.closedAt = 0;
	}
	static {
		this.styles = [
			K,
			Xu,
			L`
      :host {
        display: block;
        min-width: 0;
      }
      .trigger {
        width: 100%;
        height: 30px;
        cursor: pointer;
        text-align: start;
      }
      .trigger .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-family: var(--code-font-family, monospace);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .trigger ha-icon,
      .chip ha-icon {
        --mdi-icon-size: 18px;
        width: 18px;
        height: 18px;
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        height: 30px;
        padding: 0 2px 0 4px;
        border: 1px solid var(--studio-border);
        border-radius: 7px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .chip button,
      .add {
        display: grid;
        place-items: center;
        min-width: 18px;
        height: 22px;
        padding: 0 2px;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .chip button:hover,
      .add:hover {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      .chip .icon {
        color: var(--studio-text);
      }
      .add {
        height: 30px;
        min-width: 30px;
        border: 1px dashed var(--studio-border);
        border-radius: 7px;
      }
      .chip button.edge {
        font-size: 9px;
      }
    `
		];
	}
	get isList() {
		return this.field.shape === "icons";
	}
	get icons() {
		return Array.isArray(this.value) ? this.value.map(String) : [];
	}
	change(e) {
		G(this, "primitive-field-change", {
			key: this.field.key,
			value: e
		});
	}
	async loadNames() {
		if (!(this.names.length > 0 || !this.hass)) try {
			this.names = await qu(this.hass);
		} catch {
			this.names = [];
		}
	}
	openAt(e, t) {
		if (this.disabled || Date.now() - this.closedAt < wf) return;
		let n = t.currentTarget;
		n instanceof HTMLElement && (this.open = {
			index: e,
			anchor: n.getBoundingClientRect()
		}, this.loadNames());
	}
	openSingle(e) {
		this.openAt(0, e);
	}
	openNew(e) {
		this.openAt(Tf, e);
	}
	close() {
		this.closedAt = Date.now(), this.open = void 0;
	}
	onIconChange(e) {
		let t = gf(e.detail.icon), n = this.open?.index ?? 0;
		this.isList ? n === Tf ? this.change([...this.icons, t]) : this.change(this.icons.map((e, r) => r === n ? t : e)) : this.change(t), this.close();
	}
	removeAt(e) {
		let t = this.icons.filter((t, n) => n !== e);
		t.length > 0 && this.change(t);
	}
	move(e, t) {
		let n = [...this.icons], r = e + t;
		r < 0 || r >= n.length || ([n[e], n[r]] = [n[r], n[e]], this.change(n));
	}
	renderChip(e, n) {
		return R`
      <span class="chip" data-icon=${e}>
        <button
          type="button"
          class="edge"
          aria-label=${t.iconPicker.left}
          .disabled=${this.disabled || n === 0}
          @click=${() => this.move(n, -1)}
        >
          ‹
        </button>
        <button
          type="button"
          class="icon"
          title=${e}
          aria-label=${e}
          .disabled=${this.disabled}
          @click=${(e) => this.openAt(n, e)}
        >
          <ha-icon icon=${`${Cf}${gf(e)}`}></ha-icon>
        </button>
        <button
          type="button"
          class="edge"
          aria-label=${t.iconPicker.right}
          .disabled=${this.disabled || n === this.icons.length - 1}
          @click=${() => this.move(n, 1)}
        >
          ›
        </button>
        <button
          type="button"
          aria-label=${`${t.iconPicker.remove}: ${e}`}
          .disabled=${this.disabled || this.icons.length === 1}
          @click=${() => this.removeAt(n)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </span>
    `;
	}
	renderList() {
		return R`
      <div class="chips" role="group" aria-label=${this.field.label}>
        ${this.icons.map((e, t) => this.renderChip(e, t))}
        <button
          type="button"
          class="add"
          title=${t.iconPicker.add}
          aria-label=${t.iconPicker.add}
          .disabled=${this.disabled}
          @click=${this.openNew}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
    `;
	}
	renderSingle() {
		let e = gf(String(this.value ?? ""));
		return R`
      <button
        type="button"
        class="box trigger ${this.disabled ? "disabled" : ""}"
        aria-label=${this.field.label}
        aria-haspopup="dialog"
        @click=${this.openSingle}
      >
        ${e ? R`
                <ha-icon icon=${`${Cf}${e}`}></ha-icon>
              ` : z}
        <span class="name">${e || t.iconPicker.empty}</span>
      </button>
    `;
	}
	renderPicker() {
		if (!this.open) return z;
		let e = this.isList ? this.icons[this.open.index] ?? "" : String(this.value ?? "");
		return R`
      <ods-popover
        .heading=${this.field.label}
        .anchor=${this.open.anchor}
        .width=${268}
        @popover-close=${this.close}
      >
        <ods-icon-picker
          .icons=${this.names}
          .value=${e}
          @icon-change=${this.onIconChange}
        ></ods-icon-picker>
      </ods-popover>
    `;
	}
	render() {
		return R`
      <span class="field-label">${this.field.label}</span>
      ${this.isList ? this.renderList() : this.renderSingle()}
      ${this.renderPicker()}
    `;
	}
};
Y([H({ attribute: !1 })], Ef.prototype, "hass", void 0), Y([H({ attribute: !1 })], Ef.prototype, "field", void 0), Y([H({ attribute: !1 })], Ef.prototype, "value", void 0), Y([H({ type: Boolean })], Ef.prototype, "disabled", void 0), Y([U()], Ef.prototype, "open", void 0), Y([U()], Ef.prototype, "names", void 0), Ef = Y([V("ods-icon-field")], Ef);
//#endregion
//#region src/ods-points-field.ts
var Df = class extends B {
	constructor(...e) {
		super(...e), this.disabled = !1;
	}
	static {
		this.styles = [
			K,
			Xu,
			L`
      :host {
        display: block;
        min-width: 0;
      }
      .rows {
        display: grid;
        gap: 4px;
      }
      .row {
        display: grid;
        grid-template-columns: 18px 1fr 1fr 24px;
        align-items: center;
        gap: 4px;
      }
      .row .index {
        color: var(--studio-muted);
        font-size: 10px;
        text-align: center;
      }
      .row button,
      .add {
        display: grid;
        place-items: center;
        height: 24px;
        padding: 0;
        border: 0;
        border-radius: 5px;
        background: transparent;
        color: var(--studio-muted);
      }
      .row button:hover:not(:disabled),
      .add:hover:not(:disabled) {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      .add {
        grid-auto-flow: column;
        gap: 4px;
        width: 100%;
        margin-top: 4px;
        border: 1px dashed var(--studio-border);
        font-size: 11px;
      }
      button:disabled {
        opacity: 0.4;
      }
    `
		];
	}
	get points() {
		return jd(this.value);
	}
	change(e) {
		G(this, "primitive-field-change", {
			key: this.field.key,
			value: e
		});
	}
	onCoordinateChange(e, t, n) {
		if (!(n.target instanceof HTMLInputElement)) return;
		let r = Number.parseInt(n.target.value, 10);
		if (Number.isNaN(r)) {
			n.target.value = String(this.points[e][t]);
			return;
		}
		this.change(Id(this.points, e, t, r));
	}
	onXChange(e, t) {
		this.onCoordinateChange(e, 0, t);
	}
	onYChange(e, t) {
		this.onCoordinateChange(e, 1, t);
	}
	removeAt(e) {
		this.change(Fd(this.points, e));
	}
	add() {
		this.change(Pd(this.points));
	}
	renderCoordinate(e, t, n) {
		return R`
      <label class="box ${this.disabled ? "disabled" : ""}">
        <span class="inner-label">${e}</span>
        <input
          type="number"
          step="1"
          .value=${String(t)}
          .disabled=${this.disabled}
          @change=${n}
        />
      </label>
    `;
	}
	renderRow(e, n) {
		let r = t.pointsField.remove(n + 1);
		return R`
      <div class="row" data-point=${n}>
        <span class="index">${n + 1}</span>
        ${this.renderCoordinate(t.pointsField.x, e[0], (e) => this.onXChange(n, e))}
        ${this.renderCoordinate(t.pointsField.y, e[1], (e) => this.onYChange(n, e))}
        <button
          type="button"
          title=${r}
          aria-label=${r}
          .disabled=${this.disabled || !Nd(this.points)}
          @click=${() => this.removeAt(n)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `;
	}
	render() {
		let e = this.points;
		return R`
      <div class="rows" role="group" aria-label=${this.field.label}>
        ${e.map((e, t) => this.renderRow(e, t))}
      </div>
      <button
        type="button"
        class="add"
        .disabled=${this.disabled || !Md(e)}
        @click=${this.add}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        ${t.pointsField.add}
      </button>
    `;
	}
};
Y([H({ attribute: !1 })], Df.prototype, "field", void 0), Y([H({ attribute: !1 })], Df.prototype, "value", void 0), Y([H({ type: Boolean })], Df.prototype, "disabled", void 0), Df = Y([V("ods-points-field")], Df);
//#endregion
//#region src/ods-series-field.ts
var Of = [
	"sensor",
	"input_number",
	"number",
	"counter"
], kf = class extends B {
	constructor(...e) {
		super(...e), this.palette = "bwr", this.disabled = !1;
	}
	static {
		this.styles = [
			K,
			Xu,
			L`
      :host {
        display: block;
        min-width: 0;
      }
      .series {
        display: grid;
        gap: 6px;
        margin-bottom: 8px;
        padding: 8px;
        border: 1px solid var(--studio-border);
        border-radius: 8px;
        background: var(--secondary-background-color, #f3f5f6);
      }
      .series-header {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 28px;
        align-items: center;
        gap: 6px;
      }
      .series-header ha-entity-picker {
        min-width: 0;
      }
      .series button,
      .add {
        display: grid;
        place-items: center;
        height: 28px;
        padding: 0;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: var(--studio-muted);
      }
      .series button:hover:not(:disabled),
      .add:hover:not(:disabled) {
        background: var(--studio-accent-soft);
        color: var(--studio-text);
      }
      button:disabled {
        opacity: 0.4;
      }
      .series details > summary {
        cursor: pointer;
        color: var(--studio-muted);
        font-size: 11px;
      }
      .add {
        grid-auto-flow: column;
        gap: 4px;
        width: 100%;
        border: 1px dashed var(--studio-border);
        font-size: 11px;
      }
    `
		];
	}
	get list() {
		return ef(this.value);
	}
	change(e) {
		G(this, "primitive-field-change", {
			key: this.field.key,
			value: e
		});
	}
	onEntityChange(e, t) {
		t.stopPropagation(), this.change(af(this.list, e, { [Zd]: t.detail.value }));
	}
	onSettingsChange(e, t) {
		this.change(af(this.list, e, t.detail.value));
	}
	removeAt(e) {
		this.change(of(this.list, e));
	}
	add() {
		this.change([...this.list, tf(this.field)]);
	}
	get settingsSchema() {
		return (this.field.nested ?? []).filter((e) => e.key !== Zd).map((e) => Ko(e, this.palette));
	}
	renderSeries(e, n) {
		let r = t.seriesField.remove(n + 1);
		return R`
      <div class="series" data-series=${n}>
        <div class="series-header">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${String(e.entity ?? "")}
            .label=${t.seriesField.entity}
            .includeDomains=${Of}
            .disabled=${this.disabled}
            @value-changed=${(e) => this.onEntityChange(n, e)}
          ></ha-entity-picker>
          <button
            type="button"
            title=${r}
            aria-label=${r}
            .disabled=${this.disabled || !rf(this.field, this.list)}
            @click=${() => this.removeAt(n)}
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <details>
          <summary>${t.seriesField.settings}</summary>
          <ha-form
            .hass=${this.hass}
            .data=${e}
            .schema=${this.settingsSchema}
            .computeLabel=${(e) => e.label}
            @value-changed=${(e) => this.onSettingsChange(n, e)}
          ></ha-form>
        </details>
      </div>
    `;
	}
	render() {
		let e = this.list;
		return R`
      ${e.map((e, t) => this.renderSeries(e, t))}
      <button
        type="button"
        class="add"
        .disabled=${this.disabled || !nf(this.field, e)}
        @click=${this.add}
      >
        <ha-icon icon="mdi:plus"></ha-icon>
        ${t.seriesField.add}
      </button>
    `;
	}
};
Y([H({ attribute: !1 })], kf.prototype, "hass", void 0), Y([H({ attribute: !1 })], kf.prototype, "field", void 0), Y([H({ attribute: !1 })], kf.prototype, "value", void 0), Y([H({ attribute: !1 })], kf.prototype, "palette", void 0), Y([H({ type: Boolean })], kf.prototype, "disabled", void 0), kf = Y([V("ods-series-field")], kf);
//#endregion
//#region src/image-source.ts
var Af = /^(camera|image)\.[a-z0-9_]+$/, jf = /^media-source:\/\/media_source\/([^/]+)\/(.+)$/, Mf = "media-source://", Nf = (e) => Af.test(e) ? "entity" : /^https?:\/\//.test(e) || e.startsWith("data:") ? "web" : e.startsWith("/local/") || e.startsWith("/media/") || e.startsWith(Mf) ? "file" : "other", Pf = (e) => {
	let t = jf.exec(e);
	return t ? `/media/${t[1]}/${decodeURIComponent(t[2])}` : e.startsWith(Mf) ? e : void 0;
}, Ff = class extends B {
	constructor(...e) {
		super(...e), this.value = "";
	}
	static {
		this.styles = [
			K,
			Xu,
			L`
      :host {
        display: grid;
        gap: 10px;
      }
      .hint {
        margin: 0;
        color: var(--studio-muted);
        font-size: 10px;
        line-height: 1.4;
      }
    `
		];
	}
	choose(e) {
		G(this, "image-change", { image: e });
	}
	onAddress(e) {
		e.target instanceof HTMLInputElement && this.choose(e.target.value.trim());
	}
	onMedia(e) {
		e.stopPropagation();
		let t = e.detail.value.media, n = Pf(typeof t == "object" && t && "media_content_id" in t ? String(t.media_content_id) : String(t ?? ""));
		n && this.choose(n);
	}
	onEntity(e) {
		e.stopPropagation();
		let t = e.detail.value.entity;
		typeof t == "string" && t !== "" && this.choose(t);
	}
	renderForm(e, t, n, r) {
		return R`
      <ha-form
        .hass=${this.hass}
        .data=${{ [e]: "" }}
        .schema=${[{
			name: e,
			label: t,
			selector: n
		}]}
        .computeLabel=${(e) => e.label}
        @value-changed=${r}
      ></ha-form>
    `;
	}
	render() {
		let e = Nf(this.value);
		return R`
      <label>
        <span class="field-label">${t.imagePicker.address}</span>
        <span class="box">
          <input
            class="mono"
            type="text"
            aria-label=${t.imagePicker.address}
            .value=${this.value}
            @change=${this.onAddress}
          />
        </span>
      </label>
      ${this.renderForm("media", t.imagePicker.media, { media: { accept: ["image/*"] } }, this.onMedia)}
      ${this.renderForm("entity", t.imagePicker.entity, { entity: { domain: ["camera", "image"] } }, this.onEntity)}
      <p class="hint">
        ${e === "other" && this.value ? t.imagePicker.unsupported : t.imagePicker.hint}
      </p>
    `;
	}
};
Y([H({ attribute: !1 })], Ff.prototype, "hass", void 0), Y([H()], Ff.prototype, "value", void 0), Ff = Y([V("ods-image-picker")], Ff);
//#endregion
//#region src/ods-image-field.ts
var If = 250, Lf = {
	entity: "mdi:cctv",
	web: "mdi:web",
	file: "mdi:file-image-outline",
	other: "mdi:image-off-outline"
}, Rf = class extends B {
	constructor(...e) {
		super(...e), this.value = "", this.disabled = !1, this.closedAt = 0;
	}
	static {
		this.styles = [
			K,
			Xu,
			L`
      :host {
        display: block;
        min-width: 0;
      }
      .trigger {
        width: 100%;
        height: 30px;
        cursor: pointer;
        text-align: start;
      }
      .trigger .name {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        font-family: var(--code-font-family, monospace);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .trigger ha-icon {
        --mdi-icon-size: 18px;
        width: 18px;
        height: 18px;
        color: var(--studio-muted);
      }
    `
		];
	}
	openPicker(e) {
		if (this.disabled || Date.now() - this.closedAt < If) return;
		let t = e.currentTarget;
		t instanceof HTMLElement && (this.anchor = t.getBoundingClientRect());
	}
	close() {
		this.closedAt = Date.now(), this.anchor = void 0;
	}
	onImageChange(e) {
		G(this, "primitive-field-change", {
			key: this.field.key,
			value: e.detail.image
		}), this.close();
	}
	renderPicker() {
		return this.anchor ? R`
      <ods-popover
        .heading=${this.field.label}
        .anchor=${this.anchor}
        .width=${288}
        @popover-close=${this.close}
      >
        <ods-image-picker
          .hass=${this.hass}
          .value=${this.value}
          @image-change=${this.onImageChange}
        ></ods-image-picker>
      </ods-popover>
    ` : z;
	}
	render() {
		let e = Nf(this.value);
		return R`
      <span class="field-label">${this.field.label}</span>
      <button
        type="button"
        class="box trigger ${this.disabled ? "disabled" : ""}"
        aria-label=${this.field.label}
        aria-haspopup="dialog"
        title=${this.value}
        @click=${this.openPicker}
      >
        <ha-icon icon=${Lf[e]}></ha-icon>
        <span class="name">${this.value || t.imagePicker.empty}</span>
      </button>
      ${this.renderPicker()}
    `;
	}
};
Y([H({ attribute: !1 })], Rf.prototype, "hass", void 0), Y([H({ attribute: !1 })], Rf.prototype, "field", void 0), Y([H()], Rf.prototype, "value", void 0), Y([H({ type: Boolean })], Rf.prototype, "disabled", void 0), Y([U()], Rf.prototype, "anchor", void 0), Rf = Y([V("ods-image-field")], Rf);
//#endregion
//#region src/ods-value-field.ts
var zf = 250, Bf = 4, Vf = "lt", Hf = class extends B {
	constructor(...e) {
		super(...e), this.palette = "bw", this.display = {
			width: 800,
			height: 480
		}, this.disabled = !1, this.closedAt = 0;
	}
	static {
		this.styles = [
			K,
			Xu,
			L`
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
		G(this, "primitive-field-change", {
			key: this.field.key,
			value: e
		});
	}
	openPicker(e, t) {
		if (this.disabled || Date.now() - this.closedAt < zf) return;
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
		let n = Ze(this.field.min, this.display, -Infinity), r = Ze(this.field.max, this.display, Infinity);
		this.change(Math.min(r, Math.max(n, Math.round(Number(t)))));
	}
	onTextChange(e) {
		let t = e.target;
		(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement) && this.change(t.value);
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
		let t = jo(this.field, e.detail.value[this.field.key]);
		t !== wo && this.change(t);
	}
	renderNumber() {
		let { label: e, unit: t, key: n } = this.field, r = this.value === null || this.value === void 0;
		return R`
      <ods-property-field
        .label=${e}
        .fieldKey=${`value-${n}`}
        .unit=${t ?? ""}
        .value=${r ? null : Number(this.value)}
        .min=${Ze(this.field.min, this.display, -Infinity)}
        .max=${Ze(this.field.max, this.display, Infinity)}
        .disabled=${this.disabled}
        @field-change=${this.onNumberChange}
      ></ods-property-field>
    `;
	}
	renderBoolean() {
		return R`
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
	optionLabel(e) {
		return this.field.optionLabels?.[e] ?? e;
	}
	renderSegmented(e) {
		return R`
      <div class="segmented" role="group" aria-label=${this.field.label}>
        ${e.map((e) => R`
            <button
              type="button"
              aria-pressed=${this.value === e ? "true" : "false"}
              .disabled=${this.disabled}
              @click=${() => this.change(e)}
            >
              ${this.optionLabel(e)}
            </button>
          `)}
      </div>
    `;
	}
	renderSelect(e, t = !1) {
		let n = String(this.value ?? ""), r = t && !e.includes(n) ? [...e, n] : e;
		return R`
      <div class="box ${this.disabled ? "disabled" : ""}">
        <select
          aria-label=${this.field.label}
          .disabled=${this.disabled}
          @change=${this.onTextChange}
        >
          ${r.map((e) => R`
              <option value=${e} ?selected=${e === n}>
                ${this.optionLabel(e)}
              </option>
            `)}
        </select>
      </div>
    `;
	}
	renderAnchorMark(e) {
		return R`
      <span class="anchor-mark">
        ${cf.map((t) => R`
            <i class=${t === e ? "on" : ""}></i>
          `)}
      </span>
    `;
	}
	renderAnchor() {
		let e = String(this.value ?? "") || Vf, n = lf(e) ? t.anchors[e] : e;
		return R`
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
		return this.field.key === "anchor" ? this.renderAnchor() : e.length <= Bf && e.every((e) => this.optionLabel(e).length <= 10) ? this.renderSegmented(e) : this.renderSelect(e);
	}
	colorName() {
		let e = String(this.value ?? "");
		return bo(go[this.palette].find((t) => t.value === e)?.id ?? e);
	}
	renderColor() {
		let e = this.value === null || this.value === void 0 ? "" : String(this.value), n = e ? yo(e, this.palette) : void 0, r = this.field.nullable && e !== "" && !this.disabled;
		return R`
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
        ${r ? R`
                <button
                  type="button"
                  class="clear"
                  aria-label=${t.colors.clear}
                  @click=${this.clearColor}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              ` : z}
      </div>
    `;
	}
	onTriggerKey(e) {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), this.openColorPicker(e));
	}
	renderText() {
		return this.field.shape === "text" ? R`
        <textarea
          class="compact"
          rows="3"
          aria-label=${this.field.label}
          .value=${String(this.value ?? "")}
          .disabled=${this.disabled}
          @change=${this.onTextChange}
        ></textarea>
      ` : R`
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
	renderPoints() {
		return R`
      <ods-points-field
        .field=${this.field}
        .value=${this.value}
        .disabled=${this.disabled}
      ></ods-points-field>
    `;
	}
	renderIcon() {
		return R`
      <ods-icon-field
        .hass=${this.hass}
        .field=${this.field}
        .value=${this.value}
        .disabled=${this.disabled}
      ></ods-icon-field>
    `;
	}
	renderImage() {
		return R`
      <ods-image-field
        .hass=${this.hass}
        .field=${this.field}
        .value=${String(this.value ?? "")}
        .disabled=${this.disabled}
      ></ods-image-field>
    `;
	}
	renderFlags() {
		let e = new Set(String(this.value ?? "").split(","));
		return R`
      <div class="chips" role="group" aria-label=${this.field.label}>
        ${(this.field.options ?? []).map((t) => R`
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
	renderSeries() {
		return R`
      <ods-series-field
        .hass=${this.hass}
        .field=${this.field}
        .value=${this.value}
        .palette=${this.palette}
        .disabled=${this.disabled}
      ></ods-series-field>
    `;
	}
	renderNested() {
		return Qd(this.field) ? this.renderSeries() : R`
      <ha-form
        .hass=${this.hass}
        .data=${{ [this.field.key]: Ao(this.field, this.value) }}
        .schema=${[Ko(this.field, this.palette)]}
        .computeLabel=${(e) => e.label}
        @value-changed=${this.onFormChange}
      ></ha-form>
    `;
	}
	isLabelledInside() {
		return this.field.shape === "icon" || this.field.shape === "icons" || this.field.shape === "image" || this.field.shape === "number" || this.field.shape === "coordinate" || this.field.shape === "boolean" || this.field.shape === "object" || this.field.shape === "objects" && !Qd(this.field);
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
			case "icon":
			case "icons": return this.renderIcon();
			case "image": return this.renderImage();
			case "points": return this.renderPoints();
			case "object":
			case "objects": return this.renderNested();
			default: return this.renderText();
		}
	}
	renderPicker() {
		let e = this.picker;
		if (!e) return z;
		let t = e.kind === "color";
		return R`
      <ods-popover
        .heading=${this.field.label}
        .anchor=${e.anchor}
        .width=${t ? 232 : 96}
        @popover-close=${this.closePicker}
      >
        ${t ? R`
                <ods-color-picker
                  .palette=${this.palette}
                  .value=${String(this.value ?? "")}
                  .nullable=${!!this.field.nullable}
                  @color-change=${this.onColorChange}
                ></ods-color-picker>
              ` : R`
                <ods-anchor-picker
                  .value=${String(this.value ?? "") || Vf}
                  @anchor-change=${this.onAnchorChange}
                ></ods-anchor-picker>
              `}
      </ods-popover>
    `;
	}
	render() {
		return R`
      ${this.isLabelledInside() ? z : R`
          <span class="field-label">${this.field.label}</span>
        `} ${this.renderControl()} ${this.renderPicker()}
    `;
	}
};
Y([H({ attribute: !1 })], Hf.prototype, "hass", void 0), Y([H({ attribute: !1 })], Hf.prototype, "field", void 0), Y([H({ attribute: !1 })], Hf.prototype, "value", void 0), Y([H()], Hf.prototype, "palette", void 0), Y([H({ attribute: !1 })], Hf.prototype, "display", void 0), Y([H({ type: Boolean })], Hf.prototype, "disabled", void 0), Y([U()], Hf.prototype, "picker", void 0), Hf = Y([V("ods-value-field")], Hf);
//#endregion
//#region src/ods-import-dialog.ts
var Uf = class extends B {
	constructor(...e) {
		super(...e), this.colors = [], this.replaces = !1, this.busy = !1, this.adjusted = !1, this.mapping = {};
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
        width: min(480px, 100%);
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
      .body {
        display: grid;
        gap: 12px;
        padding: 4px 20px 16px;
        font-size: 13px;
        line-height: 1.5;
      }
      .body p {
        margin: 0;
        color: var(--studio-muted);
      }
      .mapping {
        display: grid;
        gap: 8px;
      }
      .mapping-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1.4fr);
        align-items: center;
        gap: 8px;
      }
      .source {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        font-family: var(--code-font-family, monospace);
        font-size: 12px;
      }
      .swatch {
        flex: none;
        width: 18px;
        height: 18px;
        border: 1px solid var(--studio-border);
        border-radius: 5px;
      }
      .arrow {
        color: var(--studio-muted);
        text-align: center;
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
	willUpdate(e) {
		e.has("colors") && (this.mapping = Ou(this.colors));
	}
	get palette() {
		return this.display.palette;
	}
	cancel() {
		G(this, "import-cancel");
	}
	confirm() {
		G(this, "import-confirm", { colorMap: this.mapping });
	}
	onScrimClick(e) {
		e.target === e.currentTarget && this.cancel();
	}
	onTargetChange(e) {
		e.stopPropagation();
		let { key: t, value: n } = e.detail;
		typeof n == "string" && (this.mapping = {
			...this.mapping,
			[t]: n
		});
	}
	targetField(e) {
		return {
			key: e.source,
			label: "",
			shape: "color",
			section: "appearance",
			default: e.suggestion
		};
	}
	renderRow(e) {
		let t = vo(e.source) ?? "transparent";
		return R`
      <div class="mapping-row" data-source-color=${e.source}>
        <span class="source">
          <span class="swatch" style=${`background: ${t}`}></span>
          ${e.source}
        </span>
        <span class="arrow" aria-hidden="true">→</span>
        <ods-value-field
          .hass=${this.hass}
          .field=${this.targetField(e)}
          .value=${this.mapping[e.source] ?? e.suggestion}
          .palette=${this.palette}
          .display=${this.display}
          @primitive-field-change=${this.onTargetChange}
        ></ods-value-field>
      </div>
    `;
	}
	renderMapping() {
		return this.colors.length === 0 ? z : R`
      <ha-alert alert-type="warning">
        <strong>${t.importDialog.colorsTitle}</strong>
        <br />
        ${t.importDialog.colorsHelp}
      </ha-alert>
      <div class="mapping">
        ${this.colors.map((e) => this.renderRow(e))}
      </div>
    `;
	}
	renderReplaceNotice() {
		return this.replaces ? R`
      <p>${t.importDialog.replaces}</p>
    ` : z;
	}
	renderAdjusted() {
		return this.adjusted ? R`
      <ha-alert alert-type="info">${t.importDialog.adjusted}</ha-alert>
    ` : z;
	}
	render() {
		return R`
      <div class="scrim" role="presentation" @click=${this.onScrimClick}>
        <section
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-title"
        >
          <header>
            <div>
              <span class="eyebrow">${t.importDialog.eyebrow}</span>
              <h2 id="import-title">${t.importDialog.heading}</h2>
            </div>
            <button
              class="icon-button"
              aria-label=${t.common.close}
              @click=${this.cancel}
            >
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="body">
            ${this.renderReplaceNotice()} ${this.renderAdjusted()}
            ${this.renderMapping()}
          </div>
          <footer>
            <ha-button appearance="plain" @click=${this.cancel}>
              ${t.common.cancel}
            </ha-button>
            <ha-button
              appearance="filled"
              .disabled=${this.busy}
              @click=${this.confirm}
            >
              ${t.importDialog.confirm}
            </ha-button>
          </footer>
        </section>
      </div>
    `;
	}
};
Y([H({ attribute: !1 })], Uf.prototype, "hass", void 0), Y([H({ attribute: !1 })], Uf.prototype, "colors", void 0), Y([H({ type: Boolean })], Uf.prototype, "replaces", void 0), Y([H({ type: Boolean })], Uf.prototype, "busy", void 0), Y([H({ type: Boolean })], Uf.prototype, "adjusted", void 0), Y([H({ attribute: !1 })], Uf.prototype, "display", void 0), Y([U()], Uf.prototype, "mapping", void 0), Uf = Y([V("ods-import-dialog")], Uf);
//#endregion
//#region src/ods-context-menu.ts
var Wf = class extends B {
	constructor(...e) {
		super(...e), this.entries = [], this.label = "";
	}
	static {
		this.styles = [K, L`
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
		e.stopPropagation(), G(this, "menu-select", { id: t.id });
	}
	renderEntry(e) {
		return R`
      ${e.separatorBefore ? R`
              <div class="separator" role="separator"></div>
            ` : z}
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
		return R`
      <div class="menu" role="menu" aria-label=${this.label}>
        ${this.entries.map((e) => this.renderEntry(e))}
      </div>
    `;
	}
};
Y([H({ attribute: !1 })], Wf.prototype, "entries", void 0), Y([H()], Wf.prototype, "label", void 0), Wf = Y([V("ods-context-menu")], Wf);
//#endregion
//#region src/ods-shortcuts-dialog.ts
var Gf = [
	"edit",
	"arrange",
	"group",
	"view",
	"history"
], Kf = class extends B {
	static {
		this.styles = [
			K,
			Ju,
			L`
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
		G(this, "shortcuts-close");
	}
	onScrimClick(e) {
		e.target === e.currentTarget && this.close();
	}
	renderGroup(e) {
		let n = Cu(), r = Ml.filter((t) => t.group === e && t.shortcuts.length > 0).map((e) => {
			let t = Bl(e, {
				canUndo: !0,
				canRedo: !0
			}, n), r = e.shortcuts.map((t) => Bl({
				...e,
				shortcuts: [t]
			}, {
				canUndo: !0,
				canRedo: !0
			}, n).shortcut).join(" · ");
			return R`
        <dt>${t.label}</dt>
        <dd>${r}</dd>
      `;
		});
		return R`
      <section>
        <h3>${t.shortcuts.groups[e]}</h3>
        <dl>${r}</dl>
      </section>
    `;
	}
	render() {
		return R`
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
          ${Gf.map((e) => this.renderGroup(e))}
        </div>
      </div>
    `;
	}
};
Kf = Y([V("ods-shortcuts-dialog")], Kf);
//#endregion
//#region src/ods-dashboard-card.ts
var qf = [
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
], Jf = class extends B {
	constructor(...e) {
		super(...e), this.language = "en", this.menuOpen = !1, this.renaming = !1, this.draftName = "";
	}
	static {
		this.styles = [
			K,
			Ju,
			Yu,
			L`
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
		G(this, "dashboard-open", { dashboard: this.dashboard });
	}
	toggleMenu(e) {
		e.stopPropagation(), G(this, "dashboard-menu-toggle", { dashboardId: this.dashboard.id });
	}
	onMenuSelect(e) {
		let t = qf.find((t) => t.id === e.detail.id);
		t && (e.stopPropagation(), G(this, "dashboard-menu-action", {
			dashboard: this.dashboard,
			action: t.id
		}));
	}
	onRenameInput(e) {
		G(this, "dashboard-rename-input", { name: xu(e) });
	}
	onRenameKeyDown(e) {
		e.stopPropagation(), e.key === "Enter" ? (e.preventDefault(), G(this, "dashboard-rename-commit")) : e.key === "Escape" && (e.preventDefault(), G(this, "dashboard-rename-cancel"));
	}
	commitRename() {
		G(this, "dashboard-rename-commit");
	}
	renderMiniature() {
		let { display: e } = this.dashboard;
		return R`
      <div class="dashboard-card-preview">
        <div class="dashboard-miniature" style=${W({
			aspectRatio: `${e.width} / ${e.height}`,
			background: e.background,
			"--dashboard-accent": yu(e.palette)
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
		return R`
      <span class="dashboard-card-title">
        ${this.renaming ? R`
                <input
                  class="dashboard-rename-input"
                  aria-label=${t.gallery.renameField(e)}
                  .value=${this.draftName}
                  @input=${this.onRenameInput}
                  @keydown=${this.onRenameKeyDown}
                  @blur=${this.commitRename}
                />
              ` : R`
                <strong>${e}</strong>
              `}
        <span class=${`status ${n}`}>${n}</span>
      </span>
    `;
	}
	renderMeta() {
		let { display: e } = this.dashboard;
		return R`
      <span class="dashboard-card-meta">
        <span>${t.common.size(e.width, e.height)}</span>
        <span
          class="palette-dots"
          aria-label=${mo[e.palette]}
        >
          ${ho[e.palette].map((e) => R`
              <i style=${W({ background: e })}></i>
            `)}
        </span>
        <span>${mo[e.palette]}</span>
      </span>
    `;
	}
	renderMenu() {
		return this.menuOpen ? R`
      <ods-context-menu
        class="dashboard-menu"
        id=${this.menuId}
        label=${t.gallery.menuFor(this.dashboard.name)}
        .entries=${qf}
        @menu-select=${this.onMenuSelect}
      ></ods-context-menu>
    ` : z;
	}
	render() {
		let e = this.dashboard;
		return R`
      <article class=${Zu({
			"dashboard-card": !0,
			"menu-open": this.menuOpen
		})} data-dashboard-id=${e.id}>
        ${this.renderMiniature()}
        <div class="dashboard-card-copy">
          ${this.renderTitle()} ${this.renderMeta()}
          <small>
            ${t.gallery.updated(bu(e, this.language))}
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
Y([H({ attribute: !1 })], Jf.prototype, "dashboard", void 0), Y([H()], Jf.prototype, "language", void 0), Y([H({ type: Boolean })], Jf.prototype, "menuOpen", void 0), Y([H({ type: Boolean })], Jf.prototype, "renaming", void 0), Y([H()], Jf.prototype, "draftName", void 0), Y([$c(".dashboard-rename-input")], Jf.prototype, "renameInput", void 0), Jf = Y([V("ods-dashboard-card")], Jf);
//#endregion
//#region src/ods-gallery.ts
var Yf = class extends B {
	constructor(...e) {
		super(...e), this.dashboards = [], this.error = "", this.saving = !1, this.searchText = "", this.sort = "updated", this.menuDashboardId = "", this.onOutsidePointerDown = (e) => {
			this.menuDashboardId && (e.composedPath().some((e) => e instanceof HTMLElement && (e.classList.contains("dashboard-menu") || e.classList.contains("dashboard-menu-trigger"))) || (this.menuDashboardId = ""));
		}, this.onKeyDown = (e) => {
			e.key === "Escape" && (this.menuDashboardId ? (this.menuDashboardId = "", e.stopPropagation()) : this.dialog && (G(this, "dashboard-dialog-close"), e.stopPropagation()));
		};
	}
	static {
		this.styles = [
			K,
			Ju,
			Yu,
			L`
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
		this.searchText = xu(e);
	}
	onSortChange(e) {
		this.sort = xu(e) === "name" ? "name" : "updated";
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
		G(this, "dashboard-settings-change", { value: e.detail.value });
	}
	renderCard(e) {
		let t = this.dialog === "rename" && this.draft?.id === e.id;
		return R`
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
		return !e || !this.dialog || this.dialog === "rename" ? z : this.dialog === "delete" ? R`
        <ha-dialog
          .open=${!0}
          width="small"
          header-title=${t.gallery.deleteTitle}
          @closed=${() => G(this, "dashboard-dialog-close")}
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
              @click=${() => G(this, "dashboard-dialog-close")}
            >
              ${t.common.cancel}
            </ha-button>
            <ha-button
              slot="primaryAction"
              variant="danger"
              appearance="filled"
              .disabled=${this.saving}
              @click=${() => G(this, "dashboard-delete-confirm")}
            >
              ${this.saving ? t.gallery.deleting : t.gallery.deleteAction}
            </ha-button>
          </ha-dialog-footer>
        </ha-dialog>
      ` : R`
      <ha-dialog
        .open=${!0}
        width="medium"
        header-title=${t.gallery.settingsTitle}
        header-subtitle=${e.name}
        @closed=${() => G(this, "dashboard-dialog-close")}
      >
        <div class="dashboard-settings-content">
          <ha-form
            autofocus
            .hass=${this.hass}
            .data=${Ql(e)}
            .schema=${gu(lu(e))}
            .computeLabel=${_u}
            @value-changed=${this.settingsChanged}
          ></ha-form>
        </div>
        <ha-dialog-footer slot="footer">
          <ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${() => G(this, "dashboard-dialog-close")}
          >
            ${t.common.cancel}
          </ha-button>
          <ha-button
            slot="primaryAction"
            appearance="filled"
            .disabled=${this.saving || !ru(e)}
            @click=${() => G(this, "dashboard-settings-save")}
          >
            ${this.saving ? t.gallery.saving : t.gallery.settingsSave}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
	render() {
		let e = iu(this.dashboards, this.searchText, this.sort, this.language);
		return R`
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
            @click=${() => G(this, "dashboard-new")}
          >
            <span class="dashboard-new-button-label">
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>${t.gallery.newDashboard}</span>
            </span>
          </ha-button>
        </header>
        ${this.error ? R`
                <ha-alert alert-type="error">${this.error}</ha-alert>
              ` : z}
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
            @click=${() => G(this, "dashboard-new")}
          >
            <ha-icon icon="mdi:plus"></ha-icon>
            <strong>${t.gallery.newDashboard}</strong>
          </button>
          ${e.map((e) => this.renderCard(e))}
          ${e.length ? z : R`
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
Y([H({ attribute: !1 })], Yf.prototype, "dashboards", void 0), Y([H({ attribute: !1 })], Yf.prototype, "hass", void 0), Y([H()], Yf.prototype, "error", void 0), Y([H({ type: Boolean })], Yf.prototype, "saving", void 0), Y([H()], Yf.prototype, "dialog", void 0), Y([H({ attribute: !1 })], Yf.prototype, "draft", void 0), Y([U()], Yf.prototype, "searchText", void 0), Y([U()], Yf.prototype, "sort", void 0), Y([U()], Yf.prototype, "menuDashboardId", void 0), Yf = Y([V("ods-gallery")], Yf);
//#endregion
//#region src/ods-header.ts
var Xf = class extends B {
	constructor(...e) {
		super(...e), this.view = "design", this.dirty = !1, this.saving = !1, this.sending = !1;
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
		G(this, "dashboard-name-change", { name: xu(e) });
	}
	get statusToggleLabel() {
		return this.dashboard.status === "ready" ? t.header.setDraft : t.header.setReady;
	}
	sendToDevice() {
		G(this, "send-to-device");
	}
	renderFileButtons() {
		return R`
      <ha-button
        appearance="plain"
        title=${t.header.exportTitle}
        @click=${() => G(this, "dashboard-export")}
      >
        <ha-icon slot="start" icon="mdi:download"></ha-icon>
        ${t.header.exportDashboard}
      </ha-button>
      <ha-button
        appearance="plain"
        title=${t.header.importTitle}
        @click=${() => G(this, "dashboard-import")}
      >
        <ha-icon slot="start" icon="mdi:upload"></ha-icon>
        ${t.header.importDashboard}
      </ha-button>
    `;
	}
	renderSendButton() {
		return this.dashboard.display.deviceId ? R`
      <ha-button
        appearance="plain"
        .disabled=${this.sending}
        @click=${this.sendToDevice}
      >
        <ha-icon slot="start" icon="mdi:send"></ha-icon>
        ${this.sending ? t.header.sendingToDevice : t.header.sendToDevice}
      </ha-button>
    ` : z;
	}
	render() {
		let e = this.dashboard;
		return R`
      <header class="topbar">
        <div class="editor-breadcrumb">
          <strong class="studio-name">${t.header.studio}</strong>
          <span class="breadcrumb-divider">/</span>
          <button
            class="breadcrumb-link"
            @click=${() => G(this, "show-dashboards")}
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
            @click=${() => G(this, "view-change", { view: "design" })}
          >
            <ha-icon icon="mdi:tools"></ha-icon>
            ${t.header.design}
          </button>
          <button
            class=${this.view === "code" ? "active" : ""}
            aria-pressed=${this.view === "code"}
            @click=${() => G(this, "view-change", { view: "code" })}
          >
            <ha-icon icon="mdi:code-tags"></ha-icon>
            ${t.header.code}
          </button>
        </nav>
        <div class="editor-actions">
          ${this.renderFileButtons()} ${this.renderSendButton()}
          <span class="status ${e.status}">${e.status}</span>
          <ha-button
            appearance="plain"
            @click=${() => G(this, "toggle-ready")}
          >
            ${this.statusToggleLabel}
          </ha-button>
          <button
            class="icon-button"
            title=${t.header.help}
            aria-label=${t.header.help}
            @click=${() => G(this, "help-open")}
          >
            <ha-icon icon="mdi:keyboard-outline"></ha-icon>
          </button>
          <ha-button
            appearance="filled"
            .disabled=${!this.dirty || this.saving}
            @click=${() => G(this, "dashboard-save")}
          >
            ${this.saving ? t.header.saving : t.header.save}
          </ha-button>
        </div>
      </header>
    `;
	}
};
Y([H({ attribute: !1 })], Xf.prototype, "dashboard", void 0), Y([H()], Xf.prototype, "view", void 0), Y([H({ type: Boolean })], Xf.prototype, "dirty", void 0), Y([H({ type: Boolean })], Xf.prototype, "saving", void 0), Y([H({ type: Boolean })], Xf.prototype, "sending", void 0), Xf = Y([V("ods-header")], Xf);
//#endregion
//#region src/item-labels.ts
var Zf = (e, t, n) => {
	if (e.kind === "widget") return t.find((t) => t.id === e.widget.type);
	if (e.kind !== "container") return n.find((t) => t.type === e.primitive.type);
}, Qf = (e, t, n) => e.kind === "container" ? e.grouped ? "mdi:group" : "mdi:select-all" : Zf(e, t, n)?.icon ?? "mdi:puzzle", $f = (e, t) => JSON.stringify(e ?? null) === JSON.stringify(t ?? null), ep = (e, t, n = {}) => e.filter((e) => e.key in n || !$f(t[e.key], e.default)), tp = (e) => Object.fromEntries(e.map((e) => [e.key, e.default ?? null])), np = "{{  }}", rp = class extends B {
	constructor(...e) {
		super(...e), this.label = "", this.fieldKey = "", this.disabled = !1, this.focusEditor = !1;
	}
	static {
		this.styles = [K, L`
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
		G(this, "expression-change", {
			key: this.fieldKey,
			template: e
		});
	}
	toggle() {
		this.change(this.expression === void 0 ? void 0 : null);
	}
	onLiteralInput(e) {
		let t = e.composedPath()[0];
		t instanceof HTMLInputElement && t.type === "text" && t.value.trimStart().startsWith("{") && (this.focusEditor = !0, this.change(np));
	}
	onEditorChange(e) {
		if (!(e.target instanceof HTMLTextAreaElement)) return;
		let t = e.target.value;
		this.change(Sn(t) ? t : null);
	}
	renderEditor(e) {
		return R`
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
		return R`
      <div class="row" @input=${e ? z : this.onLiteralInput}>
        ${this.expression === void 0 ? R`
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
Y([H()], rp.prototype, "label", void 0), Y([H()], rp.prototype, "fieldKey", void 0), Y([H()], rp.prototype, "expression", void 0), Y([H({ type: Boolean })], rp.prototype, "disabled", void 0), Y([$c("textarea")], rp.prototype, "editor", void 0), rp = Y([V("ods-expression-field")], rp);
//#endregion
//#region src/structure-model.ts
var ip = (e, t) => `${e.name} ${p(e)}`.toLocaleLowerCase().includes(t), ap = (e, t) => {
	let n = /* @__PURE__ */ new Set();
	for (let r of D(e)) if (ip(r, t)) {
		n.add(r.id);
		for (let t of wt(e, r.id)) n.add(t.id);
	}
	return n;
}, op = (e, t, n, r) => [...e].reverse().flatMap((e) => {
	if (r && !r.has(e.id)) return [];
	let i = {
		item: e,
		depth: t
	};
	return w(e) && (r || !n.has(e.id)) ? [i, ...op(e.children, t + 1, n, r)] : [i];
}), sp = (e, t, n = "") => {
	let r = n.trim().toLocaleLowerCase();
	return op(e, 0, t, r ? ap(e, r) : void 0);
}, cp = (e, t) => t && e >= .25 && e <= .75 ? "inside" : e < .5 ? "before" : "after", lp = (e, t, n) => {
	let r = e.findIndex((e) => e.item.id === t);
	return r < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, r + n))];
}, up = 4, dp = 16, fp = (e) => {
	let t = [
		"toggle-hidden",
		"toggle-locked",
		"delete-item"
	];
	return w(e) ? [...e.grouped ? ["enter-group", "ungroup"] : ["group"], ...t] : t;
}, Z = class extends B {
	constructor(...e) {
		super(...e), this.items = [], this.widgets = [], this.primitives = [], this.selectedItemId = "", this.selectedItemIds = [], this.enteredGroupId = "", this.renameRequestId = "", this.collapsed = /* @__PURE__ */ new Set(), this.searchText = "", this.renamingId = "", this.draggingId = "", this.suppressClick = !1;
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
        padding: 2px 3px 2px calc(var(--depth, 0) * ${dp}px + 3px);
        border: 1px solid transparent;
        border-radius: 5px;
      }
      .layer-row[data-depth]:not([data-depth="0"])::after {
        content: "";
        position: absolute;
        left: calc(var(--depth) * ${dp}px - 5px);
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
			let e = E(this.items, this.renameRequestId);
			e && this.startRename(e), G(this, "rename-handled");
		}
		e.has("selectedItemId") && this.selectedItemId && this.scrollToRow(this.selectedItemId);
	}
	expandAbove(e) {
		let t = wt(this.items, e).filter((e) => this.collapsed.has(e.id));
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
		this.searchText = xu(e);
	}
	startRename(e) {
		this.renamingId = e.id, this.updateComplete.then(() => this.shadowRoot?.querySelector(".rename")?.select());
	}
	commitRename(e, t) {
		this.renamingId === t.id && (this.renamingId = "", G(this, "item-rename", {
			itemId: t.id,
			name: xu(e)
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
		this.stopGesture = kd({
			origin: e,
			threshold: up,
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
				}, 0), n && r && G(this, "layers-reorder", {
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
		let r = n.dataset.itemId, i = r ? E(this.items, r) : void 0;
		if (!i || Tt(this.items, i.id, t)) return;
		let a = n.getBoundingClientRect();
		return {
			itemId: i.id,
			zone: cp((e.clientY - a.top) / a.height, w(i))
		};
	}
	clearDrag() {
		this.draggingId = "", this.dropTarget = void 0;
	}
	runCommand(e, t, n) {
		e.stopPropagation(), G(this, "command", {
			id: t,
			itemId: n.id
		});
	}
	collapse() {
		G(this, "inspector-collapse", { collapsed: !0 });
	}
	selectRow(e, t) {
		this.suppressClick || G(this, "item-select", {
			itemId: t.id,
			additive: e.shiftKey
		});
	}
	selectRoot() {
		G(this, "item-select", { itemId: "" });
	}
	exitGroup() {
		G(this, "command", { id: "exit-group" });
	}
	onRowContextMenu(e, t) {
		e.preventDefault(), e.stopPropagation(), G(this, "context-menu", {
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
		e.target === e.currentTarget && (e.key === " " && (e.preventDefault(), G(this, "item-select", { itemId: t.id })), e.key === "F2" && (e.preventDefault(), this.startRename(t)));
	}
	onTreeKeyDown(e) {
		if (e.target instanceof HTMLInputElement) return;
		let t = sp(this.items, this.collapsed, this.searchText), n = E(this.items, this.selectedItemId);
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			let n = lp(t, this.selectedItemId, e.key === "ArrowDown" ? 1 : -1);
			n && this.focusAndSelect(n);
		}
		e.key === "ArrowLeft" && n && (e.preventDefault(), this.foldOrGoUp(n, t)), e.key === "ArrowRight" && n && (e.preventDefault(), this.unfoldOrGoDown(n, t));
	}
	focusAndSelect(e) {
		G(this, "item-select", { itemId: e.item.id }), this.updateComplete.then(() => this.shadowRoot?.querySelector(`.layer-row[data-item-id="${CSS.escape(e.item.id)}"]`)?.focus());
	}
	foldOrGoUp(e, t) {
		if (w(e) && !this.collapsed.has(e.id)) {
			this.collapsed = /* @__PURE__ */ new Set([...this.collapsed, e.id]);
			return;
		}
		let n = wt(this.items, e.id)[0], r = n && t.find((e) => e.item.id === n.id);
		r && this.focusAndSelect(r);
	}
	unfoldOrGoDown(e, t) {
		if (!w(e)) return;
		if (this.collapsed.has(e.id)) {
			let t = new Set(this.collapsed);
			t.delete(e.id), this.collapsed = t;
			return;
		}
		let n = e.children[e.children.length - 1], r = n && t.find((e) => e.item.id === n.id);
		r && this.focusAndSelect(r);
	}
	renderCommandButton(e, t) {
		let n = Dl(t), r = Pl(e);
		if (!r.isEnabled(n)) return z;
		let i = Bl(r, n, Cu());
		return R`
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
		if (!w(e)) return R`
        <span></span>
      `;
		let t = !this.collapsed.has(e.id);
		return R`
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
		return this.renamingId === e.id ? R`
      <input
        class="rename"
        aria-label=${t.structure.rename}
        .value=${e.name}
        @click=${(e) => e.stopPropagation()}
        @keydown=${(t) => this.onRenameKeyDown(t, e)}
        @blur=${(t) => this.commitRename(t, e)}
      />
    ` : R`
        <strong>${e.name}</strong>
      `;
	}
	kindLabel(e) {
		return e.kind === "widget" ? t.structure.widget : e.kind === "container" ? e.grouped ? t.structure.group : t.structure.container : e.primitive.type;
	}
	renderCaption(e) {
		return R`
      <small>
        ${this.kindLabel(e)}
        ${w(e) ? R`
                <span>(${e.children.length})</span>
              ` : z}
        ${w(e) && e.grouped ? R`
                <span class="badge">${t.structure.groupBadge}</span>
              ` : z}
      </small>
    `;
	}
	renderRow(e) {
		let { item: t, depth: n } = e, r = this.dropTarget?.itemId === t.id ? this.dropTarget.zone : void 0, i = Zu({
			"layer-row": !0,
			active: this.selectedItemIds.includes(t.id),
			"is-hidden": t.hidden,
			dragging: t.id === this.draggingId,
			"drop-before": r === "before",
			"drop-after": r === "after",
			"drop-inside": r === "inside"
		});
		return R`
      <div
        role="treeitem"
        tabindex="0"
        aria-label=${t.name}
        aria-level=${n + 1}
        aria-expanded=${w(t) ? !this.collapsed.has(t.id) : z}
        aria-selected=${this.selectedItemIds.includes(t.id)}
        data-item-id=${t.id}
        data-depth=${n}
        style=${W({ "--depth": String(n) })}
        class=${i}
        @pointerdown=${(e) => this.onRowPointerDown(e, t)}
        @click=${(e) => this.selectRow(e, t)}
        @contextmenu=${(e) => this.onRowContextMenu(e, t)}
        @keydown=${(e) => this.onRowKeyDown(e, t)}
      >
        ${this.renderChevron(t)}
        <ha-icon
          class="layer-type-icon"
          .icon=${Qf(t, this.widgets, this.primitives)}
        ></ha-icon>
        <span>${this.renderName(t)} ${this.renderCaption(t)}</span>
        <div class="layer-actions">
          ${fp(t).map((e) => this.renderCommandButton(e, t))}
        </div>
      </div>
    `;
	}
	renderRootRow() {
		let e = this.dropTarget?.itemId === "" && this.dropTarget.zone === "inside";
		return R`
      <div
        class=${Zu({
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
		let e = E(this.items, this.enteredGroupId);
		return e ? R`
      <nav class="breadcrumb" aria-label=${t.structure.breadcrumb}>
        <span>${t.structure.rootName}</span>
        <span>›</span>
        <strong>${e.name}</strong>
        <button @click=${this.exitGroup}>${t.structure.exit}</button>
      </nav>
    ` : z;
	}
	renderRows() {
		let e = sp(this.items, this.collapsed, this.searchText);
		return this.items.length === 0 ? R`
        <p class="empty-layers">${t.structure.empty}</p>
      ` : R`
      ${this.renderRootRow()} ${e.map((e) => this.renderRow(e))}
    `;
	}
	render() {
		return R`
      <section class="layers">
        <header>
          <div>
            <span class="eyebrow">${t.structure.title}</span>
            <h2>${t.structure.heading}</h2>
          </div>
          <div class="layers-header-actions">
            <span class="count">${Ct(this.items)}</span>
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
Y([H({ attribute: !1 })], Z.prototype, "items", void 0), Y([H({ attribute: !1 })], Z.prototype, "widgets", void 0), Y([H({ attribute: !1 })], Z.prototype, "primitives", void 0), Y([H()], Z.prototype, "selectedItemId", void 0), Y([H({ attribute: !1 })], Z.prototype, "selectedItemIds", void 0), Y([H()], Z.prototype, "enteredGroupId", void 0), Y([H()], Z.prototype, "renameRequestId", void 0), Y([U()], Z.prototype, "collapsed", void 0), Y([U()], Z.prototype, "searchText", void 0), Y([U()], Z.prototype, "renamingId", void 0), Y([U()], Z.prototype, "draggingId", void 0), Y([U()], Z.prototype, "dropTarget", void 0), Y([$c(".layer-list")], Z.prototype, "layerList", void 0), Z = Y([V("ods-structure")], Z);
//#endregion
//#region src/ods-inspector.ts
var pp = 340, mp = 560, hp = ["padding", "snapSize"], gp = (e) => hp.some((t) => t === e), _p = (e) => e.label, Q = class extends B {
	constructor(...e) {
		super(...e), this.widgets = [], this.primitives = [], this.selectedItemId = "", this.selectedItemIds = [], this.enteredGroupId = "", this.renameRequestId = "", this.collapsed = !1, this.width = 350, this.showCorners = !1;
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
        grid-template-columns: 30px minmax(0, 1fr) auto;
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
      .changed-dot {
        flex: none;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--studio-accent);
      }
      .reset-link {
        margin-inline-start: auto;
        padding: 2px 4px;
        border: 0;
        background: transparent;
        color: var(--studio-accent);
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
        cursor: pointer;
      }
      .reset-link:hover {
        text-decoration: underline;
      }
      .hidden-switch {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--studio-muted);
        font-size: 11px;
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
		this.stopGesture = kd({
			origin: e,
			onMove: (e) => {
				let r = n + t - e.clientX;
				G(this, "inspector-resize", { width: _(r, pp, mp) });
			}
		});
	}
	expand() {
		G(this, "inspector-collapse", { collapsed: !1 });
	}
	numberFrom(e) {
		let t = Math.round(Number(e.detail.value));
		return Number.isFinite(t) ? t : void 0;
	}
	onItemFieldChange(e, t) {
		e.stopPropagation();
		let n = this.numberFrom(e);
		n !== void 0 && (t.stored && t.key.includes("_") ? G(this, "primitive-change", { value: { [t.key]: n } }) : G(this, "item-number-change", {
			key: t.key,
			value: n
		}));
	}
	onDisplayFieldChange(e) {
		e.stopPropagation();
		let { key: t } = e.detail, n = this.numberFrom(e);
		n !== void 0 && gp(t) && G(this, "display-number-change", {
			key: t,
			value: n
		});
	}
	onPicksChange(e, t, n) {
		let r = n.widget.sources[t.key] ?? [], i = e.detail.value[t.key];
		G(this, "widget-picks-change", {
			sourceKey: t.key,
			picks: Is(r, i)
		});
	}
	reloadWidgets() {
		G(this, "widgets-reload");
	}
	unlock(e) {
		G(this, "command", {
			id: "toggle-locked",
			itemId: e.id
		});
	}
	requestItemDelete(e) {
		G(this, "command", {
			id: "delete-item",
			itemId: e.id
		});
	}
	renderHeader(e, t, n, r = z) {
		return R`
      <div class="inspector-title">
        <ha-icon .icon=${n}></ha-icon>
        <div>
          <h2>${e}</h2>
          <p>${t}</p>
        </div>
        ${r}
      </div>
    `;
	}
	toggleHidden() {
		G(this, "command", { id: "toggle-hidden" });
	}
	renderHiddenSwitch(e) {
		return R`
      <label class="hidden-switch">
        <span>${t.inspector.hiddenSwitch}</span>
        <input
          type="checkbox"
          role="switch"
          aria-checked=${e.hidden ? "true" : "false"}
          aria-label=${t.inspector.hiddenSwitch}
          .checked=${e.hidden}
          @change=${this.toggleHidden}
        />
      </label>
    `;
	}
	renderDangerZone(e, t) {
		return R`
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
		if (!e) return z;
		let { timings: n } = e, r = t.inspector.metrics, i = [
			[r.queue, n.queue],
			[r.data, n.data],
			[r.compile, n.compile],
			[r.render, n.render],
			[r.encode, n.encode],
			[r.total, n.pipeline]
		];
		return R`
      ${e.warnings.map((e) => R`
          <ha-alert class="warning" alert-type="warning">${e}</ha-alert>
        `)}
      <details class="inspector-section telemetry">
        <summary>${t.inspector.diagnostics}</summary>
        <div class="section-body metrics">
          ${i.map(([e, n]) => R`
              <span>${e}</span>
              <strong>${t.common.milliseconds(n)}</strong>
            `)}
        </div>
      </details>
    `;
	}
	renderDisplayField(e, t, n, r) {
		return R`
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
		return R`
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
		let n = R`
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
		return R`
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
		return this.renderExpressible(e, xn, t.expression.visibleLabel, R`
        <span class="field-help">${t.expression.alwaysVisible}</span>
      `);
	}
	renderCornerToggle(e) {
		return Ho(e, this.primitives) ? R`
      <button
        type="button"
        class="text-button"
        @click=${() => this.showCorners = !this.showCorners}
      >
        ${this.showCorners ? t.expression.derivedFields : t.expression.cornerFields}
      </button>
    ` : z;
	}
	renderLockedNotice(e) {
		return e.locked ? R`
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
    ` : z;
	}
	onAlignChoice(e) {
		e.stopPropagation(), G(this, "align-in-parent", { place: e.detail.anchor });
	}
	renderAlignInParent(e) {
		let n = ns(e, this.primitives), r = e.locked || n.position.length > 0;
		return R`
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
		let { grid: n, extra: r } = Uo(e, this.dashboard, this.primitives, this.showCorners);
		return R`
      <details class="inspector-section" open>
        <summary>${t.inspector.layout}</summary>
        <div class="section-body">
          <div class="field-grid">
            ${n.map((t) => this.renderLayoutField(t, e))}
          </div>
          ${r.map((t) => this.renderLayoutField(t, e))}
          ${e.kind === "primitive" ? this.renderValueFields(e, "layout") : z}
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
			selector: Ts(e.selector, this.dashboard.display.palette)
		};
	}
	renderWidgetField(e, t, n) {
		let r = ks(e);
		return r ? R`
      <div class=${r.shape === "number" ? "value-field" : "value-field wide"}>
        <ods-value-field
          .hass=${this.hass}
          .field=${r}
          .value=${t}
          .palette=${this.dashboard.display.palette}
          .display=${this.dashboard.display}
          @primitive-field-change=${(e) => this.onWidgetFieldChange(e, n)}
        ></ods-value-field>
      </div>
    ` : this.renderFormField(e, t, n);
	}
	onWidgetFieldChange(e, t) {
		e.stopPropagation(), t(e.detail.key, e.detail.value);
	}
	renderFormField(e, t, n) {
		return R`
      <div class="value-field wide">
        <ha-form
          .hass=${this.hass}
          .data=${{ [e.key]: t }}
          .schema=${[this.formSchema(e)]}
          .computeLabel=${_p}
          @value-changed=${(t) => n(e.key, t.detail.value[e.key])}
        ></ha-form>
      </div>
    `;
	}
	setWidgetOption(e, t) {
		G(this, "widget-options-change", { value: { [e]: t } });
	}
	setPickField(e, t, n, r, i) {
		let a = e.widget.sources[t.key] ?? [];
		G(this, "widget-picks-change", {
			sourceKey: t.key,
			picks: Ls(a, n, { [r]: i }, t)
		});
	}
	renderPickFields(e, t, n) {
		let r = typeof n.label == "string" && n.label ? n.label : n.id;
		return R`
      <details class="pick-fields" data-pick=${n.id}>
        <summary>${r}</summary>
        <div class="value-fields">
          ${t.perSource.map((r) => this.renderWidgetField(r, n[r.key], (r, i) => this.setPickField(e, t, n.id, r, i)))}
        </div>
      </details>
    `;
	}
	renderSource(e, t) {
		let n = e.widget.sources[t.key] ?? [];
		return R`
      <div class="widget-source" data-source=${t.key}>
        <ha-form
          .hass=${this.hass}
          .data=${{ [t.key]: Fs(t, n) }}
          .schema=${[this.formSchema(t, t.required)]}
          .computeLabel=${_p}
          @value-changed=${(n) => this.onPicksChange(n, t, e)}
        ></ha-form>
        ${t.perSource.length > 0 ? n.map((n) => this.renderPickFields(e, t, n)) : z}
      </div>
    `;
	}
	renderSources(e, n) {
		return n.sources.length === 0 ? z : R`
      <details class="inspector-section" open>
        <summary>${t.inspector.dataSources}</summary>
        <div class="section-body">
          ${n.sources.map((t) => this.renderSource(e, t))}
        </div>
      </details>
    `;
	}
	renderResettableSummary(e, n, r) {
		return R`
      <summary>
        ${e}
        ${n ? R`
                <span
                  class="changed-dot"
                  title=${t.inspector.changed}
                ></span>
                <button
                  type="button"
                  class="reset-link"
                  title=${t.inspector.resetTitle(e)}
                  @click=${(e) => {
			e.preventDefault(), e.stopPropagation(), r();
		}}
                >
                  ${t.inspector.reset}
                </button>
              ` : z}
      </summary>
    `;
	}
	renderOptionSection(e, t, n) {
		let r = ep(t.fields.filter((e) => e.default !== void 0), e.widget.options);
		return R`
      <details class="inspector-section" ?open=${n}>
        ${this.renderResettableSummary(t.section, r.length > 0, () => G(this, "widget-options-change", { value: tp(r) }))}
        <div class="section-body">
          <div class="value-fields">
            ${t.fields.map((t) => this.renderWidgetField(t, e.widget.options[t.key], (e, t) => this.setWidgetOption(e, t)))}
          </div>
        </div>
      </details>
    `;
	}
	renderMissingWidget(e) {
		return R`
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
		return t ? R`
      ${this.renderSources(e, t)}
      ${t.options.map((t, n) => this.renderOptionSection(e, t, n === 0))}
    ` : this.renderMissingWidget(e);
	}
	fieldSpan(e) {
		return e.shape === "number" ? "" : "wide";
	}
	renderValueField(e, t) {
		let n = { ...e.primitive }, r = R`
      <ods-value-field
        .hass=${this.hass}
        .field=${t}
        .value=${n[t.key]}
        .palette=${this.dashboard.display.palette}
        .display=${this.dashboard.display}
        .disabled=${e.locked}
      ></ods-value-field>
    `;
		return R`
      <div class=${`value-field ${this.fieldSpan(t)}`}>
        ${this.renderExpressible(e, t.key, t.label, r)}
      </div>
    `;
	}
	renderValueFields(e, t, n = !1) {
		return R`
      <div class="value-fields">
        ${qo(e, this.primitives, t).filter((e) => !!e.advanced === n).map((t) => this.renderValueField(e, t))}
      </div>
    `;
	}
	renderAdvancedFields(e) {
		let n = qo(e, this.primitives, "appearance").filter((e) => e.advanced);
		return n.length === 0 ? z : R`
      <details class="disclosure" ?open=${ep(n, { ...e.primitive }, e.expressions).length > 0}>
        <summary>${t.inspector.advanced}</summary>
        ${this.renderValueFields(e, "appearance", !0)}
      </details>
    `;
	}
	renderAppearance(e) {
		let n = ep(qo(e, this.primitives, "appearance").filter((e) => !e.required || e.default !== void 0), { ...e.primitive }, e.expressions);
		return R`
      <details class="inspector-section" open>
        ${this.renderResettableSummary(t.inspector.appearance, n.length > 0, () => G(this, "primitive-fields-reset", { values: tp(n) }))}
        <div class="section-body">
          ${this.renderValueFields(e, "appearance")}
          ${this.renderAdvancedFields(e)}
        </div>
      </details>
    `;
	}
	onBackgroundFieldChange(e, t) {
		t.stopPropagation();
		let { key: n, value: r } = t.detail;
		G(this, "container-background-change", { value: {
			...ln(e),
			[n]: r
		} });
	}
	renderBackgroundField(e, t) {
		let n = ln(e);
		return R`
      <div
        class=${t.shape === "number" ? "value-field" : "value-field wide"}
      >
        <ods-value-field
          .hass=${this.hass}
          .field=${t}
          .value=${n[t.key]}
          .palette=${this.dashboard.display.palette}
          .display=${this.dashboard.display}
          .disabled=${e.locked}
          @primitive-field-change=${(t) => this.onBackgroundFieldChange(e, t)}
        ></ods-value-field>
      </div>
    `;
	}
	renderContainerBackground(e) {
		return e.grouped ? z : R`
      <details class="inspector-section" open>
        <summary>${t.inspector.background}</summary>
        <div class="section-body">
          <div class="value-fields">
            ${cn().map((t) => this.renderBackgroundField(e, t))}
          </div>
        </div>
      </details>
    `;
	}
	renderItemSections(e) {
		return e.kind === "widget" ? R`
        ${this.renderLayoutSection(e)} ${this.renderWidgetSettings(e)}
      ` : e.kind === "container" ? R`
        ${this.renderLayoutSection(e)}
        ${this.renderContainerBackground(e)}
      ` : R`
      ${this.renderLayoutSection(e)} ${this.renderAppearance(e)}
    `;
	}
	kindOf(e) {
		return e.kind === "widget" ? t.inspector.kindWidget : e.kind === "container" ? e.grouped ? t.inspector.kindGroup : t.inspector.kindContainer : t.inspector.kindPrimitive;
	}
	renderGroupedChip(e) {
		return e.kind !== "container" || !e.grouped ? z : R`
      <div class="locked-notice grouped-chip">
        <span>
          <ha-icon icon="mdi:group"></ha-icon>
          ${t.inspector.groupedChip}
        </span>
      </div>
    `;
	}
	renderItemInspector(e) {
		return R`
      ${this.renderHeader(e.name, t.inspector.subtitle(this.kindOf(e), e.locked), Qf(e, this.widgets, this.primitives), this.renderHiddenSwitch(e))}
      ${this.renderGroupedChip(e)} ${this.renderLockedNotice(e)}
      ${this.renderItemSections(e)}
      ${this.renderDangerZone(t.inspector.removeElement, () => this.requestItemDelete(e))}
      ${this.renderMetrics()}
    `;
	}
	renderMultiInspector() {
		let e = this.selectedItemIds.length, n = Ed(this.dashboard, this.selectedItemIds, (e) => this.preview?.itemBounds[e.id]);
		return R`
      ${this.renderHeader(t.inspector.selectedElements(e), t.inspector.selectionHint, "mdi:select-multiple")}
      ${n ? R`
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
            ` : z}
      ${this.renderDangerZone(t.inspector.removeElements, () => G(this, "command", { id: "delete-item" }))}
    `;
	}
	renderBoxValue(e, t) {
		return R`
      <ods-property-field
        .label=${e}
        .fieldKey=${e}
        .value=${Math.round(t)}
        .disabled=${!0}
      ></ods-property-field>
    `;
	}
	renderRail() {
		return R`
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
		let e = E(this.dashboard.items, this.selectedItemId);
		return R`
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
Y([H({ attribute: !1 })], Q.prototype, "hass", void 0), Y([H({ attribute: !1 })], Q.prototype, "dashboard", void 0), Y([H({ attribute: !1 })], Q.prototype, "widgets", void 0), Y([H({ attribute: !1 })], Q.prototype, "primitives", void 0), Y([H({ attribute: !1 })], Q.prototype, "preview", void 0), Y([H()], Q.prototype, "selectedItemId", void 0), Y([H({ attribute: !1 })], Q.prototype, "selectedItemIds", void 0), Y([H()], Q.prototype, "enteredGroupId", void 0), Y([H()], Q.prototype, "renameRequestId", void 0), Y([H({ type: Boolean })], Q.prototype, "collapsed", void 0), Y([H({ type: Number })], Q.prototype, "width", void 0), Y([U()], Q.prototype, "showCorners", void 0), Y([$c(".properties")], Q.prototype, "propertiesPanel", void 0), Q = Y([V("ods-inspector")], Q);
//#endregion
//#region src/catalog.ts
var vp = (e, t) => {
	let n = t.trim().toLocaleLowerCase();
	return n ? e.filter((e) => `${e.name} ${e.description}`.toLocaleLowerCase().includes(n)) : e;
}, yp = [
	"text",
	"shapes",
	"media",
	"data",
	"debug"
], bp = (e) => {
	let t = [...yp], n = [...new Set(e.map((e) => e.category).filter((e) => !t.includes(e)))];
	return [...t, ...n].map((t) => ({
		id: t,
		entries: e.filter((e) => e.category === t)
	})).filter((e) => e.entries.length > 0);
}, xp = (e) => {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) t.set(n.category, [...t.get(n.category) ?? [], n]);
	return [...t.entries()];
}, Sp = 4, Cp = () => ({
	id: "container",
	name: t.library.container,
	description: t.library.containerHint,
	icon: "mdi:select-all"
}), wp = class extends B {
	constructor(...e) {
		super(...e), this.widgets = [], this.widgetErrors = [], this.primitives = [], this.collapsed = !1, this.searchText = "", this.foldedSections = /* @__PURE__ */ new Set(), this.suppressClick = !1;
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
      .section-toggle {
        display: flex;
        flex: 1;
        align-items: center;
        gap: 7px;
        padding: 0;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        letter-spacing: inherit;
        text-transform: inherit;
        cursor: pointer;
      }
      /* The arrow that says a section opens and closes, as in the properties. */
      .section-toggle::before {
        content: "";
        flex: none;
        border: 4px solid transparent;
        border-left: 5px solid currentColor;
        border-right: 0;
        transition: transform 0.12s;
      }
      .section-toggle[aria-expanded="true"]::before {
        transform: rotate(90deg);
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
		this.stopGesture = kd({
			origin: e,
			threshold: Sp,
			onActivate: () => G(this, "catalog-drag", { active: !0 }),
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
				this.ghost = void 0, n && (G(this, "catalog-drag", { active: !1 }), this.suppressClick = !0, G(this, "catalog-drop", {
					value: t,
					clientX: e.clientX,
					clientY: e.clientY
				}), window.setTimeout(() => {
					this.suppressClick = !1;
				}, 0));
			},
			onCancel: () => {
				this.ghost = void 0, G(this, "catalog-drag", { active: !1 });
			}
		});
	}
	toggleSection(e) {
		let t = new Set(this.foldedSections);
		t.has(e) ? t.delete(e) : t.add(e), this.foldedSections = t;
	}
	isOpen(e) {
		return this.searchText !== "" || !this.foldedSections.has(e);
	}
	sectionName(e) {
		return t.library.sections[e] ?? e;
	}
	renderSection(e, n, r, i, a = z) {
		let o = this.isOpen(e);
		return R`
      <section class="catalog-section" data-section=${e}>
        <header>
          <button
            type="button"
            class="section-toggle"
            aria-expanded=${o ? "true" : "false"}
            aria-label=${o ? t.library.collapseSection(n) : t.library.expandSection(n)}
            @click=${() => this.toggleSection(e)}
          >
            <span>${n}</span>
          </button>
          <span class="count">${r}</span>
          ${a}
        </header>
        ${o ? i : z}
      </section>
    `;
	}
	onSearchInput(e) {
		this.searchText = xu(e);
	}
	addFromClick(e) {
		this.suppressClick || G(this, "catalog-add", { value: e });
	}
	renderEntry(e, n) {
		let r = `${n}:${e.id}`;
		return R`
      <button
        class="catalog-item"
        title=${t.library.entryHint(e.description)}
        @click=${() => this.addFromClick(r)}
        @pointerdown=${(t) => this.startDrag(t, r, e)}
      >
        <ha-icon .icon=${e.icon}></ha-icon>
        <strong>${e.name}</strong>
        ${e.user ? R`
                <span class="user-badge">${t.library.userWidget}</span>
              ` : z}
        <small>${e.description}</small>
      </button>
    `;
	}
	renderEntries(e, t) {
		return R`
      ${e.map((e) => this.renderEntry(e, t))}
    `;
	}
	reloadWidgets() {
		G(this, "widgets-reload");
	}
	renderWidgetErrors() {
		return this.widgetErrors.length === 0 ? z : R`
      <details class="widget-errors">
        <summary>
          <ha-icon icon="mdi:alert-outline"></ha-icon>
          ${t.library.widgetErrors(this.widgetErrors.length)}
        </summary>
        <ul>
          ${this.widgetErrors.map((e) => R`
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
		return e.length === 0 ? R`
        <p class="empty-result">${t.library.noWidgets}</p>
      ` : R`
      ${xp(e).map(([e, t]) => R`
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
		if (!e) return z;
		let t = W({
			left: `${e.x}px`,
			top: `${e.y}px`,
			width: `${e.width}px`,
			height: `${e.height}px`
		});
		return R`
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
	renderContainerSection(e) {
		return this.renderSection("containers", t.library.containers, e.length, R`
        <div class="catalog-grid">
          ${this.renderEntries(e, "container")}
        </div>
      `);
	}
	renderPrimitiveSection(e, t) {
		return this.renderSection(e, this.sectionName(e), t.length, R`
        <div class="catalog-grid">
          ${this.renderEntries(t, "primitive")}
        </div>
      `);
	}
	renderWidgetSection(e) {
		let n = R`
      <button
        class="icon-button"
        title=${t.library.reloadWidgets}
        aria-label=${t.library.reloadWidgets}
        @click=${this.reloadWidgets}
      >
        <ha-icon icon="mdi:refresh"></ha-icon>
      </button>
    `;
		return this.renderSection("widgets", t.library.widgets, e.length, R`
        ${this.renderWidgetErrors()} ${this.renderWidgetEntries(e)}
      `, n);
	}
	renderSections(e, n, r) {
		let i = this.searchText !== "";
		return i && !e.length && !n.length && !r.length ? R`
        <p class="empty-result">${t.library.noMatches}</p>
      ` : R`
      ${i && e.length === 0 ? z : this.renderContainerSection(e)}
      ${bp(n).map((e) => this.renderPrimitiveSection(e.id, e.entries))}
      ${i && r.length === 0 ? z : this.renderWidgetSection(r)}
    `;
	}
	render() {
		if (this.collapsed) return R`
        <aside class="panel panel-rail">
          <button
            class="icon-button"
            title=${t.library.expand}
            aria-label=${t.library.expand}
            @click=${() => G(this, "library-collapse", { collapsed: !1 })}
          >
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <span class="rail-label">${t.library.title}</span>
        </aside>
      `;
		let e = vp(this.widgets, this.searchText), n = vp([Cp()], this.searchText), r = vp(this.primitives, this.searchText).map((e) => ({
			...e,
			id: e.type
		}));
		return R`
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
            @click=${() => G(this, "library-collapse", { collapsed: !0 })}
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
          ${this.renderSections(n, r, e)}
        </div>
      </aside>
    `;
	}
};
Y([H({ attribute: !1 })], wp.prototype, "widgets", void 0), Y([H({ attribute: !1 })], wp.prototype, "widgetErrors", void 0), Y([H({ attribute: !1 })], wp.prototype, "primitives", void 0), Y([H({ type: Boolean })], wp.prototype, "collapsed", void 0), Y([U()], wp.prototype, "searchText", void 0), Y([U()], wp.prototype, "foldedSections", void 0), Y([U()], wp.prototype, "ghost", void 0), wp = Y([V("ods-library")], wp);
//#endregion
//#region src/ods-new-dashboard-dialog.ts
var Tp = class extends B {
	constructor(...e) {
		super(...e), this.devices = [], this.source = "custom", this.deviceId = "", this.saving = !1;
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
		G(this, "new-dashboard-change", { value: e.detail.value });
	}
	deviceChanged(e) {
		G(this, "new-dashboard-device", { deviceId: e.detail.value.deviceId ?? "" });
	}
	profileChanged(e) {
		G(this, "new-dashboard-profile", { profileId: e.detail.value.profileId ?? "" });
	}
	close() {
		G(this, "new-dashboard-close");
	}
	create() {
		G(this, "dashboard-create");
	}
	renderSource(e, t, n, r) {
		let i = this.source === e;
		return R`
      <button
        class=${i ? "dashboard-source selected" : "dashboard-source"}
        type="button"
        role="radio"
        aria-checked=${i ? "true" : "false"}
        @click=${() => G(this, "new-dashboard-source", { source: e })}
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
		return R`
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
		return R`
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
            ${ho[r].map((e) => R`
                <span
                  class="swatch"
                  title=${e}
                  style=${`background:${e}`}
                ></span>
              `)}
            ${mo[r]}
          </dd>
        </div>
      </dl>
    `;
	}
	renderPicker(e, t, n, r, i) {
		return R`
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
        .computeLabel=${_u}
        @value-changed=${i}
      ></ha-form>
    `;
	}
	renderDevicePicker() {
		if (this.devices.length === 0) return R`
        <ha-alert alert-type="info">${t.newDashboard.noDevices}</ha-alert>
      `;
		let e = this.devices.map((e) => ({
			value: e.id,
			label: `${e.name} · ${t.common.size(e.width, e.height)}`
		}));
		return R`
      ${this.renderPicker("deviceId", t.newDashboard.device, e, this.deviceId, this.deviceChanged)}
      ${this.renderDisplaySummary()}
    `;
	}
	renderProfilePicker() {
		let e = su.map((e) => ({
			value: e.id,
			label: `${e.manufacturer} · ${e.name}`
		}));
		return R`
      ${this.renderPicker("profileId", t.newDashboard.display, e, this.dashboard.display.profileId ?? "", this.profileChanged)}
      ${this.renderDisplaySummary()}
    `;
	}
	renderSourceBody() {
		return this.source === "device" ? this.renderDevicePicker() : this.source === "preset" ? this.renderProfilePicker() : z;
	}
	displayFields() {
		return this.source === "custom" ? {
			size: !0,
			palettes: ou,
			backgrounds: []
		} : this.source === "preset" ? {
			size: !1,
			palettes: So(this.dashboard.display.profileId).palettes,
			backgrounds: []
		} : {
			size: !1,
			palettes: [],
			backgrounds: []
		};
	}
	render() {
		return R`
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
            .data=${Ql(this.dashboard)}
            .schema=${gu(this.displayFields())}
            .computeLabel=${_u}
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
            .disabled=${this.saving || !ru(this.dashboard)}
            @click=${this.create}
          >
            ${this.saving ? t.newDashboard.creating : t.newDashboard.create}
          </ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
	}
};
Y([H({ attribute: !1 })], Tp.prototype, "hass", void 0), Y([H({ attribute: !1 })], Tp.prototype, "dashboard", void 0), Y([H({ attribute: !1 })], Tp.prototype, "devices", void 0), Y([H()], Tp.prototype, "source", void 0), Y([H()], Tp.prototype, "deviceId", void 0), Y([H({ type: Boolean })], Tp.prototype, "saving", void 0), Tp = Y([V("ods-new-dashboard-dialog")], Tp);
//#endregion
//#region src/ods-app.ts
var Ep = (e, t) => wt(e.items, t).map((e) => e.id), Dp = "opendisplay_studio.clipboard", Op = 228, kp = 36, Ap = 9, jp = 8, Mp = () => {
	try {
		let e = window.localStorage.getItem(Dp), t = e ? JSON.parse(e) : void 0;
		return Np(t) ? t : void 0;
	} catch {
		return;
	}
}, Np = (e) => typeof e == "object" && !!e && "items" in e && Array.isArray(e.items), Pp = (e) => {
	try {
		window.localStorage.setItem(Dp, JSON.stringify(e));
	} catch {}
}, Fp = 300, Ip = "debug_grid", Lp = (e, t) => e === "left" ? {
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
}, Rp = 220, zp = 5e3, $ = class extends B {
	constructor(...e) {
		super(...e), this.dashboards = [], this.view = "dashboards", this.widgets = [], this.widgetErrors = [], this.notice = "", this.sending = !1, this.primitives = [], this.selection = [], this.enteredGroupId = "", this.shortcutsOpen = !1, this.renameRequestId = "", this.clipboard = Mp(), this.loading = !0, this.saving = !1, this.dirty = !1, this.error = "", this.draggingCatalog = !1, this.undoCount = 0, this.redoCount = 0, this.pendingDeleteIds = [], this.leftCollapsed = !1, this.rightCollapsed = !1, this.inspectorWidth = 350, this.snapEnabled = !0, this.viewport = ss, this.newDashboardOpen = !1, this.newDashboard = Zl("en"), this.newDashboardSource = "custom", this.newDashboardDeviceId = "", this.displayDevices = [], this.previewRequest = 0, this.bootstrapStarted = !1, this.history = new Nu(), this.undo = () => {
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
				for (let r of e) pl(n, r, t);
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
			if (Su(e) || this.view === "dashboards") return;
			let t = Ll(e, this.commandContext());
			!t || this.view === "code" && !t.anywhere || (e.preventDefault(), this.runCommand(t.id));
		}, this.lastNudgeAt = 0;
	}
	static {
		this.styles = [
			K,
			Ju,
			L`
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
				let t = await Iu(e);
				this.dashboards = t.dashboards, this.widgets = t.widgets, this.widgetErrors = t.widgetErrors, this.primitives = t.primitives, this.current = void 0, this.preview = void 0, this.view = "dashboards", this.clearHistory(), this.newDashboard = Zl(e.language);
			} catch (e) {
				this.error = ju(e, t.app.loadFailed);
			} finally {
				this.loading = !1;
			}
		}
	}
	async openNewDashboard() {
		this.displayDevices = await this.loadDisplayDevices(), this.newDashboard = Zl(this.language), this.newDashboardDeviceId = "", this.newDashboardOpen = !0, this.chooseNewDashboardSource(this.displayDevices.length ? "device" : "preset");
	}
	async loadDisplayDevices() {
		if (!this.hass) return [];
		try {
			return await Hu(this.hass);
		} catch {
			return [];
		}
	}
	chooseNewDashboardSource(e) {
		this.newDashboardSource = e, e === "device" && this.useDevice(this.newDashboardDeviceId || this.displayDevices[0]?.id), e === "preset" && this.useProfile(this.newDashboard.display.profileId ?? "");
	}
	useDevice(e) {
		let t = this.displayDevices.find((t) => t.id === e);
		t && (this.newDashboardDeviceId = t.id, this.newDashboard = eu(this.newDashboard, t));
	}
	useProfile(e) {
		let t = su.find((t) => t.id === e) ?? su[0];
		this.newDashboard = tu(this.newDashboard, t);
	}
	async createDashboard() {
		if (this.hass) {
			this.saving = !0, this.error = "";
			try {
				let e = await Ru(this.hass, this.newDashboard);
				this.dashboards = [...this.dashboards, e], this.current = structuredClone(e), this.clearSelection(), this.dirty = !1, this.newDashboardOpen = !1, this.view = "design", this.clearHistory(), await this.composePreview(), await this.updateComplete, this.showWholeCanvas();
			} catch (e) {
				this.error = ju(e, t.app.createFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async saveDashboard() {
		if (!(!this.hass || !this.current)) {
			this.saving = !0, this.error = "";
			try {
				let e = await zu(this.hass, this.current);
				this.current = structuredClone(e), this.dashboards = this.dashboards.map((t) => t.id === e.id ? e : t), this.dirty = !1;
			} catch (e) {
				this.error = ju(e, t.app.saveFailed);
			} finally {
				this.saving = !1;
			}
		}
	}
	async exportDashboard() {
		if (!(!this.hass || !this.current)) {
			this.error = "";
			try {
				let e = await Wu(this.hass, this.current);
				wu(Du(this.current.name), JSON.stringify(e, null, 2));
			} catch (e) {
				this.error = ju(e, t.app.exportFailed);
			}
		}
	}
	async chooseImport() {
		if (!this.hass || !this.current) return;
		let e = await Tu(".json,application/json");
		if (!e) return;
		this.error = "";
		let n = ku(await e.text());
		if (n === void 0) {
			this.error = t.app.notAJsonFile;
			return;
		}
		try {
			let e = await Gu(this.hass, n, this.current.display);
			this.importing = {
				file: n,
				plan: e
			};
		} catch (e) {
			this.error = ju(e, t.app.importFailed);
		}
	}
	cancelImport() {
		this.importing = void 0;
	}
	async confirmImport(e) {
		let { importing: n, hass: r, current: i } = this;
		if (!(!n || !r || !i)) try {
			let { items: a } = await Gu(r, n.file, i.display, e.detail.colorMap);
			this.mutate((e) => {
				e.items = a;
			}), this.clearSelection(), this.importing = void 0, this.showNotice(t.app.imported(a.length));
		} catch (e) {
			this.importing = void 0, this.error = ju(e, t.app.importFailed);
		}
	}
	async sendToDevice() {
		if (!(!this.hass || !this.current)) {
			this.sending = !0, this.error = "";
			try {
				await Uu(this.hass, this.current), this.showNotice(t.app.sentToDevice);
			} catch (e) {
				this.error = ju(e, t.app.sendFailed);
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
				let t = await zu(this.hass, e);
				return this.dashboards = this.dashboards.map((e) => e.id === t.id ? t : e), this.current?.id === t.id && (this.current = structuredClone(t), this.preview = void 0, this.dirty = !1), t;
			} catch (e) {
				this.error = ju(e, t);
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
		n.id = "", n.name = au(e, this.dashboards, this.language), n.status = "draft", n.createdAt = "", n.updatedAt = "";
		try {
			let e = await Ru(this.hass, n);
			this.dashboards = [...this.dashboards, e];
		} catch (e) {
			this.error = ju(e, t.app.duplicateFailed);
		} finally {
			this.saving = !1;
		}
	}
	async saveSettings() {
		if (this.dashboardDialog !== "settings" || !this.dashboardDraft || !ru(this.dashboardDraft)) return;
		let e = structuredClone(this.dashboardDraft);
		e.name = e.name.trim(), await this.updateFromGallery(e, t.app.settingsFailed) && this.closeAction();
	}
	async confirmDeleteDashboard() {
		if (this.dashboardDialog !== "delete" || !this.dashboardDraft || !this.hass || this.saving) return;
		let e = this.dashboardDraft.id;
		this.saving = !0, this.error = "";
		try {
			await Bu(this.hass, e), this.dashboards = this.dashboards.filter((t) => t.id !== e), this.current?.id === e && (this.current = void 0, this.clearSelection(), this.preview = void 0, this.dirty = !1, this.clearHistory()), this.closeAction();
		} catch (e) {
			this.error = ju(e, t.app.deleteFailed);
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
			canGroup: n ? Yt(n, i) : !1,
			canUngroup: n && a ? Xt(n, a.id) : !1,
			canEnter: a ? xt(a) : !1,
			entered: this.enteredGroupId !== "",
			canPaste: (this.clipboard?.items.length ?? 0) > 0,
			dirty: this.dirty
		};
	}
	get selectedItems() {
		let e = this.current?.items ?? [];
		return this.selection.flatMap((t) => E(e, t) ?? []);
	}
	get selectedItem() {
		return this.selectedItems.at(-1);
	}
	runCommand(e, t) {
		let n = Pl(e), r = this.commandContext(t);
		n.isEnabled(r) && n.run(r, this.commandActions);
	}
	onCommand(e) {
		let { id: t, itemId: n } = e.detail, r = n ? E(this.current?.items ?? [], n) : void 0;
		this.runCommand(t, r);
	}
	copy(e) {
		let t = this.current;
		t && (this.clipboard = pn(t, e), Pp(this.clipboard));
	}
	cut(e) {
		this.copy(e), this.mutate((t) => {
			for (let n of e) ml(t, n);
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
		let n = Lt(t.items, e.x, e.y, [], this.enteredGroupId || void 0);
		this.pasteWith(() => ({ anchor: e }), n ? { parentId: n.id } : {});
	}
	pasteWith(e, t) {
		let n = this.current, r = this.clipboard ?? Mp();
		if (!n || !r) return;
		let i = [];
		this.mutate((n) => {
			let a = t ?? hn(n, this.selection);
			i = vn(n, r, a, e());
		}), i.length > 0 && this.setSelection(i);
	}
	duplicate(e) {
		let t = [];
		this.mutate((n) => {
			t = yn(n, e);
		}), t.length > 0 && this.setSelection(t);
	}
	arrange(e, t) {
		this.mutate((n) => {
			t === "front" && Vt(n, e), t === "back" && Ht(n, e), (t === "up" || t === "down") && Wt(n, e, t);
		});
	}
	nudge(e, t, n) {
		let r = this.current;
		if (!r) return;
		let { dx: i, dy: a } = Lp(t, n ? r.display.snapSize : 1), o = Date.now() - this.lastNudgeAt > Fp;
		this.lastNudgeAt = Date.now(), this.mutate((t) => {
			bn(t, e, i, a, lt(t), (e) => ns(e, this.primitives).position.length === 0);
		}, !0, o);
	}
	zoom(e) {
		if (e === "reset") {
			this.canvas?.resetView();
			return;
		}
		this.viewport = us(this.viewport, e === "in" ? 1 : -1);
	}
	closeMenu() {
		this.menu = void 0;
	}
	menuLayout(e) {
		return e === "empty" ? Ul : e === "tree" ? Hl : Vl;
	}
	onContextMenu(e) {
		let { source: n, itemId: r, clientX: i, clientY: a, point: o } = e.detail, s = this.current;
		if (!s) return;
		r && !this.selection.includes(r) && this.selectItem(r), !r && n === "empty" && this.clearSelection();
		let c = r ? E(s.items, r) : void 0, l = c ? this.targetsForMenu(c) : [], u = this.commandContext(c, l), d = Wl(this.menuLayout(n), u, Cu());
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
		let r = this.getBoundingClientRect(), i = n.length * kp + n.filter((e) => e.separatorBefore).length * Ap + 16, a = e - r.left, o = t - r.top;
		return {
			x: a + Op + jp > r.width ? Math.max(jp, a - Op) : a,
			y: o + i + jp > r.height ? Math.max(jp, r.height - i - jp) : o
		};
	}
	onMenuSelect(e) {
		let t = this.menu;
		if (this.closeMenu(), !t || !this.current) return;
		let n = t.itemId ? E(this.current.items, t.itemId) : void 0;
		if (!Nl(e.detail.id)) return;
		let r = Pl(e.detail.id), i = this.commandContext(n, n ? this.targetsForMenu(n) : []);
		r.isEnabled(i) && (this.menu = t, r.run(i, this.commandActions), this.menu = void 0);
	}
	renderMenu() {
		let e = this.menu;
		return e ? R`
      <div
        class="menu-scrim"
        @pointerdown=${this.closeMenu}
        @contextmenu=${this.dismissMenu}
      ></div>
      <div
        class="menu-layer"
        style=${W({
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
    ` : z;
	}
	dismissMenu(e) {
		e.preventDefault(), this.closeMenu();
	}
	renderShortcutsDialog() {
		return this.shortcutsOpen ? R`
      <ods-shortcuts-dialog
        @shortcuts-close=${() => {
			this.shortcutsOpen = !1;
		}}
      ></ods-shortcuts-dialog>
    ` : z;
	}
	schedulePreview() {
		this.previewTimer && window.clearTimeout(this.previewTimer), this.previewTimer = window.setTimeout(() => void this.composePreview(), Rp);
	}
	refreshOnStateChange(e) {
		let t = this.preview?.dependencies;
		!t || !Vs(t, e?.states, this.hass?.states) || (this.stateTimer && window.clearTimeout(this.stateTimer), this.stateTimer = window.setTimeout(() => void this.composePreview(), 500));
	}
	scheduleClockRefresh() {
		this.clockTimer && window.clearTimeout(this.clockTimer), this.preview?.dependencies.usesTime && (this.clockTimer = window.setTimeout(() => void this.composePreview(), Rs));
	}
	async composePreview() {
		if (!this.hass || !this.current) return;
		this.error = "";
		let e = ++this.previewRequest, n = structuredClone(this.current);
		try {
			let t = await Vu(this.hass, n);
			e === this.previewRequest && (this.preview = {
				...t,
				composedFrom: n
			}, this.scheduleClockRefresh());
		} catch (e) {
			this.error = ju(e, t.app.previewFailed);
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
		this.enteredGroupId && t && n && (T(n.items, t) && this.isInsideEntered(n, t) || (this.enteredGroupId = ""));
	}
	keepExistingSelection(e) {
		let t = this.selection.filter((t) => E(e.items, t));
		t.length !== this.selection.length && (this.selection = t), this.enteredGroupId && !E(e.items, this.enteredGroupId) && (this.enteredGroupId = "");
	}
	isInsideEntered(e, t) {
		let n = this.enteredGroupId;
		return !n || [t, ...Ep(e, t)].includes(n) || Ep(e, n).includes(t);
	}
	showWholeCanvas() {
		this.canvas?.resetView(), requestAnimationFrame(() => this.canvas?.fitView());
	}
	createFromCatalog(e, n, r, i) {
		let [a, o] = e.split(":");
		if (!o) return;
		if (a === "container") return qt(i, n, r);
		if (a === "widget") {
			let e = this.widgets.find((e) => e.id === o);
			return e ? Sl(e, n, r, i) : void 0;
		}
		if (o === Ip && this.selectExistingGrid(i)) return;
		let s = Cl(this.primitives, o, n, r, i);
		return s || (this.error = t.app.unsupportedPrimitive(o)), s;
	}
	selectExistingGrid(e) {
		let t = D(e.items).find((e) => e.kind === "primitive" && e.primitive.type === Ip);
		return t ? (this.selectItem(t.id), !0) : !1;
	}
	addAt(e, t, n, r) {
		let i = this.current;
		if (!i) return;
		let a = this.createFromCatalog(e, t, n, i);
		a && (this.mutate((e) => en(e, a, r)), this.selectItem(a.id), this.composePreview());
	}
	addFromCatalog(e) {
		if (!this.current) return;
		let { x: t, y: n } = wl(this.current, this.snapEnabled);
		this.addAt(e, t, n);
	}
	dropFromCatalog(e, t, n) {
		let r = this.current, i = this.canvas?.displayPointAt(t, n);
		if (!r || !i) return;
		let a = lt(r), o = _(ut(i.x, r, this.snapEnabled), a.x, a.x + a.width - 1), s = _(ut(i.y, r, this.snapEnabled), a.y, a.y + a.height - 1), c = Lt(r.items, o, s, [], this.enteredGroupId || void 0);
		this.addAt(e, o, s, c?.id);
	}
	groupSelection(e) {
		let t;
		this.mutate((n) => {
			t = Zt(n, e, (e) => this.preview?.itemBounds[e.id]);
		}), t && this.selectItem(t);
	}
	ungroup(e) {
		let t = [];
		this.mutate((n) => {
			t = Qt(n, e);
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
			for (let n of e) ml(t, n);
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
		this.dashboardDraft &&= nu(this.dashboardDraft, e.detail.value);
	}
	onNewDashboardChange(e) {
		this.newDashboard = nu(this.newDashboard, e.detail.value);
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
		this.mutate((e) => gl(e, t, n));
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
			for (let n of t) Rt(e, n);
		}, !1, !1);
	}
	onGestureCancel(e) {
		this.current = e.detail.before, this.schedulePreview();
	}
	onItemTransformEnd(e) {
		let { before: t, drop: n } = e.detail;
		n && this.dropOnContainer(n.itemId, n.x, n.y), this.recordHistory(t), this.schedulePreview();
	}
	dropOnContainer(e, t, n) {
		let r = this.current;
		if (!r) return;
		let i = Lt(r.items, t, n, [e], this.enteredGroupId || void 0);
		i?.id !== T(r.items, e)?.parent?.id && this.mutate((t) => tn(t, e, i?.id), !1, !1);
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
		this.mutate((e) => hl(e, t, n, r));
	}
	onItemNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => ll(e, this.selectedItemId, t, n, this.primitives));
	}
	onExpressionChange(e) {
		let { key: t, template: n } = e.detail;
		this.mutate((e) => El(e, this.selectedItemId, t, n));
	}
	onDisplayNumberChange(e) {
		let { key: t, value: n } = e.detail;
		this.mutate((e) => fl(e, t, n));
	}
	onWidgetOptionsChange(e) {
		let t = this.selectedItem;
		if (t?.kind !== "widget") return;
		let n = this.widgets.find((e) => e.id === t.widget.type);
		if (!n) return;
		let r = Ns(e.detail.value, n);
		this.mutate((e) => _l(e, t.id, r));
	}
	onWidgetPicksChange(e) {
		let { sourceKey: t, picks: n } = e.detail;
		this.mutate((e) => vl(e, this.selectedItemId, t, n));
	}
	async reloadWidgets() {
		if (this.hass) try {
			let e = await Lu(this.hass);
			this.widgets = e.widgets, this.widgetErrors = e.widgetErrors, this.showNotice(t.library.widgetsReloaded(e.widgets.length, e.widgetErrors.length)), this.composePreview();
		} catch (e) {
			this.error = ju(e, t.library.reloadFailed);
		}
	}
	showNotice(e) {
		this.notice = e, this.noticeTimer && window.clearTimeout(this.noticeTimer), this.noticeTimer = window.setTimeout(() => {
			this.notice = "";
		}, zp);
	}
	onContainerBackgroundChange(e) {
		let t = dn(e.detail.value);
		this.mutate((e) => an(e, this.selectedItemId, t));
	}
	onAlignInParent(e) {
		let t = this.selectedItemId, n = this.preview?.itemBounds[t];
		this.mutate((r) => Fu(r, t, e.detail.place, n));
	}
	onPrimitiveFieldChange(e) {
		let { key: t, value: n } = e.detail, r = this.selectedItemId, i = this.preview?.itemBounds[r];
		this.mutate((e) => yl(e, r, t, n, i));
	}
	onPrimitiveFieldsReset(e) {
		let { values: t } = e.detail;
		this.mutate((e) => bl(e, this.selectedItemId, t));
	}
	onPrimitiveChange(e) {
		let { value: t } = e.detail;
		this.mutate((e) => xl(e, this.selectedItemId, t, this.primitives));
	}
	renderDeleteDialog() {
		let e = this.pendingDeleteIds.flatMap((e) => E(this.current?.items ?? [], e) ?? []), [n] = e;
		if (!n) return z;
		let r = e.some((e) => w(e) && e.children.length > 0), i = e.length === 1 ? t.app.deleteElementTitle(n.name) : t.app.deleteElementsTitle(e.length);
		return R`
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
	renderImportDialog() {
		let { importing: e, current: t } = this;
		return !e || !t ? z : R`
      <ods-import-dialog
        .hass=${this.hass}
        .display=${t.display}
        .colors=${e.plan.colorsToMap}
        .adjusted=${e.plan.adjusted}
        .replaces=${t.items.length > 0}
        @import-confirm=${this.confirmImport}
        @import-cancel=${this.cancelImport}
      ></ods-import-dialog>
    `;
	}
	renderNewDashboardDialog() {
		return this.newDashboardOpen ? R`
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
    ` : z;
	}
	renderGallery() {
		return R`
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
		return R`
      <div
        class="layout"
        style=${W({
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
          @gesture-cancel=${this.onGestureCancel}
          @primitive-field-change=${this.onPrimitiveFieldChange}
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
          @primitive-fields-reset=${this.onPrimitiveFieldsReset}
          @align-in-parent=${this.onAlignInParent}
          @container-background-change=${this.onContainerBackgroundChange}
          @expression-change=${this.onExpressionChange}
        ></ods-inspector>
      </div>
      ${this.renderDeleteDialog()} ${this.renderImportDialog()}
      ${this.renderMenu()} ${this.renderShortcutsDialog()}
    `;
	}
	renderError() {
		return this.error ? R`
      <ha-alert alert-type="error">${this.error}</ha-alert>
    ` : z;
	}
	renderNotice() {
		return this.notice ? R`
      <ha-alert alert-type="success" class="notice">${this.notice}</ha-alert>
    ` : z;
	}
	renderEditor(e) {
		return R`
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
          @dashboard-export=${this.exportDashboard}
          @dashboard-import=${this.chooseImport}
          @help-open=${() => {
			this.shortcutsOpen = !0;
		}}
        ></ods-header>
        ${this.renderError()} ${this.renderNotice()}
        ${this.view === "code" ? R`
                <ods-code-view .preview=${this.preview}></ods-code-view>
              ` : this.renderDesign(e)}
      </div>
    `;
	}
	render() {
		if (this.loading) return R`
        <div class="dashboard-empty">
          <p>${t.app.loading}</p>
        </div>
      `;
		let e = this.current;
		return this.view === "dashboards" || !e ? this.renderGallery() : this.renderEditor(e);
	}
};
Y([H({ attribute: !1 })], $.prototype, "hass", void 0), Y([U()], $.prototype, "dashboards", void 0), Y([U()], $.prototype, "view", void 0), Y([U()], $.prototype, "widgets", void 0), Y([U()], $.prototype, "widgetErrors", void 0), Y([U()], $.prototype, "notice", void 0), Y([U()], $.prototype, "sending", void 0), Y([U()], $.prototype, "importing", void 0), Y([U()], $.prototype, "primitives", void 0), Y([U()], $.prototype, "current", void 0), Y([U()], $.prototype, "selection", void 0), Y([U()], $.prototype, "enteredGroupId", void 0), Y([U()], $.prototype, "menu", void 0), Y([U()], $.prototype, "shortcutsOpen", void 0), Y([U()], $.prototype, "renameRequestId", void 0), Y([U()], $.prototype, "preview", void 0), Y([U()], $.prototype, "loading", void 0), Y([U()], $.prototype, "saving", void 0), Y([U()], $.prototype, "dirty", void 0), Y([U()], $.prototype, "error", void 0), Y([U()], $.prototype, "draggingCatalog", void 0), Y([U()], $.prototype, "undoCount", void 0), Y([U()], $.prototype, "redoCount", void 0), Y([U()], $.prototype, "pendingDeleteIds", void 0), Y([U()], $.prototype, "leftCollapsed", void 0), Y([U()], $.prototype, "rightCollapsed", void 0), Y([U()], $.prototype, "inspectorWidth", void 0), Y([U()], $.prototype, "snapEnabled", void 0), Y([U()], $.prototype, "viewport", void 0), Y([U()], $.prototype, "newDashboardOpen", void 0), Y([U()], $.prototype, "newDashboard", void 0), Y([U()], $.prototype, "newDashboardSource", void 0), Y([U()], $.prototype, "newDashboardDeviceId", void 0), Y([U()], $.prototype, "displayDevices", void 0), Y([U()], $.prototype, "dashboardDialog", void 0), Y([U()], $.prototype, "dashboardDraft", void 0), Y([$c("ods-canvas")], $.prototype, "canvas", void 0), $ = Y([V("ods-app")], $);
//#endregion
export { $ as OdsApp };
