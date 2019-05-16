# DEVELOPPER VOTRE CONTENEUR
## Les outils à installer 
  - 1. Installer les plugins de SWT/JFace dans le site http://www.eclipse.org/windowbuilder/download.php pour votre Eclipse.
## Importer les codes sources
  - 1. Créer un SWT/Jface Projet.
  - 2. Importer les codes sources de Conteneur, le dossier de jars et le fichier **.properties*
  - 3. Importer le projet Application, qui définit les squelettes.
  - 3. Améliorer le Conteneur.
##  l'architecture, des concepts
*La classe principe de Conteneur est **ApplicationConteneur.java**, il implemente l'interface **ServerLisener.java** pour avoir la capacité d'écouter l'état de chaque application, et gérer le cycle de la vie de applications. Pour recharger l'application sans arrêter le conteneur, on crée un nouveau **ClassLoder** pour charger une nouvelle version de l'appli.
Il y a des méthodes principales:*
 - 1.  init(): Initiation le conteneur en appelant la méthode getApps() qui retourne un tableau des noms des applications.
 - 2.  createContents: Créer une interface utilisateur avec les button liée aux différents fonctions de l'application, et     afficher l'état de l'application.
 - 3. init(app), run(app), stopApp(app), destroy(app): quand on appuie les boutons concernant, l'un de ceux-ci sont appellé pour appeler les méthodes de l'application concernant. Dans la méthode de init(app), on utlise la __réflexion__ pour inicialiser une application ,et puis appeler la méthode init() de celle.
 - 4. serverStarted(app), serverStarted(app),serverStopped(iCause, iPort,app), serverDestroy(app): Pour mettre à jour l'état de l'applcations dans l'interface utilisateur.

*Dans le projet Application, les applications implementent l'interfacer **Iapplication.java** qui définit les méthodes principes de une application: init(),start(),stop(),destroy(). Chaque application a un **ServerListener** qui est inicialisé quand on inicialise une application pour le feed-back de son état dans l'interface utilisateur.*
 


