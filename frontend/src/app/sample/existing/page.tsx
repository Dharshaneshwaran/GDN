"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSelectedStyle } from "@/lib/auth";
import { BackButton } from "@/components/BackButton";
import { 
  History, 
  ChevronRight, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Database,
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";

export default function ExistingSamplePage() {
  const router = useRouter();
  const [style, setStyle] = useState<any>(null);

  useEffect(() => {
    const s = getSelectedStyle();
    if (!s) {
      router.push("/sample");
      return;
    }
    setStyle(s);
  }, [router]);

  if (!style) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
      <header className="bg-white p-10 rounded-[2.5rem] shadow-premium-md border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <BackButton />
          <div className="mt-6 flex items-center gap-4">
             <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Database size={12} className="text-factory-accent" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Archived Style Record</span>
             </div>
             <div className="h-4 w-px bg-slate-200" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{style.id}</span>
          </div>
          <h1 className="mt-4 text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{style.name}</h1>
        </div>

        <div className="flex items-center gap-6 relative z-10">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Audit Status</span>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-black text-factory-emerald uppercase tracking-tight">Verified Archive</span>
                 <CheckCircle2 size={14} className="text-factory-emerald" />
              </div>
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           {/* Technical Specs Bento */}
           <section className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-premium-md">
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                 <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
                    <FileText size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Technical Manifest</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Master Prototype Specifications</p>
                 </div>
              </div>
              
              <div className="space-y-8">
                 <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Merchant Directive</h4>
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed italic">
                       {style.description || "No specific instructions archived for this record."}
                    </div>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-premium-sm">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Production Protocol</p>
                       <p className="text-lg font-black text-slate-900 uppercase">{style.productionType || "SAMPLE"}</p>
                    </div>
                    <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-premium-sm">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Archive Integrity</p>
                       <p className="text-lg font-black text-factory-emerald uppercase">100% STABLE</p>
                    </div>
                 </div>
              </div>
           </section>
        </div>

        <aside className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-premium-xl text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-5">Lifecycle Log</h3>
              <div className="space-y-8">
                 {[
                   { l: "Registration", t: "09:42 AM", s: "Complete", i: CheckCircle2 },
                   { l: "Calibration", t: "10:15 AM", s: "Complete", i: Cpu },
                   { l: "Database Sync", t: "11:20 AM", s: "Complete", i: Database }
                 ].map((log, idx) => (
                   <div key={idx} className="flex gap-4 relative">
                      {idx !== 2 && <div className="absolute left-[9px] top-6 w-0.5 h-10 bg-white/5" />}
                      <div className="w-[18px] h-[18px] rounded-full bg-factory-accent/20 border border-factory-accent/30 flex items-center justify-center shrink-0 mt-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-factory-accent" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase tracking-tight text-white">{log.l}</p>
                         <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{log.t} • Status: {log.s}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <button className="w-full group flex items-center justify-between p-8 rounded-[2rem] bg-white border border-slate-100 shadow-premium-md hover:border-slate-900 hover:shadow-premium-xl transition-all">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-emerald-50 text-factory-emerald rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <Activity size={20} />
                 </div>
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active Analysis</span>
              </div>
              <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
           </button>
        </aside>
      </div>
    </div>
  );
}
