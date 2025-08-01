import { useContext } from "react";
import { TerminalContext } from "../context/TerminalProvider";

/**
 * A hook to access the terminal's state and methods.
 * It consumes the TerminalContext provided by TerminalProvider.
 * It no longer accepts any arguments.
 */
export const useTerminal = () => {
  const context = useContext(TerminalContext);

  // This check ensures the hook is used within a provider, preventing common errors.
  if (context === undefined) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }

  // The hook simply returns the value that the provider has already prepared.
  return context;
};
