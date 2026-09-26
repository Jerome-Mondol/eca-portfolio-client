"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AvatarProps = {
  name?: string | null;
  src?: string | null;
  className?: string;
  /** Text size as a fraction of the avatar box, e.g. 0.4 for 40%. */
  ratio?: number;
};

/** Dark enough that white initials stay legible. */
const PALETTES = [
  "#111827",
  "#0f766e",
  "#1d4ed8",
  "#b45309",
  "#7c3aed",
  "#be123c",
  "#0369a1",
  "#15803d",
];

/** Deterministic palette so the same person always looks the same. */
function hash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeText(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Initials tile as an inline SVG data URI, which is why this replaced the old
 * `api.dicebear.com` request that put a DNS + TLS + third-party round trip on
 * the critical path of every dashboard page.
 *
 * The real photo is always rendered as a plain `<img>`. An SVG served through
 * `src="data:..."` cannot load external resources, so embedding the photo via
 * `<image href>` would silently show the coloured block instead.
 */
function InitialsTile({ label, ratio }: { label: string; ratio: number }) {
  const bg = PALETTES[hash(label || "folio") % PALETTES.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">` +
    `<rect width="100" height="100" fill="${bg}"/>` +
    `<text x="50" y="50" dy="0.35em" text-anchor="middle" ` +
    `font-family="system-ui,-apple-system,Segoe UI,sans-serif" ` +
    `font-size="${Math.round(ratio * 100)}" font-weight="600" fill="#ffffff">` +
    `${escapeText(initialsOf(label))}</text></svg>`;
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
      alt={label || "avatar"}
      className="h-full w-full object-cover"
      draggable={false}
    />
  );
}

export function Avatar({ name, src, className, ratio = 0.4 }: AvatarProps) {
  const label = (name ?? "").trim();
  const photo = typeof src === "string" && src.trim().length > 0 ? src.trim() : "";
  // A dead or expired photo link should degrade to initials, not a broken icon.
  const [photoFailed, setPhotoFailed] = useState(false);
  useEffect(() => setPhotoFailed(false), [photo]);

  return (
    <span className={cn("relative inline-flex shrink-0 overflow-hidden bg-white", className)}>
      {photo && !photoFailed ? (
        <img
          src={photo}
          alt={label || "Profile photo"}
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <InitialsTile label={label} ratio={ratio} />
      )}
    </span>
  );
}
