// src/features/terminal/components/TerminalOutput.tsx

import React from "react";
import { TerminalLine } from "../types";
import { useAutoScroll } from "../auto-scroll";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";

const TerminalOutput: React.FC<{ lines: readonly TerminalLine[] }> = ({
  lines,
}) => {
  const endRef = useAutoScroll<HTMLDivElement>({ dependency: lines.length });
  const { settings } = useTerminalSettings();

  const colors = {
    input: "var(--terminal-output-accent-color)",
    error: "#ff5555",
    log: "inherit",
    warn: "#f1fa8c",
  };

  const renderSourcePrefix = (line: TerminalLine) => {
    if (line.source.type === "external") {
      return `[${line.source.sourceName.toUpperCase()}] `;
    }
    return null;
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
      {lines.map((line) => (
        <div key={line.id} style={{ display: "flex", flexDirection: "row" }}>
          {settings.showTimestamp && (
            <span
              style={{ marginRight: "1em", opacity: 0.6, userSelect: "none" }}
            >
              {line.timestamp.toLocaleTimeString()}
            </span>
          )}
          <div
            style={{
              color:
                line.type === "error"
                  ? colors.error
                  : line.type === "input"
                    ? colors.input
                    : line.type === "log"
                      ? colors.log
                      : line.type === "warn"
                        ? colors.warn
                        : "inherit",
            }}
          >
            {line.type === "input" && (
              <span style={{ marginRight: "0.5em" }}>{line.prompt || ">"}</span>
            )}
            <span style={{ whiteSpace: "pre-wrap" }}>
              <strong>{renderSourcePrefix(line)}</strong>
              {line.text}
            </span>
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default TerminalOutput;
