// src/features/terminal/components/SettingsPanel.tsx

import React, { useState } from "react";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";
import { NeuromorphicSurface } from "../../theme/components/NeuromorphicSurface";
// Import the presets to load them
import {
  SOFT_PRESET,
  CRISP_PRESET,
  FUTURISTIC_PRESET,
} from "../settings/SettingsEngine";

type SettingsTab = "presets" | "window" | "input" | "output" | "general";

const SliderControl = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: any) => (
  <div className="flex justify-between items-center mb-3 gap-4">
    <label htmlFor={label} className="whitespace-nowrap">
      {label}:
    </label>
    <div className="flex items-center gap-2 w-full">
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full"
      />
      <span className="w-12 text-right text-xs">
        {value}
        {unit}
      </span>
    </div>
  </div>
);

const ColorControl = ({ label, value, onChange }: any) => (
  <div className="flex justify-between items-center mb-3">
    <label>{label}:</label>
    <input
      type="color"
      value={value}
      onChange={onChange}
      className="bg-transparent"
    />
  </div>
);

export const SettingsPanel = () => {
  const { settings, setSetting, loadPreset } = useTerminalSettings();
  const [activeTab, setActiveTab] = useState<SettingsTab>("presets");

  const updateNested = (
    key: "window" | "input" | "output",
    property: string,
    value: any,
  ) => {
    setSetting(key, { ...settings[key], [property]: value });
  };

  return (
    <NeuromorphicSurface
      styleOverrides={{ baseColor: "#3d4052", elevation: 0, borderRadius: 0 }}
      className="text-sm"
    >
      <div className="flex border-b border-black/20">
        <TabButton id="presets" activeTab={activeTab} onClick={setActiveTab}>
          Presets
        </TabButton>
        <TabButton id="window" activeTab={activeTab} onClick={setActiveTab}>
          Window
        </TabButton>
        <TabButton id="input" activeTab={activeTab} onClick={setActiveTab}>
          Input
        </TabButton>
        <TabButton id="output" activeTab={activeTab} onClick={setActiveTab}>
          Output
        </TabButton>
        <TabButton id="general" activeTab={activeTab} onClick={setActiveTab}>
          General
        </TabButton>
      </div>
      <div className="p-4">
        {activeTab === "presets" && (
          <div>
            <h3 className="font-bold mb-3 text-base">Load a Preset</h3>
            <p className="text-xs opacity-70 mb-4">
              Presets will override your current settings.
            </p>
            <div className="flex gap-2">
              <PresetButton onClick={() => loadPreset(SOFT_PRESET)}>
                Soft
              </PresetButton>
              <PresetButton onClick={() => loadPreset(CRISP_PRESET)}>
                Crisp
              </PresetButton>
              <PresetButton onClick={() => loadPreset(FUTURISTIC_PRESET)}>
                Futuristic
              </PresetButton>
            </div>
          </div>
        )}
        {activeTab === "window" && (
          <div>
            <h3 className="font-bold mb-3 text-base">Window Styles</h3>
            <SliderControl
              label="Elevation"
              value={settings.window.elevation}
              min={0}
              max={50}
              onChange={(e: any) =>
                updateNested("window", "elevation", parseInt(e.target.value))
              }
            />
            <SliderControl
              label="Border Radius"
              value={settings.window.borderRadius}
              min={0}
              max={50}
              onChange={(e: any) =>
                updateNested("window", "borderRadius", parseInt(e.target.value))
              }
            />
            <SliderControl
              label="Light Angle"
              value={settings.window.lightSourceAngle}
              min={0}
              max={360}
              unit="°"
              onChange={(e: any) =>
                updateNested(
                  "window",
                  "lightSourceAngle",
                  parseInt(e.target.value),
                )
              }
            />
            <SliderControl
              label="Shadow Blur"
              value={settings.window.shadowBlur}
              min={0}
              max={100}
              onChange={(e: any) =>
                updateNested("window", "shadowBlur", parseInt(e.target.value))
              }
            />
            <SliderControl
              label="Shadow Intensity"
              value={settings.window.shadowIntensity}
              min={0}
              max={1}
              step={0.01}
              unit=""
              onChange={(e: any) =>
                updateNested(
                  "window",
                  "shadowIntensity",
                  parseFloat(e.target.value),
                )
              }
            />
            <ColorControl
              label="Background Color"
              value={settings.window.baseColor}
              onChange={(e: any) =>
                updateNested("window", "baseColor", e.target.value)
              }
            />
          </div>
        )}
        {activeTab === "input" && (
          <div>
            <h3 className="font-bold mb-3 text-base">Input Field Styles</h3>
            <SliderControl
              label="Elevation"
              value={settings.input.elevation}
              min={0}
              max={50}
              onChange={(e: any) =>
                updateNested("input", "elevation", parseInt(e.target.value))
              }
            />
            <SliderControl
              label="Border Radius"
              value={settings.input.borderRadius}
              min={0}
              max={50}
              onChange={(e: any) =>
                updateNested("input", "borderRadius", parseInt(e.target.value))
              }
            />
            <div className="flex justify-between items-center">
              <label>Concave (Pressed):</label>
              <input
                type="checkbox"
                checked={settings.input.concave}
                onChange={(e) =>
                  updateNested("input", "concave", e.target.checked)
                }
              />
            </div>
            <ColorControl
              label="Background Color"
              value={settings.input.baseColor}
              onChange={(e: any) =>
                updateNested("input", "baseColor", e.target.value)
              }
            />
          </div>
        )}
        {activeTab === "output" && (
          <div>
            <h3 className="font-bold mb-3 text-base">Output & Font Styles</h3>
            <ColorControl
              label="Text Color"
              value={settings.output.textColor}
              onChange={(e: any) =>
                updateNested("output", "textColor", e.target.value)
              }
            />
            <ColorControl
              label="Accent Color (Input)"
              value={settings.output.accentColor}
              onChange={(e: any) =>
                updateNested("output", "accentColor", e.target.value)
              }
            />
            <div className="flex justify-between items-center">
              <label>Font Size:</label>
              <input
                type="number"
                value={settings.fontSize}
                onChange={(e) =>
                  setSetting("fontSize", parseInt(e.target.value))
                }
                className="w-20 bg-black/20 text-inherit border border-white/10 rounded p-1"
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <label>Line Height:</label>
              <input
                type="number"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) =>
                  setSetting("lineHeight", parseFloat(e.target.value))
                }
                className="w-20 bg-black/20 text-inherit border border-white/10 rounded p-1"
              />
            </div>
          </div>
        )}
        {activeTab === "general" && (
          <div>
            <h3 className="font-bold mb-3 text-base">General</h3>
            <div className="flex justify-between items-center mb-3">
              <label>Font Family:</label>
              <input
                type="text"
                value={settings.fontFamily}
                onChange={(e) => setSetting("fontFamily", e.target.value)}
                className="w-40 bg-black/20 text-inherit border border-white/10 rounded p-1"
              />
            </div>
            <div className="flex justify-between items-center mb-3">
              <label>Prompt Symbol:</label>
              <input
                type="text"
                value={settings.promptSymbol}
                onChange={(e) => setSetting("promptSymbol", e.target.value)}
                className="w-20 bg-black/20 text-inherit border border-white/10 rounded p-1"
              />
            </div>
            <div className="flex justify-between items-center">
              <label>Show Timestamps:</label>
              <input
                type="checkbox"
                checked={settings.showTimestamp}
                onChange={(e) => setSetting("showTimestamp", e.target.checked)}
              />
            </div>
          </div>
        )}
      </div>
    </NeuromorphicSurface>
  );
};

// --- Helper UI Components ---
const TabButton: React.FC<{
  id: SettingsTab;
  activeTab: SettingsTab;
  onClick: (id: SettingsTab) => void;
  children: React.ReactNode;
}> = ({ id, activeTab, onClick, children }) => (
  <NeuromorphicSurface
    as="button"
    onClick={() => onClick(id)}
    styleOverrides={{
      concave: id === activeTab,
      elevation: id === activeTab ? 2 : 0,
      borderRadius: 0,
      baseColor: "transparent",
    }}
    className={`px-4 py-2 font-bold transition-opacity ${id === activeTab ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
  >
    {children}
  </NeuromorphicSurface>
);
const PresetButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => (
  <NeuromorphicSurface
    as="button"
    onClick={onClick}
    styleOverrides={{ elevation: 4, borderRadius: 8 }}
    className="px-4 py-2 font-bold text-xs"
  >
    {children}
  </NeuromorphicSurface>
);
