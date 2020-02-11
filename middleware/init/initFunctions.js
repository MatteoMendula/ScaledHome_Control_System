var utility = require("../utils/utility");
var fileManager = require("../utils/fileManager");
var middlewareActions = require("../actions/middlwareActions");

async function initMiddlware(mqttPublish, state){
    var log = "Middleware init procedure";
    utility.myConsoleLog("initMiddlware",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("initMiddlware",log));

    // var control = state.actuators_controller.state == 0 || state.sensors_controller.state == 0 ; 
    var control = false;
    
    do{
        mqttPublish("discovery: middleware looking for clients");
        
        if (state.actuators_controller.conn_attempts > 0 && state.actuators_controller.state == 0){
            var log = "Actuators controller is not connected connection attempt: "+state.actuators_controller.conn_attempts;
            utility.myConsoleLog("initMiddlware",log);
            fileManager.saveOnFile("./log","txt",utility.myStringLog("initMiddlware",log));
        }

        if (state.sensors_controller.conn_attempts > 0 && state.sensors_controller.state == 0){
            var log = "Sensors controller is not connected, connection attempt: "+state.sensors_controller.conn_attempts;
            utility.myConsoleLog("initMiddlware",log);
            fileManager.saveOnFile("./log","txt",utility.myStringLog("initMiddlware",log));
        }
        state.actuators_controller.conn_attempts++;
        state.sensors_controller.conn_attempts++;

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    while(control);
    
}

function initActuatorsController(client, state){
    var log = state.actuators_controller.id+" init procedure";
    utility.myConsoleLog("initActuatorsController",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("initActuatorsController",log));

    middlewareActions.handleLamp(client,"off", state);
    middlewareActions.handleHeater(client,"off", state);
    middlewareActions.handleAc(client,"off", state);
    middlewareActions.handleFan(client,"off", state);
    middlewareActions.handleMotors(client,"close", state);
}

function initSensorsController(client, state){
    var log = state.sensors_controller.id+" init procedure";
    utility.myConsoleLog("initSensorsController",log);
    fileManager.saveOnFile("./log","txt",utility.myStringLog("initSensorsController",log));
    middlewareActions.requestNewRecord(client);
}

module.exports = {
    initMiddlware: initMiddlware,
    initActuatorsController: initActuatorsController,
    initSensorsController: initSensorsController
}