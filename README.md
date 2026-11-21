# info

je dois decouper et graver des ellipses en recto verso sur une machine de decoupe laser.
Je vais donc réaliser une premiere étape de gravure au verso avec les inscriptions ".onscri[e] [nom de famille] devenu".
Et ensuite après avoir retourné la planche de mdf je réalise la 2 eme face en gravure puis les decoupes individuelles d'ellipse.

# ellipse

l'ellipse fait 6x9cm et suit l'exemple données par les 2 images dans ./example
le recto contient "".onscri[e] [nom de famille] devenu"
le verso contient 2 amtrad's et la buque.
les ecritures doivent etre en clun'sois

# regle de gravure

le fichier de gravure est un .svg
le rouge est une découpe et le noir est une gravure
il faut que tu place des marqueurs de références qui me serviront a alligné la planche a l'aide du laser pour la 2eme découpe.
je peux positionner le travail a partir l'emplacement du laser.

# appli

l'appli doit etre simple a utiliser,
prend en entrée un tableau excel ou csv qui contient une collone "genre", "nom", "buque"
les dimensions des plaques pour gravées sont paramétrables
je dois pouvoir prévisualiser les fichiers et les exporter en .svg
ca doit etre une simple appli web utilisable sur github.io
