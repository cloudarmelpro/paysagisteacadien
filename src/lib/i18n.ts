/**
 * Configuration i18n — le site est bilingue FR / EN.
 * Le français est la langue par défaut (entreprise acadienne).
 */

export const i18n = {
  defaultLocale: "fr",
  locales: ["fr", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

/** Construit un chemin préfixé par la locale. segment "" → racine de la locale. */
export function localizedPath(lang: Locale, segment: string): string {
  return segment ? `/${lang}/${segment}` : `/${lang}`;
}
