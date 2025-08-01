import { createContext } from "react";
import { TerminalEngine } from "../TerminalEngine";
import { TerminalLine, EngineState } from "../types";

// This is the shape of the value our context will hold.
export interface TerminalContextValue {
  engine: TerminalEngine;
  lines: readonly TerminalLine[];
  engineState: EngineState;
  submit: (text: string) => void;
  getPreviousCommand: () => string;
  getNextCommand: () => string;
}

// Create and export the context object itself.
// This file now exports NO components.
export const TerminalContext = createContext<TerminalContextValue | undefined>(
  undefined,
);
