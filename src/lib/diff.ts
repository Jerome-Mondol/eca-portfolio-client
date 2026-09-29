/**
 * Word-level diff between two short texts.
 *
 * Used by the AI project assistant so a student can see exactly which words the
 * rewrite added and which it dropped before accepting it. Both inputs are
 * description cards (well under 500 characters), so an O(n·m) LCS table is
 * cheaper than anything smarter and stays exact.
 *
 * Additions and removals are tracked separately rather than collapsed into a
 * single "changed" flag — a rewrite that quietly drops a claim is the case a
 * reviewer most needs to catch.
 */

export type DiffKind = "same" | "added" | "removed";
export type DiffPart = { text: string; kind: DiffKind };

/** Keep whitespace attached to the preceding word so joining is lossless. */
function tokenize(text: string): string[] {
  return text.split(/(\s+)/).filter((t) => t.length > 0);
}

export function diffWords(before: string, after: string): DiffPart[] {
  const a = tokenize(before);
  const b = tokenize(after);

  // lengths[i][j] = LCS length of a[i..] and b[j..]
  const lengths: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0),
  );
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lengths[i][j] = a[i] === b[j] ? lengths[i + 1][j + 1] + 1 : Math.max(lengths[i + 1][j], lengths[i][j + 1]);
    }
  }

  const parts: DiffPart[] = [];
  const push = (text: string, kind: DiffKind) => {
    const last = parts[parts.length - 1];
    if (last && last.kind === kind) last.text += text;
    else parts.push({ text, kind });
  };

  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      push(a[i], "same");
      i++;
      j++;
    } else if (lengths[i + 1][j] >= lengths[i][j + 1]) {
      push(a[i], "removed");
      i++;
    } else {
      push(b[j], "added");
      j++;
    }
  }
  while (i < a.length) push(a[i++], "removed");
  while (j < b.length) push(b[j++], "added");

  return parts;
}

/** Count real word changes. Whitespace-only runs are reflow, not edits. */
export function diffSummary(before: string, after: string): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const part of diffWords(before, after)) {
    const words = part.text.trim();
    if (!words) continue;
    const count = words.split(/\s+/).length;
    if (part.kind === "added") added += count;
    else if (part.kind === "removed") removed += count;
  }
  return { added, removed };
}
