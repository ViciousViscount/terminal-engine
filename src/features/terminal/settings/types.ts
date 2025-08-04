// src/features/terminal/settings/types.ts

export interface TerminalSettings {
  fontFamily: string;
  fontSize: number;
  promptSymbol: string;
  showTimestamp: boolean;
  lineHeight: number;
  baseColor: string;
  textColor: string;
  accentColor: string;
}

export interface SettingChangeEvent<K extends keyof TerminalSettings> {
  key: K;
  value: TerminalSettings[K];
}
