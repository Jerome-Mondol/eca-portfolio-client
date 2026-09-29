import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select, type SelectOption } from "@/components/ui/select";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import type { Project } from "@/lib/api";
import { CARD_MAX, SAMPLE_NOTES } from "./ai-shared";

type ProjectNotesCardProps = {
  projects: Project[];
  sourceId: string;
  onLoadProject: (id: string) => void;
  title: string;
  onTitleChange: (value: string) => void;
  input: string;
  onInputChange: (value: string) => void;
  improving: boolean;
  canImprove: boolean;
  hasSuggestion: boolean;
  onImprove: () => void;
  onReset: () => void;
  error: string | null;
};

/** The left card: the student's own notes, before any AI pass. */
export function ProjectNotesCard(props: ProjectNotesCardProps) {
  const sourceOptions: SelectOption[] = useMemo(
    () => [
      { value: "", label: "Start from scratch" },
      ...props.projects.map((project) => ({ value: project.id, label: project.title || "Untitled project" })),
    ],
    [props.projects],
  );

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm">Your notes</h3>
        {props.hasSuggestion && (
          <Badge variant="outline" className="text-[10px] py-0 px-1.5">
            AI draft — nothing saved yet
          </Badge>
        )}
      </div>
      <p className="text-xs text-muted mt-1">
        Write it the way you&apos;d say it out loud. The AI rewrites the wording, never the claims.
      </p>

      {props.projects.length > 0 && (
        <div className="mt-4">
          <Label>Start from</Label>
          <Select className="mt-1.5" value={props.sourceId} onChange={props.onLoadProject} options={sourceOptions} />
        </div>
      )}

      <div className="mt-4">
        <Label>Project title</Label>
        <Input value={props.title} onChange={(e) => props.onTitleChange(e.target.value)} placeholder="Club Registration System" className="mt-1.5" />
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <Label>What you built</Label>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {props.input.length} / {CARD_MAX}
          </span>
        </div>
        <Textarea
          value={props.input}
          onChange={(e) => props.onInputChange(e.target.value)}
          placeholder={SAMPLE_NOTES}
          rows={6}
          className="mt-1.5 leading-6"
        />
        {props.input.length === 0 && (
          <button
            type="button"
            onClick={() => props.onInputChange(SAMPLE_NOTES)}
            className="mt-1.5 text-xs text-muted underline underline-offset-2 hover:text-foreground cursor-pointer"
          >
            Use the example
          </button>
        )}
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        <Button size="sm" onClick={props.onImprove} disabled={props.improving || !props.canImprove}>
          {props.improving ? (
            <>
              <Loader2 size={13} className="mr-1.5 animate-spin" /> Rewriting...
            </>
          ) : props.hasSuggestion ? (
            <>
              <RotateCcw size={13} className="mr-1.5" /> Rewrite again
            </>
          ) : (
            <>
              <Sparkles size={13} className="mr-1.5" /> Improve
            </>
          )}
        </Button>
        {(props.hasSuggestion || props.input) && (
          <Button size="sm" variant="ghost" onClick={props.onReset} disabled={props.improving}>
            Clear
          </Button>
        )}
      </div>

      {props.input.trim().length > 0 && !props.canImprove && (
        <p className="mt-2 text-xs text-muted-foreground">A sentence or two is enough to work with.</p>
      )}

      {props.error && (
        <p className="mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{props.error}</p>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Flow: Notes &rarr; grounded rewrite &rarr; gaps reported &rarr; you edit &rarr; you save
      </p>
    </Card>
  );
}
