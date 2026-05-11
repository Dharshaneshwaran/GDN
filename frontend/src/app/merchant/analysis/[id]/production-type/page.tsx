"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSelectedStyle, saveSelectedStyle, addNotification, getSession } from "@/lib/auth";
import { BackButton } from "@/components/BackButton";
import { Layers, ChevronRight, Sparkles, Zap, Cpu, ShieldCheck } from "lucide-react";

export default function ProductionTypePage() {
  const params = useParams();
  const router = useRouter();
  const styleId = params.id as string;
  
  const [selectedStyle, setSelectedStyle] = useState<any>(null);

  useEffect(() => {
    const style = getSelectedStyle();
    setSelectedStyle(style);
  }, [styleId]);

  function handleSelect(type: "sample" | "bulk") {
    const currentStyle = selectedStyle || { id: styleId, name: styleId.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") };
    saveSelectedStyle({ ...currentStyle, productionType: type });
    
    if (type === "sample") {
      // Add notification for sample development
      const session = getSession();
      addNotification({
        title: `Style Assignment: ${currentStyle.name}`,
        message: `Merchant ${session?.displayName || "System"} has transmitted style ${currentStyle.name} for prototyping.`,
        type: "style_transfer",
        payload: { styleId: currentStyle.id, styleName: currentStyle.name }
      });
      router.push("/sample");
    } else {
      router.push("/merchant/bulk");
    }
  }

  const styleName = selectedStyle?.name || styleId.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      <header>
        <BackButton />
        <div className="mt-6 flex items-center gap-3">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-factory-emerald bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
             Context: {styleName}
           </span>
        </div>
        <h1 className="mt-4 text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Select Production Protocol</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">Specify the industrial execution mode for this style context.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <button
          onClick={() => handleSelect("sample")}
          className="group relative overflow-hidden rounded-[2.5rem] bg-white p-12 text-left border border-slate-100 shadow-premium-md hover:border-slate-900 hover:shadow-premium-xl transition-all duration-500"
        >
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-factory-accent transition-all duration-500 shadow-inner">
            <Sparkles size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">
            Sample <br/> <span className="text-slate-300 group-hover:text-slate-900 transition-colors">Development</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
            Iterative prototyping and validation cycle for design confirmation.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-factory-emerald opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
             Initialize Sample Logic <ChevronRight size={14} />
          </div>
          <div className="absolute top-8 right-8 text-slate-50 group-hover:text-slate-100 transition-colors -z-10">
             <Cpu size={120} />
          </div>
        </button>

        <button
          onClick={() => handleSelect("bulk")}
          className="group relative overflow-hidden rounded-[2.5rem] bg-white p-12 text-left border border-slate-100 shadow-premium-md hover:border-slate-900 hover:shadow-premium-xl transition-all duration-500"
        >
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-factory-accent transition-all duration-500 shadow-inner">
            <Layers size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">
            Bulk <br/> <span className="text-slate-300 group-hover:text-slate-900 transition-colors">Production</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8">
            High-volume industrial execution with strict supply chain synchronization.
          </p>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-factory-emerald opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
             Initialize Bulk Logic <ChevronRight size={14} />
          </div>
          <div className="absolute top-8 right-8 text-slate-50 group-hover:text-slate-100 transition-colors -z-10">
             <ShieldCheck size={120} />
          </div>
        </button>
      </div>

      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex items-center gap-6">
         <div className="h-12 w-12 rounded-2xl bg-white shadow-premium-sm border border-slate-200 flex items-center justify-center shrink-0">
            <Zap size={20} className="text-factory-accent" />
         </div>
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
           Selection of production protocol will synchronize all downstream department nodes including Yarn, Knitting, and Processing with the appropriate validation parameters.
         </p>
      </div>
    </div>
  );
}
