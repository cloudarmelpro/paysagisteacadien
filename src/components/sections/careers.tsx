import Image from "next/image";
import { Info, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { serviceImages, siteConfig } from "@/config/site";
import { Reveal } from "@/components/shared/reveal";
import { CareersForm } from "./careers-form";

// Badge posé sur l'image : pilule claire, l'image étant assombrie par les voiles
// quel que soit le thème.
const badgeOnImage =
  "w-fit rounded-full bg-white/90 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase backdrop-blur-sm";

export function Careers({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.careers;

  return (
    <div>
      {/* Bande photo : le geste de métier montre au candidat le travail réel,
          argument de recrutement plus fort qu'un aplat.
          `data-hero` : sentinelle de header-adaptive. */}
      <section className="-mt-16">
        <div data-hero className="relative isolate overflow-hidden bg-muted">
          <Image
            src={serviceImages["services-de-tailles"]}
            alt={dict.services.imageAlts["services-de-tailles"]}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
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

          <div className="relative mx-auto w-full max-w-7xl px-5 pt-36 pb-16 sm:px-8 lg:px-12 lg:pt-44 lg:pb-20">
            <div className="flex max-w-3xl flex-col items-start gap-5">
              <span className={badgeOnImage}>{c.badge}</span>
              <h1 className="text-4xl tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
                {c.title}{" "}
                <span className="text-[oklch(0.86_0.12_150)]">
                  {c.titleAccent}
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/90">
                {c.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-5 lg:gap-16">
        {/* Offres d'emploi + coordonnées */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <Reveal from="left" delay={80}>
            <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
              {c.infoTitle}
            </h2>
          </Reveal>

          {/* Statut des postes */}
          <Reveal from="scale" delay={120} className="flex items-start gap-4 rounded-xl bg-muted p-5">
            <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-medium text-foreground">{c.statusTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                {c.status}
              </p>
            </div>
          </Reveal>

          <Reveal as="dl" stagger delay={180} className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-sm text-foreground/60">{c.cvLabel}</dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.contact.recruitmentEmail}`}
                    className="cursor-pointer font-medium break-all text-foreground transition-colors hover:text-primary"
                  >
                    {siteConfig.contact.recruitmentEmail}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-sm text-foreground/60">{c.phoneLabel}</dt>
                <dd>
                  <a
                    href={`tel:${siteConfig.contact.phoneRaw}`}
                    className="cursor-pointer font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-sm text-foreground/60">{c.areaLabel}</dt>
                <dd className="font-medium text-foreground">
                  {dict.contact.areaValue}
                </dd>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Formulaire de candidature — dans une carte : posé à nu sur le fond,
            il se lisait comme une suite de champs, sans primer sur la colonne
            de coordonnées alors qu'il porte l'action principale. */}
        <Reveal
          from="right"
          delay={160}
          className="rounded-3xl bg-muted/50 p-6 sm:p-8 lg:col-span-3 lg:p-10"
        >
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-xl font-medium tracking-tight uppercase text-foreground/80">
              {c.form.heading}
            </h2>
            <p className="text-sm text-foreground/70">{c.form.lead}</p>
          </div>
          <CareersForm lang={lang} dict={c.form} />
        </Reveal>
      </div>
      </div>
    </div>
  );
}
