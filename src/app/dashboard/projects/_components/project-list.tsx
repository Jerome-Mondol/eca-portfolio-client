import { ListOrEmpty } from "@/components/dashboard/list-parts";
import type { Project } from "@/lib/api";
import { ProjectCard } from "./project-card";

type ProjectListProps = {
  projects: Project[];
  deletingId: string | null;
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

/** The project grid, or the empty state when there is nothing to show. */
export function ProjectList({ projects, deletingId, onAdd, onEdit, onDelete }: ProjectListProps) {
  return (
    <ListOrEmpty
      items={projects}
      gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      empty={{
        title: "No projects yet",
        description: "Your projects are a great way to show what you can actually build.",
        actionLabel: "Add your first project",
        onAction: onAdd,
      }}
    >
      {(project) => (
        <ProjectCard
          key={project.id}
          project={project}
          deleting={deletingId === project.id}
          onEdit={() => onEdit(project)}
          onDelete={() => onDelete(project)}
        />
      )}
    </ListOrEmpty>
  );
}
