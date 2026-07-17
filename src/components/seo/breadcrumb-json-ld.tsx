import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries";
import { jsonLdScript, siteUrl } from "@/lib/seo";

/** Un maillon du fil d'Ariane. `segment` = chemin après la locale, sans slash de tête. */
export type BreadcrumbItem = {
  /** Libellé traduit, fourni par l'appelant depuis le dictionnaire. */
  name: string;
  segment: string;
};

/**
 * Données structurées BreadcrumbList (schema.org).
 *
 * L'accueil est ajouté ici, les appelants ne le passent pas. Aucun nœud
 * « Services » intermédiaire : `/[lang]/services` n'existe pas (404) et un
 * maillon pointant vers un 404 invalide le fil entier.
 *
 * Doit rester un Server Component : re-rendu côté client, ce <script> déclenche
 * l'erreur React 19 « script tag in component ».
 */
export function BreadcrumbJsonLd({
  lang,
  dict,
  items,
}: {
  lang: Locale;
  dict: Dictionary;
  /** Le fil sans l'accueil, de l'ancêtre le plus haut à la page courante. */
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
      dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
    />
  );
}
