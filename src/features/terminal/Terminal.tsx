import React, { useState, useRef, useEffect } from "react";
import { useTerminal } from "./hooks/useTerminal";
import { TerminalEngine } from "./TerminalEngine";
import { TerminalLine } from "./types";

// In a real app, these would be separate component files
const TerminalWindow: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    style={{
      border: "1px solid #555",
      background: "#222",
      color: "#eee",
      fontFamily: "monospace",
      height: "400px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

const TerminalOutput: React.FC<{ lines: readonly TerminalLine[] }> = ({
  lines,
}) => {
  const endRef = useRef<null | HTMLDivElement>(null);
  useEffect(
    () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
    [lines],
  );

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
      {lines.map((line) => (
        <div
          key={line.id}
          style={{
            color:
              line.type === "error"
                ? "red"
                : line.type === "input"
                  ? "cyan"
                  : "inherit",
          }}
        >
          {line.type === "input" && "> "}
          {line.text}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

const TerminalInput: React.FC<{
  onSubmit: (text: string) => void;
  onArrowUp: () => string;
  onArrowDown: () => string;
  disabled: boolean;
}> = (props) => {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      props.onSubmit(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setValue(props.onArrowUp());
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setValue(props.onArrowDown());
    }
  };

  return (
    <div style={{ display: "flex", padding: "5px" }}>
      <span>&gt;</span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={props.disabled}
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

// The main component
export const Terminal = ({ engine }: { engine: TerminalEngine }) => {
  const { lines, engineState, submit, getPreviousCommand, getNextCommand } =
    useTerminal(engine);
  return (
    <TerminalWindow>
      <TerminalOutput lines={lines} />
      <TerminalInput
        onSubmit={submit}
        onArrowUp={getPreviousCommand}
        onArrowDown={getNextCommand}
        disabled={engineState !== "IDLE"}
      />
    </TerminalWindow>
  );
};
