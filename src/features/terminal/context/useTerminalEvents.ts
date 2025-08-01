import { useContext } from "react";
// It consumes the same context as useTerminal!
import { TerminalContext } from "./terminal.context";

// Define the shape of the object this hook will return
interface UseTerminalEventsReturn {
  dispatchEvent: (eventName: string, ...args: any[]) => void;
}

/**
 * A specialized hook to dispatch custom events to the TerminalEngine.
 * This is used for asynchronous flow control, like a 'confirm' command.
 */
export const useTerminalEvents = (): UseTerminalEventsReturn => {
  const context = useContext(TerminalContext);

  if (context === undefined) {
    throw new Error("useTerminalEvents must be used within a TerminalProvider");
  }

  // The hook returns an object containing a stable function that calls
  // the engine's dispatch method.
  return {
    dispatchEvent: (eventName, ...args) =>
      context.engine.dispatchEvent(eventName, ...args),
  };
};
