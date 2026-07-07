"use client";

import type { SortDirection, SortField } from "@/lib/types/obligation";
import { useTranslation } from "react-i18next";

interface Props {
  searchQuery: string;
  sortField: SortField;
  sortDirection: SortDirection;
  onSearchChange: (value: string) => void;
  onSortFieldChange: (value: SortField) => void;
  onSortDirectionChange: (value: SortDirection) => void;
}

export default function ObligationsToolbar({
  searchQuery,
  sortField,
  sortDirection,
  onSearchChange,
  onSortFieldChange,
  onSortDirectionChange,
}: Props) {
  const { t } = useTranslation();
  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-lazo-500 focus:ring-2";

  return (
    <div className="mb-4 grid gap-3 md:grid-cols-12">
      <input
        type="search"
        className={`md:col-span-6 ${inputClass}`}
        placeholder={t("common.search")}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <select
        className={`md:col-span-3 ${inputClass}`}
        value={sortField}
        onChange={(e) => onSortFieldChange(e.target.value as SortField)}
      >
        <option value="dueDate">{t("common.dueDate")}</option>
        <option value="createdAt">{t("common.createdAt")}</option>
        <option value="updatedAt">{t("common.updatedAt")}</option>
      </select>
      <select
        className={`md:col-span-3 ${inputClass}`}
        value={sortDirection}
        onChange={(e) =>
          onSortDirectionChange(e.target.value as SortDirection)
        }
      >
        <option value="asc">ASC</option>
        <option value="desc">DESC</option>
      </select>
    </div>
  );
}
