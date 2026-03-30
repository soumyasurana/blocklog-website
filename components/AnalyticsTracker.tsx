"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "../lib/analytics";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    pageview(pathname);
  }, [pathname]);

  return null;
}