"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FiChevronDown, FiGlobe } from "react-icons/fi";

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

type TranslateMenuVariant = "navbar" | "floating";

interface TranslateMenuProps {
  variant?: TranslateMenuVariant;
}

export default function TranslateMenu({
  variant = "navbar",
}: TranslateMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [translateReady, setTranslateReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const translateElementId = `google_translate_${reactId.replace(/:/g, "")}`;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      setLoadError(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    if (translateReady) {
      return undefined;
    }

    let isActive = true;

    const initTranslate = () => {
      const element = document.getElementById(translateElementId);
      if (!element) {
        return;
      }

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
        new translate.TranslateElement(config, translateElementId);
        setTranslateReady(true);
      } catch (error) {
        setLoadError(true);
      }
    };

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
  }, [menuOpen, translateReady, translateElementId]);

  const isFloating = variant === "floating";

  return (
    <div
      className={`translate-wrapper${isFloating ? " floating" : ""}`}
      ref={wrapperRef}
    >
      <button
        type="button"
        className={`translate-trigger${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-expanded={menuOpen}
        aria-haspopup="dialog"
        aria-controls={translateElementId}
      >
        <FiGlobe size={18} />
        <span className="label">Translate</span>
        <FiChevronDown size={16} />
      </button>

      <div
        className={`translate-popover${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-label="Translation options"
      >
        <div className="translate-heading">Translate this page</div>
        <div className="translate-subtitle">Powered by Google Translate</div>
        {!translateReady && !loadError && (
          <div className="translate-loading">Loading languages...</div>
        )}
        {loadError && (
          <div className="translate-loading error">
            Translation is unavailable right now.
          </div>
        )}
        <div id={translateElementId} className="google-translate-element" />
      </div>

      <style jsx>{`
        .translate-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .translate-wrapper.floating {
          position: fixed;
          top: 1.4rem;
          right: 1.8rem;
          z-index: 1001;
        }

        .translate-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(0, 112, 243, 0.35);
          background: linear-gradient(
            120deg,
            rgba(0, 112, 243, 0.16),
            rgba(0, 112, 243, 0.02)
          );
          color: var(--text-color);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          cursor: pointer;
          box-shadow: 0 10px 18px rgba(0, 112, 243, 0.18);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .translate-trigger:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 24px rgba(0, 112, 243, 0.25);
          border-color: rgba(0, 112, 243, 0.6);
          background: linear-gradient(
            120deg,
            rgba(0, 112, 243, 0.22),
            rgba(0, 112, 243, 0.06)
          );
        }

        :global(.dark) .translate-trigger {
          border-color: rgba(77, 171, 247, 0.35);
          background: linear-gradient(
            120deg,
            rgba(77, 171, 247, 0.2),
            rgba(18, 18, 18, 0.35)
          );
          box-shadow: 0 10px 18px rgba(15, 23, 42, 0.35);
        }

        :global(.dark) .translate-trigger:hover {
          border-color: rgba(77, 171, 247, 0.7);
          box-shadow: 0 14px 24px rgba(15, 23, 42, 0.45);
          background: linear-gradient(
            120deg,
            rgba(77, 171, 247, 0.28),
            rgba(18, 18, 18, 0.5)
          );
        }

        .translate-trigger.open {
          border-color: rgba(0, 112, 243, 0.7);
          background: linear-gradient(
            120deg,
            rgba(0, 112, 243, 0.28),
            rgba(0, 112, 243, 0.1)
          );
        }

        :global(.dark) .translate-trigger.open {
          border-color: rgba(77, 171, 247, 0.75);
          background: linear-gradient(
            120deg,
            rgba(77, 171, 247, 0.32),
            rgba(18, 18, 18, 0.55)
          );
        }

        .translate-trigger:focus-visible {
          outline: 2px solid var(--link-color);
          outline-offset: 2px;
        }

        .translate-popover {
          position: absolute;
          right: 0;
          top: calc(100% + 0.75rem);
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
          z-index: 1002;
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

        @media (max-width: 900px) {
          .translate-trigger .label {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .translate-wrapper.floating {
            top: 1rem;
            right: 1rem;
          }

          .translate-trigger {
            padding: 0.4rem 0.7rem;
          }

          .translate-popover {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}
