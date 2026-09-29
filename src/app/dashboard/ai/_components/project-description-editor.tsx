import { Textarea, Label } from "@/components/ui/input";
import { diffWords } from "@/lib/diff";
import { CARD_MAX, capForCard, type Draft } from "./ai-shared";

/** The rewrite itself, switchable to a word-level diff against the notes. */
export function ProjectDescriptionEditor({
  draft,
  onDraftChange,
  baseline,
  showDiff,
  onToggleDiff,
}: {
  draft: Draft;
  onDraftChange: (draft: Draft) => void;
  baseline: string;
  showDiff: boolean;
  onToggleDiff: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Label>{showDiff ? "What changed" : "Description"}</Label>
        <button
          type="button"
          onClick={onToggleDiff}
          className="text-[11px] text-muted underline underline-offset-2 hover:text-foreground cursor-pointer"
        >
          {showDiff ? "Edit" : "Show diff"}
        </button>
      </div>

      {showDiff ? (
        <div className="mt-1.5 rounded-xl border border-border bg-surface-2 p-3 text-sm leading-6">
          {diffWords(baseline, draft.description).map((part, index) => (
            <span
              key={index}
              className={
                part.kind === "added"
                  ? "bg-emerald-100 text-emerald-900 rounded px-0.5"
                  : part.kind === "removed"
                    ? "bg-red-100 text-red-800 line-through rounded px-0.5"
                    : undefined
              }
            >
              {part.text}
            </span>
          ))}
          <span className="mt-2 flex flex-wrap items-center gap-3 border-t border-border pt-2 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-200" /> added by the rewrite
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-200" /> dropped from your notes
            </span>
          </span>
        </div>
      ) : (
        <Textarea
          value={draft.description}
          onChange={(e) => onDraftChange({ ...draft, description: e.target.value })}
          rows={5}
          className="mt-1.5 leading-6"
        />
      )}

      {capForCard(draft.description).truncated && (
        <p className="mt-1.5 text-[11px] text-amber-700">
          Longer than {CARD_MAX} characters. The card preview is trimmed on save and the full text is kept in the details field.
        </p>
      )}
    </div>
  );
}
