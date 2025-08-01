import { TerminalSettings, SettingChangeEvent } from "./types";
import EventEmitter from "eventemitter3";

const DEFAULT_SETTINGS: TerminalSettings = {
  theme: "dark",
  fontFamily: '"Fira Code", monospace',
  fontSize: 14,
  promptSymbol: "$",
  showTimestamp: false,
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
      // FIX: The try...catch block is now complete.
      console.error("Failed to save settings to storage:", error);
    }
  }

  // --- Public API Methods ---

  /**
   * Returns a copy of all current settings.
   */
  public getAll(): TerminalSettings {
    return { ...this.settings };
  }

  /**
   * Returns the value of a single setting.
   */
  public get<K extends keyof TerminalSettings>(key: K): TerminalSettings[K] {
    return this.settings[key];
  }

  /**
   * Updates a setting, saves it to storage, and emits an event.
   */
  public set<K extends keyof TerminalSettings>(
    key: K,
    value: TerminalSettings[K],
  ): void {
    if (this.settings[key] === value) return; // No change, do nothing

    this.settings[key] = value;
    this.saveToStorage();

    // FIX: This section uses the `key`, `value`, and `SettingChangeEvent` type,
    // resolving the "declared but not read" warnings.
    const event: SettingChangeEvent<K> = { key, value };
    this.emit("settings:changed", event);
  }
}
