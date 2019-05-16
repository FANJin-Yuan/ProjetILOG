# ILOG2019
IHM de cl� USB "Ilog".

L'arborescence en racine de ce repository GitHub repr�sente la racine de la cl� USB que vous pourrez utiliser pour travailler :
* sur diff�rents modules
* sur diff�rents ordinateurs et diff�rents syst�mes d'exploitation (Windows, Linux)
* sur diff�rents workspaces (contexte multi-utilisateurs)
* en restant toujours sur la cl� USB sans jamais modifier le syst�me h�te

## Utilisation

### Pr�requis
L'arborescence en racine de ce repository GitHub repr�sente la racine de la cl� USB.
En revanche, un simple clonage ne suffira pas pour l'utiliser correctement.
Il faudra � minima :
* poss�der une archive de Java Runtime Environment (peu importe votre OS)

### Installation
* Cloner le projet
* Copier son contenu sur une cl� USB pr�alablement format�e
* Placer votre archive de JRE d�compress�e dans l'un des r�pertoires pr�vus pour les outils (� savoir tools pour les outils 32bits et tools64 pour les outils 64bits)

En fonction de votre OS, il faudra ensuite ajouter le bin de votre JRE � la variable PATH :
* Sur Linux : modifier le script run.sh
Exemple avec le JRE 9.0.4 sous Linux 64 bits : > export PATH=$PATH:${PWD}/bin:${PWD}/tools64/jre-9.0.4_linux-x64/bin
* Sur Windows : modifier le script run.bat
Exemple (avec %~dp0 repr�sentant le r�pertoire courant) : > set PATH=%~dp0bin;%~dp0tools64\jre\bin

Pour lancer l'application, il ne vous restera plus qu'� :
* Sur Linux : ex�cuter le script run.sh (au moyen de la commande bash)
* Sur Windows : double-cliquer sur le raccourci run.exe

Par la suite, il est possible, en fonction des param�tres de votre syst�me d'exploitation, que le programme se lance automatiquement au branchement de la cl� USB.
Cela est rendu possible par la pr�sence d'un fichier autorun.inf � la racine de la cl� sp�cifiant une action � r�aliser � l'ouverture, ainsi qu'un titre et un logo.
Cependant, sur les syst�mes d'exploitation les plus r�cents, les param�tres par d�faut bloquent ce type de m�canismes (autoplay/autorun) pour des raisons de s�curit�.

### Configuration
Pour configurer diff�rents outils comme vu pr�c�demment avec le JRE, vous pouvez utiliser les r�pertoires
* bin
* tools
* tools64

Le dossier scripts est un r�pertoire accueillant diff�rents scripts js pouvant �tre int�gr�s � l'application, veuillez vous r�f�rer � la documentation d�veloppeur si vous souhaitez en savoir plus sur le d�veloppement de nouveaux scripts

Le dossier users est un r�pertoire accueillant des sous-dossiers repr�sentant chaque utilisateur de la cl�, si besoin, chacun ayant son propre workspace et ses propres projets (l'utilisateur par d�faut �tant "user")

Par d�faut, l'application d'explorer d�marre sur la racine de la cl�, afin de permettre � l'utilisateur d'avoir acc�s aux diff�rents r�pertoires de la cl�.
Cependant, si vous souhaitez changer ce r�pertoire de lancement par d�faut, vous pouvez le faire au moyen du fichier explorer.properties, en modifiant la variable rootPath.
Exemple (pour une exploration � partir du dossier users) : > rootPath=./users/
En commentant simplement la ligne pour qu'elle ne soit plus effective, l'exploration s'effectuera � partir de la racine du disque dur de l'ordinateur h�te.
Exemple (pour une exploration � partir du disque dur h�te) : > #rootPath=./

### Mode d'emploi
Une fois l'application lanc�e avec run.exe (si vous �tes sous Windows) ou run.sh (si vous �tes sur Linux), vous pourrez choisir de continuer en tant qu'utilisateur par d�faut (user) ou en tant qu'utilisateur custom.
Si vous choisissez d'�tre utilisateur custom, renseignez un pseudo et cliquez sur "Continuer". Un r�pertoire utilisateur et un workspace seront automatiquement cr��s s'ils ne l'�taient pas d�j�.
Vous pouvez ensuite utiliser l'explorateur et lancer par exemple un de vos outils pr�sents dans le r�pertoire bin (comme Eclipse ou Netbeans) pour commencer � travailler et utiliser votre propre workspace.
L'int�r�t de travailler sur la cl� USB est de pouvoir bouger facilement son outil de travail sans se soucier ni de l'ordinateur sur lequel brancher la cl� ni sur son syst�me d'exploitation.
La cl� USB devient en quelque sorte un "ordinateur de travail portable".

## D�veloppement
Si vous souhaitez effectuer du d�veloppement pour am�liorer l'application ou corriger certains bugs, sachez que le code source du projet "FileExplorer" est disponible dans le workspace de l'utilisateur par d�faut "user".

### Outils � installer
Il n'y a aucun outil � installer si vous poss�dez l'archive ilog.zip disponible sur whippet.
Vous trouverez dans celle-ci les diff�rents outils dont vous aurez besoin pour d�velopper (le logiciel eclipse, le jdk, le jre, les jars des biblioth�ques etc).

### Config environnement de d�veloppement
Pour ouvrir le projet et �tre capable de le lancer ou le d�bugger :
* Ouvrir Eclipse
* File > Open Project from File System...
* Choisir le projet "FileExplorer" dans le workspace du user par d�faut
* R�gler les �ventuels probl�mes de compatibilit� en fonction de votre JDK ou de votre OS (certains jars sp�cifiques � changer comme celui de SWT sous Linux)

Vous pouvez maintenant ex�cuter l'application, la d�bugger, et avez la possibilit� d'ajouter des scripts dans les dossiers :
* scripts/contextMenus
* scripts/menus

Pour reg�n�rer un jar et l'utiliser sur la cl� USB :
* Cliquer droit sur le projet
* Export...
* Jave / Runnable JAR file
* Choisir comme point d'entr�e le Main de la classe Ihm
* Choisir la racine de la cl� comme export destination
* Nommer le jar "explorer.jar"
* Finish

### Pr�sentation de l'architecture, des concepts

### Documentation du code