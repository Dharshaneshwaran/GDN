"use client";

import { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  BarChart3, 
  Activity, 
  PlusCircle, 
  Layers, 
  Settings,
  ShieldCheck,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function StyleGalleryPage() {
  const [selectedStyle, setSelectedStyle] = useState<string>("bento");

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12 space-y-12">
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Live Style Gallery</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Choose a professional direction for your Tiruppur Tracker.</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          {["minimalist", "bento", "aero"].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStyle(s)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedStyle === s 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {selectedStyle === "minimalist" && <MinimalistPreview />}
        {selectedStyle === "bento" && <BentoPreview />}
        {selectedStyle === "aero" && <AeroPreview />}
      </main>

      <footer className="max-w-6xl mx-auto pt-12 border-t border-slate-200 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
          Currently Previewing: <span className="text-slate-900">{selectedStyle.toUpperCase()}</span>
        </p>
      </footer>
    </div>
  );
}

function MinimalistPreview() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-white border border-slate-900 p-12">
        <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-900 mb-8 border-b border-slate-100 pb-4">01. Nordic Minimalist Concept</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-slate-900">
          {[
            { label: "Outward", value: "1,240 kg" },
            { label: "Inward", value: "1,180 kg" },
            { label: "Alerts", value: "03" }
          ].map((stat, i) => (
            <div key={i} className="p-8 border-r border-b border-slate-900 bg-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex gap-4">
          <button className="px-8 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest border border-slate-900 hover:bg-white hover:text-slate-900 transition-colors">
            Initialize Transaction
          </button>
          <button className="px-8 py-4 bg-white text-slate-900 text-[10px] font-bold uppercase tracking-widest border border-slate-900">
            View System Logs
          </button>
        </div>
      </div>
    </div>
  );
}

function BentoPreview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-factory-accent">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Bento Intelligence</h3>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">Organized, tile-based architecture with large rounded corners and high readability.</p>
          <button className="mt-8 w-fit px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
            Open Dashboard
          </button>
        </div>

        <div className="bg-emerald-500 p-10 rounded-[2.5rem] shadow-lg shadow-emerald-500/20 text-white flex flex-col justify-between">
          <ArrowUpRight size={32} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Outward</p>
            <p className="text-4xl font-black tracking-tighter">1,240<span className="text-lg ml-1 opacity-60">kg</span></p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between">
          <Activity className="text-blue-500" size={32} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Efficiency</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">98%</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Production Tiles</h3>
          <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-100" />)}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Yawn", "Knitting", "Dying", "Washing"].map((s) => (
            <div key={s} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-factory-accent transition-all cursor-pointer group">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-factory-accent transition-colors">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AeroPreview() {
  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-1000">
      <div className="relative p-12 rounded-[4rem] bg-white/40 backdrop-blur-3xl border border-white/60 shadow-glass-liquid overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-factory-accent/5 via-white/20 to-slate-200/20 opacity-40" />
        
        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-3xl shadow-glass border border-white/50">
              <ShieldCheck className="w-8 h-8 text-factory-accent" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Soft-Glass Aero</h3>
              <p className="text-slate-500 font-bold italic">Iridescent, translucent, and deeply blurred surfaces.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {[
              { label: "Outward Flow", icon: ArrowUpRight, color: "text-emerald-500" },
              { label: "Inward Flow", icon: ArrowDownLeft, color: "text-blue-500" },
              { label: "Risk Center", icon: Activity, color: "text-amber-500" }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white/60 border border-white/40 shadow-glass-liquid group hover:scale-105 transition-all duration-500 cursor-pointer">
                <item.icon className={`${item.color} mb-4 transition-transform group-hover:rotate-12`} size={32} />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
                <div className="mt-4 h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                   <div className={`h-full w-2/3 bg-current ${item.color}`} />
                </div>
              </div>
            ))}
          </div>

          <button className="w-fit mt-4 px-10 py-5 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-2xl shadow-slate-900/20 hover:scale-105 transition-all">
            Enter Aero Terminal
          </button>
        </div>
      </div>

      <style jsx global>{`
        .shadow-glass-liquid {
          box-shadow: 
            0 20px 50px -15px rgba(0, 0, 0, 0.05),
            inset 0 0 20px rgba(255, 255, 255, 0.5);
        }
        .shadow-glass {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}
