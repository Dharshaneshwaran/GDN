"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="space-y-5">
      <BackButton />
      <h1 className="text-3xl font-bold text-factory-ink">New Inward Entry</h1>
      {outwardEntries.length === 0 && !error ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-factory-ink">
          <p className="font-semibold">No outward lots are available yet.</p>
          <p className="mt-1 text-sm text-slate-700">
            Create an outward entry first, then come back here to record received fabric.
          </p>
          <Link
            href="/outward"
            className="mt-4 block rounded-md bg-factory-green px-5 py-4 text-center text-lg font-bold text-white sm:inline-block"
          >
            New Outward Entry
          </Link>
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-md bg-white p-4 shadow-sm sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormSelect
            label="Select outward entry by lot number"
            name="outwardEntryId"
            required
            disabled={outwardEntries.length === 0}
            options={[
              {
                label: outwardEntries.length === 0 ? "No outward lots available" : "Select lot number",
                value: ""
              },
              ...outwardEntries.map((entry) => ({
                label: `${entry.lotNumber} - ${entry.partyName}`,
                value: entry.id
              }))
            ]}
          />
        </div>
        <FormInput label="Received Weight KG" name="receivedWeight" type="number" min="0.01" step="0.01" required />
        <FormInput label="Received Date" name="receivedDate" type="date" required />
        <FormInput label="Received By" name="receivedBy" />
        <div className="sm:col-span-2">
          <FormTextarea label="Remarks" name="remarks" />
        </div>
        {error ? <p className="sm:col-span-2 rounded-md bg-red-50 p-3 text-factory-red">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting || outwardEntries.length === 0}
          className="sm:col-span-2 rounded-md bg-factory-green px-5 py-4 text-lg font-bold text-white disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Inward Entry"}
        </button>
      </form>

      {result ? (
        <section
          className={`rounded-md border p-4 ${
            result.status === "SHORTAGE_ALERT"
              ? "border-factory-red bg-red-50"
              : "border-factory-line bg-white"
          }`}
        >
          <h2 className="text-xl font-bold text-factory-ink">Shortage Result</h2>
          <div className="mt-3 grid gap-2 text-base sm:grid-cols-2">
            <p>Expected return: {result.expectedReceivedWeight} kg</p>
            <p>Received: {result.receivedWeight} kg</p>
            <p>Shortage: {result.shortage} kg</p>
            <p>Status: {result.status}</p>
          </div>
          {result.status === "SHORTAGE_ALERT" && result.whatsappAlertMessage ? (
            <div className="mt-4 space-y-3">
              <pre className="whitespace-pre-wrap rounded-md bg-white p-3 text-sm text-factory-ink">
                {result.whatsappAlertMessage}
              </pre>
              <button
                type="button"
                onClick={() => handleSendEmailAlert(result.id)}
                disabled={sendingEmail}
                className="block w-full rounded-md bg-factory-ink px-5 py-4 text-center text-lg font-bold text-white disabled:opacity-60 sm:inline-block sm:w-auto"
              >
                {sendingEmail ? "Sending Email..." : "Send Email Alert"}
              </button>
              {emailMessage ? (
                <p className="rounded-md bg-green-50 p-3 font-semibold text-factory-green">
                  {emailMessage}
                </p>
              ) : null}
              {emailError ? (
                <p className="rounded-md bg-red-50 p-3 font-semibold text-factory-red">
                  {emailError}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
