import { TextField, SkillsField, FieldGrid } from "@/components/dashboard/fields";
import { DateField } from "@/components/dashboard/date-field";
import { SingleUploadField } from "@/components/dashboard/file-upload-field";

type CertificateFormProps = {
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  documentKey: string | null;
  documentName: string | null;
  onDocumentChange: (url: string | null, name: string | null) => void;
};

/** Certificate fields only. */
export function CertificateForm({ values, set, documentKey, documentName, onDocumentChange }: CertificateFormProps) {
  return (
    <>
      <TextField label="Name *" value={values.name} onChange={(v) => set("name", v)} placeholder="Full Stack Web Development" required />

      <FieldGrid>
        <TextField label="Organization" value={values.org} onChange={(v) => set("org", v)} placeholder="Programming Hero" />
        <DateField value={values.issueDate} onChange={(v) => set("issueDate", v)} label="Issue date" placeholder="Pick issue date" />
      </FieldGrid>

      <FieldGrid>
        <TextField
          label={
            <>
              Credential ID <span className="text-muted-foreground font-normal">(optional)</span>
            </>
          }
          value={values.credentialId}
          onChange={(v) => set("credentialId", v)}
          placeholder="PH-123"
          hint="Leave blank if none."
        />
        <TextField label="Credential URL" value={values.credentialUrl} onChange={(v) => set("credentialUrl", v)} placeholder="https://..." />
      </FieldGrid>

      <SingleUploadField
        value={documentKey}
        fileName={documentName}
        onChange={(url, meta) => onDocumentChange(url, meta?.originalName ?? null)}
        title="Upload certificate image or PDF"
        subtitle="Will be shown in your public portfolio."
      />

      <SkillsField value={values.skills} onChange={(v) => set("skills", v)} />
    </>
  );
}
