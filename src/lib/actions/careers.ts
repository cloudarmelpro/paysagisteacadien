"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { i18n } from "@/lib/i18n";
import { sendSubmissionEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import {
  careersSchema,
  type CareersActionResult,
  type CareersInput,
} from "@/lib/validations/careers";

/** 5 envois par IP et par heure : large pour un humain, étroit pour un bot. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

/**
 * La validation côté serveur est la seule garantie : celle du client est
 * contournable et ne sert qu'à l'UX.
 */
export async function submitApplication(
  input: CareersInput,
  locale: string,
): Promise<CareersActionResult> {
  // Honeypot : seul un bot remplit ce champ caché. On feint le succès sans rien
  // enregistrer ni notifier, pour ne pas le renseigner sur le rejet.
  if (typeof input.website === "string" && input.website.trim() !== "") {
    return { status: "success" };
  }

  // Pas de WAF devant l'app en self-hosting : le throttle par IP est ici.
  // DERNIÈRE entrée de la chaîne : c'est celle qu'écrit le proxy de confiance.
  // La première vient du client et se falsifie — un bot qui fait tourner de
  // fausses valeurs obtiendrait un quota neuf à chaque requête.
  const forwarded = (await headers()).get("x-forwarded-for");
  const ip = forwarded?.split(",").at(-1)?.trim() || "unknown";
  if (!rateLimit(`careers:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return { status: "error" };
  }

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
