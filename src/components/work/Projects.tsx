import { getContent } from "@/utils/utils";
import { ProjectCard } from "@/components";
import { getTranslations } from "next-intl/server";

interface ProjectsProps {
  range?: [number, number?];
  exclude?: string[];
  locale?: string;
  showCategories?: boolean;
}

export async function Projects({ range, exclude, locale = "en", showCategories = false }: ProjectsProps) {
  let all = getContent("projects", locale);
  const t = await getTranslations({ locale, namespace: "work" });

  if (exclude && exclude.length > 0) {
    all = all.filter((p) => !exclude.includes(p.slug));
  }

  const sorted = all.sort((a, b) => {
    if (a.order !== undefined || b.order !== undefined) {
      return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
    }
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayed = range ? sorted.slice(range[0] - 1, range[1] ?? sorted.length) : sorted;
  const categories = Array.from(new Set(displayed.map((project) => project.metadata.category).filter(Boolean))) as string[];
  const hasCategoryGroups = showCategories && categories.length >= 2;
  const renderProject = (post: (typeof displayed)[number]) => (
    <ProjectCard
      key={post.slug}
      href={`/work/${post.slug}`}
      title={post.metadata.title}
      description={post.metadata.summary}
      image={post.metadata.image || ""}
      linkLabel={t("visit")}
    />
  );

  if (!hasCategoryGroups) {
    return (
      <div className="projects-grid">
        {displayed.map(renderProject)}
      </div>
    );
  }

  const groupedProjects = categories.map((category) => ({ category, projects: displayed.filter((project) => project.metadata.category === category) }));
  const uncategorizedProjects = displayed.filter((project) => !project.metadata.category);
  if (uncategorizedProjects.length > 0) {
    groupedProjects.push({ category: t("uncategorized"), projects: uncategorizedProjects });
  }

  return (
    <div className="projects-categorized">
      <nav className="project-category-nav" aria-label={t("categories")}>
        {groupedProjects.map(({ category }, index) => (
          <a key={category} href={`#project-category-${index}`}>
            {category}
          </a>
        ))}
      </nav>
      {groupedProjects.map(({ category, projects }, index) => {
        const categoryId = `project-category-${index}`;
        return (
          <section className="project-category" key={category} id={categoryId}>
            <div className="project-category-heading">
              <h2>{category}</h2>
              <span aria-hidden="true" />
            </div>
            <div className="projects-grid">
              {projects.map(renderProject)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
