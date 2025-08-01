import { ReactNode } from "react";
import { TerminalEngine } from "../TerminalEngine";
import { TerminalContext } from "./TerminalContextValue";

interface TerminalProviderProps {
  children: ReactNode;
  engine: TerminalEngine;
}

export const TerminalProvider = ({
  children,
  engine,
}: TerminalProviderProps) => {
  const value = { dispatchEvent: engine.dispatchEvent };
  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
};
