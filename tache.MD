# Tâches — Paysagiste Acadien

Suivi de ce qui reste à faire. Dernière mise à jour : **17 juillet 2026**.

- **URL de transition** : https://paysagisteacadien.vercel.app (le nouveau site)
- **Domaine final** : https://paysagisteacadien.com (⚠️ sert encore **l'ancien site**)

> ⚠️ **Le point le plus important de ce fichier**
> Tant que le domaine n'est pas basculé, **rien de ce qui est codé n'a d'effet réel**
> sur Google. Le site neuf est en `noindex` volontaire sur l'URL Vercel. Toutes les
> optimisations SEO attendent le cutover pour exister.

---

## 🔴 Bloquant — sans ça, le reste ne sert à rien

### 1. Basculer le domaine vers Vercel — **client**
Pointer `paysagisteacadien.com` sur le déploiement Vercel.

Effets automatiques, **aucun code à changer** :
- le `noindex` se lève tout seul (il ne vise que les hôtes ≠ domaine final) ;
- les `canonical`, le sitemap et le JSON-LD deviennent justes (ils pointent déjà sur le domaine final) ;
- les redirections 308 des anciennes URL prennent effet.

**Vérifier après le cutover :**
```bash
curl -sI https://paysagisteacadien.com/fr | grep -i x-robots-tag   # doit être VIDE
curl -s -o /dev/null -w "%{http_code}\n" https://paysagisteacadien.com/tourbe   # doit être 308
curl -sL -o /dev/null -w "%{url_effective}\n" https://paysagisteacadien.com/tourbe  # → /fr/services/tourbe
```

### 2. Variable d'environnement Vercel — **client**
- [ ] `DATABASE_URL` définie dans **Settings → Environment Variables**, pour **Production** *et* **Preview**.

Sans elle, le site build et s'affiche, mais **les formulaires échouent à l'envoi** (nous-joindre + emplois écrivent dans Neon).
À faire depuis le tableau de bord Vercel — jamais par un commit, c'est un secret.

**Vérifier :** envoyer un vrai formulaire de test sur le site en ligne.

### 3. Google Business Profile — **client**
C'est **le facteur n°1** pour « paysagiste Laval » (le map pack passe avant les résultats organiques). Aujourd'hui : aucun signal.

- [ ] Revendiquer / créer la fiche au nom exact **« Paysagiste Acadien »**
- [ ] Catégorie principale : **Landscaper / Aménagement paysager** (une mauvaise catégorie est le facteur négatif n°1)
- [ ] Configurer en **SAB** (service-area business) : masquer l'adresse, déclarer Laval + les villes de la Rive-Nord
- [ ] Téléphone `514-808-6549`, horaires, site web (après cutover), photos de chantiers
- [ ] **Lancer la collecte d'avis** — un flux régulier compte plus qu'un gros paquet ponctuel

### 4. Search Console — **client** (après cutover)
- [ ] Ajouter la propriété `paysagisteacadien.com`
- [ ] Soumettre `https://paysagisteacadien.com/sitemap.xml`
- [ ] Surveiller la couverture d'index les premières semaines

---

## 🟠 Fort impact — contenu réel manquant

### 5. Photos de chantiers réelles — **client**
Les images sont des **placeholders Unsplash** (`src/config/site.ts` → `serviceImages`).
Triple gain d'un coup :
- **LCP** : c'est le seul frein restant (2,7 s aujourd'hui, seuil « bon » à 2,5 s — `hero-pelouse.jpg` fait 1,1 Mo)
- **E-E-A-T** : preuve d'expérience réelle
- **Conversion** : le pavé uni et la taille de haie sont des achats visuels

- [ ] Fournir des photos de vrais chantiers (idéalement avant/après)
- [ ] → *puis moi* : les intégrer et remesurer le LCP

### 6. Confirmer la zone desservie — **client** ⚠️
`src/config/site.ts` → `serviceMunicipalities` est une **HYPOTHÈSE de ma part**, pas la zone officielle :

> Terrebonne, Blainville, Boisbriand, Rosemère, Sainte-Thérèse, Mirabel, Mascouche, Bois-des-Filion, Lorraine, Sainte-Anne-des-Plaines

