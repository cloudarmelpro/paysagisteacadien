import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "@/lib/i18n";

/**
 * Doc du fichier `proxy` :
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */
function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  // Negotiator renvoie "*" en l'absence de préférence, et ce tag fait planter
  // `match` : il doit être filtré.
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
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
