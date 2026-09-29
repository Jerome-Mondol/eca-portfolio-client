"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";

export type Social = { platform: string; url: string };

/** Turns a handle ("@jerome") into that platform's profile URL. */
function urlFromHandle(platform: string, handle: string): string {
  const p = platform.toLowerCase();
  const name = handle.replace(/^@/, "");
  if (p.includes("github")) return `https://github.com/${name}`;
  if (p.includes("linkedin")) return `https://linkedin.com/in/${name}`;
  if (p.includes("twitter") || p.includes("x")) return `https://x.com/${name}`;
  if (p.includes("instagram")) return `https://instagram.com/${name}`;
  if (p.includes("facebook")) return `https://facebook.com/${name}`;
  if (p.includes("behance")) return `https://behance.net/${name}`;
  if (p.includes("dribbble")) return `https://dribbble.com/${name}`;
  return `https://${name}.com`;
}

/**
 * Accepts either the current shape or the legacy `{ github, linkedin }` object.
 *
 * Older profiles stored socials as a fixed object, so any extra keys are turned
 * into platforms rather than dropped.
 */
export function normalizeSocials(raw: unknown): Social[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .filter((s): s is Social => !!s?.platform && !!s?.url)
      .map((s) => ({ platform: String(s.platform), url: String(s.url) }));
  }

  const legacy = raw as Record<string, unknown>;
  const list: Social[] = [];
  if (legacy.github) list.push({ platform: "GitHub", url: String(legacy.github) });
  if (legacy.linkedin) list.push({ platform: "LinkedIn", url: String(legacy.linkedin) });
  Object.entries(legacy).forEach(([key, value]) => {
    if (key === "github" || key === "linkedin" || !value) return;
    list.push({ platform: key.charAt(0).toUpperCase() + key.slice(1), url: String(value) });
  });
  return list;
}

/** Social link list plus the platform picker and add-row. */
export function useSocials(initial: Social[] = []) {
  const { success, error: toastError } = useToast();
  const [socials, setSocials] = useState<Social[]>(initial);
  const [platform, setPlatform] = useState("GitHub");
  const [url, setUrl] = useState("");
  const [customPlatform, setCustomPlatform] = useState("");

  const add = () => {
    const name = platform === "Other" ? customPlatform.trim() : platform;
    const raw = url.trim();
    if (!name || !raw) {
      toastError("Add social", "Platform and link/username required");
      return;
    }

    // Fill in the scheme or the whole URL depending on what was typed.
    let full = raw;
    if (!/^https?:\/\//.test(full)) {
      full = full.includes(".") ? `https://${full}` : urlFromHandle(name, full);
    }

    setSocials((prev) => [...prev, { platform: name, url: full }]);
    setUrl("");
    setCustomPlatform("");
    success("Social added", name);
  };

  const remove = (index: number) => setSocials(socials.filter((_, i) => i !== index));

  return {
    socials,
    setSocials,
    platform,
    setPlatform,
    url,
    setUrl,
    customPlatform,
    setCustomPlatform,
    add,
    remove,
  };
}
