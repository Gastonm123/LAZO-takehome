import { DashboardSchema } from "@/schemas/dashboardSchema";
import {
  ObligationChangeState,
  ObligationPublicSchema,
} from "@/schemas/obligationSchema";
import { ObligationLogic } from "./ObligationLogic";
import {
  ObligationsClient,
  type DashboardSummary,
  type ObligationDetail,
  type ObligationFormValues,
  type ObligationState,
} from "./types";

export class HttpObligationsClient extends ObligationsClient {
  constructor(
    private readonly apiUrl: string,
    private readonly logic: ObligationLogic,
  ) {
    super();
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.apiUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Backend error ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  async getDashboard(): Promise<DashboardSummary> {
    const raw = await this.request<unknown>("/dashboard/summary");
    const parsed = DashboardSchema.parse(raw);
    return {
      total: parsed.total,
      overdue: parsed.overdue,
      upcomingDue: parsed.upcomingDue,
      pending: parsed.pending,
      inProgress: parsed.inProgress,
      submitted: parsed.submitted,
      done: parsed.done,
      upcomingObligations: parsed.upcomingObligations.map((row) =>
        this.logic.fromPublic(row),
      ),
    };
  }

  async list() {
    const rows = await this.request<unknown[]>("/obligations");
    return rows.map((row) =>
      this.logic.fromPublic(ObligationPublicSchema.parse(row)),
    );
  }

  async getById(id: string): Promise<ObligationDetail> {
    const [obligationRaw, auditRaw] = await Promise.all([
      this.request<unknown>(`/obligations/${id}`),
      this.request<unknown>(`/obligations/${id}/audit`),
    ]);

    return {
      ...this.logic.fromPublic(ObligationPublicSchema.parse(obligationRaw)),
      auditTrail: this.logic.parseAudit(auditRaw),
    };
  }

  async create(input: ObligationFormValues): Promise<string> {
    const body = this.logic.buildCreateBody(input);
    const result = await this.request<{ obligationId: number }>("/obligations", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return String(result.obligationId);
  }

  async update(id: string, input: ObligationFormValues): Promise<ObligationDetail> {
    const body = this.logic.buildUpdateBody(input);
    const raw = await this.request<unknown>(`/obligations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const obligation = this.logic.fromPublic(ObligationPublicSchema.parse(raw));
    const auditRaw = await this.request<unknown>(`/obligations/${id}/audit`);
    return { ...obligation, auditTrail: this.logic.parseAudit(auditRaw) };
  }

  async delete(id: string): Promise<void> {
    await this.request<void>(`/obligations/${id}`, { method: "DELETE" });
  }

  async transition(id: string, state: ObligationState): Promise<ObligationDetail> {
    ObligationChangeState.parse({ state });
    const raw = await this.request<unknown>(`/obligations/${id}/transitions`, {
      method: "POST",
      body: JSON.stringify({ state }),
    });
    const obligation = this.logic.fromPublic(ObligationPublicSchema.parse(raw));
    const auditRaw = await this.request<unknown>(`/obligations/${id}/audit`);
    return { ...obligation, auditTrail: this.logic.parseAudit(auditRaw) };
  }
}
