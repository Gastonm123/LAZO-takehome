import { getObligationById } from "@/actions/obligations";
import ObligationDetailView from "@/components/detail/ObligationDetailView";
import { notFound } from "next/navigation";

export default async function ObligationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const obligation = await getObligationById(id);
    return <ObligationDetailView obligation={obligation} />;
  } catch {
    notFound();
  }
}
