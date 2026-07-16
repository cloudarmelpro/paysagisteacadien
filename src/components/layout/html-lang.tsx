"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Maintient l'attribut `lang` de <html> synchronisé avec la locale courante.
 * <html> vit dans le layout racine (langue par défaut « fr ») ; ce composant, sous
 * le segment `[lang]`, met l'attribut à jour au montage et à chaque changement de
 * locale (navigation client). Simple effet de bord DOM, sans état.
 */
export function HtmlLang({ lang }: { lang: Locale }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
