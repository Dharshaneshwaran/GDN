"use client";

import { FormEvent, useMemo, useState } from "react";
import { BackButton } from "@/components/BackButton";
import { FormInput } from "@/components/FormInput";
import { getSelectedStyle, saveSelectedStyle, type SelectedStyle } from "@/lib/auth";
import { merchantDepartments } from "@/lib/merchant-flow";

const existingStyle = {
  id: "tiruppur-fabric-tracker",
  name: "Tiruppur Fabric Tracker"
};

export default function MerchantPage() {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(merchantDepartments[0].id);
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyle | null>(() =>
    typeof window !== "undefined" ? getSelectedStyle() : null
  );
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [error, setError] = useState<string | null>(null);
  const selectedDepartment = useMemo(
    () =>
      merchantDepartments.find((department) => department.id === selectedDepartmentId) ??
      merchantDepartments[0],
    [selectedDepartmentId]
  );

  function openStyle(style: SelectedStyle) {
    saveSelectedStyle(style);
    setSelectedStyle(style);
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

    openStyle({
      id: styleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name: styleName
    });
  }

  return (
    <div className="space-y-5">
      <section>
        <BackButton />
        <p className="text-sm font-semibold uppercase tracking-wide text-factory-green">
          {selectedStyle?.name ?? "Merchant Style Setup"}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-factory-ink">Merchant Department Flow</h1>
      </section>

      <div className="grid min-h-[520px] gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-md bg-white p-3 shadow-sm">
          <nav className="space-y-2" aria-label="Merchant departments">
            {merchantDepartments.map((department) => {
              const active = department.id === selectedDepartmentId;

              return (
                <button
                  key={department.id}
                  type="button"
                  onClick={() => setSelectedDepartmentId(department.id)}
                  className={`flex min-h-12 w-full items-center rounded-md px-4 text-left text-sm font-bold ${
                    active
                      ? "bg-factory-green text-white"
                      : "bg-factory-panel text-factory-ink hover:bg-white hover:ring-1 hover:ring-factory-line"
                  }`}
                >
                  {department.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-md bg-white p-5 shadow-sm">
          {selectedStyle ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-factory-green">
                Department
              </p>
              <h2 className="mt-2 text-2xl font-bold text-factory-ink">
                {selectedDepartment.label}
              </h2>
              <div className="mt-5 rounded-md border border-factory-line bg-factory-panel p-4">
                <p className="font-semibold text-factory-ink">
                  {selectedDepartment.label} work area for {selectedStyle.name}.
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Select a department from the sidebar to move through the merchant workflow.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-factory-green">
                {selectedDepartment.label} Department
              </p>
              <h2 className="mt-2 text-2xl font-bold text-factory-ink">Select Style for {selectedDepartment.label}</h2>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("new")}
                  className={`rounded-md px-5 py-4 text-lg font-bold ${
                    mode === "new" ? "bg-factory-green text-white" : "bg-factory-panel text-factory-ink"
                  }`}
                >
                  New Style
                </button>
                <button
                  type="button"
                  onClick={() => setMode("existing")}
                  className={`rounded-md px-5 py-4 text-lg font-bold ${
                    mode === "existing"
                      ? "bg-factory-green text-white"
                      : "bg-factory-panel text-factory-ink"
                  }`}
                >
                  Existing Style
                </button>
              </div>

              {mode === "existing" ? (
                <div className="mt-5 rounded-md border border-factory-line bg-factory-panel p-4">
                  <h3 className="text-xl font-bold text-factory-ink">Existing Styles</h3>
                  <button
                    type="button"
                    onClick={() => openStyle(existingStyle)}
                    className="mt-4 block w-full rounded-md border border-factory-line bg-white p-4 text-left"
                  >
                    <span className="block text-lg font-bold text-factory-ink">
                      {existingStyle.name}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      Open merchant department flow
                    </span>
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleCreateStyle}
                  className="mt-5 space-y-4 rounded-md border border-factory-line bg-factory-panel p-4"
                >
                  <h3 className="text-xl font-bold text-factory-ink">Create New Style</h3>
                  <FormInput
                    label="Style / Project Name"
                    name="styleName"
                    placeholder="Example: Summer PO 102"
                    required
                  />
                  {error ? (
                    <p className="rounded-md bg-red-50 p-3 text-factory-red">{error}</p>
                  ) : null}
                  <button
                    type="submit"
                    className="w-full rounded-md bg-factory-green px-5 py-4 text-lg font-bold text-white"
                  >
                    Create and Open
                  </button>
                </form>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
