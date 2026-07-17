# Tâches — Paysagiste Acadien

Suivi de ce qui reste à faire. Dernière mise à jour : **17 juillet 2026**.

- **URL de transition** : https://paysagisteacadien.vercel.app (le nouveau site)
- **Domaine final** : https://paysagisteacadien.com (⚠️ sert encore **l'ancien site**)

> ⚠️ **Le point le plus important de ce fichier**
> Tant que le domaine n'est pas basculé, **rien de ce qui est codé n'a d'effet réel**
> sur Google. Le site neuf est en `noindex` volontaire sur l'URL Vercel. Toutes les
> optimisations SEO attendent le cutover pour exister.

> 🔄 **Changement de plan (juillet 2026) : TOUT passe chez Hostinger** (plan Business,
> Node.js) — site + domaine + email. Le site **n'ira PAS sur Vercel** au final ; il
> sera **auto-hébergé** chez Hostinger (`output: 'standalone'` déjà activé).
> Le domaine `paysagisteacadien.com` est transféré de **GoDaddy vers Hostinger**
> (~5 jours). **Ne rien faire au DNS ni au déploiement avant la fin du transfert.**
> Ensuite, tout dans **une seule session** chez Hostinger : déploiement Node.js du site,
> création de la boîte `info@paysagisteacadien.com`, bascule email vers SMTP Hostinger,
> et pointage du domaine. Le DNS/hébergement est géré par le client (Cédric).
>
> **Resend est abandonné** (voir §2). **Vercel n'est plus la cible** (les sections
> ci-dessous qui parlent de « bascule vers Vercel » sont à lire comme « déploiement
> Hostinger »).

---

## 🔴 Bloquant — sans ça, le reste ne sert à rien

### 1. Basculer le domaine vers Vercel — **client**
Pointer `paysagisteacadien.com` sur le déploiement Vercel.

Effets automatiques, **aucun code à changer** :
- le `noindex` se lève tout seul (il ne vise que les hôtes ≠ domaine final) ;
- les `canonical`, le sitemap et le JSON-LD deviennent justes (ils pointent déjà sur le domaine final) ;
- les redirections 308 des anciennes URL prennent effet.

**Vérifier après le cutover** — tout est déjà en place et testé sur l'URL de
transition ; ce bloc confirme que la bascule n'a rien cassé :
```bash
U=https://paysagisteacadien.com
curl -sI $U/fr | grep -i x-robots-tag                          # VIDE (le noindex est levé)
curl -sL -o /dev/null -w "%{url_effective}\n" $U/tourbe        # → /fr/services/tourbe (308)
curl -s $U/sitemap.xml | grep -c "<loc>"                       # 26
curl -s $U/en/services/tourbe | grep -o '<html lang="[a-z]*"'  # lang="en"
curl -sI $U/fr | grep -icE 'content-security-policy|x-content-type-options|x-frame-options|referrer-policy|permissions-policy|strict-transport'   # 6
```

### 2. Variables d'environnement + email — **au déploiement Hostinger**
Les secrets se définissent dans la config Node.js de Hostinger (jamais dans un commit).
Modèle : `.env.example`.

- [ ] `DATABASE_URL` — sans elle, le site s'affiche mais **les formulaires échouent à
  l'envoi** (nous-joindre + emplois écrivent dans Neon).
- [ ] **Email : migrer de Resend vers le SMTP Hostinger.** Décision : tout chez
  Hostinger, donc **Resend est abandonné** (la clé testée ne sert plus). À la place :
  1. Créer la boîte `info@paysagisteacadien.com` dans Hostinger (mailboxes gratuites du
     plan Business).
  2. *Moi* : remplacer `src/lib/email.ts` (Resend) par un envoi **SMTP via nodemailer**
     (`smtp.hostinger.com`), piloté par `SMTP_HOST/PORT/USER/PASS`.
  3. Définir ces variables dans Hostinger. Best-effort conservé : un échec d'envoi ne
     casse jamais la soumission (elle reste en base).
  Tant que ce n'est pas fait, les soumissions restent **enregistrées en base** (rien
  n'est perdu), mais aucun courriel n'est envoyé.

> ~~Ancien plan Resend / Outlook~~ — abandonné. La clé Resend (compte dev
> `cloudarmelpro@gmail.com`) fonctionnait mais ne livrait qu'à ce compte en mode test ;
> remplacée par une vraie boîte au domaine, plus simple et cohérente avec « tout chez
> Hostinger ».

**Vérifier :** envoyer un vrai formulaire de test sur le site en ligne, puis confirmer
la réception dans la boîte Outlook.

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
Cette liste est une **HYPOTHÈSE de ma part**, pas la zone officielle :

> Terrebonne, Blainville, Boisbriand, Rosemère, Sainte-Thérèse, Mirabel, Mascouche, Bois-des-Filion, Lorraine, Sainte-Anne-des-Plaines

Elle est **affichée aux visiteurs** dans la réponse FAQ « Quel territoire desservez-vous ? »
(clé `faq` de `src/dictionaries/fr.json` et `en.json` — les deux sont à corriger ensemble).

Les textes disent « notamment », jamais une promesse de couverture, mais **à valider avant le
cutover** : retirer les villes non desservies, ajouter les manquantes.

> Ne pas créer une page par ville pour le SEO : ce sont des *doorway pages*, explicitement
> sanctionnées par Google, et le contenu serait quasi identique d'une ville à l'autre.

### 7. Faire relire la politique de confidentialité — **client**
`/fr/confidentialite` — rédigée sérieusement et fidèle à ce que le code fait réellement, **mais je ne suis pas juriste**.

Deux points à connaître :
- Les données des formulaires sont stockées **aux États-Unis** (Neon, `us-east-1`). La Loi 25 impose de le divulguer — c'est fait.
- La Loi 25 exige un **responsable de la protection des renseignements personnels** : par défaut Cédric Babin (c'est ce qui est affiché).

---

## 🟡 Côté code — optionnel, faible impact

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

## Règles à ne pas casser

Ce ne sont pas des tâches : ce sont des contraintes actives, à tenir sur tout
ce qui sera ajouté au site.

1. **Rien d'inventé sur l'entreprise.** Aucun prix, garantie, délai, licence RBQ, certification, marque de produit, nombre d'années ni de clients n'a été écrit sans source. Si une info manque, elle est demandée — jamais fabriquée.
2. **Le `.env` ne part jamais dans git.** Il est ignoré et vérifié à chaque commit.
3. **`siteConfig` ne contient aucun texte affiché traduisible.** Une chaîne française y avait été figée et fuyait sur les pages anglaises — les textes visibles vivent dans les dictionnaires.
4. **Les dictionnaires restent à parité.** Toute clé ajoutée à `fr.json` doit l'être à `en.json` (233/233 actuellement).
