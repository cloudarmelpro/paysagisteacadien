"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizedPath } from "@/lib/i18n";
import { contactSegment } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NotFoundLabels = {
  badge: string;
  title: string;
  lead: string;
  cta: string;
  ctaSecondary: string;
};

/**
 * Contenu de la 404. Client uniquement pour lire le chemin : `not-found.tsx` ne
 * reçoit pas `params`, la locale ne peut donc pas venir du serveur. Les deux
 * jeux de libellés sont passés en props — quelques chaînes, contre le
 * dictionnaire entier si ce composant l'importait lui-même.
 */
export function NotFoundContent({
  fr,
  en,
}: {
  fr: NotFoundLabels;
  en: NotFoundLabels;
}) {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "fr";
  const t = lang === "en" ? en : fr;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-5 px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wider text-foreground/70 uppercase">
        {t.badge}
      </span>
      <h1 className="max-w-2xl text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
        {t.title}
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-foreground/70">
        {t.lead}
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link
          href={localizedPath(lang, "")}
          className={cn(buttonVariants({ size: "lg" }), "h-11")}
        >
          {t.cta}
        </Link>
        <Link
          href={localizedPath(lang, contactSegment)}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11")}
        >
          {t.ctaSecondary}
        </Link>
      </div>
    </div>
  );
}
