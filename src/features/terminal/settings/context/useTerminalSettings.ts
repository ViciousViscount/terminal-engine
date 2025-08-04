// src/features/terminal/settings/context/useTerminalSettings.ts

import { useContext } from "react";
import { SettingsContext, SettingsContextValue } from "./settings.context";

// This custom hook provides a convenient way to access the terminal settings.
// It abstracts away the `useContext` call and provides a safety check.
export const useTerminalSettings = (): SettingsContextValue => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useTerminalSettings must be used within a SettingsProvider",
    );
  }
  return context;
};
