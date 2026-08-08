import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Award,
  Bookmark,
  BookmarkCheck,
  Briefcase,
  CalendarClock,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Target,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StatTile } from "@/components/pathora/ui-bits";
import { useAuth } from "@/hooks/useAuth";
import { usePathoraSummary } from "@/hooks/usePathora";
import {
  useOpportunitiesFull,
  useSavedOpportunities,
  useToggleSaved,
} from "@/hooks/useOpportunities";
import { daysUntil, rankOpportunities, type OpportunityMatch } from "@/lib/opportunity-match";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunities Hub — Pathora" },
      {
        name: "description",
        content:
          "Personalised internships, entry-level jobs, hackathons, scholarships, certifications and courses matched to your skills, gaps and career goal.",
      },
      { property: "og:title", content: "Opportunities Hub — Pathora" },
      {
        property: "og:description",
        content:
          "Personalised internships, entry-level jobs, hackathons, scholarships, certifications and courses matched to your skills, gaps and career goal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OpportunitiesPage,
});

const ALL = "all";
const CATEGORY_ORDER = [
  "Internship",
  "Entry-level Job",
  "Hackathon",
  "Competition",
  "Scholarship",
  "Certification",
  "Course",
  "Remote",
  "Fellowship",
  "Student Program",
];

function OpportunitiesPage() {
  const { user } = useAuth();
  const summary = usePathoraSummary(user?.id);
  const opportunities = useOpportunitiesFull();
  const saved = useSavedOpportunities(user?.id);
  const toggleSaved = useToggleSaved(user?.id);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [skill, setSkill] = useState(ALL);
  const [location, setLocation] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);

  const savedIds = useMemo(
    () => new Set((saved.data ?? []).map((row) => row.opportunity_id as string)),
    [saved.data],
  );

  const ranked = useMemo<OpportunityMatch[]>(() => {
    const list = opportunities.data ?? [];
    if (!list.length) return [];
    return rankOpportunities(list, {
      skills: summary.profile?.current_skills ?? [],
      missingSkills: summary.gap.missing,
      interests: summary.profile?.interests ?? [],
      major: summary.profile?.major ?? null,
      dreamCareer: summary.profile?.dream_career ?? null,
      careerGoalId: summary.profile?.career_goal_id ?? null,
      careerTitle: summary.career?.title ?? null,
      careerTags: summary.career?.tags ?? [],
      roadmapProgress: summary.roadmapProgress,
      nextStep: summary.nextStep,
      skillReadiness: summary.gap.readiness,
    });
  }, [opportunities.data, summary]);

  const categories = useMemo(() => {
    const found = Array.from(new Set((opportunities.data ?? []).map((o) => o.type)));
    return [
      ...CATEGORY_ORDER.filter((c) => found.includes(c)),
      ...found.filter((c) => !CATEGORY_ORDER.includes(c)).sort(),
    ];
  }, [opportunities.data]);

  const skills = useMemo(
    () =>
      Array.from(
        new Set((opportunities.data ?? []).flatMap((o) => o.required_skills ?? [])),
      ).sort((a, b) => a.localeCompare(b)),
    [opportunities.data],
  );

  const locations = useMemo(
    () => Array.from(new Set((opportunities.data ?? []).map((o) => o.location))).sort(),
    [opportunities.data],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ranked.filter(({ opportunity: o }) => {
      if (category !== ALL && o.type !== category) return false;
      if (difficulty !== ALL && o.difficulty !== difficulty) return false;
      if (location !== ALL && o.location !== location) return false;
      if (remoteOnly && !o.is_remote) return false;
      if (savedOnly && !savedIds.has(o.id)) return false;
      if (
        skill !== ALL &&
        !(o.required_skills ?? []).some((s) => s.toLowerCase() === skill.toLowerCase())
      )
        return false;
      if (
        q &&
        ![o.title, o.description, o.organization ?? "", (o.tags ?? []).join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [ranked, category, difficulty, location, remoteOnly, savedOnly, savedIds, skill, query]);

  const strongMatches = ranked.filter((m) => m.score >= 70).length;
  const closingSoon = ranked.filter((m) => {
    const d = daysUntil(m.opportunity.deadline);
    return d !== null && d >= 0 && d <= 45;
  }).length;

  const loading = opportunities.isLoading || summary.loading;

  const onToggle = (id: string) => {
    const isSaved = savedIds.has(id);
    toggleSaved.mutate(
      { opportunityId: id, saved: isSaved },
      {
        onSuccess: (res) =>
          toast.success(res.saved ? "Saved to your bookmarks" : "Removed from bookmarks"),
        onError: (error: Error) => toast.error(error.message),
      },
    );
  };

  const resetFilters = () => {
    setQuery("");
    setCategory(ALL);
    setSkill(ALL);
    setLocation(ALL);
    setDifficulty(ALL);
    setRemoteOnly(false);
    setSavedOnly(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight">Opportunities Hub</h1>
        <p className="text-muted-foreground">
          Ranked against your skills, skill gaps, roadmap progress and career goal
          {summary.career ? ` (${summary.career.title})` : ""}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          icon={<Sparkles className="size-4" />}
          label="Strong matches"
          value={strongMatches}
          hint="70% match or higher"
        />
        <StatTile
          icon={<Target className="size-4" />}
          label="Skill readiness"
          value={`${summary.gap.readiness}%`}
          hint={`${summary.gap.missing.length} skills to close`}
        />
        <StatTile
          icon={<CalendarClock className="size-4" />}
          label="Closing soon"
          value={closingSoon}
          hint="Within 45 days"
        />
        <StatTile
          icon={<BookmarkCheck className="size-4" />}
          label="Bookmarked"
          value={savedIds.size}
          hint="Saved for later"
        />
      </div>

      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Narrow by category, skill, location, remote or difficulty.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search opportunities, organisations or tags"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Category" value={category} onChange={setCategory} options={categories} />
            <FilterSelect label="Skill" value={skill} onChange={setSkill} options={skills} />
            <FilterSelect label="Location" value={location} onChange={setLocation} options={locations} />
            <FilterSelect
              label="Difficulty"
              value={difficulty}
              onChange={setDifficulty}
              options={["Beginner", "Intermediate", "Advanced"]}
            />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="remote" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
              <Label htmlFor="remote" className="text-sm">Remote only</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="savedOnly" checked={savedOnly} onCheckedChange={setSavedOnly} />
              <Label htmlFor="savedOnly" className="text-sm">Bookmarked only</Label>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            No opportunities match these filters yet. Try resetting them.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {ranked.length} opportunities, best match first.
          </p>
          {filtered.map((match) => (
            <OpportunityCard
              key={match.opportunity.id}
              match={match}
              saved={savedIds.has(match.opportunity.id)}
              onToggle={onToggle}
              pending={toggleSaved.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`All ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All {label.toLowerCase()}s</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  Internship: <Briefcase className="size-4" />,
  "Entry-level Job": <Briefcase className="size-4" />,
  Certification: <Award className="size-4" />,
  Course: <GraduationCap className="size-4" />,
  Scholarship: <GraduationCap className="size-4" />,
  Remote: <Wifi className="size-4" />,
};

function OpportunityCard({
  match,
  saved,
  onToggle,
  pending,
}: {
  match: OpportunityMatch;
  saved: boolean;
  onToggle: (id: string) => void;
  pending: boolean;
}) {
  const o = match.opportunity;
  const days = daysUntil(o.deadline);

  return (
    <Card className="shadow-card transition-shadow hover:shadow-glow">
      <CardHeader className="gap-3 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                {TYPE_ICON[o.type] ?? <Sparkles className="size-4" />}
                {o.type}
              </Badge>
              <Badge variant="outline">{o.difficulty}</Badge>
              {o.is_remote && (
                <Badge variant="outline" className="gap-1">
                  <Wifi className="size-3" /> Remote
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{o.title}</CardTitle>
            <CardDescription className="max-w-2xl">{o.description}</CardDescription>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {o.organization && <span>{o.organization}</span>}
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3" /> {o.location}
              </span>
              {o.compensation && <span>{o.compensation}</span>}
              {o.deadline && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1",
                    days !== null && days >= 0 && days <= 45 && "text-primary",
                  )}
                >
                  <CalendarClock className="size-3" />
                  {new Date(o.deadline).toLocaleDateString()}
                  {days !== null && days >= 0 ? ` · ${days}d left` : ""}
                </span>
              )}
            </div>
          </div>
          <div className="w-36 shrink-0 space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Match</span>
              <span className="font-display text-2xl font-bold gradient-text">{match.score}%</span>
            </div>
            <Progress value={match.score} className="h-2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <SkillList label="Required skills" skills={o.required_skills ?? []} variant="outline" />
          <SkillList
            label={`Missing skills (${match.missingSkills.length})`}
            skills={match.missingSkills}
            variant="destructive"
            empty="You meet every listed skill."
          />
        </div>

        <div className="rounded-xl border border-dashed p-3">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" /> Why this was recommended
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {match.reasons.map((reason) => (
              <li key={reason}>• {reason}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <a href={o.url} target="_blank" rel="noreferrer noopener">
              Apply <ExternalLink className="ml-1 size-4" />
            </a>
          </Button>
          <Button
            variant={saved ? "secondary" : "outline"}
            onClick={() => onToggle(o.id)}
            disabled={pending}
          >
            {saved ? (
              <>
                <BookmarkCheck className="mr-1 size-4" /> Saved
              </>
            ) : (
              <>
                <Bookmark className="mr-1 size-4" /> Save
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SkillList({
  label,
  skills,
  variant,
  empty,
}: {
  label: string;
  skills: string[];
  variant: "outline" | "destructive";
  empty?: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {skills.length ? (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((s) => (
            <Badge key={s} variant={variant === "destructive" ? "destructive" : "outline"}>
              {s}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{empty ?? "Not specified."}</p>
      )}
    </div>
  );
}
