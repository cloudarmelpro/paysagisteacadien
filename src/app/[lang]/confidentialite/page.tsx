import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { privacySegment } from "@/config/site";
import { Privacy } from "@/components/sections/privacy";


export async function generateMetadata(
  props: PageProps<"/[lang]/confidentialite">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  const { metaTitle, metaDescription } = dict.privacy;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: buildAlternates(lang as Locale, privacySegment),
    ...buildOpenGraph(lang as Locale, privacySegment, metaTitle, metaDescription),
  };
}

export default async function PrivacyPage(
  props: PageProps<"/[lang]/confidentialite">,
) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return <Privacy lang={lang} dict={dict} />;
}
