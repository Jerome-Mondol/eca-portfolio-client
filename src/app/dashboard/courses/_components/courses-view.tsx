"use client";

import type { FormEvent } from "react";
import { PageHeader, AddButton } from "@/components/dashboard/page-header";
import { ListSkeleton, ListOrEmpty } from "@/components/dashboard/list-parts";
import { FormShell } from "@/components/dashboard/form-shell";
import { useToast } from "@/components/ui/toast";
import { useResource } from "@/lib/store";
import { useCrudForm } from "@/lib/use-crud-form";
import { useDeleteResource } from "@/lib/use-delete-resource";
import { parseSkills, optional } from "@/lib/format";
import {
  listCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  listCertificatesApi,
  type Course,
  type Certificate,
} from "@/lib/api";
import { CourseForm, linkedCertificate } from "./course-form";
import { CourseCard } from "./course-card";

const EMPTY_COURSES: Course[] = [];
const EMPTY_CERTS: Certificate[] = [];

// Module-level so the form callbacks keep a stable identity across renders.
const BLANK = { name: "", provider: "", instructor: "", description: "", skills: "", startDate: "", completionDate: "", certificateId: "" };
const toForm = (c: Course): Record<string, string> => ({
  name: c.name,
  provider: c.provider ?? "",
  instructor: c.instructor ?? "",
  description: c.description ?? "",
  skills: (c.skills ?? []).join(", "),
  startDate: (c as { startDate?: string | null }).startDate ?? "",
  completionDate: (c as { completionDate?: string | null }).completionDate ?? "",
  certificateId: (c as { certificateId?: string | null }).certificateId ?? "",
});

export function CoursesView() {
  const { success, error: toastError } = useToast();
  const removeItem = useDeleteResource();
  // Two synchronous store reads — both are warmed on shell mount.
  const { data: coursesData, loading } = useResource<{ data: Course[] }>("courses", listCoursesApi);
  const { data: certsData } = useResource<{ data: Certificate[] }>("certificates", listCertificatesApi);
  const items = coursesData?.data ?? EMPTY_COURSES;
  const certificates = certsData?.data ?? EMPTY_CERTS;
  const form = useCrudForm<Course>({ blank: BLANK, toForm });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { values } = form;
    if (!values.name.trim()) {
      toastError("Name required");
      return;
    }
    form.setSaving(true);
    try {
      const payload = {
        name: values.name.trim(),
        provider: optional(values.provider),
        instructor: optional(values.instructor),
        description: optional(values.description),
        skills: parseSkills(values.skills),
        startDate: values.startDate || null,
        completionDate: values.completionDate || null,
        certificateId: values.certificateId || null,
      };
      // The API helpers write the new list straight into the store.
      if (form.editing) {
        await updateCourseApi(form.editing.id, payload);
        success("Course updated");
      } else {
        await createCourseApi(payload);
        success("Course added");
      }
      form.close();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : String(err));
    } finally {
      form.setSaving(false);
    }
  };

  const handleDelete = (course: Course) =>
    removeItem({
      title: "Delete Course",
      description: "Are you sure you want to delete this course?",
      run: () => deleteCourseApi(course.id),
    });

  if (loading) return <ListSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Learned skills — link a certificate for proof."
        action={<AddButton open={form.open} label="Add Course" onClick={form.toggle} />}
      />

      <FormShell
        open={form.open}
        saving={form.saving}
        onSubmit={handleSubmit}
        submitLabel={form.isEditing ? "Update course" : "Create course"}
        savingLabel={form.isEditing ? "Updating..." : "Creating..."}
      >
        <CourseForm values={form.values} set={form.set} certificates={certificates} />
      </FormShell>

      <ListOrEmpty
        items={items}
        gridClassName="grid lg:grid-cols-2 gap-4"
        empty={{
          title: "No courses yet",
          description: "Add your courses to build your portfolio.",
          actionLabel: "Add course",
          onAction: form.startCreate,
        }}
      >
        {(course) => (
          <CourseCard
            key={course.id}
            course={course}
            linked={linkedCertificate(course, certificates)}
            onEdit={() => form.startEdit(course)}
            onDelete={() => handleDelete(course)}
          />
        )}
      </ListOrEmpty>
    </div>
  );
}
