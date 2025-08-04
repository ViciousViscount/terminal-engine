// src/features/terminal/components/TerminalOutput.tsx

import React from "react";
import { TerminalLine } from "../types";
import { useAutoScroll } from "../auto-scroll";
import { useTheme } from "../../theme/useTheme";
import { NeuromorphicTheme } from "../../theme-shapers/neuromorphic";
import { useTerminalSettings } from "../settings/context/useTerminalSettings";

interface TerminalOutputProps {
  lines: readonly TerminalLine[];
  renderLine?: (line: TerminalLine) => React.ReactNode;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({
  lines,
  renderLine,
}) => {
  const endRef = useAutoScroll<HTMLDivElement>({ dependency: lines.length });
  const { activeTheme } = useTheme();
  const { settings } = useTerminalSettings();

  const theme = activeTheme as NeuromorphicTheme;
  const colors = {
    text: "inherit",
    input: theme?.accent || "var(--terminal-accent-color, #50fa7b)",
    error: "#ff5555",
    log: theme?.lightColor || "#8be9fd",
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
        <div key={line.id}>
          {renderLine ? (
            renderLine(line)
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                color:
                  line.type === "error"
                    ? colors.error
                    : line.type === "input"
                      ? colors.input
                      : line.type === "log"
                        ? colors.log
                        : line.type === "warn"
                          ? colors.warn
                          : colors.text,
              }}
            >
              {settings.showTimestamp && (
                <span
                  style={{
                    marginRight: "1em",
                    opacity: 0.6,
                    userSelect: "none",
                  }}
                >
                  {line.timestamp.toLocaleTimeString()}
                </span>
              )}

              {line.type === "input" && (
                <span style={{ marginRight: "0.5em" }}>
                  {line.prompt || ">"}
                </span>
              )}

              <span style={{ whiteSpace: "pre-wrap" }}>
                <strong>{renderSourcePrefix(line)}</strong>
                {line.text}
              </span>
            </div>
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default TerminalOutput;
