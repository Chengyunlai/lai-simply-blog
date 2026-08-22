import type {
  MDXRendererComponent,
  BlogListPageProps,
  BlogDetailPageProps,
  BlogRenderers,
  Heading,
} from "./types";

import { MDXRemote } from "next-mdx-remote/rsc";

// ============================================================
// 默认 MDX 渲染器
// ============================================================

function createHeading(level: number) {
  return function Heading({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    const text = typeof children === "string" ? children : "";
    const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "");
    switch (level) {
      case 1: return <h1 id={id} {...props}>{children}</h1>;
      case 2: return <h2 id={id} {...props}>{children}</h2>;
      case 3: return <h3 id={id} {...props}>{children}</h3>;
      case 4: return <h4 id={id} {...props}>{children}</h4>;
      case 5: return <h5 id={id} {...props}>{children}</h5>;
      default: return <h6 id={id} {...props}>{children}</h6>;
    }
  };
}

const defaultMDXComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/") || href?.startsWith("#")) {
      return <a href={href} {...props}>{children}</a>;
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  },
};

const DefaultMDXRenderer: MDXRendererComponent = ({ source, components }) => {
  return (
    <MDXRemote
      source={source}
      components={{ ...defaultMDXComponents, ...components }}
    />
  );
};

// ============================================================
// 默认文章列表页
// ============================================================

function DefaultBlogListPage({ posts }: BlogListPageProps) {
  return (
    <div className="page-blog">
      <header className="blog-hero">
        <span className="section-label">FIELD NOTES</span>
        <h1>技术文章</h1>
        <p>{posts.length} 篇文章</p>
      </header>
      <section className="blog-list">
        {posts.map((post) => (
          <article className="blog-item" key={post.slug}>
            <div className="blog-item-header">
              <span>{post.tag || "笔记"}</span>
              <time dateTime={post.publishedAt}>{post.displayDate}</time>
            </div>
            <h3><a href={`/blog/${post.slug}`}>{post.title}</a></h3>
            <p>{post.summary}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

// ============================================================
// 默认文章详情页
// ============================================================

function DefaultTOC({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;
  return (
    <aside className="toc">
      <nav>
        <p>目录</p>
        <ol>
          {headings.map((h) => (
            <li key={h.id} data-level={h.level}>
              <a href={`#${h.id}`}>{h.label}</a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

function DefaultBlogDetailPage({ post, headings, readingMinutes }: BlogDetailPageProps) {
  return (
    <div className="page-article">
      <nav className="breadcrumb">
        <a href="/blog">返回文章</a>
      </nav>

      <header className="article-header">
        <div className="article-meta">
          <span>{post.metadata.tag || "笔记"}</span>
          <time dateTime={post.metadata.publishedAt}>{post.metadata.publishedAt}</time>
          <span>约 {readingMinutes} 分钟</span>
        </div>
        <h1>{post.metadata.title}</h1>
        <p className="article-summary">{post.metadata.summary}</p>
      </header>

      <div className="article-layout">
        <DefaultTOC headings={headings} />
        <article className="article-content">
          <DefaultMDXRenderer source={post.content} />
        </article>
      </div>
    </div>
  );
}

// ============================================================
// 导出默认渲染器
// ============================================================

export const defaultRenderers: BlogRenderers = {
  MDXRenderer: DefaultMDXRenderer,
  BlogListPage: DefaultBlogListPage,
  BlogDetailPage: DefaultBlogDetailPage,
};
