import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter",
  suggestions = [],
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.some((v) => v.toLowerCase() === tag.toLowerCase())) return;
    onChange([...value, tag]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <Input
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(draft);
          }
          if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1 py-1">
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => onChange(value.filter((v) => v !== tag))}
                className="opacity-60 transition-opacity hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {suggestions.filter((s) => !value.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {suggestions
            .filter((s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()))
            .slice(0, 12)
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
