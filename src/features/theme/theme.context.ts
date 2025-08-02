// src/features/theme/theme.context.ts

import { createContext } from "react";
import { ThemeRegistryEntry } from "./themes";

// This is the shape of the data that the useTheme() hook will return.
export interface ThemeContextValue {
  /** The list of all available themes. */
  themes: ThemeRegistryEntry[];
  /** The full theme object for the currently active theme. */
  activeTheme: { themeType: string; [key: string]: any };
  /** The unique ID of the currently active theme. */
  activeThemeId: string;
  /** A function to change the active theme by its ID. */
  setThemeById: (id: string) => void;
}

// Create the context with a default value of `undefined`.
// The `useTheme` hook will handle the case where this is undefined.
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
