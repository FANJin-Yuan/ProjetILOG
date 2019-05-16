# ILOG2019
Apache VFS Virtual File System : VFS Explorer

# Documentation d�veloppeur :

**Outils requis (non pr�sents dans ilog.zip) :**

- Librairie Apache VFS Commons (inclue dans le dossier "lib" du projet)

**Configuration environnement de d�veloppement :**

- Importer le projet dans Eclipse comme un nouveau projet WindowBuilder (SWT/Jface)

**Proc�dure de build :**

- S'assurer que tous les JARs du dossier "lib" sont pr�sentes dans le classpath du projet
- Compiler le projet en entier
- Ex�cuter le programme (point d'entr�e dans FileExplorer.java)

**Architecture :**

Le projet se d�coupe en trois packages.
- fr.imtld.ilog.jface : Contient les deux principales classes du projet, le FileExplorer repr�sentant le point d'entr�e du programme et son interface, et le FileContentProvider sp�cifiant le traitement de la source de donn�es des conteneurs de l'interface SWT.
- fr.imtld.ilog.jface.actions : Contient les classes h�ritant de Action, permettant de cr�er des actions sp�cifiques pour l'interface SWT.
- fr.imtld.ilog.jface.utils : Contient diff�rentes classes utilis�es par le FileExplorer et le ContentProvider afin de filtrer/trier les donn�es affich�es, ou encore manipuler certains objets afin d'en extraire des informations utiles au provider.

**Concept :**

VFS Explorer est un explorateur de fichier utilisant la librairie Apache VFS Commons afin de permettre l'exploration des fichiers archives de type .zip ou .jar. Il est bas� sur une interface SWT d�compos�e en trois parties :
- Une arborescence de fichiers � gauche, permettant un affichage vertical des dossiers et sous-dossiers explor�s et une vision globale du chemin parcouru.
- Une table de contenu � droite permettant d'afficher les fichiers et sous dossiers au chemin actuel, et de continuer d'explorer ou d'ouvrir des fichiers hors des archives.
- Une console en bas de l'�cran servant de sortie pour des messages informatifs ou d'erreur lors de la manipulation du logiciel.