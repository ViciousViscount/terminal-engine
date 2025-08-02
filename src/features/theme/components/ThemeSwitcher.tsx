// src/features/theme/components/ThemeSwitcher.tsx

import React from "react";
import { useTheme } from "../useTheme";

/**
 * A UI component that allows the user to switch the active theme.
 * It's a perfect example of a component that consumes the ThemeContext.
 */
export const ThemeSwitcher = () => {
  // 1. Get all the necessary data and functions from our theme hook.
  const { themes, activeThemeId, setThemeById } = useTheme();

  const selectStyle: React.CSSProperties = {
    padding: "8px 12px",
    backgroundColor: "#333",
    color: "#eee",
    border: "1px solid #555",
    borderRadius: "6px",
    cursor: "pointer",
  };

  return (
    // This div provides some basic positioning.
    // In a real app, you might use Tailwind for this.
    <div
      style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 10 }}
    >
      {/* 2. The <select> element is a controlled component. */}
      {/* Its value is bound to the active theme ID from the context. */}
      <select
        value={activeThemeId}
        onChange={(e) => setThemeById(e.target.value)}
        style={selectStyle}
        aria-label="Select a theme"
      >
        {/* 3. We map over the list of available themes to create the options. */}
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};
