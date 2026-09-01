class TerminalWindow {
  constructor({ fit } = {}) {
    this.wrap = document.querySelector(".float-wrap");
    this.frame = document.getElementById("crt-frame");
    this.topbar = document.querySelector(".crt-topbar");
    this.handles = document.querySelectorAll(".rh");
    this.closeBtn = document.querySelector(".crt-dot--red");
    this.minBtn = document.querySelector(".crt-dot--yellow");
    this.zoomBtn = document.querySelector(".crt-dot--green");
    this.reopenBtn = document.getElementById("reopen-btn");

    // Called whenever the content area's size settles — lets app.js reflow
    // xterm's cols/rows without this class needing to know xterm exists.
    this.fit = typeof fit === "function" ? fit : () => {};

    // ---- position state: offset from dead-center of the viewport, in px ----
    this.posX = 0;
    this.posY = 0;
    this.MIN_VISIBLE_X = 70; // px of window width that must stay reachable horizontally
    this.TOP_OVERSHOOT = 0; // px the title bar is allowed to poke above the viewport top
    this.MIN_VISIBLE_BOTTOM = 70; // px that must stay visible if dragged toward the bottom

    // ---- size state ----
    const rect = this.wrap.getBoundingClientRect();
    this.lastW = rect.width;
    this.lastH = rect.height;
    this.MIN_WIDTH = 380;
    this.MIN_HEIGHT = 280;

    // ---- open/minimize/maximize/close state ----
    this.minimized = false;
    this.maximized = false;
    this.closed = false;
    this.preMinimizeHeight = null;
    this.preMaximize = null; // { width, height, x, y }

    this._bindDrag();
    this._bindResize();
    this._bindWindowControls();
  }

  // ============================================================
  // Position
  // ============================================================

  _applyPosition() {
    this.wrap.style.transform = `translate(calc(-50% + ${this.posX}px), calc(-50% + ${this.posY}px))`;
  }

  // Clamped against the window's size — either an explicitly known target
  // size (passed in by a caller that just set a new width/height directly),
  // or the actual current size read live. The explicit-size path matters
  // whenever the change is CSS-transitioned (minimize/maximize): querying
  // the DOM immediately after setting a transitioned property still reports
  // the pre-change size for that tick, so clamping against a live
  // measurement there would clamp against the wrong (stale) size.
  //
  // Horizontally, any part of the window peeking into view is enough (the
  // title bar spans the full width). Vertically it's anchored to the *top*
  // edge specifically — that's where the only drag handle lives, so unlike
  // the horizontal case, letting the bottom of the window be the only
  // visible part would leave the window stuck with no way to grab it again.
  _clampPosition(knownWidth, knownHeight) {
    const rect =
      knownWidth == null || knownHeight == null
        ? this.wrap.getBoundingClientRect()
        : null;
    const halfW = (knownWidth != null ? knownWidth : rect.width) / 2;
    const halfH = (knownHeight != null ? knownHeight : rect.height) / 2;

    const minCenterX = this.MIN_VISIBLE_X - halfW;
    const maxCenterX = window.innerWidth - this.MIN_VISIBLE_X + halfW;
    const centerX = Math.min(
      Math.max(window.innerWidth / 2 + this.posX, minCenterX),
      maxCenterX,
    );

    const minCenterY = halfH - this.TOP_OVERSHOOT;
    const maxCenterY = window.innerHeight - this.MIN_VISIBLE_BOTTOM + halfH;
    const centerY = Math.min(
      Math.max(window.innerHeight / 2 + this.posY, minCenterY),
      maxCenterY,
    );

    this.posX = centerX - window.innerWidth / 2;
    this.posY = centerY - window.innerHeight / 2;
  }

  getPosition() {
    return { x: this.posX, y: this.posY };
  }

  setPosition(x, y, knownWidth, knownHeight) {
    this.posX = x;
    this.posY = y;
    this._clampPosition(knownWidth, knownHeight);
    this._applyPosition();
  }

  // Shifts the anchor point — used to keep one edge/corner fixed in place
  // while the opposite one moves, during a resize.
  nudgePosition(dx, dy, knownWidth, knownHeight) {
    this.posX += dx;
    this.posY += dy;
    this._clampPosition(knownWidth, knownHeight);
    this._applyPosition();
  }

  reclampPosition(knownWidth, knownHeight) {
    this._clampPosition(knownWidth, knownHeight);
    this._applyPosition();
  }

  _savePosition() {
    // Persistence disabled — position no longer saved across page loads.
    // try {
    //   localStorage.setItem("portfolio-terminal-position", JSON.stringify({ x: this.posX, y: this.posY }));
    // } catch (e) {
    //   /* storage may be unavailable — safe to ignore */
    // }
  }

  // ============================================================
  // Size
  // ============================================================

  maxWidth() {
    return window.innerWidth;
  }

  maxHeight() {
    return Math.round(window.innerHeight * 0.92);
  }

  _clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  getCurrentSize() {
    return { width: this.lastW, height: this.lastH };
  }

  setCurrentSize(w, h) {
    this.lastW = w;
    this.lastH = h;
  }

  // The window is centered and grows/shrinks from that center point. Left
  // alone, resizing from any single edge or corner would still move every
  // corner at once. Shifting the anchor by half of each dimension's change
  // — in the direction away from whichever edge is fixed — keeps that fixed
  // edge exactly where it was, so only the edge/corner actually being
  // dragged appears to move, like a real window.
  applySize(width, height, hEdge, vEdge) {
    const w = this._clamp(width, this.MIN_WIDTH, this.maxWidth());
    const h = this._clamp(height, this.MIN_HEIGHT, this.maxHeight());

    const dw = w - this.lastW;
    const dh = h - this.lastH;
    let dx = 0;
    let dy = 0;
    if (hEdge === "right")
      dx = dw / 2; // left edge fixed
    else if (hEdge === "left") dx = -dw / 2; // right edge fixed
    if (vEdge === "bottom")
      dy = dh / 2; // top edge fixed
    else if (vEdge === "top") dy = -dh / 2; // bottom edge fixed

    if (dx !== 0 || dy !== 0) {
      // Pass the known target size explicitly — see _clampPosition's note
      // on why a live measurement can be stale during a CSS transition.
      this.nudgePosition(dx, dy, w, h);
    }

    this.wrap.style.width = w + "px";
    this.wrap.style.height = h + "px";
    this.lastW = w;
    this.lastH = h;
    this.reclampPosition(w, h);
  }

  // Changes the window's height directly while keeping the title bar (top
  // edge) exactly where it is, and keeps the size tracker in sync so a
  // later drag-resize computes the right delta instead of jumping.
  //
  // `shouldFit` should be false when collapsing into the minimized state:
  // the content area shrinks to ~0px there, and fitting xterm to that would
  // resize its internal buffer to a degenerate ~1-row terminal, reflowing
  // (and permanently corrupting) the buffer with a spurious newline —
  // visible after restoring even though the collapse itself was only ever
  // meant to be a visual hide, not a real resize.
  _setHeightKeepingTopFixed(newHeight, shouldFit) {
    const rect = this.wrap.getBoundingClientRect();
    const dh = newHeight - rect.height;
    this.wrap.style.height = newHeight + "px";
    if (dh !== 0) {
      this.nudgePosition(0, dh / 2, rect.width, newHeight);
    }
    this.setCurrentSize(rect.width, newHeight);
    if (shouldFit) {
      this.fit();
      this._fitAfterTransition();
    }
  }

  // The window's width/height changes are CSS-transitioned (0.25s), so a
  // fit called right away — even via requestAnimationFrame — measures a
  // size that's still mid-animation, close to where it started. xterm then
  // computes far too few rows/cols and appears blank until something else
  // forces it to recompute. Re-fitting once the transition actually
  // finishes catches the real, final size.
  _fitAfterTransition() {
    const handler = (e) => {
      if (e.target !== this.wrap) return;
      if (e.propertyName !== "width" && e.propertyName !== "height") return;
      this.wrap.removeEventListener("transitionend", handler);
      this.fit();
    };
    this.wrap.addEventListener("transitionend", handler);
  }

  // ============================================================
  // Drag (title bar)
  // ============================================================

  _bindDrag() {
    let dragging = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let startPosX = 0;
    let startPosY = 0;

    const onPointerDown = (e) => {
      // Ignore drags initiated on the resize handles or the traffic-light
      // buttons.
      if (e.target.closest(".rh")) return;
      if (e.target.closest(".crt-dots")) return;

      dragging = true;
      document.body.classList.add("is-dragging");

      startPointerX = e.clientX;
      startPointerY = e.clientY;
      startPosX = this.posX;
      startPosY = this.posY;

      this.topbar.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!dragging) return;
      this.posX = startPosX + (e.clientX - startPointerX);
      this.posY = startPosY + (e.clientY - startPointerY);
      this._clampPosition();
      this._applyPosition();
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove("is-dragging");
      this._savePosition();
    };

    this.topbar.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    // Keyboard support: focus the topbar, nudge with arrow keys, Home to recenter.
    this.topbar.setAttribute("tabindex", "0");
    this.topbar.setAttribute("role", "button");
    this.topbar.setAttribute("aria-label", "Drag to move the terminal window");

    this.topbar.addEventListener("keydown", (e) => {
      const step = 24;
      if (e.key === "ArrowRight") this.posX += step;
      else if (e.key === "ArrowLeft") this.posX -= step;
      else if (e.key === "ArrowDown") this.posY += step;
      else if (e.key === "ArrowUp") this.posY -= step;
      else if (e.key === "Home") {
        this.posX = 0;
        this.posY = 0;
      } else {
        return;
      }
      e.preventDefault();
      this._clampPosition();
      this._applyPosition();
      this._savePosition();
    });

    // Keep the window reachable if the viewport shrinks (e.g. rotating a phone).
    window.addEventListener("resize", () => {
      this._clampPosition();
      this._applyPosition();
    });
  }

  // ============================================================
  // Resize (edges + corners)
  // ============================================================

  _bindResize() {
    let dragging = false;
    let activeHandle = null;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    const onPointerDown = (e) => {
      const handle = e.currentTarget;
      dragging = true;
      activeHandle = handle;
      document.body.classList.add("is-resizing");
      document.body.style.cursor = getComputedStyle(handle).cursor;

      const rect = this.wrap.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = rect.width;
      startHeight = rect.height;

      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!dragging || !activeHandle) return;
      const hEdge = activeHandle.dataset.h || null;
      const vEdge = activeHandle.dataset.v || null;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Dragging a "right" or "bottom" edge grows the window in that
      // direction; dragging "left" or "top" grows it in the opposite mouse
      // direction, since that edge is the one following the cursor.
      const targetWidth =
        hEdge === "left"
          ? startWidth - dx
          : hEdge === "right"
            ? startWidth + dx
            : startWidth;
      const targetHeight =
        vEdge === "top"
          ? startHeight - dy
          : vEdge === "bottom"
            ? startHeight + dy
            : startHeight;

      this.applySize(targetWidth, targetHeight, hEdge, vEdge);
      this.fit();
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      activeHandle = null;
      document.body.classList.remove("is-resizing");
      document.body.style.cursor = "";
      // Persistence disabled — size no longer saved across page loads.
    };

    this.handles.forEach((handle) => {
      handle.addEventListener("pointerdown", onPointerDown);
    });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    // Keyboard resizing for accessibility: arrow keys on the focused (bottom-right) handle.
    const keyboardHandle = document.querySelector(".rh-se");
    if (keyboardHandle) {
      keyboardHandle.addEventListener("keydown", (e) => {
        const step = 20;
        const rect = this.wrap.getBoundingClientRect();
        let { width, height } = rect;

        if (e.key === "ArrowRight") width += step;
        else if (e.key === "ArrowLeft") width -= step;
        else if (e.key === "ArrowDown") height += step;
        else if (e.key === "ArrowUp") height -= step;
        else return;

        e.preventDefault();
        this.applySize(width, height, "right", "bottom");
        this.fit();
      });

      // Double-click (or double-tap) the handle to reset to the default size.
      keyboardHandle.addEventListener("dblclick", () => {
        this.wrap.style.width = "";
        this.wrap.style.height = "";
        this.fit();
        this.reclampPosition();

        const rect = this.wrap.getBoundingClientRect();
        this.lastW = rect.width;
        this.lastH = rect.height;
      });
    }

    // Re-clamp on viewport changes so a custom size never overflows the
    // screen. Only applies once the user has set a custom size — otherwise
    // the default fluid CSS sizing (min(920px, 92vw) etc.) is left alone.
    window.addEventListener("resize", () => {
      if (!this.wrap.style.width) return;
      const rect = this.wrap.getBoundingClientRect();
      this.applySize(rect.width, rect.height, "right", "bottom");
      this.fit();
    });
  }

  // ============================================================
  // Window controls (traffic lights)
  // ============================================================

  toggleMinimize() {
    if (this.closed) return;
    if (this.maximized) this.toggleMaximize();

    const rect = this.wrap.getBoundingClientRect();
    if (!this.minimized) {
      this.preMinimizeHeight = rect.height;
      this.minimized = true;
      this.frame.classList.add("is-minimized");
      const topbarHeight = Math.round(
        this.topbar.getBoundingClientRect().height,
      );
      this._setHeightKeepingTopFixed(topbarHeight, false);
    } else {
      this.minimized = false;
      this.frame.classList.remove("is-minimized");
      this._setHeightKeepingTopFixed(this.preMinimizeHeight || 420, true);
    }
  }

  toggleMaximize() {
    if (this.closed) return;
    if (this.minimized) this.toggleMinimize();

    if (!this.maximized) {
      const rect = this.wrap.getBoundingClientRect();
      const pos = this.getPosition();
      this.preMaximize = {
        width: rect.width,
        height: rect.height,
        x: pos.x,
        y: pos.y,
      };
      this.maximized = true;

      const targetW = this.maxWidth();
      const targetH = this.maxHeight();
      this.applySize(targetW, targetH, "right", "bottom");
      this.setPosition(0, 0, targetW, targetH);
      this.fit();
      this._fitAfterTransition();
    } else {
      this.maximized = false;
      if (this.preMaximize) {
        this.applySize(
          this.preMaximize.width,
          this.preMaximize.height,
          "right",
          "bottom",
        );
        this.setPosition(
          this.preMaximize.x,
          this.preMaximize.y,
          this.preMaximize.width,
          this.preMaximize.height,
        );
      }
      this.fit();
      this._fitAfterTransition();
    }
  }

  close() {
    this.closed = true;
    if (document.activeElement) document.activeElement.blur();
    this.wrap.classList.add("is-closed");
    this.wrap.setAttribute("aria-hidden", "true");
    if (this.reopenBtn) {
      this.reopenBtn.classList.add("is-visible");
      this.reopenBtn.focus();
    }
  }

  reopen() {
    this.closed = false;
    this.wrap.classList.remove("is-closed");
    this.wrap.removeAttribute("aria-hidden");
    if (this.reopenBtn) this.reopenBtn.classList.remove("is-visible");
    this.fit();
  }

  _bindWindowControls() {
    // Blur after handling — a mouse click leaves the button focused, and
    // .crt-dots:focus-within would otherwise keep the hover icons showing
    // even after the cursor moves away.
    this.closeBtn.addEventListener("click", (e) => {
      this.close();
      e.currentTarget.blur();
    });
    this.minBtn.addEventListener("click", (e) => {
      this.toggleMinimize();
      e.currentTarget.blur();
    });
    this.zoomBtn.addEventListener("click", (e) => {
      this.toggleMaximize();
      e.currentTarget.blur();
    });
    if (this.reopenBtn) {
      this.reopenBtn.addEventListener("click", () => this.reopen());
    }

    // Double-clicking the title bar (outside the buttons) mirrors the green
    // button — a common macOS shortcut for maximize/restore.
    this.topbar.addEventListener("dblclick", (e) => {
      if (e.target.closest(".crt-dots")) return;
      this.toggleMaximize();
    });
  }
}
