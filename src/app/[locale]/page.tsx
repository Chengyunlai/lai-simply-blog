import { Projects } from "@/components/work/Projects";
import { CustomMDX } from "@/components";
import { getAbout, getPerson, getSocial } from "@/resources";
import { getContent } from "@/utils/utils";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n";
import { setRequestLocale } from "next-intl/server";
import { formatDate } from "@/utils/formatDate";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const person = getPerson(locale);
  const about = getAbout(locale);
  const social = getSocial();
  const socialLinks = social.filter((item) => item.link);
  
  const posts = getContent("posts", locale).sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );
  const recentPosts = posts.slice(0, 10);
  const projects = getContent("projects", locale);
  const hasMorePosts = posts.length > recentPosts.length;
  const hasMoreProjects = projects.length > 5;

  return (
    <div className="page-home">
      <div className={`home-layout ${about.intro.display ? "" : "home-layout-no-intro"}`}>
        {about.intro.display && (
          <aside className="home-intro">
            <img src={person.avatar} alt={person.name} className="home-intro-avatar" />
            <div className="home-intro-copy">
              <div className="section-label">{t("intro_label")}</div>
              <h1>{person.name}</h1>
              <p className="home-intro-role">{person.role}</p>
              <h2>{about.intro.title}</h2>
              <div className="home-intro-description article-content">
                <CustomMDX source={about.intro.description} />
              </div>
            {socialLinks.length > 0 && (
              <div className="home-intro-social">
                {socialLinks.map((item) => (
                    <a key={item.name} href={item.link} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        <div className="home-content">
          {recentPosts.length > 0 && (
            <section className="featured">
              <div className="section-label">{t("latest_post")}</div>
              <div className="featured-list">
                {recentPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}` as any} className="featured-item">
                    <time className="featured-date" dateTime={post.metadata.publishedAt}>
                      {formatDate(post.metadata.publishedAt, false)}
                    </time>
                    <span className="featured-title">{post.metadata.title}</span>
                    {post.metadata.tag && <span className="featured-tag">{post.metadata.tag}</span>}
                  </Link>
                ))}
              </div>
              {hasMorePosts && <Link href="/blog" className="featured-more">{t("view_all_posts")}</Link>}
            </section>
          )}

          <section className="projects-section">
            <Projects locale={locale} range={[1, 5]} />
            {hasMoreProjects && <Link href="/work" className="featured-more">{t("view_all_projects")}</Link>}
          </section>
        </div>
      </div>
    </div>
  );
}
