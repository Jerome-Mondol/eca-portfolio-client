import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { Loader2 } from "lucide-react";
import type { Experience } from "@/lib/api";
import { EXPERIENCE_CATEGORIES } from "./experience-categories";

type ExperienceCardProps = {
  experience: Experience;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

/** `12 Aug 2026 — Present` / `12 Aug 2026 — 01 Jan 2027` / start only. */
function dateRange(experience: Experience): string {
  const start = formatDate(experience.startDate);
  const end = experience.endDate ? formatDate(experience.endDate) : experience.current ? "Present" : "";
  if (!start && !end) return "";
  if (!end) return start;
  return `${start} — ${end}`;
}

function ExperienceRow({ experience: ex, deleting, onEdit, onDelete }: ExperienceCardProps) {
  const category = EXPERIENCE_CATEGORIES.find((c) => c.value === ex.category);
  const byline = [ex.organization, ex.location].filter(Boolean).join(" • ") || "—";
  const range = dateRange(ex);

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm">{ex.position}</h3>
            {ex.category && (
              <Badge variant="outline" className="text-xs py-0.5 px-2 font-normal flex items-center gap-1 text-muted-strong bg-surface-2">
                {category?.icon}
                {ex.category}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted mt-0.5">{byline}</p>
          {range && (
            <p className="text-xs text-muted-foreground mt-1">
              {range}
              {ex.current && (
                <span className="ml-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">Current</span>
              )}
            </p>
          )}
        </div>
        <Badge>{ex.visibility ?? "public"}</Badge>
      </div>

      {ex.description && <p className="text-sm text-muted-strong mt-2">{ex.description}</p>}

      {ex.skills && ex.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {ex.skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button onClick={onEdit} className="text-xs font-medium border border-border rounded-full px-3 py-2 hover:bg-surface-2 cursor-pointer flex-1 min-h-[36px]">
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-2 hover:bg-red-50 cursor-pointer flex-1 min-h-[36px] flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {deleting && <Loader2 size={12} className="animate-spin" />} Delete
        </button>
      </div>
    </Card>
  );
}

export { ExperienceRow as ExperienceCard };
