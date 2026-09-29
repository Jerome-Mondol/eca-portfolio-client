import { TextField, TextAreaField, SkillsField, FieldGrid } from "@/components/dashboard/fields";
import { DateField } from "@/components/dashboard/date-field";
import { Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EXPERIENCE_CATEGORIES } from "./experience-categories";

type ExperienceFormProps = {
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  current: boolean;
  onToggleCurrent: (current: boolean) => void;
};

/** Experience fields. "Current" disables the end date, so it lives here. */
export function ExperienceForm({ values, set, current, onToggleCurrent }: ExperienceFormProps) {
  return (
    <>
      <FieldGrid>
        <TextField
          label="Title / Position *"
          value={values.position}
          onChange={(v) => set("position", v)}
          placeholder="e.g. Graphic Designer, Frontend Intern, Lead Organizer"
          required
        />
        <div>
          <Label>Category *</Label>
          <div className="mt-1.5">
            <Select
              value={values.category}
              onChange={(v) => set("category", v)}
              options={EXPERIENCE_CATEGORIES}
              placeholder="Select category"
            />
          </div>
        </div>
      </FieldGrid>

      <FieldGrid>
        <TextField
          label="Organization / Company / Platform"
          value={values.organization}
          onChange={(v) => set("organization", v)}
          placeholder="e.g. ABC Studio, Tech Club, Coursera"
        />
        <TextField
          label="Location"
          value={values.location}
          onChange={(v) => set("location", v)}
          placeholder="e.g. Dhaka, Remote, Hybrid"
        />
      </FieldGrid>

      <div className="grid sm:grid-cols-3 gap-3">
        <DateField value={values.startDate} onChange={(v) => set("startDate", v)} label="Start date" placeholder="Pick start" />
        <DateField value={values.endDate} onChange={(v) => set("endDate", v)} label="End date" placeholder="Pick end" disabled={current} />
        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              checked={current}
              onChange={(e) => onToggleCurrent(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary-strong"
            />
            Current / Ongoing
          </label>
        </div>
      </div>

      <TextAreaField
        label="Description"
        value={values.description}
        onChange={(v) => set("description", v)}
        placeholder="Describe what you worked on, key achievements, roles or responsibilities..."
      />
      <SkillsField
        value={values.skills}
        onChange={(v) => set("skills", v)}
        placeholder="e.g. Photoshop, Event Management, React, Leadership"
      />
    </>
  );
}
