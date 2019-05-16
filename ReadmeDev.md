Notre jeu/projet “Projet_Simax” est un jeu où l’on doit mémoriser des séquences de couleurs 
aléatoires puis les renseigner dans la console. Chaque réussite de retranscription d’une séquence
enclenchera le tour suivant qui ajoutera une nouvelle couleur à la séquence. En cas d’échec la
console est bloquée et il est nécessaire de relancer le jeu à l’aide du bouton RST de la carte TTGO

Commencez par télécharger l’IDE Arduino. Une fois l’installation réussi suivez les étapes ci-dessous :

  - Créer un dossier à l’adresse suivante  : Arduino/hardware/espressif/esp32
  - En faire un clone de https://github.com/espressif/arduino-esp32.git
  - Mettre à jour le driver windows du virtual COM 
    - Ouvrir le gestionnaire de périphérique Windows
    - connecter le câble USB entre la carte TTGO et l’ordinateur
    - Le gestionnaire de périphérique affiche un appareil “CP210x USB to UART Bridge” sans driver
    - L’installation automatique du driver ne fonctionne pas
    - télécharger et dézipper les drivers zipper depuis https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers
    - installer le driver en désignant cette emplacement
  - Relancer l’IDE Arduino et sélectionner le port COM
  - Choisissez le “WRover module” dans la section ESP32
  - Ouvrez le projet à l’aide de fichier “Projet_Simax.ino” à l’emplacement RGB_LED/Projet_Simax/
  Les librairies :

Notre projet repose sur deux librairies standards et une librairie beaucoup utilisée, spécialisée dans la gestion de l’éclairage de LED sous Arduino. Ces librairies sont celle importées au début du projet : “stdio.h”, “stdlib.h”, “Adafruit_NeoPixel.h”

Dans l’exécution nous utilisons deux tâches qui communiquent via des suspensions de tâches ou en se relançant. L’emplacement de ces suspensions et relancement de tâches est déterminé par la priorité de chacune d’entre elle, la tâche gérant l’éclairage des LEDs étant prioritaire sur la tâche gérant l'interface avec l‘utilisateur.

Nous avons défini 4 fonctions utilisées dans les tâches :

  - clearConsole()
	  Cette fonction est utilisée pour réinitialiser l’affichage et ainsi faire en sorte 
    que la console soit le plus lisible possible.
  - colorFill(uint32_t color)
	  Cette fonction est utilisée pour colorer toute les LEDs d’une couleur via l’argument color
    qui est d’un type défini par la librairies Adafruit_Neopixel. On peut l’obtenir grâce à la
    fonction strip.Color(int rouge, int vert, int bleu) où les valeurs de chaque couleur sont
    comprises entre 0 et 255 (le niveau de l’intensité lumineuse).
  - displayColor(int colorInt)
	Cette fonction s’appuie sur la fonction précédente et permet de colorer les LEDs de la
  couleur choisi par un entier de valeur 0 pour bleu,1 pour rouge ou 2 pour vert. 
  - myRand(int maximum) 
	Cette fonction permet de générer un entier aléatoire compris entre 0 et 2 inclus, utilisé ensuite
	pour déterminer la couleur de l’affichage.
