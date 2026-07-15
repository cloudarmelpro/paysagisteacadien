"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Bascule FR / EN en conservant le chemin courant :
 * remplace le segment de locale (/fr/services → /en/services).
 */
export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();

  function pathForLocale(target: Locale): string {
    const segments = pathname.split("/");
    segments[1] = target; // le 1er segment après "/" est la locale
    return segments.join("/") || `/${target}`;
  }

  return (
    <div
      className="flex items-center gap-0.5 text-xs font-medium"
      role="group"
      aria-label={lang === "fr" ? "Choix de la langue" : "Language selector"}
    >
      {i18n.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="mx-1 text-border">/</span>}
          <Link
            href={pathForLocale(loc)}
            aria-current={loc === lang ? "true" : undefined}
            className={cn(
              "rounded px-1 py-0.5 uppercase tracking-wide transition-colors",
              loc === lang
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {loc}
          </Link>
        </span>
      ))}
    </div>
  );
}
