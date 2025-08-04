// src/features/terminal/settings/types.ts

// A new interface defining all the user-configurable neuromorphic properties.
export interface NeuromorphicPreset {
  elevation: number;
  borderRadius: number;
  lightSourceAngle: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowIntensity: number;
  highlightIntensity: number;
  baseColor: string;
  concave: boolean;
  material: "matte" | "glossy";
}

// Defines the customizable text and accent colors for the output area.
export interface ColorCustomization {
  textColor: string;
  accentColor: string;
}

// The main settings object, now deeply structured.
export interface TerminalSettings {
  // General layout and font settings
  fontFamily: string;
  fontSize: number;
  lineHeight: number;

  // Specific neuromorphic settings for the main window surface
  window: NeuromorphicPreset;

  // Specific neuromorphic settings for the input field surface
  input: NeuromorphicPreset;

  // Specific color settings for the output area's text
  output: ColorCustomization;

  // Miscellaneous settings
  promptSymbol: string;
  showTimestamp: boolean;
}

export interface SettingChangeEvent<K extends keyof TerminalSettings> {
  key: K;
  value: TerminalSettings[K];
}
