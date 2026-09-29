import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { PROFILE_PLATFORMS, platformIcon } from "./profile-platforms";
import { InterestsEditor } from "./interests-editor";
import type { Social } from "./use-socials";

export type SocialsCardState = {
  socials: Social[];
  onRemove: (index: number) => void;
  platform: string;
  onPlatformChange: (value: string) => void;
  url: string;
  onUrlChange: (value: string) => void;
  customPlatform: string;
  onCustomPlatformChange: (value: string) => void;
  onAdd: () => void;
};

type ProfileSocialsCardProps = SocialsCardState & {
  interests: string[];
  newInterest: string;
  onNewInterestChange: (value: string) => void;
  onAddInterest: () => void;
  onRemoveInterest: (interest: string) => void;
};

/** Social account list and add-row, with the interest tags below. */
export function ProfileSocialsCard(props: ProfileSocialsCardProps) {
  const { socials } = props;

  return (
    <Card className="p-5 space-y-4">
      <h3 className="font-semibold text-sm">Social accounts</h3>
      <p className="text-xs text-muted -mt-2">
        Add any platform — GitHub, LinkedIn, Instagram, YouTube, Behance, portfolio, etc. Everyone is welcome (tech or not).
      </p>

      {socials.length > 0 && (
        <div className="space-y-2">
          {socials.map((social, index) => (
            <div key={`${social.platform}-${index}`} className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 py-2">
              <span className="h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                {platformIcon(social.platform, 14)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{social.platform}</p>
                <p className="text-xs text-muted truncate">{social.url}</p>
              </div>
              <button
                onClick={() => props.onRemove(index)}
                className="h-7 w-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 cursor-pointer shrink-0"
                aria-label={`Remove ${social.platform}`}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-[160px_1fr] gap-2 items-center">
        <Select
          value={props.platform}
          onChange={props.onPlatformChange}
          options={PROFILE_PLATFORMS.map((p) => ({ value: p, label: p, icon: platformIcon(p, 14) }))}
        />
        <Input value={props.url} onChange={(e) => props.onUrlChange(e.target.value)} placeholder="https://..." />
      </div>
      {props.platform === "Other" && (
        <Input value={props.customPlatform} onChange={(e) => props.onCustomPlatformChange(e.target.value)} placeholder="Custom platform name (e.g. ArtStation)" />
      )}
      <Button type="button" variant="secondary" size="sm" className="w-full sm:w-auto cursor-pointer" onClick={props.onAdd}>
        <Plus size={14} className="mr-1" /> Add social
      </Button>

      <InterestsEditor
        interests={props.interests}
        onRemove={props.onRemoveInterest}
        newInterest={props.newInterest}
        onNewInterestChange={props.onNewInterestChange}
        onAdd={props.onAddInterest}
      />
    </Card>
  );
}
