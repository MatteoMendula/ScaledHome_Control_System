var utility = require ("../utils/utility");
var fileManager = require ("../utils/fileManager");
var settings = require("../constant/houseSettings");

class houseState{
    constructor(){
        this.last_out_temp = "initial_value";
        this.same_temp_counter = 0;
        this.max_temperature_SH = -100000;
        this.min_temperature_SH = 100000;

        this.lamp_state = "initial_value"; // -> maybe this has to be moved to a singleton class
        this.fan_state = "initial_value";
        this.ac_state = "initial_value";
        this.heater_state = "initial_value";

        
        this.header_has_been_written = false;

        this.sensors_controller = {
            id: "sensors_controller",
            state: 0,
            conn_attempts: 0
        };
        this.actuators_controller = {
            id: "actuators_controller",
            state: 0,
            conn_attempts: 0
        };

        this.motors_state = {};

        this.sensors = {
            outside: {
                temperature: "inital_value",
                humidity: "inital_value"
            },
            sensor_6: {
                temperature: "inital_value",
                humidity: "inital_value"
            },
            sensor_12: {
                temperature: "inital_value",
                humidity: "inital_value"
            },
            sensor_18: {
                temperature: "inital_value",
                humidity: "inital_value"
            },
            sensor_19: {
                temperature: "inital_value",
                humidity: "inital_value"
            },
            sensor_24: {
                temperature: "inital_value",
                humidity: "inital_value"
            },
            sensor_25: {
                temperature: "inital_value",
                humidity: "inital_value"
            },
            sensor_26: {
                temperature: "inital_value",
                humidity: "inital_value"
            }
        };

        this.last_time_record = "initial_value";

        this.all_records_collected = utility.getHeader();

    }

    updateMaxTemp(new_temp){
        var previous_max_out_temp = this.max_temperature_SH;
        this.max_temperature_SH = new_temp;
        var log = "Max temp has been updated from: "+previous_max_out_temp+" to: "+this.max_temperature_SH;
        utility.myConsoleLog("updateMaxTemp",log,0);
        fileManager.saveOnFile("./log","txt",utility.myStringLog("updateMaxTemp",log));
    }
    
    updateMinTemp(new_temp){
        var previous_min_out_temp = this.min_temperature_SH;
        this.min_temperature_SH = new_temp;
        var log = "Min temp has been updated from: "+previous_min_out_temp+" to: "+this.min_temperature_SH;
        utility.myConsoleLog("updateMinTemp",log);
        fileManager.saveOnFile("./log","txt",utility.myStringLog("updateMinTemp",log));
    }

    getStateAsString_no_header(){
        var state_as_string = this.last_time_record;
        state_as_string += settings.csv_separator + this.sensors.outside.temperature;
        state_as_string += settings.csv_separator + this.sensors.outside.humidity;
        state_as_string += settings.csv_separator + this.sensors.sensor_6.temperature;
        state_as_string += settings.csv_separator + this.sensors.sensor_6.humidity;
        state_as_string += settings.csv_separator + this.sensors.sensor_12.temperature;
        state_as_string += settings.csv_separator + this.sensors.sensor_12.humidity;
        state_as_string += settings.csv_separator + this.sensors.sensor_18.temperature;
        state_as_string += settings.csv_separator + this.sensors.sensor_18.humidity;
        state_as_string += settings.csv_separator + this.sensors.sensor_19.temperature;
        state_as_string += settings.csv_separator + this.sensors.sensor_19.humidity;
        state_as_string += settings.csv_separator + this.sensors.sensor_24.temperature;
        state_as_string += settings.csv_separator + this.sensors.sensor_24.humidity;
        state_as_string += settings.csv_separator + this.sensors.sensor_25.temperature;
        state_as_string += settings.csv_separator + this.sensors.sensor_25.humidity;
        state_as_string += settings.csv_separator + this.sensors.sensor_26.temperature;
        state_as_string += settings.csv_separator + this.sensors.sensor_26.humidity;

        state_as_string += settings.csv_separator + this.lamp_state;
        state_as_string += settings.csv_separator + this.fan_state;
        state_as_string += settings.csv_separator + this.ac_state;
        state_as_string += settings.csv_separator + this.heater_state;

        for (var motor in this.motors_state) {
            if (Object.prototype.hasOwnProperty.call(this.motors_state, motor)) {
                state_as_string += settings.csv_separator + this.motors_state[motor];
            }
        }

        return state_as_string;
    }

    getStateAsString_with_header(){
        return (utility.getHeader()+'\n'+this.getStateAsString_no_header());
    }

    updateStateByRecord(record){
        var record = ''+record;
        var record_list = record.split(settings.csv_separator);
        this.last_time_record = record_list[0];
        this.sensors = {
            outside: {
                temperature: record_list[1],
                humidity: record_list[2]
            },
            sensor_6: {
                temperature: record_list[3],
                humidity: record_list[4]
            },
            sensor_12: {
                temperature: record_list[5],
                humidity: record_list[6]
            },
            sensor_18: {
                temperature: record_list[7],
                humidity: record_list[8]
            },
            sensor_19: {
                temperature: record_list[9],
                humidity: record_list[10]
            },
            sensor_24: {
                temperature: record_list[11],
                humidity: record_list[12]
            },
            sensor_25: {
                temperature: record_list[13],
                humidity: record_list[14]
            },
            sensor_26: {
                temperature: record_list[15],
                humidity: record_list[16]
            }
        };


        this.all_records_collected += '\n' + this.getStateAsString_no_header();

        //return this.getStateAsString();

    }

    getAllRecordsCollected(){
        return this.all_records_collected;
    }

    getLastStateAsJsonString(){
        return JSON.stringify({
            time_record: this.last_time_record,
            sensors: this.sensors,
            lamp: this.lamp_state,
            fan: this.fan_state,
            ac: this.ac_state,
            heater: this.heater_state,
            motors: this.motors_state
        });
    }

}

module.exports = houseState;