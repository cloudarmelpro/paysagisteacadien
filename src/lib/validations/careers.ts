import { z } from "zod";

/**
 * Schéma du formulaire « Emplois ». Les messages sont des clés de dictionnaire,
 * traduites à l'affichage. La Server Action doit revalider avec ce schéma :
 * la validation react-hook-form côté client ne protège rien.
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
