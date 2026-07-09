"use server";

import { revalidatePath } from "next/cache";
import {
  getObligationClient,
  type ObligationFormValues,
  type ObligationState,
} from "@/lib/logic/obligation";

export async function getDashboardSummary() {
  return getObligationClient().getDashboard();
}

export async function getObligations() {
  return getObligationClient().list();
}

export async function getObligationById(id: string) {
  return getObligationClient().getById(id);
}

export async function deleteObligation(id: string) {
  await getObligationClient().delete(id);
  revalidatePath("/");
  revalidatePath("/obligations");
}

export async function transitionObligation(id: string, state: ObligationState) {
  const updated = await getObligationClient().transition(id, state);
  revalidatePath("/");
  revalidatePath("/obligations");
  revalidatePath(`/obligations/${id}`);
  return updated;
}

export async function createObligation(input: ObligationFormValues) {
  const id = await getObligationClient().create(input);
  revalidatePath("/");
  revalidatePath("/obligations");
  return id;
}

export async function updateObligation(id: string, input: ObligationFormValues) {
  const updated = await getObligationClient().update(id, input);
  revalidatePath("/");
  revalidatePath("/obligations");
  revalidatePath(`/obligations/${id}`);
  return updated;
}
