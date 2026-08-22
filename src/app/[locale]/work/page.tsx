import { getWork, baseURL } from "@/resources";
import { Projects } from "@/components/work/Projects";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const work = getWork(locale);
  return {
    title: work.title,
    description: work.description,
    metadataBase: new URL(baseURL),
    openGraph: {
      title: work.title,
      description: work.description,
      url: `${baseURL}${work.path}`,
    },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const work = getWork(locale);
  return (
    <div className="page-work">
      <h1>{work.title}</h1>
      <Projects locale={locale} showCategories />
    </div>
  );
}
