import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import {
  contactSegment,
  resolveServiceSlug,
  serviceGroups,
  serviceImages,
  servicesSegment,
} from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { ServiceCard } from "./services";

// Badge posé sur l'image du hero : pilule claire et douce (style des badges du
// site), toujours claire — l'image est sombre quel que soit le thème.
const badgeOnImage =
  "w-fit rounded-full bg-white/90 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase backdrop-blur-sm";

/**
 * Page de service, deux rendus sur le même gabarit : chapeau de famille (liste
 * ses sous-services) ou service individuel (sections éditoriales).
 * Le slug est supposé valide : la route appelle `notFound()` en amont.
 */
export function ServiceDetail({
  lang,
  dict,
  slug,
}: {
  lang: Locale;
  dict: Dictionary;
  slug: string;
}) {
  const resolved = resolveServiceSlug(slug);
  if (!resolved) return null;

  const sd = dict.serviceDetail;
  const item = sd.items[slug as keyof typeof sd.items];
  const title = dict.services.items[slug as keyof typeof dict.services.items];
  const imageAlt =
    dict.services.imageAlts[slug as keyof typeof dict.services.imageAlts];

  const { group } = resolved;
  const isCategory = resolved.kind === "category";
  const imageSlug = isCategory ? group.segment : resolved.slug;
  const categoryName = dict.services[group.key];
  const hubHref = localizedPath(lang, `${servicesSegment}/${group.segment}`);

  // Priorité à la même famille, complétée par l'autre ; toujours 3 pour une
  // rangée pleine identique à la grille de l'accueil.
  const relatedSlugs = Array.from(
    new Set([
      ...group.services,
      ...serviceGroups.flatMap((g) => g.services),
    ]),
  )
    .filter((s) => s !== slug)
    .slice(0, 3);

  return (
    <div>
      {/* Bande image plein écran, remontée derrière l'en-tête transparent
          (comme le hero de l'accueil). `data-hero` : sentinelle header-adaptive. */}
      <section className="-mt-16">
        <div data-hero className="relative isolate overflow-hidden bg-muted">
          <Image
            src={serviceImages[imageSlug]}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Voiles : contraste du titre blanc + lisibilité de l'en-tête. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-r from-black/80 via-40% via-black/55 to-black/25"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/70 via-black/35 to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/45 to-transparent"
          />

          <div className="relative mx-auto w-full max-w-7xl px-5 pt-36 pb-20 sm:px-8 lg:px-12 lg:pt-44 lg:pb-28">
            <div className="flex max-w-3xl flex-col items-start gap-5">
              {isCategory ? (
                <span className={badgeOnImage}>{sd.badge}</span>
              ) : (
                <Link
                  href={hubHref}
                  className={cn(
                    badgeOnImage,
                    "cursor-pointer transition-colors hover:bg-white focus-visible:ring-3 focus-visible:ring-white/60 focus-visible:outline-none",
                  )}
                >
                  {categoryName}
                </Link>
              )}
              <h1 className="text-4xl tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/90">
                {item.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reste du détail — conteneur habituel */}
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">

      {isCategory ? (
        /* Chapeau : cartes des sous-services de la famille */
        <div className="mt-16 lg:mt-24">
          <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {sd.exploreLabel}
          </h2>
          {/* 2×2 : chaque famille a exactement 4 services — une grille pleine,
              plus lisible qu'un 3+1 bancal. */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {group.services.map((s, i) => (
              <Reveal key={s} delay={i * 80}>
                {/* Format paysage comme la grille de l'accueil : en 2 colonnes,
                    le `aspect-4/5` par défaut rendait les cartes trop hautes. */}
                <ServiceCard
                  slug={s}
                  index={i}
                  href={localizedPath(lang, `${servicesSegment}/${s}`)}
                  dict={dict}
                  className="lg:aspect-3/2"
                  sizes="(max-width: 640px) 90vw, (max-width: 1280px) 48vw, 592px"
                />
              </Reveal>
            ))}
          </div>
        </div>
      ) : (
        /* Service : sections éditoriales (libellé à gauche, texte à droite) */
        <div className="mt-16 flex flex-col gap-10 lg:mt-24 lg:gap-14">
          {(item.sections as { heading: string; body: string }[]).map(
            (section, i) => (
              <Reveal
                key={section.heading}
                stagger
                className={cn(
                  "grid gap-4 pt-8 lg:grid-cols-3 lg:gap-12",
                  // Pas de filet au-dessus de la 1re section (comme la page À propos).
                  i > 0 && "rule-draw border-t border-dotted border-border",
                )}
              >
                <h2 className="text-sm font-medium tracking-wide text-foreground uppercase lg:text-base">
                  {section.heading}
                </h2>
                <p className="text-base leading-relaxed text-foreground/70 lg:col-span-2 lg:text-lg">
                  {section.body}
                </p>
              </Reveal>
            ),
          )}
        </div>
      )}

      {/* Services connexes : inutiles sur un chapeau, qui liste déjà les siens. */}
      {!isCategory && (
        <Reveal className="rule-draw mt-16 border-t border-dotted border-border pt-10 lg:mt-24 lg:pt-14">
          <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {sd.relatedLabel}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedSlugs.map((s, i) => (
              <ServiceCard
                key={s}
                slug={s}
                index={i}
                href={localizedPath(lang, `${servicesSegment}/${s}`)}
                dict={dict}
              />
            ))}
          </div>
        </Reveal>
      )}

      {/* CTA */}
      <Reveal from="scale" className="mt-16 flex flex-col items-start gap-5 rounded-3xl bg-muted p-8 sm:flex-row sm:items-center sm:justify-between lg:mt-24 lg:p-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium tracking-tight text-balance">
            {sd.ctaTitle}
          </h2>
          <p className="text-foreground/70">{sd.ctaLead}</p>
        </div>
        <Link
          href={localizedPath(lang, contactSegment)}
          className={cn(buttonVariants({ size: "lg" }), "h-11 shrink-0")}
        >
          {sd.cta}
          <ArrowUpRight className="size-4" />
        </Link>
      </Reveal>
      </div>
    </div>
  );
}
