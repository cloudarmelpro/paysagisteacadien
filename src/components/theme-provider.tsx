"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Fournisseur de thème (next-themes) : applique la classe `dark` sur <html>,
 * respecte la préférence système par défaut et mémorise le choix. Encapsulé côté
 * client pour rester utilisable depuis le layout (Server Component).
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
