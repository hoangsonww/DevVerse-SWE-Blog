"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";
const GOOGLE_TRANSLATE_SCRIPT_SRC =
  "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
const GOOGLE_TRANSLATE_TIMEOUT_MS = 8000;
const TRANSLATE_ELEMENT_ID = "google_translate_element";

let translateScriptPromise: Promise<void> | null = null;

const loadGoogleTranslate = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Translate requires a browser."));
  }

  if (window.google?.translate?.TranslateElement) {
    return Promise.resolve();
  }

  if (translateScriptPromise) {
    return translateScriptPromise;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  translateScriptPromise = new Promise((resolve, reject) => {
    let settled = false;
    let pollingStarted = false;

    const settle = (fn: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      fn();
    };

    const waitForTranslate = () => {
      if (pollingStarted) {
        return;
      }
      pollingStarted = true;
      const start = Date.now();
      const intervalId = window.setInterval(() => {
        if (window.google?.translate?.TranslateElement) {
          window.clearInterval(intervalId);
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          settle(resolve);
          return;
        }
        if (Date.now() - start > GOOGLE_TRANSLATE_TIMEOUT_MS) {
          window.clearInterval(intervalId);
          settle(() =>
            reject(new Error("Google Translate did not initialize in time.")),
          );
        }
      }, 150);
    };

    const existingScript = document.getElementById(
      GOOGLE_TRANSLATE_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.google?.translate?.TranslateElement) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        settle(resolve);
        return;
      }
      existingScript.addEventListener("load", waitForTranslate, { once: true });
      existingScript.addEventListener(
        "error",
        () =>
          settle(() => reject(new Error("Failed to load Google Translate."))),
        { once: true },
      );
      waitForTranslate();
      return;
    }

    window.googleTranslateElementInit = () => {
      waitForTranslate();
    };

    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src = GOOGLE_TRANSLATE_SCRIPT_SRC;
    script.async = true;
    script.onload = waitForTranslate;
    script.onerror = () =>
      settle(() => reject(new Error("Failed to load Google Translate.")));
    document.body.appendChild(script);
  }).catch((error) => {
    translateScriptPromise = null;
    throw error;
  });

  return translateScriptPromise;
};

type TranslateMenuContextValue = {
  isOpen: boolean;
  open: (anchor: HTMLElement | null) => void;
  close: () => void;
  toggle: (anchor: HTMLElement | null) => void;
};

const TranslateMenuContext = createContext<TranslateMenuContextValue | null>(
  null,
);

