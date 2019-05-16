#include <Adafruit_NeoPixel.h>
#include <stdlib.h>
#include <stdio.h>
#ifdef _AVR_
#include <avr/power.h>
#endif

#define PIN 22 // le PIN permettant de gérer les LEDs

#define NUM_LEDS 19 // Nombre de LEDs dans le bandeau

#define BRIGHTNESS 20 // declaration du niveau de luminosité des LEDs


Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_RGB + NEO_KHZ800);
String COULEURS[] = {"bleu", "rouge", "vert"}; // déclaration du bandeau de LED sous l'alias "strip"

String couleurs[100];  // tableau de couleurs en format String ("bleu", "rouge", "vert")
int couleursInt[100];  // tableau de intColor compris entre 0 et 2 inclus déterminant la couleur qui sera afficher 
String input;          // variable permettant de stocker les valeurs envoyées par l'utilisateur

int turn = -1; // valeur permettant de déterminer à quelle tour on est turn + 2 = numéro du tour

//Varianle permettant de gérer les tasks
TaskHandle_t xReadHandle;
TaskHandle_t xLedHandle;

void setup() {

  //initialisation de la console et du bandeau de LED
  Serial.begin(115200); 
  strip.setBrightness(BRIGHTNESS);
  strip.begin();
  colorFill(strip.Color(0, 0, 0));
  strip.show(); // Initialize all pixels to 'off'
  clearConsole();

  //Lancement du jeu avec explication des règles
  Serial.println("Bienvenue dans le jeu du Simax!");
  Serial.println("Retenez la séquence affichée par les lumières pour gagner");
  Serial.flush(); // Flushing to keep printing
  Serial.println("vous pouvez répondre lorsque la  lumière est blanche");
  Serial.flush();
  delay(10000);
  Serial.println("Le jeu commence dans 3...");
  delay(1000);
  Serial.println("2..");
  delay(1000);
  Serial.println("1..");
  delay(1000);

  //Creation des 2 tasks
  xTaskCreate(ledTask, "led", configMINIMAL_STACK_SIZE, NULL, 5, &xLedHandle);
  xTaskCreate(readTask, "read", configMINIMAL_STACK_SIZE, NULL, 2, &xReadHandle);
  colorFill(strip.Color(0, 0, 0));
}
void readTask(void *param) {
  for (;;) {

    int ecrit = 0;
    int recu = 0;
    vTaskSuspend(xReadHandle);

    //Clear le Serial buffer pour s'assurer que l'utilisateur
    //ne puisse pas rentrer de donner avant la fin de la séquence
    String trash = Serial.readString();
    clearConsole();

    //Information concernant les valeurs possibles
    Serial.println("entrez les couleurs les unes après les autres");
    Serial.flush();
    Serial.println("Les valeurs possibles sont:");
    Serial.flush();
    Serial.println("rouge   bleu   vert");
    // boucle permettant de vérifier la véracité de la réponse 
    // sur l'entièreté de la séquence
    for (int index = 0; index <= turn; index++) {
      input = "";
      while (input == "") {
        if (Serial.available() > 0) {
          // read the incoming String:
          input = Serial.readString();

          // say what you got:
          Serial.print("Tu as joué: ");
          Serial.println(input + ".");


          if (input == couleurs[index]) {
            Serial.println("bonne réponse");
            if (index == turn) {
              //cas où la réponse et la bonne et la couleur la dernière de la séquence
              
              Serial.println("Bravo!! On passe au tour suivant !");
              delay(2000);
              clearConsole();
              vTaskResume(xLedHandle);
            }

          }
          else {
            Serial.print("mauvaise réponse, appuyez sur RST pour recommencer! ");
            delay(2000);
            Serial.end();
          }
        }
      }
    }
  }
}
void ledTask(void *param) {
  for (;;) {
    colorFill(strip.Color(0, 0, 0));

    //Choix d'un entier aléatoire déterminant la prochaine couleur
    int entier;
    entier = myRand(3);
    couleurs[turn + 1] = COULEURS[entier];
    couleursInt[turn + 1] = entier;
    

    //Affichage de la séquence de couleurs
    for (int j = 0; j <= turn + 1; j++) {
      colorFill(strip.Color(0, 0, 0));
      delay(1500);
      displayColor(couleursInt[j]);
      
    }
    colorFill(strip.Color(0, 0, 0));
    delay(1000);
    // éclairage du bandeau en blanc
    colorFill(strip.Color(255, 255, 255));

    //relancement de la task gérant l'interface avec l'utilisateur
    vTaskResume(xReadHandle);
    
    // incrémentation de la variable gérant les tours
    turn += 1;

    //suspension de cette task
    vTaskSuspend(xLedHandle);
  }
}
void loop() {
  //Boucle infini qui par défaut exécute les tasks sous FREERTOS
}


//renvoie un entier aléatoire compris entre 0 inclu et maximum exclu
int myRand(int maximum) {
  static int first = 0;
  if (first == 0) {
    randomSeed(millis());
    first = 1;
  }
  return random(maximum);
}

//Nettoyage de la console
void clearConsole(){
  Serial.println("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
}

//Affichage de tableau de LEDs de la couleur correspondant à l'entier colorInt 
void displayColor(int colorInt) {
  switch (colorInt) {
    case 0:
      colorFill(strip.Color(0, 0, 255)); // Bleu
      delay(1500);
      break;

    case 1:
      colorFill(strip.Color(255, 0, 0)); // Rouge
      delay(1500);
      break;

    case 2:
      
      colorFill(strip.Color(0, 255, 0));//Vert
      delay(1500);
      break;

    default:
      Serial.println("err");

  }

}


// Coloration de toutes les LEDs de la couleur "color" récupérable via la fonction strip.Color(int rouge, int vert, int bleu) 
void colorFill(uint32_t color) {
  for (uint16_t i = 0 ; i < strip.numPixels(); i++) {
   
    strip.setPixelColor(i, color); 
  }
  strip.show();
}
