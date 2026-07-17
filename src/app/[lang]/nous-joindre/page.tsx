import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { contactSegment } from "@/config/site";
import { buildAlternates, buildOpenGraph } from "@/lib/seo";
import { Contact } from "@/components/sections/contact";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";

export async function generateMetadata(
  props: PageProps<"/[lang]/nous-joindre">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const { metaTitle, metaDescription } = dict.contact;
  return {
    title: metaTitle,
    description: metaDescription,
    alternates: buildAlternates(lang, contactSegment),
    ...buildOpenGraph(lang, contactSegment, metaTitle, metaDescription),
  };
}

export default async function ContactPage(
  props: PageProps<"/[lang]/nous-joindre">,
) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <BreadcrumbJsonLd
        lang={lang}
        dict={dict}
        items={[{ name: dict.contact.badge, segment: contactSegment }]}
      />
      <Contact lang={lang} dict={dict} />
    </>
  );
}
