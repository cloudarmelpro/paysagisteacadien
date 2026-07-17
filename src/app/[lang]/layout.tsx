import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "../globals.css";
import { notFound } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { LocalBusinessJsonLd } from "@/components/seo/local-business-json-ld";
import { buildAlternates, buildOpenGraph, siteUrl } from "@/lib/seo";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

/**
 * Pose le thème (classe `dark` + color-scheme) AVANT la peinture, d'après le
 * choix mémorisé ou la préférence système — évite tout flash.
 *
 * Ce <script> n'est réconcilié côté client que si ce layout se re-rend, ce qui
 * n'arrive QUE si le segment `[lang]` change. Le sélecteur de langue provoque
 * volontairement un rechargement complet (lien `<a>`), donc ce cas n'existe pas
 * et React 19 ne signale jamais « script tag in component ».
 */
const THEME_SCRIPT = `(function(){try{var r=document.documentElement;var e=localStorage.getItem('theme');var d=e==='dark'||(e!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata(
  props: LayoutProps<"/[lang]">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  const { title, description } = dict.metadata;
  return {
    // Base absolue héritée par toutes les pages (canonical, hreflang, OG).
    metadataBase: new URL(siteUrl),
    title,
    description,
    // Ces `alternates` valent pour l'ACCUEIL (qui n'a pas de generateMetadata
    // propre). Chaque autre page DOIT redéfinir les siens, sinon elle héritera
    // du canonical de l'accueil.
    alternates: buildAlternates(lang as Locale, ""),
    ...buildOpenGraph(lang as Locale, "", title, description),
  };
}

export default async function RootLayout(props: LayoutProps<"/[lang]">) {
  const { lang } = await props.params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <LocalBusinessJsonLd lang={lang} dict={dict} />
        <SiteHeader lang={lang} dict={dict} />
        <main id="main" className="flex flex-1 flex-col">
          {props.children}
        </main>
        <SiteFooter lang={lang} dict={dict} />
      </body>
    </html>
  );
}
