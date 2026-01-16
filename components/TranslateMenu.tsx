"use client";

import { useRef } from "react";
import { FiChevronDown, FiGlobe } from "react-icons/fi";
import { useTranslateMenu } from "./TranslateMenuProvider";

const TRANSLATE_ELEMENT_ID = "google_translate_element";

type TranslateMenuVariant = "navbar" | "floating";

interface TranslateMenuProps {
  variant?: TranslateMenuVariant;
}

export default function TranslateMenu({
  variant = "navbar",
}: TranslateMenuProps) {
  const { isOpen, toggle } = useTranslateMenu();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isFloating = variant === "floating";

  return (
    <div className={`translate-wrapper${isFloating ? " floating" : ""}`}>
      <button
        type="button"
        className={`translate-trigger${isOpen ? " open" : ""}`}
        onClick={() => toggle(triggerRef.current)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={TRANSLATE_ELEMENT_ID}
        ref={triggerRef}
      >
        <FiGlobe size={18} />
        <span className="label">Translate</span>
        <FiChevronDown size={16} />
      </button>

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
          z-index: 110000;
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
        }
      `}</style>
    </div>
  );
}
