"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavLinkItem = { label: string; href: string };

/** Un lien est actif sur correspondance exacte, ou si la page est un enfant du segment. */
export function isActivePath(pathname: string, href: string): boolean {
  const base = href.split("#")[0];
  // Un lien-ancre (#services) est géré par le scroll-spy, pas par le chemin.
  if (href.includes("#")) return false;
  if (pathname === base) return true;
  // La racine de locale (/fr, /en) ne s'active QUE sur correspondance exacte :
  // sinon, étant préfixe de toutes les sous-pages, elle s'allumerait partout.
  const isLocaleRoot = base.split("/").length === 2;
  return !isLocaleRoot && pathname.startsWith(`${base}/`);
}

/**
 * Défilement doux pour les liens de la même page. Renvoie `true` si l'événement a
 * été pris en charge (défilement effectué) — dans ce cas la navigation Next est
 * annulée. Sinon `false` : on laisse le lien naviguer normalement (autre page,
 * clic modifié, etc.). L'API de défilement est appelée sans `behavior` explicite
 * pour hériter du `scroll-behavior` CSS, qui redevient instantané si l'utilisateur
 * a activé « prefers-reduced-motion ».
 */
export function scrollForSamePageAnchor(
  e: MouseEvent<HTMLAnchorElement>,
  href: string,
  pathname: string,
): boolean {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
    return false;
  }
  const [base, hash] = href.split("#");
  if (base !== pathname) return false; // autre page → navigation normale

  if (hash) {
    const el = document.getElementById(hash);
    if (!el) return false;
    e.preventDefault();
    el.scrollIntoView();
    history.replaceState(null, "", `#${hash}`);
    return true;
  }

  // Lien sans ancre sur la page courante (ex. « Accueil » depuis l'accueil) →
  // on remonte tout en haut.
  e.preventDefault();
  window.scrollTo({ top: 0 });
  history.replaceState(null, "", base);
  return true;
}

/**
 * Détermine l'état actif des liens de navigation. Sur l'accueil, les liens-ancres
 * (Services, FAQ) et « Accueil » suivent la section réellement visible
 * (scroll-spy) : « Accueil » est actif dans le hero, puis la main passe à
 * « Services », « FAQ »… à mesure qu'on défile. Ailleurs, on retombe sur la
 * correspondance de chemin classique. Renvoie une fonction `isActive(href)`.
 */
export function useNavActive(items: NavLinkItem[]) {
  const pathname = usePathname();

  // Base de l'accueil (partagée par les liens-ancres) et ids des sections suivies,
  // dans l'ordre du document.
  const homeBase = useMemo(() => {
    const anchor = items.find((i) => i.href.includes("#"));
    return anchor ? anchor.href.split("#")[0] : null;
  }, [items]);
  const sectionIds = useMemo(
    () =>
      items
        .filter((i) => i.href.includes("#"))
        .map((i) => i.href.split("#")[1]),
    [items],
  );

  const onHome = homeBase !== null && pathname === homeBase;
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    if (!onHome) return;
    // Ligne de bascule : juste sous le header collant (h-16) + la marge d'ancre.
    const offset = 100;
    let raf = 0;
    const compute = () => {
      raf = 0;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActiveHash(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onHome, sectionIds]);

  return function isActive(href: string): boolean {
    const [base, hash] = href.split("#");
    if (onHome && base === homeBase) {
      return (hash ?? "") === activeHash;
    }
    return isActivePath(pathname, href);
  };
}

/**
 * Navigation desktop. L'état actif est souligné (via ::after, sans décalage
 * de layout) et renforcé par `aria-current` pour les lecteurs d'écran.
 */
export function NavLinks({ items }: { items: NavLinkItem[] }) {
  const pathname = usePathname();
  const isActive = useNavActive(items);

  return (
    <>
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => scrollForSamePageAnchor(e, item.href, pathname)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative cursor-pointer py-1 text-sm transition-colors duration-200",
              "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-200",
              "hover:text-foreground hover:after:scale-x-100",
              active
                ? "font-medium text-foreground after:scale-x-100"
                : "text-foreground/70",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
