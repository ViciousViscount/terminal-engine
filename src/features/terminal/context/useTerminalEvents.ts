import { useContext } from "react";
import { TerminalContext } from "./TerminalContextValue";

export const useTerminalEvents = () => {
  const context = useContext(TerminalContext);
  if (!context)
    throw new Error("useTerminalEvents must be used within a TerminalProvider");
  return context;
};
