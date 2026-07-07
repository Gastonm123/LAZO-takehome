import { getObligations } from "@/actions/obligations";
import ObligationsContent from "@/components/obligations/ObligationsContent";

export default async function ObligationsPage() {
  const items = await getObligations();
  return <ObligationsContent items={items} />;
}
