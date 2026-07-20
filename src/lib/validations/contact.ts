import { z } from "zod";
import { referralValues, serviceGroups } from "@/config/site";

/** Chaîne optionnelle : la chaîne vide est traitée comme absente. */
const optionalText = (max: number, maxKey: string) =>
  z.string().trim().max(max, maxKey).optional();

/**
 * Case à cocher multiple contrainte à une liste blanche : rejette toute valeur
 * hors catalogue. Sans ça, ces champs (que l'entreprise lit comme « choisis par
 * la machine ») accepteraient du texte arbitraire — vecteur d'hameçonnage.
 */
const checkboxSet = (values: readonly string[], key: string) =>
  z
    .array(z.string().refine((v) => values.includes(v), key))
    .max(values.length)
    .optional();

const serviceValues = serviceGroups.flatMap((g) => g.services);

/**
 * Schéma du formulaire « Nous joindre ». Les messages sont des clés de
 * dictionnaire, traduites à l'affichage. La Server Action doit revalider avec
 * ce schéma : la validation react-hook-form côté client ne protège rien.
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
  // service et referral sont des cases à cocher multiples : valeurs en tableau.
  service: checkboxSet(serviceValues, "service"),
  startDate: optionalText(20, "startDateMax"),
  referral: checkboxSet(referralValues, "referral"),
  message: optionalText(2000, "messageMax"),
  // Honeypot anti-bot : champ caché qui doit rester vide. Contrôlé dans la
  // Server Action (un envoi non vide y est ignoré).
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Forme du retour d'une Server Action de formulaire. */
export type ActionResult =
  | { status: "success" }
  | { status: "error"; fieldErrors?: Partial<Record<keyof ContactInput, string>> };
