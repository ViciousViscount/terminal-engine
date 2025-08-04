// src/features/terminal/settings/context/settings.context.ts

import { createContext } from "react";
import { TerminalSettings } from "../types";

export interface SettingsContextValue {
  settings: TerminalSettings;
  setSetting: <K extends keyof TerminalSettings>(
    key: K,
    value: TerminalSettings[K],
  ) => void;
  loadPreset: (preset: TerminalSettings) => void; // Add the new function
}

export const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);
