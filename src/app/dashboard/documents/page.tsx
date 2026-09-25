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
import { listDocumentsApi, createDocumentApi, deleteDocumentApi, type Document } from "@/lib/api";

const categories = ["Certificates", "Projects", "Awards", "Other"] as const;

export default function DocumentsPage() {
  const { success, error: toastError } = useToast();
  const [items, setItems] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filename, setFilename] = useState("");
  const [category, setCategory] = useState<string>("Other");
  const [filter, setFilter] = useState<string>("All");

  const fetchList = async () => {
    try {
      const res = await listDocumentsApi();
      setItems(res.data);
    } catch (e: any) {
      toastError("Failed to load documents", e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchList(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filename.trim()) { toastError("Filename required"); return; }
    try {
      const res = await createDocumentApi({ filename: filename.trim(), originalName: filename.trim(), mimeType: "application/pdf", fileSize: 1024, category });
      setItems((v) => [res.data, ...v]);
      setFilename("");
      success("Document added");
    } catch (err: any) {
      toastError("Add failed", err.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocumentApi(id);
      setItems((v) => v.filter((x) => x.id !== id));
      success("Deleted");
    } catch (e: any) {
      toastError("Delete failed", e.message);
    }
  };

  const filtered = filter === "All" ? items : items.filter((d) => d.category === filter);

  if (loading) return <div className="grid sm:grid-cols-2 gap-4"><Skeleton className="h-32" /><Skeleton className="h-32" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Documents</h1>
          <p className="text-sm text-[#6b6b76]">One library, reuse everywhere. Cloud upload coming later.</p>
        </div>
      </div>

      <Card className="p-5">
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <Label>Filename *</Label>
            <Input value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="cert.pdf" className="mt-1.5" />
          </div>
          <div className="w-full sm:w-44">
            <Label>Category</Label>
            <div className="mt-1.5">
              <Select value={category} onChange={setCategory} options={[...categories]} />
            </div>
          </div>
          <Button type="submit" className="w-full sm:w-auto min-h-[44px] cursor-pointer">Add</Button>
        </form>
        <p className="text-xs text-[#8a8a94] mt-2">Metadata only for now. File upload via R2 will be enabled later.</p>
      </Card>

      <div className="flex gap-2 flex-wrap">
        {["All", ...categories].map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`text-xs rounded-full px-3 py-1.5 border font-medium cursor-pointer ${filter === c ? "bg-[#111827] text-white border-[#111827]" : "bg-white border-[#e8e8ea] hover:bg-[#f8f8f9]"}`}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No documents" description="Add your files metadata. Real upload coming soon." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <Card key={d.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <Badge>{d.category ?? "Other"}</Badge>
                <span className="text-xs text-[#8a8a94]">{d.createdAt?.slice(0, 10) ?? ""}</span>
              </div>
              <p className="text-sm font-medium mt-3 truncate">{d.filename}</p>
              <p className="text-xs text-[#6b6b76]">{d.mimeType ?? "—"} • {d.fileSize ? `${(d.fileSize / 1024).toFixed(1)} KB` : "—"}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleDelete(d.id)} className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex-1">Delete</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
