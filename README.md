# ILOG2019
IHM de clé USB "Ilog".

L'arborescence en racine de ce repository GitHub représente la racine de la clé USB que vous pourrez utiliser pour travailler :
* sur différents modules
* sur différents ordinateurs et différents systèmes d'exploitation (Windows, Linux)
* sur différents workspaces (contexte multi-utilisateurs)
* en restant toujours sur la clé USB sans jamais modifier le système hôte

## Utilisation

### Prérequis
L'arborescence en racine de ce repository GitHub représente la racine de la clé USB.
En revanche, un simple clonage ne suffira pas pour l'utiliser correctement.
Il faudra à minima :
* posséder une archive de Java Runtime Environment (peu importe votre OS)

### Installation
* Cloner le projet
* Copier son contenu sur une clé USB préalablement formatée
* Placer votre archive de JRE décompressée dans l'un des répertoires prévus pour les outils (à savoir tools pour les outils 32bits et tools64 pour les outils 64bits)

En fonction de votre OS, il faudra ensuite ajouter le bin de votre JRE à la variable PATH :
* Sur Linux : modifier le script run.sh
Exemple avec le JRE 9.0.4 sous Linux 64 bits : > export PATH=$PATH:${PWD}/bin:${PWD}/tools64/jre-9.0.4_linux-x64/bin
* Sur Windows : modifier le script run.bat
Exemple (avec %~dp0 représentant le répertoire courant) : > set PATH=%~dp0bin;%~dp0tools64\jre\bin

Pour lancer l'application, il ne vous restera plus qu'à :
* Sur Linux : exécuter le script run.sh (au moyen de la commande bash)
* Sur Windows : double-cliquer sur le raccourci run.exe

Par la suite, il est possible, en fonction des paramètres de votre système d'exploitation, que le programme se lance automatiquement au branchement de la clé USB.
Cela est rendu possible par la présence d'un fichier autorun.inf à la racine de la clé spécifiant une action à réaliser à l'ouverture, ainsi qu'un titre et un logo.
Cependant, sur les systèmes d'exploitation les plus récents, les paramètres par défaut bloquent ce type de mécanismes (autoplay/autorun) pour des raisons de sécurité.

### Configuration
Pour configurer différents outils comme vu précédemment avec le JRE, vous pouvez utiliser les répertoires
* bin
* tools
* tools64

Le dossier scripts est un répertoire accueillant différents scripts js pouvant être intégrés à l'application, veuillez vous référer à la documentation développeur si vous souhaitez en savoir plus sur le développement de nouveaux scripts

Le dossier users est un répertoire accueillant des sous-dossiers représentant chaque utilisateur de la clé, si besoin, chacun ayant son propre workspace et ses propres projets (l'utilisateur par défaut étant "user")

Par défaut, l'application d'explorer démarre sur la racine de la clé, afin de permettre à l'utilisateur d'avoir accès aux différents répertoires de la clé.
Cependant, si vous souhaitez changer ce répertoire de lancement par défaut, vous pouvez le faire au moyen du fichier explorer.properties, en modifiant la variable rootPath.
Exemple (pour une exploration à partir du dossier users) : > rootPath=./users/
En commentant simplement la ligne pour qu'elle ne soit plus effective, l'exploration s'effectuera à partir de la racine du disque dur de l'ordinateur hôte.
Exemple (pour une exploration à partir du disque dur hôte) : > #rootPath=./

### Mode d'emploi
Une fois l'application lancée avec run.exe (si vous êtes sous Windows) ou run.sh (si vous êtes sur Linux), vous pourrez choisir de continuer en tant qu'utilisateur par défaut (user) ou en tant qu'utilisateur custom.
Si vous choisissez d'être utilisateur custom, renseignez un pseudo et cliquez sur "Continuer". Un répertoire utilisateur et un workspace seront automatiquement créés s'ils ne l'étaient pas déjà.
Vous pouvez ensuite utiliser l'explorateur et lancer par exemple un de vos outils présents dans le répertoire bin (comme Eclipse ou Netbeans) pour commencer à travailler et utiliser votre propre workspace.
L'intérêt de travailler sur la clé USB est de pouvoir bouger facilement son outil de travail sans se soucier ni de l'ordinateur sur lequel brancher la clé ni sur son système d'exploitation.
La clé USB devient en quelque sorte un "ordinateur de travail portable".

## Développement
Si vous souhaitez effectuer du développement pour améliorer l'application ou corriger certains bugs, sachez que le code source du projet "FileExplorer" est disponible dans le workspace de l'utilisateur par défaut "user".

### Outils à installer
Il n'y a aucun outil à installer si vous possédez l'archive ilog.zip disponible sur whippet.
Vous trouverez dans celle-ci les différents outils dont vous aurez besoin pour développer (le logiciel eclipse, le jdk, le jre, les jars des bibliothèques etc).

### Config environnement de développement
Pour ouvrir le projet et être capable de le lancer ou le débugger :
* Ouvrir Eclipse
* File > Open Project from File System...
* Choisir le projet "FileExplorer" dans le workspace du user par défaut
* Régler les éventuels problèmes de compatibilité en fonction de votre JDK ou de votre OS (certains jars spécifiques à changer comme celui de SWT sous Linux)

Vous pouvez maintenant exécuter l'application, la débugger, et avez la possibilité d'ajouter des scripts dans les dossiers :
* scripts/contextMenus
* scripts/menus

Pour regénérer un jar et l'utiliser sur la clé USB :
* Cliquer droit sur le projet
* Export...
* Jave / Runnable JAR file
* Choisir comme point d'entrée le Main de la classe Ihm
* Choisir la racine de la clé comme export destination
* Nommer le jar "explorer.jar"
* Finish

### Présentation de l'architecture, des concepts

### Documentation du code