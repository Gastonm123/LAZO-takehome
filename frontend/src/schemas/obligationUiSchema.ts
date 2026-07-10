import z from "zod";
import { trimmedEmptyToNull } from "./zodUtils";
import {
  ObligationCreate,
  ObligationPublicSchema,
  ObligationUpdate,
} from "./obligationSchema";

/** Capa UI del frontend (post-parse HTTP). */
export const ObligationUiSchema = ObligationPublicSchema.transform((row) => ({
  id: String(row.id),
  state: row.state,
  dueDate: row.dueDate.toISOString(),
  owner: row.owner,
  requiresDocument: row.requiresDocument,
  documentUrl: row.documentUrl,
  companyTaxId: row.companyTaxId as string,
  title: row.title,
  type: row.type,
  description: row.description ?? "",
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
  overdue: row.overdue,
}));

export const ObligationFormValuesSchema = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string(),
  owner: z.string(),
  dueDate: z.string(),
  companyTaxId: z.string(),
  requiresDocument: z.boolean(),
  documentUrl: z.string().nullable(),
});

export const ObligationCreateFromFormSchema = ObligationFormValuesSchema.transform(
  (values) => {
    const payload: z.input<typeof ObligationCreate> = {
      type: values.type,
      title: values.title,
      owner: values.owner,
      dueDate: values.dueDate,
      companyTaxId: values.companyTaxId,
      requiresDocument: values.requiresDocument,
    };

    const description = trimmedEmptyToNull.parse(values.description);
    if (description !== null) {
      payload.description = description;
    }

    const documentUrl = values.documentUrl
      ? trimmedEmptyToNull.parse(values.documentUrl)
      : null;
    if (documentUrl !== null) {
      payload.documentUrl = documentUrl;
    }

    return ObligationCreate.parse(payload);
  },
);

export const ObligationUpdateFromFormSchema = ObligationFormValuesSchema.transform(
  (values) => {
    const payload: z.input<typeof ObligationUpdate> = {
      type: values.type,
      title: values.title,
      owner: values.owner,
      dueDate: values.dueDate,
      requiresDocument: values.requiresDocument,
    };

    const description = trimmedEmptyToNull.parse(values.description);
    if (description !== null) {
      payload.description = description;
    }

    const companyTaxId = trimmedEmptyToNull.parse(values.companyTaxId);
    if (companyTaxId !== null) {
      payload.companyTaxId = companyTaxId;
    }

    const documentUrl = values.documentUrl
      ? trimmedEmptyToNull.parse(values.documentUrl)
      : null;
    if (documentUrl !== null) {
      payload.documentUrl = documentUrl;
    }

    return ObligationUpdate.parse(payload);
  },
);
