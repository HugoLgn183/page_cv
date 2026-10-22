# Auto-évaluation — CV web

Projet : CV web statique publié sur GitHub Pages — <https://hugolgn183.github.io/page_cv/cv-site/>
Auteur : Hugo Largeron — BTS SIO SISR, CFAI de Saint-Étienne
Mesures réalisées le 22/10/2026 sur la version en ligne (bougie déplaçable, HTML allégé).

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
| Lighthouse — Performance | 98 | 100 |
| Lighthouse — Accessibilité | 100 | 100 |
| Lighthouse — Bonnes pratiques | 100 | 100 |
| Lighthouse — SEO | 100 | 100 |
| Outiref (structure des titres) | *à compléter* | — |

Lighthouse est le moteur d'analyse de PageSpeed Insights. Il a été lancé en local (Lighthouse 12.6.1) car l'API PageSpeed était saturée. Chaque score est la médiane de 3 mesures.

**Indicateurs mobile (médiane) :** affichage du premier contenu en 1,7 s, du plus grand élément en 2,0 s, temps de blocage 82 ms, aucun décalage de mise en page (CLS = 0). Avant les ajouts du 21/10 (sommaire, fond en canvas, textures), ces valeurs étaient de 1,5 s, 1,6 s et 0 ms, pour un score de 99.

**Poids :** une page HTML de 42 Ko (11,4 Ko compressée par GitHub Pages), un script `app.js` de 27 Ko (8,6 Ko compressé) chargé en `defer`, une feuille `book.css` de 12 Ko (3,8 Ko compressée) chargée par ce script après l'affichage une feuille `print.css` de 3 Ko réservée à l'impression, et les fichiers `extras.css` / `extras.js` (18 Ko, 7 Ko compressés) chargés une fois la page entièrement affichée, sans image, police externe ni bibliothèque.

