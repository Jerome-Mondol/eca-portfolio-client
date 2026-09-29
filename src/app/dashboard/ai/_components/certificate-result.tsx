import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AiAnalysis } from "@/lib/api";
import { STATUS_LABEL, type CertForm } from "./ai-shared";

/** The 0-100 evidence score and the per-check breakdown behind it. */
export function CertificateScorecard({ result }: { result: AiAnalysis }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold">Evidence score</p>
        <p className="text-2xl font-semibold">
          {result.score}
          <span className="text-sm font-normal text-muted-foreground">/100</span>
        </p>
      </div>
      <p className="text-xs text-muted mt-1">This rates how well-evidenced the document is, not your ability.</p>
      <ul className="mt-3 space-y-1.5">
        {result.checks.map((check) => (
          <li key={check.key} className="flex gap-2 text-xs">
            <span className={check.passed ? "text-emerald-600" : "text-muted-foreground"}>{check.passed ? "✓" : "○"}</span>
            <span>
              <span className="font-medium">{check.label}</span>
              <span className="text-muted-foreground"> · {check.weight} pts</span>
              <span className="block text-muted">{check.reason}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Web sources consulted while checking the issuer. */
export function CertificateSources({ result }: { result: AiAnalysis }) {
  const { sources, accreditation, unavailable } = result.research;
  if (sources.length === 0 && !unavailable) return null;

  return (
    <>
      {sources.length > 0 && (
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">Sources consulted</p>
          <ul className="mt-2 space-y-1">
            {sources.map((source) => (
              <li key={source.url} className="text-xs">
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 break-all">
                  {source.title || source.url}
                </a>
              </li>
            ))}
          </ul>
          {accreditation && <p className="mt-2 text-xs text-muted">Accreditation: {accreditation}</p>}
        </div>
      )}

      {unavailable && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
          We could not check the issuer on this run, so that check scores zero. That is not a sign of a fake certificate. Try again later.
        </p>
      )}
    </>
  );
}

/** The right-hand card: score, extracted fields, sources, and the save actions. */
export function CertificateResultCard(props: {
  result: AiAnalysis | null;
  form: CertForm;
  onFormChange: (form: CertForm) => void;
  saving: boolean;
  savePhase: "idle" | "uploading" | "saving";
  onSave: () => void;
  onReanalyze: () => void;
  onDiscard: () => void;
  saveMessage: string | null;
  error: string | null;
  busy: boolean;
  fields: ReactNode;
}) {
  const { result } = props;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm">Analysis result</h3>
        {result && (
          <Badge variant={result.status === "verified" ? "success" : result.status === "partially_verified" ? "warning" : "danger"}>
            {STATUS_LABEL[result.status]}
          </Badge>
        )}
      </div>

      {props.error && (
        <p className="mt-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{props.error}</p>
      )}

      {!result ? (
        <p className="text-sm text-muted mt-6 text-center py-8 border border-dashed border-border rounded-xl bg-surface-2">
          Upload a certificate to see extracted fields.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <CertificateScorecard result={result} />
          {props.fields}
          <CertificateSources result={result} />

          {props.saveMessage && (
            <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-3">{props.saveMessage}</p>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={props.onSave} disabled={props.saving || props.form.name.trim().length < 2}>
              {props.savePhase === "uploading"
                ? "Uploading file..."
                : props.savePhase === "saving"
                  ? "Saving..."
                  : "Add to Certificates"}
            </Button>
            <Button size="sm" variant="secondary" onClick={props.onReanalyze} disabled={props.busy}>
              Re-analyze
            </Button>
            <Button size="sm" variant="ghost" onClick={props.onDiscard} disabled={props.busy || props.saving}>
              Discard
            </Button>
          </div>
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2">
            Never silently publish AI-extracted info. Student reviews → Accept/Edit/Reject → DB.
          </p>
        </div>
      )}
    </Card>
  );
}
