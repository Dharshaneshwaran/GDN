interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "default" | "warning";
}

export function StatCard({ label, value, tone = "default" }: StatCardProps) {
  const toneClasses =
    tone === "warning"
      ? "border-factory-red bg-red-50 text-factory-red"
      : "border-factory-line bg-white text-factory-ink";

  return (
    <section className={`rounded-md border p-4 shadow-sm ${toneClasses}`}>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </section>
  );
}
