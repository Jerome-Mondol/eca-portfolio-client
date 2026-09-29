import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { VerifyResult } from "./use-link-verification";

/** Small badge recording whether a link was reachable when it was added. */
export function LinkStatusBadge({ verified }: { verified?: boolean }) {
  if (verified === true) {
    return (
      <Badge variant="success" className="text-[10px] py-0 px-1.5 gap-1 bg-emerald-50 text-emerald-700 border-emerald-200">
        <CheckCircle2 size={10} /> Verified
      </Badge>
    );
  }
  if (verified === false) {
    return (
      <Badge variant="danger" className="text-[10px] py-0 px-1.5 gap-1 bg-red-50 text-red-700 border-red-200">
        <AlertCircle size={10} /> Unreachable
      </Badge>
    );
  }
  return null;
}

type VerifyFeedbackProps = { verifying: boolean; result: VerifyResult | null };

/** Live verification banner shown under the URL field. */
export function VerifyFeedback({ verifying, result }: VerifyFeedbackProps) {
  if (verifying) {
    return (
      <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50/80 border border-amber-200/70 rounded-xl px-3 py-2 animate-pulse">
        <Loader2 size={14} className="animate-spin text-amber-600 shrink-0" />
        <span>Verifying link availability...</span>
      </div>
    );
  }
  if (!result) return null;

  const tone = result.valid
    ? "text-emerald-800 bg-emerald-50/80 border-emerald-200/80"
    : "text-red-800 bg-red-50/80 border-red-200/80";

  return (
    <div className={`flex items-center justify-between text-xs rounded-xl px-3 py-2 border transition-all ${tone}`}>
      <div className="flex items-center gap-2 min-w-0">
        {result.valid ? (
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
        ) : (
          <AlertCircle size={15} className="text-red-600 shrink-0" />
        )}
        <span className="truncate">
          {result.valid ? (
            <>
              <strong className="font-semibold text-emerald-900">{result.domain}</strong> — {result.message}
            </>
          ) : (
            <span>{result.message}</span>
          )}
        </span>
      </div>
      {result.valid && (
        <Badge variant="success" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-mono text-[10px] shrink-0 ml-2">
          {result.status || 200} OK
        </Badge>
      )}
    </div>
  );
}
