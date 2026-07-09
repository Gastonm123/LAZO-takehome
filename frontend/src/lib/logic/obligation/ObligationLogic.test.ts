import { describe, expect, it } from "vitest";
import { ObligationPublicSchema } from "@/schemas/obligationSchema";
import { ObligationLogic } from "@/lib/logic/obligation/ObligationLogic";

describe("ObligationLogic", () => {
  const logic = new ObligationLogic();

  describe("fromPublic", () => {
    it("maps overdue from the public schema", () => {
      const parsed = ObligationPublicSchema.parse({
        id: 1,
        state: "pending",
        dueDate: "2026-07-09",
        owner: "Alice",
        requiresDocument: false,
        documentUrl: null,
        companyTaxId: "••••6789",
        title: "Report",
        type: "annual_report",
        description: null,
        createdAt: "2026-06-01T10:00:00.000Z",
        updatedAt: "2026-07-01T10:00:00.000Z",
        overdue: true,
      });

      expect(logic.fromPublic(parsed).overdue).toBe(true);
    });
  });

  describe("parseAudit", () => {
    it("parses audit array from JSON body", () => {
      const rows = logic.parseAudit([
        {
          field: "state",
          from: "pending",
          to: "in_progress",
          date: "2026-07-01T10:00:00.000Z",
        },
      ]);

      expect(rows).toHaveLength(1);
      expect(rows[0].field).toBe("state");
      expect(rows[0].date).toBe("2026-07-01T10:00:00.000Z");
    });

    it("parses double-encoded audit string from backend", () => {
      const rows = logic.parseAudit(
        JSON.stringify([
          {
            field: "title",
            from: "Old",
            to: "New",
            date: "2026-07-02T12:00:00.000Z",
          },
        ]),
      );

      expect(rows[0].to).toBe("New");
    });
  });

  describe("buildUpdateBody", () => {
    it("omits empty companyTaxId and description", () => {
      const body = logic.buildUpdateBody({
        type: "annual_report",
        title: "Updated",
        description: "",
        owner: "Alice",
        dueDate: "2026-12-31",
        companyTaxId: "",
        requiresDocument: false,
        documentUrl: null,
      });

      expect(body.companyTaxId).toBeUndefined();
      expect(body.description).toBeUndefined();
      expect(body.title).toBe("Updated");
    });
  });

  describe("buildCreateBody", () => {
    it("throws when dueDate is invalid", () => {
      expect(() =>
        logic.buildCreateBody({
          type: "annual_report",
          title: "Title",
          description: "",
          owner: "Alice",
          dueDate: "not-a-date",
          companyTaxId: "123456789",
          requiresDocument: false,
          documentUrl: null,
        }),
      ).toThrow();
    });
  });
});
