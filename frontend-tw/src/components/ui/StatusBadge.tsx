"use client";

import type { ObligationStatus } from "@/lib/types/obligation";
import { statusBadgeClass } from "@/lib/utils/obligation";
import { useTranslation } from "react-i18next";
import Badge from "./Badge";

export default function StatusBadge({ status }: { status: ObligationStatus }) {
  const { t } = useTranslation();
  return (
    <Badge className={statusBadgeClass[status]}>
      {t(`status.${status}`)}
    </Badge>
  );
}
