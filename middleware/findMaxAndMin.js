var settings = require("./constant/settings");
var utils = require("./utils/utility");

var mqtt = require('mqtt');
var readline = require('readline');

var topic = "scaledhome";

const fs = require('fs');

//*
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//*/
var previous_temp = "initial_value";
var max_temperature_SH = -100000;
var min_temperature_SH = 100000;
var lamp_state = 0; // -> maybe this has to be moved to a singleton class

// estimated uncertainty of measurement
var delta = 0.2;

function handleLamp(client,action){
    var log = "Turning lamp "+action;
    utils.myConsoleLog("handleLamp",log);
    saveOnFile("./log","log.txt",log);
    client.publish(topic, "lamp "+action);
    lamp_state = (action == "on") ? 1 : 0;
}

function writeFile(file_name,message){
    fs.appendFile(file_name, message, (err) => {
        // throws an error, you could also catch it here
        if (err){
            utils.myConsoleLog("writeFile","Unable to save on file \""+file_name+"\"",2);
            throw err;  
        }else{
            utils.myConsoleLog("writeFile","File \""+file_name+"\" saved successfully!",0)
        } 
    });
}

function saveOnFile(path, file_name,content){
    if (process.env._ && process.env._.indexOf("heroku") == -1){
        utils.myConsoleLog("saveOnFile","Writing on file-> "+file_name,0);
        writeFile(path+'/'+file_name,content);
    }else{
        utils.myConsoleLog("saveOnFile","Not saved on file because, thread is running on heroku",1);
    }
    
}

function updateMaxTemp(new_temp){
    var previous_temp = max_temperature_SH;
    max_temperature_SH = new_temp;
    var log = "Max temp has been updated from: "+previous_temp+" to: "+max_temperature_SH;
    utils.myConsoleLog("updateMaxTemp",log,0);
    saveOnFile("./log","log.txt",utils.myStringLog("updateMaxTemp",log));
}

function updateMinTemp(new_temp){
    var previous_temp = min_temperature_SH;
    min_temperature_SH = new_temp;
    var log = "Min temp has been updated from: "+previous_temp+" to: "+min_temperature_SH;
    utils.myConsoleLog("updateMinTemp",log);
    saveOnFile("./log","log.txt",utils.myStringLog("updateMinTemp",log));
}

// This function turns on and off the lamp depending on the SH outside temperature
// the goal is to force a fluctuation of the temperature in the range [min_temperature_SH,max_temperature_SH]
function checkTempBounds(client, out_temperature){
    utils.myConsoleLog("checkTempBounds","Received out temperature = "+ out_temperature);
    if (out_temperature < min_temperature_SH){
        updateMinTemp(out_temperature);
    }
    if (out_temperature > max_temperature_SH){
        updateMaxTemp(out_temperature);
    }

    // check if it is in a delta range?
    if (previous_temp == out_temperature){
        utils.myConsoleLog("checkTempBounds","Reached bound at "+out_temperature+"°F -> changing lamp state")
        if (lamp_state == 0){
            handleLamp(client,"on");
        } else if (lamp_state == 1){
            handleLamp(client,"off");
        }else{
            utils.myConsoleLog("checkTempBounds","Unknown lamp state");
        }
    }

    previous_temp = out_temperature;
}

var client  = mqtt.connect("mqtt://m12.cloudmqtt.com",
                            {
                                clientId:"mqttjs01",
                                username: "homecontroller",
                                password: "home",
                                port: 11110
                            });

client.subscribe(topic,{qos:2});

client.on("connect",function(){	
    utils.myConsoleLog("main","connected to topic \"" + topic + "\"");
});

client.on('message',function(topic, message){

    var mex = ''+message;

    utils.myConsoleLog("main","new mex \""+ mex + "\" from topic \""+ topic + "\"");

    if (!mex.includes("error")){
        
        
        saveOnFile("./data","data.csv",mex.split("record:")[1]);    

        if (mex.includes("record:")){

            var out_temperature = ''+mex.split("record:")[1].split(',')[1];

            checkTempBounds(client, out_temperature);            
        }

    }else{
        var log = "Bad data, discarding: "+mex;
        utils.myConsoleLog("main",log,1);
        saveOnFile("./log","log.txt",myStringLog("main",log,1));
    }
    
});

/*
    setTimeout(()=> {client.publish(topic, "close all");}, 3000);
//*/

//client.publish(topic,"hello");

//*

rl.prompt();

(function inputInterface(client,topic){
    rl.question('Type a command: ', (cmd) => {
        var cmd = ''+cmd;
      console.log(`Typed command is: ${cmd} + ${topic}`);
  
      if ( (settings.allowed_commands.includes(cmd)) || 
              ((cmd.split(" ")[0] == "open" || cmd.split(" ")[0] == "close")&& settings.allowed_motors.includes(parseInt(cmd.split(" ")[1])))){
            client.publish(topic,cmd);
            var log = "sent cmd-> "+cmd;
            utils.myConsoleLog("inputInterface",log);
            saveOnFile("./log","log.txt",utils.myStringLog("inputInterface",log,0));
      }else{
            utils.myConsoleLog("inputInterface","Unknown command \"" + cmd + "\"",1);
      }
  
      inputInterface(client,topic);
    });
  })(client,topic);

rl.on('line', function (cmd) {

    // input.push(cmd);
    console.log(cmd);
});

rl.on('close', function (cmd) {
    process.exit(0);
});

//*/