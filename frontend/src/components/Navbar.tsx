"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Bell } from "lucide-react";
import { getSelectedStyle, getSession, type SelectedStyle } from "@/lib/auth";
import type { AuthSession } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [style, setStyle] = useState<SelectedStyle | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setStyle(getSelectedStyle());
  }, [pathname]);

  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-factory-line bg-white px-6">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-slate-600"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="md:hidden">
          <Link href="/" className="text-lg font-bold text-factory-ink">
            Ruroxz Exports
          </Link>
        </div>

        <nav className="hidden md:block">
          <p className="text-sm font-medium text-slate-500">
            {pathname === "/" ? "Dashboard Overview" : 
             pathname.startsWith("/outward") ? "Outward Management" :
             pathname.startsWith("/inward") ? "Inward Management" :
             pathname.startsWith("/reports") ? "Business Reports" : "Management Console"}
          </p>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {style && (
          <div className="hidden rounded-full bg-factory-panel px-4 py-1.5 md:block">
            <p className="text-xs font-bold text-factory-green">
              {style.name}
            </p>
          </div>
        )}
        
        <button className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
          <Bell size={20} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-white p-4 md:hidden">
          <nav className="space-y-4">
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg p-3 text-lg font-medium hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <Link 
              href="/outward" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg p-3 text-lg font-medium hover:bg-slate-50"
            >
              Outward
            </Link>
            <Link 
              href="/inward" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg p-3 text-lg font-medium hover:bg-slate-50"
            >
              Inward
            </Link>
            <Link 
              href="/reports" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg p-3 text-lg font-medium hover:bg-slate-50"
            >
              Reports
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
