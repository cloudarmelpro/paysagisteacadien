import { cn } from "@/lib/utils";

/**
 * Marque « P » : carré arrondi plein dont la lettre est une RÉSERVE (découpée
 * via fill-rule evenodd) — le fond de la page traverse le P, il s'adapte donc
 * seul au thème. Le carré est peint en `currentColor` : appliquer `text-primary`
 * suffit pour qu'il bascule du vert clair (#396342) au vert sombre (#62BB78).
 * Décoratif : les liens qui l'entourent portent déjà le libellé accessible.
 * Source du tracé : public/LOGO.svg (conservé pour le favicon / usages externes).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      focusable="false"
      className={cn("shrink-0", className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20,0 H80 Q100,0 100,20 V80 Q100,100 80,100 H20 Q0,100 0,80 V20 Q0,0 20,0 Z M28,20 H54.4 A17.4,17.4 0 0 1 54.4,54.8 H40 V80 H28 Z M40,32 H54.4 A5.4,5.4 0 0 1 54.4,42.8 H40 Z"
      />
    </svg>
  );
}
