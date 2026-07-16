import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { serviceGroups, serviceImages, servicesSegment } from "@/config/site";

/**
 * Les 6 services réels — hors pages-chapeaux. Type dérivé de `serviceGroups`
 * plutôt que de `ServiceSlug` (qui couvre les 8) : seuls ces 6-là ont une
 * description, et TypeScript doit le garantir.
 */
type GroupServiceSlug = (typeof serviceGroups)[number]["services"][number];

/**
 * Carte de service : photo en fond, voile dégradé pour la lisibilité, numéro et
 * filet en haut, texte en bas, bouton rond fléché en bas à droite.
 * Le bouton est un `<span>` décoratif — la carte entière est déjà le lien, et
 * imbriquer un bouton dans un lien produirait du HTML invalide.
 */
export function ServiceCard({
  slug,
  index,
  href,
  dict,
}: {
  slug: GroupServiceSlug;
  index: number;
  href: string;
  dict: Dictionary;
}) {
  return (
    <Link
      href={href}
      className="group relative flex aspect-4/5 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl bg-muted p-6 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:aspect-4/3 lg:aspect-4/5"
    >
      {/*
        Pas de `-z-10` ici : un z-index négatif ferait passer l'image DERRIÈRE le
        `bg-muted` du lien parent, donc invisible. L'image et le voile restent en
        z auto (ils peignent au-dessus du fond du parent) et c'est le contenu qui
        passe devant grâce à `relative`.
      */}
      <Image
        src={serviceImages[slug]}
        alt={dict.services.imageAlts[slug]}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* Voile : sans lui, le texte blanc serait illisible sur les photos claires */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

      {/* Numéro + filet */}
      <div className="relative">
        <span className="text-xs font-medium text-white/70">
          {String(index + 1).padStart(2, "0")}.
        </span>
      </div>

      {/* Texte */}
      <div className="relative flex flex-col gap-2 pr-12">
        <h4 className="text-lg font-medium text-white">
          {dict.services.items[slug]}
        </h4>
        <p className="text-sm leading-relaxed text-white/80">
          {dict.services.descriptions[slug]}
        </p>
        <span className="mt-1 w-fit text-xs font-medium text-white underline underline-offset-4">
          {dict.services.learnMore}
        </span>
      </div>

      {/* Bouton rond fléché */}
      <span
        aria-hidden
        className="absolute right-5 bottom-5 inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <ArrowUpRight className="size-5" />
      </span>
    </Link>
  );
}

/**
 * Section services : en-tête éditorial (titre à gauche, intro à droite), puis
 * les deux familles du site — Entretien et Aménagement — chacune avec son
 * chapeau et ses trois cartes photo. La numérotation repart à 01 par famille.
 */
export function Services({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section
      id="services"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
    >
      {/* En-tête : badge + titre à gauche, intro à droite */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
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
      </div>

      {/* Les deux familles */}
      <div className="mt-12 flex flex-col gap-14 lg:mt-16 lg:gap-20">
        {serviceGroups.map((group) => (
          <div key={group.key}>
            {/* Chapeau de famille */}
            <div className="flex flex-col gap-3 border-t border-dotted border-border pt-6 sm:flex-row sm:items-baseline sm:justify-between">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h3 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
                  {dict.services[group.key]}
                </h3>
                <p className="text-sm text-foreground/70">
                  {dict.services[`${group.key}Lead` as const]}
                </p>
              </div>
              <Link
                href={localizedPath(lang, `${servicesSegment}/${group.segment}`)}
                className="group inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
              >
                {dict.services.learnMore}
                <div className="size-4 transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </div>
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.services.map((slug, i) => (
                <ServiceCard
                  key={slug}
                  slug={slug}
                  index={i}
                  href={localizedPath(lang, `${servicesSegment}/${slug}`)}
                  dict={dict}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
