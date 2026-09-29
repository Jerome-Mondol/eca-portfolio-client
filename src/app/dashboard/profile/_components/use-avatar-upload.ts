"use client";

import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { uploadImage } from "@/lib/upload";
import { updateProfileApi, type Profile, type User } from "@/lib/api";

type ProfileData = { user: User | null; profile: Profile };

/**
 * Avatar key plus the file input and upload handling.
 *
 * A successful upload is auto-saved so the new picture persists without the
 * user having to press Save; if that write fails the preview is kept and they
 * can still save manually.
 */
export function useAvatarUpload(data: ProfileData | undefined, user: User | null) {
  const { success, error: toastError } = useToast();
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const hydratedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!data) return;
    const key = data.user?.id ?? user?.id ?? "anon";
    if (hydratedFor.current === key) return;
    hydratedFor.current = key;
    setAvatarKey(data.profile?.avatarKey ?? null);
  }, [data, user?.id]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setAvatarKey(res.url);
      try {
        await updateProfileApi({ avatarKey: res.url });
        success("Profile image updated");
      } catch {
        // Keep the preview even if auto-save fails — the user can click Save.
        success("Image uploaded", "Click Save to apply");
      }
    } catch (err) {
      toastError("Upload failed", err instanceof Error ? err.message : String(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return { avatarKey, setAvatarKey, uploading, fileRef, handleChange };
}
