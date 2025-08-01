import EventEmitter from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import {
  Command,
  EngineState,
  QueuedCommand,
  TerminalLine,
  TerminalLineInput,
  AwaitEventSignal,
} from "./types";

// Type guard
const isAwaitEventSignal = (val: any): val is AwaitEventSignal =>
  val && val._type === "AWAIT_EVENT";

// Example commands
const helpCommand: Command = {
  name: "help",
  description: "...",
  execute: async () => ({
    type: "output",
    text: "Available commands: help, clear, wait, confirm",
  }),
};

const clearCommand: Command = {
  name: "clear",
  description: "...",
  execute: async (_, engine) => {
    engine.clear();
  },
};

const waitCommand: Command = {
  name: "wait",
  description: "...",
  execute: async (args) => {
    const ms = parseInt(args[0], 10) || 1000;
    await new Promise((r) => setTimeout(r, ms));
    return {
      type: "system",
      text: `Waited ${ms}ms`,
    };
  },
};

const confirmCommand: Command = {
  name: "confirm",
  description: "...",
  execute: async () => ({
    _type: "AWAIT_EVENT",
    eventName: "user-confirmed",
    displayMessage: "Waiting for user confirmation...",
  }),
};

export class TerminalEngine {
  private state: EngineState = "IDLE";
  private awaitingEventName: string | null = null;
  private commandQueue: QueuedCommand[] = [];
  private lines: TerminalLine[] = [];
  private commandHistory: string[] = [];
  private historyIndex = -1;
  private commandRegistry = new Map<string, Command>();
  private eventBus = new EventEmitter();

  constructor() {
    this.registerCommand(helpCommand);
    this.registerCommand(clearCommand);
    this.registerCommand(waitCommand);
    this.registerCommand(confirmCommand);
    this.eventBus.on("external-event", this.handleExternalEvent);
  }

  // --- Public API ---

  public getLines = () => this.lines;
  public getEngineState = () => this.state;

  public on = (event: string, listener: (...args: any[]) => void) =>
    this.eventBus.on(event, listener);
  public off = (event: string, listener: (...args: any[]) => void) =>
    this.eventBus.off(event, listener);

  public dispatchEvent = (eventName: string, payload?: any) => {
    this.eventBus.emit("external-event", { eventName, payload });
  };

  public submit = (input: string) => {
    if (!input.trim()) return;
    this.printLine({ type: "input", text: input });
    this.commandHistory.unshift(input);
    this.historyIndex = -1;

    const [commandName, ...args] = input.trim().split(" ");
    const command = this.commandRegistry.get(commandName);

    if (!command) {
      this.printLine({
        type: "error",
        text: `Command not found: ${commandName}`,
      });
      return;
    }

    this.commandQueue.push({ input, command, args });
    if (this.state === "IDLE") this.processQueue();
  };

  public getPreviousCommand = () => {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      return this.commandHistory[this.historyIndex];
    }
    return this.commandHistory[this.historyIndex];
  };

  public getNextCommand = () => {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.commandHistory[this.historyIndex];
    }
    this.historyIndex = -1;
    return "";
  };

  public clear = () => {
    this.lines = [];
    this.emitUpdate();
  };

  // --- Internal Logic ---

  private processQueue = async (): Promise<void> => {
    if (this.commandQueue.length === 0) {
      this.setState("IDLE");
      return;
    }
    if (this.state === "AWAITING_EVENT") return;

    this.setState("PROCESSING");
    const { command, args } = this.commandQueue.shift()!;

    try {
      const result = await command.execute(args, this);

      if (isAwaitEventSignal(result)) {
        this.awaitingEventName = result.eventName;
        this.setState("AWAITING_EVENT");
        if (result.displayMessage)
          this.printLine({ type: "system", text: result.displayMessage });
        return;
      }

      if (result) {
        const lines = Array.isArray(result) ? result : [result];
        lines.forEach((line) => this.printLine(line));
      }
    } catch (error) {
      this.printLine({ type: "error", text: (error as Error).message });
    }

    this.processQueue();
  };

  private handleExternalEvent = ({ eventName }: { eventName: string }) => {
    if (
      this.state === "AWAITING_EVENT" &&
      this.awaitingEventName === eventName
    ) {
      this.printLine({
        type: "system",
        text: `✔ Event '${eventName}' received. Resuming...`,
      });
      this.awaitingEventName = null;
      this.processQueue();
    }
  };

  private registerCommand = (command: Command) =>
    this.commandRegistry.set(command.name, command);

  private printLine = (lineData: TerminalLineInput) => {
    this.lines.push({ ...lineData, id: uuidv4(), timestamp: new Date() });
    this.emitUpdate();
  };

  private setState = (newState: EngineState) => {
    if (this.state === newState) return;
    this.state = newState;
    this.emitUpdate();
  };

  private emitUpdate = () => this.eventBus.emit("update");
}
