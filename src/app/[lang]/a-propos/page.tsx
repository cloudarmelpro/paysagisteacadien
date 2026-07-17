import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { About } from "@/components/sections/about";

export async function generateMetadata(
  props: PageProps<"/[lang]/a-propos">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  const { metaTitle, metaDescription } = dict.about;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: buildAlternates(lang as Locale, "a-propos"),
    ...buildOpenGraph(lang as Locale, "a-propos", metaTitle, metaDescription),
  };
}

export default async function AboutPage(props: PageProps<"/[lang]/a-propos">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return <About lang={lang} dict={dict} />;
}
