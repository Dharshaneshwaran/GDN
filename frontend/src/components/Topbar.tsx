"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSelectedStyle, getSession, type SelectedStyle } from "@/lib/auth";
import type { AuthSession } from "@/types";
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  LogOut, 
  Activity,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inward", label: "Inward", icon: ArrowDownLeft },
  { href: "/outward", label: "Outward", icon: ArrowUpRight },
  { href: "/reports", label: "Reports", icon: FileText }
];

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [style, setStyle] = useState<SelectedStyle | null>(null);

  useEffect(() => {
    const updateState = () => {
      if (pathname === "/login") {
        setSession(null);
        setStyle(null);
        return;
      }
      setSession(getSession());
      setStyle(getSelectedStyle());
    };
    updateState();
    window.addEventListener("style-changed", updateState);
    return () => window.removeEventListener("style-changed", updateState);
  }, [pathname]);

  function handleLogout() {
    clearSession();
    setSession(null);
    router.replace("/login");
  }

  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between px-8 bg-white border-b border-slate-100/80 shadow-premium-sm">
      {/* 1. Industrial Branding - Ruroxz Exports */}
      <div className="flex items-center gap-6 min-w-[240px]">
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-sm border border-slate-200">
            <img 
              src="/logo.jpg" 
              alt="Ruroxz Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to icon if image fails
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('bg-slate-900', 'flex', 'items-center', 'justify-center');
                const icon = document.createElement('div');
                icon.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="#10b981" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>';
                e.currentTarget.parentElement?.appendChild(icon.firstChild!);
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-black tracking-widest text-slate-900 uppercase">Ruroxz <span className="text-factory-emerald">Exports</span></span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Industrial Intelligence</span>
          </div>
        </Link>
      </div>

      {/* 2. Elite Tab Assignment (Perfect Centering) */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <nav className="flex items-center bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-3 px-8 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 min-w-[130px] justify-center ${
                  active
                    ? "bg-white text-slate-900 shadow-premium-md border border-slate-200/50"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-factory-emerald" : "text-slate-400"}`} />
                <span>{link.label}</span>
                {active && (
                   <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-factory-accent rounded-full shadow-[0_0_10px_#10b981]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Action Terminal */}
      <div className="flex items-center justify-end gap-4 min-w-[240px]">
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
          <Bell size={20} />
        </button>

        <div className="h-6 w-px bg-slate-100 mx-1" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-all border border-slate-200/50">
             <LogOut size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-red-600 transition-colors">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
