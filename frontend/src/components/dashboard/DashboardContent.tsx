"use client";

import DashboardStats from "@/components/dashboard/DashboardStats";
import UpcomingTable from "@/components/dashboard/UpcomingTable";
import type { DashboardSummary } from "@/lib/logic/obligation";
import { useTranslation } from "react-i18next";

export default function DashboardContent({
  summary,
}: {
  summary: DashboardSummary;
}) {
  const { t } = useTranslation();
  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold text-lazo-800">
        {t("dashboard.title")}
      </h1>
      <DashboardStats summary={summary} />
      <UpcomingTable items={summary.upcomingObligations} />
    </section>
  );
}
