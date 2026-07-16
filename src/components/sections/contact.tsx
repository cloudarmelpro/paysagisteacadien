import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { serviceGroups, siteConfig } from "@/config/site";
import { ContactForm } from "./contact-form";

const badgeClass =
  "w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wider text-foreground/70 uppercase";

export function Contact({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.contact;

  // Options du menu « Service souhaité » : les 6 services réels, libellés traduits.
  const serviceOptions = serviceGroups
    .flatMap((g) => g.services)
    .map((slug) => ({ value: slug, label: dict.services.items[slug] }));

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* En-tête */}
      <div className="flex max-w-2xl flex-col items-start gap-5">
        <span className={badgeClass}>{c.badge}</span>
        <h1 className="text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {c.title} <span className="text-primary">{c.titleAccent}</span>
        </h1>
        <p className="text-lg leading-relaxed text-foreground/70">{c.intro}</p>
      </div>

      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-5 lg:gap-16">
        {/* Coordonnées */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {c.infoTitle}
          </h2>

          <dl className="flex flex-col gap-6">
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
                  {siteConfig.contact.serviceArea}
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
          </dl>
        </div>

        {/* Formulaire — sans cadre : il se fond dans la page. */}
        <div className="lg:col-span-3">
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
        </div>
      </div>
    </section>
  );
}
