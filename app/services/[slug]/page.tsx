import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, services } from "@/lib/services";
import DarkArticle from "@/components/DarkArticle";
import LightService from "@/components/LightService";
import { readContent } from "@/lib/content";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getServiceBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.metaDescription,
    openGraph: {
      title: s.title,
      description: s.metaDescription,
      type: s.variant === "dark" ? "article" : "website",
      locale: "fr_MA",
      images: [s.ogImage],
    },
    alternates: {
      canonical: `/services/${s.slug}`,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const site = await readContent();

  return service.variant === "dark"
    ? <DarkArticle service={service} settings={site.settings} contact={site.contact} />
    : <LightService service={service} settings={site.settings} contact={site.contact} />;
}
