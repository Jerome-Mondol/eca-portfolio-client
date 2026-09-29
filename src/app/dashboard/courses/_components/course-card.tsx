import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemActions } from "@/components/dashboard/item-actions";
import { formatDate } from "@/lib/format";
import type { Course, Certificate } from "@/lib/api";

type CourseCardProps = {
  course: Course;
  linked?: Certificate;
  onEdit: () => void;
  onDelete: () => void;
};

/** One course in the grid, with its linked-certificate proof badge. */
export function CourseCard({ course, linked, onEdit, onDelete }: CourseCardProps) {
  const providerLine = [course.provider, course.instructor].filter(Boolean).join(" • ") || "—";
  const completedAt = formatDate((course as { completionDate?: string | null }).completionDate);

  return (
    <Card className="p-5 h-full">
      <h3 className="font-semibold text-sm">{course.name}</h3>
      <p className="text-xs text-muted mt-1">{providerLine}</p>

      {completedAt && <p className="text-xs text-muted-foreground mt-1">Completed {completedAt}</p>}

      {linked && (
        <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-success-soft border border-success-border text-success rounded-full px-2.5 py-1">
          <span>🔗 Linked:</span> <span className="font-medium">{linked.name}</span>
        </div>
      )}

      {course.description && <p className="text-sm text-muted-strong mt-2">{course.description}</p>}

      {course.skills && course.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {course.skills.map((skill) => (
            <Badge key={skill}>{skill}</Badge>
          ))}
        </div>
      )}

      <ItemActions onEdit={onEdit} onDelete={onDelete} />
    </Card>
  );
}
