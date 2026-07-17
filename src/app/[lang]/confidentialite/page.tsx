import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { privacySegment } from "@/config/site";
import { Privacy } from "@/components/sections/privacy";


export async function generateMetadata(
  props: PageProps<"/[lang]/confidentialite">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const { metaTitle, metaDescription } = dict.privacy;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: buildAlternates(lang, privacySegment),
    ...buildOpenGraph(lang, privacySegment, metaTitle, metaDescription),
  };
}

export default async function PrivacyPage(
  props: PageProps<"/[lang]/confidentialite">,
) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <Privacy lang={lang} dict={dict} />;
}
