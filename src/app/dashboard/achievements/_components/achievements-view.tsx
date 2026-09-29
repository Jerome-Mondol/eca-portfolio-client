"use client";

import { useState, type FormEvent } from "react";
import { PageHeader, AddButton } from "@/components/dashboard/page-header";
import { ListSkeleton, ListOrEmpty } from "@/components/dashboard/list-parts";
import { FormShell } from "@/components/dashboard/form-shell";
import { useToast } from "@/components/ui/toast";
import { useResource } from "@/lib/store";
import { useCrudForm } from "@/lib/use-crud-form";
import { useDeleteResource } from "@/lib/use-delete-resource";
import { optional } from "@/lib/format";
import { listAchievementsApi, createAchievementApi, updateAchievementApi, deleteAchievementApi, type Achievement } from "@/lib/api";
import { AchievementForm } from "./achievement-form";
import { AchievementCard } from "./achievement-card";
import { DEFAULT_CATEGORY } from "./achievement-categories";
import { mirrorProofImages } from "./mirror-proof-images";

const EMPTY: Achievement[] = [];

const BLANK = { title: "", category: DEFAULT_CATEGORY, organization: "", date: "", description: "" };
const toForm = (achievement: Achievement): Record<string, string> => ({
  title: achievement.title,
  category: achievement.category ?? DEFAULT_CATEGORY,
  organization: achievement.organization ?? "",
  date: achievement.date ?? "",
  description: achievement.description ?? "",
});

export function AchievementsView() {
  const { success, error: toastError } = useToast();
  const removeItem = useDeleteResource();
  // Synchronous read from the warmed store — no spinner on repeat visits.
  const { data, loading } = useResource<{ data: Achievement[] }>("achievements", listAchievementsApi);
  const items = data?.data ?? EMPTY;
  const form = useCrudForm<Achievement>({ blank: BLANK, toForm });
  // Image list rather than a string field, so it sits outside the form values.
  const [images, setImages] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { values } = form;
    if (!values.title.trim()) {
      toastError("Title required");
      return;
    }

    const payload = {
      title: values.title.trim(),
      category: values.category.trim() || null,
      organization: optional(values.organization),
      date: values.date || null,
      description: optional(values.description),
      images: images.length > 0 ? images : null,
    };

    form.setSaving(true);
    try {
      // The API helpers write the new list straight into the store.
      if (form.editing) {
        await updateAchievementApi(form.editing.id, payload);
        success("Achievement updated");
      } else {
        await createAchievementApi(payload);
        success("Achievement added");
      }
      await mirrorProofImages(images, values.title.trim());
      setImages([]);
      form.close();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : String(err));
    } finally {
      form.setSaving(false);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setImages(achievement.images ?? []);
    form.startEdit(achievement);
  };

  const handleDelete = (achievement: Achievement) => {
    const title = achievement.title;
    setDeletingId(achievement.id);
    removeItem({
      title: "Delete Achievement",
      description: `Are you sure you want to delete ${title ? `"${title}"` : "this achievement"}?`,
      run: () => deleteAchievementApi(achievement.id),
    }).finally(() => setDeletingId(null));
  };

  if (loading) return <ListSkeleton height="h-64" count={1} />;

  return (
    <div className="space-y-6 max-w-[800px]">
      <PageHeader
        title="Achievements"
        description="Awards, competition wins, and recognition."
        action={<AddButton open={form.open} label="Add Achievement" onClick={form.toggle} />}
      />

      <FormShell
        open={form.open}
        saving={form.saving}
        onSubmit={handleSubmit}
        title={form.isEditing ? "Edit achievement" : "New achievement"}
        onCancel={form.close}
        submitLabel={form.isEditing ? "Update achievement" : "Save achievement"}
        savingLabel="Saving..."
      >
        <AchievementForm values={form.values} set={form.set} images={images} onImagesChange={setImages} />
      </FormShell>

      <ListOrEmpty
        items={items}
        gridClassName="space-y-3"
        empty={{
          title: "No achievements yet",
          description: "Add competition wins, awards, scholarships, or recognition.",
          actionLabel: "Add achievement",
          onAction: form.startCreate,
        }}
      >
        {(achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            deleting={deletingId === achievement.id}
            onEdit={() => handleEdit(achievement)}
            onDelete={() => handleDelete(achievement)}
          />
        )}
      </ListOrEmpty>
    </div>
  );
}
