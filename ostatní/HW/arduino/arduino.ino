#include <dht.h>

dht DHT;

void setup(){
  Serial.begin(9600);
}

void loop(){
  int chk = DHT.read11(7);
  Serial.print(DHT.temperature);
  Serial.print(",");
  Serial.println(DHT.humidity);
}