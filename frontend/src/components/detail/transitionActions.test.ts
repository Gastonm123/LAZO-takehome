import { describe, expect, it } from "vitest";
import {
  NEXT_STATES,
  TRANSITION_ACTIONS,
} from "@/components/detail/transitionActions";

describe("transitionActions", () => {
  it("defines next states for every obligation state", () => {
    expect(NEXT_STATES.pending).toEqual(["in_progress"]);
    expect(NEXT_STATES.in_progress).toContain("submitted");
    expect(NEXT_STATES.submitted).toContain("done");
    expect(NEXT_STATES.done).toEqual(["in_progress"]);
  });

  it("maps transition buttons to i18n keys", () => {
    expect(TRANSITION_ACTIONS.pending.in_progress).toBe(
      "detail.actions.start",
    );
    expect(TRANSITION_ACTIONS.in_progress.submitted).toBe(
      "detail.actions.submit",
    );
  });
});
