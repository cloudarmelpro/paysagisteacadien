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
              // Même coque que la carte de service (numéro en haut, contenu en
              // bas, pastille ronde en bas à droite) mais fond gris `bg-muted` —
              // s'adapte au thème, contrairement au sombre plein.
              className="group relative flex aspect-4/5 w-[260px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl bg-muted p-6 sm:w-[300px] sm:p-7"
            >
              <span className="text-xs font-medium text-foreground/50">
                {String((i % values.length) + 1).padStart(2, "0")}.
              </span>
              <div className="flex flex-col gap-2 pr-14">
                <h3 className="text-lg font-medium text-foreground sm:text-xl">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {value.desc}
                </p>
              </div>
              {/* Pastille de l'icône, là où le service porte son bouton fléché :
                  même repère, mais sans lien (une valeur n'est pas cliquable). */}
              <span
                aria-hidden
                className="absolute right-6 bottom-6 inline-flex size-11 items-center justify-center rounded-full bg-background text-primary transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5"
              >
                <Icon className="size-5" />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
