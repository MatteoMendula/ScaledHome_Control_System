import paho.mqtt.client as mqtt
import time
from adafruit_servokit import ServoKit
import sys
import os
import RPi.GPIO as GPIO
from datetime import datetime

#-------------------------------- SERVO KIT COMMANDS
kit = ServoKit(channels=16)

def closeMotor(pin):
    kit.servo[pin].angle = getClosingAngle(pin)
def openMotor(pin):
    kit.servo[pin].angle = getOpeningAngle(pin)
def getClosingAngle(pin):
    if pin == 12 or pin == 15:
        return 50
    elif pin == 11:
        return 80
    elif pin == 10:
        return 65
    else:
        return 60
def getOpeningAngle(pin):
    if pin == 2:
        return 150
    elif pin == 13:
        return 150
    elif pin == 15:
        return 160
    else:
        return 180
    
def openAll():
    for x in range(0, 16):
        openMotor(x)        
def closeAll():
    for x in range(0, 16):
        closeMotor(x)
def closeAllDoors():
    for x in range(0, 7):
            closeMotor(x)         
def closeAllWindows():
    for x in range(8, 16):
            closeMotor(x)           
def openAllDoors():
    for x in range(0, 7):
            openMotor(x)        
def openAllWindows():
    for x in range(8, 16):
            openMotor(x)
def loopMotor(pin):
    openMotor(pin)
    time.sleep(5)
    closeMotor(pin)
    time.sleep(5)
    openMotor(pin)
    time.sleep(5)
    closeMotor(pin)
    time.sleep(5)

#------------------------------------- [ GPIO OUTPUT COMMANDS ] -----------------------------
# GPIO OUTPUTS
# 5: lamp
# 6: heater
# 12: fan
# 13: ac    

def setupGPIO():
    GPIO.setup(5,GPIO.OUT)
    GPIO.setup(6,GPIO.OUT)
    GPIO.setup(12,GPIO.OUT)
    GPIO.setup(13,GPIO.OUT)

def turnOnLamp():
    GPIO.output(5,GPIO.HIGH)
    
def turnOffLamp():
    GPIO.output(5,GPIO.LOW)

def turnOnHeater():
    GPIO.output(6,GPIO.HIGH)

def turnOffHeater():
    GPIO.output(6,GPIO.LOW)
    
def turnOnFan():
    GPIO.output(12,GPIO.HIGH)
    
def turnOffFan():
    GPIO.output(12,GPIO.LOW)

def turnOnAc():
    GPIO.output(13,GPIO.HIGH)
    
def turnOffAc():
    GPIO.output(13,GPIO.LOW)
        
#-------------------------------------- [ MQTT ] ---------------------------------------------
# Define event callbacks
def on_connect(client, userdata, flags, rc):
    print("rc: " + str(rc))

def on_message(client, obj, msg):
    msg_raw = str(msg.payload)
    #print('[log matte - msg payload raw]: '+str(msg.payload))
    #print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    msg_cleaned = msg_raw[2:len(msg_raw)-1]
    print('[LOG - from topic '+ msg.topic +' - msg payload cleaned]: '+str(msg_cleaned))
    words = msg_cleaned.split()
    if msg_cleaned == "open all":
        print('Opening all doors')
        openAll()
    elif msg_cleaned == "close all":
        print('Closing all doors')
        closeAll()
    elif msg_cleaned == 'open all doors':
        print("Opening all doors")
        openAllDoors()
    elif msg_cleaned == 'close all doors':
        print("Closing all doors")
        closeAllDoors()
    elif msg_cleaned == 'open all windows':
        print("Opening all windows")
        openAllWindows()
    elif msg_cleaned == 'close all windows':
        print("Closing all windows")
        closeAllWindows()
    elif words[0] == 'open':
        #open based on pin number
        print("opening motor " + words[1])
        openMotor(int(words[1]))
    elif words[0] == 'close':
        #close based on pin number
        print("closing motor " + words[1])
        closeMotor(int(words[1]))
    elif words[0] == 'loop':
        print("looping motor " + words[1])
        loopMotor(int(words[1]))
    elif msg_cleaned == 'lamp on':
        print('Turning on lamp')
        turnOnLamp()
    elif msg_cleaned == 'lamp off':
        print('Turning off lamp')
        turnOffLamp()
    elif msg_cleaned == 'heater on':
        print('Turning on heater')
        turnOnHeater()
    elif msg_cleaned == 'heater off':
        print('Turning off heater')
        turnOffHeater()
    elif msg_cleaned == 'fan on':
        print('Turning on fan')
        turnOnFan()
    elif msg_cleaned == 'fan off':
        print('Turning off fan')
        turnOffFan()
    elif msg_cleaned == 'ac on':
        print('Turning on ac')
        turnOnAc()
    elif msg_cleaned == 'ac off':
        print('Turning off ac')
        turnOffAc()
    else:
        print('Unknown command')

def on_publish(client, obj, mid):
    print("mid: " + str(mid))

def on_subscribe(client, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_log(client, obj, level, string):
    print(string)
    
# setup GPIO uotput
setupGPIO()

#start mqtt client
mqttc = mqtt.Client()
# Assign event callbacks
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.on_subscribe = on_subscribe

# Uncomment to enable debug messages
#mqttc.on_log = on_log

# Parse CLOUDMQTT_URL (or fallback to localhost)
#url_str = 'mqtt://m12.cloudmqtt.com:11110'
#url = urlparse.urlparse(url_str)
url = 'm12.cloudmqtt.com'
port = 11110
topic = 'scaledhome'

# Connect
#mqttc.username_pw_set(url.username, url.password)
mqttc.username_pw_set('actuatorcontroller', 'actuator')
mqttc.connect(url, port)

# Start subscribe, with QoS level 0
mqttc.subscribe(topic, 2)

# Continue the network loop, exit when an error occurs
rc = 0
while rc == 0:
    rc = mqttc.loop()
print("rc: " + str(rc))