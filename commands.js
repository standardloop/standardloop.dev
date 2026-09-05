function padNewlines(art, linecount, emptyLine) {
  const originalArtLength = art.length;
  let artWithMoreNewlines = art;
  for (let i = 0; i < linecount - originalArtLength; i++) {
    artWithMoreNewlines.push(emptyLine);
  }
  return artWithMoreNewlines;
}

class CommandProcessor {
  constructor(terminal, osInfo, osLogos, version) {
    this.terminal = terminal;
    this.cwdPath = []; // path segments from root; [] = home
    this.commands = this._buildCommands();
    this.osInfo = osInfo;
    this.osLogos = osLogos;
    this.version = version;
  }

  // ---------- Virtual filesystem ----------
  promptPath() {
    return this.cwdPath.length ? "~/" + this.cwdPath.join("/") : "~";
  }

  resolveDir(path) {
    let node = FILESYSTEM;
    for (const seg of path) {
      if (
        !(seg in node) ||
        typeof node[seg] === "string" ||
        Array.isArray(node[seg])
      ) {
        return null;
      }
      node = node[seg];
    }
    return node;
  }

  currentDir() {
    return this.resolveDir(this.cwdPath);
  }

  // ---------- Running a command ----------

  run(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const [cmd, ...args] = trimmed.split(/\s+/);
    const { red, dim } = this.terminal.colors;
    if (cmd in this.commands) {
      this.commands[cmd](args);
    } else {
      this.terminal.setIsLastError(true);
      this.terminal.printLines(
        red(`command not found: ${cmd}`) + `  ${dim("(try 'help')")}`,
      );
    }
  }

