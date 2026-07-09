"use client";

import type { ObligationState } from "@/lib/logic/obligation";
import { useTranslation } from "react-i18next";
import Badge from "./Badge";

const stateBadgeClass: Record<ObligationState, string> = {
  pending: "bg-slate-100 text-slate-700 ring-slate-200",
  in_progress: "bg-lazo-100 text-lazo-700 ring-lazo-200",
  submitted: "bg-sky-100 text-sky-800 ring-sky-200",
  done: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

export default function StateBadge({ state }: { state: ObligationState }) {
  const { t } = useTranslation();
  return (
    <Badge className={stateBadgeClass[state]}>{t(`state.${state}`)}</Badge>
  );
}
