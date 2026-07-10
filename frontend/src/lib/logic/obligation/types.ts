import type { z } from "zod";
import type { DashboardUiSchema } from "@/schemas/dashboardSchema";
import type { ObligationAuditUiSchema } from "@/schemas/obligationAuditSchema";
import type {
  ObligationFormValuesSchema,
  ObligationUiSchema,
} from "@/schemas/obligationUiSchema";
import { ObligationState as ObligationStateSchema } from "@/schemas/obligationSchema";

export type { SortDirection, SortField } from "@/lib/utils/listQuery";
export type ObligationState = z.infer<typeof ObligationStateSchema>;
export type Obligation = z.infer<typeof ObligationUiSchema>;
export type ObligationAudit = z.infer<typeof ObligationAuditUiSchema>;
export type ObligationFormValues = z.infer<typeof ObligationFormValuesSchema>;
export type DashboardSummary = z.infer<typeof DashboardUiSchema>;

export type ObligationDetail = Obligation & {
  auditTrail: ObligationAudit[];
};

export abstract class ObligationsClient {
  abstract getDashboard(): Promise<DashboardSummary>;
  abstract list(): Promise<Obligation[]>;
  abstract getById(id: string): Promise<ObligationDetail>;
  abstract create(input: ObligationFormValues): Promise<string>;
  abstract update(id: string, input: ObligationFormValues): Promise<ObligationDetail>;
  abstract delete(id: string): Promise<void>;
  abstract transition(id: string, state: ObligationState): Promise<ObligationDetail>;
}
