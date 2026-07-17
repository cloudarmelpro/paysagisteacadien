import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { i18n, type Locale } from "@/lib/i18n";
import { resolveServiceSlug, serviceDetailSlugs, servicesSegment } from "@/config/site";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { ServiceDetail } from "@/components/sections/service-detail";

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
  if (!hasLocale(lang) || !resolveServiceSlug(slug)) notFound();
  const dict = await getDictionary(lang as Locale);

  return <ServiceDetail lang={lang} dict={dict} slug={slug} />;
}
