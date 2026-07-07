"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  deleteObligation,
  transitionObligation,
} from "@/actions/obligations";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DueDateBadge from "@/components/ui/DueDateBadge";
import StatusBadge from "@/components/ui/StatusBadge";
import type { ObligationDetail, ObligationStatus } from "@/lib/types/obligation";
import {
  formatDate,
  getTransitionLabel,
} from "@/lib/utils/obligation";
import { useTranslation } from "react-i18next";

export default function ObligationDetailView({
  obligation,
}: {
  obligation: ObligationDetail;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const canSubmit =
    !obligation.requiresDocument || Boolean(obligation.documentUrl);

  const handleDelete = async () => {
    try {
      await deleteObligation(obligation.id);
      toast.success(t("detail.deleted"));
      router.push("/obligations");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.error"));
    }
  };

  const handleTransition = async (status: ObligationStatus) => {
    try {
      await transitionObligation(obligation.id, status);
      toast.success(t("detail.transitioned"));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.error"));
    }
  };

  return (
    <Card className="relative">
      <div className="absolute right-5 top-5">
        <StatusBadge status={obligation.status} />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t(`types.${obligation.type}`)}
      </p>
      <h1 className="mt-1 pr-28 text-2xl font-semibold text-slate-900">
        {obligation.title}
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={t("common.description")} value={obligation.description} />
        <Field label={t("common.owner")} value={obligation.owner} />
        <Field label={t("common.createdAt")} value={formatDate(obligation.createdAt)} />
        <Field label={t("common.updatedAt")} value={formatDate(obligation.updatedAt)} />
        <div>
          <p className="text-xs text-slate-500">{t("common.dueDate")}</p>
          <div className="mt-1">
            <DueDateBadge dueDate={obligation.dueDate} overdue={obligation.overdue} />
          </div>
        </div>
        <Field label={t("common.taxId")} value={obligation.companyTaxId} />
        <Field
          label={t("common.requiresDocument")}
          value={obligation.requiresDocument ? t("common.yes") : t("common.no")}
        />
        <Field
          label={t("common.document")}
          value={
            obligation.documentUrl ? t("common.attached") : t("common.missing")
          }
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-500">
          {t("detail.auditTrail")}
        </h2>
        <ul className="space-y-1 text-sm text-slate-700">
          {obligation.auditTrail.map((entry, index) => (
            <li key={`${entry.at}-${index}`}>
              {t("detail.fromTo", {
                from: t(`status.${entry.from}`),
                to: t(`status.${entry.to}`),
              })}{" "}
              · {formatDate(entry.at)}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/obligations"
          className="text-sm font-medium text-slate-600 hover:text-lazo-700"
        >
          ← {t("common.back")}
        </Link>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="danger" onClick={handleDelete}>
            {t("common.delete")}
          </Button>
          {obligation.allowedTransitions.map((nextStatus) => (
            <Button
              key={nextStatus}
              variant="secondary"
              disabled={nextStatus === "submitted" && !canSubmit}
              onClick={() => handleTransition(nextStatus)}
            >
              {getTransitionLabel(obligation.status, nextStatus, t)}
            </Button>
          ))}
          <Button variant="primary">{t("common.edit")}</Button>
        </div>
      </div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-800">{value}</p>
    </div>
  );
}
