@AGENTS.md

# Paysagiste Acadien — guide projet

Site vitrine **haut de gamme et bilingue (FR/EN)** pour Paysagiste Acadien Inc.
(aménagement et entretien paysager). Refonte complète d'un ancien site statique :
https://paysagisteacadien.com — le **contenu** est repris, le **design est refait**.

## Stack

Next.js 16.2 (App Router, Turbopack, React Compiler) · React 19 · TypeScript strict ·
Tailwind CSS v4 · shadcn/ui (style `base-nova`) · base-ui/react · lucide-react.

## Commandes

- `npm run dev` — serveur de développement
- `npm run build` — build de production (fait le type-check + génère les types de routes)
- `npm run lint` — ESLint
- Design system : `python .claude/skills/ui-ux-pro-max/scripts/search.py "<requête>" --design-system -p "Paysagiste Acadien"`

## Architecture

```
src/
├─ app/[lang]/          # routes bilingues (lang = fr | en) ; layout racine ici
│  ├─ layout.tsx        # <html lang>, fonts, generateStaticParams, metadata
│  └─ page.tsx          # accueil
├─ app/globals.css      # Tailwind v4
├─ proxy.ts             # ex-middleware : détecte la locale et redirige / → /fr
├─ config/site.ts       # constantes entreprise + catalogue de services (slugs)
├─ dictionaries/{fr,en}.json   # TOUTES les chaînes traduites
├─ lib/i18n.ts          # locales = [fr, en], defaultLocale = fr
├─ lib/dictionaries.ts  # getDictionary(locale) + hasLocale + type Dictionary
├─ lib/actions/         # Server Actions ("use server") — PAS dans app/ : un composant
│                       # de components/ qui importe app/ inverse les couches
├─ lib/seo.ts           # canonical/hreflang, Open Graph, jsonLdScript (échappe `<`)
├─ components/          # ui/ (shadcn) · layout/ · sections/ · seo/ · shared/
├─ hooks/  lib/
```

## Conventions

- **i18n** : aucune chaîne visible en dur dans le JSX — tout passe par `getDictionary(lang)`.
  Ajouter une clé dans `fr.json` ET `en.json` (même forme ; `fr.json` = type de référence).
- **Server Components par défaut** ; `"use client"` uniquement si état/effets/événements.
- `params`/`searchParams` sont des **Promises** → les `await`. Utiliser les helpers globaux
  `PageProps<'/[lang]/...'>` et `LayoutProps<'/[lang]'>`.
- Alias `@/*` → `src/*`. Réutiliser `siteConfig`/`services` (pas de duplication).
- Nouvelles pages : sous `src/app/[lang]/…` ; slugs de services dans `config/site.ts`.
- Middleware s'appelle **`proxy.ts`** dans cette version (ne pas créer `middleware.ts`).
- **Pas de barrel file** (`index.ts` qui ré-exporte un dossier) : importer directement
  le fichier. La doc Next l'énonce dans `02-guides/local-development.md` — un barrel
  force le compilateur à analyser tout le dossier pour un seul import.
- **Commentaires** : uniquement une contrainte que le code ne montre pas (piège, omission
  délibérée, invariant entre fichiers). 1–3 lignes. Ni historique, ni provenance, ni
  paraphrase du code, ni justification adressée au relecteur.

## Design (à venir)

Direction visuelle définie à partir de **maquettes/captures** fournies par le client.
Univers **nature / végétal / terre / pierre**, pas de bleu corporate générique.
Lancer l'agent `design-lead` ; suivre le skill `frontend-design` (éviter les défauts templatisés).
A11y non négociable : contraste ≥ 4.5:1, focus visibles, `prefers-reduced-motion`, responsive.

## À ne pas faire

- Ne pas coder une API Next.js sans lire la doc dans `node_modules/next/dist/docs/` (voir AGENTS.md).
- Pas d'emoji comme icônes (utiliser lucide-react). Pas de `middleware.ts`. Pas de `any`.
