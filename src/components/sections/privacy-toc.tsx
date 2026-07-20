"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; label: string };

/**
 * Sommaire collant qui surligne la section en cours de lecture (scroll-spy).
 * Les `id` doivent correspondre aux ancres rendues dans le contenu de Privacy.
 * La marge racine réduit la zone d'observation à une bande haute du viewport :
 * la section qui la traverse devient active ; entre deux sections, on conserve
 * la dernière active.
 */
export function PrivacyToc({ items, label }: { items: TocItem[]; label: string }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: 0 },
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className="lg:order-2 lg:sticky lg:top-24 lg:self-start">
      <p className="text-xs font-medium tracking-wider text-foreground/50 uppercase">
        {label}
      </p>
      <ul className="mt-4 flex flex-col border-l border-border">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "-ml-px block cursor-pointer border-l py-1.5 pl-4 text-sm leading-snug transition-colors",
                  active
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-foreground/70 hover:border-primary/50 hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
