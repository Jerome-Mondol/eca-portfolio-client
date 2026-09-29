"use client";

import { createDocumentApi } from "@/lib/api";

/**
 * Mirrors each proof image into the Documents list.
 *
 * Failures are swallowed on purpose: the achievement itself has already been
 * saved, and a document row is a convenience copy, not part of the same write.
 */
export async function mirrorProofImages(images: string[], title: string): Promise<void> {
  for (const imageUrl of images) {
    try {
      const filename = imageUrl.split("/").pop() || `${title}-proof`;
      await createDocumentApi({
        filename,
        originalName: filename,
        storageKey: imageUrl,
        mimeType: imageUrl.endsWith(".pdf") ? "application/pdf" : "image/jpeg",
        category: "Awards",
      });
    } catch {
      // Ignored — see above.
    }
  }
}