export function TranslateMenuProvider({ children }: { children: ReactNode }) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [translateReady, setTranslateReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const containerId = "translate-menu-portal";
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      document.body.appendChild(container);
    }

    setPortalContainer(container);
  }, []);

  useEffect(() => {
    if (!anchorEl) {
      return;
    }

    if (!document.body.contains(anchorEl)) {
      setAnchorEl(null);
      setIsOpen(false);
    }
  }, [anchorEl, pathname]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const open = useCallback((anchor: HTMLElement | null) => {
    if (anchor) {
      setAnchorEl(anchor);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(
    (anchor: HTMLElement | null) => {
      if (isOpen) {
        setIsOpen(false);
        return;
      }
      if (anchor) {
        setAnchorEl(anchor);
      }
      setIsOpen(true);
    },
    [isOpen],
  );

  useEffect(() => {
    if (!isOpen || !anchorEl) {
      return undefined;
    }

    const updatePosition = () => {
      const rect = anchorEl.getBoundingClientRect();
      const right = Math.max(12, window.innerWidth - rect.right);
      const top = rect.bottom + 12;
      setPopoverPosition({ top, right });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, anchorEl]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current?.contains(event.target as Node)) {
        return;
      }

      if (anchorEl?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, anchorEl]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (translateReady) {
      return;
    }

    if (!popoverPosition) {
      return;
    }

    const element = document.getElementById(TRANSLATE_ELEMENT_ID);
    if (!element) {
      return;
    }

    setLoadError(false);

    let isActive = true;

    const initTranslate = () => {
      if (element.childElementCount > 0) {
        setTranslateReady(true);
        return;
      }

      const translate = window.google?.translate;
      if (!translate?.TranslateElement) {
        return;
      }

      const config: {
        pageLanguage: string;
        layout?: unknown;
        autoDisplay?: boolean;
      } = {
        pageLanguage: "en",
        autoDisplay: false,
      };

      const layout = translate.TranslateElement?.InlineLayout?.SIMPLE;
      if (layout) {
        config.layout = layout;
      }

      try {
        new translate.TranslateElement(config, TRANSLATE_ELEMENT_ID);
        setTranslateReady(true);
      } catch (error) {
        setLoadError(true);
      }
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loadGoogleTranslate()
      .then(() => {
        if (!isActive) {
          return;
        }
        initTranslate();
      })
      .catch(() => {
        if (isActive) {
          setLoadError(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [isOpen, translateReady, popoverPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const element = document.getElementById(TRANSLATE_ELEMENT_ID);
    if (element && element.childElementCount === 0) {
      setTranslateReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!translateReady) {
      return;
    }

    const cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith("googtrans="));
    if (!cookie) {
      return;
    }

    const value = decodeURIComponent(cookie.split("=")[1] || "");
    const parts = value.split("/");
    const targetLang = parts[parts.length - 1];
    if (!targetLang || targetLang === "en") {
      return;
    }

    const select = document.querySelector(
      ".goog-te-combo",
    ) as HTMLSelectElement | null;
    if (!select) {
      return;
    }

    select.value = targetLang;
    select.dispatchEvent(new Event("change"));
  }, [pathname, translateReady]);

  const contextValue = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
    }),
    [isOpen, open, close, toggle],
  );

  return (
    <TranslateMenuContext.Provider value={contextValue}>
      {children}
      {portalContainer &&
        createPortal(
          <div
            className={`translate-popover${isOpen ? " open" : ""}`}
            role="dialog"
            aria-label="Translation options"
            aria-hidden={!isOpen}
            style={{
              position: "fixed",
              top: `${popoverPosition?.top ?? 80}px`,
              right: `${popoverPosition?.right ?? 20}px`,
            }}
            ref={popoverRef}
          >
            <div className="translate-heading">Translate this page</div>
            <div className="translate-subtitle">
              Powered by Google Translate
            </div>
            {!translateReady && !loadError && (
              <div className="translate-loading">Loading languages...</div>
            )}
            {loadError && (
              <div className="translate-loading error">
                Translation is unavailable right now.
              </div>
            )}
            {!translateReady && (
              <div className="translate-hint">
                If you see &quot;Translation unavailable&quot; or similar, try
                reloading this page. If nothing appears yet, please give it a
                moment to load or reload the page.
              </div>
            )}
            <div
              id={TRANSLATE_ELEMENT_ID}
              className="google-translate-element"
            />
          </div>,
          portalContainer,
        )}
      <style jsx>{`
        .translate-popover {
          min-width: 240px;
          background: var(--container-background);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 0.9rem 1rem 1rem;
          box-shadow: 0 18px 32px rgba(0, 0, 0, 0.18);
          opacity: 0;
          transform: translateY(-6px);
          pointer-events: none;
          transition:
            opacity 0.18s ease,
            transform 0.18s ease;
          z-index: 120000;
        }

        .translate-popover.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .translate-heading {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 0.35rem;
        }

        .translate-subtitle {
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(51, 51, 51, 0.7);
          margin-bottom: 0.65rem;
        }

        :global(.dark) .translate-subtitle {
          color: rgba(247, 247, 247, 0.7);
        }

        .translate-loading {
          font-size: 0.82rem;
          color: rgba(51, 51, 51, 0.7);
          margin-bottom: 0.5rem;
        }

        :global(.dark) .translate-loading {
          color: rgba(247, 247, 247, 0.7);
        }

        .translate-loading.error {
          color: #b42318;
        }

        :global(.dark) .translate-loading.error {
          color: #f97066;
        }

        .translate-hint {
          font-size: 0.75rem;
          color: rgba(51, 51, 51, 0.65);
          line-height: 1.4;
          margin-bottom: 0.6rem;
        }

        :global(.dark) .translate-hint {
          color: rgba(247, 247, 247, 0.65);
        }

        .google-translate-element {
          display: flex;
          align-items: center;
        }

        .google-translate-element :global(.goog-te-gadget) {
          font-family: "Inter", sans-serif;
          color: var(--text-color);
          font-size: 0.8rem;
        }

        .google-translate-element :global(.goog-te-combo) {
          width: 100%;
          padding: 0.45rem 0.75rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--background-color);
          color: var(--text-color);
          font-size: 0.9rem;
          font-family: "Inter", sans-serif;
          outline: none;
        }

        .google-translate-element :global(.goog-te-combo:focus) {
          border-color: var(--link-color);
          box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.2);
        }

        .google-translate-element :global(.goog-logo-link) {
          color: var(--link-color);
        }

        .google-translate-element :global(.goog-logo-link:hover) {
          color: var(--hover-link-color);
        }

        @media (max-width: 700px) {
          .translate-popover {
            min-width: 200px;
          }
        }
      `}</style>
    </TranslateMenuContext.Provider>
  );
}

export function useTranslateMenu() {
  const context = useContext(TranslateMenuContext);
  if (!context) {
    throw new Error(
      "useTranslateMenu must be used within TranslateMenuProvider",
    );
  }
  return context;
}
