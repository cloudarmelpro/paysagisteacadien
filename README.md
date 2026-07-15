# paysagisteacadien

Site vitrine bilingue (FR/EN) de **Paysagiste Acadien Inc.** — aménagement et
entretien paysager. Refonte du site existant : https://paysagisteacadien.com

## Stack

Next.js 16 (App Router, Turbopack, React Compiler) · React 19 · TypeScript strict ·
Tailwind CSS v4 · shadcn/ui (`base-nova`) · base-ui/react · lucide-react

## Démarrage

```bash
npm install
npm run dev      # http://localhost:3000 (redirige vers /fr)
```

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (inclut le type-check) |
| `npm run lint` | ESLint |

## Architecture

```
src/
├─ app/[lang]/          routes bilingues (lang = fr | en), layout racine
├─ app/globals.css      thème Tailwind v4 (tokens de couleur et de rayon)
├─ proxy.ts             détection de locale (ex-middleware) : / → /fr
├─ config/site.ts       constantes entreprise + catalogue de services
├─ dictionaries/        fr.json · en.json — toutes les chaînes traduites
├─ lib/                 i18n.ts · dictionaries.ts · utils.ts
└─ components/          ui/ · layout/ · sections/
```

## Conventions

- **i18n** : aucune chaîne visible en dur dans le JSX — tout passe par
  `getDictionary(lang)`. Toute clé ajoutée doit l'être dans `fr.json` **et** `en.json`.
- **Server Components** par défaut ; `"use client"` seulement si état ou événements.
- Le middleware s'appelle **`proxy.ts`** dans cette version de Next.js.
- Consulter la doc embarquée dans `node_modules/next/dist/docs/` avant de coder
  une API Next.js (voir `AGENTS.md`).

## Notes de développement

- Un `next build` échoue en `EPERM` si `next dev` tourne (verrou sur `.next`
  sous Windows) — arrêter le serveur de dev avant de builder.
- Toute modification du bloc `@theme` de `globals.css` exige un redémarrage du
  serveur de dev (Tailwind v4 ne recompile pas ce bloc à chaud).

## Images

Les photos de `public/images/` sont des placeholders Unsplash (licence libre),
à remplacer par les photos réelles des chantiers.
