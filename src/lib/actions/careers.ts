"use server";

import { prisma } from "@/lib/prisma";
import { i18n } from "@/lib/i18n";
import { sendSubmissionEmail } from "@/lib/email";
import {
  careersSchema,
  type CareersActionResult,
  type CareersInput,
} from "@/lib/validations/careers";

/**
 * La validation côté serveur est la seule garantie : celle du client est
 * contournable et ne sert qu'à l'UX.
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

    // Notification best-effort : n'affecte pas le statut de la soumission.
    await sendSubmissionEmail("Nouvelle candidature (emplois)", [
      { label: "Nom", value: d.name },
      { label: "Courriel", value: d.email },
      { label: "Téléphone", value: d.phone },
      { label: "Message", value: d.message?.trim() ?? "" },
    ]);

    return { status: "success" };
  } catch (error) {
    console.error("Échec de l'enregistrement de la candidature :", error);
    return { status: "error" };
  }
}
