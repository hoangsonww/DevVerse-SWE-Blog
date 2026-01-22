"use client";

import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

type BackToTopPlacement = "floating" | "toc";

interface BackToTopButtonProps {
  placement?: BackToTopPlacement;
  scrollThreshold?: number;
  showWhenNavbarHidden?: boolean;
  className?: string;
}

export default function BackToTopButton({
  placement = "floating",
  scrollThreshold = 10,
  showWhenNavbarHidden = false,
  className,
}: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Listen for changes to the dark mode class on the document.
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Toggle button visibility when scrolling.
  useEffect(() => {
    if (!showWhenNavbarHidden) {
      const toggleVisibility = () => {
        setVisible(window.scrollY > scrollThreshold);
      };

      toggleVisibility();
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }

    const navbar = document.querySelector(".navbar");
    if (!navbar) {
      setVisible(window.scrollY > scrollThreshold);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 },
    );

    observer.observe(navbar);
    return () => observer.disconnect();
  }, [scrollThreshold, showWhenNavbarHidden]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  const placementClass =
    placement === "toc" ? "back-to-top--toc" : "back-to-top--floating";

  return (
    <>
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`back-to-top ${placementClass} ${className ?? ""}`.trim()}
      >
        <FiArrowUp size={20} />
      </button>
      <style jsx>{`
        .back-to-top {
          position: fixed;
          background-color: #0070f3;
          color: #fff;
          border: none;
          border-radius: 8px;
          width: 3rem;
          height: 3rem;
          cursor: pointer;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          opacity: 0;
          transform: scale(0.5);
          animation: fadeInScale 0.3s forwards;
          transition:
            background-color 0.3s ease,
            color 0.3s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .back-to-top--floating {
          bottom: 2rem;
          right: 2rem;
        }

        .back-to-top--toc {
          top: 32px;
          right: 20px;
          z-index: 100001;
        }

        @media (max-width: 1024px) {
          .back-to-top--toc {
            top: auto;
            bottom: 2rem;
            right: 2rem;
            z-index: 1000;
          }
        }

        .back-to-top:hover {
          backdrop-filter: blur(5px);
          transform: scale(1.1);
          box-shadow: ${isDark
            ? "0 4px 14px rgba(255, 255, 255, 0.5)"
            : "0 4px 14px rgba(0, 0, 0, 0.5)"};
        }
        @keyframes fadeInScale {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
