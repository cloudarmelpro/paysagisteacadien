import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

/** Style commun des contrôles : hauteur confortable, bordure légère. Partagé par
 *  les formulaires « nous-joindre » et « emplois » pour un rendu identique. */
export const controlClass =
  "h-12 w-full rounded-lg border border-input bg-transparent px-4 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

/** Intitulé de champ. */
export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-sm font-medium text-foreground"
    >
      {children}
    </Label>
  );
}

/** Un champ = titre visible + contrôle + erreur. */
export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
