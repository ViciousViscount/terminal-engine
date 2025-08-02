// src/features/terminal/settings/types.ts

export interface TerminalSettings {
  theme: "light" | "dark" | "custom";
  fontFamily: string;
  fontSize: number;
  promptSymbol: string;
  showTimestamp: boolean; // Added
}

export interface SettingChangeEvent<K extends keyof TerminalSettings> {
  key: K;
  value: TerminalSettings[K];
}
