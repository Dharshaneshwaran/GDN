export type ProcessType = "Dyeing" | "Printing" | "Compacting" | "Washing" | "Other";

export type ReportStatus = "PENDING_RETURN" | "NORMAL" | "SHORTAGE_ALERT";

export type UserRole = "OWNER" | "MERCHANT";

export interface LoginPayload {
  role: UserRole;
  username: string;
  password: string;
}

export interface AuthSession {
  role: UserRole;
  username: string;
  displayName: string;
}

export interface OutwardEntry {
  id: string;
  partyName: string;
  processType: ProcessType;
  fabricType: string;
  lotNumber: string;
  sentWeight: number;
  sentDate: string;
  vehicleNumber: string | null;
  driverName: string | null;
  allowedLossPercent: number;
  remarks: string | null;
  createdAt: string;
}

export interface InwardEntry {
  id: string;
  outwardEntry: OutwardEntry;
  receivedWeight: number;
  receivedDate: string;
  receivedBy: string | null;
  remarks: string | null;
  expectedReceivedWeight: number;
  shortage: number;
  status: Exclude<ReportStatus, "PENDING_RETURN">;
  whatsappAlertMessage: string | null;
  whatsappAlertUrl: string | null;
  createdAt: string;
}

export interface CreateOutwardPayload {
  partyName: string;
  processType: ProcessType;
  fabricType: string;
  lotNumber: string;
  sentWeight: number;
  sentDate: string;
  vehicleNumber?: string;
  driverName?: string;
  allowedLossPercent: number;
  remarks?: string;
}

export interface CreateInwardPayload {
  outwardEntryId: string;
  receivedWeight: number;
  receivedDate: string;
  receivedBy?: string;
  remarks?: string;
}

export interface FabricReport {
  outwardEntry: OutwardEntry;
  inwardEntry: InwardEntry | null;
  expectedReceivedWeight: number | null;
  receivedWeight: number | null;
  shortage: number | null;
  status: ReportStatus;
  whatsappAlertUrl: string | null;
}

export interface DashboardStats {
  totalOutwardEntries: number;
  totalInwardEntries: number;
  totalShortageAlerts: number;
  todaySentWeight: number;
  todayReceivedWeight: number;
}

export interface EmailAlertResult {
  messageId: string;
  status: "EMAIL_SENT";
}
