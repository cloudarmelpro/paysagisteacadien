import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { About } from "@/components/sections/about";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

export async function generateMetadata(
  props: PageProps<"/[lang]/a-propos">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const { metaTitle, metaDescription } = dict.about;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: buildAlternates(lang, "a-propos"),
    ...buildOpenGraph(lang, "a-propos", metaTitle, metaDescription),
  };
}

export default async function AboutPage(props: PageProps<"/[lang]/a-propos">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <BreadcrumbJsonLd
        lang={lang}
        dict={dict}
        items={[{ name: dict.about.badge, segment: "a-propos" }]}
      />
      <About lang={lang} dict={dict} />
    </>
  );
}
