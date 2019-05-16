# ILOG2019
Apache VFS Virtual File System : VFS Explorer

# Documentation développeur :

**Outils requis (non présents dans ilog.zip) :**

- Librairie Apache VFS Commons (inclue dans le dossier "lib" du projet)

**Configuration environnement de développement :**

- Importer le projet dans Eclipse comme un nouveau projet WindowBuilder (SWT/Jface)

**Procédure de build :**

- S'assurer que tous les JARs du dossier "lib" sont présentes dans le classpath du projet
- Compiler le projet en entier
- Exécuter le programme (point d'entrée dans FileExplorer.java)

**Architecture :**

Le projet se découpe en trois packages.
- fr.imtld.ilog.jface : Contient les deux principales classes du projet, le FileExplorer représentant le point d'entrée du programme et son interface, et le FileContentProvider spécifiant le traitement de la source de données des conteneurs de l'interface SWT.
- fr.imtld.ilog.jface.actions : Contient les classes héritant de Action, permettant de créer des actions spécifiques pour l'interface SWT.
- fr.imtld.ilog.jface.utils : Contient différentes classes utilisées par le FileExplorer et le ContentProvider afin de filtrer/trier les données affichées, ou encore manipuler certains objets afin d'en extraire des informations utiles au provider.

**Concept :**

VFS Explorer est un explorateur de fichier utilisant la librairie Apache VFS Commons afin de permettre l'exploration des fichiers archives de type .zip ou .jar. Il est basé sur une interface SWT décomposée en trois parties :
- Une arborescence de fichiers à gauche, permettant un affichage vertical des dossiers et sous-dossiers explorés et une vision globale du chemin parcouru.
- Une table de contenu à droite permettant d'afficher les fichiers et sous dossiers au chemin actuel, et de continuer d'explorer ou d'ouvrir des fichiers hors des archives.
- Une console en bas de l'écran servant de sortie pour des messages informatifs ou d'erreur lors de la manipulation du logiciel.