// Define the shape of your settings
export interface TerminalSettings {
  theme: "light" | "dark" | "custom";
  fontFamily: string;
  fontSize: number;
  promptSymbol: string;
  showTimestamp: boolean;
}

// Define the event payload for when a setting changes
export interface SettingChangeEvent<K extends keyof TerminalSettings> {
  key: K;
  value: TerminalSettings[K];
}
