"use client";

import React, { useState, useContext } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy, Check } from "lucide-react";
import { DarkModeContext } from "@/provider/DarkModeProvider";

type CodeBlockProps = {
  children: string;
  className?: string;
};

const darkStyle = {
  ...materialDark,
  "pre[class*='language-']": {
    ...materialDark["pre[class*='language-']"],
    borderRadius: "8px",
    padding: "1rem",
    position: "relative",
    overflow: "auto",
  },
};

const lightStyle = {
  ...materialLight,
  "pre[class*='language-']": {
    ...materialLight["pre[class*='language-']"],
    background: "#f5f5f5",
    borderRadius: "8px",
    padding: "1rem",
    position: "relative",
    overflow: "auto",
  },
};

const CodeBlock = ({ children, className, ...props }: CodeBlockProps) => {
  const language = className ? className.replace(/language-/, "") : "";
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  // @ts-ignore
  const { darkMode } = useContext(DarkModeContext);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div style={{ position: "relative", marginBottom: "1.5rem" }}>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "0.25rem",
          right: "0.25rem",
          zIndex: 10,
          padding: "0.4rem 0.6rem",
          border: "none",
          background: copied ? "#4caf50" : "#0070f3",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer",
          font: "inherit",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          opacity: hovered ? 1 : 0.8,
          boxShadow: hovered
            ? "0 4px 8px rgba(0, 0, 0, 0.15)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "background 0.3s, transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={(event) => {
          (event.target as HTMLButtonElement).style.transform = "scale(0.95)";
        }}
        onMouseUp={(event) => {
          (event.target as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={language}
        // @ts-ignore
        style={darkMode ? darkStyle : lightStyle}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
