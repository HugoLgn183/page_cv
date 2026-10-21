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
    ├── index.html     Le site : HTML, CSS et JavaScript dans un seul fichier
    └── cv.md          Contenu du CV au format texte (source de référence)
```

## Technologies

- **HTML5 sémantique** : `header`, `main`, `nav`, `section`, `footer`, un seul `h1` et une hiérarchie `h2` / `h3`.
- **CSS3** sans framework : variables CSS, Flexbox, `clamp()`, media queries (mobile ≤ 640 px, impression).
- **JavaScript** natif, sans bibliothèque : ouverture et fermeture des livres.
- **GitHub Pages** pour l'hébergement.

Aucune image, police externe ou dépendance : la page entière pèse environ 50 Ko (13 Ko une fois compressée par GitHub Pages).

## Fonctionnalités

- **Décor entièrement en CSS** : étagères de livres en arrière-plan, bougie animée, rivets de la plaque, livre ouvert qui reprend la couleur du livre choisi avec son signet, icône gravée et chiffre romain pour chaque rubrique.
- **Responsive** : sur mobile, le livre ouvert n'affiche que la page de texte, en pleine largeur.
- **Accessibilité** :
  - navigation complète au clavier, lien d'évitement et focus visible ;
  - le livre ouvert se comporte comme une fenêtre modale : focus gardé à l'intérieur, fermeture avec Échap, retour sur le livre d'origine ;
  - contrastes vérifiés (au moins 4,5:1 pour le texte) ;
  - animations réduites si le système le demande (`prefers-reduced-motion`).
- **Fonctionne sans JavaScript** : tout le CV est écrit dans le HTML et s'affiche sous forme de page classique. C'est aussi ce que lisent les moteurs de recherche.
- **SEO** : titre et meta description adaptés, URL canonique, balises Open Graph pour l'aperçu lors d'un partage.
- **Export PDF** : le bouton « Exporter en PDF » imprime une version épurée du CV.

## Validation

| Outil | Résultat |
|---|---|
| [Validateur W3C](https://validator.w3.org/nu/?doc=https%3A%2F%2Fhugolgn183.github.io%2Fpage_cv%2Fcv-site%2F) | 0 erreur, 0 avertissement |
| Lighthouse mobile (Performance / Accessibilité / Bonnes pratiques / SEO) | 99 / 100 / 96 / 100 |
| Lighthouse ordinateur | 100 / 100 / 96 / 100 |

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
