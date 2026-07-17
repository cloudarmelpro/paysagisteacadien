import "server-only";
import { Resend } from "resend";
import { siteConfig } from "@/config/site";

/**
 * Notification d'une soumission de formulaire vers la boîte de l'entreprise.
 *
 * Best-effort et jamais bloquant : l'enregistrement en base est la source de
 * vérité, ce courriel n'est qu'un avis. Toute panne d'envoi est journalisée et
 * avalée — une soumission valide ne doit jamais échouer parce que Resend est
 * indisponible ou non configuré.
 *
 * Sans `RESEND_API_KEY`, l'envoi est simplement sauté (le site fonctionne, les
 * données restent en base) : l'entreprise n'a qu'à définir la clé pour activer
 * la réception par courriel, sans redéploiement de code.
 */
export type EmailField = { label: string; value: string };

const FROM = process.env.RESEND_FROM ?? "Paysagiste Acadien <onboarding@resend.dev>";
const TO = process.env.RESEND_TO ?? siteConfig.contact.email;

export async function sendSubmissionEmail(
  subject: string,
  fields: EmailField[],
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "RESEND_API_KEY absent : notification par courriel sautée (la soumission reste enregistrée en base).",
    );
    return;
  }

  const rows = fields
    .filter((f) => f.value.trim() !== "")
    .map((f) => `${f.label} : ${f.value}`);
  const text = rows.join("\n");
  const html = rows
    .map((r) => `<p style="margin:0 0 8px">${escapeHtml(r)}</p>`)
    .join("");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject,
      text,
      html,
      // Répondre au courriel notifie directement le visiteur.
      replyTo: fields.find((f) => f.label.toLowerCase().includes("courriel"))?.value,
    });
    if (error) {
      console.error("Envoi Resend échoué :", error);
    }
  } catch (error) {
    console.error("Envoi Resend échoué (exception) :", error);
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
