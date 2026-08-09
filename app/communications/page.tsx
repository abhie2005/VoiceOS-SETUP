import { Hash, Mail, CalendarClock, Megaphone, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Communications — AMS" };

const CHANNELS = [
  {
    name: "#eng-onboarding",
    desc: "Your first stop. Ask anything here.",
    joined: true,
  },
  {
    name: "#platform",
    desc: "Deploys, incidents, infra chatter.",
    joined: true,
  },
  {
    name: "#ams-announcements",
    desc: "Company-wide. Read-only.",
    joined: true,
  },
  { name: "#random", desc: "Exactly what it sounds like.", joined: false },
];

const NORMS = [
  ["Threads over channels", "Reply in-thread. It keeps the channel readable."],
  ["Async by default", "Nobody expects an answer outside their hours."],
  ["No DMs for decisions", "If it affects the team, it belongs in a channel."],
  [
    "Meetings need an agenda",
    "No agenda in the invite is a fair reason to decline.",
  ],
];

export default function Communications() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Communications
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Where the talking happens
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Slack, email and calendar are already provisioned. What&apos;s harder
          to hand over is how the team actually uses them — so that&apos;s
          written down too.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass rounded-2xl md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Hash className="size-4" />
              Your Slack channels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {CHANNELS.map((c) => (
              <div key={c.name} className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-xs text-muted-foreground">
                  #
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{c.name.slice(1)}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
                <Badge
                  variant={c.joined ? "secondary" : "outline"}
                  className="shrink-0 text-[10px] font-normal"
                >
                  {c.joined ? "Joined" : "Suggested"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Mail className="size-4" />
              Email &amp; lists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {[
              ["joy.mehta@ams.internal", "Your address"],
              ["eng-all@", "Everyone in engineering"],
              ["platform-team@", "Your team"],
            ].map(([addr, what]) => (
              <div key={addr}>
                <p className="font-mono text-[11px]">{addr}</p>
                <p className="text-muted-foreground">{what}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <h2 className="mb-4 flex items-center gap-2 text-sm font-medium">
        <Megaphone className="size-4" />
        How we communicate
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {NORMS.map(([title, desc]) => (
          <Card key={title} className="glass rounded-2xl">
            <CardContent className="py-5">
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CalendarClock className="size-4" />
              Core hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              10:00 — 15:00
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Pacific. Outside those hours, work when you work. Meetings get
              scheduled inside them.
            </p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Video className="size-4" />
              Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Zoom for external calls, Huddles for anything internal and quick.
              Cameras optional, always.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
