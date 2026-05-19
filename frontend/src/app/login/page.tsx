"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/FormInput";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { getLoginLandingPath } from "@/lib/merchant-flow";
import type { UserRole } from "@/types";
import { ShieldCheck, ArrowRight } from "lucide-react";

const roles: { label: string; value: UserRole }[] = [
  { label: "Owner", value: "OWNER" },
  { label: "Merchant", value: "MERCHANT" },
  { label: "Sample Development", value: "SAMPLE_DEPARTMENT" },
  { label: "Stitching", value: "STITCHING_DEPARTMENT" },
  { label: "Cutting", value: "CUTTING_DEPARTMENT" }
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
      router.replace(getLoginLandingPath(session.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center p-4">
      <div className="w-full max-w-[1000px] grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 shadow-premium border border-slate-200">
        
        {/* Left Side: Branding */}
        <div className="hidden md:flex flex-col justify-center space-y-6 pr-8 border-r border-slate-200 h-full py-8">
          <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center shadow-premium-xl border border-slate-800 overflow-hidden">
            <img src="/logo.jpg" alt="Ruroxz" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Ruroxz <span className="text-factory-emerald">Exports</span></h1>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed font-medium">
              Industrial grade movement tracking and elite shortage validation for global export compliance.
            </p>
          </div>
          <div className="mt-8 space-y-3">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
              <span className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm font-medium">owner / owner123</span>
              <span className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm font-medium">merchant / merchant123</span>
              <span className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm font-medium">sample / sample123</span>
              <span className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm font-medium">stitching / stitching123</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <section className="w-full max-w-md mx-auto flex flex-col justify-center py-8">
          <h2 className="text-3xl font-bold text-factory-ink md:hidden mb-6">Welcome Back</h2>
          
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">Select Role</p>
            <div className="flex flex-wrap gap-2">
              {roles.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRole(item.value)}
                  className={`px-4 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                    role === item.value
                      ? "bg-factory-ink text-white shadow-md shadow-factory-ink/20 scale-105"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput label="Username" name="username" autoComplete="username" required />
            <FormInput
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            {error ? <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100">{error}</p> : null}
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full group flex items-center justify-center gap-2 rounded-xl bg-factory-green hover:bg-factory-accent px-5 py-4 text-lg font-bold text-white shadow-lg shadow-factory-green/20 transition-all duration-300 disabled:opacity-60"
            >
              {submitting
                ? "Authenticating..."
                : `Login as ${roles.find((item) => item.value === role)?.label ?? "User"}`}
              {!submitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
