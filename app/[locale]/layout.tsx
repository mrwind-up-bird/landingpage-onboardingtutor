import type { Metadata } from "next";
import { JetBrains_Mono, Inter, Noto_Sans_JP } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Scanlines } from "@/components/layout/Scanlines";
import { CodeRain } from "@/components/canvas/CodeRain";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = messages.meta as Record<string, string>;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${jetbrains.variable} ${inter.variable} ${notoJP.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-cyan focus:text-void focus:px-4 focus:py-2 focus:rounded focus:font-mono focus:text-sm"
          >
            Skip to main content
          </a>
          <ScrollProgress />
          <CodeRain />
          <Scanlines />
          <Nav />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
