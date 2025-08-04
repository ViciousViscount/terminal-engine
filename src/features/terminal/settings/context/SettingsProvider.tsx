// src/features/terminal/settings/context/SettingsProvider.tsx

import { useState, useEffect, ReactNode, useMemo } from "react";
import { SettingsEngine } from "../SettingsEngine";
import { TerminalSettings } from "../types";
import { SettingsContext, SettingsContextValue } from "./settings.context";

export const SettingsProvider = ({
  children,
  engine,
}: {
  children: ReactNode;
  engine: SettingsEngine;
}) => {
  const [settings, setSettings] = useState<TerminalSettings>(() =>
    engine.getAll(),
  );

  useEffect(() => {
    const handleSettingsChange = () => {
      setSettings({ ...engine.getAll() });
    };
    engine.on("settings:changed", handleSettingsChange);
    return () => {
      engine.off("settings:changed", handleSettingsChange);
    };
  }, [engine]);

  const value: SettingsContextValue = useMemo(
    () => ({
      settings,
      setSetting: (key, value) => engine.set(key, value),
      loadPreset: (preset) => engine.loadPreset(preset), // Pass the function through
    }),
    [settings, engine],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
