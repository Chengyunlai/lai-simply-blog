import { CustomMDX, ScrollToHash } from "@/components";
import { TableOfContents } from "@/components/TableOfContents";
import { getPerson, baseURL } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getContent } from "@/utils/utils";
import { collectMarkdownHeadings } from "@/utils/slugifyHeading";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { loadConfigSync } from "@/lib/loadConfig";
import { Link } from "@/lib/i18n";

export async function generateStaticParams() {
  const posts = getContent("posts");
  // Return at least one entry for static export
  if (posts.length === 0) {
    return [{ slug: "placeholder" }];
  }
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getContent("posts").find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    metadataBase: new URL(baseURL),
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      url: `${baseURL}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations("blog");
  const tc = await getTranslations("common");
  const person = getPerson(locale);
  const post = getContent("posts").find((p) => p.slug === slug);
  if (!post) notFound();

  const config = loadConfigSync();
  const articleStyle = config?.theme?.style?.articleStyle || "default";

  const readingMinutes = Math.max(1, Math.ceil(post.content.replace(/\s+/g, "").length / 500));
  const headings = collectMarkdownHeadings(post.content);
  const toc = headings.filter((h) => h.level === 2 || h.level === 3);

  return (
    <div className="article-page">
      {/* 左侧固定导航 */}
      <TableOfContents items={toc.map(h => ({ id: h.id, label: h.label, level: h.level }))} />

      {/* 主内容区 */}
      <main className="article-main">
        {/* 顶部信息栏 */}
        <div className="article-top">
          <div className="article-top-left">
            <Link href="/blog">{t("back")}</Link>
            <span>·</span>
            <span>{post.metadata.tag || t("default_tag")}</span>
          </div>
          <div className="article-top-meta">
            <time dateTime={post.metadata.publishedAt}>{formatDate(post.metadata.publishedAt, false)}</time>
            <span>·</span>
            <span>{t("reading_time", { minutes: readingMinutes })}</span>
          </div>
        </div>

        {/* 文章标题 */}
        <header className="article-header">
          <h1 className="article-title">{post.metadata.title}</h1>
          <p className="article-summary">{post.metadata.summary}</p>
        </header>

        {/* 分割线 */}
        <hr className="article-divider" />

        {/* 文章内容 */}
        <article className="article-content" data-theme-style={articleStyle}>
          <CustomMDX source={post.content} headingIds={headings.map((h) => h.id)} themeStyle={articleStyle} />
        </article>

        {/* 文章底部 */}
        <footer className="article-footer">
          <span>{t("author_footer", { name: person.name })}</span>
          <Link href="/blog" className="footer-back">{t("continue_reading")} →</Link>
        </footer>
      </main>

      <ScrollToHash />
    </div>
  );
}
