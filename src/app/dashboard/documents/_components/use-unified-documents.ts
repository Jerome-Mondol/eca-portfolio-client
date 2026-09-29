"use client";

import { useMemo } from "react";
import { getImageUrl } from "@/lib/upload";
import {
  listDocumentsApi,
  listCertificatesApi,
  listAchievementsApi,
  listProjectsApi,
  type Achievement,
  type Certificate,
  type Document,
  type Project,
} from "@/lib/api";
import { useResource } from "@/lib/store";

/** A document from any source, flattened into one row for the library. */
export type UnifiedDocument = {
  id: string;
  filename: string;
  category: string;
  url: string;
  mimeType?: string;
  fileSize?: number;
  source: "document" | "certificate" | "achievement" | "project";
  sourceName?: string;
  createdAt?: string;
};

/** A URL only looks like a PDF if it says so — the only mime signal we have. */
function mimeOf(url: string): string {
  return url.endsWith(".pdf") ? "application/pdf" : "image/jpeg";
}

/**
 * Merges four separate resources into one document library.
 *
 * Only files uploaded directly here are deletable; the rest are projections of
 * records owned by their own section, and the card reflects that.
 */
export function useUnifiedDocuments() {
  // Four synchronous store reads — all warmed on shell mount, so the aggregated
  // list renders on the first frame instead of after four round trips.
  const { data: docsData, loading } = useResource<{ data: Document[] }>("documents", listDocumentsApi);
  const { data: certsData } = useResource<{ data: Certificate[] }>("certificates", listCertificatesApi);
  const { data: achsData } = useResource<{ data: Achievement[] }>("achievements", listAchievementsApi);
  const { data: projsData } = useResource<{ data: Project[] }>("projects", listProjectsApi);

  const items = useMemo<UnifiedDocument[]>(() => {
    const list: UnifiedDocument[] = [];

    // Manual / direct upload documents.
    (docsData?.data ?? []).forEach((d) => {
      const fileUrl = (d as { storageKey?: string; fileKey?: string }).storageKey || (d as { fileKey?: string }).fileKey || d.filename || "";
      list.push({
        id: d.id,
        filename: d.filename || d.originalName || "Document",
        category: d.category || "Other",
        url: getImageUrl(fileUrl),
        mimeType: d.mimeType || mimeOf(fileUrl),
        fileSize: d.fileSize || undefined,
        source: "document",
        createdAt: d.createdAt,
      });
    });

    (certsData?.data ?? []).forEach((c) => {
      if (!c.documentKey) return;
      list.push({
        id: `cert-${c.id}`,
        filename: c.name ? `${c.name} (Certificate)` : "Certificate Proof",
        category: "Certificates",
        url: getImageUrl(c.documentKey),
        mimeType: mimeOf(c.documentKey),
        source: "certificate",
        sourceName: c.name,
        createdAt: c.createdAt,
      });
    });

    (achsData?.data ?? []).forEach((a) => {
      (a.images ?? []).forEach((img, idx) => {
        list.push({
          id: `ach-${a.id}-${idx}`,
          filename: `${a.title}${(a.images ?? []).length > 1 ? ` (${idx + 1})` : ""}`,
          category: "Awards",
          url: getImageUrl(img),
          mimeType: mimeOf(img),
          source: "achievement",
          sourceName: a.title,
          createdAt: a.createdAt,
        });
      });
    });

    (projsData?.data ?? []).forEach((p) => {
      if (!p.coverImage) return;
      list.push({
        id: `proj-${p.id}`,
        filename: `${p.title} Cover`,
        category: "Projects",
        url: getImageUrl(p.coverImage),
        mimeType: mimeOf(p.coverImage),
        source: "project",
        sourceName: p.title,
        createdAt: p.createdAt,
      });
    });

    return list;
  }, [docsData, certsData, achsData, projsData]);

  return { items, loading };
}
