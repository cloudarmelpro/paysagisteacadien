"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavLinkItem = { label: string; href: string };

/** Un lien est actif sur correspondance exacte, ou si la page est un enfant du segment. */
export function isActivePath(pathname: string, href: string): boolean {
  const base = href.split("#")[0];
  // Les liens-ancres (#services) relèvent du scroll-spy, pas du chemin.
  if (href.includes("#")) return false;
  if (pathname === base) return true;
  // La racine de locale (/fr, /en) préfixe toutes les sous-pages : sans
  // exclusion, elle s'activerait partout.
  const isLocaleRoot = base.split("/").length === 2;
  return !isLocaleRoot && pathname.startsWith(`${base}/`);
}

/**
 * Défilement pour les liens de la même page. Renvoie `true` si le défilement a
 * eu lieu et que la navigation Next a été annulée, `false` si le lien doit
 * naviguer normalement. Le `behavior` est laissé implicite pour hériter du
 * `scroll-behavior` CSS, qui respecte « prefers-reduced-motion ».
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

  // Lien sans ancre sur la page courante (« Accueil » depuis l'accueil).
  e.preventDefault();
  window.scrollTo({ top: 0 });
  history.replaceState(null, "", base);
  return true;
}

/**
 * Renvoie `isActive(href)`. Sur l'accueil, les liens partageant sa base suivent
 * la section visible (scroll-spy) ; ailleurs, correspondance de chemin.
 */
export function useNavActive(items: NavLinkItem[]) {
  const pathname = usePathname();

  const homeBase = useMemo(() => {
    const anchor = items.find((i) => i.href.includes("#"));
    return anchor ? anchor.href.split("#")[0] : null;
  }, [items]);
  // Ces ids doivent rester dans l'ordre du document : `compute` retient la
  // dernière section franchie.
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
    // Ligne de bascule sous le header collant (h-16) plus la marge d'ancre.
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

/** Navigation desktop : soulignement via ::after, état actif exposé par `aria-current`. */
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
              // En-tête transparent sur la vidéo : blanc + soulignement dans la
              // teinte d'accent du hero. `!` : deux chaînes de variantes en
              // conflit, l'ordre de la feuille n'est pas garanti.
              "group-data-[transparent]/header:hover:text-white! group-data-[transparent]/header:after:bg-[oklch(0.86_0.12_150)]!",
              active
                ? "group-data-[transparent]/header:text-white"
                : "group-data-[transparent]/header:text-white/80",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
