"use client";

import { useTranslation } from "react-i18next";
import Badge from "./Badge";

export default function OverdueBadge({ overdue }: { overdue: boolean }) {
  const { t } = useTranslation();

  if (!overdue) {
    return null;
  }

  return (
    <Badge className="bg-red-100 text-red-800 ring-red-200">
      {t("common.overdueBadge")}
    </Badge>
  );
}
