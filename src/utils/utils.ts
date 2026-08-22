import fs from "fs";
import path from "path";
import matter from "gray-matter";

type PostMetadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  category?: string;
  link?: string;
  [key: string]: unknown;
};

export type PostEntry = {
  metadata: PostMetadata;
  slug: string;
  content: string;
  /** Numeric directory order for the project content format. */
  order?: number;
};

function normalizePublishedAt(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value || "");
}

function localizedValue(value: unknown, locale: string): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const values = value as Record<string, unknown>;
    return String(values[locale] ?? values.en ?? values.zh ?? "");
  }
  return "";
}

function parseMetadata(data: Record<string, unknown>, locale = "en"): PostMetadata {
  return {
    title: localizedValue(data.title, locale),
    subtitle: localizedValue(data.subtitle, locale),
    publishedAt: normalizePublishedAt(data.publishedAt),
    summary: localizedValue(data.summary, locale),
    image: localizedValue(data.image, locale),
    images: (data.images as string[]) || [],
    tag: localizedValue(data.tag, locale),
    category: localizedValue(data.category, locale),
    link: localizedValue(data.link, locale),
  };
}

function readMDXFile(filePath: string, locale = "en") {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  return { metadata: parseMetadata(data, locale), content };
}

function getMDXData(dir: string, locale: string): PostEntry[] {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((file) => [".md", ".mdx"].includes(path.extname(file)));
  const groups = new Map<string, Array<{ file: string; language?: string }>>();
  for (const file of files) {
    const ext = path.extname(file);
    const stem = path.basename(file, ext);
    const match = stem.match(/^(.*)\.(en|zh)$/);
    const key = match?.[1] || stem;
    const entries = groups.get(key) || [];
    entries.push({ file, language: match?.[2] });
    groups.set(key, entries);
  }

  const fallbackLocale = locale === "zh" ? "en" : "zh";
  const localeFiles = Array.from(groups.values()).map((entries) =>
    entries.find((entry) => entry.language === locale) ||
    entries.find((entry) => entry.language === fallbackLocale) ||
    entries.find((entry) => !entry.language) ||
    entries[0],
  );

  return localeFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file.file), locale);
    
    // 统一 slug：去掉 .en / .zh
    let slug = path.basename(file.file, path.extname(file.file));
    if (slug.endsWith(".en") || slug.endsWith(".zh")) {
      slug = slug.slice(0, -3);
    }
    
    return { metadata, slug, content };
  });
}

function readProjectDirectory(dir: string, locale: string): PostEntry | null {
  const metaPath = path.join(dir, "meta.json");
  if (!fs.existsSync(metaPath)) return null;

  let rawMetadata: Record<string, unknown>;
  try {
    rawMetadata = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as Record<string, unknown>;
  } catch {
    console.warn(`Unable to parse project metadata: ${metaPath}`);
    return null;
  }

  const folderName = path.basename(dir);
  const order = Number(folderName);
  const fallbackLocale = locale === "zh" ? "en" : "zh";
  const detailCandidates = [
    `detail.${locale}.md`,
    `detail.${locale}.mdx`,
    `detail.${fallbackLocale}.md`,
    `detail.${fallbackLocale}.mdx`,
    "detail.md",
    "detail.mdx",
  ];
  const detailFile = detailCandidates.find((file) => fs.existsSync(path.join(dir, file)));
  const content = detailFile ? fs.readFileSync(path.join(dir, detailFile), "utf-8") : "";
  const metadata = parseMetadata(
    {
      ...rawMetadata,
      title: rawMetadata.title ?? rawMetadata.name,
      summary: rawMetadata.summary ?? rawMetadata.description,
      image: rawMetadata.image ?? (Array.isArray(rawMetadata.images) ? rawMetadata.images[0] : ""),
      publishedAt: rawMetadata.publishedAt ?? rawMetadata.updatedAt,
    },
    locale,
  );

  return {
    metadata,
    slug: String(rawMetadata.slug || folderName),
    content,
    order: Number.isFinite(order) ? order : undefined,
  };
}

function getProjectData(dir: string, locale: string): PostEntry[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d+$/.test(entry.name))
    .map((entry) => readProjectDirectory(path.join(dir, entry.name), locale))
    .filter((entry): entry is PostEntry => entry !== null)
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

  // Keep the original single-file project format working for existing sites.
  return entries.length > 0 ? entries : getMDXData(dir, locale);
}

export function getContent(type: "posts" | "projects", locale = "en"): PostEntry[] {
  const contentDir = path.join(process.cwd(), "content", type);
  if (type === "projects") return getProjectData(contentDir, locale);
  return getMDXData(contentDir, locale);
}
