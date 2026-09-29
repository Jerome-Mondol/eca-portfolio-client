import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink, Trash2, Loader2 } from "lucide-react";
import type { UnifiedDocument } from "./use-unified-documents";

type DocumentCardProps = {
  document: UnifiedDocument;
  deleting: boolean;
  onDelete: () => void;
};

/** PDF badge in place of a thumbnail, since a PDF has no image to show. */
function Preview({ document }: { document: UnifiedDocument }) {
  const isPdf = document.mimeType === "application/pdf" || document.url.toLowerCase().endsWith(".pdf");

  return (
    <div className="mt-3 rounded-lg overflow-hidden border border-border-soft bg-surface-2 h-32 flex items-center justify-center relative group">
      {isPdf ? (
        <div className="flex flex-col items-center gap-1 text-muted">
          <FileText size={32} className="text-foreground" />
          <span className="text-xs font-medium uppercase tracking-wider">PDF Document</span>
        </div>
      ) : (
        <img src={document.url} alt={document.filename} className="w-full h-full object-cover transition transform group-hover:scale-105" />
      )}
    </div>
  );
}

export function DocumentCard({ document, deleting, onDelete }: DocumentCardProps) {
  // Only direct uploads are owned by this screen; the rest are projections.
  const owned = document.source === "document";

  return (
    <Card className="p-4 flex flex-col justify-between space-y-3 hover:border-border-strong transition">
      <div>
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs font-normal bg-surface-2 text-muted-strong">
            {document.category}
          </Badge>
          {!owned && (
            <span className="text-[10px] text-muted-foreground bg-surface-2 px-2 py-0.5 rounded-full capitalize">
              from {document.source}
            </span>
          )}
        </div>

        <Preview document={document} />

        <p className="text-sm font-semibold mt-3 text-foreground truncate" title={document.filename}>
          {document.filename}
        </p>
        {document.sourceName && <p className="text-xs text-muted truncate">Linked: {document.sourceName}</p>}
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-border-soft">
        <a
          href={document.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium border border-border rounded-full px-3 py-1.5 hover:bg-surface-2 cursor-pointer flex-1 flex items-center justify-center gap-1.5 text-foreground min-h-[36px]"
        >
          <ExternalLink size={12} /> View
        </a>
        {owned && (
          <button
            onClick={onDelete}
            disabled={deleting}
            aria-label={`Delete ${document.filename}`}
            className="text-xs font-medium border border-red-200 text-red-600 rounded-full px-3 py-1.5 hover:bg-red-50 cursor-pointer flex items-center justify-center gap-1 min-h-[36px] disabled:opacity-50"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        )}
      </div>
    </Card>
  );
}
