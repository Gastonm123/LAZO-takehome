import z from "zod";
import { MaskedTaxId } from "./obligationSchema";

export const ObligationAuditSchema = z.object({
  field: z.string(),
  from: z.string(),
  to: z.string(),
  date: z.coerce.date(),
});

export const ObligationAuditPublicSchema = z.union([
  ObligationAuditSchema.refine((audit) => audit.field !== "companyTaxId"),
  z.object({
    field: z.enum(["companyTaxId"]),
    from: MaskedTaxId,
    to: MaskedTaxId,
    date: z.coerce.date(),
  }),
]);

/** Capa UI del frontend (fechas ISO). */
export const ObligationAuditUiSchema = ObligationAuditPublicSchema.transform(
  (row) => ({
    field: row.field,
    from: row.from,
    to: row.to,
    date: row.date.toISOString(),
  }),
);

export const ObligationAuditListSchema = z.array(ObligationAuditUiSchema);