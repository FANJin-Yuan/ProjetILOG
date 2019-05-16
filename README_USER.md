
## C'est quoi notre produit
___Un conteneur d'application qui permet aux utilisateurs de lancer plusieurs applications en même temps. Les applications sont isolées dans le conteneur.___

## Comment utiliser votre conteneur 

 - 1. __Importer le projet Conteneur dans Eclipse:__
 	- Créer un projet WindowBuilder > SWT Designer > SWT/JFace Java Project.
	- Importer le package fr.imtld.ilog avec les codes sources, le dossier jars et le fichier conteneur.properties
 - 2. __Configuration le fichier conteneur.properties:__
	- Ajouter les noms des applications que vous voulez lancer dans la propriété ***applis***.
	- Ajouter les propriétés *.jarsFolder pour le chemin de dossiers contenant des .jar ou des .class.
	- Ajouter les propriétés *.class qui contient le nom de package+le nom de classe.
- 3. __Personnaliser votre application__
	- Importer le projet ___Applications___, il y a des squelette des applications.
	- Definir les comportement de votre l'application dans les méthodes: init(), start(), stop() et destroy();
	- Créer un dossier prope pour cette nouvelle application sous le dossier ***jars*** et exporter votre application 		      en *.jar.
	- Lancer le conteneur.
	- Pour lancer les applications correctement, il faut respecter le cycle la vie de l’application.
- 4. __Deploiement <<à chaud>>__
	- Après vous avez modifié votre application, n'arrêtez pas  le conteneur! Juste reexporter votre application et                 écraser ancien fichier .jar et recliquer le bouton init() de cette appli pour le recharger.
	- Après vous peuvent lancer cette nouvelle application grâce au bouton start.
