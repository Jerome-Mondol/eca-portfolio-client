"use client";

import { useState, type FormEvent } from "react";
import { PageHeader, AddButton } from "@/components/dashboard/page-header";
import { ListSkeleton, ListOrEmpty } from "@/components/dashboard/list-parts";
import { FormShell } from "@/components/dashboard/form-shell";
import { useToast } from "@/components/ui/toast";
import { useDeleteResource } from "@/lib/use-delete-resource";
import { createDocumentApi, deleteDocumentApi } from "@/lib/api";
import { DocumentForm } from "./document-form";
import { DocumentCard } from "./document-card";
import { DocumentFilters } from "./document-filters";
import { useUnifiedDocuments } from "./use-unified-documents";

export function DocumentsView() {
  const { success, error: toastError } = useToast();
  const removeItem = useDeleteResource();
  const { items, loading } = useUnifiedDocuments();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // An upload needs two values, not a string, so it is held outside the fields.
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadedOriginalName, setUploadedOriginalName] = useState("");
  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState("Certificates");

  const filtered = filter === "All" ? items : items.filter((d) => d.category === filter);

  const reset = () => {
    setUploadedUrl(null);
    setUploadedOriginalName("");
    setDocName("");
    setOpen(false);
  };

  const handleUpload = (url: string | null, meta?: { originalName?: string }) => {
    setUploadedUrl(url);
    if (!url) {
      setUploadedOriginalName("");
    } else if (meta?.originalName) {
      setUploadedOriginalName(meta.originalName);
      // Only prefill the label while the user has not typed their own.
      if (!docName.trim()) setDocName(meta.originalName);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
      success("Document added to library");
      reset();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, filename: string) => {
    setDeletingId(id);
    removeItem({
      title: "Delete Document",
      description: `Are you sure you want to delete "${filename}" from your library?`,
      run: () => deleteDocumentApi(id),
    }).finally(() => setDeletingId(null));
  };

  if (loading) {
    return <ListSkeleton className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" height="h-40" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Library"
        description="All certificates, award proofs, project files, and documents in one place."
        action={<AddButton open={open} label="Add Document" onClick={() => setOpen((v) => !v)} />}
      />

      <FormShell open={open} saving={saving} onSubmit={handleSubmit} submitLabel="Save to Library" savingLabel="Saving...">
        <DocumentForm
          uploadedUrl={uploadedUrl}
          fileName={uploadedOriginalName}
          docName={docName}
          onDocNameChange={setDocName}
          category={category}
          onCategoryChange={setCategory}
          onUpload={handleUpload}
        />
      </FormShell>

      <DocumentFilters filter={filter} onFilterChange={setFilter} items={items} />

      <ListOrEmpty
        items={filtered}
        gridClassName="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        empty={{
          title: "No documents found",
          description:
            filter === "All"
              ? "Upload documents or add certificates/awards with proof files to see them here."
              : `No documents found under the "${filter}" category.`,
          actionLabel: "Add document",
          onAction: () => setOpen(true),
        }}
      >
        {(document) => (
          <DocumentCard
            key={document.id}
            document={document}
            deleting={deletingId === document.id}
            onDelete={() => handleDelete(document.id, document.filename)}
          />
        )}
      </ListOrEmpty>
    </div>
  );
}
