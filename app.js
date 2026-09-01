"use strict";

let commands;

const terminal = new TerminalEngine({
  getPromptPath: () => commands.promptPath(),
  onCommand: (input) => commands.run(input),
});

commands = new CommandProcessor(terminal);

window.terminalWindow = new TerminalWindow({
  fit: () => {
    if (window.__fitTerminal) window.__fitTerminal();
  },
});

window.background = new Background();

terminal.boot();
