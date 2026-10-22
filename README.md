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
    ├── extras.js      Petits plaisirs interactifs (lumière de la bougie, hibou, tampon, terminal…), chargés après la page
    ├── app.js         JavaScript du livre ouvert et du décor, chargé en defer
    ├── favicon.svg    Icône d'onglet (trois livres sur une étagère), 467 octets
    └── cv.md          Contenu du CV au format texte (source de référence)
```

## Technologies

- **HTML5 sémantique** : `header`, `main`, `nav`, `section`, `footer`, un seul `h1` et une hiérarchie `h2` / `h3`.
- **CSS3** sans framework : variables CSS, Flexbox, `clamp()`, animations 3D, media queries (mobile ≤ 640 px, impression).
- **JavaScript** natif, sans bibliothèque : ouverture des livres, sommaire, pages qui tournent, dessin de la bibliothèque du fond dans un `<canvas>`.
- **Polices système** à l'allure de livre (Palatino, Book Antiqua), sans téléchargement.
- **GitHub Pages** pour l'hébergement.

Aucune image, police externe ou dépendance. La page HTML pèse 42 Ko (11,5 Ko une fois compressée par GitHub Pages) et ne contient que ce qui sert au premier affichage. `app.js` (29 Ko, 9,4 Ko compressé) est chargé avec `defer`, et c'est lui qui charge ensuite `book.css` (12 Ko, 4 Ko compressé) ; `print.css` (3 Ko) n'est utilisé qu'à l'impression ; `extras.css` et `extras.js` (118 Ko, 35 Ko compressés) ne sont chargés qu'une fois la page entièrement affichée : aucun ne retarde le premier affichage.

## Fonctionnalités

- **Livre ouvert** :
  - sommaire des 7 chapitres sur la page de gauche, chaque ligne mène au chapitre ;
  - boutons « chapitre précédent / suivant » et flèches ← → du clavier, avec une page qui tourne en 3D ;
  - sur téléphone : glisser le doigt vers la gauche (chapitre suivant) ou vers la droite (chapitre précédent), ou utiliser les grandes flèches en bas de la page ;
  - couverture et signet de la couleur du livre choisi.
- **Décor** : bibliothèque complète en arrière-plan, dessinée une seule fois dans un `<canvas>` et volontairement floue (des étagères en CSS la remplacent sans JavaScript) ; plaque en métal brossé, pages au grain de papier, icône gravée et chiffre romain pour chaque rubrique.
- **Bougie interactive** : la flamme s'agite au survol et ploie sous le « souffle » de la souris quand celle-ci passe à proximité, puis oscille avant de se redresser ; on peut prendre la bougie (clic maintenu à la souris, appui long au doigt) et la déplacer dans toute la pièce, son halo lumineux avec elle, la flamme penchant selon le mouvement ; une fois lâchée, elle regagne d'elle-même sa place sur l'étagère. Un double-clic (ou deux touchers) la souffle dans un filet de fumée, et la rallume ; lumière éteinte et bougie soufflée, c'est le noir complet et le hibou s'en inquiète.
- **Explorer à la lueur de la bougie** : un interrupteur en laiton, sur la colonne de gauche, éteint la pièce ; seul le halo de la bougie éclaire encore, et en la promenant on découvre une cinquantaine de titres écrits à l'« encre secrète » sur la tranche de livres du fond, tous tirés du CV : compétences (Linux, Python, TCP/IP, Hack The Box…), formations (BTS SIO, STAPS, BNSSA…), expériences (CHU, Coach sportif, 21e RIMa, Transmissions…), permis et qualités. L'interrupteur s'utilise aussi au clavier, et les livres restent cliquables dans le noir.
- **Le hibou bibliothécaire** : perché sur la pile de livres (sur le livre « Contact » sur téléphone), il suit le pointeur des yeux, cligne de temps en temps et, quand on clique dessus, sautille et donne une astuce (livres, bougie, interrupteur, pages, tampon, export PDF ; sur téléphone tenu en portrait, il conseille aussi le mode paysage, qui ouvre le livre sur deux pages avec le sommaire), adaptée à la souris ou au doigt et annoncée aux lecteurs d'écran. Dans le noir, ses yeux brillent.
- **Le tampon « Bon pour un entretien »** : sur la page Contact du livre ouvert, un tampon encreur à apposer d'un clic (ou au clavier) ; l'empreinte rouge, un peu de travers et à l'encrage irrégulier, s'imprime dans le cadre « Réservé au recruteur » et reste mémorisée dans le navigateur du visiteur. Le tampon est daté de l'année en cours.
- **Les livres vivants** : les livres frémissent quand on les survole (ou qu'on y arrive au clavier), et de temps en temps l'un d'eux bouge tout seul ; à l'ouverture, un nuage de poussière s'échappe du livre, et un peu de poussière se soulève de l'étagère quand on le range. Rien de tout cela en mouvement réduit.
- **Le marque-page** : le dernier chapitre lu est retenu dans le navigateur du visiteur (rien n'est envoyé ailleurs, oublié au bout de 30 jours) ; un ruban doré dépasse alors du livre correspondant et, à la visite suivante, le hibou propose « Reprendre la lecture » ou « Non merci ». La proposition ne prend pas le focus, ne bloque rien et disparaît d'elle-même ; elle est annoncée aux lecteurs d'écran et ses boutons s'utilisent au clavier.
- **L'ambiance selon l'heure** : la pièce suit l'horloge du visiteur. Le jour, un rai de soleil tombe d'une fenêtre sur la bibliothèque de gauche, avec l'ombre des croisillons et de la poussière qui danse dans la lumière ; à l'aube (6 h – 8 h) et le soir (18 h – 21 h), il est plus bas et orangé ; la nuit (21 h – 6 h), la pièce s'assombrit, les appliques baissent et seule la bougie éclaire autour d'elle, même quand on la déplace (le hibou dit alors « Bonsoir »). Ce décor passe sous la plaque et les livres : leurs contrastes ne changent jamais. L'interrupteur garde le dernier mot.
- **La pendule** : en haut à droite, une petite pendule en laiton (avec son balancier) donne l'heure réelle du visiteur. Chaque clic, toucher ou appui sur Entrée l'avance à la période suivante (aube 7 h, jour 12 h, soir 19 h, nuit 23 h) et l'ambiance suit, aiguilles comprises ; un tour complet la remet à l'heure. Rien n'est mémorisé : à chaque visite, elle est de nouveau à l'heure. Petit tintement si les sons sont activés.
- **La fenêtre** : une haute fenêtre en arc, à petits carreaux, entre la colonne de gauche et la plaque. Elle est encastrée dans un pan de mur en pierre qui remplace une travée de la bibliothèque du fond, entre deux montants, et domine une planche de livres. Son ciel suit l'heure (et la pendule) : bleu avec des nuages qui passent le jour, rose et doré à l'aube, violet et orangé avec le soleil couchant le soir, bleu nuit avec la lune et des étoiles qui scintillent la nuit. Le rai de soleil part d'elle. Elle se place d'elle-même dans l'espace libre et disparaît quand la place manque (téléphone, tablette en portrait).
- **Les souvenirs du parcours** : trois objets posés sur l'étagère racontent le parcours avant même d'ouvrir un livre : un haltère (« Ancien coach sportif ») et un béret bleu marine à l'ancre dorée des troupes de marine (« Ancien militaire ») à gauche de la bougie, un ordinateur portable ouvert sur un terminal au curseur clignotant, branché à un câble réseau (« Alternant - technicien informatique »), à droite des livres couchés. Au survol, ou d'un toucher, l'étiquette s'affiche au-dessus de l'objet. Les objets sont dessinés avec leurs matières (caoutchouc et chrome moleté, laine et cuir cousu, aluminium et touches), leurs reflets et leur ombre sur l'étagère. Ils se placent d'eux-mêmes dans la place libre et sont masqués quand elle manque (téléphone, tablette).
- **Profondeur et reflets** : à la souris, le fond (bibliothèque, fenêtre, rai de soleil, appliques) glisse légèrement à l'opposé du pointeur, ce qui le fait paraître plus loin que la plaque et l'étagère. Un reflet de lumière glisse sur la plaque en laiton en suivant la souris (au doigt, il la traverse de temps en temps), et un reflet parcourt la tranche dorée du livre survolé. Le reflet de la plaque passe sous le texte : les contrastes ne changent pas. Rien de tout cela en mouvement réduit.
- **Le sol et le buffet** : un parquet en perspective part du pied de la bibliothèque du fond, avec une plinthe ; l'étagère ne flotte plus : elle repose sur un buffet bas en bois à grands tiroirs (poignées en laiton, socle), posé sur un tapis rouge à bordure dorée, médaillon et franges. Le tout se redessine à chaque taille d'écran, comble le vide sous l'étagère sur téléphone, et les mots secrets ne se posent plus sur les livres cachés par le sol.
- **La plaque suspendue** : la plaque en laiton est fixée par ses rivets sur un panneau de bois sculpté, suspendu au plafond par deux chaînes en laiton (platines au plafond, pitons dans le panneau) ; l'ombre du panneau tombe sur la bibliothèque du fond. Ajouté après l'affichage, sans déplacer ni redimensionner la plaque.
- **Les sons discrets** : coupés par défaut ; un bouton rond en laiton (colonne de droite, sous l'étagère sur téléphone) les active, et le choix est retenu dans le navigateur. Couverture qui se referme, pages qui tournent, hululement du hibou, coup de tampon, déclic de l'interrupteur, bougie qu'on souffle ou qu'on rallume, léger crépitement de la flamme. Tous les sons sont fabriqués par le navigateur (Web Audio API) : aucun fichier audio à télécharger. Rien ne joue avant un geste du visiteur.
- **Le mode terminal secret** : taper « sudo » au clavier (ou le code Konami), ou toucher 5 fois le hibou sur téléphone, ouvre un terminal vert sur noir façon vieux moniteur. Commandes `help`, `ls`, `cat <fichier>` (les rubriques du CV, lues directement dans la page), `whoami`, `neofetch`, `date`, `history`, `clear`, `exit` ; historique avec ↑ ↓, complétion avec Tab, et quelques commandes cachées (`sudo`, `rm`, `cd`).
- **Responsive** : sur téléphone en portrait, le livre ouvert n'affiche que la page de texte, en pleine largeur et sur toute la hauteur visible ; en paysage, il affiche les deux pages dans une version compacte, comme sur ordinateur.
- **Accessibilité** :
  - navigation complète au clavier, lien d'évitement et focus visible ;
  - le livre ouvert se comporte comme une fenêtre modale : focus gardé à l'intérieur, fermeture avec Échap, retour sur le livre du chapitre affiché ;
  - changement de chapitre annoncé aux lecteurs d'écran ;
  - contrastes vérifiés (au moins 4,5:1 pour le texte) ;
  - animations réduites si le système le demande (`prefers-reduced-motion`) ;
  - sons coupés par défaut, bouton « Sons » utilisable au clavier et annoncé (`aria-pressed`).
- **Fonctionne sans JavaScript** : tout le CV est écrit dans le HTML et s'affiche sous forme de page classique. C'est aussi ce que lisent les moteurs de recherche.
- **SEO** : titre et meta description adaptés, URL canonique, balises Open Graph pour l'aperçu lors d'un partage.
- **Export PDF** : le bouton « Exporter en PDF » produit un CV classique sur une seule page A4 : en-tête avec le nom, la présentation et le contact, puis deux colonnes (profil, compétences, langues et permis à gauche ; expériences et formations à droite), sans le décor du site, avec le lien GitHub écrit en clair et le tampon « Bon pour un entretien » en bas de la colonne de gauche.

## Validation

| Outil | Résultat |
|---|---|
| [Validateur W3C](https://validator.w3.org/nu/?doc=https%3A%2F%2Fhugolgn183.github.io%2Fpage_cv%2Fcv-site%2F) | 0 erreur, 0 avertissement |
| Lighthouse mobile (Performance / Accessibilité / Bonnes pratiques / SEO) | 98 / 100 / 100 / 100 |
| Lighthouse ordinateur | 100 / 100 / 100 / 100 |

Scores Lighthouse : médiane de 3 mesures sur le site en ligne, avec les « petits plaisirs » 1 à 9 et l'icône d'onglet (22/10/2026). Sans icône, « Bonnes pratiques » tombait à 96 (`favicon.ico` introuvable, erreur 404).

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
