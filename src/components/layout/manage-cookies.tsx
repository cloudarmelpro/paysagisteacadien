"use client";

import { resetConsent } from "./cookie-consent";

/**
 * Rouvre la bannière de consentement en effaçant le choix enregistré. La Loi 25
 * exige de pouvoir revenir sur son consentement : sans ce contrôle, un choix
 * stocké serait définitif, le visiteur n'ayant que l'effacement manuel du
 * stockage du navigateur comme recours.
 */
export function ManageCookies({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={resetConsent}
      className="w-fit cursor-pointer text-xs text-foreground/60 transition-colors duration-200 hover:text-foreground"
    >
      {label}
    </button>
  );
}
