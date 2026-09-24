"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { listProjectsApi, createProjectApi, deleteProjectApi, updateProjectApi, type Project } from "@/lib/api";

export default function ProjectsPage() {
  const { success, error: toastError } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [github, setGithub] = useState("");
  const [live, setLive] = useState("");
  const [featured, setFeatured] = useState(false);

  const fetchList = async () => {
    try {
      const res = await listProjectsApi();
      setProjects(res.data);
    } catch (e: any) {
      toastError("Failed to load projects", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const resetForm = () => {
    setTitle(""); setDescription(""); setTech(""); setGithub(""); setLive(""); setFeatured(false); setEditing(null); setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toastError("Title required"); return; }
    const payload: any = {
      title: title.trim(),
      description: description.trim() || null,
      technologies: tech.split(",").map((s) => s.trim()).filter(Boolean),
      githubUrl: github.trim() || null,
      liveUrl: live.trim() || null,
      featured,
    };
    try {
      if (editing) {
        const res = await updateProjectApi(editing.id, payload);
        setProjects((p) => p.map((x) => (x.id === editing.id ? res.data : x)));
        success("Project updated");
      } else {
        const res = await createProjectApi(payload);
        setProjects((p) => [res.data, ...p]);
        success("Project added");
      }
      resetForm();
    } catch (err: any) {
      toastError("Save failed", err.message);
    }
  };

  const handleEdit = (p: Project) => {
    setEditing(p);
    setTitle(p.title);
    setDescription(p.description ?? "");
    setTech((p.technologies ?? []).join(", "));
    setGithub(p.githubUrl ?? "");
    setLive(p.liveUrl ?? "");
    setFeatured(!!p.featured);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProjectApi(id);
      setProjects((p) => p.filter((x) => x.id !== id));
      success("Deleted");
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
            <div>
              <Label>Technologies (comma separated)</Label>
              <Input value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Next.js, TypeScript, OpenAI" className="mt-1.5" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>GitHub URL</Label>
                <Input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/..." className="mt-1.5" />
              </div>
              <div>
                <Label>Live URL</Label>
                <Input value={live} onChange={(e) => setLive(e.target.value)} placeholder="https://..." className="mt-1.5" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4" /> Featured
            </label>
            <Button type="submit" className="w-full sm:w-auto cursor-pointer">{editing ? "Update" : "Create"} project</Button>
          </form>
        </Card>
      )}

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Your projects are a great way to show what you can actually build." actionLabel="Add your first project" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="overflow-hidden flex flex-col">
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight">{p.title}</h3>
                  {p.featured && <Badge className="bg-[#111827] text-white">Featured</Badge>}
                </div>
                <p className="text-sm text-[#6b6b76] mt-1 line-clamp-2">{p.description ?? "—"}</p>
                {p.technologies && p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.technologies.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                )}
                {(p.githubUrl || p.liveUrl) && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" className="text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer">
                        GitHub
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" className="text-xs font-medium bg-[#111827] text-white rounded-full px-3 py-1.5 cursor-pointer">
                        Live
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-[#f0f0f2] flex gap-2">
                <button onClick={() => handleEdit(p)} className="text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer flex-1">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex-1">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
