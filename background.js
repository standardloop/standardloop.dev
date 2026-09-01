class Background {
  constructor() {
    this.reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    this.canvas = document.getElementById("starfield");
    this.ctx = this.canvas.getContext("2d");
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.vw = 0;
    this.vh = 0;
    this.t = 0;

    // Three depth layers: distant/small/dim -> near/large/bright.
    this.LAYERS = [
      { count: 90, drift: 4, size: [0.5, 1.2], alpha: [0.15, 0.4] },
      { count: 55, drift: 9, size: [1.0, 1.8], alpha: [0.35, 0.65] },
      { count: 22, drift: 16, size: [1.6, 2.6], alpha: [0.55, 0.95] },
    ];
    this.stars = [];

    this._resizeCanvas();
    window.addEventListener("resize", () => this._resizeCanvas());
    this._seedStars();

    if (this.reduceMotion) {
      // Draw a single static frame instead of a continuous loop.
      this._drawStars();
    } else {
      this._loop();
    }
  }

  _resizeCanvas() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.vw = window.innerWidth;
    this.vh = window.innerHeight;
    this.canvas.width = this.vw * this.dpr;
    this.canvas.height = this.vh * this.dpr;
    this.canvas.style.width = this.vw + "px";
    this.canvas.style.height = this.vh + "px";
  }

  _seedStars() {
    this.stars = [];
    this.LAYERS.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        this.stars.push({
          x: Math.random(),
          y: Math.random(),
          size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
          baseAlpha:
            layer.alpha[0] + Math.random() * (layer.alpha[1] - layer.alpha[0]),
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.4 + Math.random() * 0.8,
          drift: layer.drift,
        });
      }
    });
  }

  _drawStars() {
    const { ctx, canvas, vw, vh, dpr, t } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const s of this.stars) {
      const twinkle = 0.7 + 0.3 * Math.sin(t * 0.02 * s.twinkleSpeed + s.phase);
      const wrapX = (s.x * vw + t * s.drift * 0.02) % (vw + 40);
      const px = ((wrapX + vw + 40) % (vw + 40)) - 20;
      const py = s.y * vh;

      ctx.beginPath();
      ctx.fillStyle = `rgba(226, 234, 245, ${s.baseAlpha * twinkle})`;
      ctx.arc(px * dpr, py * dpr, s.size * dpr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _loop() {
    this.t += 1;
    this._drawStars();
    requestAnimationFrame(() => this._loop());
  }
}
