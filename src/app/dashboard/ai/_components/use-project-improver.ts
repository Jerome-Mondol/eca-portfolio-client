"use client";

import { useMemo, useState } from "react";
import { diffSummary } from "@/lib/diff";
import { improveProjectApi, type AiProjectSuggestion, type Project } from "@/lib/api";
import { EMPTY_DRAFT, type Draft } from "./ai-shared";
import { useProjectSave } from "./use-project-save";

/** Fewer than this many characters is too little to rewrite meaningfully. */
const MIN_INPUT = 20;

/**
 * The grounded project improver.
 *
 * The model only rewrites wording — it never gets to invent a claim, and
 * anything it could not ground is reported back as a question instead.
 */
export function useProjectImprover(projects: Project[]) {
  const [sourceId, setSourceId] = useState("");
  const [title, setTitle] = useState("");
  const [input, setInput] = useState("");
  const [improving, setImproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSuggestion, setHasSuggestion] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  /** The notes as they were when the suggestion came back — the diff baseline. */
  const [baseline, setBaseline] = useState("");
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [suggestion, setSuggestion] = useState<AiProjectSuggestion | null>(null);

  /** Technologies the model listed that never appear in the student's own words. */
  const ungroundedTech = useMemo(() => {
    if (!suggestion) return [];
    const haystack = `${baseline} ${title} ${Object.values(answers).join(" ")}`.toLowerCase();
    return draft.technologies.filter((tech) => !haystack.includes(tech.trim().toLowerCase()));
  }, [suggestion, draft.technologies, baseline, title, answers]);

  const diffStats = useMemo(
    () => (suggestion ? diffSummary(baseline, draft.description) : null),
    [suggestion, baseline, draft.description],
  );

  const loadProject = (id: string) => {
    setSourceId(id);
    setError(null);
    setSuggestion(null);
    setAnswers({});
    if (!id) {
      setTitle("");
      setInput("");
      return;
    }
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    setTitle(project.title ?? "");
    setInput(project.description ?? "");
  };

  const reset = () => {
    setSuggestion(null);
    setHasSuggestion(false);
    setDraft(EMPTY_DRAFT);
    setBaseline("");
    setAnswers({});
    setError(null);
    setShowDiff(false);
  };

  /** Fold answered questions back into the notes so a re-run has more to work with. */
  const buildImprovedInput = (): string => {
    const answered = Object.values(answers)
      .map((value) => value.trim())
      .filter(Boolean);
    return answered.length ? `${input.trim()}\n\n${answered.join("\n")}` : input;
  };

  const runImprove = async (withAnswers = false) => {
    setImproving(true);
    setError(null);
    // Answers to the gap questions only help the rewrite if they actually reach
    // the model, so fold them into the notes on the follow-up pass.
    const source = withAnswers ? buildImprovedInput() : input;
    try {
      const response = await improveProjectApi({ description: source, title: title || null });
      setSuggestion(response.data);
      setHasSuggestion(true);
      setBaseline(source);
      setDraft({
        description: response.data.description,
        title: response.data.title ?? title,
        technologies: response.data.technologies,
        highlights: response.data.highlights,
      });
      setAnswers({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not improve that description.");
    } finally {
      setImproving(false);
    }
  };

  const persistence = useProjectSave(sourceId, reset);

  return {
    sourceId,
    loadProject,
    title,
    setTitle,
    input,
    setInput,
    improving,
    saving: persistence.saving,
    error,
    suggestion,
    hasSuggestion,
    baseline,
    draft,
    setDraft,
    showDiff,
    setShowDiff,
    answers,
    setAnswers,
    ungroundedTech,
    diffStats,
    canImprove: input.trim().length >= MIN_INPUT,
    runImprove,
    save: (asNew: boolean) => persistence.save(draft, title, asNew),
    copy: () => persistence.copy(draft.description),
    reset,
  };
}
