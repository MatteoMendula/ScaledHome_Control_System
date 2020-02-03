const allowed_commands = 
                        [
                            "close all",
                            "open all",
                            "open all doors",
                            "open all windows",
                            "close all doors",
                            "close all windows",
                            "lamp on",
                            "lamp off",
                            "heater on",
                            "heater off",
                            "fan on",
                            "fan off",
                            "ac on",
                            "ac off",
                            "activate"
                        ];  

const allowed_motors =    [
                            // DOORS
                            0,
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,

                            // WINDOWS
                            8,
                            9,
                            10,
                            11,
                            12,
                            13,
                            14,
                            15
                        ];

const csv_separator = ',';
const new_request_interval = 0; //seconds
const same_temp_limit = 50;

const min_temp_sh = 22;
const max_temp_sh = 29;

// module.exports.allowed_commands = allowed_commands;
// module.exports.allowed_motors = allowed_motors;

module.exports = {
    allowed_commands: allowed_commands,
    allowed_motors: allowed_motors,
    csv_separator: csv_separator,
    new_request_interval: new_request_interval,
    same_temp_limit: same_temp_limit,
    min_temp_sh: min_temp_sh,
    max_temp_sh: max_temp_sh
}

                        