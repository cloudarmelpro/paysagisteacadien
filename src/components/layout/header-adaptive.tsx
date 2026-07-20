"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Hauteur de la barre (h-16) : l'en-tête reste transparent tant que la bande
// hero dépasse cette ligne.
const HEADER_HEIGHT = 64;

/**
 * Pilote `data-transparent` sur `header[data-site-header]` par le DOM (même
 * philosophie que le thème : pas d'état React, donc pas d'écart d'hydratation).
 * L'état initial vient du script inline de l'en-tête, exécuté avant peinture ;
 * ici on le maintient au défilement, au redimensionnement et à la navigation.
 * Déclencheur : la présence d'une bande `[data-hero]` (accueil = vidéo, page de
 * service = image plein écran) — la page décide, pas le pathname.
 */
export function HeaderAdaptive() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector<HTMLElement>(
      "header[data-site-header]",
    );
    if (!header) return;

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      header.removeAttribute("data-transparent");
      return;
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      header.toggleAttribute(
        "data-transparent",
        hero.getBoundingClientRect().bottom > HEADER_HEIGHT,
      );
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
  }, [pathname]);

  return null;
}
