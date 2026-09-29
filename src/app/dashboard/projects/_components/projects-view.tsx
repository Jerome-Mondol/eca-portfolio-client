"use client";

import { useState, type FormEvent } from "react";
import { PageHeader, AddButton } from "@/components/dashboard/page-header";
import { ListSkeleton } from "@/components/dashboard/list-parts";
import { FormShell } from "@/components/dashboard/form-shell";
import { useToast } from "@/components/ui/toast";
import { useResource } from "@/lib/store";
import { useCrudForm } from "@/lib/use-crud-form";
import { useDeleteResource } from "@/lib/use-delete-resource";
import { parseSkills, optional } from "@/lib/format";
import { listProjectsApi, createProjectApi, updateProjectApi, deleteProjectApi, type Project } from "@/lib/api";
import { ProjectForm } from "./project-form";
import { ProjectList } from "./project-list";
import { useProjectExtras } from "./use-project-extras";
import { legacyLinkFields } from "./project-links";

const EMPTY: Project[] = [];

const BLANK = { title: "", description: "", technologies: "" };
const toForm = (project: Project): Record<string, string> => ({
  title: project.title,
  description: project.description ?? "",
  technologies: (project.technologies ?? []).join(", "),
});

export function ProjectsView() {
  const { success, error: toastError } = useToast();
  const removeItem = useDeleteResource();
  // Synchronous read from the warmed store — no spinner on repeat visits.
  const { data, loading } = useResource<{ data: Project[] }>("projects", listProjectsApi);
  const projects = data?.data ?? EMPTY;
  const form = useCrudForm<Project>({ blank: BLANK, toForm });
  const extras = useProjectExtras();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const publicCount = projects.filter((project) => project.visibility !== "private").length;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.values.title.trim()) {
      toastError("Title required");
      return;
    }
    const editingIsPublic = !!form.editing && form.editing.visibility !== "private";
    if (extras.showOnPortfolio && !editingIsPublic && publicCount >= 5) {
      toastError("Portfolio limit reached", "You can show up to 5 projects. Hide another project first.");
      return;
    }

    const payload = {
      title: form.values.title.trim(),
      description: optional(form.values.description),
      technologies: parseSkills(form.values.technologies),
      coverImage: extras.coverImage || null,
      links: extras.links.length > 0 ? extras.links : null,
      featured: extras.featured,
      visibility: extras.showOnPortfolio ? "public" : "private",
      // Kept in sync so anything still reading the legacy fields sees them.
      ...legacyLinkFields(extras.links),
    };

    form.setSaving(true);
    try {
      // These API helpers write the new list straight into the store, so the
      // grid updates without a refetch.
      if (form.editing) {
        await updateProjectApi(form.editing.id, payload);
        success("Project updated");
      } else {
        await createProjectApi(payload);
        success("Project added");
      }
      extras.reset();
      form.close();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : String(err));
    } finally {
      form.setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    extras.load(project);
    form.startEdit(project);
  };

  const handleDelete = (project: Project) => {
    const title = project.title;
    setDeletingId(project.id);
    removeItem({
      title: "Delete Project",
      description: `Are you sure you want to delete ${title ? `"${title}"` : "this project"}? This action cannot be undone.`,
      run: () => deleteProjectApi(project.id),
    }).finally(() => setDeletingId(null));
  };

  if (loading) {
    return <ListSkeleton className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" height="h-64" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Builds that prove skills. Feature the best."
        action={<AddButton open={form.open} label="Add Project" onClick={form.toggle} />}
      />

      <FormShell
        open={form.open}
        saving={form.saving}
        onSubmit={handleSubmit}
        submitLabel={form.isEditing ? "Update project" : "Create project"}
        savingLabel={form.isEditing ? "Updating..." : "Creating..."}
      >
        <ProjectForm
          values={form.values}
          set={form.set}
          coverImage={extras.coverImage}
          onCoverImageChange={extras.setCoverImage}
          links={extras.links}
          onLinksChange={extras.setLinks}
          platform={extras.platform}
          onPlatformChange={extras.setPlatform}
          customName={extras.customName}
          onCustomNameChange={extras.setCustomName}
          url={extras.url}
          onUrlChange={extras.setUrl}
          verifying={extras.verifying}
          verifyResult={extras.verifyResult}
          onAddLink={extras.addLink}
          featured={extras.featured}
          onFeaturedChange={extras.setFeatured}
          showOnPortfolio={extras.showOnPortfolio}
          onShowOnPortfolioChange={extras.setShowOnPortfolio}
          publicCount={publicCount}
        />
      </FormShell>

      <ProjectList
        projects={projects}
        deletingId={deletingId}
        onAdd={form.startCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
