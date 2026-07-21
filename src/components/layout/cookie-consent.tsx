"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";
import { privacySegment } from "@/config/site";
import { Button } from "@/components/ui/button";

/**
 * Clé du choix de consentement. Tout futur outil non essentiel (analytique,
 * pixel) doit être conditionné à la valeur `"granted"` avant de se charger.
 */
export const CONSENT_KEY = "cookie-consent";

type Consent = "granted" | "denied";

/**
 * Store externe minimal autour de `localStorage`. `useSyncExternalStore` est le
 * mécanisme prévu pour lire un état navigateur sans écart d'hydratation : le
 * snapshot serveur (`"ssr"`) masque la bannière au rendu serveur et au premier
 * rendu client, puis le snapshot client prend le relais. `setItem` ne déclenche
 * pas l'événement `storage` dans le même onglet : on notifie donc à la main.
 */
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string | null {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    // localStorage indisponible (navigation privée stricte) : ne pas afficher.
    return "denied";
  }
}

function setConsent(value: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Rien à faire : le refus par défaut reste le comportement sûr.
  }
  for (const l of listeners) l();
}

/**
 * Efface le choix enregistré : la bannière réapparaît immédiatement (les
 * listeners sont notifiés). Destiné à un contrôle « Gérer mes témoins » à
 * brancher dans le pied de page — la Loi 25 exige de pouvoir revenir sur son
 * consentement, ce qu'un choix stocké définitivement ne permet pas.
 */
export function resetConsent(): void {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Stockage indisponible : rien à réinitialiser.
  }
  for (const l of listeners) l();
}

type CookieConsentLabels = {
  message: string;
  accept: string;
  refuse: string;
  policy: string;
  ariaLabel: string;
};

/**
 * Bannière de consentement (Loi 25). Visible tant qu'aucun choix n'est
 * enregistré ; « Gérer mes témoins » (pied de page) la rouvre via `resetConsent`.
 *
 * Les deux boutons partagent taille, position ET variante : le refus doit avoir
 * le même poids visuel que l'acceptation, pas seulement la même accessibilité.
 *
 * INVARIANT : aucun témoin non essentiel n'existe encore. Le jour où un outil
 * analytique est branché, il ne doit se charger QUE si `CONSENT_KEY === "granted"`
 * (la CSP `script-src 'self'` de next.config.ts devra aussi l'autoriser), et
 * `dict.cookies.message` doit continuer de décrire les outils réellement déposés.
 */
export function CookieConsent({
  lang,
  labels,
}: {
  lang: Locale;
  labels: CookieConsentLabels;
}) {
  const choice = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "ssr",
  );

  // "ssr", "granted" ou "denied" masquent ; seul `null` (aucun choix, côté
  // client) affiche la bannière.
  if (choice !== null) return null;

  return (
    <div
      role="region"
      aria-label={labels.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-background/95 p-5 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <p className="text-sm leading-relaxed text-foreground/80">
          {labels.message}{" "}
          <Link
            href={localizedPath(lang, privacySegment)}
            className="font-medium text-primary underline underline-offset-4"
          >
            {labels.policy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <Button
            variant="outline"
            onClick={() => setConsent("denied")}
            className="flex-1 sm:flex-none"
          >
            {labels.refuse}
          </Button>
          <Button
            variant="outline"
            onClick={() => setConsent("granted")}
            className="flex-1 sm:flex-none"
          >
            {labels.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
