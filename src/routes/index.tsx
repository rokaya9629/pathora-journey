import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BrainCircuit,
  Briefcase,
  Compass,
  FileText,
  FolderKanban,
  GaugeCircle,
  Map,
  Quote,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/hero-pathora.jpg";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/pathora/ui-bits";
import { ThemeToggle } from "@/components/pathora/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pathora — From Student to Professional" },
      {
        name: "description",
        content:
          "Discover your career path, close skill gaps, find hackathons and internships, build a portfolio and track your growth with your own AI twin.",
      },
      { property: "og:title", content: "Pathora — From Student to Professional" },
      {
        property: "og:description",
        content:
          "An AI-powered student growth platform: career advisor, smart roadmaps, skill gap analysis, opportunities hub, portfolio and CV builder.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: Compass,
    title: "AI Career Advisor",
    body: "Careers matched to your major, skills and interests — with demand data and learning paths.",
  },
  {
    icon: Map,
    title: "Smart Roadmap",
    body: "A step-by-step timeline from fundamentals to job-ready, with progress tracking.",
  },
  {
    icon: GaugeCircle,
    title: "Skills Gap Analyzer",
    body: "See exactly which skills you have, which you're missing, and your readiness percentage.",
  },
  {
    icon: Briefcase,
    title: "Opportunities Hub",
    body: "Hackathons, internships, scholarships and fellowships ranked by fit with your profile.",
  },
  {
    icon: FolderKanban,
    title: "Portfolio Builder",
    body: "Turn coursework into proof with project cards and a portfolio strength score.",
  },
  {
    icon: FileText,
    title: "CV Builder",
    body: "Generate a professional CV from your profile, projects and certifications.",
  },
  {
    icon: BrainCircuit,
    title: "AI Twin",
    body: "A personal mentor that reads your progress and tells you the single next best step.",
  },
  {
    icon: Award,
    title: "XP & Achievements",
    body: "Earn XP, level up and unlock badges as your real-world profile grows.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Tell Pathora about you",
    body: "A two-minute onboarding captures your education level, major, skills, interests and dream career.",
  },
  {
    n: "02",
    title: "Get your path",
    body: "Pathora scores your readiness, picks matching careers and generates a roadmap you can actually follow.",
  },
  {
    n: "03",
    title: "Build proof and apply",
    body: "Close skill gaps with curated resources, ship projects, then apply to the opportunities that fit you best.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I went from “I study CS” to “I'm a SOC analyst intern” in one year. The roadmap made every week obvious.",
    name: "Salma A.",
    role: "Cybersecurity student",
  },
  {
    quote:
      "The skills gap screen was brutal in the best way. Three missing skills, three months, first internship offer.",
    name: "Youssef M.",
    role: "Data science student",
  },
  {
    quote:
      "My AI twin kept nudging me to ship projects instead of collecting tutorials. My portfolio finally looks real.",
    name: "Nadia K.",
    role: "Frontend student",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/auth">Log in</Link>
            </Button>
            <Button asChild className="gradient-surface shadow-glow">
              <Link to="/auth" search={{ mode: "register" }}>
                Get started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="soft-surface absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-2">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" /> AI-powered student growth platform
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] md:text-6xl">
              From Student to <span className="gradient-text">Professional</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Pathora turns your degree into a plan. Discover the right career, close your skill
              gaps, find real opportunities, build a portfolio recruiters believe — and track every
              step of the way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="gradient-surface shadow-glow">
                <Link to="/auth" search={{ mode: "register" }}>
                  Start free <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">See what's inside</a>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["6+", "career tracks"],
                ["30", "roadmap steps"],
                ["12", "live opportunities"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold">{value}</dt>
                  <dd className="text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative">
            <div className="animate-float overflow-hidden rounded-3xl border shadow-glow">
              <img
                src={heroImage}
                alt="Illustration of a student's rising learning path with skill milestones"
                width={1408}
                height={1008}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">Everything a student needs, in one place</h2>
          <p className="mt-3 text-muted-foreground">
            Eight connected tools that read the same profile, so advice compounds instead of
            contradicting itself.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="soft-surface flex size-10 items-center justify-center rounded-xl text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="soft-surface border-y">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl border bg-card p-6 shadow-card">
                <span className="gradient-text font-display text-4xl font-bold">{step.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold md:text-4xl">Students who found their path</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure key={item.name} className="rounded-2xl border bg-card p-6 shadow-card">
              <Quote className="size-6 text-primary" />
              <blockquote className="mt-3 text-sm leading-relaxed">{item.quote}</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{item.name}</span>
                <span className="text-muted-foreground"> · {item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="gradient-surface mx-auto max-w-5xl rounded-3xl px-6 py-14 text-center shadow-glow">
          <h2 className="text-3xl font-bold md:text-4xl">Your future needs a plan, not a guess</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-90">
            Join Pathora free, finish onboarding in two minutes, and get your career readiness score
            today.
          </p>
          <Button size="lg" variant="secondary" asChild className="mt-7">
            <Link to="/auth" search={{ mode: "register" }}>
              Create your account <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground md:flex-row">
          <Logo />
          <p>From Student to Professional.</p>
        </div>
      </footer>
    </div>
  );
}
