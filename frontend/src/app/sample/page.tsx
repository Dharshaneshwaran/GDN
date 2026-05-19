"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSelectedStyle, getSession, addNotification, getNotifications, markNotificationAsRead, saveSelectedStyle, getExistingSamples, type SelectedStyle, type AppNotification } from "@/lib/auth";
import { BackButton } from "@/components/BackButton";
import { 
  PlusCircle, 
  History, 
  ChevronRight, 
  Sparkles, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Bell, 
  Search, 
  CheckCircle2, 
  Clock, 
  LayoutGrid, 
  Send, 
  Loader2, 
  Database, 
  ExternalLink, 
  MessageSquare,
  Terminal,
  Fingerprint
} from "lucide-react";

export default function SamplePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyle | null>(null);
  const [session, setSession] = useState<any>(null);
  const [mode, setMode] = useState<"new" | "existing" | null>(null);
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>([]);
  const [existingSamples, setExistingSamples] = useState<SelectedStyle[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateState = () => {
      setSelectedStyle(getSelectedStyle());
      setSession(getSession());
      setAppNotifications(getNotifications().filter(n => n.type === "style_transfer" && !n.read));
      setExistingSamples(getExistingSamples());
      setIsLoading(false);
    };
    updateState();
    window.addEventListener("notifications-changed", updateState);
    window.addEventListener("style-changed", updateState);
    return () => {
      window.removeEventListener("notifications-changed", updateState);
      window.removeEventListener("style-changed", updateState);
    };
  }, []);

  function handleApproveAndProceed(notification: AppNotification) {
    markNotificationAsRead(notification.id);
    const styleToProcess = {
      id: notification.payload.styleId,
      name: notification.payload.styleName,
      description: notification.message.split("Scope: ")[1] || ""
    };
    saveSelectedStyle(styleToProcess);
    router.push("/sample/new");
  }

  function openArchive(sample: SelectedStyle) {
    saveSelectedStyle(sample);
    router.push("/sample/existing");
  }

  function resetSession() {
    saveSelectedStyle(null as any);
    setSelectedStyle(null);
    setMode(null);
  }

  async function handleSendToDevelopment() {
    if (!selectedStyle) return;
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    addNotification({
      title: `Style Assignment: ${selectedStyle.name}`,
      message: `Merchant ${session?.displayName || "System"} has transmitted style ${selectedStyle.name} for prototyping. Scope: ${selectedStyle.description || "No specific notes provided."}`,
      type: "style_transfer",
      payload: { styleId: selectedStyle.id, styleName: selectedStyle.name }
    });
    setIsSending(false);
    setSentStatus(true);
    setTimeout(() => setSentStatus(false), 3000);
  }

  const isMerchant = session?.role === "MERCHANT";
  const isSampleDev = session?.role === "SAMPLE_DEPARTMENT";

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto pb-12">
      
      {/* 1. Elite Industrial Header */}
      <section className="bg-white p-8 rounded-2xl shadow-premium-md border border-slate-100 flex items-center justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <BackButton />
            <div className="h-6 w-px bg-slate-100 mx-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-factory-emerald bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
              {selectedStyle?.name ?? (isSampleDev ? "Assignment Hub" : "Development Engine")}
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{isSampleDev ? "Sample Development" : "Prototyping Terminal"}</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            {isSampleDev ? "Industrial assignment approval and technical calibration terminal." : "Industrial specification calibration and technical prototype validation."}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {isMerchant && selectedStyle && (
             <button
               onClick={handleSendToDevelopment}
               disabled={isSending || sentStatus}
               className={`flex items-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                 sentStatus 
                   ? "bg-factory-green text-white" 
                   : "bg-slate-900 text-white hover:bg-factory-accent"
               } shadow-premium-xl disabled:opacity-70`}
             >
               {isSending ? <Loader2 size={16} className="animate-spin" /> : sentStatus ? <CheckCircle2 size={16} /> : <Send size={16} />}
               {isSending ? "Transmitting..." : sentStatus ? "Transmitted" : "Send to Development"}
             </button>
           )}
           <div className="hidden lg:flex p-4 bg-slate-50 rounded-xl border border-slate-100">
             <Cpu size={24} className="text-slate-200 group-hover:text-factory-emerald transition-colors" />
           </div>
        </div>
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-40 group-hover:bg-emerald-50 transition-colors" />
      </section>

      {/* 2. Main Control Area (Matched to Merchant Page) */}
      <section className="bg-white p-6 md:p-10 rounded-2xl shadow-premium-md border border-slate-100 min-h-[500px]">
        {/* Assignments Area for Sample Dev - Always show if there are pending ones */}
        {isSampleDev && (
          <div className="mb-12 rounded-2xl bg-slate-50 border border-slate-100 p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200/50">
              <div className="p-3 bg-slate-900 rounded-xl text-factory-accent">
                <Terminal size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Incoming Assignments</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Pending Merchant Handover Logs</p>
              </div>
            </div>

            {appNotifications.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-center opacity-30">
                <Fingerprint size={48} className="text-slate-300 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Active Assignments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appNotifications.map((notif) => (
                  <div key={notif.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-900 transition-all shadow-premium-sm group">
                     <div className="space-y-2 max-w-xl">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-factory-accent animate-pulse" />
                           <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{notif.title}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">{notif.message}</p>
                     </div>
                     <button 
                        onClick={() => handleApproveAndProceed(notif)}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-factory-emerald transition-all shadow-premium-lg shrink-0"
                     >
                        Approve & Proceed <ChevronRight size={14} />
                     </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedStyle && !mode && !isSampleDev ? (
          /* Context Active State for Merchants */
          <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 relative">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl shadow-premium-xl flex items-center justify-center mb-8 border border-slate-800 relative group">
              <ShieldCheck size={32} className="text-factory-accent group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-factory-accent rounded-full border-2 border-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-none italic">
              Record <span className="text-factory-emerald">Active</span>
            </h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest max-w-sm mb-12">
               Synchronized with prototyping context: <br/> 
               <span className="text-slate-900 mt-2 block bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">{selectedStyle.name}</span>
            </p>
            <div className="flex gap-4">
               <button
                 onClick={() => router.push(selectedStyle.productionType === "sample" ? "/sample/existing" : "/sample/new")}
                 className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-factory-emerald transition-all duration-300 shadow-premium-lg"
               >
                 View Calibration Matrix
               </button>
               <button
                 onClick={resetSession}
                 className="flex items-center gap-3 px-10 py-5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-300 shadow-premium-sm"
               >
                 Reset Session
               </button>
            </div>
          </div>
        ) : (
          /* Selection Mode (Shared style) */
          <div className="space-y-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${mode ? 'opacity-30 grayscale' : ''} transition-all duration-700`}>
              <button
                type="button"
                onClick={() => setMode("new")}
                className={`group relative overflow-hidden rounded-2xl p-12 text-left transition-all duration-500 ${
                  mode === "new" ? "bg-slate-900 text-white shadow-premium-xl" : "bg-slate-50 border border-slate-200 hover:border-slate-900 hover:bg-white"
                }`}
              >
                <PlusCircle size={40} className={`mb-6 ${mode === "new" ? "text-factory-accent" : "text-slate-300 group-hover:text-slate-900"} transition-all`} />
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Technical Entry</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Initialize Prototyping</p>
              </button>

              <button
                type="button"
                onClick={() => setMode("existing")}
                className={`group relative overflow-hidden rounded-2xl p-12 text-left transition-all duration-500 ${
                  mode === "existing" ? "bg-slate-900 text-white shadow-premium-xl" : "bg-slate-50 border border-slate-200 hover:border-slate-900 hover:bg-white"
                }`}
              >
                <Database size={40} className={`mb-6 ${mode === "existing" ? "text-factory-accent" : "text-slate-300 group-hover:text-slate-900"} transition-all`} />
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Sample Database</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Archived Specifications</p>
              </button>
            </div>

            {/* Mode: Existing (Database List) */}
            {mode === "existing" && (
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200/50">
                  <div className="p-3 bg-white rounded-xl shadow-premium-sm border border-slate-100">
                    <Search size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">{isSampleDev ? "Master Archive" : "Style Database"}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Browsing validated prototype records</p>
                  </div>
                </div>
                
                {existingSamples.length === 0 ? (
                  <div className="py-20 flex flex-col items-center text-center opacity-30">
                     <LayoutGrid size={48} className="text-slate-300 mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">System Archive Empty</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {existingSamples.map((sample) => (
                      <button 
                        key={sample.id} 
                        onClick={() => openArchive(sample)} 
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 hover:border-factory-emerald hover:shadow-premium-lg hover:-translate-y-0.5 transition-all text-left group"
                      >
                        <div>
                           <span className="block text-lg font-black text-slate-800 group-hover:text-factory-emerald transition-colors uppercase tracking-tight">{sample.name}</span>
                           <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-1 block">ID: {sample.id.substring(0, 12)}</span>
                        </div>
                        <ChevronRight size={18} className="text-slate-200 group-hover:text-factory-emerald transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mode: New (No notifications state) */}
            {mode === "new" && appNotifications.length === 0 && (
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200/50">
                  <div className="p-3 bg-slate-900 rounded-xl text-factory-accent">
                    <Terminal size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Technical Assignment</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Waiting for industrial handovers</p>
                  </div>
                </div>
                <div className="py-20 flex flex-col items-center text-center opacity-30">
                  <Fingerprint size={48} className="text-slate-300 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No Incoming Assignments</p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Industrial Protocol Bento */}
      <section className="bg-slate-900 rounded-[2.5rem] p-10 border border-slate-800 shadow-premium-xl overflow-hidden relative group">
         <div className="relative z-10 grid md:grid-cols-3 gap-10">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-factory-accent" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Quality Protocols</span>
               </div>
               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-relaxed italic">
                  All samples must undergo full spectral analysis and dimensional validation before bulk transition.
               </p>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-6">
               {[
                 { l: "Lab Dips", v: "12/12", i: CheckCircle2 },
                 { l: "Strike Offs", v: "04/05", i: Clock, a: true },
                 { l: "Wash Tests", v: "Stable", i: CheckCircle2 },
                 { l: "Fit Approval", v: "Pending", i: Search }
               ].map((stat, idx) => (
                 <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between group/stat hover:bg-white/10 transition-all">
                    <stat.i size={16} className={stat.a ? "text-factory-accent animate-pulse" : "text-white/20 group-hover/stat:text-factory-accent transition-colors"} />
                    <div className="mt-4">
                       <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{stat.l}</p>
                       <p className="text-xs font-mono text-white tracking-tighter">{stat.v}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
      </section>
    </div>
  );
}
