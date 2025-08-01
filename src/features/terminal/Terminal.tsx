import { useMemo } from "react";

// Import the headless engines
import { TerminalEngine } from "./TerminalEngine";
import { SettingsEngine } from "./settings/SettingsEngine";

// Import the context providers
import { TerminalProvider } from "./context/TerminalProvider"; // Assuming you create this provider
import { SettingsProvider } from "./settings/context/SettingsProvider";

// Import the main UI window component
import { TerminalWindow } from "./components/TerminalWindow";

/**
 * The root component for the Terminal feature.
 *
 * Responsibilities:
 * 1. Instantiate the headless engines (`TerminalEngine`, `SettingsEngine`).
 * 2. Wire up dependencies (e.g., passing the settings engine to the terminal engine).
 * 3. Set up the React Context Providers to make the engines and state available
 *    to all child components.
 *
 * It is now a self-contained unit that can be dropped into any application.
 */
export const Terminal = () => {
  // Instantiate engines once using useMemo to ensure they persist across re-renders.
  const settingsEngine = useMemo(() => new SettingsEngine(), []);
  const terminalEngine = useMemo(
    () => new TerminalEngine(settingsEngine),
    [settingsEngine],
  );

  return (
    // The Providers wrap the UI, making engine instances and state available via hooks.
    <TerminalProvider engine={terminalEngine}>
      <SettingsProvider engine={settingsEngine}>
        <TerminalWindow />
      </SettingsProvider>
    </TerminalProvider>
  );
};
