import { describe, expect, it } from "vitest";
import { MockObligationsClient } from "@/lib/logic/obligation/MockObligationsClient";

describe("MockObligationsClient", () => {
  const client = new MockObligationsClient();

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
    expect(created.companyTaxId).toBe("••••6789");
  });

  it("rejects create with empty required fields", async () => {
    await expect(
      client.create({
        type: "custom_type",
        title: "",
        description: "",
        owner: "Tester",
        dueDate: "2026-12-31",
        companyTaxId: "123456789",
        requiresDocument: false,
        documentUrl: null,
      }),
    ).rejects.toThrow();
  });

  it("keeps companyTaxId when edit form leaves it unchanged", async () => {
    const updated = await client.update("1", {
      type: "annual_report",
      title: "Annual Report 2025",
      description: "",
      owner: "Alice Johnson",
      dueDate: "2026-07-09",
      requiresDocument: true,
      documentUrl: null,
    });

    expect(updated.description).toBe("");
    expect(updated.companyTaxId).toBe("••••6789");
  });

  it("transitions state", async () => {
    const updated = await client.transition("1", "in_progress");
    expect(updated.state).toBe("in_progress");
  });
});
