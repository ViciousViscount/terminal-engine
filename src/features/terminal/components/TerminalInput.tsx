// src/features/terminal/components/TerminalInput.tsx

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "../../theme/useTheme";
import { NeuromorphicSurface } from "../../theme/components/NeuromorphicSurface";
import { NeuromorphicTheme } from "../../theme-shapers/neuromorphic";

// THE FIX #1: The `promptSymbol` prop is removed from the interface.
interface TerminalInputProps {
  onSubmit: (text: string) => void;
  onArrowUp: () => string;
  onArrowDown: () => string;
  disabled: boolean;
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  onSubmit,
  onArrowUp,
  onArrowDown,
  disabled,
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // THE FIX #2: Get the active theme to access its properties.
  const { activeTheme } = useTheme();
  // We can safely cast here and provide a fallback.
  const promptSymbol = (activeTheme as NeuromorphicTheme)?.promptSymbol || ">";

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        onSubmit(value);
        setValue("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setValue(onArrowUp());
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setValue(onArrowDown());
    }
  };

  const inputSurfaceOverrides: Partial<NeuromorphicTheme> = {
    concave: true,
    elevation: 3,
    borderRadius: 8,
  };

  return (
    <NeuromorphicSurface
      styleOverrides={inputSurfaceOverrides}
      className="flex items-center p-2 m-2"
    >
      {/* THE FIX #3: The prompt symbol now comes from the variable derived from the theme. */}
      <span style={{ marginRight: "0.5em" }}>{promptSymbol}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none"
        style={{ color: (activeTheme as NeuromorphicTheme)?.accent || "#eee" }}
      />
    </NeuromorphicSurface>
  );
};

export default TerminalInput;
