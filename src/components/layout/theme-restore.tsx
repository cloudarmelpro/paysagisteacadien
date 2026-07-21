"use client";

import { useEffect } from "react";

/**
 * Réapplique les classes de thème après le montage.
 *
 * Le script pré-peinture du layout les pose sur `<html>`, mais sur les réponses
 * 404 React rend le layout côté client et réécrit `className` — ce qui efface
 * `dark` et `js`. Sans ce filet, ces pages restent en clair pour un visiteur en
 * mode sombre, et le masquage des révélations (`.js`) ne s'active pas.
 *
 * Sur les pages normales, l'hydratation ne change pas `className` : l'effet
 * réécrit les mêmes valeurs et ne provoque aucun changement visible.
 */
export function ThemeRestore() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    try {
      const stored = localStorage.getItem("theme");
      const dark =
        stored === "dark" ||
        (stored !== "light" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    } catch {
      // Stockage indisponible : on garde ce que le script a posé.
    }
  }, []);

  return null;
}
