import { Input, Label } from "@/components/ui/input";
import type { CertForm } from "./ai-shared";

/** Extracted fields, editable before they are saved. */
export function CertificateExtractedFields({
  form,
  onChange,
  rawTextExcerpt,
}: {
  form: CertForm;
  onChange: (next: CertForm) => void;
  rawTextExcerpt?: string;
}) {
  const set = <K extends keyof CertForm>(key: K, value: CertForm[K]) => onChange({ ...form, [key]: value });

  return (
    <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
      <p className="text-xs font-semibold text-muted uppercase tracking-wide">Extracted — review before saving</p>
      <div>
        <Label>Course name</Label>
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Organization</Label>
        <Input value={form.organization} onChange={(e) => set("organization", e.target.value)} className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Issue date</Label>
          <Input type="date" value={form.issueDate} onChange={(e) => set("issueDate", e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label>Certificate ID</Label>
          <Input value={form.credentialId} onChange={(e) => set("credentialId", e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <Label>Verification URL</Label>
        <Input
          value={form.credentialUrl}
          onChange={(e) => set("credentialUrl", e.target.value)}
          className="mt-1"
          placeholder="https://"
        />
      </div>
      <div>
        <Label>Skills (comma separated)</Label>
        <Input value={form.skills} onChange={(e) => set("skills", e.target.value)} className="mt-1" />
      </div>
      {rawTextExcerpt && (
        <p className="text-xs text-muted-foreground border-t border-border pt-2">
          Read from the document: &ldquo;{rawTextExcerpt}&rdquo;
        </p>
      )}
    </div>
  );
}
