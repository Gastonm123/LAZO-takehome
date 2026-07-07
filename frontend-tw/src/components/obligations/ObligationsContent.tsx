"use client";

import { useMemo } from "react";
import ObligationsTable from "@/components/obligations/ObligationsTable";
import ObligationsToolbar from "@/components/obligations/ObligationsToolbar";
import type { Obligation } from "@/lib/types/obligation";
import {
  filterObligations,
  sortObligations,
} from "@/lib/utils/obligation";
import {
  setSearchQuery,
  setSortDirection,
  setSortField,
} from "@/store/obligationsUiSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";

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
    const filtered = filterObligations(items, searchQuery);
    return sortObligations(filtered, sortField, sortDirection);
  }, [items, searchQuery, sortField, sortDirection]);

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold text-lazo-800">
        {t("obligations.title")}
      </h1>
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
