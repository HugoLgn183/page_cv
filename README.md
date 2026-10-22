# CV web — Hugo Largeron

CV en ligne réalisé dans le cadre du BTS SIO SISR (CFAI de Saint-Étienne) : une page HTML statique publiée sur GitHub Pages.

**Voir le site : <https://hugolgn183.github.io/page_cv/cv-site/>**

Le CV est présenté comme une bibliothèque ancienne : chaque rubrique (Profil, Parcours, Compétences, Formations, Langues, Permis, Contact) est un livre posé sur une étagère, qui s'ouvre au clic.

## Structure du dépôt

```text
page_cv/
├── README.md          Présentation du projet (ce fichier)
├── AUTOEVALUATION.md  Résultats des outils, journal des corrections, auto-évaluation
└── cv-site/
    ├── index.html     Le site : HTML et CSS du premier affichage (tout le contenu du CV est ici)
    ├── book.css       Styles du livre ouvert, chargés après l'affichage
    ├── print.css      Mise en page de l'export PDF (CV d'une page)
    ├── extras.css     Styles des petits plaisirs interactifs, chargés après la page
    ├── extras.js      Petits plaisirs interactifs (lumière de la bougie…), chargés après la page
    ├── app.js         JavaScript du livre ouvert et du décor, chargé en defer
    └── cv.md          Contenu du CV au format texte (source de référence)
```

## Technologies

- **HTML5 sémantique** : `header`, `main`, `nav`, `section`, `footer`, un seul `h1` et une hiérarchie `h2` / `h3`.
- **CSS3** sans framework : variables CSS, Flexbox, `clamp()`, animations 3D, media queries (mobile ≤ 640 px, impression).
- **JavaScript** natif, sans bibliothèque : ouverture des livres, sommaire, pages qui tournent, dessin de la bibliothèque du fond dans un `<canvas>`.
- **Polices système** à l'allure de livre (Palatino, Book Antiqua), sans téléchargement.
- **GitHub Pages** pour l'hébergement.

Aucune image, police externe ou dépendance. La page HTML pèse 42 Ko (11,4 Ko une fois compressée par GitHub Pages) et ne contient que ce qui sert au premier affichage. `app.js` (27 Ko, 8,6 Ko compressé) est chargé avec `defer`, et c'est lui qui charge ensuite `book.css` (12 Ko, 4 Ko compressé) ; `print.css` (3 Ko) n'est utilisé qu'à l'impression ; `extras.css` et `extras.js` (6 Ko, moins de 3 Ko compressés) ne sont chargés qu'une fois la page entièrement affichée : aucun ne retarde le premier affichage.

## Fonctionnalités

- **Livre ouvert** :
  - sommaire des 7 chapitres sur la page de gauche, chaque ligne mène au chapitre ;
  - boutons « chapitre précédent / suivant » et flèches ← → du clavier, avec une page qui tourne en 3D ;
  - sur téléphone : glisser le doigt vers la gauche (chapitre suivant) ou vers la droite (chapitre précédent), ou utiliser les grandes flèches en bas de la page ;
  - couverture et signet de la couleur du livre choisi.
- **Décor** : bibliothèque complète en arrière-plan, dessinée une seule fois dans un `<canvas>` et volontairement floue (des étagères en CSS la remplacent sans JavaScript) ; plaque en métal brossé, pages au grain de papier, icône gravée et chiffre romain pour chaque rubrique.
- **Bougie interactive** : la flamme s'agite au survol et ploie sous le « souffle » de la souris quand celle-ci passe à proximité, puis oscille avant de se redresser ; on peut prendre la bougie (clic maintenu à la souris, appui long au doigt) et la déplacer dans toute la pièce, son halo lumineux avec elle, la flamme penchant selon le mouvement ; une fois lâchée, elle regagne d'elle-même sa place sur l'étagère.
- **Explorer à la lueur de la bougie** : un interrupteur en laiton, sur la colonne de gauche, éteint la pièce ; seul le halo de la bougie éclaire encore, et en la promenant on découvre des titres écrits à l'« encre secrète » sur les étagères du fond (Linux, Python, Bash, TCP/IP, Hack The Box, BNSSA…). L'interrupteur s'utilise aussi au clavier, et les livres restent cliquables dans le noir.
- **Responsive** : sur téléphone en portrait, le livre ouvert n'affiche que la page de texte, en pleine largeur et sur toute la hauteur visible ; en paysage, il affiche les deux pages dans une version compacte, comme sur ordinateur.
- **Accessibilité** :
  - navigation complète au clavier, lien d'évitement et focus visible ;
  - le livre ouvert se comporte comme une fenêtre modale : focus gardé à l'intérieur, fermeture avec Échap, retour sur le livre du chapitre affiché ;
  - changement de chapitre annoncé aux lecteurs d'écran ;
  - contrastes vérifiés (au moins 4,5:1 pour le texte) ;
  - animations réduites si le système le demande (`prefers-reduced-motion`).
- **Fonctionne sans JavaScript** : tout le CV est écrit dans le HTML et s'affiche sous forme de page classique. C'est aussi ce que lisent les moteurs de recherche.
- **SEO** : titre et meta description adaptés, URL canonique, balises Open Graph pour l'aperçu lors d'un partage.
- **Export PDF** : le bouton « Exporter en PDF » produit un CV classique sur une seule page A4 : en-tête avec le nom, la présentation et le contact, puis deux colonnes (profil, compétences, langues et permis à gauche ; expériences et formations à droite), sans le décor du site, avec le lien GitHub écrit en clair.

## Validation

| Outil | Résultat |
|---|---|
| [Validateur W3C](https://validator.w3.org/nu/?doc=https%3A%2F%2Fhugolgn183.github.io%2Fpage_cv%2Fcv-site%2F) | 0 erreur, 0 avertissement |
| Lighthouse mobile (Performance / Accessibilité / Bonnes pratiques / SEO) | 98 / 100 / 100 / 100 |
| Lighthouse ordinateur | 100 / 100 / 100 / 100 |

Scores Lighthouse : médiane de 3 mesures sur le site en ligne (22/10/2026).

Le détail des mesures, le journal des corrections de la V1 à la version finale et l'auto-évaluation sont dans [AUTOEVALUATION.md](AUTOEVALUATION.md).

## Consulter le site en local

Ouvrir `cv-site/index.html` dans un navigateur suffit. Pour le servir comme sur GitHub Pages :

```bash
python -m http.server 8000 --directory cv-site
```

Puis aller sur <http://localhost:8000>.

## Confidentialité

Conformément aux consignes du projet, le CV ne contient ni adresse postale, ni e-mail, ni numéro de téléphone réels (ils sont masqués).

## Contact

Via mon profil GitHub : [HugoLgn183](https://github.com/HugoLgn183)
