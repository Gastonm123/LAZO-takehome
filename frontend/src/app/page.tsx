import { getDashboardSummary } from "@/actions/obligations";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  return <DashboardContent summary={summary} />;
}
