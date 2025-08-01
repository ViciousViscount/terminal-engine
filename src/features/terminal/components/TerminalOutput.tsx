import React, { useRef, useEffect } from "react";
import { TerminalLine } from "../types";

/**
 * The props for the TerminalOutput component.
 * It is a presentational component that only needs the data to display.
 */
interface TerminalOutputProps {
  /** The array of terminal lines to be rendered. Passed from a parent component. */
  lines: readonly TerminalLine[];
  /**
   * An optional custom render function for a line.
   * The function receives the line data and should return a React node.
   * This allows for powerful UI customization.
   */
  renderLine?: (line: TerminalLine) => React.ReactNode;
}

/**
 * A presentational component responsible for rendering the list of terminal output lines.
 * It manages its own scrolling behavior but receives all content via props.
 * It has no knowledge of the TerminalEngine.
 */
const TerminalOutput: React.FC<TerminalOutputProps> = ({
  lines,
  renderLine,
}) => {
  // This ref is used to control the auto-scrolling behavior.
  const endRef = useRef<HTMLDivElement | null>(null);

  // This effect scrolls the view to the bottom whenever the `lines` array changes.
  // This is a UI concern and correctly belongs in this component.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
      {lines.map((line) => (
        // The key MUST be here, on the top-level element inside the map.
        <div key={line.id}>
          {renderLine ? (
            // If a custom renderer is provided, use it.
            renderLine(line)
          ) : (
            // Otherwise, use the default rendering logic.
            // The wrapping div with the key is already handled above.
            <p
              style={{
                margin: 0, // Use <p> for better semantics, remove default margin.
                color:
                  line.type === "error"
                    ? "red"
                    : line.type === "input"
                      ? "cyan"
                      : line.type === "system"
                        ? "#8be9fd"
                        : "inherit",
              }}
            >
              {line.type === "input" && <span>&gt;&nbsp;</span>}
              {
                /* Using optional chaining for safety, same as your original ?? */
                line.content
              }
            </p>
          )}
        </div>
      ))}
      {/* This invisible div is the target for our auto-scroll effect. */}
      <div ref={endRef} />
    </div>
  );
};

export default TerminalOutput;
