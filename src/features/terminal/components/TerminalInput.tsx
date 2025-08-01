import React, { useState, useRef, useEffect } from "react";

/**
 * The props for the TerminalInput component.
 * It's designed to be a "controlled" and "presentational" component.
 * It receives all its data and behavior via props.
 */
interface TerminalInputProps {
  /** The function to call when the user submits a command. */
  onSubmit: (text: string) => void;
  /** The function to call to get the previous command from history. */
  onArrowUp: () => string;
  /** The function to call to get the next command from history. */
  onArrowDown: () => string;
  /** Whether the input should be disabled (e.g., while a command is running). */
  disabled: boolean;
  /** The symbol to display as the prompt (e.g., '$', '>'). */
  promptSymbol: string;
}

/**
 * A presentational component for the terminal's input line.
 * It manages its own text state but relies on props for all external interactions.
 * It has no knowledge of the TerminalEngine or any hooks.
 */
const TerminalInput: React.FC<TerminalInputProps> = ({
  onSubmit,
  onArrowUp,
  onArrowDown,
  disabled,
  promptSymbol,
}) => {
  // This component still manages its own internal input value.
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // This effect ensures the input is always focused when it's not disabled.
  // This is a good example of a UI concern that belongs in this component.
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        // Use the `onSubmit` callback prop.
        onSubmit(value);
        setValue("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // Use the `onArrowUp` callback prop to fetch and set the value.
      setValue(onArrowUp());
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // Use the `onArrowDown` callback prop.
      setValue(onArrowDown());
    }
  };

  return (
    <div style={{ display: "flex", padding: "5px" }}>
      {/* The prompt is now dynamic via props. */}
      <span>{promptSymbol}&nbsp;</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        // The disabled state is now directly controlled by the prop.
        disabled={disabled}
        style={{
          background: "transparent",
          border: "none",
          color: "#eee",
          flex: 1,
          outline: "none",
        }}
        // 'autoFocus' is good, but the useEffect provides more robust focus management.
      />
    </div>
  );
};

export default TerminalInput;
