var utility = require("../utils/utility");
var fileManager = require("../utils/fileManager");
var settings = require("../constant/houseSettings");

function handleLamp(mqttPublish,action, state){
    var log = "Turning lamp "+action;
    utility.myConsoleLog("handleLamp",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("handleLamp",log));
    mqttPublish("cmd: lamp "+action);
    // console.log("handle lamp client", client);
    state.lamp_state = (action == "on") ? 1 : 0;
}

function handleHeater(mqttPublish,action, state){
    var log = "Turning heater "+action;
    utility.myConsoleLog("handleHeater",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("handleHeater",log));
    mqttPublish("cmd: heater "+action);
    // console.log("handleHeater client", client);
    state.heater_state = (action == "on") ? 1 : 0;
}

function handleAc(mqttPublish,action, state){
    var log = "Turning ac "+action;
    utility.myConsoleLog("handleAc",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("handleAc",log));
    mqttPublish("cmd: ac "+action);
    // console.log("handleAc client", client);
    state.ac_state = (action == "on") ? 1 : 0;
}

function handleFan(mqttPublish,action, state){
    var log = "Turning fan "+action;
    utility.myConsoleLog("handleFan",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("handleFan",log));
    mqttPublish("cmd: fan "+action);
    // console.log("handleFan client", client);
    state.fan_state = (action == "on") ? 1 : 0;
}

function handleMotors(mqttPublish,action, state,pin = "all"){
    if (pin == "all" || settings.allowed_motors.includes(pin)){
        var log = (action == "open") ? "Opening "+pin : "Closing "+pin;
        utility.myConsoleLog("handleMotors",log);
        fileManager.saveOnFile("./log","txt",utility.myStringLog("handleMotors",log));
        mqttPublish("cmd: "+action+' '+pin);
        // console.log("handle motors", client)
        if (pin == "all"){
            for (var index in settings.allowed_motors){
                state.motors_state[index] = action;
            }
        }else{
            state.motors_state[pin] = action;
        }
    }
}

function requestNewRecord(mqttPublish){
    var log = "Requesting new record";
    utility.myConsoleLog("requestData",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("requestData",log));
    mqttPublish("request: new full record");
    // console.log("client", client)
}

module.exports = {
    handleLamp: handleLamp,
    handleHeater: handleHeater,
    handleAc: handleAc,
    handleFan: handleFan,
    handleMotors: handleMotors,
    requestNewRecord: requestNewRecord
}