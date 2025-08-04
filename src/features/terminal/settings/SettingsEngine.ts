// src/features/terminal/settings/SettingsEngine.ts

import { TerminalSettings } from "./types";
import EventEmitter from "eventemitter3";

// --- PRESET DEFINITIONS ---

export const SOFT_PRESET: TerminalSettings = {
  fontFamily: '"Inter", sans-serif',
  fontSize: 14,
  lineHeight: 1.6,
  window: {
    elevation: 8,
    borderRadius: 20,
    lightSourceAngle: 145,
    shadowBlur: 25,
    shadowSpread: 5,
    shadowIntensity: 0.15,
    highlightIntensity: 0.03,
    baseColor: "#2d303b",
    concave: false,
    material: "matte",
  },
  input: {
    elevation: 4,
    borderRadius: 10,
    lightSourceAngle: 145,
    shadowBlur: 8,
    shadowSpread: 2,
    shadowIntensity: 0.1,
    highlightIntensity: 0.05,
    baseColor: "#262833",
    concave: true,
    material: "matte",
  },
  output: { textColor: "#d1d5db", accentColor: "#a78bfa" },
  promptSymbol: ">",
  showTimestamp: true,
};

export const CRISP_PRESET: TerminalSettings = {
  fontFamily: '"Roboto Mono", monospace',
  fontSize: 13,
  lineHeight: 1.5,
  window: {
    elevation: 12,
    borderRadius: 12,
    lightSourceAngle: 135,
    shadowBlur: 15,
    shadowSpread: 1,
    shadowIntensity: 0.2,
    highlightIntensity: 0.2,
    baseColor: "#e0e5ec",
    concave: false,
    material: "glossy",
  },
  input: {
    elevation: 2,
    borderRadius: 6,
    lightSourceAngle: 135,
    shadowBlur: 4,
    shadowSpread: 1,
    shadowIntensity: 0.15,
    highlightIntensity: 0.3,
    baseColor: "#cad2db",
    concave: true,
    material: "glossy",
  },
  output: { textColor: "#3b4d61", accentColor: "#007bff" },
  promptSymbol: "$",
  showTimestamp: true,
};

export const FUTURISTIC_PRESET: TerminalSettings = {
  fontFamily: '"Orbitron", sans-serif',
  fontSize: 15,
  lineHeight: 1.7,
  window: {
    elevation: 20,
    borderRadius: 0,
    lightSourceAngle: 225,
    shadowBlur: 40,
    shadowSpread: -5,
    shadowIntensity: 0.3,
    highlightIntensity: 0.1,
    baseColor: "#1a1a1a",
    concave: false,
    material: "matte",
  },
  input: {
    elevation: 6,
    borderRadius: 0,
    lightSourceAngle: 225,
    shadowBlur: 10,
    shadowSpread: 0,
    shadowIntensity: 0.2,
    highlightIntensity: 0.1,
    baseColor: "#0d0d0d",
    concave: true,
    material: "matte",
  },
  output: { textColor: "#00ffc8", accentColor: "#ff00ff" },
  promptSymbol: "»",
  showTimestamp: false,
};

const DEFAULT_SETTINGS = SOFT_PRESET; // Start with the soft preset by default

export class SettingsEngine extends EventEmitter {
  private settings: TerminalSettings;
  private storageKey: string;

  constructor(storageKey: string = "terminal_settings") {
    super();
    this.storageKey = storageKey;
    this.settings = this.loadFromStorage();
  }

  // NEW METHOD: Loads a full preset object into the settings state.
  public loadPreset = (preset: TerminalSettings): void => {
    this.settings = { ...preset };
    this.saveToStorage();
    // Emit a special event to signal a full refresh, or individual events
    Object.keys(preset).forEach((key) => {
      this.emit("settings:changed", {
        key,
        value: preset[key as keyof TerminalSettings],
      });
    });
  };

  private loadFromStorage(): TerminalSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          window: { ...DEFAULT_SETTINGS.window, ...parsed.window },
          input: { ...DEFAULT_SETTINGS.input, ...parsed.input },
          output: { ...DEFAULT_SETTINGS.output, ...parsed.output },
        };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      console.error("Failed to load settings from storage:", error);
      return DEFAULT_SETTINGS;
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (error) {
      console.error("Failed to save settings to storage:", error);
    }
  }

  public getAll = (): TerminalSettings => this.settings;
  public get = <K extends keyof TerminalSettings>(
    key: K,
  ): TerminalSettings[K] => this.settings[key];

  public set = <K extends keyof TerminalSettings>(
    key: K,
    value: TerminalSettings[K],
  ): void => {
    this.settings = { ...this.settings, [key]: value };
    this.saveToStorage();
    this.emit("settings:changed", { key, value });
  };
}
