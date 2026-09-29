import { TextField, TextAreaField, FieldGrid } from "@/components/dashboard/fields";
import { DateField } from "@/components/dashboard/date-field";
import { MultiUploadField } from "@/components/dashboard/file-upload-field";
import { Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ACHIEVEMENT_CATEGORIES } from "./achievement-categories";

type AchievementFormProps = {
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  images: string[];
  onImagesChange: (images: string[]) => void;
};

export function AchievementForm({ values, set, images, onImagesChange }: AchievementFormProps) {
  return (
    <>
      <TextField
        label="Title *"
        value={values.title}
        onChange={(v) => set("title", v)}
        placeholder="e.g. 1st Place — National Hackathon 2026"
        required
      />

      <FieldGrid>
        <div>
          <Label>Category</Label>
          <div className="mt-1.5">
            <Select
              value={values.category}
              onChange={(v) => set("category", v)}
              options={ACHIEVEMENT_CATEGORIES}
              placeholder="Select category"
            />
          </div>
        </div>
        <TextField
          label="Organization / Host"
          value={values.organization}
          onChange={(v) => set("organization", v)}
          placeholder="e.g. XYZ University"
        />
      </FieldGrid>

      <DateField value={values.date} onChange={(v) => set("date", v)} label="Date" placeholder="Select date unlocked" />

      <TextAreaField
        label="Description"
        value={values.description}
        onChange={(v) => set("description", v)}
        placeholder="Awarded first place among 120 participating teams..."
      />

      <div>
        <Label className="mb-1.5 block">Proof Images (Max 5)</Label>
        <MultiUploadField
          values={images}
          onAddImages={(urls) => onImagesChange([...images, ...urls].slice(0, 5))}
          onRemoveImage={(index) => onImagesChange(images.filter((_, i) => i !== index))}
          maxFiles={5}
          title="Upload proof images or certificates"
          subtitle="Upload award certificates, photos, or proof images."
        />
      </div>
    </>
  );
}
