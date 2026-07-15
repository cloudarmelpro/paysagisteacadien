import "server-only";
import type { Locale } from "./i18n";
import { i18n } from "./i18n";
import type frDict from "@/dictionaries/fr.json";

/** Forme d'un dictionnaire, dérivée du fichier français (source de vérité). */
export type Dictionary = typeof frDict;

/**
 * Chargeur de dictionnaires. Chaque locale est importée dynamiquement afin de
 * n'envoyer aucune traduction au client (les pages sont des Server Components).
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  (i18n.locales as readonly string[]).includes(locale);

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
