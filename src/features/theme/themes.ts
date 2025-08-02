// src/features/theme/themes.ts

// Import the concrete theme objects from their shaper module
import {
  darkMatteTheme,
  lightGlossyTheme,
} from "../theme-shapers/neuromorphic/themes";

// We can define a common interface for the registry entries
export interface ThemeRegistryEntry {
  /** A unique identifier for the theme, used for localStorage. */
  id: string;
  /** The human-readable name for display in a UI switcher. */
  name: string;
  /** The actual theme data object. */
  theme: { themeType: string; [key: string]: any }; // A generic but typed object
}

export const availableThemes: ThemeRegistryEntry[] = [
  {
    id: "dark-matte",
    name: "Dark Matte",
    theme: darkMatteTheme,
  },
  {
    id: "light-glossy",
    name: "Light Glossy",
    theme: lightGlossyTheme,
  },
  // In the future, you could add other themes here:
  // { id: 'flat-design', name: 'Flat Design', theme: flatThemeObject },
];
