"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/FormInput";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import type { UserRole } from "@/types";

const roles: { label: string; value: UserRole }[] = [
  { label: "Owner", value: "OWNER" },
  { label: "Merchant", value: "MERCHANT" }
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("OWNER");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);

    try {
      const session = await api.login({
        role,
        username: String(form.get("username")),
        password: String(form.get("password"))
      });
      saveSession(session);
      router.replace("/style-select");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-150px)] max-w-md items-center">
      <section className="w-full rounded-md bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-factory-green">
          Tiruppur Fabric Tracker
        </p>
        <h1 className="mt-2 text-3xl font-bold text-factory-ink">Login</h1>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {roles.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setRole(item.value)}
              className={`rounded-md px-4 py-3 font-bold ${
                role === item.value
                  ? "bg-factory-green text-white"
                  : "bg-factory-panel text-factory-ink"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <FormInput label="Username" name="username" autoComplete="username" required />
          <FormInput
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          {error ? <p className="rounded-md bg-red-50 p-3 text-factory-red">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-factory-green px-5 py-4 text-lg font-bold text-white disabled:opacity-60"
          >
            {submitting ? "Logging in..." : `Login as ${role === "OWNER" ? "Owner" : "Merchant"}`}
          </button>
        </form>

        <div className="mt-4 rounded-md bg-factory-panel p-3 text-sm text-slate-700">
          <p>Owner demo: owner / owner123</p>
          <p>Merchant demo: merchant / merchant123</p>
        </div>
      </section>
    </div>
  );
}
