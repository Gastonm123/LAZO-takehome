import { describe, expect, it } from "vitest";
import { ObligationAuditListSchema } from "@/schemas/obligationAuditSchema";
import { ObligationUpdate } from "@/schemas/obligationSchema";
import {
  ObligationCreateFromFormSchema,
  ObligationUiSchema,
  ObligationUpdateFromFormSchema,
} from "@/schemas/obligationUiSchema";

describe("ObligationUiSchema", () => {
  it("maps public API rows to the UI layer", () => {
    const row = ObligationUiSchema.parse({
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

    expect(row.id).toBe("1");
    expect(row.overdue).toBe(true);
    expect(row.description).toBe("");
    expect(row.dueDate).toBe(new Date("2026-07-09").toISOString());
  });
});

describe("ObligationAuditListSchema", () => {
  it("parses audit array from API response", () => {
    const rows = ObligationAuditListSchema.parse([
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

  it("parses masked companyTaxId audit entries", () => {
    const rows = ObligationAuditListSchema.parse([
      {
        field: "companyTaxId",
        from: "••••6789",
        to: "••••4321",
        date: "2026-07-02T12:00:00.000Z",
      },
    ]);

    expect(rows[0].from).toBe("••••6789");
    expect(rows[0].to).toBe("••••4321");
  });

  it("rejects audit entries with unmasked companyTaxId", () => {
    expect(() =>
      ObligationAuditListSchema.parse([
        {
          field: "companyTaxId",
          from: "12-3456789",
          to: "••••4321",
          date: "2026-07-02T12:00:00.000Z",
        },
      ]),
    ).toThrow();
  });
});

describe("ObligationUpdate", () => {
  it("accepts partial body without requiresDocument", () => {
    const body = ObligationUpdate.parse({ title: "Updated title" });
    expect(body.title).toBe("Updated title");
    expect(body.requiresDocument).toBeUndefined();
  });
});

describe("ObligationUpdateFromFormSchema", () => {
  it("omits companyTaxId when unchanged on update", () => {
    const body = ObligationUpdateFromFormSchema.parse({
      type: "annual_report",
      title: "Updated",
      description: "",
      owner: "Alice",
      dueDate: "2026-12-31",
      requiresDocument: false,
      documentUrl: null,
    });

    expect(body.companyTaxId).toBeUndefined();
    expect(body.description).toBe("");
    expect(body.title).toBe("Updated");
  });

  it("includes companyTaxId when a new value is provided", () => {
    const body = ObligationUpdateFromFormSchema.parse({
      type: "annual_report",
      title: "Updated",
      description: "",
      owner: "Alice",
      dueDate: "2026-12-31",
      companyTaxId: "99-8887777",
      requiresDocument: false,
      documentUrl: null,
    });

    expect(body.companyTaxId).toBe("99-8887777");
  });
});

describe("ObligationCreateFromFormSchema", () => {
  it("throws when dueDate is invalid", () => {
    expect(() =>
      ObligationCreateFromFormSchema.parse({
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

  it("throws when title is empty", () => {
    expect(() =>
      ObligationCreateFromFormSchema.parse({
        type: "annual_report",
        title: "",
        description: "",
        owner: "Alice",
        dueDate: "2026-12-31",
        companyTaxId: "123456789",
        requiresDocument: false,
        documentUrl: null,
      }),
    ).toThrow();
  });

  it("throws when companyTaxId is missing on create", () => {
    expect(() =>
      ObligationCreateFromFormSchema.parse({
        type: "annual_report",
        title: "Title",
        description: "",
        owner: "Alice",
        dueDate: "2026-12-31",
        requiresDocument: false,
        documentUrl: null,
      }),
    ).toThrow();
  });
});
