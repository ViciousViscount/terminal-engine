// src/features/theme-shapers/neuromorphic/themes.ts

import { NeuromorphicTheme } from "./types";

export const darkMatteTheme: NeuromorphicTheme = {
  themeType: "neuromorphic",
  elevation: 10,
  borderRadius: 12,
  bevelSize: 4,
  bevelAngle: 45,
  concave: false,
  lightSourceAngle: 135,
  shadowBlur: 20,
  shadowSpread: 5,
  shadowIntensity: 0.15,
  highlightIntensity: 0.05,
  lightFalloff: 0.5,
  lightDispersion: 0.2,
  shadowOffsetMultiplier: 0.8,
  dualLightSource: false,
  material: "matte",
  surfaceRoughness: 0.8,
  reflectivity: 0.1,
  metalness: 0,

  // THE FIX: Colors now use CSS variables with fallbacks.
  baseColor: "var(--terminal-window-base-color, #282a36)",
  surfaceColor: "var(--terminal-input-base-color, #343746)",
  shadowColor: "rgba(0,0,0,0.5)",
  highlightColor: "rgba(255,255,255,0.07)",
  accent: "var(--terminal-output-accent-color, #bd93f9)",
  lightColor: "#ffffff",
  textColor: "var(--terminal-output-text-color, #f8f8f2)",

  // ... (rest of the theme is unchanged)
  interactions: {
    hover: { elevation: 15, shadowIntensity: 0.2 },
    active: {
      elevation: 5,
      concave: true,
      innerShadow: {
        offsetX: 2,
        offsetY: 2,
        blur: 5,
        color: "rgba(0,0,0,0.4)",
      },
    },
  },
  gridBackground: {
    color: "rgba(255, 255, 255, 0.05)",
    size: 50,
    lineWidth: 1,
  },
  fontFamily: '"Inter", sans-serif',
  fontWeight: 400,
  promptSymbol: undefined,
  gradientOverlay: false,
  innerShadow: false,
  innerGlow: false,
  softBorder: false,
  surfaceNoise: false,
  subsurfaceScattering: false,
  animationPreset: "none",
  isometricOffset: 0,
  depthColorCurve: undefined,
  linkedColors: false,
  elevationCurve: null,
  backgroundBlur: 0,
};

// The light theme is also updated to use the CSS variables.
export const lightGlossyTheme: NeuromorphicTheme = {
  ...darkMatteTheme,
  themeType: "neuromorphic",
  shadowIntensity: 0.1,
  highlightIntensity: 0.3,
  material: "glossy",
  surfaceRoughness: 0.2,
  reflectivity: 0.7,

  // THE FIX: Light theme colors also use variables with their own fallbacks.
  baseColor: "var(--terminal-window-base-color, #e0e5ec)",
  surfaceColor: "var(--terminal-input-base-color, #d1d9e6)",
  shadowColor: "rgba(163, 177, 198, 0.6)",
  highlightColor: "rgba(255, 255, 255, 0.8)",
  accent: "var(--terminal-output-accent-color, #007bff)",
  lightColor: "#333333",
  textColor: "var(--terminal-output-text-color, #3b4d61)",

  interactions: {
    hover: { elevation: 12, shadowIntensity: 0.15 },
    active: {
      elevation: 3,
      concave: true,
      innerShadow: {
        offsetX: 1,
        offsetY: 1,
        blur: 4,
        color: "rgba(163, 177, 198, 0.5)",
      },
    },
  },
  gridBackground: { color: "rgba(0, 0, 0, 0.08)", size: 40, lineWidth: 1 },
};
