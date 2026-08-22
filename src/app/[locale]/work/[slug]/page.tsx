import { CustomMDX, ScrollToHash } from "@/components";
import { baseURL, basePath } from "@/resources";
import { getContent } from "@/utils/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n";

function resolveAssetUrl(url: string) {
  if (!url || /^https?:\/\//.test(url) || !url.startsWith("/")) return url;
  return `${basePath}${url}`;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const projects = getContent("projects");
  // Return at least one entry for static export
  if (projects.length === 0) {
    return [{ slug: "placeholder" }];
  }
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = getContent("projects", locale).find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    metadataBase: new URL(baseURL),
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      url: `${baseURL}/work/${post.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations("work");
  const post = getContent("projects", locale).find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="page-project">
      <nav className="breadcrumb">
        <Link href="/work">{t("back")}</Link>
        <span>/</span>
        <span>{post.metadata.title}</span>
      </nav>

      <header className="article-header">
        <h1>{post.metadata.title}</h1>
        {post.metadata.summary && <p className="article-summary">{post.metadata.summary}</p>}
      </header>

      {(post.metadata.image || post.metadata.images?.[0]) && (
        <img src={resolveAssetUrl(post.metadata.image || post.metadata.images[0])} alt={post.metadata.title} className="article-cover" />
      )}

      {post.content.trim() && (
        <article className="article-content">
          <CustomMDX source={post.content} />
        </article>
      )}

      <ScrollToHash />
    </div>
  );
}
