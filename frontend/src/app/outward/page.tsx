"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
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
    <div className="space-y-5">
      <BackButton />
      <h1 className="text-3xl font-bold text-factory-ink">New Outward Entry</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-md bg-white p-4 shadow-sm sm:grid-cols-2">
        <FormInput label="Party Name" name="partyName" required />
        <FormSelect label="Process Type" name="processType" options={processOptions} required />
        <FormInput label="Fabric Type" name="fabricType" required />
        <FormInput label="Lot Number" name="lotNumber" required />
        <FormInput label="Sent Weight KG" name="sentWeight" type="number" min="0.01" step="0.01" required />
        <FormInput label="Sent Date" name="sentDate" type="date" required />
        <FormInput label="Vehicle Number" name="vehicleNumber" />
        <FormInput label="Driver / Staff Name" name="driverName" />
        <FormInput label="Allowed Loss %" name="allowedLossPercent" type="number" min="0" step="0.01" defaultValue="0" required />
        <div className="sm:col-span-2">
          <FormTextarea label="Remarks" name="remarks" />
        </div>
        {error ? <p className="sm:col-span-2 rounded-md bg-red-50 p-3 text-factory-red">{error}</p> : null}
        {message ? (
          <div className="sm:col-span-2 rounded-md bg-green-50 p-3 text-factory-green">
            <p className="font-semibold">{message}</p>
            {savedLotNumber ? (
              <Link
                href="/inward"
                className="mt-3 block rounded-md bg-factory-green px-4 py-3 text-center font-bold text-white sm:inline-block"
              >
                Add Inward for Lot {savedLotNumber}
              </Link>
            ) : null}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="sm:col-span-2 rounded-md bg-factory-green px-5 py-4 text-lg font-bold text-white disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Outward Entry"}
        </button>
      </form>
    </div>
  );
}
