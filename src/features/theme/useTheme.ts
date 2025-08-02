// src/features/theme/useTheme.ts

import { useContext } from "react";
import { ThemeContext, ThemeContextValue } from "./theme.context";

/**
 * A hook to access the global theming system.
 * Provides the active theme, a list of all themes, and a function to change the theme.
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  // This check ensures the hook is only used within a <ThemeProvider>.
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
