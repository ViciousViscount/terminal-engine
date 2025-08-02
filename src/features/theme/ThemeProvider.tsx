// src/features/theme/ThemeProvider.tsx

import { useState, useEffect, useMemo, ReactNode } from "react";
import { ThemeContext, ThemeContextValue } from "./theme.context";
import { availableThemes } from "./themes";

const THEME_STORAGE_KEY = "app-theme-id";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state by trying to load from localStorage,
  // falling back to the first available theme.
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      const storedId = window.localStorage.getItem(THEME_STORAGE_KEY);
      // Check if the stored ID is actually a valid theme
      if (storedId && availableThemes.some((t) => t.id === storedId)) {
        return storedId;
      }
    } catch (error) {
      console.error("Failed to read theme from localStorage", error);
    }
    // Fallback to the first theme in our registry
    return availableThemes[0]?.id || "dark-matte";
  });

  // A side effect to persist the chosen theme to localStorage whenever it changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, activeThemeId);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [activeThemeId]);

  // Find the full theme object based on the active ID.
  const activeTheme = useMemo(() => {
    return (
      availableThemes.find((t) => t.id === activeThemeId)?.theme ||
      availableThemes[0].theme
    );
  }, [activeThemeId]);

  // Create the context value object, memoized for performance.
  const value: ThemeContextValue = useMemo(
    () => ({
      themes: availableThemes,
      activeTheme,
      activeThemeId,
      setThemeById: setActiveThemeId,
    }),
    [activeTheme, activeThemeId],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
