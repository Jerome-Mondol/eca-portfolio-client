"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { listProjectsApi, createProjectApi, deleteProjectApi, updateProjectApi, verifyProjectLinkApi, type Project } from "@/lib/api";
import { getImageUrl } from "@/lib/upload";
import { FileUploadCard } from "@/components/ui/file-upload";
import { Select, SelectOption } from "@/components/ui/select";
import { Trash2, Plus, Globe, Code2, Link2, Bird, Users, Camera, Video, Palette, FileText, GraduationCap, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

import { useConfirm } from "@/components/ui/confirm-dialog";

const platformOptions = ["GitHub", "LinkedIn", "Website", "Twitter", "Facebook", "Instagram", "YouTube", "Behance", "Dribbble", "Other"];

const getIcon = (platform: string, size = 12) => {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Code2 size={size} />;
  if (p.includes("linkedin")) return <Link2 size={size} />;
  if (p.includes("twitter") || p.includes("x")) return <Bird size={size} />;
  if (p.includes("facebook")) return <Users size={size} />;
  if (p.includes("instagram")) return <Camera size={size} />;
  if (p.includes("youtube")) return <Video size={size} />;
  if (p.includes("behance") || p.includes("dribbble")) return <Palette size={size} />;
  if (p.includes("kaggle") || p.includes("research")) return <GraduationCap size={size} />;
  return <Globe size={size} />;
};

export default function ProjectsPage() {
  const { success, error: toastError } = useToast();
  const { confirm } = useConfirm();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [links, setLinks] = useState<Array<{ platform: string; url: string; verified?: boolean; statusText?: string }>>([]);
  const [newPlatform, setNewPlatform] = useState("GitHub");
  const [newUrl, setNewUrl] = useState("");
  const [newCustom, setNewCustom] = useState("");
  const [featured, setFeatured] = useState(false);
  const [showOnPortfolio, setShowOnPortfolio] = useState(true);
  const [saving, setSaving] = useState(false);

  // Real-time URL verification state
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{ valid: boolean; url: string; status?: number; statusText?: string; domain?: string; message: string } | null>(null);

  useEffect(() => {
    const trimmed = newUrl.trim();
    if (!trimmed || trimmed.length < 4 || !trimmed.includes(".")) {
      setVerifyResult(null);
      setVerifying(false);
      return;
    }

    setVerifying(true);
    const timer = setTimeout(async () => {
      try {
        const res = await verifyProjectLinkApi(trimmed);
        setVerifyResult(res);
      } catch {
        setVerifyResult({ valid: false, url: trimmed, message: "Could not reach domain" });
      } finally {
        setVerifying(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [newUrl]);

  const fetchList = async () => {
    try {
      const res = await listProjectsApi();
      setProjects(res.data as any);
    } catch (e: any) {
      toastError("Failed to load projects", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const resetForm = () => {
    setTitle(""); setDescription(""); setTech(""); setCoverImage(null); setLinks([]); setNewPlatform("GitHub"); setNewUrl(""); setNewCustom(""); setFeatured(false); setShowOnPortfolio(true); setEditing(null); setShowForm(false); setVerifyResult(null); setVerifying(false);
  };

  const addLink = () => {
    const platform = newPlatform === "Other" ? newCustom.trim() : newPlatform;
    const url = newUrl.trim();
    if (!platform || !url) { toastError("Platform and URL required"); return; }
    if (!url.includes(".")) { toastError("Invalid URL format"); return; }

    const isVerified = verifyResult?.url === (url.startsWith("http") ? url : `https://${url}`) || verifyResult?.url === url ? verifyResult.valid : undefined;
    const statusMsg = verifyResult?.message;

    setLinks([...links, { platform, url, verified: isVerified, statusText: statusMsg }]);
    setNewUrl(""); setNewCustom(""); setVerifyResult(null);
    if (isVerified) {
      success("Link verified & added!");
    } else {
      success("Link added");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toastError("Title required"); return; }
    const publicProjectCount = projects.filter((project) => project.visibility !== "private").length;
    const editingIsPublic = !!editing && editing.visibility !== "private";
    if (showOnPortfolio && !editingIsPublic && publicProjectCount >= 5) { toastError("Portfolio limit reached", "You can show up to 5 projects. Hide another project first."); return; }
    const payload: any = {
      title: title.trim(),
      description: description.trim() || null,
      technologies: tech.split(",").map((s) => s.trim()).filter(Boolean),
      coverImage: coverImage || null,
      links: links.length > 0 ? links : null,
      featured,
      visibility: showOnPortfolio ? "public" : "private",
    };
    // Keep legacy github/live for backward compat: first GitHub link -> githubUrl, first non-GitHub -> liveUrl
    const githubLink = links.find((l) => l.platform.toLowerCase().includes("github"));
    const liveLink = links.find((l) => !l.platform.toLowerCase().includes("github"));
    if (githubLink) payload.githubUrl = githubLink.url;
    if (liveLink) payload.liveUrl = liveLink.url;

    setSaving(true);
    try {
      if (editing) {
        const res = await updateProjectApi(editing.id, payload);
        setProjects((p) => p.map((x) => (x.id === editing.id ? (res.data as any) : x)));
        success("Project updated");
      } else {
        const res = await createProjectApi(payload);
        setProjects((p) => [(res.data as any), ...p]);
        success("Project added");
      }
      resetForm();
    } catch (err: any) {
      toastError("Save failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: any) => {
    setEditing(p);
    setTitle(p.title);
    setDescription(p.description ?? "");
    setTech((p.technologies ?? []).join(", "));
    setCoverImage(p.coverImage ?? null);
    // Prefer links array, fallback to legacy github/live
    if (p.links && Array.isArray(p.links) && p.links.length > 0) setLinks(p.links);
    else {
      const arr: any[] = [];
      if (p.githubUrl) arr.push({ platform: "GitHub", url: p.githubUrl });
      if (p.liveUrl) arr.push({ platform: "Website", url: p.liveUrl });
      setLinks(arr);
    }
    setFeatured(!!p.featured);
    setShowOnPortfolio(p.visibility !== "private");
    setShowForm(true);
  };

  const handleDelete = async (id: string, projectTitle: string) => {
    const isConfirmed = await confirm({
      title: "Delete Project",
      description: `Are you sure you want to delete "${projectTitle}"? This action cannot be undone.`,
      confirmText: "Delete Project",
      variant: "danger",
    });
    if (!isConfirmed) return;
    try {
      await deleteProjectApi(id);
      setProjects((p) => p.filter((x) => x.id !== id));
      success("Project deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    }
  };

  if (loading) return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"><Skeleton className="h-64" /><Skeleton className="h-64" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-[#6b6b76]">Builds that prove skills. Feature the best.</p>
        </div>
        <Button onClick={() => (showForm ? resetForm() : setShowForm(true))} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {showForm ? "Cancel" : "＋ Add Project"}
        </Button>
      </div>

      {showForm && (
        <Card className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AI Study Assistant" className="mt-1.5" required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="mt-1.5" />
            </div>
            <FileUploadCard value={coverImage} onChange={setCoverImage} accept="image/*" maxSizeMB={5} title="Upload project image" subtitle="Will be shown in your public portfolio." />
            <div>
              <Label>Things used</Label>
              <Input value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Next.js, TypeScript, OpenAI" className="mt-1.5" />
              <p className="text-xs text-[#8a8a94] mt-1">Comma separated — will show as <span className="font-medium">Next.js / TypeScript / OpenAI</span></p>
            </div>

            <div className="space-y-2">
              <Label>Links (universal — any platform)</Label>
              <p className="text-xs text-[#6b6b76]">Add GitHub, live demo, Behance, YouTube, etc. — like profile socials.</p>
              {links.length > 0 && (
                <div className="space-y-2">
                  {links.map((l, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-xl border border-[#e8e8ea] bg-[#f8f8f9] px-3 py-2">
                      <span className="h-7 w-7 rounded-full bg-white border flex items-center justify-center shrink-0">{getIcon(l.platform, 12)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium">{l.platform}</p>
                          {l.verified === true && (
                            <Badge variant="success" className="text-[10px] py-0 px-1.5 gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
                              <CheckCircle2 size={10} /> Verified
                            </Badge>
                          )}
                          {l.verified === false && (
                            <Badge variant="danger" className="text-[10px] py-0 px-1.5 gap-1 bg-red-50 text-red-700 border-red-200">
                              <AlertCircle size={10} /> Unreachable
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[#6b6b76] truncate">{l.url}</p>
                      </div>
                      <button type="button" onClick={() => setLinks(links.filter((_, i) => i !== idx))} className="h-7 w-7 rounded-full bg-white border flex items-center justify-center hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-1.5">
                <div className="grid sm:grid-cols-[160px_1fr_auto] gap-2 items-center">
                  <Select
                    value={newPlatform}
                    onChange={setNewPlatform}
                    options={platformOptions.map((p) => ({
                      value: p,
                      label: p,
                      icon: getIcon(p, 14),
                    }))}
                  />
                  <div className="relative flex-1">
                    <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://github.com/username/project" className="pr-8" />
                    {verifying && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-500">
                        <Loader2 size={14} className="animate-spin" />
                      </div>
                    )}
                    {!verifying && verifyResult && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        {verifyResult.valid ? (
                          <CheckCircle2 size={15} className="text-emerald-600" />
                        ) : (
                          <AlertCircle size={15} className="text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={addLink} className="cursor-pointer min-h-[44px]"><Plus size={14} /> Add</Button>
                </div>
                {newPlatform === "Other" && <Input value={newCustom} onChange={(e) => setNewCustom(e.target.value)} placeholder="Custom platform (e.g. Figma)" className="mt-1" />}

                {/* Real-time verification feedback box */}
                {verifying && (
                  <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50/80 border border-amber-200/70 rounded-xl px-3 py-2 animate-pulse">
                    <Loader2 size={14} className="animate-spin text-amber-600 shrink-0" />
                    <span>Verifying link availability...</span>
                  </div>
                )}
                {!verifying && verifyResult && (
                  <div className={`flex items-center justify-between text-xs rounded-xl px-3 py-2 border transition-all ${
                    verifyResult.valid 
                      ? "text-emerald-800 bg-emerald-50/80 border-emerald-200/80" 
                      : "text-red-800 bg-red-50/80 border-red-200/80"
                  }`}>
                    <div className="flex items-center gap-2 min-w-0">
                      {verifyResult.valid ? (
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle size={15} className="text-red-600 shrink-0" />
                      )}
                      <span className="truncate">
                        {verifyResult.valid ? (
                          <>
                            <strong className="font-semibold text-emerald-900">{verifyResult.domain}</strong> — {verifyResult.message}
                          </>
                        ) : (
                          <span>{verifyResult.message}</span>
                        )}
                      </span>
                    </div>
                    {verifyResult.valid && (
                      <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-mono text-[10px] shrink-0 ml-2">
                        {verifyResult.status || 200} OK
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4" /> Featured
            </label>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={showOnPortfolio} disabled={!showOnPortfolio && projects.filter((project) => project.visibility !== "private").length >= 5} onChange={(e) => setShowOnPortfolio(e.target.checked)} className="h-4 w-4 mt-0.5" />
              <span>
                Show on portfolio
                <span className="block text-xs text-[#8a8a94] mt-0.5">{projects.filter((project) => project.visibility !== "private").length}/5 projects selected</span>
              </span>
            </label>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto cursor-pointer min-h-[44px]">
              {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {saving ? (editing ? "Updating..." : "Creating...") : editing ? "Update project" : "Create project"}
            </Button>
          </form>
        </Card>
      )}

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Your projects are a great way to show what you can actually build." actionLabel="Add your first project" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p: any) => (
            <Card key={p.id} className="overflow-hidden flex flex-col">
              {p.coverImage && <img src={getImageUrl(p.coverImage)} alt={p.title} className="h-36 w-full object-cover" />}
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight">{p.title}</h3>
                  {p.featured && <Badge className="bg-[#111827] text-white shrink-0">Featured</Badge>}
                  {p.visibility === "private" && <Badge variant="secondary" className="shrink-0">Hidden</Badge>}
                </div>
                <p className="text-sm text-[#6b6b76] mt-1 line-clamp-2">{p.description ?? "—"}</p>
                {p.technologies && p.technologies.length > 0 && (
                  <p className="text-xs text-[#6b6b76] mt-3">
                    <span className="font-medium text-[#111827]">Things used:</span> {p.technologies.join(" / ")}
                  </p>
                )}
                {/* Universal links */}
                {p.links && p.links.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.links.map((l: any, i: number) => (
                      <a key={i} href={l.url.startsWith("http") ? l.url : `https://${l.url}`} target="_blank" className="inline-flex items-center gap-1.5 text-xs border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer bg-white">
                        {getIcon(l.platform, 12)} {l.platform}
                      </a>
                    ))}
                  </div>
                ) : (
                  (p.githubUrl || p.liveUrl) && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" className="text-xs border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer inline-flex items-center gap-1"><Code2 size={12} /> GitHub</a>}
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" className="text-xs bg-[#111827] text-white rounded-full px-3 py-1.5 cursor-pointer inline-flex items-center gap-1"><Globe size={12} /> Live</a>}
                    </div>
                  )
                )}
              </div>
              <div className="p-3 border-t border-[#f0f0f2] flex gap-2">
                <button onClick={() => handleEdit(p)} className="text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer flex-1">Edit</button>
                <button onClick={() => handleDelete(p.id, p.title)} className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex-1">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
