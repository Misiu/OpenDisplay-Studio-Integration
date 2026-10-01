import type { StringsOverride } from "./i18n";

/** Polish plural: 1 dashboard, 2–4 dashboardy, 5+ dashboardów. */
const plural = (
  count: number,
  one: string,
  few: string,
  many: string
): string => {
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  const isFew =
    lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14);
  return isFew ? few : many;
};

/**
 * The Polish text of the panel. Anything missing here is shown in English, so a
 * translator can finish it without breaking anything.
 */
export const polish: StringsOverride = {
  common: {
    increase: "Zwiększ",
    decrease: "Zmniejsz",
    cancel: "Anuluj",
    close: "Zamknij",
  },

  commands: {
    undo: "Cofnij",
    redo: "Ponów",
    delete: "Usuń",
    hide: "Ukryj",
    show: "Pokaż",
    lock: "Zablokuj",
    unlock: "Odblokuj",
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
    unsupportedPrimitive: (type: string): string =>
      `Nieobsługiwany typ prymitywu: ${type || "(pusty)"}`,
    confirmRemoval: "Potwierdź usunięcie",
    deleteElementTitle: (name: string): string => `Usunąć ${name}?`,
    deleteElementBody:
      "Element zostanie usunięty z dashboardu. Możesz go przywrócić przyciskiem Cofnij.",
    deleteElement: "Usuń element",
  },

  gallery: {
    title: "Dashboardy",
    count: (count: number): string =>
      `${count} ${plural(count, "dashboard", "dashboardy", "dashboardów")}`,
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
    updated: (date: string): string => `Zmieniono ${date}`,
    open: (name: string): string => `Otwórz dashboard ${name}`,
    actionsFor: (name: string): string => `Akcje dashboardu ${name}`,
    menuFor: (name: string): string => `Akcje dla ${name}`,
    renameField: (name: string): string => `Zmień nazwę dashboardu ${name}`,
    menu: {
      rename: "Zmień nazwę",
      duplicate: "Duplikuj",
      settings: "Ustawienia wyświetlacza",
      delete: "Usuń",
    },
    deleteTitle: "Usunąć dashboard?",
    deleteBody: "oraz wszystkie jego elementy zostaną trwale usunięte.",
    deleteWarning: "Tej operacji nie można cofnąć.",
    deleteAction: "Usuń dashboard",
    deleting: "Usuwanie…",
    settingsTitle: "Ustawienia wyświetlacza",
    settingsSave: "Zapisz zmiany",
    saving: "Zapisywanie…",
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
    noDevices:
      "Nie znaleziono urządzeń OpenDisplay. Skonfiguruj integrację OpenDisplay albo zacznij od gotowego wyświetlacza.",
    deviceDetails: "Rozmiar i kolory dashboardu",
    colors: "Kolory",
    create: "Utwórz dashboard",
    creating: "Tworzenie…",
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
    saving: "Zapisywanie…",
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
    widgetErrors: (count: number): string =>
      `Nie udało się załadować ${count} ${plural(count, "pakietu", "pakietów", "pakietów")} widżetów`,
    widgetsReloaded: (loaded: number, failed: number): string =>
      failed === 0
        ? `Widżety przeładowane — załadowano: ${loaded}`
        : `Widżety przeładowane — załadowano: ${loaded}, błędy: ${failed}`,
    reloadFailed: "Nie udało się przeładować widżetów",
    noPrimitives: "Brak pasujących prymitywów",
    entryHint: (description: string): string =>
      `${description} Kliknij lub przeciągnij, aby dodać.`,
  },

  structure: {
    title: "Struktura",
    heading: "Elementy",
    collapse: "Zwiń inspektor",
    empty: "Przeciągnij widżety lub prymitywy na płótno.",
    widget: "Widżet",
    reorderTitle: "Zmień kolejność warstwy",
    reorder: (name: string): string => `Zmień kolejność: ${name}`,
  },

  inspector: {
    alignInParent: "Wyrównaj w rodzicu",
    expand: "Rozwiń inspektor",
    rail: "Warstwy",
    resize: "Zmień szerokość inspektora",
    dashboard: "Dashboard",
    dashboardHint: "Ustawienia obszaru roboczego",
    workingArea: "Obszar roboczy",
    workingAreaHelp:
      "Margines wyznacza bezpieczny obszar edycji. Przyciąganie wyrównuje ruch i zmianę rozmiaru do pełnych pikseli.",
    layout: "Układ",
    widgetSettings: "Ustawienia widżetu",
    dataSources: "Źródła danych",
    widgetMissing: (type: string): string =>
      `Widżet ${type} nie jest zainstalowany. ` +
      "Zachowuje ustawienia i zostanie narysowany, gdy pakiet wróci.",
    appearance: "Wygląd",
    diagnostics: "Diagnostyka renderowania",
    removeElement: "Usuń element",
    locked: "Pozycja jest zablokowana",
    unlock: "Odblokuj",
    unlockElement: "Odblokuj pozycję elementu",
    kindWidget: "Widżet",
    kindPrimitive: "Prymityw ODL",
    subtitle: (kind: string, locked: boolean): string =>
      `${kind} · ${locked ? "pozycja zablokowana" : "edytowalny"}`,
    metrics: {
      queue: "Kolejka",
      data: "Dane",
      compile: "Kompilacja",
      render: "Renderowanie",
      encode: "Kodowanie",
      total: "Razem",
    },
  },

  expression: {
    toggleLabel: (field: string): string => `Wyrażenie dla pola: ${field}`,
    toggleTooltip: "Wyrażenie (lub wpisz {)",
    visibleLabel: "Widoczność",
    alwaysVisible: "Zawsze widoczny",
    positionLocked: (fields: string): string =>
      `Pozycję wyznacza wyrażenie (${fields})`,
    cornerFields: "Edytuj rogi",
    derivedFields: "Edytuj pozycję i rozmiar",
  },

  canvas: {
    rendering: "Renderowanie…",
    previewAlt: "Podgląd wyświetlacza wyrenderowany przez backend",
    hidden: "Ukryty",
    layers: (count: number): string =>
      `${count} ${plural(count, "warstwa", "warstwy", "warstw")}`,
    padding: (pixels: number): string => `Margines ${pixels}px`,
    snap: (pixels: number): string => `Przyciąganie ${pixels}px`,
    resizeHandle: (name: string, side: string): string =>
      `Zmień rozmiar: ${name}, od strony ${side}`,
    sides: {
      nw: "północno-zachodniej",
      n: "północnej",
      ne: "północno-wschodniej",
      e: "wschodniej",
      se: "południowo-wschodniej",
      s: "południowej",
      sw: "południowo-zachodniej",
      w: "zachodniej",
    },
  },

  zoom: {
    out: "Pomniejsz",
    in: "Powiększ",
    reset: "Resetuj",
    fit: "Dopasuj",
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
      failed: "Nie udało się skopiować",
    },
    status: {
      copied: "YAML skopiowany do schowka",
      failed: "Brak dostępu do schowka",
    },
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
    innerPadding: "Margines wewnętrzny",
  },

  customDisplay: { manufacturer: "Własny", name: "Własny wyświetlacz" },

  rotations: { 0: "0°", 90: "90°", 180: "180°", 270: "270°" },

  anchors: {
    lt: "Lewy górny",
    mt: "Górny środek",
    rt: "Prawy górny",
    lm: "Lewy środek",
    mm: "Środek",
    rm: "Prawy środek",
    lb: "Lewy dolny",
    mb: "Dolny środek",
    rb: "Prawy dolny",
  },

  colors: {
    clear: "Wyczyść kolor",
    none: "Brak",
    accent: "Akcent",
    gray: (level: number): string => `Szary ${level}`,
    names: {
      black: "Czarny",
      white: "Biały",
      red: "Czerwony",
      yellow: "Żółty",
      blue: "Niebieski",
      green: "Zielony",
      orange: "Pomarańczowy",
    },
  },

  palettes: {
    bw: "Czarny / biały",
    bwr: "Czarny / biały / czerwony",
    bwy: "Czarny / biały / żółty",
    bwry: "Czarny / biały / czerwony / żółty",
    spectra6:
      "Spectra 6 · czarny / biały / czerwony / żółty / niebieski / zielony",
    seven_color: "Siedem kolorów · Spectra 6 i pomarańczowy",
    grayscale4: "Skala szarości · 4 poziomy",
    grayscale8: "Skala szarości · 8 poziomów",
    grayscale16: "Skala szarości · 16 poziomów",
  },
};
