"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { localizedPath, type Locale } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import {
  scrollForSamePageAnchor,
  useNavActive,
  type NavLinkItem,
} from "./nav-links";

/**
 * Menu mobile plein écran : marque et fermeture en haut, liens principaux, puis
 * CTA, réseaux et langue. `render` maintient le panneau monté pendant l'animation
 * de sortie ; le démontage attend sa fin. Le mouvement est neutralisé par la
 * règle globale `prefers-reduced-motion` : aucune garde locale n'est nécessaire.
 */
export function MobileNav({
  lang,
  items,
  contact,
  quote,
  labels,
  themeLabel,
  languageLabel,
  className,
}: {
  lang: Locale;
  items: NavLinkItem[];
  contact: NavLinkItem;
  quote: NavLinkItem;
  labels: { open: string; close: string };
  themeLabel: string;
  languageLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [render, setRender] = useState(false);
  const pathname = usePathname();
  const isActive = useNavActive(items);

  const openMenu = () => {
    setRender(true);
    setOpen(true);
  };
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const primaryLinks = [...items, contact];
  const socials = [
    { label: "Facebook", href: siteConfig.social.facebook },
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
  ];

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={openMenu}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {/* Les deux fichiers restent montés et la variante `dark:` choisit :
            le rendu serveur et client est identique, sans écart d'hydratation. */}
        <Image
          src="/images/menu.png"
          alt=""
          width={32}
          height={32}
          priority
          className="size-8 dark:hidden"
        />
        <Image
          src="/images/menu-white.png"
          alt=""
          width={32}
          height={32}
          priority
          className="hidden size-8 dark:block"
        />
      </button>

      {render && (
        <div
          id="mobile-menu"
          onAnimationEnd={(e) => {
            // Démontage seulement à la fin de l'animation de sortie.
            if (e.target === e.currentTarget && !open) setRender(false);
          }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-background duration-300 ease-out",
            open
              ? "animate-in fade-in slide-in-from-right-8"
              : "animate-out fade-out slide-out-to-right-8",
          )}
        >
          {/* Barre supérieure : marque + fermeture */}
          <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-8">
            <Link
              href={localizedPath(lang, "")}
              onClick={closeMenu}
              aria-label={siteConfig.name}
              className="flex cursor-pointer items-center"
            >
              <Logo className="h-10" />
            </Link>
            <button
              type="button"
              aria-label={labels.close}
              onClick={closeMenu}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors duration-200 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Corps : grands liens en haut, secondaire en bas */}
          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-5 pt-6 pb-10 sm:px-8">
            <nav aria-label={labels.open} className="flex flex-col">
              {primaryLinks.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      scrollForSamePageAnchor(e, item.href, pathname);
                      closeMenu();
                    }}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "cursor-pointer py-1.5 text-3xl font-medium tracking-tight transition-colors sm:text-4xl",
                      active
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Secondaire : CTA, réseaux, langue */}
            <div className="mt-10 flex flex-col gap-6 border-t border-border pt-6">
              <Link
                href={quote.href}
                onClick={closeMenu}
                className={cn(buttonVariants({ size: "lg" }), "h-12 w-full text-base")}
              >
                {quote.label}
              </Link>
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <ThemeToggle label={themeLabel} />
                  <LanguageSwitcher lang={lang} label={languageLabel} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
