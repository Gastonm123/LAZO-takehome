"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  createObligation,
  updateObligation,
} from "@/actions/obligations";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { ObligationFormValues } from "@/lib/logic/obligation";

function toDateInputValue(isoDate: string): string {
  return isoDate.slice(0, 10);
}

const emptyForm = (): ObligationFormValues => ({
  type: "annual_report",
  title: "",
  description: "",
  owner: "",
  dueDate: new Date().toISOString().slice(0, 10),
  companyTaxId: "",
  requiresDocument: false,
  documentUrl: null,
});

export default function ObligationForm({
  mode,
  obligationId,
  initialValues,
  companyTaxIdPlaceholder,
}: {
  mode: "create" | "edit";
  obligationId?: string;
  initialValues?: ObligationFormValues;
  companyTaxIdPlaceholder?: string;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ObligationFormValues>(
    initialValues ?? emptyForm(),
  );

  const handleChange = <K extends keyof ObligationFormValues>(
    field: K,
    value: ObligationFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === "create") {
        const id = await createObligation(form);
        toast.success(t("form.created"));
        router.push(`/obligations/${id}`);
      } else if (obligationId) {
        await updateObligation(obligationId, form);
        toast.success(t("form.updated"));
        router.push(`/obligations/${obligationId}`);
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label={t("common.loading")} />;
  }

  return (
    <Card>
      <h1 className="mb-6 text-2xl font-semibold text-lazo-800">
        {mode === "create" ? t("form.createTitle") : t("form.editTitle")}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("common.type")}>
            <input
              className={inputClass}
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </Field>

          <Field label={t("common.owner")}>
            <input
              className={inputClass}
              value={form.owner}
              onChange={(e) => handleChange("owner", e.target.value)}
            />
          </Field>
        </div>

        <Field label={t("common.title")}>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </Field>

        <Field label={t("common.description")}>
          <textarea
            className={inputClass}
            rows={3}
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("common.taxId")}>
            <input
              className={inputClass}
              value={form.companyTaxId}
              placeholder={companyTaxIdPlaceholder}
              onChange={(e) => handleChange("companyTaxId", e.target.value)}
            />
          </Field>

          <Field label={t("common.dueDate")}>
            <input
              type="date"
              className={inputClass}
              value={toDateInputValue(form.dueDate)}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.requiresDocument}
            onChange={(e) => {
              const requiresDocument = e.target.checked;
              handleChange("requiresDocument", requiresDocument);
              if (!requiresDocument) {
                handleChange("documentUrl", null);
              }
            }}
          />
          {t("common.requiresDocument")}
        </label>

        {form.requiresDocument ? (
          <Field label={t("form.documentUrl")}>
            <input
              type="url"
              className={inputClass}
              value={form.documentUrl ?? ""}
              onChange={(e) =>
                handleChange("documentUrl", e.target.value || null)
              }
              placeholder="https://..."
            />
          </Field>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              router.push(
                mode === "edit" && obligationId
                  ? `/obligations/${obligationId}`
                  : "/obligations",
              )
            }
          >
            {t("form.cancel")}
          </Button>
          <Button type="submit" variant="primary">
            {t("form.save")}
          </Button>
        </div>
      </form>
    </Card>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-lazo-500 focus:outline-none focus:ring-2 focus:ring-lazo-200";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}
