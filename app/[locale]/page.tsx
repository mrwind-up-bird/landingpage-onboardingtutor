import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-void text-text-primary">
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-mono text-4xl font-bold text-cyan">
          {"{"}nyx<span className="text-orange">.</span>Core{"}"}
        </h1>
      </div>
    </main>
  );
}
