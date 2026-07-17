export const i18n = {
  defaultLocale: "fr",
  locales: ["fr", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

export function localizedPath(lang: Locale, segment: string): string {
  return segment ? `/${lang}/${segment}` : `/${lang}`;
}
