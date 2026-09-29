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
import { listActivitiesApi, createActivityApi, updateActivityApi, deleteActivityApi, type Activity } from "@/lib/api";
import { EcaForm } from "./eca-form";
import { EcaCard } from "./eca-card";

const EMPTY: Activity[] = [];
const MAX_IMAGES = 5;

const BLANK = { activityName: "", category: "", organization: "", role: "", description: "", skills: "" };
const toForm = (a: Activity): Record<string, string> => ({
  activityName: a.activityName,
  category: a.category ?? "",
  organization: a.organization ?? "",
  role: a.role ?? "",
  description: a.description ?? "",
  skills: (a.skills ?? []).join(", "),
});

export function EcaView() {
  const { success, error: toastError } = useToast();
  const removeItem = useDeleteResource();
  // Synchronous read from the warmed store — no skeleton on repeat visits.
  const { data, loading } = useResource<{ data: Activity[] }>("activities", listActivitiesApi);
  const items = data?.data ?? EMPTY;
  const form = useCrudForm<Activity>({ blank: BLANK, toForm });
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { values } = form;
    if (!values.activityName.trim()) {
      toastError("Activity name required");
      return;
    }
    form.setSaving(true);
    try {
      const payload = {
        activityName: values.activityName.trim(),
        category: optional(values.category),
        organization: optional(values.organization),
        role: optional(values.role),
        description: optional(values.description),
        skills: parseSkills(values.skills),
        images: images.length > 0 ? images : null,
      };
      // The API helpers write the new list straight into the store.
      if (form.editing) {
        await updateActivityApi(form.editing.id, payload);
        success("ECA updated");
      } else {
        await createActivityApi(payload);
        success("ECA added");
      }
      setImages([]);
      form.close();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : String(err));
    } finally {
      form.setSaving(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setImages((activity as { images?: string[] | null }).images ?? []);
    form.startEdit(activity);
  };

  const handleDelete = (activity: Activity) =>
    removeItem({
      title: "Delete Activity",
      description: "Are you sure you want to delete this ECA activity?",
      run: () => deleteActivityApi(activity.id),
    });

  if (loading) return <ListSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="ECA & Activities"
        description="Personality beyond grades — up to 5 images."
        action={<AddButton open={form.open} label="Add Activity" onClick={form.toggle} />}
      />

      <FormShell
        open={form.open}
        saving={form.saving}
        onSubmit={handleSubmit}
        submitLabel={form.isEditing ? "Update activity" : "Create activity"}
        savingLabel={form.isEditing ? "Updating..." : "Creating..."}
      >
        <EcaForm
          values={form.values}
          set={form.set}
          images={images}
          onAddImages={(urls) => setImages((prev) => [...prev, ...urls].slice(0, MAX_IMAGES))}
          onRemoveImage={(index) => setImages((prev) => prev.filter((_, i) => i !== index))}
        />
      </FormShell>

      <ListOrEmpty
        items={items}
        gridClassName="grid lg:grid-cols-2 gap-4"
        empty={{
          title: "No activities yet",
          description: "Add your ECA to showcase personality.",
          actionLabel: "Add activity",
          onAction: form.startCreate,
        }}
      >
        {(activity) => (
          <EcaCard
            key={activity.id}
            activity={activity}
            onEdit={() => handleEdit(activity)}
            onDelete={() => handleDelete(activity)}
          />
        )}
      </ListOrEmpty>
    </div>
  );
}
