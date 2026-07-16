import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { contactSegment, serviceImages, siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaqAccordion } from "./faq-accordion";

/**
 * FAQ : en-tête et colonne de gauche restent côté serveur ; seul l'accordéon
 * est client (état + animation framer-motion).
 */
export function Faq({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-7xl scroll-mt-20 px-5 py-16 sm:px-8 lg:px-12 lg:py-24"
    >
      {/* Badge + titre */}
      <div className="flex flex-col items-start gap-4">
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wider text-foreground/70 uppercase">
          {dict.faq.badge}
        </span>
        <h2 className="max-w-2xl text-3xl tracking-tight text-balance sm:text-4xl lg:text-5xl">
          {dict.faq.title}{" "}
          <span className="text-primary">{dict.faq.titleAccent}</span>
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-foreground/70">
          {dict.faq.intro}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-3 lg:gap-14">
        {/* Colonne gauche : carte photo + relance */}
        <aside className="flex flex-col gap-5">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted sm:aspect-3/2 lg:aspect-4/5">
            <Image
              src={serviceImages["entretien-de-terrain"]}
              alt={dict.faq.asideImageAlt}
              fill
              sizes="(max-width: 1024px) 90vw, 30vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-5">
              <p className="text-sm font-medium text-white">{siteConfig.name}</p>
              <p className="text-xs text-white/75">
                {siteConfig.contact.serviceArea}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3">
            <p className="font-medium text-foreground">{dict.faq.asideTitle}</p>
            <p className="text-sm leading-relaxed text-foreground/70">
              {dict.faq.asideLead}
            </p>
            <Link
              href={localizedPath(lang, contactSegment)}
              className={cn(buttonVariants({ variant: "outline" }), "mt-1")}
            >
              {dict.faq.asideCta}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </aside>

        {/* Colonne droite : accordéon */}
        <div className="lg:col-span-2">
          <FaqAccordion groups={dict.faq.groups} />
        </div>
      </div>
    </section>
  );
}
