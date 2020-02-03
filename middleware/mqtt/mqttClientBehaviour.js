var settings = require("../constant/houseSettings");
var utility = require("../utils/utility");
var fileManager = require("../utils/fileManager");
var initFunctions = require("../init/initFunctions");
var middlewareActions = require("../actions/middlwareActions");

// This function turns on and off the lamp depending on the SH outside temperature
// the goal is to force a fluctuation of the temperature in the range [min_temperature_SH,max_temperature_SH]
function chageLampAndFanOnSameTemp(client, out_temperature, state){
    utility.myConsoleLog("chageLampAndFanOnSameTemp","Received out temperature = "+ out_temperature);
    if (out_temperature < state.min_temperature_SH){
        state.updateMinTemp(out_temperature);
    }
    if (out_temperature > state.max_temperature_SH){
        state.updateMaxTemp(out_temperature);
    }
    // check if it is in a delta range?
    if (state.last_out_temp == out_temperature){
        state.same_temp_counter++;
        console.log("same temperature counter:",state.same_temp_counter);
        if (state.same_temp_counter > settings.same_temp_limit){
            utility.myConsoleLog("chageLampAndFanOnSameTemp","Reached bound at "+out_temperature+"°C -> changing lamp state")
            if (state.lamp_state == 0){
                middlewareActions.handleLamp(client,"on", state);
                middlewareActions.handleFan(client,"off", state);
            }else{
                middlewareActions.handleLamp(client,"off", state);
                middlewareActions.handleFan(client,"on", state);
            }

            state.same_temp_counter = 0;
        }
    }else{
        state.same_temp_counter = 0;
    }
    state.last_out_temp = out_temperature;
}

function chageLampAndFanIfBound(client, out_temperature, state){
    utility.myConsoleLog("chageLampAndFanIfBound","Received out temperature = "+ out_temperature);
    
    var changeLampAndFanState = (bound) =>{
        if (bound == "lower"){
            if(state.lamp_state == 0) middlewareActions.handleLamp(client,"on", state);
            if(state.fan_state == 1) middlewareActions.handleFan(client,"off", state);
        }else if(bound == "upper"){
            if(state.lamp_state == 0) middlewareActions.handleFan(client,"on", state);
            if(state.fan_state == 1) middlewareActions.handleLamp(client,"off", state);
        }else{
            var log = "Unknown bound (upper/lower allowed)";
            utility.myConsoleLog("chageLampAndFanIfBound", log,2);  
            fileManager.saveOnFile("./log","txt",utility.myStringLog("chageLampAndFanIfBound",log,2));
        }
    }
    
    if (out_temperature < state.min_temperature_SH){
        state.updateMinTemp(out_temperature);
    }
    if (out_temperature > state.max_temperature_SH){
        state.updateMaxTemp(out_temperature);
    }
    // check if it is in a delta range?
    if(out_temperature == settings.max_temp_sh){
        changeLampAndFanState("upper");
    }else if(out_temperature == settings.min_temp_sh){
        changeLampAndFanState("lower");
    }
    state.last_out_temp = out_temperature;
}

async function onMessage(topic, message, mqttClientInstance, state, socket_io){

    var mex = ''+message;

    utility.myConsoleLog("main","new mex \""+ mex + "\" from topic \""+ topic + "\"");

    if (!mex.includes("error")){
        
        var record_file = undefined;
        var record_console = undefined;
          
        if (mex.includes("record:")){

            if (!state.header_has_been_written){

                var header = utility.getHeader(settings.csv_separator);

                fileManager.saveOnFile("./data","csv",header);
                state.header_has_been_written = true; 
            }

            record_file = mex.split("record: ")[1].split(',');

            state.updateStateByRecord(record_file);

            var out_temperature = ''+record_file[1];
            
            // MODE 1
            chageLampAndFanOnSameTemp(mqttClientInstance.mqttPublish, out_temperature, state);  

            // MODE 2
            // chageLampAndFanIfBound(mqttClientInstance.mqttPublish, out_temperature, state);

            if (socket_io != "no_socket"){
                socket_io.emit("record_socket:", state.getStateAsJsonString());
            }

            record_file = state.getStateAsString_no_header();

            for (let i = 0; i < settings.new_request_interval; i++) {
                utility.myConsoleLog("main mqtt onmessage", "new data request in "+parseInt(settings.new_request_interval-i)+" seconds");
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            
            if (state.sensors_controller.state == 1){
                middlewareActions.requestNewRecord(mqttClientInstance.mqttPublish,topic);
            }else{
                console.log("sensors controller is off")
                initFunctions.initSensorsController(mqttClientInstance.mqttPublish, state);
            }
        }else if(mex.includes("discovery_reply: ")){
            var client_id = mex.split("discovery_reply: ")[1];
            if (client_id.includes(state.sensors_controller.id)){
                state.sensors_controller.state = 1;
                record_console = state.sensors_controller.id + " is on";
                initFunctions.initSensorsController(mqttClientInstance.mqttPublish,state);
            }else if (client_id.includes(state.actuators_controller.id)){
                state.actuators_controller.state = 1;
                record_console = state.actuators_controller.id + " is on";
                initFunctions.initActuatorsController(mqttClientInstance.mqttPublish, state);
            }
        }
        
        if (record_file != undefined){
            fileManager.saveOnFile("./data","csv",record_file);  
        }
        if (record_console != undefined){
            utility.myConsoleLog("main mqtt onmessage", record_console);  
            fileManager.saveOnFile("./log","txt",utility.myStringLog("main",record_console,1));
        }

    }else{
        var log = "Bad message, discarding: "+mex;
        utility.myConsoleLog("main",log,1);
        fileManager.saveOnFile("./log","txt",utility.myStringLog("main",log,1));
    }
    
}

function onConnect(mqttClientInstance, topic, state){	
    utility.myConsoleLog("main","connected to topic \"" + topic + "\"");
    // console.log("client is ",mqttClientInstance.mqttPublish)
    initFunctions.initMiddlware(mqttClientInstance.mqttPublish, state);
}

module.exports = {
    onMessage: onMessage,
    onConnect: onConnect
}