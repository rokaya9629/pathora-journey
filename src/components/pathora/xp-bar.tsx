import { Zap } from "lucide-react";
import { levelFromXp } from "@/lib/gamification";

export function XpBar({ xp, compact = false }: { xp: number; compact?: boolean }) {
  const { level, xpIntoLevel, xpForNextLevel } = levelFromXp(xp);
  const pct = Math.round((xpIntoLevel / xpForNextLevel) * 100);

  return (
    <div className={compact ? "w-full" : "w-full rounded-2xl border bg-card p-4 shadow-card"}>
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Zap className="size-4 text-primary" /> Level {level}
        </span>
        <span className="text-muted-foreground">
          {xpIntoLevel} / {xpForNextLevel} XP
        </span>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="gradient-surface h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      {!compact && (
        <p className="mt-2 text-xs text-muted-foreground">{xp} total XP earned on Pathora</p>
      )}
    </div>
  );
}
