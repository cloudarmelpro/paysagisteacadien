import { cn } from "@/lib/utils";

/**
 * Marque « P » : le carré est peint en `currentColor` et la lettre est une
 * réserve découpée par `fill-rule="evenodd"` — le fond de la page la traverse,
 * d'où l'adaptation au thème. Décoratif : le libellé accessible vient du lien
 * englobant. Tracé miroir de public/LOGO.svg (favicon et usages externes).
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
