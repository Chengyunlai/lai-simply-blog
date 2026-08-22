import { basePath } from "@/resources";
import { Link } from "@/lib/i18n";

interface ProjectCardProps {
  href: string;
  title: string;
  description: string;
  image?: string;
  linkLabel?: string;
}

function resolveAssetUrl(url: string) {
  if (!url || /^https?:\/\//.test(url) || !url.startsWith("/")) return url;
  return `${basePath}${url}`;
}

export function ProjectCard({ href, title, description, image, linkLabel = "Visit project →" }: ProjectCardProps) {
  return (
    <article className="project-card">
      {image && <img src={resolveAssetUrl(image)} alt="" className="project-card-image" loading="lazy" />}
      <Link href={href as any} className="project-card-main">
        <h3>{title}</h3>
        <p>{description}</p>
      </Link>
      <Link href={href as any} className="project-card-link">
        {linkLabel}
      </Link>
    </article>
  );
}
