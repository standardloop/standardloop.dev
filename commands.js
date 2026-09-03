class CommandProcessor {
  constructor(terminal) {
    this.terminal = terminal;
    this.cwdPath = []; // path segments from root; [] = home
    this.commands = this._buildCommands();
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

  // ---------- Commands ----------

  _buildCommands() {
    const t = this.terminal;
    const { blue, dim, red, green } = t.colors;

    return {
      help: () => {
        t.setIsLastError(false);
        t.printLines([
          "Available commands:",
          "",
          "  help              show this list",
          "  docs              open my documentation website",
          "  this              open my GitHub repo for this application",
          "  symbol            sets the prompt symbol, default is >, takes one arg",
          "  contact           how to reach me",
          "  ls                list files in current directory",
          "  cd <dir>          change directory (cd .. to go back)",
          "  cat <file>        print a file's contents",
          "  clear             clear the screen",
          "  exit              close the terminal window",
          "  shutdown          power off",
          "  whoami",
          "  banner",
          "",
          "Drag the title bar to move the window, or any edge/corner",
          "to resize it. The red/yellow/green buttons close, minimize,",
          "and maximize it.",
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
        t.printLines(
          dim("Goodbye — click 'Reopen terminal' below to come back."),
        );
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
        ];
        t.printLines(egg);
      },

      pwd: () => {
        t.setIsLastError(false);
        t.printLines("/" + this.cwdPath.join("/"));
      },

      js: () => {
        t.setIsLastError(false);
        t.printLines(dim('Entering javascript mode, type "exit" to get out'));
        t.setPromptSymbol(">");
        t.setInJSMode(true);
      },
      version: () => {
        t.setIsLastError(false);
        t.printLines(green("v0.1.5"));
      },
    };
  }
}
