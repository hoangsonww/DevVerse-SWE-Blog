"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString()); // Ensure it's a string to match SSR output
  }, []);

  return (
    <footer
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
      &copy; {year ? year : "Loading..."}{" "}
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
