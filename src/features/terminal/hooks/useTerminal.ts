import { useState, useEffect } from "react";
import { TerminalEngine } from "../TerminalEngine";
import { EngineState, TerminalLine } from "../types";

export const useTerminal = (engine: TerminalEngine) => {
  const [lines, setLines] = useState<readonly TerminalLine[]>(
    engine.getLines()
  );
  const [engineState, setEngineState] = useState<EngineState>(
    engine.getEngineState()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setLines([...engine.getLines()]);
      setEngineState(engine.getEngineState());
    };

    engine.on("update", handleUpdate);

    // ✅ Proper cleanup function
    return () => {
      engine.off("update", handleUpdate);
    };
  }, [engine]);

  return {
    lines,
    engineState,
    submit: engine.submit.bind(engine),
    getPreviousCommand: engine.getPreviousCommand.bind(engine),
    getNextCommand: engine.getNextCommand.bind(engine),
  };
};
