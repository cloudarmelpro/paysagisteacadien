import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { contactSegment, serviceImages } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { CommitmentCarousel } from "./commitment-carousel";

export function About({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const about = dict.about;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* En-tête */}
      <Reveal stagger className="flex max-w-3xl flex-col items-start gap-5">
        <h1 className="text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {about.title}{" "}
          <span className="text-primary">{about.titleAccent}</span>
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-foreground/70">
          {about.intro}
        </p>
      </Reveal>

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
      <Reveal
        from="left"
        stagger
        className="rule-draw mt-16 grid gap-6 border-t border-dotted border-border pt-8 lg:mt-24 lg:grid-cols-3 lg:gap-12"
      >
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
      </Reveal>

      {/* Mission : label à gauche, texte à droite */}
      <Reveal
        from="right"
        stagger
        delay={80}
        className="rule-draw mt-16 grid gap-6 border-t border-dotted border-border pt-8 lg:mt-24 lg:grid-cols-3 lg:gap-12"
      >
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
      </Reveal>

      {/* Engagement : lead + cartes de valeurs */}
      <Reveal
        from="left"
        className="rule-draw mt-16 border-t border-dotted border-border pt-8 lg:mt-24"
      >
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
            prev: dict.a11y.prevValue,
            next: dict.a11y.nextValue,
            region: about.engagementLabel,
          }}
        />
      </Reveal>

      {/* CTA */}
      <Reveal from="scale" className="mt-16 flex flex-col items-start gap-5 rounded-3xl bg-muted p-8 sm:flex-row sm:items-center sm:justify-between lg:mt-24 lg:p-12">
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
      </Reveal>
    </div>
  );
}
