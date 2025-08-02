// src/features/terminal/Terminal.tsx

import { useMemo } from "react";
import { TerminalEngine } from "./TerminalEngine";
import { SettingsEngine } from "./settings/SettingsEngine";
import { TerminalProvider } from "./context/TerminalProvider";
import { SettingsProvider } from "./settings/context/SettingsProvider";
import { TerminalWindow } from "./components/TerminalWindow";

// THE FIX: Define props for the Terminal component.
// The engine prop is now optional.
interface TerminalProps {
  engine?: TerminalEngine;
}

/**
 * The root component for the Terminal feature.
 * It can now either be fully self-contained or be controlled by a parent
 * component by passing in a pre-initialized engine instance.
 */
export const Terminal = ({ engine: providedEngine }: TerminalProps) => {
  // Create a memoized settings engine. It's always created internally.
  const settingsEngine = useMemo(() => new SettingsEngine(), []);

  // Use the provided engine if it exists, otherwise create a new one.
  const terminalEngine = useMemo(
    () => providedEngine || new TerminalEngine(settingsEngine),
    [providedEngine, settingsEngine],
  );

  return (
    <TerminalProvider engine={terminalEngine}>
      <SettingsProvider engine={settingsEngine}>
        <TerminalWindow />
      </SettingsProvider>
    </TerminalProvider>
  );
};
