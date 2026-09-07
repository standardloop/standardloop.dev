"use strict";

function buildColors() {
  const rgbParts = (hex) =>
    hex
      .match(/\w\w/g)
      .map((h) => parseInt(h, 16))
      .join(";");
  const colorize = (hex) => (s) => `\x1b[38;2;${rgbParts(hex)}m${s}\x1b[0m`;
  return {
    blue: colorize("#4fa8ff"),
    bluedim: colorize("#3572a6"),
    cyan: colorize("#1fcbcb"),
    cyandim: colorize("#23b3b2"),
    green: colorize("#46d383"),
    greendim: colorize("#2f8f5c"),
    white: colorize("#f2f5f8"),
    whitedim: colorize("#8b95a1"),
    dim: colorize("#8b95a1"),
    red: colorize("#ee4b2b"),
    reddim: colorize("#c41e3a"),
    brown: colorize("#ce7e00"),
    orange: colorize("#ffa500"),
    purple: colorize("#c90076"),
    bgvoid: colorize("#05070a"),
    termbg: colorize("#111418"),
    black: colorize("#000000"),
    blackdim: colorize("#36454f"),
    pink: colorize("#ffc0cb"),
    pinkdim: colorize("#aa336a"),
  };
}
