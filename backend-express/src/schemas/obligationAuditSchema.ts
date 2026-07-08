import z from 'zod';

export const ObligationAuditSchema = z.object({
    field: z.string(),
    from: z.string(),
    to: z.string(),
    date: z.date(),
})