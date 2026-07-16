"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type GalleryItem = { src: string; alt: string; label: string };

/**
 * Galerie accordéon : l'image active occupe l'espace restant, les autres sont
 * réduites à des pilules. Un clic déploie la pilule choisie et referme l'active.
 *
 * L'animation porte sur `flex-grow` (et non `width`) : les pilules gardent une
 * base fixe et seule l'active « pousse », ce qui évite tout calcul de largeur.
 * `prefers-reduced-motion` (globals.css) neutralise la transition.
 */
export function HeroGallery({
  items,
  initialActive = 2,
}: {
  items: GalleryItem[];
  initialActive?: number;
}) {
  const [active, setActive] = useState(initialActive);

  return (
    <div className="flex h-[300px] items-stretch gap-2 sm:h-[360px] sm:gap-3 lg:h-[380px]">
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <button
            key={item.src}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={isActive}
            // Les pilules extrêmes disparaissent sous 640px : à cette largeur,
            // cinq colonnes ne laisseraient rien voir de l'image active.
            className={cn(
              // `rounded-3xl` est dans la base, pas dans les variantes : le rayon
              // doit rester constant. S'il différait entre pilule et image
              // déployée, il se morpherait pendant la transition.
              "relative shrink-0 basis-12 overflow-hidden rounded-3xl bg-muted transition-all duration-500 ease-out",
              "focus-visible:z-10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
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
              sizes="640px"
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
