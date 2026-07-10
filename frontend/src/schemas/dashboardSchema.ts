import z from "zod";
import { ObligationPublicSchema } from "./obligationSchema";
import { ObligationUiSchema } from "./obligationUiSchema";

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

export const DashboardUiSchema = DashboardSchema.transform((summary) => ({
  total: summary.total,
  overdue: summary.overdue,
  upcomingDue: summary.upcomingDue,
  pending: summary.pending,
  inProgress: summary.inProgress,
  submitted: summary.submitted,
  done: summary.done,
  upcomingObligations: summary.upcomingObligations.map((row) =>
    ObligationUiSchema.parse(row),
  ),
}));
