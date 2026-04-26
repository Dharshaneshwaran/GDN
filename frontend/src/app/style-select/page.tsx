"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { FormInput } from "@/components/FormInput";
import { getSession, saveSelectedStyle } from "@/lib/auth";

const existingStyle = {
  id: "tiruppur-fabric-tracker",
  name: "Tiruppur Fabric Tracker"
};

export default function StyleSelectPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [error, setError] = useState<string | null>(null);

  function openStyle(style: typeof existingStyle) {
    saveSelectedStyle(style);
    router.replace("/");
  }

  function handleCreateStyle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const styleName = String(form.get("styleName") ?? "").trim();

    if (!styleName) {
      setError("Style name is required");
      return;
    }

    saveSelectedStyle({
      id: styleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: styleName
    });
    router.replace("/");
  }

  const session = typeof window !== "undefined" ? getSession() : null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <section>
        <BackButton />
        <p className="text-sm font-semibold uppercase tracking-wide text-factory-green">
          Welcome {session?.displayName ?? ""}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-factory-ink">Select Style</h1>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`rounded-md px-5 py-4 text-lg font-bold ${
            mode === "new" ? "bg-factory-green text-white" : "bg-white text-factory-ink"
          }`}
        >
          New Style
        </button>
        <button
          type="button"
          onClick={() => setMode("existing")}
          className={`rounded-md px-5 py-4 text-lg font-bold ${
            mode === "existing" ? "bg-factory-green text-white" : "bg-white text-factory-ink"
          }`}
        >
          Existing Style
        </button>
      </div>

      {mode === "existing" ? (
        <section className="rounded-md bg-white p-4 shadow-sm">
          <h2 className="text-xl font-bold text-factory-ink">Existing Styles</h2>
          <button
            type="button"
            onClick={() => openStyle(existingStyle)}
            className="mt-4 block w-full rounded-md border border-factory-line bg-factory-panel p-4 text-left"
          >
            <span className="block text-lg font-bold text-factory-ink">{existingStyle.name}</span>
            <span className="mt-1 block text-sm text-slate-600">
              Open fabric tracking dashboard
            </span>
          </button>
        </section>
      ) : (
        <form onSubmit={handleCreateStyle} className="space-y-4 rounded-md bg-white p-4 shadow-sm">
          <h2 className="text-xl font-bold text-factory-ink">Create New Style</h2>
          <FormInput label="Style / Project Name" name="styleName" placeholder="Example: Summer PO 102" required />
          {error ? <p className="rounded-md bg-red-50 p-3 text-factory-red">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-md bg-factory-green px-5 py-4 text-lg font-bold text-white"
          >
            Create and Open
          </button>
        </form>
      )}
    </div>
  );
}
