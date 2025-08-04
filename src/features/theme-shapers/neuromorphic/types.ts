// src/features/theme-shapers/neuromorphic/types.ts

// --- Configuration Object Interfaces for Advanced Effects ---
export interface DualLightSourceConfig {
  angle: number;
  intensity: number;
}
export interface InnerShadowConfig {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
}
export interface InnerGlowConfig {
  blur: number;
  color: string;
}
export interface SoftBorderConfig {
  width: number;
  gradient: string;
}
export interface SurfaceNoiseConfig {
  opacity: number;
  scale: number;
}
export interface SubsurfaceScatteringConfig {
  color: string;
  intensity: number;
}
export interface GradientOverlayConfig {
  startColor: string;
  endColor: string;
  angle: number;
}
export interface GridBackgroundConfig {
  color: string;
  size: number;
  lineWidth: number;
}

export type EasingCurve =
  | "linear"
  | "ease-in-quad"
  | "ease-out-quad"
  | "ease-in-out-quad";

export interface InteractionConfig {
  hover?: Partial<Omit<NeuromorphicTheme, "interactions">>;
  active?: Partial<Omit<NeuromorphicTheme, "interactions">>;
}

// --- The Main Theme Type ---
export interface NeuromorphicTheme {
  promptSymbol: any;
  /** A discriminator to identify this theme type. */
  themeType: "neuromorphic";

  // Shape & Form
  elevation: number;
  borderRadius: number;
  bevelSize: number;
  bevelAngle: number;
  concave: boolean;

  // Light & Shadow
  lightSourceAngle: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowIntensity: number;
  highlightIntensity: number;
  lightFalloff: number;
  lightDispersion: number;
  shadowOffsetMultiplier: number;
  dualLightSource: DualLightSourceConfig | false;

  // Surface & Material
  material: "matte" | "semi-gloss" | "glossy" | "metallic";
  surfaceRoughness: number;
  reflectivity: number;
  metalness: number;

  // Colors
  baseColor: string;
  surfaceColor: string;
  shadowColor: string;
  highlightColor: string;
  accent: string;
  lightColor: string;
  textColor: string;

  // Advanced Effects
  gradientOverlay: GradientOverlayConfig | false;
  innerShadow: InnerShadowConfig | false;
  innerGlow: InnerGlowConfig | false;
  softBorder: SoftBorderConfig | false;
  surfaceNoise: SurfaceNoiseConfig | false;
  subsurfaceScattering: SubsurfaceScatteringConfig | false;

  // Animation & Position
  animationPreset: "none" | "fade" | "morph" | "spring";
  isometricOffset: number;
  depthColorCurve: ((elevation: number) => string) | null | undefined;

  // General Properties
  linkedColors: boolean;
  elevationCurve: EasingCurve | null;
  interactions: InteractionConfig | false;
  backgroundBlur: number | false;
  gridBackground: GridBackgroundConfig | false;
  fontFamily: string;
  fontWeight: number;
}
