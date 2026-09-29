import type { AiAnalysis, AiProjectSuggestion } from "@/lib/api";

export const STATUS_LABEL: Record<AiAnalysis["status"], string> = {
  verified: "Verified",
  partially_verified: "Partially verified",
  unverified: "Unverified",
};

export const SAMPLE_NOTES =
  "I made a website for our college club using React. I worked with two friends and made the registration system.";

export const MISSING_LABEL: Record<AiProjectSuggestion["missing"][number]["field"], string> = {
  outcome: "Outcome",
  metric: "Metric",
  role: "Your role",
  users: "Users",
  tech: "Technology",
  scope: "Scope",
  link: "Link",
};

/** `projectSchema.description` caps at 500 chars (server utils/validation.ts). */
export const CARD_MAX = 500;

export type Draft = { description: string; title: string; technologies: string[]; highlights: string[] };

export const EMPTY_DRAFT: Draft = { description: "", title: "", technologies: [], highlights: [] };

/** Trims on a word boundary where possible, for the project card preview. */
export function capForCard(text: string): { text: string; truncated: boolean } {
  if (text.length <= CARD_MAX) return { text, truncated: false };
  const cut = text.slice(0, CARD_MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const body = lastSpace > CARD_MAX * 0.6 ? cut.slice(0, lastSpace) : cut;
  return { text: `${body.replace(/[.,;:]$/, "")}…`, truncated: true };
}

export type CertForm = {
  name: string;
  organization: string;
  issueDate: string;
  credentialId: string;
  credentialUrl: string;
  skills: string;
};

export const EMPTY_FORM: CertForm = { name: "", organization: "", issueDate: "", credentialId: "", credentialUrl: "", skills: "" };

/** Seeds the review form from the extracted fields. */
export function formFromResult(analysis: AiAnalysis): CertForm {
  const e = analysis.extracted;
  return {
    name: e.courseName?.trim() || e.organization?.trim() || "",
    organization: e.organization ?? "",
    issueDate: e.date ?? "",
    credentialId: e.certificateId ?? "",
    credentialUrl: e.credentialUrl ?? "",
    skills: (e.skills ?? []).join(", "),
  };
}
