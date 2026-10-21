# Auto-évaluation — CV web

Projet : CV web statique publié sur GitHub Pages — <https://hugolgn183.github.io/page_cv/cv-site/>
Auteur : Hugo Largeron — BTS SIO SISR, CFAI de Saint-Étienne
Mesures réalisées le 21/10/2026 sur la version en ligne.

## 1. Les versions du site

| Version | Date | Description |
|---|---|---|
| V1 | 16/09/2026 | CV classique en deux colonnes (barre latérale + contenu), avec `css/style.css` et `js/app.js` séparés. |
| V2 | 23/09/2026 | Refonte : le CV devient un livre qu'on feuillette. CSS et JS regroupés dans `index.html`. |
| V3 | 23/09/2026 | Nouvelle direction artistique : une bibliothèque, chaque rubrique est un livre sur une étagère. |
| Finale | 21/10/2026 | V3 corrigée et enrichie : contenu, accessibilité, confidentialité, SEO, documentation, décor (voir le journal). |

## 2. Résultats des outils (version finale)

| Outil | Mobile | Ordinateur |
|---|---|---|
| [Validateur W3C](https://validator.w3.org/nu/?doc=https%3A%2F%2Fhugolgn183.github.io%2Fpage_cv%2Fcv-site%2F) | 0 erreur, 0 avertissement | — |
| Lighthouse — Performance | 99 | 100 |
| Lighthouse — Accessibilité | 100 | 100 |
| Lighthouse — Bonnes pratiques | 96 | 96 |
| Lighthouse — SEO | 100 | 100 |
| Outiref (structure des titres) | *à compléter* | — |

Lighthouse est le moteur d'analyse de PageSpeed Insights. Il a été lancé en local (Lighthouse 12.6.1) car l'API PageSpeed était saturée ce jour-là.

**Indicateurs mobile :** affichage du premier contenu en 1,5 s, du plus grand élément en 1,6 s, temps de blocage 0 ms, aucun décalage de mise en page (CLS = 0).

**Poids :** une seule page HTML de 50 Ko (13 Ko compressée par GitHub Pages), sans image, police externe ni bibliothèque.

**Remarques sur les mesures :**
- Les scores sont ceux d'une première visite. Le score « Bonnes pratiques » (96) vient d'une erreur 404 sur `favicon.ico` : le site n'a pas d'icône d'onglet. Lors d'une seconde mesure, une fois l'erreur en cache, tous les scores atteignent 100.
- Lighthouse a relevé quelques requêtes supplémentaires (environ 100 Ko) qui n'existent pas dans le code source du site. Elles viennent de l'environnement de test et non de la page.

## 3. Journal des corrections (V1 → finale)

| Date | Problème constaté | Cause | Correction | Impact mesuré |
|---|---|---|---|---|
| 23/09 | Avertissement W3C « Section lacks heading » | La section de l'étagère n'avait pas de titre | Ajout d'un `h2` réservé aux lecteurs d'écran (`sr-only`) | W3C : 1 avertissement → 0 |
| 23/09 | Livres trop petits, titres des tranches illisibles | Dimensions choisies pour l'esthétique | Livres agrandis (30 → 48 px de large), texte des tranches 0,6 → 0,82 rem | Lecture des tranches possible sans zoom |
| 23–25/09 | Animations coûteuses | Effet lumineux animé avec `filter`, grands dégradés | Animation de l'opacité d'un pseudo-élément, `contain:paint`, fond simplifié | Non mesuré à l'époque ; aujourd'hui temps de blocage de 10 ms sur mobile |
| 10/10 | Bug à l'ouverture de la page du livre | Animation de la page droite en conflit avec celle de la couverture | Suppression de l'animation de la page droite | Ouverture correcte |
| 21/10 | Contradiction : « en alternance » dans le Profil, « à la recherche d'une alternance » dans Contact | Texte de Contact pas mis à jour | Rubrique Contact réécrite | CV cohérent |
| 21/10 | Licence STAPS APAS indiquée « en cours » | Contenu pas mis à jour | Deux licences STAPS (ES et APAS) indiquées comme obtenues | Formations exactes |
| 21/10 | Textes dorés peu lisibles (dates, chapitres, pied de page, tranches de livres) | Couleurs choisies pour l'ambiance, sans vérifier le contraste | Teintes assombries ou éclaircies | Dates : 2,0:1 → 6,2:1 ; pied de page : 3,9:1 → 10,6:1 ; tranches : 3,7:1 → 4,7:1 minimum |
| 21/10 | Au clavier, la touche Tab sortait du livre ouvert | Pas de piège de focus dans la fenêtre modale | Focus gardé dans le livre, arrière-plan rendu inerte (`inert`) | Navigation clavier complète |
| 21/10 | Nom lu par les lecteurs d'écran différent du texte visible (« Parcours ») | `aria-label` trop différent de l'intitulé | Nom accessible commençant par le mot visible | Conforme au critère WCAG 2.5.3 |
| 21/10 | Sur mobile, texte coincé dans une demi-page, titre coupé | Mise en page « deux pages » conservée sur petit écran | Une seule page en pleine largeur sous 640 px | Largeur de texte : 160 → 331 px |
| 21/10 | Lien GitHub de contact cassé | Mauvais nom d'utilisateur | Lien vers `github.com/HugoLgn183` | Erreur 404 → page accessible |
| 21/10 | E-mail et téléphone affichés (même fictifs) | Reprise d'un modèle de CV | Remplacés par des astérisques, lien `mailto:` supprimé | Respect de la consigne de confidentialité |
| 21/10 | Contenu invisible pour les moteurs de recherche et sans JavaScript | CV rangé dans des balises `<template>` | Contenu écrit en `<section>` dans le HTML, affiché dans le livre par JavaScript | Texte indexable : 99 → 543 mots ; titres : 3 → 21 ; Lighthouse SEO 100 |
| 21/10 | Titre et description peu utiles pour le référencement | Titre centré sur le décor (« CV à la bibliothèque ») | Nouveau titre et description, URL canonique, balises Open Graph | Lighthouse SEO 100 |
| 21/10 | Export PDF de 7 pages | Un saut de page imposé après chaque rubrique | Impression directe des sections, sans saut forcé | 7 → 4 pages |
| 21/10 | Pas d'objectif professionnel dans le CV | Profil limité à la présentation | Bloc « Mon objectif » et « Ce que j'apporte » dans le Profil | CV orienté vers la suite du parcours |
| 21/10 | Dépôt sans documentation | Pas de README | Ajout de `README.md` et de ce document | Dépôt compréhensible sans ouvrir le code |
| 21/10 | Scène vide : une seule étagère dans une grande pièce sombre | Décor limité à l'étagère principale | Deux étagères de livres en arrière-plan, bougie animée et pile de livres couchés, dessinées en CSS (sans image) | Page 42 → 50 Ko ; Lighthouse Performance mobile toujours 99, temps de blocage 0 ms |
| 21/10 | Livre ouvert toujours marron, quel que soit le livre choisi | Couleur de couverture fixe dans le CSS | La couverture reprend la couleur du cuir du livre cliqué, avec un signet assorti | Lien visuel entre l'étagère et le livre ouvert |
| 21/10 | Page de gauche du livre ouvert peu remplie, tranches sans repère | Décor des pages minimal | Icône gravée par rubrique, chiffre romain sur chaque tranche, lettrine sur le premier paragraphe, rivets sur la plaque | W3C toujours sans erreur ; chiffres romains lisibles (contraste ≥ 4,7:1) |

## 4. Analyse

- **D'où venaient la plupart des problèmes :** j'ai d'abord travaillé l'apparence (le décor de bibliothèque), puis vérifié le reste. Les couleurs dorées ont été choisies à l'œil, d'où les contrastes insuffisants. Le contenu rangé dans des `<template>` facilitait le JavaScript mais rendait le CV invisible pour les moteurs de recherche.
- **Ce qui a bien fonctionné :** le choix d'un fichier unique sans dépendance donne d'excellentes performances (99–100) sans effort particulier. Le HTML a été valide dès la V1. Le décor ajouté en dernier (étagères, bougie, signet) est entièrement en CSS : il n'ajoute que 8 Ko et ne dégrade pas les performances.
- **Ce que j'en retiens :** vérifier les contrastes et tester au clavier et sur mobile dès le début, et non à la fin. Garder le contenu dans le HTML et réserver le JavaScript à l'animation (amélioration progressive).

## 5. Auto-évaluation selon la grille

| Critère | Note (0–4) | Coef | Pondéré | Justification |
|---|---:|---:|---:|---|
| C1 Contenu | 3 | 10 | 30 | Clair, cohérent, objectif indiqué ; pas encore de réalisations chiffrées |
| C2 HTML sémantique | 3 | 10 | 30 | Un seul `h1`, hiérarchie `h2`/`h3`, balises structurelles ; le `footer` est encore dans le `main` |
| C3 Responsive | 4 | 15 | 60 | Pas de défilement horizontal, lecture pleine largeur sur mobile, typographie fluide |
| C4 UX & accessibilité | 4 | 15 | 60 | Lighthouse 100, contrastes ≥ 4,5:1, navigation clavier complète, mouvement réduit |
| C5 SEO | 4 | 10 | 40 | Lighthouse 100, titre et description pertinents, contenu indexable |
| C6 Performance | 4 | 10 | 40 | Lighthouse 99–100, 50 Ko, aucune dépendance |
| C7 Validation & corrections | 3 | 10 | 30 | W3C sans erreur, Lighthouse, journal ci-dessus ; Outiref reste à passer |
| C8 Publication | 4 | 5 | 20 | En ligne, testé sur mobile, corrigé après publication |
| C9 Auto-évaluation | 4 | 5 | 20 | Résultats, causes et impact mesuré (ce document) |
| C10 Confidentialité | 3 | 5 | 15 | Aucune donnée personnelle réelle, contact par GitHub |
| C11 Qualité du dépôt | 3 | 5 | 15 | Arborescence claire, README ; certains messages de commit peu précis |
| **Total** | | **100** | **360 / 400** | **Note estimée : 18 / 20** |

Calcul : 360 / (4 × 100) × 20 = 18.

## 6. Pistes d'amélioration restantes

- Ajouter une icône d'onglet (favicon) pour supprimer l'erreur 404 et atteindre 100 en « Bonnes pratiques » sur mobile.
- Passer Outiref et compléter le tableau des résultats.
- Placer le `footer` en dehors du `main`.
- Ajouter des réalisations chiffrées dans le parcours et les compétences.
- Écrire des messages de commit plus précis (éviter « Update cv.md », « Delete cv »).
