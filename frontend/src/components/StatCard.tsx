import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "default" | "warning" | "info" | "success";
  icon?: ReactNode;
  trend?: string;
}

export function StatCard({ label, value, tone = "default", icon, trend }: StatCardProps) {
  const getIconStyles = () => {
    switch (tone) {
      case "success": return "bg-emerald-50 text-factory-emerald border-emerald-100/50";
      case "info": return "bg-blue-50 text-factory-blue border-blue-100/50";
      case "warning": return "bg-amber-50 text-factory-amber border-amber-100/50";
      default: return "bg-slate-50 text-slate-400 border-slate-200/50";
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-100 p-5 shadow-premium-sm transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg border shadow-sm transition-transform group-hover:scale-110 ${getIconStyles()}`}>
          {icon}
        </div>
        {trend && (
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-widest text-factory-emerald bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {trend}
            </span>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex items-center gap-1.5 mb-1 opacity-60">
           <div className="w-1 h-1 rounded-full bg-slate-300" />
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
             {label}
           </p>
        </div>
        <p className="text-2xl font-black tracking-tighter text-slate-900 leading-tight">
          {value}
        </p>
      </div>
      
      {/* Subtle bottom accent line */}
      <div className={`mt-4 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-full ${
        tone === 'success' ? 'bg-factory-emerald' : 
        tone === 'info' ? 'bg-factory-blue' : 
        tone === 'warning' ? 'bg-factory-amber' : 'bg-slate-200'
      }`} />
    </div>
  );
}
