"use server";

import { revalidatePath } from "next/cache";
import {
  changeObligationStatus,
  loadDashboardSummary,
  loadObligation,
  loadObligations,
  removeObligation,
} from "@/lib/server/obligations-repository";
import type { ObligationStatus } from "@/lib/types/obligation";

export async function getDashboardSummary() {
  return loadDashboardSummary();
}

export async function getObligations() {
  return loadObligations();
}

export async function getObligationById(id: string) {
  return loadObligation(id);
}

export async function deleteObligation(id: string) {
  await removeObligation(id);
  revalidatePath("/");
  revalidatePath("/obligations");
}

export async function transitionObligation(
  id: string,
  status: ObligationStatus,
) {
  const updated = await changeObligationStatus(id, status);
  revalidatePath("/");
  revalidatePath("/obligations");
  revalidatePath(`/obligations/${id}`);
  return updated;
}
