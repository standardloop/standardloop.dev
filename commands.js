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
      this.terminal.printLines(
        red(`command not found: ${cmd}`) + `  ${dim("(try 'help')")}`,
      );
    }
  }

  // ---------- Commands ----------

  _buildCommands() {
    const t = this.terminal;
    const { blue, dim, red } = t.colors;

    return {
      help: () => {
        t.printLines([
          "Available commands:",
          "",
          "  help              show this list",
          "  about             who I am",
          "  contact           how to reach me",
          "  ls                list files in current directory",
          "  cd <dir>          change directory (cd .. to go back)",
          "  cat <file>        print a file's contents",
          "  clear             clear the screen",
          "  exit              close the terminal window",
          "  shutdown          power off (fades out, then blanks the tab)",
          "  whoami",
          "  banner",
          "",
          "Drag the title bar to move the window, or any edge/corner",
          "to resize it. The red/yellow/green buttons close, minimize,",
          "and maximize it.",
        ]);
      },

      about: () => t.printLines(FILESYSTEM["about.txt"]),

      contact: () => t.printLines(FILESYSTEM["contact.txt"]),

      projects: () => {
        const dir = FILESYSTEM.projects;
        t.printLines([
          "Projects (cd projects && ls for details, or cat directly):",
          "",
          ...Object.keys(dir).map((f) => `  ${f}`),
        ]);
      },

      whoami: () => t.printLines(`${PORTFOLIO.name} — ${PORTFOLIO.role}`),

      banner: () => {
        t.printLines(PORTFOLIO.banner.map((l) => blue(l)));
        t.printLines([
          "",
          dim(`${PORTFOLIO.role} — type 'help' to get started`),
        ]);
      },

      clear: () => t.clearScreen(),

      exit: () => {
        t.printLines(
          dim("Goodbye — click 'Reopen terminal' below to come back."),
        );
        if (window.terminalWindow) {
          // Let the farewell line actually render before the window closes.
          setTimeout(() => window.terminalWindow.close(), 150);
        }
      },

      shutdown: () => {
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
        if (!dir)
          return t.printLines(red("ls: cannot access current directory"));
        const entries = Object.entries(dir).map(([name, val]) => {
          const isDir = typeof val === "object" && !Array.isArray(val);
          return isDir ? blue(name + "/") : name;
        });
        t.printLines(entries.length ? entries.join("   ") : dim("(empty)"));
      },

      cd: (args) => {
        const target = args[0];
        if (!target || target === "~") {
          this.cwdPath = [];
          return;
        }
        if (target === "..") {
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
          this.cwdPath = [...this.cwdPath, target];
        } else {
          t.printLines(red(`cd: no such directory: ${target}`));
        }
      },

      cat: (args) => {
        const target = args[0];
        if (!target) return t.printLines(red("cat: missing file operand"));
        const dir = this.currentDir();
        if (
          dir &&
          target in dir &&
          (typeof dir[target] === "string" || Array.isArray(dir[target]))
        ) {
          t.printLines(dir[target]);
        } else {
          t.printLines(red(`cat: ${target}: No such file`));
        }
      },

      sudo: () =>
        t.printLines(
          red("Nice try. This terminal only has one user, and it's me."),
        ),

      pwd: () => t.printLines("/" + this.cwdPath.join("/")),
    };
  }
}
