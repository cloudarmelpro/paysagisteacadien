import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import { notFound } from "next/navigation";
import { i18n } from "@/lib/i18n";
import { getDictionary, hasLocale } from "@/lib/dictionaries";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { ThemeRestore } from "@/components/layout/theme-restore";
import { CookieConsent } from "@/components/layout/cookie-consent";
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
 * Applique le thème avant la peinture pour éviter le flash.
 * Ce layout ne doit jamais se re-rendre côté client, sinon React signale
 * « script tag in component » : le sélecteur de langue passe par un `<a>`
 * (rechargement complet) et doit le rester.
 */
// `js` marque que le JS s'exécute : la révélation au défilement ne masque le
// contenu que sous cette classe, donc sans JS (ou pour un robot) tout reste
// visible. Posée ici, avant le premier rendu, pour éviter tout scintillement.
const THEME_SCRIPT = `(function(){try{var r=document.documentElement;r.classList.add('js');var e=localStorage.getItem('theme');var d=e==='dark'||(e!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`;

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata(
  props: LayoutProps<"/[lang]">,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const { title, description } = dict.metadata;
  return {
    // Base absolue héritée par toutes les pages (canonical, hreflang, OG).
    metadataBase: new URL(siteUrl),
    title,
    description,
    // Alternates de l'accueil, qui n'a pas de generateMetadata propre. Toute
    // autre page doit redéfinir les siens, sinon elle hérite de ce canonical.
    alternates: buildAlternates(lang, ""),
    ...buildOpenGraph(lang, "", title, description),
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
        {/*
          `next/script` plutôt qu'une balise `<script>` brute : sur les réponses
          404, la balise brute n'était pas émise — le code ne partait que dans
          les données React, qui ne l'exécutent jamais côté client. Résultat :
          thème sombre ignoré et classe `js` absente sur ces pages.
          `beforeInteractive` est injecté dans le HTML initial par le serveur,
          quel que soit le chemin de rendu. L'`id` est requis pour un script
          inline.
        */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
        />
        <ThemeRestore />
        <LocalBusinessJsonLd lang={lang} dict={dict} />
        <SiteHeader lang={lang} dict={dict} />
        <main id="main" className="flex flex-1 flex-col">
          {props.children}
        </main>
        <SiteFooter lang={lang} dict={dict} />
        <CookieConsent lang={lang} labels={dict.cookies} />
      </body>
    </html>
  );
}
