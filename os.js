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

const macOSArt = [
  "                      ..'         ",
  "                  ,xNMM.          ",
  "                .OMMMMo           ",
  '                lMM"              ',
  "     .;loddo:.  .olloddol;.       ",
  "   cKMMMMMMMMMMNWMMMMMMMMMM0:     ",
  " .KMMMMMMMMMMMMMMMMMMMMMMMWd.     ",
  " XMMMMMMMMMMMMMMMMMMMMMMMX.       ",
  ";MMMMMMMMMMMMMMMMMMMMMMMM:        ",
  ":MMMMMMMMMMMMMMMMMMMMMMMM:        ",
  ".MMMMMMMMMMMMMMMMMMMMMMMMX.       ",
  " kMMMMMMMMMMMMMMMMMMMMMMMMWd.     ",
  " 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk    ",
  "  'XMMMMMMMMMMMMMMMMMMMMMMMMK.    ",
  "    kMMMMMMMMMMMMMMMMMMMMMMd      ",
  "     ;KMMMMMMMWXXWMMMMMMMk.       ",
  '       "cooc*"    "*coo\'"         ',
  "                                  ",
];

const emptyLine = "                                  ";

function getOSLogo(os, linecount) {
  // console.log(linecount);
  // console.log(macOSArt.length);
  if (os === "macOS") {
    if (linecount > macOSArt.length) {
      let macOsArtWithMoreNewlines = macOSArt;
      for (let i = 0; i < linecount - macOSArt.length; i++) {
        macOsArtWithMoreNewlines.push(emptyLine);
      }
      return macOsArtWithMoreNewlines;
    } else {
      return macOSArt;
    }
  }
  return [];
}

function addOSLogoToOSInfo(info) {
  let osLogo = getOSLogo("macOS", info.length);
  // if (osLogo.length !== info.length) {
  //   alert("help"); // TODO
  // }
  for (let i = 0; i < info.length; i++) {
    // Overwrite the element at the current index
    osLogo[i] = osLogo[i] + info[i];
  }
  return osLogo;
}
