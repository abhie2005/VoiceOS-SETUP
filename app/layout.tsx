import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import VoiceBuddy from "@/components/VoiceBuddy";
import { TooltipProvider } from "@/components/ui/tooltip";
import SiteHeader from "@/components/SiteHeader";
import AmsLogo from "@/components/AmsLogo";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AMS — Onboarding",
  description:
    "Internal onboarding for new AMS engineers. Voice-native, powered by Garfield.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: next-themes writes the theme class onto <html>
    // before React hydrates, so server and client markup legitimately differ.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Ambient backdrop. Glass needs something behind it to refract —
              without this the panels read as flat translucent rectangles. */}
          <div aria-hidden className="ambient" />
          <TooltipProvider>
            {/* Header and footer live in the layout so they persist across
                route changes — which is what lets a walkthrough step on one
                page hand off to a target on another. */}
            <SiteHeader />
            {children}
            <footer className="border-t border-border px-6 py-8">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
                <AmsLogo className="h-7 w-14 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  AMS is a fictional company built for the VoiceOS hackathon
                  demo.
                </p>
              </div>
            </footer>
            <VoiceBuddy />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
