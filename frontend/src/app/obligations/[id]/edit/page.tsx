import { getObligationById } from "@/actions/obligations";
import ObligationForm from "@/components/obligations/ObligationForm";
import { notFound } from "next/navigation";

export default async function EditObligationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const obligation = await getObligationById(id);

    return (
      <ObligationForm
        mode="edit"
        obligationId={id}
        companyTaxIdPlaceholder={obligation.companyTaxId}
        initialValues={{
          type: obligation.type,
          title: obligation.title,
          description: obligation.description,
          owner: obligation.owner,
          dueDate: obligation.dueDate,
          companyTaxId: "",
          requiresDocument: obligation.requiresDocument,
          documentUrl: obligation.documentUrl,
        }}
      />
    );
  } catch {
    notFound();
  }
}
