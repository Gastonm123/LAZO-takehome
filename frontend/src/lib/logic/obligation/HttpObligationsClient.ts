import { DashboardUiSchema } from "@/schemas/dashboardSchema";
import { ObligationAuditListSchema } from "@/schemas/obligationAuditSchema";
import {
  ObligationCreateFromFormSchema,
  ObligationUiSchema,
  ObligationUpdateFromFormSchema,
} from "@/schemas/obligationUiSchema";
import { ObligationChangeState } from "@/schemas/obligationSchema";
import { HttpClient } from "../base/HttpClient";
import {
  ObligationsClient,
  type ObligationDetail,
  type ObligationFormValues,
  type ObligationState,
} from "./types";

export class HttpObligationsClient extends ObligationsClient {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  private async request<Result>(path: string, init?: RequestInit): Promise<Result> {
    return this.httpClient.request<Result>(path, init);
  }

  async getDashboard() {
    const raw = await this.request<unknown>("/dashboard/summary");
    return DashboardUiSchema.parse(raw);
  }

  async list() {
    const rows = await this.request<unknown[]>("/obligations");
    return rows.map((row) => ObligationUiSchema.parse(row));
  }

  async getById(id: string): Promise<ObligationDetail> {
    const [obligationRaw, auditRaw] = await Promise.all([
      this.request<unknown>(`/obligations/${id}`),
      this.request<unknown>(`/obligations/${id}/audit`),
    ]);

    return {
      ...ObligationUiSchema.parse(obligationRaw),
      auditTrail: ObligationAuditListSchema.parse(auditRaw),
    };
  }

  async create(input: ObligationFormValues): Promise<string> {
    const body = ObligationCreateFromFormSchema.parse(input);
    const result = await this.request<{ obligationId: number }>("/obligations", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return String(result.obligationId);
  }

  async update(id: string, input: ObligationFormValues): Promise<ObligationDetail> {
    const body = ObligationUpdateFromFormSchema.parse(input);
    const raw = await this.request<unknown>(`/obligations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    const auditRaw = await this.request<unknown>(`/obligations/${id}/audit`);
    return {
      ...ObligationUiSchema.parse(raw),
      auditTrail: ObligationAuditListSchema.parse(auditRaw),
    };
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
    const auditRaw = await this.request<unknown>(`/obligations/${id}/audit`);
    return {
      ...ObligationUiSchema.parse(raw),
      auditTrail: ObligationAuditListSchema.parse(auditRaw),
    };
  }
}
