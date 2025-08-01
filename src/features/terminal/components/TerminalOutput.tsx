import React, { useRef, useEffect } from "react";
import { TerminalEngine } from "../TerminalEngine";
import { useTerminal } from "../hooks/useTerminal";
import { TerminalLine } from "../types";

interface TerminalOutputProps {
  engine: TerminalEngine;
  renderLine?: (line: TerminalLine, idx: number) => React.ReactNode;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({
  engine,
  renderLine,
}) => {
  const { lines } = useTerminal(engine);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
      {lines.map((line, idx) =>
        renderLine ? (
          renderLine(line, idx)
        ) : (
          <div
            key={line.id}
            style={{
              color:
                line.type === "error"
                  ? "red"
                  : line.type === "input"
                    ? "cyan"
                    : line.type === "system"
                      ? "#8be9fd"
                      : "inherit",
            }}>
            {line.type === "input" && "> "}
            {line.content ?? line.text}
          </div>
        )
      )}
      <div ref={endRef} />
    </div>
  );
};

export default TerminalOutput;
