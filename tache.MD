# Tâches — Paysagiste Acadien

Suivi de ce qui reste à faire. Dernière mise à jour : **21 juillet 2026**.

- **URL de transition** : https://paysagisteacadien.vercel.app (le nouveau site)
- **Domaine final** : https://paysagisteacadien.com (⚠️ sert encore **l'ancien site**)

> ⚠️ **Le point le plus important de ce fichier**
> Tant que le domaine n'est pas basculé, **rien de ce qui est codé n'a d'effet réel**
> sur Google. Le site neuf est en `noindex` volontaire hors du domaine final. Toutes les
> optimisations SEO attendent le cutover pour exister.

> 🔄 **Plan d'hébergement : TOUT chez Hostinger** (plan Business, Node.js) — site +
> domaine. Le site sera **auto-hébergé** (`output: 'standalone'` déjà activé).
> Le domaine est transféré de **GoDaddy vers Hostinger** (~5 jours).
> **Ne rien faire au DNS ni au déploiement avant la fin du transfert.**
> Le DNS/hébergement est géré par le client (Cédric).

> ✅ **Audit pré-production fait le 21 juillet 2026** — trois audits parallèles
> (SEO, accessibilité, production/sécurité) sur le build de production.
> **Aucune faille critique.** Tout ce qui était corrigeable en code l'a été
> (commit `5127ff9`). Ne restent que les points couplés à la bascule, ci-dessous.

---

## 🔴 Bloquant — le jour de la bascule

### 1. Corriger la politique de confidentialité — **AVANT de servir le domaine** ⚠️
`src/dictionaries/fr.json` et `en.json`, clé `privacy`.

- [x] **Google Analytics déclaré** ✅ (section « Témoins ») : finalité, Google
      comme tiers, données hors Québec, consentement requis et retirable. Date de
      mise à jour portée au 22 juillet 2026.
- [ ] Section « Où vos renseignements sont conservés » : remplacer
      **« hébergé par Vercel »** par **Hostinger**. Faux dès la bascule.
- [ ] **Vérifier la région du serveur Hostinger choisie** (US / EU / Asie) et
      l'écrire correctement — la Loi 25 impose que la divulgation corresponde à
      la réalité. La partie **Neon (É.-U.)** reste vraie, la base ne bouge pas.
- [ ] Reporter la date `privacy.updatedAt` au jour de cette correction.

> Document à portée légale. La déclaration GA est désormais **exacte**, mais
> **faire relire l'ensemble par un juriste** avant mise en ligne — déclarer un
> traitant tiers et un transfert hors Québec est juridiquement sensible. Autorité : CAI.

### 2. Déployer sur Hostinger + pointer le domaine — **client + moi**

**Assembler le bundle `standalone`** (Next ne le fait pas tout seul) :
1. `npm ci && npm run build` (le script lance déjà `prisma generate`)
2. Racine de l'app = `.next/standalone/`
3. Copier `.next/static/` → `.next/standalone/.next/static/`
4. Copier `public/` → `.next/standalone/public/`
5. **🔒 SUPPRIMER `.next/standalone/.env` de l'archive envoyée** — le build y
   recopie le `.env` local, donc **la vraie clé Resend et le mot de passe Neon**.
   Jamais commité (vérifié sur tout l'historique), mais présent dans le bundle.
   Si une archive contenant ce fichier a déjà circulé : **changer la clé Resend
   et le mot de passe Neon.**
6. Démarrage : `node server.js` depuis le dossier standalone.
   **Pas** `npm start` / `next start` — ils ne s'appliquent pas au standalone.

Effets automatiques une fois le domaine servi, **aucun code à changer** :
le `noindex` se lève seul, les `canonical`/sitemap/JSON-LD deviennent justes,
les redirections 308 des anciennes URL prennent effet.

### 3. Variables d'environnement — **au déploiement**
À définir dans la config Node.js de Hostinger, jamais dans un commit. Modèle : `.env.example`.

- [ ] `DATABASE_URL` — l'URL Neon **poolée** (`src/lib/prisma.ts` l'exige et
      échoue explicitement si elle manque). Sans elle, les formulaires échouent.
