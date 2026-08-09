import {
  HeartPulse,
  Stethoscope,
  Brain,
  Umbrella,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = { title: "Health — AMS" };

const PLANS = [
  {
    name: "Medical",
    carrier: "Anthem PPO",
    detail: "AMS covers 90% of your premium, 70% for dependents.",
    cost: "$48 / paycheck",
  },
  {
    name: "Dental",
    carrier: "Delta Dental",
    detail: "Two cleanings a year at no cost. Orthodontia at 50%.",
    cost: "$9 / paycheck",
  },
  {
    name: "Vision",
    carrier: "VSP",
    detail: "One exam and one pair of frames each year.",
    cost: "$4 / paycheck",
  },
];

export default function Health() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Health
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          Benefits, and the deadline that matters
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          You have 30 days from your start date to enrol. Miss it and the next
          window is open enrolment in November — so this is the one onboarding
          task with a real clock on it.
        </p>
      </header>

      {/* The deadline is the thing most new hires miss, so it leads. */}
      <Card className="glass rounded-2xl">
        <CardContent className="flex flex-col gap-6 py-7 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <CalendarDays className="size-5" />
              <p className="text-base font-semibold">
                Enrolment closes September 8
              </p>
              <Badge variant="outline" className="border-dashed font-normal">
                30 days left
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing is selected yet. If you do nothing, you get medical at the
              default tier and no dental or vision.
            </p>
          </div>
          <Button size="lg" className="rounded-full px-6">
            Choose your plans
          </Button>
        </CardContent>
      </Card>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card key={p.name} className="glass rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Stethoscope className="size-4" />
                {p.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{p.carrier}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{p.detail}</p>
              <p className="mt-3 font-mono text-xs tabular-nums">{p.cost}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Brain className="size-4" />
              Mental health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Twelve therapy sessions a year through Spring Health, at no cost
              and with no manager approval. Booking is between you and them.
            </p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <HeartPulse className="size-4" />
              Sick leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              Untracked
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              No accrual, no balance. Tell your manager you&apos;re out and
              rest.
            </p>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Umbrella className="size-4" />
              HSA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Available on the high-deductible plan only. AMS contributes $1,200
              a year, paid in January.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
