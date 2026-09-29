import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/upload";
import { Code2, Globe, Loader2 } from "lucide-react";
import type { Project } from "@/lib/api";
import { platformIcon, absoluteUrl, type ProjectLink } from "./project-links";

type ProjectCardProps = {
  project: Project;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

/**
 * Links list when present, otherwise the legacy `githubUrl` / `liveUrl` pair.
 *
 * Records saved before the universal links field only have the legacy fields.
 */
function ProjectLinkRow({ project }: { project: Project }) {
  const links = (project.links ?? []) as ProjectLink[];
  if (links.length > 0) {
    return (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {links.map((link, index) => (
          <a
            key={index}
            href={absoluteUrl(link.url)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-1.5 hover:bg-surface-2 cursor-pointer bg-card"
          >
            {platformIcon(link.platform, 12)} {link.platform}
          </a>
        ))}
      </div>
    );
  }
  if (!project.githubUrl && !project.liveUrl) return null;

  return (
    <div className="mt-3 flex gap-2 flex-wrap">
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs border border-border rounded-full px-3 py-1.5 hover:bg-surface-2 cursor-pointer inline-flex items-center gap-1">
          <Code2 size={12} /> GitHub
        </a>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-xs bg-primary-strong text-white rounded-full px-3 py-1.5 cursor-pointer inline-flex items-center gap-1">
          <Globe size={12} /> Live
        </a>
      )}
    </div>
  );
}

export function ProjectCard({ project, deleting, onEdit, onDelete }: ProjectCardProps) {
  const technologies = project.technologies ?? [];

  return (
    <Card className="overflow-hidden flex flex-col">
      {project.coverImage && <img src={getImageUrl(project.coverImage)} alt={project.title} className="h-36 w-full object-cover" />}
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight">{project.title}</h3>
          {project.featured && <Badge className="bg-primary-strong text-white shrink-0">Featured</Badge>}
          {project.visibility === "private" && <Badge variant="secondary" className="shrink-0">Hidden</Badge>}
        </div>
        <p className="text-sm text-muted mt-1 line-clamp-2">{project.description ?? "—"}</p>
        {technologies.length > 0 && (
          <p className="text-xs text-muted mt-3">
            <span className="font-medium text-foreground">Things used:</span> {technologies.join(" / ")}
          </p>
        )}
        <ProjectLinkRow project={project} />
      </div>
      <div className="p-3 border-t border-border-soft flex gap-2">
        <button onClick={onEdit} className="text-xs font-medium border border-border rounded-full px-3 py-1.5 hover:bg-surface-2 cursor-pointer flex-1 min-h-[36px]">
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex-1 min-h-[36px] flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {deleting && <Loader2 size={12} className="animate-spin" />} Delete
        </button>
      </div>
    </Card>
  );
}
