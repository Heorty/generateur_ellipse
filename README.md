# objectif

une app qui permet de créer rapidement des ellipses de demande pour les différents locaux associatif.

Il faut pouvoir répartir par ordre de fam'ss les différents zidents des locaux.
Quand on bouge les elements a la main, on doit pouvoir facilement les allignés entre eux pour que ce soit au maximum symmétrique

L'application doit donc etre paramètrable :
-texte du haut
-logo central
-texte du bas
-liste des zidents (buque +fam'ss + police de buque + police de fam'ss/logo de fam'ss)
-couelur de texte

la police par défaut est le clun'sois
les polices sont souvent telechargeable depuis dafont ou google font
propose aussi comme police le zagoth

l'application doit etre ergonomique, donc chaques elements sur l'ellipse doit etre clicable et donc modifiable

# type d'appli

application web, simple a utiliser
deployable sur gihub.io

l'export doit etre possible en pdf, pptx

https://github.com/Heorty/generateur_ellipse.git

# exemple

./ellipse 2.26\_[nomboquette]

# vocabulaire

zident = responsable d'un local
buque = surnom
fam'ss = numéro de parainage (ex : 151, 127, 15-106)
a.i. = p.s.

# Utilisation de l'application web

Ouvrir `index.html` directement dans un navigateur web (ou déployer directement sur **GitHub Pages / `github.io`** — aucun build requis).

- **Zidents** : ajout individuel ou import rapide en masse (`Buque Fam'ss`), tri automatique par `fam'ss`, réordonnancement `↑`/`↓`, couleur et polices personnalisables par zident, logo de fam'ss, et déplacement par glisser-déposer avec **guides d'alignement et de symétrie**.
- **Édition directe** : chaque élément sur l'ellipse (textes courbés, logo central, zidents, cotes, note `.ai`) est cliquable pour accéder immédiatement à sa modification.
- **Polices** : `Clunsois` par défaut, `Zagoth` proposé, import de polices locales ou archives `.zip` depuis DaFont, ou chargement direct de Google Fonts.
- **Exports** : SVG vectoriel (pour Illustrator / `.ai`), PowerPoint (`.pptx` éditable), PNG haute résolution (`2560×1440`), PDF / impression, et sauvegarde/chargement de projet `.json`.
