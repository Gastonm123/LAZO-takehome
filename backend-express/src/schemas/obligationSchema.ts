import z from "zod";

export const ObligationId = z.number().nonnegative()
export const ObligationState = z.enum(["pending", "in_progress", "submitted", "done"])

export const ObligationSchema = z.object({
    id: ObligationId,
    state: ObligationState,
    dueDate: z.date(),
    owner: z.string(),
    requiresDocument: z.boolean(),
    documentUrl: z.string(),
    companyTaxId: z.string(),
    title: z.string(),
    type: z.string(),
    description: z.string(),
});

export const ObligationSearch = z.object({
    search: z.string(),
    order: z.enum(['createdAt', 'updatedAt', 'dueDate']),
    direction: z.enum(["ASC", "DEC"])
})

export const MaskedTaxId = z.string()
    .refine(taxId => {
        if (taxId.length>=4 && /\d/.test(taxId.slice(0,-4))) {
            return false;
        }
        return true;
    }, { message: "Tax ID must be masked (••••1234)" })
    .brand<"MaskedTaxId">();

export const ObligationPublicSchema = z.object({
    id: ObligationId,
    state: ObligationState,
    dueDate: z.date(),
    owner: z.string(),
    requiresDocument: z.boolean(),
    documentUrl: z.string(),
    companyTaxId: MaskedTaxId,
    title: z.string(),
    type: z.string(),
    description: z.string(),
});

export const ObligationBasicMutation = z.object({
    dueDate: z.date(),
    owner: z.string(),
    requiresDocument: z.boolean(),
    documentUrl: z.string(),
    companyTaxId: z.string(),
    title: z.string(),
    type: z.string(),
    description: z.string(),
});

export const ObligationCreate = ObligationBasicMutation;
export const ObligationUpdate = ObligationBasicMutation;

export const ObligationChangeState = z.object({
    state: ObligationState
})