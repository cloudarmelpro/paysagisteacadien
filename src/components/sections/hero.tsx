import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { contactSegment, serviceImages } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroGallery, type GalleryItem } from "./hero-gallery";

/**
 * Uniquement des services réels, pas de page-chapeau : les images viennent de
 * `serviceImages`, source unique partagée avec la section services.
 */
const GALLERY_SLUGS = [
  "tourbe",
  "services-de-tailles",
  "entretien-de-terrain",
  "plantation",
  "entretien-de-rocaille",
] as const;

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const items: GalleryItem[] = GALLERY_SLUGS.map((slug) => ({
    src: serviceImages[slug],
    alt: dict.services.imageAlts[slug],
    label: dict.services.items[slug],
  }));

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* Bloc texte */}
      <div className="flex max-w-xl flex-col items-start gap-5">
        <h1 className="text-4xl tracking-tight text-balance sm:text-5xl">
          {dict.hero.titleLead}{" "}
          <span className="text-primary">{dict.hero.titleAccent}</span>
        </h1>

        <p className="max-w-md text-base leading-relaxed text-foreground/70">
          {dict.hero.subtitle}
        </p>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href={localizedPath(lang, contactSegment)}
            className={cn(buttonVariants({ size: "lg" }), "h-11")}
          >
            {dict.hero.cta}
          </Link>
          <Link
            href={`${localizedPath(lang, "")}#services`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11",
            )}
          >
            {dict.hero.ctaSecondary}
          </Link>
        </div>
      </div>

      {/* Bande d'images cliquable */}
      <div className="mt-10">
        <HeroGallery items={items} initialActive={2} />
      </div>
    </section>
  );
}
