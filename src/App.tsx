import { useMemo } from "react";
import { TerminalEngine } from "./features/terminal/TerminalEngine";
import { TerminalProvider } from "./features/terminal/context/TerminalContext";
import TerminalWindow from "./features/terminal/components/TerminalWindow";

function App() {
  // Memoize the engine so it persists for the app's lifetime
  const terminalEngine = useMemo(() => new TerminalEngine(), []);

  return (
    <TerminalProvider engine={terminalEngine}>
      <div style={{ maxWidth: 700, margin: "40px auto", padding: 24 }}>
        <h1>My App with an Interactive Terminal</h1>
        <p>
          Type <b>help</b> in the terminal to see commands.
        </p>
        <p>
          Try typing <b>confirm</b> and then clicking the confirm button that
          appears.
        </p>
        <TerminalWindow engine={terminalEngine} />
      </div>
    </TerminalProvider>
  );
}

export default App;
