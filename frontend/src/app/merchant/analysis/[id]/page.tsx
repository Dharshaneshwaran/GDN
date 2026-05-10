"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { saveSelectedStyle } from "@/lib/auth";
import { FileScan, CheckCircle2, ChevronRight, CheckSquare, Clock, ShieldCheck, Box, Scissors, Palette, Sparkles, Copy, Filter, Terminal, Activity, Cpu } from "lucide-react";

export default function TechpackAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const styleId = params.id as string;
  
  const [extractionState, setExtractionState] = useState<"scanning" | "extracting" | "complete">("scanning");
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"structured" | "raw">("structured");
  const [filter, setFilter] = useState<string>("all");

  const styleName = styleId.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  const rawExtractedText = `
[SYSTEM_EXTRACT_STAMP: 2026-05-09 14:22:10]
IDENTIFIER: ${styleName.toUpperCase()}
PAYLOAD_TYPE: INDUSTRIAL_TECHPACK_V1
REVISION_CONTEXT: 1.0_STABLE

SECTION_01: MATERIAL_MATRIX
- PRIMARY_FABRIC: 100% ORGANIC COTTON SINGLE JERSEY
- CALIBRATION_WEIGHT: 180 GSM
- TRIM_SPECS: 1x1 COTTON/SPANDEX RIB (95/5)
- CORE_THREAD: 100% POLYESTER

SECTION_02: CHROMATIC_INDEX
- PRIMARY_COLOR: NAVY BLUE [PANTONE 19-3921]
- SECONDARY_COLOR: OPTICAL WHITE
- PROCESS: REACTIVE_DYEING_SYSTEM

SECTION_03: ASSEMBLY_LOGIC
- HEM_STITCH: DOUBLE NEEDLE INDUSTRIAL STRETCH
- NECK_CONST: TAPED REINFORCEMENT [SHOULDER-TO-SHOULDER]
- FIT_PROFILE: REGULAR_ENTERPRISE_FIT
  `;

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 40 && currentProgress < 100) setExtractionState("extracting");
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => setExtractionState("complete"), 400);
      } else {
        setProgress(currentProgress);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  function handleConfirm() {
    saveSelectedStyle({ id: styleId, name: styleName });
    router.push(`/merchant/analysis/${styleId}/production-type`);
  }

  if (extractionState !== "complete") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto text-center px-8">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-premium-xl border border-slate-100 w-full relative overflow-hidden">
          <div className="relative mb-10 flex justify-center">
            <div className="w-32 h-44 bg-slate-900 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden border border-slate-800">
              <Terminal className="w-10 h-10 text-factory-accent" />
              <div className="absolute top-0 left-0 w-full h-0.5 bg-factory-accent shadow-[0_0_15px_#10b981] animate-scan" style={{ top: `${progress}%` }} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_100%)]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-2">Analyzing Payload</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-12 italic">Extracting industrial specifications</p>
          
          <div className="space-y-4">
             <div className="flex justify-between items-end mb-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Buffer Sync</span>
                <span className="text-sm font-mono text-slate-900">{progress}%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-1.5 p-0.5 border border-slate-200 shadow-inner">
               <div className="bg-slate-900 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.1)]" style={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>
        <style jsx>{` @keyframes scan { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(160px); } } .animate-scan { animation: scan 2s ease-in-out infinite; } `}</style>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-1000 max-w-7xl mx-auto pb-20">
      
      {/* Elite Analysis Header */}
      <section className="bg-white p-10 rounded-[2.5rem] shadow-premium-md border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative overflow-hidden group">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-factory-accent shrink-0 shadow-premium-xl border border-slate-800">
            <ShieldCheck size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-factory-emerald bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Validated Sequence</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">{styleName}</h1>
          </div>
        </div>
        
        <button onClick={handleConfirm} className="relative z-10 flex items-center gap-4 rounded-full bg-slate-900 hover:bg-factory-accent px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all shadow-premium-xl active:scale-95 group/btn">
          Commit Record to Ledger
          <ChevronRight size={18} className="text-factory-accent group-hover/btn:translate-x-1 transition-transform" />
        </button>

        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-50/30 rounded-full blur-[100px] -mr-48 -mt-48 transition-all duration-1000 group-hover:bg-emerald-100/40" />
      </section>

      {/* Logic Switcher */}
      <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-premium-sm w-fit mx-auto lg:mx-0">
        <button onClick={() => setActiveTab("structured")} className={`flex items-center gap-3 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "structured" ? "bg-slate-50 text-slate-900 border border-slate-200 shadow-inner" : "text-slate-400 hover:text-slate-600"}`}>
          <Filter size={14} />
          Matrix Map
        </button>
        <button onClick={() => setActiveTab("raw")} className={`flex items-center gap-3 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "raw" ? "bg-slate-50 text-slate-900 border border-slate-200 shadow-inner" : "text-slate-400 hover:text-slate-600"}`}>
          <Terminal size={14} />
          System Log
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-6">
          {activeTab === "structured" ? (
            <div className="grid gap-6">
              <div className="flex items-center justify-between bg-white px-8 py-5 rounded-[2rem] border border-slate-100 shadow-premium-sm">
                <div className="flex items-center gap-3">
                   <Activity size={18} className="text-factory-emerald" />
                   <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Calibration Context</h2>
                </div>
                <select className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-2 focus:ring-factory-emerald/20 transition-all" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">Full Data Set</option>
                  <option value="materials">Materials Matrix</option>
                  <option value="colors">Chromatic Spectrum</option>
                </select>
              </div>
              
              {(filter === "all" || filter === "materials") && (
                <div className="bg-white rounded-[2.5rem] p-10 shadow-premium-md border border-slate-100 animate-in fade-in slide-in-from-left-6 duration-700">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shadow-sm"><Box size={24} /></div>
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Material Specification</h3>
                  </div>
                  <div className="grid gap-4">
                    <div className="p-8 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-factory-emerald transition-all shadow-premium-sm">
                       <div className="flex items-center gap-6">
                          <div className="w-2 h-2 rounded-full bg-factory-accent" />
                          <span className="text-sm font-bold text-slate-700 tracking-tight uppercase">100% Organic Cotton Single Jersey, 180 GSM</span>
                       </div>
                       <CheckCircle2 size={20} className="text-factory-emerald opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 rounded-[3rem] p-12 shadow-premium-xl border border-slate-800 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Terminal size={200} className="text-white" />
              </div>
              <div className="relative z-10">
                <pre className="bg-black/60 p-10 rounded-[2rem] text-emerald-400/90 font-mono text-[11px] leading-[2] overflow-x-auto border border-white/5 shadow-inner custom-scrollbar">
                  {rawExtractedText}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Engine Performance Bento */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-premium-md h-fit sticky top-24 overflow-hidden relative">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 border-b border-slate-50 pb-5">Engine Validation</h3>
            <div className="space-y-6 text-[10px] font-bold uppercase tracking-widest">
              {[
                { l: "Sync Status", v: "Complete", i: CheckCircle2, c: "text-factory-emerald" },
                { l: "Engine Core", v: "Tiruppur v4.2", i: Cpu },
                { l: "Extraction", v: "Industrial", i: Terminal },
                { l: "Confidence", v: "99.85%", i: Sparkles, c: "text-slate-900" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <span className="text-slate-400 flex items-center gap-3">
                    <item.i size={14} className="opacity-30 group-hover:text-factory-emerald transition-colors" /> {item.l}
                  </span>
                  <span className={`text-slate-800 font-black ${item.c || ""}`}>{item.v}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-14 p-6 bg-slate-900 rounded-[2rem] shadow-premium-xl border border-slate-800">
               <p className="text-[10px] text-white/50 font-bold leading-relaxed uppercase tracking-[0.1em]">
                  <span className="text-factory-accent block mb-2 font-black tracking-widest">Automated Audit:</span>
                  Payload verified against ISO-9001 industrial standards. Production matrix generated with zero fatal conflicts.
               </p>
            </div>
            
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-slate-50 rounded-full blur-[80px] -z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
