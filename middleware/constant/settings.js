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

module.exports.allowed_commands = allowed_commands;
module.exports.allowed_motors = allowed_motors;

                        