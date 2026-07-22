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

/**
 * État du consentement, réactif : `"granted"`, `"denied"`, ou `null` tant
 * qu'aucun choix n'est fait. Partage le store de la bannière — un outil non
 * essentiel s'y abonne pour ne se charger que sur `"granted"` et se recharger si
 * le visiteur accepte plus tard. Snapshot serveur `null` : rien ne se charge au
 * rendu serveur.
 */
export function useConsent(): "granted" | "denied" | null {
  const v = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return v === "granted" || v === "denied" ? v : null;
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
 * INVARIANT : le seul outil non essentiel est Google Analytics
 * (`components/analytics/google-analytics.tsx`), qui s'abonne à `useConsent` et
 * ne se charge que sur `"granted"`. Tout futur outil doit suivre le même
 * gating, et `dict.cookies.message` doit continuer de décrire exactement ce qui
 * est réellement déposé.
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
      // z-40, sous l'en-tête (z-50) : le menu mobile plein écran vit DANS
      // l'en-tête, dont le `sticky z-50` crée un contexte d'empilement. Monter
      // le z-index du menu n'y changerait rien — c'est cette carte qui doit
      // passer dessous, sinon elle masque le bas du menu ouvert.
      className="fixed inset-x-0 bottom-0 z-40 p-4 sm:inset-x-auto sm:right-0 sm:p-6"
    >
      {/* Sans bordure : l'ombre seule détache la carte du fond. Décalage vertical
          nul et double rayon — les ombres Tailwind (`shadow-xl`) tombent vers le
          bas et laisseraient les côtés et le haut à nu. */}
      <div className="hero-rise w-full max-w-sm rounded-2xl bg-background/95 p-4 shadow-[0_0_20px_rgb(0_0_0/0.16),0_0_56px_rgb(0_0_0/0.10)] backdrop-blur">
        <div className="flex items-start gap-2.5">
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/70"
          >
            <Cookie className="size-3.5" />
          </span>
          {/* Les boutons vivent dans la colonne de texte : ils s'alignent sur le
              titre, pas sous l'icône. Largeur laissée au contenu — les deux
              gardent variante et taille identiques, seul compte l'égalité de
              poids visuel, pas une largeur au pixel près. */}
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm font-medium text-foreground">{labels.title}</p>
            <p className="text-xs leading-relaxed text-foreground/70">
              {labels.message}{" "}
              <Link
                href={localizedPath(lang, privacySegment)}
                className="font-medium text-primary underline underline-offset-2"
              >
                {labels.policy}
              </Link>
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConsent("denied")}
              >
                {labels.refuse}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConsent("granted")}
              >
                {labels.accept}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
