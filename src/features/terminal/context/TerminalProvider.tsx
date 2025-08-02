import { useState, useEffect, ReactNode, useMemo } from "react";
import { TerminalEngine } from "../TerminalEngine";
import { TerminalLine, EngineState } from "../types";
import { TerminalContext, TerminalContextValue } from "./terminal.context";

interface TerminalProviderProps {
  children: ReactNode;
  engine: TerminalEngine;
}

export const TerminalProvider = ({
  children,
  engine,
}: TerminalProviderProps) => {
  const [lines, setLines] = useState<readonly TerminalLine[]>(() =>
    engine.getLines(),
  );
  const [engineState, setEngineState] = useState<EngineState>(() =>
    engine.getState(),
  );

  useEffect(() => {
    const handleLinesChange = (newLines: readonly TerminalLine[]) => {
      // DEBUG: Log that the event handler has been triggered.
      console.log(
        `%cPROVIDER: handleLinesChange triggered. Received ${newLines.length} lines.`,
        "color: lightblue;",
      );
      // The definitive fix for immutable updates at the boundary.
      setLines([...newLines]);
    };

    const handleStateChange = (newState: EngineState) =>
      setEngineState(newState);

    engine.on("lines-changed", handleLinesChange);
    engine.on("state-changed", handleStateChange);

    return () => {
      engine.off("lines-changed", handleLinesChange);
      engine.off("state-changed", handleStateChange);
    };
  }, [engine]);

  // DEBUG: Log whenever the provider itself re-renders.
  console.log(
    `%cPROVIDER: Re-rendering with ${lines.length} lines.`,
    "color: lightblue; font-weight: bold;",
  );

  const value: TerminalContextValue = useMemo(
    () => ({
      engine,
      lines,
      engineState,
      submit: (text: string) => engine.submit(text),
      getPreviousCommand: () => engine.getPreviousCommand(),
      getNextCommand: () => engine.getNextCommand(),
    }),
    [engine, lines, engineState],
  );

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
};
