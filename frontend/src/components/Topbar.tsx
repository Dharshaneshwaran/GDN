"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getSelectedStyle, getSession, getNotifications, markNotificationAsRead, type SelectedStyle, type AppNotification } from "@/lib/auth";
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
  ChevronDown,
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [style, setStyle] = useState<SelectedStyle | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateState = () => {
      if (pathname === "/login") {
        setSession(null);
        setStyle(null);
        setNotifications([]);
        return;
      }
      setSession(getSession());
      setStyle(getSelectedStyle());
      // Filter out style_transfer notifications from Topbar - they only show on Sample Dev page
      setNotifications(getNotifications().filter(n => n.type !== "style_transfer"));
    };
    updateState();
    window.addEventListener("style-changed", updateState);
    window.addEventListener("notifications-changed", updateState);
    return () => {
      window.removeEventListener("style-changed", updateState);
      window.removeEventListener("notifications-changed", updateState);
    };
  }, [pathname]);

  function handleLogout() {
    clearSession();
    setSession(null);
    router.replace("/login");
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  if (pathname === "/login") {
    return null;
  }

  const dashboardHref = session?.role === "MERCHANT" ? "/merchant" : session?.role === "SAMPLE_DEPARTMENT" ? "/sample" : "/";
  
  const currentLinks = [
    { href: dashboardHref, label: "Dashboard", icon: LayoutDashboard },
    { href: "/inward", label: "Inward", icon: ArrowDownLeft },
    { href: "/outward", label: "Outward", icon: ArrowUpRight },
    { href: "/reports", label: "Reports", icon: FileText }
  ];

  if (session?.role === "SAMPLE_DEPARTMENT") {
    currentLinks.push({ href: "/production", label: "Production", icon: Activity });
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

      {/* 2. Elite Tab Assignment (Advanced Liquid Glass Navigation) */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <nav className="flex items-center bg-white/5 backdrop-blur-[32px] p-1.5 rounded-[1.25rem] border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* Internal Refraction Glow */}
          <div className="absolute -top-full -left-full w-[300%] h-[300%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_50%)] animate-[spin_20s_linear_infinite] pointer-events-none" />
          
          {currentLinks.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) || (link.label === "Dashboard" && (pathname === "/" || pathname === "/merchant" || pathname === "/sample"));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-3 px-8 py-3 rounded-xl text-[10.5px] font-black uppercase tracking-[0.25em] transition-all duration-700 min-w-[135px] justify-center overflow-hidden group ${
                  active
                    ? "text-slate-900 shadow-[inset_0_0_20px_rgba(255,255,255,0.4),0_10px_20px_-10px_rgba(0,0,0,0.1)] border border-white/60 bg-gradient-to-br from-white/80 to-white/40"
                    : "text-slate-400 hover:text-slate-900"
                }`}
              >
                {/* Iridescent Liquid Layer */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${active ? 'opacity-100' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-tr from-factory-emerald/5 via-factory-accent/10 to-transparent animate-pulse" />
                  <div className="absolute -inset-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                </div>
                
                <Icon className={`w-3.5 h-3.5 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${active ? "text-factory-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "text-slate-400"}`} />
                <span className="relative z-10 transition-colors duration-500">{link.label}</span>
                
                {/* Morphing Active Indicator */}
                {active && (
                   <>
                     <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-factory-accent rounded-full shadow-[0_0_20px_2px_#10b981] z-20" />
                     <div className="absolute inset-0 bg-factory-emerald/5 animate-pulse -z-0" />
                   </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Action Terminal */}
      <div className="flex items-center justify-end gap-4 min-w-[240px]">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl transition-all relative ${showNotifications ? "bg-slate-900 text-factory-accent" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-factory-accent text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full mt-4 right-0 w-80 bg-white rounded-2xl shadow-premium-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Communication Terminal</h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Active Logs</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 relative group ${!n.read ? "bg-emerald-50/30" : ""}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.read ? "bg-factory-accent animate-pulse" : "bg-slate-200"}`} />
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{n.title}</p>
                           <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{n.message}</p>
                           <div className="flex items-center gap-2 pt-1">
                              <Clock size={10} className="text-slate-300" />
                              <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(n.timestamp).toLocaleTimeString()}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
