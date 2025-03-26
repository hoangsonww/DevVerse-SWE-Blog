"use client";

import React, { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTopButton() {
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
    const toggleVisibility = () => {
      if (window.pageYOffset || window.scrollY >= 10) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <>
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="back-to-top"
      >
        <FiArrowUp size={20} />
      </button>
      <style jsx>{`
        .back-to-top {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
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
