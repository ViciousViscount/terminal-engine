// src/features/theme/components/ThemedBackground.tsx

import { useTheme } from "../useTheme";
import {
  generateNeuromorphicStyles,
  NeuromorphicTheme,
} from "../../theme-shapers/neuromorphic";
import { useMemo } from "react";

export const ThemedBackground = () => {
  // Get the active theme from our context.
  const { activeTheme } = useTheme();

  // Generate the styles, memoizing the result for performance.
  // The style will only be recalculated when the theme object changes.
  const backgroundStyle = useMemo(() => {
    if (activeTheme.themeType !== "neuromorphic") {
      return { backgroundColor: "#282a36" }; // A simple fallback
    }
    // We only need the background properties, so we can pass a simplified theme object.
    // This is an optimization; passing the full theme also works.
    const themeForBackground: Partial<NeuromorphicTheme> = {
      baseColor: (activeTheme as NeuromorphicTheme).baseColor,
      gridBackground: (activeTheme as NeuromorphicTheme).gridBackground,
    };

    // The generator will pick up the `gridBackground` property and create the style.
    return generateNeuromorphicStyles(themeForBackground as NeuromorphicTheme);
  }, [activeTheme]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1, // Crucial: This places the div behind all other content.
        transition: "background-color 0.3s ease", // Smooth transition for theme changes.
        ...backgroundStyle,
      }}
      aria-hidden="true" // Good for accessibility, as this is purely decorative.
    />
  );
};
