import { Input, Label } from "@/components/ui/input";
import { Check, AlertCircle } from "lucide-react";
import type { Draft } from "./ai-shared";

/** A retitled project, offered as a one-click swap. */
export function ProjectTitleSuggestion({
  draft,
  onDraftChange,
  suggestedTitle,
  currentTitle,
  onAccept,
}: {
  draft: Draft;
  onDraftChange: (draft: Draft) => void;
  suggestedTitle: string;
  currentTitle: string;
  onAccept: () => void;
}) {
  if (suggestedTitle.trim() === currentTitle.trim()) return null;

  return (
    <div>
      <Label>Suggested title</Label>
      <div className="mt-1.5 flex items-center gap-2">
        <Input value={draft.title} onChange={(e) => onDraftChange({ ...draft, title: e.target.value })} className="flex-1" />
        <button
          type="button"
          onClick={onAccept}
          className="shrink-0 text-[11px] text-muted underline underline-offset-2 hover:text-foreground cursor-pointer"
        >
          use
        </button>
      </div>
    </div>
  );
}

/** Technology chips, flagged when the model listed one the notes never mention. */
export function ProjectTechnologies({
  draft,
  onDraftChange,
  ungrounded,
}: {
  draft: Draft;
  onDraftChange: (draft: Draft) => void;
  ungrounded: string[];
}) {
  if (draft.technologies.length === 0) return null;

  const remove = (tech: string) => onDraftChange({ ...draft, technologies: draft.technologies.filter((t) => t !== tech) });
  const one = ungrounded.length === 1;

  return (
    <div>
      <Label>Technologies</Label>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {draft.technologies.map((tech) => {
          const grounded = !ungrounded.includes(tech);
          return (
            <span
              key={tech}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
                grounded ? "border-border bg-surface-2 text-muted-strong" : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              {grounded ? <Check size={10} /> : <AlertCircle size={10} />}
              {tech}
              <button
                type="button"
                onClick={() => remove(tech)}
                className="ml-0.5 text-muted-foreground hover:text-red-600 cursor-pointer"
                aria-label={`Remove ${tech}`}
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
      {ungrounded.length > 0 && (
        <p className="mt-1.5 text-[11px] text-amber-700">
          {ungrounded.join(", ")} {one ? "is" : "are"} not mentioned anywhere in your notes. Remove {one ? "it" : "them"} unless you
          actually used {one ? "it" : "them"}.
        </p>
      )}
    </div>
  );
}

/** Editable highlights, saved into the project's details field. */
export function ProjectHighlights({ draft, onDraftChange }: { draft: Draft; onDraftChange: (draft: Draft) => void }) {
  if (draft.highlights.length === 0) return null;

  const setAt = (index: number, value: string) => {
    const next = [...draft.highlights];
    next[index] = value;
    onDraftChange({ ...draft, highlights: next });
  };
  const removeAt = (index: number) => onDraftChange({ ...draft, highlights: draft.highlights.filter((_, i) => i !== index) });

  return (
    <div>
      <Label>Highlights (saved to the project details field)</Label>
      <ul className="mt-1.5 space-y-1.5">
        {draft.highlights.map((highlight, index) => (
          <li key={index} className="flex gap-2 text-xs">
            <Check size={12} className="mt-0.5 shrink-0 text-emerald-600" />
            <input
              value={highlight}
              onChange={(e) => setAt(index, e.target.value)}
              className="flex-1 bg-transparent border-0 p-0 text-sm focus:outline-none focus:ring-0"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="shrink-0 text-muted-foreground hover:text-red-600 cursor-pointer"
              aria-label="Remove highlight"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
