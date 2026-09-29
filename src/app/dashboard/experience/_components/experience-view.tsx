"use client";

import { useState, type FormEvent } from "react";
import { PageHeader, AddButton } from "@/components/dashboard/page-header";
import { ListSkeleton, ListOrEmpty } from "@/components/dashboard/list-parts";
import { FormShell } from "@/components/dashboard/form-shell";
import { useToast } from "@/components/ui/toast";
import { useResource } from "@/lib/store";
import { useCrudForm } from "@/lib/use-crud-form";
import { useDeleteResource } from "@/lib/use-delete-resource";
import { parseSkills, optional } from "@/lib/format";
import { listExperiencesApi, createExperienceApi, updateExperienceApi, deleteExperienceApi, type Experience } from "@/lib/api";
import { ExperienceForm } from "./experience-form";
import { ExperienceCard } from "./experience-card";
import { DEFAULT_CATEGORY } from "./experience-categories";

const EMPTY: Experience[] = [];

const BLANK = {
  position: "",
  category: DEFAULT_CATEGORY,
  organization: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  skills: "",
};
const toForm = (ex: Experience): Record<string, string> => ({
  position: ex.position,
  category: ex.category || DEFAULT_CATEGORY,
  organization: ex.organization ?? "",
  location: ex.location ?? "",
  startDate: ex.startDate ?? "",
  endDate: ex.endDate ?? "",
  description: ex.description ?? "",
  skills: (ex.skills ?? []).join(", "),
});

export function ExperienceView() {
  const { success, error: toastError } = useToast();
  const removeItem = useDeleteResource();
  // Synchronous read from the warmed store — no skeleton on repeat visits.
  const { data, loading } = useResource<{ data: Experience[] }>("experiences", listExperiencesApi);
  const items = data?.data ?? EMPTY;
  const form = useCrudForm<Experience>({ blank: BLANK, toForm });
  // A checkbox rather than a text field, so it sits outside the form values.
  const [current, setCurrent] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { values } = form;
    if (!values.position.trim()) {
      toastError("Position title required");
      return;
    }
    form.setSaving(true);
    try {
      const payload = {
        position: values.position.trim(),
        category: values.category || DEFAULT_CATEGORY,
        organization: optional(values.organization),
        location: optional(values.location),
        startDate: values.startDate || null,
        // An ongoing role has no end date, whatever the field says.
        endDate: current ? null : values.endDate || null,
        current,
        description: optional(values.description),
        skills: parseSkills(values.skills),
      };
      // The API helpers write the new list straight into the store.
      if (form.editing) {
        await updateExperienceApi(form.editing.id, payload);
        success("Experience updated");
      } else {
        await createExperienceApi(payload);
        success("Experience added");
      }
      setCurrent(false);
      form.close();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : String(err));
    } finally {
      form.setSaving(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setCurrent(!!experience.current);
    form.startEdit(experience);
  };

  const handleDelete = (experience: Experience) => {
    const title = experience.position;
    setDeletingId(experience.id);
    removeItem({
      title: "Delete Experience",
      description: `Are you sure you want to delete ${title ? `"${title}"` : "this experience"}?`,
      run: () => deleteExperienceApi(experience.id),
    }).finally(() => setDeletingId(null));
  };

  if (loading) return <ListSkeleton className="space-y-3" />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Experience"
        description="Timeline of your work, projects, workshops & activities."
        action={<AddButton open={form.open} label="Add Experience" onClick={form.toggle} />}
      />

      <FormShell
        open={form.open}
        saving={form.saving}
        onSubmit={handleSubmit}
        submitLabel={form.isEditing ? "Update experience" : "Create experience"}
        savingLabel={form.isEditing ? "Updating..." : "Creating..."}
      >
        <ExperienceForm values={form.values} set={form.set} current={current} onToggleCurrent={setCurrent} />
      </FormShell>

      <ListOrEmpty
        items={items}
        gridClassName="space-y-3"
        empty={{
          title: "No experience yet",
          description: "Add your jobs, internships, bootcamps, workshops, or art/creative projects.",
          actionLabel: "Add experience",
          onAction: form.startCreate,
        }}
      >
        {(experience) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            deleting={deletingId === experience.id}
            onEdit={() => handleEdit(experience)}
            onDelete={() => handleDelete(experience)}
          />
        )}
      </ListOrEmpty>
    </div>
  );
}
