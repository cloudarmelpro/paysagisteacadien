import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "@/lib/i18n";

/**
 * Proxy (ex-middleware) : redirige toute requête sans préfixe de locale vers la
 * locale préférée du visiteur (Accept-Language), avec le français par défaut.
 * Voir node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */
function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Negotiator renvoie "*" quand aucune préférence n'est envoyée ; ce tag fait
  // planter `match`, donc on le filtre et on retombe sur la locale par défaut.
  const languages = new Negotiator({ headers })
    .languages()
    .filter((lang) => lang !== "*");
  const locales = i18n.locales as readonly string[];

  try {
    return match(languages, locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Exclut les fichiers internes, l'API, les assets statiques et les métadonnées.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
