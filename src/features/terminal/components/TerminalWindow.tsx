import React from "react";
import { TerminalEngine } from "../TerminalEngine";
import { useTerminal } from "../hooks/useTerminal";
import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";
import { useTerminalEvents } from "../context/useTerminalEvents";

interface TerminalWindowProps {
  engine: TerminalEngine;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ engine }) => {
  const { engineState } = useTerminal(engine);
  const { dispatchEvent } = useTerminalEvents();

  return (
    <div
      style={{
        border: "1px solid #555",
        background: "#222",
        color: "#eee",
        fontFamily: "monospace",
        height: "400px",
        display: "flex",
        flexDirection: "column",
      }}>
      <TerminalOutput engine={engine} />
      {engineState === "AWAITING_EVENT" && (
        <button
          onClick={() => dispatchEvent("user-confirmed")}
          style={{
            background: "#444",
            color: "#fff",
            border: "1px solid #888",
            borderRadius: 4,
            padding: "4px 12px",
            margin: "8px 0",
            cursor: "pointer",
            alignSelf: "flex-start",
          }}>
          Confirm
        </button>
      )}
      <TerminalInput engine={engine} />
    </div>
  );
};

export default TerminalWindow;
