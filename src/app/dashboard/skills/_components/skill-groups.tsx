import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { Skill } from "@/lib/api";
import { SKILL_CATEGORIES } from "./skill-form";

type SkillGroupsProps = {
  skills: Skill[];
  onDelete: (id: string) => void;
};

/** Skills bucketed by category, hiding categories with nothing in them. */
export function SkillGroups({ skills, onDelete }: SkillGroupsProps) {
  if (skills.length === 0) {
    return <EmptyState title="No skills yet" description="Add skills you’ve demonstrated." actionLabel="Add skill" />;
  }

  const groups = SKILL_CATEGORIES.map((cat) => ({ cat, items: skills.filter((s) => s.category === cat) })).filter((g) => g.items.length > 0);

  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <Card key={group.cat} className="p-5">
          <h3 className="text-sm font-semibold">{group.cat}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.items.map((skill) => (
              <Badge
                key={skill.id}
                className="cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                onClick={() => onDelete(skill.id)}
              >
                {skill.name} ✕
              </Badge>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
