import { useContext } from "react";
import { SettingsContext } from "./SettingsProvider";

// This hook is the public facade for the React components.
export const useTerminalSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useTerminalSettings must be used within a SettingsProvider",
    );
  }
  return context;
};
