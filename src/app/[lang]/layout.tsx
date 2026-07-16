import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { HtmlLang } from "@/components/layout/html-lang";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata(
  props: LayoutProps<"/[lang]">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

/**
 * Layout de locale : entête, contenu, pied de page. La coquille `<html>`/`<body>`
 * (et le script thème/langue) vit dans le layout racine, au-dessus, pour ne pas
 * être re-rendue à chaque changement de langue.
 */
export default async function LocaleLayout(props: LayoutProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <HtmlLang lang={lang} />
      <SiteHeader lang={lang} dict={dict} />
      <main id="main" className="flex flex-1 flex-col">
        {props.children}
      </main>
      <SiteFooter lang={lang} dict={dict} />
    </>
  );
}
