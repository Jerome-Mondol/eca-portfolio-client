import { Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TextField, SkillsField, FieldGrid } from "@/components/dashboard/fields";
import { DateField } from "@/components/dashboard/date-field";
import type { Course, Certificate } from "@/lib/api";

type CourseFormProps = {
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  certificates: Certificate[];
};

/**
 * Course fields only — the card, expand wrapper and submit button belong to
 * `FormShell`, so this file is just the inputs.
 */
export function CourseForm({ values, set, certificates }: CourseFormProps) {
  return (
    <>
      <TextField label="Name *" value={values.name} onChange={(v) => set("name", v)} placeholder="Full Stack Web Development" required />

      <FieldGrid>
        <TextField label="Provider" value={values.provider} onChange={(v) => set("provider", v)} placeholder="Programming Hero" />
        <TextField label="Instructor" value={values.instructor} onChange={(v) => set("instructor", v)} placeholder="Jhankar Mahbub" />
      </FieldGrid>

      <FieldGrid>
        <DateField value={values.startDate} onChange={(v) => set("startDate", v)} label="Start date" placeholder="Pick start" />
        <DateField value={values.completionDate} onChange={(v) => set("completionDate", v)} label="Completion date" placeholder="Pick completion" />
      </FieldGrid>

      <div>
        <Label>Link certificate (optional)</Label>
        <div className="mt-1.5">
          <Select
            value={values.certificateId}
            onChange={(v) => set("certificateId", v)}
            options={[
              { value: "", label: "No certificate linked" },
              ...certificates.map((c) => ({
                value: c.id,
                label: `${c.name}${c.organization ? ` • ${c.organization}` : ""}`,
              })),
            ]}
            placeholder="Select a certificate"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Select a certificate to prove this course. You can link later.</p>
      </div>

      <TextField label="Description" value={values.description} onChange={(v) => set("description", v)} placeholder="What you learned" />
      <SkillsField value={values.skills} onChange={(v) => set("skills", v)} />
    </>
  );
}

/** Certificate the course links to, if any. */
export function linkedCertificate(course: Course, certificates: Certificate[]): Certificate | undefined {
  return certificates.find((c) => c.id === (course as { certificateId?: string | null }).certificateId);
}
