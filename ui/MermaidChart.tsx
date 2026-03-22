"use client";

import React, { useEffect, useRef, useState, useContext } from "react";
import { DarkModeContext } from "@/provider/DarkModeProvider";

let mermaidInitialized = false;
let currentTheme: string | null = null;

async function getMermaid() {
  const mod = await import("mermaid");
  return mod.default;
}

async function initMermaid(dark: boolean) {
  const mermaid = await getMermaid();
  const theme = dark ? "dark" : "default";
  if (mermaidInitialized && currentTheme === theme) return mermaid;
  mermaid.initialize({
    startOnLoad: false,
    theme,
    fontFamily: "Inter, system-ui, sans-serif",
    securityLevel: "loose",
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
    sequence: { useMaxWidth: true },
    gantt: { useMaxWidth: true },
  });
  mermaidInitialized = true;
  currentTheme = theme;
  return mermaid;
}

let idCounter = 0;

interface MermaidChartProps {
  chart: string;
}

export default function MermaidChart({ chart }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { darkMode } = useContext(DarkModeContext);
  const idRef = useRef(`mermaid-${Date.now()}-${++idCounter}`);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = await initMermaid(darkMode);
        const { svg: rendered } = await mermaid.render(
          idRef.current,
          chart.trim(),
        );
        if (!cancelled) {
          setSvg(rendered);
          setError("");
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Failed to render diagram");
          setSvg("");
        }
      }
    }

    // Reset ID for re-render (mermaid requires unique IDs)
    idRef.current = `mermaid-${Date.now()}-${++idCounter}`;
    render();

    return () => {
      cancelled = true;
    };
  }, [chart, darkMode]);

  if (error) {
    return (
      <div
        style={{
          background: darkMode ? "#2a1215" : "#fef2f2",
          border: `1px solid ${darkMode ? "#7f1d1d" : "#fecaca"}`,
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1.5rem",
          fontFamily: "monospace",
          fontSize: "0.85rem",
          color: darkMode ? "#fca5a5" : "#991b1b",
          whiteSpace: "pre-wrap",
          overflowX: "auto",
        }}
      >
        <strong>Mermaid diagram error:</strong>
        <br />
        {error}
        <details style={{ marginTop: "0.5rem" }}>
          <summary style={{ cursor: "pointer" }}>Source</summary>
          <pre style={{ marginTop: "0.5rem" }}>{chart}</pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "1.5rem",
        overflowX: "auto",
        background: darkMode ? "#1e1e2e" : "#f8f9fa",
        borderRadius: "8px",
        padding: "1.25rem",
        border: `1px solid ${darkMode ? "#333" : "#e2e8f0"}`,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
