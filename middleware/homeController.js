var mqtt = require('mqtt');
var topic = "scaledhome";

const fs = require('fs');

var params = process.argv.slice(2);

var mode = "manual";
var min_temperature_SH =  71.4;
var max_temperature_SH =  82.2;

// estimated uncertainty of measurement
var delta = 2;

function writeFile(file_name,message){
    fs.appendFile(file_name, message, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
        console.log('Saved!');
    });
}

function handleLamp(client,action){
    console.log("[LOG handleLamp] Turning lamp "+action);
    client.publish(topic, "lamp "+action);
}

function saveOnFile(path, file_name,content){
    console.log("writing on file.. ");
    writeFile(path+'/'+file_name,content);
}

// This function turns on and off the lamp depending on the SH outside temperature
// the goal is to force a fluctuation of the temperature in the range [min_temperature_SH,max_temperature_SH]
function environmentSimulation(client, out_temperature){
    console.log("[LOG environmentSimulation] Received out temperature = ", out_temperature);
    if (out_temperature >= max_temperature_SH - delta) {
        handleLamp(client,"off");
    }else if (out_temperature <= min_temperature_SH + delta) {
        handleLamp(client,"on");
    }
}

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
    console.log("connected to topic");
});

client.on('message',function(topic, message){

    var mex = ''+message;

    if (!mex.includes("error")){
        
        if (process.env._ && !process.env._.indexOf("heroku"))
            saveOnFile("./data","data.csv",mex);

        if (mode == "auto" && mex.includes("record:")){

            var out_temperature = ''+mex.split("record:")[1].split(',')[1];

            environmentSimulation(client, out_temperature);            

            // TO DO: UPDATE SCALED HOME MAX AND MIN TEMPERATURE (???)
        }

    }else{
        console.log("Bad data, discarding: ",mex);
    }
    
});

/*
    setTimeout(()=> {client.publish(topic, "close all");}, 3000);
//*/
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
}else if (params[0] == "lampOn"){
    client.publish(topic, "lamp on");
}else if (params[0] == "lampOff"){
    client.publish(topic, "lamp off");
}else if (params[0] == "heaterOn"){
    client.publish(topic, "heater on");
}else if (params[0] == "heaterOff"){
    client.publish(topic, "heater off");
}else if (params[0] == "fanOn"){
    client.publish(topic, "fan on");
}else if (params[0] == "fanOff"){
    client.publish(topic, "fan off");
}else if (params[0] == "acOn"){
    client.publish(topic, "ac on");
}else if (params[0] == "acOff"){
    client.publish(topic, "ac off");
}else if (params[0] == "auto"){
    mode = "auto";
}else{
    console.log("Unknown command");
}

console.log("mode: ",mode);