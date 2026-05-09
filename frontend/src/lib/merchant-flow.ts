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
  { id: "printing", label: "Printing" }
];

export function getLoginLandingPath(role: UserRole): string {
  if (role === "MERCHANT") {
    return "/merchant";
  }

  return "/style-select";
}

export function canOpenWithoutSelectedStyle(pathname: string): boolean {
  return pathname === "/style-select" || pathname === "/merchant";
}

export function getStyleLandingPath(role: UserRole | undefined, mode: StyleSelectionMode): string {
  if (role === "MERCHANT" && mode === "new") {
    return "/merchant";
  }

  return "/";
}
