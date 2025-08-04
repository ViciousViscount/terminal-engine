// src/features/terminal/components/TerminalWindow.tsx

import { useState } from "react";
import { useTerminal } from "../hooks/useTerminal";
import { useTerminalEvents } from "../context/useTerminalEvents";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";
import { NeuromorphicSurface } from "../../theme/components/NeuromorphicSurface";
import { useTheme } from "../../theme/useTheme";
import { NeuromorphicTheme } from "../../theme-shapers/neuromorphic";
import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";
import { SettingsPanel } from "./SettingsPanel";

const GearIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 16.5V21a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2v-4.5" />
    <path d="M12 7.5V3a2 2 0 0 1 2 2h-4a2 2 0 0 1 2-2v4.5" />
    <path d="M7.5 12H3a2 2 0 0 0-2 2v-4a2 2 0 0 0 2 2h4.5" />
    <path d="M16.5 12H21a2 2 0 0 1 2 2v-4a2 2 0 0 1-2 2h-4.5" />
  </svg>
);

export const TerminalWindow = () => {
  const { lines, engineState, submit, getPreviousCommand, getNextCommand } =
    useTerminal();
  const { dispatchEvent } = useTerminalEvents();
  const { settings } = useTerminalSettings();
  const { activeTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const surfaceColor =
    (activeTheme as NeuromorphicTheme)?.surfaceColor || "#333";

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
          fontFamily: settings.fontFamily,
          fontSize: `${settings.fontSize}px`,
          lineHeight: settings.lineHeight,
          color: settings.textColor,
          ["--terminal-base-color" as any]: settings.baseColor,
          ["--terminal-accent-color" as any]: settings.accentColor,
        }}
      >
        <NeuromorphicSurface
          styleOverrides={{
            baseColor: surfaceColor,
            borderRadius: 0,
            elevation: 0,
          }}
          className="flex justify-end p-2"
        >
          <NeuromorphicSurface
            as="button"
            onClick={() => setShowSettings(!showSettings)}
            styleOverrides={{ elevation: 4, borderRadius: 999 }}
            className="p-2"
          >
            <GearIcon />
          </NeuromorphicSurface>
        </NeuromorphicSurface>

        {showSettings && <SettingsPanel />}

        <TerminalOutput lines={lines} />

        {engineState === "AWAITING_EVENT" && (
          <div className="p-2">
            <NeuromorphicSurface
              as="button"
              onClick={() => dispatchEvent("user-confirmed")}
              styleOverrides={{ elevation: 4, borderRadius: 6 }}
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