  printSystemInfo(os) {
    const t = this.terminal;
    const { green } = t.colors;

    const { art: osArt, color: colorFunction } =
      this.osLogos.getOSArtAndColor(os);

    console.log(osArt[0].length);

    t.setIsLastError(false);
    let systemInfo = [
      green(`standardloop`) + `.` + green(`dev`),
      `----------------`,
      colorFunction("OS:") +
        ` ${this.osInfo.modernHints.osName} ${this.osInfo.modernHints.osVersion} ${this.osInfo.modernHints.architecture}`,
      colorFunction("Shell: ") + `standardloopshell ${this.version}`,
      colorFunction("Theme: ") + `Starfield`,
      colorFunction("Terminal: ") + `standardloop.dev`,
      colorFunction("Terminal Font: ") + `IBM Plex Mono`,
      colorFunction("Memory: ") + `${this.osInfo.deviceMemoryGB} GB`,
      colorFunction("CPU: ") + `${this.osInfo.cpuCores} Cores`,
      colorFunction("TimeZone: ") + `${this.osInfo.timeZone}`,
      colorFunction("DarkMode: ") + `${this.osInfo.isDarkMode}`,
      colorFunction("Mobile: ") + `${this.osInfo.modernHints.isMobile}`,
      colorFunction("Platform: ") + `${this.osInfo.platform}`,
      //`User Agent: ${this.osInfo.userAgentRaw}`,
      colorFunction("Language: ") + `${this.osInfo.language}`,
      colorFunction("All Languages: ") + `${this.osInfo.allLanguages}`,
      //`BrandData: ${this.osInfo.modernHints.brandData}`,
      colorFunction("Model: ") + `${this.osInfo.modernHints.deviceModel}`,
      colorFunction("Bitness: ") + `${this.osInfo.modernHints.bitness}`,
      //`FullVersionList: ${this.osInfo.modernHints.fullVersionList}`,
    ];

    const emptyLineLength = osArt.at(-1).length; // every art last line is an empty line
    const emptyLine = " ".repeat(emptyLineLength);

    let combindedOutput =
      systemInfo.length > osArt.length
        ? padNewlines(osArt, systemInfo.length, emptyLine)
        : osArt;

    for (let i = 0; i < systemInfo.length; i++) {
      combindedOutput[i] = combindedOutput[i] + systemInfo[i];
    }
    t.printLines(combindedOutput);
  }
  // ---------- Commands ----------.
  _buildCommands() {
    const t = this.terminal;
    const { blue, dim, red, green } = t.colors;

    return {
      help: () => {
        const totalDistanceBeforeDescription = 18;
        function setupCommand(name, description) {
          let dynamicSpaces = " ".repeat(
            totalDistanceBeforeDescription - name.length,
          );
          return "  " + green(name) + dynamicSpaces + dim(description);
        }
        t.setIsLastError(false);
        t.printLines([
          "Available commands:",
          "",
          setupCommand("help", "show this list"),
          setupCommand("docs", "opens my documentation website"),
          setupCommand("this", "opens my GitHub repo for this application"),
          setupCommand("symbol <symbol>", "sets the prompt symbol"),
          setupCommand("contact", "how to reach me"),
          setupCommand("ls", "list files in current directory"),
          setupCommand("cd <dir>", "change directory (cd .. to go back)"),
          setupCommand("cat <file>", "print a file's contents"),
          setupCommand("clear", "clear the screen"),
          setupCommand("whoami", "prints my information"),
          setupCommand("banner", "show my banner"),
          setupCommand("fastfetch", "show system information"),
          setupCommand("js", "enter javascript mode"),
          setupCommand("exit", "closes the terminal window"),
          setupCommand("shutdown", "power off"),
          "",
        ]);
      },

      contact: () => {
        t.setIsLastError(false);
        t.printLines(FILESYSTEM["contact.txt"]);
      },

      docs: () => {
        t.setIsLastError(false);
        t.printLines("opening https://docs.standardloop.dev...");
        window.open("https://docs.standardloop.dev", "_blank");
      },

      this: () => {
        t.setIsLastError(false);
        t.printLines(
          "opening https://github.com/standardloop/standardloop.dev...",
        );
        window.open(
          "https://github.com/standardloop/standardloop.dev",
          "_blank",
        );
      },

      projects: () => {
        const dir = FILESYSTEM.projects;
        t.setIsLastError(false);
        t.printLines([
          "Projects (cd projects && ls for details, or cat directly):",
          "",
          ...Object.keys(dir).map((f) => `  ${f}`),
        ]);
      },

      whoami: () => {
        t.setIsLastError(false);
        t.printLines(`${PORTFOLIO.name} — ${PORTFOLIO.role}`);
      },

      banner: () => {
        t.setIsLastError(false);
        t.printLines(PORTFOLIO.banner.map((l) => blue(l)));
      },

      clear: () => {
        t.setIsLastError(false);
        t.clearScreen();
      },

      exit: () => {
        t.setIsLastError(false);
        t.printLines(dim("Goodbye"));
        if (window.terminalWindow) {
          // Let the farewell line actually render before the window closes.
          setTimeout(() => window.terminalWindow.close(), 150);
        }
      },

      shutdown: () => {
        t.setIsLastError(false);
        t.printLines(dim("Shutting down…"));
        setTimeout(() => {
          document.body.classList.add("is-shutting-down");
          setTimeout(() => {
            // Kept as a normal navigation (not .replace()) so this page
            // stays in history — pressing "back" from about:blank returns
            // here. TerminalEngine's pageshow listener resets the
            // collapsed shutdown visual if the browser restores this
            // exact state from bfcache.
            window.location.href = "about:blank";
          }, 700); // matches the CSS animation duration
        }, 300);
      },

      ls: () => {
        const dir = this.currentDir();
        if (!dir) {
          t.setIsLastError(true);
          return t.printLines(red("ls: cannot access current directory"));
        }
        const entries = Object.entries(dir).map(([name, val]) => {
          const isDir = typeof val === "object" && !Array.isArray(val);
          return isDir ? blue(name + "/") : name;
        });
        t.setIsLastError(false);
        t.printLines(entries.length ? entries.join("   ") : dim("(empty)"));
      },

      cd: (args) => {
        const target = args[0];
        if (!target || target === "~") {
          t.setIsLastError(false);
          this.cwdPath = [];
          return;
        }
        if (target === "..") {
          t.setIsLastError(false);
          this.cwdPath = this.cwdPath.slice(0, -1);
          return;
        }
        const dir = this.currentDir();
        if (
          dir &&
          target in dir &&
          typeof dir[target] === "object" &&
          !Array.isArray(dir[target])
        ) {
          t.setIsLastError(false);
          this.cwdPath = [...this.cwdPath, target];
        } else {
          t.setIsLastError(true);
          t.printLines(red(`cd: no such directory: ${target}`));
        }
      },

      cat: (args) => {
        const target = args[0];
        if (!target) {
          t.setIsLastError(true);
          return t.printLines(red("cat: missing file operand"));
        }
        const dir = this.currentDir();
        if (
          dir &&
          target in dir &&
          (typeof dir[target] === "string" || Array.isArray(dir[target]))
        ) {
          t.setIsLastError(false);
          t.printLines(dir[target]);
        } else {
          t.setIsLastError(true);
          t.printLines(red(`cat: ${target}: No such file`));
        }
      },

      symbol: (args) => {
        const symbol = args[0];
        if (symbol.length !== 1) {
          t.setIsLastError(true);
          t.printLines(
            red(`symbol: "${symbol}" symbol must be one character only`),
          );
        } else {
          t.setIsLastError(false);
          t.setPromptSymbol(symbol);
        }
      },

      sudo: () => {
        t.setIsLastError(false);
        t.printLines(red("Nice try"));
      },

      easteregg: () => {
        t.setIsLastError(false);
        const egg = [
          "      ████",
          "    ██░░░░██",
          "  ██░░░░░░░░██",
          "  ██░░░░░░░░██",
          "██░░░░░░░░░░░░██",
          "██░░░░░░░░░░░░██",
          "██░░░░░░░░░░░░██",
          "  ██░░░░░░░░██",
          "    ████████",
          "                ",
        ];
        t.printLines(egg);
      },

      pwd: () => {
        t.setIsLastError(false);
        t.printLines("/" + this.cwdPath.join("/"));
      },

      js: () => {
        t.setIsLastError(false);
        t.printLines(dim('Entering javascript mode, type ".exit" to get out'));
        t.setPromptSymbol(">");
        t.setInJSMode(true);
      },
      version: () => {
        t.setIsLastError(false);
        t.printLines(green(this.version));
      },
      fastfetch: (args) => {
        let os = args[0];
        if (!os) {
          os = this.osInfo.modernHints.osName;
        }
        this.printSystemInfo(os);
      },
    };
  }
}
