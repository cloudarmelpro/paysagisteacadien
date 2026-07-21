"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Frontière d'erreur de la section `[lang]` : couvre les pages et les layouts
 * imbriqués, pas le layout racine (voir `app/global-error.tsx`).
 *
 * Next impose un Client Component ici : il ne peut donc recevoir aucun
 * dictionnaire du serveur. Les libellés sont inlinés — seule exception à la
 * règle « aucune chaîne en dur dans le JSX » ; les importer embarquerait les
 * deux dictionnaires entiers dans le bundle client de chaque route.
 */
const LABELS = {
  fr: {
    badge: "Erreur",
    title: "Une erreur est survenue",
    lead: "Un problème technique nous empêche d'afficher cette page. Réessayez, ou revenez à l'accueil.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
  },
  en: {
    badge: "Error",
    title: "Something went wrong",
    lead: "A technical problem is stopping this page from loading. Try again, or head back home.",
    retry: "Try again",
    home: "Back to home",
  },
};

export default function RouteError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const pathname = usePathname();
  const lang = pathname.startsWith("/en") ? "en" : "fr";
  const t = LABELS[lang];

  useEffect(() => {
    // Le `digest` est la seule prise pour relier l'incident aux journaux du
    // serveur : le message réel est masqué au client en production.
    console.error("Erreur de rendu :", error.digest ?? error.message);
  }, [error]);

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
        <button
          type="button"
          onClick={unstable_retry}
          className={cn(buttonVariants({ size: "lg" }), "h-11 cursor-pointer")}
        >
          {t.retry}
        </button>
        <Link
          href={`/${lang}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11",
          )}
        >
          {t.home}
        </Link>
      </div>
    </div>
  );
}
