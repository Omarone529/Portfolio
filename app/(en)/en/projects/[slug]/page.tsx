import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projectCard, projectSlugs } from "@/content/projects";
import { projectPath } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import ProjectPage from "@/components/pages/ProjectPage";

type Params = { slug: string };

export function generateStaticParams() {
  return projectSlugs();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return buildMetadata({
    lang: "en",
    title: project.meta.title.en,
    description: project.meta.description.en,
    ogDescription: project.meta.ogDescription.en,
    type: "article",
    image: projectCard(project, "en"),
    paths: {
      it: projectPath("it", project.slug),
      en: projectPath("en", project.slug),
    },
  });
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectPage lang="en" project={project} />;
}
