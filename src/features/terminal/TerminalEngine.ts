import { v4 as uuidv4 } from "uuid";
import EventEmitter from "eventemitter3";
import { SettingsEngine } from "./settings/SettingsEngine";
import { SettingChangeEvent } from "./settings/types";
import {
  Command,
  EngineState,
  QueuedCommand,
  TerminalLine,
  TerminalLineInput,
  AwaitEventSignal,
} from "./types";

// Type guard to check for the special signal object from a command
const isAwaitEventSignal = (val: any): val is AwaitEventSignal =>
  val && val._type === "AWAIT_EVENT";

// --- Default Command Definitions ---
// FIX: Using `text` property to match the TerminalLineInput type definition.
const helpCommand: Command = {
  name: "help",
  description: "Shows a list of available commands.",
  execute: async () => ({
    type: "output",
    text: "Available commands: help, clear, wait, confirm",
  }),
};

const clearCommand: Command = {
  name: "clear",
  description: "Clears the terminal screen.",
  execute: async (_, engine) => {
    engine.clear();
  },
};

const waitCommand: Command = {
  name: "wait",
  description: "Waits for a specified number of milliseconds.",
  execute: async (args) => {
    const ms = parseInt(args[0], 10) || 1000;
    await new Promise((r) => setTimeout(r, ms));
    return { type: "system", text: `Waited ${ms}ms` };
  },
};

const confirmCommand: Command = {
  name: "confirm",
  description: "Waits for user confirmation via an event.",
  execute: async () => ({
    _type: "AWAIT_EVENT",
    eventName: "user-confirmed",
    displayMessage: "Waiting for user confirmation...",
  }),
};

/**
 * The headless core of the terminal. It manages state, the command queue,
 * and communication, but has no knowledge of the UI framework.
 */
export class TerminalEngine extends EventEmitter {
  private state: EngineState = "IDLE";
  private commandQueue: QueuedCommand[] = [];
  private lines: TerminalLine[] = [];
  private commandHistory: string[] = [];
  private historyIndex = -1;
  private commandRegistry = new Map<string, Command>();
  private settingsEngine: SettingsEngine;
  private promptSymbol: string;

  constructor(settingsEngine: SettingsEngine) {
    super(); // Initialize the EventEmitter
    this.settingsEngine = settingsEngine;
    this.promptSymbol = this.settingsEngine.get("promptSymbol");

    this.registerDefaultCommands();

    // Subscribe to settings changes to keep the engine in sync
    this.settingsEngine.on("settings:changed", this.handleSettingsChange);
  }

  // --- Public API ---

  public getState(): EngineState {
    return this.state;
  }

  public getLines(): readonly TerminalLine[] {
    return this.lines;
  }

  public dispatchEvent(eventName: string, ...args: any[]): void {
    this.emit(eventName, ...args);
  }

  public submit = (input: string): void => {
    if (!input.trim()) return;

    // FIX: Using `text` property to match the TerminalLineInput type definition.
    this.printLine({ type: "input", text: input, prompt: this.promptSymbol });
    this.commandHistory.unshift(input);
    this.historyIndex = -1;

    const [commandName, ...args] = input.trim().split(" ");
    const command = this.commandRegistry.get(commandName);

    if (!command) {
      // FIX: Using `text` property.
      this.printLine({
        type: "error",
        text: `Command not found: ${commandName}`,
      });
      return;
    }

    this.commandQueue.push({ input, command, args });
    if (this.state === "IDLE") {
      this.processQueue();
    }
  };

  public getPreviousCommand = (): string => {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      return this.commandHistory[this.historyIndex] ?? "";
    }
    return this.commandHistory[this.historyIndex] ?? "";
  };

  public getNextCommand = (): string => {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.commandHistory[this.historyIndex] ?? "";
    }
    this.historyIndex = -1;
    return "";
  };

  public clear = (): void => {
    this.lines = [];
    this.emitLinesChanged();
  };

  // --- Internal Logic ---

  private processQueue = async (): Promise<void> => {
    if (this.commandQueue.length === 0) {
      this.setState("IDLE");
      return;
    }
    if (this.state !== "IDLE" && this.state !== "PROCESSING") return;

    this.setState("PROCESSING");
    const { command, args } = this.commandQueue.shift()!;

    try {
      const result = await command.execute(args, this);

      if (isAwaitEventSignal(result)) {
        this.setState("AWAITING_EVENT");
        if (result.displayMessage) {
          // FIX: Using `text` property.
          this.printLine({ type: "system", text: result.displayMessage });
        }

        this.once(result.eventName, () => {
          // FIX: Using `text` property.
          this.printLine({
            type: "system",
            text: `✔ Event '${result.eventName}' received. Resuming...`,
          });
          this.processQueue();
        });
        return;
      }

      if (result) {
        const lines = Array.isArray(result) ? result : [result];
        lines.forEach((line) => this.printLine(line));
      }
    } catch (error) {
      // FIX: Using `text` property.
      this.printLine({ type: "error", text: (error as Error).message });
    }

    if (this.state === "PROCESSING") {
      this.processQueue();
    }
  };

  private handleSettingsChange = (event: SettingChangeEvent<any>): void => {
    if (event.key === "promptSymbol") {
      this.promptSymbol = event.value;
    }
  };

  private registerDefaultCommands = (): void => {
    this.registerCommand(helpCommand);
    this.registerCommand(clearCommand);
    this.registerCommand(waitCommand);
    this.registerCommand(confirmCommand);
  };

  private registerCommand = (command: Command): void => {
    this.commandRegistry.set(command.name, command);
  };

  private printLine = (lineData: TerminalLineInput): void => {
    this.lines.push({ ...lineData, id: uuidv4(), timestamp: new Date() });
    this.emitLinesChanged();
  };

  private setState = (newState: EngineState): void => {
    if (this.state === newState) return;
    this.state = newState;
    this.emitStateChanged();
  };

  // --- Specific Event Emitters for the React Context Provider ---

  private emitLinesChanged = (): void => {
    this.emit("lines-changed", [...this.lines]);
  };

  private emitStateChanged = (): void => {
    this.emit("state-changed", this.state);
  };
}
