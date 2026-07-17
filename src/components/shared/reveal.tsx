"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Sens d'entrée : fondu + glissement depuis le bas (défaut), la gauche ou la droite. */
  from?: "up" | "left" | "right";
  /** Décalage en ms, pour échelonner plusieurs éléments d'un même bloc. */
  delay?: number;
};

/**
 * Révèle son contenu (fondu + glissement) quand il entre dans le viewport.
 *
 * Le contenu est rendu côté serveur et traverse tel quel : ce wrapper client ne
 * fait qu'observer. Le masquage initial vit dans globals.css sous `.js` — sans
 * JS, rien n'est caché. `prefers-reduced-motion` révèle immédiatement, sans
 * transformation.
 */
export function Reveal({ children, className, from = "up", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pas de traitement reduced-motion ici : globals.css révèle déjà le contenu
    // sous `prefers-reduced-motion`, même si l'observer ne bascule jamais l'état.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={from}
      data-shown={shown || undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
