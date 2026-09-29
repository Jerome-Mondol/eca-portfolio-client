import { TextField, TextAreaField, SkillsField, FieldGrid } from "@/components/dashboard/fields";
import { MultiUploadField } from "@/components/dashboard/file-upload-field";
import { Label } from "@/components/ui/input";

type EcaFormProps = {
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  images: string[];
  onAddImages: (urls: string[]) => void;
  onRemoveImage: (index: number) => void;
};

/** ECA activity fields, including the up-to-5 image uploader. */
export function EcaForm({ values, set, images, onAddImages, onRemoveImage }: EcaFormProps) {
  return (
    <>
      <TextField
        label="Activity *"
        value={values.activityName}
        onChange={(v) => set("activityName", v)}
        placeholder="President — Robotics Club"
        required
      />

      <FieldGrid>
        <TextField label="Category" value={values.category} onChange={(v) => set("category", v)} placeholder="Leadership, Debate, etc" />
        <TextField label="Organization" value={values.organization} onChange={(v) => set("organization", v)} placeholder="University of Dhaka" />
      </FieldGrid>

      <TextField label="Role" value={values.role} onChange={(v) => set("role", v)} placeholder="President" />
      <TextAreaField label="Description" value={values.description} onChange={(v) => set("description", v)} placeholder="What did you do?" />
      <SkillsField value={values.skills} onChange={(v) => set("skills", v)} placeholder="Leadership, Public Speaking" />

      <div>
        <Label className="mb-1.5 block">Activity Images (Max 5)</Label>
        <MultiUploadField
          values={images}
          onAddImages={onAddImages}
          onRemoveImage={onRemoveImage}
          maxFiles={5}
          title="Upload activity photos or certificates"
          subtitle="Upload photos, certificates, or proof of participation."
        />
      </div>
    </>
  );
}
