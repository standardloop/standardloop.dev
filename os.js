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

class OSLogos {
  constructor(colors) {
    this.colors = colors;
    this.artDatabase = this._buildArt();
    this.artAliasMap = this._buildArtAliases();
  }

  // TODO, do we want spaces in the keys?
  _buildArtAliases() {
    return {
      macos: "macos",
      apple: "macos",
      ipados: "macos",
      ios: "macos",

      linux: "linux",

      windows: "windows",
      microsoft: "windows",

      android: "android",

      chrome: "chrome",
      chromium: "chrome",
      chromeos: "chrome",
      chromiumos: "chrome",

      default: "unknown",
      unknown: "unknown",
      fallback: "unknown",
    };
  }

  _buildArt() {
    const { dim, red, green, brown, orange, purple, blue } = this.colors;
    return {
      macos: {
        art: [
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
        ],
        color: this.colors.brown,
      },
      windows: {
        art: [
          red("       ,.=:!!t3Z3z.,                    "),
          red("      :tt:::tt333EE3                    "),
          red("      Et:::ztt33EEEL ") + green("@Ee.,      ..,     "),
          red("     ;tt:::tt333EE7 ") + green(";EEEEEEttttt33#     "),
          red("    :Et:::zt333EEQ. ") + green("$EEEEEttttt33QL     "),
          red("    it::::tt333EEF ") + green("@EEEEEEttttt33F      "),
          red('   ;3=*^```"*4EEV ') + green(":EEEEEEttttt33@.      "),
          blue("   ,.=::::!t=., ") +
            red("` ") +
            green("@EEEEEEtttz33QF       "),
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
        ],
        color: this.colors.blue,
      },
      android: {
        art: [
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
        ],
        color: this.colors.green,
      },
      linux: {
        art: [
          dim("        #####          "),
          dim("       #######         "),
          dim("       ##") + "O" + dim("#") + "O" + dim("##         "),
          "       " + dim("#") + orange("#####") + dim("#") + "         ",
          "     " +
            dim("##") +
            "##" +
            orange("###") +
            "###" +
            dim("#") +
            "       ",
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
        ],
        color: this.colors.orange,
      },
      chrome: {
        art: [
          red("            .,:loool:,.               "),
          red("        .,coooooooooooooc,.           "),
          red("     .,lllllllllllllllllllll,.        "),
          red("    ;ccccccccccccccccccccccccc;       "),
          green("  '") + red("ccccccccccccccccccccccccccccc.     "),
          green(" ,oo") +
            red("c::::::::okO") +
            "000" +
            brown("0OOkkkkkkkkkkk:    "),
          green(".ooool") +
            red(";;;;:x") +
            "K0k" +
            blue("xxxxxk") +
            "0X" +
            brown("K0000000000.   "),
          green(":oooool") +
            red(";,;O") +
            "K" +
            blue("ddddddddddd") +
            "KX" +
            brown("000000000d   "),
          green("lllllool") +
            red(";l") +
            "N" +
            blue("dllllllllllld") +
            "N" +
            brown("K000000000   "),
          green("lllllllll") +
            red("o") +
            "M" +
            blue("dccccccccccco") +
            "W" +
            brown("K000000000   "),
          green(";cllllllllX") +
            "X" +
            blue("c:::::::::c") +
            "0X" +
            brown("000000000d   "),
          green(".ccccllllllO") +
            "Nk" +
            blue("c;,,,;cx") +
            "KK" +
            brown("0000000000.   "),
          green(" .cccccclllllxOO") +
            "OOO" +
            green("Okx") +
            brown("O0000000000;    "),
          green("  .:ccccccccllllllllo") + brown("O0000000OOO,     "),
          green("    ,:ccccccccclllcd") + brown("0000OOOOOOl.      "),
          green("      '::ccccccccc") + brown("dOOOOOOOkx:.        "),
          green("        ..,::cccc") + brown("xOOOkkko;.           "),
          green("            ..,:") + brown("dOkxl:.               "),
          "                                      ",
        ],
        color: this.colors.green,
      },
      unknown: {
        art: [
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
        ],
        color: this.colors.blue,
      },
      fastfetch: {
        art: [
          "Fastfetch:                 ",
          "╭───────────────────────╮  ",
          "│  ● ● ●    FASTFETCH   │  ",
          "├───────────────────────┤  ",
          "│                       │  ",
          "│    /\      ►►►►►►►    │  ",
          "│   /--\     ►►►►►►     │  ",
          "│  /----\    ►►►►►      │  ",
          "│   |xx|     ►►►►       │  ",
          "│   |xx|     ►►►        │  ",
          "│   ^^^^                │  ",
          "╰───────────────────────╯  ",
          "╰───────────────────────╯  ",
          "                           ",
        ],
        color: this.colors.blue,
      },
    };
  }

  _findArt(os) {
    const normalizedKey = os.trim().toLowerCase();
    const canonicalKey = this.artAliasMap[normalizedKey];
    let osArtAndColor = this.artDatabase[canonicalKey]
      ? this.artDatabase[canonicalKey]
      : this.artDatabase["unknown"];
    return osArtAndColor;
  }

  getOSArtAndColor(os) {
    return this._findArt(os);
  }
}
