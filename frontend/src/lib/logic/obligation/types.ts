import type { z } from "zod";
import { ObligationState as ObligationStateSchema } from "@/schemas/obligationSchema";

export type { SortDirection, SortField } from "@/lib/utils/listQuery";
export type ObligationState = z.infer<typeof ObligationStateSchema>;

export type Obligation = {
  id: string;
  state: ObligationState;
  dueDate: string;
  owner: string;
  requiresDocument: boolean;
  documentUrl: string | null;
  companyTaxId: string;
  title: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  overdue: boolean;
};

export type ObligationAudit = {
  field: string;
  from: string;
  to: string;
  date: string;
};

export type ObligationDetail = Obligation & {
  auditTrail: ObligationAudit[];
};

export type DashboardSummary = {
  total: number;
  overdue: number;
  upcomingDue: number;
  pending: number;
  inProgress: number;
  submitted: number;
  done: number;
  upcomingObligations: Obligation[];
};

export type ObligationFormValues = {
  type: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  companyTaxId: string;
  requiresDocument: boolean;
  documentUrl: string | null;
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
