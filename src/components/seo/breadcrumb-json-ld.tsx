import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { siteUrl } from "@/lib/seo";

/** Un maillon du fil d'Ariane. `segment` = chemin APRÈS la locale, sans slash
 *  de tête (celui de l'accueil est ajouté automatiquement, voir plus bas). */
export type BreadcrumbItem = {
  /** Libellé traduit — TOUJOURS lu depuis le dictionnaire par l'appelant. */
  name: string;
  segment: string;
};

/**
 * Données structurées BreadcrumbList (schema.org). Google affiche ce résultat
 * enrichi en permanence : le fil remplace l'URL brute sous le titre du SERP.
 *
 * L'accueil est ajouté ici pour ne pas le répéter dans chaque page. Le fil part
 * ensuite DIRECTEMENT vers la page-chapeau réelle : il n'existe pas de page
 * `/[lang]/services` (elle renvoie un 404), donc aucun nœud « Services »
 * intermédiaire — un maillon pointant vers un 404 invaliderait le fil entier.
 *
 * Le DERNIER élément ne porte pas de `item` : c'est la page courante, elle n'est
 * pas un lien (recommandation Google).
 *
 * Server Component rendu par la page : le <script> n'est jamais re-rendu côté
 * client, donc pas d'avertissement d'hydratation React 19.
 */
export function BreadcrumbJsonLd({
  lang,
  dict,
  items,
}: {
  lang: Locale;
  dict: Dictionary;
  /** Le fil SANS l'accueil, de l'ancêtre le plus haut à la page courante. */
  items: readonly BreadcrumbItem[];
}) {
  const trail: BreadcrumbItem[] = [
    { name: dict.nav.home, segment: "" },
    ...items,
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      // La page courante (dernier maillon) n'est pas un lien.
      ...(index < trail.length - 1
        ? { item: `${siteUrl}${localizedPath(lang, entry.segment)}` }
        : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
