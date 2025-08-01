import React from "react";
import { useTerminal } from "../hooks/useTerminal";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";
import { useTerminalEvents } from "../context/useTerminalEvents";

// FIX: Changed from { TerminalInput } to TerminalInput (default import)
import TerminalInput from "./TerminalInput";
// FIX: Changed from { TerminalOutput } to TerminalOutput (default import)
import TerminalOutput from "./TerminalOutput";

export const TerminalWindow = () => {
  // FIX: useTerminal() now takes no arguments, as it gets the engine from context.
  const { lines, engineState, submit, getPreviousCommand, getNextCommand } =
    useTerminal();

  const { settings } = useTerminalSettings();
  const { dispatchEvent } = useTerminalEvents();

  const windowStyle: React.CSSProperties = {
    border: "1px solid #555",
    background: "#222",
    color: "#eee",
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    height: "400px",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={windowStyle} data-theme={settings.theme}>
      <TerminalOutput lines={lines} />
      {engineState === "AWAITING_EVENT" && (
        <button
          onClick={() => dispatchEvent("user-confirmed")}
          style={{
            background: "#444",
            color: "#fff",
            border: "1px solid #888",
            borderRadius: 4,
            padding: "4px 12px",
            margin: "8px 0 8px 10px",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          Confirm
        </button>
      )}
      <TerminalInput
        onSubmit={submit}
        onArrowUp={getPreviousCommand}
        onArrowDown={getNextCommand}
        disabled={engineState !== "IDLE"}
        promptSymbol={settings.promptSymbol}
      />
    </div>
  );
};

export default TerminalWindow;
