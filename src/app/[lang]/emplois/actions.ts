"use server";

import { prisma } from "@/lib/prisma";
import { i18n } from "@/lib/i18n";
import {
  careersSchema,
  type CareersActionResult,
  type CareersInput,
} from "@/lib/validations/careers";

/**
 * Traite l'envoi d'une candidature spontanée. Re-valide TOUJOURS côté serveur
 * avec le même schéma Zod — la validation client n'est qu'un confort d'UX. En cas
 * de succès, persiste via Prisma.
 */
export async function submitApplication(
  input: CareersInput,
  locale: string,
): Promise<CareersActionResult> {
  const parsed = careersSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof CareersInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof CareersInput] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  const safeLocale = (i18n.locales as readonly string[]).includes(locale)
    ? locale
    : i18n.defaultLocale;

  try {
    const d = parsed.data;
    await prisma.jobApplication.create({
      data: {
        name: d.name,
        phone: d.phone,
        email: d.email,
        message: d.message?.trim() || null,
        locale: safeLocale,
      },
    });
    return { status: "success" };
  } catch (error) {
    console.error("Échec de l'enregistrement de la candidature :", error);
    return { status: "error" };
  }
}
