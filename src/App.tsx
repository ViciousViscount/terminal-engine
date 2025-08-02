// src/App.tsx

import { useMemo } from "react";
import "./App.css";
import { Terminal } from "./features/terminal/Terminal";
import { ThemeProvider } from "./features/theme/ThemeProvider";
import { NeuromorphicSurface } from "./features/theme/components/NeuromorphicSurface";
import { ThemeSwitcher } from "./features/theme/components/ThemeSwitcher";
import { ThemedBackground } from "./features/theme/components/ThemedBackground";

// Import the engines so we can create them here.
import { TerminalEngine } from "./features/terminal/TerminalEngine";
import { SettingsEngine } from "./features/terminal/settings/SettingsEngine";

function App() {
  // STEP 1: Create the engine instances at the top level of the app.
  // We use useMemo to ensure they are only created once.
  const settingsEngine = useMemo(() => new SettingsEngine(), []);
  const terminalEngine = useMemo(
    () => new TerminalEngine(settingsEngine),
    [settingsEngine],
  );

  // Handler for a simulated "Player Joined" event
  const handlePlayerJoined = () => {
    terminalEngine.logEvent("Player 'Gandalf' has joined the server.", "GAME");
  };

  // Handler for a simulated "Item Looted" event with a data payload
  const handleItemLooted = () => {
    const item = { name: "Staff of Power", quality: "legendary", damage: 150 };
    terminalEngine.logEvent(
      `Player 'Gandalf' looted [${item.name}]!`,
      "INVENTORY",
      item,
    );
  };

  return (
    <ThemeProvider>
      <ThemedBackground />
      <ThemeSwitcher />
      <h1>React Terminal Engine</h1>

      {/* STEP 2: Add the "Game Event Simulator" buttons */}
      <div className="game-controls">
        <button onClick={handlePlayerJoined}>Simulate Player Join</button>
        <button onClick={handleItemLooted}>Simulate Item Loot</button>
      </div>

      <NeuromorphicSurface
        className="card"
        styleOverrides={{ borderRadius: 20 }}
      >
        {/* STEP 3: Pass the created engine instance to the Terminal component */}
        <Terminal engine={terminalEngine} />
      </NeuromorphicSurface>

      <p className="read-the-docs">
        A standalone terminal component built with React and TypeScript.
      </p>
    </ThemeProvider>
  );
}

export default App;
