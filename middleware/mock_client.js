var mqtt = require('mqtt');
var readline = require('readline');
var utils = require("./utils/utility");
var topic = "scaledhome";

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

client.on('message',function(topic, message){

    var mex = ''+message;

    utils.myConsoleLog("main","new mex \""+ mex + "\" from topic \""+ topic + "\"");
    
});

rl.prompt();

(function inputInterface(client,topic){
    rl.question('Type a command: ', (cmd) => {
        var cmd = ''+cmd;
      console.log(`Typed command is: ${cmd} + ${topic}`);
  
      client.publish(topic,cmd);
            var log = "sent cmd-> "+cmd;
            utils.myConsoleLog("inputInterface",log);
  
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