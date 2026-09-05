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

function addPadding(line) {
  const width = emptyLine.length;
  if (line.length < width) {
    let dynamicSpaces = " ".repeat(width - line.length);
    line += dynamicSpaces;
  }
  return line;
}

function padNewlines(art, linecount, emptyLine) {
  const originalArtLength = art.length;
  let artWithMoreNewlines = art;
  for (let i = 0; i < linecount - originalArtLength; i++) {
    artWithMoreNewlines.push(emptyLine);
  }
  return artWithMoreNewlines;
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
      "                                  ",
    ];
  }

  _windows() {
    return [
      ",.=:!!t3Z3z.,",
      ":tt:::tt333EE3",
      "Et:::ztt33EEEL @Ee.,      ..,",
      ";tt:::tt333EE7 ;EEEEEEttttt33#",
      ":Et:::zt333EEQ. $EEEEEttttt33QL",
      "it::::tt333EEF @EEEEEEttttt33F",
      ';3=*^```"*4EEV :EEEEEEttttt33@.',
      ",.=::::!t=., ` @EEEEEEtttz33QF",
      ';::::::::zt33)   "4EEEtttji3P*',
      ":t::::::::tt33.:Z3z..  `` ,..g.",
      "i::::::::zt33F AEEEtttt::::ztF",
      ";:::::::::t33V ;EEEttttt::::t3",
      "E::::::::zt33L @EEEtttt::::z3F",
      '{3=*^```"*4E3) ;EEEtttt:::::tZ`',
      "` :EEEEtttt::::z7",
      "VEzjt:;;z>*`",
    ];
  }

  _android() {
    return [
      "-o          o-",
      "+hydNNNNdyh+",
      "+mMMMMMMMMMMMMm+",
      "`dMMm:NMMMMMMN:mMMd`",
      "hMMMMMMMMMMMMMMMMMMh",
      "..  yyyyyyyyyyyyyyyyyyyy  ..",
      ".mMMm`MMMMMMMMMMMMMMMMMMMM`mMMm.",
      ":MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM:",
      ":MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM:",
      ":MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM:",
      ":MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM:",
      "-MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM-",
      "+yy+ MMMMMMMMMMMMMMMMMMMM +yy+",
      "mMMMMMMMMMMMMMMMMMMm",
      "`/++MMMMh++hMMMM++/`",
      "MMMMo  oMMMM",
      "MMMMo  oMMMM",
      "oNMm-  -mMNs",
    ];
  }

  _linux() {
    const { orange, dim } = this.colors;
    return [
      dim("        #####          "),
      dim("       #######         "),
      dim("       ##") + "O" + dim("#") + "O" + dim("##         "),
      "       " + dim("#") + orange("#####") + dim("#") + "         ",
      "     " + dim("##") + "##" + orange("###") + "###" + dim("#") + "       ",
      "    " + dim("#") + "##########" + dim("##") + "      ",
      "   " + dim("#") + "############" + dim("##") + "     ",
      "   " + dim("#") + "############" + dim("###") + "    ",
      "  " +
        orange("##") +
        dim("#") +
        "###########" +
        dim("##") +
        orange("#") +
        "    ",
      orange("######") +
        dim("#") +
        "#######" +
        dim("#") +
        orange("#####") +
        "   ",
      orange("#######") +
        dim("#") +
        "#####" +
        dim("#") +
        orange("######") +
        "   ",
      "  " + orange("#####") + dim("######") + orange("######") + "    ",
      "                       ",
    ];
  }

  _chromeOS() {
    return [
      ".,:loool:,.",
      ".,coooooooooooooc,.",
      ".,lllllllllllllllllllll,.",
      ";ccccccccccccccccccccccccc;",
      "'ccccccccccccccccccccccccccccc.",
      ",ooc::::::::okO0000OOkkkkkkkkkkk:",
      ".ooool;;;;:xK0kxxxxxk0XK0000000000.",
      ":oooool;,;OKdddddddddddKX000000000d",
      "lllllool;lNdllllllllllldNK000000000",
      "llllllllloMdcccccccccccoWK000000000",
      ";cllllllllXXc:::::::::c0X000000000d",
      ".ccccllllllONkc;,,,;cxKK0000000000.",
      ".cccccclllllxOOOOOOkxO0000000000;",
      ".:cccccccclllllllloO0000000OOO,",
      ",:ccccccccclllcd0000OOOOOOl.",
      "'::cccccccccdOOOOOOOkx:.",
      "..,::ccccxOOOkkko;.",
      "..,:dOkxl:.",
    ];
  }

  _unknown() {
    const { blue } = this.colors;
    return [
      blue("           .◢██████◣.           "),
      blue("         .◢██▀▀░░▀▀██◣.         "),
      blue("        .███░  .▄▄. ░██.        "),
      blue("        ███░  ▐████. ░██        "),
      blue("        ▀██.  ░▀▀██▌ ◢██        "),
      blue("         ▀██◣.   ▄█▀◢██▀        "),
      blue("          ▀█████  ◢██▀          "),
      blue("           ░▀▀▀  ◢██▀           "),
      blue("                ◢██▀            "),
      blue("               ◢██▀             "),
      blue("              ▐██▌              "),
      blue("              ▐██▌              "),
      blue("              ░▀▀░              "),
      blue("                                "),
      blue("              .▄▄.              "),
      blue("             ▐████▌             "),
      blue("             ░▀██▀░             "),
      "                                ",
    ];
  }

  _getOSLogo(os, linecount) {
    os = os.toLowerCase();

    let art;
    switch (os) {
      case "ipados":
      case "ios":
      case "macos":
        art = this._macOS();
        break;
      case "linux":
        art = this._linux();
        break;
      case "windows":
        art = this._windows();
        break;
      case "android":
        art = this._android();
        break;
      case "chromium":
      case "chrome":
      case "chromium os":
      case "chrome os":
        art = this._chromeOS();
        break;
      default:
        art = this._unknown();
    }

    const emptyLineLength = art.at(-1).length; // every art last is an empty line
    const emptyLine = " ".repeat(emptyLineLength);

    if (linecount > art.length) {
      art = padNewlines(art, linecount, emptyLine);
    }
    return art;
  }

  addOSLogoToOSInfo(os, info) {
    let osLogo = this._getOSLogo(os, info.length);
    for (let i = 0; i < info.length; i++) {
      osLogo[i] = osLogo[i] + info[i];
    }
    return osLogo;
  }
}
