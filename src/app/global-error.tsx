"use client";

import "./globals.css";

/**
 * Dernier filet : ne se déclenche que si le layout racine lui-même échoue —
 * `[lang]/error.tsx` ne peut pas couvrir le layout qui l'englobe.
 *
 * Il remplace le layout racine quand il est actif : il doit donc porter ses
 * propres `<html>` et `<body>`, et importer les styles lui-même. Pas de police
 * ni d'en-tête ici : tout ce qu'il utilise doit pouvoir fonctionner alors que la
 * racine est cassée. Bilingue en dur, faute de dictionnaire disponible.
 */
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="fr">
      <body className="min-h-full">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-4 px-6">
          <h1 className="text-3xl tracking-tight sm:text-4xl">
            Une erreur est survenue
          </h1>
          <p className="text-base leading-relaxed text-foreground/70">
            Le site est momentanément indisponible. Réessayez dans un instant.
          </p>
          <p className="text-sm leading-relaxed text-foreground/60">
            Something went wrong. The site is temporarily unavailable — please
            try again in a moment.
          </p>
          <button
            type="button"
            onClick={unstable_retry}
            className="mt-2 cursor-pointer rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Réessayer / Try again
          </button>
          {error.digest ? (
            <p className="mt-4 text-xs text-foreground/50">
              Référence : {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
