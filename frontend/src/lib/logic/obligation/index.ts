import "server-only";
import { HttpObligationsClient } from "./HttpObligationsClient";
import { MockObligationsClient } from "./MockObligationsClient";
import { ObligationLogic } from "./ObligationLogic";
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

export { ObligationLogic, HttpObligationsClient, MockObligationsClient };

let client: ObligationsClient | null = null;

export function getObligationClient(): ObligationsClient {
  if (!client) {
    const logic = new ObligationLogic();
    client =
      process.env.USE_MOCK_DATA === "true"
        ? new MockObligationsClient(logic)
        : new HttpObligationsClient(
            process.env.API_URL ?? "http://localhost:5000/api/v1",
            logic,
          );
  }
  return client;
}
