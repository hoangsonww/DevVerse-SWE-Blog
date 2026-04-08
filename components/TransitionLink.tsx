"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "@/provider/PageTransitionProvider";

type TransitionLinkProps = React.ComponentPropsWithoutRef<typeof Link>;

export default function TransitionLink({
  children,
  href,
  onClick,
  ...props
}: TransitionLinkProps) {
  const { triggerExit } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks pass through (new-tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    // Only intercept string hrefs; let UrlObject fall through
    if (typeof href !== "string") return;

    // Skip if navigating to the same page
    if (href === pathname) return;

    e.preventDefault();
    onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
    triggerExit(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
