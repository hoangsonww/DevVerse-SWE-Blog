"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";

type DarkModeContextValue = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DarkModeContext = createContext<DarkModeContextValue>({
  darkMode: false,
  setDarkMode: () => {},
});

export function DarkModeProvider({ children }: PropsWithChildren) {
  const [darkMode, setDarkMode] = useState(() => {
    // Check if window exists (i.e. client side)
    if (typeof window !== "undefined") {
      // Try to get user preference from localStorage
      const storedPreference = localStorage.getItem("darkMode");
      if (storedPreference !== null) {
        return storedPreference === "true";
      }
      // Fallback to system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Update document and localStorage when darkMode changes.
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode ? "true" : "false");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
