"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import DueDateBadge from "@/components/ui/DueDateBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Obligation } from "@/lib/types/obligation";
import { useTranslation } from "react-i18next";

export default function UpcomingTable({ items }: { items: Obligation[] }) {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        {t("dashboard.upcomingTable")}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">{t("common.title")}</th>
              <th className="px-3 py-2 font-medium">{t("common.owner")}</th>
              <th className="px-3 py-2 font-medium">{t("common.dueDate")}</th>
              <th className="px-3 py-2 font-medium">{t("common.status")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer border-b border-slate-50 transition hover:bg-lazo-50 last:border-0"
                onClick={() => router.push(`/obligations/${item.id}`)}
              >
                <td className="px-3 py-3">{item.title}</td>
                <td className="px-3 py-3">{item.owner}</td>
                <td className="px-3 py-3">
                  <DueDateBadge dueDate={item.dueDate} overdue={item.overdue} />
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
