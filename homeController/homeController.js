var mqtt    = require('mqtt');
var topic = "scaledhome";

var params = process.argv.slice(2);

var client  = mqtt.connect("mqtt://m12.cloudmqtt.com",
                            {
                                clientId:"mqttjs01",
                                username: "homecontroller",
                                password: "home",
                                port: 11110
                            });

client.subscribe(topic,{qos:2});

//var client  = mqtt.connect('mqtt://test.mosquitto.org');
client.on("connect",function(){	
    console.log("connected");
    /*
    client.publish(topic, "ciao");
    client.publish(topic, "open all");
    client.publish(topic, "ciao");
    setTimeout(()=> {client.publish(topic, "close all");}, 3000);
    */
    if (params[0] == "closeAll"){
        client.publish(topic, "close all");
    }else if (params[0] == "openAll"){
        client.publish(topic, "open all");
    }else if (params[0] == "openAllDoors"){
        client.publish(topic, "open all doors");
    }else if (params[0] == "closeAllDoors"){
        client.publish(topic, "close all doors");
    }else if (params[0] == "openAllWindows"){
        client.publish(topic, "open all windows");
    }else if (params[0] == "closeAllWindows"){
        client.publish(topic, "close all windows");
    }else if (params[0] == "open"){
        client.publish(topic, "open "+params[1]);
    }else if (params[0] == "close"){
        client.publish(topic, "close "+params[1]);
    }else if (params[0] == "loop"){
        client.publish(topic, "loop "+params[1]);
    }else{
        console.log("Unknown command");
    }
});

client.on('message',function(topic, message, packet){
	console.log("message is "+ message);
	console.log("topic is "+ topic);
});