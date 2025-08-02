// src/features/terminal/TerminalEngine.ts

import { v4 as uuidv4 } from "uuid";
import EventEmitter from "eventemitter3";
import { SettingsEngine } from "./settings/SettingsEngine";
import { SettingChangeEvent } from "./settings/types";
import {
  Command,
  EngineState,
  QueuedCommand,
  TerminalLine, // Keep this import
} from "./types";

// A helper type for data passed to printLine. It's a line object before timestamp and ID are added.
type LineData = Omit<TerminalLine, "timestamp" | "id">;

const isAwaitEventSignal = (val: any): val is { _type: "AWAIT_EVENT" } =>
  val && val._type === "AWAIT_EVENT";

// --- Default Command Definitions ---
const helpCommand: Command = {
  name: "help",
  description: "Shows commands.",
  execute: async () => ({
    type: "output",
    text: "Commands: help, clear, wait, confirm, echo, date",
  }),
};
const clearCommand: Command = {
  name: "clear",
  description: "Clears the terminal.",
  execute: async (_, engine) => {
    engine.clear();
  },
};
const waitCommand: Command = {
  name: "wait",
  description: "Waits N ms.",
  execute: async (args) => {
    const ms = parseInt(args[0], 10) || 1000;
    await new Promise((r) => setTimeout(r, ms));
    return { type: "log", text: `Waited ${ms}ms` };
  },
};
const confirmCommand: Command = {
  name: "confirm",
  description: "Waits for event.",
  execute: async () => ({
    _type: "AWAIT_EVENT",
    eventName: "user-confirmed",
    displayMessage: "Waiting for user confirmation...",
  }),
};
const echoCommand: Command = {
  name: "echo",
  description: "Prints text back.",
  execute: async (args) => ({
    type: "output",
    text: args.join(" ") || "Usage: echo <text>",
  }),
};
const dateCommand: Command = {
  name: "date",
  description: "Displays the current date.",
  execute: async () => ({ type: "output", text: new Date().toString() }),
};

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
    super();
    this.settingsEngine = settingsEngine;
    this.promptSymbol = this.settingsEngine.get("promptSymbol");
    this.registerDefaultCommands();
    this.settingsEngine.on("settings:changed", this.handleSettingsChange);
  }

  // --- Public API ---
  public getState = (): EngineState => this.state;
  public getLines = (): readonly TerminalLine[] => this.lines;
  public dispatchEvent = (eventName: string, ...args: any[]): void => {
    this.emit(eventName, ...args);
  };

  public logEvent = (
    message: string,
    sourceName: string,
    data?: Record<string, any>,
  ): void => {
    this.printLine({
      type: "log",
      text: message,
      source: { type: "external", sourceName },
      data,
    });
  };

  public submit = (input: string): void => {
    if (!input.trim()) return;
    this.commandHistory.unshift(input);
    this.historyIndex = -1;
    const [commandName, ...args] = input.trim().split(" ");
    const command = this.commandRegistry.get(commandName);
    if (!command) {
      this.printLine({
        type: "error",
        text: `Command not found: ${commandName}`,
        source: { type: "system", command: "submit" },
      });
      return;
    }
    this.commandQueue.push({ input, command, args });
    this.processQueue();
  };

  public getPreviousCommand = (): string => {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
    }
    return this.commandHistory[this.historyIndex] ?? "";
  };

  public getNextCommand = (): string => {
    if (this.historyIndex > 0) {
      this.historyIndex--;
    } else {
      this.historyIndex = -1;
    }
    return this.commandHistory[this.historyIndex] ?? "";
  };

  public clear = (): void => {
    this.lines = [];
    this.emitLinesChanged();
  };

  // --- Internal Logic ---
  private processQueue = async (): Promise<void> => {
    if (this.state !== "IDLE") return;
    this.setState("PROCESSING");
    while (this.commandQueue.length > 0) {
      const { input, command, args } = this.commandQueue.shift()!;
      this.printLine({
        type: "input",
        text: input,
        prompt: this.promptSymbol,
        source: { type: "user" },
      });
      try {
        const result = await command.execute(args, this);
        if (isAwaitEventSignal(result)) {
          this.setState("AWAITING_EVENT");
          if (result.displayMessage)
            this.printLine({
              type: "log",
              text: result.displayMessage,
              source: { type: "system", command: command.name },
            });
          this.once(result.eventName, () => {
            this.printLine({
              type: "log",
              text: `✔ Event '${result.eventName}' received. Resuming...`,
              source: { type: "system", command: command.name },
            });
            this.setState("IDLE");
            this.processQueue();
          });
          return;
        }
        if (result) {
          const lines = Array.isArray(result) ? result : [result];
          lines.forEach((line) =>
            this.printLine({
              ...line,
              source: { type: "system", command: command.name },
            }),
          );
        }
      } catch (error) {
        this.printLine({
          type: "error",
          text: (error as Error).message,
          source: { type: "system", command: command.name },
        });
      }
    }
    this.setState("IDLE");
  };

  private handleSettingsChange = (event: SettingChangeEvent<any>): void => {
    if (event.key === "promptSymbol") {
      this.promptSymbol = event.value;
    }
  };

  private registerCommand = (command: Command): void => {
    this.commandRegistry.set(command.name, command);
  };

  private registerDefaultCommands = (): void => {
    this.registerCommand(helpCommand);
    this.registerCommand(clearCommand);
    this.registerCommand(waitCommand);
    this.registerCommand(confirmCommand);
    this.registerCommand(echoCommand);
    this.registerCommand(dateCommand);
  };

  private printLine = (lineData: LineData): void => {
    const completeLine: TerminalLine = {
      ...lineData,
      id: uuidv4(),
      timestamp: new Date(),
    };
    this.lines = [...this.lines, completeLine];
    this.emitLinesChanged();
  };

  private setState = (newState: EngineState): void => {
    if (this.state === newState) return;
    this.state = newState;
    this.emitStateChanged();
  };

  private emitLinesChanged = (): void => {
    this.emit("lines-changed", this.lines);
  };

  private emitStateChanged = (): void => {
    this.emit("state-changed", this.state);
  };
}
