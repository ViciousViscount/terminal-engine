// src/features/terminal/components/SettingsPanel.tsx

import React from "react";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";
import { NeuromorphicSurface } from "../../theme/components/NeuromorphicSurface";
import { useTheme } from "../../theme/useTheme";
import { NeuromorphicTheme } from "../../theme-shapers/neuromorphic";

export const SettingsPanel = () => {
  const { settings, setSetting } = useTerminalSettings();
  const { activeTheme } = useTheme();

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

  // Theme-agnostic styles that look good on light or dark backgrounds
  const inputStyle: React.CSSProperties = {
    backgroundColor: "rgba(0,0,0,0.2)",
    color: "inherit",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "4px",
    padding: "2px 4px",
  };

  // Get the secondary surface color from the active theme
  const surfaceColor =
    (activeTheme as NeuromorphicTheme)?.surfaceColor || "#333";

  return (
    <NeuromorphicSurface
      styleOverrides={{
        baseColor: surfaceColor,
        elevation: 0,
        borderRadius: 0,
        // We can add a subtle inner shadow to separate it
        innerShadow: {
          offsetX: 0,
          offsetY: 2,
          blur: 4,
          color: "rgba(0,0,0,0.1)",
        },
      }}
      className="p-4" // Use Tailwind for padding
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
        <label htmlFor="line-height" style={labelStyle}>
          Line Height:
        </label>
        <input
          id="line-height"
          type="number"
          step="0.1"
          value={settings.lineHeight}
          onChange={(e) =>
            setSetting("lineHeight", parseFloat(e.target.value) || 1.5)
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
        <label htmlFor="font-family" style={labelStyle}>
          Font Family:
        </label>
        <input
          id="font-family"
          type="text"
          value={settings.fontFamily}
          onChange={(e) => setSetting("fontFamily", e.target.value)}
          style={{ ...inputStyle, width: "150px" }}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="base-color" style={labelStyle}>
          Background Color:
        </label>
        <input
          id="base-color"
          type="color"
          value={settings.baseColor}
          onChange={(e) => setSetting("baseColor", e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="text-color" style={labelStyle}>
          Text Color:
        </label>
        <input
          id="text-color"
          type="color"
          value={settings.textColor}
          onChange={(e) => setSetting("textColor", e.target.value)}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="accent-color" style={labelStyle}>
          Accent Color:
        </label>
        <input
          id="accent-color"
          type="color"
          value={settings.accentColor}
          onChange={(e) => setSetting("accentColor", e.target.value)}
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
    </NeuromorphicSurface>
  );
};
