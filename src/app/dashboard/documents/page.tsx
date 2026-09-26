"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { Select, SelectOption } from "@/components/ui/select";
import { getImageUrl } from "@/lib/upload";
import {
  createDocumentApi,
  deleteDocumentApi,
  listDocumentsApi,
  listCertificatesApi,
  listAchievementsApi,
  listProjectsApi,
  type Document,
} from "@/lib/api";
import { useResource } from "@/lib/store";
import {
  FileText,
  Award,
  Trophy,
  FolderKanban,
  FileCode,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  Filter,
} from "lucide-react";

// Split out of the page chunk — only fetched when the form is actually opened.
const FileUploadCard = dynamic(() => import("@/components/ui/file-upload").then((m) => m.FileUploadCard), {
  ssr: false,
  loading: () => <Skeleton className="h-[188px] w-full" />,
});

const CATEGORIES: SelectOption[] = [
  { value: "Certificates", label: "Certificates", icon: <Award size={15} /> },
  { value: "Awards", label: "Awards & Achievements", icon: <Trophy size={15} /> },
  { value: "Projects", label: "Projects", icon: <FolderKanban size={15} /> },
  { value: "Other", label: "Other Documents", icon: <FileCode size={15} /> },
];

export interface UnifiedDocument {
  id: string;
  filename: string;
  category: string;
  url: string;
  mimeType?: string;
  fileSize?: number;
  source: "document" | "certificate" | "achievement" | "project";
  sourceName?: string;
  createdAt?: string;
}

