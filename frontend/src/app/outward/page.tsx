"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { FormInput, FormSelect, FormTextarea } from "@/components/FormInput";
import { api } from "@/lib/api";
import type { ProcessType } from "@/types";

const processOptions: { label: string; value: ProcessType }[] = [
  { label: "Dyeing", value: "Dyeing" },
  { label: "Printing", value: "Printing" },
  { label: "Compacting", value: "Compacting" },
  { label: "Washing", value: "Washing" },
  { label: "Other", value: "Other" }
];

export default function OutwardPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedLotNumber, setSavedLotNumber] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    setSavedLotNumber(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      partyName: String(form.get("partyName")),
      processType: String(form.get("processType")) as ProcessType,
      fabricType: String(form.get("fabricType")),
      lotNumber: String(form.get("lotNumber")),
      sentWeight: Number(form.get("sentWeight")),
      sentDate: String(form.get("sentDate")),
      vehicleNumber: String(form.get("vehicleNumber") ?? ""),
      driverName: String(form.get("driverName") ?? ""),
      allowedLossPercent: Number(form.get("allowedLossPercent") || 0),
      remarks: String(form.get("remarks") ?? "")
    };

    try {
      const created = await api.createOutwardEntry(payload);
      event.currentTarget.reset();
      setMessage(`Outward entry saved for lot ${created.lotNumber}.`);
      setSavedLotNumber(created.lotNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save outward entry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <BackButton />
        <h1 className="mt-4 text-3xl font-black text-factory-ink">New Outward Entry</h1>
        <p className="text-slate-500">Record fabric being sent out for processing.</p>
      </header>

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-factory-line bg-white shadow-sm">
        <div className="grid gap-6 p-6 sm:grid-cols-2 md:p-8">
          <FormInput label="Party Name" name="partyName" placeholder="e.g. ABC Textiles" required />
          <FormSelect label="Process Type" name="processType" options={processOptions} required />
          <FormInput label="Fabric Type" name="fabricType" placeholder="e.g. Cotton Jersey" required />
          <FormInput label="Lot Number" name="lotNumber" placeholder="e.g. LOT-2024-001" required />
          <FormInput label="Sent Weight (KG)" name="sentWeight" type="number" min="0.01" step="0.01" placeholder="0.00" required />
          <FormInput label="Sent Date" name="sentDate" type="date" required />
          <FormInput label="Vehicle Number" name="vehicleNumber" placeholder="TN 38 AB 1234" />
          <FormInput label="Driver / Staff Name" name="driverName" placeholder="Name of person carrying" />
          <FormInput label="Allowed Loss %" name="allowedLossPercent" type="number" min="0" step="0.01" defaultValue="0" required />
          
          <div className="sm:col-span-2">
            <FormTextarea label="Remarks" name="remarks" placeholder="Any additional notes..." />
          </div>
        </div>

        {error ? (
          <div className="mx-6 mb-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-factory-red md:mx-8">
            <AlertCircle size={20} />
            <p className="font-bold">{error}</p>
          </div>
        ) : null}

        {message ? (
          <div className="mx-6 mb-6 rounded-xl bg-green-50 p-4 text-factory-green md:mx-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} />
              <p className="font-bold">{message}</p>
            </div>
            {savedLotNumber ? (
              <Link
                href="/inward"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-factory-green px-4 py-3 font-bold text-white transition-transform hover:scale-[1.01] active:scale-[0.99] sm:w-auto sm:inline-flex"
              >
                Record Inward for Lot {savedLotNumber}
              </Link>
            ) : null}
          </div>
        ) : null}

        <div className="border-t border-factory-line bg-factory-panel p-6 md:p-8">
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-factory-ink px-8 py-4 text-lg font-bold text-white transition-all hover:bg-black disabled:opacity-60"
          >
            {submitting ? (
              "Saving Entry..."
            ) : (
              <>
                <Save size={20} />
                Save Outward Entry
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
