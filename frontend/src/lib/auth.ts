import type { AuthSession } from "@/types";

const AUTH_SESSION_KEY = "fabric_tracker_session";
const STYLE_SESSION_KEY = "fabric_tracker_selected_style";

export interface SelectedStyle {
  id: string;
  name: string;
}

export function saveSession(session: AuthSession): void {
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

export function clearSession(): void {
  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.localStorage.removeItem(STYLE_SESSION_KEY);
}

export function saveSelectedStyle(style: SelectedStyle): void {
  window.localStorage.setItem(STYLE_SESSION_KEY, JSON.stringify(style));
}

export function getSelectedStyle(): SelectedStyle | null {
  const rawStyle = window.localStorage.getItem(STYLE_SESSION_KEY);

  if (!rawStyle) {
    return null;
  }

  try {
    return JSON.parse(rawStyle) as SelectedStyle;
  } catch {
    window.localStorage.removeItem(STYLE_SESSION_KEY);
    return null;
  }
}
