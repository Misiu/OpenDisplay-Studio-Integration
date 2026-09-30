import type { StringsOverride } from "./i18n";

/**
 * The German text of the panel. Anything missing here is shown in English, so a
 * translator can finish it without breaking anything.
 */
export const german: StringsOverride = {
  common: {
    cancel: "Abbrechen",
    close: "Schließen",
  },

  commands: {
    undo: "Rückgängig",
    redo: "Wiederholen",
    delete: "Löschen",
    hide: "Ausblenden",
    show: "Einblenden",
    lock: "Sperren",
    unlock: "Entsperren",
  },

  app: {
    loading: "OpenDisplay Studio wird geladen…",
    loadFailed: "OpenDisplay Studio konnte nicht geladen werden",
    createFailed: "Das Dashboard konnte nicht erstellt werden",
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
    customSize: "Eigene Größe",
    customSizeHint: "Auflösung und Farben festlegen",
    fromDevice: "Von OpenDisplay-Gerät",
    fromDeviceHint: "Kommt später",
    create: "Dashboard erstellen",
    creating: "Wird erstellt…",
  },

  header: {
    dashboards: "Dashboards",
    name: "Dashboard-Name",
    view: "Dashboard-Ansicht",
    design: "Entwurf",
    code: "Code",
    setDraft: "Als Entwurf markieren",
    setReady: "Als fertig markieren",
    save: "Speichern",
    saving: "Wird gespeichert…",
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
    widgetErrors: (count: number): string =>
      `${count} ${count === 1 ? "Widget-Paket konnte" : "Widget-Pakete konnten"} nicht geladen werden`,
    widgetsReloaded: (loaded: number, failed: number): string =>
      failed === 0
        ? `Widgets neu geladen — ${loaded} geladen`
        : `Widgets neu geladen — ${loaded} geladen, ${failed} fehlgeschlagen`,
    reloadFailed: "Die Widgets konnten nicht neu geladen werden",
    noPrimitives: "Keine passenden Primitive",
    entryHint: (description: string): string =>
      `${description} Zum Hinzufügen klicken oder ziehen.`,
  },

  structure: {
    title: "Struktur",
    heading: "Elemente",
    collapse: "Inspektor einklappen",
    empty: "Ziehe Widgets oder Primitive auf die Fläche.",
    widget: "Widget",
    reorderTitle: "Ebene neu anordnen",
    reorder: (name: string): string => `${name} neu anordnen`,
  },

  inspector: {
    expand: "Inspektor ausklappen",
    rail: "Ebenen",
    resize: "Breite des Inspektors ändern",
    dashboard: "Dashboard",
    dashboardHint: "Display- und Flächeneinstellungen",
    display: "Display",
    displayType: "Display-Typ",
    workingArea: "Arbeitsbereich",
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
    deleteDashboard: "Dashboard löschen",
    removeElement: "Element entfernen",
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
    rendering: "Wird gerendert…",
    previewAlt: "Vom Backend gerenderte Display-Vorschau",
    hidden: "Ausgeblendet",
    layers: (count: number): string =>
      `${count} ${count === 1 ? "Ebene" : "Ebenen"}`,
    padding: (pixels: number): string => `Rand ${pixels}px`,
    snap: (pixels: number): string => `Einrasten ${pixels}px`,
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
    name: "Dashboard-Name",
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

  palettes: {
    bw: "Schwarz / Weiß",
    bwr: "Schwarz / Weiß / Rot",
    bwy: "Schwarz / Weiß / Gelb",
    bwry: "Schwarz / Weiß / Rot / Gelb",
    spectra6: "Spectra 6 · Schwarz / Weiß / Rot / Gelb / Blau / Grün",
  },
};
