import type { StringsOverride } from "./i18n";

/**
 * The German text of the panel. Anything missing here is shown in English, so a
 * translator can finish it without breaking anything.
 */
export const german: StringsOverride = {
  common: {
    increase: "Erhöhen",
    decrease: "Verringern",
    cancel: "Abbrechen",
    close: "Schließen",
  },

  commands: {
    group: "Gruppieren",
    ungroup: "Gruppierung aufheben",
    enterGroup: "Gruppe betreten",
    exitGroup: "Gruppe verlassen",
    deselect: "Auswahl aufheben",
    copy: "Kopieren",
    cut: "Ausschneiden",
    paste: "Einfügen",
    pasteHere: "Hier einfügen",
    duplicate: "Duplizieren",
    rename: "Umbenennen",
    save: "Dashboard speichern",
    toggleCode: "Zwischen Entwurf und Code wechseln",
    zoomIn: "Vergrößern",
    zoomOut: "Verkleinern",
    zoomReset: "Zoom zurücksetzen",
    showShortcuts: "Tastenkürzel",
    nudge: {
      left: "Nach links schieben",
      right: "Nach rechts schieben",
      up: "Nach oben schieben",
      down: "Nach unten schieben",
    },
    undo: "Rückgängig",
    redo: "Wiederholen",
    delete: "Löschen",
    hide: "Ausblenden",
    show: "Einblenden",
    lock: "Sperren",
    unlock: "Entsperren",
    bringToFront: "In den Vordergrund",
    sendToBack: "In den Hintergrund",
    moveUp: "Eine Ebene nach vorn",
    moveDown: "Eine Ebene nach hinten",
    align: {
      left: "Linksbündig ausrichten",
      center: "Horizontal zentrieren",
      right: "Rechtsbündig ausrichten",
      top: "Oben ausrichten",
      middle: "Vertikal zentrieren",
      bottom: "Unten ausrichten",
    },
    distribute: {
      horizontal: "Gleichmäßig verteilen, von links nach rechts",
      vertical: "Gleichmäßig verteilen, von oben nach unten",
    },
  },

  app: {
    deleteElementsTitle: (count: number): string =>
      `${count} Elemente löschen?`,
    deleteContainerBody:
      "Das entfernt den Container und alles darin. Mit „Rückgängig“ lässt es sich wiederherstellen.",
    exportFailed: "Das Dashboard konnte nicht exportiert werden",
    importFailed: "Die Datei konnte nicht gelesen werden",
    notAJsonFile: "Die Datei ist keine JSON-Datei",
    imported: (count: number): string => `${count} Elemente importiert`,
    loading: "OpenDisplay Studio wird geladen…",
    loadFailed: "OpenDisplay Studio konnte nicht geladen werden",
    createFailed: "Das Dashboard konnte nicht erstellt werden",
    sentToDevice: "An das Gerät gesendet",
    sendFailed: "Das Dashboard konnte nicht an das Gerät gesendet werden",
    saveFailed: "Das Dashboard konnte nicht gespeichert werden",
    deleteFailed: "Das Dashboard konnte nicht gelöscht werden",
    renameFailed: "Das Dashboard konnte nicht umbenannt werden",
    duplicateFailed: "Das Dashboard konnte nicht dupliziert werden",
    settingsFailed:
      "Die Dashboard-Einstellungen konnten nicht aktualisiert werden",
    previewFailed: "Die Vorschau konnte nicht gerendert werden",
    renameEmpty: "Der Dashboard-Name darf nicht leer sein",
    discardChanges: "Ungespeicherte Änderungen am Dashboard verwerfen?",
    unsupportedPrimitive: (type: string): string =>
      `Nicht unterstützter Primitiv-Typ: ${type || "(leer)"}`,
    confirmRemoval: "Entfernen bestätigen",
    deleteElementTitle: (name: string): string => `${name} löschen?`,
    deleteElementBody:
      "Das Element wird aus dem Dashboard entfernt. Mit Rückgängig kannst du es wiederherstellen.",
    deleteElement: "Element löschen",
  },

  gallery: {
    title: "Dashboards",
    count: (count: number): string =>
      `${count} ${count === 1 ? "Dashboard" : "Dashboards"}`,
    newDashboard: "Neues Dashboard",
    settings: "Einstellungen",
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
    updated: (date: string): string => `Geändert ${date}`,
    open: (name: string): string => `Dashboard ${name} öffnen`,
    actionsFor: (name: string): string => `Aktionen für Dashboard ${name}`,
    menuFor: (name: string): string => `Aktionen für ${name}`,
    renameField: (name: string): string => `Dashboard ${name} umbenennen`,
    menu: {
      rename: "Umbenennen",
      duplicate: "Duplizieren",
      settings: "Display-Einstellungen",
      delete: "Löschen",
    },
    deleteTitle: "Dashboard löschen?",
    deleteBody: "und alle seine Elemente werden endgültig entfernt.",
    deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden.",
    deleteAction: "Dashboard löschen",
    deleting: "Wird gelöscht…",
    settingsTitle: "Display-Einstellungen",
    settingsSave: "Änderungen speichern",
    saving: "Wird gespeichert…",
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
    noDevices:
      "Keine OpenDisplay-Geräte gefunden. Richte die OpenDisplay-Integration ein oder beginne mit einem vordefinierten Display.",
    deviceDetails: "Größe und Farben des Dashboards",
    colors: "Farben",
    create: "Dashboard erstellen",
    previewLabel: "Vorschau des Displays",
    turnLeft: "Um 90° nach links drehen",
    turnRight: "Um 90° nach rechts drehen",
    creating: "Wird erstellt…",
  },

  header: {
    help: "Tastenkürzel",
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
    saving: "Wird gespeichert…",
  },

  library: {
    containers: "Container",
    container: "Container",
    containerHint: "Enthält andere Elemente und bewegt sie gemeinsam.",
    sections: {
      text: "Text",
      shapes: "Formen",
      media: "Symbole & Medien",
      data: "Daten",
      debug: "Werkzeuge",
    },
    collapseSection: (name: string): string => `Einklappen ${name}`,
    expandSection: (name: string): string => `Ausklappen ${name}`,
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
    widgetErrors: (count: number): string =>
      `${count} ${count === 1 ? "Widget-Paket konnte" : "Widget-Pakete konnten"} nicht geladen werden`,
    widgetsReloaded: (loaded: number, failed: number): string =>
      failed === 0
        ? `Widgets neu geladen — ${loaded} geladen`
        : `Widgets neu geladen — ${loaded} geladen, ${failed} fehlgeschlagen`,
    reloadFailed: "Die Widgets konnten nicht neu geladen werden",
    noMatches: "Keine passenden Elemente",
    entryHint: (description: string): string =>
      `${description} Zum Hinzufügen klicken oder ziehen.`,
  },

  structure: {
    root: (count: number): string =>
      `Stammebene (${count} ${count === 1 ? "Widget" : "Widgets"})`,
    rootName: "Stammebene",
    breadcrumb: "Gruppe in Bearbeitung",
    exit: "Verlassen",
    container: "Container",
    group: "Gruppe",
    groupBadge: "Gruppe",
    search: "Ebenen suchen",
    searchPlaceholder: "Ebenen suchen …",
    rename: "Elementname",
    collapseRow: (name: string): string => `${name} einklappen`,
    expandRow: (name: string): string => `${name} ausklappen`,
    title: "Struktur",
    heading: "Elemente",
    collapse: "Inspektor einklappen",
    empty: "Ziehe Widgets oder Primitive auf die Fläche.",
    widget: "Widget",
    reorderTitle: "Ebene neu anordnen",
    reorder: (name: string): string => `${name} neu anordnen`,
  },

  inspector: {
    background: "Hintergrund",
    backgroundEnabled: "Hintergrund",
    backgroundFill: "Füllung",
    backgroundOutline: "Umriss",
    backgroundWidth: "Umrissbreite",
    backgroundRadius: "Eckenradius",
    kindContainer: "Container",
    kindGroup: "Gruppe",
    groupedChip: "Gruppiert",
    selectedElements: (count: number): string => `${count} Elemente`,
    selectionHint:
      "Gemeinsam verschieben, ausblenden, sperren oder löschen. Gruppieren Sie sie, damit sie ein Element bleiben.",
    boundingBox: "Begrenzungsrahmen",
    advanced: "Erweitert",
    reset: "zurücksetzen",
    resetTitle: (section: string): string =>
      `${section} auf Standard zurücksetzen`,
    changed: "Vom Standard abweichend",
    alignInParent: "Im Elternelement ausrichten",
    expand: "Inspektor ausklappen",
    rail: "Ebenen",
    resize: "Breite des Inspektors ändern",
    dashboard: "Dashboard",
    dashboardHint: "Einstellungen des Arbeitsbereichs",
    workingAreaHelp:
      "Der Rand legt den sicheren Bearbeitungsbereich fest. Das Einrasten richtet Bewegen und Skalieren an ganzen Pixeln aus.",
    layout: "Layout",
    widgetSettings: "Widget-Einstellungen",
    dataSources: "Datenquellen",
    widgetMissing: (type: string): string =>
      `Das Widget ${type} ist nicht installiert. ` +
      "Es behält seine Einstellungen und wird wieder gezeichnet, sobald das Paket zurückkehrt.",
    appearance: "Darstellung",
    diagnostics: "Render-Diagnose",
    locked: "Position ist gesperrt",
    unlock: "Entsperren",
    unlockElement: "Elementposition entsperren",
    kindWidget: "Widget",
    kindPrimitive: "ODL-Primitiv",
    subtitle: (kind: string, locked: boolean): string =>
      `${kind} · ${locked ? "Position gesperrt" : "bearbeitbar"}`,
    metrics: {
      queue: "Warteschlange",
      data: "Daten",
      compile: "Kompilieren",
      render: "Rendern",
      encode: "Kodieren",
      total: "Gesamt",
    },
  },

  expression: {
    scalingLocked: (names: string): string =>
      `Die Gruppe kann nicht skaliert werden: Position oder Größe von ${names} ` +
      `wird von einem Ausdruck bestimmt`,
    toggleLabel: (field: string): string => `Ausdruck für ${field}`,
    toggleTooltip: "Ausdruck (oder { eingeben)",
    visibleLabel: "Sichtbarkeit",
    alwaysVisible: "Immer sichtbar",
    positionLocked: (fields: string): string =>
      `Die Position wird von einem Ausdruck bestimmt (${fields})`,
    cornerFields: "Ecken bearbeiten",
    derivedFields: "Position und Größe bearbeiten",
  },

  canvas: {
    menuLabel: "Canvas-Aktionen",
    enterGroupHint: "Enter / Doppelklick zum Bearbeiten",
    rendering: "Wird gerendert…",
    previewAlt: "Vom Backend gerenderte Display-Vorschau",
    hidden: "Ausgeblendet",
    layers: (count: number): string =>
      `${count} ${count === 1 ? "Ebene" : "Ebenen"}`,
    padding: (pixels: number): string => `Rand ${pixels}px`,
    snap: (pixels: number): string => `Einrasten ${pixels}px`,
    arrangeLabel: "Auswahl anordnen",
    alignToSelection: "An der Auswahl ausrichten",
    alignToParent: "Am Container oder Arbeitsbereich ausrichten",
    grid: "Raster",
    gridTitle: "Punkte des Einrastrasters zeigen",
    pan: "Verschieben",
    panTitle:
      "Verschieben: Mausrad bewegt die Ansicht, Strg + Mausrad zoomt. Aus: Mausrad zoomt.",
    addPoint: (name: string, number: number): string =>
      `Punkt zu ${name} nach Punkt ${number} hinzufügen`,
    pointHandle: (name: string, number: number): string =>
      `Punkt ${number} von ${name} verschieben`,
    rotateHandle: (name: string): string => `${name} drehen`,
    resizeHandle: (name: string, side: string): string =>
      `${name} von ${side} skalieren`,
    sides: {
      nw: "Nordwesten",
      n: "Norden",
      ne: "Nordosten",
      e: "Osten",
      se: "Südosten",
      s: "Süden",
      sw: "Südwesten",
      w: "Westen",
    },
  },

  zoom: {
    out: "Verkleinern",
    in: "Vergrößern",
    reset: "Zurücksetzen",
    fit: "Einpassen",
  },

  code: {
    eyebrow: "Erzeugte Ausgabe",
    title: "Erzeugtes ODL-YAML",
    description:
      "Schreibgeschützte Ausgabe, erzeugt aus dem aktuellen Dashboard.",
    copyLabel: "Erzeugtes ODL-YAML kopieren",
    yaml: "Erzeugtes ODL-YAML",
    copy: {
      idle: "YAML kopieren",
      copied: "Kopiert",
      failed: "Kopieren fehlgeschlagen",
    },
    status: {
      copied: "YAML in die Zwischenablage kopiert",
      failed: "Kein Zugriff auf die Zwischenablage",
    },
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
    innerPadding: "Innerer Rand",
  },

  customDisplay: { manufacturer: "Eigenes", name: "Eigenes Display" },

  rotations: { 0: "0°", 90: "90°", 180: "180°", 270: "270°" },

  anchors: {
    lt: "Oben links",
    mt: "Oben Mitte",
    rt: "Oben rechts",
    lm: "Mitte links",
    mm: "Mitte",
    rm: "Mitte rechts",
    lb: "Unten links",
    mb: "Unten Mitte",
    rb: "Unten rechts",
  },

  iconPicker: {
    noMatch: "Keine Symbole gefunden",
    search: "Symbole suchen…",
    none: "Keine Symbole gefunden",
    add: "Symbol hinzufügen",
    remove: "Symbol entfernen",
    left: "Nach links",
    right: "Nach rechts",
    empty: "Kein Symbol",
  },

  pointsField: {
    x: "X",
    y: "Y",
    add: "Punkt hinzufügen",
    remove: (number: number): string => `Punkt ${number} entfernen`,
  },

  fontField: {
    choose: "Schriftart wählen",
    loading: "Schriftarten werden geladen …",
    missing: (name: string): string => `${name} (nicht installiert)`,
  },

  settings: {
    title: "Einstellungen",
    subtitle: "Schriftarten, Widgets und ein Blick auf Ihre Dashboards",
    open: "Einstellungen öffnen",
    back: "Zurück zu den Dashboards",
    sections: "Bereiche der Einstellungen",
    tabs: {
      overview: "Übersicht",
      fonts: "Schriftarten",
      widgets: "Widgets",
    },
    soon: "Demnächst",
    about: {
      overview: "Ein Blick auf das, was Sie bisher gebaut haben.",
      fonts:
        "Schriftarten bestimmen, wie jeder Text gezeichnet wird. Installieren Sie eine Schriftart einmal und wählen Sie sie dann im Feld Schriftart eines Elements oder Widgets.",
      widgets:
        "Widgets lesen Ihre Entitäten, Kalender und Vorhersagen und zeichnen sie für Sie. Pakete im Widget-Ordner erscheinen hier.",
    },
    abilities: {
      install: "Installieren",
      preview: "Vorschau",
      remove: "Entfernen",
      reload: "Neu laden",
      add: "Pakete hinzufügen",
      switch: "Ein- und ausschalten",
    },
    overview: {
      dashboards: "Dashboards",
      elements: "Platzierte Elemente",
      widgetsInstalled: "Installierte Widgets",
      fontsInstalled: "Installierte Schriftarten",
      mostUsed: "Widgets in Ihren Dashboards",
      noneUsed: "Noch kein Widget liegt auf einem Dashboard.",
    },
    fonts: {
      install: "Schriftart installieren",
      installing: "Wird installiert …",
      dropHint: "Dateien .ttf oder .otf hier ablegen",
      limit: (size: string): string => `Bis zu ${size} je Datei`,
      bundled: "Gehört zu OpenDisplay",
      unused: "Nicht verwendet",
      usedIn: (count: number): string =>
        `In ${count} ${count === 1 ? "Dashboard" : "Dashboards"} verwendet`,
      noPreview: "Keine Vorschau",
      list: "Installierte Schriftarten",
      remove: (name: string): string => `${name} entfernen`,
      removeTitle: (name: string): string => `${name} entfernen?`,
      removeUnusedBody:
        "Die Schriftdatei wird gelöscht. Sie können sie jederzeit erneut installieren.",
      removeUsedBody: (count: number, names: string): string =>
        `Sie wird in ${count} ${count === 1 ? "Dashboard" : "Dashboards"} verwendet: ${names}. Deren Text wird mit der Standardschrift gezeichnet, bis Sie sie erneut installieren.`,
      removeAction: "Schriftart entfernen",
      eyebrow: "Schriftarten",
      installFailed: "Die Schriftart konnte nicht installiert werden",
      removeFailed: "Die Schriftart konnte nicht entfernt werden",
      loadFailed: "Die Schriftarten konnten nicht geladen werden",
      notFontFile: (name: string): string =>
        `${name} ist keine .ttf- oder .otf-Datei`,
      errors: {
        invalid_font:
          "Diese Datei ist keine Schriftart, die der Renderer lesen kann",
        unsupported_type:
          "Nur .ttf- und .otf-Dateien können installiert werden",
        invalid_size:
          "Eine Schriftdatei darf nicht leer und nicht größer als 2 MB sein",
        invalid_name:
          "Dieser Dateiname kann für eine Schriftart nicht verwendet werden",
        font_exists: "Eine Schriftart mit diesem Namen ist bereits installiert",
        reserved_name: "Dieser Name gehört zu einer Schriftart von OpenDisplay",
        font_in_use: "Dashboards verwenden diese Schriftart noch",
        bundled_font:
          "Eine Schriftart von OpenDisplay kann nicht entfernt werden",
        not_found: "Diese Schriftart ist nicht installiert",
      },
    },
    widgets: {
      upload: "Paket hinzufügen",
      noPreview: "Noch kein Bild",
      reload: "Widgets neu laden",
      builtin: "Eingebaut",
      custom: "Eigenes",
      version: (version: string): string => `Version ${version}`,
      defaultSize: "Standardgröße",
      errors: "Pakete, die nicht geladen wurden",
      list: "Installierte Widgets",
    },
  },

  shortcuts: {
    eyebrow: "Hilfe",
    title: "Tastenkürzel",
    open: "Tastenkürzel",
    groups: {
      edit: "Bearbeiten",
      arrange: "Anordnen",
      group: "Gruppen",
      view: "Ansicht",
      history: "Verlauf",
    },
  },

  dashboardStatus: {
    draft: "Entwurf",
    ready: "Bereit",
  },

  rangesField: {
    from: "Ab",
    color: "Farbe",
    add: "Bereich hinzufügen",
    remove: (number: number): string => `Bereich ${number} entfernen`,
    hint: "Jeder Bereich dauert bis zum Beginn des nächsten. Der erste beginnt beim niedrigsten Wert.",
  },

  seriesField: {
    entity: "Entität",
    settings: "Linieneinstellungen",
    add: "Reihe hinzufügen",
    remove: (number: number): string => `Reihe ${number} entfernen`,
  },

  importDialog: {
    eyebrow: "Import",
    heading: "Dashboard importieren",
    replaces:
      "Der Import ersetzt die Elemente dieses Dashboards. Name, ID und Anzeigeeinstellungen bleiben.",
    adjusted:
      "Die Datei wurde für eine größere Anzeige erstellt, daher wurden einige Elemente verkleinert oder näher gerückt. Verschiebe sie nach dem Import, wohin du möchtest.",
    colorsTitle: "Die Datei wurde für andere Farben erstellt",
    colorsHelp:
      "Wähle für jede Farbe der Datei eine Farbe dieses Dashboards. Gemeinsame Farben bleiben.",
    confirm: "Importieren",
  },

  imagePicker: {
    address: "Adresse oder Pfad",
    media: "Aus Medien wählen",
    entity: "Kamera- oder Bild-Entität",
    hint: "Eine Datei des Medienbrowsers (lokale Medien, Image upload und andere Quellen, die eine Datei auf diesem Server sind), eine Kamera- oder Bild-Entität oder eine Webadresse. Streams und Online-Dienste lassen sich nicht zeichnen.",
    unsupported:
      "Keine Webadresse, Kamera- oder Bild-Entität, keine Medienquelle und keine Datei aus /local oder /media.",
    empty: "Kein Bild",
  },

  colors: {
    clear: "Farbe entfernen",
    none: "Keine",
    accent: "Akzent",
    gray: (level: number): string => `Grau ${level}`,
    names: {
      black: "Schwarz",
      white: "Weiß",
      red: "Rot",
      yellow: "Gelb",
      blue: "Blau",
      green: "Grün",
      orange: "Orange",
    },
  },

  palettes: {
    bw: "Schwarz / Weiß",
    bwr: "Schwarz / Weiß / Rot",
    bwy: "Schwarz / Weiß / Gelb",
    bwry: "Schwarz / Weiß / Rot / Gelb",
    spectra6: "Spectra 6 · Schwarz / Weiß / Rot / Gelb / Blau / Grün",
    seven_color: "Sieben Farben · Spectra 6 und Orange",
    grayscale4: "Graustufen · 4 Stufen",
    grayscale16: "Graustufen · 16 Stufen",
  },

  basic: {
    modeTitle: "Editor",
    basic: "Einfach",
    basicHint: "Ein Raster aus Bereichen, in jedem ein Widget.",
    advanced: "Erweitert",
    advancedHint: "Jedes Element frei platzieren.",
    badgeBasic: "Einfach",
    badgeAdvanced: "Erweitert",
    stepsLabel: "Schritte des Editors",
    stepLayout: "Layout",
    stepWidgets: "Widgets",
    widgetsHeading: "Widgets",
    layoutTitle: "Layout",
    layoutHeading: "Bereiche",
    gridHeading: "Raster",
    columns: "Spalten",
    rows: "Zeilen",
    gap: "Abstand",
    regionsHeading: "Bereiche",
    regionsHint:
      "Klicke eine Zelle und dann eine zweite, um die Zellen dazwischen zu einem Bereich zu verbinden. Klicke einen Bereich doppelt an, um ihn zu entfernen.",
    joinStarted: "Klicke eine zweite Zelle, um den Bereich abzuschließen.",
    joinInvalid: "Das würde einen Bereich zerschneiden.",
    cancelJoin: "Abbrechen",
    regionCount: (count: number): string =>
      `${count} ${count === 1 ? "Bereich" : "Bereiche"}`,
    cell: (row: number, column: number): string =>
      `Zelle in Zeile ${row} und Spalte ${column}`,
    regionSize: (columns: number, rows: number): string =>
      `Bereich ${columns}×${rows}`,
    region: (name: string): string => `Bereich ${name}`,
    emptyRegion: "Leerer Bereich",
    emptyRegionHint: "Wähle ein Widget aus der Liste.",
    noEmptyRegion: "Jeder Bereich enthält schon ein Widget.",
    layoutStepHint:
      "Zeichne zuerst die Bereiche und fülle sie dann im Tab Widgets.",
    widgetsStepHint:
      "Ziehe ein Widget in einen Bereich oder klicke es an, um den gewählten Bereich zu füllen.",
  },
};