- [ ] `RESEND_API_KEY` — sans elle, les soumissions restent en base mais **aucun
      courriel ne part**.
- [ ] `RESEND_FROM`, `RESEND_TO`
- [ ] `NODE_ENV=production` (+ `PORT`/`HOSTNAME` si le runner Hostinger l'exige)

- [x] **Email (Resend) — EN PLACE ET TESTÉ** ✅ Compte créé sur
      `paysagisteacadien@outlook.com` ; envoi de test réel bien reçu.

> ⚠️ **Expéditeur** : tant que `RESEND_FROM` reste `onboarding@resend.dev`, Resend
> ne livre **qu'au propriétaire du compte**. Une fois le DNS chez Hostinger :
> vérifier le domaine dans Resend, puis passer `RESEND_FROM` sur une adresse du
> domaine — sinon les notifications vers `RESEND_TO` n'arriveront pas.

### 4. Vérifications après la bascule — **à faire dans l'heure**
```bash
U=https://paysagisteacadien.com
curl -sI $U/fr | grep -i x-robots-tag        # DOIT ÊTRE VIDE ⚠️ voir ci-dessous
curl -sL -o /dev/null -w "%{url_effective}\n" $U/tourbe   # → /fr/services/tourbe (308)
curl -s $U/sitemap.xml | grep -c "<loc>"                 # 30
curl -s $U/en/services/tourbe | grep -o '<html lang="[a-z]*"'   # lang="en"
curl -sI $U/fr | grep -icE 'content-security-policy|x-content-type-options|x-frame-options|referrer-policy|permissions-policy|strict-transport'   # 6
```

> ⚠️ **Le `x-robots-tag` est le test critique.** Le `noindex` ne s'applique
> qu'aux hôtes ≠ `paysagisteacadien.com`. Si le proxy Hostinger réécrit l'en-tête
> `Host`, l'app ne voit pas le vrai domaine et **tout le site reste désindexé en
> silence**. Test de 30 secondes, conséquence totale.

Également :
- [ ] Envoyer un **vrai formulaire** et confirmer : ligne en base **+** courriel reçu
- [ ] Vérifier que l'IP réelle du visiteur arrive bien (pas `unknown`) — sinon le
      limiteur anti-spam met tout le monde dans le même seau et bloque les vrais
      visiteurs après 5 envois/heure
- [ ] Confirmer que le **cache proxy HTML est désactivé** (ou ignore `s-maxage`) :
      les réponses portent `s-maxage=31536000`, prévu pour un CDN piloté par Next.
      Sur un proxy qui l'honore sans purge, une page peut se figer un an.
- [ ] Vérifier que HTTPS est forcé — le HSTS envoyé contient `preload`, qui n'a de
      sens que si **tous** les sous-domaines servent en HTTPS

### 5. Google Business Profile — **client**
**Facteur n°1** pour « paysagiste Laval » (le map pack passe avant l'organique). Aujourd'hui : aucun signal.

- [ ] Revendiquer / créer la fiche au nom exact **« Paysagiste Acadien »**
- [ ] Catégorie principale **Landscaper / Aménagement paysager** (une mauvaise catégorie est le facteur négatif n°1)
- [ ] Configurer en **SAB** : masquer l'adresse, déclarer Laval + la Rive-Nord
- [ ] Téléphone `514-808-6549`, horaires, site web (après cutover), photos de chantiers
- [ ] **Lancer la collecte d'avis** — un flux régulier compte plus qu'un gros paquet ponctuel

### 6. Search Console — **client** (après cutover)
- [ ] Ajouter la propriété `paysagisteacadien.com`
- [ ] Soumettre `https://paysagisteacadien.com/sitemap.xml`
- [ ] Surveiller la couverture d'index les premières semaines

---

## 🟠 À valider avec Cédric

### 7. Photos — deux points précis
- [x] **Vraies photos intégrées** ✅ Les 8 photos de service + la FAQ sont celles
      de Cédric (compressées 120 Mo → 6,6 Mo). Les placeholders Unsplash sont partis.
- [ ] ⚠️ **`plantation.jpg` montre des palmiers.** Elle sert sur Plantation,
      Aménagement paysager **et comme image de l'entreprise dans les données
      structurées Google**. Des palmiers ne poussent pas à Laval : ça signale une
      photo de banque d'images. **À remplacer par une vraie photo de chantier.**
- [ ] ⚠️ **`faq.jpg` est un portrait de personne**, affiché avec « Paysagiste
      Acadien » superposé — ce qui suggère qu'elle est employée ou cliente.
      À confirmer avec Cédric si c'est une image de banque.

### 8. Formulation « 200+ projets »
Cédric a écrit « projets **complétés** ». J'ai retenu « **réalisés** » (l'OQLF
signale « compléter » comme anglicisme dans ce sens). À confirmer — un mot à changer.

### 9. Confirmer la zone desservie — **client** ⚠️
Cette liste est une **HYPOTHÈSE**, pas la zone officielle :

> Terrebonne, Blainville, Boisbriand, Rosemère, Sainte-Thérèse, Mirabel, Mascouche, Bois-des-Filion, Lorraine, Sainte-Anne-des-Plaines

Elle est **affichée aux visiteurs** dans la réponse FAQ « Quel territoire desservez-vous ? »
(clé `faq` de `fr.json` et `en.json` — corriger les deux ensemble).
Les textes disent « notamment », jamais une promesse de couverture, mais **à valider avant le cutover**.

> Ne pas créer une page par ville : ce sont des *doorway pages*, explicitement sanctionnées par Google.

### 10. Faire relire la politique de confidentialité — **client**
Rédigée sérieusement et fidèle à ce que le code fait, **mais je ne suis pas juriste**.
Vu l'enjeu, une relecture par un juriste avant mise en ligne reste la bonne pratique —
l'autorité étant la **CAI** (cai.gouv.qc.ca).

À savoir :
- Les données des formulaires sont stockées **aux États-Unis** (Neon `us-east-1`) — divulgué comme la Loi 25 l'impose.
- La Loi 25 exige un **responsable de la protection des renseignements personnels** : Cédric Babin par défaut.

---

## 🟢 Google Analytics — en place ✅

- [x] **GA4 branché et conditionné au consentement.** L'ID de mesure de Cédric
      (`G-NL4DBWMX5N`) est dans `src/config/site.ts` (`gaMeasurementId`) ; le
      bandeau reste conforme aux 3 points de la CAI. Vérifié en test réseau :
      **0 requête Google avant « Accepter »**, GA chargé après, « Refuser » ne
      déclenche rien.
- Surcharge possible par `NEXT_PUBLIC_GA_MEASUREMENT_ID` au build (propriété GA
      distincte en préproduction) — **optionnel**, l'ID par défaut suffit.
- [x] **Consent Mode** : l'init GA refuse explicitement le publicitaire
      (`ad_storage/ad_user_data/ad_personalization: denied`, `analytics_storage:
      granted`) — cohérent avec « aucun témoin publicitaire » de la politique.
      Recommandé aussi : **désactiver Google Signals** dans l'admin GA4.

**Vérifier une fois le vrai domaine en ligne :** dans GA4 (Rapports → Temps réel),
confirmer que les visites remontent après avoir accepté le bandeau sur
`paysagisteacadien.com`.

---

## 🟢 Faible priorité — après le lancement

Points relevés par l'audit, sans impact réel avant la mise en ligne :

- [ ] `aria-required` sur les champs obligatoires des deux formulaires
- [ ] `aria-live` sur les erreurs de validation client (atténué : le focus va au
      premier champ invalide et chaque erreur est reliée par `aria-describedby`)
- [ ] Cibles tactiles < 44 px en mobile (« Gérer mes témoins », lien politique,
      sélecteur de langue) — l'espacement respecte tout juste l'exception 24 px
- [ ] `poweredByHeader: false` dans `next.config.ts` (expose `X-Powered-By: Next.js`)
- [ ] `shadcn` (la CLI) est dans `dependencies` → `devDependencies`
- [ ] Titre `Irrigation` identique en FR et EN — y ajouter « à Laval » différencierait et ajouterait le mot-clé local
- [ ] Volume de préchargement : les variantes claire **et** sombre du logo sont
      préchargées alors qu'une seule s'affiche
- [ ] `npm audit` : 5 alertes modérées, toutes transitives (postcss dans `next`,
      `@prisma/dev` dans la CLI) — **aucun chemin d'exploitation**, se règleront
      aux prochaines montées de version. Ne **pas** lancer `npm audit fix --force`
      (il propose de redescendre à next@9).

### Artefact local : cache d'images bloqué (OneDrive)
En dev/prod **local**, une variante d'image optimisée peut se figer (requête
`/_next/image?...` qui ne répond jamais) parce que le projet vit sous **OneDrive**,
qui verrouille/déshydrate des fichiers de `.next/cache/images`. Symptôme observé
une fois : la carte « Irrigation » sans photo. **Sans effet sur Hostinger** (autre
système de fichiers). Contournement local : `rm -rf .next/cache/images` puis
redémarrer, ou sortir le projet d'un dossier synchronisé OneDrive.

