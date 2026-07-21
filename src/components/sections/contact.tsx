import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { serviceGroups, siteConfig } from "@/config/site";
import { Reveal } from "@/components/shared/reveal";
import { ContactForm } from "./contact-form";

// Pilule claire sur la bande sombre, identique aux autres pages à bande.
const badgeOnBand =
  "w-fit rounded-full bg-white/90 px-3.5 py-1 text-xs font-medium tracking-wider text-neutral-700 uppercase backdrop-blur-sm";

export function Contact({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.contact;

  const serviceOptions = serviceGroups
    .flatMap((g) => g.services)
    .map((slug) => ({ value: slug, label: dict.services.items[slug] }));

  return (
    <div>
      {/* Bande en aplat, comme À propos et confidentialité : sur une page dont
          le formulaire porte toute l'action, une photo disperserait l'attention.
          `data-hero` : sentinelle de header-adaptive. */}
      <section className="-mt-16">
        <div
          data-hero
          className="relative isolate overflow-hidden bg-[oklch(0.24_0.02_152)]"
        >
          <div className="relative mx-auto w-full max-w-7xl px-5 pt-36 pb-16 sm:px-8 lg:px-12 lg:pt-44 lg:pb-20">
            <div className="flex max-w-3xl flex-col items-start gap-5">
              <span className={badgeOnBand}>{c.badge}</span>
              <h1 className="text-4xl tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
                {c.title}{" "}
                <span className="text-[oklch(0.86_0.12_150)]">
                  {c.titleAccent}
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-white/85">
                {c.intro}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-5 lg:gap-16">
        {/* Coordonnées */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <Reveal from="left" delay={80}>
            <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
              {c.infoTitle}
            </h2>
          </Reveal>

          <Reveal as="dl" stagger delay={140} className="flex flex-col gap-6">
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
              <Mail className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-sm text-foreground/60">{c.emailLabel}</dt>
                <dd>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="cursor-pointer font-medium break-all text-foreground transition-colors hover:text-primary"
                  >
                    {siteConfig.contact.email}
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

            <div className="flex items-start gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <dt className="text-sm text-foreground/60">{c.hoursTitle}</dt>
                <dd className="flex flex-col text-sm text-foreground/80">
                  <span>{c.hours.weekdays}</span>
                  <span>{c.hours.saturday}</span>
                  <span>{c.hours.sunday}</span>
                </dd>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Formulaire */}
        <Reveal from="right" delay={160} className="lg:col-span-3">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-xl font-medium tracking-tight uppercase text-foreground/80">
              {c.form.heading}
            </h2>
            <p className="text-sm text-foreground/70">{c.form.lead}</p>
          </div>
          <ContactForm
            lang={lang}
            dict={c.form}
            serviceOptions={serviceOptions}
          />
        </Reveal>
      </div>
      </div>
    </div>
  );
}