export default function DocumentsPage() {
  const { success, error: toastError } = useToast();
  const { confirm: confirmModal } = useConfirm();
  // Four synchronous store reads — all warmed on shell mount, so the aggregated
  // list renders on the first frame instead of after four round trips.
  const { data: docsData, loading: docsLoading } = useResource<{ data: Document[] }>("documents", listDocumentsApi);
  const { data: certsData } = useResource<{ data: any[] }>("certificates", listCertificatesApi);
  const { data: achsData } = useResource<{ data: any[] }>("achievements", listAchievementsApi);
  const { data: projsData } = useResource<{ data: any[] }>("projects", listProjectsApi);
  const loading = docsLoading;
  const [showForm, setShowForm] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedOriginalName, setUploadedOriginalName] = useState<string>("");
  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState<string>("Certificates");
  const [filter, setFilter] = useState<string>("All");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const items = useMemo<UnifiedDocument[]>(() => {
    const list: UnifiedDocument[] = [];

    // Manual / Direct Upload Documents
    (docsData?.data ?? []).forEach((d) => {
      const fileUrl = (d as any).storageKey || (d as any).fileKey || d.filename || "";
      list.push({
        id: d.id,
        filename: d.filename || d.originalName || "Document",
        category: d.category || "Other",
        url: getImageUrl(fileUrl),
        mimeType: d.mimeType || (fileUrl.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
        fileSize: d.fileSize || undefined,
        source: "document",
        createdAt: d.createdAt,
      });
    });

    // Certificates with proofs
    (certsData?.data ?? []).forEach((c) => {
      if (c.documentKey) {
        const fname = c.name ? `${c.name} (Certificate)` : "Certificate Proof";
        list.push({
          id: `cert-${c.id}`,
          filename: fname,
          category: "Certificates",
          url: getImageUrl(c.documentKey),
          mimeType: c.documentKey.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
          source: "certificate",
          sourceName: c.name,
          createdAt: c.createdAt,
        });
      }
    });

    // Achievements with proof images
    (achsData?.data ?? []).forEach((a) => {
      if (a.images && a.images.length > 0) {
        a.images.forEach((img: string, idx: number) => {
          const fname = `${a.title}${a.images.length > 1 ? ` (${idx + 1})` : ""}`;
          list.push({
            id: `ach-${a.id}-${idx}`,
            filename: fname,
            category: "Awards",
            url: getImageUrl(img),
            mimeType: img.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
            source: "achievement",
            sourceName: a.title,
            createdAt: a.createdAt,
          });
        });
      }
    });

    // Projects with cover images / assets
    (projsData?.data ?? []).forEach((p) => {
      if (p.coverImage) {
        list.push({
          id: `proj-${p.id}`,
          filename: `${p.title} Cover`,
          category: "Projects",
          url: getImageUrl(p.coverImage),
          mimeType: p.coverImage.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
          source: "project",
          sourceName: p.title,
          createdAt: p.createdAt,
        });
      }
    });

    return list;
  }, [docsData, certsData, achsData, projsData]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedUrl) {
      toastError("Please upload a file first");
      return;
    }
    const finalName = docName.trim() || uploadedOriginalName || "Document";
    setSaving(true);
    try {
      // createDocumentApi writes the new list straight into the store.
      await createDocumentApi({
        filename: finalName,
        originalName: finalName,
        storageKey: uploadedUrl,
        mimeType: uploadedUrl.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
        category,
      });
      setDocName("");
      setUploadedUrl(null);
      setUploadedOriginalName("");
      setShowForm(false);
      success("Document added to library");
    } catch (err: any) {
      toastError("Save failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc: UnifiedDocument) => {
    if (doc.source !== "document") {
      toastError("Cannot delete auto-synced files here", `Remove it directly from the ${doc.source} section.`);
      return;
    }
    const isConfirmed = await confirmModal({
      title: "Delete Document",
      description: "Are you sure you want to delete this document from your library?",
      confirmText: "Delete",
      variant: "danger",
    });
    if (!isConfirmed) return;
    setDeletingId(doc.id);
    try {
      await deleteDocumentApi(doc.id);
      success("Document deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filterTabs = ["All", "Certificates", "Awards", "Projects", "Other"];
  const filtered = filter === "All" ? items : items.filter((d) => d.category === filter);

  if (loading)
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Document Library</h1>
          <p className="text-sm text-[#6b6b76]">
            All certificates, award proofs, project files, and documents in one place.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto min-h-[44px] cursor-pointer"
        >
          {showForm ? "Cancel" : "＋ Add Document"}
        </Button>
      </div>

      {/* Add Document Form */}
      {showForm && (
        <Card className="p-5 space-y-4">
          <form onSubmit={handleCreate} className="space-y-4">
            <FileUploadCard
              value={uploadedUrl}
              fileName={uploadedOriginalName || docName}
              onChange={(url, meta) => {
                setUploadedUrl(url);
                if (!url) {
                  setUploadedOriginalName("");
                } else if (meta?.originalName) {
                  setUploadedOriginalName(meta.originalName);
                  if (!docName.trim()) setDocName(meta.originalName);
                }
              }}
              title="Upload Document or Proof File"
              subtitle="Upload PDF or image file to store in your document library."
            />
            {uploadedUrl && (
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-medium text-[#4a4a52]">Document Name / Label</label>
                  <input
                    type="text"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="e.g. AWS Certification PDF, Resume"
                    className="mt-1 w-full rounded-xl border border-[#e8e8ea] px-3.5 py-2.5 text-sm outline-none focus:border-[#111827]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#4a4a52]">Category</label>
                  <div className="mt-1">
                    <Select
                      value={category}
                      onChange={setCategory}
                      options={CATEGORIES}
                      placeholder="Select Category"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="submit"
                disabled={saving || !uploadedUrl}
                className="w-full sm:w-auto min-h-[44px] cursor-pointer"
              >
                {saving && <Loader2 size={14} className="mr-2 animate-spin" />}
                {saving ? "Saving..." : "Save to Library"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap pb-1">
        <Filter size={14} className="text-[#8a8a94] mr-1" />
        {filterTabs.map((c) => {
          const count = c === "All" ? items.length : items.filter((x) => x.category === c).length;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`text-xs rounded-full px-3.5 py-1.5 border font-medium cursor-pointer transition flex items-center gap-1.5 ${
                filter === c
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-white border-[#e8e8ea] text-[#4a4a52] hover:bg-[#f8f8f9]"
              }`}
            >
              {c}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filter === c ? "bg-white/20 text-white" : "bg-[#f0f0f2] text-[#6b6b76]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No documents found"
          description={
            filter === "All"
              ? "Upload documents or add certificates/awards with proof files to see them here."
              : `No documents found under the "${filter}" category.`
          }
          actionLabel="Add document"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => {
            const isPdf = d.mimeType === "application/pdf" || d.url.toLowerCase().endsWith(".pdf");
            return (
              <Card key={d.id} className="p-4 flex flex-col justify-between space-y-3 hover:border-[#d0d0d6] transition">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-xs font-normal bg-[#f8f8f9] text-[#4a4a52]">
                      {d.category}
                    </Badge>
                    {d.source !== "document" && (
                      <span className="text-[10px] text-[#8a8a94] bg-[#f0f0f2] px-2 py-0.5 rounded-full capitalize">
                        from {d.source}
                      </span>
                    )}
                  </div>

                  {/* Thumbnail / Icon Preview */}
                  <div className="mt-3 rounded-lg overflow-hidden border border-[#f0f0f2] bg-[#f8f8f9] h-32 flex items-center justify-center relative group">
                    {isPdf ? (
                      <div className="flex flex-col items-center gap-1 text-[#6b6b76]">
                        <FileText size={32} className="text-[#111827]" />
                        <span className="text-xs font-medium uppercase tracking-wider">PDF Document</span>
                      </div>
                    ) : (
                      <img
                        src={d.url}
                        alt={d.filename}
                        className="w-full h-full object-cover transition transform group-hover:scale-105"
                      />
                    )}
                  </div>

                  <p className="text-sm font-semibold mt-3 text-[#1a1a1e] truncate" title={d.filename}>
                    {d.filename}
                  </p>
                  {d.sourceName && (
                    <p className="text-xs text-[#6b6b76] truncate">Linked: {d.sourceName}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#f0f0f2]">
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium border border-[#e8e8ea] rounded-full px-3 py-1.5 hover:bg-[#f8f8f9] cursor-pointer flex-1 flex items-center justify-center gap-1.5 text-[#1a1a1e]"
                  >
                    <ExternalLink size={12} /> View
                  </a>
                  {d.source === "document" && (
                    <button
                      onClick={() => handleDelete(d)}
                      disabled={deletingId === d.id}
                      className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      {deletingId === d.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
