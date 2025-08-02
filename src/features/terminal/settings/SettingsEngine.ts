// src/features/terminal/settings/SettingsEngine.ts

import { TerminalSettings, SettingChangeEvent } from "./types";
import EventEmitter from "eventemitter3";

const DEFAULT_SETTINGS: TerminalSettings = {
  theme: "dark",
  fontFamily: '"Fira Code", monospace',
  fontSize: 14,
  promptSymbol: "$",
  showTimestamp: true, // Added
};

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

    const event: SettingChangeEvent<K> = { key, value };
    this.emit("settings:changed", event);
  }
}
