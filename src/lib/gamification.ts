import { supabase } from "@/integrations/supabase/client";

/** XP needed for each level grows steadily: level n requires 250 * n XP. */
export function levelFromXp(xp: number) {
  let level = 1;
  let remaining = xp;
  let need = 250;
  while (remaining >= need) {
    remaining -= need;
    level += 1;
    need = 250 * level;
  }
  return { level, xpIntoLevel: remaining, xpForNextLevel: need };
}

export const XP_RULES = {
  profile_completed: 100,
  project_added: 40,
  certificate_added: 30,
  roadmap_step: 25,
  cv_built: 60,
} as const;

/**
 * Awards XP: records an xp_event and increments the profile total.
 * Safe to call from the client — RLS scopes both writes to the signed-in user.
 */
export async function awardXp(userId: string, amount: number, reason: string) {
  await supabase.from("xp_events").insert({ user_id: userId, amount, reason });
  const { data } = await supabase.from("profiles").select("xp").eq("id", userId).maybeSingle();
  const next = (data?.xp ?? 0) + amount;
  await supabase.from("profiles").update({ xp: next }).eq("id", userId);
  return next;
}

/** Grants a badge by code if the user does not already have it. Awards its XP too. */
export async function grantAchievement(userId: string, code: string) {
  const { data: achievement } = await supabase
    .from("achievements")
    .select("id, title, xp_reward")
    .eq("code", code)
    .maybeSingle();
  if (!achievement) return null;

  const { data: existing } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievement.id)
    .maybeSingle();
  if (existing) return null;

  const { error } = await supabase
    .from("user_achievements")
    .insert({ user_id: userId, achievement_id: achievement.id });
  if (error) return null;

  await awardXp(userId, achievement.xp_reward, `Badge: ${achievement.title}`);
  return achievement.title;
}

const norm = (value: string) => value.trim().toLowerCase();

/** Skill gap between what a student has and what a career requires. */
export function skillGap(currentSkills: string[], requiredSkills: string[]) {
  const have = new Set(currentSkills.map(norm));
  const existing = requiredSkills.filter((skill) => have.has(norm(skill)));
  const missing = requiredSkills.filter((skill) => !have.has(norm(skill)));
  const readiness = requiredSkills.length
    ? Math.round((existing.length / requiredSkills.length) * 100)
    : 0;
  return { existing, missing, readiness };
}

/** Rough match score between a profile and an opportunity's tags. */
export function matchScore(
  tags: string[],
  skills: string[],
  interests: string[],
  major?: string | null,
) {
  const haystack = [...skills, ...interests, major ?? ""].map(norm).join(" ");
  if (!tags.length) return 62;
  const hits = tags.filter((tag) => haystack.includes(norm(tag))).length;
  return Math.min(98, 55 + Math.round((hits / tags.length) * 43));
}

/** Career readiness blends skill coverage, roadmap progress and portfolio depth. */
export function readinessScore(input: {
  skillReadiness: number;
  roadmapProgress: number;
  projects: number;
  certificates: number;
  onboardingComplete: boolean;
}) {
  const portfolio = Math.min(100, input.projects * 25 + input.certificates * 15);
  const base =
    input.skillReadiness * 0.4 +
    input.roadmapProgress * 0.3 +
    portfolio * 0.2 +
    (input.onboardingComplete ? 100 : 0) * 0.1;
  return Math.round(Math.max(0, Math.min(100, base)));
}

/** Portfolio strength: breadth of projects, tech variety, links and images. */
export function portfolioStrength(
  projects: { technologies: string[]; github_url?: string | null; image_url?: string | null; description: string }[],
) {
  if (!projects.length) return 0;
  const tech = new Set(projects.flatMap((p) => p.technologies.map(norm)));
  const linked = projects.filter((p) => p.github_url).length;
  const visual = projects.filter((p) => p.image_url).length;
  const described = projects.filter((p) => p.description.length > 60).length;
  const score =
    Math.min(40, projects.length * 14) +
    Math.min(25, tech.size * 4) +
    Math.min(15, linked * 6) +
    Math.min(10, visual * 5) +
    Math.min(10, described * 4);
  return Math.round(Math.min(100, score));
}

/** CV health: completeness of the sections recruiters look for. */
export function cvHealth(input: {
  hasName: boolean;
  hasHeadline: boolean;
  hasEducation: boolean;
  skills: number;
  projects: number;
  certificates: number;
}) {
  let score = 0;
  if (input.hasName) score += 15;
  if (input.hasHeadline) score += 10;
  if (input.hasEducation) score += 20;
  score += Math.min(20, input.skills * 4);
  score += Math.min(25, input.projects * 9);
  score += Math.min(10, input.certificates * 5);
  return Math.min(100, score);
}
