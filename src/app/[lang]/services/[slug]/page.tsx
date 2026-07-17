import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { i18n, type Locale } from "@/lib/i18n";
import { resolveServiceSlug, serviceDetailSlugs, servicesSegment } from "@/config/site";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { ServiceDetail } from "@/components/sections/service-detail";
import {
  BreadcrumbJsonLd,
  type BreadcrumbItem,
} from "@/components/seo/breadcrumb-json-ld";
import { ServiceJsonLd } from "@/components/seo/service-json-ld";

export function generateStaticParams() {
  return i18n.locales.flatMap((lang) =>
    serviceDetailSlugs.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[lang]/services/[slug]">,
): Promise<Metadata> {
  const { lang, slug } = await props.params;
  if (!hasLocale(lang) || !resolveServiceSlug(slug)) return {};
  const dict = await getDictionary(lang as Locale);
  const item = dict.serviceDetail.items[slug as keyof typeof dict.serviceDetail.items];
  const segment = `${servicesSegment}/${slug}`;
  return {
    title: item.metaTitle,
    description: item.metaDescription,
    alternates: buildAlternates(lang as Locale, segment),
    ...buildOpenGraph(lang as Locale, segment, item.metaTitle, item.metaDescription),
  };
}

export default async function ServicePage(
  props: PageProps<"/[lang]/services/[slug]">,
) {
  const { lang, slug } = await props.params;
  const resolved = resolveServiceSlug(slug);
  if (!hasLocale(lang) || !resolved) notFound();
  const dict = await getDictionary(lang as Locale);

  const label = (s: string) =>
    dict.services.items[s as keyof typeof dict.services.items];

  // Pas de maillon « Services » intermédiaire : /[lang]/services n'existe pas.
  const crumbs: BreadcrumbItem[] = [
    {
      name: label(resolved.group.segment),
      segment: `${servicesSegment}/${resolved.group.segment}`,
    },
  ];
  if (resolved.kind === "service") {
    crumbs.push({
      name: label(resolved.slug),
      segment: `${servicesSegment}/${resolved.slug}`,
    });
  }

  return (
    <>
      <BreadcrumbJsonLd lang={lang} dict={dict} items={crumbs} />
      <ServiceJsonLd lang={lang} dict={dict} slug={slug} />
      <ServiceDetail lang={lang} dict={dict} slug={slug} />
    </>
  );
}
