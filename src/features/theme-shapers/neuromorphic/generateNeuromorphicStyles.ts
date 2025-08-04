// src/features/theme-shapers/neuromorphic/generateNeuromorphicStyles.ts

import { NeuromorphicTheme } from "./types";
import { CSSProperties } from "react";

/**
 * A helper function to calculate X and Y offsets from an angle and distance.
 * This is the core of simulating a light source.
 * @param angle - The angle of the light source in degrees (e.g., 135 is top-left).
 * @param distance - The distance the shadow should be cast.
 * @returns An object with x and y offsets.
 */
function calculateOffsets(
  angle: number,
  distance: number,
): { x: number; y: number } {
  // Convert angle from degrees to radians for trigonometric functions
  const rads = angle * (Math.PI / 180);
  return {
    x: Math.round(Math.cos(rads) * distance),
    y: Math.round(Math.sin(rads) * distance),
  };
}

/**
 * The primary style generator for the neuromorphic theme.
 * It takes a theme object and computes the complex CSS properties.
 *
 * @param theme - The full neuromorphic theme data object.
 * @returns A React CSSProperties object to be used in a `style` attribute.
 */
export function generateNeuromorphicStyles(
  theme: NeuromorphicTheme,
): CSSProperties {
  // --- Initialize Styles Object ---
  // We start with a base object and add properties conditionally.
  const styles: CSSProperties = {
    // Add a basic transition for any future interactive effects.
    transition: "all 0.2s ease-in-out",
    color: theme.textColor,
  };

  // --- 1. Handle Shape and Basic Color ---
  if (theme.borderRadius !== undefined)
    styles.borderRadius = `${theme.borderRadius}px`;
  if (theme.baseColor) styles.backgroundColor = theme.baseColor;

  // --- 2. Handle Elevation, Light, and Shadow ---
  if (theme.elevation !== undefined) {
    const distance = theme.elevation * (theme.shadowOffsetMultiplier || 1);
    const shadowOffset = calculateOffsets(theme.lightSourceAngle, distance);
    const highlightOffset = calculateOffsets(
      theme.lightSourceAngle + 180,
      distance,
    );
    const shadowBlur = theme.shadowBlur || 0;
    const shadowSpread = theme.shadowSpread || 0;

    const boxShadow = `
      ${shadowOffset.x}px ${shadowOffset.y}px ${shadowBlur}px ${shadowSpread}px ${theme.shadowColor},
      ${highlightOffset.x}px ${highlightOffset.y}px ${shadowBlur}px ${shadowSpread}px ${theme.highlightColor}
    `;

    styles.boxShadow = theme.concave ? `inset ${boxShadow}` : boxShadow;
  }

  // --- 3. Handle Grid Background ---
  // This will typically be used on a root-level element.
  if (theme.gridBackground) {
    const { color, size, lineWidth } = theme.gridBackground;

    // This CSS uses two repeating linear gradients (one horizontal, one vertical)
    // to create a grid pattern. It's a common and efficient technique.
    styles.backgroundImage = `
      repeating-linear-gradient(0deg, ${color}, ${color} ${lineWidth}px, transparent ${lineWidth}px, transparent ${size}px),
      repeating-linear-gradient(90deg, ${color}, ${color} ${lineWidth}px, transparent ${lineWidth}px, transparent ${size}px)
    `;

    // Ensure the base background color is also set when using a grid.
    if (theme.baseColor) {
      styles.backgroundColor = theme.baseColor;
    }
  }

  // --- Future steps would involve adding more properties here ---
  // if (theme.innerShadow) { ... }
  // if (theme.gradientOverlay) { ... }
  // etc.

  return styles;
}
