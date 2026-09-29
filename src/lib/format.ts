/** Shared display formatters. */

const DAY_MONTH_YEAR = { day: "2-digit", month: "short", year: "numeric" } as const;

/**
 * Formats a `YYYY-MM-DD` date for display.
 *
 * The `T12:00:00` suffix pins the parse to midday — without it a bare date
 * string is treated as UTC midnight and renders as the previous day for anyone
 * west of Greenwich.
 */
export function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(iso);
  const parsed = new Date(dateOnly ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-GB", DAY_MONTH_YEAR);
}

/** `formatDate` with a placeholder for missing values. */
export function formatDateOr(iso: string | null | undefined, fallback: string): string {
  return formatDate(iso) || fallback;
}

/** Splits a comma-separated skills string into a clean list. */
export function parseSkills(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Turns a list back into the comma-separated string a text input holds. */
export function formatSkills(skills?: string[] | null): string {
  return (skills ?? []).join(", ");
}

/** Trims a field, mapping empty strings to `null` for the API. */
export function optional(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
