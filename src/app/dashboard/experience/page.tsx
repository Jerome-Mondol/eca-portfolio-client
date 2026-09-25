"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectOption } from "@/components/ui/select";
import { listExperiencesApi, createExperienceApi, updateExperienceApi, deleteExperienceApi, type Experience } from "@/lib/api";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { Briefcase, GraduationCap, BookOpen, Sparkles, Palette, Users, HeartHandshake, Loader2, Plus, Pencil, Trash2 } from "lucide-react";

const EXPERIENCE_CATEGORIES: SelectOption[] = [
  { value: "Job / Work Experience", label: "Job / Work Experience", icon: <Briefcase size={16} /> },
  { value: "Internship", label: "Internship", icon: <GraduationCap size={16} /> },
  { value: "Bootcamp / Training", label: "Bootcamp / Training", icon: <BookOpen size={16} /> },
  { value: "Workshop / Seminar", label: "Workshop / Seminar", icon: <Sparkles size={16} /> },
  { value: "Creative & Arts / Project", label: "Creative & Arts / Project", icon: <Palette size={16} /> },
  { value: "Club / Student Org Leadership", label: "Club / Student Org Leadership", icon: <Users size={16} /> },
  { value: "Volunteering & Community", label: "Volunteering & Community", icon: <HeartHandshake size={16} /> },
];

export default function ExperiencePage() {
  const { success, error: toastError } = useToast();
  const { confirm: confirmModal } = useConfirm();
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [position, setPosition] = useState("");
  const [category, setCategory] = useState("Job / Work Experience");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const reset = () => {
    setPosition("");
    setCategory("Job / Work Experience");
    setOrganization("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setCurrent(false);
    setDescription("");
    setSkills("");
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position.trim()) { toastError("Position title required"); return; }
    setSaving(true);
    const payload: any = {
      position: position.trim(),
      category: category || "Job / Work Experience",
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
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ex: Experience) => {
    setEditing(ex);
    setPosition(ex.position);
    setCategory(ex.category || "Job / Work Experience");
    setOrganization(ex.organization ?? "");
    setLocation(ex.location ?? "");
    setStartDate(ex.startDate ?? "");
    setEndDate(ex.endDate ?? "");
    setCurrent(!!ex.current);
    setDescription(ex.description ?? "");
    setSkills((ex.skills ?? []).join(", "));
    setShowForm(true);
  };
  const handleDelete = async (id: string, itemTitle?: string) => {
    const isConfirmed = await confirmModal({
      title: "Delete Experience",
      description: `Are you sure you want to delete ${itemTitle ? `"${itemTitle}"` : "this experience"}?`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!isConfirmed) return;
    setDeletingId(id);
    try {
      await deleteExperienceApi(id);
      setItems((v) => v.filter((x) => x.id !== id));
      success("Deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="space-y-3"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Experience</h1>
          <p className="text-sm text-[#6b6b76]">Timeline of your work, projects, workshops & activities.</p>
        </div>
        <Button onClick={() => (showForm ? reset() : setShowForm(true))} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {showForm ? "Cancel" : "＋ Add Experience"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Title / Position *</Label>
                <Input value={position} onChange={(e) => setPosition(e.target.value)} placeholder="e.g. Graphic Designer, Frontend Intern, Lead Organizer" className="mt-1.5" required />
              </div>
              <div>
                <Label>Category *</Label>
                <div className="mt-1.5">
                  <Select
                    value={category}
                    onChange={setCategory}
                    options={EXPERIENCE_CATEGORIES}
                    placeholder="Select category"
                  />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Organization / Company / Platform</Label>
                <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. ABC Studio, Tech Club, Coursera" className="mt-1.5" />
              </div>
              <div>
                <Label>Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Dhaka, Remote, Hybrid" className="mt-1.5" />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <DatePicker value={startDate} onChange={setStartDate} label="Start date" placeholder="Pick start" />
              <DatePicker value={endDate} onChange={setEndDate} label="End date" placeholder="Pick end" disabled={current} />
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none min-h-[44px]">
                  <input type="checkbox" checked={current} onChange={(e) => setCurrent(e.target.checked)} className="h-4 w-4 rounded border-[#e8e8ea] accent-[#111827]" /> Current / Ongoing
                </label>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you worked on, key achievements, roles or responsibilities..." className="mt-1.5" />
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Photoshop, Event Management, React, Leadership" className="mt-1.5" />
            </div>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto cursor-pointer min-h-[44px]">
              {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {saving ? (editing ? "Updating..." : "Creating...") : editing ? "Update experience" : "Create experience"}
            </Button>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState title="No experience yet" description="Add your jobs, internships, bootcamps, workshops, or art/creative projects." actionLabel="Add experience" onAction={() => setShowForm(true)} />
      ) : (
        <div className="space-y-3">
          {items.map((ex) => {
            const catObj = EXPERIENCE_CATEGORIES.find((c) => c.value === ex.category);
            return (
              <Card key={ex.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{ex.position}</h3>
                      {ex.category && (
                        <Badge variant="outline" className="text-xs py-0.5 px-2 font-normal flex items-center gap-1 text-[#4a4a52] bg-[#f8f8f9]">
                          {catObj?.icon}
                          {ex.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[#6b6b76] mt-0.5">{[ex.organization, ex.location].filter(Boolean).join(" • ") || "—"}</p>
                    <p className="text-xs text-[#8a8a94] mt-1">{ex.startDate ? new Date(ex.startDate + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""} {ex.endDate ? `— ${new Date(ex.endDate + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}` : ex.current ? "— Present" : ""} {ex.current && <span className="ml-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">Current</span>}</p>
                  </div>
                  <Badge>{ex.visibility ?? "public"}</Badge>
                </div>
                {ex.description && <p className="text-sm text-[#4a4a52] mt-2">{ex.description}</p>}
                {ex.skills && ex.skills.length > 0 && <div className="flex flex-wrap gap-1.5 mt-2">{ex.skills.map((s) => <Badge key={s}>{s}</Badge>)}</div>}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleEdit(ex)} className="text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-2 hover:bg-[#f8f8f9] cursor-pointer flex-1 min-h-[36px]">Edit</button>
                  <button onClick={() => handleDelete(ex.id)} disabled={deletingId === ex.id} className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-2 hover:bg-red-50 cursor-pointer flex-1 min-h-[36px] flex items-center justify-center gap-1 disabled:opacity-50">
                    {deletingId === ex.id && <Loader2 size={12} className="animate-spin" />} Delete
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
