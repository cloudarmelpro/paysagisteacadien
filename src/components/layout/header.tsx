import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { navLinks, contactSegment, siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";

/** En-tête bilingue : nav à gauche, marque centrée, langue + CTA à droite ; hamburger en mobile. */
export function SiteHeader({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const items = navLinks.map((link) => {
    const hash = "hash" in link ? `#${link.hash}` : "";
    return {
      label: dict.nav[link.key],
      href: `${localizedPath(lang, link.segment)}${hash}`,
    };
  });
  const careers = {
    label: dict.nav.careers,
    href: localizedPath(lang, "emplois"),
  };
  const quote = {
    label: dict.nav.quote,
    href: localizedPath(lang, contactSegment),
  };
  const a11y = dict.a11y;

  return (
    <header className="sticky top-0 z-50 bg-background">
      {/* Lien d'évitement : atteindre le contenu sans tabuler toute la nav. */}
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        {a11y.skipToContent}
      </a>

      {/* Dès lg, la grille `1fr auto 1fr` donne sa propre colonne à la marque :
          elle reste centrée sans chevaucher la nav. */}
      <div className="relative mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:px-12">
        {/* Navigation — gauche (desktop) */}
        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label={a11y.primaryNav}
        >
          <NavLinks items={items} />
        </nav>

        {/* Marque — centrée (desktop), à gauche (mobile) */}
        <Link
          href={localizedPath(lang, "")}
          aria-label={siteConfig.name}
          className="flex cursor-pointer items-center transition-opacity duration-200 hover:opacity-70 lg:justify-self-center"
        >
          <Logo className="h-10" />
        </Link>

        {/* Actions — droite (desktop) */}
        <div className="hidden items-center gap-4 lg:flex lg:justify-self-end">
          <ThemeToggle label={a11y.toggleTheme} />
          <LanguageSwitcher lang={lang} label={a11y.switchLanguage} />
          <Link
            href={careers.href}
            className="cursor-pointer whitespace-nowrap text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground"
          >
            {careers.label}
          </Link>
          <Link href={quote.href} className={buttonVariants()}>
            {quote.label}
          </Link>
        </div>

        {/* Actions — mobile / tablette : la langue vit dans le menu */}
        <div className="flex items-center lg:hidden">
          <MobileNav
            lang={lang}
            items={items}
            contact={careers}
            quote={quote}
            themeLabel={a11y.toggleTheme}
            languageLabel={a11y.switchLanguage}
            labels={{ open: a11y.openMenu, close: a11y.closeMenu }}
          />
        </div>
      </div>
    </header>
  );
}
