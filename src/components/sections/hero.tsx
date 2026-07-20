import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { contactSegment, serviceGroups, serviceImages } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroGallery, type GalleryItem } from "./hero-gallery";
import { HeroVideo } from "./hero-video";

/**
 * Les 8 services individuels dans l'ordre du catalogue (source unique
 * `serviceGroups`, sans les pages-chapeaux). Images depuis `serviceImages`.
 */
const GALLERY_SLUGS = serviceGroups.flatMap((g) => g.services);

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const items: GalleryItem[] = GALLERY_SLUGS.map((slug) => ({
    src: serviceImages[slug],
    alt: dict.services.imageAlts[slug],
    label: dict.services.items[slug],
  }));

  return (
    <section className="pb-16 lg:pb-24">
      {/* Bande vidéo pleine largeur ; le texte est composé sur un scrim sombre
          identique en clair et en sombre — pas de variante de thème ici. */}
      <div className="relative isolate overflow-hidden bg-[oklch(0.24_0.02_152)]">
        <HeroVideo src="/videos/hero.mp4" poster="/videos/hero-poster.jpg" />

        {/* Scrim latéral : ≥ 60 % de noir sous la colonne de texte pour tenir
            un contraste ≥ 4.5:1 quel que soit le photogramme. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-black/80 via-40% via-black/60 to-black/25"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-black/60 to-transparent"
        />

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-20 pb-32 sm:px-8 lg:px-12 lg:pt-28 lg:pb-40">
          {/* Bloc texte — entrée échelonnée (CSS, pour ne pas retarder le LCP) */}
          <div className="flex max-w-xl flex-col items-start gap-5">
            <h1 className="hero-rise text-4xl tracking-tight text-balance text-white sm:text-5xl">
              {dict.hero.titleLead}{" "}
              {/* `--primary` clair est trop sombre sur le scrim : même teinte
                  de marque (150), éclaircie pour rester lisible sur la vidéo. */}
              <span className="text-[oklch(0.86_0.12_150)]">
                {dict.hero.titleAccent}
              </span>
            </h1>

            <p
              className="hero-rise max-w-md text-base leading-relaxed text-white/90"
              style={{ animationDelay: "0.1s" }}
            >
              {dict.hero.subtitle}
            </p>

            <div
              className="hero-rise flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              style={{ animationDelay: "0.2s" }}
            >
              <Link
                href={localizedPath(lang, contactSegment)}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 focus-visible:ring-white/60",
                )}
              >
                {dict.hero.cta}
              </Link>
              <Link
                href={`${localizedPath(lang, "")}#services`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 border-white/35 bg-white/10 text-white backdrop-blur-md",
                  "hover:bg-white/20 focus-visible:border-white/70 focus-visible:ring-white/60",
                  "before:via-white/15 dark:border-white/35 dark:bg-white/10 dark:hover:bg-white/20",
                )}
              >
                {dict.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* La galerie chevauche le bas de la vidéo : les vignettes flottent sur
          le photogramme assombri, puis reposent sur le fond de page. */}
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-7xl px-5 sm:-mt-20 sm:px-8 lg:px-12">
        <HeroGallery items={items} initialActive={2} />
      </div>
    </section>
  );
}
