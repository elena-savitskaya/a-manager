import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import { TabNav } from "@/components/tab-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Logo } from "@/components/logo";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "English Vocabulary Trainer",
  description: "Learn and track English vocabulary with AI-powered translations",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link href="/" className="flex items-center">
                    <Logo size="md" />
                  </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-3">
                  <ThemeSwitcher />
                  {!hasEnvVars ? (
                    <EnvVarWarning />
                  ) : (
                    <Suspense>
                      <AuthButton />
                    </Suspense>
                  )}
                </div>

                {/* Mobile Burger Menu */}
                <div className="flex md:hidden">
                  <Suspense fallback={<div className="w-10 h-10" />}>
                    <MobileNav
                      authButton={<AuthButton />}
                      themeSwitcher={<ThemeSwitcher />}
                    />
                  </Suspense>
                </div>
              </div>
            </nav>
            <TabNav />

            <main className="flex-1">
              {children}
            </main>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs py-8">
              <p className="text-muted-foreground flex items-center gap-2">
                © 2026 <Logo size="sm" className="font-bold opacity-80" />. All rights reserved.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
