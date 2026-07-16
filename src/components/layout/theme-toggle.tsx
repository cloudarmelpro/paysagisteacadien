"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bouton de bascule clair / sombre. Les deux icônes sont toujours rendues ; c'est
 * la CSS (variante `dark:`, pilotée par la classe `dark` posée sur <html> avant
 * l'hydratation) qui affiche la bonne. Le rendu ne dépend donc d'aucun état de
 * thème → aucun écart d'hydratation. Le thème courant n'est lu qu'au clic.
 */
export function ThemeToggle({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={label}
      title={label}
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
