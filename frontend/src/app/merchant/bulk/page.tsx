"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSelectedStyle, getSession, type SelectedStyle, getWorkflows, type ProductionWorkflow, clearWorkflows } from "@/lib/auth";
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
  Box,
  History,
  Calendar,
  Trash2
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
  const [workflows, setWorkflows] = useState<ProductionWorkflow[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<ProductionWorkflow | null>(null);
  const [viewingWorkflow, setViewingWorkflow] = useState<ProductionWorkflow | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setSelectedStyle(getSelectedStyle());
    setSession(getSession());
    const savedWorkflows = getWorkflows();
    setWorkflows(savedWorkflows);
    if (savedWorkflows.length > 0) {
      setActiveWorkflow(savedWorkflows[0]);
    }
  }, []);

  const handleClearHistory = () => {
    clearWorkflows();
    setWorkflows([]);
    setActiveWorkflow(null);
    setShowClearConfirm(false);
  };

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

  const getStepIcon = (stepId: string) => {
    const dept = departments.find(d => d.id === stepId);
    if (dept) return dept.icon;
    if (stepId === 'final_check') return ShieldCheck;
    return Activity;
  };

  const getStepTitle = (stepId: string) => {
    if (stepId === 'final_check') return "Final Check";
    return departments.find(d => d.id === stepId)?.title || stepId;
  };

  const stats = [
    { title: 'Active Batches', value: '24' },
    { title: 'In Production', value: '18' },
    { title: 'Quality Review', value: '4' },
    { title: 'Ready for Export', value: '2' },
  ];

  // Filter or sort departments based on active workflow
  const activeSteps = activeWorkflow ? activeWorkflow.steps : [];
  
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 text-slate-900 animate-in fade-in duration-700 pb-20">
      
      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowClearConfirm(false)} />
           <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-premium-xl border border-slate-100 p-10 animate-in zoom-in-95 duration-300">
              <div className="h-16 w-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                 <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Purge History?</h2>
              <p className="text-slate-400 text-sm font-medium mb-8">
                This will permanently delete all saved production protocols and reset the active workflow. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                 <button 
                  onClick={handleClearHistory}
                  className="flex-1 bg-red-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-premium-md"
                 >
                   Confirm Purge
                 </button>
                 <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 bg-slate-50 text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                 >
                   Abort
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Assignment Modal */}
      <AssignmentModal 
        isOpen={!!activeDeptModal} 
        onClose={() => setActiveDeptModal(null)} 
        department={activeDeptModal || departments[0]} 
        styleName={selectedStyle?.name || activeWorkflow?.styleName || "Industrial Core Polo"}
      />

      {/* Workflow Detail Side-Drawer */}
      {viewingWorkflow && (
        <div className="fixed inset-0 z-[110] flex items-center justify-end p-4 md:p-6">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-500" onClick={() => setViewingWorkflow(null)} />
           <div className="relative w-full max-w-md h-full bg-white rounded-[2.5rem] shadow-premium-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-right duration-500 flex flex-col">
             {/* Header */}
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 leading-none">{viewingWorkflow.styleName}</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Protocol Specification</p>
                </div>
                <button onClick={() => setViewingWorkflow(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                  <X size={20} />
                </button>
             </div>
             
             {/* Content */}
             <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-none">
                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                   <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                      <Calendar size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1.5">System Transmission Date</p>
                      <span className="text-sm font-bold text-slate-900">{new Date(viewingWorkflow.timestamp).toLocaleString()}</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between px-2">
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Industrial Routing</h3>
                     <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{viewingWorkflow.steps.length} Nodes</span>
                   </div>
                   <div className="space-y-3">
                     {viewingWorkflow.steps.map((stepId, index) => {
                       const Icon = getStepIcon(stepId);
                       const title = getStepTitle(stepId);
                       return (
                         <div key={index} className="group flex items-center gap-5 p-5 hover:bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all duration-300">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-[11px] font-black shadow-premium-lg group-hover:scale-110 transition-transform">{index + 1}</div>
                            <div className="flex-1">
                               <p className="text-[12px] font-black uppercase tracking-widest text-slate-900">{title}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Department Node</p>
                            </div>
                            <div className="p-3 bg-slate-50 group-hover:bg-white rounded-xl transition-colors">
                               <Icon size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                            </div>
                         </div>
                       );
                     })}
                   </div>
                </div>
             </div>

             {/* Footer Action */}
             <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                <button 
                  onClick={() => { setActiveWorkflow(viewingWorkflow); setViewingWorkflow(null); }}
                  className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-factory-accent transition-all shadow-premium-xl flex items-center justify-center gap-4 group"
                >
                  <ShieldCheck size={20} className="group-hover:rotate-12 transition-transform" />
                  Apply Protocol
                </button>
             </div>
           </div>
        </div>
      )}

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

      {/* Workflow Controls Section */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Workflow Assignment Entry */}
        <button 
          onClick={() => router.push("/merchant/bulk/workflow")}
          className="bg-white rounded-[2.5rem] p-10 shadow-premium-md border border-slate-100 flex items-center justify-between group hover:border-slate-900 hover:shadow-premium-xl transition-all duration-500"
        >
          <div className="flex items-center gap-8">
            <div className="h-20 w-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-factory-accent transition-all duration-500 shadow-inner">
              <Activity size={40} />
            </div>
            <div className="text-left">
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Assign Production Workflow</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Initialize industrial sequence routing</p>
            </div>
          </div>
          <div className="h-14 w-14 rounded-2xl border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
            <ChevronRight size={24} />
          </div>
        </button>

        {/* Workflow History Tab */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-premium-md border border-slate-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 text-white rounded-xl">
                <History size={18} />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Workflow History</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                {workflows.length} Protocols
              </span>
              {workflows.length > 0 && (
                <button 
                  onClick={() => setShowClearConfirm(true)}
                  className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  title="Clear All History"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[140px] scrollbar-thin scrollbar-thumb-slate-200">
            {workflows.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No established workflows</p>
              </div>
            ) : (
              workflows.map((wf) => (
                <div 
                  key={wf.id} 
                  onClick={() => setViewingWorkflow(wf)}
                  className={`p-4 rounded-2xl border transition-all group cursor-pointer ${
                    activeWorkflow?.id === wf.id ? 'bg-slate-900 border-slate-900 ring-2 ring-slate-900 ring-offset-2' : 'bg-slate-50 border-slate-100 hover:border-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className={`${activeWorkflow?.id === wf.id ? 'text-slate-400' : 'text-slate-400'}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${activeWorkflow?.id === wf.id ? 'text-slate-400' : 'text-slate-400'}`}>
                        {new Date(wf.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${activeWorkflow?.id === wf.id ? 'text-white' : 'text-slate-900'}`}>{wf.styleName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {wf.steps.map((stepId, idx) => {
                      const Icon = getStepIcon(stepId);
                      return (
                        <div key={idx} className="flex items-center gap-1.5 shrink-0">
                          <div className={`p-1.5 rounded-lg border shadow-sm ${activeWorkflow?.id === wf.id ? 'bg-white/10 border-white/20' : 'bg-white border-slate-100'}`}>
                            <Icon size={12} className={`${activeWorkflow?.id === wf.id ? 'text-white' : 'text-slate-600'}`} />
                          </div>
                          {idx < wf.steps.length - 1 && <ChevronRight size={10} className={`${activeWorkflow?.id === wf.id ? 'text-white/30' : 'text-slate-300'}`} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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

          <div className="flex items-center gap-4">
            {activeWorkflow && (
              <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                 <ShieldCheck size={16} className="text-factory-accent" />
                 Active: {activeWorkflow.styleName}
              </div>
            )}
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all text-[10px] font-black uppercase tracking-widest text-slate-600">
              <FileText size={16} />
              Export Logistics Report
            </button>
          </div>
        </div>
      </div>

      {/* Department Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {departments.map((dept, idx) => {
          const isActiveInWorkflow = activeSteps.includes(dept.id);
          const stepIndex = activeSteps.indexOf(dept.id);
          
          return (
            <div
              key={idx}
              className={`bg-white rounded-[2.5rem] shadow-premium-lg border p-6 flex flex-col min-h-[500px] transition-all duration-500 ${
                isActiveInWorkflow ? 'border-slate-900 scale-[1.02]' : 'border-slate-100 opacity-50'
              }`}
            >
              <div 
                onClick={() => setActiveDeptModal(dept)}
                className={`rounded-2xl border-b-4 px-6 py-5 mb-8 flex items-center justify-between cursor-pointer hover:brightness-95 transition-all ${
                  isActiveInWorkflow ? dept.color : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                   <dept.icon size={20} />
                   <div className="flex flex-col">
                     <h2 className="font-black text-[11px] uppercase tracking-[0.2em]">{dept.title}</h2>
                     {isActiveInWorkflow && (
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Sequence Step {stepIndex + 1}</span>
                     )}
                   </div>
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
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border italic ${
                              isActiveInWorkflow ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}>
                              {isActiveInWorkflow ? 'Protocol Active' : 'Offline'}
                            </span>
                        </div>
                        <h3 className={`font-black text-lg uppercase tracking-tighter leading-tight ${
                          isActiveInWorkflow ? 'text-slate-900' : 'text-slate-300'
                        }`}>
                          {isActiveInWorkflow ? 'Pending Execution' : 'Awaiting Assignment'}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-8">
                      <button 
                        disabled={!isActiveInWorkflow}
                        onClick={() => setActiveDeptModal(dept)}
                        className={`text-[9px] font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-premium-lg flex items-center justify-center gap-3 ${
                          isActiveInWorkflow 
                          ? 'bg-slate-900 text-white hover:bg-factory-accent' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
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
                        <p>{isActiveInWorkflow ? 'Waiting for industrial synchronization...' : 'Department not in current workflow.'}</p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
