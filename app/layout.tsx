import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { hasEnvVars } from "@/lib/utils";
import { TabNav } from "@/components/tab-nav";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "WordTrainer — Тренажер Англійських Слів",
    template: "%s | WordTrainer",
  },
  description: "Ефективний словник та тренажер для швидкого запам'ятовування англійських слів за допомогою розумних вправ.",
  keywords: ["англійська мова", "вивчити слова", "vocabulary trainer", "словник", "тренажер слів", "WordTrainer"],
  authors: [{ name: "WordTrainer Team" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "WordTrainer — Тренажер Англійських Слів",
    description: "Збільшуйте свій словниковий запас за допомогою розумних тренувань.",
    url: defaultUrl,
    siteName: "WordTrainer",
    locale: "uk_UA",
    type: "website",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WordTrainer — Тренажер Англійських Слів",
    description: "Збільшуйте свій словниковий запас за допомогою розумних тренувань.",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-dvh flex flex-col">
            <Navbar hasEnvVars={hasEnvVars} />
            <TabNav />
            <main className="flex-grow">
              {children}
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

