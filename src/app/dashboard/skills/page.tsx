"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { Select } from "@/components/ui/select";
import { listSkillsApi, createSkillApi, deleteSkillApi, type Skill } from "@/lib/api";

const categories = ["Technical", "Creative", "Leadership", "Communication", "Languages", "Other"] as const;

export default function SkillsPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Technical");

  const fetchList = async () => {
    try {
      const res = await listSkillsApi();
      setItems(res.data);
    } catch (e: any) {
      toastError("Failed to load skills", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toastError("Name required"); return; }
    try {
      const res = await createSkillApi({ name: name.trim(), category });
      setItems((v) => [res.data, ...v]);
      setName("");
      success("Skill added");
    } catch (err: any) {
      toastError("Add failed", err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkillApi(id);
      setItems((v) => v.filter((x) => x.id !== id));
      success("Deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    }
  };

  if (loading) return <Skeleton className="h-64" />;

  const grouped = categories.map((cat) => ({ cat, items: items.filter((s) => s.category === cat) }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Skills</h1>
          <p className="text-sm text-[#6b6b76]">Evidence, not percentages.</p>
        </div>
      </div>

      <Card className="p-5">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="React, Leadership..." className="mt-1.5" />
          </div>
          <div className="w-full sm:w-44">
            <Label>Category</Label>
            <div className="mt-1.5">
              <Select value={category} onChange={setCategory} options={[...categories]} />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto min-h-[44px] cursor-pointer">Add skill</Button>
        </form>
      </Card>

      {items.length === 0 ? (
        <EmptyState title="No skills yet" description="Add skills you’ve demonstrated." actionLabel="Add skill" />
      ) : (
        <div className="grid gap-4">
          {grouped
            .filter((g) => g.items.length > 0)
            .map((g) => (
              <Card key={g.cat} className="p-5">
                <h3 className="text-sm font-semibold">{g.cat}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <Badge key={s.id} className="cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-600" onClick={() => handleDelete(s.id)}>
                      {s.name} ✕
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          {grouped.every((g) => g.items.length === 0) && (
            <Card className="p-5 text-sm text-[#6b6b76]">No grouped skills — add one above.</Card>
          )}
        </div>
      )}
    </div>
  );
}
