"use strict";

async function getParsedBrowserAndOSData() {
  const data = {
    // 1. High-Level OS & Platform Info
    platform: navigator.platform,
    userAgentRaw: navigator.userAgent,

    // 2. Hardware Capabilities
    cpuCores: navigator.hardwareConcurrency || "Unknown",
    deviceMemoryGB: navigator.deviceMemory || "Unknown (or < 1GB)",

    // 3. User Preferences & Localization
    language: navigator.language,
    allLanguages: navigator.languages,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,

    // 4. Modern Client Hints (Asynchronous & Highly Detailed)
    modernHints: {
      brandData: navigator.userAgentData?.brands || [],
      isMobile: navigator.userAgentData?.mobile || false,
      osName: navigator.userAgentData?.platform || "Unknown",
      osVersion: "Requires permission/async call (see below)",
    },
  };

  // Request high-entropy (detailed) values if the browser supports it
  if (
    navigator.userAgentData &&
    typeof navigator.userAgentData.getHighEntropyValues === "function"
  ) {
    try {
      const highEntropy = await navigator.userAgentData.getHighEntropyValues([
        "architecture",
        "bitness",
        "model",
        "platformVersion",
        "uaFullVersion",
      ]);

      data.modernHints.osVersion = highEntropy.platformVersion;
      data.modernHints.architecture = highEntropy.architecture; // e.g., "x86" or "arm"
      data.modernHints.bitness = highEntropy.bitness; // e.g., "64"
      data.modernHints.deviceModel = highEntropy.model; // e.g., "Pixel 6" or "" on desktop
    } catch (e) {
      console.warn("High-entropy data access denied or failed:", e);
    }
  }
  return data;
}

const backgroundSpaceLayers = [
  { count: 500, drift: 0.5, size: [0.05, 0.1], alpha: [0.05, 0.1] },
  { count: 100, drift: 1, size: [0.5, 1.2], alpha: [0.15, 0.4] },
  { count: 50, drift: 4, size: [1.0, 1.8], alpha: [0.35, 0.65] },
  { count: 12, drift: 8, size: [1.4, 2.2], alpha: [0.55, 1.0] },
  // { count: 1, drift: 100, size: [10, 10], alpha: [1.0, 5.0] },
];

window.addEventListener("DOMContentLoaded", async () => {
  let commands;

  const osInfo = await getParsedBrowserAndOSData();

  const terminal = new TerminalEngine({
    getPromptPath: () => commands.promptPath(),
    onCommand: (input) => commands.run(input),
  });

  commands = new CommandProcessor(terminal, osInfo);

  window.terminalWindow = new TerminalWindow({
    fit: () => {
      if (window.__fitTerminal) window.__fitTerminal();
    },
  });

  window.background = new Background(backgroundSpaceLayers);

  terminal.boot();
});
