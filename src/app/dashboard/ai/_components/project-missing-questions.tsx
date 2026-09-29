import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import type { AiProjectSuggestion } from "@/lib/api";
import { MISSING_LABEL } from "./ai-shared";

/**
 * The gaps the model refused to fill.
 *
 * Anything it could not ground from the notes comes back as a question
 * instead of being invented. Answers are folded into the next rewrite and
 * stored with the notes, never published on their own.
 */
export function ProjectMissingQuestions({
  missing,
  answers,
  onAnswerChange,
  onRewrite,
  improving,
}: {
  missing: AiProjectSuggestion["missing"];
  answers: Record<string, string>;
  onAnswerChange: (question: string, value: string) => void;
  onRewrite: () => void;
  improving: boolean;
}) {
  if (missing.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/35 bg-surface-brand p-4">
      <p className="text-xs font-semibold text-primary-strong uppercase tracking-wide">What the AI would not invent</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Answer these and the next rewrite gets stronger. They are saved with your notes, not published on their own.
      </p>

      <ul className="mt-3 space-y-3">
        {missing.map((item) => (
          <li key={item.question}>
            <div className="flex items-baseline gap-2">
              <Badge variant="warning" className="shrink-0 text-[10px] py-0 px-1.5">
                {MISSING_LABEL[item.field]}
              </Badge>
              <p className="text-xs font-medium leading-4">{item.question}</p>
            </div>
            {item.why && <p className="mt-0.5 text-[11px] text-muted-foreground leading-4">{item.why}</p>}
            <Input
              value={answers[item.question] ?? ""}
              onChange={(e) => onAnswerChange(item.question, e.target.value)}
              placeholder="Your answer"
              className="mt-1.5 h-9 text-xs"
            />
          </li>
        ))}
      </ul>

      {Object.values(answers).some((value) => value.trim()) && (
        <Button size="sm" variant="secondary" className="mt-3" onClick={onRewrite} disabled={improving}>
          {improving ? "Rewriting..." : "Rewrite with these answers"}
          <ArrowRight size={12} className="ml-1.5" />
        </Button>
      )}
    </div>
  );
}
