export interface CatalogSearchItem {
  name: string;
  description: string;
}

export const filterCatalog = <T extends CatalogSearchItem>(
  items: T[],
  query: string
): T[] => {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return items;
  return items.filter((item) =>
    `${item.name} ${item.description}`.toLocaleLowerCase().includes(normalized)
  );
};

/** The sections primitives are listed in, in the order of the library, by category. */
export const PRIMITIVE_SECTIONS = [
  "text",
  "shapes",
  "media",
  "data",
  "debug",
] as const;

export interface LibrarySection<T> {
  id: string;
  entries: T[];
}

/**
 * Splits primitives into the sections of the library. A category no section knows gets a
 * section of its own at the end; a section without entries is left out.
 */
export const primitiveSections = <T extends { category: string }>(
  items: T[]
): LibrarySection<T>[] => {
  const known: string[] = [...PRIMITIVE_SECTIONS];
  const others = [
    ...new Set(
      items.map((item) => item.category).filter((id) => !known.includes(id))
    ),
  ];
  return [...known, ...others]
    .map((id) => ({
      id,
      entries: items.filter((item) => item.category === id),
    }))
    .filter((section) => section.entries.length > 0);
};

/** Groups entries by category, in the order each category first appears. */
export const groupByCategory = <T extends { category: string }>(
  items: T[]
): Array<[string, T[]]> => {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  }
  return [...groups.entries()];
};
