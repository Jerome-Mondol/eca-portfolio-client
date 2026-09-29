import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import type { AiProjectSuggestion } from "@/lib/api";
import type { Draft } from "./ai-shared";
import { ProjectDescriptionEditor } from "./project-description-editor";
import { ProjectHighlights, ProjectTechnologies, ProjectTitleSuggestion } from "./project-detail-editors";
import { ProjectMissingQuestions } from "./project-missing-questions";

type ProjectSuggestionCardProps = {
  suggestion: AiProjectSuggestion | null;
  improving: boolean;
  saving: boolean;
  sourceId: string;
  currentTitle: string;
  baseline: string;
  draft: Draft;
  onDraftChange: (draft: Draft) => void;
  showDiff: boolean;
  onToggleDiff: () => void;
  ungroundedTech: string[];
  diffStats: { added: number; removed: number } | null;
  answers: Record<string, string>;
  onAnswerChange: (question: string, value: string) => void;
  onRewriteWithAnswers: () => void;
  onSave: (asNew: boolean) => void;
  onCopy: () => void;
  onReset: () => void;
};

/** The right-hand card: the grounded rewrite, what changed, and the save actions. */
export function ProjectSuggestionCard(props: ProjectSuggestionCardProps) {
  const { suggestion } = props;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm">Suggestion</h3>
        {suggestion && (
          <div className="flex items-center gap-1.5">
            {props.diffStats && (props.diffStats.added > 0 || props.diffStats.removed > 0) && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 tabular-nums">
                <span className="text-emerald-700">+{props.diffStats.added}</span>
                <span className="mx-1 text-muted-foreground">/</span>
                <span className="text-red-600">&minus;{props.diffStats.removed}</span>
              </Badge>
            )}
            <Badge
              variant={suggestion.confidence >= 0.6 ? "success" : suggestion.confidence >= 0.35 ? "warning" : "danger"}
              className="text-[10px] py-0 px-1.5 tabular-nums"
            >
              {Math.round(suggestion.confidence * 100)}% usable detail
            </Badge>
          </div>
        )}
      </div>

      {!suggestion ? (
        <div className="mt-4 rounded-xl border border-dashed border-border bg-surface-brand p-4 text-sm text-muted-foreground">
          {props.improving ? (
            <span className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Rewriting your notes...
            </span>
          ) : (
            "Write what you built on the left, then hit Improve. You will see exactly what changed before anything is saved."
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {suggestion.confidence < 0.4 && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
              Your notes are thin, so this rewrite could only tidy the wording. The questions below are what would actually make this
              entry convincing.
            </p>
          )}

          <ProjectDescriptionEditor
            draft={props.draft}
            onDraftChange={props.onDraftChange}
            baseline={props.baseline}
            showDiff={props.showDiff}
            onToggleDiff={props.onToggleDiff}
          />

          <ProjectTitleSuggestion
            draft={props.draft}
            onDraftChange={props.onDraftChange}
            suggestedTitle={suggestion.title ?? ""}
            currentTitle={props.currentTitle}
            onAccept={() => props.onDraftChange({ ...props.draft, title: suggestion.title! })}
          />

          <ProjectTechnologies draft={props.draft} onDraftChange={props.onDraftChange} ungrounded={props.ungroundedTech} />

          <ProjectHighlights draft={props.draft} onDraftChange={props.onDraftChange} />

          <ProjectMissingQuestions
            missing={suggestion.missing}
            answers={props.answers}
            onAnswerChange={props.onAnswerChange}
            onRewrite={props.onRewriteWithAnswers}
            improving={props.improving}
          />

          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={() => props.onSave(false)} disabled={props.saving}>
              {props.saving ? "Saving..." : props.sourceId ? "Save to this project" : "Create project"}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => props.onSave(true)} disabled={props.saving}>
              Save as new
            </Button>
            <Button size="sm" variant="ghost" onClick={props.onCopy} disabled={props.saving}>
              <Copy size={12} className="mr-1.5" /> Copy
            </Button>
            <Button size="sm" variant="ghost" onClick={props.onReset} disabled={props.saving || props.improving}>
              Discard
            </Button>
          </div>

          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2">
            Nothing is published automatically. Review, edit, then save.
          </p>
        </div>
      )}
    </Card>
  );
}
