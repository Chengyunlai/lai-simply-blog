"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n";

export type SearchPost = {
  slug: string;
  title: string;
  summary: string;
  tag: string;
  publishedAt: string;
  displayDate: string;
  searchText: string;
};

function normalize(value: string, locale: string) {
  return value.toLocaleLowerCase(locale).replace(/\s+/g, "");
}

export function BlogSearch({ posts }: { posts: SearchPost[] }) {
  const t = useTranslations("blog");
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query, locale);
  const results = useMemo(
    () =>
      normalizedQuery
        ? posts.filter((post) => normalize(post.searchText, locale).includes(normalizedQuery))
        : posts,
    [normalizedQuery, posts, locale],
  );

  return (
    <>
      <div className="search-bar">
        <input
          className="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          autoComplete="off"
        />
        <span className="search-count">{t("search_count", { count: results.length })}</span>
      </div>

      <section className="blog-list" aria-label="Blog posts">
        {results.map((post) => (
          <Link href={`/blog/${post.slug}`} className="blog-item" key={post.slug}>
            <time className="blog-item-date" dateTime={post.publishedAt}>{post.displayDate}</time>
            <div className="blog-item-content">
              <span className="blog-item-title">{post.title}</span>
              <p className="blog-item-summary">{post.summary}</p>
            </div>
            {post.tag && <span className="blog-item-tag">{post.tag}</span>}
          </Link>
        ))}

        {results.length === 0 && (
          <div className="search-empty">
            <p>{t("empty", { query })}</p>
            <button type="button" className="btn btn-secondary" onClick={() => setQuery("")}>{t("clear_search")}</button>
          </div>
        )}
      </section>
    </>
  );
}
