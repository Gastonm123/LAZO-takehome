import z from 'zod';
import { MaskedTaxId } from './obligationSchema.js';

export const ObligationAuditSchema = z.object({
    field: z.string(),
    from: z.string(),
    to: z.string(),
    date: z.date(),
});

export const ObligationAuditPublicSchema = z.union([
  ObligationAuditSchema.refine((audit) => audit.field !== "companyTaxId"),
  z.object({
    field: z.enum(["companyTaxId"]),
    from: MaskedTaxId,
    to: MaskedTaxId,
    date: z.coerce.date()
  })
]);