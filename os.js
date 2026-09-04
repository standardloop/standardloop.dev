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
      osVersion: "Requires permission",
      bitness: "Requires permission",
      deviceModel: "Requires permission",
      fullVersionList: "Requires permission",
      model: "Requires permission",
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
        "fullVersionList",
      ]);

      data.modernHints.osVersion = highEntropy.platformVersion || "Unknown";
      data.modernHints.architecture = highEntropy.architecture || "Unknown"; // e.g., "x86" or "arm"
      data.modernHints.bitness = highEntropy.bitness || "Unknown"; // e.g., "64"
      data.modernHints.deviceModel = highEntropy.model || "Unknown"; // e.g., "Pixel 6" or "" on desktop
      data.modernHints.fullVersionList =
        highEntropy.fullVersionList || "Unknown"; // e.g., "Pixel 6" or "" on desktop
    } catch (e) {
      console.warn("High-entropy data access denied or failed:", e);
    }
  }

  // turn brandsArray from array to string
  let brandsArray = data.modernHints.brandData;
  const brandString =
    brandsArray.map((b) => `${b.brand} (v${b.version})`).join(", ") ||
    "No brand data available";
  data.modernHints.brandData = brandString;

  // turn fullVersionsArray from array to string
  const fullVersionsArray = data.modernHints.fullVersionList;
  const fullVersionString =
    fullVersionsArray.map((b) => `${b.brand} (v${b.version})`).join(", ") ||
    "No full version data available";

  data.modernHints.fullVersionList = fullVersionString;

  return data;
}

const emptyLine = "                                  ";

function addPadding(line) {
  const width = emptyLine.length;
  if (line.length < width) {
    let dynamicSpaces = " ".repeat(width - line.length);
    line += dynamicSpaces;
  }
  return line;
}

class OSLogos {
  constructor(colors) {
    this.colors = colors;
  }

  _macOS() {
    const { green, brown, orange, purple, blue } = this.colors;
    return [
      green("                      ..'         "),
      green("                  ,xNMM.          "),
      green("                .OMMMMo           "),
      green('                lMM"              '),
      green("     .;loddo:.  .olloddol;.       "),
      green("   cKMMMMMMMMMMNWMMMMMMMMMM0:     "),
      brown(" .KMMMMMMMMMMMMMMMMMMMMMMMWd.     "),
      brown(" XMMMMMMMMMMMMMMMMMMMMMMMX.       "),
      orange(";MMMMMMMMMMMMMMMMMMMMMMMM:        "),
      orange(":MMMMMMMMMMMMMMMMMMMMMMMM:        "),
      orange(".MMMMMMMMMMMMMMMMMMMMMMMMX.       "),
      orange(" kMMMMMMMMMMMMMMMMMMMMMMMMWd.     "),
      purple(" 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk    "),
      purple("  'XMMMMMMMMMMMMMMMMMMMMMMMMK.    "),
      blue("    kMMMMMMMMMMMMMMMMMMMMMMd      "),
      blue("     ;KMMMMMMMWXXWMMMMMMMk.       "),
      blue('       "cooc*"    "*coo\'"         '),
      blue("                                  "),
    ];
  }

  _unknown() {
    const { blue } = this.colors;
    return [
      blue(addPadding("            .◢██████◣.   ")),
      blue(addPadding("          .◢██▀▀░░▀▀██◣. ")),
      blue(addPadding("         .███░  .▄▄. ░██.")),
      blue(addPadding("         ███░  ▐████. ░██")),
      blue(addPadding("         ▀██.  ░▀▀██▌ ◢██")),
      blue(addPadding("          ▀██◣.   ▄█▀◢██▀")),
      blue(addPadding("           ▀█████  ◢██▀  ")),
      blue(addPadding("            ░▀▀▀  ◢██▀   ")),
      blue(addPadding("                 ◢██▀    ")),
      blue(addPadding("                ◢██▀     ")),
      blue(addPadding("               ▐██▌      ")),
      blue(addPadding("               ▐██▌      ")),
      blue(addPadding("               ░▀▀░      ")),
      blue(addPadding("                         ")),
      blue(addPadding("               .▄▄.      ")),
      blue(addPadding("              ▐████▌     ")),
      blue(addPadding("              ░▀██▀░     ")),
      blue(addPadding("                         ")),
    ];
  }

  _getOSLogo(os, linecount) {
    // console.log(linecount);
    // console.log(macOSArt.length);

    function padNewlines(art, linecount) {
      let artWithMoreNewlines = art;
      for (let i = 0; i < linecount - art.length; i++) {
        artWithMoreNewlines.push(emptyLine);
      }
      return artWithMoreNewlines;
    }
    let art;
    if (os === "macOS") {
      art = this._macOS();
    } else {
      art = this._unknown();
    }
    if (linecount > art.length) {
      return padNewlines(macOSArt, linecount);
    } else {
      return art;
    }
  }

  addOSLogoToOSInfo(os, info) {
    let osLogo = this._getOSLogo(os, info.length);
    for (let i = 0; i < info.length; i++) {
      osLogo[i] = osLogo[i] + info[i];
    }
    return osLogo;
  }
}
