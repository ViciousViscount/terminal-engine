import { createContext } from "react";

export interface TerminalContextType {
  dispatchEvent: (eventName: string, payload?: any) => void;
}

export const TerminalContext = createContext<TerminalContextType | null>(null);
