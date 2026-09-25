"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/components/ui/toast";
import { listCertificatesApi, createCertificateApi, updateCertificateApi, deleteCertificateApi, createDocumentApi, type Certificate } from "@/lib/api";
import { getImageUrl } from "@/lib/upload";
import { FileUploadCard } from "@/components/ui/file-upload";
import { Loader2, FileText } from "lucide-react";

export default function CertificatesPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [skills, setSkills] = useState("");
  const [documentKey, setDocumentKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchList = async () => {
    try {
      const res = await listCertificatesApi();
      setItems(res.data);
    } catch (e: any) {
      toastError("Failed to load certificates", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const reset = () => { setName(""); setOrg(""); setIssueDate(""); setCredentialId(""); setCredentialUrl(""); setSkills(""); setDocumentKey(null); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toastError("Name required"); return; }
    setSaving(true);
    const payload: any = {
      name: name.trim(),
      organization: org.trim() || null,
      issueDate: issueDate || null,
      credentialId: credentialId.trim() || null,
      credentialUrl: credentialUrl.trim() || null,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      documentKey: documentKey || null,
    };
    try {
      if (editing) {
        const res = await updateCertificateApi(editing.id, payload);
        setItems((v) => v.map((x) => (x.id === editing.id ? res.data : x)));
        success("Certificate updated");
      } else {
        const res = await createCertificateApi(payload);
        setItems((v) => [res.data, ...v]);
        success("Certificate added");
      }
      if (documentKey) {
        try {
          const fname = documentKey.split("/").pop() || `${name.trim()}-proof`;
          await createDocumentApi({
            filename: fname,
            originalName: fname,
            storageKey: documentKey,
            mimeType: documentKey.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
            category: "Certificates",
          });
        } catch {}
      }
      reset();
    } catch (err: any) {
      toastError("Save failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (c: Certificate) => {
    setEditing(c);
    setName(c.name);
    setOrg(c.organization ?? "");
    setIssueDate(c.issueDate ?? "");
    setCredentialId(c.credentialId ?? "");
    setCredentialUrl(c.credentialUrl ?? "");
    setSkills((c.skills ?? []).join(", "));
    setDocumentKey((c as any).documentKey ?? null);
    setShowForm(true);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    try {
      await deleteCertificateApi(id);
      setItems((v) => v.filter((x) => x.id !== id));
      success("Deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    }
  };

  const isPdf = (url: string | null) => url?.toLowerCase().endsWith(".pdf") || url?.includes("application/pdf");

  if (loading) return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"><Skeleton className="h-40" /><Skeleton className="h-40" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Certificates</h1>
          <p className="text-sm text-[#6b6b76]">Showcase with image or PDF for portfolio.</p>
        </div>
        <Button onClick={() => (showForm ? reset() : setShowForm(true))} className="w-full sm:w-auto min-h-[44px] cursor-pointer">
          {showForm ? "Cancel" : "＋ Add Certificate"}
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
                <Label>Organization</Label>
                <Input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Programming Hero" className="mt-1.5" />
              </div>
              <div>
                <DatePicker value={issueDate} onChange={setIssueDate} label="Issue date" placeholder="Pick issue date" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Credential ID <span className="text-[#8a8a94] font-normal">(optional)</span></Label>
                <Input value={credentialId} onChange={(e) => setCredentialId(e.target.value)} placeholder="PH-123" className="mt-1.5" />
                <p className="text-xs text-[#8a8a94] mt-1">Leave blank if none.</p>
              </div>
              <div>
                <Label>Credential URL</Label>
                <Input value={credentialUrl} onChange={(e) => setCredentialUrl(e.target.value)} placeholder="https://..." className="mt-1.5" />
              </div>
            </div>

            <FileUploadCard value={documentKey} onChange={setDocumentKey} title="Upload certificate image or PDF" subtitle="Will be shown in your public portfolio." />

            <div>
              <Label>Skills (comma separated)</Label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, Node.js" className="mt-1.5" />
            </div>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto cursor-pointer min-h-[44px]">
              {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
              {saving ? (editing ? "Updating..." : "Creating...") : editing ? "Update certificate" : "Create certificate"}
            </Button>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <EmptyState title="No certificates yet" description="Upload an image or PDF to showcase in your portfolio." actionLabel="Add certificate" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              {(c as any).documentKey ? (
                isPdf((c as any).documentKey) ? (
                  <div className="h-32 bg-[#f8f8f9] border-b border-[#e8e8ea] flex flex-col items-center justify-center gap-1 p-3">
                    <FileText size={20} className="text-[#6b6b76]" />
                    <p className="text-xs text-[#6b6b76] truncate max-w-[180px]">{(c as any).documentKey.split("/").pop()}</p>
                    <a href={getImageUrl((c as any).documentKey)} target="_blank" className="text-xs bg-white border border-[#e8e8ea] rounded-full px-2 py-1 hover:bg-[#f3f3f5] cursor-pointer">View PDF</a>
                  </div>
                ) : (
                  <img src={getImageUrl((c as any).documentKey)} alt={c.name} className="h-32 w-full object-cover" />
                )
              ) : (
                <div className="h-32 bg-[#f8f8f9] border-b border-[#e8e8ea] flex items-center justify-center">
                  <span className="text-xs text-[#8a8a94]">No file</span>
                </div>
              )}
              <div className="p-4">
                <p className="text-xs font-semibold tracking-wide text-[#8a8a94]">CERTIFICATE</p>
                <h3 className="font-semibold text-sm mt-2">{c.name}</h3>
                <p className="text-xs text-[#6b6b76]">{c.organization ?? "—"} • {c.issueDate ? new Date(c.issueDate + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : ""}</p>
                {c.credentialId && <p className="text-xs text-[#8a8a94] mt-1">ID: {c.credentialId}</p>}
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
                {c.credentialUrl && (
                  <a href={c.credentialUrl} target="_blank" className="mt-2 inline-flex text-xs text-[#111827] underline cursor-pointer">
                    View credential →
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
