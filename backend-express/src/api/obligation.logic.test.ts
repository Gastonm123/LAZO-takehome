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
});

/**
 * Invariante doc-gated (backend):
 * - No se puede pasar a `submitted` si `requiresDocument: true` y no hay documento cargado.
 * - En `submitted` o `done` no se puede cambiar `requiresDocument` ni `documentUrl`.
 */
describe("Invariante doc-gated", () => {
    describe("validateTransition — envío sin documento", () => {
        it.each([
            { documentUrl: null, label: "null" },
            { documentUrl: "", label: "empty string" },
        ])(
            "rejects in_progress → submitted when document is required and url is $label",
            ({ documentUrl }) => {
                expect(
                    ObligationLogic.validateTransition(
                        mockObligation({
                            requiresDocument: true,
                            documentUrl,
                        }),
                        "in_progress",
                        "submitted",
                    ),
                ).toBe(false);
            },
        );

        it("allows in_progress → submitted when document is present", () => {
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

        it("allows in_progress → submitted when document is not required", () => {
            expect(
                ObligationLogic.validateTransition(
                    mockObligation({
                        requiresDocument: false,
                        documentUrl: null,
                    }),
                    "in_progress",
                    "submitted",
                ),
            ).toBe(true);
        });
    });

    describe("validateUpdate — campos de documento bloqueados", () => {
        describe.each(["submitted", "done"] as const)("state %s", (state) => {
            it("rejects requiresDocument change", () => {
                expect(
                    ObligationLogic.validateUpdate(
                        mockObligation({
                            state,
                            requiresDocument: true,
                            documentUrl: "/mock/doc.pdf",
                        }),
                        { requiresDocument: false },
                    ),
                ).toBe(false);
            });

            it("rejects documentUrl change", () => {
                expect(
                    ObligationLogic.validateUpdate(
                        mockObligation({
                            state,
                            requiresDocument: true,
                            documentUrl: "/mock/a.pdf",
                        }),
                        { documentUrl: "/mock/b.pdf" },
                    ),
                ).toBe(false);
            });

            it("allows updating unrelated fields", () => {
                expect(
                    ObligationLogic.validateUpdate(
                        mockObligation({
                            state,
                            requiresDocument: true,
                            documentUrl: "/mock/doc.pdf",
                        }),
                        { title: "Updated title" },
                    ),
                ).toBe(true);
            });
        });

        it("allows document field changes while in_progress", () => {
            expect(
                ObligationLogic.validateUpdate(
                    mockObligation({
                        state: "in_progress",
                        requiresDocument: false,
                        documentUrl: null,
                    }),
                    {
                        requiresDocument: true,
                        documentUrl: "https://example.com/doc.pdf",
                    },
                ),
            ).toBe(true);
        });
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
