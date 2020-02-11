var mqtt = require("mqtt");
// var utility = require("../utils/utility");
var mqttClientBehaviour = require ("./mqttClientBehaviour");

class mqttClient{
    constructor(settings, state, socket_io="no_socket", simulation_mode){
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
            mqttClientBehaviour.onConnect(closure, settings.topic, state);
        });

        this.client.on("message",async function(topic,message){	
            mqttClientBehaviour.onMessage(topic, message, closure, state, socket_io, simulation_mode);
        });

    }
  
    mqttPublish(message){
        this.client.publish(this.topic,message);
    }
}

module.exports = mqttClient;