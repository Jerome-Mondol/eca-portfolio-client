import { Input, Label, Textarea } from "@/components/ui/input";
import { SingleUploadField } from "@/components/dashboard/file-upload-field";
import { ProjectLinksEditor } from "./project-links-editor";
import type { ProjectLink } from "./project-links";
import type { VerifyResult } from "./use-link-verification";

type ProjectFormProps = {
  values: Record<string, string>;
  set: (key: string, value: string) => void;
  coverImage: string | null;
  onCoverImageChange: (value: string | null) => void;
  links: ProjectLink[];
  onLinksChange: (links: ProjectLink[]) => void;
  platform: string;
  onPlatformChange: (value: string) => void;
  customName: string;
  onCustomNameChange: (value: string) => void;
  url: string;
  onUrlChange: (value: string) => void;
  verifying: boolean;
  verifyResult: VerifyResult | null;
  onAddLink: () => void;
  featured: boolean;
  onFeaturedChange: (value: boolean) => void;
  showOnPortfolio: boolean;
  onShowOnPortfolioChange: (value: boolean) => void;
  publicCount: number;
};

function Checkbox({ checked, onChange, label, hint, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string; disabled?: boolean }) {
  return (
    <label className="flex items-start gap-2 text-sm cursor-pointer">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 mt-0.5 accent-primary-strong" />
      <span>
        {label}
        {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
      </span>
    </label>
  );
}

export function ProjectForm(props: ProjectFormProps) {
  const { values, set, links, onLinksChange, featured, showOnPortfolio, publicCount } = props;

  return (
    <div className="space-y-4">
      <div>
        <Label>Title *</Label>
        <Input value={values.title} onChange={(e) => set("title", e.target.value)} placeholder="AI Study Assistant" className="mt-1.5" required />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={values.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description" className="mt-1.5" />
      </div>
      <SingleUploadField
        value={props.coverImage}
        onChange={props.onCoverImageChange}
        accept="image/*"
        maxSizeMB={5}
        title="Upload project image"
        subtitle="Will be shown in your public portfolio."
      />
      <div>
        <Label>Things used</Label>
        <Input value={values.technologies} onChange={(e) => set("technologies", e.target.value)} placeholder="Next.js, TypeScript, OpenAI" className="mt-1.5" />
        <p className="text-xs text-muted-foreground mt-1">
          Comma separated — will show as <span className="font-medium">Next.js / TypeScript / OpenAI</span>
        </p>
      </div>

      <ProjectLinksEditor
        links={links}
        onAdd={props.onAddLink}
        onRemove={(index) => onLinksChange(links.filter((_, i) => i !== index))}
        platform={props.platform}
        onPlatformChange={props.onPlatformChange}
        customName={props.customName}
        onCustomNameChange={props.onCustomNameChange}
        url={props.url}
        onUrlChange={props.onUrlChange}
        verifying={props.verifying}
        verifyResult={props.verifyResult}
      />

      <Checkbox checked={featured} onChange={props.onFeaturedChange} label="Featured" />
      <Checkbox
        checked={showOnPortfolio}
        onChange={props.onShowOnPortfolioChange}
        label="Show on portfolio"
        hint={`${publicCount}/5 projects selected`}
        disabled={!showOnPortfolio && publicCount >= 5}
      />
    </div>
  );
}
