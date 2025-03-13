"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Extend Window type to include dataLayer
declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: Record<string, any>[];
  }
}

export default function GTMTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ensure dataLayer exists before pushing events
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_path: pathname + searchParams.toString(),
      });
    }
  }, [pathname, searchParams]);

  return null; // No UI needed
}
