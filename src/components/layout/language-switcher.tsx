"use client";

import { usePathname } from "next/navigation";
import { i18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Bascule FR / EN conservant le chemin courant (/fr/services → /en/services).
 * Un `<a>` natif, pas de navigation client : le rechargement complet est ce qui
 * fait rendre <html lang> côté serveur dans la nouvelle langue.
 *
 * `label` est rédigé dans la langue de DESTINATION, pas celle de la page : c'est
 * ce qui le rend lisible par le visiteur qu'il cible. D'où `lang` sur le lien,
 * sans quoi un lecteur d'écran prononcerait ce libellé avec la voix de la page.
 */
export function LanguageSwitcher({
  lang,
  label,
  adaptive = false,
}: {
  lang: Locale;
  label: string;
  /** Barre d'en-tête seulement : contenu clair quand l'en-tête est transparent
      (`data-transparent`). Ne pas poser dans le panneau mobile, à fond solide. */
  adaptive?: boolean;
}) {
  const pathname = usePathname();

  const [first, second] = i18n.locales as readonly Locale[]; // ["fr", "en"]
  const isSecond = lang === second;
  const other: Locale = isSecond ? first : second;

  function pathForLocale(target: Locale): string {
    const segments = pathname.split("/");
    segments[1] = target; // le 1er segment après "/" est la locale
    return segments.join("/") || `/${target}`;
  }

  return (
    <a
      href={pathForLocale(other)}
      hrefLang={other}
      lang={other}
      aria-label={label}
      title={label}
      className={cn(
        "group flex cursor-pointer items-center gap-2 rounded-full focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none",
        adaptive &&
          "group-data-[transparent]/header:focus-visible:ring-white/60!",
      )}
    >
      <span
        className={cn(
          "text-xs font-semibold tracking-wide uppercase transition-colors",
          !isSecond ? "text-foreground" : "text-muted-foreground",
          adaptive &&
            (!isSecond
              ? "group-data-[transparent]/header:text-white"
              : "group-data-[transparent]/header:text-white/70"),
        )}
      >
        {first}
      </span>

      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full bg-muted ring-1 ring-border transition-colors group-hover:bg-muted/70",
          // `!` sur le survol : conflit avec `group-hover:bg-muted/70`, deux
          // chaînes de variantes dont l'ordre n'est pas garanti.
          adaptive &&
            "group-data-[transparent]/header:bg-white/25 group-data-[transparent]/header:ring-white/40 group-data-[transparent]/header:group-hover:bg-white/35!",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 size-5 rounded-full bg-primary shadow-sm transition-transform duration-200 ease-out",
            isSecond ? "translate-x-5" : "translate-x-0",
            // Teinte d'accent du hero : `--primary` clair serait illisible
            // sur la piste translucide posée sur la vidéo.
            adaptive &&
              "group-data-[transparent]/header:bg-[oklch(0.86_0.12_150)]",
          )}
        />
      </span>

      <span
        className={cn(
          "text-xs font-semibold tracking-wide uppercase transition-colors",
          isSecond ? "text-foreground" : "text-muted-foreground",
          adaptive &&
            (isSecond
              ? "group-data-[transparent]/header:text-white"
              : "group-data-[transparent]/header:text-white/70"),
        )}
      >
        {second}
      </span>
    </a>
  );
}
