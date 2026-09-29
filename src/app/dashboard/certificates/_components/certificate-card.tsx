import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemActions } from "@/components/dashboard/item-actions";
import { getImageUrl } from "@/lib/upload";
import { formatDateOr } from "@/lib/format";
import { FileText } from "lucide-react";
import type { Certificate } from "@/lib/api";

type CertificateCardProps = {
  certificate: Certificate;
  onEdit: () => void;
  onDelete: () => void;
};

/** PDF links render as a labelled tile; images as a cover. */
function isPdfRef(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf") || url.toLowerCase().includes("application/pdf");
}

function CertificatePreview({ documentKey, documentName, name }: { documentKey: string; documentName?: string | null; name: string }) {
  if (isPdfRef(documentKey)) {
    return (
      <div className="h-32 bg-surface-2 border-b border-border flex flex-col items-center justify-center gap-1 p-3">
        <FileText size={20} className="text-muted" />
        <p className="text-xs text-muted truncate max-w-[180px]">{documentName || documentKey.split("/").pop()}</p>
        <a href={getImageUrl(documentKey)} target="_blank" rel="noreferrer" className="text-xs bg-card border border-border rounded-full px-2 py-1 hover:bg-surface-2 cursor-pointer">
          View PDF
        </a>
      </div>
    );
  }
  return <img src={getImageUrl(documentKey)} alt={name} className="h-32 w-full object-cover" />;
}

/** One certificate in the grid. */
export function CertificateCard({ certificate: c, onEdit, onDelete }: CertificateCardProps) {
  const documentKey = (c as { documentKey?: string | null }).documentKey;
  const documentName = (c as { documentName?: string | null }).documentName;

  return (
    <Card className="overflow-hidden h-full">
      {documentKey ? (
        <CertificatePreview documentKey={documentKey} documentName={documentName} name={c.name} />
      ) : (
        <div className="h-32 bg-surface-2 border-b border-border flex items-center justify-center">
          <span className="text-xs text-muted-foreground">No file</span>
        </div>
      )}

      <div className="p-4">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">CERTIFICATE</p>
        <h3 className="font-semibold text-sm mt-2">{c.name}</h3>
        <p className="text-xs text-muted">
          {c.organization ?? "—"} • {formatDateOr(c.issueDate, "")}
        </p>

        {c.credentialId && <p className="text-xs text-muted-foreground mt-1">ID: {c.credentialId}</p>}

        {c.skills && c.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {c.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        )}

        <ItemActions onEdit={onEdit} onDelete={onDelete} />

        {c.credentialUrl && (
          <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs text-foreground underline cursor-pointer">
            View credential →
          </a>
        )}
      </div>
    </Card>
  );
}
