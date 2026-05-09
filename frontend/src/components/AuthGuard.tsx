"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { getSelectedStyle, getSession } from "@/lib/auth";
import { canOpenWithoutSelectedStyle, getLoginLandingPath } from "@/lib/merchant-flow";
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

    if (!canOpenWithoutSelectedStyle(pathname) && !getSelectedStyle()) {
      router.replace(getLoginLandingPath(currentSession.role));
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
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-factory-green border-t-transparent"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Initializing Ruroxz Exports...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
