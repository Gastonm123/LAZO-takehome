"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  deleteObligation,
  transitionObligation,
} from "@/actions/obligations";
import AuditTrail from "@/components/detail/AuditTrail";
import {
  NEXT_STATES,
  TRANSITION_ACTIONS,
} from "@/components/detail/transitionActions";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DueDateBadge from "@/components/ui/DueDateBadge";
import StateBadge from "@/components/ui/StateBadge";
import type { ObligationDetail, ObligationState } from "@/lib/logic/obligation";
import { formatDate } from "@/lib/utils/formatDate";
import { useTranslation } from "react-i18next";

export default function ObligationDetailView({
  obligation,
}: {
  obligation: ObligationDetail;
}) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "en" ? "en-US" : "es-AR";

  const handleDelete = async () => {
    try {
      await deleteObligation(obligation.id);
      toast.success(t("detail.deleted"));
      router.push("/obligations");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.error"));
    }
  };

  const handleTransition = async (state: ObligationState) => {
    try {
      await transitionObligation(obligation.id, state);
      toast.success(t("detail.transitioned"));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.error"));
    }
  };

  const nextStates = NEXT_STATES[obligation.state];

  return (
    <Card className="relative">
      <div className="absolute right-5 top-5">
        <StateBadge state={obligation.state} />
      </div>

      <h1 className="pr-28 text-2xl font-semibold text-slate-900">
        {obligation.title}
      </h1>

      <div className="mt-6">
        <label className="text-xs text-slate-500">{t("common.description")}</label>
        <textarea
          readOnly
          rows={4}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
          value={obligation.description}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label={t("common.type")} value={obligation.type} />
        <Field label={t("common.owner")} value={obligation.owner} />
        <Field
          label={t("common.createdAt")}
          value={formatDate(obligation.createdAt, locale)}
        />
        <Field
          label={t("common.updatedAt")}
          value={formatDate(obligation.updatedAt, locale)}
        />
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
        <AuditTrail entries={obligation.auditTrail} />
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
          {nextStates.map((nextState) => {
            const labelKey = TRANSITION_ACTIONS[obligation.state][nextState];
            return (
              <Button
                key={nextState}
                variant="secondary"
                onClick={() => handleTransition(nextState)}
              >
                {labelKey ? t(labelKey) : t(`state.${nextState}`)}
              </Button>
            );
          })}
          <Link
            href={`/obligations/${obligation.id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-lazo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-lazo-700"
          >
            {t("common.edit")}
          </Link>
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
