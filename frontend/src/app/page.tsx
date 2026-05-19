"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  BarChart3, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Zap,
  Activity,
  LayoutGrid,
  History,
  ShieldCheck,
  Cpu,
  Workflow
} from "lucide-react";
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
    <div className="space-y-6 pb-12 animate-in fade-in duration-700">
      
      {/* 1. Elite Industrial Header Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-premium-md border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-900 rounded-xl shadow-lg border border-slate-800">
                <Cpu size={18} className="text-factory-accent" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Export Control Center</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-[1.1] uppercase mb-4">
              Ruroxz <br/> <span className="text-factory-emerald">Global</span> Intelligence
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
              Advanced production synchronization engine for Ruroxz Exports international supply chain validation.
            </p>
          </div>
          
          <div className="mt-10 flex items-center gap-4 z-10">
            <Link 
              href="/outward" 
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-slate-800 hover:shadow-premium-lg active:scale-95 border border-slate-800"
            >
              <PlusCircle size={14} className="text-factory-accent" />
              Initial Log
            </Link>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-400">
               <Workflow size={14} />
               <span className="text-[9px] font-bold uppercase tracking-widest">Active Sync</span>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-40 transition-all duration-1000 group-hover:bg-emerald-50/50" />
        </div>

        <div className="bg-slate-900 p-8 rounded-2xl shadow-premium-xl border border-slate-800 flex flex-col justify-between text-white relative overflow-hidden group">
           <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                 <div className="p-2 bg-white/10 rounded-lg">
                    <ShieldCheck size={20} className="text-factory-accent" />
                 </div>
                 <div className="w-2 h-2 rounded-full bg-factory-accent animate-pulse shadow-[0_0_10px_#10b981]" />
              </div>
              <h3 className="text-lg font-black tracking-tight uppercase mb-2">System Integrity</h3>
              <p className="text-xs text-white/50 font-medium leading-relaxed">
                 All production nodes synchronized. 100% data integrity verified for current cycle.
              </p>
           </div>
           
           <div className="mt-8 pt-6 border-t border-white/5 z-10">
              <div className="flex justify-between items-end mb-2">
                 <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Uptime</span>
                 <span className="text-xs font-mono text-factory-accent tracking-tighter">99.9%</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full w-[99.9%] bg-factory-accent" />
              </div>
           </div>
           
           <div className="absolute inset-0 bg-gradient-to-br from-factory-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </div>

      {/* 2. Precision Stat Matrix */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard 
          label="Outward Stream" 
          value={loading ? "..." : stats.totalOutwardEntries} 
          icon={<ArrowUpRight size={18} />}
          trend="+12.4%"
          tone="success"
        />
        <StatCard 
          label="Inward Intake" 
          value={loading ? "..." : stats.totalInwardEntries} 
          icon={<ArrowDownLeft size={18} />}
          trend="+5.2%"
          tone="info"
        />
        <StatCard
          label="System Risk"
          value={loading ? "..." : stats.totalShortageAlerts}
          icon={<AlertTriangle size={18} />}
          tone="warning"
        />
        <StatCard 
          label="Today Output" 
          value={loading ? "..." : `${stats.todaySentWeight}kg`} 
          icon={<Zap size={18} />}
        />
        <StatCard 
          label="Today Receipt" 
          value={loading ? "..." : `${stats.todayReceivedWeight}kg`} 
          icon={<History size={18} />}
        />
      </section>

      {/* 3. Operational Command & Analytics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-premium-md group">
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Operational Hub</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Industrial Execution Terminal</p>
            </div>
            <Activity className="text-slate-100 group-hover:text-factory-accent/20 transition-colors" size={36} />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Link 
              href="/outward" 
              className="group/item flex items-center justify-between p-6 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-factory-accent/30 hover:shadow-premium-lg transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-premium-sm border border-slate-100 text-emerald-600 group-hover/item:scale-110 transition-transform">
                  <ArrowUpRight size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Record Dispatch</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Outward Workflow</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/inward" 
              className="group/item flex items-center justify-between p-6 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-factory-blue/30 hover:shadow-premium-lg transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-premium-sm border border-slate-100 text-blue-600 group-hover/item:scale-110 transition-transform">
                  <ArrowDownLeft size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Record Receipt</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inward Workflow</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-slate-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
            </Link>

            <Link 
              href="/reports" 
              className="group/item sm:col-span-2 flex items-center justify-between p-8 rounded-xl bg-white border border-slate-100 hover:border-slate-900 hover:shadow-premium-lg transition-all relative overflow-hidden"
            >
               <div className="flex items-center gap-8 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 shadow-inner border border-slate-100 text-slate-700 group-hover/item:bg-slate-900 group-hover/item:text-white transition-all">
                    <BarChart3 size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover/item:text-slate-900">Advanced Analytics Matrix</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Movement Logs • Shortage Audits • Performance Index</p>
                  </div>
               </div>
               <div className="absolute inset-0 bg-slate-50/50 opacity-0 group-hover/item:opacity-100 transition-opacity" />
               <ArrowRight size={24} className="text-slate-200 group-hover/item:text-slate-900 transition-all z-10" />
            </Link>
          </div>
        </div>

        {/* Efficiency Command Bento */}
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-premium-md flex flex-col justify-between">
           <div>
              <div className="flex items-center justify-between mb-8 px-2">
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Performance</h3>
                 <TrendingUp className="text-factory-accent" size={24} />
              </div>
              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-end mb-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Industrial Index</span>
                       <span className="text-2xl font-black text-slate-900 tracking-tighter">98.4%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-0.5">
                       <div className="h-full w-[98.4%] bg-slate-900 rounded-full" />
                    </div>
                 </div>
                 <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-[0.05em] italic">
                       Precision validation algorithms active. Current production cycle exceeds nominal parameters by 2.4%.
                    </p>
                 </div>
              </div>
           </div>
           
           <button className="mt-12 w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-premium-lg flex items-center justify-center gap-3">
              Generate System Audit <ArrowRight size={14} className="text-factory-accent" />
           </button>
        </div>
      </div>
    </div>
  );
}
