#Documentation D�veloppeur JAVA

## Pr�-requis�: Cloner en local le projet github, disposer de JUnit 4 ou ult�rieur, se r�f�rer � la documentation utilisateur d�initialisation d�un projet. 
## Architecture et concepts utilis�s en vue de la modification de l�application�: La classe SerialSuite h�rite de Suite, qui permet l�ex�cution d�une suite de tests param�tr�s gr�ce � l�annotation SuiteClasses.
La m�thode run est ex�cut�e sur le runner principal de la classe. Nous avons gard� l�impl�mentation originale de celle-ci, en lui ajoutant du code permettant d�obtenir le nombre de classes de test appartenant � la suite de tests, ainsi que le port s�rie d�fini dans l�annotation SetCommPort de la JUnit Test Suite.
La m�thode runChild quant � elle est ex�cut�e pour chaque test de la suite et elle prend en charge l�ajout des noms des tests ainsi que leurs r�sultats dans des listes pr�vues � cet effet, � travers l�utilisation des ClassLoaders. Elle g�re �galement l�envoi de ces r�sultats sur le port s�rie.
## Axes d�am�lioration�: Pour am�liorer l�application, on pourrait viser � optimiser le code et �ventuellement proposer une meilleure factorisation de celui-ci. En termes de fonctionnalit�s, l�ajout des r�sultats individuels des sous-tests ainsi qu�un message indiquant la raison de l��chec du test, le cas �ch�ant, serait la bienvenue.

#Documentation D�veloppeur Arduino

## Pr�-requis�: Installation IDE Arduino, t�l�chargement des biblioth�ques RGB_lcd.h et Keypad.h
## Architecture, concepts du code Arduino�:
### Initialisation�: 
	-Import des biblioth�ques relatives � l��cran LCD et au clavier 12 touches
-D�finition de certaines variables (taille des tableaux, longueur des cases�)
-Cr�ation d�une matrice pour utiliser les touches du clavier.
-D�finition des variables
### Setup()�:
	-Initialisation de la lecture sur port s�rie
	-Initialisation de l��cran LCD RGB
	-Affichage d�un message initial d�attente 
	-Initialisation des index
### Loop()�: 
-Initialisation d�un tableau pour les tests et d�un ��char�� pour la r�cup�ration des touches appuy�es
	-Quand signal rep�r� sur le port s�rie�: 
		-R�cup�ration d�une ��String��, mise au format ��char*��
-Isolement de chaque test de la ��String�� rep�r�s gr�ce � un s�parateur (��;��) et mise de chaque test dans une des cases du tableau
		-R�cup�ration du nombre de tests trouv�
		-Signification � l�utilisateur que les tests sont r�cup�r�s et pr�sents dans le tableau
	-A l�appui d�une touche du Keypad (4 ou 6)�:
		- On se d�place dans le tableau et on affiche le test.
- La fonction ��afficher()�� affiche le nom, le statut et les touches de navigation.
			- Si le nom est trop long, il va d�filer vers la gauche jusqu�� la fin.
		- On r�cup�re le dernier caract�re qui indique le statut du test.
		- En fonction de ce statut, on change la couleur gr�ce � la fonction ��choixCouleur��.



## Axes d�am�lioration�: 
### Code Arduino�: Axes d�am�liorations
Utilisation de tableaux � taille dynamique pour stocker les tests. 
Optimisation de l�occupation de la m�moire.
Optimisation du code, factorisation de certaines fonctions.
### Axes d�am�liorations g�n�rales du projet�:
Possibilit� de pouvoir parcourir les sous-tests de chaque classe test sur l�Arduino.
Lire les rapports d�erreur, afficher plus de d�tail sur l�erreur obtenue.