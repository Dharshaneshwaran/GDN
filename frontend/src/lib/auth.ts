import type { AuthSession } from "@/types";

const AUTH_SESSION_KEY = "fabric_tracker_session";
const STYLE_SESSION_KEY = "fabric_tracker_selected_style";
const STYLES_LIST_KEY = "fabric_tracker_styles_list";

export interface SelectedStyle {
  id: string;
  name: string;
  description?: string;
  productionType?: "sample" | "bulk";
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "style_transfer" | "system";
  payload?: any;
}

const NOTIFICATIONS_KEY = "fabric_tracker_notifications";

export function getNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addNotification(notification: Omit<AppNotification, "id" | "timestamp" | "read">): void {
  if (typeof window === "undefined") return;
  const notifications = getNotifications();
  const newNotif: AppNotification = {
    ...notification,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    read: false
  };
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([newNotif, ...notifications]));
  window.dispatchEvent(new Event("notifications-changed"));
}

export function markNotificationAsRead(id: string): void {
  if (typeof window === "undefined") return;
  const notifications = getNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("notifications-changed"));
}

export function clearNotifications(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  window.dispatchEvent(new Event("notifications-changed"));
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

const EXISTING_SAMPLES_KEY = "fabric_tracker_existing_samples";

export function getExistingSamples(): SelectedStyle[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(EXISTING_SAMPLES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addExistingSample(sample: SelectedStyle): void {
  if (typeof window === "undefined") return;
  const samples = getExistingSamples();
  if (!samples.find(s => s.id === sample.id)) {
    const updated = [sample, ...samples];
    window.localStorage.setItem(EXISTING_SAMPLES_KEY, JSON.stringify(updated));
  }
}

const WORKFLOWS_KEY = "fabric_tracker_workflows";

export interface ProductionWorkflow {
  id: string;
  styleId: string;
  styleName: string;
  steps: string[];
  timestamp: string;
}

export function saveWorkflow(workflow: Omit<ProductionWorkflow, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;
  const workflows = getWorkflows();
  const newWorkflow: ProductionWorkflow = {
    ...workflow,
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString()
  };
  window.localStorage.setItem(WORKFLOWS_KEY, JSON.stringify([newWorkflow, ...workflows]));
}

export function getWorkflows(): ProductionWorkflow[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(WORKFLOWS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function clearWorkflows(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(WORKFLOWS_KEY);
  window.dispatchEvent(new Event("workflows-changed"));
}
