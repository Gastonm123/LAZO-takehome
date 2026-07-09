import { ObligationLogic } from "./ObligationLogic";
import {
  ObligationsClient,
  type DashboardSummary,
  type Obligation,
  type ObligationAudit,
  type ObligationDetail,
  type ObligationFormValues,
  type ObligationState,
} from "./types";

const now = new Date();

function daysFromNow(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function daysAgo(days: number): string {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function maskTaxId(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) {
    return value;
  }
  return `••••${digits.slice(-4)}`;
}

export class MockObligationsClient extends ObligationsClient {
  private readonly store: Obligation[];
  private readonly audits: Record<string, ObligationAudit[]>;

  constructor(private readonly logic: ObligationLogic) {
    super();
    this.store = [
      {
        id: "1",
        type: "annual_report",
        title: "Annual Report 2025",
        description: "File the annual report with the state registry.",
        state: "pending",
        dueDate: daysFromNow(3),
        owner: "Alice Johnson",
        requiresDocument: true,
        documentUrl: null,
        companyTaxId: "••••6789",
        createdAt: daysAgo(20),
        updatedAt: daysAgo(2),
        overdue: false,
      },
      {
        id: "2",
        type: "franchise_tax",
        title: "Franchise Tax Payment",
        description: "Quarterly franchise tax submission.",
        state: "in_progress",
        dueDate: daysFromNow(8),
        owner: "Bob Smith",
        requiresDocument: false,
        documentUrl: null,
        companyTaxId: "••••4321",
        createdAt: daysAgo(15),
        updatedAt: daysAgo(1),
        overdue: false,
      },
      {
        id: "5",
        type: "annual_report",
        title: "Annual Report Amendment",
        description: "Amend previously filed annual report.",
        state: "pending",
        dueDate: daysAgo(2),
        owner: "Eve Martinez",
        requiresDocument: true,
        documentUrl: null,
        companyTaxId: "••••7890",
        createdAt: daysAgo(10),
        updatedAt: daysAgo(1),
        overdue: true,
      },
    ];
    this.audits = {
      "1": [
        { field: "state", from: "", to: "pending", date: daysAgo(20) },
        {
          field: "dueDate",
          from: "2026-07-05T00:00:00.000Z",
          to: "2026-07-09T00:00:00.000Z",
          date: daysAgo(2),
        },
      ],
    };
  }

  async getDashboard(): Promise<DashboardSummary> {
    const obligations = this.store.map((item) => this.logic.withOverdue(item));
    const upcomingObligations = [...obligations]
      .filter((o) => o.state !== "submitted" && o.state !== "done")
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
      .slice(0, 10);

    return {
      total: obligations.length,
      overdue: obligations.filter((o) => o.overdue).length,
      upcomingDue: upcomingObligations.length,
      pending: obligations.filter((o) => o.state === "pending").length,
      inProgress: obligations.filter((o) => o.state === "in_progress").length,
      submitted: obligations.filter((o) => o.state === "submitted").length,
      done: obligations.filter((o) => o.state === "done").length,
      upcomingObligations,
    };
  }

  async list(): Promise<Obligation[]> {
    return this.store.map((item) => this.logic.withOverdue(item));
  }

  async getById(id: string): Promise<ObligationDetail> {
    const obligation = this.store.find((item) => item.id === id);
    if (!obligation) {
      throw new Error("Obligation not found");
    }
    return {
      ...this.logic.withOverdue(obligation),
      auditTrail: this.audits[id] ?? [
        {
          field: "state",
          from: "",
          to: obligation.state,
          date: obligation.createdAt,
        },
      ],
    };
  }

  async create(input: ObligationFormValues): Promise<string> {
    this.logic.buildCreateBody(input);
    const id = String(
      this.store.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1,
    );
    const timestamp = new Date().toISOString();
    const dueDate = new Date(input.dueDate).toISOString();

    this.store.push(
      this.logic.withOverdue({
        id,
        type: input.type,
        title: input.title,
        description: input.description,
        state: "pending",
        dueDate,
        owner: input.owner,
        requiresDocument: input.requiresDocument,
        documentUrl: input.requiresDocument ? input.documentUrl : null,
        companyTaxId: maskTaxId(input.companyTaxId),
        createdAt: timestamp,
        updatedAt: timestamp,
        overdue: false,
      }),
    );

    return id;
  }

  async update(id: string, input: ObligationFormValues): Promise<ObligationDetail> {
    this.logic.buildUpdateBody(input);
    const index = this.store.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Obligation not found");
    }

    const current = this.store[index];
    const dueDate = new Date(input.dueDate).toISOString();
    const companyTaxId = input.companyTaxId.trim()
      ? maskTaxId(input.companyTaxId)
      : current.companyTaxId;

    this.store[index] = this.logic.withOverdue({
      ...current,
      type: input.type,
      title: input.title,
      description: input.description,
      owner: input.owner,
      dueDate,
      requiresDocument: input.requiresDocument,
      documentUrl: input.requiresDocument ? input.documentUrl : null,
      companyTaxId,
      updatedAt: new Date().toISOString(),
    });

    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    const index = this.store.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.store.splice(index, 1);
    }
  }

  async transition(id: string, state: ObligationState): Promise<ObligationDetail> {
    const index = this.store.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error("Obligation not found");
    }

    this.store[index] = this.logic.withOverdue({
      ...this.store[index],
      state,
      updatedAt: new Date().toISOString(),
    });

    return this.getById(id);
  }
}
