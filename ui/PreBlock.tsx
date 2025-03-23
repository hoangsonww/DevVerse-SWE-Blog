"use client";

import React, { useContext } from "react";
import { DarkModeContext } from "@/provider/DarkModeProvider";

type PreBlockProps = {
  children: React.ReactNode;
};

const PreBlock: React.FC<PreBlockProps> = ({ children }) => {
  const { darkMode } = useContext(DarkModeContext);

  const preStyle: React.CSSProperties = {
    backgroundColor: darkMode ? "#1e1e1e" : "#f5f5f5",
    color: darkMode ? "#ddd" : "#000",
    padding: "1rem",
    borderRadius: "8px",
    overflowX: "auto",
    marginBottom: "1rem",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
  };

  return <pre style={preStyle}>{children}</pre>;
};

export default PreBlock;
