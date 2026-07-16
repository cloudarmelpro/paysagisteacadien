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
  type ServiceSlug,
} from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ServiceCard } from "./services";

const badgeClass =
  "w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wider text-foreground/70 uppercase";

/**
 * Page de service. Deux rendus à partir du même gabarit (pour garder un design
 * homogène) :
 *  - « chapeau » de famille (Entretien / Aménagement) → liste ses sous-services ;
 *  - service individuel → sections éditoriales détaillées.
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
  const categoryName = dict.services[group.key];
  const hubHref = localizedPath(lang, `${servicesSegment}/${group.segment}`);

  // Services connexes (pages individuelles) : les autres services, priorité à
  // ceux de la même famille, puis complétés par l'autre famille — toujours 3
  // pour une rangée pleine identique à l'accueil.
  const relatedSlugs = Array.from(
    new Set([
      ...group.services,
      ...serviceGroups.flatMap((g) => g.services),
    ]),
  )
    .filter((s) => s !== slug)
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* En-tête */}
      <div className="mt-6 flex max-w-3xl flex-col items-start gap-5">
        {isCategory ? (
          <span className={badgeClass}>{sd.badge}</span>
        ) : (
          <Link
            href={hubHref}
            className={cn(badgeClass, "cursor-pointer transition-colors hover:bg-muted/70 hover:text-foreground")}
          >
            {categoryName}
          </Link>
        )}
        <h1 className="text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-foreground/70">
          {item.intro}
        </p>
      </div>

      {/* Grande image */}
      <div className="relative mt-10 aspect-video overflow-hidden rounded-3xl bg-muted lg:mt-14">
        <Image
          src={serviceImages[slug as ServiceSlug]}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="object-cover"
        />
      </div>

      {isCategory ? (
        /* Chapeau : cartes des sous-services de la famille */
        <div className="mt-16 lg:mt-24">
          <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {sd.exploreLabel}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.services.map((s, i) => (
              <ServiceCard
                key={s}
                slug={s}
                index={i}
                href={localizedPath(lang, `${servicesSegment}/${s}`)}
                dict={dict}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Service : sections éditoriales (libellé à gauche, texte à droite) */
        <div className="mt-16 flex flex-col gap-10 lg:mt-24 lg:gap-14">
          {(item.sections as { heading: string; body: string }[]).map(
            (section) => (
              <div
                key={section.heading}
                className="grid gap-4 border-t border-dotted border-border pt-8 lg:grid-cols-3 lg:gap-12"
              >
                <h2 className="text-sm font-medium tracking-wide text-foreground uppercase lg:text-base">
                  {section.heading}
                </h2>
                <p className="text-base leading-relaxed text-foreground/70 lg:col-span-2 lg:text-lg">
                  {section.body}
                </p>
              </div>
            ),
          )}
        </div>
      )}

      {/* Services connexes — uniquement sur les pages de service individuelles
          (les chapeaux listent déjà tous leurs sous-services). */}
      {!isCategory && (
        <div className="mt-16 border-t border-dotted border-border pt-10 lg:mt-24 lg:pt-14">
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
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 flex flex-col items-start gap-5 rounded-3xl bg-muted p-8 sm:flex-row sm:items-center sm:justify-between lg:mt-24 lg:p-12">
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
      </div>
    </div>
  );
}
