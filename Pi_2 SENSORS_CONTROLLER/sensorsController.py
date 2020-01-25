import RPi.GPIO as GPIO
import os
import Adafruit_DHT
import time
import sys
from datetime import datetime
import paho.mqtt.client as mqtt


#------------------------------------- MQTT ----------------------------------------

# Parse CLOUDMQTT_URL 
url = 'm12.cloudmqtt.com'
#ES url='m123.cloudmqtt.com'
port = 11110
topic = 'scaledhome'

def on_connect(client, userdata, flags, rc):
    print("rc: " + str(rc))

def on_message(client, obj, msg):
    #print("new mex")
    msg_raw = str(msg.payload)
    msg_cleaned = msg_raw[2:len(msg_raw)-1]
    print('[LOG - from topic '+ msg.topic +' - msg payload cleaned]: '+str(msg_cleaned))

    if ("discovery: middleware looking for clients" in msg_cleaned):
        message = "discovery_reply: sensors_controller"
        mqttc.publish(topic, message)
    elif ("request: new full record" in msg_cleaned):
        message = "record:"+str(datetime.now())
        
        print("starting to collect data")
        
        for pin in gpioArray:
            print("Collecting temperature from pin: "+str(pin))
            attempts = 0
            while True:
                humidity, temperature_celsius = Adafruit_DHT.read_retry(sensor, pin)
                #temperature_fahrenheit = convertTempFromCtoF(temperature_celsius)
                check_temp = checkTemp (humidity, temperature_celsius, humidity_lower_bound, humidity_upper_bound, temperature_lower_bound, temperature_upper_bound)
                if (check_temp ):
                    print("Ok data pin: "+str(pin))
                    break
                elif (attempts >= attempts_limit):
                    print("Error data pin: "+str(pin))
                    humidity = "error"
                    temperature_fahrenheit = "error"
                    break
                else:
                    attempts += 1
                    time.sleep(1)
            
            #message+= separator+str(temperature_fahrenheit)
            message+= separator+str(temperature_celsius)
            message+=  separator+str(humidity)
            
        time.sleep(1)
        mqttc.publish(topic, message)
        time.sleep(1)


def on_publish(client, obj, mid):
    print("mid: " + str(mid))

def on_subscribe(client, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_log(client, obj, level, string):
    print(string)

mqttc = mqtt.Client()
# Assign event callbacks
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.on_subscribe = on_subscribe

# Uncomment to enable debug messages
#mqttc.on_log = on_log

# Connect
mqttc.username_pw_set('sensors_controller', 'sensors')
mqttc.connect(url, port)

# Start subscribe, with QoS level 0
mqttc.subscribe(topic, 2)
    
#------------------------------- TEMP & HUM ------------------------------------------------

def checkTemp (humidity, temperature, h_lower_bound, h_upper_bound, t_lower_bound, t_upper_bound):
    control = True
    if humidity is None or temperature is None:
        control = False
    elif temperature<t_lower_bound or temperature>t_upper_bound :
        control = False
    elif humidity<h_lower_bound or humidity>h_upper_bound :
        control = False
    return control
    
def convertTempFromCtoF (celsius):
    fahrenheit = (celsius * 9.0 / 5.0) + 32
    return fahrenheit

#------------------------------------------SENSOR

# Set GPIO sensor is connected to
# pin 4: outsise
# pin 6: bedroom 1 (under Living Rm)
# pin 12: Kitchen 1 (by Living Rm door)
# pin 18: kitchen 2 (by bedroom 2)
# pin 19: bathroom () 
# pin 24: Living Rm 1 (far corner)
# pin 25: Living Rm 2 (by doors)
# pin 26: bedroom 2 (under kitchen)

# Set sensor type : Options are DHT11,DHT22 or AM2302
sensor=Adafruit_DHT.DHT11

gpioArray=[4,6,12,18,19,24,25,26]

# seconds = 0

separator = ','
attempts_limit = 5

# humidity is a percentage => h belongs to [0,100]
humidity_lower_bound = 0
humidity_upper_bound = 100

# FAHRENHEIT
# temperature_lower_bound = 60
# temperature_upper_bound = 90

# CELSIUS
temperature_lower_bound = 15
temperature_upper_bound = 33


# new_reading_interval = 30

# message = "header:"
# message += 'TIME'+separator
# message += 'OUT_T[*K]'+separator
# message += 'OUT_H[%]'+separator
# message += 'T6[*K]'+separator
# message += 'H6[%]'+separator
# message += 'T12[*K]'+separator
# message += 'H12[%]'+separator
# message += 'T18[*K]'+separator
# message += 'H18[%]'+separator
# message += 'T19[*K]'+separator
# message += 'H19[%]'+separator
# message += 'T24[*K]'+separator
# message += 'H24[%]'+separator
# message += 'T25[*K]'+separator
# message += 'H25[%]'+separator
# message += 'T26[*K]'+separator
# message += 'H26[%]'
# message += '\n'

# mqttc.publish(topic, message)
# message = ''

# try:
#     while(True):
#         message = "record:"+str(datetime.now())
        
#         print("starting to collect data")
        
#         for pin in gpioArray:
#             print("Collecting temperature from pin: "+str(pin))
#             attempts = 0
#             while True:
#                 humidity, temperature_celsius = Adafruit_DHT.read_retry(sensor, pin)
#                 temperature_fahrenheit = convertTempFromCtoF(temperature_celsius)
#                 check_temp = checkTemp (humidity, temperature_fahrenheit, humidity_lower_bound, humidity_upper_bound, temperature_lower_bound, temperature_upper_bound)
#                 if (check_temp ):
#                     break
#                 elif (attempts >= attempts_limit):
#                     humidity = "error"
#                     temperature_fahrenheit = "error"
#                     break
#                 else:
#                     attempts += 1
#                     time.sleep(1)
            
#             message+= separator+str(temperature_fahrenheit)
#             message+=  separator+str(humidity)
            
#         time.sleep(1)
#         message+='\n'
#         mqttc.publish(topic, message)
#         time.sleep(1)
                                       
#         #set a new reading every new_reading_interval seconds    
#         for i in range(0,new_reading_interval):
#             #print('Next reading in: ' + str(i)+'/60', flush=True)
#             print('Next reading in: ' + str(i)+'/'+str(new_reading_interval))
#             time.sleep(1)
#             seconds += 1
            
# except KeyboardInterrupt:
#         print("Keyboard Interrupt")
# except Exception as e: 
#     	print(e)
# finally:
#         print("Execution is terminated")

# Continue the network loop, exit when an error occurs
rc = 0
while rc == 0:
    rc = mqttc.loop()
print("rc: " + str(rc))