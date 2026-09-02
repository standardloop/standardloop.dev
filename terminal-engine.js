class TerminalEngine {
  constructor({
    promptHost = "standardloop.dev",
    promptSymbol = "$",
    getPromptPath,
    onCommand,
  } = {}) {
    this.promptHost = promptHost;
    this.promptSymbol = promptSymbol;
    this.isLastError = false;

    this.inJSMode = false;

    this.getPromptPath =
      typeof getPromptPath === "function" ? getPromptPath : () => "~";
    this.onCommand = typeof onCommand === "function" ? onCommand : () => {};

    this.inputBuffer = "";
    this.history = [];
    this.historyIndex = -1;

    // Set by clearScreen() so the next prompt is drawn flush at the top,
    // with no leading blank line above it.
    this.suppressNextPromptNewline = false;

    this.colors = this._buildColors();

    this.term = new Terminal({
      cursorBlink: true,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 15,
      letterSpacing: 0.5,
      theme: {
        background: "#111418",
        foreground: "#f2f5f8",
        cursor: "#4fa8ff",
        cursorAccent: "#111418",
        selectionBackground: "#4fa8ff33",
        black: "#111418",
        red: "#e0524a",
        green: "#46d383",
        yellow: "#e0a83f",
        blue: "#4fa8ff",
        magenta: "#4fa8ff",
        cyan: "#46d383",
        white: "#f2f5f8",
        brightBlack: "#8b95a1",
      },
      scrollback: 2000,
    });

    this.fitAddon = new FitAddon.FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.open(document.getElementById("terminal"));
    this.fitAddon.fit();
    this.prompt = "";

    window.addEventListener("resize", () => this.fitAddon.fit());

    // Exposed so TerminalWindow can reflow xterm's cols/rows after a manual
    // drag-resize or minimize/maximize. Scheduling via rAF here (rather than
    // making every caller wrap it) keeps a resize's DOM write and its fit
    // in the same frame.
    window.__fitTerminal = () =>
      requestAnimationFrame(() => this.fitAddon.fit());

    this._bindScrollbarAutoHide();
    this._bindInput();

    // If this exact page state is ever restored from the browser's
    // back/forward cache (e.g. pressing "back" after the `shutdown`
    // command), undo the power-off visual so it can't come back frozen in
    // its collapsed, invisible end state.
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) document.body.classList.remove("is-shutting-down");
    });
  }

  _buildColors() {
    const rgbParts = (hex) =>
      hex
        .match(/\w\w/g)
        .map((h) => parseInt(h, 16))
        .join(";");
    const colorize = (hex) => (s) => `\x1b[38;2;${rgbParts(hex)}m${s}\x1b[0m`;
    return {
      blue: colorize("#4fa8ff"),
      green: colorize("#46d383"),
      dim: colorize("#8b95a1"),
      red: colorize("#e0524a"),
    };
  }

  // Scrollbar only appears while actively scrolling, then fades back out.
  _bindScrollbarAutoHide() {
    const viewportEl = document.querySelector("#terminal .xterm-viewport");
    if (!viewportEl) return;
    let hideTimer = null;
    viewportEl.addEventListener("scroll", () => {
      viewportEl.classList.add("is-scrolling");
      clearTimeout(hideTimer);
      hideTimer = setTimeout(
        () => viewportEl.classList.remove("is-scrolling"),
        800,
      );
    });
  }

  // ---------- Output ----------

  write(text) {
    this.term.write(text);
  }

  setPromptSymbol(symbol) {
    this.promptSymbol = symbol;
  }

  setIsLastError(value) {
    this.isLastError = value;
  }

  getPrompt(leadingNewline = true) {
    const newline = leadingNewline ? "\r\n" : "";
    const { blue, green, red } = this.colors;
    let prompt = `${newline}`;
    if (!this.inJSMode) {
      prompt += `${blue(this.getPromptPath())} `;
    }
    if (this.isLastError) {
      prompt += `${red(this.promptSymbol)} `;
    } else {
      prompt += `${green(this.promptSymbol)} `;
    }
    return prompt;
  }

  writePrompt(leadingNewline = true) {
    this.term.write(this.getPrompt(leadingNewline));
  }

  printLines(content) {
    const lines = Array.isArray(content) ? content : [content];
    for (const line of lines) this.term.write(`\r\n${line}`);
  }

  // Clearing needs its own explicit newline before wiping: xterm's
  // clear() preserves whatever line the cursor is currently on as the new
  // top row rather than fully homing the cursor, so without first moving to
  // a fresh blank line, the just-typed "clear" text would still be there.
  clearScreen() {
    this.term.write("\r\n");
    this.term.clear();
    this.suppressNextPromptNewline = true;
  }

  boot() {
    this.term.write(this.colors.blue("Welcome to standardloop.dev"));
    this.term.write(
      `\r\n${this.colors.dim("Type 'help' to see available commands.")}`,
    );
    this.writePrompt(true);
    this.term.focus();
  }

  // ---------- Input handling ----------

  _bindInput() {
    this.term.onData((data) => {
      const code = data.charCodeAt(0);

      if (data === "\r") {
        // Enter — no explicit newline here: an empty command has nothing to
        // print (so writePrompt's own leading newline is the only line
        // break needed), and a non-empty command's first output line
        // already supplies one via printLines. Writing one here too would
        // double up.
        if (this.inputBuffer.trim()) {
          this.history.push(this.inputBuffer);
          this.historyIndex = this.history.length;
          // TODO handle js history too
          if (this.inJSMode) {
            // TODO handle exit code to
            if (this.inputBuffer.split(" ")[0] === "exit") {
              this.setInJSMode(false);
              this.setPromptSymbol("$");
              this.printLines(this.colors.dim("Back in normal mode"));
            } else {
              try {
                const result = (0, eval)(this.inputBuffer);
                if (result !== undefined) {
                  this.setIsLastError(false);
                  this.printLines(result);
                }
              } catch (err) {
                this.setIsLastError(true);
                this.printLines(err);
              }
            }
          } else {
            this.onCommand(this.inputBuffer);
          }
        }
        this.inputBuffer = "";
        this.writePrompt(!this.suppressNextPromptNewline);
        this.suppressNextPromptNewline = false;
      } else if (code === 127) {
        // Backspace
        if (this.inputBuffer.length > 0) {
          this.inputBuffer = this.inputBuffer.slice(0, -1);
          this.term.write("\b \b");
        }
      } else if (data === "\x1b[A") {
        // Up arrow — previous history
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this._replaceLine(this.history[this.historyIndex]);
        }
      } else if (data === "\x1b[B") {
        // Down arrow — next history
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this._replaceLine(this.history[this.historyIndex]);
        } else {
          this.historyIndex = this.history.length;
          this._replaceLine("");
        }
      } else if (code === 3) {
        // control c
        this.writePrompt(true);
        this.term.focus();
      } else if (code < 32) {
        // ignore other control chars
        console.log(code);
      } else {
        this.inputBuffer += data;
        this.term.write(data);
      }
    });
  }

  _replaceLine(newText) {
    this.term.write("\r\x1b[K" + newText);
    this.inputBuffer = newText;
  }

  setInJSMode(value) {
    this.inJSMode = value;
  }
}
