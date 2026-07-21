import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { serviceGroups, serviceImages, servicesSegment } from "@/config/site";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";

/** Les services individuels (hors pages-chapeaux), dérivés de `serviceGroups` :
 *  tous ont une description dans `dict.services.descriptions`. */
type GroupServiceSlug = (typeof serviceGroups)[number]["services"][number];

/**
 * Carte de service : la carte entière est le lien. Le bouton fléché est un
 * `<span>` décoratif, un bouton imbriqué dans un lien étant du HTML invalide.
 *
 * `@container` : la carte vit dans des grilles de largeurs différentes (2 col.
 * à l'accueil, 3 col. sur les pages de service) ; padding et typo suivent la
 * largeur réelle de la carte (`@lg` ≈ 512px), pas le viewport.
 */
export function ServiceCard({
  slug,
  index,
  href,
  dict,
  className,
  sizes = "(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw",
}: {
  slug: GroupServiceSlug;
  index: number;
  href: string;
  dict: Dictionary;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group @container relative flex aspect-4/5 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl bg-muted p-6 focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none sm:aspect-4/3 lg:aspect-4/5 @lg:p-8",
        className,
      )}
    >
      {/*
        Pas de `-z-10` : l'image passerait derrière le `bg-muted` du lien parent,
        donc invisible. Image et voile en z auto, le contenu passe devant via
        `relative`.
      */}
      <Image
        src={serviceImages[slug]}
        alt={dict.services.imageAlts[slug]}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
      />
      {/* Voile : contraste du texte blanc sur les photos claires. Le haut est
          renforcé — sur les photos les plus lumineuses, le numéro y tombait
          sous le seuil. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/45" />

      {/* Numéro + filet */}
      <div className="relative">
        <span className="text-xs font-medium text-white @lg:text-sm">
          {String(index + 1).padStart(2, "0")}.
        </span>
      </div>

      {/* Texte */}
      <div className="relative flex flex-col gap-2 pr-12 @lg:pr-16">
        {/* h3 : cette carte se place sous un h2 sur les pages de service ; en
            h4 elle sautait un niveau. */}
        <h3 className="text-lg font-medium text-white @lg:text-2xl @lg:tracking-tight">
          {dict.services.items[slug]}
        </h3>
        <p className="text-sm leading-relaxed text-white/90 @lg:max-w-md @lg:text-base">
          {dict.services.descriptions[slug]}
        </p>
        <span className="mt-1 w-fit text-xs font-medium text-white underline decoration-white/50 underline-offset-4 transition-colors duration-200 group-hover:decoration-white @lg:text-sm">
          {dict.services.learnMore}
        </span>
      </div>

      {/* Bouton rond fléché */}
      <span
        aria-hidden
        className="absolute right-5 bottom-5 inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 @lg:right-6 @lg:bottom-6 @lg:size-12"
      >
        <ArrowUpRight className="size-5 @lg:size-6" />
      </span>
    </Link>
  );
}

export function Services({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section
      id="services"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
    >
      {/* En-tête : badge + titre à gauche, intro à droite */}
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex flex-col items-start gap-4">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wider text-foreground/70 uppercase">
            {dict.services.badge}
          </span>
          <h2 className="max-w-lg text-3xl tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {dict.services.title}{" "}
            <span className="text-primary">{dict.services.titleAccent}</span>
          </h2>
        </div>
        <p className="max-w-md text-base leading-relaxed text-foreground/70 lg:text-right">
          {dict.services.intro}
        </p>
      </Reveal>

      {/* Les deux familles, chacune en grille 2×2 */}
      <div className="mt-12 flex flex-col gap-16 lg:mt-16 lg:gap-24">
        {serviceGroups.map((group) => (
          <div key={group.key}>
            {/* Chapeau de famille */}
            <Reveal className="flex flex-col gap-4 border-t border-dotted border-border pt-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8 lg:pt-8">
              <div className="flex max-w-xl flex-col gap-2">
                <h3 className="text-2xl tracking-tight sm:text-3xl">
                  {dict.services[group.key]}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70 sm:text-base">
                  {dict.services[`${group.key}Lead` as const]}
                </p>
              </div>
              <Link
                href={localizedPath(lang, `${servicesSegment}/${group.segment}`)}
                className="group -my-2 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md py-2 text-sm font-medium text-primary transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none"
              >
                {dict.services.learnMore}
                <ArrowRight
                  className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </Reveal>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:gap-6">
              {group.services.map((slug, i) => (
                <Reveal key={slug} delay={i * 80}>
                  <ServiceCard
                    slug={slug}
                    index={i}
                    href={localizedPath(lang, `${servicesSegment}/${slug}`)}
                    dict={dict}
                    className="lg:aspect-3/2"
                    sizes="(max-width: 640px) 90vw, (max-width: 1280px) 48vw, 592px"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
