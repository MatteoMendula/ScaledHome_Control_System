var mqtt = require('mqtt');
var readline = require('readline');
var utility = require("./utils/utility");
var topic = "scaledhome";
var settings = require("./constant/houseSettings");
var fileManager = require("./utils/fileManager")

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var client  = mqtt.connect("mqtt://m12.cloudmqtt.com",
                            {
                                clientId:"mqttjs02",
                                username: "mock",
                                password: "123",
                                port: 11110
                            });

client.subscribe(topic,{qos:2});

function wrap(topic, message, nome){
	var mex = ''+message;

    utility.myConsoleLog("main","new mex \""+ mex + "\" from topic \""+ topic + "\" - "+nome+"");
}

client.on('message',function(topic, message){

    wrap(topic, message, "wrapping")
    
});

rl.prompt();

(function inputInterface(client,topic){
    rl.question('Type a command: ', (cmd) => {
        var cmd = ''+cmd;
        console.log(`Typed command is: ${cmd} + ${topic}`);
        // var filter = (settings.allowed_commands.includes(cmd)) || 
        // ((cmd.split(" ")[0] == "open" || cmd.split(" ")[0] == "close")&& settings.allowed_motors.includes(parseInt(cmd.split(" ")[1])));
        var filter = true; 
      if (filter){
            client.publish(topic,cmd);
            var log = "sent cmd-> "+cmd;
            utility.myConsoleLog("inputInterface",log);
            fileManager.saveOnFile("./log","txt",utility.myStringLog("inputInterface",log,0));
      }else{
            utility.myConsoleLog("inputInterface","Unknown command \"" + cmd + "\"",1);
      }
  
      inputInterface(client,topic);
    });
  })(client,topic);

rl.on('line', function (cmd) {
    console.log(cmd);
});

rl.on('close', function (cmd) {
    process.exit(0);
});