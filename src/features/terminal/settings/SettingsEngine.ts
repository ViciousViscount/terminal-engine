// src/features/terminal/settings/SettingsEngine.ts

import { TerminalSettings } from "./types";
import EventEmitter from "eventemitter3";

const DEFAULT_SETTINGS: TerminalSettings = {
  fontFamily: '"Fira Code", monospace',
  fontSize: 14,
  promptSymbol: "$",
  showTimestamp: true,
  lineHeight: 1.5,
  // Storing colors as HEX is best for state management and color pickers.
  baseColor: "#282a36",
  textColor: "#f8f8f2",
  accentColor: "#bd93f9",
};

// The SettingsEngine class remains unchanged from the previous full version.
export class SettingsEngine extends EventEmitter {
  private settings: TerminalSettings;
  private storageKey: string;

  constructor(storageKey: string = "terminal_settings") {
    super();
    this.storageKey = storageKey;
    this.settings = this.loadFromStorage();
  }

  private loadFromStorage(): TerminalSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
        : DEFAULT_SETTINGS;
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

  public getAll(): TerminalSettings {
    return { ...this.settings };
  }

  public get<K extends keyof TerminalSettings>(key: K): TerminalSettings[K] {
    return this.settings[key];
  }

  public set<K extends keyof TerminalSettings>(
    key: K,
    value: TerminalSettings[K],
  ): void {
    if (this.settings[key] === value) return;
    this.settings[key] = value;
    this.saveToStorage();
    this.emit("settings:changed", { key, value });
  }
}
