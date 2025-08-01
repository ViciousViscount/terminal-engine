import React from "react";
import { TerminalEngine } from "./TerminalEngine";

/** The fundamental unit of display in the terminal. */
export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "system";
  text: string;
  content?: React.ReactNode; // For rendering custom components
  timestamp: Date;
}

/** A simplified input version without id/timestamp. */
export type TerminalLineInput = Omit<TerminalLine, "id" | "timestamp">;

/** A signal for the engine to pause and wait for an external event. */
export interface AwaitEventSignal {
  _type: "AWAIT_EVENT";
  eventName: string;
  displayMessage?: string;
  timeoutMs?: number;
}

/** The definition for a terminal command. */
export interface Command {
  name: string;
  description: string;
  execute: (
    args: string[],
    engine: TerminalEngine
  ) => Promise<
    void | TerminalLineInput | TerminalLineInput[] | AwaitEventSignal
  >;
}

/** The possible states of the terminal engine. */
export type EngineState = "IDLE" | "PROCESSING" | "AWAITING_EVENT";

/** A command that has been parsed and is waiting in the queue. */
export interface QueuedCommand {
  input: string;
  command: Command;
  args: string[];
}
