interface StatCardProps {
  label: string;
  value: number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="stat-card-pop rounded-2xl border border-lazo-100 bg-white p-5 shadow-card">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-lazo-700">{value}</p>
    </div>
  );
}
