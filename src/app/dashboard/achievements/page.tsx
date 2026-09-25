"use client";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { DatePicker } from "@/components/ui/date-picker";
import { ImageSlider, ImageGridPreview } from "@/components/ui/image-slider";
import { uploadImage } from "@/lib/upload";
import { FileUploadCard } from "@/components/ui/file-upload";
import {
  listAchievementsApi,
  createAchievementApi,
  updateAchievementApi,
  deleteAchievementApi,
  type Achievement,
} from "@/lib/api";
import { Select, SelectOption } from "@/components/ui/select";
import {
  Upload,
  Loader2,
  X,
  Image as ImageIcon,
  Plus,
  Trophy,
  Award,
  GraduationCap,
  BookOpen,
  Medal,
  Code2,
  Star,
  Tag,
} from "lucide-react";

const CATEGORIES: SelectOption[] = [
  { value: "Competition", label: "Competition", icon: <Trophy size={15} /> },
  { value: "Award", label: "Award", icon: <Award size={15} /> },
  { value: "Scholarship", label: "Scholarship", icon: <GraduationCap size={15} /> },
  { value: "Academic", label: "Academic", icon: <BookOpen size={15} /> },
  { value: "Olympiad", label: "Olympiad", icon: <Medal size={15} /> },
  { value: "Hackathon", label: "Hackathon", icon: <Code2 size={15} /> },
  { value: "Recognition", label: "Recognition", icon: <Star size={15} /> },
  { value: "Other", label: "Other", icon: <Tag size={15} /> },
];

export default function AchievementsPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Competition");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const fetchList = async () => {
    try {
      const res = await listAchievementsApi();
      setItems(res.data);
    } catch (e: any) {
      toastError("Failed to load achievements", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const reset = () => {
    setTitle("");
    setCategory("Competition");
    setOrganization("");
    setDate("");
    setDescription("");
    setImages([]);
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (a: Achievement) => {
    setEditing(a);
    setTitle(a.title);
    setCategory(a.category ?? "Competition");
    setOrganization(a.organization ?? "");
    setDate(a.date ?? "");
    setDescription(a.description ?? "");
    setImages(a.images ?? []);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    setDeletingId(id);
    try {
      await deleteAchievementApi(id);
      setItems((v) => v.filter((x) => x.id !== id));
      success("Achievement deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 5 - images.length;
    if (remaining <= 0) {
      toastError("Max 5 images allowed");
      return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      toastError(`Only ${remaining} more allowed`, "Max 5 images per achievement");
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        const res = await uploadImage(file);
        uploaded.push(res.url);
      }
      setImages((prev) => [...prev, ...uploaded].slice(0, 5));
      success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
    } catch (err: any) {
      toastError("Upload failed", err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toastError("Title required");
      return;
    }
    setSaving(true);
    const payload: any = {
      title: title.trim(),
      category: category.trim() || null,
      organization: organization.trim() || null,
      date: date || null,
      description: description.trim() || null,
      images: images.length > 0 ? images : null,
    };
    try {
      if (editing) {
        const res = await updateAchievementApi(editing.id, payload);
        setItems((v) => v.map((x) => (x.id === editing.id ? res.data : x)));
        success("Achievement updated");
      } else {
        const res = await createAchievementApi(payload);
        setItems((v) => [res.data, ...v]);
        success("Achievement added");
      }
      reset();
    } catch (err: any) {
      toastError("Save failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="space-y-6 max-w-[800px]">
      {/* Header — aligned with all other sections per spec */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Achievements</h1>
          <p className="text-sm text-[#6b6b76]">Awards, competition wins, and recognition.</p>
        </div>
        <Button
          onClick={() => (showForm ? reset() : setShowForm(true))}
          className="w-full sm:w-auto min-h-[44px] cursor-pointer"
        >
          {showForm ? "Cancel" : "＋ Add Achievement"}
        </Button>
      </div>

      {/* Add / Edit Form Card */}
      {showForm && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-sm">
            {editing ? "Edit achievement" : "New achievement"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 1st Place — National Hackathon 2026"
                className="mt-1.5"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <div className="mt-1.5">
                  <Select
                    value={category}
                    onChange={setCategory}
                    options={CATEGORIES}
                    placeholder="Select category"
                  />
                </div>
              </div>

              <div>
                <Label>Organization / Host</Label>
                <Input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. XYZ University"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Date</Label>
              <div className="mt-1.5">
                <DatePicker value={date} onChange={setDate} placeholder="Select date unlocked" />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Awarded first place among 120 participating teams..."
                className="mt-1.5"
              />
            </div>

            {/* Achievement Image Upload Section — matching ECA/Projects/Certificates */}
            <div>
              <Label className="mb-1.5 block">Proof Images (Max 5)</Label>
              <FileUploadCard
                values={images}
                onAddImages={(newUrls) => setImages((prev) => [...prev, ...newUrls].slice(0, 5))}
                onRemoveImage={(idx) => setImages((prev) => prev.filter((_, i) => i !== idx))}
                maxFiles={5}
                title="Upload proof images or certificates"
                subtitle="Upload award certificates, photos, or proof images."
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="secondary" onClick={reset} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="cursor-pointer">
                {saving ? (
                  <>
                    <Loader2 size={14} className="mr-1 animate-spin" /> Saving...
                  </>
                ) : editing ? (
                  "Update achievement"
                ) : (
                  "Save achievement"
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* List / Cards */}
      {items.length === 0 ? (
        <EmptyState
          title="No achievements yet"
          description="Add competition wins, awards, scholarships, or recognition."
          actionLabel="Add achievement"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a.id} className="p-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Left — Image thumbnail */}
                {a.images && a.images.length > 0 && (
                  <div className="sm:w-[160px] md:w-[200px] shrink-0 bg-[#f5f5f7]">
                    <div className="relative w-full h-[160px] sm:h-full">
                      <img
                        src={a.images[0]}
                        alt={a.title}
                        className="w-full h-full object-cover"
                      />
                      {a.images.length > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                          +{a.images.length - 1} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Right — Text content */}
                <div className="flex-1 min-w-0 p-5 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm sm:text-[15px]">{a.title}</h3>
                        {a.category && <Badge className="text-xs">{a.category}</Badge>}
                      </div>
                      <p className="text-xs text-[#6b6b76]">
                        {[
                          a.organization,
                          a.date
                            ? new Date(a.date + "T12:00:00").toLocaleDateString("en-GB", {
                                month: "short",
                                year: "numeric",
                              })
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                      {a.description && (
                        <p className="text-sm text-[#4a4a52] leading-5 pt-1 line-clamp-3">{a.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(a)}
                        className="text-xs border border-[#e8e8ea] rounded-full px-3 py-1.5 cursor-pointer hover:bg-[#f8f8f9]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deletingId === a.id}
                        className="text-xs border border-red-200 text-red-600 rounded-full px-3 py-1.5 cursor-pointer hover:bg-red-50"
                      >
                        {deletingId === a.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
