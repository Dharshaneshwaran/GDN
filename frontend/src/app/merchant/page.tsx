"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { FormInput, FormTextarea } from "@/components/FormInput";
import { getSelectedStyle, saveSelectedStyle, getStylesList, type SelectedStyle } from "@/lib/auth";
import { PlusCircle, ChevronRight, UploadCloud, File, Search, Loader2, Sparkles, Database, ShieldCheck, Terminal, Cpu } from "lucide-react";

const fetchExistingStyles = async (): Promise<SelectedStyle[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getStylesList());
    }, 600);
  });
};

export default function MerchantPage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyle | null>(() =>
    typeof window !== "undefined" ? getSelectedStyle() : null
  );
  
  const [mode, setMode] = useState<"new" | "existing" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingStyles, setExistingStyles] = useState<SelectedStyle[]>([]);
  const [isLoadingStyles, setIsLoadingStyles] = useState(false);

  useEffect(() => {
    if (mode === "existing") {
      setIsLoadingStyles(true);
      fetchExistingStyles().then((styles) => {
        setExistingStyles(styles);
        setIsLoadingStyles(false);
      });
    }
  }, [mode]);

  function openStyle(style: SelectedStyle | null) {
    if (style) {
      saveSelectedStyle(style);
      setSelectedStyle(style);
    } else {
      saveSelectedStyle(null as any);
      setSelectedStyle(null);
      setMode(null);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
  }

  async function handleCreateStyle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);
    const styleName = String(form.get("styleName") ?? "").trim();
    if (!styleName) {
      setError("TITLE REQUIRED FOR SYSTEM INITIALIZATION");
      setIsSubmitting(false);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    const generatedId = styleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const newStyle = { id: generatedId, name: styleName };
    saveSelectedStyle(newStyle);
    setSelectedStyle(newStyle);
    router.push(`/merchant/analysis/${generatedId}`);
    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-6xl mx-auto pb-12">
      
      {/* Elite Header */}
      <section className="bg-white p-8 rounded-2xl shadow-premium-md border border-slate-100 flex items-center justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <BackButton />
            <div className="h-6 w-px bg-slate-100 mx-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-factory-emerald bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
              {selectedStyle?.name ?? "Style Console"}
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Industrial Assignment</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">Select or register a production style context to initialize the tracking engine.</p>
        </div>
        <div className="hidden lg:flex p-4 bg-slate-50 rounded-xl border border-slate-100">
           <Cpu size={24} className="text-slate-200 group-hover:text-factory-emerald transition-colors" />
        </div>
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl opacity-40 group-hover:bg-emerald-50 transition-colors" />
      </section>

      {/* Main Control Area */}
      <section className="bg-white p-6 md:p-10 rounded-2xl shadow-premium-md border border-slate-100">
        {selectedStyle ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 relative">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl shadow-premium-xl flex items-center justify-center mb-8 border border-slate-800 relative group">
              <ShieldCheck size={32} className="text-factory-accent group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-factory-accent rounded-full border-2 border-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-none italic">
              Context <span className="text-factory-emerald">Active</span>
            </h2>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest max-w-sm mb-12">
               Engine synchronized with style record: <br/> 
               <span className="text-slate-900 mt-2 block bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">{selectedStyle.name}</span>
            </p>
            <button
              onClick={() => openStyle(null)}
              className="flex items-center gap-3 px-10 py-5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-300 shadow-premium-sm"
            >
              Reset Session Control
            </button>
          </div>
        ) : (
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
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Initialize Record</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Upload Techpack Specs</p>
                {mode === "new" && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-factory-accent animate-ping" />}
              </button>

              <button
                type="button"
                onClick={() => setMode("existing")}
                className={`group relative overflow-hidden rounded-2xl p-12 text-left transition-all duration-500 ${
                  mode === "existing" ? "bg-slate-900 text-white shadow-premium-xl" : "bg-slate-50 border border-slate-200 hover:border-slate-900 hover:bg-white"
                }`}
              >
                <Database size={40} className={`mb-6 ${mode === "existing" ? "text-factory-accent" : "text-slate-300 group-hover:text-slate-900"} transition-all`} />
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Access Database</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Restore Historic Data</p>
                {mode === "existing" && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-factory-accent animate-ping" />}
              </button>
            </div>

            {mode === "existing" && (
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-200/50">
                  <div className="p-3 bg-white rounded-xl shadow-premium-sm border border-slate-100">
                    <Search size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Select Style Record</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Browsing centralized system storage</p>
                  </div>
                </div>
                {isLoadingStyles ? (
                  <div className="flex flex-col items-center py-16">
                     <Loader2 className="animate-spin text-factory-emerald mb-4 w-8 h-8" />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Records...</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {existingStyles.map((style) => (
                      <button 
                        key={style.id} 
                        onClick={() => openStyle(style)} 
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 hover:border-factory-emerald hover:shadow-premium-lg hover:-translate-y-0.5 transition-all text-left group"
                      >
                        <div>
                           <span className="block text-lg font-black text-slate-800 group-hover:text-factory-emerald transition-colors uppercase tracking-tight">{style.name}</span>
                           <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-1 block">ID: {style.id}</span>
                        </div>
                        <ChevronRight size={18} className="text-slate-200 group-hover:text-factory-emerald transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {mode === "new" && (
              <form onSubmit={handleCreateStyle} className="rounded-2xl bg-slate-50 border border-slate-100 p-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-4 pb-8 border-b border-slate-200/50">
                   <div className="p-3 bg-slate-900 rounded-xl text-factory-accent">
                      <Terminal size={20} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest">Initialization Terminal</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Registering new industrial production context</p>
                   </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <FormInput label="Style Identifier / Title" name="styleName" placeholder="E.G. GLOBAL_SUMMER_26" required />
                    <FormTextarea label="Production Scope / Notes" name="description" placeholder="Specify technical requirements or constraints..." />
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block ml-1">Specification Source (PDF/DOC)</span>
                    <label className="flex flex-col items-center justify-center w-full h-[14rem] px-8 bg-white border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer hover:border-factory-emerald hover:bg-emerald-50/10 group transition-all">
                        <div className="p-5 rounded-full bg-slate-50 group-hover:bg-emerald-100/50 transition-colors mb-4 border border-slate-100">
                           <UploadCloud size={32} className="text-slate-300 group-hover:text-factory-emerald transition-colors" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 text-center leading-relaxed">
                           {fileName ? fileName : "Transmit Specification File"}
                        </span>
                        <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-2">Maximum payload: 25MB</p>
                        <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
                
                <div className="pt-4">
                   <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-3 rounded-xl bg-slate-900 hover:bg-factory-emerald px-8 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all shadow-premium-xl active:scale-[0.98] disabled:opacity-50">
                     {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-factory-accent" />}
                     {isSubmitting ? "PROCESSING PAYLOAD..." : "Initialize Analysis Engine"}
                   </button>
                </div>
              </form>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
