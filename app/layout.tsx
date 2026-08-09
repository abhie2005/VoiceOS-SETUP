import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import VoiceBuddy from "@/components/VoiceBuddy";
import { TooltipProvider } from "@/components/ui/tooltip";

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
            {children}
            <VoiceBuddy />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
