var mqtt = require("mqtt");
// var utility = require("../utils/utility");
var mqttClientBehaviour = require ("./mqttClientBehaviour");

class mqttClient{
    constructor(settings, state){
        this.client = mqtt.connect(settings.url,
        {
            clientId: settings.clientId,
            username: settings.username,
            password: settings.password,
            port: settings.port
        });
        this.topic = settings.topic;
        var closure = this;

        this.mqttPublish = this.mqttPublish.bind(this);

        this.client.subscribe(settings.topic,{qos:settings.qos});

        this.client.on("connect",function(){
            // console.log("mqtt client connected "+closure);
            // pub("ciao");
            mqttClientBehaviour.onConnect(closure, settings.topic, state);
            // console.log("connected")
        });

        this.client.on("message",async function(topic,message){	
            // console.log("before on mex")
            // utility.myConsoleLog("main","new mex \""+ message + "\" from topic \""+ topic + "\"");
            mqttClientBehaviour.onMessage(topic, message, closure, state);
            // console.log("after mex: ",message)
        });

    }
  
    mqttPublish(message){
        this.client.publish(this.topic,message);
    }
// BIND?
    // mqttPublish(message){
    //     closure.publish(topic,message);
    // }
    
}

module.exports = mqttClient;