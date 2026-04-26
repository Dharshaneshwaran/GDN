"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSelectedStyle, getSession, type SelectedStyle } from "@/lib/auth";
import type { AuthSession } from "@/types";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/outward", label: "Outward" },
  { href: "/inward", label: "Inward" },
  { href: "/reports", label: "Reports" }
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [style, setStyle] = useState<SelectedStyle | null>(null);

  useEffect(() => {
    if (pathname === "/login") {
      setSession(null);
      setStyle(null);
      return;
    }

    setSession(getSession());
    setStyle(getSelectedStyle());
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
    <header className="sticky top-0 z-20 border-b border-factory-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="text-lg font-bold text-factory-ink">
            Tiruppur Fabric Tracker
          </Link>
          {session ? (
            <p className="text-sm font-semibold text-slate-600">
              {session.displayName} | {session.role}
            </p>
          ) : null}
          {style ? <p className="text-sm font-semibold text-factory-green">{style.name}</p> : null}
        </div>
        {pathname === "/style-select" ? null : (
          <nav className="grid grid-cols-4 gap-2 text-sm font-semibold">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-center ${
                    active
                      ? "bg-factory-green text-white"
                      : "bg-factory-panel text-factory-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-factory-ink px-4 py-2 text-sm font-bold text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
