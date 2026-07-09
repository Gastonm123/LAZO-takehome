export type SortField = "createdAt" | "updatedAt" | "dueDate";
export type SortDirection = "asc" | "desc";

export function sortByField<T extends Record<SortField, string>>(
  items: T[],
  field: SortField,
  direction: SortDirection,
): T[] {
  return [...items].sort((a, b) => {
    const left = new Date(a[field]).getTime();
    const right = new Date(b[field]).getTime();
    return direction === "asc" ? left - right : right - left;
  });
}

export function filterByQuery<
  T extends { title: string; owner: string; type: string },
>(items: T[], query: string): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) =>
    [item.title, item.owner, item.type]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}
