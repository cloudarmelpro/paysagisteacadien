"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Ear,
  Leaf,
  MessageCircle,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CommitmentValue = { title: string; desc: string };

const ICONS: LucideIcon[] = [Ear, MessageCircle, UserCheck, Leaf];

/**
 * Carrousel horizontal. Le scroll natif (scroll-snap) porte le mouvement, d'où le
 * glissé tactile et le clavier sans code dédié. Les flèches et l'indicateur ne
 * font que piloter et refléter ce scroll : aucune position n'est dupliquée en état.
 *
 * Défilement automatique, mis en pause dès la moindre interaction (survol, focus
 * clavier, toucher) et tant que le bloc n'est pas visible. `prefers-reduced-motion`
 * le désactive entièrement : les cartes portent du texte à lire, il ne doit
 * jamais glisser pendant la lecture.
 */
export function CommitmentCarousel({
  values,
  labels,
}: {
  values: CommitmentValue[];
  labels: { prev: string; next: string; region: string };
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  // `hovered` : pause transitoire (survol/focus), reprend quand on s'éloigne.
  // `touched` : arrêt définitif — sur mobile, un toucher = l'utilisateur prend
  // la main, on ne lui reprend pas le contrôle.
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const reduceMotion = useReducedMotion();
  const paused = hovered || touched || !onScreen || Boolean(reduceMotion);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : track.clientWidth;
    setActive(Math.round(track.scrollLeft / step));
    setAtStart(track.scrollLeft <= 1);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 1);
  }, []);

  useEffect(() => {
    sync();
  }, [sync]);

  // Ne défile que visible : sinon il avancerait hors écran et le visiteur
  // arriverait sur une position quelconque.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Avance d'une carte à intervalle, revient au début en bout de piste. Le
  // rythme est lent (lecture de texte) et toute interaction fige `interacted`.
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;
      const card = track.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + 16 : track.clientWidth;
      const reachedEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      track.scrollTo({
        left: reachedEnd ? 0 : track.scrollLeft + step,
        behavior: "smooth",
      });
    }, 4500);
    return () => clearInterval(id);
  }, [paused]);

  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : track.clientWidth;
    track.scrollBy({
      left: dir * step,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <div
      className="mt-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setHovered(false);
        }
      }}
      onTouchStart={() => setTouched(true)}
    >
      <div
        ref={trackRef}
        onScroll={sync}
        role="region"
        aria-label={labels.region}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
      >
        {values.map((value, i) => {
          const Icon = ICONS[i] ?? Leaf;
          return (
            <article
              key={value.title}
              className="group flex shrink-0 basis-[85%] snap-start flex-col rounded-2xl bg-muted p-6 sm:basis-[47%] lg:basis-[32%]"
            >
              <h3 className="text-lg font-medium text-foreground">
                {value.title}
              </h3>
              <span className="mt-4 mb-4 block h-px w-8 origin-left bg-primary transition-transform duration-500 motion-safe:group-hover:scale-x-150" />
              <p className="flex-1 text-sm leading-relaxed text-foreground/70">
                {value.desc}
              </p>
              <span className="mt-6 inline-flex size-10 items-center justify-center rounded-full bg-background text-primary">
                <Icon className="size-4" aria-hidden />
              </span>
            </article>
          );
        })}
      </div>

      {/* Contrôles : flèches à gauche, progression à droite */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            disabled={atStart}
            aria-label={labels.prev}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground transition-[color,background-color,transform] duration-200 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none disabled:cursor-default disabled:opacity-40 motion-safe:active:scale-95"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={atEnd}
            aria-label={labels.next}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground transition-[color,background-color,transform] duration-200 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/80 focus-visible:outline-none disabled:cursor-default disabled:opacity-40 motion-safe:active:scale-95"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5" aria-hidden>
          {values.map((value, i) => (
            <span
              key={value.title}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-primary" : "w-3 bg-border",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
