"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.gtag("config", "G-2SE6J2L0J4", {
        page_path: pathname,
      });
    }
  }, [pathname]);

  return null;
}
