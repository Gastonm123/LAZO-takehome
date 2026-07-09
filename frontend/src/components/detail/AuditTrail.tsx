"use client";

import type { ObligationAudit, ObligationState } from "@/lib/logic/obligation";
import { formatDate } from "@/lib/utils/formatDate";
import { useTranslation } from "react-i18next";

const STATE_VALUES: ObligationState[] = [
  "pending",
  "in_progress",
  "submitted",
  "done",
];

function isStateValue(value: string): value is ObligationState {
  return STATE_VALUES.includes(value as ObligationState);
}

function groupAuditByDate(
  entries: ObligationAudit[],
): [string, ObligationAudit[]][] {
  const groups = new Map<string, ObligationAudit[]>();

  for (const entry of entries) {
    const list = groups.get(entry.date) ?? [];
    list.push(entry);
    groups.set(entry.date, list);
  }

  return [...groups.entries()].sort(
    ([left], [right]) => new Date(right).getTime() - new Date(left).getTime(),
  );
}

export default function AuditTrail({
  entries,
}: {
  entries: ObligationAudit[];
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "es-AR";

  const formatValue = (field: string, value: string) => {
    if (!value) {
      return "—";
    }
    if (field === "state" && isStateValue(value)) {
      return t(`state.${value}`);
    }
    if (
      field === "dueDate" ||
      field === "createdAt" ||
      field === "updatedAt" ||
      value.includes("T")
    ) {
      return formatDate(value, locale);
    }
    if (value === "true" || value === "false") {
      return value === "true" ? t("common.yes") : t("common.no");
    }
    return value;
  };

  const fieldLabel = (field: string) => {
    const key = `fields.${field}`;
    const translated = t(key);
    return translated === key ? field : translated;
  };

  const groups = groupAuditByDate(entries);

  if (groups.length === 0) {
    return <p className="text-sm text-slate-500">{t("detail.auditEmpty")}</p>;
  }

  return (
    <div className="space-y-2">
      {groups.map(([date, changes]) => (
        <details
          key={date}
          className="rounded-lg border border-slate-200 bg-white"
          open
        >
          <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-slate-700">
            {formatDate(date, locale)}
          </summary>
          <div className="overflow-x-auto border-t border-slate-100">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">
                    {t("detail.auditField")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    {t("detail.auditFrom")}
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    {t("detail.auditTo")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {changes.map((entry, index) => (
                  <tr key={`${entry.field}-${index}`}>
                    <td className="px-4 py-2 text-slate-800">
                      {fieldLabel(entry.field)}
                    </td>
                    <td className="px-4 py-2 text-slate-700">
                      {formatValue(entry.field, entry.from)}
                    </td>
                    <td className="px-4 py-2 text-slate-700">
                      {formatValue(entry.field, entry.to)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </div>
  );
}
