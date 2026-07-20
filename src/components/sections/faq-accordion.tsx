"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";

type FaqGroups = Dictionary["faq"]["groups"];

/**
 * Accordéon animé vers `height: auto`, ce que `<details>` natif ne permet pas ;
 * l'accessibilité qu'il offrait est donc à maintenir à la main (`aria-expanded`,
 * `aria-controls`, région étiquetée par sa question).
 * `useReducedMotion` est requis : la règle `prefers-reduced-motion` de
 * globals.css ne neutralise que les transitions CSS, pas les animations JS.
 */
export function FaqAccordion({ groups }: { groups: FaqGroups }) {
  // Le premier item est ouvert au chargement.
  const [openId, setOpenId] = useState("0-0");
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  const offsets = groups.map((_, i) =>
    groups.slice(0, i).reduce((sum, g) => sum + g.items.length, 0),
  );

  return (
    <div className="flex flex-col gap-8">
      {groups.map((group, gi) => (
        <div key={group.label} className="flex flex-col gap-3">
          <h3 className="text-xs font-medium tracking-wider text-foreground/60 uppercase">
            {group.label}
          </h3>

          <div className="flex flex-col gap-2">
            {group.items.map((item, i) => {
              const id = `${gi}-${i}`;
              const isOpen = openId === id;
              const panelId = `${baseId}-panel-${id}`;
              const buttonId = `${baseId}-button-${id}`;

              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-2xl bg-muted/60 transition-colors duration-200 hover:bg-muted/85 data-[open=true]:bg-muted"
                  data-open={isOpen}
                >
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? "" : id)}
                    className="flex w-full cursor-pointer items-center gap-4 p-4 text-left focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <span className="text-xs font-medium text-foreground/45 tabular-nums">
                      {String(offsets[gi] + i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="flex-1 text-sm font-medium text-foreground">
                      {item.q}
                    </h4>
                    <Plus
                      aria-hidden
                      className={`size-4 shrink-0 text-foreground/60 transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="panel"
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.28, ease: [0.4, 0, 0.2, 1] }
                        }
                        className="overflow-hidden"
                      >
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { duration: 0.3, delay: 0.06, ease: [0.22, 1, 0.36, 1] }
                          }
                          className="px-4 pb-4 pl-12 text-sm leading-relaxed text-foreground/70"
                        >
                          {item.a}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
