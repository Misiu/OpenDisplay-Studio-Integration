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
