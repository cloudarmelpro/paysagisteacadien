import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { contactSegment, servicesSegment } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Pilule verticale de la bande d'images. Décorative : `alt=""` — ces bandes
 *  de ~64px ne montrent qu'une texture, le sens est porté par l'image centrale. */
function Pill({ src, className }: { src: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative w-12 shrink-0 overflow-hidden rounded-full bg-muted sm:w-14 lg:w-16",
        className,
      )}
    >
      {/*
        `sizes` ne peut PAS valoir 64px : avec `object-cover` dans un conteneur
        de 440px de haut, l'image est mise à l'échelle sur la HAUTEUR — sa
        largeur rendue atteint ~590px. Un source de 64px serait étiré ~9x (flou).
      */}
      <Image src={src} alt="" fill sizes="640px" className="object-cover" />
    </div>
  );
}

/**
 * Hero : bloc texte puis bande d'images — deux pilules étroites de chaque côté
 * d'une grande image centrale, badge de service en surimpression.
 * L'image centrale est en `priority` (LCP de la page d'accueil).
 */
export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
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
            href={localizedPath(lang, servicesSegment)}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11",
            )}
          >
            {dict.hero.ctaSecondary}
          </Link>
        </div>
      </div>

      {/* Bande d'images : pilules · grande image · pilules */}
      <div className="mt-10 flex h-[300px] items-stretch gap-2 sm:h-[360px] sm:gap-3 lg:h-[380px]">
        <Pill src="/images/jardin-1.jpg" className="hidden sm:block" />
        <Pill src="/images/jardin-2.jpg" />

        <div className="relative flex-1 overflow-hidden rounded-3xl bg-muted">
          <Image
            src="/images/hero-pelouse.jpg"
            alt={dict.hero.imageAlt}
            fill
            priority
            sizes="(max-width: 640px) 80vw, 60vw"
            className="object-cover"
          />
          <span className="absolute right-4 bottom-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
            {dict.services.items["entretien-de-terrain"]}
          </span>
        </div>

        <Pill src="/images/jardin-3.jpg" />
        <Pill src="/images/jardin-4.jpg" className="hidden sm:block" />
      </div>
    </section>
  );
}
