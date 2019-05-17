# Documentation Développeur JAVA

## Pré-requis

Cloner en local le projet github, disposer de JUnit 4 ou ultérieur, se référer à la documentation utilisateur d’initialisation d’un projet.

## Architecture et concepts utilisés en vue de la modification de l’application

La classe SerialSuite hérite de Suite, qui permet l’exécution d’une suite de tests paramétrés grâce à l’annotation SuiteClasses.

* La méthode run est exécutée sur le runner principal de la classe.
Nous avons gardé l’implémentation originale de celle-ci, en lui ajoutant du code permettant d’obtenir le nombre de classes de test appartenant à la suite de tests, ainsi que le port série défini dans l’annotation SetCommPort de la JUnit Test Suite.

* La méthode runChild quant à elle est exécutée pour chaque test de la suite et elle prend en charge l’ajout des noms des tests ainsi que leurs résultats dans des listes prévues à cet effet, à travers l’utilisation des ClassLoaders.
Elle gère également l’envoi de ces résultats sur le port série.

## Axes d’amélioration

Pour améliorer l’application, on pourrait viser à optimiser le code et éventuellement proposer une meilleure factorisation de celui-ci. En termes de fonctionnalités, l’ajout des résultats individuels des sous-tests ainsi qu’un message indiquant la raison de l’échec du test, le cas échéant, serait la bienvenue.

# Documentation Développeur Arduino

## Pré-requis

Installation IDE Arduino, téléchargement des bibliothèques RGB_lcd.h et Keypad.h

## Architecture, concepts du code Arduino

### Initialisation

* Import des bibliothèques relatives à l’écran LCD et au clavier 12 touches
* Définition de certaines variables (taille des tableaux, longueur des cases…)
* Création d’une matrice pour utiliser les touches du clavier.
* Définition des variables

### Setup()

* Initialisation de la lecture sur port série
* Initialisation de l’écran LCD RGB
* Affichage d’un message initial d’attente 
* Initialisation des index

### Loop()

* Initialisation d’un tableau pour les tests et d’un « char » pour la récupération des touches appuyées
* Quand signal repéré sur le port série : 
		* Récupération d’une *String*, mise au format *char**
	* Isolement de chaque test de la *String* repérés grâce à un séparateur (« ; ») et mise de chaque test dans une des cases du tableau
		* Récupération du nombre de tests trouvé
		* Signification à l’utilisateur que les tests sont récupérés et présents dans le tableau
	* A l’appui d’une touche du Keypad (4 ou 6) :
		* On se déplace dans le tableau et on affiche le test.
			* La fonction *afficher()* affiche le nom, le statut et les touches de navigation.
			* Si le nom est trop long, il va défiler vers la gauche jusqu’à la fin.
		* On récupère le dernier caractère qui indique le statut du test.
		* En fonction de ce statut, on change la couleur grâce à la fonction *choixCouleur*.



## Axes d’amélioration

### Code Arduino : Axes d’améliorations

Utilisation de tableaux à taille dynamique pour stocker les tests.

Optimisation de l’occupation de la mémoire.

Optimisation du code, factorisation de certaines fonctions.

### Axes d’améliorations générales du projet

Possibilité de pouvoir parcourir les sous-tests de chaque classe test sur l’Arduino.

Lire les rapports d’erreur, afficher plus de détail sur l’erreur obtenue.
