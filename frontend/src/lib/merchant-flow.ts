import type { UserRole } from "@/types";

export type StyleSelectionMode = "existing" | "new";

export interface MerchantDepartment {
  id: string;
  label: string;
}

export const merchantDepartments: MerchantDepartment[] = [
  { id: "yarn", label: "Yarn" },
  { id: "knitting", label: "Knitting" },
  { id: "dyeing", label: "Dyeing" },
  { id: "washing", label: "Washing" },
  { id: "cutting", label: "Cutting" },
  { id: "stitching", label: "Stitching" },
  { id: "printing", label: "Printing" },
  { id: "sample", label: "Sample Development" }
];

export function getLoginLandingPath(role: UserRole): string {
  if (role === "MERCHANT") {
    return "/merchant";
  }
  
  if (role === "SAMPLE_DEPARTMENT") {
    return "/sample";
  }

  return "/style-select";
}

export function canOpenWithoutSelectedStyle(pathname: string): boolean {
  const openPaths = ["/style-select", "/merchant", "/sample", "/inward", "/outward", "/reports", "/production"];
  return openPaths.includes(pathname) || openPaths.some(p => pathname.startsWith(p + "/"));
}

export function getStyleLandingPath(role: UserRole | undefined, mode: StyleSelectionMode): string {
  if (role === "MERCHANT" && mode === "new") {
    return "/merchant";
  }

  return "/";
}