### Avertissement console connu, en développement seulement
Sur les pages 404, la console de `npm run dev` affiche :
> *Encountered a script tag while rendering React component…*

**Sans conséquence, et à ne pas « corriger ».** Sur ce chemin, React rend le
layout côté client ; les deux `<script>` bruts restants — le script adaptatif de
l'en-tête (`header.tsx`) et le JSON-LD — s'y retrouvent sans être exécutés. Or
sur une 404, aucun des deux n'a d'effet : le script adaptatif ne s'active que sur
les pages à bande, et des données structurées sur une page `noindex` ne servent à
rien. Convertir le JSON-LD en `next/script` **casserait** sa lecture par les
moteurs. L'avertissement est retiré au build : la console de production est vide.

> Le vrai bug de ce chemin — le thème sombre ignoré sur les 404, parce que React
> réécrivait `className` sur `<html>` — est corrigé (`ThemeRestore`).

### Régénérer les images de partage (si l'accroche change)
```bash
node scripts/og/generate.mjs   # réécrit public/og-fr.png + og-en.png
```
Les textes sont **lus dans les dictionnaires** (`hero.titleLead` / `hero.titleAccent`) :
si l'accroche du hero change, relancer la commande, sinon l'image partagée contredira le site.

---

## Règles à ne pas casser

Ce ne sont pas des tâches : ce sont des contraintes actives, à tenir sur tout
ce qui sera ajouté au site.

1. **Rien d'inventé sur l'entreprise.** Aucun prix, garantie, délai, licence RBQ,
   certification, marque, nombre d'années ni de clients n'a été écrit sans source.
   Si une info manque, elle est demandée — jamais fabriquée. *(Le « 200+ projets »
   vient de Cédric lui-même : c'est son affirmation sur sa propre entreprise.)*
2. **Le `.env` ne part jamais dans git.** Ignoré et vérifié à chaque commit.
   ⚠️ Attention au `.env` recopié dans `.next/standalone/` au build (voir §2.5).
3. **`siteConfig` ne contient aucun texte affiché traduisible.** Une chaîne
   française y avait été figée et fuyait sur les pages anglaises — les textes
   visibles vivent dans les dictionnaires.
4. **Les dictionnaires restent à parité.** Toute clé ajoutée à `fr.json` doit
   l'être à `en.json` (**260/260** actuellement).
5. **Les textes alternatifs décrivent la vraie photo.** Ils avaient dérivé après
   le remplacement des placeholders (une photo de taille-haie décrite comme une
   allée engazonnée) — vérifier l'image avant d'écrire son alt.
