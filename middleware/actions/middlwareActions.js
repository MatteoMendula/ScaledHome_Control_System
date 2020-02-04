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

function handleMotors(mqttPublish,action, state,motor = "all"){
    binary_action = (action == "open") ? 1 : 0;
    var motors_to_change = [];
    if (motor == "all"){
        motors_to_change = settings.allowed_motors;
    }else if (motor == "all doors"){
        motors_to_change = settings.allowed_motors.filter(function(x){return x<7});
    }else if (motor == "all windows"){
        motors_to_change = settings.allowed_motors.filter(function(x){return x>7})
    }else{
        motors_to_change = [motor];
    }
    mqttPublish("cmd: "+action+' '+motor);

    // console.log("changing ",motors_to_change)

    for (var m in motors_to_change){
        // console.log(m)
        state.motors_state[motors_to_change[m]] = binary_action;
    }

    // for (var i = 0; i < motors_to_change.length; i++){
    //     state.motors_state[motors_to_change[i]] = binary_action;
    // }

    var log = (action == "open") ? "Opening "+motor : "Closing "+motor;
    utility.myConsoleLog("handleMotors",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("handleMotors",log));
    
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