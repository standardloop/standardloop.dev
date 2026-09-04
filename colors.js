function buildColors() {
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
