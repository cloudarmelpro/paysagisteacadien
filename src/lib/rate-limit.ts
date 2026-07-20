import "server-only";

/**
 * Limiteur de débit en mémoire, par clé (typiquement une IP). Prévu pour une
 * instance unique (`output: standalone` sur Hostinger) : l'état ne survit pas à
 * un redémarrage et n'est pas partagé entre instances. Suffisant contre le spam
 * de formulaire ; à remplacer par un store partagé (Redis) en cas de scale-out.
 */
type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** `true` si la requête est autorisée, `false` si le quota de la fenêtre est atteint. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Purge opportuniste : empêche la Map d'enfler indéfiniment avec les IP vues.
  if (windows.size > 5_000) {
    for (const [k, w] of windows) {
      if (now > w.resetAt) windows.delete(k);
    }
  }

  const current = windows.get(key);
  if (!current || now > current.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
