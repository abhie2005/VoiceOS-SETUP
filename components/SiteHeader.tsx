"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AmsLogo from "@/components/AmsLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/** `tour` matches the data-tour attribute a walkthrough step can point at. */
const NAV = [
  { href: "/", label: "Home", tour: "home" },
  { href: "/communications", label: "Communications", tour: "communications" },
  { href: "/health", label: "Health", tour: "health" },
  { href: "/finance", label: "Finance", tour: "finance" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="glass glass-header sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link href="/" className="shrink-0">
          <AmsLogo className="h-8 w-16" />
        </Link>
        <Badge
          variant="outline"
          className="hidden text-[10px] font-medium sm:flex"
        >
          Internal
        </Badge>

        <nav className="ml-2 hidden items-center gap-6 text-sm md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              data-tour={n.tour}
              className={cn(
                "transition",
                pathname === n.href
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <kbd className="glass-chip hidden rounded-md px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            ⌘K
          </kbd>
          <ThemeToggle />
          <Avatar className="size-7">
            <AvatarFallback className="text-[10px]">JM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
