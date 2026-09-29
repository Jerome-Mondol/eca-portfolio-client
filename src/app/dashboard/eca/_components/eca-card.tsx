import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemActions } from "@/components/dashboard/item-actions";
import { ImageSlider } from "@/components/ui/image-slider";
import { Image as ImageIcon } from "lucide-react";
import type { Activity } from "@/lib/api";

type EcaCardProps = {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
};

/** Photo strip, or a muted placeholder when the activity has no proof images. */
function ActivityImages({ images }: { images: string[] }) {
  if (images.length === 0) {
    return (
      <div className="h-24 bg-surface-2 border-b border-border flex items-center justify-center text-muted-foreground gap-2">
        <ImageIcon size={16} /> <span className="text-xs">No images</span>
      </div>
    );
  }
  return (
    <div className="p-3">
      <ImageSlider images={images} />
    </div>
  );
}

/** One ECA activity in the grid. */
export function EcaCard({ activity: a, onEdit, onDelete }: EcaCardProps) {
  const images = (a as { images?: string[] | null }).images ?? [];
  const byline = [a.role, a.organization].filter(Boolean).join(" • ");

  return (
    <Card className="overflow-hidden h-full">
      <ActivityImages images={images} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{a.category ?? "ECA"}</p>
            <h3 className="font-semibold text-sm mt-1 leading-tight">{a.activityName}</h3>
            {byline && <p className="text-xs text-muted mt-1">{byline}</p>}
          </div>
          <Badge>Public</Badge>
        </div>

        {a.description && <p className="text-sm text-muted-strong mt-3 leading-5">{a.description}</p>}

        {a.skills && a.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {a.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        )}

        <ItemActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </Card>
  );
}
