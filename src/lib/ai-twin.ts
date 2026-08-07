/**
 * AI Twin — placeholder integration structure.
 *
 * Today this reasons locally over the student's own data so the experience is
 * fully functional offline. Swap `generateTwinReply` for a call to a server
 * function backed by an AI model when you want live generation; the shape of
 * `TwinContext` and the return value is already the contract.
 */

export type TwinContext = {
  fullName: string;
  careerTitle: string | null;
  readiness: number;
  missingSkills: string[];
  existingSkills: string[];
  nextStep: string | null;
  roadmapProgress: number;
  projects: number;
  certificates: number;
  topOpportunities: { title: string; type: string }[];
};

export type TwinMessage = { role: "twin" | "user"; content: string };

export function twinInsights(ctx: TwinContext) {
  const insights: string[] = [];
  insights.push(
    ctx.careerTitle
      ? `You're ${ctx.readiness}% ready for ${ctx.careerTitle}. That's ${ctx.readiness >= 60 ? "genuinely strong" : "a solid starting base"} for a student.`
      : "Pick a career goal and I can measure your readiness week by week.",
  );
  if (ctx.missingSkills.length)
    insights.push(
      `Closing ${ctx.missingSkills.slice(0, 3).join(", ")} would move your readiness the most.`,
    );
  if (ctx.projects < 3)
    insights.push(
      `You have ${ctx.projects} project${ctx.projects === 1 ? "" : "s"} in your portfolio. Three focused projects beat ten tutorials.`,
    );
  if (ctx.roadmapProgress > 0 && ctx.roadmapProgress < 100)
    insights.push(`You're ${ctx.roadmapProgress}% through your roadmap — keep the streak alive.`);
  if (ctx.certificates === 0)
    insights.push("One credible certification adds instant signal to a student CV.");
  return insights;
}

export function generateTwinReply(question: string, ctx: TwinContext): string {
  const q = question.toLowerCase();

  if (/skill|gap|learn what|missing/.test(q)) {
    return ctx.missingSkills.length
      ? `For ${ctx.careerTitle ?? "your goal"} you're missing: ${ctx.missingSkills.join(", ")}. Start with ${ctx.missingSkills[0]} — it unlocks the rest. You already have ${ctx.existingSkills.slice(0, 4).join(", ") || "a clean slate"}.`
      : "You cover every required skill for your goal. Now go deeper: build something real that proves each one.";
  }
  if (/next|what should i do|step|start/.test(q)) {
    return ctx.nextStep
      ? `Your next roadmap step is "${ctx.nextStep}". Give it two focused weeks, then mark it complete to earn XP.`
      : "Set a career goal in onboarding and I'll generate your next step immediately.";
  }
  if (/opportunit|internship|hackathon|scholarship|apply/.test(q)) {
    return ctx.topOpportunities.length
      ? `Highest-fit right now: ${ctx.topOpportunities.map((o) => `${o.title} (${o.type})`).join(", ")}. Apply to one this week — applications are a skill too.`
      : "Head to the Opportunities Hub and I'll rank openings against your profile.";
  }
  if (/project|portfolio|build/.test(q)) {
    return `You have ${ctx.projects} project${ctx.projects === 1 ? "" : "s"}. Build one that uses ${ctx.missingSkills[0] ?? ctx.existingSkills[0] ?? "your strongest skill"} end to end, write a real README, and add it to your portfolio.`;
  }
  if (/cv|resume/.test(q)) {
    return "Your CV should lead with projects and measurable outcomes, not coursework. Open the CV Builder — it scores completeness as you fill it in.";
  }
  if (/ready|score|progress/.test(q)) {
    return `Readiness is ${ctx.readiness}%, roadmap ${ctx.roadmapProgress}%, ${ctx.projects} projects and ${ctx.certificates} certifications. The fastest lever is ${ctx.missingSkills[0] ? `learning ${ctx.missingSkills[0]}` : "shipping another project"}.`;
  }
  return `Here's what I'd focus on, ${ctx.fullName || "friend"}: ${twinInsights(ctx).slice(0, 2).join(" ")} Ask me about skills, your next step, projects, your CV, or opportunities.`;
}

export const TWIN_SUGGESTIONS = [
  "What skills am I missing?",
  "What should I do next?",
  "Which opportunities fit me?",
  "How is my portfolio looking?",
];
