#include <Adafruit_NeoPixel.h>
#include <stdlib.h>
#include <stdio.h>
#include <time.h>
#ifdef _AVR_
#include <avr/power.h>
#endif

#define PIN 22

#define NUM_LEDS 19

#define BRIGHTNESS 20


Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_RGB + NEO_KHZ800);
String COULEURS[] = {"bleu", "rouge", "vert"};

byte neopix_gamma[] = {
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1,  1,  1,
  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  2,  2,  2,  2,  2,  2,
  2,  3,  3,  3,  3,  3,  3,  3,  4,  4,  4,  4,  4,  5,  5,  5,
  5,  6,  6,  6,  6,  7,  7,  7,  7,  8,  8,  8,  9,  9,  9, 10,
  10, 10, 11, 11, 11, 12, 12, 13, 13, 13, 14, 14, 15, 15, 16, 16,
  17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 24, 24, 25,
  25, 26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36,
  37, 38, 39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50,
  51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68,
  69, 70, 72, 73, 74, 75, 77, 78, 79, 81, 82, 83, 85, 86, 87, 89,
  90, 92, 93, 95, 96, 98, 99, 101, 102, 104, 105, 107, 109, 110, 112, 114,
  115, 117, 119, 120, 122, 124, 126, 127, 129, 131, 133, 135, 137, 138, 140, 142,
  144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 167, 169, 171, 173, 175,
  177, 180, 182, 184, 186, 189, 191, 193, 196, 198, 200, 203, 205, 208, 210, 213,
  215, 218, 220, 223, 225, 228, 231, 233, 236, 239, 241, 244, 247, 249, 252, 255
};
String couleurs[100];
int couleursInt[100];
String input;

int turn = -1;
TaskHandle_t xReadHandle;
TaskHandle_t xLedHandle;

void setup() {
  Serial.begin(115200);
  strip.setBrightness(BRIGHTNESS);
  strip.begin();
  colorFill(strip.Color(0, 0, 0));
  strip.show(); // Initialize all pixels to 'off'
  clearConsole();
  
  Serial.println("Bienvenue dans le jeu du Simax!");
  Serial.println("Retenez la séquence affichée par les lumières pour gagner");
  Serial.flush(); // Flushing to keep printing
  Serial.println("vous pouvez répondre lorsque la  lumière est blanche");
  Serial.flush();
  delay(6000);
  Serial.println("Le jeu commence dans 3...");
  delay(1000);
  Serial.println("2..");
  delay(1000);
  Serial.println("1..");
  delay(1000);
  xTaskCreate(ledTask, "led", configMINIMAL_STACK_SIZE, NULL, 5, &xLedHandle);
  xTaskCreate(readTask, "read", configMINIMAL_STACK_SIZE, NULL, 2, &xReadHandle);
  colorFill(strip.Color(0, 0, 0));
}
void readTask(void *param) {
  for (;;) {

    int ecrit = 0;
    int recu = 0;
    vTaskSuspend(xReadHandle);
    
    String trash = Serial.readString();
    clearConsole();
    Serial.println("entrez les couleurs les unes après les autres");
    Serial.flush();
    Serial.println("Les valeurs possibles sont:");
    Serial.flush();
    Serial.println("rouge   bleu   vert");

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
              Serial.println("Bravo!! On passe au tour suivant !");
              clearConsole();
              delay(2000);
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
    int entier;
    
    entier = myRand(3);
    couleurs[turn + 1] = COULEURS[entier];
    couleursInt[turn + 1] = entier;
    
    
    for (int j = 0; j <= turn + 1; j++) {
      colorFill(strip.Color(0, 0, 0));
      delay(1500);
      displayColor(couleursInt[j]);
      
    }
    colorFill(strip.Color(0, 0, 0));
    delay(1000);
    //whiteOverRainbow(20, 75, 5);
    colorFill(strip.Color(255, 255, 255));


    // vTaskPrioritySet(xHandle, 1);
    vTaskResume(xReadHandle);
    turn += 1;
    vTaskSuspend(xLedHandle);
  }
}
void loop() {
  // Some example
}


//get a real set of random values per game
int myRand(int maximum) {
  static int first = 0;
  if (first == 0) {
    randomSeed(millis());
    first = 1;
  }
  return random(maximum);
}

