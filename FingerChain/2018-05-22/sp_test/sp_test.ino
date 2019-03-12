#include <SoftwareSerial.h>

char data[] = "foo";
uint8_t cnt = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.write(cnt);
  cnt++;
  delay(1000);
  
  if(cnt == 99) Serial.end();
}
