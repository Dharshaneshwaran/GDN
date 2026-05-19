"use client";

import { useEffect, useState } from "react";
import { getExistingSamples, type SelectedStyle } from "@/lib/auth";
import { BackButton } from "@/components/BackButton";
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Search,
  Filter,
  Layers,
  Cpu,
  ShieldCheck,
  LayoutGrid,
  Zap,
  Box,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

type SampleStatus = "ONGOING" | "COMPLETED" | "CANCELLED";

interface ProductionSample extends SelectedStyle {
  status: SampleStatus;
  progress: number;
  startDate: string;
}

export default function ProductionPage() {
  const [samples, setSamples] = useState<ProductionSample[]>([]);
  const [filter, setFilter] = useState<SampleStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // In a real app, this would come from a DB with status tracking
    // For now, we enhance existing samples with mock production data
    const existing = getExistingSamples();
    const productionData: ProductionSample[] = existing.map((s, idx) => ({
      ...s,
      status: idx === 0 ? "ONGOING" : idx === 1 ? "COMPLETED" : idx === 2 ? "CANCELLED" : "ONGOING",
      progress: idx === 0 ? 65 : idx === 1 ? 100 : idx === 2 ? 30 : 45,
      startDate: new Date(Date.now() - (idx + 1) * 86400000).toLocaleDateString()
    }));
    setSamples(productionData);
  }, []);

  const filteredSamples = samples.filter(s => {
    const matchesFilter = filter === "ALL" || s.status === filter;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: SampleStatus) => {
    switch (status) {
      case "ONGOING": return "text-factory-accent bg-factory-accent/5 border-factory-accent/10";
      case "COMPLETED": return "text-factory-emerald bg-factory-emerald/5 border-factory-emerald/10";
      case "CANCELLED": return "text-red-500 bg-red-500/5 border-red-500/10";
    }
  };

  const getStatusIcon = (status: SampleStatus) => {
    switch (status) {
      case "ONGOING": return <Clock size={14} className="animate-spin-slow" />;
      case "COMPLETED": return <CheckCircle2 size={14} />;
      case "CANCELLED": return <XCircle size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-20">
      
      {/* 1. Elite Production Header */}
      <header className="bg-white p-10 rounded-[2.5rem] shadow-premium-md border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <BackButton />
          <div className="mt-6 flex items-center gap-4">
             <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Activity size={12} className="text-factory-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Production Flow</span>
             </div>
             <div className="h-4 w-px bg-slate-200" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Distribution Network</span>
          </div>
          <h1 className="mt-4 text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none text-balance">Sample Production Terminal</h1>
        </div>

        <div className="flex items-center gap-6 relative z-10">
           <div className="grid grid-cols-3 gap-4">
              {[
                { l: "Ongoing", v: samples.filter(s => s.status === "ONGOING").length, c: "text-factory-accent" },
                { l: "Completed", v: samples.filter(s => s.status === "COMPLETED").length, c: "text-factory-emerald" },
                { l: "Cancelled", v: samples.filter(s => s.status === "CANCELLED").length, c: "text-red-500" }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 min-w-[100px] text-center">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
                   <p className={`text-xl font-black ${stat.c} tracking-tighter`}>{stat.v}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-40" />
      </header>

      {/* 2. Command Center (Filters & Search) */}
      <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-premium-sm flex flex-col md:flex-row items-center gap-6">
         <div className="flex-1 relative w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
               type="text" 
               placeholder="SEARCH PRODUCTION LOGS (ID / NAME)..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-16 pr-6 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-factory-emerald/20 transition-all shadow-inner"
            />
         </div>
         
         <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner w-full md:w-auto">
            {(["ALL", "ONGOING", "COMPLETED", "CANCELLED"] as const).map((opt) => (
               <button
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                     filter === opt 
                     ? "bg-slate-900 text-white shadow-premium-md" 
                     : "text-slate-400 hover:text-slate-600"
                  }`}
               >
                  {opt}
               </button>
            ))}
         </div>
      </section>

      {/* 3. Production Matrix (Sample List) */}
      <div className="grid gap-6">
         {filteredSamples.length === 0 ? (
            <div className="bg-white rounded-[3rem] py-32 flex flex-col items-center justify-center border border-slate-100 shadow-premium-md opacity-30">
               <LayoutGrid size={64} className="text-slate-200 mb-6" />
               <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">System Log Empty</p>
            </div>
         ) : (
            filteredSamples.map((sample) => (
               <article 
                  key={sample.id}
                  className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium-md hover:border-slate-900 transition-all group relative overflow-hidden"
               >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-factory-accent transition-all duration-500 shadow-inner">
                           <Box size={24} />
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center gap-3">
                              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{sample.name}</h2>
                              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${getStatusColor(sample.status)}`}>
                                 {getStatusIcon(sample.status)}
                                 {sample.status}
                              </div>
                           </div>
                           <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">ARCHIVE_ID: {sample.id}</p>
                        </div>
                     </div>

                     <div className="flex-1 max-w-md w-full">
                        <div className="flex items-center justify-between mb-2">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress Integrity</span>
                           <span className="text-[10px] font-mono text-slate-900 font-bold">{sample.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-100">
                           <div 
                              className={`h-full transition-all duration-1000 ${
                                 sample.status === "CANCELLED" ? "bg-red-500" : "bg-factory-emerald"
                              }`}
                              style={{ width: `${sample.progress}%` }}
                           />
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Initialized On</p>
                           <p className="text-xs font-bold text-slate-900">{sample.startDate}</p>
                        </div>
                        <Link 
                           href="/sample/existing"
                           onClick={() => {
                              // Sync context for detail view
                              if (typeof window !== "undefined") {
                                 localStorage.setItem("fabric_tracker_selected_style", JSON.stringify(sample));
                                 window.dispatchEvent(new Event("style-changed"));
                              }
                           }}
                           className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-premium-sm"
                        >
                           <ExternalLink size={20} />
                        </Link>
                     </div>
                  </div>
                  
                  {/* Decorative Background ID */}
                  <div className="absolute top-1/2 -translate-y-1/2 -right-4 text-[120px] font-black text-slate-50 select-none pointer-events-none -z-0 opacity-40 group-hover:text-slate-100 transition-colors">
                     {sample.id.substring(0, 4).toUpperCase()}
                  </div>
               </article>
            ))
         )}
      </div>

      {/* 4. Industrial Intelligence Bento */}
      <section className="bg-slate-900 rounded-[3rem] p-12 border border-slate-800 shadow-premium-xl overflow-hidden relative group">
         <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-2 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl text-factory-accent">
                     <Cpu size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Production Intel</h3>
               </div>
               <p className="text-xs text-white/40 font-medium leading-relaxed italic max-w-md">
                  Autonomous production node synchronization active. Spectral analysis and material validation cycles are logged in real-time across the global distribution matrix.
               </p>
            </div>
            
            {[
               { l: "Node Status", v: "SYNCHRONIZED", i: Zap },
               { l: "Audit Integrity", v: "100% STABLE", i: ShieldCheck }
            ].map((item, idx) => (
               <div key={idx} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between group/stat hover:bg-white/10 transition-all">
                  <item.i size={20} className="text-factory-accent animate-pulse" />
                  <div className="mt-8">
                     <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{item.l}</p>
                     <p className="text-sm font-black text-white tracking-widest">{item.v}</p>
                  </div>
               </div>
            ))}
         </div>
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
      </section>

    </div>
  );
}
