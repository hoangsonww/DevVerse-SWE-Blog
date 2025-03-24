"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer
      className="fade-in"
      style={{
        textAlign: "center",
        padding: "1rem 2rem",
        backgroundColor: "var(--footer-background-color, #f0f0f0)",
        borderTop: "1px solid var(--footer-border-color, #eaeaea)",
        marginTop: "2rem",
        color: "var(--text-color, #333)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      &copy; {year}{" "}
      <a
        href="https://github.com/hoangsonww"
        target="_blank"
        rel="noopener noreferrer"
      >
        Son (David) Nguyen
      </a>
      . All rights reserved.
    </footer>
  );
}
