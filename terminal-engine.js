class TerminalEngine {
  constructor(
    {
      promptHost = "standardloop.dev",
      promptSymbol = "$",
      getPromptPath,
      onCommand,
    } = {},
    colors,
  ) {
    this.promptHost = promptHost;
    this.promptSymbol = promptSymbol;
    this.isLastError = false;

    this.inJSMode = false;

    this.getPromptPath =
      typeof getPromptPath === "function" ? getPromptPath : () => "~";
    this.onCommand = typeof onCommand === "function" ? onCommand : () => {};

    this.resetInputBuffer();
    this.history = [];
    this.historyIndex = -1;

    // Set by clearScreen() so the next prompt is drawn flush at the top,
    // with no leading blank line above it.
    this.suppressNextPromptNewline = false;

    this.colors = colors;

    this.term = new Terminal({
      cursorStyle: "block", // https://xtermjs.org/docs/api/terminal/interfaces/iterminaloptions/#optional-cursorstyle
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

  resetInputBuffer() {
    this.inputBufferCursorIndex = 0;
    this.inputBuffer = "";
  }

  // ---------- Input handling ----------
  _bindInput() {
    this.term.onData((data) => {
      const code = data.charCodeAt(0);

      if (data === "\r") {
        if (this.inputBuffer.trim()) {
          this.history.push(this.inputBuffer);
          this.historyIndex = this.history.length;
          // TODO handle js history too
          if (this.inJSMode) {
            if (this.inputBuffer.split(" ")[0] === ".exit") {
              this.setIsLastError(false);
              this.setInJSMode(false);
              this.setPromptSymbol("$");
              this.printLines(this.colors.dim("Back in normal mode"));
            } else {
              try {
                const result = (0, eval)(this.inputBuffer);
                if (result !== undefined) {
                  this.printLines(result);
                }
                this.setIsLastError(false);
              } catch (err) {
                this.setIsLastError(true);
                this.printLines(err);
              }
            }
          } else {
            this.onCommand(this.inputBuffer);
          }
        } else {
          this.setIsLastError(false);
        }
        this.resetInputBuffer();
        this.writePrompt(!this.suppressNextPromptNewline);
        this.suppressNextPromptNewline = false;
      } else if (code === 127) {
        // Backspace
        if (this.inputBuffer.length > 0 && this.inputBufferCursorIndex > 0) {
          this.inputBuffer =
            this.inputBuffer.slice(0, this.inputBufferCursorIndex - 1) +
            this.inputBuffer.slice(this.inputBufferCursorIndex);

          this.inputBufferCursorIndex--;

          const fullLineText = this.getPrompt(false) + this.inputBuffer;
          this.term.write("\r\x1b[K" + fullLineText);

          const totalLength = fullLineText.length;
          const promptLength = this.getPrompt(false).length;
          const targetVisualCursor = promptLength + this.inputBufferCursorIndex;
          const moveLeftCount = totalLength - targetVisualCursor;
          if (moveLeftCount > 0) {
            this.term.write(`\x1b[${moveLeftCount}D`);
          }
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
      } else if (data === "\x1b[C") {
        // Right arrow
        if (this.inputBufferCursorIndex < this.inputBuffer.length) {
          this.inputBufferCursorIndex++;
          this.term.write(data);
        }
      } else if (data === "\x1b[D") {
        // Left arrow
        if (this.inputBufferCursorIndex > 0) {
          this.inputBufferCursorIndex--;
          this.term.write(data);
        }
      } else if (code === 3) {
        // control c
        this.setIsLastError(false);
        this.resetInputBuffer();
        this.writePrompt(true);
        this.term.focus();
      } else if (data === "\x1b[H") {
        // fn + left arrow
        if (this.inputBufferCursorIndex > 0) {
          this.term.write(`\x1b[${this.inputBufferCursorIndex}D`);
          this.inputBufferCursorIndex = 0;
        }
      } else if (data === "\x1b[F") {
        // fn + right arrow
        if (this.inputBuffer.length > 0) {
          this.term.write(`\x1b[${this.inputBuffer.length}C`);
          this.inputBufferCursorIndex = this.inputBuffer.length;
        }
      } else if (code < 32) {
        // ignore other control chars
        console.log(code);
      } else {
        const firstPart = this.inputBuffer.slice(
          0,
          this.inputBufferCursorIndex,
        );
        const secondPart = this.inputBuffer.slice(this.inputBufferCursorIndex);

        this.inputBuffer = firstPart + data + secondPart;
        this.inputBufferCursorIndex += data.length;

        if (
          this.inputBufferCursorIndex - data.length ===
          this.inputBuffer.length - data.length
        ) {
          this.term.write(data);
        } else {
          // typing in between (typing after using left arrow)
          const fullLineText = this.getPrompt(false) + this.inputBuffer;
          this.term.write("\x1b[?25l\r\x1b[K" + fullLineText); // hide cursor

          const totalLength = fullLineText.length;
          const promptLength = this.getPrompt(false).length;
          const targetVisualCursor = promptLength + this.inputBufferCursorIndex;
          const moveLeftCount = totalLength - targetVisualCursor;

          if (moveLeftCount > 0) {
            this.term.write(`\x1b[${moveLeftCount}D`);
          }

          this.term.write("\x1b[?25h"); // show cursor
        }
      }
    });
  }

  _replaceLine(newText) {
    this.term.write("\r\x1b[K" + this.getPrompt(false) + newText);
    this.inputBuffer = newText;
    this.inputBufferCursorIndex = newText.length;
  }

  setInJSMode(value) {
    this.inJSMode = value;
  }
}
