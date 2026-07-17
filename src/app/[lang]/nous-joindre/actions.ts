"use server";

import { prisma } from "@/lib/prisma";
import { i18n } from "@/lib/i18n";
import {
  contactSchema,
  type ActionResult,
  type ContactInput,
} from "@/lib/validations/contact";

/**
 * La validation côté serveur est la seule garantie : celle du client est
 * contournable et ne sert qu'à l'UX.
 */
export async function submitContact(
  input: ContactInput,
  locale: string,
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in fieldErrors)) {
        fieldErrors[key as keyof ContactInput] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  const safeLocale = (i18n.locales as readonly string[]).includes(locale)
    ? locale
    : i18n.defaultLocale;

  try {
    const d = parsed.data;
    // Les champs optionnels vides sont stockés `null` plutôt que "".
    const orNull = (v?: string) => v?.trim() || null;
    await prisma.contactMessage.create({
      data: {
        name: d.name,
        email: d.email,
        municipality: d.municipality,
        address: orNull(d.address),
        phone: orNull(d.phone),
        service: d.service ?? [],
        startDate: orNull(d.startDate),
        referral: d.referral ?? [],
        message: orNull(d.message),
        locale: safeLocale,
      },
    });
    return { status: "success" };
  } catch (error) {
    console.error("Échec de l'enregistrement du message de contact :", error);
    return { status: "error" };
  }
}
