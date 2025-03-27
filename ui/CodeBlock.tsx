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
  comment: { color: "#7f848e" },
  parameter: { color: "#e06c75" },
  "property-access": { color: "#56b6c2" },
  "known-class-name": { color: "#61afef" },
  "template-string": { color: "#98c379" },
  interpolation: { color: "#d19a66" },
  imports: { color: "#c678dd" },
  "plain-text": { color: "#e5c07b" },
  keyword: { color: "#c678dd" },
  function: { color: "#d19a66" },
  operator: { color: "#56b6c2" },
  punctuation: { color: "#abb2bf" },
  "maybe-class-name": { color: "#61afef" },
};

const lightStyle = {
  ...materialLight,
  "pre[class*='language-']": {
    ...materialLight["pre[class*='language-']"],
    background: "#ffffff",
    borderRadius: "8px",
    padding: "1rem",
    position: "relative",
    overflow: "auto",
    color: "#24292e",
  },
  code: { ...materialLight.code, color: "#24292e" },
  plain: { color: "#24292e" },
  comment: { color: "#6a737d" },
  parameter: { color: "#d73a49" },
  "property-access": { color: "#0366d6" },
  "known-class-name": { color: "#005cc5" },
  "template-string": { color: "#032f62" },
  interpolation: { color: "#032f62" },
  imports: { color: "#6f42c1" },
  "plain-text": { color: "#24292e" },
  keyword: { color: "#d73a49" },
  function: { color: "#005cc5" },
  operator: { color: "#22863a" },
  punctuation: { color: "#24292e" },
  "maybe-class-name": { color: "#005cc5" },
};

const CodeBlock = ({ children, className, ...props }: CodeBlockProps) => {
  const language = className?.replace(/language-/, "").toUpperCase() || "CODE";
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { darkMode } = useContext(DarkModeContext);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy!");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        marginBottom: "1.5rem",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: darkMode ? "#2f363d" : "#fafafa",
          padding: "0.5rem 1rem",
          fontSize: "0.75rem",
          fontWeight: 600,
          color: darkMode ? "#e5e5e5" : "#333",
          textTransform: "uppercase",
          marginBottom: 0,
        }}
      >
        {language}
      </div>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          top: "0.25rem",
          right: "0.5rem",
          zIndex: 10,
          padding: "0.4rem 0.6rem",
          border: "none",
          background: copied ? "#4caf50" : "#0070f3",
          color: "#fff",
          borderRadius: "5px",
          cursor: "pointer",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          opacity: hovered ? 1 : 0.8,
          boxShadow: hovered
            ? "0 4px 8px rgba(0,0,0,0.15)"
            : "0 2px 4px rgba(0,0,0,0.1)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "background 0.3s, transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseDown={(e) =>
          ((e.target as HTMLButtonElement).style.transform = "scale(0.95)")
        }
        onMouseUp={(e) =>
          ((e.target as HTMLButtonElement).style.transform = "scale(1)")
        }
      >
        {copied ? <Check size={13} /> : <Copy size={13} />}{" "}
        {copied ? "Copied" : "Copy"}
      </button>

      <SyntaxHighlighter
        language={language.toLowerCase()}
        // @ts-ignore
        style={darkMode ? darkStyle : lightStyle}
        className={darkMode ? "dark-mode" : "light-mode"}
        customStyle={{
          borderRadius: 0,
          marginTop: 0,
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
        showLineNumbers
        {...props}
      >
        {children}
      </SyntaxHighlighter>

      <style jsx global>{`
        .light-mode span:not([class]) {
          color: #676767 !important;
        }
        .light-mode .token.comment {
          color: #6a737d !important;
        }
        .dark-mode .token.comment {
          color: #7f848e !important;
        }
        .react-syntax-highlighter-line-number {
          padding-left: 0.1rem !important;
          min-width: 2rem !important;
          text-align: right;
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;
