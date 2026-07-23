import { Reveal } from "@/components/shared/reveal";
import { cn } from "@/lib/utils";

export type Stat = { value: string; label: string };

/**
 * Bande de repères (chiffres clés). Partagée entre l'accueil et « À propos » :
 * une seule source de mise en forme, les deux pages lisent les mêmes
 * `about.stats` du dictionnaire.
 *
 * Le libellé passe avant la valeur : les valeurs n'ont pas la même longueur et,
 * placé dessous, le libellé retomberait à des hauteurs différentes d'une colonne
 * à l'autre.
 */
export function StatsStrip({
  stats,
  className,
}: {
  stats: readonly Stat[];
  className?: string;
}) {
  return (
    <Reveal
      stagger
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-12",
        className,
      )}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-2">
          <span className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {stat.label}
          </span>
          <span className="text-2xl font-medium tracking-tight text-balance text-foreground">
            {stat.value}
          </span>
        </div>
      ))}
    </Reveal>
  );
}
