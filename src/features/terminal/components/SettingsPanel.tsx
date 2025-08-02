// src/features/terminal/components/SettingsPanel.tsx

import React from "react";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";

export const SettingsPanel = () => {
  const { settings, setSetting } = useTerminalSettings();

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  };

  const labelStyle: React.CSSProperties = {
    marginRight: "16px",
    whiteSpace: "nowrap",
  };

  const inputStyle: React.CSSProperties = {
    width: "60px",
    backgroundColor: "rgba(0,0,0,0.2)",
    color: "inherit",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "4px",
    padding: "2px 4px",
  };

  return (
    <div
      style={{
        padding: "10px 15px",
        borderTop: "1px solid rgba(0,0,0,0.2)",
        borderBottom: "1px solid rgba(0,0,0,0.2)",
        background: "rgba(0,0,0,0.1)",
      }}
    >
      <div style={fieldStyle}>
        <label htmlFor="font-size" style={labelStyle}>
          Font Size:
        </label>
        <input
          id="font-size"
          type="number"
          value={settings.fontSize}
          onChange={(e) =>
            setSetting("fontSize", parseInt(e.target.value, 10) || 14)
          }
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="prompt" style={labelStyle}>
          Prompt Symbol:
        </label>
        <input
          id="prompt"
          type="text"
          value={settings.promptSymbol}
          onChange={(e) => setSetting("promptSymbol", e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="show-timestamp" style={labelStyle}>
          Show Timestamps:
        </label>
        <input
          id="show-timestamp"
          type="checkbox"
          checked={settings.showTimestamp}
          onChange={(e) => setSetting("showTimestamp", e.target.checked)}
        />
      </div>
    </div>
  );
};
