import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import StateBadge from "@/components/ui/StateBadge";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      key === "state.pending" ? "Pendiente" : key,
  }),
}));

describe("StateBadge", () => {
  it("renders translated state label", () => {
    render(<StateBadge state="pending" />);
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });
});
