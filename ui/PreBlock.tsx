"use client";

import React, { useContext } from "react";
import { DarkModeContext } from "@/provider/DarkModeProvider";

type PreBlockProps = {
  children: React.ReactNode;
};

const PreBlock = ({ children }: PreBlockProps) => {
  const { darkMode } = useContext(DarkModeContext);

  const preStyle: React.CSSProperties = {
    backgroundColor: darkMode ? "#1e1e1e" : "#f5f5f5", // ✅ Dark: VS Code dark | Light: Light gray
    color: darkMode ? "#ddd" : "#000", // ✅ Text: Light in dark mode, dark in light mode
    padding: "1rem",
    borderRadius: "8px",
    overflowX: "auto",
    marginBottom: "1rem",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap", // ✅ Prevents horizontal scrolling for long lines
  };

  return <pre style={preStyle}>{children}</pre>;
};

export default PreBlock;
