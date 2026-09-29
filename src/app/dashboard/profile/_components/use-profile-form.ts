"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { updateProfileApi, type Profile, type User } from "@/lib/api";
import type { Social } from "./use-socials";

type ProfileData = { user: User | null; profile: Profile };

/**
 * The editable profile fields, hydrated once from the loaded profile.
 *
 * `data` arrives synchronously from the warmed store, so the hydration guard
 * exists to avoid clobbering edits on later re-renders, not to wait for it.
 */
export function useProfileForm(data: ProfileData | undefined, user: User | null) {
  const { success, error: toastError } = useToast();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [degree, setDegree] = useState("");
  const [institution, setInstitution] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");

  const hydratedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!data) return;
    const key = data.user?.id ?? user?.id ?? "anon";
    if (hydratedFor.current === key) return;
    hydratedFor.current = key;

    setFullName(data.user?.fullName ?? user?.fullName ?? "");
    setHeadline(data.profile?.headline ?? "");
    setBio(data.profile?.bio ?? "");
    setLocation(data.profile?.location ?? "");
    setDegree((data.profile?.education as { degree?: string })?.degree ?? "");
    setInstitution((data.profile?.education as { institution?: string })?.institution ?? "");
    setInterests(data.profile?.interests ?? []);
  }, [data, user?.id, user?.fullName]);

  const addInterest = () => {
    const trimmed = newInterest.trim();
    if (!trimmed || interests.includes(trimmed)) return;
    setInterests((prev) => [...prev, trimmed]);
    setNewInterest("");
  };

  const removeInterest = (interest: string) => setInterests((prev) => prev.filter((i) => i !== interest));

  const save = async (socials: Social[], avatarKey: string | null, refreshUser: () => void) => {
    if (!fullName.trim()) {
      toastError("Full name required");
      return;
    }
    setSaving(true);
    try {
      // `fullName` lives on the user row, but the API takes one payload.
      await updateProfileApi({
        // `fullName` belongs to the user row, not the profile, but the endpoint
        // accepts both in one payload.
        fullName: fullName.trim(),
        headline: headline || null,
        bio: bio || null,
        location: location || null,
        education: { degree, institution },
        interests,
        socials,
        avatarKey: avatarKey || null,
      } as Partial<Profile>);
      success("Profile saved");
      // Refresh the header name in the background — don't block the toast on it.
      refreshUser();
    } catch (err) {
      toastError("Save failed", err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    fullName,
    setFullName,
    headline,
    setHeadline,
    bio,
    setBio,
    location,
    setLocation,
    degree,
    setDegree,
    institution,
    setInstitution,
    interests,
    newInterest,
    setNewInterest,
    addInterest,
    removeInterest,
    save,
  };
}
