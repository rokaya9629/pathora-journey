import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, BrainCircuit, Briefcase, FolderKanban, GaugeCircle, Map } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathoraSummary, useXpEvents } from "@/hooks/usePathora";
import { ScoreRing, StatTile } from "@/components/pathora/ui-bits";
import { XpBar } from "@/components/pathora/xp-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { twinInsights } from "@/lib/ai-twin";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Pathora" },
      {
        name: "description",
        content:
          "Your career readiness score, roadmap progress, skill gaps and next best step in one student dashboard.",
      },
      { property: "og:title", content: "Dashboard — Pathora" },
      {
        property: "og:description",
        content: "Track readiness, XP, skills and portfolio growth on your Pathora dashboard.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const summary = usePathoraSummary(user?.id);
  const xpEvents = useXpEvents(user?.id);

  const insights = twinInsights({
    fullName: summary.profile?.full_name ?? "",
    careerTitle: summary.career?.title ?? null,
    readiness: summary.readiness,
    missingSkills: summary.gap.missing,
    existingSkills: summary.gap.existing,
    nextStep: summary.nextStep?.title ?? null,
    roadmapProgress: summary.roadmapProgress,
    projects: summary.projects.length,
    certificates: summary.certificates.length,
    topOpportunities: [],
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome back, {summary.profile?.full_name?.split(" ")[0] || "student"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {summary.career
            ? `Goal: ${summary.career.title} · ${summary.career.market_demand} market demand`
            : "Set a career goal to unlock your roadmap."}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Career readiness</CardTitle>
            <CardDescription>Skills, roadmap and portfolio combined</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ScoreRing value={summary.readiness} label="ready" />
            <XpBar xp={summary.profile?.xp ?? 0} />
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <StatTile
            icon={<GaugeCircle className="size-4" />}
            label="Skill coverage"
            value={`${summary.gap.readiness}%`}
            hint={`${summary.gap.missing.length} skills to close`}
          />
          <StatTile
            icon={<Map className="size-4" />}
            label="Roadmap"
            value={`${summary.roadmapProgress}%`}
            hint={`${summary.steps.length} steps in your path`}
          />
          <StatTile
            icon={<FolderKanban className="size-4" />}
            label="Projects"
            value={summary.projects.length}
            hint="Proof beats promises"
          />
          <StatTile
            icon={<Award className="size-4" />}
            label="Certificates"
            value={summary.certificates.length}
            hint="Credible signals on your CV"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Your next best step</CardTitle>
            <CardDescription>
              {summary.nextStep
                ? summary.nextStep.description
                : "Complete onboarding or pick a career goal to generate your roadmap."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {summary.nextStep && (
              <div className="soft-surface rounded-2xl p-4">
                <p className="text-sm font-semibold">{summary.nextStep.title}</p>
                <p className="text-xs text-muted-foreground">
                  About {summary.nextStep.est_weeks} weeks of focused work
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button asChild className="gradient-surface shadow-glow">
                <Link to="/roadmap">
                  <Map className="mr-1 size-4" /> Open roadmap
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/skills">
                  <GaugeCircle className="mr-1 size-4" /> Skills gap
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/opportunities">
                  <Briefcase className="mr-1 size-4" /> Opportunities
                </Link>
              </Button>
            </div>
            {summary.gap.missing.length > 0 && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Missing skills
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {summary.gap.missing.slice(0, 8).map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BrainCircuit className="size-4 text-primary" /> AI Twin insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.slice(0, 4).map((insight) => (
              <p key={insight} className="text-sm text-muted-foreground">
                {insight}
              </p>
            ))}
            <Button variant="outline" asChild className="w-full">
              <Link to="/ai-twin">Talk to your AI twin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {xpEvents.data?.length ? (
            <ul className="divide-y">
              {xpEvents.data.map((event) => (
                <li key={event.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{event.reason}</span>
                  <span className="font-semibold text-primary">+{event.amount} XP</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No XP yet — complete a roadmap step or add a project to get moving.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
