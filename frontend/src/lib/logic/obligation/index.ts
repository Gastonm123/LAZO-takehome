import "server-only";
import { HttpClient } from "../base/HttpClient";
import { HttpObligationsClient } from "./HttpObligationsClient";
import { MockObligationsClient } from "./MockObligationsClient";
import { ObligationsClient } from "./types";

export type {
  DashboardSummary,
  Obligation,
  ObligationAudit,
  ObligationDetail,
  ObligationFormValues,
  ObligationState,
  SortDirection,
  SortField,
} from "./types";

export { HttpObligationsClient, MockObligationsClient };

const globalForClient = globalThis as typeof globalThis & {
  lazoObligationClient?: ObligationsClient;
};

export function getObligationClient(): ObligationsClient {
  if (!globalForClient.lazoObligationClient) {
    globalForClient.lazoObligationClient =
      process.env.USE_MOCK_DATA === "true"
        ? new MockObligationsClient()
        : new HttpObligationsClient(
            new HttpClient(process.env.API_URL ?? "http://localhost:5000/api/v1"),
          );
  }
  return globalForClient.lazoObligationClient;
}
