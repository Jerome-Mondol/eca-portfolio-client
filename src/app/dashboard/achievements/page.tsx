"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { listAchievementsApi, createAchievementApi, updateAchievementApi, deleteAchievementApi, type Achievement } from "@/lib/api";

export default function AchievementsPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const fetchList = async () => {
    try {
      const res = await listAchievementsApi();
      setItems(res.data);
    } catch (e: any) {
      toastError("Failed to load", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const reset = () => { setTitle(""); setCategory(""); setOrganization(""); setDate(""); setDescription(""); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toastError("Title required"); return; }
    const payload: any = { title: title.trim(), category: category.trim() || null, organization: organization.trim() || null, date: date || null, description: description.trim() || null };
    try {
      if (editing) {
        const res = await updateAchievementApi(editing.id, payload);
        setItems((v) => v.map((x) => (x.id === editing.id ? res.data : x)));
        success("Updated");
      } else {
        const res = await createAchievementApi(payload);
        setItems((v) => [res.data, ...v]);
        success("Added");
      }
      reset();
    } catch (err: any) {
      toastError("Save failed", err.message);
    }
  };

  const handleEdit = (a: Achievement) => {
    setEditing(a);
    setTitle(a.title);
    setCategory(a.category ?? "");
    setOrganization(a.organization ?? "");
    setDate(a.date ?? "");
    setDescription(a.description ?? "");
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      await deleteAchievementApi(id);
      setItems((v) => v.filter((x) => x.id !== id));
      success("Deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    }
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Achievements</h1>
          <p className="text-sm text-[#6b6b76]">Awards and recognition.</p>
        </div>
        <Button onClick={() => (showForm ? reset() : setShowForm(true))} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {showForm ? "Cancel" : "＋ Add Achievement"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="National Hackathon Winner" className="mt-1.5" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Competition" className="mt-1.5" />
              </div>
              <div>
                <Label>Organization</Label>
                <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="XYZ Uni" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details" className="mt-1.5" />
            </div>
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">{editing ? "Update" : "Create"} achievement</Button>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState title="No achievements yet" description="Add competition wins, awards." actionLabel="Add achievement" onAction={() => setShowForm(true)} />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a.id} className="p-4 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm">{a.title}</h3>
                <p className="text-xs text-[#6b6b76]">{[a.category, a.organization, a.date].filter(Boolean).join(" • ")}</p>
                {a.description && <p className="text-sm text-[#4a4a52] mt-1">{a.description}</p>}
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button onClick={() => handleEdit(a)} className="text-xs border border-[#e8e8ea] rounded-full px-3 py-1.5 cursor-pointer">Edit</button>
                <button onClick={() => handleDelete(a.id)} className="text-xs border border-red-200 text-red-600 rounded-full px-3 py-1.5 cursor-pointer">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
