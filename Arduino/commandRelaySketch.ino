// Robot IR Remote - Version: Latest 
#include <IRremote.h>

IRsend irsend;
byte buffer[4];

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 0);
  Serial.setTimeout(1000);
}

void loop() 
{
    if(Serial.available() > 0)
    {
        int readbytes = Serial.readBytes(buffer, sizeof(buffer));
        if(readbytes == 4)
        {
          /* Debug input
            Serial.write(buffer[0]);
            delay(10);
            Serial.write(buffer[1]);
            delay(10);
            Serial.write(buffer[2]);
            delay(10);
            Serial.write(buffer[3]);
            delay(10);
            */
            unsigned long command = 0x80BF0000; //All commands start with 80BF
            command |= (buffer[1] << 8);
            command |= (buffer[0]);
            
            irsend.sendNEC(command, 32);
        }
        else
        {
          //to notify an incorrect packet was received
          digitalWrite(LED_BUILTIN, 1);
        }
    }
}
