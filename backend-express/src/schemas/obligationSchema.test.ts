import { describe, expect, it } from "vitest";
import {
    MaskedTaxId,
    ObligationCreate,
    ObligationPublicSchema,
    ObligationState,
} from "@/schemas/obligationSchema.js";

describe("ObligationState", () => {
    it("accepts valid states", () => {
        expect(ObligationState.parse("pending")).toBe("pending");
        expect(ObligationState.parse("in_progress")).toBe("in_progress");
    });

    it("rejects invalid states", () => {
        expect(() => ObligationState.parse("invalid")).toThrow();
    });
});

describe("MaskedTaxId", () => {
    it("accepts masked values", () => {
        expect(MaskedTaxId.parse("••••1234")).toBe("••••1234");
    });

    it("rejects unmasked tax ids", () => {
        expect(() => MaskedTaxId.parse("123456789")).toThrow();
    });
});

describe("ObligationCreate", () => {
    it("coerces dueDate from string", () => {
        const parsed = ObligationCreate.parse({
            type: "annual_report",
            title: "Test",
            owner: "Alice",
            dueDate: "2026-12-31",
            companyTaxId: "123456789",
            requiresDocument: false,
        });
        expect(parsed.dueDate).toBeInstanceOf(Date);
    });
});

describe("ObligationPublicSchema", () => {
    it("parses public obligation with dates", () => {
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
            overdue: false,
        });

        expect(parsed.id).toBe(1);
        expect(parsed.createdAt).toBeInstanceOf(Date);
    });
});
