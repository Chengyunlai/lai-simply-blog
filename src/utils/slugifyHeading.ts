import { slugify as transliterate } from "transliteration";

function slugifyHeading(value: string) {
  return (
    transliterate(value.replace(/&/g, " and "), {
      lowercase: true,
      separator: "-",
    }).replace(/--+/g, "-") || "section"
  );
}

function createHeadingSlugger() {
  const occurrences = new Map<string, number>();

  return (label: string) => {
    const base = slugifyHeading(label);
    const occurrence = (occurrences.get(base) || 0) + 1;
    occurrences.set(base, occurrence);
    return occurrence === 1 ? base : `${base}-${occurrence}`;
  };
}

export type MarkdownHeading = {
  level: number;
  label: string;
  id: string;
};

function plainMarkdownHeading(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[*_~`]/g, "")
    .trim();
}

export function collectMarkdownHeadings(source: string): MarkdownHeading[] {
  const nextId = createHeadingSlugger();
  const headings: MarkdownHeading[] = [];
  let fence: "```" | "~~~" | null = null;

  for (const line of source.split("\n")) {
    const fenceMatch = line.match(/^\s*(```|~~~)/);
    if (fenceMatch) {
      const marker = fenceMatch[1] as "```" | "~~~";
      fence = fence === marker ? null : fence || marker;
      continue;
    }
    if (fence) continue;

    const headingMatch = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!headingMatch) continue;
    const label = plainMarkdownHeading(headingMatch[2]);
    headings.push({ level: headingMatch[1].length, label, id: nextId(label) });
  }

  return headings;
}
