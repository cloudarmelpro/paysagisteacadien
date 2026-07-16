import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

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
 * Pose le thème (classe `dark` + color-scheme) et la langue AVANT la peinture,
 * d'après le choix mémorisé, la préférence système et l'URL — donc aucun flash.
 * Rendu par le layout RACINE, au-dessus du segment `[lang]` : il n'est jamais
 * re-rendu lors d'un changement de langue, ce qui évite l'avertissement React 19
 * « script tag in component » à la navigation client.
 */
const INIT_SCRIPT = `(function(){try{var r=document.documentElement;var e=localStorage.getItem('theme');var d=e==='dark'||(e!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';r.lang=/^\\/en(\\/|$)/.test(location.pathname)?'en':'fr';}catch(e){}})();`;

/**
 * Layout racine : la coquille `<html>`/`<body>` stable, partagée par toutes les
 * locales. La langue par défaut est le français (locale par défaut) ; elle est
 * ajustée avant peinture par le script et suivie à la navigation par `HtmlLang`.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
