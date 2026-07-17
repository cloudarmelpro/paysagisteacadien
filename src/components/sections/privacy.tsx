import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { siteConfig } from "@/config/site";

const badgeClass =
  "w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium tracking-wider text-foreground/70 uppercase";

/**
 * Politique de confidentialité (Loi 25 — Québec).
 *
 * Mise en page volontairement différente des autres sections : une colonne
 * étroite et lisible plutôt que la grille éditoriale du reste du site — un texte
 * juridique se lit en continu, pas en diagonale.
 *
 * Le contenu vit dans les dictionnaires (traduit). Les coordonnées viennent de
 * `siteConfig` pour rester cohérentes avec le reste du site et le JSON-LD.
 */
export function Privacy({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const p = dict.privacy;

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      {/* En-tête */}
      <div className="flex max-w-3xl flex-col items-start gap-5">
        <span className={badgeClass}>{p.badge}</span>
        <h1 className="text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {p.title} <span className="text-primary">{p.titleAccent}</span>
        </h1>
        <p className="text-lg leading-relaxed text-foreground/70">{p.intro}</p>
        <p className="text-sm text-foreground/60">
          {p.updatedLabel} : {p.updatedAt}
        </p>
      </div>

      {/* Renseignements recueillis — la liste concrète, en tête car c'est ce que
          la personne vient vérifier en premier. */}
      <div className="mt-14 max-w-3xl border-t border-dotted border-border pt-8">
        <h2 className="text-xl font-medium tracking-tight text-foreground">
          {p.collected.heading}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-foreground/70">
          {p.collected.intro}
        </p>
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-base leading-relaxed text-foreground/70">
          {p.collected.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Sections juridiques */}
      <div className="mt-12 flex max-w-3xl flex-col gap-10">
        {p.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              {section.heading}
            </h2>
            <p className="text-base leading-relaxed text-foreground/70">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      {/* Coordonnées du responsable — encadré, car c'est le point d'action de la
          page : c'est par là qu'une personne exerce ses droits. */}
      <div className="mt-14 flex max-w-3xl flex-col gap-3 rounded-3xl bg-muted p-8">
        <h2 className="text-xl font-medium tracking-tight text-foreground">
          {p.officer.heading}
        </h2>
        <p className="text-base leading-relaxed text-foreground/70">
          {p.officer.body}
        </p>
        <div className="mt-1 flex flex-col gap-1 text-base">
          <span className="font-medium text-foreground">{siteConfig.owner}</span>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="w-fit cursor-pointer break-all text-primary transition-colors hover:text-foreground"
          >
            {siteConfig.contact.email}
          </a>
          <a
            href={`tel:${siteConfig.contact.phoneRaw}`}
            className="w-fit cursor-pointer text-primary transition-colors hover:text-foreground"
          >
            {siteConfig.contact.phone}
          </a>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/60">
          {lang === "fr" ? p.officer.recourse : p.officer.recourse}
        </p>
      </div>
    </div>
  );
}
