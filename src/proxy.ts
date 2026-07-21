import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "@/lib/i18n";

/**
 * Doc du fichier `proxy` :
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) return;

  // Toujours le français, jamais la langue du navigateur : la Loi 101 exige que
  // le français soit la langue par défaut servie. L'anglais reste accessible par
  // le sélecteur (chaque page a son équivalent /en et son hreflang).
  request.nextUrl.pathname = `/${i18n.defaultLocale}${pathname}`;
  // 308 et non 307 : la redirection est déterministe (jamais négociée avec le
  // navigateur), et le domaine nu porte l'autorité de l'ancien site — un
  // permanent consolide ce signal vers /fr.
  return NextResponse.redirect(request.nextUrl, 308);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
