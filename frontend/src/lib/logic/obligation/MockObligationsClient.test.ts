import { describe, expect, it } from "vitest";
import { MockObligationsClient } from "@/lib/logic/obligation/MockObligationsClient";
import { ObligationLogic } from "@/lib/logic/obligation/ObligationLogic";

describe("MockObligationsClient", () => {
  const client = new MockObligationsClient(new ObligationLogic());

  it("lists obligations with overdue computed", async () => {
    const list = await client.list();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((item) => typeof item.overdue === "boolean")).toBe(true);
  });

  it("returns detail with audit trail", async () => {
    const detail = await client.getById("1");
    expect(detail.id).toBe("1");
    expect(detail.auditTrail.length).toBeGreaterThan(0);
  });

  it("creates a new obligation", async () => {
    const id = await client.create({
      type: "custom_type",
      title: "Test obligation",
      description: "Desc",
      owner: "Tester",
      dueDate: "2026-12-31",
      companyTaxId: "123456789",
      requiresDocument: false,
      documentUrl: null,
    });

    const created = await client.getById(id);
    expect(created.title).toBe("Test obligation");
    expect(created.type).toBe("custom_type");
    expect(created.state).toBe("pending");
  });

  it("transitions state", async () => {
    const updated = await client.transition("1", "in_progress");
    expect(updated.state).toBe("in_progress");
  });
});
