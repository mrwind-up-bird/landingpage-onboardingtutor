import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-noto-jp",
  display: "swap",
});

export const metadata: Metadata = {
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%231a0b2e'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' fill='%2300f5ff' font-size='20' font-family='monospace'>N</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${jetbrains.variable} ${inter.variable} ${notoJP.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
