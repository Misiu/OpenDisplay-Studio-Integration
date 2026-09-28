export interface CatalogSearchItem { name: string; description: string }

export const filterCatalog = <T extends CatalogSearchItem>(items: T[], query: string): T[] => {
  const normalized = query.trim().toLocaleLowerCase()
  if (!normalized) return items
  return items.filter(item => `${item.name} ${item.description}`.toLocaleLowerCase().includes(normalized))
}
