"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface ConditionalMainProps {
  children: ReactNode;
}

export default function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <main className={isLanding ? "landing-main" : "container"}>{children}</main>
  );
}
