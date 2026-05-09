"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { merchantDepartments } from "@/lib/merchant-flow";
import { 
  ChevronRight, 
  Layers, 
  User, 
  Settings,
  ClipboardList,
  Fingerprint,
  Box,
  LayoutGrid,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import { getSelectedStyle, getSession, type SelectedStyle } from "@/lib/auth";
import type { AuthSession } from "@/types";

export function Sidebar() {
  const pathname = usePathname();
  const [style, setStyle] = useState<SelectedStyle | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [activeStageId, setActiveStageId] = useState(merchantDepartments[0].id);

  useEffect(() => {
    const updateState = () => {
      if (pathname === "/login") {
        setStyle(null);
        setSession(null);
        return;
      }
      setStyle(getSelectedStyle());
      setSession(getSession());
    };
    updateState();
    window.addEventListener("style-changed", updateState);
    return () => window.removeEventListener("style-changed", updateState);
  }, [pathname]);

  if (pathname === "/login") {
    return null;
  }

  return (
    <aside className="sticky top-0 h-[calc(100vh-56px)] w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-100/60 p-4 gap-5">
      
      {/* 1. Terminal Identity */}
      <div className="bg-slate-50/60 rounded-xl p-5 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group">
        {session && (
          <>
            <div className="relative mb-4 z-10">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-factory-accent shadow-premium-md border border-slate-800 transition-transform group-hover:scale-105">
                <User size={20} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-factory-accent rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <Shield size={8} className="text-white" />
              </div>
            </div>
            <h2 className="text-[11px] font-black tracking-widest text-slate-900 uppercase truncate w-full z-10">{session.displayName}</h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 z-10">Elite Merchant</p>
            
            <Link 
              href="/merchant" 
              className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200/60 text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-premium-sm"
            >
              <Settings size={10} />
              Style Console
            </Link>
          </>
        )}
        <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-white/50 rounded-full blur-2xl z-0" />
      </div>

      {/* 2. Active Session Context */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-premium-sm">
        <div className="flex items-center gap-2 mb-3 px-1 opacity-50">
          <LayoutGrid size={12} className="text-slate-400" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Active Pipeline</span>
        </div>
        
        {style ? (
          <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-3 border border-slate-200/60 group hover:border-factory-accent transition-colors">
            <div className="p-1.5 bg-slate-900 rounded-md shrink-0">
              <Layers size={12} className="text-factory-accent" />
            </div>
            <span className="text-[10px] font-black text-slate-800 tracking-tight truncate uppercase">{style.name}</span>
          </div>
        ) : (
          <Link href="/merchant" className="p-2.5 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center text-center hover:bg-white hover:border-factory-accent transition-all">
            <p className="text-[9px] font-bold text-slate-400 italic">No Selection</p>
          </Link>
        )}
      </div>

      {/* 3. Global Workflow Matrix */}
      <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-premium-sm flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-50">
          <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Workflow Matrix</h3>
          <ClipboardList size={12} className="text-slate-200" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-hide">
          {merchantDepartments.map((department) => {
            const active = department.id === activeStageId;
            return (
              <button
                key={department.id}
                type="button"
                onClick={() => setActiveStageId(department.id)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all duration-200 group ${
                  active
                    ? "bg-slate-900 text-white shadow-premium-md"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <div className={`w-1 h-1 rounded-full transition-all ${active ? 'bg-factory-accent scale-125' : 'bg-slate-200 group-hover:bg-slate-400'}`} />
                  <span>{department.label}</span>
                </span>
                {active && <ChevronRight size={10} className="text-factory-emerald" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Terminal Status */}
      <div className="p-2">
         <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-factory-accent animate-pulse" />
               <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ruroxz Sync</span>
            </div>
            <span className="text-[8px] font-mono text-slate-300">v1.2.4</span>
         </div>
      </div>

    </aside>
  );
}
