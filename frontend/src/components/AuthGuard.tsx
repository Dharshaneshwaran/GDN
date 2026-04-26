"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { getSelectedStyle, getSession } from "@/lib/auth";
import type { AuthSession } from "@/types";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/login") {
      setChecking(false);
      return;
    }

    const currentSession = getSession();

    if (!currentSession) {
      router.replace("/login");
      return;
    }

    if (pathname !== "/style-select" && !getSelectedStyle()) {
      router.replace("/style-select");
      return;
    }

    setSession(currentSession);
    setChecking(false);
  }, [pathname, router]);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (checking || !session) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-md bg-white p-4 text-factory-ink shadow-sm">Checking login...</div>
      </div>
    );
  }

  return <>{children}</>;
}
