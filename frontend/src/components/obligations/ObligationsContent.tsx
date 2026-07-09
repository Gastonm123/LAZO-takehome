"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import ObligationsTable from "@/components/obligations/ObligationsTable";
import ObligationsToolbar from "@/components/obligations/ObligationsToolbar";
import type { Obligation } from "@/lib/logic/obligation";
import { filterByQuery, sortByField } from "@/lib/utils/listQuery";
import {
  setSearchQuery,
  setSortDirection,
  setSortField,
} from "@/store/obligationsUiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function ObligationsContent({
  items,
}: {
  items: Obligation[];
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { searchQuery, sortField, sortDirection } = useAppSelector(
    (state) => state.obligationsUi,
  );

  const visibleItems = useMemo(() => {
    const filtered = filterByQuery(items, searchQuery);
    return sortByField(filtered, sortField, sortDirection);
  }, [items, searchQuery, sortField, sortDirection]);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-lazo-800">
          {t("obligations.title")}
        </h1>
        <Link
          href="/obligations/new"
          className="inline-flex items-center justify-center rounded-lg bg-lazo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-lazo-700"
        >
          {t("obligations.create")}
        </Link>
      </div>
      <ObligationsToolbar
        searchQuery={searchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        onSearchChange={(value) => dispatch(setSearchQuery(value))}
        onSortFieldChange={(value) => dispatch(setSortField(value))}
        onSortDirectionChange={(value) => dispatch(setSortDirection(value))}
      />
      <ObligationsTable items={visibleItems} />
    </section>
  );
}
