# ScaledHome MQTT Architecture
This repo has been written to document what has been done during my internship period at University of Central Florida (Orlando, FL) in terms of architecture design and distributed system techniques in order to make the ScaledHome project available remotely via a MQTT server broker.

![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/logo.png?raw=true)

**Table of Contents**

1. [What](#What)
	- [ScaledHome project](#ScaledHome-project)
	- [Structure](#Structure)
	- [Mqtt](#Mqtt)
		- [Mqtt Broker](#Mqtt-Broker)

2. [Why](#Why)
	- [Requirements](#Requirements)
	- [Solutions](#Solutions)
	- [Choosen architecture](#Choosen-architecture)

3. [How](#How)
	- [Mqtt Broker: CloudMqtt](#Mqtt-Broker-CloudMqtt)
	- [Mqtt Clients](#Mqtt-Clients)
		- [Python clients](#Python-clients)
			-  [Pi 1: Motors Controller](#Pi-1-Motors-Controller)
			- [Pi 2: Motors Controller](#Pi-2-Motors-Controller)
		- [Nodejs client: homeController](#Nodejs-client-homeController)

4. [Getting Started](#Getting-Started)


# What
## ScaledHome project
ScaledHome is a physical scale model of a suburban home.
The plan is to model the environment (weather, sunshine), the physical properties of the home, the heating/cooling balance of the interior of the home, as well as energy generation (solar panels) and storage capabilities.

![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/structure.jpg?raw=true)

The house is composed by:
- 6 rooms of different sizes
- 8 windows
- 7 doors
- 7 sensors for temperature and moisture
- 1 external fan to decrease the outside temperature
- 1 external lamp to increase the outside temperature
## Structure
ScaledHome is controlled and managed by two Raspberry Pi 3; one controls the windows and doors motors while the other one controls the fan, the lamp and the temperature and humidity sensors.

![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/Architecture%20ScaledHome%200.png?raw=true)

## Mqtt
MQTT[2] (MQ Telemetry Transport) is an open OASIS and ISO standard (ISO/IEC PRF 20922)[3] lightweight, publish-subscribe network protocol that transports messages between devices. The protocol usually runs over TCP/IP; however, any network protocol that provides ordered, lossless, bi-directional connections can support MQTT.[4] It is designed for connections with remote locations where a "small code footprint" is required or the network bandwidth is limited.
### Mqtt Broker
Broker acts as a post office, MQTT doesn’t use the address of the intended recipient but uses the subject line called “Topic”, and anyone who want a copy of that message will subscribes to that topic. Multiple clients can receive the message from a single broker (one to many capability). Similar, multiple publisher can publish topics to a single subscriber (many to one).
Each client can both produce and subscribe the date by both publishing and subscribing, i.e. the devices can publish sensor data and still be able to receive the configuration information or control commands (MQQT is bidirectional communication protocol). This helps in both sharing data, managing and controlling devices.
# Why
One of the main goals of the project is to make available ScaledHome from outside via an internet protocol in order to improve the quantity and the quality of data collected by the model and so achive better predictive capabilities.
## Requirements
The two Raspberry Pi have to interact each other with a lightweight and fast protocol because the goal is to provide to them a scenario (a file) that contains all the instruction they have to perform. In this way a greated decoupling has been guaranteed and also it enables the simulation of several habits of the ScaledHome's inhabitants.

## Solutions
In order to make the two controllers cooperating each other several options has been evaluated, here two of them has been listed and compared in order to find the best one:
- REST interaction: the first idea was to place on the actuator controller a WebServer capable of receiving instructions and execute them and then replying with the status of the actuators system.
- Pub/Sub interaction: the second one was to avoid a direct interaction between the two controllers and to place a rendezvous point between the two, such as a Pub/Sub Broker entity. This broker also has to communicate with another entity, that has been called “Home Controller”, which plays a tougher role in terms of responsibilities and computation than the other two controller.

The first solution has the great advantage of being simpler that the other one, in fact the number of entities involved is lower and their interaction is based on a http connection which is very well compatible with an heterogeneous set of other technologies.
But on the other hand the introduction of a rendezvous point guarantees a greater decoupling in time and space, and doing this way the two controllers have just to perform instructions and collect the data while the business logic and the coordination of the system is dedicated to the entity with the better computational capabilities.
Furthermore the Home Controller can be used from the outside to collect data and run simulations via a Web Server interface.
In addition the Home Controller can serve as the bridge between the Machine Learning engine and the set of simpler and less smart devices close to the house.

- REST solution
![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/Architecture%20ScaledHome%201.png?raw=true)

- PubSub solution
![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/Architecture%20ScaledHome%202.png?raw=true)
## Choosen architecture
Overall the second architecture appears more scalable because the simpler devices close to the house have just to perform instructions and collect data while the Home Controller manages the interaction with the outside components which are more capable in terms of computation. 
Also the second architecture provides a better defined partitioning of roles inside the system because each component has a specific duty to perform.
	The second solution suggest a splitting of components into two different sets:
	- The local components set: it is composed by all the actuators and the sensors and their controllers.
	- The remote componets set: it is composed by one or more Home Controller and by the Machine Learning engine.

# How
Mqtt is a lightweight standard that implements the PubSub interaction and it has been choosen as the right technology because it is quite well spread, so there are Open Source projects that provides interfaces for different languages and also there are several Cloud brokers that can be used for free if your application requires a limited number of clients.

## Mqtt Broker: CloudMqtt
CloudMqtt is one of the more used cloud Mqtt Brokers among the IoT community, you can create easily a free account that will provide you a Mqtt Broker able to manage up to 5 clients and an unlimited number of topics.
You can set usernames and passwords to secure your topics and connect to them from clients written in different languages.

------------


**CloudMqtt web site:**[https://www.cloudmqtt.com/](https://www.cloudmqtt.com/ "https://www.cloudmqtt.com/")

## Mqtt Clients
Once you have successfully created you CloudMqtt account and appropriately set the topics and the clients credentials you can subscribe and publish to the topic from different clients. The only requirements is to limit their cardinality up to 5.

In order to maintain the previous work done by the Professor Turgut's team it has been decided to keep Python as the only language on the two Raspberry Pi, in fact has been possibile to reuse some code in order to perform the scenario's actions on the two local controllers. While the home controller client has been coded with Nodejs because it is more suitable for a WebServer interface from the outside.

### Python clients
Once you have successfully installed the required module as follows:
`$ pip3 install paho-mqtt`
You can import and use the paho.mqtt.client module in your client's code:
```python
import paho.mqtt.client as mqtt

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

mqttc = mqtt.Client()
# Assign event callbacks
mqttc.on_message = on_message
mqttc.on_connect = on_connect
mqttc.on_publish = on_publish
mqttc.on_subscribe = on_subscribe

# Uncomment to enable debug messages
#mqttc.on_log = on_log

# Parse CLOUDMQTT_URL 
url = 'YOUR_INSTANCE.cloudmqtt.com'
#ES url='m123.cloudmqtt.com'
port = 99999
topic = 'YOUR_TOPIC'

# Connect
mqttc.username_pw_set('USERNAME', 'PASSWORD')
mqttc.connect(url, port)

# Start subscribe, with QoS level 0
mqttc.subscribe(topic, 2)

# Publish a message
mqttc.publish(topic, "my message")
```

While on the other hand each of them requires particular modules in oder to collect or perform the needed instructions.

#### Pi 1: Motors Controller
The Motors Controller moves the windows and the doors motors performing the instructions provided by the homeController.
It requires a particular python module to rotate the motors of a specific angle, this module is called adafruit_servokit.
You can install it with:
`$ pip3 install adafruit-circuitpython-servokit`
Then you have to import and use that module as follows:
```python
from adafruit_servokit import ServoKit
def closeMotor(pin):
    kit.servo[pin].angle = getClosingAngle(pin)
def openMotor(pin):
    kit.servo[pin].angle = getOpeningAngle(pin)
```


#### Pi 2: Sensors and Environment Controller
The Sensors and Environment Controller which controls the fan, the lamp and the temperature and moisture sensors uses a python module called RPi.GPIO which is already preinstalled in the Raspberry Pi.
So you can just import it and uses as follows:
```python
import paho.mqtt.client as mqtt
# Code used to collect temperature and moisture
humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

# Code used to turn on and off lamp and fan
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
```

### Nodejs client: homeController
HomeController has been coded in Nodejs, the only required package is mqtt.
You can import it with:
`$ npm install mqtt`
And then use it as follows:
```javascript
var mqtt    = require('mqtt');
var client  = mqtt.connect("mqtt://m12.cloudmqtt.com",
                            {
                                clientId:"YOUR_ID",
                                username: "YOUR_USERNAME",
                                password: "YOUR_PWD",
                                port: 99999
                            });

client.subscribe(topic,{qos:2});

client.on("connect",function(){	
    console.log("connected");
    if (params[0] == "closeAll"){
        client.publish(topic, "close all");
	}
}
```
## Getting Started
1. Be sure that the two controllers are running and that the corresponding raspberry pi are connected to the network
2. With NodeJS installed on the desired machine, run the commands: `$ npm install` and then `$ npm start` in the main folder of the repository to install the required dependencies and start the application.
3. To check if the application is working properly open the browser and go to `http://localhost:3000/` to interact with the ScaledHome system through the Web GUI.
4. Then the REST API will reply to post requests with the following parameters:
	- key: `scaledHomeUcf`
	- type: `cmd`/`request`
	- value: the spefic required action (`last record` or `all records collected as string` in case of a `request` type)
The following is a simple example of usage of the API to handle the lamp state
```python
def handleLamp(state):
    value = "lamp on" if state==1 else "lamp off"
    data = {    
        "key": api_key, 
        "type": "cmd",
        "value": value
    }
    response = requests.post(url = api_endpoint, data = data)  
    pastebin_url = response.text 
    print("[Handle lamp action: {0}] Reponse is: {1}".format(value,pastebin_url)) 
}
```
The following are the possibile combinations of types and values:
	1. type: `cmd`
		- value: `lamp`/`heater`/`fan`/`ac` `on`/`off`, `open`/`close` motor [`0-6`,`7-15`], `open`/`close` `all`/`all windows`/`all doors`
	2. type: `request`
		- value: `last record`, `all records collected as string`

The following picture shows the mapping between the sensors and the actuators indexes and their location inside the house
![](https://github.com/MatteoMendula/UCF_ScaledHomeMqtt/blob/master/imgs/layout%20with%20motors%20and%20rooms.jpg?raw=true)
