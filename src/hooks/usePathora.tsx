import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { readinessScore, skillGap } from "@/lib/gamification";

export type Profile = {
  id: string;
  full_name: string;
  headline: string | null;
  avatar_url: string | null;
  education_level: string | null;
  major: string | null;
  current_skills: string[];
  interests: string[];
  dream_career: string | null;
  career_goal_id: string | null;
  onboarding_complete: boolean;
  xp: number;
  created_at: string;
};

export type Career = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  market_demand: string;
  demand_score: number;
  avg_salary: string | null;
  tags: string[];
};

export type CareerSkill = { id: string; career_id: string; skill: string; importance: number };
export type Roadmap = { id: string; career_id: string; title: string; description: string };
export type RoadmapStep = {
  id: string;
  roadmap_id: string;
  position: number;
  title: string;
  description: string;
  est_weeks: number;
};
export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  github_url: string | null;
  image_url: string | null;
  created_at: string;
};
export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  url: string | null;
};
export type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: string;
  organization: string | null;
  deadline: string | null;
  url: string;
  tags: string[];
  location: string;
  is_remote: boolean;
  difficulty: string;
  required_skills: string[];
  compensation: string | null;
  career_id: string | null;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  url: string;
};

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });
}

export function useCareers() {
  return useQuery({
    queryKey: ["careers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("careers").select("*").order("demand_score", {
        ascending: false,
      });
      if (error) throw error;
      return (data ?? []) as Career[];
    },
  });
}

export function useCareerSkills() {
  return useQuery({
    queryKey: ["career_skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("career_skills").select("*");
      if (error) throw error;
      return (data ?? []) as CareerSkill[];
    },
  });
}

export function useRoadmap(careerId: string | null | undefined) {
  return useQuery({
    queryKey: ["roadmap", careerId],
    enabled: !!careerId,
    queryFn: async () => {
      const { data: roadmap, error } = await supabase
        .from("roadmaps")
        .select("*")
        .eq("career_id", careerId!)
        .maybeSingle();
      if (error) throw error;
      if (!roadmap) return { roadmap: null, steps: [] as RoadmapStep[] };
      const { data: steps, error: stepError } = await supabase
        .from("roadmap_steps")
        .select("*")
        .eq("roadmap_id", roadmap.id)
        .order("position");
      if (stepError) throw stepError;
      return { roadmap: roadmap as Roadmap, steps: (steps ?? []) as RoadmapStep[] };
    },
  });
}

export function useProgress(userId: string | undefined) {
  return useQuery({
    queryKey: ["progress", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roadmap_progress")
        .select("step_id")
        .eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((row) => row.step_id as string);
    },
  });
}

export function useProjects(userId: string | undefined) {
  return useQuery({
    queryKey: ["projects", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Project[];
    },
  });
}

export function useCertificates(userId: string | undefined) {
  return useQuery({
    queryKey: ["certificates", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", userId!)
        .order("issue_date", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as Certificate[];
    },
  });
}

export function useOpportunities() {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("deadline", { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as Opportunity[];
    },
  });
}

export function useResources() {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*").order("title");
      if (error) throw error;
      return (data ?? []) as Resource[];
    },
  });
}

export function useXpEvents(userId: string | undefined) {
  return useQuery({
    queryKey: ["xp_events", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("xp_events")
        .select("id, amount, reason, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useBadges(userId: string | undefined) {
  return useQuery({
    queryKey: ["badges", userId],
    queryFn: async () => {
      const { data: all, error } = await supabase.from("achievements").select("*").order("title");
      if (error) throw error;
      let earned: { achievement_id: string; earned_at: string }[] = [];
      if (userId) {
        const { data } = await supabase
          .from("user_achievements")
          .select("achievement_id, earned_at")
          .eq("user_id", userId);
        earned = data ?? [];
      }
      return { all: all ?? [], earned };
    },
  });
}

export function useIsAdmin(userId: string | undefined) {
  return useQuery({
    queryKey: ["is_admin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    },
  });
}

/** Everything the dashboard and AI Twin need, derived in one place. */
export function usePathoraSummary(userId: string | undefined) {
  const profile = useProfile(userId);
  const careers = useCareers();
  const skills = useCareerSkills();
  const roadmap = useRoadmap(profile.data?.career_goal_id);
  const progress = useProgress(userId);
  const projects = useProjects(userId);
  const certificates = useCertificates(userId);

  const career = careers.data?.find((c) => c.id === profile.data?.career_goal_id) ?? null;
  const requiredSkills = (skills.data ?? [])
    .filter((s) => s.career_id === career?.id)
    .sort((a, b) => b.importance - a.importance)
    .map((s) => s.skill);
  const gap = skillGap(profile.data?.current_skills ?? [], requiredSkills);
  const steps = roadmap.data?.steps ?? [];
  const completed = progress.data ?? [];
  const roadmapProgress = steps.length
    ? Math.round((steps.filter((s) => completed.includes(s.id)).length / steps.length) * 100)
    : 0;
  const nextStep = steps.find((s) => !completed.includes(s.id)) ?? null;

  const readiness = readinessScore({
    skillReadiness: gap.readiness,
    roadmapProgress,
    projects: projects.data?.length ?? 0,
    certificates: certificates.data?.length ?? 0,
    onboardingComplete: profile.data?.onboarding_complete ?? false,
  });

  return {
    loading:
      profile.isLoading || careers.isLoading || skills.isLoading || projects.isLoading,
    profile: profile.data ?? null,
    careers: careers.data ?? [],
    careerSkills: skills.data ?? [],
    career,
    requiredSkills,
    gap,
    steps,
    completed,
    roadmapProgress,
    nextStep,
    projects: projects.data ?? [],
    certificates: certificates.data ?? [],
    readiness,
  };
}
