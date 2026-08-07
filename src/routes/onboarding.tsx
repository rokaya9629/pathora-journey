import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCareers } from "@/hooks/usePathora";
import { awardXp, grantAchievement, XP_RULES } from "@/lib/gamification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/pathora/tag-input";
import { Logo } from "@/components/pathora/ui-bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set up your Pathora profile" },
      {
        name: "description",
        content:
          "Tell Pathora your education level, skills, interests and dream career to generate your personalised roadmap.",
      },
      { property: "og:title", content: "Set up your Pathora profile" },
      {
        property: "og:description",
        content: "A two-minute assessment that turns your background into a career roadmap.",
      },
    ],
  }),
  component: Onboarding,
});

const EDUCATION = ["High school", "Undergraduate", "Postgraduate", "Bootcamp", "Self-taught"];
const SKILL_SUGGESTIONS = [
  "Python",
  "JavaScript",
  "SQL",
  "React",
  "Networking",
  "Linux",
  "Figma",
  "Excel",
  "Git",
  "Statistics",
];
const INTEREST_SUGGESTIONS = [
  "Cybersecurity",
  "Data",
  "AI",
  "Web development",
  "Design",
  "Cloud",
  "Robotics",
  "Product",
];

const STEP_TITLES = ["About you", "Your skills", "Your interests", "Your goal"];

function Onboarding() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const careers = useCareers();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [major, setMajor] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [dreamCareer, setDreamCareer] = useState("");
  const [careerGoalId, setCareerGoalId] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const metaName = (user.user_metadata?.["full_name"] as string | undefined) ?? "";
    supabase
      .from("profiles")
      .select("full_name, onboarding_complete")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.onboarding_complete) {
          navigate({ to: "/dashboard" });
          return;
        }
        setFullName((current) => current || data?.full_name || metaName);
      });
  }, [user, navigate]);

  const canContinue = [
    fullName.trim().length > 1 && !!educationLevel,
    skills.length > 0,
    interests.length > 0,
    !!careerGoalId,
  ][step];

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim().slice(0, 100),
          education_level: educationLevel,
          major: major.trim().slice(0, 120) || null,
          current_skills: skills,
          interests,
          dream_career: dreamCareer.trim().slice(0, 120) || null,
          career_goal_id: careerGoalId,
          onboarding_complete: true,
        })
        .eq("id", user.id);
      if (error) throw error;

      await awardXp(user.id, XP_RULES.profile_completed, "Completed onboarding");
      await grantAchievement(user.id, "first_steps");
      await queryClient.invalidateQueries();
      toast.success("Profile ready — welcome to Pathora!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="soft-surface flex min-h-screen flex-col items-center px-4 py-10">
      <Logo />
      <Card className="glass-card mt-6 w-full max-w-2xl shadow-glow">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" /> Step {step + 1} of 4
          </div>
          <CardTitle className="text-2xl">{STEP_TITLES[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "We use this to tailor careers to your level and field of study."}
            {step === 1 && "Add every skill you can honestly demonstrate — even beginner ones."}
            {step === 2 && "What genuinely interests you? This shapes your career matches."}
            {step === 3 && "Pick the career you want to aim at. You can change it any time."}
          </CardDescription>
          <Progress value={((step + 1) / 4) * 100} className="mt-3" />
        </CardHeader>
        <CardContent className="space-y-5">
          {step === 0 && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={fullName}
                  maxLength={100}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Amina Hassan"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Education level</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATION.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="major">Major / field of study</Label>
                <Input
                  id="major"
                  value={major}
                  maxLength={120}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
            </>
          )}

          {step === 1 && (
            <TagInput
              value={skills}
              onChange={setSkills}
              placeholder="Add a skill and press Enter"
              suggestions={SKILL_SUGGESTIONS}
            />
          )}

          {step === 2 && (
            <TagInput
              value={interests}
              onChange={setInterests}
              placeholder="Add an interest and press Enter"
              suggestions={INTEREST_SUGGESTIONS}
            />
          )}

          {step === 3 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {careers.data?.map((career) => (
                  <button
                    key={career.id}
                    type="button"
                    onClick={() => setCareerGoalId(career.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5",
                      careerGoalId === career.id
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "bg-card",
                    )}
                  >
                    <p className="text-sm font-semibold">{career.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {career.description}
                    </p>
                    <p className="mt-2 text-[11px] font-medium text-primary">
                      {career.market_demand} demand
                    </p>
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dream">Dream job title (optional)</Label>
                <Input
                  id="dream"
                  value={dreamCareer}
                  maxLength={120}
                  onChange={(e) => setDreamCareer(e.target.value)}
                  placeholder="Security Operations Analyst"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || saving}
            >
              <ArrowLeft className="mr-1 size-4" /> Back
            </Button>
            {step < 3 ? (
              <Button
                className="gradient-surface shadow-glow"
                disabled={!canContinue}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue <ArrowRight className="ml-1 size-4" />
              </Button>
            ) : (
              <Button
                className="gradient-surface shadow-glow"
                disabled={!canContinue || saving}
                onClick={finish}
              >
                {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                Generate my path
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
