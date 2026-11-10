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
    auto: "Auto",
  },

  commands: {
    group: "Zgrupuj",
    ungroup: "Rozgrupuj",
    enterGroup: "Wejdź do grupy",
    exitGroup: "Wyjdź z grupy",
    deselect: "Odznacz",
    copy: "Kopiuj",
    cut: "Wytnij",
    paste: "Wklej",
    pasteHere: "Wklej tutaj",
    duplicate: "Duplikuj",
    rename: "Zmień nazwę",
    save: "Zapisz dashboard",
    toggleCode: "Przełącz między projektem a kodem",
    zoomIn: "Powiększ",
    zoomOut: "Pomniejsz",
    zoomReset: "Resetuj powiększenie",
    showShortcuts: "Skróty klawiszowe",
    nudge: {
      left: "Przesuń w lewo",
      right: "Przesuń w prawo",
      up: "Przesuń w górę",
      down: "Przesuń w dół",
    },
    undo: "Cofnij",
    redo: "Ponów",
    delete: "Usuń",
    hide: "Ukryj",
    show: "Pokaż",
    lock: "Zablokuj",
    unlock: "Odblokuj",
    bringToFront: "Przenieś na wierzch",
    sendToBack: "Przenieś pod spód",
    moveUp: "Przenieś wyżej",
    moveDown: "Przenieś niżej",
    align: {
      left: "Wyrównaj do lewej",
      center: "Wyśrodkuj w poziomie",
      right: "Wyrównaj do prawej",
      top: "Wyrównaj do góry",
      middle: "Wyśrodkuj w pionie",
      bottom: "Wyrównaj do dołu",
    },
    distribute: {
      horizontal: "Rozmieść równo w poziomie",
      vertical: "Rozmieść równo w pionie",
    },
  },

  app: {
    deleteElementsTitle: (count: number): string =>
      `Usunąć ${count} ${plural(count, "element", "elementy", "elementów")}?`,
    deleteContainerBody:
      "To usuwa kontener i wszystko, co w nim jest. Możesz to cofnąć przyciskiem Cofnij.",
    exportFailed: "Nie udało się wyeksportować dashboardu",
    importFailed: "Nie udało się odczytać pliku",
    notAJsonFile: "To nie jest plik JSON",
    imported: (count: number): string => `Zaimportowano elementy: ${count}`,
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
    settings: "Ustawienia",
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
    previewLabel: "Podgląd wyświetlacza",
    turnLeft: "Obróć o 90° w lewo",
    turnRight: "Obróć o 90° w prawo",
    creating: "Tworzenie…",
  },

  header: {
    help: "Skróty klawiszowe",
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
    saving: "Zapisywanie…",
  },

  library: {
    containers: "Kontenery",
    container: "Kontener",
    containerHint: "Zawiera inne elementy i przesuwa je razem.",
    sections: {
      text: "Tekst",
      shapes: "Kształty",
      media: "Ikony i media",
      data: "Dane",
      debug: "Narzędzia",
    },
    collapseSection: (name: string): string => `Zwiń ${name}`,
    expandSection: (name: string): string => `Rozwiń ${name}`,
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
    noMatches: "Brak pasujących elementów",
    entryHint: (description: string): string =>
      `${description} Kliknij lub przeciągnij, aby dodać.`,
  },

  structure: {
    root: (count: number): string =>
      `Główny poziom (${count} ${plural(count, "widget", "widgety", "widgetów")})`,
    rootName: "Główny poziom",
    breadcrumb: "Edytowana grupa",
    exit: "Wyjdź",
    container: "Kontener",
    group: "Grupa",
    groupBadge: "Grupa",
    search: "Szukaj warstw",
    searchPlaceholder: "Szukaj warstw…",
    rename: "Nazwa elementu",
    collapseRow: (name: string): string => `Zwiń ${name}`,
    expandRow: (name: string): string => `Rozwiń ${name}`,
    title: "Struktura",
    heading: "Elementy",
    collapse: "Zwiń inspektor",
    empty: "Przeciągnij widżety lub prymitywy na płótno.",
    widget: "Widżet",
    reorderTitle: "Zmień kolejność warstwy",
    reorder: (name: string): string => `Zmień kolejność: ${name}`,
  },

  inspector: {
    background: "Tło",
    backgroundEnabled: "Tło",
    backgroundFill: "Wypełnienie",
    backgroundOutline: "Obrys",
    backgroundWidth: "Grubość obrysu",
    backgroundRadius: "Promień zaokrąglenia",
    kindContainer: "Kontener",
    kindGroup: "Grupa",
    groupedChip: "Zgrupowany",
    selectedElements: (count: number): string =>
      `${count} ${plural(count, "element", "elementy", "elementów")}`,
    selectionHint:
      "Przesuwaj, ukrywaj, blokuj lub usuwaj je razem. Zgrupuj je, żeby zostały jednym elementem.",
    boundingBox: "Ramka obejmująca",
    advanced: "Zaawansowane",
    reset: "przywróć",
    resetTitle: (section: string): string => `Przywróć domyślne: ${section}`,
    changed: "Zmienione względem domyślnych",
    alignInParent: "Wyrównaj w rodzicu",
    expand: "Rozwiń inspektor",
    rail: "Warstwy",
    resize: "Zmień szerokość inspektora",
    dashboard: "Dashboard",
    dashboardHint: "Ustawienia obszaru roboczego",
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
    scalingLocked: (names: string): string =>
      `Nie można zmienić rozmiaru grupy: pozycja lub rozmiar elementu ${names} zależy od wyrażenia`,
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
    menuLabel: "Akcje płótna",
    enterGroupHint: "Enter / dwuklik, aby edytować",
    rendering: "Renderowanie…",
    previewAlt: "Podgląd wyświetlacza wyrenderowany przez backend",
    hidden: "Ukryty",
    layers: (count: number): string =>
      `${count} ${plural(count, "warstwa", "warstwy", "warstw")}`,
    padding: (pixels: number): string => `Margines ${pixels}px`,
    snap: (pixels: number): string => `Przyciąganie ${pixels}px`,
    arrangeLabel: "Układ zaznaczenia",
    alignToSelection: "Wyrównuj do zaznaczenia",
    alignToParent: "Wyrównuj do kontenera lub obszaru roboczego",
    grid: "Siatka",
    gridTitle: "Pokaż punkty siatki przyciągania",
    pan: "Przesuwanie",
    panTitle:
      "Przesuwanie: kółko przesuwa widok, Ctrl + kółko zmienia powiększenie. Wyłączone: kółko zmienia powiększenie.",
    addPoint: (name: string, number: number): string =>
      `Dodaj punkt: ${name}, po punkcie ${number}`,
    pointHandle: (name: string, number: number): string =>
      `Przesuń punkt ${number}: ${name}`,
    rotateHandle: (name: string): string => `Obróć: ${name}`,
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

  iconPicker: {
    noMatch: "Nie znaleziono ikon",
    search: "Szukaj ikon…",
    none: "Nie znaleziono ikon",
    add: "Dodaj ikonę",
    remove: "Usuń ikonę",
    left: "Przesuń w lewo",
    right: "Przesuń w prawo",
    empty: "Brak ikony",
  },

  pointsField: {
    x: "X",
    y: "Y",
    add: "Dodaj punkt",
    remove: (number: number): string => `Usuń punkt ${number}`,
  },

  fontField: {
    choose: "Wybierz czcionkę",
    loading: "Wczytuję czcionki…",
    missing: (name: string): string => `${name} (nie zainstalowana)`,
  },

  settings: {
    title: "Ustawienia",
    subtitle: "Czcionki, widgety i przegląd Twoich dashboardów",
    open: "Otwórz ustawienia",
    back: "Wróć do dashboardów",
    sections: "Sekcje ustawień",
    tabs: {
      overview: "Przegląd",
      fonts: "Czcionki",
      widgets: "Widgety",
    },
    soon: "Wkrótce",
    about: {
      overview: "Rzut oka na to, co już zbudowano.",
      fonts:
        "Czcionki decydują, jak rysowany jest każdy tekst. Zainstaluj czcionkę raz, a potem wybierz ją w polu Czcionka dowolnego elementu lub widgetu.",
      widgets:
        "Widgety czytają Twoje encje, kalendarze i prognozy i rysują je za Ciebie. Paczki z folderu widgetów pojawiają się tutaj.",
    },
    abilities: {
      install: "Instalowanie",
      preview: "Podgląd",
      remove: "Usuwanie",
      reload: "Przeładowanie",
      add: "Dodawanie paczek",
      switch: "Włączanie i wyłączanie",
    },
    overview: {
      dashboards: "Dashboardy",
      elements: "Elementy na dashboardach",
      widgetsInstalled: "Zainstalowane widgety",
      fontsInstalled: "Zainstalowane czcionki",
      mostUsed: "Widgety na Twoich dashboardach",
      noneUsed: "Żaden widget nie jest jeszcze na dashboardzie.",
    },
    fonts: {
      install: "Zainstaluj czcionkę",
      installing: "Instaluję…",
      dropHint: "Upuść tu pliki .ttf lub .otf",
      limit: (size: string): string => `Do ${size} każdy`,
      bundled: "Dołączona do OpenDisplay",
      unused: "Nieużywana",
      usedIn: (count: number): string =>
        `Używana w ${count} ${count === 1 ? "dashboardzie" : "dashboardach"}`,
      noPreview: "Brak podglądu",
      list: "Zainstalowane czcionki",
      remove: (name: string): string => `Usuń ${name}`,
      removeTitle: (name: string): string => `Usunąć ${name}?`,
      removeUnusedBody:
        "Plik czcionki zostanie usunięty. Możesz ją zainstalować ponownie w każdej chwili.",
      removeUsedBody: (count: number, names: string): string =>
        `Używa jej ${count} ${count === 1 ? "dashboard" : "dashboardów"}: ${names}. Ich tekst będzie rysowany czcionką domyślną, dopóki jej nie zainstalujesz ponownie.`,
      removeAction: "Usuń czcionkę",
      eyebrow: "Czcionki",
      installFailed: "Nie udało się zainstalować czcionki",
      removeFailed: "Nie udało się usunąć czcionki",
      loadFailed: "Nie udało się wczytać czcionek",
      notFontFile: (name: string): string =>
        `${name} nie jest plikiem .ttf ani .otf`,
      errors: {
        invalid_font:
          "Ten plik nie jest czcionką, którą renderer potrafi odczytać",
        unsupported_type: "Można zainstalować tylko pliki .ttf i .otf",
        invalid_size: "Plik czcionki nie może być pusty ani większy niż 2 MB",
        invalid_name: "Ta nazwa pliku nie nadaje się na czcionkę",
        font_exists: "Czcionka o tej nazwie jest już zainstalowana",
        reserved_name: "Ta nazwa należy do czcionki dołączonej do OpenDisplay",
        font_in_use: "Dashboardy nadal używają tej czcionki",
        bundled_font: "Czcionki dołączonej do OpenDisplay nie można usunąć",
        not_found: "Tej czcionki nie ma",
      },
    },
    widgets: {
      upload: "Dodaj paczkę",
      noPreview: "Jeszcze bez obrazka",
      reload: "Przeładuj widgety",
      builtin: "Wbudowany",
      custom: "Twój",
      version: (version: string): string => `Wersja ${version}`,
      defaultSize: "Domyślny rozmiar",
      errors: "Paczki, które się nie wczytały",
      list: "Zainstalowane widgety",
    },
  },

  shortcuts: {
    eyebrow: "Pomoc",
    title: "Skróty klawiszowe",
    open: "Skróty klawiszowe",
    groups: {
      edit: "Edycja",
      arrange: "Układanie",
      group: "Grupy",
      view: "Widok",
      history: "Historia",
    },
  },

  dashboardStatus: {
    draft: "Szkic",
    ready: "Gotowy",
  },

  rangesField: {
    from: "Od",
    color: "Kolor",
    add: "Dodaj zakres",
    remove: (number: number): string => `Usuń zakres ${number}`,
    hint: "Każdy zakres trwa do początku następnego. Pierwszy zaczyna się od najniższej wartości.",
  },

  seriesField: {
    entity: "Encja",
    settings: "Ustawienia linii",
    add: "Dodaj serię",
    remove: (number: number): string => `Usuń serię ${number}`,
  },

  importDialog: {
    eyebrow: "Import",
    heading: "Importuj dashboard",
    replaces:
      "Import zastępuje elementy tego dashboardu. Jego nazwa, id i ustawienia wyświetlacza zostają.",
    adjusted:
      "Plik powstał dla większego wyświetlacza, więc część elementów zmniejszono lub przysunięto. Po imporcie przesuń je, gdzie chcesz.",
    colorsTitle: "Plik powstał dla innego zestawu kolorów",
    colorsHelp:
      "Wybierz kolor tego dashboardu dla każdego koloru z pliku. Kolory wspólne zostają bez zmian.",
    confirm: "Importuj",
  },

  imagePicker: {
    address: "Adres lub ścieżka",
    media: "Wybierz z multimediów",
    entity: "Encja kamery lub obrazu",
    hint: "Plik z przeglądarki multimediów (multimedia lokalne, Image upload i inne źródła będące plikiem na tym serwerze), encja kamery lub obrazu albo adres internetowy. Strumieni i usług online nie można narysować.",
    unsupported:
      "To nie adres internetowy, encja kamery lub obrazu, źródło multimediów ani plik z /local lub /media.",
    empty: "Brak obrazu",
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
    grayscale16: "Skala szarości · 16 poziomów",
  },

  basic: {
    modeTitle: "Edytor",
    basic: "Podstawowy",
    basicHint: "Siatka regionów, w każdym widżet.",
    advanced: "Zaawansowany",
    advancedHint: "Każdy element ustawiasz swobodnie.",
    badgeBasic: "Podstawowy",
    badgeAdvanced: "Zaawansowany",
    stepsLabel: "Kroki edytora",
    stepLayout: "Układ",
    stepWidgets: "Widżety",
    widgetsHeading: "Widżety",
    layoutTitle: "Układ",
    layoutHeading: "Regiony",
    gridHeading: "Siatka",
    columns: "Kolumny",
    rows: "Wiersze",
    gap: "Odstęp",
    regionsHeading: "Regiony",
    regionsHint:
      "Kliknij jedną komórkę, potem drugą, aby połączyć komórki między nimi w region. Kliknij region dwukrotnie, aby go usunąć.",
    joinStarted: "Kliknij drugą komórkę, aby zakończyć region.",
    joinInvalid: "To przecięłoby region na pół.",
    cancelJoin: "Anuluj",
    regionCount: (count: number): string =>
      `${count} ${plural(count, "region", "regiony", "regionów")}`,
    cell: (row: number, column: number): string =>
      `Komórka w wierszu ${row} i kolumnie ${column}`,
    regionSize: (columns: number, rows: number): string =>
      `region ${columns}×${rows}`,
    region: (name: string): string => `Region ${name}`,
    emptyRegion: "Pusty region",
    emptyRegionHint: "Wybierz widżet z listy.",
    noEmptyRegion: "Każdy region ma już widżet.",
    layoutStepHint:
      "Najpierw narysuj regiony, potem wypełnij je na karcie Widżety.",
    widgetsStepHint:
      "Przeciągnij widżet do regionu albo kliknij go, aby wypełnić zaznaczony region.",
  },
};
