"use client";

import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
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
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    let initial: boolean;
    try {
      const stored = localStorage.getItem("darkMode");
      if (stored !== null) {
        initial = stored === "true";
      } else {
        initial = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    } catch {
      initial = false;
    }

    document.documentElement.classList.toggle("dark", initial);
    setDarkMode(initial);
  }, []);

  // Only update class/storage once preference changes
  useLayoutEffect(() => {
    if (darkMode === null) return;
    localStorage.setItem("darkMode", darkMode.toString());
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Don’t render children until we know darkMode — prevents flash
  if (darkMode === null) {
    return null;
  }

  return (
    // @ts-ignore
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
