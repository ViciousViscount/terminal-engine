import React, { useState, useRef, useEffect } from "react";
import { TerminalEngine } from "../TerminalEngine";
import { useTerminal } from "../hooks/useTerminal";

interface TerminalInputProps {
  engine: TerminalEngine;
}

const TerminalInput: React.FC<TerminalInputProps> = ({ engine }) => {
  const { submit, engineState, getPreviousCommand, getNextCommand } =
    useTerminal(engine);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (value.trim()) {
        submit(value);
        setValue("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setValue(getPreviousCommand() || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setValue(getNextCommand() || "");
    }
  };

  return (
    <div style={{ display: "flex", padding: "5px" }}>
      <span>&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={engineState !== "IDLE"}
        style={{
          background: "transparent",
          border: "none",
          color: "#eee",
          flex: 1,
          outline: "none",
          marginLeft: "5px",
        }}
        autoFocus
      />
    </div>
  );
};

export default TerminalInput;
