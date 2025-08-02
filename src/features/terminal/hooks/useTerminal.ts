import { useContext } from "react";
import {
  TerminalContext,
  TerminalContextValue,
} from "../context/terminal.context";

/**
 * A hook to access the terminal's state and methods.
 *
 * THE FIX: This file uses `export const` to create a named export.
 * This will match the `import { useTerminal }` statement in TerminalWindow.tsx.
 */
export const useTerminal = (): TerminalContextValue => {
  const context = useContext(TerminalContext);

  if (context === undefined) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }

  return context;
};
