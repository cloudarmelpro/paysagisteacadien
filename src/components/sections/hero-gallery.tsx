"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type GalleryItem = { src: string; alt: string; label: string };

/**
 * Galerie accordéon : l'image active occupe l'espace restant, les autres sont
 * réduites à des pilules. L'animation porte sur `flex-grow`, pas sur `width` :
 * aucune largeur n'est calculée. `prefers-reduced-motion` (globals.css)
 * neutralise la transition.
 */
export function HeroGallery({
  items,
  initialActive = 2,
}: {
  items: GalleryItem[];
  initialActive?: number;
}) {
  const [active, setActive] = useState(initialActive);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // `true` au départ : pas d'auto-défilement tant que la préférence de
  // mouvement n'a pas été lue côté client.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const paused = hovered || focused || reduced;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((current) => {
        // Sous 640px les vignettes extrêmes sont cachées (`hidden sm:block`) :
        // l'auto-défilement ne doit jamais activer un index invisible.
        const edgesHidden = !window.matchMedia("(min-width: 640px)").matches;
        const first = edgesHidden ? 1 : 0;
        const last = edgesHidden ? items.length - 2 : items.length - 1;
        return current >= last ? first : current + 1;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  return (
    <div
      className="flex h-[300px] items-stretch gap-2 sm:h-[360px] sm:gap-3 lg:h-[380px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocused(false);
        }
      }}
    >
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={isActive}
            // Les pilules extrêmes disparaissent sous 640px : à cette largeur,
            // cinq colonnes ne laisseraient rien voir de l'image active.
            className={cn(
              // `rounded-3xl` reste hors des variantes : un rayon différent entre
              // pilule et image déployée se morpherait pendant la transition.
              "relative shrink-0 basis-12 overflow-hidden rounded-3xl bg-muted transition-all duration-500 ease-out",
              "focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none",
              "sm:basis-14 lg:basis-16",
              isActive ? "grow" : "grow-0 cursor-pointer opacity-90 hover:opacity-100",
              i === 0 || i === items.length - 1 ? "hidden sm:block" : "",
            )}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority={i === initialActive}
              /**
               * `sizes` est figé au rendu et doit décrire l'état déployé, pas la
               * pilule : toute vignette peut devenir active, et un dimensionnement
               * sur la pilule (48px) donnerait une image floue une fois agrandie.
               * Paliers = largeur du conteneur moins les pilules et les gouttières.
               */
              sizes="(max-width: 640px) 65vw, (max-width: 1024px) 60vw, 896px"
              className="object-cover"
            />
            <span
              className={cn(
                "absolute right-4 bottom-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-foreground shadow-sm backdrop-blur-sm transition-opacity duration-300",
                isActive ? "opacity-100 delay-200" : "pointer-events-none opacity-0",
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
