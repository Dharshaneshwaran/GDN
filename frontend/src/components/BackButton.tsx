"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  function handleBack() {
    if (pathname === "/") {
      router.push("/style-select");
      return;
    }

    if (pathname === "/style-select") {
      router.push("/login");
      return;
    }

    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="mb-4 rounded-md bg-white px-4 py-2 text-sm font-bold text-factory-ink ring-1 ring-factory-line"
    >
      Back
    </button>
  );
}
