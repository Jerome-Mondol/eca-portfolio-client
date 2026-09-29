"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "@/components/ui/toast";
import { useCrudForm } from "@/lib/use-crud-form";
import { useDeleteResource } from "@/lib/use-delete-resource";
import { parseSkills, optional } from "@/lib/format";
import {
  createCertificateApi,
  updateCertificateApi,
  deleteCertificateApi,
  createDocumentApi,
  type Certificate,
} from "@/lib/api";

const BLANK = { name: "", org: "", issueDate: "", credentialId: "", credentialUrl: "", skills: "" };

const toForm = (c: Certificate): Record<string, string> => ({
  name: c.name,
  org: c.organization ?? "",
  issueDate: c.issueDate ?? "",
  credentialId: c.credentialId ?? "",
  credentialUrl: c.credentialUrl ?? "",
  skills: (c.skills ?? []).join(", "),
});

/** Filename the mirrored library copy is stored under. */
function fileNameFor(documentKey: string, fallback: string): string {
  return documentKey.split("/").pop() || `${fallback}-proof`;
}

/**
 * Certificate form state and its save/delete handlers.
 *
 * The uploaded file is not a form field, so its key lives beside the form
 * state. Saving also mirrors the proof into the document library, which is
 * best-effort: the certificate is already stored by that point, so a failure
 * there must not turn a successful save into an error.
 */
export function useCertificateForm() {
  const { success, error: toastError } = useToast();
  const removeItem = useDeleteResource();
  const form = useCrudForm<Certificate>({ blank: BLANK, toForm });
  const [documentKey, setDocumentKey] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const { values } = form;
    if (!values.name.trim()) {
      toastError("Name required");
      return;
    }
    form.setSaving(true);
    try {
      const payload = {
        name: values.name.trim(),
        organization: optional(values.org),
        issueDate: values.issueDate || null,
        credentialId: optional(values.credentialId),
        credentialUrl: optional(values.credentialUrl),
        skills: parseSkills(values.skills),
        documentKey,
        documentName,
      };
      // The API helpers write the new list straight into the store.
      if (form.editing) {
        await updateCertificateApi(form.editing.id, payload);
        success("Certificate updated");
      } else {
        await createCertificateApi(payload);
        success("Certificate added");
      }
      if (documentKey) {
        try {
          const fileName = fileNameFor(documentKey, values.name.trim());
          await createDocumentApi({
            filename: fileName,
            originalName: fileName,
            storageKey: documentKey,
            mimeType: documentKey.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
            category: "Certificates",
          });
        } catch {
          /* the certificate is saved; library copy is a convenience */
        }
      }
      setDocumentKey(null);
      setDocumentName(null);
      form.close();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : String(err));
    } finally {
      form.setSaving(false);
    }
  };

  /** Editing keeps the stored file unless the student picks a new one. */
  const handleEdit = (certificate: Certificate) => {
    setDocumentKey((certificate as { documentKey?: string | null }).documentKey ?? null);
    setDocumentName((certificate as { documentName?: string | null }).documentName ?? null);
    form.startEdit(certificate);
  };

  const handleDelete = (certificate: Certificate) =>
    removeItem({
      title: "Delete Certificate",
      description: "Are you sure you want to delete this certificate?",
      run: () => deleteCertificateApi(certificate.id),
    });

  return {
    form,
    documentKey,
    documentName,
    handleSubmit,
    handleEdit,
    handleDelete,
    onDocumentChange: (url: string | null, name: string | null) => {
      setDocumentKey(url);
      setDocumentName(name);
    },
  };
}
