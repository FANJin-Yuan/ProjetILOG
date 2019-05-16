Notre jeu/projet “Projet_Simax” est un jeu où l’on doit mémoriser des séquences de couleurs aléatoires 
puis les renseigner dans la console. Chaque réussite de retranscription d’une séquence enclenchera le tour
suivant qui ajoutera une nouvelle couleur à la séquence. En cas d’échec la console est bloquée et il est 
nécessaire de relancer le jeu à l’aide du bouton RST de la carte TTGO

Commencez par télécharger l’IDE Arduino. Une fois l’installation réussie, suivez les étapes ci-dessous :

  - Créer un dossier à l’adresse suivante  : Arduino/hardware/espressif/esp32
  - En faire un clone de https://github.com/espressif/arduino-esp32.git
  - Mettre à jour le driver windows du virtual COM 
      - Ouvrir le gestionnaire de périphérique Windows
      - Connecter le câble USB entre la carte TTGO et l’ordinateur
      - Le gestionnaire de périphérique affiche un appareil “CP210x USB to UART Bridge” sans driver
      - L’installation automatique du driver ne fonctionne pas
      - télécharger et dézipper les drivers zipper depuis https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers
      - installer le driver en désignant cette emplacement
  - Relancer l’IDE Arduino et sélectionner le port COM
  - Choisissez le “WRover module” dans la section ESP32
  - Ouvrez le projet à l’aide de fichier “Projet_Simax.ino” à l’emplacement RGB_LED/Projet_Simax/
  - Lancer la console Arduino (raccourci ctrl+maj+m) et choisir "Pas de fin de ligne"
  - Lancer le “téléversement” sur la carte TTGO (raccourci ctrl+u) pour le premier lancement. 
    Il suffira ensuite d’appuyer sur le bouton RST de la carte TTGO
  - Suivez ensuite les instructions qui s’affichent dans la console pour pouvoir jouer à notre jeu “Projet Simax” !!
