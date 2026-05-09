"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  ArrowDownLeft,
  Info
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { FormInput, FormSelect, FormTextarea } from "@/components/FormInput";
import { api } from "@/lib/api";
import type { InwardEntry, OutwardEntry } from "@/types";

export default function InwardPage() {
  const [outwardEntries, setOutwardEntries] = useState<OutwardEntry[]>([]);
  const [result, setResult] = useState<InwardEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .getOutwardEntries()
      .then(setOutwardEntries)
      .catch((err: Error) => setError(err.message));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);
    setEmailMessage(null);
    setEmailError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      outwardEntryId: String(form.get("outwardEntryId")),
      receivedWeight: Number(form.get("receivedWeight")),
      receivedDate: String(form.get("receivedDate")),
      receivedBy: String(form.get("receivedBy") ?? ""),
      remarks: String(form.get("remarks") ?? "")
    };

    try {
      const created = await api.createInwardEntry(payload);
      setResult(created);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save inward entry");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendEmailAlert(inwardEntryId: string) {
    setSendingEmail(true);
    setEmailMessage(null);
    setEmailError(null);

    try {
      const emailResult = await api.sendEmailAlert(inwardEntryId);
      setEmailMessage(`Email alert sent. Message ID: ${emailResult.messageId}`);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Unable to send email alert");
    } finally {
      setSendingEmail(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <BackButton />
        <h1 className="mt-4 text-3xl font-black text-factory-ink">New Inward Entry</h1>
        <p className="text-slate-500">Record processed fabric being received back.</p>
      </header>

      {outwardEntries.length === 0 && !error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-factory-ink">
          <div className="flex items-center gap-3">
            <Info className="text-factory-amber" size={24} />
            <p className="text-lg font-bold">No outward lots available</p>
          </div>
          <p className="mt-2 text-slate-700">
            You need to create an outward entry before you can record an inward movement.
          </p>
          <Link
            href="/outward"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-factory-green px-6 py-4 font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] sm:w-auto sm:inline-flex"
          >
            Create Outward Entry
          </Link>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-factory-line bg-white shadow-sm">
        <div className="grid gap-6 p-6 sm:grid-cols-2 md:p-8">
          <div className="sm:col-span-2">
            <FormSelect
              label="Select Outward Lot"
              name="outwardEntryId"
              required
              disabled={outwardEntries.length === 0}
              options={[
                {
                  label: outwardEntries.length === 0 ? "No lots found" : "Choose a lot number...",
                  value: ""
                },
                ...outwardEntries.map((entry) => ({
                  label: `${entry.lotNumber} - ${entry.partyName} (${entry.fabricType})`,
                  value: entry.id
                }))
              ]}
            />
          </div>
          <FormInput label="Received Weight (KG)" name="receivedWeight" type="number" min="0.01" step="0.01" placeholder="0.00" required />
          <FormInput label="Received Date" name="receivedDate" type="date" required />
          <FormInput label="Received By" name="receivedBy" placeholder="Person name" />
          
          <div className="sm:col-span-2">
            <FormTextarea label="Remarks" name="remarks" placeholder="Notes about fabric quality, etc." />
          </div>
        </div>

        {error ? (
          <div className="mx-6 mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-factory-red md:mx-8">
            <AlertCircle size={20} />
            <p className="font-bold">{error}</p>
          </div>
        ) : null}

        <div className="border-t border-factory-line bg-factory-panel p-6 md:p-8">
          <button
            type="submit"
            disabled={submitting || outwardEntries.length === 0}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-factory-ink px-8 py-4 text-lg font-bold text-white transition-all hover:bg-black disabled:opacity-60"
          >
            {submitting ? "Processing..." : (
              <>
                <ArrowDownLeft size={20} />
                Save Inward Entry
              </>
            )}
          </button>
        </div>
      </form>

      {result ? (
        <section
          className={`overflow-hidden rounded-2xl border shadow-lg ${
            result.status === "SHORTAGE_ALERT"
              ? "border-factory-red/30 ring-4 ring-factory-red/5"
              : "border-factory-line"
          } bg-white animate-in fade-in slide-in-from-bottom-4`}
        >
          <div className={`p-6 md:p-8 ${result.status === "SHORTAGE_ALERT" ? "bg-red-50" : "bg-factory-panel"}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-factory-ink">Movement Result</h2>
              <span className={`rounded-full px-4 py-1 text-xs font-black uppercase tracking-widest ${
                result.status === "SHORTAGE_ALERT" ? "bg-factory-red text-white" : "bg-factory-green text-white"
              }`}>
                {result.status}
              </span>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:grid-cols-3 md:p-8">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-slate-500">Expected</p>
              <p className="text-2xl font-black text-factory-ink">{result.expectedReceivedWeight} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-slate-500">Received</p>
              <p className="text-2xl font-black text-factory-ink">{result.receivedWeight} kg</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-slate-500">Shortage</p>
              <p className={`text-2xl font-black ${result.shortage > 0 ? "text-factory-red" : "text-factory-green"}`}>
                {result.shortage} kg
              </p>
            </div>
          </div>

          {result.status === "SHORTAGE_ALERT" && result.whatsappAlertMessage ? (
            <div className="border-t border-factory-line p-6 md:p-8">
              <div className="flex items-center gap-2 text-factory-red mb-4">
                <AlertCircle size={18} />
                <p className="text-sm font-bold uppercase tracking-wide">Alert Notification</p>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl border border-factory-line bg-factory-panel p-4 text-sm font-medium text-factory-ink">
                {result.whatsappAlertMessage}
              </pre>
              
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleSendEmailAlert(result.id)}
                  disabled={sendingEmail}
                  className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-factory-ink px-6 py-4 font-bold text-white transition-all hover:bg-black disabled:opacity-60"
                >
                  {sendingEmail ? "Sending..." : (
                    <>
                      <Mail size={18} />
                      Send Email Alert
                    </>
                  )}
                </button>
              </div>

              {emailMessage ? (
                <div className="mt-4 flex items-center gap-2 text-factory-green">
                  <CheckCircle2 size={18} />
                  <p className="font-bold">{emailMessage}</p>
                </div>
              ) : null}
              {emailError ? (
                <div className="mt-4 flex items-center gap-2 text-factory-red">
                  <AlertCircle size={18} />
                  <p className="font-bold">{emailError}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
