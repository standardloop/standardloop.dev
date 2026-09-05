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
    const { red, green, brown, orange, purple, blue } = this.colors;
    return [
      red("       ,.=:!!t3Z3z.,                    "),
      red("      :tt:::tt333EE3                    "),
      red("      Et:::ztt33EEEL ") + green("@Ee.,      ..,     "),
      red("     ;tt:::tt333EE7 ") + green(";EEEEEEttttt33#     "),
      red("    :Et:::zt333EEQ. ") + green("$EEEEEttttt33QL     "),
      red("    it::::tt333EEF ") + green("@EEEEEEttttt33F      "),
      red('   ;3=*^```"*4EEV ') + green(":EEEEEEttttt33@.      "),
      blue("   ,.=::::!t=., ") + red("` ") + green("@EEEEEEtttz33QF       "),
      blue("   ;::::::::zt33)  ") + green('"4EEEtttji3P*        '),
      blue("  :t::::::::tt33.") +
        brown(":Z3z..  ") +
        green("``") +
        brown(" ,..g.       "),
      blue("  i::::::::zt33F ") + brown("AEEEtttt::::ztF        "),
      blue(" ;:::::::::t33V ") + brown(";EEEttttt::::t3         "),
      blue(" E::::::::zt33L ") + brown("@EEEtttt::::z3F         "),
      blue('{3=*^```"*4E3) ') + brown(";EEEtttt:::::tZ`         "),
      blue("             `") + " " + brown(":EEEEtttt::::z7          "),
      brown('                 "VEzjt:;;z>*`          '),
      "                                        ",
    ];
  }

  _android() {
    const { green } = this.colors;
    return [
      green("         -o          o-             "),
      green("          +hydNNNNdyh+              "),
      green("        +mMMMMMMMMMMMMm+            "),
      green("      `dMM") +
        "m:" +
        green("NMMMMMMN") +
        ":m" +
        green("MMd`          "),
      green("      hMMMMMMMMMMMMMMMMMMh          "),
      green("  ..  yyyyyyyyyyyyyyyyyyyy  ..      "),
      green(".mMMm`MMMMMMMMMMMMMMMMMMMM`mMMm.    "),
      green(":MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM:    "),
      green(":MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM:    "),
      green(":MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM:    "),
      green(":MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM:    "),
      green("-MMMM-MMMMMMMMMMMMMMMMMMMM-MMMM-    "),
      green(" +yy+ MMMMMMMMMMMMMMMMMMMM +yy+     "),
      green("      mMMMMMMMMMMMMMMMMMMm          "),
      green("      `/++MMMMh++hMMMM++/`          "),
      green("          MMMMo  oMMMM              "),
      green("          MMMMo  oMMMM              "),
      green("          oNMm-  -mMNs              "),
      "                                    ",
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

  getColorForOS(os) {
    os = os.toLowerCase();
    switch (os) {
      case "ipados":
      case "ios":
      case "macos":
        return this.colors.brown;
      case "linux":
        return this.colors.orange;
        break;
      case "windows":
        return this.colors.blue;
        break;
      case "android":
        return this.colors.green;
      case "chromium":
      case "chrome":
      case "chromium os":
      case "chrome os":
        return this.colors.blue;
      default:
        return this.colors.blue;
    }
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
