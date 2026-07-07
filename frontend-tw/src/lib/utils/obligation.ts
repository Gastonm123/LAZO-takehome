import type { SortDirection, SortField } from "@/lib/types/obligation";

export function getDueDateVariant(
  dueDate: string,
  overdue: boolean,
): "success" | "warning" | "danger" {
  if (overdue) return "danger";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 1) return "danger";
  if (diffDays <= 10) return "warning";
  return "success";
}

export function formatDate(value: string, locale = "es-AR"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function sortObligations<T extends Record<SortField, string>>(
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

export function filterObligations<
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

export function getTransitionLabel(
  from: string,
  to: string,
  t: (key: string) => string,
): string {
  if (from === "submitted" && to === "done")
    return t("detail.actions.markAsDone");
  if (from === "submitted" && to === "in_progress")
    return t("detail.actions.rework");
  if (from === "done" && to === "in_progress")
    return t("detail.actions.reopen");
  if (to === "in_progress" && from === "pending")
    return t("detail.actions.start");
  if (to === "submitted") return t("detail.actions.submit");
  if (to === "pending") return t("detail.actions.backToPending");
  return t(`status.${to}`);
}

export const dueDateBadgeClass: Record<"success" | "warning" | "danger", string> = {
  success: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  warning: "bg-amber-100 text-amber-800 ring-amber-200",
  danger: "bg-red-100 text-red-800 ring-red-200",
};

export const statusBadgeClass: Record<string, string> = {
  pending: "bg-slate-100 text-slate-700 ring-slate-200",
  in_progress: "bg-lazo-100 text-lazo-700 ring-lazo-200",
  submitted: "bg-sky-100 text-sky-800 ring-sky-200",
  done: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};
