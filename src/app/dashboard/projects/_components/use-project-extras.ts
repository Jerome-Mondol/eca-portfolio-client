"use client";

import { useState } from "react";
import type { Project } from "@/lib/api";
import { absoluteUrl, type ProjectLink } from "./project-links";
import { useLinkVerification } from "./use-link-verification";

/** Prefers the links array, falling back to the legacy pair for old records. */
function linksOf(project: Project): ProjectLink[] {
  if (Array.isArray(project.links) && project.links.length > 0) return project.links;
  const legacy: ProjectLink[] = [];
  if (project.githubUrl) legacy.push({ platform: "GitHub", url: project.githubUrl });
  if (project.liveUrl) legacy.push({ platform: "Website", url: project.liveUrl });
  return legacy;
}

/**
 * The project form's non-text state: cover image, link list, and the two
 * visibility toggles.
 *
 * Kept out of the form hook because none of it is a string field, and out of the
 * view because it is only ever read by the form and the save handler.
 */
export function useProjectExtras() {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [platform, setPlatform] = useState("GitHub");
  const [customName, setCustomName] = useState("");
  const [url, setUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [showOnPortfolio, setShowOnPortfolio] = useState(true);
  const { verifying, result: verifyResult } = useLinkVerification(url);

  const reset = () => {
    setCoverImage(null);
    setLinks([]);
    setPlatform("GitHub");
    setCustomName("");
    setUrl("");
    setFeatured(false);
    setShowOnPortfolio(true);
  };

  const load = (project: Project) => {
    setCoverImage(project.coverImage ?? null);
    setLinks(linksOf(project));
    setFeatured(!!project.featured);
    setShowOnPortfolio(project.visibility !== "private");
  };

  /**
   * Commits the add-row into the link list, recording the verification result
   * that was showing for that URL.
   */
  const addLink = () => {
    const name = platform === "Other" ? customName.trim() : platform;
    const trimmed = url.trim();
    if (!name || !trimmed) return;

    const normalized = absoluteUrl(trimmed);
    const verified = verifyResult && verifyResult.url === normalized ? verifyResult.valid : undefined;
    setLinks((prev) => [...prev, { platform: name, url: trimmed, verified, statusText: verifyResult?.message }]);
    setUrl("");
    setCustomName("");
  };

  return {
    coverImage,
    setCoverImage,
    links,
    setLinks,
    platform,
    setPlatform,
    customName,
    setCustomName,
    url,
    setUrl,
    featured,
    setFeatured,
    showOnPortfolio,
    setShowOnPortfolio,
    verifying,
    verifyResult,
    addLink,
    reset,
    load,
  };
}
