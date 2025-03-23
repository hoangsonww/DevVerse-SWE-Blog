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
  // Override comment style for dark mode
  comment: {
    color: "#abb2bf",
  },
  // Custom token overrides for dark mode
  parameter: {
    color: "#e06c75", // Example: red-ish for parameters
  },
  "property-access": {
    color: "#56b6c2", // Example: teal for property access
  },
  "known-class-name": {
    color: "#61afef", // Example: blue for class names
  },
  "template-string": {
    color: "#98c379", // Example: green for template strings
  },
  interpolation: {
    color: "#d19a66", // Example: orange-ish for interpolations
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
    color: "#333", // default text color for the block
  },
  code: {
    ...materialLight.code,
    color: "#333",
  },
  plain: {
    color: "#333",
  },
  // Override comment style for light mode
  comment: {
    color: "#6a737d",
  },
  // Override token colors directly:
  parameter: {
    color: "#d73a49", // adjust as desired
  },
  "property-access": {
    color: "#6f42c1", // adjust as desired
  },
  "known-class-name": {
    color: "#0366d6", // adjust as desired
  },
  "template-string": {
    color: "#005cc5", // adjust as desired
  },
  interpolation: {
    color: "#005cc5", // adjust as desired
  },
};

const CodeBlock = ({ children, className, ...props }: CodeBlockProps) => {
  const language = className ? className.replace(/language-/, "") : "";
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
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
    <div
      style={{
        position: "relative",
        marginBottom: "1.5rem",
        borderRadius: "8px",
      }}
    >
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
        className={darkMode ? "dark-mode" : "light-mode"}
        customStyle={{ borderRadius: "8px" }}
        {...props}
      >
        {children}
      </SyntaxHighlighter>
      <style jsx global>{`
        .light-mode span:not([class]) {
          color: #676767 !important;
        }
      `}</style>
      <style jsx global>{`
        .light-mode .token.comment {
          color: #6a737d !important;
        }
        .dark-mode .token.comment {
          color: #abb2bf !important;
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;
