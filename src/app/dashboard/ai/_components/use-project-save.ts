"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { createProjectApi, updateProjectApi } from "@/lib/api";
import { capForCard, type Draft } from "./ai-shared";

/**
 * Persist an AI draft back into Projects.
 *
 * Two paths: update the project the notes came from, or branch it into a new
 * one. Highlights go to the details field, because that is what the project
 * card reads — the description itself is capped by the server schema.
 */
export function useProjectSave(sourceId: string, onSaved: () => void) {
  const { success, error: toastError } = useToast();
  const [saving, setSaving] = useState(false);

  const buildPayload = (draft: Draft, title: string) => {
    const card = capForCard(draft.description);
    return {
      title: (draft.title || title || "Untitled project").trim(),
      description: card.text,
      detailedDescription: draft.highlights.length ? draft.highlights.map((h) => `• ${h}`).join("\n") : undefined,
      technologies: draft.technologies.length ? draft.technologies : undefined,
    };
  };

  const save = async (draft: Draft, title: string, asNew: boolean) => {
    if (!capForCard(draft.description).text.trim()) {
      toastError("Nothing to save", "The description is empty.");
      return;
    }

    const isUpdate = !asNew && !!sourceId;
    setSaving(true);
    try {
      if (isUpdate) {
        await updateProjectApi(sourceId, buildPayload(draft, title));
        success("Project updated", "Open Projects to see your change.");
      } else {
        // New projects start hidden so an AI-assisted draft is never published
        // the moment it is created.
        await createProjectApi({ ...buildPayload(draft, title), visibility: "private" });
        success("Project created", "It is hidden until you publish it from Projects.");
      }
      onSaved();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : "Could not save the project.");
    } finally {
      setSaving(false);
    }
  };

  const copy = async (description: string) => {
    try {
      await navigator.clipboard.writeText(description);
      success("Copied to clipboard");
    } catch {
      toastError("Could not copy", "Your browser blocked clipboard access.");
    }
  };

  return { saving, save, copy };
}
