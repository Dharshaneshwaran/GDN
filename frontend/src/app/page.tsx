"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import type { DashboardStats } from "@/types";

const initialStats: DashboardStats = {
  totalOutwardEntries: 0,
  totalInwardEntries: 0,
  totalShortageAlerts: 0,
  todaySentWeight: 0,
  todayReceivedWeight: 0
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getDashboardStats()
      .then(setStats)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <section>
        <BackButton />
        <p className="text-sm font-semibold uppercase tracking-wide text-factory-green">
          Factory fabric movement
        </p>
        <h1 className="mt-2 text-3xl font-bold text-factory-ink">Dashboard</h1>
      </section>

      {error ? (
        <div className="rounded-md border border-factory-red bg-red-50 p-4 text-factory-red">
          Backend not reachable: {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total outward entries" value={loading ? "..." : stats.totalOutwardEntries} />
        <StatCard label="Total inward entries" value={loading ? "..." : stats.totalInwardEntries} />
        <StatCard
          label="Shortage alerts"
          value={loading ? "..." : stats.totalShortageAlerts}
          tone="warning"
        />
        <StatCard label="Today sent weight" value={loading ? "..." : `${stats.todaySentWeight} kg`} />
        <StatCard
          label="Today received weight"
          value={loading ? "..." : `${stats.todayReceivedWeight} kg`}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link className="rounded-md bg-factory-green px-5 py-4 text-center text-lg font-bold text-white" href="/outward">
          New Outward Entry
        </Link>
        <Link className="rounded-md bg-factory-ink px-5 py-4 text-center text-lg font-bold text-white" href="/inward">
          New Inward Entry
        </Link>
        <Link className="rounded-md bg-white px-5 py-4 text-center text-lg font-bold text-factory-ink ring-1 ring-factory-line" href="/reports">
          Reports
        </Link>
      </div>
    </div>
  );
}
