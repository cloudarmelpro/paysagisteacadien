import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { Careers } from "@/components/sections/careers";

export async function generateMetadata(
  props: PageProps<"/[lang]/emplois">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.careers.metaTitle,
    description: dict.careers.metaDescription,
  };
}

export default async function CareersPage(
  props: PageProps<"/[lang]/emplois">,
) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return <Careers lang={lang} dict={dict} />;
}
