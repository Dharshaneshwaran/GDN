import type { AuthSession } from "@/types";

const AUTH_SESSION_KEY = "fabric_tracker_session";
const STYLE_SESSION_KEY = "fabric_tracker_selected_style";
const STYLES_LIST_KEY = "fabric_tracker_styles_list";

export interface SelectedStyle {
  id: string;
  name: string;
}

const DEFAULT_STYLES: SelectedStyle[] = [
  { id: "summer-po-102", name: "Summer PO 102" },
  { id: "winter-collection-26", name: "Winter Collection 2026" },
  { id: "ruroxz-exports", name: "Ruroxz Exports Base" }
];

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
  if (style) {
    window.localStorage.setItem(STYLE_SESSION_KEY, JSON.stringify(style));
    // Also ensure it's in the persistent styles list
    addStyleToList(style);
  } else {
    window.localStorage.removeItem(STYLE_SESSION_KEY);
  }
  
  // Notify other components
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("style-changed"));
  }
}

export function addStyleToList(style: SelectedStyle): void {
  if (typeof window === "undefined") return;
  const styles = getStylesList();
  if (!styles.find(s => s.id === style.id)) {
    const updatedStyles = [style, ...styles];
    window.localStorage.setItem(STYLES_LIST_KEY, JSON.stringify(updatedStyles));
  }
}

export function getStylesList(): SelectedStyle[] {
  if (typeof window === "undefined") return DEFAULT_STYLES;
  const rawList = window.localStorage.getItem(STYLES_LIST_KEY);
  if (!rawList) {
    // Initialize with defaults if empty
    window.localStorage.setItem(STYLES_LIST_KEY, JSON.stringify(DEFAULT_STYLES));
    return DEFAULT_STYLES;
  }
  try {
    return JSON.parse(rawList) as SelectedStyle[];
  } catch {
    return DEFAULT_STYLES;
  }
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
