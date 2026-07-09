import type { z } from "zod";
import { ObligationState as ObligationStateSchema } from "@/schemas/obligationSchema";

type ObligationState = z.infer<typeof ObligationStateSchema>;

export const NEXT_STATES: Record<
  ObligationState,
  readonly ObligationState[]
> = {
  pending: ["in_progress"],
  in_progress: ["submitted", "pending"],
  submitted: ["done", "in_progress"],
  done: ["in_progress"],
};

export const TRANSITION_ACTIONS: Record<
  ObligationState,
  Partial<Record<ObligationState, string>>
> = {
  pending: { in_progress: "detail.actions.start" },
  in_progress: {
    submitted: "detail.actions.submit",
    pending: "detail.actions.backToPending",
  },
  submitted: {
    done: "detail.actions.markAsDone",
    in_progress: "detail.actions.rework",
  },
  done: { in_progress: "detail.actions.reopen" },
};
