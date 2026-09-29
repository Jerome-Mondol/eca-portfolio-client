"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { getProfileApi, type Profile, type User } from "@/lib/api";
import { useResource } from "@/lib/store";
import { Loader2 } from "lucide-react";
import { ProfilePreviewCard } from "./profile-preview-card";
import { ProfileEditor } from "./profile-editor";
import { useProfileForm } from "./use-profile-form";
import { useAvatarUpload } from "./use-avatar-upload";
import { useSocials, normalizeSocials } from "./use-socials";

type ProfileResponse = { user: User | null; profile: Profile };

/** Two-column skeleton matching the loaded layout. */
function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-32" />
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Skeleton className="h-[360px]" />
        <Skeleton className="h-[500px]" />
      </div>
    </div>
  );
}

export function ProfileView() {
  const { user, refreshUser } = useAuth();
  const { success, error: toastError } = useToast();
  // Synchronous read from the warmed store — no skeleton on repeat visits.
  const { data, loading } = useResource<ProfileResponse>("profile", getProfileApi);

  const form = useProfileForm(data, user);
  const avatar = useAvatarUpload(data, user);
  const socials = useSocials();
  const [copied, setCopied] = useState(false);

  // Read window lazily so the server render and the client render agree.
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);

  // Hydrate socials alongside the profile fields, once per user.
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);
  useEffect(() => {
    if (!data) return;
    const key = data.user?.id ?? user?.id ?? "anon";
    if (hydratedFor === key) return;
    setHydratedFor(key);
    // Accepts both the current array and the legacy `{ github, linkedin }` object.
    socials.setSocials(normalizeSocials(data.profile?.socials));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, user?.id, hydratedFor]);

  const username = user?.username ?? data?.user?.username ?? "";
  const portfolioUrl = origin ? `${origin}/u/${username}` : `/u/${username}`;
  const portfolioPath = `folio.com/u/${username}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      success("Copied", portfolioPath);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError("Copy failed");
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your public profile — ECA showcase."
        action={
          <Button
            onClick={() => form.save(socials.socials, avatar.avatarKey, refreshUser)}
            disabled={form.saving}
            className="w-full sm:w-auto min-h-[44px] cursor-pointer"
          >
            {form.saving && <Loader2 size={14} className="mr-2 animate-spin" />}
            {form.saving ? "Saving..." : "Save changes"}
          </Button>
        }
      />

      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <ProfilePreviewCard
          avatarKey={avatar.avatarKey}
          username={username}
          fallbackName={user?.fullName ?? ""}
          fullName={form.fullName}
          headline={form.headline}
          location={form.location}
          bio={form.bio}
          degree={form.degree}
          institution={form.institution}
          interests={form.interests}
          socials={socials.socials}
          portfolioPath={portfolioPath}
          portfolioUrl={portfolioUrl}
          copied={copied}
          uploading={avatar.uploading}
          fileRef={avatar.fileRef}
          onCopy={copyLink}
          onAvatarChange={avatar.handleChange}
        />

        <ProfileEditor
          fullName={form.fullName}
          onFullNameChange={form.setFullName}
          username={user?.username ?? ""}
          headline={form.headline}
          onHeadlineChange={form.setHeadline}
          location={form.location}
          onLocationChange={form.setLocation}
          bio={form.bio}
          onBioChange={form.setBio}
          degree={form.degree}
          onDegreeChange={form.setDegree}
          institution={form.institution}
          onInstitutionChange={form.setInstitution}
          socials={{
            socials: socials.socials,
            onRemove: socials.remove,
            platform: socials.platform,
            onPlatformChange: socials.setPlatform,
            url: socials.url,
            onUrlChange: socials.setUrl,
            customPlatform: socials.customPlatform,
            onCustomPlatformChange: socials.setCustomPlatform,
            onAdd: socials.add,
          }}
          interests={form.interests}
          newInterest={form.newInterest}
          onNewInterestChange={form.setNewInterest}
          onAddInterest={form.addInterest}
          onRemoveInterest={form.removeInterest}
        />
      </div>
    </div>
  );
}
