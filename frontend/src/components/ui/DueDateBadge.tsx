"use client";

import { formatDate } from "@/lib/utils/formatDate";
import { useTranslation } from "react-i18next";
import Badge from "./Badge";

const dueDateBadgeClass = {
  success: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  warning: "bg-amber-100 text-amber-800 ring-amber-200",
  danger: "bg-red-100 text-red-800 ring-red-200",
} as const;

function getVariant(
  dueDate: string,
  overdue: boolean,
): keyof typeof dueDateBadgeClass {
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

interface DueDateBadgeProps {
  dueDate: string;
  overdue: boolean;
}

export default function DueDateBadge({ dueDate, overdue }: DueDateBadgeProps) {
  const { i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "es-AR";
  const variant = getVariant(dueDate, overdue);

  return (
    <Badge className={dueDateBadgeClass[variant]}>
      {formatDate(dueDate, locale)}
    </Badge>
  );
}
