"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSelectedStyle, addExistingSample, saveSelectedStyle } from "@/lib/auth";
import { BackButton } from "@/components/BackButton";
import { FormInput, FormTextarea } from "@/components/FormInput";
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Settings, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Loader2,
  Box,
  Palette,
  ClipboardCheck
} from "lucide-react";

export default function NewSamplePage() {
  const router = useRouter();
  const [style, setStyle] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const s = getSelectedStyle();
    if (!s) {
      router.push("/sample");
      return;
    }
    setStyle(s);
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate industrial calibration sequence
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        completeSubmission();
      }
    }, 150);
  }

  function completeSubmission() {
    if (style) {
      addExistingSample({
        ...style,
        productionType: "sample"
      });
      // Optionally clear the temporary selected style or keep it
      router.push("/sample");
    }
  }

  if (!style) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto pb-20">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <BackButton />
          <div className="mt-6 flex items-center gap-3">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-factory-emerald bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
               Prototyping Mode: {style.name}
             </span>
          </div>
          <h1 className="mt-4 text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Initialization Terminal</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Calibrating technical specifications for industrial prototyping.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-premium-xl text-factory-accent">
              <Cpu size={24} className="animate-pulse" />
           </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-premium-md space-y-10">
          <div className="flex items-center gap-4 pb-8 border-b border-slate-50">
             <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
                <Settings size={20} />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Configuration Matrix</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Primary Prototype Parameters</p>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <FormInput label="Prototype Identifier" name="protoId" defaultValue={`${style.id}-P1`} required />
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Original Scope / Notes</label>
                 <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-medium text-slate-600 leading-relaxed italic">
                    {style.description || "No specific merchant notes provided."}
                 </div>
              </div>
            </div>
            <div className="space-y-6">
               <FormInput label="Technical Revision" name="revision" defaultValue="v1.0-STABLE" />
               <FormTextarea label="Calibration Notes" name="calibration" placeholder="Detail technical adjustments or material changes..." />
            </div>
          </div>

          <div className="pt-6">
             <button
               type="submit"
               disabled={isSubmitting}
               className="w-full flex items-center justify-center gap-4 rounded-2xl bg-slate-900 hover:bg-factory-accent px-10 py-6 text-xs font-black uppercase tracking-[0.4em] text-white transition-all shadow-premium-xl disabled:opacity-50"
             >
               {isSubmitting ? (
                 <>
                   <Loader2 size={20} className="animate-spin" />
                   Syncing Parameters... {progress}%
                 </>
               ) : (
                 <>
                   <Zap size={20} className="text-factory-accent" />
                   Finalize & Commit Prototype
                 </>
               )}
             </button>
          </div>
        </form>

        <aside className="space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium-md relative overflow-hidden">
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-b border-slate-50 pb-4">Validation Engine</h4>
              <div className="space-y-6">
                 {[
                   { l: "Material Sync", i: Box, s: "Validated" },
                   { l: "Chromatic Scan", i: Palette, s: "Complete" },
                   { l: "Supply Chain", i: Layers, s: "Active" }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                         <item.i size={14} className="text-slate-200 group-hover:text-factory-accent transition-colors" />
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.l}</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-900 uppercase">{item.s}</span>
                   </div>
                 ))}
              </div>
              <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="flex items-center gap-3 mb-3">
                    <ShieldCheck size={14} className="text-factory-emerald" />
                    <span className="text-[9px] font-black text-slate-900 uppercase">System Integrity</span>
                 </div>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    Calibration sequence requires 100% material validation before database commitment.
                 </p>
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-slate-800 shadow-premium-xl text-white">
              <div className="flex items-center gap-3 mb-6">
                 <ClipboardCheck size={18} className="text-factory-accent" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em]">Technical Audit</span>
              </div>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed italic">
                 "Prototype phase ensures industrial scalability. Data will be archived in the centralized Sample Database upon completion."
              </p>
           </div>
        </aside>
      </div>
    </div>
  );
}
