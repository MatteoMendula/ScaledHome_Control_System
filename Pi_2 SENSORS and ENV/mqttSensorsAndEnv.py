import RPi.GPIO as GPIO
import os
import Adafruit_DHT
import time
import sys
from datetime import datetime
import paho.mqtt.client as mqtt


#-------------------------------- MQTT
# Define event callbacks
def on_connect(client, userdata, flags, rc):
    print("rc: " + str(rc))

def on_message(client, obj, msg):
    msg_raw = str(msg.payload)
    #print('[log matte - msg payload raw]: '+str(msg.payload))
    #print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    msg_cleaned = msg_raw[2:len(msg_raw)-1]
    print('[LOG - from topic '+ msg.topic +' - msg payload cleaned]: '+str(msg_cleaned))

def on_publish(client, obj, mid):
    print("mid: " + str(mid))

def on_subscribe(client, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_log(client, obj, level, string):
    print(string)
#--------------------------------------------- GPIO
def checkTemp (gpio):
    if humidity is None:
        print("Bad data")
    elif humidity is not None and temperature is not None:
        temp = (temperature * 9.0 / 5.0) + 32
        print('Temp={0:0.2f}*F  Humidity={1:0.2f}%'.format(temp, humidity))
    else:
        print('Failed to get reading. Try again!')

def setup():
    GPIO.setmode(GPIO.BCM)
    
    GPIO.setup(21, GPIO.OUT) #set heating lamp as output
    GPIO.setup(20, GPIO.OUT) #set fan as output
    
    GPIO.output(21, GPIO.LOW)
    GPIO.output(20, GPIO.LOW)

# LAMP
def turnOffLamp(pin):
	GPIO.output(pin, GPIO.LOW)
	
def turnOnLamp(pin):
	GPIO.output(pin, GPIO.HIGH)
	
#FAN
def turnOffFan(pin):
	GPIO.output(pin, GPIO.LOW)
	
def turnOnFan(pin):
	GPIO.output(pin, GPIO.HIGH)

#-------------------------------------MQTT CODE

mqttc = mqtt.Client()
# Assign event callbacks
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.on_subscribe = on_subscribe

# Uncomment to enable debug messages
#mqttc.on_log = on_log

# Parse CLOUDMQTT_URL 
url = 'm12.cloudmqtt.com'
#ES url='m123.cloudmqtt.com'
port = 11110
topic = 'scaledhome'

# Connect
mqttc.username_pw_set('sensorcontroller', 'sensor')
mqttc.connect(url, port)

# Start subscribe, with QoS level 0
mqttc.subscribe(topic, 2)

# Publish a message
mqttc.publish(topic, "my message")

#------------------------------------------SENSOR + LAMP + FAN
# Set sensor type : Options are DHT11,DHT22 or AM2302
sensor=Adafruit_DHT.DHT11
 
# Set GPIO sensor is connected to
# pin 4: bathroom ()
# pin 6: bedroom 1 (under Living Rm)
# pin 12: Kitchen 1 (by Living Rm door)
# pin 18: kitchen 2 (by bedroom 2)
# pin 24: Living Rm 1 (far corner)
# pin 25: Living Rm 2 (by doors)
# pin 26: bedroom 2 (under kitchen)

gpioArray=[4,6,12,18,24,25,26]
 
# Use read_retry method. This will retry up to 15 times to
# get a sensor reading (waiting 2 seconds between each retry).

#humidity, temperature = Adafruit_DHT.read_retry(sensor, gpio)
 
# get temp and check if valid

seconds = 0
lamp_state = 0
fan_state = 0

setup()
turnOnLamp(21)
lamp_state = 1
turnOnFan(20)
fan_state = 1

try:
    while(True):
        #getTemp(18)
        print("hello")
        message = '\n'
        message+= str(datetime.now())
        message+= '\t'
        message+= str(lamp_state)
        message+= '\t'
        message+= str(fan_state)
        
        print("collecting data")
        
        for pin in gpioArray:
            humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
            print(pin)
            checkTemp(pin)
            temp = 0
            if humidity is None:
                # bad data?
                humidity = -1
            if temperature is None:
                # bad data?
                temp = -1
            else:
                temp = (temperature * 9.0 / 5.0) + 32
            
            message += str(humidity)
            message+= '\t'
            message += str(temp)
            message+= '\t'
        time.sleep(1)    
        mqttc.publish(topic, message)
        time.sleep(1)
                        
                
            
        for i in range(0,60):
            print('Next reading in: ' + str(i)+'/60', flush=True)
            time.sleep(1)
            seconds += 1
            
            if seconds % 900 == 0:
                if lamp_state == 0:
                    print("turning on lamp")
                    turnOnLamp(21)
                    lamp_state = 1
                else:
                    print("turning off lamp")
                    turnOffLamp(21)
                    lamp_state = 0
                    
            if seconds % 300 == 0:
                if fan_state == 0:
                    print("turning on fan")
                    turnOnFan(20)
                    fan_state = 1
                else:
                    print("turning off fan")
                    turnOffFan(20)
                    fan_state = 0
except KeyboardInterrupt:
        print("Keyboard Interrupt")
except Exception as e: 
    	print(e)
finally:
        GPIO.cleanup()

# Continue the network loop, exit when an error occurs
rc = 0
while rc == 0:
    rc = mqttc.loop()
print("rc: " + str(rc))






