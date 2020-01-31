// var settings = require("./constant/houseSettings");
// var utility = require("./utils/utility");
// var fileManager = require("./utils/fileManager");
var mqttClient = require("./mqtt/mqttClientInstance");
var mqttSettings = require("./mqtt/mqttSettings");

var houseState = require("./model/state");

var houseState = new houseState();

var mqttClient = new mqttClient(mqttSettings, houseState);



// estimated uncertainty of measurement
// var delta = 0.2;


// vanno spostate in mqqclientinstance
// client.on("connect",);

// client.on('message',);

/*
    setTimeout(()=> {client.publish(topic, "close all");}, 3000);
//*/

//client.publish(topic,"hello");

/*

rl.prompt();

(function inputInterface(client,topic){
    rl.question('Type a command: ', (cmd) => {
        var cmd = ''+cmd;
      console.log(`Typed command is: ${cmd} + ${topic}`);
  
      if ( (settings.allowed_commands.includes(cmd)) || 
              ((cmd.split(" ")[0] == "open" || cmd.split(" ")[0] == "close")&& settings.allowed_motors.includes(parseInt(cmd.split(" ")[1])))){
            client.publish(topic,"cmd: "+cmd);
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
    console.log(cmd);
});

rl.on('close', function (cmd) {
    process.exit(0);
});

//*/