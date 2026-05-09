"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Mail, 
  ChevronRight,
  Search,
  Filter
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { api } from "@/lib/api";
import type { FabricReport, ReportStatus } from "@/types";

const statusConfig: Record<ReportStatus, { label: string; icon: any; classes: string }> = {
  PENDING_RETURN: { 
    label: "Pending", 
    icon: Clock, 
    classes: "bg-amber-100 text-amber-700 border-amber-200" 
  },
  NORMAL: { 
    label: "Success", 
    icon: CheckCircle2, 
    classes: "bg-green-100 text-green-700 border-green-200" 
  },
  SHORTAGE_ALERT: { 
    label: "Shortage", 
    icon: AlertCircle, 
    classes: "bg-red-100 text-red-700 border-red-200" 
  }
};

export default function ReportsPage() {
  const [reports, setReports] = useState<FabricReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    api
      .getReports()
      .then(setReports)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSendEmailAlert(inwardEntryId: string) {
    setSendingId(inwardEntryId);
    setAlertMessage(null);
    setError(null);

    try {
      const result = await api.sendEmailAlert(inwardEntryId);
      setAlertMessage(`Email alert sent successfully.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send email alert");
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BackButton />
          <h1 className="mt-4 text-3xl font-black text-factory-ink">Fabric Reports</h1>
          <p className="text-slate-500">Track movement history and shortage alerts across all lots.</p>
        </div>
      </header>

      {error ? (
        <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-factory-red">
          <AlertCircle size={20} />
          <p className="font-bold">{error}</p>
        </div>
      ) : null}

      {alertMessage ? (
        <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-factory-green">
          <CheckCircle2 size={20} />
          <p className="font-bold">{alertMessage}</p>
        </div>
      ) : null}

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-factory-line bg-white p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-factory-green border-t-transparent"></div>
              <p className="font-bold text-slate-500">Loading your reports...</p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-400">
              <FileText size={48} />
            </div>
            <h3 className="mt-6 text-xl font-bold text-factory-ink">No reports found</h3>
            <p className="mt-2 text-slate-500">Start by creating an outward movement to see reports here.</p>
          </div>
        ) : (
          reports.map((report) => {
            const config = statusConfig[report.status];
            const StatusIcon = config.icon;
            
            return (
              <article 
                key={report.outwardEntry.id} 
                className="group relative overflow-hidden rounded-2xl border border-factory-line bg-white transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${config.classes}`}>
                        <StatusIcon size={14} />
                        {config.label}
                      </span>
                      <h2 className="text-xl font-black text-factory-ink">
                        Lot #{report.outwardEntry.lotNumber}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4 md:gap-8">
                      <div>
                        <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Party</p>
                        <p className="mt-1 font-bold text-factory-ink truncate">{report.outwardEntry.partyName}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Fabric</p>
                        <p className="mt-1 font-bold text-factory-ink truncate">{report.outwardEntry.fabricType}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Sent</p>
                        <p className="mt-1 font-bold text-factory-ink">{report.outwardEntry.sentWeight} kg</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Result</p>
                        <p className={`mt-1 font-bold ${report.shortage && report.shortage > 0 ? "text-factory-red" : "text-factory-green"}`}>
                          {report.receivedWeight ? `${report.receivedWeight} kg` : "Pending"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch gap-3 border-t border-factory-line pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    {report.status === "SHORTAGE_ALERT" && report.inwardEntry ? (
                      <button
                        type="button"
                        onClick={() => handleSendEmailAlert(report.inwardEntry?.id ?? "")}
                        disabled={sendingId === report.inwardEntry.id}
                        className="flex items-center justify-center gap-2 rounded-xl bg-factory-red px-6 py-3 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:opacity-60"
                      >
                        {sendingId === report.inwardEntry.id ? "Sending..." : (
                          <>
                            <Mail size={16} />
                            Alert Merchant
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center md:px-4">
                        <ChevronRight className="text-slate-300 transition-transform group-hover:translate-x-1" size={24} />
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
