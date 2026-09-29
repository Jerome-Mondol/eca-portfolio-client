import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import type { Achievement } from "@/lib/api";
import { ACHIEVEMENT_CATEGORIES } from "./achievement-categories";

type AchievementCardProps = {
  achievement: Achievement;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

/** `Host • Mar 2026` — either part may be missing. */
function byline(achievement: Achievement): string {
  const month = achievement.date
    ? new Date(`${achievement.date}T12:00:00`).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
    : null;
  return [achievement.organization, month].filter(Boolean).join(" • ");
}

export function AchievementCard({ achievement, deleting, onEdit, onDelete }: AchievementCardProps) {
  const category = ACHIEVEMENT_CATEGORIES.find((c) => c.value === achievement.category);
  const images = achievement.images ?? [];
  const line = byline(achievement);

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {images.length > 0 && (
          <div className="sm:w-[160px] md:w-[200px] shrink-0 bg-surface-2">
            <div className="relative w-full h-[160px] sm:h-full">
              <img src={images[0]} alt={achievement.title} className="w-full h-full object-cover" />
              {images.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                  +{images.length - 1} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 p-5 flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm sm:text-[15px]">{achievement.title}</h3>
                {achievement.category && (
                  <Badge className="text-xs gap-1">
                    {category?.icon}
                    {achievement.category}
                  </Badge>
                )}
              </div>
              {line && <p className="text-xs text-muted">{line}</p>}
              {achievement.description && (
                <p className="text-sm text-muted-strong leading-5 pt-1 line-clamp-3">{achievement.description}</p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onEdit}
                className="text-xs border border-border rounded-full px-3 py-1.5 cursor-pointer hover:bg-surface-2 min-h-[36px]"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                disabled={deleting}
                className="text-xs border border-red-200 text-red-600 rounded-full px-3 py-1.5 cursor-pointer hover:bg-red-50 min-h-[36px] flex items-center gap-1 disabled:opacity-50"
              >
                {deleting && <Loader2 size={11} className="animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