Les textes disent « notamment » (jamais une promesse de couverture), mais **à valider avant le cutover** : retirer les villes non desservies, ajouter les manquantes.

### 7. Faire relire la politique de confidentialité — **client**
`/fr/confidentialite` — rédigée sérieusement et fidèle à ce que le code fait réellement, **mais je ne suis pas juriste**.

Deux points à connaître :
- Les données des formulaires sont stockées **aux États-Unis** (Neon, `us-east-1`). La Loi 25 impose de le divulguer — c'est fait.
- La Loi 25 exige un **responsable de la protection des renseignements personnels** : par défaut Cédric Babin (c'est ce qui est affiché).

---

## 🟡 Côté code — optionnel, faible impact

- [ ] ~~Schéma `FAQPage`~~ — **déconseillé** : Google a retiré les résultats enrichis FAQ le 7 mai 2026. Bénéfice quasi nul.
- [ ] Uniformiser `serviceImages` : plusieurs services partagent la même photo (`hero-pelouse.jpg` sert 2 fois). Se règlera avec les vraies photos (point 5).

> **Il ne reste plus rien de significatif à faire côté code.** Tout le gain
> restant est dans la colonne « client » ci-dessus.

### Régénérer les images de partage (si l'accroche change)
```bash
node scripts/og/generate.mjs   # réécrit public/og-fr.png + og-en.png
```
Les textes sont **lus dans les dictionnaires** (`hero.titleLead` /
`hero.titleAccent`) et le logo repris de `src/app/icon.svg` : si l'accroche du
hero change, relancer la commande, sinon l'image partagée contredira le site.

Volontairement **pas une photo** : les photos actuelles sont des placeholders
Unsplash ; les diffuser comme vitrine de nos chantiers serait faux. Le visuel de
marque reste juste même après le point 5.

---

## ✅ Fait et vérifié en production

Ne pas refaire — chaque ligne a été mesurée, pas supposée.

| | État |
|---|---|
| `robots.txt` + `sitemap.xml` (26 URL) | ✅ |
| `noindex` sur les hôtes non canoniques | ✅ (se lève au cutover) |
| Redirections 308 des anciennes URL (10/10) | ✅ |
| `html lang` correct par locale, **côté serveur** | ✅ |
| Canonical **propre à chaque page** + hreflang `fr`/`en`/`x-default` | ✅ |
| Open Graph / Twitter (`fr_CA` / `en_CA`) | ✅ |
| JSON-LD : LocalBusiness + BreadcrumbList + Service | ✅ |
| En-têtes de sécurité (CSP, HSTS, nosniff…) | ✅ 6/6 |
| **LCP mobile 9,7 s → 2,7 s** · score 62 → **96/100** | ✅ |
| Politique de confidentialité (Loi 25) | ✅ |
| « Laval » dans le title / H1 / description de l'accueil | ✅ |
| 3 pages minces étoffées (64-83 mots → 250-300) | ✅ |
| Anglais uniformisé (« North Shore », 0 fuite de français) | ✅ |
| Mode sombre complet | ✅ |

**Contrôle rapide de l'ensemble :**
```bash
U=https://paysagisteacadien.vercel.app   # remplacer par le domaine après cutover
curl -s $U/sitemap.xml | grep -c "<loc>"                       # 26
curl -s $U/en/services/tourbe | grep -o '<html lang="[a-z]*"'  # lang="en"
curl -sI $U/fr | grep -icE 'content-security-policy|x-content-type-options|x-frame-options|referrer-policy|permissions-policy|strict-transport'   # 6
```

---

## Règles tenues sur ce projet — à ne pas casser

1. **Rien d'inventé sur l'entreprise.** Aucun prix, garantie, délai, licence RBQ, certification, marque de produit, nombre d'années ni de clients n'a été écrit sans source. Si une info manque, elle est demandée — jamais fabriquée.
2. **Le `.env` ne part jamais dans git.** Il est ignoré et vérifié à chaque commit.
3. **`siteConfig` ne contient aucun texte affiché traduisible.** Une chaîne française y avait été figée et fuyait sur les pages anglaises — les textes visibles vivent dans les dictionnaires.
4. **Les dictionnaires restent à parité.** Toute clé ajoutée à `fr.json` doit l'être à `en.json` (233/233 actuellement).
