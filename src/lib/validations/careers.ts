import { z } from "zod";

/**
 * Schéma du formulaire « Emplois » (candidature spontanée). Reprend les trois
 * champs du site actuel : nom complet, téléphone et courriel — tous requis.
 * Validé côté client (react-hook-form) ET re-validé côté serveur par la Server
 * Action. Les messages sont des clés, traduites à l'affichage via le dictionnaire.
 */
export const careersSchema = z.object({
  name: z.string().trim().min(2, "name").max(100, "nameMax"),
  phone: z
    .string()
    .trim()
    .min(7, "phone")
    .max(30, "phoneMax")
    .refine((v) => /^[\d\s+().-]{7,}$/.test(v), "phone"),
  email: z.email("email").max(200, "emailMax"),
  message: z.string().trim().max(2000, "messageMax").optional(),
});

export type CareersInput = z.infer<typeof careersSchema>;

/** Forme du retour d'une Server Action de formulaire. */
export type CareersActionResult =
  | { status: "success" }
  | {
      status: "error";
      fieldErrors?: Partial<Record<keyof CareersInput, string>>;
    };
