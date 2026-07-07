"use client";

import {
  dueDateBadgeClass,
  formatDate,
  getDueDateVariant,
} from "@/lib/utils/obligation";
import Badge from "./Badge";

interface DueDateBadgeProps {
  dueDate: string;
  overdue: boolean;
}

export default function DueDateBadge({ dueDate, overdue }: DueDateBadgeProps) {
  const variant = getDueDateVariant(dueDate, overdue);
  return (
    <Badge className={dueDateBadgeClass[variant]}>{formatDate(dueDate)}</Badge>
  );
}
