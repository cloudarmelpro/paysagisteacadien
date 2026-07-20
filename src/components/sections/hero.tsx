import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { contactSegment, serviceGroups, serviceImages } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroGallery, type GalleryItem } from "./hero-gallery";

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
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* Bloc texte — entrée échelonnée (CSS, pour ne pas retarder le LCP) */}
      <div className="flex max-w-xl flex-col items-start gap-5">
        <h1 className="hero-rise text-4xl tracking-tight text-balance sm:text-5xl">
          {dict.hero.titleLead}{" "}
          <span className="text-primary">{dict.hero.titleAccent}</span>
        </h1>

        <p
          className="hero-rise max-w-md text-base leading-relaxed text-foreground/70"
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
