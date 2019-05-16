#include <rgb_lcd.h>
#include <Keypad.h>

#define L1 7
#define L2 5
#define L3 3
#define L4 2
#define C1 4
#define C2 9
#define C3 8
#define TAILLETAB 50 //Nombre maximum de tests que l'on pourra afficher
#define TAILLELIGNE 100 //Taille maximum des tests que l'on pourra afficher
#define SEPARATOR ";" //Caractère séparant les différents tests à la lecture

rgb_lcd ecranRGB;

//initialisation du clavier
const byte rows = 4;
const byte cols = 3;
char keys[rows][cols] = {
  {'1', '2', '3'},
  {'4', '5', '6'},
  {'7', '8', '9'},
  {'#', '0', '*'}
};

byte rowPins[rows] = {L1, L2, L3, L4};
byte colPins[cols] = {C1, C2, C3};
Keypad keypad = Keypad( makeKeymap(keys), rowPins, colPins, rows, cols );

//définition des différentes variables
int jndex;
int index;
int tailleTab = TAILLETAB;
int tailleLigne = TAILLELIGNE;
const char separateur[2] = SEPARATOR;
String stringReceptionee;
char stringReceptioneeChar[80];
int nbElements;
char statut;
char* token;

void setup() {
  Serial.begin(9600, SERIAL_8N1);
  ecranRGB.begin(16, 2, 0x00);
  ecranRGB.clear();
  ecranRGB.print("attente tests");
  jndex = 0;
  index = 0;
}

//affichage sur l'écran de l'arduino
void afficher(String message) {
  ecranRGB.clear();
  int positionCounter;
  ecranRGB.print(message);
  //En cas de chaine trop longue, on fait défiler le texte en entier vers la gauche
  if (message.length() > 16) {
    for (positionCounter = 0; positionCounter <= message.length() - 16; positionCounter++) {
      ecranRGB.scrollDisplayLeft();
      delay(200);
    }
    //puis on affiche le message de navigation
    ecranRGB.setCursor(message.length() - 15, 1);
    ecranRGB.print("<-4pre.  sui.6->");

  } else {
    //sinon, on affiche le message de navigation instantanément
    ecranRGB.setCursor(0, 1);
    ecranRGB.print("<-4pre.  sui.6->");
  }
}

//Change la couleur de l'écran en fontion du statut
void choixCouleur(char statut) {
//statut = dernière lettre repérée
  if (statut == 'k') {
    ecranRGB.setRGB(0, 255, 0);//rouge
  } else if (statut == 'o') {
    ecranRGB.setRGB(255, 0, 0);//vert
  } else {
    ecranRGB.setRGB(0, 0, 255);//bleu
  }
}


void loop(){
  char tab[tailleTab][tailleLigne];
  char key = keypad.getKey();

  //récupération de la chaine en port série
  if (Serial.available() > 0) {

    //récupération
    stringReceptionee = Serial.readString();
    //Mise au format char*
    stringReceptionee.toCharArray(stringReceptioneeChar, 80);

    //isolation de chaque test et placement dans un tableau
    token = strtok(stringReceptioneeChar, separateur);
    index = 0;
    while (token != NULL && index < tailleTab) {
      strcpy(tab[index], token);
      token = strtok(NULL, separateur);
      index++;
    }

    //Récupération du nombre d'éléments
    nbElements = index;
    afficher("tests recus");
  }

  //navigation avec les touches '4' et '6'
  switch (key) {
    case '6':
      jndex == nbElements - 1 ? jndex = 0 : jndex++;
      statut = tab[jndex][strlen(tab[jndex]) - 1];//récupération du statut
      choixCouleur(statut);
      afficher(tab[jndex]);
      break;
    case '4':
      jndex == 0 ? jndex = nbElements - 1 : jndex--;
      statut = tab[jndex][strlen(tab[jndex]) - 1];//récupération du statut
      choixCouleur(statut);
      afficher(tab[jndex]);
      break;
  }
  delay(10);
}
