import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { contactSegment, serviceImages, siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CommitmentCarousel } from "./commitment-carousel";

const badgeClass =
  "w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wider text-foreground/70 uppercase";

export function About({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const about = dict.about;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* En-tête */}
      <div className="flex max-w-3xl flex-col items-start gap-5">
        <span className={badgeClass}>{about.badge}</span>
        <h1 className="text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {about.title}{" "}
          <span className="text-primary">{about.titleAccent}</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-foreground/70">
          {about.intro}
        </p>
      </div>

      {/* Grande image */}
      <div className="relative mt-10 aspect-video overflow-hidden rounded-3xl bg-muted lg:mt-14">
        <Image
          src={serviceImages["entretien-de-terrain"]}
          alt={about.imageAlt}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1216px"
          className="object-cover"
        />
      </div>

      {/* Notre approche : label à gauche, paragraphes à droite */}
      <div className="mt-16 grid gap-6 border-t border-dotted border-border pt-8 lg:mt-24 lg:grid-cols-3 lg:gap-12">
        <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
          {about.approachLabel}
        </h2>
        <div className="flex flex-col gap-6 lg:col-span-2">
          {about.approach.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-base leading-relaxed text-foreground/70 lg:text-lg"
            >
              {paragraph}
            </p>
          ))}
          <p className="text-lg font-medium text-primary lg:text-xl">
            {about.approachClosing}
          </p>
        </div>
      </div>

      {/* Le fondateur — portrait à gauche, bio à droite.
          Placé après « Notre approche » : le lecteur découvre d'abord l'entreprise,
          puis l'humain derrière. C'est le seul endroit du site où Cédric existe
          autrement que dans le JSON-LD.
          La photo est en 4:5 (ratio natif du fichier), sans recadrage destructeur. */}
      <div className="mt-16 grid gap-8 border-t border-dotted border-border pt-8 lg:mt-24 lg:grid-cols-5 lg:gap-12">
        <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted lg:col-span-2">
          <Image
            src="/images/cedric.jpeg"
            alt={about.founder.photoAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-4 lg:col-span-3">
          <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {about.founder.label}
          </h2>
          <div className="flex flex-col gap-1">
            <p className="text-2xl font-medium tracking-tight text-foreground lg:text-3xl">
              {siteConfig.owner}
            </p>
            <p className="text-sm font-medium text-primary">
              {about.founder.role}
            </p>
          </div>
          {about.founder.bio.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-base leading-relaxed text-foreground/70 lg:text-lg"
            >
              {paragraph}
            </p>
          ))}
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-1 inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
          >
            {about.founder.linkedin}
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>

      {/* Mission : label à gauche, texte à droite */}
      <div className="mt-16 grid gap-6 border-t border-dotted border-border pt-8 lg:mt-24 lg:grid-cols-3 lg:gap-12">
        <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
          {about.missionLabel}
        </h2>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <p className="text-xl leading-relaxed text-balance text-foreground lg:text-2xl">
            {about.mission}
          </p>
          {about.missionBody.map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="text-base leading-relaxed text-foreground/70 lg:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Engagement : lead + cartes de valeurs */}
      <div className="mt-16 border-t border-dotted border-border pt-8 lg:mt-24">
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
          <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {about.engagementLabel}
          </h2>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <p className="text-xl leading-relaxed text-balance text-foreground lg:text-2xl">
              {about.engagementLead}
            </p>
            {about.engagementBody.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-base leading-relaxed text-foreground/70 lg:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <h3 className="mt-12 text-xl font-medium tracking-tight text-foreground lg:mt-16">
          {about.valuesTitle}
        </h3>

        <CommitmentCarousel
          values={about.values}
          labels={{
            prev: lang === "fr" ? "Valeur précédente" : "Previous",
            next: lang === "fr" ? "Valeur suivante" : "Next",
            region: about.engagementLabel,
          }}
        />
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-col items-start gap-5 rounded-3xl bg-muted p-8 sm:flex-row sm:items-center sm:justify-between lg:mt-24 lg:p-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-medium tracking-tight text-balance">
            {about.ctaTitle}
          </h2>
          <p className="text-foreground/70">{about.ctaLead}</p>
        </div>
        <Link
          href={localizedPath(lang, contactSegment)}
          className={cn(buttonVariants({ size: "lg" }), "h-11 shrink-0")}
        >
          {about.cta}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
