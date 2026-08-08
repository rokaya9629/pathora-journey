import type { Opportunity, RoadmapStep } from "@/hooks/usePathora";

const norm = (value: string) => value.trim().toLowerCase();

export type MatchInput = {
  skills: string[];
  missingSkills: string[];
  interests: string[];
  major: string | null;
  dreamCareer: string | null;
  careerGoalId: string | null;
  careerTitle: string | null;
  careerTags: string[];
  roadmapProgress: number;
  nextStep: RoadmapStep | null;
  skillReadiness: number;
};

export type OpportunityMatch = {
  opportunity: Opportunity;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  gapSkills: string[];
  reasons: string[];
};

/**
 * Recommendation engine: blends skill coverage, skill-gap relevance, career goal
 * alignment, roadmap stage and interests into a single 0-100 match score.
 */
export function matchOpportunity(opportunity: Opportunity, input: MatchInput): OpportunityMatch {
  const have = new Set(input.skills.map(norm));
  const gaps = new Set(input.missingSkills.map(norm));
  const required = opportunity.required_skills ?? [];

  const matchedSkills = required.filter((s) => have.has(norm(s)));
  const missingSkills = required.filter((s) => !have.has(norm(s)));
  const gapSkills = missingSkills.filter((s) => gaps.has(norm(s)));

  const reasons: string[] = [];

  // 1. Skill coverage (0-40)
  const coverage = required.length ? matchedSkills.length / required.length : 0.5;
  let score = coverage * 40;
  if (required.length && coverage >= 0.6) {
    reasons.push(
      `You already have ${matchedSkills.length} of ${required.length} required skills (${matchedSkills
        .slice(0, 3)
        .join(", ")}).`,
    );
  }

  // 2. Skill-gap growth value (0-18) — closes skills your target career needs
  if (gapSkills.length) {
    score += Math.min(18, gapSkills.length * 7);
    reasons.push(`Builds ${gapSkills.slice(0, 3).join(", ")} — skills missing for your career goal.`);
  }

  // 3. Career goal alignment (0-20)
  if (opportunity.career_id && opportunity.career_id === input.careerGoalId) {
    score += 20;
    reasons.push(`Directly aligned with your goal: ${input.careerTitle ?? "your career path"}.`);
  } else {
    const haystack = [
      ...input.careerTags,
      input.careerTitle ?? "",
      input.dreamCareer ?? "",
      input.major ?? "",
    ]
      .map(norm)
      .join(" ");
    const tagHits = (opportunity.tags ?? []).filter((t) => haystack.includes(norm(t)));
    if (tagHits.length) {
      score += Math.min(12, tagHits.length * 6);
      reasons.push(`Matches your field via ${tagHits.slice(0, 2).join(", ")}.`);
    }
  }

  // 4. Interests (0-10)
  const interestHay = input.interests.map(norm).join(" ");
  const interestHits = (opportunity.tags ?? []).filter((t) => interestHay.includes(norm(t)));
  if (interestHits.length) {
    score += Math.min(10, interestHits.length * 5);
    reasons.push(`Overlaps your interests: ${interestHits.slice(0, 2).join(", ")}.`);
  }

  // 5. Difficulty fit vs roadmap progress + readiness (0-12)
  const stage = (input.roadmapProgress + input.skillReadiness) / 2;
  const expected = stage < 34 ? "Beginner" : stage < 67 ? "Intermediate" : "Advanced";
  if (opportunity.difficulty === expected) {
    score += 12;
    reasons.push(`${opportunity.difficulty} level suits where you are on your roadmap.`);
  } else if (
    (expected === "Intermediate" && opportunity.difficulty !== "Advanced") ||
    (expected === "Advanced" && opportunity.difficulty === "Intermediate") ||
    (expected === "Beginner" && opportunity.difficulty === "Intermediate")
  ) {
    score += 6;
  }

  // 6. Next roadmap step keyword nudge
  if (input.nextStep) {
    const stepWords = norm(input.nextStep.title)
      .split(/[^a-z0-9+]+/)
      .filter((w) => w.length > 3);
    const hay = norm(`${opportunity.title} ${opportunity.description} ${(opportunity.tags ?? []).join(" ")}`);
    if (stepWords.some((w) => hay.includes(w))) {
      score += 6;
      reasons.push(`Supports your next roadmap step: ${input.nextStep.title}.`);
    }
  }

  // 7. Deadline urgency nudge
  if (opportunity.deadline) {
    const days = Math.ceil(
      (new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (days >= 0 && days <= 45) reasons.push(`Closing soon — ${days} day${days === 1 ? "" : "s"} left.`);
  }

  if (!reasons.length) {
    reasons.push("Broad early-career opportunity worth exploring while you build your profile.");
  }

  return {
    opportunity,
    score: Math.max(12, Math.min(99, Math.round(score))),
    matchedSkills,
    missingSkills,
    gapSkills,
    reasons,
  };
}

export function rankOpportunities(opportunities: Opportunity[], input: MatchInput) {
  return opportunities
    .map((o) => matchOpportunity(o, input))
    .sort((a, b) => b.score - a.score);
}

export const daysUntil = (date: string | null) =>
  date ? Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
