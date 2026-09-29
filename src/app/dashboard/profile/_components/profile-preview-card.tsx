import type { RefObject } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/lib/upload";
import { Upload, MapPin, GraduationCap } from "lucide-react";
import { platformIcon } from "./profile-platforms";
import { PortfolioLinkCard } from "./portfolio-link-card";
import type { Social } from "./use-socials";

type ProfilePreviewCardProps = {
  avatarKey: string | null;
  username: string;
  fallbackName: string;
  fullName: string;
  headline: string;
  location: string;
  bio: string;
  degree: string;
  institution: string;
  interests: string[];
  socials: Social[];
  portfolioPath: string;
  portfolioUrl: string;
  copied: boolean;
  uploading: boolean;
  fileRef: RefObject<HTMLInputElement | null>;
  onCopy: () => void;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

/** A read-only preview of exactly what the public portfolio will show. */
export function ProfilePreviewCard(props: ProfilePreviewCardProps) {
  const { socials, interests, degree, institution, bio, location, uploading, fileRef } = props;
  const displayName = props.fullName || props.fallbackName || "—";
  const avatarSrc = props.avatarKey ? getImageUrl(props.avatarKey) : null;

  return (
    <Card className="p-5">
      <div className="flex flex-col items-center text-center">
        <div className="relative group">
          <Avatar
            src={avatarSrc}
            name={props.fullName || props.username || "JD"}
            className="h-32 w-32 sm:h-36 sm:w-36 rounded-2xl border border-border shadow-sm"
            ratio={0.36}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition cursor-pointer"
          >
            {uploading ? "..." : <><Upload size={14} className="mr-1" /> Change</>}
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={props.onAvatarChange} />
        <h3 className="font-semibold mt-3">{displayName}</h3>
        {props.headline ? (
          <p className="text-sm text-foreground mt-1 font-medium">{props.headline}</p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">No headline yet</p>
        )}
        <p className="text-xs text-muted mt-1">@{props.username} • Public</p>
        {location && (
          <p className="text-xs text-muted mt-2 flex items-center gap-1">
            <MapPin size={12} /> {location}
          </p>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="mt-3 w-full cursor-pointer"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload image"}
        </Button>
        <p className="text-[11px] text-muted-foreground mt-1">JPEG, PNG, WebP — max 5MB.</p>
      </div>

      {bio && (
        <div className="mt-5">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Bio</p>
          <p className="text-sm text-muted-strong mt-1.5 leading-5 line-clamp-4">{bio}</p>
        </div>
      )}

      {(degree || institution) && (
        <div className="mt-5">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground flex items-center gap-1">
            <GraduationCap size={12} /> Education
          </p>
          <div className="mt-1.5 rounded-xl border border-border bg-surface-2 p-3">
            <p className="text-sm font-medium">{degree || "—"}</p>
            <p className="text-xs text-muted">{institution || "—"}</p>
          </div>
        </div>
      )}

      {socials.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Social</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {socials.map((social, index) => (
              <a
                key={`${social.platform}-${index}`}
                href={social.url.startsWith("http") ? social.url : `https://${social.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs border border-border rounded-full px-3 py-1.5 hover:bg-surface-2 cursor-pointer bg-card"
              >
                {platformIcon(social.platform, 12)} <span className="truncate max-w-[120px]">{social.platform}</span>
              </a>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Logos hyperlinked — for any platform (tech or not).</p>
        </div>
      )}

      {interests.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Interests</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {interests.map((interest) => (
              <Badge key={interest} className="text-xs">{interest}</Badge>
            ))}
          </div>
        </div>
      )}

      <PortfolioLinkCard
        portfolioPath={props.portfolioPath}
        portfolioUrl={props.portfolioUrl}
        copied={props.copied}
        onCopy={props.onCopy}
      />
    </Card>
  );
}
