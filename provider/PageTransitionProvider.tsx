"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

type TransitionStage = "enter" | "visible" | "exit";

interface PageTransitionContextValue {
  stage: TransitionStage;
  triggerExit: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  stage: "enter",
  triggerExit: () => {},
});

const EXIT_MS = 220;
const ENTER_MS = 400;

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stage, setStage] = useState<TransitionStage>("enter");
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerExit = useCallback(
    (href: string) => {
      if (stage === "exit") return;
      setStage("exit");
      exitTimer.current = setTimeout(() => {
        router.push(href);
      }, EXIT_MS);
    },
    [stage, router],
  );

  // On pathname change → play enter animation
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      prevPathname.current = pathname;
      if (exitTimer.current) {
        clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
      setStage("enter");
    }
  }, [pathname]);

  // After enter animation completes → idle
  useEffect(() => {
    if (stage === "enter") {
      const t = setTimeout(() => setStage("visible"), ENTER_MS);
      return () => clearTimeout(t);
    }
  }, [stage]);

  useEffect(() => {
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, []);

  return (
    <PageTransitionContext.Provider value={{ stage, triggerExit }}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export const usePageTransition = () => useContext(PageTransitionContext);
