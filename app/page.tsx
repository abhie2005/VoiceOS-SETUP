import { Mic, ArrowUpRight, Clock, BookOpen, ShieldCheck } from "lucide-react";
import AmsLogo from "@/components/AmsLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV = ["Home", "Directory", "Systems", "Handbook", "Support"];

const SCHEDULE = [
  { time: "09:30", what: "Platform intro — Priya Raman", where: "Zoom" },
  { time: "11:00", what: "Repo walkthrough — Dev Shah", where: "Room 4B" },
  { time: "14:00", what: "Security & access review", where: "Zoom" },
];

const TOPICS = [
  "Deploy pipelines",
  "Environments",
  "Code review norms",
  "Incident process",
  "Expense policy",
  "Time off",
];

export default function Home() {
  return (
    <>
      <header className="glass glass-header sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          <AmsLogo className="h-8 w-16 shrink-0" />
          <Badge
            variant="outline"
            className="hidden text-[10px] font-medium sm:flex"
          >
            Internal
          </Badge>

          <nav className="ml-4 hidden items-center gap-6 text-sm md:flex">
            {NAV.map((n, i) => (
              <a
                key={n}
                href="#"
                data-tour={n.toLowerCase()}
                className={
                  i === 0
                    ? "font-medium text-foreground"
                    : "text-muted-foreground transition hover:text-foreground"
                }
              >
                {n}
              </a>
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        {/* Garfield deliberately does not appear here — the only instance is the
            live one that travels the page, so there's never a second, inert
            copy competing with it. */}
        <section className="flex flex-col items-center py-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Welcome, Joy. Just talk to me.
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
            Garfield is a voice buddy, not a chatbot. Say what you&apos;re
            wondering out loud — however basic — and it answers from the real
            internal wiki. No tickets, no searching, no looking uninformed.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="h-12 gap-2 rounded-full px-7">
              <Mic className="size-4" />
              Hold to talk
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="glass-chip h-12 gap-2 rounded-full px-7"
            >
              Or say “Hey Garfield”
            </Button>
          </div>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Day 1 of 30 · Voice always on
          </p>
        </section>

        <Separator className="my-10" />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="glass rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="size-4" />
                Access provisioned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-3xl font-semibold tabular-nums">
                4/4
              </p>
              <Progress value={100} className="mt-3 h-1.5" />
              <p className="mt-3 text-xs text-muted-foreground">
                Slack, GitHub, Notion, and Calendar — set up before you logged
                in. Nothing to chase.
              </p>
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="size-4" />
                Today
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {SCHEDULE.map((s) => (
                <div key={s.time} className="flex gap-3 text-xs">
                  <span className="font-mono tabular-nums text-muted-foreground">
                    {s.time}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{s.what}</span>
                    <span className="text-muted-foreground">{s.where}</span>
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="size-4" />
                What Garfield knows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map((t) => (
                  <Badge key={t} variant="secondary" className="font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Indexed from the engineering wiki, ADRs, and the handbook. If
                it&apos;s not in there, Garfield says so instead of guessing.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Honesty mechanism, given its own moment. */}
        <Card className="glass mt-4 rounded-2xl">
          <CardContent className="flex flex-col items-start gap-6 py-8 md:flex-row md:items-center">
            <div className="flex-1">
              <Badge
                variant="outline"
                className="mb-3 border-dashed text-[10px]"
              >
                Not documented
              </Badge>
              <p className="text-lg text-balance">
                “I don&apos;t have this documented. On-call rotations
                aren&apos;t in anything I&apos;ve indexed — ask Priya Raman on
                Platform, she owns the rotation.”
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Garfield never fills a gap with a guess. Every answer is either
                sourced or openly handed off.
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              Hear it yourself
              <ArrowUpRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <AmsLogo className="h-7 w-14 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            AMS is a fictional company built for the VoiceOS hackathon demo.
          </p>
        </div>
      </footer>
    </>
  );
}