//Clears the board
void clearConsole(){
  Serial.println("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
}

//choose which color to display
void displayColor(int res) {
  switch (res) {
    case 0:
      colorFill(strip.Color(0, 0, 255)); // Blue
      delay(1500);
      break;

    case 1:
      colorFill(strip.Color(255, 0, 0)); // Red
      delay(1500);
      break;

    case 2:
      
      colorFill(strip.Color(0, 255, 0));//Green
      delay(1500);
      break;

    default:
      Serial.println("err");

  }

}


// Fill the dots with a color
void colorFill(uint32_t c) {
  for (uint16_t i = 0 ; i < strip.numPixels(); i++) {
   
    strip.setPixelColor(i, c); 
  }
  strip.show();
}

void pulseWhite(uint8_t wait) {
  for (int j = 0; j < 256 ; j++) {
    for (uint16_t i = 0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, strip.Color(255, 255, 255, neopix_gamma[j] ) );
    }
    delay(wait);
    strip.show();
  }

  for (int j = 255; j >= 0 ; j--) {
    for (uint16_t i = 0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, strip.Color(255, 255, 255, neopix_gamma[j] ) );
    }
    delay(wait);
    strip.show();
  }
}


void rainbowFade2White(uint8_t wait, int rainbowLoops, int whiteLoops) {
  float fadeMax = 100.0;
  int fadeVal = 0;
  uint32_t wheelVal;
  int redVal, greenVal, blueVal;

  for (int k = 0 ; k < rainbowLoops ; k ++) {

    for (int j = 0; j < 256; j++) { // 5 cycles of all colors on wheel

      for (int i = 0; i < strip.numPixels(); i++) {

        wheelVal = Wheel(((i * 256 / strip.numPixels()) + j) & 255);

        redVal = red(wheelVal) * float(fadeVal / fadeMax);
        greenVal = green(wheelVal) * float(fadeVal / fadeMax);
        blueVal = blue(wheelVal) * float(fadeVal / fadeMax);

        strip.setPixelColor( i, strip.Color( redVal, greenVal, blueVal ) );

      }

      //First loop, fade in!
      if (k == 0 && fadeVal < fadeMax - 1) {
        fadeVal++;
      }

      //Last loop, fade out!
      else if (k == rainbowLoops - 1 && j > 255 - fadeMax ) {
        fadeVal--;
      }

      strip.show();
      delay(wait);
    }

  }



  delay(500);


  for (int k = 0 ; k < whiteLoops ; k ++) {

    for (int j = 0; j < 256 ; j++) {

      for (uint16_t i = 0; i < strip.numPixels(); i++) {
        strip.setPixelColor(i, strip.Color(255, 255, 255, neopix_gamma[j] ) );
      }
      strip.show();
    }

    delay(2000);
    for (int j = 255; j >= 0 ; j--) {

      for (uint16_t i = 0; i < strip.numPixels(); i++) {
        strip.setPixelColor(i, strip.Color(255, 255, 255, neopix_gamma[j] ) );
      }
      strip.show();
    }
  }

  delay(500);


}

void whiteOverRainbow(uint8_t wait, uint8_t whiteSpeed, uint8_t whiteLength ) {

  if (whiteLength >= strip.numPixels()) whiteLength = strip.numPixels() - 1;

  int head = whiteLength - 1;
  int tail = 0;

  int loops = 3;
  int loopNum = 0;

  static unsigned long lastTime = 0;


  while (true) {
    for (int j = 0; j < 256; j++) {
      for (uint16_t i = 0; i < strip.numPixels(); i++) {
        if ((i >= tail && i <= head) || (tail > head && i >= tail) || (tail > head && i <= head) ) {
          strip.setPixelColor(i, strip.Color(255, 255, 255, 25 ) );
        }
        else {
          strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
        }

      }

      if (millis() - lastTime > whiteSpeed) {
        head++;
        tail++;
        if (head == strip.numPixels()) {
          loopNum++;
        }
        lastTime = millis();
      }

      if (loopNum == loops) return;

      head %= strip.numPixels();
      tail %= strip.numPixels();
      strip.show();
      delay(wait);
    }
  }

}
void fullWhite() {

  for (uint16_t i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, strip.Color(255, 255, 255, 25 ) );
  }
  strip.show();
}


// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for (j = 0; j < 256 * 5; j++) { // 5 cycles of all colors on wheel
    for (i = 0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

void rainbow(uint8_t wait) {
  uint16_t i, j;

  for (j = 0; j < 256; j++) {
    for (i = 0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if (WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3, 0);
  }
  if (WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3, 0);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0, 0);
}

uint8_t red(uint32_t c) {
  return (c >> 16);
}
uint8_t green(uint32_t c) {
  return (c >> 8);
}
uint8_t blue(uint32_t c) {
  return (c);
}
