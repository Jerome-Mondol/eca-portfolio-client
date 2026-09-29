import {
  Code2,
  Link2,
  Bird,
  Users,
  Camera,
  Video,
  Palette,
  FileText,
  GraduationCap,
  Globe,
} from "lucide-react";

/** Social platforms offered in the picker, in menu order. */
export const PROFILE_PLATFORMS = [
  "GitHub",
  "LinkedIn",
  "Twitter",
  "Facebook",
  "Instagram",
  "YouTube",
  "Behance",
  "Dribbble",
  "Medium",
  "Kaggle",
  "ResearchGate",
  "Portfolio",
  "Website",
  "Other",
];

/**
 * Best-effort brand glyph for a platform, by substring match.
 *
 * Unknown platforms fall back to a globe, which is why "Portfolio" and
 * "Website" do not need their own entries above.
 */
export function platformIcon(platform: string, size = 12) {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Code2 size={size} />;
  if (p.includes("linkedin")) return <Link2 size={size} />;
  if (p.includes("twitter") || p.includes("x")) return <Bird size={size} />;
  if (p.includes("facebook")) return <Users size={size} />;
  if (p.includes("instagram")) return <Camera size={size} />;
  if (p.includes("youtube")) return <Video size={size} />;
  if (p.includes("behance") || p.includes("dribbble")) return <Palette size={size} />;
  if (p.includes("medium")) return <FileText size={size} />;
  if (p.includes("kaggle") || p.includes("research")) return <GraduationCap size={size} />;
  return <Globe size={size} />;
}
