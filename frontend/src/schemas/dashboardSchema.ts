import z from "zod";
import { ObligationPublicSchema } from "./obligationSchema";

export const DashboardSchema = z.object({
  total: z.number(),
  overdue: z.number(),
  upcomingDue: z.number(),
  pending: z.number(),
  inProgress: z.number(),
  submitted: z.number(),
  done: z.number(),
  upcomingObligations: z.array(ObligationPublicSchema),
});
