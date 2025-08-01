import { useState, useEffect, ReactNode, useMemo } from "react";
import { TerminalEngine } from "../TerminalEngine";
import { TerminalLine, EngineState } from "../types";

// FIX: Import the context object from our new file.
import { TerminalContext, TerminalContextValue } from "./terminal.context";

interface TerminalProviderProps {
  children: ReactNode;
  engine: TerminalEngine;
}

// This file now ONLY exports the provider component, satisfying the lint rule.
export const TerminalProvider = ({
  children,
  engine,
}: TerminalProviderProps) => {
  // The state now lives inside the provider.
  // FIX: Added getLines() and getState() to initialize state from the engine.
  const [lines, setLines] = useState<readonly TerminalLine[]>(() =>
    engine.getLines(),
  );
  const [engineState, setEngineState] = useState<EngineState>(() =>
    engine.getState(),
  );

  useEffect(() => {
    const handleLinesChange = (newLines: readonly TerminalLine[]) =>
      setLines(newLines);
    const handleStateChange = (newState: EngineState) =>
      setEngineState(newState);

    engine.on("lines-changed", handleLinesChange);
    engine.on("state-changed", handleStateChange);

    return () => {
      engine.off("lines-changed", handleLinesChange);
      engine.off("state-changed", handleStateChange);
    };
  }, [engine]);

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
export { TerminalContext };