**Remarques sur les mesures :**
- Les scores varient d'une mesure à l'autre : sur mobile, la performance va de 73 à 99, la première mesure (navigateur de test démarré à froid) étant toujours la plus basse. Lors de cette première visite, « Bonnes pratiques » tombe aussi à 96 à cause d'une erreur 404 sur `favicon.ico` (le site n'a pas d'icône d'onglet).
- Avant l'allègement du HTML, la page transitait en 14,5 à 14,8 Ko, juste à la limite d'environ 14 Ko qu'un serveur envoie lors du premier aller-retour réseau, et le premier affichage médian sur mobile était de 1,9 s (score 97). Depuis, elle transite en 12,3 à 12,6 Ko (voir le journal).
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
| 21/10 | Étagères du fond peu réalistes (bandes répétitives, blocs sombres) | Livres simulés par des dégradés CSS répétés | Bibliothèque complète dessinée une seule fois en JavaScript dans un `<canvas>` (montants, planches, livres de tailles et couleurs variées, livres penchés), floutée pour donner de la profondeur ; les étagères CSS restent affichées sans JavaScript | Dessin lancé après l'affichage de la page ; avec les autres ajouts de cette série, Performance mobile 99 → 96 (voir ci-dessus) |
| 21/10 | Pour changer de chapitre, il fallait refermer le livre | Aucune navigation dans le livre ouvert | Boutons « chapitre précédent / suivant », flèches ← → du clavier, page qui tourne en 3D (glissement sur mobile, changement instantané en mouvement réduit) | Testé : clavier, focus conservé, fermeture pendant l'animation, aucun identifiant en double |
| 21/10 | Page de gauche encore peu utile | Elle ne montrait que le numéro et l'icône du chapitre | Sommaire cliquable des 7 chapitres, chapitre en cours mis en avant | Accès direct à chaque chapitre ; contraste du sommaire ≥ 5,4:1 |
| 21/10 | Rendu « application » plutôt que « livre ancien » | Polices Segoe UI et Georgia, papier et plaque en aplats | Palatino et petites capitales, grain de papier, métal brossé sur la plaque, sans police ni image à télécharger | Page 50 → 66 Ko (18 Ko compressée) |
| 21/10 | Premier affichage plus lent sur mobile (Lighthouse 99 → 96 en ligne) | Page compressée passée de 14,5 à 18 Ko, au-delà de ce que le serveur envoie dans le premier aller-retour réseau (environ 14 Ko). Tests à l'appui : ni le canvas ni les filtres CSS n'étaient en cause | JavaScript déplacé dans `app.js`, chargé en `defer` ; la page HTML compressée tombe à 13 Ko. Rendu et comportement identiques | Mesure locale, 4G simulée (médiane de 3) : premier affichage 1 219 → 1 136 ms, plus rapide que la version précédente (1 170 ms). En ligne : médiane mobile 97 |
| 22/10 | Bougie purement décorative, et absente sur mobile | Décor figé, masqué faute de place sous 640 px | Flamme agitée au survol ; bougie qu'on prend au clic maintenu (souris) ou à l'appui long de 0,4 s (doigt) et qu'on déplace dans toute la pièce, halo compris, la flamme penchant selon le mouvement ; affichée sur mobile en resserrant un peu les livres | Testé avec de vrais événements souris et tactiles : appui court ignoré, pas de défilement parasite, livres toujours cliquables ; page HTML toujours sous 14 Ko compressée |
| 22/10 | Pendant les tests, bougie inerte puis qui ne suivait pas le pointeur | La rangée de livres la recouvrait ; en sortant la bougie de l'étagère, le navigateur perdait le pointeur | Bougie placée au premier plan ; mouvements écoutés sur toute la fenêtre pendant le déplacement | Survol, prise, déplacement et dépôt fonctionnent à la souris comme au doigt |
| 22/10 | Page HTML compressée juste à la limite d'environ 14 Ko (13,7 Ko) | Les styles du livre ouvert étaient dans la page, alors qu'ils ne servent qu'après un clic | Styles du livre ouvert déplacés dans `book.css`, chargé par `app.js` après l'affichage (la lettrine, utilisée aussi sans JavaScript, reste dans la page) ; si l'on clique avant son arrivée, le livre attend ses styles | HTML compressé 13,7 → 11,5 Ko. Styles calculés identiques avant/après sur 330 à 450 éléments (accueil, livres ouverts, mobile). Mesure locale, 4G simulée (médiane de 3) : premier affichage 1 256 → 1 205 ms, blocage 22 → 0 ms. En ligne : premier affichage médian sur mobile 1,9 → 1,7 s, performance 97 → 98 |
| 22/10 | La bougie restait là où on la lâchait | Aucun retour prévu après le déplacement | Lâchée, la bougie regagne sa place sur l'étagère en 0,6 s (instantanément en mouvement réduit), la flamme ployant pendant le trajet ; on peut la rattraper en route | Testé à la souris et au doigt : retour au pixel près ; rattrapage sans saut |
| 22/10 | Sur téléphone, contenu du livre tronqué ou page blanche ; en paysage, presque rien de lisible | Hauteur du livre en `vh` : avec la barre d'adresse visible, le bas (et les boutons) passait sous l'interface du navigateur. Pages placées dans un conteneur 3D, que Safari affiche mal quand elles défilent ; couvertures retournées restées présentes. En paysage, livre réduit à 72 % d'une hauteur d'environ 390 px et boutons trop longs, passés sur deux lignes | Livre à 100 % de la hauteur réellement visible ; conteneur 3D retiré et couvertures masquées une fois le livre ouvert ; en paysage, deux pages en version compacte (sommaire resserré, marges réduites) ; sur téléphone, grandes flèches et numéro du chapitre en bas de la page | Contrôle automatique des 7 livres sur 6 tailles d'écran (dont un iPhone avec ses barres) : flèches et texte visibles partout. Hauteur de texte : 360×640 448 → 527 px ; paysage 844×390 179–200 → 301 px, sommaire entier ; rendu sur ordinateur inchangé |
| 22/10 | Sur téléphone, il fallait viser les boutons pour changer de chapitre | Aucun geste tactile prévu | Glisser le doigt vers la gauche (chapitre suivant) ou vers la droite (chapitre précédent) ; le défilement vertical du texte reste possible | Testé avec de vrais gestes tactiles en portrait et en paysage : II → III → IV → III ; défilement vertical et petits gestes sans effet sur la page |
| 22/10 | L'export PDF n'était qu'une copie des pages des livres, sur 4 pages | Rubriques imprimées telles quelles, avec leurs titres de chapitre et le décor des pages | Mise en page d'impression dédiée dans `print.css` : en-tête (nom, présentation et contact), deux colonnes, sans décor ni lettrine, lien GitHub écrit en clair, lignes masquées par des astérisques retirées. Au moment d'imprimer, `app.js` place le contact dans l'en-tête et range les autres rubriques dans les deux colonnes, puis remet tout en place | Export PDF réel du navigateur : 1 page A4 au lieu de 4, tout le contenu présent ; rubriques remises dans l'ordre après impression ; sans JavaScript, version sobre en une colonne sur 2 pages ; HTML compressé inchangé (11,4 Ko) |
| 22/10 | Flamme peu vivante : elle ne réagissait qu'au survol | Animation fixe, indépendante des mouvements de la souris | « Souffle » de la souris : à moins de 170 px, la souris fait ployer la flamme dans le sens de son mouvement, d'autant plus qu'elle est proche et rapide, puis la flamme oscille et se redresse (petit ressort amorti en JavaScript). Même mécanisme quand on déplace la bougie. Désactivé en mouvement réduit | Testé avec de vrais mouvements de souris : aucun effet quand la souris passe loin, inclinaison jusqu'à environ 15 à 18° près de la flamme, retour au repos en environ 1 s |
| 22/10 | Site joli mais peu de choses à découvrir | Décor uniquement contemplatif | Idée 1 des « petits plaisirs » : interrupteur qui éteint la pièce, obscurité percée par le halo de la bougie (qui le suit quand on la déplace), titres à l'encre secrète révélés seulement près de la flamme et écrits sur la tranche de vrais livres du fond (positions relevées pendant le dessin de la bibliothèque, en évitant tout ce qui les cache). Code séparé dans `extras.css` / `extras.js`, chargés après la page | Testé à la souris, au doigt et au clavier (Entrée sur l'interrupteur) ; livres cliquables dans le noir ; mouvement réduit sans scintillement ; export PDF inchangé (1 page, rien de ce décor) ; 2,8 Ko compressés chargés après l'affichage. Titres : 50 mots tirés du CV (compétences, formations, expériences, permis, qualités) ; tous posés sur une tranche visible sur ordinateur et tablette en portrait, 37 sur tablette en paysage, 29 sur téléphone en paysage, 6 à 26 en portrait selon la taille ; aucun hors d'un livre ni caché |
| 22/10 | Mots cachés mal alignés sur les livres sur mobile | Le dessin de la bibliothèque du fond était étiré quand la hauteur visible changeait un peu (barre d'adresse du téléphone), alors que les mots gardaient leur position ; les mots devaient aussi être centrés sur une tranche entièrement visible, rare sur petit écran | Dessin affiché à sa taille exacte (jamais étiré) ; obstacles recalculés à chaque redimensionnement ; chaque mot placé sur la plus grande portion visible de sa tranche | Après apparition de la barre d'adresse : étirement 0,934 → 1,000. Sur 9 tailles d'écran : aucun mot hors d'un livre ni caché ; téléphone en portrait : 0 à 3 → 6 à 26 mots placés |
| 22/10 | Fonctions cachées (bougie, interrupteur, glissement) difficiles à découvrir | Aucune aide dans la page | Idée 2 : un hibou bibliothécaire (SVG) perché sur la pile de livres ; ses yeux suivent le pointeur, il cligne, et donne au clic une astuce adaptée à la souris ou au doigt, annoncée aux lecteurs d'écran ; il se présente une fois à l'arrivée ; yeux brillants dans le noir. Au passage, l'interrupteur et le hibou sont désormais rendus inertes quand un livre est ouvert | Testé à la souris, au doigt et au clavier : perché au pixel près (pile ou livre « Contact »), astuces qui défilent, aucun mot secret sous le hibou, inerte pendant la lecture ; export PDF inchangé |

## 4. Analyse

- **D'où venaient la plupart des problèmes :** j'ai d'abord travaillé l'apparence (le décor de bibliothèque), puis vérifié le reste. Les couleurs dorées ont été choisies à l'œil, d'où les contrastes insuffisants. Le contenu rangé dans des `<template>` facilitait le JavaScript mais rendait le CV invisible pour les moteurs de recherche.
- **Ce qui a bien fonctionné :** le choix de fichiers légers sans dépendance donne de très bonnes performances (96 à 100) sans effort particulier. Le HTML a été valide dès la V1. Les décors et la navigation ajoutés en dernier (étagères, bougie, sommaire, pages qui tournent) n'utilisent ni image ni bibliothèque : le site passe de 42 à 72 Ko (HTML et script). La performance est restée à 100 sur ordinateur mais a baissé un peu sur mobile (99 → 96). En comparant plusieurs variantes de la page, la cause s'est révélée être le poids compressé du HTML (au-delà d'environ 14 Ko) et non le décor : sortir le JavaScript dans un fichier chargé en `defer` a suffi à corriger le problème sans rien changer au rendu. Le fond en `<canvas>` est dessiné une seule fois, après l'affichage, pour ne pas ralentir le chargement.
- **Ce que j'en retiens :** vérifier les contrastes et tester au clavier et sur mobile dès le début, et non à la fin. Garder le contenu dans le HTML et réserver le JavaScript à l'animation (amélioration progressive).

## 5. Auto-évaluation selon la grille

| Critère | Note (0–4) | Coef | Pondéré | Justification |
|---|---:|---:|---:|---|
| C1 Contenu | 3 | 10 | 30 | Clair, cohérent, objectif indiqué ; pas encore de réalisations chiffrées |
| C2 HTML sémantique | 3 | 10 | 30 | Un seul `h1`, hiérarchie `h2`/`h3`, balises structurelles ; le `footer` est encore dans le `main` |
| C3 Responsive | 4 | 15 | 60 | Pas de défilement horizontal, une page pleine hauteur en portrait et deux pages en paysage sur téléphone, glissement du doigt pour tourner les pages, typographie fluide |
| C4 UX & accessibilité | 4 | 15 | 60 | Lighthouse 100, contrastes ≥ 4,5:1, navigation clavier complète, mouvement réduit |
| C5 SEO | 4 | 10 | 40 | Lighthouse 100, titre et description pertinents, contenu indexable |
| C6 Performance | 4 | 10 | 40 | Lighthouse 98 (mobile) et 100 (ordinateur) en médiane, HTML de 11,5 Ko compressé, styles du livre et script chargés après l'affichage, aucune dépendance |
| C7 Validation & corrections | 3 | 10 | 30 | W3C sans erreur, Lighthouse, journal ci-dessus ; Outiref reste à passer |
| C8 Publication | 4 | 5 | 20 | En ligne, testé sur mobile, corrigé après publication |
| C9 Auto-évaluation | 4 | 5 | 20 | Résultats, causes et impact mesuré (ce document) |
| C10 Confidentialité | 3 | 5 | 15 | Aucune donnée personnelle réelle, contact par GitHub |
| C11 Qualité du dépôt | 3 | 5 | 15 | Arborescence claire, README ; certains messages de commit peu précis |
| **Total** | | **100** | **360 / 400** | **Note estimée : 18 / 20** |

Calcul : 360 / (4 × 100) × 20 = 18.

## 6. Pistes d'amélioration restantes

- Vérifier le livre sur un vrai iPhone (Safari) : les corrections visent des défauts connus de Safari, mais n'ont été testées qu'en émulation dans Edge.
- Permettre de déplacer la bougie au clavier (aujourd'hui, cet élément décoratif ne se manipule qu'à la souris ou au doigt).
- Ajouter une icône d'onglet (favicon) pour supprimer l'erreur 404 et atteindre 100 en « Bonnes pratiques » sur mobile.
- Passer Outiref et compléter le tableau des résultats.
- Placer le `footer` en dehors du `main`.
- Ajouter des réalisations chiffrées dans le parcours et les compétences.
- Écrire des messages de commit plus précis (éviter « Update cv.md », « Delete cv »).
