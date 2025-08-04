// src/features/terminal/components/TerminalInput.tsx

import React, { useState, useRef, useEffect } from "react";
import { NeuromorphicSurface } from "../../theme/components/NeuromorphicSurface";
import { NeuromorphicTheme } from "../../theme-shapers/neuromorphic";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";

// THE FIX #1: Define all the props the component expects to receive.
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
  const { settings } = useTerminalSettings();

  const promptSymbol = settings.promptSymbol || ">";

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  // THE FIX #2: Fully implement the keyboard event handler inside the component.
  // This uses the props and event object, resolving all the "unused variable" errors.
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

  // The input surface is now entirely driven by the user's settings.
  const inputSurfaceOverrides: Partial<NeuromorphicTheme> = {
    ...settings.input,
  };

  return (
    <NeuromorphicSurface
      styleOverrides={inputSurfaceOverrides}
      className="flex items-center p-2 m-2"
    >
      <span
        style={{
          marginRight: "0.5em",
          color: "var(--terminal-output-accent-color)",
        }}
      >
        {promptSymbol}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none"
        style={{ color: "var(--terminal-output-text-color)" }}
      />
    </NeuromorphicSurface>
  );
};

// THE FIX #3: Ensure the component is exported correctly.
export default TerminalInput;
