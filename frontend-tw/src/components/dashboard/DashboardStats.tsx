"use client";

import StatCard from "@/components/ui/StatCard";
import type { DashboardSummary } from "@/lib/types/obligation";
import { useTranslation } from "react-i18next";

export default function DashboardStats({
  summary,
}: {
  summary: DashboardSummary;
}) {
  const { t } = useTranslation();
  const row1 = [
    { label: t("dashboard.stats.total"), value: summary.total },
    { label: t("dashboard.stats.overdue"), value: summary.overdue },
    { label: t("dashboard.stats.upcoming"), value: summary.upcoming },
  ];
  const row2 = [
    { label: t("dashboard.stats.pending"), value: summary.pending },
    { label: t("dashboard.stats.inProgress"), value: summary.inProgress },
    { label: t("dashboard.stats.submitted"), value: summary.submitted },
    { label: t("dashboard.stats.done"), value: summary.done },
  ];

  return (
    <>
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        {row1.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {row2.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>
    </>
  );
}
