import { Info, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { siteConfig } from "@/config/site";
import { CareersForm } from "./careers-form";

const badgeClass =
  "w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wider text-foreground/70 uppercase";

export function Careers({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const c = dict.careers;

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
        {/* Offres d'emploi + coordonnées */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          <h2 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {c.infoTitle}
          </h2>

          {/* Statut des postes */}
          <div className="flex items-start gap-4 rounded-xl bg-muted p-5">
            <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <p className="text-sm font-medium text-foreground">{c.statusTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                {c.status}
              </p>
            </div>
          </div>

          <dl className="flex flex-col gap-6">
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
          </dl>
        </div>

        {/* Formulaire de candidature */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-xl font-medium tracking-tight uppercase text-foreground/80">
              {c.form.heading}
            </h2>
            <p className="text-sm text-foreground/70">{c.form.lead}</p>
          </div>
          <CareersForm lang={lang} dict={c.form} />
        </div>
      </div>
    </section>
  );
}
