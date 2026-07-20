"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Sens d'entrée : fondu + glissement depuis le bas (défaut), la gauche ou la
   *  droite, ou `scale` (léger zoom + flou qui se dissipe, pour les cartes). */
  from?: "up" | "left" | "right" | "scale";
  /** Décalage en ms, pour échelonner plusieurs éléments d'un même bloc. */
  delay?: number;
  /** Cascade : le bloc reste en place, ses enfants directs entrent en escalier. */
  stagger?: boolean;
  /** Balise rendue — pour les contextes où un div serait invalide (ex. `dl`). */
  as?: "div" | "dl" | "ul";
};

/**
 * Révèle son contenu (fondu + glissement) quand il entre dans le viewport.
 *
 * Le contenu est rendu côté serveur et traverse tel quel : ce wrapper client ne
 * fait qu'observer. Le masquage initial vit dans globals.css sous `.js` — sans
 * JS, rien n'est caché. `prefers-reduced-motion` révèle immédiatement, sans
 * transformation.
 */
export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
  stagger = false,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
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

  // En cascade, le délai s'applique aux enfants via `--reveal-delay` : un
  // `transition-delay` inline sur le bloc n'atteindrait pas leurs transitions.
  const style = delay
    ? stagger
      ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
      : { transitionDelay: `${delay}ms` }
    : undefined;

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal={from}
      data-stagger={stagger || undefined}
      data-shown={shown || undefined}
      style={style}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
