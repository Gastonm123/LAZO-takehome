export type ObligationType =
  | "annual_report"
  | "franchise_tax"
  | "boi_report"
  | "registered_agent_renewal";

export type ObligationStatus =
  | "pending"
  | "in_progress"
  | "submitted"
  | "done";

export type SortField = "createdAt" | "updatedAt" | "dueDate";
export type SortDirection = "asc" | "desc";

export interface AuditEntry {
  from: ObligationStatus;
  to: ObligationStatus;
  at: string;
}

export interface Obligation {
  id: string;
  type: ObligationType;
  title: string;
  description: string;
  status: ObligationStatus;
  dueDate: string;
  owner: string;
  requiresDocument: boolean;
  documentUrl: string | null;
  companyTaxId: string;
  createdAt: string;
  updatedAt: string;
  overdue: boolean;
}

export interface ObligationDetail extends Obligation {
  auditTrail: AuditEntry[];
  allowedTransitions: ObligationStatus[];
}

export interface DashboardSummary {
  total: number;
  overdue: number;
  upcoming: number;
  pending: number;
  inProgress: number;
  submitted: number;
  done: number;
  upcomingDue: Obligation[];
}
