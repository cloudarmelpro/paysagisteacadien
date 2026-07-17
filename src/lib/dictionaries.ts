import "server-only";
import type { Locale } from "./i18n";
import { i18n } from "./i18n";
import type frDict from "@/dictionaries/fr.json";

/** `fr.json` fait foi : sa forme définit le type de toutes les locales. */
export type Dictionary = typeof frDict;

/** Import dynamique par locale : aucune traduction n'est envoyée au client. */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export const hasLocale = (locale: string): locale is Locale =>
  (i18n.locales as readonly string[]).includes(locale);

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
