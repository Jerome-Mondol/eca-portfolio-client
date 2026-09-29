import type { ProjectLink } from "@/lib/api";
import {
  Globe,
  Code2,
  Link2,
  Bird,
  Users,
  Camera,
  Video,
  Palette,
  GraduationCap,
} from "lucide-react";

export const PLATFORM_OPTIONS = [
  "GitHub",
  "LinkedIn",
  "Website",
  "Twitter",
  "Facebook",
  "Instagram",
  "YouTube",
  "Behance",
  "Dribbble",
  "Other",
];

export type { ProjectLink } from "@/lib/api";

/** Best-effort brand glyph for a link's platform, by substring match. */
export function platformIcon(platform: string, size = 12) {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Code2 size={size} />;
  if (p.includes("linkedin")) return <Link2 size={size} />;
  if (p.includes("twitter") || p.includes("x")) return <Bird size={size} />;
  if (p.includes("facebook")) return <Users size={size} />;
  if (p.includes("instagram")) return <Camera size={size} />;
  if (p.includes("youtube")) return <Video size={size} />;
  if (p.includes("behance") || p.includes("dribbble")) return <Palette size={size} />;
  if (p.includes("kaggle") || p.includes("research")) return <GraduationCap size={size} />;
  return <Globe size={size} />;
}

/** Prefixes a bare domain so stored links stay clickable. */
export function absoluteUrl(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

/**
 * Splits links into the legacy `githubUrl` / `liveUrl` fields.
 *
 * Older records only stored those two, so both are kept in sync for backward
 * compatibility with any consumer still reading them.
 */
export function legacyLinkFields(links: ProjectLink[]) {
  const github = links.find((l) => l.platform.toLowerCase().includes("github"));
  const live = links.find((l) => !l.platform.toLowerCase().includes("github"));
  return { githubUrl: github?.url, liveUrl: live?.url };
}
