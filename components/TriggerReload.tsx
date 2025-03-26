"use client";

import { useEffect } from "react";

export default function TriggerReload() {
  useEffect(() => {
    // Only trigger a reload if the query param 'loaded' is not set.
    if (!window.location.search.includes("loaded")) {
      const url = new URL(window.location.href);
      url.searchParams.set("loaded", "true");
      // Use location.replace to force a full page reload.
      window.location.replace(url.toString());
    }
  }, []);

  return null;
}
