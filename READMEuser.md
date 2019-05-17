# ILOG2019 - Créer un device JUnit

Ce projet permet à l'utilisateur d'effectuer des tests JUnit appartenant à une suite et les envoyer sur un port série, auquel on peut connecter un appareil comme une carte Arduino, par exemple, pour en traiter les résultats.


# Documentation Utilisateur JAVA

## Démarrer

### Pré-requis

Avoir un projet Eclipse avec des tests JUnit fonctionnels et JUnit 4 ou ultérieur.

### Lancer les tests

* A partir de votre projet Eclipse comprenant vos tests JUnit, importer les librairies « «RXTXcomm.jar» et « jSerialComm.jar » ainsi que rxtxSerial.dll (Windows).
* Ajouter la classe SerialSuite.java à votre package où sont présentes vos classes de test.
* Ajouter la classe de Suite de tests à ce package et importer SerialSuite.
* Configurer  dans cette dernière classe les champs :
	- @SetCommPort avec le nom du port sur lequel vous allez envoyer les résultats des tests
	- @SuiteClasses avec le nom de toutes les classes de test dont vous souhaitez afficher le 	résultat sur l’Arduino
 
Exemple:
```
@SetCommPort("PORT TO BE USED") //String with the name of the serial port to be used
@RunWith(SerialSuite.class)
@SuiteClasses({ testClass1.class, testClass2.class, testClass3.class }) //Between brackets are the several test Classes the Suite is made of
```

Lancer la JUnit Test Suite

### Exemple d'application

Pour faire une démonstration du projet, nous utilisation une carte Arduino avec un écran LCD et un code affichant les résultats et changeant de couleurs selon les résultats de tests individuels appartenant à la suite, présentant une fonctionnalité de navigation.

# Documentation Utilisateur ARDUINO

## Utilisation du Device JUnit : 
* Une fois votre projet éclipse contenant vos tests unitaires paramétré, branchez l’Arduino à un port USB de votre ordinateur dont vous connaissez le nom (COM3 ou COM4 en général).
* Ouvrez le document « ArduinoJUnit.ino » avec l’IDE Arduino et « téléversez » vers votre Arduino.
* Un message « attente tests » va s’afficher sur l’écran de l’Arduino.
* Lancez les tests Junits (TestAll.java) dans votre projet.
* Un nouveau message « Tests recus » va s’afficher sur l’écran de l’Arduino
* Naviguer entre les classes de tests grâce aux touches ‘4’ et ‘6’ de votre clavier.
	-Le rouge indique que les tests ont échoué, le nombre de test réussi sur le total sera affiché
	-Le vert indique que tous les tests sont réussis.
	-Le bleu indique un état non testé.
* Pour afficher de nouveaux résultats de tests, relancez juste les tests unitaires sur éclipse et attendez l’écran « tests recus » avant de pouvoir naviguer.

## Auteurs

* Jaime Orts-Caroff
* Théo Chombart
