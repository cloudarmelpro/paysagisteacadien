import { z } from "zod";

/** Chaîne optionnelle : trim, longueur max, et chaîne vide traitée comme absente. */
const optionalText = (max: number, maxKey: string) =>
  z.string().trim().max(max, maxKey).optional();

/**
 * Schéma du formulaire « Nous joindre ». Reprend les champs du site actuel :
 * nom, courriel et municipalité sont requis ; le reste est optionnel.
 * Utilisé des deux côtés : react-hook-form valide en direct côté client, et la
 * Server Action le re-valide côté serveur (jamais confiance à l'entrée client).
 * Les messages sont des clés — traduites à l'affichage via le dictionnaire.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "name").max(100, "nameMax"),
  email: z.email("email").max(200, "emailMax"),
  municipality: z.string().trim().min(2, "municipality").max(120, "municipalityMax"),
  address: optionalText(200, "addressMax"),
  phone: z
    .string()
    .trim()
    .max(30, "phoneMax")
    .refine((v) => v === "" || /^[\d\s+().-]{7,}$/.test(v), "phone")
    .optional(),
  // Sélection multiple (cases à cocher) → tableaux de valeurs.
  service: z.array(z.string().max(80)).max(20).optional(),
  startDate: optionalText(20, "startDateMax"),
  referral: z.array(z.string().max(80)).max(20).optional(),
  message: optionalText(2000, "messageMax"),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Forme du retour d'une Server Action de formulaire. */
export type ActionResult =
  | { status: "success" }
  | { status: "error"; fieldErrors?: Partial<Record<keyof ContactInput, string>> };
