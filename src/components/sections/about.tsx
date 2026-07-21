import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { contactSegment } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";
import { CommitmentCarousel } from "./commitment-carousel";

// Badge posé sur l'image : pilule claire, toujours en clair — l'image est
// assombrie par les voiles quel que soit le thème.
const badgeOnImage =
  "w-fit rounded-full bg-white/90 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase backdrop-blur-sm";

export function About({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const about = dict.about;

  return (
    <div>
      {/* Bande pleine largeur en aplat, remontée derrière l'en-tête transparent
          — même traitement que la page confidentialité.
          `data-hero` : sentinelle de header-adaptive. */}
      <section className="-mt-16">
        <div
          data-hero
          className="relative isolate overflow-hidden bg-[oklch(0.24_0.02_152)]"
        >
          <div className="relative mx-auto w-full max-w-7xl px-5 pt-36 pb-16 sm:px-8 lg:px-12 lg:pt-44 lg:pb-20">
            <div className="flex max-w-3xl flex-col items-start gap-5">
              <span className={badgeOnImage}>{about.badge}</span>
              <h1 className="text-4xl tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
                {about.title}{" "}
                {/* `--primary` est trop sombre sur le voile : même teinte de
                    marque, éclaircie, comme le hero de l'accueil. */}
                <span className="text-[oklch(0.86_0.12_150)]">
                  {about.titleAccent}
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/85">
                {about.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
      {/* Repères concrets, sans cadre ni filet : le clip `rounded` de l'ancienne
          carte laissait voir le fond des gouttières aux angles. */}
      <Reveal
        stagger
        className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 py-4 lg:mt-16 lg:grid-cols-4 lg:gap-x-12 lg:py-6"
      >
        {about.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2">
            {/* Le libellé d'abord : les valeurs n'ont pas la même longueur, et
                sous la valeur il retomberait à des hauteurs différentes. */}
            <span className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
              {stat.label}
            </span>
            <span className="text-2xl font-medium tracking-tight text-balance text-foreground">
              {stat.value}
            </span>
          </div>
        ))}
      </Reveal>

      {/* Notre approche : label à gauche, paragraphes à droite */}
      <Reveal
        from="left"
        stagger
        className="mt-16 grid gap-6 pt-8 lg:mt-24 lg:grid-cols-3 lg:gap-12"
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
    </div>
  );
}
