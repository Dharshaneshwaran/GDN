"use client";

import { useEffect, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { api } from "@/lib/api";
import type { FabricReport, ReportStatus } from "@/types";

const statusClass: Record<ReportStatus, string> = {
  PENDING_RETURN: "bg-amber-50 text-factory-amber",
  NORMAL: "bg-green-50 text-factory-green",
  SHORTAGE_ALERT: "bg-red-50 text-factory-red"
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
      setAlertMessage(`Email alert sent. Message ID: ${result.messageId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send email alert");
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <BackButton />
      <h1 className="text-3xl font-bold text-factory-ink">Reports</h1>
      {error ? <p className="rounded-md bg-red-50 p-3 text-factory-red">{error}</p> : null}
      {alertMessage ? (
        <p className="rounded-md bg-green-50 p-3 font-semibold text-factory-green">
          {alertMessage}
        </p>
      ) : null}
      {loading ? <p className="rounded-md bg-white p-4">Loading reports...</p> : null}
      <div className="grid gap-3">
        {reports.map((report) => (
          <article key={report.outwardEntry.id} className="rounded-md border border-factory-line bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-factory-ink">Lot {report.outwardEntry.lotNumber}</h2>
                <p className="text-sm text-slate-600">
                  {report.outwardEntry.partyName} | {report.outwardEntry.processType}
                </p>
              </div>
              <span className={`rounded-md px-3 py-2 text-sm font-bold ${statusClass[report.status]}`}>
                {report.status}
              </span>
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
              <p>Sent weight: {report.outwardEntry.sentWeight} kg</p>
              <p>Expected: {report.expectedReceivedWeight ?? "-"} kg</p>
              <p>Received: {report.receivedWeight ?? "-"} kg</p>
              <p>Shortage: {report.shortage ?? "-"} kg</p>
              <p>Fabric: {report.outwardEntry.fabricType}</p>
            </div>
            {report.status === "SHORTAGE_ALERT" && report.inwardEntry ? (
              <button
                type="button"
                onClick={() => handleSendEmailAlert(report.inwardEntry?.id ?? "")}
                disabled={sendingId === report.inwardEntry.id}
                className="mt-4 block w-full rounded-md bg-factory-red px-4 py-3 text-center font-bold text-white disabled:opacity-60 sm:inline-block sm:w-auto"
              >
                {sendingId === report.inwardEntry.id ? "Sending Email..." : "Email Alert"}
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
