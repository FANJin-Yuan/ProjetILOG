# DEVELOPPER VOTRE CONTENEUR
## Les outils à installer 
  - 1. Installer les plugins de SWT/JFace dans le site http://www.eclipse.org/windowbuilder/download.php pour votre Eclipse.
## Importer les codes sources
  - 1. Créer un SWT/JFace Projet.
  - 2. Importer les codes sources de Conteneur, le dossier de jars et le fichier **.properties*
  - 3. Importer le projet Application, qui définit les squelettes.
  - 3. Améliorer le Conteneur.
##  l'architecture, des concepts
*Il y a deux partie: le projet Conteneur et le projet Applcations.*
*Dans le projet Conteneur, la classe principale de Conteneur est **ApplicationConteneur.java**, il implémente l'interface **ServerLisener.java** pour avoir la capacité d'écouter l'état de chaque application, et gérer le cycle de vie de l'application. Pour recharger l'application sans arrêter le conteneur, on crée un nouveau **ClassLoder** pour charger une nouvelle version de l'application.
Il y a des méthodes principales:*
 - 1.  init(): Initiation le conteneur en appelant la méthode getApps() qui retourne un tableau des noms des applications.
 - 2.  createContents(Composite parent): Créer une interface utilisateur avec les boutons liés aux différentes fonctions de l'application, et afficher l'état de l'application.
 - 3. initApp(String app), runApp(Iapplication app), stopApp(Iapplication app), destroyApp(Iapplication app): quand on appuie les boutons concernés, l'une de celles-ci est appellée pour invoquer les méthodes de l'application concernées. Dans la méthode de initApp(String app), on utlise la __réflexion__ pour initialiser une application, et puis appeler la méthode init() de celle.
 - 4. serverInit(String app), serverStarted(String app), serverStopped(int iCause, int iPort,String app), serverDestroy(String app): Pour mettre à jour l'état de l'applcation dans l'interface utilisateur.

*Dans le projet Application, les applications implementent l'interface **Iapplication.java** qui définit les méthodes principales d'une application: init(), start(), stop(), destroy(). Chaque application a un **ServerListener** qui est initialisée quand on instancie une application pour le feed-back de son état dans l'interface utilisateur.*
## Documentations de code
*Comment les resultats prevus, grâce à ce conteneur, nous pouvons y intégrer plusieures applications simultanément. Celles sont affichées sur une interface utilisateur avec leurs méthodes. Chaque méthode a son propre bouton. Chaque application a également une étiquette qui indique son statut. De plus, cette interface utilisateur peut être créée dynamiquement avec l’aide de tableau et boucle. Et après, nous pouvons manipuler les applications en respectant leur cycle de vie. Et bien sûr, ce conteneur prend également en charge le déploiement à chaud. Grosso modo, nous avons réalisé un fort conteneur d’application qui intègre beaucoup de services. Il a une bonne pratique et améliore l’utilisation et la gestion d’application.*
 


