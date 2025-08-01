import { createContext } from "react";
import { TerminalSettings } from "../types";

export interface SettingsContextValue {
  settings: TerminalSettings;
  setSetting: <K extends keyof TerminalSettings>(
    key: K,
    value: TerminalSettings[K],
  ) => void;
}

// This file only exports the context object, no components.
export const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined,
);
