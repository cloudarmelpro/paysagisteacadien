import {
  Ear,
  Leaf,
  MessageCircle,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export type CommitmentValue = { title: string; desc: string };

const ICONS: LucideIcon[] = [Ear, MessageCircle, UserCheck, Leaf];

/**
 * Bandeau des valeurs qui glisse en continu (marquee), sans contrôle manuel : le
 * mouvement lent signale qu'il y a d'autres cartes, sans qu'on ait à cliquer.
 *
 * La piste est **doublée** pour une boucle sans couture — l'animation translate
 * d'exactement un jeu (voir `.marquee-track` dans globals.css). Elle se met en
 * pause au survol et se désactive entièrement sous `prefers-reduced-motion`, où
 * le défilement manuel prend le relais (`overflow-x: auto` + focus clavier) :
 * les cartes portent du texte, il ne doit jamais y avoir de mouvement imposé.
 *
 * Server Component : aucun état, purement décoratif et piloté par CSS.
 */
export function CommitmentCarousel({
  values,
  labels,
}: {
  values: CommitmentValue[];
  labels: { region: string };
}) {
  const loop = [...values, ...values];

  return (
    <div
      role="region"
      aria-label={labels.region}
      tabIndex={0}
      className="marquee mt-8 focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none"
    >
      <ul className="marquee-track flex w-max gap-4">
        {loop.map((value, i) => {
          const original = i < values.length;
          const Icon = ICONS[i % values.length] ?? Leaf;
          return (
            <li
              key={i}
              // Le second jeu n'existe que pour la boucle : masqué aux lecteurs
              // d'écran pour ne pas lire deux fois chaque valeur.
              aria-hidden={original ? undefined : true}
              className="group flex w-[280px] shrink-0 flex-col rounded-2xl bg-muted p-6 sm:w-[340px]"
            >
              <h3 className="text-lg font-medium text-foreground">
                {value.title}
              </h3>
              <span className="mt-4 mb-4 block h-px w-8 origin-left bg-primary transition-transform duration-500 motion-safe:group-hover:scale-x-150" />
              <p className="flex-1 text-sm leading-relaxed text-foreground/70">
                {value.desc}
              </p>
              <span className="mt-6 inline-flex size-10 items-center justify-center rounded-full bg-background text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
