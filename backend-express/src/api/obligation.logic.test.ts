import { describe, expect, it } from "vitest";
import type ObligationModel from "@/models/obligation.js";
import { ObligationLogic } from "@/api/obligation.js";

function mockObligation(
    overrides: Partial<{
        state: ObligationModel["state"];
        dueDate: Date;
        requiresDocument: boolean;
        documentUrl: string | null;
    }> = {},
): ObligationModel {
    return {
        state: "pending",
        dueDate: new Date("2026-01-01"),
        requiresDocument: false,
        documentUrl: null,
        ...overrides,
    } as ObligationModel;
}

describe("ObligationLogic.isOverdue", () => {
    it("returns false for done and submitted", () => {
        const past = new Date("2020-01-01");
        expect(
            ObligationLogic.isOverdue(mockObligation({ state: "done", dueDate: past })),
        ).toBe(false);
        expect(
            ObligationLogic.isOverdue(
                mockObligation({ state: "submitted", dueDate: past }),
            ),
        ).toBe(false);
    });

    it("returns true when due date is before today", () => {
        expect(
            ObligationLogic.isOverdue(
                mockObligation({ dueDate: new Date("2020-01-01") }),
            ),
        ).toBe(true);
    });

    it("returns false when due date is today or later", () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expect(
            ObligationLogic.isOverdue(mockObligation({ dueDate: today })),
        ).toBe(false);
    });
});

describe("ObligationLogic.validateTransition", () => {
    it("allows pending to in_progress", () => {
        expect(
            ObligationLogic.validateTransition(
                mockObligation(),
                "pending",
                "in_progress",
            ),
        ).toBe(true);
    });

    it("rejects invalid transitions", () => {
        expect(
            ObligationLogic.validateTransition(
                mockObligation(),
                "pending",
                "done",
            ),
        ).toBe(false);
    });

    it("rejects submitted without document when required", () => {
        expect(
            ObligationLogic.validateTransition(
                mockObligation({
                    requiresDocument: true,
                    documentUrl: null,
                }),
                "in_progress",
                "submitted",
            ),
        ).toBe(false);
    });

    it("allows submitted when document is present", () => {
        expect(
            ObligationLogic.validateTransition(
                mockObligation({
                    requiresDocument: true,
                    documentUrl: "https://example.com/doc.pdf",
                }),
                "in_progress",
                "submitted",
            ),
        ).toBe(true);
    });
});

describe("ObligationLogic.validateUpdate", () => {
    it("rejects requiresDocument true without documentUrl", () => {
        expect(
            ObligationLogic.validateUpdate(mockObligation(), {
                requiresDocument: true,
                documentUrl: null,
            }),
        ).toBe(false);
    });

    it("accepts update with document when required", () => {
        expect(
            ObligationLogic.validateUpdate(mockObligation(), {
                requiresDocument: true,
                documentUrl: "https://example.com/doc.pdf",
            }),
        ).toBe(true);
    });
});

describe("ObligationLogic.isUpcomingDue", () => {
    it("returns false for terminal states", () => {
        expect(
            ObligationLogic.isUpcomingDue(
                mockObligation({ state: "done", dueDate: new Date() }),
            ),
        ).toBe(false);
    });

    it("returns true for due date within the next week", () => {
        const inThreeDays = new Date();
        inThreeDays.setHours(0, 0, 0, 0);
        inThreeDays.setDate(inThreeDays.getDate() + 3);

        expect(
            ObligationLogic.isUpcomingDue(
                mockObligation({ dueDate: inThreeDays }),
            ),
        ).toBe(true);
    });
});
