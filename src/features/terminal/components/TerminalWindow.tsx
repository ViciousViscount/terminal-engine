// src/features/terminal/components/TerminalWindow.tsx

import { useState } from "react";
import { useTerminal } from "../hooks/useTerminal";
import { useTerminalEvents } from "../context/useTerminalEvents";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";
import { NeuromorphicSurface } from "../../theme/components/NeuromorphicSurface";
import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";
import { SettingsPanel } from "./SettingsPanel";

export const TerminalWindow = () => {
  const { lines, engineState, submit, getPreviousCommand, getNextCommand } =
    useTerminal();
  const { dispatchEvent } = useTerminalEvents();
  const { settings } = useTerminalSettings();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <NeuromorphicSurface
      styleOverrides={{ borderRadius: 16, concave: true, elevation: 5 }}
      className="terminal-window-container"
    >
      <div
        style={{
          height: "400px",
          display: "flex",
          flexDirection: "column",
          borderRadius: "inherit",
          overflow: "hidden",
          fontSize: `${settings.fontSize}px`,
          fontFamily: settings.fontFamily,
        }}
      >
        <div style={{ padding: "5px 10px", background: "rgba(0,0,0,0.1)" }}>
          <NeuromorphicSurface
            as="button"
            onClick={() => setShowSettings(!showSettings)}
            styleOverrides={{ elevation: 2, borderRadius: 6 }}
            className="px-3 py-1 text-xs"
          >
            {showSettings ? "Hide Settings" : "Show Settings"}
          </NeuromorphicSurface>
        </div>

        {showSettings && <SettingsPanel />}

        <TerminalOutput lines={lines} />

        {engineState === "AWAITING_EVENT" && (
          <div style={{ padding: "0 10px 8px" }}>
            <NeuromorphicSurface
              as="button"
              onClick={() => dispatchEvent("user-confirmed")}
              styleOverrides={{
                elevation: 2,
                borderRadius: 6,
                accent: "#50fa7b",
              }}
              className="px-4 py-1 text-sm font-bold"
            >
              Confirm
            </NeuromorphicSurface>
          </div>
        )}

        <TerminalInput
          onSubmit={submit}
          onArrowUp={getPreviousCommand}
          onArrowDown={getNextCommand}
          disabled={engineState !== "IDLE"}
        />
      </div>
    </NeuromorphicSurface>
  );
};

export default TerminalWindow;
