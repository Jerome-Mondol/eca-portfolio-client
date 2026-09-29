import { Check, Copy, ExternalLink } from "lucide-react";

type PortfolioLinkCardProps = {
  portfolioPath: string;
  portfolioUrl: string;
  copied: boolean;
  onCopy: () => void;
};

/** The shareable public URL, plus the visibility note below it. */
export function PortfolioLinkCard({ portfolioPath, portfolioUrl, copied, onCopy }: PortfolioLinkCardProps) {
  return (
    <>
      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Portfolio link</p>
        <div className="rounded-xl border border-border bg-surface-2 p-3 flex items-center gap-2">
          <span className="text-sm font-mono truncate flex-1">{portfolioPath}</span>
          <button onClick={onCopy} className="h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-surface-2 cursor-pointer shrink-0" aria-label="Copy link">
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
          </button>
          <a href={portfolioUrl} target="_blank" rel="noreferrer" className="h-8 w-8 rounded-full bg-primary-strong text-white flex items-center justify-center hover:bg-black cursor-pointer shrink-0" aria-label="Open portfolio">
            <ExternalLink size={14} />
          </a>
        </div>
        <p className="text-xs text-muted-foreground">Share for applications. Anyone with link can view.</p>
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Visibility</p>
        <div className="rounded-xl border border-border p-3 flex items-center justify-between">
          <span className="text-sm font-medium">Public portfolio</span>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-1">Enabled</span>
        </div>
      </div>
    </>
  );
}
