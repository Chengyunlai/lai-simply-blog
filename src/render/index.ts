// src/render/index.ts
// 渲染器入口：合并用户配置与默认配置

import type { RenderConfig, BlogRenderers, ContentHooks } from "./types";
import { defaultRenderers } from "./default-renderers";
import { collectMarkdownHeadings, type MarkdownHeading } from "@/utils/slugifyHeading";
import { formatDate as defaultFormatDate } from "@/utils/formatDate";

// ============================================================
// 合并渲染器
// ============================================================

export function createRenderers(userRenderers?: Partial<BlogRenderers>): BlogRenderers {
  return {
    ...defaultRenderers,
    ...userRenderers,
  };
}

// ============================================================
// 合并钩子
// ============================================================

export interface ResolvedHooks {
  slugify: (text: string) => string;
  formatDate: (date: string, relative?: boolean) => string;
  extractHeadings: (markdown: string) => MarkdownHeading[];
}

export function createHooks(hooks?: ContentHooks): ResolvedHooks {
  return {
    slugify: hooks?.slugify ?? defaultSlugify,
    formatDate: hooks?.formatDate ?? defaultFormatDate,
    extractHeadings: hooks?.extractHeadings ?? collectMarkdownHeadings,
  };
}

function defaultSlugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ============================================================
// 完整配置解析
// ============================================================

export interface ResolvedRenderConfig {
  renderers: BlogRenderers;
  hooks: ResolvedHooks;
  mdxComponents: Record<string, React.ComponentType<any>>;
}

export function resolveRenderConfig(config?: RenderConfig): ResolvedRenderConfig {
  return {
    renderers: createRenderers(config?.renderers),
    hooks: createHooks(config?.hooks),
    mdxComponents: config?.mdxComponents ?? {},
  };
}

// ============================================================
// 重导出
// ============================================================

export type {
  PostMeta,
  Post,
  Heading,
  PostSummary,
  MDXComponents,
  MDXRendererProps,
  BlogListPageProps,
  BlogDetailPageProps,
  ProjectListPageProps,
  ProjectDetailPageProps,
  HomePageProps,
  BlogRenderers,
  ContentHooks,
  RenderConfig,
} from "./types";

export { defaultRenderers } from "./default-renderers";
