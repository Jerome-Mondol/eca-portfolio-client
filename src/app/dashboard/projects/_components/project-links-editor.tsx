import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import { PLATFORM_OPTIONS, platformIcon, type ProjectLink } from "./project-links";
import { LinkStatusBadge, VerifyFeedback } from "./project-verify-feedback";
import type { VerifyResult } from "./use-link-verification";

/** Rows for links already added to the project. */
function AddedLinks({ links, onRemove }: { links: ProjectLink[]; onRemove: (index: number) => void }) {
  if (links.length === 0) return null;

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={index} className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2">
          <span className="h-7 w-7 rounded-full bg-card border flex items-center justify-center shrink-0">
            {platformIcon(link.platform, 12)}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium">{link.platform}</p>
              <LinkStatusBadge verified={link.verified} />
            </div>
            <p className="text-xs text-muted truncate">{link.url}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`Remove ${link.platform} link`}
            className="h-7 w-7 rounded-full bg-card border flex items-center justify-center hover:bg-red-50 hover:text-red-600 cursor-pointer shrink-0"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Platform / URL / Add row, with the spinner or tick inside the URL field. */
function AddLinkRow(props: {
  platform: string;
  onPlatformChange: (value: string) => void;
  customName: string;
  onCustomNameChange: (value: string) => void;
  url: string;
  onUrlChange: (value: string) => void;
  verifying: boolean;
  verifyResult: VerifyResult | null;
  onAdd: () => void;
}) {
  const { verifying, verifyResult } = props;

  const fieldStatus = verifying ? (
    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-500">
      <Loader2 size={14} className="animate-spin" />
    </div>
  ) : verifyResult ? (
    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
      {verifyResult.valid ? (
        <CheckCircle2 size={15} className="text-emerald-600" />
      ) : (
        <AlertCircle size={15} className="text-red-500" />
      )}
    </div>
  ) : null;

  return (
    <div className="space-y-1.5">
      <div className="grid sm:grid-cols-[160px_1fr_auto] gap-2 items-center">
        <Select
          value={props.platform}
          onChange={props.onPlatformChange}
          options={PLATFORM_OPTIONS.map((p) => ({ value: p, label: p, icon: platformIcon(p, 14) }))}
        />
        <div className="relative flex-1">
          <Input value={props.url} onChange={(e) => props.onUrlChange(e.target.value)} placeholder="https://github.com/username/project" className="pr-8" />
          {fieldStatus}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={props.onAdd} className="cursor-pointer min-h-[44px]">
          <Plus size={14} /> Add
        </Button>
      </div>

      {props.platform === "Other" && (
        <Input value={props.customName} onChange={(e) => props.onCustomNameChange(e.target.value)} placeholder="Custom platform (e.g. Figma)" className="mt-1" />
      )}

      <VerifyFeedback verifying={verifying} result={verifyResult} />
    </div>
  );
}

export type ProjectLinksEditorProps = {
  links: ProjectLink[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  platform: string;
  onPlatformChange: (value: string) => void;
  customName: string;
  onCustomNameChange: (value: string) => void;
  url: string;
  onUrlChange: (value: string) => void;
  verifying: boolean;
  verifyResult: VerifyResult | null;
};

/** Universal link list plus the add-row with live verification. */
export function ProjectLinksEditor(props: ProjectLinksEditorProps) {
  return (
    <div className="space-y-2">
      <Label>Links (universal — any platform)</Label>
      <p className="text-xs text-muted">Add GitHub, live demo, Behance, YouTube, etc. — like profile socials.</p>

      <AddedLinks links={props.links} onRemove={props.onRemove} />

      <AddLinkRow
        platform={props.platform}
        onPlatformChange={props.onPlatformChange}
        customName={props.customName}
        onCustomNameChange={props.onCustomNameChange}
        url={props.url}
        onUrlChange={props.onUrlChange}
        verifying={props.verifying}
        verifyResult={props.verifyResult}
        onAdd={props.onAdd}
      />
    </div>
  );
}
