import { getDictionary } from "@/lib/dictionaries";
import { NotFoundContent } from "@/components/sections/not-found-content";

/**
 * 404 de la section `[lang]` — rendue dans le layout, donc avec l'en-tête et le
 * pied de page. Sans elle, Next sert sa page anglaise par défaut, y compris sur
 * les URL françaises.
 *
 * `not-found.tsx` ne reçoit pas `params` : on charge les deux dictionnaires et
 * le composant client choisit d'après le chemin.
 */
export default async function NotFound() {
  const [fr, en] = await Promise.all([
    getDictionary("fr"),
    getDictionary("en"),
  ]);

  return <NotFoundContent fr={fr.notFound} en={en.notFound} />;
}
