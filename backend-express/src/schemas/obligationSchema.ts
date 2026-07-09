import z from "zod";

export const ObligationId = z.coerce.number().nonnegative();
export const ObligationState = z.enum([
    "pending",
    "in_progress",
    "submitted",
    "done",
]);

export const ObligationSchema = z.object({
    id: ObligationId,
    state: ObligationState,
    dueDate: z.coerce.date(),
    owner: z.string(),
    requiresDocument: z.boolean(),
    documentUrl: z.string().nullable(),
    companyTaxId: z.string(),
    title: z.string(),
    type: z.string(),
    description: z.string().nullable(),
});

export const ObligationSearch = z.object({
    search: z.string(),
    order: z.enum(["createdAt", "updatedAt", "dueDate"]),
    direction: z.enum(["ASC", "DEC"]),
});

export const MaskedTaxId = z
    .string()
    .refine(
        (taxId) => {
            if (taxId.length >= 4 && /\d/.test(taxId.slice(0, -4))) {
                return false;
            }
            return true;
        },
        { message: "Tax ID must be masked (••••1234)" },
    )
    .brand<"MaskedTaxId">();

const StringBool = z.coerce.string().transform(str => {
    if (str === 'true') return true;
    // if (str === 'false') return false;
    return false;
});

export const ObligationPublicSchema = z.object({
    id: ObligationId,
    state: ObligationState,
    dueDate: z.coerce.date(),
    owner: z.string(),
    requiresDocument: z.boolean(),
    documentUrl: z.string().nullable(),
    companyTaxId: MaskedTaxId,
    title: z.string(),
    type: z.string(),
    description: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    overdue: z.boolean(),
});

export const ObligationCreate = z.object({
    dueDate: z.coerce.date(),
    owner: z.string(),
    requiresDocument: StringBool,
    documentUrl: z.string().nullable().optional(),
    companyTaxId: z.string(),
    title: z.string(),
    type: z.string(),
    description: z.string().nullable().optional(),
});

export const ObligationUpdate = z.object({
    dueDate: z.coerce.date().optional(),
    owner: z.string().optional(),
    requiresDocument: StringBool,
    documentUrl: z.string().nullable().optional(),
    companyTaxId: z.string().optional(),
    title: z.string().optional(),
    type: z.string().optional(),
    description: z.string().nullable().optional(),
});

export const ObligationChangeState = z.object({
    state: ObligationState,
});
