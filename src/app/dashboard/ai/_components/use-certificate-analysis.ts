"use client";

import { useState } from "react";
import { uploadImage } from "@/lib/upload";
import { analyzeCertificateApi, createCertificateApi, createDocumentApi, type AiAnalysis } from "@/lib/api";
import { EMPTY_FORM, formFromResult, type CertForm } from "./ai-shared";

export type SavePhase = "idle" | "uploading" | "saving";

/** Certificate upload, analysis, review form, and the save-into-library step. */
export function useCertificateAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savePhase, setSavePhase] = useState<SavePhase>("idle");
  /** Drives the three-step progress list; the timings only approximate the real ones. */
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AiAnalysis | null>(null);
  const [form, setForm] = useState<CertForm>(EMPTY_FORM);

  const runAnalysis = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setSaveMessage(null);
    setResult(null);
    setPhase(0);
    // Approximate the pipeline: extraction ~5s, research ~10s, scoring is instant.
    const step1 = setTimeout(() => setPhase(1), 5000);
    const step2 = setTimeout(() => setPhase(2), 16000);
    try {
      const response = await analyzeCertificateApi(file);
      setResult(response.data);
      setForm(formFromResult(response.data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not analyze that certificate.");
    } finally {
      clearTimeout(step1);
      clearTimeout(step2);
      setBusy(false);
    }
  };

  const discard = () => {
    setResult(null);
    setForm(EMPTY_FORM);
    setFile(null);
    setError(null);
    setSaveMessage(null);
  };

  const acceptAndSave = async () => {
    if (!result) return;
    if (form.name.trim().length < 2) {
      setError("Give the certificate a name of at least 2 characters before saving.");
      return;
    }
    setSaving(true);
    setSavePhase("uploading");
    setError(null);
    try {
      // The analyzed document has to reach storage *before* the record is
      // created, otherwise the certificate lands with details but no file
      // attached and the original upload is lost.
      let documentKey: string | null = null;
      let documentName: string | null = null;
      let storageKey: string | null = null;
      let mimeType: string | null = null;
      let fileSize: number | null = null;
      if (file) {
        const uploaded = await uploadImage(file);
        // Store the served path, not the R2 key: the UI resolves it with
        // getImageUrl(), which only rewrites `/api/upload/...` values.
        documentKey = uploaded.url;
        documentName = uploaded.originalName || file.name;
        storageKey = uploaded.key;
        mimeType = file.type || null;
        fileSize = file.size ?? null;
      }

      setSavePhase("saving");
      await createCertificateApi({
        name: form.name.trim(),
        organization: form.organization.trim() || null,
        issueDate: form.issueDate || null,
        credentialId: form.credentialId.trim() || null,
        credentialUrl: form.credentialUrl.trim() || "",
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        documentKey,
        documentName,
        // Never public on creation — the student publishes it deliberately.
        visibility: "private",
      });

      // Mirror the Certificates page: also file the proof under Documents.
      if (documentKey) {
        try {
          await createDocumentApi({
            filename: documentName || "certificate",
            originalName: documentName,
            mimeType,
            fileSize,
            storageKey: storageKey ?? documentKey,
            category: "Certificates",
          });
        } catch {
          // Best effort: the certificate itself is already saved.
        }
      }

      setSaveMessage(
        "Saved to your certificates, with the file attached. Open Certificates to make it public once you have checked the details.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the certificate.");
    } finally {
      setSaving(false);
      setSavePhase("idle");
    }
  };

  return {
    file,
    setFile,
    busy,
    saving,
    savePhase,
    phase,
    error,
    saveMessage,
    result,
    form,
    setForm,
    runAnalysis,
    discard,
    acceptAndSave,
  };
}
