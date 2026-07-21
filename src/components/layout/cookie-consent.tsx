"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
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
  title: string;
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
    // Ancré en bas à droite dès `sm` ; pleine largeur en mobile, où une carte
    // étroite laisserait les deux boutons trop serrés.
    <div
      role="region"
      aria-label={labels.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:inset-x-auto sm:right-0 sm:p-6"
    >
      <div className="hero-rise flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-background/95 p-5 shadow-lg backdrop-blur">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/70"
          >
            <Cookie className="size-4" />
          </span>
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground">{labels.title}</p>
            <p className="text-sm leading-relaxed text-foreground/70">
              {labels.message}{" "}
              <Link
                href={localizedPath(lang, privacySegment)}
                className="font-medium text-primary underline underline-offset-4"
              >
                {labels.policy}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setConsent("denied")}
            className="flex-1"
          >
            {labels.refuse}
          </Button>
          <Button
            variant="outline"
            onClick={() => setConsent("granted")}
            className="flex-1"
          >
            {labels.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
