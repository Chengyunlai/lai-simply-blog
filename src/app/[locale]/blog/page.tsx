import { getBlog, baseURL } from "@/resources";
import { formatDate } from "@/utils/formatDate";
import { getContent } from "@/utils/utils";
import { BlogSearch } from "./BlogSearch";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const blog = getBlog(locale);
  return {
    title: blog.title,
    description: blog.description,
    metadataBase: new URL(baseURL),
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `${baseURL}${blog.path}`,
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const posts = getContent("posts").sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

  const searchPosts = posts.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    summary: post.metadata.summary,
    tag: post.metadata.tag || "",
    publishedAt: post.metadata.publishedAt,
    displayDate: formatDate(post.metadata.publishedAt, false),
    searchText: [post.metadata.title, post.metadata.summary, post.metadata.tag, post.content].join(" "),
  }));

  return (
    <div className="page-blog">
      <BlogSearch posts={searchPosts} />
    </div>
  );
}
