import Image from "next/image";
import { cn } from "@/lib/utils";

const imgProps = { "aria-hidden": true, priority: true } as const;

/**
 * Marque « P » seule (logo officiel du client), pour l'en-tête et le menu mobile,
 * accompagnée du mot en texte. Version verte sur fond clair, version blanche sur
 * fond sombre — choix en CSS (`dark:`), sans état, donc pas d'écart d'hydratation.
 * Décoratif : le libellé vient du lien englobant. `className` fixe la HAUTEUR.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/logo-mark.png"
        alt=""
        width={609}
        height={959}
        {...imgProps}
        className={cn("w-auto dark:hidden", className)}
      />
      <Image
        src="/logo-mark-white.png"
        alt=""
        width={609}
        height={959}
        {...imgProps}
        className={cn("hidden w-auto dark:block", className)}
      />
    </>
  );
}

/**
 * Logo complet empilé (marque + mot), pour le pied de page où la hauteur le
 * permet. Version verte + texte noir sur fond clair, version blanche sur fond
 * sombre.
 */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/logo-lockup.png"
        alt=""
        width={1747}
        height={1179}
        {...imgProps}
        className={cn("w-auto dark:hidden", className)}
      />
      <Image
        src="/logo-lockup-white.png"
        alt=""
        width={1747}
        height={1179}
        {...imgProps}
        className={cn("hidden w-auto dark:block", className)}
      />
    </>
  );
}
