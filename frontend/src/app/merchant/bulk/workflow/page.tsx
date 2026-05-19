"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSelectedStyle, getSession, saveWorkflow } from "@/lib/auth";
import { BackButton } from "@/components/BackButton";
import { 
  Wind, 
  Activity, 
  Palette, 
  Zap, 
  Scissors, 
  Layers, 
  LayoutGrid, 
  Sparkles, 
  Cloud, 
  Box, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
  ArrowRight,
  GripVertical,
  X
} from "lucide-react";

const WORKFLOW_STEPS = [
  { id: 'yarn', title: 'Yarn', icon: Wind, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'knitting', title: 'Knitting', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'dyeing', title: 'Dyeing', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'washing', title: 'Washing', icon: Zap, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'cutting', title: 'Cutting', icon: Scissors, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'stitching', title: 'Stitching', icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'printing', title: 'Printing', icon: LayoutGrid, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'embroidery', title: 'Embroidery', icon: Sparkles, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
  { id: 'ironing', title: 'Ironing', icon: Cloud, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'packing', title: 'Packing', icon: Box, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'final_check', title: 'Final Check', icon: ShieldCheck, color: 'text-slate-900', bg: 'bg-slate-100' },
];

export default function WorkflowAssignmentPage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<any>(null);
  const [styleName, setStyleName] = useState("");
  const [workflow, setWorkflow] = useState<string[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    const style = getSelectedStyle();
    setSelectedStyle(style);
    if (style?.name) {
      setStyleName(style.name);
    }
  }, []);

  const toggleStep = (id: string) => {
    if (workflow.includes(id)) {
      setWorkflow(workflow.filter(stepId => stepId !== id));
    } else {
      setWorkflow([...workflow, id]);
    }
  };

  const removeStep = (index: number) => {
    const newWorkflow = [...workflow];
    newWorkflow.splice(index, 1);
    setWorkflow(newWorkflow);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newWorkflow = [...workflow];
    const itemToMove = newWorkflow[draggedItemIndex];
    newWorkflow.splice(draggedItemIndex, 1);
    newWorkflow.splice(index, 0, itemToMove);
    
    setDraggedItemIndex(index);
    setWorkflow(newWorkflow);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const handleAssign = () => {
    if (workflow.length > 0 && styleName.trim()) {
      saveWorkflow({
        styleId: selectedStyle?.id || `manual-${Date.now()}`,
        styleName: styleName.trim(),
        steps: workflow
      });
      router.push("/merchant/bulk");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 text-slate-900 animate-in fade-in duration-700 pb-20">
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-4">
          <BackButton />
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-factory-emerald bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 shadow-sm">
            Workflow Configuration
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1 max-w-2xl">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">Project / Style Identification</label>
            <input 
              type="text" 
              placeholder="Enter Style Name (e.g. Industrial Core Polo v2)"
              className="w-full bg-transparent text-4xl font-black text-slate-900 tracking-tighter uppercase italic outline-none border-b-2 border-slate-200 focus:border-slate-900 transition-colors pb-2"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
            />
            <p className="text-slate-400 font-medium mt-3">
              Define the industrial sequence protocol for this production context.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">
        {/* Step Selection Grid */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-premium-md border border-slate-100">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              <Plus size={20} className="text-slate-400" />
              Available Production Steps
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {WORKFLOW_STEPS.map((step) => {
                const isSelected = workflow.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center gap-4 text-center ${
                      isSelected 
                      ? 'border-slate-900 bg-slate-900 shadow-premium-lg' 
                      : 'border-slate-100 bg-slate-50 hover:border-slate-300 hover:shadow-premium-sm'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl transition-all duration-300 ${
                      isSelected ? 'bg-white/10 text-white' : `${step.bg} ${step.color}`
                    }`}>
                      <step.icon size={24} />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                      isSelected ? 'text-white' : 'text-slate-600'
                    }`}>
                      {step.title}
                    </span>
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-factory-accent">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-premium-xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Automated Synchronization</h3>
               <p className="text-slate-400 text-xs font-medium max-w-md">
                 Assigning this workflow will automatically initialize task queues across all selected department nodes with real-time tracking enabled.
               </p>
             </div>
             <div className="absolute top-0 right-0 p-10 opacity-10">
                <Activity size={120} />
             </div>
          </div>
        </div>

        {/* Selected Workflow / Preview */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-premium-lg border border-slate-100 sticky top-8">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
              <ArrowRight size={20} className="text-slate-400" />
              Workflow Sequence
            </h2>

            {workflow.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-300 mb-6">
                  <Activity size={32} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-relaxed">
                  Select steps from the grid to build your production sequence.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-10">
                {workflow.map((stepId, index) => {
                  const step = WORKFLOW_STEPS.find(s => s.id === stepId)!;
                  return (
                    <div 
                      key={`${stepId}-${index}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border transition-all duration-300 cursor-grab active:cursor-grabbing ${
                        draggedItemIndex === index ? 'opacity-40 border-slate-900 scale-95' : 'border-slate-100 hover:border-slate-900 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-slate-300 group-hover:text-slate-900 transition-colors">
                          <GripVertical size={16} />
                        </div>
                        <div className="text-[10px] font-black text-slate-300 w-4">
                          {index + 1}
                        </div>
                        <div className={`p-2 rounded-lg ${step.bg} ${step.color}`}>
                          <step.icon size={16} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                          {step.title}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeStep(index)}
                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              disabled={workflow.length === 0}
              onClick={handleAssign}
              className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                workflow.length > 0 
                ? 'bg-slate-900 text-white shadow-premium-xl hover:bg-factory-accent' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirm Workflow
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
