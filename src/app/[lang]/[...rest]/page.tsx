import { notFound } from "next/navigation";

/**
 * Attrape toute URL sous une locale ne correspondant à aucune route, et
 * déclenche la 404 localisée du segment (`[lang]/not-found.tsx`). Sans elle,
 * Next sert sa page 404 anglaise par défaut — y compris pour les anciennes URL
 * du site absentes de la table de redirections, qui y atterrissent justement.
 *
 * Les routes spécifiques restent prioritaires : ce catch-all n'est atteint que
 * si aucune autre ne correspond.
 */
export default function CatchAllNotFound() {
  notFound();
}
