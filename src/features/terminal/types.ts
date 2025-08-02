// src/features/terminal/types.ts

import { TerminalEngine } from "./TerminalEngine";

// The state of the terminal engine's command processor.
export type EngineState = "IDLE" | "PROCESSING" | "AWAITING_EVENT";

// --- NEW: LineSource Type ---
// This new type gives us structured information about who or what created a line.
export type LineSource =
  | { type: "user" } // A line originating from user input.
  | { type: "system"; command?: string } // A line from the terminal engine itself.
  | { type: "external"; sourceName: string }; // A line from an external system (e.g., "game", "auth").

// --- Line Types ---
/**
 * The shape for a line of text before it's given a unique ID.
 */
export interface TerminalLineInput {
  /** The semantic type of the line, used for styling (e.g., color). */
  type: "input" | "output" | "error" | "log" | "warn";
  /** The text content of the line. */
  text: string;
  /** The timestamp of when the line was created. */
  timestamp: Date;
  /** Structured information about the origin of the line. */
  source: LineSource;
  /** The prompt symbol, only used for 'input' type lines. */
  prompt?: string;
  /** An optional payload for rich data, useful for custom renderers. */
  data?: Record<string, any>;
}

/**
 * A fully processed terminal line, including a unique ID for React rendering.
 */
export interface TerminalLine extends TerminalLineInput {
  id: string;
}

// --- Command Types ---
export interface AwaitEventSignal {
  _type: "AWAIT_EVENT";
  eventName: string;
  displayMessage?: string;
}

/**
 * The shape of a command's return value. It can be nothing, a single line,
 * an array of lines, or a signal to wait for an event.
 * Note: It returns an object that matches the `LineData` type in the engine.
 */
type CommandResult =
  | void
  | Omit<TerminalLineInput, "timestamp" | "source">
  | AwaitEventSignal
  | Omit<TerminalLineInput, "timestamp" | "source">[];

export interface Command {
  name: string;
  description: string;
  execute: (args: string[], engine: TerminalEngine) => Promise<CommandResult>;
}

export interface QueuedCommand {
  input: string;
  command: Command;
  args: string[];
}
