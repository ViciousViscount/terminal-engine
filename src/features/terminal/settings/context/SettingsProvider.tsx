import { useState, useEffect, ReactNode, useMemo } from "react";
import { SettingsEngine } from "../SettingsEngine";
import { TerminalSettings, SettingChangeEvent } from "../types";

// Import the context object from our new file.
import { SettingsContext, SettingsContextValue } from "./settings.context";

interface SettingsProviderProps {
  children: ReactNode;
  engine: SettingsEngine;
}

// This file now only exports the provider, satisfying the linter.
export const SettingsProvider = ({
  children,
  engine,
}: SettingsProviderProps) => {
  const [settings, setSettings] = useState<TerminalSettings>(() =>
    engine.getAll(),
  );

  useEffect(() => {
    const handleSettingsChange = (event: SettingChangeEvent<any>) => {
      setSettings((prev) => ({ ...prev, [event.key]: event.value }));
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
    }),
    [settings, engine],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
export { SettingsContext };
