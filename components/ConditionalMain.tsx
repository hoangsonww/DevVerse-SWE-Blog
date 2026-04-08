"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/provider/PageTransitionProvider";

interface ConditionalMainProps {
  children: ReactNode;
}

export default function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { stage } = usePageTransition();

  return (
    <main
      className={`${isLanding ? "landing-main" : "container"} page-transition page-transition--${stage}`}
    >
      {children}
    </main>
  );
}
