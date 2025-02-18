"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function RouteProgress() {
  const pathname = usePathname();

  useEffect(() => {
    // Start the progress bar on pathname change.
    NProgress.start();
    // Simulate a slight delay; in a real app, you might tie this to actual route change events.
    NProgress.done();
  }, [pathname]);

  return null;
}
