
## C'est quoi notre produit
___Un application conteneur qui permet aux utilisateurs de lancer plusieurs applications en même temps. Ces derniers sont isolées dans le conteneur.___

## Comment utiliser votre conteneur
- 1. Configuration le fichier conteneur.properties:
	- Ajouter les noms des applications que vous voulez lancer dans la propriété **applis**.
	- Ajouter les propriétés *.jarsFolder pour le chemin de dossiers contenant des .jar ou des .class.
	- Ajouter les propriétés *.class qui contient le nom de package+le nom de classe.
- 2. Personnaliser votre application
	- Definir les comportement de votre l'application dans les méthodes: init(), start(), stop() et destroy();
	 -Créer un dossier prope pour cette nouvelle application sous le dossier **jars** et exporter votre application 		      en *.jar.
	- Lancer le conteneur.
	- Pour lancer les applications correctement, il faut respecter le cycle la vie de l’application.()
- 3.Deploiement <<à chaud>>
	- Après vous avez modifié votre application, n'arrêtez pas  le conteneur! Juste reexporter votre application et                 écraser ancien fichier .jar et recliquer le bouton init() de cette appli pour le recharger.
	- Après vous peuvent lancer cette nouvelle application grâce au bouton start;
