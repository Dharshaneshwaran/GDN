import type {
  CreateInwardPayload,
  CreateOutwardPayload,
  DashboardStats,
  EmailAlertResult,
  FabricReport,
  AuthSession,
  InwardEntry,
  LoginPayload,
  OutwardEntry
} from "@/types";

const API_BASE_URL = "http://localhost:8001";

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === "object" && value !== null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text || "API request failed";

    try {
      const parsed: unknown = JSON.parse(text);

      if (isApiErrorResponse(parsed) && parsed.message) {
        message = Array.isArray(parsed.message) ? parsed.message.join(", ") : parsed.message;
      }
    } catch {
      message = text || "API request failed";
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  login: (payload: LoginPayload) =>
    request<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getOutwardEntries: () => request<OutwardEntry[]>("/outward"),
  createOutwardEntry: (payload: CreateOutwardPayload) =>
    request<OutwardEntry>("/outward", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  createInwardEntry: (payload: CreateInwardPayload) =>
    request<InwardEntry>("/inward", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  sendEmailAlert: (inwardEntryId: string) =>
    request<EmailAlertResult>(`/inward/${inwardEntryId}/send-email-alert`, {
      method: "POST"
    }),
  getReports: () => request<FabricReport[]>("/reports"),
  async getDashboardStats(): Promise<DashboardStats> {
    const [outwardEntries, reports] = await Promise.all([
      api.getOutwardEntries(),
      api.getReports()
    ]);
    const today = new Date().toISOString().slice(0, 10);

    return {
      totalOutwardEntries: outwardEntries.length,
      totalInwardEntries: reports.filter((report) => report.inwardEntry !== null).length,
      totalShortageAlerts: reports.filter((report) => report.status === "SHORTAGE_ALERT").length,
      todaySentWeight: outwardEntries
        .filter((entry) => entry.sentDate === today)
        .reduce((sum, entry) => sum + entry.sentWeight, 0),
      todayReceivedWeight: reports
        .filter((report) => report.inwardEntry?.receivedDate === today)
        .reduce((sum, report) => sum + (report.receivedWeight ?? 0), 0)
    };
  }
};
