import "server-only";
import {
  getMockDashboardSummary,
  getMockObligationDetail,
  getMockObligations,
} from "./mock-data";
import type {
  DashboardSummary,
  Obligation,
  ObligationDetail,
  ObligationStatus,
} from "@/lib/types/obligation";

const API_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";
const USE_MOCK = process.env.USE_MOCK_DATA !== "false";

async function backendRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Backend error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function loadDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCK) {
    return getMockDashboardSummary();
  }
  return backendRequest<DashboardSummary>("/dashboard/summary");
}

export async function loadObligations(): Promise<Obligation[]> {
  if (USE_MOCK) {
    return getMockObligations();
  }
  return backendRequest<Obligation[]>("/obligations");
}

export async function loadObligation(id: string): Promise<ObligationDetail> {
  if (USE_MOCK) {
    const detail = getMockObligationDetail(id);
    if (!detail) {
      throw new Error("Obligation not found");
    }
    return detail;
  }
  return backendRequest<ObligationDetail>(`/obligations/${id}`);
}

export async function removeObligation(id: string): Promise<void> {
  if (USE_MOCK) {
    return;
  }
  await backendRequest<void>(`/obligations/${id}`, { method: "DELETE" });
}

export async function changeObligationStatus(
  id: string,
  status: ObligationStatus,
): Promise<ObligationDetail> {
  if (USE_MOCK) {
    const detail = getMockObligationDetail(id);
    if (!detail) {
      throw new Error("Obligation not found");
    }
    return { ...detail, status };
  }
  return backendRequest<ObligationDetail>(`/obligations/${id}/transitions`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
}
