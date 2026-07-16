"use client";

import { usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Bascule FR / EN façon interrupteur : deux libellés encadrent un rail dont la
 * pastille glisse vers la langue active. Un clic bascule vers l'autre langue en
 * conservant le chemin courant (/fr/services → /en/services).
 */
export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const [first, second] = i18n.locales as readonly Locale[]; // ["fr", "en"]
  const isSecond = lang === second;
  const other: Locale = isSecond ? first : second;

  function pathForLocale(target: Locale): string {
    const segments = pathname.split("/");
    segments[1] = target; // le 1er segment après "/" est la locale
    return segments.join("/") || `/${target}`;
  }

  const label =
    lang === "fr"
      ? "Switch to English"
      : "Passer au français";

  return (
    <button
      type="button"
      onClick={() => router.push(pathForLocale(other))}
      aria-label={label}
      title={label}
      className="group flex cursor-pointer items-center gap-2 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span
        className={cn(
          "text-xs font-semibold tracking-wide uppercase transition-colors",
          !isSecond ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {first}
      </span>

      <span
        aria-hidden
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted ring-1 ring-border transition-colors group-hover:bg-muted/70"
      >
        <span
          className={cn(
            "absolute left-0.5 size-5 rounded-full bg-primary shadow-sm transition-transform duration-200 ease-out",
            isSecond ? "translate-x-5" : "translate-x-0",
          )}
        />
      </span>

      <span
        className={cn(
          "text-xs font-semibold tracking-wide uppercase transition-colors",
          isSecond ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {second}
      </span>
    </button>
  );
}
