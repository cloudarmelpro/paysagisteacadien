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
  const reduceMotion = useReducedMotion();

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
    <div className="mt-8">
      <div
        ref={trackRef}
        onScroll={sync}
        role="region"
        aria-label={labels.region}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none [&::-webkit-scrollbar]:hidden"
      >
        {values.map((value, i) => {
          const Icon = ICONS[i] ?? Leaf;
          return (
            <article
              key={value.title}
              className="flex shrink-0 basis-[85%] snap-start flex-col rounded-2xl bg-muted p-6 sm:basis-[47%] lg:basis-[32%]"
            >
              <h3 className="text-lg font-medium text-foreground">
                {value.title}
              </h3>
              <span className="mt-4 mb-4 block h-px w-8 bg-primary" />
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
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors duration-200 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-default disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            disabled={atEnd}
            aria-label={labels.next}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors duration-200 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-default disabled:opacity-40"
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
