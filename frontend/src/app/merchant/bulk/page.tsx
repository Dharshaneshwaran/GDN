"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSelectedStyle, getSession, type SelectedStyle } from "@/lib/auth";
import { BackButton } from "@/components/BackButton";
import { 
  PlusCircle, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  Clock, 
  Send, 
  Cpu, 
  ShieldCheck, 
  Terminal,
  Activity,
  Layers,
  Scissors,
  Palette,
  Wind,
  Zap,
  LayoutGrid,
  FileText,
  AlertCircle,
  MoreVertical,
  X,
  User,
  Hash,
  MessageSquare,
  Sparkles,
  Cloud,
  Box
} from "lucide-react";

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: any;
  styleName: string;
}

function AssignmentModal({ isOpen, onClose, department, styleName }: AssignmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-premium-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className={`p-8 border-b-8 ${department.color} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <department.icon size={24} className="text-current" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{department.title}</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">New Technical Assignment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form className="p-10 space-y-8" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Context Style</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="text" readOnly value={styleName} className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-900 text-sm font-bold uppercase outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assign Operator/Unit</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="text" placeholder="e.g. Unit 4, Floor 2" className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Batch Quantity</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input type="number" placeholder="e.g. 1200" className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-sm font-medium" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority Protocol</label>
              <select className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[10px] font-black uppercase tracking-widest text-slate-500">
                <option>Standard Industrial</option>
                <option className="text-red-500">Critical / Rush</option>
                <option className="text-blue-500">Baseline / Buffer</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Technical Instructions & Parameters</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-6 text-slate-300" size={18} />
              <textarea placeholder="Specify critical technical parameters for this department stage..." rows={4} className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-sm font-medium resize-none" />
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button type="submit" className="flex-1 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-factory-accent transition-all shadow-premium-xl">
              Authorize Assignment
            </button>
            <button type="button" onClick={onClose} className="px-8 border border-slate-100 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
              Abort
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BulkProductionDashboard() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyle | null>(null);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDeptModal, setActiveDeptModal] = useState<any>(null);

  useEffect(() => {
    setSelectedStyle(getSelectedStyle());
    setSession(getSession());
  }, []);

  const departments = [
    { id: 'yarn', title: 'Yarn Department', color: 'bg-yellow-50 border-yellow-200 text-yellow-700', icon: Wind },
    { id: 'knitting', title: 'Knitting Unit', color: 'bg-blue-50 border-blue-200 text-blue-700', icon: Activity },
    { id: 'dyeing', title: 'Dyeing & Processing', color: 'bg-purple-50 border-purple-200 text-purple-700', icon: Palette },
    { id: 'washing', title: 'Industrial Washing', color: 'bg-cyan-50 border-cyan-200 text-cyan-700', icon: Zap },
    { id: 'cutting', title: 'Precision Cutting', color: 'bg-orange-50 border-orange-200 text-orange-700', icon: Scissors },
    { id: 'stitching', title: 'Stitching Floor', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: Layers },
    { id: 'printing', title: 'Graphic Printing', color: 'bg-rose-50 border-rose-200 text-rose-700', icon: LayoutGrid },
    { id: 'embroidery', title: 'Special Embroidery', color: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700', icon: Sparkles },
    { id: 'ironing', title: 'Steam Ironing', color: 'bg-indigo-50 border-indigo-200 text-indigo-700', icon: Cloud },
    { id: 'packing', title: 'Final Packing', color: 'bg-amber-50 border-amber-200 text-amber-700', icon: Box },
  ];

  const stats = [
    { title: 'Active Batches', value: '24' },
    { title: 'In Production', value: '18' },
    { title: 'Quality Review', value: '4' },
    { title: 'Ready for Export', value: '2' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 text-slate-900 animate-in fade-in duration-700 pb-20">
      
      {/* Assignment Modal */}
      <AssignmentModal 
        isOpen={!!activeDeptModal} 
        onClose={() => setActiveDeptModal(null)} 
        department={activeDeptModal || departments[0]} 
        styleName={selectedStyle?.name || "Industrial Core Polo"}
      />

      {/* Elite Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <BackButton />
            <div className="h-6 w-px bg-slate-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-factory-emerald bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
              Bulk Production Ledger
            </span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            Workflow Management
          </h1>
          <p className="text-slate-400 font-medium mt-1">
            Professional industrial department task routing and synchronization system.
          </p>
        </div>

        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-premium-xl hover:bg-factory-accent transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
          <PlusCircle size={18} />
          Initialize New Batch
        </button>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-[2rem] p-8 shadow-premium-sm border border-slate-100 relative overflow-hidden group hover:border-slate-900 transition-all duration-500"
          >
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest relative z-10">{item.title}</p>
            <h2 className="text-4xl font-black mt-2 text-slate-900 relative z-10">{item.value}</h2>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShieldCheck size={80} className="text-slate-900" />
            </div>
          </div>
        ))}
      </div>

      {/* Logic Controller Bar */}
      <div className="bg-white rounded-[2.5rem] shadow-premium-md border border-slate-100 p-6 mb-12">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex gap-4 flex-wrap flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search active batches or styles..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select className="px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[10px] font-black uppercase tracking-widest text-slate-500">
              <option>All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.title}</option>
              ))}
            </select>
          </div>

          <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-widest text-slate-600">
            <FileText size={16} />
            Export Logistics Report
          </button>
        </div>
      </div>

      {/* Department Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {departments.map((dept, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[2.5rem] shadow-premium-lg border border-slate-100 p-6 flex flex-col min-h-[500px]"
          >
            <div 
              onClick={() => setActiveDeptModal(dept)}
              className={`rounded-2xl border-b-4 px-6 py-5 mb-8 flex items-center justify-between cursor-pointer hover:brightness-95 transition-all ${dept.color}`}
            >
              <div className="flex items-center gap-3">
                 <dept.icon size={20} />
                 <h2 className="font-black text-[11px] uppercase tracking-[0.2em]">{dept.title}</h2>
              </div>
              <button className="text-slate-400 hover:text-slate-900 transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 hover:border-slate-900 transition-all shadow-premium-sm group relative">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1 rounded-full border border-slate-200 italic">No Active Job</span>
                      </div>
                      <h3 className="font-black text-lg text-slate-300 uppercase tracking-tighter leading-tight">
                        Awaiting Assignment
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mb-8">
                    <button 
                      onClick={() => setActiveDeptModal(dept)}
                      className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-factory-accent transition-all shadow-premium-lg flex items-center justify-center gap-3"
                    >
                      <PlusCircle size={14} />
                      Assign {dept.id} Stage
                    </button>
                  </div>

                  <div className="border-t border-dashed border-slate-200 pt-6 opacity-30">
                    <div className="flex items-center gap-2 mb-4">
                        <Terminal size={12} className="text-slate-300" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Execution Log</p>
                    </div>
                    <div className="space-y-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                      <p>Waiting for technical parameters...</p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
