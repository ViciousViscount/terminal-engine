// src/features/theme/components/NeuromorphicSurface.tsx

import React, { useState, useMemo, CSSProperties } from "react";
import { useTheme } from "../useTheme";
import {
  generateNeuromorphicStyles,
  NeuromorphicTheme,
} from "../../theme-shapers/neuromorphic";

// --- Component Props Interface ---
// THE FIX - Part 1: Extend the props with standard HTML attributes.
// This teaches TypeScript about common props like `onClick`, `onFocus`, `disabled`, etc.
interface NeuromorphicSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  styleOverrides?: Partial<NeuromorphicTheme>;
}

export const NeuromorphicSurface = ({
  children,
  as: Component = "div",
  className = "",
  styleOverrides = {},
  // THE FIX - Part 2: Use the "rest" syntax to collect all other props.
  // `...rest` will now be an object containing any extra props like `onClick`.
  ...rest
}: NeuromorphicSurfaceProps) => {
  const { activeTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const dynamicStyles = useMemo(() => {
    if (activeTheme.themeType !== "neuromorphic") {
      console.warn(
        "NeuromorphicSurface rendered with a non-neuromorphic theme.",
      );
      return { base: { padding: "1rem", backgroundColor: "#333" } };
    }

    const baseTheme = activeTheme as NeuromorphicTheme;
    const baseStyles = generateNeuromorphicStyles({
      ...baseTheme,
      ...styleOverrides,
    });

    let hoverStyles: CSSProperties = {};
    if (baseTheme.interactions && baseTheme.interactions.hover) {
      const hoverTheme = {
        ...baseTheme,
        ...styleOverrides,
        ...baseTheme.interactions.hover,
      };
      hoverStyles = generateNeuromorphicStyles(hoverTheme);
    }

    let activeStyles: CSSProperties = {};
    if (baseTheme.interactions && baseTheme.interactions.active) {
      const activeTheme = {
        ...baseTheme,
        ...styleOverrides,
        ...baseTheme.interactions.active,
      };
      activeStyles = generateNeuromorphicStyles(activeTheme);
    }

    return { base: baseStyles, hover: hoverStyles, active: activeStyles };
  }, [activeTheme, styleOverrides]);

  let finalStyle = dynamicStyles.base;
  if (isActive && dynamicStyles.active) {
    finalStyle = { ...finalStyle, ...dynamicStyles.active };
  } else if (isHovered && dynamicStyles.hover) {
    finalStyle = { ...finalStyle, ...dynamicStyles.hover };
  }

  return (
    <Component
      // THE FIX - Part 3: Spread the collected `...rest` props onto the element.
      // This will correctly apply the `onClick` handler (and any others) to the rendered <button>.
      {...rest}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={finalStyle}
      className={className}
    >
      {children}
    </Component>
  );
};
