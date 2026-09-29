/** Theme names and accent swatches offered in the editor. */
export const PORTFOLIO_THEMES = ["Minimal", "Modern", "Academic", "Creative", "Professional"];

export const PORTFOLIO_ACCENTS = ["#c2410c", "#ff7f50", "#2563eb", "#0f766e", "#be123c", "#7c3aed"];

/** Default public section order. */
export const DEFAULT_SECTIONS = [
  "Hero / Introduction",
  "About",
  "Experience",
  "Projects",
  "ECA / Activities",
  "Courses & Certificates",
  "Achievements",
  "Skills",
  "Education",
  "Contact",
];

/** Moves one section up or down, ignoring moves past either end. */
export function moveSection(sections: string[], index: number, direction: number): string[] {
  const next = [...sections];
  const target = index + direction;
  if (target < 0 || target >= next.length) return sections;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
