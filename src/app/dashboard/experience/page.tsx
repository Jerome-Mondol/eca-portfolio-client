"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { listExperiencesApi, createExperienceApi, updateExperienceApi, deleteExperienceApi, type Experience } from "@/lib/api";

export default function ExperiencePage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [position, setPosition] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");

  const fetchList = async () => {
    try {
      const res = await listExperiencesApi();
      setItems(res.data);
    } catch (e: any) {
      toastError("Failed to load experiences", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const reset = () => { setPosition(""); setOrganization(""); setLocation(""); setStartDate(""); setEndDate(""); setCurrent(false); setDescription(""); setSkills(""); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position.trim()) { toastError("Position required"); return; }
    const payload: any = {
      position: position.trim(),
      organization: organization.trim() || null,
      location: location.trim() || null,
      startDate: startDate || null,
      endDate: current ? null : (endDate || null),
      current,
      description: description.trim() || null,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        const res = await updateExperienceApi(editing.id, payload);
        setItems((v) => v.map((x) => (x.id === editing.id ? res.data : x)));
        success("Experience updated");
      } else {
        const res = await createExperienceApi(payload);
        setItems((v) => [res.data, ...v]);
        success("Experience added");
      }
      reset();
    } catch (err: any) {
      toastError("Save failed", err.message);
    }
  };

  const handleEdit = (ex: Experience) => {
    setEditing(ex);
    setPosition(ex.position);
    setOrganization(ex.organization ?? "");
    setLocation(ex.location ?? "");
    setStartDate(ex.startDate ?? "");
    setEndDate(ex.endDate ?? "");
    setCurrent(!!ex.current);
    setDescription(ex.description ?? "");
    setSkills((ex.skills ?? []).join(", "));
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      await deleteExperienceApi(id);
      setItems((v) => v.filter((x) => x.id !== id));
      success("Deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    }
  };

  if (loading) return <div className="space-y-3"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Experience</h1>
          <p className="text-sm text-[#6b6b76]">Timeline of work and leadership.</p>
        </div>
        <Button onClick={() => (showForm ? reset() : setShowForm(true))} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {showForm ? "Cancel" : "＋ Add Experience"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Position *</Label>
              <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Frontend Intern" className="mt-1.5" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Organization</Label>
                <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="ABC Tech" className="mt-1.5" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dhaka, Remote" className="mt-1.5" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <Label>Start</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>End</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} disabled={current} className="mt-1.5" />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={current} onChange={(e) => setCurrent(e.target.checked)} className="h-4 w-4" /> Current
                </label>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What you did" className="mt-1.5" />
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Leadership" className="mt-1.5" />
            </div>
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">{editing ? "Update" : "Create"} experience</Button>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState title="No experience yet" description="Add internships, leadership, or work." actionLabel="Add experience" onAction={() => setShowForm(true)} />
      ) : (
        <div className="space-y-3">
          {items.map((ex) => (
            <Card key={ex.id} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sm">{ex.position}</h3>
                  <p className="text-sm text-[#6b6b76]">{[ex.organization, ex.location].filter(Boolean).join(" • ") || "—"}</p>
                  <p className="text-xs text-[#8a8a94] mt-1">{ex.startDate ?? ""} {ex.endDate ? `— ${ex.endDate}` : ex.current ? "— Present" : ""} {ex.current && <span className="ml-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">Current</span>}</p>
                </div>
                <Badge>{ex.visibility ?? "public"}</Badge>
              </div>
              {ex.description && <p className="text-sm text-[#4a4a52] mt-2">{ex.description}</p>}
              {ex.skills && ex.skills.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{ex.skills.map((s) => <Badge key={s}>{s}</Badge>)}</div>}
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleEdit(ex)} className="text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer flex-1">Edit</button>
                <button onClick={() => handleDelete(ex.id)} className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex-1">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
