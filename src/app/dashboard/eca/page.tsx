"use client";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { listActivitiesApi, createActivityApi, updateActivityApi, deleteActivityApi, type Activity } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { ImageSlider, ImageGridPreview } from "@/components/ui/image-slider";
import { FileUploadCard } from "@/components/ui/file-upload";
import { Upload, Loader2, X, Image as ImageIcon } from "lucide-react";

export default function ECAPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [activityName, setActivityName] = useState("");
  const [category, setCategory] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchList = async () => {
    try {
      const res = await listActivitiesApi();
      setItems(res.data);
    } catch (e: any) {
      toastError("Failed to load ECA", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const reset = () => {
    setActivityName(""); setCategory(""); setOrganization(""); setRole(""); setDescription(""); setSkills(""); setImages([]); setEditing(null); setShowForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 5 - images.length;
    if (remaining <= 0) {
      toastError("Max 5 images");
      return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    if (files.length > remaining) toastError(`Only ${remaining} more allowed`, `Max 5 images`);
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
    if (!activityName.trim()) { toastError("Activity name required"); return; }
    setSaving(true);
    const payload: any = {
      activityName: activityName.trim(),
      category: category.trim() || null,
      organization: organization.trim() || null,
      role: role.trim() || null,
      description: description.trim() || null,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      images: images.length > 0 ? images : null,
    };
    try {
      if (editing) {
        const res = await updateActivityApi(editing.id, payload);
        setItems((v) => v.map((x) => (x.id === editing.id ? res.data : x)));
        success("ECA updated");
      } else {
        const res = await createActivityApi(payload);
        setItems((v) => [res.data, ...v]);
        success("ECA added");
      }
      reset();
    } catch (err: any) {
      toastError("Save failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (a: Activity) => {
    setEditing(a);
    setActivityName(a.activityName);
    setCategory(a.category ?? "");
    setOrganization(a.organization ?? "");
    setRole(a.role ?? "");
    setDescription(a.description ?? "");
    setSkills((a.skills ?? []).join(", "));
    setImages((a as any).images ?? []);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      await deleteActivityApi(id);
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
          <h1 className="text-xl font-semibold tracking-tight">ECA & Activities</h1>
          <p className="text-sm text-[#6b6b76]">Personality beyond grades — up to 5 images.</p>
        </div>
        <Button onClick={() => (showForm ? reset() : setShowForm(true))} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {showForm ? "Cancel" : "＋ Add Activity"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Activity *</Label>
              <Input value={activityName} onChange={(e) => setActivityName(e.target.value)} placeholder="President — Robotics Club" className="mt-1.5" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Leadership, Debate, etc" className="mt-1.5" />
              </div>
              <div>
                <Label>Organization</Label>
                <Input value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="University of Dhaka" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Role</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="President" className="mt-1.5" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What did you do?" className="mt-1.5" />
            </div>
            <div>
              <Label>Skills (comma separated)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Leadership, Public Speaking" className="mt-1.5" />
            </div>

            <div>
              <Label className="mb-1.5 block">Activity Images (Max 5)</Label>
              <FileUploadCard
                values={images}
                onAddImages={(newUrls) => setImages((prev) => [...prev, ...newUrls].slice(0, 5))}
                onRemoveImage={(idx) => setImages((prev) => prev.filter((_, i) => i !== idx))}
                maxFiles={5}
                title="Upload activity photos or certificates"
                subtitle="Upload photos, certificates, or proof of participation."
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full sm:w-auto cursor-pointer min-h-[44px]">
              {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {saving ? (editing ? "Updating..." : "Creating...") : editing ? "Update activity" : "Create activity"}
            </Button>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState title="No activities yet" description="Add your ECA to showcase personality." actionLabel="Add activity" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {items.map((a) => (
            <Card key={a.id} className="overflow-hidden">
              {(a as any).images && (a as any).images.length > 0 ? (
                <div className="p-3">
                  <ImageSlider images={(a as any).images} />
                </div>
              ) : (
                <div className="h-24 bg-[#f8f8f9] border-b border-[#e8e8ea] flex items-center justify-center text-[#8a8a94] gap-2">
                  <ImageIcon size={16} /> <span className="text-xs">No images</span>
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-[#8a8a94] tracking-wide uppercase">{a.category ?? "ECA"}</p>
                    <h3 className="font-semibold text-sm mt-1 leading-tight">{a.activityName}</h3>
                    <p className="text-xs text-[#6b6b76] mt-1">{[a.role, a.organization].filter(Boolean).join(" • ")}</p>
                  </div>
                  <Badge>Public</Badge>
                </div>
                {a.description && <p className="text-sm text-[#4a4a52] mt-3 leading-5">{a.description}</p>}
                {a.skills && a.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {a.skills.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleEdit(a)} className="text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer flex-1">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex-1">Delete</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
