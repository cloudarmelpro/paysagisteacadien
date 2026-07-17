import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { careersSegment } from "@/config/site";
import { Careers } from "@/components/sections/careers";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

export async function generateMetadata(
  props: PageProps<"/[lang]/emplois">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const { metaTitle, metaDescription } = dict.careers;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: buildAlternates(lang, "emplois"),
    ...buildOpenGraph(lang, "emplois", metaTitle, metaDescription),
  };
}

export default async function CareersPage(
  props: PageProps<"/[lang]/emplois">,
) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <BreadcrumbJsonLd
        lang={lang}
        dict={dict}
        items={[{ name: dict.careers.badge, segment: careersSegment }]}
      />
      <Careers lang={lang} dict={dict} />
    </>
  );
}
