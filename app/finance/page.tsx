import {
  Wallet,
  Receipt,
  FileText,
  PiggyBank,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const metadata = { title: "Finance — AMS" };

const OTHER = [
  {
    icon: Receipt,
    title: "Expenses",
    desc: "Submit receipts and mileage. Anything under $75 skips approval.",
    meta: "Expensify · reimbursed with payroll",
  },
  {
    icon: FileText,
    title: "Tax documents",
    desc: "W-2s, 1099s and year-end summaries, going back three years.",
    meta: "ADP · available from January 31",
  },
  {
    icon: PiggyBank,
    title: "401(k)",
    desc: "AMS matches 4%. You're auto-enrolled at 3% after 30 days.",
    meta: "Fidelity · change anytime",
  },
];

export default function Finance() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Finance
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Getting paid, and everything around it
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Payroll runs through ADP. Set up direct deposit before the 20th to
          make this cycle — ask Garfield to walk you through it if you&apos;d
          rather be shown than read.
        </p>
      </header>

      {/* Payroll is the anchor of this page — the walkthrough points here. */}
      <Card data-tour="payroll-card" className="glass rounded-2xl">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <Wallet className="size-5" />
            <CardTitle className="text-base">Payroll</CardTitle>
            <Badge variant="secondary" className="font-normal">
              ADP
            </Badge>
            <Badge variant="outline" className="border-dashed font-normal">
              Action needed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Four steps: deposit vault, tax scroll, pay calendar, final review.
              Takes about five minutes.
            </p>

            <div className="mt-4 max-w-sm">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Setup progress</span>
                <span className="font-mono tabular-nums">0/4</span>
              </div>
              <Progress value={0} className="h-1.5" />
            </div>

            <dl className="mt-5 grid gap-3 text-xs sm:grid-cols-3">
              {[
                ["Pay cycle", "Bi-weekly, Friday"],
                ["Next payday", "August 21"],
                ["Cutoff", "August 20"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Button
            data-tour="deposit-setup"
            size="lg"
            className="gap-2 rounded-full px-6"
          >
            Set up direct deposit
            <ArrowUpRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {OTHER.map(({ icon: Icon, title, desc, meta }) => (
          <Card key={title} className="glass rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Icon className="size-4" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{desc}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {meta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
