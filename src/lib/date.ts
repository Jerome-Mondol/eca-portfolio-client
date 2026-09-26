/**
 * Formats a date as "Jan 2024".
 *
 * The API is inconsistent about date shape: the portfolio endpoint maps
 * `issue_date` straight from Postgres (a full ISO timestamp) while the stores
 * normalise to `YYYY-MM-DD`. Slicing to the date part first handles both, and
 * appending "T12:00:00" pins the value to local midday so a UTC date never
 * renders as the previous day.
 */
export function formatMonthYear(value?: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}
