"use strict";

const backgroundSpaceLayers = [
  { count: 500, drift: 0.5, size: [0.05, 0.1], alpha: [0.05, 0.1] },
  { count: 100, drift: 1, size: [0.5, 1.2], alpha: [0.15, 0.4] },
  { count: 50, drift: 4, size: [1.0, 1.8], alpha: [0.35, 0.65] },
  { count: 12, drift: 8, size: [1.4, 2.2], alpha: [0.55, 1.0] },
  // { count: 1, drift: 100, size: [10, 10], alpha: [1.0, 5.0] },
];

window.addEventListener("DOMContentLoaded", async () => {
  let commands;

  const colors = buildColors();
  const osInfo = await getParsedBrowserAndOSData();

  const terminal = new TerminalEngine(
    {
      getPromptPath: () => commands.promptPath(),
      onCommand: (input) => commands.run(input),
    },
    colors,
  );

  commands = new CommandProcessor(terminal, osInfo);

  window.terminalWindow = new TerminalWindow({
    fit: () => {
      if (window.__fitTerminal) window.__fitTerminal();
    },
  });

  window.background = new Background(backgroundSpaceLayers);

  terminal.boot();
});
