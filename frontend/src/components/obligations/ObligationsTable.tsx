"use client";

import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import DueDateBadge from "@/components/ui/DueDateBadge";
import StateBadge from "@/components/ui/StateBadge";
import type { Obligation } from "@/lib/logic/obligation";
import { useTranslation } from "react-i18next";

export default function ObligationsTable({ items }: { items: Obligation[] }) {
  const router = useRouter();
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <Card className="py-12 text-center text-slate-500">
        {t("obligations.empty")}
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-lazo-50/50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">{t("common.title")}</th>
              <th className="px-4 py-3 font-medium">{t("common.type")}</th>
              <th className="px-4 py-3 font-medium">{t("common.owner")}</th>
              <th className="px-4 py-3 font-medium">{t("common.dueDate")}</th>
              <th className="px-4 py-3 font-medium">{t("common.state")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="cursor-pointer border-b border-slate-50 transition hover:bg-lazo-50"
                onClick={() => router.push(`/obligations/${item.id}`)}
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {item.title}
                </td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{item.owner}</td>
                <td className="px-4 py-3">
                  <DueDateBadge dueDate={item.dueDate} overdue={item.overdue} />
                </td>
                <td className="px-4 py-3">
                  <StateBadge state={item.state} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
