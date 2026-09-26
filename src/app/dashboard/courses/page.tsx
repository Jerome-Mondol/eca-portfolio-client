"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { Select, SelectOption } from "@/components/ui/select";
import { listCoursesApi, createCourseApi, updateCourseApi, deleteCourseApi, listCertificatesApi, type Course, type Certificate } from "@/lib/api";
import { useResource } from "@/lib/store";
import { Loader2 } from "lucide-react";

// Split out of the page chunk — only fetched when the form is actually opened.
const DatePicker = dynamic(() => import("@/components/ui/date-picker").then((m) => m.DatePicker), {
  ssr: false,
  loading: () => <Skeleton className="h-[42px] w-full mt-1.5" />,
});

const EMPTY_COURSES: Course[] = [];
const EMPTY_CERTS: Certificate[] = [];

export default function CoursesPage() {
  const { success, error: toastError } = useToast();
  const { confirm: confirmModal } = useConfirm();
  // Two synchronous store reads — both are warmed on shell mount.
  const { data: coursesData, loading } = useResource<{ data: Course[] }>("courses", listCoursesApi);
  const { data: certsData } = useResource<{ data: Certificate[] }>("certificates", listCertificatesApi);
  const items = coursesData?.data ?? EMPTY_COURSES;
  const certificates = certsData?.data ?? EMPTY_CERTS;
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [startDate, setStartDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [linkedCertId, setLinkedCertId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const reset = () => { setName(""); setProvider(""); setInstructor(""); setDescription(""); setSkills(""); setStartDate(""); setCompletionDate(""); setLinkedCertId(""); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toastError("Name required"); return; }
    setSaving(true);
    const payload: any = {
      name: name.trim(),
      provider: provider.trim() || null,
      instructor: instructor.trim() || null,
      description: description.trim() || null,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      startDate: startDate || null,
      completionDate: completionDate || null,
      certificateId: linkedCertId || null,
    };
    try {
      // The API helpers write the new list straight into the store.
      if (editing) {
        await updateCourseApi(editing.id, payload);
        success("Course updated");
      } else {
        await createCourseApi(payload);
        success("Course added");
      }
      reset();
    } catch (err: any) {
      toastError("Save failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: Course) => {
    setEditing(c);
    setName(c.name);
    setProvider(c.provider ?? "");
    setInstructor(c.instructor ?? "");
    setDescription(c.description ?? "");
    setSkills((c.skills ?? []).join(", "));
    setStartDate((c as any).startDate ?? "");
    setCompletionDate((c as any).completionDate ?? "");
    setLinkedCertId((c as any).certificateId ?? "");
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    const isConfirmed = await confirmModal({
      title: "Delete Course",
      description: "Are you sure you want to delete this course?",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!isConfirmed) return;
    try {
      await deleteCourseApi(id);
      success("Deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    }
  };

  const getLinkedCert = (id?: string | null) => certificates.find((c) => c.id === id);

  if (loading) return <div className="grid gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Courses</h1>
          <p className="text-sm text-[#6b6b76]">Learned skills — link a certificate for proof.</p>
        </div>
        <Button onClick={() => (showForm ? reset() : setShowForm(true))} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {showForm ? "Cancel" : "＋ Add Course"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Stack Web Development" className="mt-1.5" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Provider</Label>
                <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Programming Hero" className="mt-1.5" />
              </div>
              <div>
                <Label>Instructor</Label>
                <Input value={instructor} onChange={(e) => setInstructor(e.target.value)} placeholder="Jhankar Mahbub" className="mt-1.5" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <DatePicker value={startDate} onChange={setStartDate} label="Start date" placeholder="Pick start" />
              <DatePicker value={completionDate} onChange={setCompletionDate} label="Completion date" placeholder="Pick completion" />
            </div>
            <div>
              <Label>Link certificate (optional)</Label>
              <div className="mt-1.5">
                <Select
                  value={linkedCertId}
                  onChange={setLinkedCertId}
                  options={[
                    { value: "", label: "No certificate linked" },
                    ...certificates.map((c) => ({
                      value: c.id,
                      label: `${c.name}${c.organization ? ` • ${c.organization}` : ""}`,
                    })),
                  ]}
                  placeholder="Select a certificate"
                />
              </div>
              <p className="text-xs text-[#8a8a94] mt-1">Select a certificate to prove this course. You can link later.</p>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What you learned" className="mt-1.5" />
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js" className="mt-1.5" />
            </div>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto cursor-pointer min-h-[44px]">
              {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {saving ? (editing ? "Updating..." : "Creating...") : editing ? "Update course" : "Create course"}
            </Button>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState title="No courses yet" description="Add your courses to build your portfolio." actionLabel="Add course" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {items.map((c) => {
            const linked = getLinkedCert((c as any).certificateId);
            return (
              <Card key={c.id} className="p-5">
                <h3 className="font-semibold text-sm">{c.name}</h3>
                <p className="text-xs text-[#6b6b76] mt-1">{[c.provider, c.instructor].filter(Boolean).join(" • ") || "—"}</p>
                {(c as any).completionDate && <p className="text-xs text-[#8a8a94] mt-1">Completed {new Date((c as any).completionDate + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>}
                {linked && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] rounded-full px-2.5 py-1">
                    <span>🔗 Linked:</span> <span className="font-medium">{linked.name}</span>
                  </div>
                )}
                {c.description && <p className="text-sm text-[#4a4a52] mt-2">{c.description}</p>}
                {c.skills && c.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {c.skills.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleEdit(c)} className="text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer flex-1">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex-1">Delete</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
