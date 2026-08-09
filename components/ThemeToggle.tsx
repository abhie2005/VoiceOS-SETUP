"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      size="icon"
      variant="ghost"
      className="glass-chip size-8 rounded-full"
      aria-label="Toggle theme"
      // resolvedTheme is only read in the handler, never during render, so
      // there's no server/client mismatch to guard against.
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Both icons render; CSS picks. Avoids a mounted flag entirely. */}
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
