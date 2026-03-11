export type Platform = "macos" | "windows" | "linux" | "unknown";

export function detectOS(): Platform {
  if (typeof navigator === "undefined") return "unknown";

  // Modern API
  if ("userAgentData" in navigator) {
    const platform =
      (navigator as never as { userAgentData?: { platform?: string } })
        .userAgentData?.platform?.toLowerCase() ?? "";
    if (platform.includes("mac")) return "macos";
    if (platform.includes("win")) return "windows";
    if (platform.includes("linux")) return "linux";
  }

  // Fallback
  const p = navigator.platform?.toLowerCase() ?? "";
  if (p.includes("mac")) return "macos";
  if (p.includes("win")) return "windows";
  if (p.includes("linux")) return "linux";

  return "unknown";
}

export type DownloadInfo = {
  platform: Platform;
  label: string;
  icon: string;
  filename: string;
  size: string;
  format: string;
};

export function getDownloads(version: string): DownloadInfo[] {
  return [
    {
      platform: "macos",
      label: "macOS",
      icon: "\uD83C\uDF4E",
      filename: `Onboarding.Tutor-${version}-universal.dmg`,
      size: "180 MB",
      format: "Universal (.dmg)",
    },
    {
      platform: "windows",
      label: "Windows",
      icon: "\uD83E\uDE9F",
      filename: `Onboarding.Tutor.Setup.${version}.exe`,
      size: "85 MB",
      format: "Setup (.exe)",
    },
    {
      platform: "linux",
      label: "Linux",
      icon: "\uD83D\uDC27",
      filename: `Onboarding.Tutor-${version}.AppImage`,
      size: "110 MB",
      format: "AppImage / .deb",
    },
  ];
}
