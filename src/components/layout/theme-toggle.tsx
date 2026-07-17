"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bascule clair / sombre pilotée par le DOM, sans contexte React. Les deux icônes
 * sont rendues et la CSS (`dark:`) choisit : aucun état de thème au rendu, donc
 * aucun écart d'hydratation. L'état initial vient du script du layout, exécuté
 * avant peinture.
 */
export function ThemeToggle({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        const root = document.documentElement;
        const isDark = root.classList.toggle("dark");
        root.style.colorScheme = isDark ? "dark" : "light";
        try {
          localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch {
          // Stockage indisponible en navigation privée.
        }
      }}
      className={cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-foreground/70 transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      <Sun className="hidden size-[1.15rem] dark:block" aria-hidden />
      <Moon className="size-[1.15rem] dark:hidden" aria-hidden />
    </button>
  );
}
