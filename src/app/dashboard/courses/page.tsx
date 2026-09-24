"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { listCoursesApi, createCourseApi, updateCourseApi, deleteCourseApi, type Course } from "@/lib/api";

export default function CoursesPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [instructor, setInstructor] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const fetchList = async () => {
    try {
      const res = await listCoursesApi();
      setItems(res.data);
    } catch (e: any) {
      toastError("Failed to load courses", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const reset = () => { setName(""); setProvider(""); setInstructor(""); setDescription(""); setSkills(""); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toastError("Name required"); return; }
    const payload: any = { name: name.trim(), provider: provider.trim() || null, instructor: instructor.trim() || null, description: description.trim() || null, skills: skills.split(",").map((s) => s.trim()).filter(Boolean) };
    try {
      if (editing) {
        const res = await updateCourseApi(editing.id, payload);
        setItems((v) => v.map((x) => (x.id === editing.id ? res.data : x)));
        success("Course updated");
      } else {
        const res = await createCourseApi(payload);
        setItems((v) => [res.data, ...v]);
        success("Course added");
      }
      reset();
    } catch (err: any) {
      toastError("Save failed", err.message);
    }
  };

  const handleEdit = (c: Course) => {
    setEditing(c);
    setName(c.name);
    setProvider(c.provider ?? "");
    setInstructor(c.instructor ?? "");
    setDescription(c.description ?? "");
    setSkills((c.skills ?? []).join(", "));
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      await deleteCourseApi(id);
      setItems((v) => v.filter((x) => x.id !== id));
      success("Deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    }
  };

  if (loading) return <div className="grid gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Courses</h1>
          <p className="text-sm text-[#6b6b76]">Courses with skills and credentials.</p>
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
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What you learned" className="mt-1.5" />
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js" className="mt-1.5" />
            </div>
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">{editing ? "Update" : "Create"} course</Button>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState title="No courses yet" description="Add your courses to build your portfolio." actionLabel="Add course" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {items.map((c) => (
            <Card key={c.id} className="p-5">
              <h3 className="font-semibold text-sm">{c.name}</h3>
              <p className="text-xs text-[#6b6b76] mt-1">{[c.provider, c.instructor].filter(Boolean).join(" • ") || "—"}</p>
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
          ))}
        </div>
      )}
    </div>
  );
}
